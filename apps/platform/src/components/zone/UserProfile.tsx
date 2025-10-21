import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { mockLeaderboardData } from './Leaderboard'
import './UserProfile.css'

interface UserProfileProps {
  username?: string
  title?: string
  profilePic?: string
  banner?: string
  archetype?: string
  networth?: number
  influence?: number
  resonance?: number
}

interface ModuleStat {
  name: string
  hoursPlayed: number
  winRate: number
}

interface Trait {
  id: string
  name: string
  level: number
  maxLevel: number
}

// Mock data
const mockModuleStats: ModuleStat[] = [
  { name: 'Leda', hoursPlayed: 100, winRate: 58 },
  { name: 'Themis', hoursPlayed: 85, winRate: 55 },
  { name: 'Dione', hoursPlayed: 75, winRate: 60 }
]

const mockTraits: Trait[] = [
  { id: 'analysis', name: 'Analysis', level: 3.5, maxLevel: 7.0 },
  { id: 'confidence', name: 'Confidence', level: 4.2, maxLevel: 7.0 },
  { id: 'execution', name: 'Execution', level: 2.8, maxLevel: 7.0 },
  { id: 'innovation', name: 'Innovation', level: 5.1, maxLevel: 7.0 },
  { id: 'integrity', name: 'Integrity', level: 3.9, maxLevel: 7.0 },
  { id: 'preservation', name: 'Preservation', level: 4.5, maxLevel: 7.0 },
  { id: 'resilience', name: 'Resilience', level: 2.3, maxLevel: 7.0 },
  { id: 'spirit', name: 'Spirit', level: 5.6, maxLevel: 7.0 },
  { id: 'versatility', name: 'Versatility', level: 3.2, maxLevel: 7.0 },
  { id: 'vision', name: 'Vision', level: 4.8, maxLevel: 7.0 }
]

type FriendStatus = 'none' | 'pending' | 'friends'

// Mock friends list - first 3 leaderboard users
const mockFriends = ['cryptowhale', 'defipioneer', 'marketmaker']

export default function UserProfile({}: UserProfileProps = {}) {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()

  // Find user data from leaderboard
  const userData = mockLeaderboardData.find(
    entry => entry.username.toLowerCase() === username?.toLowerCase()
  )

  // Use found data or defaults
  const title = userData?.title || 'Master Trader'
  const networth = userData?.networth || 15000
  const influence = userData?.influence || 8500
  const resonance = userData?.resonance || 12000

  // Check if user is already a friend
  const isFriend = mockFriends.includes(username || '')
  const [friendStatus, setFriendStatus] = useState<FriendStatus>(isFriend ? 'friends' : 'none')

  const handleFriendAction = () => {
    if (friendStatus === 'none') {
      setFriendStatus('pending')
    } else if (friendStatus === 'pending') {
      setFriendStatus('none')
    } else if (friendStatus === 'friends') {
      setFriendStatus('none')
    }
  }

  const getButtonText = () => {
    switch (friendStatus) {
      case 'none':
        return 'Add Friend'
      case 'pending':
        return 'Pending'
      case 'friends':
        return 'Friends'
      default:
        return 'Add Friend'
    }
  }

  return (
    <div className="user-profile">
      {/* Banner Section */}
      <div className="profile-banner">
        <div className="banner-img">
          {/* Back Button */}
          <button className="profile-back-btn" onClick={() => navigate('/zone')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Skynet
          </button>

          <div className="profile-pic" />
          <div className="profile-info">
            <h2 className="profile-username">{username || 'Unknown User'}</h2>
            <p className="profile-title">{title}</p>
          </div>
          <button
            className={`profile-friend-btn ${friendStatus}`}
            onClick={handleFriendAction}
          >
            {getButtonText()}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="profile-content">
        {/* Left: Archetype Image */}
        <div className="archetype-section">
          <h3 className="section-title">Archetypes</h3>
          <div className="archetype-image" />
        </div>

        {/* Middle: Token Balances + Module Stats */}
        <div className="middle-section">
          {/* Token Balances */}
          <h3 className="section-title">Balances</h3>
          <div className="token-balances">
            <div className="token-item">
              <img src="/shared/token-logos/svg-black/networth-logo-black.svg" alt="NetWorth" className="token-icon" />
              <span className="token-value">{networth.toLocaleString()}</span>
            </div>
            <div className="token-item">
              <img src="/shared/token-logos/svg-black/influence-logo-black.svg" alt="Influence" className="token-icon" />
              <span className="token-value">{influence.toLocaleString()}</span>
            </div>
            <div className="token-item">
              <img src="/shared/token-logos/svg-black/resonance-logo-black.svg" alt="Resonance" className="token-icon" />
              <span className="token-value">{resonance.toLocaleString()}</span>
            </div>
          </div>

          {/* Module Stats */}
          <div className="module-stats">
            {/* Labels Card */}
            <div className="stat-card stat-card-header">
              <span className="stat-mode">Modes</span>
              <span className="stat-hours">Hours Played</span>
              <span className="stat-winrate">Win Rate</span>
            </div>
            {/* Stat Cards */}
            {mockModuleStats.map((stat) => (
              <div key={stat.name} className="stat-card">
                <span className="stat-mode">{stat.name}</span>
                <span className="stat-hours">{stat.hoursPlayed}</span>
                <span className="stat-winrate">{stat.winRate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Traits */}
        <div className="traits-section">
          <h3 className="section-title">Traits</h3>
          {mockTraits.map((trait) => (
            <div key={trait.id} className="trait-card">
              <img
                src={`/hyperion/traits/${trait.id}.svg`}
                alt={trait.name}
                className="trait-icon"
              />
              <span className="trait-name">{trait.name}</span>
              <div className="trait-bar">
                <div
                  className="trait-bar-fill"
                  style={{ width: `${(trait.level / trait.maxLevel) * 100}%` }}
                />
              </div>
              <span className="trait-level">{trait.level.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
