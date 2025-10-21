import { useMemo, useState, useEffect } from 'react'
import { dioneApi, type Position, type Trade } from '../../services/api/dioneApi'
import { useBalance } from '../../contexts/BalanceContext'
import { useOrders } from '../../contexts/OrdersContext'
import CustomAreaChartDione from '../charts/CustomAreaChartDione'
import DonutChart from './DonutChart'
import GaugeChart from './GaugeChart'
import TradingQuadrantScatter from './TradingQuadrantScatter'
import NetworthIcon from '../shared/NetworthIcon'
import { AssetIcon } from '../../utils/iconHelper'

type TimeInterval = '1D' | '1W' | '1M' | '3M' | 'YTD' | '1Y' | '5Y' | 'All'

// Helper function to assign colors to symbols
const getColorForSymbol = (symbol: string): string => {
  const colors: Record<string, string> = {
    'BTC': '#F7931A',
    'ETH': '#627EEA',
    'SOL': '#14F195',
    'ADA': '#0033AD',
    'DOT': '#E6007A',
    'LINK': '#2A5ADA',
  }
  return colors[symbol] || '#8B5CF6'
}

// Helper function to format timestamp
const formatTimeAgo = (timestamp: string): string => {
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  return `${diffDays} days ago`
}

export default function PortfolioDashboard() {
  const { balances } = useBalance()
  const { refreshTrigger } = useOrders()
  const [portfolioInterval, setPortfolioInterval] = useState<TimeInterval>('1M')
  const [positions, setPositions] = useState<Position[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredChartData, setHoveredChartData] = useState<{ value: number; time: number } | null>(null)

  // Load positions and trades
  useEffect(() => {
    const loadData = async () => {
      try {
        const [positionsData, tradesData] = await Promise.all([
          dioneApi.getUserPositions(),
          dioneApi.getUserTrades()
        ])
        setPositions(positionsData)
        setTrades(tradesData)
      } catch (error) {
        console.error('Error loading portfolio data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [refreshTrigger])

  // Calculate portfolio value (balance + positions value)
  const portfolioValue = useMemo(() => {
    const positionsValue = positions.reduce((sum, pos) =>
      sum + (pos.currentPrice * pos.quantity), 0)
    return balances.networth + positionsValue
  }, [positions, balances.networth])

  // Calculate total PnL from positions
  const totalPnL = useMemo(() => {
    return positions.reduce((sum, pos) => sum + pos.pnl, 0)
  }, [positions])

  // Calculate PnL percentage
  const pnlPercentage = useMemo(() => {
    if (portfolioValue === 0) return 0
    return (totalPnL / (portfolioValue - totalPnL)) * 100
  }, [portfolioValue, totalPnL])

  // Find biggest win from closed trades
  const biggestWin = useMemo(() => {
    const closedTrades = trades.filter(t => t.status === 'closed' && t.pnl > 0)
    if (closedTrades.length === 0) return null
    return closedTrades.reduce((max, trade) => trade.pnl > max.pnl ? trade : max)
  }, [trades])

  // Calculate top holdings distribution
  const topHoldings = useMemo(() => {
    const holdings = positions.map(pos => ({
      symbol: pos.symbol,
      value: pos.currentPrice * pos.quantity
    }))
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0)
    if (totalValue === 0) return []

    return holdings.map(h => ({
      label: h.symbol,
      value: (h.value / totalValue) * 100,
      color: getColorForSymbol(h.symbol)
    }))
  }, [positions])

  // Calculate win rate from closed trades
  const winRate = useMemo(() => {
    const closedTrades = trades.filter(t => t.status === 'closed')
    if (closedTrades.length === 0) return { percentage: 0, wins: 0, losses: 0 }

    const wins = closedTrades.filter(t => t.pnl > 0).length
    const losses = closedTrades.filter(t => t.pnl <= 0).length

    return {
      percentage: (wins / closedTrades.length) * 100,
      wins,
      losses
    }
  }, [trades])

  // Get recent activity (last 5 closed trades)
  const recentActivity = useMemo(() => {
    return trades
      .filter(t => t.status === 'closed')
      .slice(0, 5)
  }, [trades])

  // Generate mock portfolio data with timestamps based on selected interval
  const portfolioData = useMemo(() => {
    const data: { time: number; value: number }[] = []
    const startValue = 100000
    const now = Math.floor(Date.now() / 1000) // Current time in seconds

    // Determine number of days and interval based on selection
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

    const config = intervalConfig[portfolioInterval]
    const totalSteps = Math.floor((config.days * 24) / config.stepHours)
    const stepSeconds = config.stepHours * 3600

    for (let i = totalSteps; i >= 0; i--) {
      const randomWalk = Math.random() * 2000 - 500
      const trend = (totalSteps - i) * (24000 / totalSteps) // Overall upward trend
      const value = startValue + trend + randomWalk
      const time = now - (i * stepSeconds)

      data.push({ time, value })
    }

    return data
  }, [portfolioInterval])

  // Calculate PnL based on timeframe (first vs last value)
  const timeframePnL = useMemo(() => {
    if (portfolioData.length < 2) return { amount: 0, percentage: 0 }

    const firstValue = portfolioData[0].value
    const lastValue = portfolioData[portfolioData.length - 1].value
    const pnlAmount = lastValue - firstValue
    const pnlPercentage = (pnlAmount / firstValue) * 100

    return {
      amount: pnlAmount,
      percentage: pnlPercentage
    }
  }, [portfolioData])

  // Determine chart color based on PnL
  const chartColor = useMemo(() => {
    return timeframePnL.percentage >= 0 ? '#84cc16' : '#ef4444' // green or red
  }, [timeframePnL.percentage])

  // Display values (use hovered data if available, otherwise use latest)
  const displayValue = hoveredChartData?.value ?? (portfolioData[portfolioData.length - 1]?.value || portfolioValue)
  const displayPnl = useMemo(() => {
    if (!portfolioData.length) return { amount: 0, percentage: 0 }
    const startValue = portfolioData[0].value
    const pnlAmount = displayValue - startValue
    const pnlPercentage = (pnlAmount / startValue) * 100
    return { amount: pnlAmount, percentage: pnlPercentage }
  }, [displayValue, portfolioData])

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <img src="/dione/title-icons/dione-icon.svg" alt="" className="w-12 h-12" />
        <h1 className="font-geist-bold text-white text-3xl">PORTFOLIO</h1>
      </div>

      {/* Bento Grid: 3 columns x 2 rows */}
      <div className="w-full grid gap-4 pb-4" style={{
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, minmax(400px, 1fr))'
      }}>
        {/* Large Chart - Portfolio Value (spans 2 columns) */}
        <div
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col overflow-hidden"
          style={{ gridColumn: 'span 2' }}
        >
          <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-white font-geist text-lg">PnL</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-white font-geist-mono-regular text-lg flex items-baseline">
                  <NetworthIcon className="w-4 h-4" />
                  {displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="font-geist-mono-extralight text-sm" style={{ color: displayPnl.percentage >= 0 ? '#84cc16' : '#ef4444' }}>
                  {displayPnl.percentage >= 0 ? '+' : ''}{displayPnl.percentage.toFixed(2)}%
                </span>
              </div>
            </div>
            {/* Time Interval Buttons - Top Right */}
            <div className="flex gap-1">
              {(['1D', '1W', '1M', '3M', 'YTD', '1Y', '5Y', 'All'] as TimeInterval[]).map((interval) => (
                <button
                  key={interval}
                  onClick={() => setPortfolioInterval(interval)}
                  className={`px-3 py-1 font-geist-mono-extralight text-xs rounded border transition-colors ${
                    portfolioInterval === interval
                      ? 'text-white bg-white/10 border-white/20'
                      : 'text-white/50 hover:text-white hover:bg-white/5 border-white/10'
                  }`}
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 relative px-4 pb-6">
            <CustomAreaChartDione
              data={portfolioData}
              color={chartColor}
              onHover={(data) => setHoveredChartData(data)}
            />
          </div>
        </div>

        {/* Card 1 - Trading Activity Scatter Plot */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-geist text-lg">Trading Activity by Type</h3>
          </div>
          <div className="flex-1">
            {trades.filter(t => t.status === 'closed').length > 0 ? (
              <TradingQuadrantScatter trades={trades} />
            ) : (
              <div className="flex items-center justify-center h-full text-white/50 font-geist text-sm">
                No closed trades yet
              </div>
            )}
          </div>
        </div>

        {/* Card 2 - Top Holdings with Donut Chart */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-geist text-lg">Top Holdings</h3>
          </div>
          <div className="flex-1 p-6">
            {topHoldings.length > 0 ? (
              <DonutChart segments={topHoldings} />
            ) : (
              <div className="flex items-center justify-center h-full text-white/50 font-geist text-sm">
                No positions
              </div>
            )}
          </div>
        </div>

        {/* Card 3 - Win Rate with Gauge Chart */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-geist text-lg">Win Rate</h3>
          </div>
          <div className="flex-1 p-6">
            <GaugeChart
              value={winRate.percentage}
              wins={winRate.wins}
              losses={winRate.losses}
              biggestWin={biggestWin ? {
                symbol: biggestWin.symbol,
                name: biggestWin.name,
                assetType: biggestWin.assetType,
                pnl: biggestWin.pnl,
                returnPercent: ((biggestWin.exitPrice! - biggestWin.entryPrice) / biggestWin.entryPrice) * 100
              } : undefined}
            />
          </div>
        </div>

        {/* Card 4 - Recent Activity */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-geist text-lg">Recent Activity</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((trade) => (
                <div key={trade.id} className="px-4 py-2.5 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <AssetIcon
                      type={trade.assetType}
                      symbol={trade.symbol}
                      name={trade.name}
                      size={32}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-geist text-sm">{trade.symbol} {trade.type.charAt(0).toUpperCase() + trade.type.slice(1)}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-geist-mono font-bold uppercase ${
                            trade.tradingType === 'spot' ? 'bg-blue-500/20 text-blue-400' :
                            trade.tradingType === 'margin' ? 'bg-purple-500/20 text-purple-400' :
                            trade.tradingType === 'futures' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-pink-500/20 text-pink-400'
                          }`}
                        >
                          {trade.tradingType}
                        </span>
                      </div>
                      <div className="text-white/40 font-geist-mono text-xs">
                        {formatTimeAgo(trade.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-geist-mono text-sm inline-flex items-baseline" style={{ color: trade.pnl >= 0 ? '#84cc16' : '#ef4444' }}>
                      {trade.pnl >= 0 ? '+' : ''}<NetworthIcon className="w-3 h-3" />{Math.abs(trade.pnl).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-white/50 font-geist text-sm p-6">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
