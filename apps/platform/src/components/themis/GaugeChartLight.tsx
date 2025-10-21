interface GaugeChartLightProps {
  value: number // Win rate value between 0-100
  wins: number // Number of wins
  losses: number // Number of losses
  label?: string
}

export default function GaugeChartLight({ value, wins, losses, label = 'Win Rate' }: GaugeChartLightProps) {
  // Calculate rotation angle (gauge spans 180 degrees, from -90 to 90)
  const rotation = -90 + (value / 100) * 180

  // Determine color based on value
  const getColor = (val: number) => {
    if (val >= 70) return '#10B981' // Green
    if (val >= 50) return '#F59E0B' // Yellow/Orange
    return '#EF4444' // Red
  }

  const color = getColor(value)
  const totalTrades = wins + losses
  const maxBarHeight = 60 // Max height in pixels for the tallest bar

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      {/* Gauge Container */}
      <div className="relative w-64 h-32">
        {/* Background Arc */}
        <svg className="w-full h-full" viewBox="0 0 200 100" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="gaugeGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Colored arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGradientLight)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * value) / 100}
          />

          {/* Value Display Inside Arc */}
          <text
            x="100"
            y="75"
            textAnchor="middle"
            className="font-geist-mono-regular text-2xl"
            fill={color}
            fontSize="24"
          >
            {value.toFixed(1)}%
          </text>
        </svg>
      </div>

      {/* Label */}
      <div className="text-center">
        <div className="text-[#ffffe4]/50 font-geist text-xs">{label}</div>
      </div>

      {/* Win/Loss Bar Chart */}
      <div className="flex items-end justify-center gap-6">
        {/* Wins Bar */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-[#ffffe4]/50 font-geist text-xs">Wins</div>
          <div
            className="w-16 bg-lime-500 rounded-t transition-all duration-500"
            style={{
              height: `${(wins / totalTrades) * maxBarHeight}px`,
              minHeight: '10px'
            }}
          />
          <div className="text-[#ffffe4] font-geist-mono-regular text-sm">{wins}</div>
        </div>

        {/* Losses Bar */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-[#ffffe4]/50 font-geist text-xs">Losses</div>
          <div
            className="w-16 bg-red-500 rounded-t transition-all duration-500"
            style={{
              height: `${(losses / totalTrades) * maxBarHeight}px`,
              minHeight: '10px'
            }}
          />
          <div className="text-[#ffffe4] font-geist-mono-regular text-sm">{losses}</div>
        </div>
      </div>
    </div>
  )
}
