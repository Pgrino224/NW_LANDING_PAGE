import { useState, useEffect } from 'react'
import { dioneApi, type Order, type Position, type Trade } from '../../services/api/dioneApi'
import { useBalance } from '../../contexts/BalanceContext'
import { useOrders } from '../../contexts/OrdersContext'
import ModifyOrderModal from './ModifyOrderModal'
import ConfirmationModal from '../common/ConfirmationModal'
import StatusModal from '../common/StatusModal'
import { AssetIcon } from '../../utils/iconHelper'
import { mockTokens } from './mockData'
import PnLCardModal from '../shared/PnLCardModal'

type Tab = 'orders' | 'positions' | 'history'

// Helper function to determine asset type from symbol
const getAssetTypeFromSymbol = (symbol: string): 'crypto' | 'stock' | 'index' | 'etf' | 'commodity' => {
  const token = mockTokens.find(t => t.symbol === symbol || t.symbol === `${symbol}USDT`)
  if (!token) {
    // Default guess based on common patterns
    if (['BTC', 'ETH', 'SOL', 'AVAX', 'LINK'].includes(symbol)) return 'crypto'
    if (['SPX', 'NDQ', 'DJI'].includes(symbol)) return 'index'
    return 'stock' // Default to stock
  }

  // Map category to AssetIcon type
  const categoryMap: Record<string, 'crypto' | 'stock' | 'index' | 'etf' | 'commodity'> = {
    'crypto': 'crypto',
    'stocks': 'stock',
    'indices': 'index',
    'etfs': 'etf',
    'commodities': 'commodity'
  }
  return categoryMap[token.category] || 'stock'
}

const getAssetNameFromSymbol = (symbol: string): string => {
  const token = mockTokens.find(t => t.symbol === symbol || t.symbol === `${symbol}USDT`)
  return token?.name || symbol
}

