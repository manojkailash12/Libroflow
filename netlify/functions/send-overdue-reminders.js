import { getCollection } from './utils/db.js'
import { sendEmail, getOverdueReminderTemplate } from './utils/email.js'
import { differenceInDays, format } from 'date-fns'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const transactions = await getCollection('transactions')
    const users = await getCollection('users')
    const books = await getCollection('books')

    // Find all overdue transactions
    const overdueTransactions = await transactions.find({
      status: 'borrowed',
      dueDate: { $lt: new Date() }
    }).toArray()

    let emailsSent = 0
    const errors = []

    for (const transaction of overdueTransactions) {
      try {
        const user = await users.findOne({ _id: transaction.userId })
        const book = await books.findOne({ _id: transaction.bookId })

        if (!user || !book) continue

        const daysOverdue = differenceInDays(new Date(), new Date(transaction.dueDate))
        const finePerDay = transaction.finePerDay || parseInt(process.env.FINE_PER_DAY || '10')
        const fine = daysOverdue * finePerDay
        const deposit = transaction.deposit || parseInt(process.env.BOOK_DEPOSIT || '50')

        // Send reminder email
        await sendEmail(
          user.email,
          '⚠️ Overdue Book Reminder - LibroFlow',
          getOverdueReminderTemplate(
            user.name,
            book.title,
            daysOverdue,
            fine,
            format(new Date(transaction.dueDate), 'MMM dd, yyyy'),
            finePerDay,
            deposit
          )
        )

        emailsSent++
      } catch (error) {
        errors.push({
          transactionId: transaction._id.toString(),
          error: error.message
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Overdue reminders sent',
        emailsSent,
        totalOverdue: overdueTransactions.length,
        errors: errors.length > 0 ? errors : undefined
      })
    }
  } catch (error) {
    console.error('Send reminders error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send reminders' })
    }
  }
}
