import { useState, useRef, useEffect } from 'react'

interface TradingPanelProps {
  symbol: string
  currentPrice: number
  mode: 'buy' | 'sell'
  onClose: () => void
}

export default function TradingPanel({ symbol, currentPrice, mode: initialMode, onClose }: TradingPanelProps) {
  const [mode, setMode] = useState(initialMode)
  const [tradingType, setTradingType] = useState<'spot' | 'margin' | 'leverage' | 'options'>('spot')
  const [orderType, setOrderType] = useState('Limit')
  const [quantity, setQuantity] = useState(1)
  const [limitPrice, setLimitPrice] = useState(currentPrice)
  const [timeInForce, setTimeInForce] = useState('Good for day')
  const [tradingSession, setTradingSession] = useState('Market hours')
  const [leverage, setLeverage] = useState(1)
  const [strikePrice, setStrikePrice] = useState(currentPrice)
  const [optionType, setOptionType] = useState<'call' | 'put'>('call')
  const [expirationDate, setExpirationDate] = useState('2025-12-31')

  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  const estimatedCost = quantity * limitPrice
  const bidPrice = currentPrice - 0.01
  const askPrice = currentPrice + 0.02

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  return (
    <div
      ref={panelRef}
      className="fixed bg-[#131313] border border-white/20 rounded-lg shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '320px',
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* Draggable Header */}
      <div
        onMouseDown={handleMouseDown}
        className="px-4 py-3 border-b border-white/10 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-geist text-lg">{symbol}</span>
          <span className="text-white font-geist-mono-regular text-sm">${currentPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Buy/Sell Toggle */}
      <div className="p-3">
        <div className="relative bg-white/5 rounded-full p-1 flex">
          {/* Sliding background */}
          <div
            className={`absolute top-1 bottom-1 w-1/2 rounded-full transition-all duration-300 ${
              mode === 'buy' ? 'left-1 bg-green-500' : 'left-1/2 bg-red-500'
            }`}
          />
          {/* Buttons */}
          <button
            onClick={() => setMode('buy')}
            className={`relative z-10 flex-1 py-2 rounded-full font-geist text-sm transition-colors ${
              mode === 'buy' ? 'text-white' : 'text-white/50'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setMode('sell')}
            className={`relative z-10 flex-1 py-2 rounded-full font-geist text-sm transition-colors ${
              mode === 'sell' ? 'text-white' : 'text-white/50'
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-4 pb-4 space-y-3">
        {/* Trading Type */}
        <div className="flex items-center justify-between">
          <label className="text-white font-geist text-sm">Trading type</label>
          <select
            value={tradingType}
            onChange={(e) => setTradingType(e.target.value as 'spot' | 'margin' | 'leverage' | 'options')}
            className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-extralight text-xs rounded px-3 py-1.5 w-32 focus:outline-none focus:border-white/20"
          >
            <option value="spot">Spot</option>
            <option value="margin">Margin</option>
            <option value="leverage">Leverage</option>
            <option value="options">Options</option>
          </select>
        </div>

        {/* Order Type */}
        <div className="flex items-center justify-between">
          <label className="text-white font-geist text-sm">Order type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-extralight text-xs rounded px-3 py-1.5 w-32 focus:outline-none focus:border-white/20"
          >
            <option>Limit</option>
            <option>Market</option>
            <option>Stop loss</option>
            <option>Stop limit</option>
          </select>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between">
          <label className="text-white font-geist text-sm">Quantity</label>
          <div className="relative w-32">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-regular text-xs rounded px-3 py-1.5 pr-8 w-full focus:outline-none focus:border-white/20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="text-white/50 hover:text-white text-xs leading-none"
              >
                +
              </button>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="text-white/50 hover:text-white text-xs leading-none"
              >
                −
              </button>
            </div>
          </div>
        </div>

        {/* Leverage - only for leverage trading */}
        {tradingType === 'leverage' && (
          <div className="flex items-center justify-between">
            <label className="text-white font-geist text-sm">Leverage</label>
            <select
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-extralight text-xs rounded px-3 py-1.5 w-32 focus:outline-none focus:border-white/20"
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={5}>5x</option>
              <option value={10}>10x</option>
              <option value={20}>20x</option>
              <option value={50}>50x</option>
              <option value={100}>100x</option>
            </select>
          </div>
        )}

        {/* Options-specific fields */}
        {tradingType === 'options' && (
          <>
            <div className="flex items-center justify-between">
              <label className="text-white font-geist text-sm">Option type</label>
              <div className="relative bg-white/5 rounded-full p-0.5 flex w-32">
                <div
                  className={`absolute top-0.5 bottom-0.5 w-1/2 rounded-full transition-all duration-200 ${
                    optionType === 'call' ? 'left-0.5 bg-green-500' : 'left-1/2 bg-red-500'
                  }`}
                />
                <button
                  onClick={() => setOptionType('call')}
                  className={`relative z-10 flex-1 py-1 rounded-full font-geist text-xs transition-colors ${
                    optionType === 'call' ? 'text-white' : 'text-white/50'
                  }`}
                >
                  Call
                </button>
                <button
                  onClick={() => setOptionType('put')}
                  className={`relative z-10 flex-1 py-1 rounded-full font-geist text-xs transition-colors ${
                    optionType === 'put' ? 'text-white' : 'text-white/50'
                  }`}
                >
                  Put
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white font-geist text-sm">Strike price</label>
              <div className="relative w-32">
                <input
                  type="number"
                  value={strikePrice.toFixed(2)}
                  onChange={(e) => setStrikePrice(Number(e.target.value))}
                  className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-regular text-xs rounded px-3 py-1.5 pr-8 w-full focus:outline-none focus:border-white/20"
                  step="0.01"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                  <button
                    onClick={() => setStrikePrice(p => p + 1)}
                    className="text-white/50 hover:text-white text-xs leading-none"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setStrikePrice(p => Math.max(1, p - 1))}
                    className="text-white/50 hover:text-white text-xs leading-none"
                  >
                    −
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white font-geist text-sm">Expiration</label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-extralight text-xs rounded px-3 py-1.5 w-32 focus:outline-none focus:border-white/20"
              />
            </div>
          </>
        )}

        {/* Limit Price - shown for all except options */}
        {tradingType !== 'options' && (
          <div className="flex items-center justify-between">
            <label className="text-white font-geist text-sm">Limit price</label>
            <div className="relative w-32">
              <input
                type="number"
                value={limitPrice.toFixed(2)}
                onChange={(e) => setLimitPrice(Number(e.target.value))}
                className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-regular text-xs rounded px-3 py-1.5 pr-8 w-full focus:outline-none focus:border-white/20"
                step="0.01"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                <button
                  onClick={() => setLimitPrice(p => p + 0.01)}
                  className="text-white/50 hover:text-white text-xs leading-none"
                >
                  +
                </button>
                <button
                  onClick={() => setLimitPrice(p => Math.max(0.01, p - 0.01))}
                  className="text-white/50 hover:text-white text-xs leading-none"
                >
                  −
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Time in Force */}
        <div className="flex items-center justify-between">
          <label className="text-white font-geist text-sm">Time in force</label>
          <select
            value={timeInForce}
            onChange={(e) => setTimeInForce(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-extralight text-xs rounded px-3 py-1.5 w-32 focus:outline-none focus:border-white/20"
          >
            <option>Good for day</option>
            <option>Good till canceled</option>
            <option>Immediate or cancel</option>
          </select>
        </div>

        {/* Trading Session */}
        <div className="flex items-center justify-between">
          <label className="text-white font-geist text-sm">Trading session</label>
          <select
            value={tradingSession}
            onChange={(e) => setTradingSession(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-extralight text-xs rounded px-3 py-1.5 w-32 focus:outline-none focus:border-white/20"
          >
            <option>Market hours</option>
            <option>Extended hours</option>
          </select>
        </div>

        {/* Estimated Cost */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-geist text-sm">Estimated cost</span>
            <span className="text-white font-geist-mono-regular text-lg">${estimatedCost.toFixed(2)}</span>
          </div>
          <div className="text-white/40 font-geist-mono-extralight text-xs">
            ${estimatedCost.toFixed(2)} buying power
          </div>
        </div>

        {/* Order Details */}
        <div className="text-white/50 font-geist-mono-extralight text-xs leading-relaxed">
          Order will be placed at market open. Bid ${bidPrice.toFixed(2)} · {quantity} · Ask ${askPrice.toFixed(2)} · {quantity}. Last ${currentPrice.toFixed(2)} · 7.
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white font-geist text-xs rounded transition-colors"
          >
            Cancel
          </button>
          <button
            className={`px-4 py-1.5 text-white font-geist text-xs rounded transition-colors ${
              mode === 'buy'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {mode === 'buy' ? 'Buy' : 'Sell'} {symbol}
          </button>
        </div>
      </div>
    </div>
  )
}
