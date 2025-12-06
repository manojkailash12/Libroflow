import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config()

const MONGODB_URI = process.env.MONGODB_URI

async function addSampleBooks() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('libroflow')
    const books = db.collection('books')
    
    // Read sample data
    const sampleData = JSON.parse(
      readFileSync(join(__dirname, 'sample-data.json'), 'utf-8')
    )
    
    // Check if books already exist
    const existingCount = await books.countDocuments()
    
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} books.`)
      const answer = await new Promise((resolve) => {
        process.stdout.write('Do you want to add more books anyway? (y/n): ')
        process.stdin.once('data', (data) => {
          resolve(data.toString().trim().toLowerCase())
        })
      })
      
      if (answer !== 'y') {
        console.log('Cancelled.')
        return
      }
    }
    
    // Add createdAt to each book
    const booksToInsert = sampleData.books.map(book => ({
      ...book,
      createdAt: new Date()
    }))
    
    const result = await books.insertMany(booksToInsert)
    console.log(`✓ Successfully added ${result.insertedCount} books to the database!`)
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await client.close()
    process.exit(0)
  }
}

addSampleBooks()
