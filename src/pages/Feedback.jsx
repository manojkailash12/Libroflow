import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Feedback = () => {
  const [searchParams] = useSearchParams()
  const transactionId = searchParams.get('transaction')
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    rating: 5,
    bookCondition: 'good',
    serviceRating: 5,
    comments: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post('/api/feedback-submit', {
        transactionId,
        ...formData
      })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body text-center p-5">
                <i className="fas fa-check-circle fa-4x text-success mb-3"></i>
                <h2>Thank You!</h2>
                <p className="lead">Your feedback has been submitted successfully.</p>
                <p>Redirecting to dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="fas fa-comment-dots fa-3x text-primary mb-3"></i>
                <h2>Share Your Feedback</h2>
                <p className="text-muted">Help us improve our library services</p>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">How would you rate this book?</label>
                  <div className="d-flex justify-content-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        style={{ fontSize: '2rem', textDecoration: 'none' }}
                      >
                        <i className={`fas fa-star ${star <= formData.rating ? 'text-warning' : 'text-muted'}`}></i>
                      </button>
                    ))}
                  </div>
                  <div className="text-center text-muted small mt-2">
                    {formData.rating} out of 5 stars
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Book Condition on Return</label>
                  <select
                    className="form-select"
                    value={formData.bookCondition}
                    onChange={(e) => setFormData({ ...formData, bookCondition: e.target.value })}
                    required
                  >
                    <option value="excellent">Excellent - Like new</option>
                    <option value="good">Good - Normal wear</option>
                    <option value="fair">Fair - Some damage</option>
                    <option value="poor">Poor - Significant damage</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">How would you rate our service?</label>
                  <div className="d-flex justify-content-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => setFormData({ ...formData, serviceRating: star })}
                        style={{ fontSize: '2rem', textDecoration: 'none' }}
                      >
                        <i className={`fas fa-star ${star <= formData.serviceRating ? 'text-warning' : 'text-muted'}`}></i>
                      </button>
                    ))}
                  </div>
                  <div className="text-center text-muted small mt-2">
                    {formData.serviceRating} out of 5 stars
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Additional Comments (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    placeholder="Tell us about your experience..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feedback
