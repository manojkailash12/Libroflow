import { getCollection } from './utils/db.js'
import { comparePassword, generateToken } from './utils/auth.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { email, password } = JSON.parse(event.body)

    const users = await getCollection('users')
    const user = await users.findOne({ email })

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' })
      }
    }

    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' })
      }
    }

    if (!user.verified) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Please verify your email first' })
      }
    }

    if (user.role === 'librarian' && user.approved === false) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Your librarian account is pending approval' })
      }
    }

    const token = generateToken(user._id.toString(), user.role)

    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
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
    console.error('Login error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Login failed' })
    }
  }
}
