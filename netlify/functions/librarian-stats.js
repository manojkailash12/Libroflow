import { getCollection } from './utils/db.js'
import { authenticateRequest } from './utils/auth.js'

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
    const users = await getCollection('users')
    const transactions = await getCollection('transactions')

    const totalBooks = await books.countDocuments()
    const totalUsers = await users.countDocuments({ role: { $ne: 'librarian' } })
    const activeTransactions = await transactions.countDocuments({ status: 'borrowed' })

    const finesResult = await transactions.aggregate([
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]).toArray()

    const totalFines = finesResult.length > 0 ? finesResult[0].total : 0

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalBooks,
        totalUsers,
        activeTransactions,
        totalFines
      })
    }
  } catch (error) {
    console.error('Stats error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch stats' })
    }
  }
}
