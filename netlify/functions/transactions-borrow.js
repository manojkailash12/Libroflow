import { ObjectId } from 'mongodb'
import { getCollection } from './utils/db.js'
import { authenticateRequest } from './utils/auth.js'
import { sendEmail, getBorrowEmailTemplate, getReceiptEmailTemplate } from './utils/email.js'
import { addDays, format } from 'date-fns'

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

    const { bookId, customDays } = JSON.parse(event.body)

    const books = await getCollection('books')
    const book = await books.findOne({ _id: new ObjectId(bookId) })

    if (!book || book.available <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Book not available' })
      }
    }

    const loanPeriod = customDays || parseInt(process.env.LOAN_PERIOD_DAYS || '14')
    const borrowDate = new Date()
    const dueDate = addDays(borrowDate, loanPeriod)
    const deposit = parseInt(process.env.BOOK_DEPOSIT || '50')
    const finePerDay = parseInt(process.env.FINE_PER_DAY || '10')

    const transactions = await getCollection('transactions')
    const result = await transactions.insertOne({
      userId: new ObjectId(auth.userId),
      bookId: new ObjectId(bookId),
      borrowDate,
      dueDate,
      loanPeriod,
      deposit,
      finePerDay,
      status: 'borrowed',
      fine: 0,
      depositPaid: true,
      createdAt: new Date()
    })
    
    const transactionId = result.insertedId.toString()

    await books.updateOne(
      { _id: new ObjectId(bookId) },
      { $inc: { available: -1 } }
    )

    const users = await getCollection('users')
    const user = await users.findOne({ _id: new ObjectId(auth.userId) })

    // Send confirmation email
    await sendEmail(
      user.email,
      'Book Borrowed Successfully',
      getBorrowEmailTemplate(user.name, book.title, format(dueDate, 'MMM dd, yyyy'), deposit, finePerDay)
    )
    
    // Send receipt email
    await sendEmail(
      user.email,
      'LibroFlow - Book Borrowing Receipt',
      getReceiptEmailTemplate(
        user.name,
        book.title,
        format(borrowDate, 'MMM dd, yyyy'),
        format(dueDate, 'MMM dd, yyyy'),
        transactionId,
        deposit,
        finePerDay,
        loanPeriod
      )
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Book borrowed successfully' })
    }
  } catch (error) {
    console.error('Borrow error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to borrow book' })
    }
  }
}
