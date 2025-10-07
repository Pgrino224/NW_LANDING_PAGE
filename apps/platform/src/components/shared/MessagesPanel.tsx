import { useState } from 'react'

interface MessagesPanelProps {
  isOpen: boolean
  onToggle: () => void
}

interface Message {
  id: string
  user: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread?: boolean
}

const mockMessages: Message[] = [
  { id: '1', user: 'Alice Thompson', avatar: 'AT', lastMessage: 'Hey, did you see the latest market analysis?', timestamp: '2m ago', unread: true },
  { id: '2', user: 'Bob Chen', avatar: 'BC', lastMessage: 'Thanks for the trade tips!', timestamp: '1h ago' },
  { id: '3', user: 'Carol Williams', avatar: 'CW', lastMessage: 'Let me know when you want to discuss the portfolio', timestamp: '3h ago' },
]

export default function MessagesPanel({ isOpen, onToggle }: MessagesPanelProps) {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)

  return (
    <div
      className="fixed right-6 bg-[#0a0a0a] border border-white/20 rounded-t-lg shadow-2xl transition-all duration-300 ease-in-out"
      style={{
        bottom: 0,
        width: '360px',
        height: isOpen ? '500px' : '48px',
        zIndex: 999
      }}
    >
      {/* Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-white font-geist text-base">Messages</span>
          {mockMessages.some(m => m.unread) && (
            <span className="bg-blue-500 text-white text-[10px] font-geist-mono-regular px-1.5 py-0.5 rounded-full">
              {mockMessages.filter(m => m.unread).length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <svg
            className={`w-4 h-4 text-white/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content - Only visible when open */}
      {isOpen && (
        <div className="flex flex-col h-[calc(100%-48px)]">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {mockMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => setSelectedMessage(message.id)}
                className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition-colors border-b border-white/5 ${
                  selectedMessage === message.id ? 'bg-white/5' : ''
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-geist text-sm">{message.avatar}</span>
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-geist text-sm truncate">{message.user}</span>
                    <span className="text-white/50 font-geist-mono-extralight text-[10px] ml-2">
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="text-white/70 font-geist-mono-extralight text-xs truncate">
                    {message.lastMessage}
                  </p>
                </div>

                {/* Unread Indicator */}
                {message.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </button>
            ))}
          </div>

          {/* New Message Button */}
          <div className="p-3 border-t border-white/10">
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white font-geist text-sm rounded transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Message
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
