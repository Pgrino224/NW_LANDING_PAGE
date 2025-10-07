import { useState } from 'react'
import SymbolSelector from './SymbolSelector'
import TradingPanel from './TradingPanel'
import OrdersPositions from './OrdersPositions'
import { mockTokens } from './mockData'
import type { Token } from './mockData'

export default function DEXTrading() {
  const [chart1Token, setChart1Token] = useState<Token>(mockTokens[6]) // BTC
  const [chart2Token, setChart2Token] = useState<Token>(mockTokens[7]) // ETH
  const [tradingPanel, setTradingPanel] = useState<{ token: Token; mode: 'buy' | 'sell' } | null>(null)

  const timeIntervals = ['1D', '1W', '1M', '3M', 'YTD', '1Y', '5Y', 'All']

  return (
    <div className="w-full h-full p-6">
      {/* Bento Grid: 3 columns x 2 rows */}
      <div className="w-full h-full grid gap-4" style={{
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)'
      }}>
        {/* Box 1 - Top Chart */}
        <div
          className="bg-[#131313] border border-white/10 rounded-lg p-4 flex flex-col"
          style={{ gridColumn: 'span 2', gridRow: 'span 1' }}
        >
          {/* Chart Header - Top Row */}
          <div className="mb-2 flex items-center justify-between">
            <SymbolSelector
              selectedToken={chart1Token}
              availableTokens={mockTokens}
              onSelectToken={setChart1Token}
            />

            {/* Buy/Sell Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTradingPanel({ token: chart1Token, mode: 'buy' })}
                className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white font-geist text-sm rounded transition-colors"
              >
                Buy
              </button>
              <button
                onClick={() => setTradingPanel({ token: chart1Token, mode: 'sell' })}
                className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white font-geist text-sm rounded transition-colors"
              >
                Sell
              </button>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="flex-1 flex items-center justify-center border border-white/5 rounded bg-black/20">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-2 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-white/30 font-geist-mono-extralight text-sm">Candlestick Chart</p>
            </div>
          </div>

          {/* Bottom Row: Time Intervals + OHLC Data */}
          <div className="flex items-center justify-between mt-4">
            {/* Time Interval Buttons - Left */}
            <div className="flex items-center gap-2">
              {timeIntervals.map((interval) => (
                <button
                  key={interval}
                  className="px-3 py-1 text-white/50 hover:text-white hover:bg-white/5 font-geist-mono-extralight text-xs rounded transition-colors"
                >
                  {interval}
                </button>
              ))}
            </div>

            {/* OHLC Data - Right */}
            <div className="flex items-center gap-4 text-xs font-geist-mono-extralight">
              <div>
                <span className="text-white/40">O</span>
                <span className="text-white ml-1">199.02</span>
              </div>
              <div>
                <span className="text-white/40">H</span>
                <span className="text-white ml-1">199.20</span>
              </div>
              <div>
                <span className="text-white/40">L</span>
                <span className="text-white ml-1">194.07</span>
              </div>
              <div>
                <span className="text-white/40">C</span>
                <span className="text-white ml-1">197.43</span>
              </div>
              <div>
                <span className="text-white/40">V</span>
                <span className="text-white ml-1">84.04M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 3 - Top right */}
        <div
          className="bg-[#131313] border border-white/10 rounded-lg p-6"
          style={{ gridColumn: 'span 1', gridRow: 'span 1' }}
        >
          <h3 className="text-white font-geist text-sm">Box 3 - Right Top (1×1)</h3>
        </div>

        {/* Box 2 - Bottom Chart */}
        <div
          className="bg-[#131313] border border-white/10 rounded-lg p-4 flex flex-col"
          style={{ gridColumn: 'span 2', gridRow: 'span 1' }}
        >
          {/* Chart Header - Top Row */}
          <div className="mb-2 flex items-center justify-between">
            <SymbolSelector
              selectedToken={chart2Token}
              availableTokens={mockTokens}
              onSelectToken={setChart2Token}
            />

            {/* Buy/Sell Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTradingPanel({ token: chart2Token, mode: 'buy' })}
                className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white font-geist text-sm rounded transition-colors"
              >
                Buy
              </button>
              <button
                onClick={() => setTradingPanel({ token: chart2Token, mode: 'sell' })}
                className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white font-geist text-sm rounded transition-colors"
              >
                Sell
              </button>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="flex-1 flex items-center justify-center border border-white/5 rounded bg-black/20">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-2 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-white/30 font-geist-mono-extralight text-sm">Candlestick Chart</p>
            </div>
          </div>

          {/* Bottom Row: Time Intervals + OHLC Data */}
          <div className="flex items-center justify-between mt-4">
            {/* Time Interval Buttons - Left */}
            <div className="flex items-center gap-2">
              {timeIntervals.map((interval) => (
                <button
                  key={interval}
                  className="px-3 py-1 text-white/50 hover:text-white hover:bg-white/5 font-geist-mono-extralight text-xs rounded transition-colors"
                >
                  {interval}
                </button>
              ))}
            </div>

            {/* OHLC Data - Right */}
            <div className="flex items-center gap-4 text-xs font-geist-mono-extralight">
              <div>
                <span className="text-white/40">O</span>
                <span className="text-white ml-1">3,520.15</span>
              </div>
              <div>
                <span className="text-white/40">H</span>
                <span className="text-white ml-1">3,525.89</span>
              </div>
              <div>
                <span className="text-white/40">L</span>
                <span className="text-white ml-1">3,498.12</span>
              </div>
              <div>
                <span className="text-white/40">C</span>
                <span className="text-white ml-1">3,521.45</span>
              </div>
              <div>
                <span className="text-white/40">V</span>
                <span className="text-white ml-1">42.1M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 4 - Bottom right - Orders & Positions */}
        <div
          className="bg-[#131313] border border-white/10 rounded-lg overflow-hidden"
          style={{ gridColumn: 'span 1', gridRow: 'span 1' }}
        >
          <OrdersPositions />
        </div>
      </div>

      {/* Trading Panel */}
      {tradingPanel && (
        <TradingPanel
          symbol={tradingPanel.token.symbol}
          currentPrice={tradingPanel.token.price}
          mode={tradingPanel.mode}
          onClose={() => setTradingPanel(null)}
        />
      )}
    </div>
  )
}
