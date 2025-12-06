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
    const booksList = await books.find().toArray()

    if (format === 'xlsx') {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Books')

      worksheet.columns = [
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Author', key: 'author', width: 25 },
        { header: 'ISBN', key: 'isbn', width: 15 },
        { header: 'Category', key: 'category', width: 15 },
        { header: 'Total', key: 'total', width: 10 },
        { header: 'Available', key: 'available', width: 10 }
      ]

      booksList.forEach(book => {
        worksheet.addRow({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category: book.category,
          total: book.total,
          available: book.available
        })
      })

      const buffer = await workbook.xlsx.writeBuffer()

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=books.xlsx'
        },
        body: buffer.toString('base64'),
        isBase64Encoded: true
      }
    } else if (format === 'pdf') {
      // Generate book list content
      let yPos = 720
      let bookContent = ''
      booksList.slice(0, 20).forEach((book, index) => {
        bookContent += `(${index + 1}. ${book.title} by ${book.author}) Tj\n0 -15 Td\n`
        yPos -= 15
      })

      const pdfContent = `%PDF-1.4
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
<< /Length ${400 + bookContent.length} >>
stream
BT
/F1 18 Tf
50 750 Td
(LibroFlow - Books Report) Tj
0 -30 Td
/F1 10 Tf
${bookContent}
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
${700 + bookContent.length}
%%EOF`

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=books.pdf'
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
