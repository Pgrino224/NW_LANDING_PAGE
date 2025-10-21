import { useState } from 'react'
import SymbolSelector from './SymbolSelector'
import { mockTokens } from './mockData'
import type { Token } from './mockData'
import NetworthIcon from '../shared/NetworthIcon'

interface OptionsChainProps {
  initialToken?: Token
}

interface OptionStrike {
  strike: number
  call: {
    bid: number
    ask: number
    volume: number
    openInterest: number
    iv: number
    delta: number
    gamma: number
    theta: number
    vega: number
  }
  put: {
    bid: number
    ask: number
    volume: number
    openInterest: number
    iv: number
    delta: number
    gamma: number
    theta: number
    vega: number
  }
}

// Mock options data generator
const generateOptionsData = (currentPrice: number): OptionStrike[] => {
  const strikes: OptionStrike[] = []
  const baseStrike = Math.round(currentPrice / 1000) * 1000

  for (let i = -5; i <= 5; i++) {
    const strike = baseStrike + (i * 1000)
    const distance = Math.abs(strike - currentPrice)
    const isITM = strike < currentPrice

    strikes.push({
      strike,
      call: {
        bid: isITM ? Math.max(currentPrice - strike, 0) + Math.random() * 100 : Math.random() * 50,
        ask: isITM ? Math.max(currentPrice - strike, 0) + Math.random() * 100 + 10 : Math.random() * 50 + 10,
        volume: Math.floor(Math.random() * 1000),
        openInterest: Math.floor(Math.random() * 5000),
        iv: 0.3 + Math.random() * 0.4,
        delta: isITM ? 0.5 + Math.random() * 0.4 : Math.random() * 0.5,
        gamma: 0.001 + Math.random() * 0.005,
        theta: -(Math.random() * 0.1),
        vega: Math.random() * 0.2
      },
      put: {
        bid: !isITM ? Math.max(strike - currentPrice, 0) + Math.random() * 100 : Math.random() * 50,
        ask: !isITM ? Math.max(strike - currentPrice, 0) + Math.random() * 100 + 10 : Math.random() * 50 + 10,
        volume: Math.floor(Math.random() * 1000),
        openInterest: Math.floor(Math.random() * 5000),
        iv: 0.3 + Math.random() * 0.4,
        delta: !isITM ? -(0.5 + Math.random() * 0.4) : -(Math.random() * 0.5),
        gamma: 0.001 + Math.random() * 0.005,
        theta: -(Math.random() * 0.1),
        vega: Math.random() * 0.2
      }
    })
  }

  return strikes
}

