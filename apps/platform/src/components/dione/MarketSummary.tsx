import { useState, useRef, useEffect, useMemo } from 'react'
import MiniAreaChart from '../charts/MiniAreaChart'
import CustomAreaChartDione from '../charts/CustomAreaChartDione'
import SimpleCandlestickChart from '../charts/SimpleCandlestickChart'
import NetworthIcon from '../shared/NetworthIcon'
import { AssetIcon } from '../../utils/iconHelper'

interface NewsArticle {
  id: string
  title: string
  description: string
  author: string
  timestamp: string
  image: string
  comments: number
  likes: number
  url: string
  category: 'Indices' | 'Stocks' | 'ETFs' | 'Crypto' | 'Commodities'
}

interface EconomicEvent {
  id: string
  date: Date
  time: string
  category: 'economic' | 'earnings' | 'revenue' | 'dividends'

  // Economic-specific fields
  country?: string
  countryCode?: string
  event?: string
  importance?: 'high' | 'medium' | 'low'
  actual?: string
  forecast?: string
  prior?: string

  // Corporate-specific fields (earnings, revenue, dividends)
  ticker?: string
  company?: string
  epsEstimate?: number
  epsActual?: number
  revenueEstimate?: string
  revenueActual?: string
  surprise?: number
  marketCap?: string
  dividendAmount?: number
  exDividendDate?: string
  paymentDate?: string
  dividendYield?: number
}

// Generate mock events for the current week
const generateMockEvents = (startDate: Date): EconomicEvent[] => {
  const events: EconomicEvent[] = []
  const baseDate = new Date(startDate)

  const companies = [
    { ticker: 'AAPL', name: 'Apple Inc.', marketCap: '2.8T' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', marketCap: '2.5T' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', marketCap: '1.7T' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', marketCap: '1.5T' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', marketCap: '1.2T' },
    { ticker: 'TSLA', name: 'Tesla Inc.', marketCap: '800B' },
    { ticker: 'META', name: 'Meta Platforms Inc.', marketCap: '750B' },
    { ticker: 'JPM', name: 'JPMorgan Chase', marketCap: '450B' },
    { ticker: 'JNJ', name: 'Johnson & Johnson', marketCap: '380B' },
    { ticker: 'V', name: 'Visa Inc.', marketCap: '520B' }
  ]

  // US only for MVP
  const country = { name: 'United States', code: 'US' }

  const economicEvents = [
    'GDP Growth Rate', 'Inflation Rate', 'Unemployment Rate', 'Trade Balance',
    'Manufacturing PMI', 'Services PMI', 'Retail Sales', 'Industrial Production'
  ]

  // Create events for each day of the week
  for (let day = 0; day < 7; day++) {
    const eventDate = new Date(baseDate)
    eventDate.setDate(baseDate.getDate() + day)

    // Add 3-5 events per day for each category
    const eventCount = 3 + Math.floor(Math.random() * 3)
    for (let i = 0; i < eventCount; i++) {
      const hour = Math.floor(Math.random() * 24)
      const time = `${hour.toString().padStart(2, '0')}:00`
      const category = (['economic', 'earnings', 'revenue', 'dividends'][Math.floor(Math.random() * 4)]) as 'economic' | 'earnings' | 'revenue' | 'dividends'

      if (category === 'economic') {
        const event = economicEvents[Math.floor(Math.random() * economicEvents.length)]
        const importance = ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'

        events.push({
          id: `${day}-${i}-economic`,
          date: eventDate,
          time,
          category: 'economic',
          country: country.name,
          countryCode: country.code,
          event,
          importance,
          actual: Math.random() > 0.3 ? `${(Math.random() * 10).toFixed(1)}%` : undefined,
          forecast: `${(Math.random() * 10).toFixed(1)}%`,
          prior: `${(Math.random() * 10).toFixed(1)}%`
        })
      } else if (category === 'earnings') {
        const company = companies[Math.floor(Math.random() * companies.length)]
        const epsEst = parseFloat((Math.random() * 5).toFixed(2))
        const epsAct = parseFloat((epsEst + (Math.random() - 0.5) * 0.5).toFixed(2))
        const surprise = parseFloat((((epsAct - epsEst) / epsEst) * 100).toFixed(2))

        events.push({
          id: `${day}-${i}-earnings`,
          date: eventDate,
          time,
          category: 'earnings',
          ticker: company.ticker,
          company: company.name,
          epsEstimate: epsEst,
          epsActual: epsAct,
          surprise,
          marketCap: company.marketCap
        })
      } else if (category === 'revenue') {
        const company = companies[Math.floor(Math.random() * companies.length)]
        const revEst = `${(Math.random() * 50 + 10).toFixed(1)}B`
        const revAct = `${(parseFloat(revEst) + (Math.random() - 0.5) * 5).toFixed(1)}B`
        const surprise = parseFloat(((Math.random() - 0.5) * 10).toFixed(2))

        events.push({
          id: `${day}-${i}-revenue`,
          date: eventDate,
          time,
          category: 'revenue',
          ticker: company.ticker,
          company: company.name,
          revenueEstimate: revEst,
          revenueActual: revAct,
          surprise,
          marketCap: company.marketCap
        })
      } else if (category === 'dividends') {
        const company = companies[Math.floor(Math.random() * companies.length)]
        const amount = parseFloat((Math.random() * 2).toFixed(2))
        const exDate = new Date(eventDate)
        exDate.setDate(exDate.getDate() + Math.floor(Math.random() * 30))
        const payDate = new Date(exDate)
        payDate.setDate(payDate.getDate() + Math.floor(Math.random() * 14 + 7))

        events.push({
          id: `${day}-${i}-dividends`,
          date: eventDate,
          time,
          category: 'dividends',
          ticker: company.ticker,
          company: company.name,
          dividendAmount: amount,
          exDividendDate: exDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          paymentDate: payDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          dividendYield: parseFloat((Math.random() * 5 + 1).toFixed(2))
        })
      }
    }
  }

  // Sort by date and time
  return events.sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime()
    if (dateCompare !== 0) return dateCompare
    return a.time.localeCompare(b.time)
  })
}

