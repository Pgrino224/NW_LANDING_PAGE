import { mockTokens } from './mockData'

interface VolumeLeader {
  symbol: string
  name: string
  price: number
  volume: number
  change24h: number
  volumeChange: number
}

export default function VolumeLeaders() {
  // Sort tokens by volume and get top leaders
  const volumeLeaders: VolumeLeader[] = mockTokens
    .map(token => ({
      symbol: token.symbol,
      name: token.name,
      price: token.price,
      volume: Math.random() * 2000000000, // Mock volume data
      change24h: token.changePercent || 0,
      volumeChange: Math.random() * 40 - 10 // Mock volume change %
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10)

  const formatVolume = (volume: number) => {
    if (volume >= 1_000_000_000) {
      return { value: (volume / 1_000_000_000).toFixed(2), suffix: 'B' }
    }
    if (volume >= 1_000_000) {
      return { value: (volume / 1_000_000).toFixed(2), suffix: 'M' }
    }
    return { value: (volume / 1_000).toFixed(2), suffix: 'K' }
  }

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <h3 className="text-white font-geist text-lg">Volume Leaders</h3>
        <p className="text-white/40 font-geist-mono-extralight text-[10px]">24H Trading Volume</p>
      </div>

      {/* Table Header */}
      <div className="px-4 py-2 grid grid-cols-5 gap-2 border-b border-white/10">
        <div className="text-white/40 font-geist-mono-extralight text-[10px] uppercase col-span-2">Token</div>
        <div className="text-white/40 font-geist-mono-extralight text-[10px] uppercase text-right">Volume</div>
        <div className="text-white/40 font-geist-mono-extralight text-[10px] uppercase text-right">Price</div>
        <div className="text-white/40 font-geist-mono-extralight text-[10px] uppercase text-right">Change</div>
      </div>

      {/* Volume Leaders List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {volumeLeaders.map((leader, index) => (
          <div
            key={leader.symbol}
            className="px-4 py-2.5 grid grid-cols-5 gap-2 border-b border-white/5 hover:bg-white/5 transition-colors"
          >
            {/* Token Info */}
            <div className="col-span-2 flex items-center gap-2">
              <div className="text-white/40 font-geist-mono text-xs w-4">
                {index + 1}
              </div>
              <div>
                <div className="text-white font-geist-mono text-xs">{leader.symbol}</div>
                <div className="text-white/40 font-geist-mono-extralight text-[10px]">{leader.name}</div>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center justify-end">
              <div>
                <div className="text-white/80 font-geist-mono text-xs text-right">
                  {formatVolume(leader.volume).value}{formatVolume(leader.volume).suffix}
                </div>
                <div
                  className="font-geist-mono-extralight text-[10px] text-right"
                  style={{ color: leader.volumeChange > 0 ? '#84cc16' : '#ef4444' }}
                >
                  {leader.volumeChange > 0 ? '+' : ''}{leader.volumeChange.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-end">
              <div className="text-white/80 font-geist-mono text-xs text-right">
                {leader.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Price Change */}
            <div className="flex items-center justify-end">
              <div
                className="font-geist-mono text-xs text-right"
                style={{ color: leader.change24h > 0 ? '#84cc16' : '#ef4444' }}
              >
                {leader.change24h > 0 ? '+' : ''}{leader.change24h.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
