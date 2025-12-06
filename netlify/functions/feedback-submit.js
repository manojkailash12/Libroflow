import { ObjectId } from 'mongodb'
import { getCollection } from './utils/db.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { transactionId, rating, bookCondition, serviceRating, comments } = JSON.parse(event.body)

    const feedback = await getCollection('feedback')
    
    await feedback.insertOne({
      transactionId: transactionId ? new ObjectId(transactionId) : null,
      rating: parseInt(rating),
      bookCondition,
      serviceRating: parseInt(serviceRating),
      comments,
      createdAt: new Date()
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Feedback submitted successfully' })
    }
  } catch (error) {
    console.error('Feedback submission error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to submit feedback' })
    }
  }
}
