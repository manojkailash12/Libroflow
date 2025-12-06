import { ObjectId } from 'mongodb'
import { getCollection } from './utils/db.js'
import { authenticateRequest, comparePassword, hashPassword } from './utils/auth.js'

export async function handler(event) {
  if (event.httpMethod !== 'PUT') {
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

    const { currentPassword, newPassword } = JSON.parse(event.body)

    const users = await getCollection('users')
    const user = await users.findOne({ _id: new ObjectId(auth.userId) })

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      }
    }

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password)
    if (!isValidPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Current password is incorrect' })
      }
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password
    await users.updateOne(
      { _id: new ObjectId(auth.userId) },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date() 
        } 
      }
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password changed successfully' })
    }
  } catch (error) {
    console.error('Password change error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to change password' })
    }
  }
}
