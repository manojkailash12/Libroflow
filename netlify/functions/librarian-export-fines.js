import ExcelJS from 'exceljs'
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

    const transactions = await getCollection('transactions')
    const fineTransactions = await transactions.find({ fine: { $gt: 0 } }).toArray()

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Fines')

    worksheet.columns = [
      { header: 'User ID', key: 'userId', width: 25 },
      { header: 'Book ID', key: 'bookId', width: 25 },
      { header: 'Fine Amount (₹)', key: 'fine', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ]

    fineTransactions.forEach(transaction => {
      worksheet.addRow({
        userId: transaction.userId.toString(),
        bookId: transaction.bookId.toString(),
        fine: transaction.fine,
        status: transaction.status
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=fines.xlsx'
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    }
  } catch (error) {
    console.error('Export error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Export failed' })
    }
  }
}
