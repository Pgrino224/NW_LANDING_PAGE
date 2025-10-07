import { useState } from 'react'
import type { Token } from './mockData'
import AddSymbolModal from './AddSymbolModal'

interface WatchlistProps {
  tokens: Token[]
  allTokens: Token[]
  onAddToken?: (token: Token) => void
}

type Category = 'indices' | 'stocks' | 'etfs' | 'crypto' | 'commodities'

export default function Watchlist({ tokens, allTokens, onAddToken }: WatchlistProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(tokens[0] || null)
  const [expandedCategories, setExpandedCategories] = useState<Set<Category>>(
    new Set(['indices', 'stocks', 'etfs', 'crypto', 'commodities'])
  )
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const toggleCategory = (category: Category) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const categories: { key: Category; label: string }[] = [
    { key: 'indices', label: 'INDICES' },
    { key: 'stocks', label: 'STOCKS' },
    { key: 'etfs', label: 'ETFs' },
    { key: 'crypto', label: 'CRYPTO' },
    { key: 'commodities', label: 'COMMODITIES' }
  ]

  const getTokensByCategory = (category: Category) => {
    return tokens.filter(token => token.category === category)
  }

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    if (price >= 1) return price.toFixed(2)
    if (price >= 0.01) return price.toFixed(4)
    return price.toFixed(6)
  }

  const formatChange = (change: number) => {
    const formatted = Math.abs(change) >= 1 ? change.toFixed(2) : change.toFixed(4)
    return change >= 0 ? `+${formatted}` : formatted
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] border-l border-white/10">
      {/* Watchlist Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-geist text-sm">Watchlist</h2>
          <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="px-4 py-2 border-b border-white/5 grid grid-cols-12 gap-2 text-xs text-white/40 font-geist-mono-extralight">
        <div className="col-span-5">Symbol</div>
        <div className="col-span-3 text-right">Last</div>
        <div className="col-span-2 text-right">Chg</div>
        <div className="col-span-2 text-right">Chg%</div>
      </div>

      {/* Token List - Scrollable */}
      <div className="overflow-y-auto" style={{ height: 'calc(100vh - 3.5rem - 2.5rem - 20rem)' }}>
        {categories.map(({ key, label }) => {
          const categoryTokens = getTokensByCategory(key)
          const isExpanded = expandedCategories.has(key)

          return (
            <div key={key}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(key)}
                className="w-full px-4 py-2 flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors text-xs font-geist-mono-extralight border-b border-white/5"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {label}
              </button>

              {/* Category Tokens */}
              {isExpanded && categoryTokens.map((token) => {
                const isSelected = selectedToken?.symbol === token.symbol
                const isPositive = token.change >= 0

                return (
                  <button
                    key={token.symbol}
                    onClick={() => setSelectedToken(token)}
                    className={`
                      w-full px-4 py-2 grid grid-cols-12 gap-2 items-center
                      border-b border-white/5 hover:bg-white/5
                      transition-colors duration-150
                      ${isSelected ? 'bg-white/10' : ''}
                    `}
                  >
                    {/* Icon + Symbol */}
                    <div className="col-span-5 flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                        style={{ backgroundColor: token.iconColor || '#666' }}
                      >
                        {token.symbol.substring(0, 1)}
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-white font-geist text-xs truncate">{token.symbol}</span>
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                    </div>

                    {/* Last Price */}
                    <div className="col-span-3 text-right">
                      <span className="text-white font-geist-mono-regular text-xs">
                        {formatPrice(token.price)}
                      </span>
                    </div>

                    {/* Change */}
                    <div className="col-span-2 text-right">
                      <span className={`font-geist-mono-extralight text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {formatChange(token.change)}
                      </span>
                    </div>

                    {/* Change % */}
                    <div className="col-span-2 text-right">
                      <span className={`font-geist-mono-extralight text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{token.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Token Description - Bottom */}
      {selectedToken && (
        <div className="border-t border-white/10 p-4 overflow-y-auto" style={{ height: '20rem' }}>
          {/* Token Header */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: selectedToken.iconColor || '#666' }}
            >
              {selectedToken.symbol.substring(0, 1)}
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="text-white font-geist text-sm truncate">{selectedToken.name}</h3>
              <svg className="w-3 h-3 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {selectedToken.exchange && (
                <span className="text-white/50 font-geist-mono-extralight text-xs">· {selectedToken.exchange}</span>
              )}
            </div>
          </div>

          {/* Price Info */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-white font-geist-mono-regular text-2xl">{formatPrice(selectedToken.price)}</span>
              <span className={`font-geist-mono-extralight text-sm ${selectedToken.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatChange(selectedToken.change)} {selectedToken.change >= 0 ? '+' : ''}{selectedToken.changePercent.toFixed(2)}%
              </span>
            </div>
            <div className="text-white/50 font-geist-mono-extralight text-xs">
              Last update at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} GMT-4
            </div>
          </div>

          {/* Description */}
          {selectedToken.description && (
            <p className="text-white/70 font-geist-mono-extralight text-xs leading-relaxed mb-2">
              {selectedToken.description}
            </p>
          )}

          {/* News */}
          {selectedToken.news && (
            <div className="flex items-start gap-2 bg-white/5 p-2 rounded">
              <svg className="w-4 h-4 text-white/50 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white/70 font-geist-mono-extralight text-xs leading-relaxed flex-1">
                {selectedToken.news}
              </p>
              <svg className="w-3 h-3 text-white/50 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Add Symbol Modal */}
      <AddSymbolModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        availableTokens={allTokens}
        onAddToken={(token) => {
          onAddToken?.(token)
          setIsAddModalOpen(false)
        }}
      />
    </div>
  )
}
