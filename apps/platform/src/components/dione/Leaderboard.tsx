import { useState } from 'react'

interface LeaderboardEntry {
  rank: number
  address: string
  pnl: number
  trades: number
  winRate: number
}

const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, address: '0x742d...4a8c', pnl: 12450.50, trades: 127, winRate: 68.5 },
  { rank: 2, address: '0x8f3b...9e2d', pnl: 9823.20, trades: 94, winRate: 72.3 },
  { rank: 3, address: '0xa1c4...5f7b', pnl: 8567.80, trades: 156, winRate: 65.4 },
  { rank: 4, address: '0x3e9d...2b1a', pnl: 7234.60, trades: 88, winRate: 70.5 },
  { rank: 5, address: '0xd5f2...8c3e', pnl: 6891.40, trades: 102, winRate: 67.6 },
  { rank: 6, address: '0x7b8a...4d9f', pnl: 5678.90, trades: 79, winRate: 69.2 },
  { rank: 7, address: '0x2c6e...1a5b', pnl: 4523.30, trades: 115, winRate: 64.3 },
  { rank: 8, address: '0x9a1f...7e4c', pnl: 3987.70, trades: 91, winRate: 66.7 },
  { rank: 9, address: '0x6d3b...2f8a', pnl: 3456.20, trades: 68, winRate: 71.8 },
  { rank: 10, address: '0x4e7c...9b1d', pnl: 2834.50, trades: 103, winRate: 63.1 },
]

type TimeFilter = '24H' | '7D' | '30D' | 'ALL'

export default function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24H')

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <h3 className="text-white font-geist text-lg">Leaderboard</h3>

        {/* Time Filter */}
        <div className="flex items-center gap-1 bg-white/5 rounded p-0.5">
          {(['24H', '7D', '30D', 'ALL'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-2 py-0.5 font-geist-mono-extralight text-[10px] rounded transition-colors ${
                timeFilter === filter
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white/40 font-geist-mono-extralight border-b border-white/10">
              <th className="text-left pt-2 pb-2 pl-4 pr-2 uppercase text-xs">Rank</th>
              <th className="text-left pt-2 pb-2 px-2 uppercase text-xs">Trader</th>
              <th className="text-right pt-2 pb-2 px-2 uppercase text-xs">PnL</th>
              <th className="text-right pt-2 pb-2 px-2 uppercase text-xs">Trades</th>
              <th className="text-right pt-2 pb-2 pl-2 pr-4 uppercase text-xs">WR</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboardData.map((entry) => (
              <tr key={entry.rank} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-2.5 pl-4 pr-2 text-left">
                  <span
                    className={`font-geist-mono whitespace-nowrap ${
                      entry.rank === 1
                        ? 'text-yellow-400'
                        : entry.rank === 2
                        ? 'text-gray-300'
                        : entry.rank === 3
                        ? 'text-orange-400'
                        : 'text-white/60'
                    }`}
                  >
                    #{entry.rank}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-left text-white/80 font-geist-mono whitespace-nowrap">
                  {entry.address.substring(0, 6)}
                </td>
                <td className="py-2.5 px-2 text-right">
                  <span className="font-geist-mono whitespace-nowrap" style={{ color: '#84cc16' }}>
                    +{entry.pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-right text-white/60 font-geist-mono whitespace-nowrap">
                  {entry.trades}
                </td>
                <td className="py-2.5 pl-2 pr-4 text-right">
                  <span
                    className="font-geist-mono whitespace-nowrap"
                    style={{ color: entry.winRate >= 70 ? '#84cc16' : entry.winRate >= 60 ? '#eab308' : 'rgba(255, 255, 255, 0.6)' }}
                  >
                    {entry.winRate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
