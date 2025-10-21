import { useState } from 'react'

interface OrderBookTableProps {
  className?: string
}

export default function OrderBookTable({ className = '' }: OrderBookTableProps) {
  const [orderBookTab, setOrderBookTab] = useState<'yes' | 'no'>('yes')

  return (
    <div className={className}>
      {/* Trade Yes/No Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setOrderBookTab('yes')}
          className={`font-geist-mono text-xs px-3 py-1.5 rounded transition-all ${
            orderBookTab === 'yes'
              ? 'bg-lime-500 text-white'
              : 'bg-white/10 text-[#ffffe4] hover:bg-white/20'
          }`}
        >
          Trade Yes
        </button>
        <button
          onClick={() => setOrderBookTab('no')}
          className={`font-geist-mono text-xs px-3 py-1.5 rounded transition-all ${
            orderBookTab === 'no'
              ? 'bg-red-500 text-white'
              : 'bg-white/10 text-[#ffffe4] hover:bg-white/20'
          }`}
        >
          Trade No
        </button>
      </div>

      {/* Scrollable Order Book Table */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-2 mb-3 sticky top-0 bg-transparent py-2 z-10">
          <div className="font-geist-mono text-[#ffffe4]/60 text-xs text-center">TRADE YES</div>
          <div className="font-geist-mono text-[#ffffe4]/60 text-xs text-center">PRICE</div>
          <div className="font-geist-mono text-[#ffffe4]/60 text-xs text-center">SHARES</div>
          <div className="font-geist-mono text-[#ffffe4]/60 text-xs text-center">TOTAL</div>
        </div>

        {/* Asks Section (Red - Sell Orders) */}
        <div>
          {[
            { price: '63¢', shares: '3,493.00', total: '$11,791.54' },
            { price: '62¢', shares: '7,574.03', total: '$9,590.95' },
            { price: '61¢', shares: '2,950.00', total: '$4,895.05' },
            { price: '60¢', shares: '5,159.25', total: '$3,095.55' }
          ].map((order, i) => (
            <div key={i} className={`grid grid-cols-4 gap-2 py-2 hover:bg-white/5 transition-colors border-b border-white/20 ${i === 0 ? 'border-t border-white/20' : ''}`}>
              <div className="font-geist-mono text-xs text-center text-[#ffffe4]">{order.price}</div>
              <div className="font-geist-mono text-xs text-center text-[#ffffe4]">{order.price}</div>
              <div className="font-geist-mono text-xs text-center text-[#ffffe4]/80">{order.shares}</div>
              <div className="font-geist-mono text-xs text-center text-[#ffffe4]/80">{order.total}</div>
            </div>
          ))}
          <div className="py-2 flex items-center">
            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-geist-mono">Asks</span>
          </div>
        </div>

        {/* Last Price & Spread */}
        <div className="py-3 border-y border-white/20 bg-white/5">
          <div className="flex justify-between font-geist-mono text-xs text-[#ffffe4]/60 px-2">
            <span>Last: 59¢</span>
            <span>Spread: 1¢</span>
          </div>
        </div>

        {/* Bids Section (Green - Buy Orders) */}
        <div>
          <div className="py-2 flex items-center">
            <span className="bg-lime-500 text-white px-2 py-0.5 rounded text-xs font-geist-mono">Bids</span>
          </div>
          {[
            { price: '59¢', shares: '764.94', total: '$451.31' },
            { price: '58¢', shares: '7,288.02', total: '$4,678.36' },
            { price: '57¢', shares: '4,012.70', total: '$6,965.60' },
            { price: '56¢', shares: '4,838.00', total: '$9,674.88' }
          ].map((order, i) => (
            <div key={i} className={`grid grid-cols-4 gap-2 py-2 hover:bg-white/5 transition-colors border-b border-white/20 ${i === 0 ? 'border-t border-white/20' : ''}`}>
              <div className="font-geist-mono text-xs text-center text-[#ffffe4]">{order.price}</div>
              <div className="font-geist-mono text-xs text-center text-[#ffffe4]">{order.price}</div>
              <div className="font-geist-mono text-xs text-center text-[#ffffe4]/80">{order.shares}</div>
              <div className="font-geist-mono text-xs text-center text-[#ffffe4]/80">{order.total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
