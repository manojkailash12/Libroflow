import { MongoClient } from 'mongodb'
import { config } from 'dotenv'

config()

async function checkLibrarian() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB\n')
    
    const db = client.db('libroflow')
    const users = db.collection('users')
    
    const librarians = await users.find({ role: 'librarian' }).toArray()
    
    if (librarians.length === 0) {
      console.log('❌ No librarian accounts found!')
      console.log('Run: npm run create-librarian')
    } else {
      console.log(`✓ Found ${librarians.length} librarian account(s):\n`)
      librarians.forEach((lib, index) => {
        console.log(`${index + 1}. Name: ${lib.name}`)
        console.log(`   Email: ${lib.email}`)
        console.log(`   User ID: ${lib.userId}`)
        console.log(`   Verified: ${lib.verified}`)
        console.log(`   Approved: ${lib.approved}`)
        console.log('')
      })
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await client.close()
    process.exit(0)
  }
}

checkLibrarian()
