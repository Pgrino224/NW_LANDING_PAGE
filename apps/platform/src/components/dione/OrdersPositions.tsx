import { useState } from 'react'

type Tab = 'orders' | 'positions' | 'history'

interface ActiveOrder {
  orderId: string
  symbol: string
  type: string
  side: 'Buy' | 'Sell'
  qty: number
  price: number
  status: 'Pending' | 'Partial' | 'Filled'
}

interface OpenPosition {
  posId: string
  symbol: string
  side: 'Long' | 'Short'
  entry: number
  qty: number
  mark: number
  pnl: number
}

interface HistoricalOrder {
  orderId: string
  symbol: string
  type: string
  side: 'Buy' | 'Sell'
  qty: number
  price: number
  filled: string
  date: string
}

const mockActiveOrders: ActiveOrder[] = [
  { orderId: '#12834', symbol: 'NVDA', type: 'Limit', side: 'Buy', qty: 50, price: 179.50, status: 'Pending' },
  { orderId: '#12835', symbol: 'TSLA', type: 'Stop-Limit', side: 'Sell', qty: 25, price: 395.00, status: 'Pending' },
  { orderId: '#12836', symbol: 'AAPL', type: 'Limit', side: 'Buy', qty: 100, price: 225.00, status: 'Partial' },
]

const mockOpenPositions: OpenPosition[] = [
  { posId: 'POS001', symbol: 'NVDA', side: 'Long', entry: 180.50, qty: 100, mark: 182.93, pnl: 243.00 },
  { posId: 'POS002', symbol: 'AAPL', side: 'Short', entry: 195.20, qty: 50, mark: 194.80, pnl: 20.00 },
  { posId: 'POS003', symbol: 'MSFT', side: 'Long', entry: 380.00, qty: 75, mark: 378.50, pnl: -112.50 },
]

const mockOrderHistory: HistoricalOrder[] = [
  { orderId: '#12830', symbol: 'NVDA', type: 'Market', side: 'Buy', qty: 100, price: 180.50, filled: '100/100', date: '2025-10-05 14:23' },
  { orderId: '#12831', symbol: 'AAPL', type: 'Limit', side: 'Sell', qty: 50, price: 195.20, filled: '50/50', date: '2025-10-05 11:15' },
  { orderId: '#12832', symbol: 'MSFT', type: 'Market', side: 'Buy', qty: 75, price: 380.00, filled: '75/75', date: '2025-10-04 16:42' },
  { orderId: '#12833', symbol: 'TSLA', type: 'Limit', side: 'Buy', qty: 30, price: 390.00, filled: '30/30', date: '2025-10-04 09:30' },
]

