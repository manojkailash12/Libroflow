import { useState, useEffect } from 'react'
import axios from 'axios'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from /api/librarian-users')
      const { data } = await axios.get('/api/librarian-users')
      console.log('Users fetched:', data.users)
      setUsers(data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      console.error('Error response:', error.response?.data)
      setMessage(error.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId) => {
    try {
      await axios.post('/api/librarian-approve-user', { userId, approved: true })
      setMessage('User approved successfully!')
      fetchUsers()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to approve user')
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
      <h1 className="mb-4">Manage Users</h1>

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
                  <th>Name</th>
                  <th>Email</th>
                  <th>User ID</th>
                  <th>Type</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Approved</th>
                  <th>Joined</th>
                  <th>Active Loans</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.userId || user.studentId}</td>
                    <td>
                      <span className={`badge ${
                        user.userType === 'student' ? 'bg-info' : 
                        user.userType === 'faculty' ? 'bg-success' : 
                        user.userType === 'public' ? 'bg-warning' : 'bg-secondary'
                      }`}>
                        {user.userType || 'student'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'librarian' ? 'bg-primary' : 'bg-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.verified ? (
                        <i className="fas fa-check-circle text-success"></i>
                      ) : (
                        <i className="fas fa-times-circle text-danger"></i>
                      )}
                    </td>
                    <td>
                      {user.role === 'librarian' ? (
                        user.approved ? (
                          <span className="badge bg-success">Approved</span>
                        ) : (
                          <span className="badge bg-warning">Pending</span>
                        )
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{user.activeLoans || 0}</td>
                    <td>
                      {user.role === 'librarian' && !user.approved && (
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => handleApprove(user._id)}
                        >
                          Approve
                        </button>
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

export default ManageUsers
