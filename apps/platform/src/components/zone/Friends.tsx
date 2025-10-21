import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockLeaderboardData } from './Leaderboard'
import StatusModal from '../common/StatusModal'
import './Friends.css'

type FriendTab = 'online' | 'all' | 'pending'

interface Friend {
  username: string
  status: string
  isOnline: boolean
  avatar?: string
}

export default function Friends() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<FriendTab>('online')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddFriendModal, setShowAddFriendModal] = useState(false)
  const [friendUsername, setFriendUsername] = useState('')
  const [contextMenu, setContextMenu] = useState<{ username: string; x: number; y: number } | null>(null)
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({ isOpen: false, type: 'success', title: '', message: '' })

  // Convert leaderboard data to friends (using first 3 as friends)
  const allFriends: Friend[] = mockLeaderboardData.slice(0, 3).map((entry, index) => ({
    username: entry.username,
    status: index === 0 ? 'Idle' : index === 1 ? 'Online' : entry.title,
    isOnline: index !== 2,
    avatar: entry.profilePic
  }))

  const pendingRequests: Friend[] = []

  const filteredFriends = allFriends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const onlineFriends = filteredFriends.filter(f => f.isOnline)
  const displayFriends = activeTab === 'online' ? onlineFriends : filteredFriends

  return (
    <div className="friends-container">
      {/* Header */}
      <div className="friends-header">
        <div className="friends-header-left">
          <h2 className="friends-title">Friends</h2>
          <div className="friends-tabs">
            <button
              className={`friends-tab ${activeTab === 'online' ? 'active' : ''}`}
              onClick={() => setActiveTab('online')}
            >
              Online
            </button>
            <button
              className={`friends-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`friends-tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
              {pendingRequests.length > 0 && (
                <span className="friends-badge">{pendingRequests.length}</span>
              )}
            </button>
          </div>
        </div>
        <button className="friends-add-btn" onClick={() => setShowAddFriendModal(true)}>Add Friend</button>
      </div>

      {/* Search Bar */}
      <div className="friends-search-container">
        <input
          type="text"
          className="friends-search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Friends List */}
      <div className="friends-list">
        {activeTab === 'pending' && pendingRequests.length === 0 ? (
          <div className="friends-empty">No pending friend requests</div>
        ) : (
          <>
            <div className="friends-section-header">
              {activeTab === 'online' ? `Online — ${onlineFriends.length}` : `All Friends — ${allFriends.length}`}
            </div>

            {displayFriends.map((friend) => (
              <div
                key={friend.username}
                className="friend-row"
                onClick={() => navigate(`/zone/${friend.username}`)}
              >
                <div className="friend-avatar">
                  <div className={`friend-status ${friend.isOnline ? 'online' : 'offline'}`}></div>
                </div>
                <div className="friend-info">
                  <div className="friend-username">{friend.username}</div>
                  <div className="friend-status-text">{friend.status}</div>
                </div>
                <div className="friend-actions">
                  <button
                    className="friend-action-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.location.href = `/zone?dm=${friend.username}`
                    }}
                    title="Send Message"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                  </button>
                  <button
                    className="friend-action-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      const rect = e.currentTarget.getBoundingClientRect()
                      const menuWidth = 200 // approximate width of context menu
                      const viewportWidth = window.innerWidth

                      // Check if menu would overflow on the right
                      const wouldOverflow = rect.left + menuWidth > viewportWidth

                      setContextMenu({
                        username: friend.username,
                        x: wouldOverflow ? rect.right - menuWidth : rect.left,
                        y: rect.bottom + 4
                      })
                    }}
                    title="More Options"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="add-friend-modal-overlay" onClick={() => setShowAddFriendModal(false)}>
          <div className="add-friend-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-friend-modal-header">
              <h3 className="add-friend-modal-title">Add Friend</h3>
              <button className="add-friend-modal-close" onClick={() => setShowAddFriendModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="add-friend-modal-content">
              <input
                type="text"
                className="add-friend-modal-input"
                placeholder="You can add friends with their username."
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
              />
              <button
                className="add-friend-modal-send-btn"
                disabled={!friendUsername.trim()}
                onClick={() => {
                  const trimmedUsername = friendUsername.trim()

                  // Validate username exists in leaderboard
                  const userExists = mockLeaderboardData.some(
                    entry => entry.username.toLowerCase() === trimmedUsername.toLowerCase()
                  )

                  if (!userExists) {
                    setStatusModal({
                      isOpen: true,
                      type: 'error',
                      title: 'User Not Found',
                      message: `Username "${trimmedUsername}" does not exist.`
                    })
                    setFriendUsername('')
                    setShowAddFriendModal(false)
                    return
                  }

                  // Check if already friends
                  const isAlreadyFriend = allFriends.some(
                    friend => friend.username.toLowerCase() === trimmedUsername.toLowerCase()
                  )

                  if (isAlreadyFriend) {
                    setStatusModal({
                      isOpen: true,
                      type: 'error',
                      title: 'Already Friends',
                      message: `You are already friends with ${trimmedUsername}.`
                    })
                    setFriendUsername('')
                    setShowAddFriendModal(false)
                    return
                  }

                  // Success
                  setStatusModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Friend Request Sent',
                    message: `Successfully sent friend request to ${trimmedUsername}.`
                  })
                  setFriendUsername('')
                  setShowAddFriendModal(false)
                }}
              >
                Send Friend Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="context-menu-backdrop"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="friend-context-menu"
            style={{
              position: 'fixed',
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`
            }}
          >
            <button
              className="context-menu-item"
              onClick={() => {
                navigate(`/zone/${contextMenu.username}`)
                setContextMenu(null)
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              View Profile
            </button>
            <button
              className="context-menu-item"
              onClick={() => {
                window.location.href = `/zone?dm=${contextMenu.username}`
                setContextMenu(null)
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
              Send Message
            </button>
            <div className="context-menu-divider" />
            <button
              className="context-menu-item danger"
              onClick={() => {
                setStatusModal({
                  isOpen: true,
                  type: 'success',
                  title: 'Friend Removed',
                  message: `You are no longer friends with ${contextMenu.username}.`
                })
                setContextMenu(null)
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              Remove Friend
            </button>
          </div>
        </>
      )}

      {/* Status Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        variant="zone"
      />
    </div>
  )
}