const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Bitcoin Surges Past $45K as Institutional Interest Grows',
    description: 'Major institutional investors are increasing their Bitcoin holdings as the cryptocurrency market shows strong momentum. Analysts predict continued...',
    author: 'CryptoAnalyst',
    timestamp: 'Updated 3 hours ago',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80',
    comments: 124,
    likes: 567,
    url: 'https://example.com/bitcoin-surge',
    category: 'Crypto'
  },
  {
    id: '2',
    title: 'S&P 500 Reaches New All-Time High on Strong Earnings',
    description: 'The S&P 500 index closed at a record high today, driven by better-than-expected earnings from major tech companies. Market sentiment remains...',
    author: 'MarketWatch',
    timestamp: 'Updated 5 hours ago',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    comments: 89,
    likes: 423,
    url: 'https://example.com/sp500-high',
    category: 'Indices'
  },
  {
    id: '3',
    title: 'Gold Prices Stabilize Amid Economic Uncertainty',
    description: 'Gold continues to hold steady above $2,000 as investors seek safe-haven assets. Central bank policies and inflation concerns are driving demand...',
    author: 'CommodityTrader',
    timestamp: 'Updated 8 hours ago',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80',
    comments: 56,
    likes: 289,
    url: 'https://example.com/gold-prices',
    category: 'Commodities'
  },
  {
    id: '4',
    title: 'Tech Stocks Lead Market Rally in Q4 Performance',
    description: 'Technology sector continues to outperform broader market indices as AI and cloud computing drive growth. Leading tech companies report strong...',
    author: 'TechInvestor',
    timestamp: 'Updated 12 hours ago',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    comments: 203,
    likes: 834,
    url: 'https://example.com/tech-rally',
    category: 'Stocks'
  },
  {
    id: '5',
    title: 'QQQ ETF Hits Record High on Tech Sector Strength',
    description: 'Invesco QQQ Trust reaches new milestone as technology stocks continue their upward trajectory. Strong performance from major holdings...',
    author: 'ETFAnalyst',
    timestamp: 'Updated 6 hours ago',
    image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=800&q=80',
    comments: 67,
    likes: 345,
    url: 'https://example.com/qqq-record',
    category: 'ETFs'
  },
  {
    id: '6',
    title: 'Ethereum Network Upgrade Sparks Price Rally',
    description: 'ETH climbs following successful network upgrade implementation. Developers report improved transaction speeds and reduced gas fees...',
    author: 'BlockchainNews',
    timestamp: 'Updated 4 hours ago',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    comments: 156,
    likes: 678,
    url: 'https://example.com/eth-upgrade',
    category: 'Crypto'
  },
  {
    id: '7',
    title: 'Dow Jones Dips on Banking Sector Concerns',
    description: 'Blue-chip index falls as investors assess regional banking stability. Market analysts suggest temporary pullback...',
    author: 'FinanceToday',
    timestamp: 'Updated 7 hours ago',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
    comments: 92,
    likes: 234,
    url: 'https://example.com/dow-banking',
    category: 'Indices'
  },
  {
    id: '8',
    title: 'Crude Oil Prices Jump on Supply Concerns',
    description: 'WTI crude gains 3% as OPEC+ announces production cuts. Energy sector stocks rise in tandem with oil prices...',
    author: 'EnergyReport',
    timestamp: 'Updated 2 hours ago',
    image: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=800&q=80',
    comments: 78,
    likes: 401,
    url: 'https://example.com/crude-supply',
    category: 'Commodities'
  }
]

const countryFlags: Record<string, string> = {
  JP: '🇯🇵',
  DE: '🇩🇪',
  ZA: '🇿🇦',
  GB: '🇬🇧',
  FR: '🇫🇷',
  US: '🇺🇸'
}

// Helper to get start of week (Monday)
const getWeekStart = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  return new Date(d.setDate(diff))
}

type TimeInterval = '1D' | '1W' | '1M' | '3M' | 'YTD' | '1Y' | '5Y' | 'All'

