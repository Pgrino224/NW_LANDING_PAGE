export default function PortfolioDashboard() {
  return (
    <div className="w-full h-full p-6">
      {/* Bento Grid: 3 columns x 2 rows */}
      <div className="w-full h-full grid gap-4" style={{
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)'
      }}>
        {/* Large Chart - Portfolio Value (spans 2 columns) */}
        <div
          className="bg-[#131313] border border-white/10 rounded-lg p-6 flex flex-col"
          style={{ gridColumn: 'span 2' }}
        >
          <div className="mb-4">
            <h3 className="text-white/50 font-geist text-sm mb-1">Portfolio Value</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-white font-geist-mono-regular text-3xl">$124,532.00</span>
              <span className="text-green-500 font-geist-mono-extralight text-sm">+12.74%</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-white/30">
            {/* Placeholder for chart */}
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="font-geist-mono-extralight text-sm">Portfolio Chart</p>
            </div>
          </div>
        </div>

        {/* Card 1 - Biggest Wins */}
        <div className="bg-[#131313] border border-white/10 rounded-lg p-6 flex flex-col">
          <h3 className="text-white/50 font-geist text-sm mb-4">Biggest Win</h3>
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-white font-geist text-lg">ETH/USD</span>
            </div>
            <div className="text-green-500 font-geist-mono-regular text-2xl mb-1">+$4,230.00</div>
            <div className="text-white/50 font-geist-mono-extralight text-sm">+45.2% return</div>
          </div>
        </div>

        {/* Card 2 - Portfolio Allocation */}
        <div className="bg-[#131313] border border-white/10 rounded-lg p-6 flex flex-col">
          <h3 className="text-white/50 font-geist text-sm mb-4">Top Holdings</h3>
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-white font-geist text-sm">BTC</span>
              <span className="text-white/70 font-geist-mono-regular text-sm">42%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white font-geist text-sm">ETH</span>
              <span className="text-white/70 font-geist-mono-regular text-sm">28%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white font-geist text-sm">SOL</span>
              <span className="text-white/70 font-geist-mono-regular text-sm">15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white font-geist text-sm">Others</span>
              <span className="text-white/70 font-geist-mono-regular text-sm">15%</span>
            </div>
          </div>
        </div>

        {/* Card 3 - Performance Metrics */}
        <div className="bg-[#131313] border border-white/10 rounded-lg p-6 flex flex-col">
          <h3 className="text-white/50 font-geist text-sm mb-4">Performance</h3>
          <div className="flex-1 flex flex-col gap-3">
            <div>
              <div className="text-white/50 font-geist-mono-extralight text-xs mb-1">Win Rate</div>
              <div className="text-white font-geist-mono-regular text-xl">67.8%</div>
            </div>
            <div>
              <div className="text-white/50 font-geist-mono-extralight text-xs mb-1">Total Trades</div>
              <div className="text-white font-geist-mono-regular text-xl">143</div>
            </div>
            <div>
              <div className="text-white/50 font-geist-mono-extralight text-xs mb-1">Avg. Return</div>
              <div className="text-green-500 font-geist-mono-regular text-xl">+8.4%</div>
            </div>
          </div>
        </div>

        {/* Card 4 - Recent Activity */}
        <div className="bg-[#131313] border border-white/10 rounded-lg p-6 flex flex-col">
          <h3 className="text-white/50 font-geist text-sm mb-4">Recent Activity</h3>
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-white font-geist text-sm">BTC Buy</div>
                <div className="text-white/50 font-geist-mono-extralight text-xs">2 hours ago</div>
              </div>
              <div className="text-green-500 font-geist-mono-regular text-sm">+$1,240</div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-white font-geist text-sm">ETH Sell</div>
                <div className="text-white/50 font-geist-mono-extralight text-xs">5 hours ago</div>
              </div>
              <div className="text-red-500 font-geist-mono-regular text-sm">-$890</div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-white font-geist text-sm">SOL Buy</div>
                <div className="text-white/50 font-geist-mono-extralight text-xs">1 day ago</div>
              </div>
              <div className="text-green-500 font-geist-mono-regular text-sm">+$560</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
