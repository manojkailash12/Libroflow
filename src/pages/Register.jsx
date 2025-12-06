import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Register = () => {
  const [step, setStep] = useState(1) // 1: Registration form, 2: OTP verification
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userId: '',
    userType: 'student'
  })
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const startBarcodeScanner = async () => {
    setScanning(true)
    setError('')
    try {
      const { default: Html5QrcodeScanner } = await import('html5-qrcode')
      
      const scanner = new Html5QrcodeScanner(
        "user-id-scanner",
        { fps: 10, qrbox: { width: 250, height: 250 } }
      )
      
      scanner.render((decodedText) => {
        setFormData({ ...formData, userId: decodedText })
        scanner.clear()
        setScanning(false)
        setSuccess('ID scanned successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }, (error) => {
        console.log(error)
      })
    } catch (error) {
      console.error('Scanner error:', error)
      setError('Barcode scanner not available. Please enter ID manually.')
      setScanning(false)
      setTimeout(() => setError(''), 5000)
    }
  }

  const stopBarcodeScanner = () => {
    setScanning(false)
    const scannerElement = document.getElementById('user-id-scanner')
    if (scannerElement) {
      scannerElement.innerHTML = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userId: formData.userId,
        userType: formData.userType
      })
      setSuccess('OTP sent to your email! Please check your inbox.')
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axios.post('/api/auth-verify-otp', {
        email: formData.email,
        otp
      })
      setSuccess('Account verified successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="fas fa-user-plus fa-3x text-primary mb-3"></i>
                <h2>Create Account</h2>
                <p className="text-muted">Join LibroFlow</p>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {step === 1 ? (
                <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">User Type</label>
                  <select
                    className="form-select"
                    value={formData.userType}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="public">Public Member</option>
                    <option value="librarian">Librarian (Staff)</option>
                  </select>
                </div>

                {formData.userType === 'librarian' && (
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Note:</strong> The first librarian will be auto-approved. Additional librarians require approval.
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">
                    {formData.userType === 'student' ? 'Student ID' : 
                     formData.userType === 'faculty' ? 'Faculty ID' : 
                     formData.userType === 'librarian' ? 'Staff ID' : 'Member ID'}
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      placeholder={formData.userType === 'student' ? 'e.g., STU001' : 
                                  formData.userType === 'faculty' ? 'e.g., FAC001' : 
                                  formData.userType === 'librarian' ? 'e.g., LIB001' : 'e.g., PUB001'}
                      required
                    />
                    {!scanning ? (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={startBarcodeScanner}
                      >
                        <i className="fas fa-barcode me-1"></i>
                        Scan
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
                  <small className="text-muted">Enter ID manually or use barcode scanner (optional)</small>
                  {scanning && (
                    <div>
                      <div id="user-id-scanner" className="mt-3 border rounded p-2"></div>
                      <div className="alert alert-info mt-2 mb-0">
                        <i className="fas fa-info-circle me-2"></i>
                        Point your camera at the ID barcode. If scanner doesn't work, enter ID manually above.
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Register'}
                </button>
              </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <div className="mb-3">
                    <label className="form-label">Enter OTP</label>
                    <input
                      type="text"
                      className="form-control text-center"
                      style={{ fontSize: '24px', letterSpacing: '10px' }}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000000"
                      maxLength="6"
                      required
                    />
                    <small className="text-muted">Check your email: {formData.email}</small>
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary w-100 mt-2" 
                    onClick={() => setStep(1)}
                  >
                    Back to Registration
                  </button>
                </form>
              )}

              <div className="text-center mt-3">
                <p className="mb-0">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
