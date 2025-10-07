import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Market } from '../../services/mockThemisApi'

interface ThemisMultiOptionsProps {
  market?: Market
}

interface Comment {
  id: number
  user: string
  position: string
  timestamp: string
  text: string
  likes: number
}

interface Candidate {
  id: number
  name: string
  percentage: string
  trend: string
  volume: string
  buyYesPrice: string
  buyNoPrice: string
  avatar?: string
}

export default function ThemisMultiOptions({ market }: ThemisMultiOptionsProps) {
  const navigate = useNavigate()
  const { category, question } = useParams()
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [selectedCandidate, setSelectedCandidate] = useState<string>('Zohran Mamdani')
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no'>('yes')
  const [betAmount, setBetAmount] = useState(0)
  const [commentsTab, setCommentsTab] = useState<'comments' | 'holders' | 'activity'>('comments')
  const [sortBy, setSortBy] = useState('newest')
  const [relatedTab, setRelatedTab] = useState('all')

  // Mock data - will be replaced with actual API call
  const mockMarket: Market = market || {
    id: 1,
    category: 'politics',
    question: 'New York City Mayoral Election',
    type: 'multi-option',
    volume: '$127,271,974'
  }

  const mockCandidates: Candidate[] = [
    {
      id: 1,
      name: 'Zohran Mamdani',
      percentage: '87%',
      trend: '▲ 1%',
      volume: '$28,568,153',
      buyYesPrice: '87.2¢',
      buyNoPrice: '13.1¢'
    },
    {
      id: 2,
      name: 'Andrew Cuomo',
      percentage: '13%',
      trend: '▼ 1%',
      volume: '$10,808,193',
      buyYesPrice: '12.6¢',
      buyNoPrice: '87.6¢'
    },
    {
      id: 3,
      name: 'Curtis Sliwa',
      percentage: '<1%',
      trend: '',
      volume: '$9,483,641',
      buyYesPrice: '0.3¢',
      buyNoPrice: '99.8¢'
    },
    {
      id: 4,
      name: 'Eric Adams',
      percentage: '<1%',
      trend: '',
      volume: '$8,234,521',
      buyYesPrice: '0.1¢',
      buyNoPrice: '100¢'
    }
  ]

  const mockComments: Comment[] = [
    {
      id: 1,
      user: 'politicalwatcher',
      position: '2.5k Zohran',
      timestamp: '3h ago',
      text: 'Momentum is clearly with Mamdani right now',
      likes: 12
    },
    {
      id: 2,
      user: 'NYCVoter2025',
      position: '',
      timestamp: '5h ago',
      text: 'The recent polls are showing a huge shift towards progressive candidates. This could be a landslide.',
      likes: 8
    },
    {
      id: 3,
      user: 'MarketAnalyst',
      position: '1.2K Andrew',
      timestamp: '1d ago',
      text: 'Don\'t count Cuomo out yet. His name recognition is still strong.',
      likes: 3
    }
  ]

  const mockRelatedMarkets = [
    {
      id: 1,
      logo: 'AC',
      question: 'Will Andrew Cuomo win second place in the 2025 NYC mayoral election?',
      percentage: '85%'
    },
    {
      id: 2,
      logo: 'DC',
      question: 'Will the Democratic candidate win the NYC mayoral election?',
      percentage: '87%'
    },
    {
      id: 3,
      logo: 'AC',
      question: 'Will Andrew Cuomo get more than 35% of the vote in 2025 NYC mayoral election?',
      percentage: '42%'
    }
  ]

  const selectedCandidateData = mockCandidates.find(c => c.name === selectedCandidate)

  return (
    <div className="min-h-screen bg-[#FF8480]">
      {/* Fixed Container */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/themis')}
          className="font-geist-mono text-white mb-6 hover:opacity-70 transition-opacity flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to Markets</span>
        </button>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center">
              <span className="text-white text-2xl">🗽</span>
            </div>
            <h1 className="font-geist text-white text-4xl uppercase">
              {mockMarket.question}
            </h1>
          </div>
          <div className="flex gap-6 font-geist-mono text-sm text-white/80">
            <div>
              <span className="text-white/60">Volume: </span>
              <span>{mockMarket.volume}</span>
            </div>
            <div>
              <span className="text-white/60">Category: </span>
              <span className="uppercase">{mockMarket.category}</span>
            </div>
            <div>
              <span className="text-white/60">Closes: </span>
              <span>Nov 4, 2025</span>
            </div>
          </div>
        </div>

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column - Chart & Sections (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Chart Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-[500px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-white/60 font-geist-mono mb-4">Multi-Line Chart Placeholder</div>
                <div className="text-white font-geist text-sm">
                  {mockCandidates.map((candidate, idx) => (
                    <div key={candidate.id} className="flex items-center justify-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded-full`} style={{
                        backgroundColor: idx === 0 ? '#FF8480' : idx === 1 ? '#4A90E2' : idx === 2 ? '#F5A623' : '#7ED321'
                      }} />
                      <span>{candidate.name} {candidate.percentage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Outcome Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-geist text-white text-xl">Outcome</h2>
                <div className="flex items-center gap-2 font-geist-mono text-white/60 text-sm">
                  <span>% CHANCE</span>
                  <button className="text-white/40 hover:text-white">↻</button>
                </div>
              </div>

              {/* Candidates List */}
              <div className="space-y-3">
                {mockCandidates.map((candidate, idx) => (
                  <div
                    key={candidate.id}
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-all"
                  >
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`} style={{
                      background: `linear-gradient(to bottom right, ${
                        idx === 0 ? '#FF8480, #FF6B66' :
                        idx === 1 ? '#4A90E2, #357ABD' :
                        idx === 2 ? '#F5A623, #E09419' :
                        '#7ED321, #6BC41A'
                      })`
                    }}>
                      <span className="font-geist-mono text-white text-sm font-bold">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>

                    {/* Name & Volume */}
                    <div className="flex-1 min-w-0">
                      <div className="font-geist text-white mb-1">{candidate.name}</div>
                      <div className="font-geist-mono text-white/60 text-xs">
                        {candidate.volume} Vol.
                      </div>
                    </div>

                    {/* Percentage & Trend */}
                    <div className="text-right flex items-center gap-2">
                      {candidate.trend && (
                        <span className={`font-geist-mono text-xs ${
                          candidate.trend.includes('▲') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {candidate.trend}
                        </span>
                      )}
                      <div className="font-geist-mono text-white text-2xl font-bold">
                        {candidate.percentage}
                      </div>
                    </div>

                    {/* Buy/Sell Buttons */}
                    <div className="flex gap-2">
                      <button className="font-geist-mono text-xs w-20 py-2 bg-[#FF8480] text-white rounded hover:opacity-80 transition-all">
                        Y {candidate.buyYesPrice}
                      </button>
                      <button className="font-geist-mono text-xs w-20 py-2 bg-black text-white rounded hover:opacity-80 transition-all">
                        N {candidate.buyNoPrice}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Book Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-geist text-white text-xl">Order Book</h2>
                <button className="font-geist-mono text-white/60 text-sm hover:text-white transition-colors">
                  ▼
                </button>
              </div>
              <div className="text-white/60 font-geist-mono text-sm text-center py-8">
                Order book data will appear here
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              {/* Tabs */}
              <div className="flex gap-6 mb-6 border-b border-white/20">
                <button
                  onClick={() => setCommentsTab('comments')}
                  className={`font-geist-mono pb-3 transition-colors ${
                    commentsTab === 'comments'
                      ? 'text-white border-b-2 border-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Comments (18)
                </button>
                <button
                  onClick={() => setCommentsTab('holders')}
                  className={`font-geist-mono pb-3 transition-colors ${
                    commentsTab === 'holders'
                      ? 'text-white border-b-2 border-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Top Holders
                </button>
                <button
                  onClick={() => setCommentsTab('activity')}
                  className={`font-geist-mono pb-3 transition-colors ${
                    commentsTab === 'activity'
                      ? 'text-white border-b-2 border-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Activity
                </button>
              </div>

              {/* Comment Input */}
              <div className="mb-6">
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4 mb-2">
                  <input
                    type="text"
                    placeholder="Add a comment"
                    className="flex-1 bg-transparent text-white placeholder:text-white/40 font-geist-mono text-sm outline-none"
                  />
                  <button className="font-geist-mono text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Post
                  </button>
                </div>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="font-geist-mono text-white/60 text-sm">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/10 text-white font-geist-mono text-sm px-3 py-1 rounded border border-white/20 outline-none"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <label className="flex items-center gap-2 font-geist-mono text-white/60 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Holders</span>
                  </label>
                </div>
                <div className="flex items-center gap-2 text-white/60 font-geist-mono text-xs">
                  <span>⚠️</span>
                  <span>Beware of external links</span>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="border-b border-white/10 pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />

                      {/* Comment Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-geist-mono text-white text-sm">{comment.user}</span>
                          {comment.position && (
                            <span className="font-geist-mono text-xs px-2 py-0.5 rounded bg-[#FF8480]/30 text-white">
                              {comment.position}
                            </span>
                          )}
                          <span className="font-geist-mono text-white/40 text-xs">{comment.timestamp}</span>
                        </div>
                        <p className="font-geist-mono text-white/80 text-sm mb-2">
                          {comment.text}
                        </p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
                            <span className="text-sm">♡</span>
                            <span className="font-geist-mono text-xs">{comment.likes}</span>
                          </button>
                        </div>
                      </div>

                      {/* Menu */}
                      <button className="text-white/40 hover:text-white transition-colors">
                        <span>⋯</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Context Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-geist text-white text-xl">Market Context</h2>
                <button className="font-geist-mono text-blue-400 text-sm hover:text-blue-300 transition-colors">
                  Generate
                </button>
              </div>
              <div className="text-white/60 font-geist-mono text-sm">
                Market context and additional information will appear here
              </div>
            </div>

          </div>

          {/* Right Column - Trading Panel & Related Markets (4 cols) */}
          <div className="lg:col-span-4 space-y-8">

            {/* User Info Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                <div className="font-geist text-white">Zohran Mamdani</div>
              </div>
            </div>

            {/* Trading Panel - Sticky */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">

                {/* Buy/Sell Tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setActiveTab('buy')}
                    className={`font-geist-mono flex-1 py-3 rounded transition-all ${
                      activeTab === 'buy'
                        ? 'bg-white text-black'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setActiveTab('sell')}
                    className={`font-geist-mono flex-1 py-3 rounded transition-all ${
                      activeTab === 'sell'
                        ? 'bg-white text-black'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                {/* Market Selector */}
                <div className="mb-6">
                  <label className="font-geist-mono text-white/60 text-sm mb-2 block">
                    Market
                  </label>
                  <select
                    value={selectedCandidate}
                    onChange={(e) => setSelectedCandidate(e.target.value)}
                    className="w-full bg-white/20 text-white font-geist-mono px-4 py-3 rounded border border-white/20 outline-none"
                  >
                    {mockCandidates.map((candidate) => (
                      <option key={candidate.id} value={candidate.name}>
                        {candidate.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Outcome Selection */}
                <div className="mb-6">
                  <label className="font-geist-mono text-white/60 text-sm mb-2 block">
                    Outcome
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOption('yes')}
                      className={`font-geist-mono flex-1 py-3 rounded transition-all ${
                        selectedOption === 'yes'
                          ? 'bg-[#FF8480] text-white border-2 border-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <div>Yes</div>
                      <div className="text-sm">{selectedCandidateData?.buyYesPrice}</div>
                    </button>
                    <button
                      onClick={() => setSelectedOption('no')}
                      className={`font-geist-mono flex-1 py-3 rounded transition-all ${
                        selectedOption === 'no'
                          ? 'bg-black text-white border-2 border-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <div>No</div>
                      <div className="text-sm">{selectedCandidateData?.buyNoPrice}</div>
                    </button>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="font-geist-mono text-white/60 text-sm mb-2 block">
                    Amount
                  </label>
                  <div className="bg-white/20 rounded p-4 mb-3">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-transparent text-white font-geist text-2xl outline-none"
                      min="0"
                    />
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 20, 100].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setBetAmount(betAmount + amount)}
                        className="font-geist-mono text-sm py-2 bg-white/20 text-white rounded hover:bg-white/30 transition-all"
                      >
                        +${amount}
                      </button>
                    ))}
                    <button
                      onClick={() => setBetAmount(10000)}
                      className="font-geist-mono text-sm py-2 bg-white/20 text-white rounded hover:bg-white/30 transition-all"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {/* Trade Button */}
                <button
                  className="w-full font-geist-mono py-4 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors mb-4"
                  disabled={betAmount === 0}
                >
                  Trade
                </button>

                <div className="text-center">
                  <span className="font-geist-mono text-xs text-white/60">
                    By trading, you agree to the <span className="underline cursor-pointer">Terms of Use</span>
                  </span>
                </div>
              </div>

              {/* Related Markets - Sticky */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                {/* Tabs */}
                <div className="flex gap-4 mb-4 overflow-x-auto">
                  {['All', 'Politics', 'Elections', 'NYC Mayor'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setRelatedTab(tab.toLowerCase())}
                      className={`font-geist-mono text-sm whitespace-nowrap transition-colors ${
                        relatedTab === tab.toLowerCase()
                          ? 'text-white'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Related Markets List */}
                <div className="space-y-3">
                  {mockRelatedMarkets.map((market) => (
                    <div
                      key={market.id}
                      className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                    >
                      {/* Logo */}
                      <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="font-geist-mono text-white text-xs font-bold">{market.logo}</span>
                      </div>

                      {/* Question & Percentage */}
                      <div className="flex-1 min-w-0">
                        <p className="font-geist text-white text-sm mb-1 truncate">
                          {market.question}
                        </p>
                      </div>

                      <div className="font-geist-mono text-white text-lg font-bold">
                        {market.percentage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
