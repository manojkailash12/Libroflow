import { useState, useEffect } from 'react'
import axios from 'axios'

const LibrarianDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, transactionsRes] = await Promise.all([
        axios.get('/api/librarian-stats'),
        axios.get('/api/librarian-recent-transactions')
      ])
      setStats(statsRes.data)
      setRecentTransactions(transactionsRes.data.transactions)
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
      <h1 className="mb-4">Librarian Dashboard</h1>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Books</h6>
                  <h3 className="mb-0">{stats?.totalBooks || 0}</h3>
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
                  <h6 className="text-muted mb-1">Total Users</h6>
                  <h3 className="mb-0">{stats?.totalUsers || 0}</h3>
                </div>
                <i className="fas fa-users fa-2x text-info"></i>
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
                  <h3 className="mb-0">{stats?.activeTransactions || 0}</h3>
                </div>
                <i className="fas fa-exchange-alt fa-2x text-warning"></i>
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
                  <h3 className="mb-0">₹{stats?.totalFines || 0}</h3>
                </div>
                <i className="fas fa-rupee-sign fa-2x text-success"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Recent Transactions</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Action</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(transaction => (
                  <tr key={transaction._id}>
                    <td>{transaction.user?.name}</td>
                    <td>{transaction.book?.title}</td>
                    <td>
                      <span className={`badge ${transaction.status === 'returned' ? 'bg-success' : 'bg-primary'}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>{new Date(transaction.borrowDate).toLocaleDateString()}</td>
                    <td>
                      {transaction.fine > 0 && (
                        <span className="badge bg-danger">₹{transaction.fine} fine</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LibrarianDashboard
