import { AssetIcon } from '../../utils/iconHelper'

interface GaugeChartProps {
  value: number // Win rate value between 0-100
  wins: number // Number of wins
  losses: number // Number of losses
  label?: string
  biggestWin?: {
    symbol: string
    name: string
    assetType: 'crypto' | 'index' | 'commodity' | 'etf' | 'stock'
    pnl: number
    returnPercent: number
  }
}

export default function GaugeChart({ value, wins, losses, biggestWin }: GaugeChartProps) {
  // Determine color based on value
  const getColor = (val: number) => {
    if (val >= 70) return '#84cc16' // Green
    if (val >= 50) return '#F59E0B' // Yellow/Orange
    return '#ef4444' // Red
  }

  const color = getColor(value)
  const totalTrades = wins + losses
  const maxBarHeight = 100 // Max height in pixels for the bars

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      {/* Gauge Container */}
      <div className="relative w-80 h-40">
        {/* Background Arc */}
        <svg className="w-full h-full" viewBox="0 0 200 100" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="gaugeGradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Colored arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGradientDark)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * value) / 100}
          />

          {/* Value Display Inside Arc */}
          <text
            x="100"
            y="75"
            textAnchor="middle"
            className="font-geist-mono-regular"
            fill={color}
            fontSize="36"
          >
            {value.toFixed(1)}%
          </text>
        </svg>
      </div>

      {/* Win/Loss Text Display */}
      <div className="flex items-center justify-center gap-4">
        {/* Wins */}
        <div className="flex items-baseline gap-2">
          <span className="text-white font-geist-mono-regular text-4xl">{wins}</span>
          <span className="text-white/50 font-geist text-base">Wins</span>
        </div>

        {/* Divider */}
        <span className="text-white/30 font-geist-mono-regular text-2xl">|</span>

        {/* Losses */}
        <div className="flex items-baseline gap-2">
          <span className="text-white font-geist-mono-regular text-4xl">{losses}</span>
          <span className="text-white/50 font-geist text-base">Losses</span>
        </div>
      </div>

      {/* Biggest Win Section */}
      {biggestWin && (
        <div className="flex flex-col items-center gap-2 pt-4 border-t border-white/10 w-full px-6">
          <div className="text-white/40 font-geist text-xs uppercase tracking-wider">Biggest Win</div>
          <div className="flex items-center gap-2">
            <AssetIcon
              type={biggestWin.assetType}
              symbol={biggestWin.symbol}
              name={biggestWin.name}
              size={32}
            />
            <span className="text-white font-geist text-lg">{biggestWin.symbol}</span>
            <span className="font-geist-mono-regular text-2xl" style={{ color: '#84cc16' }}>
              +${biggestWin.pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-white/50 font-geist-mono-extralight text-sm">
            +{biggestWin.returnPercent.toFixed(1)}% return
          </div>
        </div>
      )}
    </div>
  )
}
