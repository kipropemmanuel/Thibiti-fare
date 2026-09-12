import { useState } from 'react'
import { Download, Trash2, Filter } from 'lucide-react'

export default function HistoryPage({ userProfile }) {
  const [filter, setFilter] = useState('all') // all, verified, pending, completed
  const [transactions, setTransactions] = useState(() => 
    JSON.parse(localStorage.getItem('transactions') || '[]')
  )

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'verified') return tx.verified
    if (filter === 'pending') return !tx.verified && !tx.completed
    if (filter === 'completed') return tx.completed
    return true
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  const deleteTransaction = (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      const updated = transactions.filter(tx => tx.id !== id)
      setTransactions(updated)
      localStorage.setItem('transactions', JSON.stringify(updated))
    }
  }

  const markAsVerified = (id) => {
    const updated = transactions.map(tx => 
      tx.id === id ? { ...tx, verified: true } : tx
    )
    setTransactions(updated)
    localStorage.setItem('transactions', JSON.stringify(updated))
  }

  const exportTransactions = () => {
    const dataStr = JSON.stringify(filteredTransactions, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  return (
    <div className="page history-page">
      <div className="page-header">
        <h2>Transaction History</h2>
        <p className="text-secondary">View and manage all your transactions</p>
      </div>

      <div className="history-controls">
        <div className="filter-group">
          <Filter size={20} />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Transactions</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button 
          onClick={exportTransactions}
          className="btn btn-secondary"
          disabled={filteredTransactions.length === 0}
        >
          <Download size={18} />
          Export
        </button>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="history-list">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="history-item">
              <div className="history-header">
                <div className="history-title">
                  <h4>{tx.route}</h4>
                  <span className="history-id">ID: {tx.id}</span>
                </div>
                <span className={`status-badge ${tx.verified ? 'verified' : tx.completed ? 'completed' : 'pending'}`}>
                  {tx.verified ? 'Verified' : tx.completed ? 'Completed' : 'Pending'}
                </span>
              </div>

              <div className="history-details">
                <div className="detail">
                  <span className="label">Amount:</span>
                  <span className="value">KES {tx.amount.toLocaleString()}</span>
                </div>
                <div className="detail">
                  <span className="label">Passengers:</span>
                  <span className="value">{tx.passengers}</span>
                </div>
                <div className="detail">
                  <span className="label">To:</span>
                  <span className="value">{tx.to}</span>
                </div>
              </div>

              <div className="history-date">
                {new Date(tx.timestamp).toLocaleDateString()} at {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>

              <div className="history-actions">
                {!tx.verified && (
                  <button 
                    onClick={() => markAsVerified(tx.id)}
                    className="btn btn-small btn-success"
                  >
                    Mark Verified
                  </button>
                )}
                <button 
                  onClick={() => deleteTransaction(tx.id)}
                  className="btn btn-small btn-danger"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No transactions found</p>
          <p className="text-secondary">Create a fare request to get started</p>
        </div>
      )}

      <div className="summary-box">
        <h3>Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="label">Total Transactions</span>
            <span className="value">{transactions.length}</span>
          </div>
          <div className="summary-item">
            <span className="label">Total Amount</span>
            <span className="value">KES {transactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="label">Verified</span>
            <span className="value">{transactions.filter(t => t.verified).length}</span>
          </div>
          <div className="summary-item">
            <span className="label">Pending</span>
            <span className="value">{transactions.filter(t => !t.verified && !t.completed).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
