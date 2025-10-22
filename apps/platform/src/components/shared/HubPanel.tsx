import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBalance } from '../../contexts/BalanceContext'
import { useHyperion } from '../../contexts/HyperionContext'
import { useModuleSelector } from '../../contexts/ModuleSelectorContext'
import { TIER_COLORS } from '../hyperion/types'
import MiniRadarChart from './MiniRadarChart'

interface HubPanelProps {
  isOpen: boolean
  onToggle: () => void
  onSettingsClick?: () => void
}

interface Message {
  id: string
  user: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread?: boolean
}

interface ChatMessage {
  id: string
  sender: 'user' | 'minerva'
  content: string
  timestamp: string
}

const mockMessages: Message[] = [
  { id: '1', user: 'Alice Thompson', avatar: 'AT', lastMessage: 'Hey, did you see the latest market analysis?', timestamp: '2m ago', unread: true },
  { id: '2', user: 'Bob Chen', avatar: 'BC', lastMessage: 'Thanks for the trade tips!', timestamp: '1h ago' },
  { id: '3', user: 'Carol Williams', avatar: 'CW', lastMessage: 'Let me know when you want to discuss the portfolio', timestamp: '3h ago' },
]

const mockChatHistory: ChatMessage[] = [
  { id: '1', sender: 'minerva', content: 'Hello! How can I help you today?', timestamp: '10:23 AM' },
  { id: '2', sender: 'user', content: 'What are my current holdings?', timestamp: '10:24 AM' },
  { id: '3', sender: 'minerva', content: 'You currently hold 100 shares of NVDA, 50 shares of AAPL, and 75 shares of MSFT. Your portfolio value is $45,320.50 with an unrealized PNL of +$1,250.75.', timestamp: '10:24 AM' },
]

// Mock trait data for Quick Actions radar chart
const TRAITS_DATA = [
  { id: 'reason', name: 'Reason', icon: '/hyperion/traits/analysis.svg', level: 3.5, maxLevel: 7.0 },
  { id: 'valor', name: 'Valor', icon: '/hyperion/traits/innovation.svg', level: 2.0, maxLevel: 7.0 },
  { id: 'guard', name: 'Guard', icon: '/hyperion/traits/preservation.svg', level: 4.2, maxLevel: 7.0 },
  { id: 'accord', name: 'Accord', icon: '/hyperion/traits/resilience.svg', level: 1.5, maxLevel: 7.0 },
  { id: 'will', name: 'Will', icon: '/hyperion/traits/confidence.svg', level: 5.0, maxLevel: 7.0 },
  { id: 'flex', name: 'Flex', icon: '/hyperion/traits/versatility.svg', level: 2.8, maxLevel: 7.0 },
  { id: 'foresight', name: 'Foresight', icon: '/hyperion/traits/vision.svg', level: 3.0, maxLevel: 7.0 },
  { id: 'strike', name: 'Strike', icon: '/hyperion/traits/execution.svg', level: 4.5, maxLevel: 7.0 },
  { id: 'mind', name: 'Mind', icon: '/hyperion/traits/spirit.svg', level: 1.8, maxLevel: 7.0 },
  { id: 'truth', name: 'Truth', icon: '/hyperion/traits/integrity.svg', level: 3.2, maxLevel: 7.0 },
]

// Helper function to convert Chrysoplos name to image filename
const getImageFilename = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[']/g, '')
    .replace(/ö/g, 'o')
    .replace(/\s+/g, '-')
}

