import { ObjectId } from 'mongodb'
import { getCollection } from './utils/db.js'
import { authenticateRequest } from './utils/auth.js'

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

    const users = await getCollection('users')
    const user = await users.findOne({ _id: new ObjectId(auth.userId) })

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userId: user.userId,
          studentId: user.studentId,
          userType: user.userType,
          role: user.role
        }
      })
    }
  } catch (error) {
    console.error('Auth error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Authentication failed' })
    }
  }
}
