import { ObjectId } from 'mongodb'
import { getCollection } from './utils/db.js'
import { authenticateRequest } from './utils/auth.js'
import { sendEmail } from './utils/email.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
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

    const { userId, approved } = JSON.parse(event.body)

    const users = await getCollection('users')
    const user = await users.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      }
    }

    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { approved: approved } }
    )

    // Send email notification
    if (approved) {
      await sendEmail(
        user.email,
        'LibroFlow Account Approved',
        `
        <h2>Hello ${user.name},</h2>
        <p>Your librarian account has been approved!</p>
        <p>You can now login and access all librarian features.</p>
        <p>Visit: ${process.env.APP_URL}/login</p>
        `
      )
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: approved ? 'User approved successfully' : 'User approval revoked'
      })
    }
  } catch (error) {
    console.error('Approve user error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to approve user' })
    }
  }
}
