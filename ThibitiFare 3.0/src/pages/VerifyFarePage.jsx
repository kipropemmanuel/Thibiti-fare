import { useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react'

export default function VerifyFarePage({ userProfile }) {
  const [searchInput, setSearchInput] = useState('')
  const [verification, setVerification] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    
    if (!searchInput.trim()) {
      alert('Please enter a request ID')
      return
    }

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
    const found = transactions.find(t => t.id === searchInput.trim())

    setSearched(true)
    
    if (found) {
      // Perform verification checks
      const verificationResult = performVerification(found)
      setVerification(verificationResult)
    } else {
      setVerification(null)
    }
  }

  const performVerification = (transaction) => {
    // Simulate fraud detection checks
    const ageInMinutes = (Date.now() - new Date(transaction.timestamp).getTime()) / (1000 * 60)
    const isExpired = ageInMinutes > 1440 // 24 hours

    // Fraud detection logic
    const fraudScores = {
      unusualAmount: transaction.amount > 1000 ? 10 : 0,
      mobileMoneyPattern: Math.random() > 0.1 ? 0 : 15,
      velocityCheck: Math.random() > 0.2 ? 0 : 10,
    }

    const totalFraudScore = Object.values(fraudScores).reduce((a, b) => a + b, 0)
    const isFraudulent = totalFraudScore > 20

    return {
      transaction,
      fraudScore: totalFraudScore,
      isFraudulent,
      fraudScores,
      isExpired,
      ageInMinutes,
      checks: {
        amountValid: !isNaN(transaction.amount) && transaction.amount > 0,
        phoneValid: /^\+254\d{9}$/.test(transaction.to),
        routeValid: transaction.route && transaction.route.length > 0,
        dataIntegrity: true,
      }
    }
  }

  const resetSearch = () => {
    setSearchInput('')
    setVerification(null)
    setSearched(false)
  }

  return (
    <div className="page verify-page">
      <div className="page-header">
        <h2>Verify Fare Payment</h2>
        <p className="text-secondary">Check payment authenticity and detect fraud</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter Request ID (e.g., REQ_1234567890)"
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            <Shield size={20} />
            Verify
          </button>
        </div>
      </form>

      {searched && !verification && (
        <div className="no-result">
          <AlertTriangle size={48} />
          <h3>Request Not Found</h3>
          <p>No transaction found with ID: <strong>{searchInput}</strong></p>
          <button onClick={resetSearch} className="btn btn-secondary">
            Try Again
          </button>
        </div>
      )}

      {verification && (
        <div className="verification-result">
          <div className={`verification-header ${verification.isFraudulent ? 'fraudulent' : 'legitimate'}`}>
            <div className="verification-badge">
              {verification.isFraudulent ? (
                <>
                  <AlertTriangle size={40} />
                  <span>FRAUD DETECTED</span>
                </>
              ) : (
                <>
                  <CheckCircle size={40} />
                  <span>LEGITIMATE</span>
                </>
              )}
            </div>
            <p className="verification-score">
              Fraud Score: {verification.fraudScore}/50
            </p>
          </div>

          <div className="transaction-summary">
            <h3>Transaction Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Request ID</span>
                <span className="value">{verification.transaction.id}</span>
              </div>
              <div className="detail-item">
                <span className="label">Amount</span>
                <span className="value">KES {verification.transaction.amount.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Route</span>
                <span className="value">{verification.transaction.route}</span>
              </div>
              <div className="detail-item">
                <span className="label">Passengers</span>
                <span className="value">{verification.transaction.passengers}</span>
              </div>
              <div className="detail-item">
                <span className="label">From</span>
                <span className="value">{verification.transaction.from}</span>
              </div>
              <div className="detail-item">
                <span className="label">To</span>
                <span className="value">{verification.transaction.to}</span>
              </div>
            </div>
          </div>

          <div className="verification-checks">
            <h3>Verification Checks</h3>
            <div className="checks-list">
              <div className={`check-item ${verification.checks.amountValid ? 'pass' : 'fail'}`}>
                <span className="check-icon">{verification.checks.amountValid ? '✓' : '✗'}</span>
                <span className="check-text">Valid Amount</span>
              </div>
              <div className={`check-item ${verification.checks.phoneValid ? 'pass' : 'fail'}`}>
                <span className="check-icon">{verification.checks.phoneValid ? '✓' : '✗'}</span>
                <span className="check-text">Valid Phone Number</span>
              </div>
              <div className={`check-item ${verification.checks.routeValid ? 'pass' : 'fail'}`}>
                <span className="check-icon">{verification.checks.routeValid ? '✓' : '✗'}</span>
                <span className="check-text">Valid Route</span>
              </div>
              <div className={`check-item ${verification.checks.dataIntegrity ? 'pass' : 'fail'}`}>
                <span className="check-icon">{verification.checks.dataIntegrity ? '✓' : '✗'}</span>
                <span className="check-text">Data Integrity</span>
              </div>
              <div className={`check-item ${!verification.isExpired ? 'pass' : 'fail'}`}>
                <span className="check-icon">{!verification.isExpired ? '✓' : '✗'}</span>
                <span className="check-text">Not Expired</span>
              </div>
            </div>
          </div>

          <div className="risk-assessment">
            <h3>Fraud Risk Analysis</h3>
            <div className="risk-items">
              {Object.entries(verification.fraudScores).map(([key, score]) => (
                <div key={key} className="risk-item">
                  <span className="risk-name">{formatRiskName(key)}</span>
                  <div className="risk-bar">
                    <div 
                      className="risk-fill"
                      style={{width: `${(score / 15) * 100}%`}}
                    />
                  </div>
                  <span className="risk-score">{score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="timestamp-info">
            <Clock size={16} />
            <span>
              Request Age: {verification.ageInMinutes.toFixed(0)} minutes
            </span>
          </div>

          <button onClick={resetSearch} className="btn btn-secondary btn-block">
            Verify Another Request
          </button>
        </div>
      )}
    </div>
  )
}

function formatRiskName(key) {
  const names = {
    unusualAmount: 'Unusual Amount',
    mobileMoneyPattern: 'Mobile Money Pattern',
    velocityCheck: 'Velocity Check'
  }
  return names[key] || key
}
