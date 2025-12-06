import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Feedback from './pages/Feedback'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import BorrowHistory from './pages/BorrowHistory'
import Profile from './pages/Profile'
import LibrarianDashboard from './pages/LibrarianDashboard'
import ManageBooks from './pages/ManageBooks'
import ManageUsers from './pages/ManageUsers'
import Analytics from './pages/Analytics'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-vh-100 bg-light">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/feedback" element={<Feedback />} />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/books" element={
              <PrivateRoute>
                <Books />
              </PrivateRoute>
            } />
            
            <Route path="/history" element={
              <PrivateRoute>
                <BorrowHistory />
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            <Route path="/librarian/dashboard" element={
              <PrivateRoute role="librarian">
                <LibrarianDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/librarian/books" element={
              <PrivateRoute role="librarian">
                <ManageBooks />
              </PrivateRoute>
            } />
            
            <Route path="/librarian/users" element={
              <PrivateRoute role="librarian">
                <ManageUsers />
              </PrivateRoute>
            } />
            
            <Route path="/librarian/analytics" element={
              <PrivateRoute role="librarian">
                <Analytics />
              </PrivateRoute>
            } />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
