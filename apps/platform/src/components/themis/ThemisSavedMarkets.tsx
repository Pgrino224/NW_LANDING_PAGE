import { themisApi } from '../../services/api/themisApi'
import { useEffect, useState } from 'react'
import type { Market } from '../../services/api/themisApi'

interface ThemisSavedMarketsProps {
  savedMarkets: string[]
  onRemoveMarket: (marketId: string) => void
}

export default function ThemisSavedMarkets({ savedMarkets, onRemoveMarket }: ThemisSavedMarketsProps) {
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const data = await themisApi.getMarkets()
        setMarkets(data)
      } catch (error) {
        console.error('Error loading markets:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMarkets()
  }, [])

  const savedMarketData = markets.filter(m => savedMarkets.includes(m.id.toString()))

  return (
    <div className="h-full bg-[#FFFFE4] border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-white/10">
        <h2 className="text-[#ffffe4] font-geist text-base">Saved Markets</h2>
        <p className="text-[#ffffe4]/50 font-geist text-xs mt-0.5">
          {savedMarketData.length} {savedMarketData.length === 1 ? 'market' : 'markets'}
        </p>
      </div>

      {/* Saved Markets List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-4 text-[#ffffe4]/50 font-geist text-sm">Loading...</div>
        ) : savedMarketData.length === 0 ? (
          <div className="p-4 text-[#ffffe4]/50 font-geist text-sm">
            No saved markets yet. Bookmark markets from the main view to see them here.
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {savedMarketData.map((market) => (
              <div
                key={market.id}
                className="bg-black/5 border border-white/10 rounded-lg p-3 hover:bg-black/10 transition-colors"
              >
                {/* Market Question */}
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[#ffffe4] font-geist text-sm leading-tight flex-1 pr-2">
                    {market.question}
                  </p>
                  <button
                    onClick={() => onRemoveMarket(market.id.toString())}
                    className="text-[#ffffe4]/50 hover:text-[#ffffe4] transition-colors flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Market Info */}
                <div className="flex items-center justify-between">
                  <span className="text-[#ffffe4]/40 font-geist text-xs uppercase">{market.category}</span>
                  {market.type === '2-option' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#ffffe4] font-geist text-xs">{market.yes}</span>
                      <span className="text-[#FF8480] font-geist text-xs">YES</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
