import { useState } from 'react'
import type { Token } from '../../services/api/dioneApi'

interface AddSymbolModalProps {
  isOpen: boolean
  onClose: () => void
  availableTokens: Token[]
  onAddToken: (token: Token) => void
}

type FilterCategory = 'all' | 'indices' | 'stocks' | 'etfs' | 'crypto' | 'commodities'

export default function AddSymbolModal({ isOpen, onClose, availableTokens, onAddToken }: AddSymbolModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')

  if (!isOpen) return null

  const categoryMap: Record<string, FilterCategory> = {
    'indices': 'indices',
    'stocks': 'stocks',
    'etfs': 'etfs',
    'crypto': 'crypto',
    'commodities': 'commodities'
  }

  const filterCategories: { key: FilterCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'indices', label: 'Indices' },
    { key: 'stocks', label: 'Stocks' },
    { key: 'etfs', label: 'ETFs' },
    { key: 'crypto', label: 'Crypto' },
    { key: 'commodities', label: 'Commodities' }
  ]

  const filteredTokens = availableTokens.filter(token => {
    const matchesSearch = token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         token.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeFilter === 'all') return matchesSearch

    const tokenCategory = categoryMap[token.category]
    return matchesSearch && tokenCategory === activeFilter
  })

  const handleAddToken = (token: Token) => {
    onAddToken(token)
    // Optional: close modal after adding
    // onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-white font-geist text-lg">Add symbol</h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-10 py-2 text-white font-geist text-sm placeholder-white/40 focus:outline-none focus:border-white/20"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-6 py-3 border-b border-white/10 flex gap-2 overflow-x-auto custom-scrollbar">
          {filterCategories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`
                px-4 py-1.5 rounded-full text-xs font-geist-mono-extralight whitespace-nowrap transition-colors
                flex items-center justify-center
                ${activeFilter === key
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredTokens.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-white/40 font-geist-mono-extralight text-sm">No symbols found</p>
            </div>
          ) : (
            filteredTokens.map((token) => {
              const categoryLabel = token.category === 'etfs' ? 'fund etf' :
                                   token.category === 'commodities' ? 'commodity' :
                                   token.category === 'indices' ? 'index' :
                                   `spot ${token.category}`

              return (
                <div
                  key={token.symbol}
                  className="px-6 py-3 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5"
                >
                  {/* Left: Icon + Symbol + Name */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0"
                      style={{ backgroundColor: token.iconColor || '#666' }}
                    >
                      {token.symbol.substring(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-geist text-sm">{token.symbol}</div>
                      <div className="text-white/50 font-geist-mono-extralight text-xs truncate">
                        {token.name}
                      </div>
                    </div>
                  </div>

                  {/* Right: Category + Exchange + Add Button */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-white/40 font-geist-mono-extralight text-xs">{categoryLabel}</div>
                      {token.exchange && (
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <span className="text-white font-geist text-xs">{token.exchange}</span>
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px]"
                            style={{ backgroundColor: token.iconColor || '#666' }}
                          >
                            {token.exchange.substring(0, 1)}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToken(token)}
                      className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 text-center">
          <p className="text-white/40 font-geist-mono-extralight text-xs">
            Shift <span className="text-white/60">+</span> Click <span className="text-white/60 mx-2">or</span> Shift <span className="text-white/60">+</span> Enter <span className="text-white/60 ml-2">to add symbol and close dialog</span>
          </p>
        </div>
      </div>
    </div>
  )
}
