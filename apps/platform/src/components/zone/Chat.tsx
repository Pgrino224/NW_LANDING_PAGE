import { useState } from 'react'
import ProfilePreviewModal from './ProfilePreviewModal'
import './Chat.css'

interface Message {
  id: string
  userId: string
  username: string
  avatar?: string
  content: string
  timestamp: string
  date?: string
}

interface ChatProps {
  recipient?: string
  isGlobalChat?: boolean
}

const mockMessages: Message[] = [
  {
    id: '1',
    userId: '1',
    username: 'Joey',
    content: 'Everyone gets OG role btw, I kinda promised people without permission so... My bad',
    timestamp: 'Yesterday at 1:00 PM',
    date: 'October 14, 2025'
  },
  {
    id: '2',
    userId: '2',
    username: 'pellegrino',
    content: "It's cool",
    timestamp: 'Yesterday at 1:00 PM'
  },
  {
    id: '3',
    userId: '1',
    username: 'Joey',
    content: 'Yoo\nYou can make me a Mod, so the situation that once I spot any situation like what happened today, I can handle it immediately',
    timestamp: 'Yesterday at 2:53 PM'
  },
  {
    id: '4',
    userId: '2',
    username: 'pellegrino',
    content: 'Will do',
    timestamp: 'Yesterday at 2:54 PM'
  },
  {
    id: '5',
    userId: '1',
    username: 'Joey',
    content: 'Yoo',
    timestamp: '7:58 AM',
    date: 'October 15, 2025'
  },
  {
    id: '6',
    userId: '1',
    username: 'Joey',
    content: 'Gm champ',
    timestamp: '8:00 AM'
  }
]

export default function Chat({ recipient = 'User', isGlobalChat = false }: ChatProps) {
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<Message | null>(null)

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Filter messages based on search query
  const filteredMessages = searchQuery
    ? mockMessages.filter(msg =>
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockMessages

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-recipient-avatar"></div>
          <h2 className="chat-recipient-name">{isGlobalChat ? 'Global Chat' : recipient}</h2>
        </div>
        <div className="chat-header-actions">
          <input
            type="text"
            className="chat-search-input"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        {filteredMessages.map((msg, index) => {
          const showDate = msg.date && (index === 0 || filteredMessages[index - 1].date !== msg.date)

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="chat-date-separator">
                  <span>{msg.date}</span>
                </div>
              )}
              <div className="chat-message">
                <div
                  className="chat-message-avatar clickable"
                  onClick={() => setSelectedUser(msg)}
                ></div>
                <div className="chat-message-content">
                  <div className="chat-message-header">
                    <span
                      className="chat-message-username clickable"
                      onClick={() => setSelectedUser(msg)}
                    >
                      {msg.username}
                    </span>
                    <span className="chat-message-timestamp">{msg.timestamp}</span>
                  </div>
                  <div className="chat-message-text">{msg.content}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Message Input */}
      <div className="chat-input-container">
        <button className="chat-input-action">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder={`Message ${isGlobalChat ? 'Global Chat' : '@' + recipient}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <div className="chat-input-actions">
          <button className="chat-input-action">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="chat-input-action">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Profile Preview Modal */}
      {selectedUser && (
        <ProfilePreviewModal
          userId={selectedUser.userId}
          username={selectedUser.username}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}