export default function OptionsChain({ initialToken = mockTokens[6] }: OptionsChainProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Token>(initialToken)
  const [selectedExpiration, setSelectedExpiration] = useState('30D')

  const expirations = ['7D', '14D', '30D', '60D', '90D']
  const optionsData = generateOptionsData(selectedToken.price)

  // Preview shows 10 strikes
  const previewData = optionsData.slice(0, 10)

  return (
    <>
      {/* Collapsed State - Preview */}
      <div
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 cursor-pointer h-full flex flex-col overflow-hidden"
        onClick={() => setIsExpanded(true)}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-white font-geist text-lg">Options Chain</h3>
            <div className="h-6 w-px bg-white/20"></div>
            <span className="text-white font-geist-mono text-lg">{selectedToken.symbol}</span>
          </div>
          <div className="text-white/40">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 13L10 10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 10 10)"/>
            </svg>
          </div>
        </div>

        {/* Mini Preview Table */}
        <div className="flex-1 overflow-hidden">
          <div className="py-2 grid grid-cols-3 gap-2 border-t border-b border-white/10">
            <div className="text-white/40 font-geist-mono-extralight text-[10px] uppercase text-right px-4">Call</div>
            <div className="text-white/40 font-geist-mono-extralight text-[10px] uppercase text-center">Strike</div>
            <div className="text-white/40 font-geist-mono-extralight text-[10px] uppercase text-left px-4">Put</div>
          </div>

          {previewData.map((strike) => (
            <div key={strike.strike} className="grid grid-cols-3 gap-2 text-xs py-2 border-b border-white/5 hover:bg-white/5 transition-colors">
              <div className="font-geist-mono text-right px-4" style={{ color: '#84cc16' }}>
                {strike.call.bid.toFixed(2)}
              </div>
              <div className="text-white font-geist-mono text-center font-semibold">
                {strike.strike}
              </div>
              <div className="font-geist-mono text-left px-4" style={{ color: '#ef4444' }}>
                {strike.put.bid.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="text-white/40 text-xs font-geist text-center py-3 border-t border-white/10">
          Click to expand
        </div>
      </div>

      {/* Expanded State - Modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 pointer-events-none"
          style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}
        >
          {/* Modal positioned to the right, 40% width */}
          <div
            className="absolute top-[50%] right-6 translate-y-[-50%] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 shadow-2xl"
            style={{
              width: '40%',
              maxHeight: '85vh',
              animation: 'expandModal 0.3s ease-out'
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SymbolSelector
                  selectedToken={selectedToken}
                  availableTokens={mockTokens}
                  onSelectToken={setSelectedToken}
                />

                {/* Expiration Selector */}
                <div className="flex items-center gap-2">
                  {expirations.map((exp) => (
                    <button
                      key={exp}
                      onClick={() => setSelectedExpiration(exp)}
                      className={`px-3 py-1 font-geist-mono text-xs rounded transition-colors ${
                        selectedExpiration === exp
                          ? 'text-white bg-white/10'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Full Options Chain Table */}
            <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(85vh - 80px)' }}>
              <div className="p-4">
                {/* Table Header */}
                <div className="grid grid-cols-11 gap-2 text-xs font-geist-mono text-white/40 mb-2 pb-2 border-b border-white/10">
                  <div className="text-right">Bid</div>
                  <div className="text-right">Ask</div>
                  <div className="text-right">Vol</div>
                  <div className="text-right">OI</div>
                  <div className="text-right">IV</div>
                  <div className="text-center font-semibold text-white/60">Strike</div>
                  <div className="text-left">IV</div>
                  <div className="text-left">OI</div>
                  <div className="text-left">Vol</div>
                  <div className="text-left">Ask</div>
                  <div className="text-left">Bid</div>
                </div>

                {/* Table Rows */}
                {optionsData.map((strike) => {
                  const isATM = Math.abs(strike.strike - selectedToken.price) < 1000
                  return (
                    <div
                      key={strike.strike}
                      className={`grid grid-cols-11 gap-2 text-xs font-geist-mono py-2 hover:bg-white/5 transition-colors ${
                        isATM ? 'bg-white/5' : ''
                      }`}
                    >
                      {/* Calls */}
                      <div className="text-right" style={{ color: '#84cc16' }}>
                        {strike.call.bid.toFixed(2)}
                      </div>
                      <div className="text-right" style={{ color: '#84cc16' }}>
                        {strike.call.ask.toFixed(2)}
                      </div>
                      <div className="text-white/60 text-right">{strike.call.volume}</div>
                      <div className="text-white/60 text-right">{strike.call.openInterest}</div>
                      <div className="text-white/60 text-right">{(strike.call.iv * 100).toFixed(1)}%</div>

                      {/* Strike */}
                      <div className="text-white text-center font-semibold">
                        {strike.strike}
                      </div>

                      {/* Puts */}
                      <div className="text-white/60 text-left">{(strike.put.iv * 100).toFixed(1)}%</div>
                      <div className="text-white/60 text-left">{strike.put.openInterest}</div>
                      <div className="text-white/60 text-left">{strike.put.volume}</div>
                      <div className="text-left" style={{ color: '#ef4444' }}>
                        {strike.put.ask.toFixed(2)}
                      </div>
                      <div className="text-left" style={{ color: '#ef4444' }}>
                        {strike.put.bid.toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes expandModal {
              from {
                opacity: 0;
                transform: translateY(-50%) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(-50%) scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </>
  )
}
