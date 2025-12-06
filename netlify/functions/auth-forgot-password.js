import { getCollection } from './utils/db.js'
import { generateOTP } from './utils/auth.js'
import { sendEmail, getOTPEmailTemplate } from './utils/email.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { email } = JSON.parse(event.body)

    const users = await getCollection('users')
    const user = await users.findOne({ email })

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      }
    }

    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const tokens = await getCollection('tokens')
    await tokens.insertOne({
      email,
      otp,
      type: 'password-reset',
      expiresAt: otpExpiry,
      createdAt: new Date()
    })

    await sendEmail(email, 'Password Reset OTP', getOTPEmailTemplate(user.name, otp, 'password-reset'))

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'OTP sent to your email' })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send OTP' })
    }
  }
}
