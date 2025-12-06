import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout, isLibrarian } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-book-reader me-2"></i>
          LibroFlow
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          {user ? (
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    <i className="fas fa-home me-1"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/books">
                    <i className="fas fa-book me-1"></i>Books
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/history">
                    <i className="fas fa-history me-1"></i>History
                  </Link>
                </li>
                
                {isLibrarian && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/librarian/dashboard">
                        <i className="fas fa-chart-line me-1"></i>Lib Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/librarian/books">
                        <i className="fas fa-book-medical me-1"></i>Manage Books
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/librarian/users">
                        <i className="fas fa-users-cog me-1"></i>Manage Users
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/librarian/analytics">
                        <i className="fas fa-analytics me-1"></i>Analytics
                      </Link>
                    </li>
                  </>
                )}
              </ul>
              
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    <i className="fas fa-user-circle me-1"></i>{user.name}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-1"></i>Logout
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