export default function OrdersPositions() {
  const { refreshBalance } = useBalance()
  const { refreshTrigger, triggerRefresh } = useOrders()
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [modifyingOrder, setModifyingOrder] = useState<Order | null>(null)

  const [closePositionConfirm, setClosePositionConfirm] = useState<{ isOpen: boolean; positionId: string; symbol: string }>({ isOpen: false, positionId: '', symbol: '' })
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({ isOpen: false, type: 'success', title: '', message: '' })
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareModalData, setShareModalData] = useState<any>(null)

  const loadData = async () => {
    try {
      const [ordersData, positionsData, tradesData] = await Promise.all([
        dioneApi.getUserOrders(),
        dioneApi.getUserPositions(),
        dioneApi.getUserTrades()
      ])
      setOrders(ordersData)
      setPositions(positionsData)
      setTrades(tradesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Refresh when orders context triggers a refresh
  useEffect(() => {
    if (refreshTrigger > 0) {
      loadData()
    }
  }, [refreshTrigger])

  const handleCancelOrder = async (orderId: string) => {
    try {
      await dioneApi.cancelOrder(orderId)
      await loadData()
    } catch (error) {
      console.error('Error canceling order:', error)
    }
  }

  const handleClosePosition = (positionId: string, symbol: string) => {
    setClosePositionConfirm({ isOpen: true, positionId, symbol })
  }

  const handleShareTrade = (trade: Trade) => {
    const pnlPercentage = trade.exitPrice
      ? ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100 * (trade.type === 'buy' ? 1 : -1)
      : 0

    setShareModalData({
      gameMode: 'dione',
      userData: {
        username: 'taut-dogwood', // TODO: Get from user context
        profileImage: undefined
      },
      transactionData: {
        tradeSymbol: trade.symbol,
        tradeName: trade.name,
        assetType: trade.assetType,
        side: trade.type,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        quantity: trade.quantity,
        pnl: trade.pnl,
        pnlPercentage: pnlPercentage,
        currency: 'NW'
      }
    })
    setShareModalOpen(true)
  }

  const confirmClosePosition = async () => {
    const { positionId } = closePositionConfirm
    setClosePositionConfirm({ isOpen: false, positionId: '', symbol: '' })

    try {
      await dioneApi.closePosition(positionId)
      setStatusModal({
        isOpen: true,
        type: 'success',
        title: 'Position Closed',
        message: 'Position has been successfully closed.'
      })

      // Refresh global balance and trigger widget updates
      await refreshBalance()
      triggerRefresh()

      await loadData()
    } catch (error) {
      console.error('Error closing position:', error)
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Close Failed',
        message: 'Failed to close position. Please try again.'
      })
    }
  }

  const activeOrders = orders.filter(o => o.status === 'open')
  const closedTrades = trades.filter(t => t.status === 'closed')

  const totalPositions = positions.length
  const unrealizedPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0)
  const marginUsed = positions.reduce((sum, pos) => sum + (pos.avgPrice * pos.quantity), 0)

  // Preview data - show first 3 items
  const previewOrders = activeOrders.slice(0, 3)
  const previewPositions = positions.slice(0, 3)

  return (
    <>
      {/* Collapsed State - Preview */}
      <div
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 cursor-pointer h-full flex flex-col overflow-hidden"
        onClick={() => setIsExpanded(true)}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <h3 className="text-white font-geist text-lg">Orders & Positions</h3>
          <div className="text-white/40">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 13L10 10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 10 10)"/>
            </svg>
          </div>
        </div>

        {/* Mini Preview */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="text-white/50 text-center py-4 text-xs">Loading...</div>
          ) : activeOrders.length === 0 && positions.length === 0 ? (
            <div className="text-white/50 text-center py-4 text-xs">No active orders or positions</div>
          ) : (
            <div>
              {/* Preview Orders */}
              {previewOrders.length > 0 && (
                <div>
                  <div className="py-2 border-t border-b border-white/10">
                    <div className="px-4 text-white/40 font-geist-mono-extralight text-[10px] uppercase">Active Orders</div>
                  </div>
                  {previewOrders.map((order) => (
                    <div key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <div className="px-4 flex items-center justify-between py-2 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-white/60 font-geist-mono w-8">#{order.id}</span>
                          <div className="flex items-center gap-1.5">
                            <AssetIcon type={getAssetTypeFromSymbol(order.symbol)} symbol={order.symbol} name={getAssetNameFromSymbol(order.symbol)} size={14} className="flex-shrink-0" />
                            <span className="text-white font-geist">{order.symbol}</span>
                          </div>
                          <span className="font-geist text-[10px]" style={{ color: order.side === 'buy' ? '#84cc16' : '#ef4444' }}>
                            {order.side.charAt(0).toUpperCase() + order.side.slice(1)}
                          </span>
                        </div>
                        <span className="text-white font-geist-mono">{order.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Preview Positions */}
              {previewPositions.length > 0 && (
                <div className={previewOrders.length > 0 ? 'mt-3' : ''}>
                  <div className="py-2 border-t border-b border-white/10">
                    <div className="px-4 text-white/40 font-geist-mono-extralight text-[10px] uppercase">Open Positions</div>
                  </div>
                  {previewPositions.map((pos) => (
                    <div key={pos.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <div className="px-4 flex items-center justify-between py-2 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-white/60 font-geist-mono w-8">#{pos.id}</span>
                          <div className="flex items-center gap-1.5">
                            <AssetIcon type={getAssetTypeFromSymbol(pos.symbol)} symbol={pos.symbol} name={getAssetNameFromSymbol(pos.symbol)} size={14} className="flex-shrink-0" />
                            <span className="text-white font-geist">{pos.symbol}</span>
                          </div>
                        </div>
                        <span className="font-geist-mono" style={{ color: pos.pnl >= 0 ? '#84cc16' : '#ef4444' }}>
                          {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-white/40 text-xs font-geist text-center py-3 border-t border-white/10">
          Click to expand
        </div>
      </div>

      {/* Expanded State - Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 pointer-events-auto">
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
              <div className="flex items-center gap-6">
                <h3 className="text-white font-geist text-lg">Orders & Positions</h3>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveTab('orders')
                    }}
                    className={`px-3 py-1 font-geist text-xs rounded transition-colors ${
                      activeTab === 'orders'
                        ? 'text-white bg-white/10'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Active Orders
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveTab('positions')
                    }}
                    className={`px-3 py-1 font-geist text-xs rounded transition-colors ${
                      activeTab === 'positions'
                        ? 'text-white bg-white/10'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Open Positions
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveTab('history')
                    }}
                    className={`px-3 py-1 font-geist text-xs rounded transition-colors ${
                      activeTab === 'history'
                        ? 'text-white bg-white/10'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    History
                  </button>
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

            {/* Content */}
            <div className="overflow-y-auto custom-scrollbar p-4" style={{ maxHeight: 'calc(85vh - 80px)' }}>
              {/* Active Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  {loading ? (
                    <div className="text-white/50 text-center py-8">Loading orders...</div>
                  ) : activeOrders.length === 0 ? (
                    <div className="text-white/50 text-center py-8">No active orders</div>
                  ) : (
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-white/50 font-geist-mono-extralight border-b border-white/10">
                          <th className="text-left pb-3 pr-4">ID</th>
                          <th className="text-left pb-3 px-4">Symbol</th>
                          <th className="text-left pb-3 px-4">Type</th>
                          <th className="text-left pb-3 px-4">Side</th>
                          <th className="text-right pb-3 px-4">Qty</th>
                          <th className="text-right pb-3 px-4">Price</th>
                          <th className="text-left pb-3 px-4">Status</th>
                          <th className="text-right pb-3 pl-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeOrders.map((order) => (
                          <tr key={order.id} className="border-b border-white/5">
                            <td className="py-3 pr-4 text-left text-white font-geist-mono-regular">#{order.id}</td>
                            <td className="py-3 px-4 text-left text-white font-geist">
                              <div className="flex items-center gap-2">
                                <AssetIcon type={getAssetTypeFromSymbol(order.symbol)} symbol={order.symbol} name={getAssetNameFromSymbol(order.symbol)} size={16} className="flex-shrink-0" />
                                {order.symbol}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-left text-white/70 font-geist-mono-extralight">{order.type}</td>
                            <td className="py-3 px-4 text-left">
                              <span className="font-geist" style={{ color: order.side === 'buy' ? '#84cc16' : '#ef4444' }}>
                                {order.side.charAt(0).toUpperCase() + order.side.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right text-white font-geist-mono-regular">{order.quantity}</td>
                            <td className="py-3 px-4 text-right text-white font-geist-mono-regular">
                              {order.price.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-left">
                              <span className="px-2 py-0.5 rounded text-[10px] font-geist bg-yellow-500/20 text-yellow-500">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 pl-4 text-right">
                              <button
                                onClick={() => setModifyingOrder(order)}
                                className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 font-geist text-[10px] rounded transition-colors"
                              >
                                Modify
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Open Positions Tab */}
              {activeTab === 'positions' && (
                <div>
                  {loading ? (
                    <div className="text-white/50 text-center py-8">Loading positions...</div>
                  ) : positions.length === 0 ? (
                    <div className="text-white/50 text-center py-8">No open positions</div>
                  ) : (
                    <>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-white/50 font-geist-mono-extralight border-b border-white/10">
                            <th className="text-left pb-3 pr-4">ID</th>
                            <th className="text-left pb-3 px-4">Symbol</th>
                            <th className="text-right pb-3 px-4">Entry</th>
                            <th className="text-right pb-3 px-4">Qty</th>
                            <th className="text-right pb-3 px-4">Current</th>
                            <th className="text-right pb-3 px-4">PNL</th>
                            <th className="text-right pb-3 px-4">PNL %</th>
                            <th className="text-right pb-3 pl-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {positions.map((pos) => (
                            <tr key={pos.id} className="border-b border-white/5">
                              <td className="py-3 pr-4 text-left text-white font-geist-mono-regular">#{pos.id}</td>
                              <td className="py-3 px-4 text-left text-white font-geist">
                                <div className="flex items-center gap-2">
                                  <AssetIcon type={getAssetTypeFromSymbol(pos.symbol)} symbol={pos.symbol} name={getAssetNameFromSymbol(pos.symbol)} size={16} className="flex-shrink-0" />
                                  {pos.symbol}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right text-white font-geist-mono-regular">
                                {pos.avgPrice.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-right text-white font-geist-mono-regular">{pos.quantity}</td>
                              <td className="py-3 px-4 text-right text-white font-geist-mono-regular">
                                {pos.currentPrice.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className="font-geist-mono-regular" style={{ color: pos.pnl >= 0 ? '#84cc16' : '#ef4444' }}>
                                  {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className="font-geist-mono-regular" style={{ color: pos.pnlPercentage >= 0 ? '#84cc16' : '#ef4444' }}>
                                  {pos.pnlPercentage >= 0 ? '+' : ''}{pos.pnlPercentage.toFixed(2)}%
                                </span>
                              </td>
                              <td className="py-3 pl-4 text-right">
                                <button
                                  onClick={() => handleClosePosition(pos.id, pos.symbol)}
                                  className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-geist text-[10px] rounded transition-colors"
                                >
                                  Close
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Summary Footer */}
                      <div className="mt-6 pt-4 border-t border-white/10 flex gap-6 text-xs">
                        <div>
                          <span className="text-white/50 font-geist-mono-extralight">Total: </span>
                          <span className="text-white font-geist-mono-regular">{totalPositions} positions</span>
                        </div>
                        <div>
                          <span className="text-white/50 font-geist-mono-extralight">Unrealized PNL: </span>
                          <span className="font-geist-mono-regular" style={{ color: unrealizedPnl >= 0 ? '#84cc16' : '#ef4444' }}>
                            {unrealizedPnl >= 0 ? '+' : ''}{unrealizedPnl.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/50 font-geist-mono-extralight">Margin Used: </span>
                          <span className="text-white font-geist-mono-regular">
                            {marginUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Trade History Tab */}
              {activeTab === 'history' && (
                <div>
                  {loading ? (
                    <div className="text-white/50 text-center py-8">Loading history...</div>
                  ) : closedTrades.length === 0 ? (
                    <div className="text-white/50 text-center py-8">No trade history</div>
                  ) : (
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-white/50 font-geist-mono-extralight border-b border-white/10">
                          <th className="text-left pb-3 pr-4">ID</th>
                          <th className="text-left pb-3 px-4">Symbol</th>
                          <th className="text-left pb-3 px-4">Side</th>
                          <th className="text-right pb-3 px-4">Qty</th>
                          <th className="text-right pb-3 px-4">Entry</th>
                          <th className="text-right pb-3 px-4">Exit</th>
                          <th className="text-right pb-3 px-4">PnL</th>
                          <th className="text-left pb-3 px-4">Date</th>
                          <th className="text-right pb-3 pl-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {closedTrades.map((trade) => (
                          <tr key={trade.id} className="border-b border-white/5">
                            <td className="py-3 pr-4 text-left text-white font-geist-mono-regular">#{trade.id}</td>
                            <td className="py-3 px-4 text-left text-white font-geist">
                              <div className="flex items-center gap-2">
                                <AssetIcon type={trade.assetType} symbol={trade.symbol} name={trade.name} size={16} className="flex-shrink-0" />
                                {trade.symbol}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-left">
                              <span className="font-geist" style={{ color: trade.type === 'buy' ? '#84cc16' : '#ef4444' }}>
                                {trade.type.charAt(0).toUpperCase() + trade.type.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right text-white font-geist-mono-regular">{trade.quantity}</td>
                            <td className="py-3 px-4 text-right text-white font-geist-mono-regular">
                              {trade.entryPrice.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right text-white font-geist-mono-regular">
                              {trade.exitPrice?.toFixed(2) || '-'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="font-geist-mono-regular" style={{ color: trade.pnl >= 0 ? '#84cc16' : '#ef4444' }}>
                                {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-left text-white/50 font-geist-mono-extralight">
                              {new Date(trade.timestamp).toLocaleString()}
                            </td>
                            <td className="py-3 pl-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleShareTrade(trade)
                                }}
                                className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 font-geist text-[10px] rounded transition-colors"
                                title="Share this trade"
                              >
                                Share
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
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

      {/* Modify Order Modal */}
      {modifyingOrder && (
        <ModifyOrderModal
          order={modifyingOrder}
          onClose={() => setModifyingOrder(null)}
          onOrderModified={() => {
            loadData()
            setModifyingOrder(null)
          }}
        />
      )}

      {/* Close Position Confirmation Modal */}
      <ConfirmationModal
        isOpen={closePositionConfirm.isOpen}
        title="Close Position"
        message={`Are you sure you want to close your position in ${closePositionConfirm.symbol}?`}
        confirmText="Close"
        confirmColor="red"
        cancelText="Cancel"
        onConfirm={confirmClosePosition}
        onCancel={() => setClosePositionConfirm({ isOpen: false, positionId: '', symbol: '' })}
      />

      {/* Status Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
      />

      {/* Share PnL Card Modal */}
      {shareModalOpen && shareModalData && (
        <PnLCardModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          {...shareModalData}
        />
      )}
    </>
  )
}
