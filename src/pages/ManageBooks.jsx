import { useState, useEffect } from 'react'
import axios from 'axios'

const ManageBooks = () => {
  const [books, setBooks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    total: 1,
    available: 1,
    imageUrl: ''
  })
  const [scanning, setScanning] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      console.log('Fetching books from /api/librarian-books')
      const { data } = await axios.get('/api/librarian-books')
      console.log('Books fetched:', data.books)
      setBooks(data.books)
    } catch (error) {
      console.error('Error fetching books:', error)
      console.error('Error response:', error.response?.data)
      setMessage(error.response?.data?.message || 'Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      if (editingBook) {
        await axios.put(`/api/librarian-books/${editingBook._id}`, formData)
        setMessage('Book updated successfully!')
      } else {
        await axios.post('/api/librarian-books', formData)
        setMessage('Book added successfully!')
      }
      
      setShowModal(false)
      setEditingBook(null)
      setFormData({ title: '', author: '', isbn: '', category: '', total: 1, available: 1 })
      fetchBooks()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Operation failed')
    }
    
    setTimeout(() => setMessage(''), 3000)
  }

  const handleEdit = (book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      total: book.total,
      available: book.available,
      imageUrl: book.imageUrl || ''
    })
    setImagePreview(book.imageUrl || '')
    setShowModal(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData({ ...formData, imageUrl: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const startBarcodeScanner = async () => {
    setScanning(true)
    setMessage('')
    try {
      // Use HTML5 Barcode Scanner
      const { default: Html5QrcodeScanner } = await import('html5-qrcode')
      
      const scanner = new Html5QrcodeScanner(
        "barcode-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } }
      )
      
      scanner.render((decodedText) => {
        setFormData({ ...formData, isbn: decodedText })
        scanner.clear()
        setScanning(false)
        setMessage('ISBN scanned successfully!')
        setTimeout(() => setMessage(''), 3000)
      }, (error) => {
        console.log(error)
      })
    } catch (error) {
      console.error('Scanner error:', error)
      setMessage('Barcode scanner not available. Please enter ISBN manually.')
      setScanning(false)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const stopBarcodeScanner = () => {
    setScanning(false)
    const scannerElement = document.getElementById('barcode-reader')
    if (scannerElement) {
      scannerElement.innerHTML = ''
    }
  }

  const handleDelete = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return

    try {
      await axios.delete(`/api/librarian-books/${bookId}`)
      setMessage('Book deleted successfully!')
      fetchBooks()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete book')
    }
    
    setTimeout(() => setMessage(''), 3000)
  }

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`/api/librarian-export-books?format=${format}`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `books.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      setMessage('Failed to export books')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Books</h1>
        <div>
          <button className="btn btn-success me-2" onClick={() => handleExport('xlsx')}>
            <i className="fas fa-file-excel me-1"></i>Export Excel
          </button>
          <button className="btn btn-danger me-2" onClick={() => handleExport('pdf')}>
            <i className="fas fa-file-pdf me-1"></i>Export PDF
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus me-1"></i>Add Book
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') || message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Total</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.isbn}</td>
                    <td>{book.category}</td>
                    <td>{book.total}</td>
                    <td>{book.available}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(book)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book._id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingBook ? 'Edit Book' : 'Add Book'}</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowModal(false)
                  setEditingBook(null)
                  setFormData({ title: '', author: '', isbn: '', category: '', total: 1, available: 1, imageUrl: '' })
                  setImagePreview('')
                  setImageFile(null)
                  setScanning(false)
                }}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Book Cover Image (Optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <div className="mt-2 text-center">
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} className="img-thumbnail" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Author</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISBN</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={formData.isbn}
                        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                        placeholder="Enter ISBN or scan barcode"
                        required
                      />
                      {!scanning ? (
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={startBarcodeScanner}
                        >
                          <i className="fas fa-barcode me-1"></i>
                          Scan Barcode
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={stopBarcodeScanner}
                        >
                          <i className="fas fa-times me-1"></i>
                          Cancel
                        </button>
                      )}
                    </div>
                    <small className="text-muted">Enter ISBN manually or use barcode scanner (optional)</small>
                    {scanning && (
                      <div>
                        <div id="barcode-reader" className="mt-3 border rounded p-2"></div>
                        <div className="alert alert-info mt-2 mb-0">
                          <i className="fas fa-info-circle me-2"></i>
                          Point your camera at the barcode. If scanner doesn't work, enter ISBN manually above.
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Science">Science</option>
                      <option value="Technology">Technology</option>
                      <option value="History">History</option>
                      <option value="Biography">Biography</option>
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Total Copies</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.total}
                        onChange={(e) => setFormData({ ...formData, total: parseInt(e.target.value) })}
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Available Copies</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.available}
                        onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) })}
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowModal(false)
                    setEditingBook(null)
                    setFormData({ title: '', author: '', isbn: '', category: '', total: 1, available: 1 })
                  }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingBook ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageBooks
