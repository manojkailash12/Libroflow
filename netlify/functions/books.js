import { getCollection } from './utils/db.js'

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { search, category, limit } = event.queryStringParameters || {}

    const books = await getCollection('books')
    
    let query = {}
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (category) {
      query.category = category
    }

    let cursor = books.find(query)
    
    if (limit) {
      cursor = cursor.limit(parseInt(limit))
    }

    const booksList = await cursor.toArray()

    return {
      statusCode: 200,
      body: JSON.stringify({ books: booksList })
    }
  } catch (error) {
    console.error('Books fetch error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch books' })
    }
  }
}
