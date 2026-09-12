import { useState } from 'react'
import { Send, Copy, Check } from 'lucide-react'

export default function RequestFarePage({ userProfile, setUserProfile }) {
  const [formData, setFormData] = useState({
    amount: '',
    operatorPhone: '',
    route: '',
    passengers: '1',
    description: ''
  })
  const [submitted, setSubmitted] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.operatorPhone || !formData.route) {
      alert('Please fill in all required fields')
      return
    }

    const newTransaction = {
      id: 'REQ_' + Date.now(),
      type: 'fare_request',
      from: userProfile.phone,
      to: formData.operatorPhone,
      amount: parseFloat(formData.amount),
      route: formData.route,
      passengers: parseInt(formData.passengers),
      description: formData.description,
      timestamp: new Date().toISOString(),
      verified: false,
      completed: false,
      status: 'pending'
    }

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
    transactions.push(newTransaction)
    localStorage.setItem('transactions', JSON.stringify(transactions))

    setSubmitted(newTransaction)
    setFormData({
      amount: '',
      operatorPhone: '',
      route: '',
      passengers: '1',
      description: ''
    })

    setTimeout(() => {
      setSubmitted(null)
    }, 5000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page request-page">
      <div className="page-header">
        <h2>Request Fare Payment</h2>
        <p className="text-secondary">Create a new fare payment request</p>
      </div>

      {submitted ? (
        <div className="success-section">
          <div className="success-icon">✓</div>
          <h3>Request Created Successfully!</h3>
          <p>Your fare payment request has been created</p>
          
          <div className="request-details">
            <div className="detail-row">
              <span className="detail-label">Request ID:</span>
              <div className="detail-value-with-copy">
                <span>{submitted.id}</span>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(submitted.id)}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <span className="detail-value">KES {submitted.amount.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Route:</span>
              <span className="detail-value">{submitted.route}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Passengers:</span>
              <span className="detail-value">{submitted.passengers}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value pending">PENDING</span>
            </div>
          </div>

          <p className="help-text">Share this ID with the matatu operator for payment verification</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="fare-form">
          <div className="form-group">
            <label htmlFor="amount">Amount (KES) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g., 100"
              min="0"
              step="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="operatorPhone">Matatu Operator Phone *</label>
            <input
              type="tel"
              id="operatorPhone"
              name="operatorPhone"
              value={formData.operatorPhone}
              onChange={handleChange}
              placeholder="+254712345678"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="route">Route *</label>
            <input
              type="text"
              id="route"
              name="route"
              value={formData.route}
              onChange={handleChange}
              placeholder="e.g., Nairobi - Kenyatta"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passengers">Number of Passengers</label>
            <select
              id="passengers"
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-large">
            <Send size={20} />
            Send Request
          </button>
        </form>
      )}

      <div className="info-section">
        <h4>About Fare Requests</h4>
        <ul>
          <li>Enter the exact fare amount you want to pay</li>
          <li>Provide the matatu operator's phone number</li>
          <li>Specify the route clearly</li>
          <li>The request will be sent for verification</li>
          <li>Track the status in your transaction history</li>
        </ul>
      </div>
    </div>
  )
}
