import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

async function getLatestOTP() {
  try {
    console.log('Connecting to MongoDB...')
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('libroflow')
    const tokens = db.collection('tokens')

    // Get the latest OTP
    const latestToken = await tokens.findOne(
      { type: 'registration' },
      { sort: { createdAt: -1 } }
    )

    if (latestToken) {
      console.log('\n✅ Latest OTP Found:')
      console.log('==================')
      console.log(`Email: ${latestToken.email}`)
      console.log(`OTP: ${latestToken.otp}`)
      console.log(`Expires: ${latestToken.expiresAt}`)
      console.log(`Created: ${latestToken.createdAt}`)
      console.log('==================\n')
    } else {
      console.log('\n❌ No OTP found in database\n')
    }

    client.close()
  } catch (error) {
    console.error('Error:', error.message)
  }
}

getLatestOTP()
