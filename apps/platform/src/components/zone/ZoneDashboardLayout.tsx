import { ReactNode, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './ZoneDashboardLayout.css'
import Chat from './Chat'
import Leaderboard, { mockLeaderboardData } from './Leaderboard'
import Friends from './Friends'

interface ZoneDashboardLayoutProps {
  children?: ReactNode
}

type SkynetView = 'leaderboard' | 'chat' | 'dm' | 'friends'

interface DirectMessageUser {
  id: string
  username: string
  avatar?: string
  isOnline: boolean
  subtitle?: string
}

export default function ZoneDashboardLayout({ children }: ZoneDashboardLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeView, setActiveView] = useState<SkynetView>('leaderboard')
  const [selectedDM, setSelectedDM] = useState<string | null>(null)

  // Handle navigation and query parameters
  useEffect(() => {
    if (location.pathname === '/zone') {
      const params = new URLSearchParams(location.search)
      const dmUsername = params.get('dm')

      if (dmUsername) {
        setActiveView('dm')
        setSelectedDM(dmUsername)
      } else {
        setActiveView('leaderboard')
      }
    }
  }, [location.pathname, location.search])

  // Convert leaderboard data to direct messages
  const directMessages: DirectMessageUser[] = mockLeaderboardData.map((entry) => ({
    id: entry.rank.toString(),
    username: entry.username,
    avatar: entry.profilePic,
    isOnline: Math.random() > 0.5, // Random online status for now
    subtitle: entry.title
  }))

  return (
    <div className="zone-dashboard-layout">
      {/* Left Sidebar - 15% */}
      <div className="zone-sidebar">
        <h1 className="zone-sidebar-title">SKYNET</h1>
        <button
          className={`zone-nav-button ${activeView === 'leaderboard' ? 'active' : ''}`}
          onClick={() => {
            navigate('/zone')
            setActiveView('leaderboard')
          }}
        >
          Leaderboard
        </button>
        <button
          className={`zone-nav-button ${activeView === 'chat' ? 'active' : ''}`}
          onClick={() => {
            navigate('/zone')
            setActiveView('chat')
          }}
        >
          Global Chat
        </button>
        <button
          className={`zone-nav-button ${activeView === 'friends' ? 'active' : ''}`}
          onClick={() => {
            navigate('/zone')
            setActiveView('friends')
          }}
        >
          Friends
        </button>

        <div className="zone-sidebar-separator"></div>

        <h2 className="zone-sidebar-section-title">Direct Messages</h2>

        {directMessages.map((dm) => (
          <div
            key={dm.id}
            className={`dm-row ${activeView === 'dm' && selectedDM === dm.username ? 'active' : ''}`}
            onClick={() => {
              navigate('/zone')
              setActiveView('dm')
              setSelectedDM(dm.username)
            }}
          >
            <div className="dm-avatar">
              <div className={`dm-status ${dm.isOnline ? 'online' : 'offline'}`}></div>
            </div>
            <div className="dm-info">
              <div className="dm-username">{dm.username}</div>
              {dm.subtitle && (
                <div className="dm-subtitle">{dm.subtitle}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content - 85% */}
      <div className={`zone-content ${children ? 'with-padding' : (activeView === 'leaderboard' || activeView === 'friends') ? 'with-padding' : 'no-padding'}`}>
        {children ? (
          children
        ) : (
          <>
            {activeView === 'leaderboard' && (
              <Leaderboard onUserClick={(username) => {
                navigate(`/zone/${username}`)
              }} />
            )}
            {activeView === 'chat' && <Chat isGlobalChat={true} />}
            {activeView === 'dm' && selectedDM && <Chat recipient={selectedDM} />}
            {activeView === 'friends' && <Friends />}
          </>
        )}
      </div>
    </div>
  )
}
