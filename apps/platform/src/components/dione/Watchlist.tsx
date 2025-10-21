import { useState } from 'react'
import type { Token } from '../../services/api/dioneApi'
import AddSymbolModal from './AddSymbolModal'
import { AssetIcon } from '../../utils/iconHelper'

interface WatchlistProps {
  tokens: Token[]
  allTokens: Token[]
  onAddToken?: (token: Token) => void
  onRemoveToken?: (token: Token) => void
}

type Category = 'indices' | 'stocks' | 'etfs' | 'crypto' | 'commodities'

export default function Watchlist({ tokens, allTokens, onAddToken, onRemoveToken }: WatchlistProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(tokens[0] || null)
  const [expandedCategories, setExpandedCategories] = useState<Set<Category>>(
    new Set(['indices', 'stocks', 'etfs', 'crypto', 'commodities'])
  )
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isRemovalMode, setIsRemovalMode] = useState(false)
  const [tokensToRemove, setTokensToRemove] = useState<Set<string>>(new Set())

  // Helper to map category to asset type
  const getAssetTypeFromCategory = (category: Category): 'crypto' | 'index' | 'commodity' | 'etf' | 'stock' => {
    const mapping: Record<Category, 'crypto' | 'index' | 'commodity' | 'etf' | 'stock'> = {
      'crypto': 'crypto',
      'indices': 'index',
      'commodities': 'commodity',
      'etfs': 'etf',
      'stocks': 'stock' // Use Logo.dev API for stocks
    }
    return mapping[category] || 'crypto'
  }

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

  const handleToggleRemovalMode = () => {
    setIsRemovalMode(!isRemovalMode)
    setTokensToRemove(new Set())
  }

  const handleToggleTokenForRemoval = (symbol: string) => {
    const newSet = new Set(tokensToRemove)
    if (newSet.has(symbol)) {
      newSet.delete(symbol)
    } else {
      newSet.add(symbol)
    }
    setTokensToRemove(newSet)
  }

  const handleConfirmRemoval = () => {
    tokensToRemove.forEach(symbol => {
      const token = tokens.find(t => t.symbol === symbol)
      if (token) {
        onRemoveToken?.(token)
      }
    })
    setIsRemovalMode(false)
    setTokensToRemove(new Set())
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-l border-white/20">
      {/* Watchlist Header */}
      <div className="px-4 py-3 border-b border-white/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-geist text-lg">
            {isRemovalMode ? 'Select Items' : 'Watchlist'}
          </h2>
          {!isRemovalMode && (
            <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isRemovalMode ? (
            <>
              <button
                onClick={handleToggleRemovalMode}
                className="px-3 py-1 text-xs text-white/50 hover:text-white transition-colors font-geist"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoval}
                disabled={tokensToRemove.size === 0}
                className="px-3 py-1 text-xs bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded transition-colors font-geist disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                title="Add symbol"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={handleToggleRemovalMode}
                className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                title="Remove symbols"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Token List - Scrollable */}
      <div className="overflow-y-auto custom-scrollbar" style={{ height: 'calc(100vh - 3.5rem - 2.5rem - 14rem)' }}>
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl z-10">
            <tr className="text-white/40 font-geist-mono border-b border-white/20">
              <th className="text-left pt-2 pb-2 pl-4 pr-2 uppercase text-[10px]">Symbol</th>
              <th className="text-right pt-2 pb-2 px-2 uppercase text-[10px]">Last</th>
              <th className="text-right pt-2 pb-2 px-2 uppercase text-[10px]">Chg</th>
              <th className="text-right pt-2 pb-2 pl-2 pr-4 uppercase text-[10px]">Chg%</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(({ key, label }) => {
              const categoryTokens = getTokensByCategory(key)
              const isExpanded = expandedCategories.has(key)

              return (
                <>
                  {/* Category Header */}
                  <tr key={`${key}-header`}>
                    <td colSpan={4} className="p-0">
                      <button
                        onClick={() => toggleCategory(key)}
                        className="w-full px-4 py-2 flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors text-[10px] font-geist-mono-extralight border-b border-white/20 uppercase"
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
                    </td>
                  </tr>

                  {/* Category Tokens */}
                  {isExpanded && categoryTokens.map((token) => {
                    const isSelected = selectedToken?.symbol === token.symbol
                    const isPositive = token.change >= 0
                    const isMarkedForRemoval = tokensToRemove.has(token.symbol)

                    return (
                      <tr
                        key={token.symbol}
                        className={`
                          border-b border-white/10
                          transition-colors duration-150
                          ${isSelected && !isRemovalMode ? 'border-l-2 border-l-white' : 'border-l-2 border-l-transparent'}
                          ${isMarkedForRemoval ? 'bg-red-500/10' : ''}
                        `}
                      >
                        <td className="py-1 pl-4 pr-2">
                          <button
                            onClick={() => isRemovalMode ? handleToggleTokenForRemoval(token.symbol) : setSelectedToken(token)}
                            className="flex items-center gap-2 min-w-0 text-left p-0 w-full"
                          >
                            {isRemovalMode && (
                              <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isMarkedForRemoval ? 'bg-red-500 border-red-500' : 'border-white/30'
                              }`}>
                                {isMarkedForRemoval && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            )}
                            <AssetIcon
                              type={getAssetTypeFromCategory(token.category)}
                              symbol={token.symbol}
                              name={token.name}
                              size={16}
                              className="flex-shrink-0"
                            />
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-white font-geist text-[11px] truncate whitespace-nowrap">{token.symbol}</span>
                              <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: isPositive ? '#84cc16' : '#ef4444' }} />
                            </div>
                          </button>
                        </td>

                        <td className="py-1 px-2 text-right">
                          <span className="text-white font-geist-mono text-[11px] whitespace-nowrap">
                            {formatPrice(token.price)}
                          </span>
                        </td>

                        <td className="py-1 px-2 text-right">
                          <span className="font-geist-mono text-[11px] whitespace-nowrap" style={{ color: isPositive ? '#84cc16' : '#ef4444' }}>
                            {formatChange(token.change)}
                          </span>
                        </td>

                        <td className="py-1 pl-2 pr-4 text-right">
                          <span className="font-geist-mono text-[11px] whitespace-nowrap" style={{ color: isPositive ? '#84cc16' : '#ef4444' }}>
                            {isPositive ? '+' : ''}{token.changePercent.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Token Description - Bottom */}
      {selectedToken && (
        <div className="border-t border-white/20 p-4 overflow-y-auto custom-scrollbar" style={{ height: '14rem' }}>
          {/* Token Header */}
          <div className="flex items-center gap-2 mb-3">
            <AssetIcon
              type={getAssetTypeFromCategory(selectedToken.category)}
              symbol={selectedToken.symbol}
              name={selectedToken.name}
              size={32}
              className="flex-shrink-0"
            />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="text-white font-geist text-sm truncate">{selectedToken.name}</h3>
              {selectedToken.exchange && (
                <span className="text-white/50 font-geist-mono-extralight text-xs">· {selectedToken.exchange}</span>
              )}
            </div>
          </div>

          {/* Price Info */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-white font-geist-mono-regular text-2xl">
                {formatPrice(selectedToken.price)}
              </span>
              <span className="font-geist-mono-extralight text-sm" style={{ color: selectedToken.change >= 0 ? '#84cc16' : '#ef4444' }}>
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

          {/* TradingView Attribution */}
          <p className="text-white/40 font-geist-mono-extralight text-[10px] mb-3">
            Charts powered by{' '}
            <a
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white/70 transition-colors underline"
            >
              TradingView
            </a>
          </p>

          {/* News */}
          {selectedToken.news && (
            <div className="flex items-start gap-2 bg-white/10 p-2 rounded">
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
