import { ObjectId } from 'mongodb'
import { getCollection } from './utils/db.js'
import { authenticateRequest } from './utils/auth.js'

export async function handler(event) {
  const auth = authenticateRequest(event)
  if (!auth || auth.role !== 'librarian') {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden' })
    }
  }

  const books = await getCollection('books')

  try {
    if (event.httpMethod === 'GET') {
      const booksList = await books.find().toArray()
      return {
        statusCode: 200,
        body: JSON.stringify({ books: booksList })
      }
    }

    if (event.httpMethod === 'POST') {
      const bookData = JSON.parse(event.body)
      const result = await books.insertOne({
        ...bookData,
        createdAt: new Date()
      })
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Book added successfully', id: result.insertedId })
      }
    }

    if (event.httpMethod === 'PUT') {
      const bookData = JSON.parse(event.body)
      const bookId = event.path.split('/').pop()
      
      await books.updateOne(
        { _id: new ObjectId(bookId) },
        { $set: { ...bookData, updatedAt: new Date() } }
      )
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Book updated successfully' })
      }
    }

    if (event.httpMethod === 'DELETE') {
      const bookId = event.path.split('/').pop()
      await books.deleteOne({ _id: new ObjectId(bookId) })
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Book deleted successfully' })
      }
    }

    return { statusCode: 405, body: 'Method Not Allowed' }
  } catch (error) {
    console.error('Books management error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Operation failed' })
    }
  }
}
