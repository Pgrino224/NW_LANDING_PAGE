import { useState } from 'react'
import './Leaderboard.css'

type MetricType = 'networth' | 'influence' | 'resonance'

interface LeaderboardEntry {
  rank: number
  username: string
  profilePic: string
  banner: string
  title: string
  archetype: string
  networth: number
  influence: number
  resonance: number
}

interface LeaderboardProps {
  onUserClick?: (username: string) => void
}

export const mockLeaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    username: 'cryptowhale',
    profilePic: '',
    banner: '',
    title: 'Master Trader',
    archetype: '',
    networth: 15000,
    influence: 8500,
    resonance: 12000
  },
  {
    rank: 2,
    username: 'defipioneer',
    profilePic: '',
    banner: '',
    title: 'Blockchain Innovator',
    archetype: '',
    networth: 12500,
    influence: 9200,
    resonance: 10500
  },
  {
    rank: 3,
    username: 'marketmaker',
    profilePic: '',
    banner: '',
    title: 'Liquidity Expert',
    archetype: '',
    networth: 11000,
    influence: 7800,
    resonance: 11200
  },
  {
    rank: 4,
    username: 'tradinglegend',
    profilePic: '',
    banner: '',
    title: 'Strategy Master',
    archetype: '',
    networth: 9800,
    influence: 8900,
    resonance: 9500
  },
  {
    rank: 5,
    username: 'yieldfarmer',
    profilePic: '',
    banner: '',
    title: 'DeFi Farmer',
    archetype: '',
    networth: 8500,
    influence: 6700,
    resonance: 8800
  }
]

export default function Leaderboard({ onUserClick }: LeaderboardProps = {}) {
  const [activeMetric, setActiveMetric] = useState<MetricType>('networth')
  const [searchQuery, setSearchQuery] = useState('')

  const sortedData = [...mockLeaderboardData].sort((a, b) => b[activeMetric] - a[activeMetric])
  const filteredData = sortedData.filter(entry =>
    entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="leaderboard-wrapper">
      <h2 className="lb-title">Leaderboard</h2>

      <div className="lb-controls">
        <div className="lb-tabs">
          <button
            className={`lb-tab ${activeMetric === 'networth' ? 'active' : ''}`}
            onClick={() => setActiveMetric('networth')}
          >
            NetWorth
          </button>
          <button
            className={`lb-tab ${activeMetric === 'influence' ? 'active' : ''}`}
            onClick={() => setActiveMetric('influence')}
          >
            Influence
          </button>
          <button
            className={`lb-tab ${activeMetric === 'resonance' ? 'active' : ''}`}
            onClick={() => setActiveMetric('resonance')}
          >
            Resonance
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="lb-search"
        />
      </div>

      <div className="lb-list">
        {filteredData.map((entry, index) => (
          <div
            key={entry.username}
            className="lb-row"
            onClick={() => onUserClick?.(entry.username)}
          >
            <div className="lb-rank">{index + 1}</div>
            <div className="lb-profile-square"></div>
            <div className="lb-banner">
              <div className="lb-info">
                <div className="lb-username">{entry.username}</div>
                <div className="lb-player-title">{entry.title}</div>
              </div>
            </div>
            <div className="lb-values">
              <div className="lb-value-item">
                <img src="/shared/token-logos/svg-black/networth-logo-black.svg" alt="NetWorth" className="lb-token-icon" />
                <span>{entry.networth.toLocaleString()}</span>
              </div>
              <div className="lb-value-item">
                <img src="/shared/token-logos/svg-black/influence-logo-black.svg" alt="Influence" className="lb-token-icon" />
                <span>{entry.influence.toLocaleString()}</span>
              </div>
              <div className="lb-value-item">
                <img src="/shared/token-logos/svg-black/resonance-logo-black.svg" alt="Resonance" className="lb-token-icon" />
                <span>{entry.resonance.toLocaleString()}</span>
              </div>
            </div>
            <div className="lb-archetype-square"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