export default function MarketSummary() {
  const [calendarFilter, setCalendarFilter] = useState<'economic' | 'earnings' | 'revenue' | 'dividends'>('economic')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getWeekStart(new Date()))
  const [highlightedDay, setHighlightedDay] = useState<number>(0)
  const [newsFilter, setNewsFilter] = useState<'All' | 'Indices' | 'Stocks' | 'ETFs' | 'Crypto' | 'Commodities'>('All')
  const [spInterval, setSpInterval] = useState<TimeInterval>('1M')
  const [cryptoInterval, setCryptoInterval] = useState<TimeInterval>('1M')
  const [etfInterval, setEtfInterval] = useState<TimeInterval>('1M')
  const [hoveredSpData, setHoveredSpData] = useState<{value: number, time: number} | null>(null)
  const [hoveredCryptoData, setHoveredCryptoData] = useState<{value: number, time: number} | null>(null)
  const [hoveredSpyData, setHoveredSpyData] = useState<{value: number, time: number} | null>(null)
  const [hoveredQqqData, setHoveredQqqData] = useState<{value: number, time: number} | null>(null)
  const [spChartType, setSpChartType] = useState<'area' | 'candlestick'>('area')
  const [cryptoChartType, setCryptoChartType] = useState<'area' | 'candlestick'>('area')
  const [etfChartType, setEtfChartType] = useState<'area' | 'candlestick'>('area')
  const eventsContainerRef = useRef<HTMLDivElement>(null)

  // Generate events for current week
  const allEvents = generateMockEvents(currentWeekStart)
  const filteredEvents = allEvents
    .filter(event => event.category === calendarFilter)
    .filter(event => {
      // Only apply country filter to economic events (US only for MVP)
      if (event.category === 'economic') {
        return event.countryCode === 'US'
      }
      // Corporate events (earnings, revenue, dividends) - show all
      return true
    })

  // Filter news by category
  const filteredNews = newsFilter === 'All' ? mockNews : mockNews.filter(article => article.category === newsFilter)

  // Week navigation handlers
  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() - 7)
    setCurrentWeekStart(newStart)
  }

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() + 7)
    setCurrentWeekStart(newStart)
  }

  const goToToday = () => {
    setCurrentWeekStart(getWeekStart(new Date()))
  }

  // Helper to generate chart data with timestamps
  const generateChartData = (
    startValue: number,
    endValue: number,
    interval: TimeInterval
  ): { time: number; value: number }[] => {
    const data: { time: number; value: number }[] = []
    const now = Math.floor(Date.now() / 1000)

    const intervalConfig: Record<TimeInterval, { days: number, stepHours: number }> = {
      '1D': { days: 1, stepHours: 1 },
      '1W': { days: 7, stepHours: 4 },
      '1M': { days: 30, stepHours: 24 },
      '3M': { days: 90, stepHours: 24 },
      'YTD': { days: new Date().getDate() + new Date().getMonth() * 30, stepHours: 24 },
      '1Y': { days: 365, stepHours: 24 * 3 },
      '5Y': { days: 365 * 5, stepHours: 24 * 7 },
      'All': { days: 365 * 10, stepHours: 24 * 14 }
    }

    const config = intervalConfig[interval]
    const totalSteps = Math.floor((config.days * 24) / config.stepHours)
    const stepSeconds = config.stepHours * 3600
    const trend = endValue - startValue

    for (let i = totalSteps; i >= 0; i--) {
      const randomWalk = Math.random() * (trend * 0.05) - (trend * 0.025) // 5% noise
      const trendValue = (totalSteps - i) * (trend / totalSteps)
      const value = startValue + trendValue + randomWalk
      const time = now - (i * stepSeconds)
      data.push({ time, value })
    }

    return data
  }

  // S&P 500 Chart Data
  const spChartData = useMemo(() =>
    generateChartData(4700, 4783.45, spInterval),
  [spInterval])

  const spChartColor = useMemo(() => {
    if (spChartData.length < 2) return '#84cc16'
    return spChartData[spChartData.length - 1].value >= spChartData[0].value ? '#84cc16' : '#ef4444'
  }, [spChartData])

  const displaySpValue = useMemo(() =>
    hoveredSpData ? hoveredSpData.value : spChartData[spChartData.length - 1]?.value ?? 4783.45,
  [hoveredSpData, spChartData])

  const spPnl = useMemo(() => {
    if (spChartData.length < 2) return { percentage: 0.96 }
    const firstValue = spChartData[0].value
    const lastValue = hoveredSpData ? hoveredSpData.value : spChartData[spChartData.length - 1].value
    const percentage = ((lastValue - firstValue) / firstValue) * 100
    return { percentage }
  }, [spChartData, hoveredSpData])

  // Crypto Market Cap Chart Data
  const cryptoChartData = useMemo(() =>
    generateChartData(3.8, 4.17, cryptoInterval),
  [cryptoInterval])

  const cryptoChartColor = useMemo(() => {
    if (cryptoChartData.length < 2) return '#84cc16'
    return cryptoChartData[cryptoChartData.length - 1].value >= cryptoChartData[0].value ? '#84cc16' : '#ef4444'
  }, [cryptoChartData])

  const displayCryptoValue = useMemo(() =>
    hoveredCryptoData ? hoveredCryptoData.value : cryptoChartData[cryptoChartData.length - 1]?.value ?? 4.17,
  [hoveredCryptoData, cryptoChartData])

  const cryptoPnl = useMemo(() => {
    if (cryptoChartData.length < 2) return { percentage: 10.04 }
    const firstValue = cryptoChartData[0].value
    const lastValue = hoveredCryptoData ? hoveredCryptoData.value : cryptoChartData[cryptoChartData.length - 1].value
    const percentage = ((lastValue - firstValue) / firstValue) * 100
    return { percentage }
  }, [cryptoChartData, hoveredCryptoData])

  // SPY ETF Chart Data
  const spyChartData = useMemo(() =>
    generateChartData(470, 478.34, etfInterval),
  [etfInterval])

  const spyChartColor = useMemo(() => {
    if (spyChartData.length < 2) return '#84cc16'
    return spyChartData[spyChartData.length - 1].value >= spyChartData[0].value ? '#84cc16' : '#ef4444'
  }, [spyChartData])

  const displaySpyValue = useMemo(() =>
    hoveredSpyData ? hoveredSpyData.value : spyChartData[spyChartData.length - 1]?.value ?? 478.34,
  [hoveredSpyData, spyChartData])

  const spyPnl = useMemo(() => {
    if (spyChartData.length < 2) return { percentage: 0.96 }
    const firstValue = spyChartData[0].value
    const lastValue = hoveredSpyData ? hoveredSpyData.value : spyChartData[spyChartData.length - 1].value
    const percentage = ((lastValue - firstValue) / firstValue) * 100
    return { percentage }
  }, [spyChartData, hoveredSpyData])

  // QQQ ETF Chart Data
  const qqqChartData = useMemo(() =>
    generateChartData(390, 395.67, etfInterval),
  [etfInterval])

  const qqqChartColor = useMemo(() => {
    if (qqqChartData.length < 2) return '#84cc16'
    return qqqChartData[qqqChartData.length - 1].value >= qqqChartData[0].value ? '#84cc16' : '#ef4444'
  }, [qqqChartData])

  const displayQqqValue = useMemo(() =>
    hoveredQqqData ? hoveredQqqData.value : qqqChartData[qqqChartData.length - 1]?.value ?? 395.67,
  [hoveredQqqData, qqqChartData])

  const qqqPnl = useMemo(() => {
    if (qqqChartData.length < 2) return { percentage: 0.82 }
    const firstValue = qqqChartData[0].value
    const lastValue = hoveredQqqData ? hoveredQqqData.value : qqqChartData[qqqChartData.length - 1].value
    const percentage = ((lastValue - firstValue) / firstValue) * 100
    return { percentage }
  }, [qqqChartData, hoveredQqqData])

  // Handle scroll to update highlighted day
  useEffect(() => {
    const container = eventsContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect()
      const rows = container.querySelectorAll('tbody tr')

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] as HTMLElement
        const rect = row.getBoundingClientRect()

        // Check if row is in viewport
        if (rect.top >= containerRect.top && rect.top <= containerRect.top + 100) {
          const eventId = row.getAttribute('data-event-id')
          if (eventId) {
            const event = filteredEvents.find(e => e.id === eventId)
            if (event) {
              const dayIndex = Math.floor((event.date.getTime() - currentWeekStart.getTime()) / (1000 * 60 * 60 * 24))
              if (dayIndex >= 0 && dayIndex < 7) {
                setHighlightedDay(dayIndex)
              }
            }
          }
          break
        }
      }
    }

    container.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => container.removeEventListener('scroll', handleScroll)
  }, [filteredEvents, currentWeekStart])

  const toggleEvent = (eventId: string) => {
    const newExpanded = new Set(expandedEvents)
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId)
    } else {
      newExpanded.add(eventId)
    }
    setExpandedEvents(newExpanded)
  }

  // Handle calendar filter change with smooth transition
  const handleFilterChange = (newFilter: 'economic' | 'earnings' | 'revenue' | 'dividends') => {
    if (newFilter === calendarFilter) return

    // Start transition
    setIsTransitioning(true)

    // Change filter after fade out (150ms)
    setTimeout(() => {
      setCalendarFilter(newFilter)

      // Instant scroll to top (no smooth animation during transition)
      const container = eventsContainerRef.current
      if (container) {
        container.scrollTop = 0
      }

      // End transition after fade in (150ms)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 150)
    }, 150)
  }

  // Handle day card click - scroll to that day's first event
  const handleDayClick = (dayIndex: number) => {
    setHighlightedDay(dayIndex)

    const container = eventsContainerRef.current
    if (!container) return

    // Find the first event for this day
    const dayDate = new Date(currentWeekStart)
    dayDate.setDate(dayDate.getDate() + dayIndex)

    const firstEventOfDay = filteredEvents.find(event =>
      event.date.toDateString() === dayDate.toDateString()
    )

    if (firstEventOfDay) {
      // Find the row with this event
      const row = container.querySelector(`[data-event-id="${firstEventOfDay.id}"]`)
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  // Calculate event counts per day (US only for economic events)
  const getEventCounts = (dayIndex: number) => {
    const dayDate = new Date(currentWeekStart)
    dayDate.setDate(dayDate.getDate() + dayIndex)

    const dayEvents = allEvents
      .filter(event => event.date.toDateString() === dayDate.toDateString())
      .filter(event => {
        // Only apply country filter to economic events (US only for MVP)
        if (event.category === 'economic') {
          return event.countryCode === 'US'
        }
        // Corporate events (earnings, revenue, dividends) - show all
        return true
      })

    return {
      economic: dayEvents.filter(e => e.category === 'economic').length,
      earnings: dayEvents.filter(e => e.category === 'earnings').length,
      dividends: dayEvents.filter(e => e.category === 'dividends').length
    }
  }

  // Format date range string
  const getDateRangeString = () => {
    const endDate = new Date(currentWeekStart)
    endDate.setDate(endDate.getDate() + 6)

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return `${monthNames[currentWeekStart.getMonth()]} ${currentWeekStart.getDate()} — ${monthNames[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`
  }

  // Get day labels
  const getDayLabels = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map((day, index) => {
      const date = new Date(currentWeekStart)
      date.setDate(date.getDate() + index)
      return `${day} ${date.getDate()}`
    })
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-6">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <img src="/dione/title-icons/dione-icon.svg" alt="" className="w-12 h-12" />
          <h1 className="font-geist-bold text-white text-3xl">MARKET SUMMARY</h1>
        </div>

        {/* Bento Grid: 3 columns x 3 rows */}
        <div className="w-full grid gap-4 mb-8" style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 400px)'
        }}>

          {/* Box 1 - S&P 500 Featured Chart (2 columns, 1 row) */}
          <div
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col"
            style={{ gridColumn: 'span 2', gridRow: 'span 1' }}
          >
            <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-white font-geist text-lg">S&P 500</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-geist-mono-regular text-lg flex items-baseline">
                    <NetworthIcon className="w-4 h-4" />
                    {displaySpValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="font-geist-mono-extralight text-sm" style={{ color: spPnl.percentage >= 0 ? '#84cc16' : '#ef4444' }}>
                    {spPnl.percentage >= 0 ? '+' : ''}{spPnl.percentage.toFixed(2)}%
                  </span>
                </div>
              </div>
              {/* Time Interval Buttons + Chart Type Toggle */}
              <div className="flex gap-1 items-center">
                {(['1D', '1W', '1M', '3M', 'YTD', '1Y', '5Y', 'All'] as TimeInterval[]).map((interval) => (
                  <button
                    key={interval}
                    onClick={() => setSpInterval(interval)}
                    className={`px-3 py-1 font-geist-mono-extralight text-xs rounded border transition-colors ${
                      spInterval === interval
                        ? 'text-white bg-white/10 border-white/20'
                        : 'text-white/50 hover:text-white hover:bg-white/5 border-white/10'
                    }`}
                  >
                    {interval}
                  </button>
                ))}

                {/* Divider */}
                <div className="h-4 w-px bg-white/20 mx-1" />

                {/* Chart Type Toggle */}
                <button
                  onClick={() => setSpChartType(prev => prev === 'area' ? 'candlestick' : 'area')}
                  className="px-2 py-1 rounded border border-white/20 hover:bg-white/5 transition-colors"
                  title={spChartType === 'area' ? 'Switch to candlestick' : 'Switch to area'}
                >
                  {spChartType === 'area' ? (
                    <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 17l6-6 4 4 8-8" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M3 17h18v4H3z" fill="currentColor" opacity="0.3"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="8" width="2" height="6"/>
                      <line x1="6" y1="6" x2="6" y2="16" stroke="currentColor" strokeWidth="1"/>
                      <rect x="11" y="10" width="2" height="4"/>
                      <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="1"/>
                      <rect x="17" y="7" width="2" height="8"/>
                      <line x1="18" y1="5" x2="18" y2="17" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex-1 relative px-4 pb-4 min-h-0">
              {spChartType === 'area' ? (
                <CustomAreaChartDione
                  data={spChartData}
                  color={spChartColor}
                  onHover={(data) => setHoveredSpData(data)}
                />
              ) : (
                <SimpleCandlestickChart
                  data={spChartData}
                  color={spChartColor}
                />
              )}
            </div>
          </div>

          {/* Box 2 - Major Indices (1 column, 1 row) */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 bg-white/5">
              <h3 className="text-white font-geist text-lg">Major Indices</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                  <AssetIcon type="index" symbol="NDX" size={32} />
                  <div>
                    <div className="text-white font-geist text-sm">Nasdaq 100</div>
                    <div className="text-white/40 font-geist-mono text-xs">NDX</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-geist-mono text-sm inline-flex items-baseline"><NetworthIcon className="w-3 h-3" />16,847</div>
                  <div className="font-geist-mono text-xs" style={{ color: '#84cc16' }}>+0.77%</div>
                </div>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                  <AssetIcon type="index" symbol="DJI" size={32} />
                  <div>
                    <div className="text-white font-geist text-sm">Dow Jones</div>
                    <div className="text-white/40 font-geist-mono text-xs">DJI</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-geist-mono text-sm inline-flex items-baseline"><NetworthIcon className="w-3 h-3" />37,404</div>
                  <div className="text-red-400 font-geist-mono text-xs">-0.24%</div>
                </div>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                  <AssetIcon type="index" symbol="DAX" size={32} />
                  <div>
                    <div className="text-white font-geist text-sm">DAX</div>
                    <div className="text-white/40 font-geist-mono text-xs">DAX</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-geist-mono text-sm inline-flex items-baseline"><NetworthIcon className="w-3 h-3" />16,743</div>
                  <div className="font-geist-mono text-xs" style={{ color: '#84cc16' }}>+0.94%</div>
                </div>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                  <AssetIcon type="index" symbol="FTSE" size={32} />
                  <div>
                    <div className="text-white font-geist text-sm">FTSE 100</div>
                    <div className="text-white/40 font-geist-mono text-xs">FTSE</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-geist-mono text-sm inline-flex items-baseline"><NetworthIcon className="w-3 h-3" />7,512</div>
                  <div className="font-geist-mono text-xs" style={{ color: '#84cc16' }}>+0.32%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3 - Crypto Market Cap (2 columns, 1 row) */}
          <div
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col"
            style={{ gridColumn: 'span 2', gridRow: 'span 1' }}
          >
            {/* Header with Value and Time Filter */}
            <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-white font-geist text-lg">Crypto Market Cap</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-geist-mono-regular text-lg inline-flex items-baseline">
                    <NetworthIcon className="w-4 h-4" />{displayCryptoValue.toFixed(2)}T
                  </span>
                  <span className="font-geist-mono-extralight text-sm" style={{ color: cryptoPnl.percentage >= 0 ? '#84cc16' : '#ef4444' }}>
                    {cryptoPnl.percentage >= 0 ? '+' : ''}{cryptoPnl.percentage.toFixed(2)}%
                  </span>
                </div>
              </div>
              {/* Time Interval Buttons */}
              <div className="flex gap-1 items-center">
                {(['1D', '1W', '1M', '3M', 'YTD', '1Y', '5Y', 'All'] as TimeInterval[]).map((interval) => (
                  <button
                    key={interval}
                    onClick={() => setCryptoInterval(interval)}
                    className={`px-3 py-1 font-geist-mono-extralight text-xs rounded border transition-colors ${
                      cryptoInterval === interval
                        ? 'text-white bg-white/10 border-white/20'
                        : 'text-white/50 hover:text-white hover:bg-white/5 border-white/10'
                    }`}
                  >
                    {interval}
                  </button>
                ))}

                {/* Divider */}
                <div className="h-4 w-px bg-white/20 mx-1" />

                {/* Chart Type Toggle */}
                <button
                  onClick={() => setCryptoChartType(prev => prev === 'area' ? 'candlestick' : 'area')}
                  className="px-2 py-1 rounded border border-white/20 hover:bg-white/5 transition-colors"
                  title={cryptoChartType === 'area' ? 'Switch to candlestick' : 'Switch to area'}
                >
                  {cryptoChartType === 'area' ? (
                    <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 17l6-6 4 4 8-8" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M3 17h18v4H3z" fill="currentColor" opacity="0.3"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="8" width="2" height="6"/>
                      <line x1="6" y1="6" x2="6" y2="16" stroke="currentColor" strokeWidth="1"/>
                      <rect x="11" y="10" width="2" height="4"/>
                      <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="1"/>
                      <rect x="17" y="7" width="2" height="8"/>
                      <line x1="18" y1="5" x2="18" y2="17" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Content Area - Horizontal Layout */}
            <div className="flex flex-1">
              {/* Left Side - Content */}
              <div className="flex flex-col flex-1 px-4 py-4">
                {/* Bitcoin Dominance */}
                <div className="mb-4">
                  <div className="text-white/60 font-geist text-xs mb-2">Bitcoin dominance</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-white font-geist-mono text-xs">58.98%</span>
                      <span className="text-white/60 font-geist text-xs">Bitcoin</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                      <span className="text-white font-geist-mono text-xs">13.10%</span>
                      <span className="text-white/60 font-geist text-xs">Ethereum</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                      <span className="text-white font-geist-mono text-xs">27.92%</span>
                      <span className="text-white/60 font-geist text-xs">Others</span>
                    </div>
                  </div>
                  {/* Bar visualization */}
                  <div className="flex h-1 rounded-full overflow-hidden">
                    <div className="bg-blue-500" style={{ width: '58.98%' }}></div>
                    <div className="bg-pink-500" style={{ width: '13.10%' }}></div>
                    <div className="bg-teal-500" style={{ width: '27.92%' }}></div>
                  </div>
                </div>

                {/* Bitcoin, Ethereum, and Others prices */}
                <div className="flex-1">
                  <div className="border-b border-white/10 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <AssetIcon type="crypto" symbol="BTC" size={32} />
                      <div className="flex-1">
                        <div className="text-white font-geist text-sm">Bitcoin</div>
                        <div className="text-white/40 font-geist-mono text-xs">BTCUSD</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-geist-mono text-sm inline-flex items-baseline"><NetworthIcon className="w-3 h-3" />123,287</div>
                        <div className="font-geist-mono text-xs" style={{ color: '#84cc16' }}>+1.56%</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-white/10 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <AssetIcon type="crypto" symbol="ETH" size={32} />
                      <div className="flex-1">
                        <div className="text-white font-geist text-sm">Ethereum</div>
                        <div className="text-white/40 font-geist-mono text-xs">ETHUSD</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-geist-mono text-sm inline-flex items-baseline"><NetworthIcon className="w-3 h-3" />4,521.2</div>
                        <div className="font-geist-mono text-xs" style={{ color: '#84cc16' }}>+1.61%</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">◈</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-geist text-sm">Others</div>
                      <div className="text-white/40 font-geist-mono text-xs">ALTS</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-geist-mono text-sm inline-flex items-baseline"><NetworthIcon className="w-3 h-3" />1,164.8B</div>
                      <div className="font-geist-mono text-xs" style={{ color: '#84cc16' }}>+2.34%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Chart */}
              <div className="flex-1 relative px-4 py-2">
                {cryptoChartType === 'area' ? (
                  <CustomAreaChartDione
                    data={cryptoChartData}
                    color={cryptoChartColor}
                    onHover={(data) => setHoveredCryptoData(data)}
                  />
                ) : (
                  <SimpleCandlestickChart
                    data={cryptoChartData}
                    color={cryptoChartColor}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Box 4 - Commodities (1 column, 1 row) */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 bg-white/5">
              <h3 className="text-white font-geist text-lg">Commodities</h3>
            </div>
            <div className="relative grid grid-cols-2 grid-rows-3 gap-4 flex-1 px-4 py-4">
              {/* Vertical divider - centered in the gap between columns */}
              <div className="absolute left-1/2 top-4 bottom-4 border-l border-white/5"></div>
              {/* Horizontal dividers - centered in the gaps between rows */}
              <div className="absolute left-4 right-4 border-t border-white/5" style={{ top: 'calc(33.333% + 1rem)' }}></div>
              <div className="absolute left-4 right-4 border-t border-white/5" style={{ top: 'calc(66.667% + 1.5rem)' }}></div>

              <div className="relative z-10 flex items-start gap-2">
                <AssetIcon type="commodity" symbol="GOLD" size={32} className="mt-0.5" />
                <div>
                  <div className="text-white/60 font-geist text-xs mb-1">Gold</div>
                  <div className="text-white font-geist-mono text-lg flex items-baseline inline-flex"><NetworthIcon className="w-4 h-4" />2,045</div>
                  <div className="font-geist-mono text-xs" style={{ color: '#84cc16' }}>+0.42%</div>
                </div>
              </div>
              <div className="relative z-10 flex items-start gap-2">
                <AssetIcon type="commodity" symbol="SILVER" size={32} className="mt-0.5" />
                <div>
                  <div className="text-white/60 font-geist text-xs mb-1">Silver</div>
                  <div className="text-white font-geist-mono text-lg flex items-baseline inline-flex"><NetworthIcon className="w-4 h-4" />24.12</div>
                  <div className="text-red-400 font-geist-mono text-xs">-1.39%</div>
                </div>
              </div>
              <div className="relative z-10 flex items-start gap-2">
                <AssetIcon type="commodity" symbol="OIL" size={32} className="mt-0.5" />
                <div>
                  <div className="text-white/60 font-geist text-xs mb-1">Crude Oil</div>
                  <div className="text-white font-geist-mono text-lg flex items-baseline inline-flex"><NetworthIcon className="w-4 h-4" />72.45</div>
                  <div className="font-geist-mono text-xs" style={{ color: '#84cc16' }}>+1.73%</div>
                </div>
              </div>
              <div className="relative z-10 flex items-start gap-2">
                <AssetIcon type="commodity" symbol="GAS" size={32} className="mt-0.5" />
                <div>
                  <div className="text-white/60 font-geist text-xs mb-1">Natural Gas</div>
                  <div className="text-white font-geist-mono text-lg flex items-baseline inline-flex"><NetworthIcon className="w-4 h-4" />2.87</div>
                  <div className="text-red-400 font-geist-mono text-xs">-4.01%</div>
                </div>
              </div>
              <div className="relative z-10 flex items-start gap-2">
                <AssetIcon type="commodity" symbol="COPPER" size={32} className="mt-0.5" />
                <div>
                  <div className="text-white/60 font-geist text-xs mb-1">Copper</div>
                  <div className="text-white font-geist-mono text-lg flex items-baseline inline-flex"><NetworthIcon className="w-4 h-4" />3.85</div>
                  <div className="font-geist-mono text-xs" style={{ color: '#84cc16' }}>+0.87%</div>
                </div>
              </div>
              <div className="relative z-10 flex items-start gap-2">
                <AssetIcon type="commodity" symbol="WHEAT" size={32} className="mt-0.5" />
                <div>
                  <div className="text-white/60 font-geist text-xs mb-1">Wheat</div>
                  <div className="text-white font-geist-mono text-lg flex items-baseline inline-flex"><NetworthIcon className="w-4 h-4" />6.42</div>
                  <div className="text-red-400 font-geist-mono text-xs">-0.56%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Box 5 - ETFs (2 columns, 1 row) */}
          <div
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col overflow-hidden"
            style={{ gridColumn: 'span 2', gridRow: 'span 1' }}
          >
            <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <h3 className="text-white font-geist text-lg">Top ETFs</h3>
              {/* Time Interval Buttons */}
              <div className="flex gap-1 items-center">
                {(['1D', '1W', '1M', '3M', 'YTD', '1Y', '5Y', 'All'] as TimeInterval[]).map((interval) => (
                  <button
                    key={interval}
                    onClick={() => setEtfInterval(interval)}
                    className={`px-3 py-1 font-geist-mono-extralight text-xs rounded border transition-colors ${
                      etfInterval === interval
                        ? 'text-white bg-white/10 border-white/20'
                        : 'text-white/50 hover:text-white hover:bg-white/5 border-white/10'
                    }`}
                  >
                    {interval}
                  </button>
                ))}

                {/* Divider */}
                <div className="h-4 w-px bg-white/20 mx-1" />

                {/* Chart Type Toggle */}
                <button
                  onClick={() => setEtfChartType(prev => prev === 'area' ? 'candlestick' : 'area')}
                  className="px-2 py-1 rounded border border-white/20 hover:bg-white/5 transition-colors"
                  title={etfChartType === 'area' ? 'Switch to candlestick' : 'Switch to area'}
                >
                  {etfChartType === 'area' ? (
                    <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 17l6-6 4 4 8-8" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M3 17h18v4H3z" fill="currentColor" opacity="0.3"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="8" width="2" height="6"/>
                      <line x1="6" y1="6" x2="6" y2="16" stroke="currentColor" strokeWidth="1"/>
                      <rect x="11" y="10" width="2" height="4"/>
                      <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="1"/>
                      <rect x="17" y="7" width="2" height="8"/>
                      <line x1="18" y1="5" x2="18" y2="17" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="px-4 py-4 flex flex-col flex-1">
              <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AssetIcon type="etf" symbol="SPY" size={20} />
                    <div>
                      <div className="text-white font-geist text-sm">SPDR S&P 500</div>
                      <div className="text-white/40 font-geist-mono text-xs">SPY</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-geist-mono text-lg flex items-baseline inline-flex">
                      <NetworthIcon className="w-4 h-4" />{displaySpyValue.toFixed(2)}
                    </div>
                    <div className="font-geist-mono text-xs" style={{ color: spyPnl.percentage >= 0 ? '#84cc16' : '#ef4444' }}>
                      {spyPnl.percentage >= 0 ? '+' : ''}{spyPnl.percentage.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="h-48 relative py-2">
                  {etfChartType === 'area' ? (
                    <CustomAreaChartDione
                      data={spyChartData}
                      color={spyChartColor}
                      onHover={(data) => setHoveredSpyData(data)}
                    />
                  ) : (
                    <SimpleCandlestickChart
                      data={spyChartData}
                      color={spyChartColor}
                    />
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AssetIcon type="etf" symbol="QQQ" size={20} />
                    <div>
                      <div className="text-white font-geist text-sm">Invesco QQQ</div>
                      <div className="text-white/40 font-geist-mono text-xs">QQQ</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-geist-mono text-lg flex items-baseline inline-flex">
                      <NetworthIcon className="w-4 h-4" />{displayQqqValue.toFixed(2)}
                    </div>
                    <div className="font-geist-mono text-xs" style={{ color: qqqPnl.percentage >= 0 ? '#84cc16' : '#ef4444' }}>
                      {qqqPnl.percentage >= 0 ? '+' : ''}{qqqPnl.percentage.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="h-48 relative py-2">
                  {etfChartType === 'area' ? (
                    <CustomAreaChartDione
                      data={qqqChartData}
                      color={qqqChartColor}
                      onHover={(data) => setHoveredQqqData(data)}
                    />
                  ) : (
                    <SimpleCandlestickChart
                      data={qqqChartData}
                      color={qqqChartColor}
                    />
                  )}
                </div>
              </div>
            </div>

              {/* Horizontal scrollable list of additional ETFs */}
              <div className="flex gap-4 overflow-x-auto custom-scrollbar mt-4">
                {[
                  { ticker: 'IVV', price: '477.89', change: '+0.94%', positive: true },
                  { ticker: 'VTI', price: '234.56', change: '+0.72%', positive: true },
                  { ticker: 'IWM', price: '192.34', change: '-0.45%', positive: false },
                  { ticker: 'VEA', price: '48.23', change: '+0.31%', positive: true },
                  { ticker: 'EFA', price: '78.91', change: '+0.28%', positive: true },
                  { ticker: 'BND', price: '72.45', change: '-0.12%', positive: false }
                ].map((etf) => (
                  <div
                    key={etf.ticker}
                    className="flex-shrink-0 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors border border-white/10 cursor-pointer flex items-center justify-between gap-4"
                    style={{ minWidth: '160px' }}
                  >
                    <div className="flex items-center gap-2">
                      <AssetIcon type="etf" symbol={etf.ticker} size={16} />
                      <div className="text-white font-geist-mono text-sm">{etf.ticker}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-geist-mono text-sm inline-flex items-baseline"><NetworthIcon className="w-3 h-3" />{etf.price}</div>
                      <div className="font-geist-mono text-xs" style={{ color: etf.positive ? '#84cc16' : '#ef4444' }}>
                        {etf.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Box 6 - Fear & Greed Index (1 column, 1 row) */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 bg-white/5">
              <h3 className="text-white font-geist text-lg">Fear & Greed Index</h3>
            </div>
            <div className="p-6 flex flex-col items-center justify-center flex-1">
              {/* Horizontal gauge */}
              <div className="w-full px-4">
              {/* Value above bar */}
              <div className="relative h-10 mb-2">
                <div
                  className="absolute text-white font-geist-mono text-3xl font-bold"
                  style={{ left: '68%', transform: 'translateX(-50%)' }}
                >
                  68
                </div>
              </div>

              {/* Horizontal bar with gradient */}
              <div className="relative h-4 rounded-full overflow-hidden mb-2">
                <div className="absolute inset-0 flex">
                  <div className="bg-red-500" style={{ width: '20%' }}></div>
                  <div className="bg-orange-500" style={{ width: '20%' }}></div>
                  <div className="bg-yellow-500" style={{ width: '20%' }}></div>
                  <div className="bg-lime-500" style={{ width: '20%' }}></div>
                  <div style={{ width: '20%', backgroundColor: '#84cc16' }}></div>
                </div>
                {/* Indicator dot */}
                <div
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full border-2 border-[#131313] transform -translate-y-1/2 -translate-x-1/2"
                  style={{ left: '68%' }}
                ></div>
              </div>

              {/* Fear and Greed labels */}
              <div className="flex justify-between text-white/60 font-geist text-sm mb-6">
                <span>Fear</span>
                <span>Greed</span>
              </div>

              {/* Status label below */}
              <div className="text-center">
                <div className="font-geist text-lg font-medium mb-1" style={{ color: '#84cc16' }}>Greed</div>
                <div className="text-white/40 font-geist text-xs">
                  Market sentiment is bullish
                </div>
              </div>
              </div>
            </div>
          </div>

        </div>

        {/* News Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-geist text-white text-xl">Market News</h2>
            <div className="flex gap-2">
              {(['All', 'Indices', 'Stocks', 'ETFs', 'Crypto', 'Commodities'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setNewsFilter(category)}
                  className={`px-3 py-1.5 rounded-lg font-geist text-sm transition-all ${
                    newsFilter === category
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {filteredNews.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/10 transition-all border border-white/10 group flex-shrink-0"
                style={{ width: '320px' }}
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden bg-white/5">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-geist text-white text-sm font-medium mb-2 line-clamp-2 group-hover:text-white/90">
                    {article.title}
                  </h3>
                  <p className="font-geist text-white/60 text-xs mb-3 line-clamp-2">
                    {article.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-geist-mono text-white/80 text-xs">
                        {article.author}
                      </span>
                      <span className="font-geist-mono text-white/40 text-xs">
                        {article.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="font-geist-mono text-white/60 text-xs">{article.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-geist-mono text-white/60 text-xs">{article.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Economic Calendar Section */}
        <div className="mb-6">
          <h2 className="font-geist text-white text-xl mb-4">Economic Calendar</h2>

          {/* Week View Header */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={goToToday}
                  className="px-3 py-1 bg-white text-black rounded text-sm font-geist hover:bg-white/90 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={goToPreviousWeek}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNextWeek}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <span className="text-white font-geist text-sm ml-2">{getDateRangeString()}</span>
              </div>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-2">
              {getDayLabels().map((day, index) => {
                const counts = getEventCounts(index)
                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(index)}
                    className={`p-3 rounded transition-colors cursor-pointer hover:bg-white/15 ${
                      highlightedDay === index ? 'bg-white/10' : 'bg-white/5'
                    }`}
                  >
                    <div className="text-white font-geist text-sm mb-2">{day}</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60 font-geist">Economic</span>
                        <span className="text-white font-geist-mono">{counts.economic}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60 font-geist">Earnings</span>
                        <span className="text-white font-geist-mono">{counts.earnings}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60 font-geist">Dividends</span>
                        <span className="text-white font-geist-mono">{counts.dividends}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('economic')}
                className={`px-4 py-2 rounded-lg font-geist text-sm transition-all ${
                  calendarFilter === 'economic'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Economic
              </button>
              <button
                onClick={() => handleFilterChange('earnings')}
                className={`px-4 py-2 rounded-lg font-geist text-sm transition-all ${
                  calendarFilter === 'earnings'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Earnings
              </button>
              <button
                onClick={() => handleFilterChange('revenue')}
                className={`px-4 py-2 rounded-lg font-geist text-sm transition-all ${
                  calendarFilter === 'revenue'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => handleFilterChange('dividends')}
                className={`px-4 py-2 rounded-lg font-geist text-sm transition-all ${
                  calendarFilter === 'dividends'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Dividends
              </button>
            </div>
          </div>

          {/* Events Table */}
          <div
            ref={eventsContainerRef}
            className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden h-[600px] overflow-y-scroll"
          >
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="border-b border-white/10 sticky top-0 z-10">
                  <tr>
                    <th className="text-left py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-24">Time</th>
                    {calendarFilter === 'economic' ? (
                      <>
                        <th className="text-left py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Country</th>
                        <th className="text-left py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-48">Event</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Actual</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Forecast</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Prior</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32"></th>
                      </>
                    ) : calendarFilter === 'earnings' ? (
                      <>
                        <th className="text-left py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Ticker</th>
                        <th className="text-left py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-48">Company</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Estimate EPS</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Actual EPS</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Surprise</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Market cap</th>
                      </>
                    ) : calendarFilter === 'revenue' ? (
                      <>
                        <th className="text-left py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Ticker</th>
                        <th className="text-left py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-48">Company</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Estimate revenue</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Actual revenue</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Surprise</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Market cap</th>
                      </>
                    ) : (
                      <>
                        <th className="text-left py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Ticker</th>
                        <th className="text-left py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-48">Company</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Amount</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Ex-dividend date</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Payment date</th>
                        <th className="text-right py-3 px-4 text-white/60 font-geist text-xs font-normal bg-white/5 w-32">Dividend yield</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                  {filteredEvents.map((event) => (
                    <tr
                      key={event.id}
                      data-event-id={event.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-white font-geist-mono text-sm">{event.time}</td>
                      {event.category === 'economic' ? (
                        <>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <img src="/shared/flags/us.svg" alt="US" className="w-5 h-5" />
                              <span className="text-white font-geist text-sm">{event.country}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-1 h-4 rounded ${getImportanceColor(event.importance!)}`} />
                              <span className="text-white font-geist text-sm">{event.event}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right text-white font-geist-mono text-sm">
                            {event.actual || '—'}
                          </td>
                          <td className="py-3 px-4 text-right text-white/60 font-geist-mono text-sm">
                            {event.forecast || '—'}
                          </td>
                          <td className="py-3 px-4 text-right text-white/60 font-geist-mono text-sm">
                            {event.prior || '—'}
                          </td>
                          <td className="py-3 px-4"></td>
                        </>
                      ) : event.category === 'earnings' ? (
                        <>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <AssetIcon type="stock" symbol={event.ticker!} name={event.company!} size={24} />
                              <span className="text-white font-geist-mono text-sm">{event.ticker}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-white font-geist text-sm">{event.company}</td>
                          <td className="py-3 px-4 text-right text-white/60 font-geist-mono text-sm">
                            {event.epsEstimate?.toFixed(2)} USD
                          </td>
                          <td className="py-3 px-4 text-right text-white font-geist-mono text-sm">
                            {event.epsActual?.toFixed(2)} USD
                          </td>
                          <td className="py-3 px-4 text-right font-geist-mono text-sm" style={{ color: (event.surprise || 0) >= 0 ? '#84cc16' : '#ef4444' }}>
                            {event.surprise && event.surprise >= 0 ? '+' : ''}{event.surprise?.toFixed(2)}%
                          </td>
                          <td className="py-3 px-4 text-right text-white/60 font-geist-mono text-sm">
                            {event.marketCap} USD
                          </td>
                        </>
                      ) : event.category === 'revenue' ? (
                        <>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <AssetIcon type="stock" symbol={event.ticker!} name={event.company!} size={24} />
                              <span className="text-white font-geist-mono text-sm">{event.ticker}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-white font-geist text-sm">{event.company}</td>
                          <td className="py-3 px-4 text-right text-white/60 font-geist-mono text-sm">
                            {event.revenueEstimate} USD
                          </td>
                          <td className="py-3 px-4 text-right text-white font-geist-mono text-sm">
                            {event.revenueActual} USD
                          </td>
                          <td className="py-3 px-4 text-right font-geist-mono text-sm" style={{ color: (event.surprise || 0) >= 0 ? '#84cc16' : '#ef4444' }}>
                            {event.surprise && event.surprise >= 0 ? '+' : ''}{event.surprise?.toFixed(2)}%
                          </td>
                          <td className="py-3 px-4 text-right text-white/60 font-geist-mono text-sm">
                            {event.marketCap} USD
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <AssetIcon type="stock" symbol={event.ticker!} name={event.company!} size={24} />
                              <span className="text-white font-geist-mono text-sm">{event.ticker}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-white font-geist text-sm">{event.company}</td>
                          <td className="py-3 px-4 text-right text-white font-geist-mono text-sm">
                            {event.dividendAmount?.toFixed(2)} USD
                          </td>
                          <td className="py-3 px-4 text-right text-white/60 font-geist-mono text-sm">
                            {event.exDividendDate}
                          </td>
                          <td className="py-3 px-4 text-right text-white/60 font-geist-mono text-sm">
                            {event.paymentDate}
                          </td>
                          <td className="py-3 px-4 text-right text-white font-geist-mono text-sm">
                            {event.dividendYield?.toFixed(2)}%
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Elbstream Attribution */}
            <div className="px-6 pb-4 text-right">
              <span className="text-white/40 font-geist text-xs">
                Company logos provided by{' '}
                <a
                  href="https://elbstream.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white/80 transition-colors underline"
                >
                  Elbstream
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
