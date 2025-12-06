import { getCollection } from './utils/db.js'
import { hashPassword } from './utils/auth.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { email, otp, newPassword } = JSON.parse(event.body)

    const tokens = await getCollection('tokens')
    const token = await tokens.findOne({
      email,
      otp,
      type: 'password-reset',
      expiresAt: { $gt: new Date() }
    })

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid or expired OTP' })
      }
    }

    const hashedPassword = await hashPassword(newPassword)

    const users = await getCollection('users')
    await users.updateOne({ email }, { $set: { password: hashedPassword } })

    await tokens.deleteMany({ email, type: 'password-reset' })

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password reset successful' })
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to reset password' })
    }
  }
}
