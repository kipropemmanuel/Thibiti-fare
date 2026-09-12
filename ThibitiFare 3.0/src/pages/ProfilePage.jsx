import { useState } from 'react'
import { Edit2, Save, X, User, Phone, Shield } from 'lucide-react'

export default function ProfilePage({ userProfile, setUserProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(userProfile)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    setError('')
    setSuccess('')

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return
    }
    if (!/^\+254\d{9}$/.test(formData.phone)) {
      setError('Invalid phone format. Use: +254712345678')
      return
    }

    setUserProfile(formData)
    setIsEditing(false)
    setSuccess('Profile updated successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleCancel = () => {
    setFormData(userProfile)
    setIsEditing(false)
    setError('')
  }

  const stats = JSON.parse(localStorage.getItem('transactions') || '[]')

  return (
    <div className="page profile-page">
      <div className="page-header">
        <h2>My Profile</h2>
        <p className="text-secondary">Manage your account information</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-info">
            <h3>{userProfile.name}</h3>
            <p className="text-secondary">{userProfile.phone}</p>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary"
            >
              <Edit2 size={18} />
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+254712345678"
              />
              <small className="help-text">Format: +254712345678</small>
            </div>

            <div className="form-group">
              <label htmlFor="id">User ID</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                disabled
                className="disabled-input"
              />
              <small className="help-text">This ID cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="role">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="passenger">Passenger</option>
                <option value="operator">Matatu Operator</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                type="button"
                onClick={handleSave}
                className="btn btn-primary"
              >
                <Save size={18} />
                Save Changes
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-row">
              <span className="label">
                <User size={18} />
                Full Name
              </span>
              <span className="value">{userProfile.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">
                <Phone size={18} />
                Phone Number
              </span>
              <span className="value">{userProfile.phone}</span>
            </div>
            <div className="detail-row">
              <span className="label">
                <Shield size={18} />
                User ID
              </span>
              <span className="value font-mono">{userProfile.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Account Type</span>
              <span className="value">
                {userProfile.role === 'operator' ? 'Matatu Operator' : 'Passenger'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="stats-section">
        <h3>Account Statistics</h3>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-label">Total Requests</span>
            <span className="stat-value">{stats.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Verified Requests</span>
            <span className="stat-value">{stats.filter(t => t.verified).length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Amount</span>
            <span className="stat-value">KES {stats.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Verification Rate</span>
            <span className="stat-value">
              {stats.length > 0 ? ((stats.filter(t => t.verified).length / stats.length) * 100).toFixed(0) : 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="security-section">
        <h3>Security Information</h3>
        <div className="info-box">
          <h4>Account Security</h4>
          <ul>
            <li>Your data is stored securely in your browser</li>
            <li>All transactions are encrypted and verified</li>
            <li>Keep your phone number confidential</li>
            <li>Regularly verify payment requests before confirming</li>
          </ul>
        </div>
      </div>

      <div className="about-section">
        <h3>About ThibitiFare</h3>
        <div className="info-box">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Developed for:</strong> Secure matatu fare payments & fraud verification</p>
          <p><strong>Technology:</strong> React PWA with M-Pesa Daraja integration</p>
        </div>
      </div>
    </div>
  )
}
