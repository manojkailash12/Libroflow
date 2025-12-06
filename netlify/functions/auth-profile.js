import { ObjectId } from 'mongodb'
import { getCollection } from './utils/db.js'
import { authenticateRequest } from './utils/auth.js'

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

    const { name, email } = JSON.parse(event.body)

    const users = await getCollection('users')
    
    // Check if email is already taken by another user
    const existingUser = await users.findOne({ 
      email, 
      _id: { $ne: new ObjectId(auth.userId) } 
    })
    
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email already in use' })
      }
    }

    await users.updateOne(
      { _id: new ObjectId(auth.userId) },
      { 
        $set: { 
          name, 
          email,
          updatedAt: new Date() 
        } 
      }
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Profile updated successfully' })
    }
  } catch (error) {
    console.error('Profile update error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update profile' })
    }
  }
}
