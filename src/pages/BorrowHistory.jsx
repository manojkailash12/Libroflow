import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

const BorrowHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get('/api/transactions-my-history')
      setTransactions(data.transactions)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (transactionId) => {
    try {
      await axios.post('/api/transactions-return', { transactionId })
      setMessage('Book returned successfully!')
      fetchTransactions()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to return book')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const getStatusBadge = (transaction) => {
    if (transaction.status === 'returned') return 'bg-success'
    if (transaction.status === 'overdue') return 'bg-danger'
    return 'bg-warning'
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
      <h1 className="mb-4">Borrowing History</h1>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrowed Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Fine</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction._id}>
                    <td>
                      <strong>{transaction.book?.title}</strong>
                      <br />
                      <small className="text-muted">{transaction.book?.author}</small>
                    </td>
                    <td>{format(new Date(transaction.borrowDate), 'MMM dd, yyyy')}</td>
                    <td>{format(new Date(transaction.dueDate), 'MMM dd, yyyy')}</td>
                    <td>
                      {transaction.returnDate 
                        ? format(new Date(transaction.returnDate), 'MMM dd, yyyy')
                        : '-'
                      }
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(transaction)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>₹{transaction.fine || 0}</td>
                    <td>
                      {transaction.status === 'borrowed' && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleReturn(transaction._id)}
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-history fa-3x text-muted mb-3"></i>
              <p className="text-muted">No borrowing history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BorrowHistory
