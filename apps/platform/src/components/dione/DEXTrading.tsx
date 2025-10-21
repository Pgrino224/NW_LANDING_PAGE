import { useState, useMemo } from 'react'
import SymbolSelector from './SymbolSelector'
import TradingPanel from './TradingPanel'
import OrdersPositions from './OrdersPositions'
import CandlestickChart from './CandlestickChart'
import OptionsChain from './OptionsChain'
import Leaderboard from './Leaderboard'
import HeatMap from './HeatMap'
import TradeHistory from './TradeHistory'
import PriceAlerts from './PriceAlerts'
import VolumeLeaders from './VolumeLeaders'
import NetworthIcon from '../shared/NetworthIcon'
import { AssetIcon } from '../../utils/iconHelper'
import type { Token, TimeInterval } from '../../services/api/dioneApi'
import { getLatestOHLC } from '../../services/mock/mockDioneData'

type WidgetType = 'options-chain' | 'orders-positions' | 'leaderboard' | 'heat-map' | 'trade-history' | 'price-alerts' | 'volume-leaders'

const AVAILABLE_WIDGETS: { id: WidgetType; name: string; description: string }[] = [
  { id: 'options-chain', name: 'Options Chain', description: 'View call and put options' },
  { id: 'orders-positions', name: 'Orders & Positions', description: 'Track your active orders and positions' },
  { id: 'leaderboard', name: 'Leaderboard', description: 'Top traders ranked by performance' },
  { id: 'heat-map', name: 'Market Heat Map', description: 'Visual token performance grid' },
  { id: 'trade-history', name: 'Trade History', description: 'Your recent trades with P&L' },
  { id: 'price-alerts', name: 'Price Alerts', description: 'Set and view price alerts' },
  { id: 'volume-leaders', name: 'Volume Leaders', description: 'Highest trading volume tokens' }
]

interface DEXTradingProps {
  tokens: Token[]
}

