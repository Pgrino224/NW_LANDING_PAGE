import { useState } from 'react'

interface MinervaPanelProps {
  isOpen: boolean
  onToggle: () => void
  messagesHeight: number
}

interface ChatMessage {
  id: string
  sender: 'user' | 'minerva'
  content: string
  timestamp: string
}

const mockChatHistory: ChatMessage[] = [
  { id: '1', sender: 'minerva', content: 'Hello! How can I help you today?', timestamp: '10:23 AM' },
  { id: '2', sender: 'user', content: 'What are my current holdings?', timestamp: '10:24 AM' },
  { id: '3', sender: 'minerva', content: 'You currently hold 100 shares of NVDA, 50 shares of AAPL, and 75 shares of MSFT. Your portfolio value is $45,320.50 with an unrealized PNL of +$1,250.75.', timestamp: '10:24 AM' },
]

export default function MinervaPanel({ isOpen, onToggle, messagesHeight }: MinervaPanelProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatHistory)
  const [inputMessage, setInputMessage] = useState('')

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    setChatMessages([...chatMessages, newMessage])
    setInputMessage('')

    // Simulate Minerva response
    setTimeout(() => {
      const minervaResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'minerva',
        content: 'I\'m processing your request...',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, minervaResponse])
    }, 1000)
  }

  return (
    <>
      {/* Square Button */}
      <button
        onClick={onToggle}
        className="fixed right-6 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-2xl transition-all duration-300 flex items-center justify-center"
        style={{
          bottom: `${messagesHeight + 16}px`,
          width: '56px',
          height: '56px',
          zIndex: 1000
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Slide-up Panel */}
      <div
        className="fixed right-6 bg-[#0a0a0a] border border-white/20 rounded-t-lg shadow-2xl transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          bottom: 0,
          width: '400px',
          height: isOpen ? '600px' : '0px',
          zIndex: 998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-600/20 to-blue-600/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-geist text-base">Minerva</h3>
              <p className="text-white/50 font-geist-mono-extralight text-[10px]">AI Assistant</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Currency Balances */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#0f0f0f]">
          <h4 className="text-white/50 font-geist text-xs mb-3">Your Balances</h4>
          <div className="grid grid-cols-3 gap-3">
            {/* Networth */}
            <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <img
                src="/shared/token-logos/networth-logo.svg"
                alt="Networth"
                className="w-8 h-8 mb-2"
              />
              <span className="text-white font-geist-mono-regular text-sm">12,450</span>
              <span className="text-white/50 font-geist text-[10px] mt-0.5">Networth</span>
            </div>

            {/* Influence */}
            <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <img
                src="/shared/token-logos/influence-logo.svg"
                alt="Influence"
                className="w-8 h-8 mb-2"
              />
              <span className="text-white font-geist-mono-regular text-sm">8,732</span>
              <span className="text-white/50 font-geist text-[10px] mt-0.5">Influence</span>
            </div>

            {/* Resonance */}
            <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <img
                src="/shared/token-logos/resonance-logo.svg"
                alt="Resonance"
                className="w-8 h-8 mb-2"
              />
              <span className="text-white font-geist-mono-regular text-sm">5,291</span>
              <span className="text-white/50 font-geist text-[10px] mt-0.5">Resonance</span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4" style={{ height: 'calc(100% - 240px)' }}>
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'bg-blue-600' : 'bg-white/10'} rounded-lg px-4 py-2`}>
                <p className="text-white font-geist text-sm">{message.content}</p>
                <span className="text-white/50 font-geist-mono-extralight text-[10px] mt-1 block">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything"
              className="flex-1 bg-white/5 border border-white/10 text-white font-geist text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-white/20 placeholder:text-white/30"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-geist text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 font-geist text-[10px] rounded transition-colors">
              Create Images
            </button>
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 font-geist text-[10px] rounded transition-colors">
              Edit Image
            </button>
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 font-geist text-[10px] rounded transition-colors">
              Latest News
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
