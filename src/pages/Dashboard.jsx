import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentBooks, setRecentBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, booksRes] = await Promise.all([
        axios.get('/api/dashboard-stats'),
        axios.get('/api/books?limit=6')
      ])
      setStats(statsRes.data)
      setRecentBooks(booksRes.data.books)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
      <h1 className="mb-4">Dashboard</h1>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Books Borrowed</h6>
                  <h3 className="mb-0">{stats?.borrowed || 0}</h3>
                </div>
                <i className="fas fa-book fa-2x text-primary"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Active Loans</h6>
                  <h3 className="mb-0">{stats?.active || 0}</h3>
                </div>
                <i className="fas fa-clock fa-2x text-warning"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Overdue</h6>
                  <h3 className="mb-0">{stats?.overdue || 0}</h3>
                </div>
                <i className="fas fa-exclamation-triangle fa-2x text-danger"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Fines</h6>
                  <h3 className="mb-0">₹{stats?.fines || 0}</h3>
                </div>
                <i className="fas fa-rupee-sign fa-2x text-success"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Available Books</h5>
          <Link to="/books" className="btn btn-sm btn-primary">View All</Link>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {recentBooks.map(book => (
              <div key={book._id} className="col-md-4">
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
                    <p className="card-text text-muted small mb-2">{book.author}</p>
                    <span className={`badge ${book.available > 0 ? 'badge-available' : 'badge-unavailable'}`}>
                      {book.available > 0 ? `${book.available} Available` : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
