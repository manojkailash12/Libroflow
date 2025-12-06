import { MongoClient } from 'mongodb'

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    // Check if connection is still alive
    try {
      await cachedClient.db().admin().ping()
      return { client: cachedClient, db: cachedDb }
    } catch (error) {
      // Connection lost, reset cache
      cachedClient = null
      cachedDb = null
    }
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })

  const db = client.db('libroflow')

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getCollection(collectionName) {
  const { db } = await connectToDatabase()
  return db.collection(collectionName)
}
