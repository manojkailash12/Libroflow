import { useState, useEffect } from 'react'
import axios from 'axios'

const Books = () => {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [search, category])

  const fetchBooks = async () => {
    try {
      const params = {}
      if (search) params.search = search
      if (category) params.category = category
      
      const { data } = await axios.get('/api/books', { params })
      setBooks(data.books)
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBorrow = async (bookId) => {
    try {
      await axios.post('/api/transactions-borrow', { bookId })
      setMessage('Book borrowed successfully! Check your email for confirmation.')
      fetchBooks()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to borrow book')
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
      <h1 className="mb-4">Browse Books</h1>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title, author, ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="History">History</option>
                <option value="Biography">Biography</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-secondary w-100" onClick={() => { setSearch(''); setCategory('') }}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {books.map(book => (
          <div key={book._id} className="col-md-4 col-lg-3">
            <div className="card book-card h-100">
              {book.imageUrl ? (
                <img src={book.imageUrl} className="card-img-top" alt={book.title} style={{ height: '200px', objectFit: 'cover' }} />
              ) : (
                <div className="book-cover d-flex align-items-center justify-content-center text-white">
                  <i className="fas fa-book fa-4x"></i>
                </div>
              )}
              <div className="card-body">
                <h6 className="card-title">{book.title}</h6>
                <p className="card-text text-muted small mb-1">By {book.author}</p>
                <p className="card-text text-muted small mb-2">
                  <i className="fas fa-tag me-1"></i>{book.category}
                </p>
                <p className="card-text text-muted small mb-2">ISBN: {book.isbn}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className={`badge ${book.available > 0 ? 'badge-available' : 'badge-unavailable'}`}>
                    {book.available > 0 ? `${book.available} Available` : 'Unavailable'}
                  </span>
                  {book.available > 0 && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleBorrow(book._id)}
                    >
                      Borrow
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
          <p className="text-muted">No books found</p>
        </div>
      )}
    </div>
  )
}

export default Books
