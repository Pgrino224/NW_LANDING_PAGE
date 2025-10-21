import { useState, useRef, useEffect } from 'react'
import type { Token } from '../../services/api/dioneApi'
import NetworthIcon from '../shared/NetworthIcon'
import { AssetIcon } from '../../utils/iconHelper'

interface SymbolSelectorProps {
  selectedToken: Token
  availableTokens: Token[]
  onSelectToken: (token: Token) => void
}

type Category = 'indices' | 'stocks' | 'etfs' | 'crypto' | 'commodities'

// Helper to map category to asset type
const getAssetTypeFromCategory = (category: Category): 'crypto' | 'index' | 'commodity' | 'etf' | 'stock' => {
  const mapping: Record<Category, 'crypto' | 'index' | 'commodity' | 'etf' | 'stock'> = {
    'crypto': 'crypto',
    'indices': 'index',
    'commodities': 'commodity',
    'etfs': 'etf',
    'stocks': 'stock'
  }
  return mapping[category] || 'crypto'
}

export default function SymbolSelector({ selectedToken, availableTokens, onSelectToken }: SymbolSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const filteredTokens = availableTokens.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectToken = (token: Token) => {
    onSelectToken(token)
    setIsOpen(false)
    setSearchQuery('')
  }

  const isPositive = selectedToken.change >= 0

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Symbol Button + Price Info - Same Line */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:bg-white/5 rounded px-2 transition-colors border border-white/20"
        >
          <span className="text-white font-geist text-lg">{selectedToken.symbol}</span>
          <svg
            className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Current Price Info */}
        <div className="flex items-baseline gap-2">
          <span className="text-white font-geist-mono-regular text-lg flex items-baseline">
            <NetworthIcon className="w-4 h-4" />{selectedToken.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`font-geist-mono-extralight text-xs ${isPositive ? 'text-lime-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{selectedToken.change.toFixed(2)} ({isPositive ? '+' : ''}{selectedToken.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-black/90 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 shadow-2xl z-50 max-h-80 flex flex-col">
          {/* Search Input */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search symbols"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded px-10 py-2 text-white font-geist text-sm placeholder-white/40 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          {/* Token List */}
          <div className="overflow-y-auto custom-scrollbar flex-1">
            {filteredTokens.length === 0 ? (
              <div className="flex items-center justify-center h-20">
                <p className="text-white/40 font-geist-mono-extralight text-sm">No symbols found</p>
              </div>
            ) : (
              filteredTokens.map((token) => {
                const tokenIsPositive = token.change >= 0
                const isSelected = token.symbol === selectedToken.symbol

                return (
                  <button
                    key={token.symbol}
                    onClick={() => handleSelectToken(token)}
                    className={`
                      w-full px-4 py-3 flex items-center justify-between
                      hover:bg-white/5 transition-colors border-b border-white/5
                      ${isSelected ? 'bg-white/10' : ''}
                    `}
                  >
                    {/* Left: Icon + Symbol + Name */}
                    <div className="flex items-center gap-3">
                      <AssetIcon
                        type={getAssetTypeFromCategory(token.category)}
                        symbol={token.symbol}
                        name={token.name}
                        size={32}
                        className="flex-shrink-0"
                      />
                      <div className="text-left">
                        <div className="text-white font-geist text-sm">{token.symbol}</div>
                        <div className="text-white/50 font-geist-mono-extralight text-xs truncate">
                          {token.name}
                        </div>
                      </div>
                    </div>

                    {/* Right: Price + Change */}
                    <div className="text-right">
                      <div className="text-white font-geist-mono-regular text-sm flex items-baseline justify-end">
                        <NetworthIcon className="w-3 h-3" />{token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`font-geist-mono-extralight text-xs ${tokenIsPositive ? 'text-lime-500' : 'text-red-500'}`}>
                        {tokenIsPositive ? '+' : ''}{token.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
