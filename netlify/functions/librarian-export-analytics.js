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

    const { format } = event.queryStringParameters || {}
    const books = await getCollection('books')
    const users = await getCollection('users')
    const transactions = await getCollection('transactions')

    const totalBooks = await books.countDocuments()
    const totalUsers = await users.countDocuments({ role: { $ne: 'librarian' } })
    const activeTransactions = await transactions.countDocuments({ status: 'borrowed' })

    const finesResult = await transactions.aggregate([
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]).toArray()

    const totalFines = finesResult.length > 0 ? finesResult[0].total : 0

    if (format === 'xlsx') {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Analytics')

      worksheet.addRow(['Metric', 'Value'])
      worksheet.addRow(['Total Books', totalBooks])
      worksheet.addRow(['Total Users', totalUsers])
      worksheet.addRow(['Active Transactions', activeTransactions])
      worksheet.addRow(['Total Fines (₹)', totalFines])

      const buffer = await workbook.xlsx.writeBuffer()

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=analytics.xlsx'
        },
        body: buffer.toString('base64'),
        isBase64Encoded: true
      }
    } else if (format === 'pdf') {
      // Generate simple PDF using HTML-like structure
      const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>
endobj
5 0 obj
<< /Length 300 >>
stream
BT
/F1 18 Tf
50 750 Td
(LibroFlow - Analytics Report) Tj
0 -30 Td
/F1 12 Tf
(Total Books: ${totalBooks}) Tj
0 -20 Td
(Total Users: ${totalUsers}) Tj
0 -20 Td
(Active Transactions: ${activeTransactions}) Tj
0 -20 Td
(Total Fines: Rs.${totalFines}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
0000000304 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
654
%%EOF`

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=analytics.pdf'
        },
        body: Buffer.from(pdfContent).toString('base64'),
        isBase64Encoded: true
      }
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid format' })
    }
  } catch (error) {
    console.error('Export error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Export failed' })
    }
  }
}
