import { ObjectId } from 'mongodb'
import { getCollection } from './utils/db.js'
import { authenticateRequest } from './utils/auth.js'

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const auth = authenticateRequest(event)
    if (!auth) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' })
      }
    }

    const transactions = await getCollection('transactions')
    
    const borrowed = await transactions.countDocuments({
      userId: new ObjectId(auth.userId)
    })

    const active = await transactions.countDocuments({
      userId: new ObjectId(auth.userId),
      status: 'borrowed'
    })

    const overdue = await transactions.countDocuments({
      userId: new ObjectId(auth.userId),
      status: 'borrowed',
      dueDate: { $lt: new Date() }
    })

    const finesResult = await transactions.aggregate([
      { $match: { userId: new ObjectId(auth.userId) } },
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]).toArray()

    const fines = finesResult.length > 0 ? finesResult[0].total : 0

    return {
      statusCode: 200,
      body: JSON.stringify({ borrowed, active, overdue, fines })
    }
  } catch (error) {
    console.error('Stats fetch error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch stats' })
    }
  }
}
