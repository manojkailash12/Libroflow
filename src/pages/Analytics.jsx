import { useState, useEffect } from 'react'
import axios from 'axios'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/librarian-analytics')
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type, format) => {
    try {
      const response = await axios.get(`/api/librarian-export-${type}?format=${format}`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${type}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Export failed:', error)
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
        <h1>Analytics & Reports</h1>
        <div>
          <button className="btn btn-success me-2" onClick={() => handleExport('analytics', 'xlsx')}>
            <i className="fas fa-file-excel me-1"></i>Export Excel
          </button>
          <button className="btn btn-danger" onClick={() => handleExport('analytics', 'pdf')}>
            <i className="fas fa-file-pdf me-1"></i>Export PDF
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Popular Books</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Author</th>
                      <th>Borrows</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.popularBooks?.map((book, index) => (
                      <tr key={index}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>
                          <span className="badge bg-primary">{book.borrowCount}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Category Distribution</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Books</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.categoryDistribution?.map((cat, index) => (
                      <tr key={index}>
                        <td>{cat.category}</td>
                        <td>{cat.count}</td>
                        <td>
                          <div className="progress" style={{ height: '20px' }}>
                            <div
                              className="progress-bar"
                              style={{ width: `${cat.percentage}%` }}
                            >
                              {cat.percentage}%
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Overdue Books</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Book</th>
                      <th>Days Overdue</th>
                      <th>Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.overdueBooks?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.userName}</td>
                        <td>{item.bookTitle}</td>
                        <td>
                          <span className="badge bg-danger">{item.daysOverdue}</span>
                        </td>
                        <td>₹{item.fine}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Fine Summary</h5>
              <button className="btn btn-sm btn-success" onClick={() => handleExport('fines', 'xlsx')}>
                Export
              </button>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span>Total Fines Collected:</span>
                <strong className="text-success">₹{analytics?.totalFinesCollected || 0}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Pending Fines:</span>
                <strong className="text-warning">₹{analytics?.pendingFines || 0}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total:</span>
                <strong className="text-primary">
                  ₹{(analytics?.totalFinesCollected || 0) + (analytics?.pendingFines || 0)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
