import { getCollection } from './utils/db.js'
import { hashPassword, generateOTP } from './utils/auth.js'
import { sendEmail, getOTPEmailTemplate } from './utils/email.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { name, email, password, userId, userType } = JSON.parse(event.body)

    const users = await getCollection('users')
    
    const existingUser = await users.findOne({ $or: [{ email }, { userId }] })
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'User already exists' })
      }
    }

    const hashedPassword = await hashPassword(password)
    
    // Determine role based on userType
    const role = userType === 'librarian' ? 'librarian' : 'member'
    
    // Check if this is the first librarian (auto-approve first one)
    const librarianCount = await users.countDocuments({ role: 'librarian' })
    const isFirstLibrarian = userType === 'librarian' && librarianCount === 0
    
    const newUser = {
      name,
      email,
      password: hashedPassword,
      userId,
      userType: userType || 'student',
      role: role,
      verified: false,
      approved: isFirstLibrarian ? true : (userType === 'librarian' ? false : true),
      createdAt: new Date()
    }

    await users.insertOne(newUser)
    
    // Generate and store OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const tokens = await getCollection('tokens')
    await tokens.insertOne({
      email,
      otp,
      type: 'registration',
      expiresAt: otpExpiry,
      createdAt: new Date()
    })

    // Send OTP email
    await sendEmail(email, 'Verify Your LibroFlow Account', getOTPEmailTemplate(name, otp, 'registration'))

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Registration successful! Please check your email for OTP.' })
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Registration failed', 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    }
  }
}
