import { useState } from 'react'
import { mockTokens } from './mockData'
import NetworthIcon from '../shared/NetworthIcon'

interface PriceAlert {
  id: string
  symbol: string
  currentPrice: number
  targetPrice: number
  condition: 'above' | 'below'
  status: 'active' | 'triggered' | 'expired'
  createdAt: Date
}

const mockAlerts: PriceAlert[] = [
  {
    id: '1',
    symbol: 'BTC',
    currentPrice: 50250,
    targetPrice: 51000,
    condition: 'above',
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    symbol: 'ETH',
    currentPrice: 3150,
    targetPrice: 3000,
    condition: 'below',
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    id: '3',
    symbol: 'SOL',
    currentPrice: 115,
    targetPrice: 120,
    condition: 'above',
    status: 'triggered',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    symbol: 'AVAX',
    currentPrice: 47,
    targetPrice: 45,
    condition: 'below',
    status: 'active',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: '5',
    symbol: 'LINK',
    currentPrice: 17.5,
    targetPrice: 18.5,
    condition: 'above',
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
]

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(mockAlerts)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAlert, setNewAlert] = useState({
    symbol: 'BTC',
    targetPrice: '',
    condition: 'above' as 'above' | 'below'
  })

  const handleAddAlert = () => {
    const token = mockTokens.find(t => t.symbol === newAlert.symbol)
    if (!token || !newAlert.targetPrice) return

    const alert: PriceAlert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol,
      currentPrice: token.price,
      targetPrice: parseFloat(newAlert.targetPrice),
      condition: newAlert.condition,
      status: 'active',
      createdAt: new Date()
    }

    setAlerts([alert, ...alerts])
    setShowAddModal(false)
    setNewAlert({ symbol: 'BTC', targetPrice: '', condition: 'above' })
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id))
  }

  const getStatusColor = (status: PriceAlert['status']) => {
    switch (status) {
      case 'active':
        return '#eab308'
      case 'triggered':
        return '#84cc16'
      case 'expired':
        return 'rgba(255, 255, 255, 0.4)'
    }
  }

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <h3 className="text-white font-geist text-lg">Price Alerts</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white font-geist text-xs rounded transition-colors"
        >
          + Add
        </button>
      </div>

      {/* Table Header */}
      <div className="px-4 py-2 grid grid-cols-5 gap-2 border-b border-white/10">
        <div className="text-white/40 font-geist-mono-extralight text-[10px] uppercase">Symbol</div>
        <div className="text-white/40 font-geist-mono-extralight text-[10px] uppercase text-right">Current</div>
        <div className="text-white/40 font-geist-mono-extralight text-[10px] uppercase text-center">Condition</div>
        <div className="text-white/40 font-geist-mono-extralight text-[10px] uppercase text-right">Target</div>
        <div className="text-white/40 font-geist-mono-extralight text-[10px] uppercase text-center">Status</div>
      </div>

      {/* Alert Entries */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="px-4 py-2.5 grid grid-cols-5 gap-2 border-b border-white/5 hover:bg-white/5 transition-colors group"
          >
            {/* Symbol */}
            <div className="flex items-center">
              <div className="text-white/80 font-geist-mono text-xs">{alert.symbol}</div>
            </div>

            {/* Current Price */}
            <div className="flex items-center justify-end">
              <div className="text-white/60 font-geist-mono text-xs flex items-baseline">
                <NetworthIcon className="w-3 h-3" />{alert.currentPrice.toLocaleString()}
              </div>
            </div>

            {/* Condition */}
            <div className="flex items-center justify-center">
              <div className="text-white/60 font-geist-mono-extralight text-xs">
                {alert.condition === 'above' ? '>' : '<'}
              </div>
            </div>

            {/* Target Price */}
            <div className="flex items-center justify-end">
              <div className="text-white/80 font-geist-mono text-xs flex items-baseline">
                <NetworthIcon className="w-3 h-3" />{alert.targetPrice.toLocaleString()}
              </div>
            </div>

            {/* Status & Delete */}
            <div className="flex items-center justify-center gap-2">
              <div className="font-geist-mono text-xs" style={{ color: getStatusColor(alert.status) }}>
                ●
              </div>
              <button
                onClick={() => handleDeleteAlert(alert.id)}
                className="opacity-0 group-hover:opacity-100 text-white/40 transition-all"
                style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Alert Modal */}
      {showAddModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 w-80 p-4">
            <h3 className="text-white font-geist text-sm mb-4">Add Price Alert</h3>

            {/* Symbol Selector */}
            <div className="mb-3">
              <label className="text-white/60 font-geist-mono-extralight text-xs block mb-1">Symbol</label>
              <select
                value={newAlert.symbol}
                onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-geist-mono text-sm focus:outline-none focus:border-white/20"
              >
                {mockTokens.map(token => (
                  <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div className="mb-3">
              <label className="text-white/60 font-geist-mono-extralight text-xs block mb-1">Condition</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setNewAlert({ ...newAlert, condition: 'above' })}
                  className={`flex-1 px-3 py-2 rounded font-geist-mono text-xs transition-colors ${
                    newAlert.condition === 'above'
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'bg-white/5 text-white/60 border border-white/10'
                  }`}
                >
                  Above
                </button>
                <button
                  onClick={() => setNewAlert({ ...newAlert, condition: 'below' })}
                  className={`flex-1 px-3 py-2 rounded font-geist-mono text-xs transition-colors ${
                    newAlert.condition === 'below'
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'bg-white/5 text-white/60 border border-white/10'
                  }`}
                >
                  Below
                </button>
              </div>
            </div>

            {/* Target Price */}
            <div className="mb-4">
              <label className="text-white/60 font-geist-mono-extralight text-xs block mb-1">Target Price</label>
              <input
                type="number"
                value={newAlert.targetPrice}
                onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-geist-mono text-sm focus:outline-none focus:border-white/20"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white font-geist text-xs rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAlert}
                className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-geist text-xs rounded transition-colors"
              >
                Add Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
