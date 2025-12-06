import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'
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
    const type = event.path.split('/').pop().split('?')[0]

    if (type === 'books') {
      return await exportBooks(format)
    } else if (type === 'analytics') {
      return await exportAnalytics(format)
    } else if (type === 'fines') {
      return await exportFines(format)
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid export type' })
    }
  } catch (error) {
    console.error('Export error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Export failed' })
    }
  }
}

async function exportBooks(format) {
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
    const doc = new PDFDocument()
    const chunks = []

    doc.on('data', chunk => chunks.push(chunk))
    
    return new Promise((resolve) => {
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=books.pdf'
          },
          body: buffer.toString('base64'),
          isBase64Encoded: true
        })
      })

      doc.fontSize(20).text('LibroFlow - Books Report', { align: 'center' })
      doc.moveDown()
      doc.fontSize(12)

      booksList.forEach(book => {
        doc.text(`Title: ${book.title}`)
        doc.text(`Author: ${book.author}`)
        doc.text(`ISBN: ${book.isbn}`)
        doc.text(`Category: ${book.category}`)
        doc.text(`Total: ${book.total} | Available: ${book.available}`)
        doc.moveDown()
      })

      doc.end()
    })
  }
}

async function exportAnalytics(format) {
  const books = await getCollection('books')
  const users = await getCollection('users')
  const transactions = await getCollection('transactions')

  const totalBooks = await books.countDocuments()
  const totalUsers = await users.countDocuments({ role: 'student' })
  const activeTransactions = await transactions.countDocuments({ status: 'borrowed' })

  if (format === 'xlsx') {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Analytics')

    worksheet.addRow(['Metric', 'Value'])
    worksheet.addRow(['Total Books', totalBooks])
    worksheet.addRow(['Total Users', totalUsers])
    worksheet.addRow(['Active Transactions', activeTransactions])

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
    const doc = new PDFDocument()
    const chunks = []

    doc.on('data', chunk => chunks.push(chunk))
    
    return new Promise((resolve) => {
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=analytics.pdf'
          },
          body: buffer.toString('base64'),
          isBase64Encoded: true
        })
      })

      doc.fontSize(20).text('LibroFlow - Analytics Report', { align: 'center' })
      doc.moveDown()
      doc.fontSize(14)
      doc.text(`Total Books: ${totalBooks}`)
      doc.text(`Total Users: ${totalUsers}`)
      doc.text(`Active Transactions: ${activeTransactions}`)

      doc.end()
    })
  }
}

async function exportFines(format) {
  const transactions = await getCollection('transactions')
  const fineTransactions = await transactions.find({ fine: { $gt: 0 } }).toArray()

  if (format === 'xlsx') {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Fines')

    worksheet.columns = [
      { header: 'User ID', key: 'userId', width: 25 },
      { header: 'Book ID', key: 'bookId', width: 25 },
      { header: 'Fine Amount', key: 'fine', width: 15 },
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
  }
}
