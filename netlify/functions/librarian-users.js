import { getCollection } from './utils/db.js'
import { authenticateRequest } from './utils/auth.js'

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const auth = authenticateRequest(event)
    if (!auth || auth.role !== 'librarian') {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden' })
      }
    }

    const users = await getCollection('users')
    const transactions = await getCollection('transactions')

    const usersList = await users.find({ role: { $ne: 'librarian' } }).toArray()

    const enrichedUsers = await Promise.all(
      usersList.map(async (user) => {
        const activeLoans = await transactions.countDocuments({
          userId: user._id,
          status: 'borrowed'
        })
        
        return {
          ...user,
          password: undefined,
          activeLoans
        }
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ users: enrichedUsers })
    }
  } catch (error) {
    console.error('Users fetch error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch users' })
    }
  }
}
