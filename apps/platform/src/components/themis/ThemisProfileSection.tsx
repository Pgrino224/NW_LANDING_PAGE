import { useMemo, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomAreaChart from '../charts/CustomAreaChart'
import { themisApi, type UserPosition, type Market, type Trade } from '../../services/api/themisApi'
import { useSavedMarkets } from '../../contexts/SavedMarketsContext'
import NetworthIcon from '../shared/NetworthIcon'
import PnLCardModal from '../shared/PnLCardModal'

type TimeInterval = '1D' | '1W' | '1M' | 'ALL'
type PositionStatus = 'active' | 'closed'
type TabType = 'positions' | 'activity' | 'saved'
type SortBy = 'pnl-networth' | 'pnl-percent' | 'alphabetical'
type TradeType = 'all' | 'buy' | 'sell'
type CategoryFilter = 'all' | 'finance' | 'crypto' | 'economics' | 'politics'
type SavedSortBy = 'volume' | 'chance' | 'alphabetical'

export default function ThemisProfileSection() {
  const navigate = useNavigate()
  const { savedMarkets, toggleSaveMarket } = useSavedMarkets()
  const [portfolioInterval, setPortfolioInterval] = useState<TimeInterval>('ALL')
  const [userPositions, setUserPositions] = useState<UserPosition[]>([])
  const [markets, setMarkets] = useState<Market[]>([])
  const [userTrades, setUserTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('positions')
  const [positionStatus, setPositionStatus] = useState<PositionStatus>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredChartData, setHoveredChartData] = useState<{ value: number; time: number } | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>('pnl-networth')
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const sortDropdownRef = useRef<HTMLDivElement>(null)
  const [tradeTypeFilter, setTradeTypeFilter] = useState<TradeType>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const [savedCategoryFilter, setSavedCategoryFilter] = useState<CategoryFilter>('all')
  const [savedSortBy, setSavedSortBy] = useState<SavedSortBy>('volume')
  const [savedSortDropdownOpen, setSavedSortDropdownOpen] = useState(false)
  const savedSortDropdownRef = useRef<HTMLDivElement>(null)
  const [positionsDisplayCount, setPositionsDisplayCount] = useState(20)
  const [activityDisplayCount, setActivityDisplayCount] = useState(20)
  const [savedDisplayCount, setSavedDisplayCount] = useState(20)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareModalData, setShareModalData] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [positions, allMarkets, trades] = await Promise.all([
          themisApi.getUserPositions(),
          themisApi.getMarkets(),
          themisApi.getUserTrades()
        ])
        setUserPositions(positions)
        setMarkets(allMarkets)
        setUserTrades(trades)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false)
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false)
      }
      if (savedSortDropdownRef.current && !savedSortDropdownRef.current.contains(event.target as Node)) {
        setSavedSortDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get market details for user positions
  const positionsWithMarkets = userPositions.map(position => {
    const market = markets.find(m => m.id === position.marketId)
    return {
      ...position,
      market
    }
  })

  // Get market details for user trades
  const tradesWithMarkets = userTrades.map(trade => {
    const market = markets.find(m => m.id === trade.marketId)
    return {
      ...trade,
      market
    }
  })

  // Calculate total stats
  const totalPositionsValue = positionsWithMarkets.reduce((sum, pos) => sum + pos.invested, 0)
  const biggestWinValue = Math.max(...positionsWithMarkets.map(pos => pos.pnl), 0)
  const totalPredictions = positionsWithMarkets.length
  const totalPnl = positionsWithMarkets.reduce((sum, pos) => sum + pos.pnl, 0)
  const totalPnlPercentage = totalPositionsValue > 0 ? (totalPnl / totalPositionsValue) * 100 : 0

  // Format time ago
  const formatTimeAgo = (timestamp: string) => {
    const now = Date.now()
    const time = new Date(timestamp).getTime()
    const diff = now - time
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  // Generate mock portfolio data based on selected interval
  const portfolioData = useMemo(() => {
    const data = []
    const now = Math.floor(Date.now() / 1000)
    const startValue = 10000

    const intervalConfig: Record<TimeInterval, { days: number, stepHours: number }> = {
      '1D': { days: 1, stepHours: 1 },
      '1W': { days: 7, stepHours: 4 },
      '1M': { days: 30, stepHours: 24 },
      'ALL': { days: 365, stepHours: 24 * 3 }
    }

    const config = intervalConfig[portfolioInterval]
    const totalSteps = Math.floor((config.days * 24) / config.stepHours)

    for (let i = totalSteps; i >= 0; i--) {
      const timestamp = now - (i * config.stepHours * 60 * 60)
      const randomWalk = Math.random() * 200 - 50
      const trend = (totalSteps - i) * (3000 / totalSteps) // Overall upward trend
      const value = startValue + trend + randomWalk

      data.push({
        time: timestamp,
        value: value
      })
    }

    return data
  }, [portfolioInterval])

  // Display values (use hovered data if available, otherwise use latest)
  const displayValue = hoveredChartData?.value ?? (portfolioData[portfolioData.length - 1]?.value || 0)
  const displayPnl = displayValue - 10000 // Assuming starting value of 10000
  const displayPnlPercentage = (displayPnl / 10000) * 100
  const displayTimestamp = hoveredChartData?.time ?? (portfolioData[portfolioData.length - 1]?.time || Date.now() / 1000)
  const displayDate = new Date(displayTimestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  // Filter and sort positions by search, status, and sortBy
  const filteredPositions = useMemo(() => {
    let filtered = positionsWithMarkets.filter(position => {
      const matchesSearch = !searchQuery ||
        position.market?.question.toLowerCase().includes(searchQuery.toLowerCase())
      // For now, treat all as active. In real app, check position.status
      const matchesStatus = positionStatus === 'active'
      return matchesSearch && matchesStatus
    })

    // Sort based on sortBy
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'pnl-networth':
          return b.pnl - a.pnl // Highest PnL first
        case 'pnl-percent':
          const aPnlPercent = (a.pnl / a.invested) * 100
          const bPnlPercent = (b.pnl / b.invested) * 100
          return bPnlPercent - aPnlPercent // Highest PnL% first
        case 'alphabetical':
          const aName = a.market?.question || ''
          const bName = b.market?.question || ''
          return aName.localeCompare(bName)
        default:
          return 0
      }
    })

    return filtered
  }, [positionsWithMarkets, searchQuery, positionStatus, sortBy])

  // Get saved markets data
  const savedMarketsData = useMemo(() => {
    return markets.filter(m => savedMarkets.includes(m.id.toString()))
  }, [markets, savedMarkets])

  // Navigate to market
  const handleMarketClick = (market: Market) => {
    const questionSlug = market.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    navigate(`/themis/${market.category}/${questionSlug}`)
  }

  // Handle share position
  const handleSharePosition = (position: UserPosition) => {
    setShareModalData({
      gameMode: 'themis',
      userData: {
        username: 'taut-dogwood', // TODO: Get from user context
        profileImage: undefined
      },
      transactionData: {
        marketQuestion: position.market?.question || 'Unknown Market',
        prediction: position.outcome.toUpperCase() as 'YES' | 'NO',
        shares: position.shares,
        avgPrice: position.avgPrice,
        pnl: position.pnl,
        pnlPercentage: (position.pnl / position.invested) * 100,
        currency: 'NW'
      }
    })
    setShareModalOpen(true)
  }

  // Handle share trade
  const handleShareTrade = (trade: Trade) => {
    const tradeMarket = markets.find(m => m.id === trade.marketId)
    setShareModalData({
      gameMode: 'themis',
      userData: {
        username: 'taut-dogwood', // TODO: Get from user context
        profileImage: undefined
      },
      transactionData: {
        marketQuestion: tradeMarket?.question || 'Unknown Market',
        prediction: trade.outcome.toUpperCase() as 'YES' | 'NO',
        shares: trade.shares,
        avgPrice: trade.price,
        pnl: trade.amount * (trade.type === 'buy' ? 1 : -1), // Simplified - needs actual PnL calculation
        pnlPercentage: 15, // Mock value - needs actual calculation
        currency: 'NW'
      }
    })
    setShareModalOpen(true)
  }

  return (
    <div className="min-h-screen" style={{
      backgroundImage: 'url(/themis/themis-bg/themis-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Title - Full Width */}
      <div className="w-full px-8 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <img src="/themis/title-icons/themis-profile.svg" alt="" className="w-12 h-12" />
          <h1 className="font-geist-bold text-[#ffffe4] text-3xl">PORTFOLIO</h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 pb-8">

        {/* Top Section - Profile and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Left - Profile Card */}
          <div>
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-8 h-[320px] flex flex-col justify-between">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
                <div>
                  <h1 className="text-[#ffffe4] font-geist-bold text-xl mb-1">taut-dogwood</h1>
                  <p className="text-[#ffffe4]/60 font-geist-extralight text-sm">
                    Joined Mar 2023 • 601 views
                  </p>
                </div>
              </div>

              {/* Stats Row with Dividers */}
              <div className="grid grid-cols-3 gap-6">
                <div className="border-r border-white/20 pr-6">
                  <p className="text-[#ffffe4]/60 font-geist-extralight text-xs mb-1">Positions Value</p>
                  <p className="text-[#ffffe4] font-geist-bold text-xl">
                    ${totalPositionsValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="border-r border-white/20 px-6">
                  <p className="text-[#ffffe4]/60 font-geist-extralight text-xs mb-1">Biggest Win</p>
                  <p className="text-[#ffffe4] font-geist-bold text-xl">
                    ${biggestWinValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="pl-6">
                  <p className="text-[#ffffe4]/60 font-geist-extralight text-xs mb-1">Predictions</p>
                  <p className="text-[#ffffe4] font-geist-bold text-xl">{totalPredictions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Profit/Loss Chart */}
          <div>
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-8 h-[320px] flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#ffffe4]/60 font-geist-extralight text-sm">PnL</span>
                  </div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-[#ffffe4] font-geist-bold text-3xl flex items-baseline">
                      <NetworthIcon className="w-6 h-6" />
                      {Math.abs(displayPnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`font-geist-regular text-sm ${displayPnl >= 0 ? 'text-lime-600' : 'text-red-600'}`}>
                      {displayPnl >= 0 ? '+' : ''}{displayPnlPercentage.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-[#ffffe4]/60 font-geist-extralight text-sm">
                    {hoveredChartData ? displayDate : 'All-Time'}
                  </p>
                </div>

                {/* Time Interval Buttons - Top Right */}
                <div className="flex gap-1">
                  {(['1D', '1W', '1M', 'ALL'] as TimeInterval[]).map((interval) => (
                    <button
                      key={interval}
                      onClick={() => setPortfolioInterval(interval)}
                      className={`px-3 py-1 font-geist-mono text-xs rounded border transition-colors ${
                        portfolioInterval === interval
                          ? 'bg-black/20 text-[#ffffe4] border-white/20'
                          : 'text-[#ffffe4]/40 hover:text-[#ffffe4]/60 border-white/20'
                      }`}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1 min-h-0">
                <CustomAreaChart
                  data={portfolioData}
                  color="#ffffff"
                  onHover={(data) => setHoveredChartData(data)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Tabs and Table */}
        <div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-white/20 mb-6 px-2">
            <button
              onClick={() => setActiveTab('positions')}
              className={`font-geist text-base py-2 transition-all relative ${
                activeTab === 'positions'
                  ? 'text-[#ffffe4]'
                  : 'text-[#ffffe4]/50 hover:text-[#ffffe4]/70'
              }`}
            >
              Positions
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffffe4] transition-all duration-300 ease-out ${
                  activeTab === 'positions' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`}
              />
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`font-geist text-base py-2 transition-all relative ${
                activeTab === 'activity'
                  ? 'text-[#ffffe4]'
                  : 'text-[#ffffe4]/50 hover:text-[#ffffe4]/70'
              }`}
            >
              Activity
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffffe4] transition-all duration-300 ease-out ${
                  activeTab === 'activity' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`}
              />
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`font-geist text-base py-2 transition-all relative ${
                activeTab === 'saved'
                  ? 'text-[#ffffe4]'
                  : 'text-[#ffffe4]/50 hover:text-[#ffffe4]/70'
              }`}
            >
              Saved
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffffe4] transition-all duration-300 ease-out ${
                  activeTab === 'saved' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`}
              />
            </button>
          </div>

          {/* Positions Tab Content */}
          {activeTab === 'positions' && (
            <>
              {/* Controls */}
              <div className="flex items-center gap-4 mb-6 px-2">
                {/* Active/Closed Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPositionStatus('active')}
                    className={`px-4 py-2 font-geist-regular text-sm rounded border border-white/20 transition-colors ${
                      positionStatus === 'active'
                        ? 'bg-transparent text-[#ffffe4] border-white'
                        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg text-[#ffffe4] hover:bg-transparent hover:border-white'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setPositionStatus('closed')}
                    className={`px-4 py-2 font-geist-regular text-sm rounded border border-white/20 transition-colors ${
                      positionStatus === 'closed'
                        ? 'bg-transparent text-[#ffffe4] border-white'
                        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg text-[#ffffe4] hover:bg-transparent hover:border-white'
                    }`}
                  >
                    Closed
                  </button>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg border border-white/20 rounded">
                    <input
                      type="text"
                      placeholder="Search positions"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 bg-transparent text-[#ffffe4] placeholder:text-[#ffffe4]/40 font-geist-regular text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div ref={sortDropdownRef} className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="px-4 py-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg border border-white/20 text-[#ffffe4] font-geist-regular text-sm rounded hover:bg-black/5 transition-colors flex items-center gap-2"
                  >
                    {sortBy === 'pnl-networth' && 'PnL in NetWorth'}
                    {sortBy === 'pnl-percent' && 'PnL %'}
                    {sortBy === 'alphabetical' && 'Alphabetically'}
                    <svg
                      className={`w-4 h-4 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {sortDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-50">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setSortBy('pnl-networth')
                            setSortDropdownOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left font-geist-regular text-sm rounded transition-colors flex items-center gap-2 ${
                            sortBy === 'pnl-networth' ? 'bg-black/10 text-[#ffffe4]' : 'text-[#ffffe4] hover:bg-black/5'
                          }`}
                        >
                          <img src="/shared/token-logos/svg-white/networth-logo.svg" alt="" className="w-4 h-4" />
                          <span>PnL in NetWorth</span>
                        </button>
                        <button
                          onClick={() => {
                            setSortBy('pnl-percent')
                            setSortDropdownOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left font-geist-regular text-sm rounded transition-colors ${
                            sortBy === 'pnl-percent' ? 'bg-black/10 text-[#ffffe4]' : 'text-[#ffffe4] hover:bg-black/5'
                          }`}
                        >
                          PnL %
                        </button>
                        <button
                          onClick={() => {
                            setSortBy('alphabetical')
                            setSortDropdownOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left font-geist-regular text-sm rounded transition-colors ${
                            sortBy === 'alphabetical' ? 'bg-black/10 text-[#ffffe4]' : 'text-[#ffffe4] hover:bg-black/5'
                          }`}
                        >
                          Alphabetically
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Positions Table */}
              {loading ? (
                <div className="text-[#ffffe4]/60 font-geist-regular text-center py-12">Loading...</div>
              ) : filteredPositions.length === 0 ? (
                <div className="text-[#ffffe4]/60 font-geist-regular text-center py-12">No positions found</div>
              ) : (
                <>
                <div className="overflow-x-auto px-2">
                  <table className="w-full">
                    <thead>
                      <tr className="text-[#ffffe4]/50 font-geist-regular text-xs uppercase border-b border-white/20">
                        <th className="text-left pb-3 font-normal">MARKET</th>
                        <th className="text-right pb-3 font-normal">AVG</th>
                        <th className="text-right pb-3 font-normal">CURRENT</th>
                        <th className="text-right pb-3 font-normal pr-4">VALUE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPositions.slice(0, positionsDisplayCount).map((position) => (
                        <tr
                          key={position.id}
                          className="border-b border-white/10 hover:bg-black/5 cursor-pointer transition-colors"
                          onClick={() => position.market && handleMarketClick(position.market)}
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded flex-shrink-0 bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${position.market?.imageUrl || '/themis/questions/themis-test.png'})`
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-[#ffffe4] font-geist-regular text-sm mb-1">
                                  {position.market?.question || 'Unknown Market'}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded font-geist-bold text-xs ${
                                    position.outcome === 'yes'
                                      ? 'bg-lime-500 text-white'
                                      : 'bg-red-500 text-white'
                                  }`}>
                                    {position.outcome === 'yes' ? 'Yes' : 'No'}
                                  </span>
                                  <span className="text-[#ffffe4]/60 font-geist-extralight text-xs">
                                    {position.shares.toLocaleString()} shares at {(position.avgPrice * 100).toFixed(0)}¢
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-[#ffffe4] font-geist-regular text-sm">
                              {(position.avgPrice * 100).toFixed(0)}¢
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-[#ffffe4] font-geist-regular text-sm">
                              {/* Mock current price - in real app would come from market data */}
                              {(position.avgPrice * 100 + Math.random() * 10 - 5).toFixed(0)}¢
                            </span>
                          </td>
                          <td className="py-4 text-right pr-4">
                            <div className="flex items-center justify-end gap-3">
                              <div>
                                <div className="text-[#ffffe4] font-geist-bold text-sm">
                                  ${position.invested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className={`font-geist-regular text-xs ${
                                  position.pnl >= 0 ? 'text-lime-600' : 'text-red-600'
                                }`}>
                                  {position.pnl >= 0 ? '+' : ''}${Math.abs(position.pnl).toFixed(2)} ({((position.pnl / position.invested) * 100).toFixed(2)}%)
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSharePosition(position)
                                }}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                title="Share"
                              >
                                <svg className="w-4 h-4 text-[#ffffe4]/60 hover:text-[#ffffe4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Load More Button for Positions */}
                {filteredPositions.length > positionsDisplayCount && (
                  <div className="flex justify-center mt-6 px-2">
                    <button
                      onClick={() => setPositionsDisplayCount(prev => prev + 20)}
                      className="px-6 py-3 bg-transparent border border-white/20 text-[#ffffe4] font-geist-regular text-sm rounded hover:bg-black/5 transition-colors"
                    >
                      Load More ({filteredPositions.length - positionsDisplayCount} remaining)
                    </button>
                  </div>
                )}
                </>
              )}
            </>
          )}

          {/* Activity Tab Content */}
          {activeTab === 'activity' && (
            <>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6 px-2">
                {/* Buy/Sell Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setTradeTypeFilter('all')}
                    className={`px-4 py-2 font-geist-regular text-sm rounded border border-white/20 transition-colors ${
                      tradeTypeFilter === 'all'
                        ? 'bg-transparent text-[#ffffe4] border-white'
                        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg text-[#ffffe4] hover:bg-transparent hover:border-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setTradeTypeFilter('buy')}
                    className={`px-4 py-2 font-geist-regular text-sm rounded border border-white/20 transition-colors ${
                      tradeTypeFilter === 'buy'
                        ? 'bg-transparent text-[#ffffe4] border-white'
                        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg text-[#ffffe4] hover:bg-transparent hover:border-white'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeTypeFilter('sell')}
                    className={`px-4 py-2 font-geist-regular text-sm rounded border border-white/20 transition-colors ${
                      tradeTypeFilter === 'sell'
                        ? 'bg-transparent text-[#ffffe4] border-white'
                        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg text-[#ffffe4] hover:bg-transparent hover:border-white'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg border border-white/20 rounded">
                    <input
                      type="text"
                      placeholder="Search activity"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 bg-transparent text-[#ffffe4] placeholder:text-[#ffffe4]/40 font-geist-regular text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div ref={categoryDropdownRef} className="relative">
                  <button
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="px-4 py-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg border border-white/20 text-[#ffffe4] font-geist-regular text-sm rounded hover:bg-black/5 transition-colors flex items-center gap-2"
                  >
                    {categoryFilter === 'all' && 'All Categories'}
                    {categoryFilter === 'finance' && 'Finance'}
                    {categoryFilter === 'crypto' && 'Crypto'}
                    {categoryFilter === 'economics' && 'Economics'}
                    {categoryFilter === 'politics' && 'Politics'}
                    <svg
                      className={`w-4 h-4 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {categoryDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-50">
                      <div className="p-2">
                        {[
                          { value: 'all' as CategoryFilter, label: 'All Categories' },
                          { value: 'finance' as CategoryFilter, label: 'Finance' },
                          { value: 'crypto' as CategoryFilter, label: 'Crypto' },
                          { value: 'economics' as CategoryFilter, label: 'Economics' },
                          { value: 'politics' as CategoryFilter, label: 'Politics' }
                        ].map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => {
                              setCategoryFilter(cat.value)
                              setCategoryDropdownOpen(false)
                            }}
                            className={`w-full px-3 py-2 text-left font-geist-regular text-sm rounded transition-colors ${
                              categoryFilter === cat.value ? 'bg-black/10 text-[#ffffe4]' : 'text-[#ffffe4] hover:bg-black/5'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Table */}
              {loading ? (
                <div className="text-[#ffffe4]/60 font-geist-regular text-center py-12">Loading...</div>
              ) : tradesWithMarkets.length === 0 ? (
                <div className="text-[#ffffe4]/60 font-geist-regular text-center py-12">No activity found</div>
              ) : (
                <>
                <div className="overflow-x-auto px-2">
                  <table className="w-full">
                    <thead>
                      <tr className="text-[#ffffe4]/50 font-geist-regular text-xs uppercase border-b border-white/20">
                        <th className="text-left pb-3 font-normal">TYPE</th>
                        <th className="text-left pb-3 font-normal">MARKET</th>
                        <th className="text-right pb-3 font-normal">AMOUNT</th>
                        <th className="text-right pb-3 font-normal pr-4">TIME</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradesWithMarkets
                        .filter(trade => {
                          const matchesTradeType = tradeTypeFilter === 'all' || trade.type === tradeTypeFilter
                          const matchesCategory = categoryFilter === 'all' || trade.market?.category === categoryFilter
                          const matchesSearch = !searchQuery ||
                            trade.market?.question.toLowerCase().includes(searchQuery.toLowerCase())
                          return matchesTradeType && matchesCategory && matchesSearch
                        })
                        .slice(0, activityDisplayCount)
                        .map((trade) => (
                        <tr
                          key={trade.id}
                          className="border-b border-white/10 hover:bg-black/5 cursor-pointer transition-colors"
                          onClick={() => trade.market && handleMarketClick(trade.market)}
                        >
                          <td className="py-4">
                            <span className={`font-geist-bold text-sm ${
                              trade.type === 'buy' ? 'text-lime-600' : 'text-red-600'
                            }`}>
                              {trade.type === 'buy' ? 'Buy' : 'Sell'}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded flex-shrink-0 bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${trade.market?.imageUrl || '/themis/questions/themis-test.png'})`
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-[#ffffe4] font-geist-regular text-sm mb-1">
                                  {trade.market?.question || 'Unknown Market'}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded font-geist-bold text-xs ${
                                    trade.outcome === 'yes'
                                      ? 'bg-lime-500 text-white'
                                      : 'bg-red-500 text-white'
                                  }`}>
                                    {trade.outcome === 'yes' ? 'Yes' : 'No'}
                                  </span>
                                  <span className="text-[#ffffe4]/60 font-geist-extralight text-xs">
                                    {trade.shares.toLocaleString()} shares at {(trade.price * 100).toFixed(0)}¢
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-[#ffffe4] font-geist-bold text-sm">
                              ${trade.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-4 text-right pr-4">
                            <div className="flex items-center justify-end gap-3">
                              <span className="text-[#ffffe4]/60 font-geist-extralight text-xs">
                                {formatTimeAgo(trade.timestamp)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleShareTrade(trade)
                                }}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                title="Share"
                              >
                                <svg className="w-4 h-4 text-[#ffffe4]/60 hover:text-[#ffffe4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Load More Button for Activity */}
                {tradesWithMarkets.filter(trade => {
                  const matchesTradeType = tradeTypeFilter === 'all' || trade.type === tradeTypeFilter
                  const matchesCategory = categoryFilter === 'all' || trade.market?.category === categoryFilter
                  const matchesSearch = !searchQuery || trade.market?.question.toLowerCase().includes(searchQuery.toLowerCase())
                  return matchesTradeType && matchesCategory && matchesSearch
                }).length > activityDisplayCount && (
                  <div className="flex justify-center mt-6 px-2">
                    <button
                      onClick={() => setActivityDisplayCount(prev => prev + 20)}
                      className="px-6 py-3 bg-transparent border border-white/20 text-[#ffffe4] font-geist-regular text-sm rounded hover:bg-black/5 transition-colors"
                    >
                      Load More ({tradesWithMarkets.filter(trade => {
                        const matchesTradeType = tradeTypeFilter === 'all' || trade.type === tradeTypeFilter
                        const matchesCategory = categoryFilter === 'all' || trade.market?.category === categoryFilter
                        const matchesSearch = !searchQuery || trade.market?.question.toLowerCase().includes(searchQuery.toLowerCase())
                        return matchesTradeType && matchesCategory && matchesSearch
                      }).length - activityDisplayCount} remaining)
                    </button>
                  </div>
                )}
                </>
              )}
            </>
          )}

          {/* Saved Tab Content */}
          {activeTab === 'saved' && (
            <>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6 px-2">
                {/* Category Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSavedCategoryFilter('all')}
                    className={`px-4 py-2 font-geist-regular text-sm rounded border border-white/20 transition-colors ${
                      savedCategoryFilter === 'all'
                        ? 'bg-transparent text-[#ffffe4] border-white'
                        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg text-[#ffffe4] hover:bg-transparent hover:border-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSavedCategoryFilter('finance')}
                    className={`px-4 py-2 font-geist-regular text-sm rounded border border-white/20 transition-colors ${
                      savedCategoryFilter === 'finance'
                        ? 'bg-transparent text-[#ffffe4] border-white'
                        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg text-[#ffffe4] hover:bg-transparent hover:border-white'
                    }`}
                  >
                    Finance
                  </button>
                  <button
                    onClick={() => setSavedCategoryFilter('crypto')}
                    className={`px-4 py-2 font-geist-regular text-sm rounded border border-white/20 transition-colors ${
                      savedCategoryFilter === 'crypto'
                        ? 'bg-transparent text-[#ffffe4] border-white'
                        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg text-[#ffffe4] hover:bg-transparent hover:border-white'
                    }`}
                  >
                    Crypto
                  </button>
                  <button
                    onClick={() => setSavedCategoryFilter('economics')}
                    className={`px-4 py-2 font-geist-regular text-sm rounded border border-white/20 transition-colors ${
                      savedCategoryFilter === 'economics'
                        ? 'bg-transparent text-[#ffffe4] border-white'
                        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg text-[#ffffe4] hover:bg-transparent hover:border-white'
                    }`}
                  >
                    Economics
                  </button>
                  <button
                    onClick={() => setSavedCategoryFilter('politics')}
                    className={`px-4 py-2 font-geist-regular text-sm rounded border border-white/20 transition-colors ${
                      savedCategoryFilter === 'politics'
                        ? 'bg-transparent text-[#ffffe4] border-white'
                        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg text-[#ffffe4] hover:bg-transparent hover:border-white'
                    }`}
                  >
                    Politics
                  </button>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg border border-white/20 rounded">
                    <input
                      type="text"
                      placeholder="Search saved markets"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 bg-transparent text-[#ffffe4] placeholder:text-[#ffffe4]/40 font-geist-regular text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div ref={savedSortDropdownRef} className="relative">
                  <button
                    onClick={() => setSavedSortDropdownOpen(!savedSortDropdownOpen)}
                    className="px-4 py-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg border border-white/20 text-[#ffffe4] font-geist-regular text-sm rounded hover:bg-black/5 transition-colors flex items-center gap-2"
                  >
                    {savedSortBy === 'volume' && (
                      <span className="flex items-baseline gap-1">
                        PnL in <NetworthIcon className="w-3 h-3" />
                      </span>
                    )}
                    {savedSortBy === 'chance' && '% Chance'}
                    {savedSortBy === 'alphabetical' && 'Alphabetically'}
                    <svg
                      className={`w-4 h-4 transition-transform ${savedSortDropdownOpen ? 'rotate-180' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {savedSortDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-50">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setSavedSortBy('volume')
                            setSavedSortDropdownOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left font-geist-regular text-sm rounded transition-colors flex items-baseline gap-1 ${
                            savedSortBy === 'volume' ? 'bg-black/10 text-[#ffffe4]' : 'text-[#ffffe4] hover:bg-black/5'
                          }`}
                        >
                          PnL in <NetworthIcon className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            setSavedSortBy('chance')
                            setSavedSortDropdownOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left font-geist-regular text-sm rounded transition-colors ${
                            savedSortBy === 'chance' ? 'bg-black/10 text-[#ffffe4]' : 'text-[#ffffe4] hover:bg-black/5'
                          }`}
                        >
                          % Chance
                        </button>
                        <button
                          onClick={() => {
                            setSavedSortBy('alphabetical')
                            setSavedSortDropdownOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left font-geist-regular text-sm rounded transition-colors ${
                            savedSortBy === 'alphabetical' ? 'bg-black/10 text-[#ffffe4]' : 'text-[#ffffe4] hover:bg-black/5'
                          }`}
                        >
                          Alphabetically
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Saved Markets List */}
              {loading ? (
                <div className="text-[#ffffe4]/60 font-geist-regular text-center py-12">Loading...</div>
              ) : savedMarketsData.length === 0 ? (
                <div className="text-center py-12 px-2">
                  <svg className="w-16 h-16 mx-auto mb-4 text-[#ffffe4]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <p className="text-[#ffffe4]/60 font-geist-regular text-sm mb-2">No saved markets yet</p>
                  <p className="text-[#ffffe4]/40 font-geist-extralight text-xs">
                    Bookmark markets from the main view to see them here
                  </p>
                </div>
              ) : (
                <>
                <div className="space-y-3 px-2">
                  {savedMarketsData
                    .filter(market => {
                      const matchesSearch = !searchQuery || market.question.toLowerCase().includes(searchQuery.toLowerCase())
                      const matchesCategory = savedCategoryFilter === 'all' || market.category === savedCategoryFilter
                      return matchesSearch && matchesCategory
                    })
                    .sort((a, b) => {
                      switch (savedSortBy) {
                        case 'volume':
                          // Parse volume string (e.g., "$21m" -> 21000000)
                          const aVol = parseFloat((a.volume || '').replace(/[$kmb]/gi, '')) || 0
                          const bVol = parseFloat((b.volume || '').replace(/[$kmb]/gi, '')) || 0
                          return bVol - aVol // Highest volume first
                        case 'chance':
                          // Parse percentage (e.g., "56%" -> 56)
                          const aChance = parseFloat((a.yes || '').replace('%', '')) || 0
                          const bChance = parseFloat((b.yes || '').replace('%', '')) || 0
                          return bChance - aChance // Highest chance first
                        case 'alphabetical':
                          return a.question.localeCompare(b.question)
                        default:
                          return 0
                      }
                    })
                    .slice(0, savedDisplayCount)
                    .map((market) => (
                      <div
                        key={market.id}
                        onClick={() => handleMarketClick(market)}
                        className="flex items-center gap-4 p-4 bg-transparent border border-white/20 rounded-lg hover:bg-black/5 cursor-pointer transition-colors"
                      >
                        {/* Icon/Flag */}
                        <div className="w-12 h-12 rounded flex-shrink-0 bg-cover bg-center" style={{
                          backgroundImage: `url(${market.imageUrl || '/themis/questions/themis-test.png'})`
                        }} />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Category Breadcrumb */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[#ffffe4]/60 font-geist-extralight text-xs uppercase">
                              {market.category}
                            </span>
                            <span className="text-[#ffffe4]/40">›</span>
                            <span className="text-[#ffffe4]/60 font-geist-extralight text-xs">
                              Global Markets
                            </span>
                          </div>

                          {/* Question */}
                          <h3 className="text-[#ffffe4] font-geist text-base mb-2">
                            {market.question}
                          </h3>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-[#ffffe4]/60 font-geist-extralight">{market.volume} Vol.</span>
                            </div>
                            {market.type === '2-option' && (
                              <>
                                <span className="text-[#ffffe4]/40">•</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-[#ffffe4]/60 font-geist-extralight">Ends in 2 days</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Right Side - Percentage & Unsave */}
                        <div className="flex items-center gap-4">
                          {market.type === '2-option' && (
                            <div className="text-right">
                              <div className="text-[#ffffe4] font-geist-bold text-3xl mb-1">
                                {market.yes}
                              </div>
                              <div className="text-[#ffffe4]/60 font-geist-extralight text-xs">
                                Leading Option
                              </div>
                            </div>
                          )}

                          {/* Unsave Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSaveMarket(market.id.toString())
                            }}
                            className="p-2 rounded hover:bg-black/10 transition-colors"
                          >
                            <svg className="w-5 h-5 text-[#ffffe4]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Load More Button for Saved Markets */}
                {savedMarketsData
                  .filter(market => {
                    const matchesSearch = !searchQuery || market.question.toLowerCase().includes(searchQuery.toLowerCase())
                    const matchesCategory = savedCategoryFilter === 'all' || market.category === savedCategoryFilter
                    return matchesSearch && matchesCategory
                  }).length > savedDisplayCount && (
                  <div className="flex justify-center mt-6 px-2">
                    <button
                      onClick={() => setSavedDisplayCount(prev => prev + 20)}
                      className="px-6 py-3 bg-transparent border border-white/20 text-[#ffffe4] font-geist-regular text-sm rounded hover:bg-black/5 transition-colors"
                    >
                      Load More ({savedMarketsData.filter(market => {
                        const matchesSearch = !searchQuery || market.question.toLowerCase().includes(searchQuery.toLowerCase())
                        const matchesCategory = savedCategoryFilter === 'all' || market.category === savedCategoryFilter
                        return matchesSearch && matchesCategory
                      }).length - savedDisplayCount} remaining)
                    </button>
                  </div>
                )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Share PnL Card Modal */}
      {shareModalOpen && shareModalData && (
        <PnLCardModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          {...shareModalData}
        />
      )}
    </div>
  )
}
