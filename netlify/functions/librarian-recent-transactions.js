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

    const transactions = await getCollection('transactions')
    const transactionsList = await transactions
      .find()
      .sort({ borrowDate: -1 })
      .limit(10)
      .toArray()

    const users = await getCollection('users')
    const books = await getCollection('books')

    const enrichedTransactions = await Promise.all(
      transactionsList.map(async (transaction) => {
        const user = await users.findOne({ _id: transaction.userId })
        const book = await books.findOne({ _id: transaction.bookId })
        return { ...transaction, user, book }
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ transactions: enrichedTransactions })
    }
  } catch (error) {
    console.error('Transactions error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch transactions' })
    }
  }
}