export default function OrdersPositions() {
  const [activeTab, setActiveTab] = useState<Tab>('orders')

  const totalPositions = mockOpenPositions.length
  const unrealizedPnl = mockOpenPositions.reduce((sum, pos) => sum + pos.pnl, 0)
  const marginUsed = mockOpenPositions.reduce((sum, pos) => sum + (pos.entry * pos.qty), 0)

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 px-4 py-3 font-geist text-xs transition-colors ${
            activeTab === 'orders'
              ? 'text-white border-b-2 border-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Active Orders
        </button>
        <button
          onClick={() => setActiveTab('positions')}
          className={`flex-1 px-4 py-3 font-geist text-xs transition-colors ${
            activeTab === 'positions'
              ? 'text-white border-b-2 border-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Open Positions
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-3 font-geist text-xs transition-colors ${
            activeTab === 'history'
              ? 'text-white border-b-2 border-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Order History
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Active Orders Tab */}
        {activeTab === 'orders' && (
          <div className="p-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-white/50 font-geist-mono-extralight">
                  <th className="text-left pb-3">Order ID</th>
                  <th className="text-left pb-3">Symbol</th>
                  <th className="text-left pb-3">Type</th>
                  <th className="text-left pb-3">Side</th>
                  <th className="text-right pb-3">Qty</th>
                  <th className="text-right pb-3">Price</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-right pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockActiveOrders.map((order) => (
                  <tr key={order.orderId} className="border-t border-white/5">
                    <td className="py-3 text-white font-geist-mono-regular">{order.orderId}</td>
                    <td className="py-3 text-white font-geist">{order.symbol}</td>
                    <td className="py-3 text-white/70 font-geist-mono-extralight">{order.type}</td>
                    <td className="py-3">
                      <span className={`font-geist ${order.side === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
                        {order.side}
                      </span>
                    </td>
                    <td className="py-3 text-right text-white font-geist-mono-regular">{order.qty}</td>
                    <td className="py-3 text-right text-white font-geist-mono-regular">${order.price.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-geist ${
                        order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        order.status === 'Partial' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white font-geist text-[10px] rounded transition-colors">
                          Modify
                        </button>
                        <button className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-geist text-[10px] rounded transition-colors">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Open Positions Tab */}
        {activeTab === 'positions' && (
          <div className="p-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-white/50 font-geist-mono-extralight">
                  <th className="text-left pb-3">Pos ID</th>
                  <th className="text-left pb-3">Symbol</th>
                  <th className="text-left pb-3">Side</th>
                  <th className="text-right pb-3">Entry</th>
                  <th className="text-right pb-3">Qty</th>
                  <th className="text-right pb-3">Mark</th>
                  <th className="text-right pb-3">PNL</th>
                  <th className="text-right pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockOpenPositions.map((pos) => (
                  <tr key={pos.posId} className="border-t border-white/5">
                    <td className="py-3 text-white font-geist-mono-regular">{pos.posId}</td>
                    <td className="py-3 text-white font-geist">{pos.symbol}</td>
                    <td className="py-3">
                      <span className={`font-geist ${pos.side === 'Long' ? 'text-green-500' : 'text-red-500'}`}>
                        {pos.side}
                      </span>
                    </td>
                    <td className="py-3 text-right text-white font-geist-mono-regular">${pos.entry.toFixed(2)}</td>
                    <td className="py-3 text-right text-white font-geist-mono-regular">{pos.qty}</td>
                    <td className="py-3 text-right text-white font-geist-mono-regular">${pos.mark.toFixed(2)}</td>
                    <td className="py-3 text-right">
                      <span className={`font-geist-mono-regular ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-geist text-[10px] rounded transition-colors">
                        Close
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex gap-6 text-xs">
              <div>
                <span className="text-white/50 font-geist-mono-extralight">Total: </span>
                <span className="text-white font-geist-mono-regular">{totalPositions} positions</span>
              </div>
              <div>
                <span className="text-white/50 font-geist-mono-extralight">Unrealized PNL: </span>
                <span className={`font-geist-mono-regular ${unrealizedPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {unrealizedPnl >= 0 ? '+' : ''}${unrealizedPnl.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-white/50 font-geist-mono-extralight">Margin Used: </span>
                <span className="text-white font-geist-mono-regular">${marginUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === 'history' && (
          <div className="p-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-white/50 font-geist-mono-extralight">
                  <th className="text-left pb-3">Order ID</th>
                  <th className="text-left pb-3">Symbol</th>
                  <th className="text-left pb-3">Type</th>
                  <th className="text-left pb-3">Side</th>
                  <th className="text-right pb-3">Qty</th>
                  <th className="text-right pb-3">Price</th>
                  <th className="text-left pb-3">Filled</th>
                  <th className="text-left pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockOrderHistory.map((order) => (
                  <tr key={order.orderId} className="border-t border-white/5">
                    <td className="py-3 text-white font-geist-mono-regular">{order.orderId}</td>
                    <td className="py-3 text-white font-geist">{order.symbol}</td>
                    <td className="py-3 text-white/70 font-geist-mono-extralight">{order.type}</td>
                    <td className="py-3">
                      <span className={`font-geist ${order.side === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
                        {order.side}
                      </span>
                    </td>
                    <td className="py-3 text-right text-white font-geist-mono-regular">{order.qty}</td>
                    <td className="py-3 text-right text-white font-geist-mono-regular">${order.price.toFixed(2)}</td>
                    <td className="py-3 text-white/70 font-geist-mono-extralight">{order.filled}</td>
                    <td className="py-3 text-white/50 font-geist-mono-extralight">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
