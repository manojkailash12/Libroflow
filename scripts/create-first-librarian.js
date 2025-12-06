import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import readline from 'readline'

dotenv.config()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('=================================')
console.log('Create First Librarian Account')
console.log('=================================\n')

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

async function createLibrarian() {
  try {
    // Get librarian details
    const name = await askQuestion('Enter librarian name: ')
    const email = await askQuestion('Enter librarian email: ')
    const userId = await askQuestion('Enter staff ID (e.g., LIB001): ')
    const password = await askQuestion('Enter password: ')

    console.log('\nConnecting to MongoDB...')
    
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('libroflow')
    const users = db.collection('users')

    // Check if user already exists
    const existing = await users.findOne({ $or: [{ email }, { userId }] })
    if (existing) {
      console.log('\n❌ User with this email or ID already exists!')
      client.close()
      rl.close()
      return
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create librarian account
    console.log('Creating librarian account...')
    await users.insertOne({
      name,
      email,
      password: hashedPassword,
      userId,
      userType: 'librarian',
      role: 'librarian',
      verified: true,  // Auto-verified
      approved: true,  // Auto-approved
      createdAt: new Date()
    })

    console.log('\n✅ Librarian account created successfully!')
    console.log('\nLogin credentials:')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log('\nYou can now login at: http://localhost:8888/login')

    client.close()
    rl.close()
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    rl.close()
  }
}

createLibrarian()
