import { getCollection } from './utils/db.js'
import { sendEmail, getDueDateReminderTemplate } from './utils/email.js'
import { differenceInDays, format, addDays } from 'date-fns'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const transactions = await getCollection('transactions')
    const users = await getCollection('users')
    const books = await getCollection('books')

    // Find transactions due in 2 days
    const twoDaysFromNow = addDays(new Date(), 2)
    const threeDaysFromNow = addDays(new Date(), 3)

    const upcomingDue = await transactions.find({
      status: 'borrowed',
      dueDate: {
        $gte: twoDaysFromNow,
        $lt: threeDaysFromNow
      }
    }).toArray()

    let emailsSent = 0
    const errors = []

    for (const transaction of upcomingDue) {
      try {
        const user = await users.findOne({ _id: transaction.userId })
        const book = await books.findOne({ _id: transaction.bookId })

        if (!user || !book) continue

        const daysLeft = differenceInDays(new Date(transaction.dueDate), new Date())
        const finePerDay = transaction.finePerDay || parseInt(process.env.FINE_PER_DAY || '10')

        // Send reminder email
        await sendEmail(
          user.email,
          '📅 Book Due Date Reminder - LibroFlow',
          getDueDateReminderTemplate(
            user.name,
            book.title,
            format(new Date(transaction.dueDate), 'MMM dd, yyyy'),
            daysLeft,
            finePerDay
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
        message: 'Due date reminders sent',
        emailsSent,
        totalUpcoming: upcomingDue.length,
        errors: errors.length > 0 ? errors : undefined
      })
    }
  } catch (error) {
    console.error('Send due date reminders error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send reminders' })
    }
  }
}
