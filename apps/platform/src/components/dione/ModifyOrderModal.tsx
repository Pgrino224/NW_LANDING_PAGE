import { useState, useRef, useEffect } from 'react'
import { dioneApi, type Order } from '../../services/api/dioneApi'
import { useBalance } from '../../contexts/BalanceContext'
import { useOrders } from '../../contexts/OrdersContext'
import ConfirmationModal from '../common/ConfirmationModal'
import StatusModal from '../common/StatusModal'
import NetworthIcon from '../shared/NetworthIcon'

interface ModifyOrderModalProps {
  order: Order
  onClose: () => void
  onOrderModified?: () => void
}

export default function ModifyOrderModal({ order, onClose, onOrderModified }: ModifyOrderModalProps) {
  const { refreshBalance } = useBalance()
  const { triggerRefresh } = useOrders()
  const [orderType, setOrderType] = useState(order.type)
  const [quantity, setQuantity] = useState(order.quantity)
  const [limitPrice, setLimitPrice] = useState(order.price)
  const [stopPrice, setStopPrice] = useState(order.stopPrice || order.price)
  const [timeInForce, setTimeInForce] = useState('Good for day')
  const [tradingSession, setTradingSession] = useState('Market hours')

  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  const [isModifying, setIsModifying] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({ isOpen: false, type: 'success', title: '', message: '' })

  const estimatedCost = quantity * limitPrice
  const currentPrice = order.price // Use order price as reference

  // Handle order modification
  const handleModifyOrder = async () => {
    setIsModifying(true)

    try {
      await dioneApi.modifyOrder(order.id, {
        type: orderType,
        quantity,
        price: limitPrice,
        stopPrice: (orderType === 'Stop loss' || orderType === 'Stop limit') ? stopPrice : undefined
      })

      setStatusModal({
        isOpen: true,
        type: 'success',
        title: 'Order Modified',
        message: `Order #${order.id} has been successfully modified.`
      })

      // Refresh global balance and orders
      await refreshBalance()
      triggerRefresh()

      // Notify parent component to refresh orders
      if (onOrderModified) {
        onOrderModified()
      }

      // Close modal after status modal closes
      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      console.error('Order modification failed:', error)
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Modification Failed',
        message: 'Failed to modify order. Please try again.'
      })
    } finally {
      setIsModifying(false)
    }
  }

  // Handle order removal confirmation
  const handleRemoveOrder = () => {
    setShowRemoveConfirm(true)
  }

  // Confirm order removal
  const confirmRemoveOrder = async () => {
    setShowRemoveConfirm(false)
    setIsRemoving(true)

    try {
      await dioneApi.cancelOrder(order.id)

      setStatusModal({
        isOpen: true,
        type: 'success',
        title: 'Order Removed',
        message: `Order #${order.id} has been successfully removed.`
      })

      // Refresh global balance and orders
      await refreshBalance()
      triggerRefresh()

      // Notify parent component to refresh orders
      if (onOrderModified) {
        onOrderModified()
      }

      // Close modal after status modal closes
      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      console.error('Order removal failed:', error)
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Removal Failed',
        message: 'Failed to remove order. Please try again.'
      })
    } finally {
      setIsRemoving(false)
    }
  }

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  return (
    <div
      ref={panelRef}
      className="fixed bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '320px',
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* Draggable Header */}
      <div
        onMouseDown={handleMouseDown}
        className="px-4 py-3 border-b border-white/10 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-geist text-lg">Modify Order</span>
          <span className="text-white/50 font-geist-mono-extralight text-xs">#{order.id}</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Order Info */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-geist text-sm">{order.symbol}</div>
            <div className="font-geist text-xs" style={{ color: order.side === 'buy' ? '#84cc16' : '#ef4444' }}>
              {order.side.charAt(0).toUpperCase() + order.side.slice(1)} Order
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-geist-mono-regular text-sm inline-flex items-baseline"><NetworthIcon className="w-3 h-3" />{order.price.toFixed(2)}</div>
            <div className="text-white/50 font-geist-mono-extralight text-xs">{order.quantity} shares</div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-4 pb-4 pt-3 space-y-3">
        {/* Order Type */}
        <div className="flex items-center justify-between">
          <label className="text-white font-geist text-sm">Order type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-extralight text-xs rounded px-3 py-1.5 w-32 focus:outline-none focus:border-white/20"
          >
            <option>Limit</option>
            <option>Market</option>
            <option>Stop loss</option>
            <option>Stop limit</option>
          </select>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between">
          <label className="text-white font-geist text-sm">Quantity</label>
          <div className="relative w-32">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-regular text-xs rounded px-3 py-1.5 pr-8 w-full focus:outline-none focus:border-white/20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="text-white/50 hover:text-white text-xs leading-none"
              >
                +
              </button>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="text-white/50 hover:text-white text-xs leading-none"
              >
                −
              </button>
            </div>
          </div>
        </div>

        {/* Stop Price - only for Stop loss and Stop limit orders */}
        {(orderType === 'Stop loss' || orderType === 'Stop limit') && (
          <div className="flex items-center justify-between">
            <label className="text-white font-geist text-sm">Stop price</label>
            <div className="relative w-32">
              <input
                type="number"
                value={stopPrice.toFixed(2)}
                onChange={(e) => setStopPrice(Number(e.target.value))}
                className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-regular text-xs rounded px-3 py-1.5 pr-8 w-full focus:outline-none focus:border-white/20"
                step="0.01"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                <button
                  onClick={() => setStopPrice(p => p + 0.01)}
                  className="text-white/50 hover:text-white text-xs leading-none"
                >
                  +
                </button>
                <button
                  onClick={() => setStopPrice(p => Math.max(0.01, p - 0.01))}
                  className="text-white/50 hover:text-white text-xs leading-none"
                >
                  −
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Limit Price */}
        <div className="flex items-center justify-between">
          <label className="text-white font-geist text-sm">Limit price</label>
          <div className="relative w-32">
            <input
              type="number"
              value={limitPrice.toFixed(2)}
              onChange={(e) => setLimitPrice(Number(e.target.value))}
              className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-regular text-xs rounded px-3 py-1.5 pr-8 w-full focus:outline-none focus:border-white/20"
              step="0.01"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
              <button
                onClick={() => setLimitPrice(p => p + 0.01)}
                className="text-white/50 hover:text-white text-xs leading-none"
              >
                +
              </button>
              <button
                onClick={() => setLimitPrice(p => Math.max(0.01, p - 0.01))}
                className="text-white/50 hover:text-white text-xs leading-none"
              >
                −
              </button>
            </div>
          </div>
        </div>

        {/* Time in Force */}
        <div className="flex items-center justify-between">
          <label className="text-white font-geist text-sm">Time in force</label>
          <select
            value={timeInForce}
            onChange={(e) => setTimeInForce(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-extralight text-xs rounded px-3 py-1.5 w-32 focus:outline-none focus:border-white/20"
          >
            <option>Good for day</option>
            <option>Good till canceled</option>
            <option>Immediate or cancel</option>
          </select>
        </div>

        {/* Trading Session */}
        <div className="flex items-center justify-between">
          <label className="text-white font-geist text-sm">Trading session</label>
          <select
            value={tradingSession}
            onChange={(e) => setTradingSession(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 text-white font-geist-mono-extralight text-xs rounded px-3 py-1.5 w-32 focus:outline-none focus:border-white/20"
          >
            <option>Market hours</option>
            <option>Extended hours</option>
          </select>
        </div>

        {/* Estimated Cost */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-geist text-sm">Estimated cost</span>
            <span className="text-white font-geist-mono-regular text-lg inline-flex items-baseline"><NetworthIcon className="w-4 h-4" />{estimatedCost.toFixed(2)}</span>
          </div>
          <div className="text-white/40 font-geist-mono-extralight text-xs">
            <span className="inline-flex items-baseline"><NetworthIcon className="w-3 h-3" />{estimatedCost.toFixed(2)}</span> buying power
          </div>
        </div>

        {/* Order Details */}
        <div className="text-white/50 font-geist-mono-extralight text-xs leading-relaxed">
          Modifying order #{order.id} for {order.symbol}. Current: <span className="inline-flex items-baseline"><NetworthIcon className="w-3 h-3" />{currentPrice.toFixed(2)}</span> · {order.quantity} shares.
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-2 pt-2">
          <button
            onClick={handleRemoveOrder}
            className="px-4 py-1.5 font-geist text-xs rounded transition-colors"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
            }}
            disabled={isModifying || isRemoving}
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white font-geist text-xs rounded transition-colors"
              disabled={isModifying || isRemoving}
            >
              Cancel
            </button>
            <button
              onClick={handleModifyOrder}
              className="px-4 py-1.5 text-white font-geist text-xs rounded transition-colors"
              style={{ backgroundColor: '#84cc16' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#84cc16'
              }}
              disabled={isModifying || isRemoving}
            >
              {isModifying ? 'Modifying...' : 'Modify'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRemoveConfirm}
        title="Remove Order"
        message={`Are you sure you want to remove order #${order.id} for ${order.symbol}?`}
        confirmText="Remove"
        confirmColor="red"
        cancelText="Cancel"
        onConfirm={confirmRemoveOrder}
        onCancel={() => setShowRemoveConfirm(false)}
      />

      {/* Status Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
      />
    </div>
  )
}
