import { useState, useEffect } from 'react'
import { dioneApi, type Trade } from '../../services/api/dioneApi'
import { useOrders } from '../../contexts/OrdersContext'
import { AssetIcon } from '../../utils/iconHelper'
import { mockTokens } from './mockData'

// Helper function to determine asset type from symbol
const getAssetTypeFromSymbol = (symbol: string): 'crypto' | 'stock' | 'index' | 'etf' | 'commodity' => {
  const token = mockTokens.find(t => t.symbol === symbol || t.symbol === `${symbol}USDT`)
  if (!token) {
    // Default guess based on common patterns
    if (['BTC', 'ETH', 'SOL', 'AVAX', 'LINK'].includes(symbol)) return 'crypto'
    if (['SPX', 'NDQ', 'DJI'].includes(symbol)) return 'index'
    return 'stock' // Default to stock
  }

  // Map category to AssetIcon type
  const categoryMap: Record<string, 'crypto' | 'stock' | 'index' | 'etf' | 'commodity'> = {
    'crypto': 'crypto',
    'stocks': 'stock',
    'indices': 'index',
    'etfs': 'etf',
    'commodities': 'commodity'
  }
  return categoryMap[token.category] || 'stock'
}

const getAssetNameFromSymbol = (symbol: string): string => {
  const token = mockTokens.find(t => t.symbol === symbol || t.symbol === `${symbol}USDT`)
  return token?.name || symbol
}

const mockTrades_DEPRECATED: any[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    symbol: 'BTC',
    type: 'buy',
    size: 0.5,
    entryPrice: 50000,
    exitPrice: 50250,
    pnl: 125,
    status: 'closed'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    symbol: 'ETH',
    type: 'sell',
    size: 2,
    entryPrice: 3200,
    exitPrice: 3150,
    pnl: 100,
    status: 'closed'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    symbol: 'SOL',
    type: 'buy',
    size: 10,
    entryPrice: 120,
    exitPrice: 115,
    pnl: -50,
    status: 'closed'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    symbol: 'BTC',
    type: 'sell',
    size: 0.3,
    entryPrice: 49800,
    exitPrice: 49600,
    pnl: 60,
    status: 'closed'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    symbol: 'AVAX',
    type: 'buy',
    size: 20,
    entryPrice: 45,
    exitPrice: 47,
    pnl: 40,
    status: 'closed'
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    symbol: 'ETH',
    type: 'buy',
    size: 1.5,
    entryPrice: 3180,
    exitPrice: 3100,
    pnl: -120,
    status: 'closed'
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    symbol: 'LINK',
    type: 'sell',
    size: 50,
    entryPrice: 18,
    exitPrice: 17.5,
    pnl: 25,
    status: 'closed'
  },
  {
    id: '8',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    symbol: 'BTC',
    type: 'buy',
    size: 0.2,
    entryPrice: 49500,
    pnl: -30,
    status: 'open'
  },
]

export default function TradeHistory() {
  const { refreshTrigger } = useOrders()
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all')
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  const loadTrades = async () => {
    try {
      const userTrades = await dioneApi.getUserTrades()
      setTrades(userTrades)
    } catch (error) {
      console.error('Error loading trades:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrades()
  }, [])

  // Refresh when orders context triggers a refresh
  useEffect(() => {
    if (refreshTrigger > 0) {
      loadTrades()
    }
  }, [refreshTrigger])

  const filteredTrades = trades.filter(trade => {
    if (filter === 'all') return true
    return trade.status === filter
  })

  const formatTime = (timestamp: string) => {
    const now = Date.now()
    const date = new Date(timestamp)
    const diff = now - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <h3 className="text-white font-geist text-lg">Trade History</h3>

        {/* Filter */}
        <div className="flex items-center gap-1 bg-white/5 rounded p-0.5">
          {(['all', 'open', 'closed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 font-geist-mono-extralight text-[10px] rounded transition-colors capitalize ${
                filter === f
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white/40 font-geist-mono-extralight border-b border-white/10">
              <th className="text-left pt-2 pb-2 pl-4 pr-2 uppercase text-xs">Time</th>
              <th className="text-left pt-2 pb-2 px-2 uppercase text-xs">Symbol</th>
              <th className="text-left pt-2 pb-2 px-2 uppercase text-xs">Type</th>
              <th className="text-right pt-2 pb-2 px-2 uppercase text-xs">Size</th>
              <th className="text-right pt-2 pb-2 px-2 uppercase text-xs">Price</th>
              <th className="text-right pt-2 pb-2 pl-2 pr-4 uppercase text-xs">PnL</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map((trade) => (
              <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-2.5 pl-4 pr-2 text-left text-white/60 font-geist-mono-extralight whitespace-nowrap">
                  {formatTime(trade.timestamp)}
                </td>
                <td className="py-2.5 px-2 text-left">
                  <div className="flex items-center gap-1">
                    <AssetIcon type={getAssetTypeFromSymbol(trade.symbol)} symbol={trade.symbol} name={getAssetNameFromSymbol(trade.symbol)} size={16} className="flex-shrink-0" />
                    <span className="text-white/80 font-geist-mono whitespace-nowrap">{trade.symbol}</span>
                  </div>
                </td>
                <td className="py-2.5 px-2 text-left">
                  <span
                    className="font-geist-mono uppercase whitespace-nowrap"
                    style={{ color: trade.type === 'buy' ? '#84cc16' : '#ef4444' }}
                  >
                    {trade.type}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-right text-white/60 font-geist-mono whitespace-nowrap">
                  {trade.quantity}
                </td>
                <td className="py-2.5 px-2 text-right text-white/60 font-geist-mono whitespace-nowrap">
                  {trade.exitPrice ? trade.exitPrice.toLocaleString() : trade.entryPrice.toLocaleString()}
                </td>
                <td className="py-2.5 pl-2 pr-4 text-right">
                  <span
                    className="font-geist-mono whitespace-nowrap"
                    style={{ color: trade.pnl > 0 ? '#84cc16' : trade.pnl < 0 ? '#ef4444' : 'rgba(255, 255, 255, 0.6)' }}
                  >
                    {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
