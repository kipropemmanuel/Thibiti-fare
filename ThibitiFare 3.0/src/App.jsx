import { useState, useEffect } from 'react'
import { Home, Send, CheckCircle2, History, User } from 'lucide-react'
import HomePage from './pages/HomePage'
import RequestFarePage from './pages/RequestFarePage'
import VerifyFarePage from './pages/VerifyFarePage'
import HistoryPage from './pages/HistoryPage'
import ProfilePage from './pages/ProfilePage'
import './styles/App.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile')
    return saved ? JSON.parse(saved) : {
      id: 'USER_' + Math.random().toString(36).substr(2, 9),
      name: 'John Doe',
      phone: '+254712345678',
      balance: 0,
      role: 'passenger' // or 'operator'
    }
  })

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile))
  }, [userProfile])

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage userProfile={userProfile} />
      case 'request':
        return <RequestFarePage userProfile={userProfile} setUserProfile={setUserProfile} />
      case 'verify':
        return <VerifyFarePage userProfile={userProfile} />
      case 'history':
        return <HistoryPage userProfile={userProfile} />
      case 'profile':
        return <ProfilePage userProfile={userProfile} setUserProfile={setUserProfile} />
      default:
        return <HomePage userProfile={userProfile} />
    }
  }

  return (
    <div className="app-container">
      <div className="app-content">
        {renderPage()}
      </div>
      
      <nav className="bottom-nav">
        <button 
          className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
          title="Home"
        >
          <Home size={24} />
          <span>Home</span>
        </button>
        <button 
          className={`nav-btn ${currentPage === 'request' ? 'active' : ''}`}
          onClick={() => setCurrentPage('request')}
          title="Request Fare"
        >
          <Send size={24} />
          <span>Request</span>
        </button>
        <button 
          className={`nav-btn ${currentPage === 'verify' ? 'active' : ''}`}
          onClick={() => setCurrentPage('verify')}
          title="Verify Fare"
        >
          <CheckCircle2 size={24} />
          <span>Verify</span>
        </button>
        <button 
          className={`nav-btn ${currentPage === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentPage('history')}
          title="History"
        >
          <History size={24} />
          <span>History</span>
        </button>
        <button 
          className={`nav-btn ${currentPage === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentPage('profile')}
          title="Profile"
        >
          <User size={24} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  )
}
