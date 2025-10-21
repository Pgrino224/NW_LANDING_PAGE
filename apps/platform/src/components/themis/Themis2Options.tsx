import { useState, useMemo, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Market, Comment as ApiComment, Holder, ActivityItem, HoldersResponse } from '../../services/api/themisApi'
import { themisApi } from '../../services/api/themisApi'
import { useBalance } from '../../contexts/BalanceContext'
import Dropdown from '../shared/Dropdown'
import AreaChartThemis from '../charts/AreaChartThemis'
import OrderBookTable from '../shared/OrderBookTable'
import { mockBinaryPriceHistory } from '../../data/mockChartData'
import StatusModal from '../common/StatusModal'
import NetworthIcon from '../shared/NetworthIcon'

interface Themis2OptionsProps {
  market?: Market
}

export default function Themis2Options({ market: propMarket }: Themis2OptionsProps) {
  const navigate = useNavigate()
  const { refreshBalance } = useBalance()
  const params = useParams<{ category: string; questionSlug: string }>()

  const [market, setMarket] = useState<Market | null>(propMarket || null)
  const [loading, setLoading] = useState(!propMarket)
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no'>('yes')
  const [betAmount, setBetAmount] = useState(0)
  const [commentsTab, setCommentsTab] = useState<'comments' | 'holders' | 'activity'>('comments')
  const [sortBy, setSortBy] = useState('newest')
  const [relatedTab, setRelatedTab] = useState('all')
  const [activityMinAmount, setActivityMinAmount] = useState<string>('All')
  const [orderBookExpanded, setOrderBookExpanded] = useState(true)
  const [chartTimeInterval, setChartTimeInterval] = useState('1M')
  const [isTrading, setIsTrading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [comments, setComments] = useState<ApiComment[]>([])
  const [newCommentText, setNewCommentText] = useState('')
  const [holdersOnly, setHoldersOnly] = useState(false)
  const [userBalance, setUserBalance] = useState(0)
  const [relatedMarkets, setRelatedMarkets] = useState<Market[]>([])
  const [holders, setHolders] = useState<HoldersResponse>({ marketId: 0, yes: [], no: [] })
  const [activity, setActivity] = useState<ActivityItem[]>([])

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({ isOpen: false, type: 'success', title: '', message: '' })

  // Filter markets based on selected tab and category
  const filteredRelatedMarkets = useMemo(() => {
    if (!market) return []
    if (relatedTab === 'all' || relatedTab === market.category) {
      return relatedMarkets
    }
    return relatedMarkets.filter(m => m.category === relatedTab)
  }, [relatedMarkets, relatedTab, market])

  const calculatePotentialWin = (amount: number, percentage: string) => {
    const percent = parseInt(percentage) / 100
    return Math.floor(amount / percent)
  }

  // Filter and sort comments
  const filteredAndSortedComments = useMemo(() => {
    let filtered = [...comments]

    // Filter by holders only
    if (holdersOnly) {
      filtered = filtered.filter(c => c.isHolder)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        case 'popular':
          return b.likes - a.likes
        case 'newest':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
    })

    return filtered
  }, [comments, sortBy, holdersOnly])

  // Filter activity by min amount
  const filteredActivity = useMemo(() => {
    let filtered = [...activity]

    if (activityMinAmount !== 'All') {
      const minAmount = parseInt(activityMinAmount.replace('$', '').replace('+', ''))
      filtered = filtered.filter(a => {
        const amount = parseInt(a.dollarValue.replace('$', ''))
        return amount >= minAmount
      })
    }

    return filtered
  }, [activity, activityMinAmount])

  // Load market from API if not provided via props
  useEffect(() => {
    if (propMarket) {
      setMarket(propMarket)
      setLoading(false)
      return
    }

    const loadMarket = async () => {
      if (!params.questionSlug) return

      try {
        const loadedMarket = await themisApi.getMarketByQuestionSlug(params.questionSlug)
        setMarket(loadedMarket || null)
      } catch (error) {
        console.error('Error loading market:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMarket()
  }, [propMarket, params.questionSlug])

  useEffect(() => {
    const loadComments = async () => {
      if (!market) return
      try {
        const marketComments = await themisApi.getComments(market.id)
        setComments(marketComments)
      } catch (error) {
        console.error('Error loading comments:', error)
      }
    }
    loadComments()
  }, [market?.id])

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const balance = await themisApi.getUserBalance()
        setUserBalance(balance.networth)
      } catch (error) {
        console.error('Error loading balance:', error)
      }
    }
    loadBalance()
  }, [])

  useEffect(() => {
    const loadRelatedMarkets = async () => {
      if (!market) return
      try {
        const allMarkets = await themisApi.getMarkets()
        // Filter by same category, exclude current market
        const filtered = allMarkets.filter(m =>
          m.category === market.category && m.id !== market.id
        )
        setRelatedMarkets(filtered)
      } catch (error) {
        console.error('Error loading related markets:', error)
      }
    }
    loadRelatedMarkets()
  }, [market?.id, market?.category])

  // Load holders when market changes
  useEffect(() => {
    const loadHolders = async () => {
      if (!market) return
      try {
        const holdersData = await themisApi.getHolders(market.id)
        setHolders(holdersData)
      } catch (error) {
        console.error('Error loading holders:', error)
      }
    }
    loadHolders()
  }, [market?.id])

  // Load activity when market changes
  useEffect(() => {
    const loadActivity = async () => {
      if (!market) return
      try {
        const activityData = await themisApi.getActivity(market.id)
        setActivity(activityData)
      } catch (error) {
        console.error('Error loading activity:', error)
      }
    }
    loadActivity()
  }, [market?.id])

  // Helper function to convert question to slug
  const questionToSlug = (question: string) => {
    return question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handlePostComment = async () => {
    if (!newCommentText.trim() || !market) return

    try {
      const newComment = await themisApi.addComment({
        marketId: market.id,
        user: 'Anonymous',
        text: newCommentText,
        position: '',
        isHolder: false
      })
      setComments([newComment, ...comments])
      setNewCommentText('')
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  const handleTrade = async () => {
    if (betAmount === 0 || !market) return

    setIsTrading(true)

    try {
      await themisApi.placeBet({
        marketId: market.id,
        type: activeTab,
        outcome: selectedOption,
        amount: betAmount
      })

      setStatusModal({
        isOpen: true,
        type: 'success',
        title: 'Trade Successful',
        message: `Successfully ${activeTab === 'buy' ? 'bought' : 'sold'} ${betAmount} shares of ${selectedOption.toUpperCase()}.`
      })

      // Refresh global balance
      await refreshBalance()

      // Update local balance display
      const balance = await themisApi.getUserBalance()
      setUserBalance(balance.networth)

      // Reset form after modal closes
      setTimeout(() => {
        setBetAmount(0)
      }, 3000)
    } catch (error) {
      console.error('Trade failed:', error)
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Trade Failed',
        message: 'Failed to place trade. Please try again.'
      })
    } finally {
      setIsTrading(false)
    }
  }

  // Convert mock data to TradingView format with time filtering
  const chartData = useMemo(() => {
    const now = Date.now()
    let cutoffTime = 0

    // Calculate cutoff time based on selected interval
    switch (chartTimeInterval) {
      case '1H':
        cutoffTime = now - (60 * 60 * 1000) // 1 hour
        break
      case '1D':
        cutoffTime = now - (24 * 60 * 60 * 1000) // 1 day
        break
      case '1W':
        cutoffTime = now - (7 * 24 * 60 * 60 * 1000) // 1 week
        break
      case '1M':
        cutoffTime = now - (30 * 24 * 60 * 60 * 1000) // 30 days
        break
      case '1Y':
        cutoffTime = now - (365 * 24 * 60 * 60 * 1000) // 1 year
        break
      case 'ALL':
        cutoffTime = 0 // Show all data
        break
      default:
        cutoffTime = now - (30 * 24 * 60 * 60 * 1000) // Default to 1 month
    }

    return mockBinaryPriceHistory.yes
      .filter(point => new Date(point.timestamp).getTime() >= cutoffTime)
      .map(point => ({
        time: Math.floor(new Date(point.timestamp).getTime() / 1000),
        value: point.price * 100 // Convert 0-1 to 0-100 percentage
      }))
  }, [chartTimeInterval])

  const themisScrollbarStyles = `
    .themis-scrollbar::-webkit-scrollbar {
      width: 0.2px !important;
      height: 0.2px !important;
    }
    .themis-scrollbar::-webkit-scrollbar-track {
      background: transparent !important;
      background-color: transparent !important;
    }
    .themis-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.6) !important;
      border-radius: 0.5px !important;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.8) !important;
    }
    .themis-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.8) !important;
      box-shadow: 0 0 6px rgba(0, 0, 0, 1) !important;
    }
    .themis-scrollbar::-webkit-scrollbar-button {
      display: none !important;
    }
    .themis-scrollbar {
      scrollbar-width: thin !important;
      scrollbar-color: rgba(0, 0, 0, 0.6) transparent !important;
    }
  `

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: 'url(/themis/themis-bg/themis-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="text-[#ffffe4] font-geist">Loading market...</div>
      </div>
    )
  }

  if (!market) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: 'url(/themis/themis-bg/themis-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="text-[#ffffe4] font-geist">Market not found</div>
      </div>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themisScrollbarStyles }} />
      <div className="min-h-screen" style={{
        backgroundImage: 'url(/themis/themis-bg/themis-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      {/* Fixed Container */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/themis')}
          className="font-geist-mono text-[#ffffe4] mb-6 hover:opacity-70 transition-opacity flex items-center gap-2 border border-white/20 rounded px-4 py-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"
        >
          <span>←</span>
          <span>Back to Markets</span>
        </button>

        {/* Header Section */}
        <div className="mb-8">
          {/* Title and Info Container with Square Image */}
          <div className="flex items-center gap-6 p-6 border border-white/20 rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg">
            {/* Left: Square image */}
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={market.imageUrl || '/themis/questions/themis-test.png'}
                alt="Market question"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Question and metadata */}
            <div className="flex-1">
              <h1 className="font-geist-bold text-[#ffffe4] text-4xl mb-1 uppercase">
                {market.question}
              </h1>
              <div className="flex gap-6 font-geist-mono text-sm text-[#ffffe4]/80 items-center">
                <div>
                  <span className="text-[#ffffe4]/60">Volume: </span>
                  <span>{market.volume}</span>
                </div>
                <div>
                  <span className="text-[#ffffe4]/60">Category: </span>
                  <span className="uppercase">{market.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ffffe4]/60">Closes: </span>
                  <span>Oct 22, 2025</span>
                  {/* Save Button */}
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className="p-1 rounded hover:bg-black/10 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill={isSaved ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column - Chart & Sections (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Chart Section */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-6">
              {/* Chart Header with Percentage and Time Intervals */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <span className="font-geist text-[#ffffe4] text-3xl font-bold">{market.yes}</span>
                  <span className="font-geist text-[#ffffe4] text-3xl font-bold">Chance</span>
                  <span className="font-geist-mono text-lime-500 text-sm">▲ 2%</span>
                </div>
                <div className="flex gap-1">
                  {['1H', '1D', '1W', '1M', '1Y', 'ALL'].map((interval) => (
                    <button
                      key={interval}
                      onClick={() => setChartTimeInterval(interval)}
                      className={`font-geist-mono text-xs px-3 py-1 rounded transition-all border border-white/20 ${
                        chartTimeInterval === interval
                          ? 'bg-black/20 text-[#ffffe4]'
                          : 'text-[#ffffe4]/40 hover:text-[#ffffe4]/60'
                      }`}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
              </div>

              <AreaChartThemis
                data={chartData}
                color="#84cc16"
                height="500px"
                theme="dark"
              />
            </div>

            {/* Order Book Section */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4 px-6 pt-4 pb-4 border-b border-white/20">
                <h2 className="font-geist text-[#ffffe4] text-xl">Order Book</h2>
                <button
                  onClick={() => setOrderBookExpanded(!orderBookExpanded)}
                  className="font-geist-mono text-[#ffffe4]/60 text-sm hover:text-[#ffffe4] transition-colors"
                >
                  {orderBookExpanded ? '▼' : '▶'}
                </button>
              </div>

              {/* Collapsible Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  orderBookExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <OrderBookTable />
                </div>
              </div>
            </div>

            {/* Market Context Section */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4 px-6 pt-4 pb-4 border-b border-white/20">
                <h2 className="font-geist text-[#ffffe4] text-xl">Market Context</h2>
                <button className="font-geist-mono text-[#ffffe4] text-sm hover:text-[#ffffe4]/70 transition-colors border border-white/20 rounded px-3 py-1">
                  Generate
                </button>
              </div>
              <div className="text-[#ffffe4]/60 font-geist-mono text-sm px-6 pb-6">
                Market context and additional information will appear here
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-6">
              {/* Tabs */}
              <div className="flex gap-6 mb-6 border-b border-white/20">
                <button
                  onClick={() => setCommentsTab('comments')}
                  className={`font-geist-mono pb-3 transition-colors ${
                    commentsTab === 'comments'
                      ? 'text-[#ffffe4] border-b-2 border-[#ffffe4]'
                      : 'text-[#ffffe4]/60 hover:text-[#ffffe4]'
                  }`}
                >
                  Comments (24)
                </button>
                <button
                  onClick={() => setCommentsTab('holders')}
                  className={`font-geist-mono pb-3 transition-colors ${
                    commentsTab === 'holders'
                      ? 'text-[#ffffe4] border-b-2 border-[#ffffe4]'
                      : 'text-[#ffffe4]/60 hover:text-[#ffffe4]'
                  }`}
                >
                  Top Holders
                </button>
                <button
                  onClick={() => setCommentsTab('activity')}
                  className={`font-geist-mono pb-3 transition-colors ${
                    commentsTab === 'activity'
                      ? 'text-[#ffffe4] border-b-2 border-[#ffffe4]'
                      : 'text-[#ffffe4]/60 hover:text-[#ffffe4]'
                  }`}
                >
                  Activity
                </button>
              </div>

              {/* Tab Content */}
              {commentsTab === 'comments' && (
                <div>
                  {/* Comment Input */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 bg-black/5 rounded-lg p-4 mb-2 border border-white/20">
                      <input
                        type="text"
                        placeholder="Add a comment"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                        className="flex-1 bg-transparent text-[#ffffe4] placeholder:text-[#ffffe4]/40 font-geist-mono text-sm outline-none"
                      />
                      <button
                        onClick={handlePostComment}
                        disabled={!newCommentText.trim()}
                        className="font-geist-mono text-sm text-[#ffffe4] hover:text-[#ffffe4]/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 rounded px-3 py-1"
                      >
                        Post
                      </button>
                    </div>
                  </div>

                  {/* Sort Controls */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Dropdown
                        value={sortBy}
                        onChange={setSortBy}
                        options={[
                          { value: 'newest', label: 'Newest' },
                          { value: 'oldest', label: 'Oldest' },
                          { value: 'popular', label: 'Most Popular' }
                        ]}
                      />
                      <label className="flex items-center gap-2 font-geist-mono text-[#ffffe4]/60 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={holdersOnly}
                          onChange={(e) => setHoldersOnly(e.target.checked)}
                          className="rounded"
                        />
                        <span>Holders</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2 text-[#ffffe4]/60 font-geist-mono text-xs">
                      <span>⚠️</span>
                      <span>Beware of external links</span>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                {filteredAndSortedComments.map((comment) => (
                  <div key={comment.id} className="border-b border-white/10 pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />

                      {/* Comment Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-geist-mono text-[#ffffe4] text-sm">{comment.user}</span>
                          {comment.position && (
                            <span className={`font-geist-mono text-xs px-2 py-0.5 rounded ${
                              comment.position.includes('Yes')
                                ? 'bg-[#FF8480]/30 text-[#ffffe4]'
                                : 'bg-black/30 text-[#ffffe4]'
                            }`}>
                              {comment.position}
                            </span>
                          )}
                          <span className="font-geist-mono text-[#ffffe4]/40 text-xs">{comment.timestamp}</span>
                        </div>
                        <p className="font-geist-mono text-[#ffffe4]/80 text-sm mb-2">
                          {comment.text}
                        </p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-[#ffffe4]/60 hover:text-[#ffffe4] transition-colors">
                            <span className="text-sm">♡</span>
                            <span className="font-geist-mono text-xs">{comment.likes}</span>
                          </button>
                        </div>
                      </div>

                      {/* Menu */}
                      <button className="text-[#ffffe4]/40 hover:text-[#ffffe4] transition-colors">
                        <span>⋯</span>
                      </button>
                    </div>
                  </div>
                ))}
                  </div>
                </div>
              )}

              {/* Top Holders Tab Content */}
              {commentsTab === 'holders' && (
                <div>
                  {/* Two Column Holders Layout */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Yes Holders */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-geist-mono text-[#ffffe4] text-sm">Yes holders</h3>
                        <span className="font-geist-mono text-[#ffffe4]/60 text-xs">SHARES</span>
                      </div>
                      <div className="space-y-3">
                        {holders.yes.map((holder) => (
                          <div key={holder.id} className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex-shrink-0"
                              style={{ background: holder.avatar }}
                            />
                            <span className="font-geist-mono text-[#ffffe4] text-sm flex-1 truncate">
                              {holder.username}
                            </span>
                            <span className="font-geist-mono text-lime-400 text-sm">
                              {holder.shares}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* No Holders */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-geist-mono text-[#ffffe4] text-sm">No holders</h3>
                        <span className="font-geist-mono text-[#ffffe4]/60 text-xs">SHARES</span>
                      </div>
                      <div className="space-y-3">
                        {holders.no.map((holder) => (
                          <div key={holder.id} className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex-shrink-0"
                              style={{ background: holder.avatar }}
                            />
                            <span className="font-geist-mono text-[#ffffe4] text-sm flex-1 truncate">
                              {holder.username}
                            </span>
                            <span className="font-geist-mono text-red-400 text-sm">
                              {holder.shares}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab Content */}
              {commentsTab === 'activity' && (
                <div>
                  {/* Filter Dropdown */}
                  <div className="mb-6">
                    <Dropdown
                      value={activityMinAmount}
                      onChange={setActivityMinAmount}
                      options={[
                        { value: 'All', label: 'Min amount' },
                        { value: '10', label: '$10+' },
                        { value: '50', label: '$50+' },
                        { value: '100', label: '$100+' }
                      ]}
                    />
                  </div>

                  {/* Activity Feed */}
                  <div className="space-y-3">
                    {filteredActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 py-2">
                        {/* Avatar */}
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0"
                          style={{ background: activity.avatar }}
                        />

                        {/* Activity Details */}
                        <div className="flex-1 font-geist-mono text-sm text-[#ffffe4]">
                          <span className="text-[#ffffe4]">{activity.username}</span>
                          {' '}
                          <span className="text-[#ffffe4]/60">{activity.action}</span>
                          {' '}
                          <span className={activity.type === 'yes' ? 'text-lime-400' : 'text-red-400'}>
                            {activity.amount}
                          </span>
                          {' '}
                          <span className="text-[#ffffe4]/60">at {activity.price}</span>
                          {' '}
                          <span className="text-[#ffffe4]/40">({activity.dollarValue})</span>
                        </div>

                        {/* Timestamp */}
                        <span className="font-geist-mono text-[#ffffe4]/40 text-xs">
                          {activity.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Trading Panel & Related Markets (4 cols) */}
          <div className="lg:col-span-4 space-y-8">

            {/* Trading Panel - Sticky */}
            <div className="lg:sticky lg:top-8 space-y-8">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-6">

                {/* Buy/Sell Tabs */}
                <div className="flex gap-6 mb-6 border-b border-white/20">
                  <button
                    onClick={() => setActiveTab('buy')}
                    className={`font-geist text-base py-2 relative ${
                      activeTab === 'buy'
                        ? 'text-[#ffffe4]'
                        : 'text-[#ffffe4]/50'
                    }`}
                    style={{ transition: 'all 0.2s ease', transform: 'scale(1)' }}
                    onMouseEnter={(e) => {
                      if (activeTab !== 'buy') {
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    Buy
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffffe4] transition-all duration-300 ease-out ${
                        activeTab === 'buy' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setActiveTab('sell')}
                    className={`font-geist text-base py-2 relative ${
                      activeTab === 'sell'
                        ? 'text-[#ffffe4]'
                        : 'text-[#ffffe4]/50'
                    }`}
                    style={{ transition: 'all 0.2s ease', transform: 'scale(1)' }}
                    onMouseEnter={(e) => {
                      if (activeTab !== 'sell') {
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    Sell
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffffe4] transition-all duration-300 ease-out ${
                        activeTab === 'sell' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Outcome Selection */}
                <div className="mb-6">
                  <label className="font-geist-mono text-[#ffffe4]/60 text-sm mb-2 block">
                    Outcome
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOption('yes')}
                      className="font-geist-mono flex-1 py-3 rounded text-white"
                      style={{
                        backgroundColor: selectedOption === 'yes' ? '#a3e635' : '#84cc16',
                        transform: 'scale(1)',
                        filter: 'brightness(1)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedOption !== 'yes') {
                          e.currentTarget.style.transform = 'scale(1.02)'
                          e.currentTarget.style.filter = 'brightness(1.1)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedOption !== 'yes') {
                          e.currentTarget.style.transform = 'scale(1)'
                          e.currentTarget.style.filter = 'brightness(1)'
                        }
                      }}
                    >
                      Yes {market.yes}
                    </button>
                    <button
                      onClick={() => setSelectedOption('no')}
                      className="font-geist-mono flex-1 py-3 rounded text-white"
                      style={{
                        backgroundColor: selectedOption === 'no' ? '#f87171' : '#ef4444',
                        transform: 'scale(1)',
                        filter: 'brightness(1)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedOption !== 'no') {
                          e.currentTarget.style.transform = 'scale(1.02)'
                          e.currentTarget.style.filter = 'brightness(1.1)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedOption !== 'no') {
                          e.currentTarget.style.transform = 'scale(1)'
                          e.currentTarget.style.filter = 'brightness(1)'
                        }
                      }}
                    >
                      No {market.no}
                    </button>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-geist-mono text-[#ffffe4]/60 text-sm">
                      Amount
                    </label>
                    <span className="font-geist-mono text-[#ffffe4]/60 text-xs inline-flex items-baseline">
                      Balance: <NetworthIcon className="w-3 h-3" />{userBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-transparent border border-[#ffffe4]/20 rounded p-4 mb-1">
                    <input
                      type="number"
                      value={betAmount || ''}
                      onChange={(e) => setBetAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-transparent text-[#ffffe4] font-geist text-2xl outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="0"
                    />
                  </div>

                  {/* Sliding Payout Panel */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out mb-3 ${
                      betAmount > 0 ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="bg-black/5 rounded-lg p-4 space-y-3">
                      {/* Odds */}
                      <div className="flex justify-between items-center">
                        <span className="font-geist-mono text-[#ffffe4]/60 text-sm">Odds</span>
                        <span className="font-geist-mono text-[#ffffe4] text-sm">
                          {selectedOption === 'yes' ? market.yes : market.no} chance
                        </span>
                      </div>

                      {/* Payout */}
                      <div className="flex justify-between items-center">
                        <span className="font-geist-mono text-[#ffffe4]/60 text-sm">
                          Payout if {selectedOption === 'yes' ? 'Yes' : 'No'}
                        </span>
                        <span className="font-geist text-lime-400 text-2xl font-bold">
                          ${calculatePotentialWin(betAmount, selectedOption === 'yes' ? market.yes || '76%' : market.no || '24%')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="flex justify-end gap-2">
                    {[1, 20, 100].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setBetAmount(betAmount + amount)}
                        className="font-geist-mono text-xs py-1 px-2 bg-transparent border border-[#ffffe4]/20 text-[#ffffe4] rounded hover:bg-black/10 transition-all inline-flex items-baseline justify-center"
                      >
                        +<NetworthIcon className="w-3 h-3" />{amount}
                      </button>
                    ))}
                    <button
                      onClick={() => setBetAmount(10000)}
                      className="font-geist-mono text-xs py-1 px-2 bg-transparent border border-[#ffffe4]/20 text-[#ffffe4] rounded hover:bg-black/10 transition-all"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {/* Trade Button */}
                <button
                  onClick={handleTrade}
                  className="w-full font-geist-mono py-4 rounded transition-colors mb-4 bg-[#ffffe4] text-black hover:bg-[#ffffd0]"
                  disabled={betAmount === 0 || isTrading}
                >
                  {isTrading ? 'Processing...' : 'Trade'}
                </button>

                <div className="text-center">
                  <span className="font-geist-mono text-xs text-[#ffffe4]/60">
                    By trading, you agree to the <span className="underline cursor-pointer">Terms of Use</span>
                  </span>
                </div>
              </div>

              {/* Related Markets */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-6">
              {/* Tabs */}
              <div className="flex gap-4 mb-4 overflow-x-auto themis-scrollbar">
                {['All', 'Finance', 'Crypto', 'Economics', 'Politics'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setRelatedTab(tab.toLowerCase())}
                    className={`font-geist-mono text-sm whitespace-nowrap transition-colors ${
                      relatedTab === tab.toLowerCase()
                        ? 'text-[#ffffe4]'
                        : 'text-[#ffffe4]/60 hover:text-[#ffffe4]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Related Markets List */}
              <div className="space-y-3">
                {filteredRelatedMarkets.map((market) => {
                  const marketSlug = questionToSlug(market.question)
                  const marketPath = market.type === '2-option' ? '2-options' : 'multi-options'
                  const percentage = market.type === '2-option' ? market.yes : market.options?.[0]?.percentage || '0%'

                  return (
                    <button
                      key={market.id}
                      onClick={() => navigate(`/themis/${marketPath}/${marketSlug}`)}
                      className="w-full p-3 rounded-lg hover:bg-black/10 transition-all cursor-pointer border border-[#ffffe4]/20 text-left"
                    >
                      <div className="flex items-center gap-3">
                        {/* Question Image Square */}
                        <div
                          className="w-10 h-10 flex-shrink-0 rounded bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${market.imageUrl || '/themis/questions/themis-test.png'})`
                          }}
                        />

                        {/* Question Text */}
                        <div className="flex-1 min-w-0">
                          <p className="font-geist text-[#ffffe4] text-sm truncate">
                            {market.question}
                          </p>
                        </div>

                        {/* Percentage */}
                        <div className="font-geist-mono text-[#ffffe4] text-lg font-bold">
                          {percentage}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Status Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        variant="themis"
      />
    </div>
    </>
  )
}
