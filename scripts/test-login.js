import 'dotenv/config'
import { getCollection } from '../netlify/functions/utils/db.js'
import { comparePassword } from '../netlify/functions/utils/auth.js'

async function testLogin() {
  try {
    console.log('Testing login functionality...\n')
    
    const email = 'libroflow8@gmail.com'
    const password = 'admin123' // Default password
    
    console.log(`Attempting to login with: ${email}`)
    
    const users = await getCollection('users')
    const user = await users.findOne({ email })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    console.log('✓ User found')
    console.log(`  Name: ${user.name}`)
    console.log(`  Role: ${user.role}`)
    console.log(`  Verified: ${user.verified}`)
    console.log(`  Approved: ${user.approved}`)
    console.log(`  Password hash: ${user.password.substring(0, 20)}...`)
    
    console.log('\nTesting password comparison...')
    const isValidPassword = await comparePassword(password, user.password)
    
    if (isValidPassword) {
      console.log('✓ Password is correct')
    } else {
      console.log('❌ Password is incorrect')
      console.log('\nTrying to hash the password to see what it should be:')
      const bcrypt = await import('bcryptjs')
      const newHash = await bcrypt.hash(password, 10)
      console.log(`New hash: ${newHash}`)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

testLogin()
