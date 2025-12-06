import { getCollection } from './utils/db.js'
import { authenticateRequest } from './utils/auth.js'
import { differenceInDays } from 'date-fns'

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const auth = authenticateRequest(event)
    if (!auth || auth.role !== 'librarian') {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden' })
      }
    }

    const books = await getCollection('books')
    const transactions = await getCollection('transactions')
    const users = await getCollection('users')

    // Popular books
    const popularBooksData = await transactions.aggregate([
      { $group: { _id: '$bookId', borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      { $limit: 10 }
    ]).toArray()

    const popularBooks = await Promise.all(
      popularBooksData.map(async (item) => {
        const book = await books.findOne({ _id: item._id })
        return {
          title: book?.title,
          author: book?.author,
          borrowCount: item.borrowCount
        }
      })
    )

    // Category distribution
    const categoryData = await books.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]).toArray()

    const totalBooks = await books.countDocuments()
    const categoryDistribution = categoryData.map(cat => ({
      category: cat._id,
      count: cat.count,
      percentage: Math.round((cat.count / totalBooks) * 100)
    }))

    // Overdue books
    const overdueTransactions = await transactions
      .find({
        status: 'borrowed',
        dueDate: { $lt: new Date() }
      })
      .toArray()

    const overdueBooks = await Promise.all(
      overdueTransactions.map(async (transaction) => {
        const user = await users.findOne({ _id: transaction.userId })
        const book = await books.findOne({ _id: transaction.bookId })
        const daysOverdue = differenceInDays(new Date(), new Date(transaction.dueDate))
        const fine = daysOverdue * parseInt(process.env.FINE_PER_DAY || '1')

        return {
          userName: user?.name,
          bookTitle: book?.title,
          daysOverdue,
          fine
        }
      })
    )

    // Fines
    const finesData = await transactions.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: '$fine' }
        }
      }
    ]).toArray()

    const totalFinesCollected = finesData.find(f => f._id === 'returned')?.total || 0
    const pendingFines = overdueBooks.reduce((sum, item) => sum + item.fine, 0)

    return {
      statusCode: 200,
      body: JSON.stringify({
        popularBooks,
        categoryDistribution,
        overdueBooks,
        totalFinesCollected,
        pendingFines
      })
    }
  } catch (error) {
    console.error('Analytics error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch analytics' })
    }
  }
}