export default function DEXTrading({ tokens }: DEXTradingProps) {
  const [chart1Token, setChart1Token] = useState<Token>(tokens[6] || tokens[0]) // BTC or first token
  const [chart2Token, setChart2Token] = useState<Token>(tokens[7] || tokens[1]) // ETH or second token
  const [chart1Interval, setChart1Interval] = useState<TimeInterval>('1M')
  const [chart2Interval, setChart2Interval] = useState<TimeInterval>('1M')
  const [tradingPanel, setTradingPanel] = useState<{ token: Token; mode: 'buy' | 'sell' } | null>(null)
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false)
  const [selectedWidget, setSelectedWidget] = useState<WidgetType | null>(null)
  const [editingPosition, setEditingPosition] = useState<'topRight' | 'middleRight' | 'bottomLeft' | 'bottomMiddle' | 'bottomRight' | null>(null)
  const [widgets, setWidgets] = useState<{
    topRight: WidgetType
    middleRight: WidgetType
    bottomLeft: WidgetType
    bottomMiddle: WidgetType
    bottomRight: WidgetType
  }>({
    topRight: 'options-chain',
    middleRight: 'orders-positions',
    bottomLeft: 'leaderboard',
    bottomMiddle: 'heat-map',
    bottomRight: 'trade-history'
  })

  const handleWidgetSelect = (widgetType: WidgetType) => {
    if (editingPosition) {
      // Immediately swap the widget
      setWidgets({ ...widgets, [editingPosition]: widgetType })
      setEditingPosition(null)
    }
    setShowWidgetLibrary(false)
  }

  const timeIntervals: TimeInterval[] = ['1D', '1W', '1M', '3M', 'YTD', '1Y', '5Y', 'All']

  const chart1OHLC = useMemo(() => getLatestOHLC(chart1Token.symbol, chart1Interval), [chart1Token.symbol, chart1Interval])
  const chart2OHLC = useMemo(() => getLatestOHLC(chart2Token.symbol, chart2Interval), [chart2Token.symbol, chart2Interval])

  return (
    <div className="w-full h-full p-6">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <img src="/dione/title-icons/dione-icon.svg" alt="" className="w-12 h-12" />
        <h1 className="font-geist-bold text-white text-3xl">DEX</h1>
      </div>

      {/* Bento Grid: 3 columns x 3 rows */}
      <div className="w-full grid gap-4 pb-4" style={{
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 400px)'
      }}>
        {/* Box 1 - Top Chart */}
        <div
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col h-[400px]"
          style={{ gridColumn: 'span 2', gridRow: 'span 1' }}
        >
          {/* Chart Header - Top Row */}
          <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <SymbolSelector
              selectedToken={chart1Token}
              availableTokens={tokens}
              onSelectToken={setChart1Token}
            />

            {/* Time Interval Buttons */}
            <div className="flex items-center gap-1">
              {timeIntervals.map((interval) => (
                <button
                  key={interval}
                  onClick={() => setChart1Interval(interval)}
                  className={`px-3 py-1 font-geist-mono-extralight text-xs rounded border transition-colors ${
                    chart1Interval === interval
                      ? 'text-white bg-white/10 border-white/20'
                      : 'text-white/50 hover:text-white hover:bg-white/5 border-white/10'
                  }`}
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 px-4 -mr-2 relative">
            <CandlestickChart token={chart1Token} interval={chart1Interval} />

            {/* Buy/Sell Buttons Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <button
                onClick={() => setTradingPanel({ token: chart1Token, mode: 'buy' })}
                className="px-3 py-1 text-white font-geist-mono-extralight text-xs rounded border transition-colors backdrop-blur-sm"
                style={{ backgroundColor: '#84cc16', borderColor: '#059669' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#84cc16'}
              >
                Buy
              </button>
              <button
                onClick={() => setTradingPanel({ token: chart1Token, mode: 'sell' })}
                className="px-3 py-1 text-white font-geist-mono-extralight text-xs rounded border transition-colors backdrop-blur-sm"
                style={{ backgroundColor: '#ef4444', borderColor: '#dc2626' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Bottom Row: OHLC Data Only */}
          <div className="px-4 pb-4 flex items-center justify-end">
            {/* OHLC Data - Right */}
            <div className="flex items-center gap-4 text-xs font-geist-mono-extralight">
              <div className="flex items-baseline">
                <span className="text-white/40">O</span>
                <span className="inline-flex items-baseline text-white ml-1"><NetworthIcon className="w-3 h-3" />{chart1OHLC.open.toFixed(2)}</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-white/40">H</span>
                <span className="inline-flex items-baseline text-white ml-1"><NetworthIcon className="w-3 h-3" />{chart1OHLC.high.toFixed(2)}</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-white/40">L</span>
                <span className="inline-flex items-baseline text-white ml-1"><NetworthIcon className="w-3 h-3" />{chart1OHLC.low.toFixed(2)}</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-white/40">C</span>
                <span className="inline-flex items-baseline text-white ml-1"><NetworthIcon className="w-3 h-3" />{chart1OHLC.close.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-white/40">V</span>
                <span className="text-white ml-1">{(chart1OHLC.volume / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 3 - Top right - Widgets */}
        <div
          className={`relative transition-all h-[400px] group ${editingPosition === 'topRight' ? 'ring-2 ring-white/40' : ''}`}
          style={{ gridColumn: 'span 1', gridRow: 'span 1' }}
        >
          {/* Edit Handle */}
          <button
            onClick={() => {
              setEditingPosition('topRight')
              setShowWidgetLibrary(true)
            }}
            className="absolute bottom-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:from-white/15 hover:to-white/10 rounded border border-white/20 text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>

          {widgets.topRight === 'options-chain' && <OptionsChain initialToken={chart1Token} />}
          {widgets.topRight === 'orders-positions' && <OrdersPositions />}
          {widgets.topRight === 'leaderboard' && <Leaderboard />}
          {widgets.topRight === 'heat-map' && <HeatMap />}
          {widgets.topRight === 'trade-history' && <TradeHistory />}
          {widgets.topRight === 'price-alerts' && <PriceAlerts />}
          {widgets.topRight === 'volume-leaders' && <VolumeLeaders />}
        </div>

        {/* Box 2 - Bottom Chart */}
        <div
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col h-[400px]"
          style={{ gridColumn: 'span 2', gridRow: 'span 1' }}
        >
          {/* Chart Header - Top Row */}
          <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <SymbolSelector
              selectedToken={chart2Token}
              availableTokens={tokens}
              onSelectToken={setChart2Token}
            />

            {/* Time Interval Buttons */}
            <div className="flex items-center gap-1">
              {timeIntervals.map((interval) => (
                <button
                  key={interval}
                  onClick={() => setChart2Interval(interval)}
                  className={`px-3 py-1 font-geist-mono-extralight text-xs rounded border transition-colors ${
                    chart2Interval === interval
                      ? 'text-white bg-white/10 border-white/20'
                      : 'text-white/50 hover:text-white hover:bg-white/5 border-white/10'
                  }`}
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 px-4 -mr-2 relative">
            <CandlestickChart token={chart2Token} interval={chart2Interval} />

            {/* Buy/Sell Buttons Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <button
                onClick={() => setTradingPanel({ token: chart2Token, mode: 'buy' })}
                className="px-3 py-1 text-white font-geist-mono-extralight text-xs rounded border transition-colors backdrop-blur-sm"
                style={{ backgroundColor: '#84cc16', borderColor: '#059669' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#84cc16'}
              >
                Buy
              </button>
              <button
                onClick={() => setTradingPanel({ token: chart2Token, mode: 'sell' })}
                className="px-3 py-1 text-white font-geist-mono-extralight text-xs rounded border transition-colors backdrop-blur-sm"
                style={{ backgroundColor: '#ef4444', borderColor: '#dc2626' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Bottom Row: OHLC Data Only */}
          <div className="px-4 pb-4 flex items-center justify-end">
            {/* OHLC Data - Right */}
            <div className="flex items-center gap-4 text-xs font-geist-mono-extralight">
              <div className="flex items-baseline">
                <span className="text-white/40">O</span>
                <span className="inline-flex items-baseline text-white ml-1"><NetworthIcon className="w-3 h-3" />{chart2OHLC.open.toFixed(2)}</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-white/40">H</span>
                <span className="inline-flex items-baseline text-white ml-1"><NetworthIcon className="w-3 h-3" />{chart2OHLC.high.toFixed(2)}</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-white/40">L</span>
                <span className="inline-flex items-baseline text-white ml-1"><NetworthIcon className="w-3 h-3" />{chart2OHLC.low.toFixed(2)}</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-white/40">C</span>
                <span className="inline-flex items-baseline text-white ml-1"><NetworthIcon className="w-3 h-3" />{chart2OHLC.close.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-white/40">V</span>
                <span className="text-white ml-1">{(chart2OHLC.volume / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 4 - Middle right - Widgets */}
        <div
          className={`relative transition-all h-[400px] group ${editingPosition === 'middleRight' ? 'ring-2 ring-white/40' : ''}`}
          style={{ gridColumn: 'span 1', gridRow: 'span 1' }}
        >
          {/* Edit Handle */}
          <button
            onClick={() => {
              setEditingPosition('middleRight')
              setShowWidgetLibrary(true)
            }}
            className="absolute bottom-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:from-white/15 hover:to-white/10 rounded border border-white/20 text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>

          {widgets.middleRight === 'options-chain' && <OptionsChain initialToken={chart1Token} />}
          {widgets.middleRight === 'orders-positions' && <OrdersPositions />}
          {widgets.middleRight === 'leaderboard' && <Leaderboard />}
          {widgets.middleRight === 'heat-map' && <HeatMap />}
          {widgets.middleRight === 'trade-history' && <TradeHistory />}
          {widgets.middleRight === 'price-alerts' && <PriceAlerts />}
          {widgets.middleRight === 'volume-leaders' && <VolumeLeaders />}
        </div>

        {/* Row 3 - Three small square widgets */}
        <div
          className={`relative transition-all h-[400px] group ${editingPosition === 'bottomLeft' ? 'ring-2 ring-white/40' : ''}`}
          style={{ gridColumn: 'span 1', gridRow: 'span 1' }}
        >
          {/* Edit Handle */}
          <button
            onClick={() => {
              setEditingPosition('bottomLeft')
              setShowWidgetLibrary(true)
            }}
            className="absolute bottom-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:from-white/15 hover:to-white/10 rounded border border-white/20 text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>

          {widgets.bottomLeft === 'options-chain' && <OptionsChain initialToken={chart1Token} />}
          {widgets.bottomLeft === 'orders-positions' && <OrdersPositions />}
          {widgets.bottomLeft === 'leaderboard' && <Leaderboard />}
          {widgets.bottomLeft === 'heat-map' && <HeatMap />}
          {widgets.bottomLeft === 'trade-history' && <TradeHistory />}
          {widgets.bottomLeft === 'price-alerts' && <PriceAlerts />}
          {widgets.bottomLeft === 'volume-leaders' && <VolumeLeaders />}
        </div>

        <div
          className={`relative transition-all h-[400px] group ${editingPosition === 'bottomMiddle' ? 'ring-2 ring-white/40' : ''}`}
          style={{ gridColumn: 'span 1', gridRow: 'span 1' }}
        >
          {/* Edit Handle */}
          <button
            onClick={() => {
              setEditingPosition('bottomMiddle')
              setShowWidgetLibrary(true)
            }}
            className="absolute bottom-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:from-white/15 hover:to-white/10 rounded border border-white/20 text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>

          {widgets.bottomMiddle === 'options-chain' && <OptionsChain initialToken={chart1Token} />}
          {widgets.bottomMiddle === 'orders-positions' && <OrdersPositions />}
          {widgets.bottomMiddle === 'leaderboard' && <Leaderboard />}
          {widgets.bottomMiddle === 'heat-map' && <HeatMap />}
          {widgets.bottomMiddle === 'trade-history' && <TradeHistory />}
          {widgets.bottomMiddle === 'price-alerts' && <PriceAlerts />}
          {widgets.bottomMiddle === 'volume-leaders' && <VolumeLeaders />}
        </div>

        <div
          className={`relative transition-all h-[400px] group ${editingPosition === 'bottomRight' ? 'ring-2 ring-white/40' : ''}`}
          style={{ gridColumn: 'span 1', gridRow: 'span 1' }}
        >
          {/* Edit Handle */}
          <button
            onClick={() => {
              setEditingPosition('bottomRight')
              setShowWidgetLibrary(true)
            }}
            className="absolute bottom-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:from-white/15 hover:to-white/10 rounded border border-white/20 text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>

          {widgets.bottomRight === 'options-chain' && <OptionsChain initialToken={chart1Token} />}
          {widgets.bottomRight === 'orders-positions' && <OrdersPositions />}
          {widgets.bottomRight === 'leaderboard' && <Leaderboard />}
          {widgets.bottomRight === 'heat-map' && <HeatMap />}
          {widgets.bottomRight === 'trade-history' && <TradeHistory />}
          {widgets.bottomRight === 'price-alerts' && <PriceAlerts />}
          {widgets.bottomRight === 'volume-leaders' && <VolumeLeaders />}
        </div>
      </div>

      {/* Trading Panel */}
      {tradingPanel && (
        <TradingPanel
          symbol={tradingPanel.token.symbol}
          currentPrice={tradingPanel.token.price}
          mode={tradingPanel.mode}
          onClose={() => setTradingPanel(null)}
        />
      )}

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-white font-geist text-lg">Widget Library</h2>
              <button
                onClick={() => setShowWidgetLibrary(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Widget Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="grid grid-cols-2 gap-4">
                {AVAILABLE_WIDGETS.map((widget) => (
                  <div
                    key={widget.id}
                    onClick={() => handleWidgetSelect(widget.id)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg overflow-hidden cursor-pointer transition-colors"
                  >
                    {/* Preview Area */}
                    <div className="bg-[#0a0a0a] p-3 h-32 border-b border-white/10">
                      {widget.id === 'options-chain' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] text-white/40 font-geist-mono">
                            <span>STRIKE</span>
                            <span>CALLS</span>
                            <span>PUTS</span>
                          </div>
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between text-[9px] text-white/60 font-geist-mono">
                              <span className="inline-flex items-baseline"><NetworthIcon className="w-2 h-2" />50</span>
                              <span className="inline-flex items-baseline text-green-400"><NetworthIcon className="w-2 h-2" />2.50</span>
                              <span className="inline-flex items-baseline text-red-400"><NetworthIcon className="w-2 h-2" />1.80</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {widget.id === 'orders-positions' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] text-white/40 font-geist-mono mb-1">
                            <span>ASSET</span>
                            <span>TYPE</span>
                            <span>PNL</span>
                          </div>
                          <div className="flex justify-between text-[9px] text-white/60 font-geist-mono">
                            <div className="flex items-center gap-1">
                              <AssetIcon type="crypto" symbol="BTC" size={12} />
                              <span>BTC</span>
                            </div>
                            <span className="text-green-400">BUY</span>
                            <span className="inline-flex items-baseline text-green-400">+<NetworthIcon className="w-2 h-2" />250</span>
                          </div>
                          <div className="flex justify-between text-[9px] text-white/60 font-geist-mono">
                            <div className="flex items-center gap-1">
                              <AssetIcon type="stock" symbol="AAPL" name="Apple Inc" size={12} />
                              <span>AAPL</span>
                            </div>
                            <span className="text-red-400">SELL</span>
                            <span className="inline-flex items-baseline text-red-400">-<NetworthIcon className="w-2 h-2" />120</span>
                          </div>
                        </div>
                      )}
                      {widget.id === 'leaderboard' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] text-white/40 font-geist-mono mb-1">
                            <span>RANK</span>
                            <span>PLAYER</span>
                            <span>PNL</span>
                          </div>
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between text-[9px] text-white/60 font-geist-mono">
                              <span>#{i}</span>
                              <span>Player{i}</span>
                              <span className="text-green-400">+{1000 - i * 100}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {widget.id === 'heat-map' && (
                        <div className="grid grid-cols-4 gap-1">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div
                              key={i}
                              className={`h-6 rounded text-[8px] font-geist-mono flex items-center justify-center ${
                                i % 3 === 0 ? 'bg-lime-500/30 text-green-400' : i % 2 === 0 ? 'bg-red-500/30 text-red-400' : 'bg-white/10 text-white/40'
                              }`}
                            >
                              {i % 3 === 0 ? '+5%' : i % 2 === 0 ? '-3%' : '0%'}
                            </div>
                          ))}
                        </div>
                      )}
                      {widget.id === 'trade-history' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] text-white/40 font-geist-mono mb-1">
                            <span>TIME</span>
                            <span>TYPE</span>
                            <span>PNL</span>
                          </div>
                          {['2m', '5m', '10m'].map((time, i) => (
                            <div key={i} className="flex justify-between text-[9px] text-white/60 font-geist-mono">
                              <span>{time}</span>
                              <span className={i % 2 === 0 ? 'text-green-400' : 'text-red-400'}>{i % 2 === 0 ? 'BUY' : 'SELL'}</span>
                              <span className={i % 2 === 0 ? 'text-green-400' : 'text-red-400'}>{i % 2 === 0 ? '+' : '-'}{i % 2 === 0 ? '50' : '30'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {widget.id === 'price-alerts' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] text-white/40 font-geist-mono mb-1">
                            <span>TOKEN</span>
                            <span>TARGET</span>
                            <span>STATUS</span>
                          </div>
                          {['BTC', 'ETH', 'SOL'].map((token, i) => (
                            <div key={i} className="flex justify-between text-[9px] text-white/60 font-geist-mono">
                              <span>{token}</span>
                              <span className="inline-flex items-baseline"><NetworthIcon className="w-2 h-2" />{50000 - i * 1000}</span>
                              <span className="text-yellow-400">●</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {widget.id === 'volume-leaders' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] text-white/40 font-geist-mono mb-1">
                            <span>TOKEN</span>
                            <span>VOLUME</span>
                            <span>CHANGE</span>
                          </div>
                          {['BTC', 'ETH', 'SOL'].map((token, i) => (
                            <div key={i} className="flex justify-between text-[9px] text-white/60 font-geist-mono">
                              <span>{token}</span>
                              <span className="inline-flex items-baseline"><NetworthIcon className="w-2 h-2" />{500 - i * 100}M</span>
                              <span className="text-green-400">+{5 - i}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Widget Info */}
                    <div className="p-3">
                      <h3 className="text-white font-geist text-sm mb-1">{widget.name}</h3>
                      <p className="text-white/60 font-geist-mono-extralight text-xs">{widget.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