export default function HubPanel({ isOpen, onToggle, onSettingsClick }: HubPanelProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatHistory)
  const [inputMessage, setInputMessage] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const { balances } = useBalance()
  const { equippedChrysoplos, activatedArchetype } = useHyperion()
  const { setCurrentModule } = useModuleSelector()
  const navigate = useNavigate()
  const [openConversation, setOpenConversation] = useState<Message | null>(null)
  const [conversationMessages, setConversationMessages] = useState<ChatMessage[]>([])
  const [expandedView, setExpandedView] = useState<'messages' | 'syncr' | null>(null)

  const syncrChatEndRef = useRef<HTMLDivElement>(null)
  const conversationChatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll SYNCR chat to bottom
  useEffect(() => {
    syncrChatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Auto-scroll conversation to bottom
  useEffect(() => {
    conversationChatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationMessages])

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

  const handleOpenConversation = (message: Message) => {
    setOpenConversation(message)
    // Mock conversation history
    setConversationMessages([
      { id: '1', sender: 'minerva', content: message.lastMessage, timestamp: message.timestamp },
      { id: '2', sender: 'user', content: 'Thanks for the update!', timestamp: '1m ago' }
    ])
  }

  const handleCloseConversation = () => {
    setOpenConversation(null)
    setConversationMessages([])
  }

  const handleSendConversationMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    setConversationMessages([...conversationMessages, newMessage])
    setInputMessage('')
  }

  return (
    <>
      {/* Slide-out Panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] pointer-events-none"
          style={{
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {/* Panel Content */}
          <div
            className="absolute top-6 right-6 bottom-6 bg-gray-900/20 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden pointer-events-auto"
            style={{
              width: '65%',
            }}
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/shared/syncr-logo/syncr-logo.svg"
                  alt="Syncr"
                  className="w-6 h-6"
                />
                <h3 className="text-white font-geist text-lg font-medium">Control Center</h3>
              </div>
              <button
                onClick={onToggle}
                className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="px-6 pb-6 h-[calc(100%-88px)] overflow-hidden">
              {expandedView === null ? (
              /* Bento Grid Layout */
              <div className="h-full overflow-y-auto custom-scrollbar transition-opacity duration-300">
                <div className="grid gap-3 h-full" style={{
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gridTemplateRows: 'repeat(5, 1fr)'
                }}>
                {/* Unified Profile Card - Full Gradient Background */}
                <div
                  className="relative bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-cyan-900/40 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col"
                  style={{ gridColumn: '1 / 5', gridRow: '1 / 4' }}
                >
                  {/* Settings Button - Top Right */}
                  <button
                    onClick={onSettingsClick}
                    className="absolute top-4 right-4 p-2.5 hover:bg-white/10 rounded-xl transition-colors z-10"
                  >
                    <svg className="w-5 h-5 text-white/60 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  {/* Profile Section - Horizontal Layout */}
                  <div className="px-6 pt-6 pb-4 flex items-center">
                    {/* Profile Image + Username/Connected + Token Balances - All Grouped */}
                    <div className="flex items-center gap-6">
                      {/* Profile Image */}
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center border-3 border-gray-900 shadow-xl flex-shrink-0">
                        <span className="text-white text-2xl font-geist-mono">0x</span>
                      </div>

                      {/* Username and Status */}
                      <div className="flex flex-col">
                        <h4 className="text-white font-geist font-medium text-lg truncate mb-1">0x742d...4a8c</h4>
                        <p className="text-white/50 text-sm font-geist-mono-extralight">Connected</p>
                      </div>

                      {/* Token Balances - Next to Username */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="/shared/token-logos/svg-white/networth-logo.svg" alt="Networth" className="w-full h-full object-contain p-1" />
                          </div>
                          <p className="text-white text-[10px] font-geist-mono-regular">{balances.networth.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="/shared/token-logos/svg-white/influence-logo.svg" alt="Influence" className="w-full h-full object-contain p-1" />
                          </div>
                          <p className="text-white text-[10px] font-geist-mono-regular">{balances.influence.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="/shared/token-logos/svg-white/resonance-logo.svg" alt="Resonance" className="w-full h-full object-contain p-1" />
                          </div>
                          <p className="text-white text-[10px] font-geist-mono-regular">{balances.resonance.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chrysoplos & Archetype - Side by Side */}
                  <div className="flex-1 flex flex-col justify-end">
                    <div className="grid grid-cols-2 gap-3 px-6 pb-5">
                    {/* Chrysoplos Card */}
                    {equippedChrysoplos ? (
                      <button
                        onClick={() => setCurrentModule('hyperion')}
                        className="relative rounded-2xl overflow-hidden border-2 py-4 px-3 min-h-[140px] flex flex-col justify-center transition-all hover:scale-[1.02] cursor-pointer"
                        style={{
                          borderColor: TIER_COLORS[equippedChrysoplos.tier] + '80',
                          backgroundColor: TIER_COLORS[equippedChrysoplos.tier] + '15'
                        }}
                      >
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="w-48 h-48 rounded-xl flex items-center justify-center relative">
                            <img
                              src={`/hyperion/chrysoplos-images/${getImageFilename(equippedChrysoplos.name)}.png`}
                              alt={equippedChrysoplos.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-white text-sm font-geist font-medium mb-1">{equippedChrysoplos.name}</p>
                            <p className="text-white/70 text-xs font-geist-mono-extralight">{equippedChrysoplos.tagline}</p>
                          </div>
                        </div>
                      </button>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-600/20 to-gray-700/20 py-4 px-3 min-h-[140px] flex flex-col justify-center">
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs font-geist">No Chrysoplos</p>
                            <p className="text-white/40 text-xs font-geist-mono-extralight">Visit Hyperion</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Archetype Card */}
                    {activatedArchetype ? (
                      <button
                        onClick={() => setCurrentModule('hyperion')}
                        className="relative rounded-2xl overflow-hidden border-2 min-h-[140px] transition-all hover:scale-[1.02] cursor-pointer"
                        style={{
                          borderColor: activatedArchetype.tierColor + '80'
                        }}
                      >
                        {/* Full background archetype image */}
                        <img
                          src={`/shared/archetypes/archetype-webp/${activatedArchetype.tier.toLowerCase()}/${activatedArchetype.id.replace('the-', '')}.webp`}
                          alt={activatedArchetype.name}
                          className="absolute inset-0 w-full h-full object-cover object-top"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />

                        {/* Gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80"></div>

                        {/* Text content overlaid on image */}
                        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-4 px-3">
                          <p className="text-white text-sm font-geist font-medium mb-1 drop-shadow-lg">{activatedArchetype.name}</p>
                          <p className="text-white/90 text-xs font-geist-mono-extralight drop-shadow-lg">{activatedArchetype.tier}</p>
                        </div>
                      </button>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-600/20 to-gray-700/20 py-4 px-3 min-h-[140px] flex flex-col justify-center">
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs font-geist">No Archetype</p>
                            <p className="text-white/40 text-xs font-geist-mono-extralight">Visit Hyperion</p>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions - Trait Overview */}
                <div
                  className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-5 flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30"
                  style={{ gridColumn: '1 / 3', gridRow: '4 / 6' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-geist text-sm font-medium">Trait Profile</span>
                    <button
                      onClick={() => navigate('/hyperion?section=2')}
                      className="text-white/60 hover:text-white transition-colors text-xs font-geist-mono-regular"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <MiniRadarChart traits={TRAITS_DATA} size={220} />
                  </div>
                </div>

                {/* Messages Card */}
                <div
                  className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-5 flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30"
                  style={{ gridColumn: '3 / 5', gridRow: '4 / 6' }}
                >
                  {!openConversation ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-geist text-sm font-medium">Messages</span>
                          {mockMessages.some(m => m.unread) && (
                            <span className="bg-blue-500 text-white text-[9px] font-geist-mono-regular px-2 py-0.5 rounded-full">
                              {mockMessages.filter(m => m.unread).length}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setExpandedView('messages')}
                          className="text-white/60 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                          title="Expand"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </button>
                      </div>

                      {/* Messages List */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                        {mockMessages.slice(0, 3).map((message) => (
                          <div
                            key={message.id}
                            onClick={() => handleOpenConversation(message)}
                            className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                              selectedMessage === message.id
                                ? 'bg-white/15'
                                : 'hover:bg-white/10'
                            } ${message.unread ? 'bg-white/8' : ''}`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-[10px] font-geist-mono">{message.avatar}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-white text-xs font-geist font-medium truncate">{message.user}</span>
                                  <span className="text-white/40 text-[9px] font-geist-mono flex-shrink-0 ml-2">{message.timestamp}</span>
                                </div>
                                <p className="text-white/50 text-[10px] font-geist truncate">{message.lastMessage}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Conversation View */}
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          onClick={handleCloseConversation}
                          className="text-white/60 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] font-geist-mono">{openConversation.avatar}</span>
                        </div>
                        <span className="text-white font-geist text-sm font-medium">{openConversation.user}</span>
                      </div>

                      {/* Conversation Messages */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar mb-3 space-y-2">
                        {conversationMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl p-2.5 shadow-sm ${
                                msg.sender === 'user'
                                  ? 'bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl text-white border-2 border-white/30'
                                  : 'bg-white/10 text-white border border-white/10'
                              }`}
                            >
                              <p className="text-xs font-geist leading-relaxed">{msg.content}</p>
                            </div>
                            <p className="text-[9px] text-white/60 mt-1 font-geist-mono px-1">{msg.timestamp}</p>
                          </div>
                        ))}
                        <div ref={conversationChatEndRef} />
                      </div>

                      {/* Input */}
                      <div className="relative">
                        <input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendConversationMessage()}
                          placeholder="Type a message..."
                          className="w-full bg-white/10 border border-white/20 rounded-2xl pl-3 pr-10 py-2 text-white text-xs font-geist placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all"
                        />
                        <button
                          onClick={handleSendConversationMessage}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-br from-white/20 to-white/15 backdrop-blur-xl text-white p-1.5 rounded-xl border-2 border-white/40 transition-all hover:border-white/50 hover:from-white/25 hover:to-white/20"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* SYNCR AI Chat */}
                <div
                  className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-5 flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30"
                  style={{ gridColumn: '5 / 7', gridRow: '1 / 6' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-geist text-sm font-medium">SYNCR</span>
                    <button
                      onClick={() => setExpandedView('syncr')}
                      className="text-white/60 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                      title="Expand"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar mb-3 space-y-2.5">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl text-white border-2 border-white/30'
                              : 'bg-white/10 text-white border border-white/10'
                          }`}
                        >
                          <p className="text-sm font-geist leading-relaxed">{msg.content}</p>
                        </div>
                        <p className="text-[9px] text-white/60 mt-1 font-geist-mono px-1">{msg.timestamp}</p>
                      </div>
                    ))}
                    <div ref={syncrChatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask Syncr..."
                      className="w-full bg-white/10 border border-white/20 rounded-2xl pl-4 pr-11 py-2.5 text-white text-sm font-geist placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-br from-white/20 to-white/15 backdrop-blur-xl text-white p-1.5 rounded-xl border-2 border-white/40 transition-all hover:border-white/50 hover:from-white/25 hover:to-white/20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
              </div>
              ) : expandedView === 'messages' ? (
                /* Expanded Messages View */
                <div className="h-full flex flex-col bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg transition-all duration-300 animate-expandIn">
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setExpandedView(null)}
                      className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                      title="Minimize"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                      </svg>
                    </button>
                    <span className="text-white font-geist text-lg font-medium">Messages</span>
                    {mockMessages.some(m => m.unread) && (
                      <span className="bg-blue-500 text-white text-xs font-geist-mono-regular px-2.5 py-1 rounded-full">
                        {mockMessages.filter(m => m.unread).length}
                      </span>
                    )}
                  </div>

                  {!openConversation ? (
                    /* Messages List */
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                      {mockMessages.map((message) => (
                        <div
                          key={message.id}
                          onClick={() => handleOpenConversation(message)}
                          className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                            selectedMessage === message.id
                              ? 'bg-white/15'
                              : 'hover:bg-white/10'
                          } ${message.unread ? 'bg-white/8' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-geist-mono">{message.avatar}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white text-sm font-geist font-medium">{message.user}</span>
                                <span className="text-white/40 text-xs font-geist-mono flex-shrink-0 ml-2">{message.timestamp}</span>
                              </div>
                              <p className="text-white/60 text-sm font-geist">{message.lastMessage}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Conversation View */
                    <>
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                        <button
                          onClick={handleCloseConversation}
                          className="text-white/60 hover:text-white transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white text-sm font-geist-mono">{openConversation.avatar}</span>
                        </div>
                        <span className="text-white font-geist text-base font-medium">{openConversation.user}</span>
                      </div>

                      <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 space-y-3">
                        {conversationMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${
                                msg.sender === 'user'
                                  ? 'text-white border border-white/10'
                                  : 'bg-white/10 text-white border border-white/10'
                              }`}
                              style={msg.sender === 'user' ? { backgroundColor: '#ff8480' } : {}}
                            >
                              <p className="text-sm font-geist leading-relaxed">{msg.content}</p>
                            </div>
                            <p className="text-xs text-white/60 mt-1 font-geist-mono px-1">{msg.timestamp}</p>
                          </div>
                        ))}
                        <div ref={conversationChatEndRef} />
                      </div>

                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendConversationMessage()}
                          placeholder="Type a message..."
                          className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white text-sm font-geist placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all"
                        />
                        <button
                          onClick={handleSendConversationMessage}
                          className="text-white p-3 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:opacity-90"
                          style={{ backgroundColor: '#ff8480' }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Expanded SYNCR View */
                <div className="h-full flex flex-col bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg transition-all duration-300 animate-expandIn">
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setExpandedView(null)}
                      className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                      title="Minimize"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                      </svg>
                    </button>
                    <span className="text-white font-geist text-lg font-medium">SYNCR</span>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 space-y-3">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${
                            msg.sender === 'user'
                              ? 'text-white border border-white/10'
                              : 'bg-white/10 text-white border border-white/10'
                          }`}
                          style={msg.sender === 'user' ? { backgroundColor: '#ff8480' } : {}}
                        >
                          <p className="text-sm font-geist leading-relaxed">{msg.content}</p>
                        </div>
                        <p className="text-xs text-white/60 mt-1 font-geist-mono px-1">{msg.timestamp}</p>
                      </div>
                    ))}
                    <div ref={syncrChatEndRef} />
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask Syncr..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white text-sm font-geist placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="text-white p-3 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:opacity-90"
                      style={{ backgroundColor: '#ff8480' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <style>{`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateX(100%);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes expandIn {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-expandIn {
              animation: expandIn 0.3s ease-out forwards;
            }
          `}</style>
        </div>
      )}
    </>
  )
}
