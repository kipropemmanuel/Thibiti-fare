import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

export default function HomePage({ userProfile }) {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
  const recentTransactions = transactions.slice(-3).reverse()

  const stats = {
    total: transactions.length,
    verified: transactions.filter(t => t.verified).length,
    pending: transactions.filter(t => !t.verified && !t.completed).length
  }

  return (
    <div className="page home-page">
      <div className="header">
        <h1>ThibitiFare</h1>
        <p className="subtitle">Matatu Fare Payment & Verification</p>
      </div>

      <div className="welcome-section">
        <h2>Welcome, {userProfile.name}!</h2>
        <p className="text-secondary">Your account is ready to use</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <TrendingUp className="stat-icon" size={32} />
          <div className="stat-content">
            <p className="stat-label">Total Transactions</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card success">
          <CheckCircle className="stat-icon" size={32} />
          <div className="stat-content">
            <p className="stat-label">Verified</p>
            <p className="stat-value">{stats.verified}</p>
          </div>
        </div>
        <div className="stat-card warning">
          <AlertCircle className="stat-icon" size={32} />
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Recent Transactions</h3>
        {recentTransactions.length > 0 ? (
          <div className="transaction-list">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="transaction-info">
                  <p className="transaction-id">ID: {tx.id.slice(0, 8)}</p>
                  <p className="transaction-date">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="transaction-right">
                  <p className="transaction-amount">KES {tx.amount}</p>
                  <span className={`status-badge ${tx.verified ? 'verified' : 'pending'}`}>
                    {tx.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No transactions yet. Start by requesting a fare!</p>
          </div>
        )}
      </div>

      <div className="info-box">
        <h4>How it works</h4>
        <ol>
          <li><strong>Request:</strong> Create a fare payment request</li>
          <li><strong>Verify:</strong> Verify payment authenticity</li>
          <li><strong>Track:</strong> Monitor your transactions</li>
        </ol>
      </div>
    </div>
  )
}
