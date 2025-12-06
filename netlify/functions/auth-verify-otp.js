import { getCollection } from './utils/db.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { email, otp } = JSON.parse(event.body)

    const tokens = await getCollection('tokens')
    const token = await tokens.findOne({
      email,
      otp,
      type: 'registration',
      expiresAt: { $gt: new Date() }
    })

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid or expired OTP' })
      }
    }

    // Verify the user account
    const users = await getCollection('users')
    await users.updateOne({ email }, { $set: { verified: true } })

    // Delete used OTP
    await tokens.deleteMany({ email, type: 'registration' })

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Account verified successfully!' })
    }
  } catch (error) {
    console.error('OTP verification error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Verification failed' })
    }
  }
}
