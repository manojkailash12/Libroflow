import { ObjectId } from 'mongodb'
import { getCollection } from './utils/db.js'
import { authenticateRequest } from './utils/auth.js'
import { sendEmail, getReturnEmailTemplate } from './utils/email.js'
import { differenceInDays } from 'date-fns'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
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

    const { transactionId } = JSON.parse(event.body)

    const transactions = await getCollection('transactions')
    const transaction = await transactions.findOne({
      _id: new ObjectId(transactionId),
      userId: new ObjectId(auth.userId),
      status: 'borrowed'
    })

    if (!transaction) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Transaction not found' })
      }
    }

    const returnDate = new Date()
    const daysLate = differenceInDays(returnDate, new Date(transaction.dueDate))
    const finePerDay = transaction.finePerDay || parseInt(process.env.FINE_PER_DAY || '10')
    const fine = daysLate > 0 ? daysLate * finePerDay : 0
    const deposit = transaction.deposit || parseInt(process.env.BOOK_DEPOSIT || '50')
    const depositRefund = Math.max(0, deposit - fine)

    await transactions.updateOne(
      { _id: new ObjectId(transactionId) },
      {
        $set: {
          returnDate,
          status: 'returned',
          fine,
          depositRefund
        }
      }
    )

    const books = await getCollection('books')
    await books.updateOne(
      { _id: transaction.bookId },
      { $inc: { available: 1 } }
    )

    const users = await getCollection('users')
    const user = await users.findOne({ _id: new ObjectId(auth.userId) })
    const book = await books.findOne({ _id: transaction.bookId })
    const feedbackUrl = process.env.FEEDBACK_URL || `${process.env.APP_URL}/feedback?transaction=${transactionId}`

    await sendEmail(
      user.email,
      'Book Returned Successfully - Feedback Requested',
      getReturnEmailTemplate(user.name, book.title, fine, deposit, depositRefund, feedbackUrl)
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Book returned successfully', 
        fine,
        deposit,
        depositRefund,
        additionalPayment: fine > deposit ? fine - deposit : 0
      })
    }
  } catch (error) {
    console.error('Return error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to return book' })
    }
  }
}
