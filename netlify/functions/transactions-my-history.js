import { ObjectId } from 'mongodb'
import { getCollection } from './utils/db.js'
import { authenticateRequest } from './utils/auth.js'
import { differenceInDays } from 'date-fns'

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const auth = authenticateRequest(event)
    if (!auth) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' })
      }
    }

    const transactions = await getCollection('transactions')
    const transactionsList = await transactions
      .find({ userId: new ObjectId(auth.userId) })
      .sort({ borrowDate: -1 })
      .toArray()

    const books = await getCollection('books')
    
    const enrichedTransactions = await Promise.all(
      transactionsList.map(async (transaction) => {
        const book = await books.findOne({ _id: transaction.bookId })
        
        let status = transaction.status
        if (status === 'borrowed' && new Date() > new Date(transaction.dueDate)) {
          status = 'overdue'
        }

        return {
          ...transaction,
          book,
          status
        }
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ transactions: enrichedTransactions })
    }
  } catch (error) {
    console.error('History fetch error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch history' })
    }
  }
}
