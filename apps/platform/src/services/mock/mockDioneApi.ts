// Mock Dione API for trading functionality
// Import unified balance from Themis API
import { mockThemisApi } from './mockThemisApi'
import {
  mockTokens,
  getCandlestickData,
  type Token,
  type TimeInterval,
  type OHLCData
} from './mockDioneData'

export interface Trade {
  id: string
  symbol: string
  name: string  // Asset name (e.g., "Apple", "Tesla", "Bitcoin")
  type: 'buy' | 'sell'
  quantity: number
  entryPrice: number
  exitPrice?: number
  pnl: number
  status: 'open' | 'closed'
  timestamp: string
  tradingType: 'spot' | 'margin' | 'futures' | 'options'
  assetType: 'crypto' | 'index' | 'commodity' | 'etf' | 'stock'  // Determines icon source
}

export interface Position {
  id: string
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  pnl: number
  pnlPercentage: number
  tradingType: 'spot' | 'margin' | 'leverage' | 'options'
  leverage?: number
  marginUsed?: number
  liquidationPrice?: number
  borrowedAmount?: number  // For margin trading
  strikePrice?: number  // For options
  optionType?: 'call' | 'put'  // For options
  expirationDate?: string  // For options
  premium?: number  // Premium paid for options
  intrinsicValue?: number  // Current intrinsic value of option
}

export interface Order {
  id: string
  symbol: string
  type: 'Limit' | 'Market' | 'Stop loss' | 'Stop limit'
  side: 'buy' | 'sell'
  quantity: number
  price: number
  stopPrice?: number  // For Stop loss and Stop limit orders
  status: 'open' | 'filled' | 'cancelled' | 'triggered'  // triggered = stop hit, now limit order
  tradingType: 'spot' | 'margin' | 'leverage' | 'options'
  leverage?: number
  strikePrice?: number  // For options
  optionType?: 'call' | 'put'  // For options
  expirationDate?: string  // For options
  premium?: number  // Premium paid for options
  timestamp: string
}

export interface OrderBookEntry {
  price: number
  quantity: number
  total: number
}

// In-memory storage for mock data
let userPositions: Position[] = [
  {
    id: '1',
    symbol: 'AAPL',
    quantity: 10,
    avgPrice: 178.50,
    currentPrice: 182.30,
    pnl: 38.00,
    pnlPercentage: 2.13,
    tradingType: 'spot'
  },
  {
    id: '2',
    symbol: 'TSLA',
    quantity: 5,
    avgPrice: 245.00,
    currentPrice: 238.50,
    pnl: -32.50,
    pnlPercentage: -2.65,
    tradingType: 'spot'
  },
  {
    id: '3',
    symbol: 'BTC',
    quantity: 0.5,
    avgPrice: 45000.00,
    currentPrice: 47500.00,
    pnl: 1250.00,
    pnlPercentage: 5.56,
    tradingType: 'spot'
  },
  {
    id: '4',
    symbol: 'ETH',
    quantity: 2,
    avgPrice: 3200.00,
    currentPrice: 3350.00,
    pnl: 300.00,
    pnlPercentage: 4.69,
    tradingType: 'spot'
  },
  {
    id: '5',
    symbol: 'SOL',
    quantity: 15,
    avgPrice: 120.00,
    currentPrice: 125.00,
    pnl: 75.00,
    pnlPercentage: 4.17,
    tradingType: 'spot'
  }
]

let userOrders: Order[] = [
  {
    id: '1',
    symbol: 'NVDA',
    type: 'Limit',
    side: 'buy',
    quantity: 3,
    price: 875.00,
    status: 'open',
    tradingType: 'spot',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
]

let userTrades: Trade[] = [
  // Profitable trades (wins)
  {
    id: 't1',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'buy',
    quantity: 0.5,
    entryPrice: 43000.00,
    exitPrice: 47500.00,
    pnl: 2250.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    tradingType: 'spot',
    assetType: 'crypto'
  },
  {
    id: 't2',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'buy',
    quantity: 3,
    entryPrice: 3000.00,
    exitPrice: 3350.00,
    pnl: 1050.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    tradingType: 'margin',
    assetType: 'crypto'
  },
  {
    id: 't3',
    symbol: 'AAPL',
    name: 'Apple',
    type: 'buy',
    quantity: 50,
    entryPrice: 170.00,
    exitPrice: 182.30,
    pnl: 615.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tradingType: 'futures',
    assetType: 'stock'
  },
  {
    id: 't4',
    symbol: 'SOL',
    name: 'Solana',
    type: 'buy',
    quantity: 100,
    entryPrice: 105.00,
    exitPrice: 125.00,
    pnl: 2000.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    tradingType: 'options',
    assetType: 'crypto'
  },
  {
    id: 't5',
    symbol: 'NVDA',
    name: 'NVIDIA',
    type: 'buy',
    quantity: 10,
    entryPrice: 780.00,
    exitPrice: 880.00,
    pnl: 1000.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tradingType: 'spot',
    assetType: 'stock'
  },
  {
    id: 't6',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'buy',
    quantity: 0.2,
    entryPrice: 44000.00,
    exitPrice: 47500.00,
    pnl: 700.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    tradingType: 'margin',
    assetType: 'crypto'
  },
  {
    id: 't7',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'buy',
    quantity: 5,
    entryPrice: 3100.00,
    exitPrice: 3350.00,
    pnl: 1250.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    tradingType: 'futures',
    assetType: 'crypto'
  },
  {
    id: 't8',
    symbol: 'TSLA',
    name: 'Tesla',
    type: 'buy',
    quantity: 15,
    entryPrice: 220.00,
    exitPrice: 238.50,
    pnl: 277.50,
    status: 'closed',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    tradingType: 'options',
    assetType: 'stock'
  },
  {
    id: 't9',
    symbol: 'SOL',
    name: 'Solana',
    type: 'buy',
    quantity: 20,
    entryPrice: 115.00,
    exitPrice: 125.00,
    pnl: 200.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tradingType: 'spot',
    assetType: 'crypto'
  },

  // Losing trades (losses)
  {
    id: 't10',
    symbol: 'TSLA',
    name: 'Tesla',
    type: 'buy',
    quantity: 20,
    entryPrice: 255.00,
    exitPrice: 238.50,
    pnl: -330.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    tradingType: 'margin',
    assetType: 'stock'
  },
  {
    id: 't11',
    symbol: 'AAPL',
    name: 'Apple',
    type: 'buy',
    quantity: 30,
    entryPrice: 188.00,
    exitPrice: 182.30,
    pnl: -171.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    tradingType: 'futures',
    assetType: 'stock'
  },
  {
    id: 't12',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'buy',
    quantity: 2,
    entryPrice: 3500.00,
    exitPrice: 3350.00,
    pnl: -300.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    tradingType: 'options',
    assetType: 'crypto'
  },
  {
    id: 't13',
    symbol: 'SOL',
    name: 'Solana',
    type: 'buy',
    quantity: 40,
    entryPrice: 135.00,
    exitPrice: 125.00,
    pnl: -400.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    tradingType: 'spot',
    assetType: 'crypto'
  },
  {
    id: 't14',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'buy',
    quantity: 0.1,
    entryPrice: 49000.00,
    exitPrice: 47500.00,
    pnl: -150.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    tradingType: 'margin',
    assetType: 'crypto'
  },
  {
    id: 't15',
    symbol: 'NVDA',
    name: 'NVIDIA',
    type: 'buy',
    quantity: 5,
    entryPrice: 920.00,
    exitPrice: 880.00,
    pnl: -200.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    tradingType: 'futures',
    assetType: 'stock'
  },

  // Additional profitable trades for variety
  {
    id: 't16',
    symbol: 'AAPL',
    name: 'Apple',
    type: 'buy',
    quantity: 100,
    entryPrice: 165.00,
    exitPrice: 182.30,
    pnl: 1730.00,
    status: 'closed',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    tradingType: 'options',
    assetType: 'stock'
  },
  {
    id: 't17',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'buy',
    quantity: 0.8,
    entryPrice: 42000.00,
    exitPrice: 47500.00,
    pnl: 4400.00, // BIGGEST WIN
    status: 'closed',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    tradingType: 'futures',
    assetType: 'crypto'
  }
]

let orderIdCounter = 2
let tradeIdCounter = 0

// Market prices (simulated, can be updated dynamically)
const marketPrices: Record<string, number> = {
  'AAPL': 182.30,
  'TSLA': 238.50,
  'NVDA': 880.00,
  'BTC': 47500.00,
  'ETH': 3350.00,
  'SOL': 125.00
}

// Helper function to calculate option premium (simplified Black-Scholes approximation)
const calculateOptionPremium = (
  currentPrice: number,
  strikePrice: number,
  optionType: 'call' | 'put',
  daysToExpiration: number
): number => {
  // Simplified premium calculation
  const intrinsicValue = optionType === 'call'
    ? Math.max(0, currentPrice - strikePrice)
    : Math.max(0, strikePrice - currentPrice)

  // Time value component (decays as expiration approaches)
  const volatility = 0.3 // Assumed 30% volatility
  const timeValue = (currentPrice * volatility * Math.sqrt(daysToExpiration / 365)) / 4

  return intrinsicValue + timeValue
}

// Helper function to calculate option intrinsic value
const calculateIntrinsicValue = (
  currentPrice: number,
  strikePrice: number,
  optionType: 'call' | 'put'
): number => {
  if (optionType === 'call') {
    return Math.max(0, currentPrice - strikePrice)
  } else {
    return Math.max(0, strikePrice - currentPrice)
  }
}

export const mockDioneApi = {
  // Get current market price for a symbol
  getMarketPrice: (symbol: string): number => {
    return marketPrices[symbol] || 100.00
  },

  // Update market price (for simulation)
  updateMarketPrice: (symbol: string, newPrice: number): void => {
    marketPrices[symbol] = newPrice
    // Check if any limit orders should be filled
    mockDioneApi.checkLimitOrders(symbol)
    // Check if any stop orders should be triggered
    mockDioneApi.checkStopOrders(symbol)
    // Update position prices
    mockDioneApi.updatePositionPrices(symbol, newPrice)
  },

  // Check and fill limit orders that have reached their price
  checkLimitOrders: async (symbol: string): Promise<void> => {
    const currentPrice = mockDioneApi.getMarketPrice(symbol)
    const ordersToFill: string[] = []

    for (const order of userOrders) {
      if (order.symbol === symbol && order.status === 'open' && order.type === 'Limit') {
        // Buy limit: fill when market price drops to or below limit price
        if (order.side === 'buy' && currentPrice <= order.price) {
          ordersToFill.push(order.id)
        }
        // Sell limit: fill when market price rises to or above limit price
        else if (order.side === 'sell' && currentPrice >= order.price) {
          ordersToFill.push(order.id)
        }
      }
    }

    // Fill all matched orders
    for (const orderId of ordersToFill) {
      await mockDioneApi.fillOrder(orderId)
    }
  },

  // Check and trigger stop orders when stop price is hit
  checkStopOrders: async (symbol: string): Promise<void> => {
    const currentPrice = mockDioneApi.getMarketPrice(symbol)

    for (const order of userOrders) {
      if (order.symbol === symbol && order.status === 'open' && order.stopPrice) {
        if (order.type === 'Stop loss') {
          // Stop loss buy: trigger when price rises to stop price
          if (order.side === 'buy' && currentPrice >= order.stopPrice) {
            await mockDioneApi.fillOrder(order.id)
          }
          // Stop loss sell: trigger when price drops to stop price
          else if (order.side === 'sell' && currentPrice <= order.stopPrice) {
            await mockDioneApi.fillOrder(order.id)
          }
        } else if (order.type === 'Stop limit') {
          // Stop limit: convert to limit order when stop price is hit
          // Buy stop limit: trigger when price rises to stop price
          if (order.side === 'buy' && currentPrice >= order.stopPrice) {
            order.status = 'triggered'
            order.type = 'Limit'
            // Now it will be checked by checkLimitOrders
          }
          // Sell stop limit: trigger when price drops to stop price
          else if (order.side === 'sell' && currentPrice <= order.stopPrice) {
            order.status = 'triggered'
            order.type = 'Limit'
            // Now it will be checked by checkLimitOrders
          }
        }
      }
    }
  },

  // Place a new order
  placeOrder: async (params: {
    symbol: string
    type: string
    side: 'buy' | 'sell'
    quantity: number
    price: number
    stopPrice?: number
    tradingType: 'spot' | 'margin' | 'leverage' | 'options'
    leverage?: number
    strikePrice?: number
    optionType?: 'call' | 'put'
    expirationDate?: string
  }): Promise<Order> => {
    await new Promise(resolve => setTimeout(resolve, 500))

    // Calculate order cost based on trading type
    const fullOrderCost = params.quantity * params.price
    let actualCost = fullOrderCost
    let marginUsed = fullOrderCost
    let premium: number | undefined

    // Handle options trading
    if (params.tradingType === 'options' && params.strikePrice && params.optionType && params.expirationDate) {
      const currentPrice = mockDioneApi.getMarketPrice(params.symbol)
      const daysToExpiration = Math.max(1, Math.floor((new Date(params.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

      // Calculate premium per share
      premium = calculateOptionPremium(currentPrice, params.strikePrice, params.optionType, daysToExpiration)
      // Total premium cost for all contracts
      actualCost = premium * params.quantity
      marginUsed = actualCost
    }
    // Apply leverage calculation
    else if (params.tradingType === 'leverage' && params.leverage && params.leverage > 1) {
      actualCost = fullOrderCost / params.leverage
      marginUsed = actualCost
    } else if (params.tradingType === 'margin') {
      // Margin trading: borrow up to 2x, so user only needs half
      actualCost = fullOrderCost / 2
      marginUsed = actualCost
    }

    if (params.side === 'buy') {
      // Check if user has enough balance for buy orders and deduct immediately
      const balance = await mockThemisApi.getUserBalance()
      if (balance.networth < actualCost) {
        throw new Error('Insufficient balance')
      }
      // Deduct balance immediately when placing buy order
      await mockThemisApi.updateBalance('networth', balance.networth - actualCost)
    } else {
      // Validate sell order - check if user has position to sell with matching trading type
      const position = userPositions.find(p =>
        p.symbol === params.symbol &&
        p.tradingType === params.tradingType &&
        p.leverage === params.leverage
      )
      if (!position) {
        throw new Error(`No ${params.tradingType} position found for ${params.symbol}${params.leverage ? ` with ${params.leverage}x leverage` : ''}. Cannot place sell order.`)
      }
      if (position.quantity < params.quantity) {
        throw new Error(`Insufficient position. You have ${position.quantity} but trying to sell ${params.quantity}.`)
      }
    }

    const newOrder: Order = {
      id: String(++orderIdCounter),
      symbol: params.symbol,
      type: params.type as Order['type'],
      side: params.side,
      quantity: params.quantity,
      price: params.price,
      stopPrice: params.stopPrice,
      status: 'open',
      tradingType: params.tradingType,
      leverage: params.leverage,
      strikePrice: params.strikePrice,
      optionType: params.optionType,
      expirationDate: params.expirationDate,
      premium: premium,
      timestamp: new Date().toISOString()
    }

    userOrders.unshift(newOrder)

    // Fill market orders immediately for testing
    if (params.type === 'Market') {
      await mockDioneApi.fillOrder(newOrder.id)
    }
    // Check if limit orders should be filled immediately
    else if (params.type === 'Limit') {
      await mockDioneApi.checkLimitOrders(params.symbol)
    }
    // Check if stop orders should trigger immediately
    else if (params.type === 'Stop loss' || params.type === 'Stop limit') {
      await mockDioneApi.checkStopOrders(params.symbol)
    }

    return newOrder
  },

  // Get user's positions
  getUserPositions: async (): Promise<Position[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...userPositions]
  },

  // Get user's orders
  getUserOrders: async (): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...userOrders]
  },

  // Cancel an order
  cancelOrder: async (orderId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const order = userOrders.find(o => o.id === orderId)
    if (order) {
      // Refund balance if it's an unfilled buy order
      if (order.status === 'open' && order.side === 'buy') {
        // Calculate refund based on trading type
        const fullOrderCost = order.quantity * order.price
        let refundAmount = fullOrderCost

        if (order.tradingType === 'leverage' && order.leverage && order.leverage > 1) {
          refundAmount = fullOrderCost / order.leverage
        } else if (order.tradingType === 'margin') {
          refundAmount = fullOrderCost / 2
        }

        const balance = await mockThemisApi.getUserBalance()
        await mockThemisApi.updateBalance('networth', balance.networth + refundAmount)
      }

      order.status = 'cancelled'
    }
  },

  // Fill an order (internal use for simulation)
  fillOrder: async (orderId: string): Promise<void> => {
    const order = userOrders.find(o => o.id === orderId)
    if (!order || order.status !== 'open') return

    order.status = 'filled'

    // Calculate values based on trading type
    const fullOrderValue = order.quantity * order.price
    let sellValue = fullOrderValue
    let marginUsed = fullOrderValue
    let borrowedAmount: number | undefined

    if (order.tradingType === 'leverage' && order.leverage && order.leverage > 1) {
      marginUsed = fullOrderValue / order.leverage
      // For sells, return full value (spot equivalent)
      sellValue = fullOrderValue
    } else if (order.tradingType === 'margin') {
      marginUsed = fullOrderValue / 2
      borrowedAmount = fullOrderValue / 2
      sellValue = fullOrderValue
    }

    // Update balance - for sell orders only (buy orders already deducted in placeOrder)
    const balance = await mockThemisApi.getUserBalance()

    if (order.side === 'sell') {
      // Selling: return margin + PnL (for leveraged) or full value (for spot)
      await mockThemisApi.updateBalance('networth', balance.networth + sellValue)
    }
    // Buy orders: balance already deducted in placeOrder, no need to deduct again

    // Create trade record
    const newTrade: Trade = {
      id: String(++tradeIdCounter),
      symbol: order.symbol,
      type: order.side,
      quantity: order.quantity,
      entryPrice: order.price,
      pnl: 0,
      status: 'open',
      timestamp: order.timestamp
    }
    userTrades.unshift(newTrade)

    // Update or create position
    const existingPosition = userPositions.find(p => p.symbol === order.symbol && p.tradingType === order.tradingType && p.leverage === order.leverage)

    if (existingPosition) {
      if (order.side === 'buy') {
        const totalCost = (existingPosition.quantity * existingPosition.avgPrice) + (order.quantity * order.price)
        existingPosition.quantity += order.quantity
        existingPosition.avgPrice = totalCost / existingPosition.quantity

        // Update margin and borrowed amount for leverage/margin
        if (existingPosition.marginUsed) {
          existingPosition.marginUsed += marginUsed
        }
        if (existingPosition.borrowedAmount && borrowedAmount) {
          existingPosition.borrowedAmount += borrowedAmount
        }

        // Recalculate liquidation price
        if (order.tradingType === 'leverage' && order.leverage && order.leverage > 1) {
          // Liquidation occurs when loss equals margin (100% loss)
          existingPosition.liquidationPrice = existingPosition.avgPrice * (1 - 1 / order.leverage)
        }
      } else {
        existingPosition.quantity -= order.quantity
        if (existingPosition.quantity <= 0) {
          userPositions = userPositions.filter(p => p.id !== existingPosition.id)
        }
      }
    } else if (order.side === 'buy') {
      // Calculate liquidation price for leveraged positions
      let liquidationPrice: number | undefined
      if (order.tradingType === 'leverage' && order.leverage && order.leverage > 1) {
        // For long position: liquidation when price drops by (1/leverage * 100)%
        liquidationPrice = order.price * (1 - 1 / order.leverage)
      }

      // Calculate intrinsic value for options
      let intrinsicValue: number | undefined
      if (order.tradingType === 'options' && order.strikePrice && order.optionType) {
        const currentPrice = mockDioneApi.getMarketPrice(order.symbol)
        intrinsicValue = calculateIntrinsicValue(currentPrice, order.strikePrice, order.optionType)
      }

      const newPosition: Position = {
        id: String(userPositions.length + 1),
        symbol: order.symbol,
        quantity: order.quantity,
        avgPrice: order.price,
        currentPrice: order.price,
        pnl: 0,
        pnlPercentage: 0,
        tradingType: order.tradingType,
        leverage: order.leverage,
        marginUsed: marginUsed,
        liquidationPrice: liquidationPrice,
        borrowedAmount: borrowedAmount,
        strikePrice: order.strikePrice,
        optionType: order.optionType,
        expirationDate: order.expirationDate,
        premium: order.premium,
        intrinsicValue: intrinsicValue
      }
      userPositions.push(newPosition)
    }
  },

  // Get order book for a symbol
  getOrderBook: async (symbol: string): Promise<{ bids: OrderBookEntry[], asks: OrderBookEntry[] }> => {
    await new Promise(resolve => setTimeout(resolve, 300))

    // Generate mock order book data
    const basePrice = 100 + Math.random() * 100
    const bids: OrderBookEntry[] = []
    const asks: OrderBookEntry[] = []

    for (let i = 0; i < 10; i++) {
      const bidPrice = basePrice - (i * 0.1)
      const askPrice = basePrice + (i * 0.1)
      const bidQty = Math.floor(Math.random() * 1000) + 100
      const askQty = Math.floor(Math.random() * 1000) + 100

      bids.push({
        price: Number(bidPrice.toFixed(2)),
        quantity: bidQty,
        total: Number((bidPrice * bidQty).toFixed(2))
      })

      asks.push({
        price: Number(askPrice.toFixed(2)),
        quantity: askQty,
        total: Number((askPrice * askQty).toFixed(2))
      })
    }

    return { bids, asks }
  },

  // Update position prices (simulate market movement)
  updatePositionPrices: (symbol: string, newPrice: number): void => {
    const position = userPositions.find(p => p.symbol === symbol)
    if (position) {
      position.currentPrice = newPrice

      // Handle options differently
      if (position.tradingType === 'options' && position.strikePrice && position.optionType && position.premium) {
        // Calculate intrinsic value
        position.intrinsicValue = calculateIntrinsicValue(newPrice, position.strikePrice, position.optionType)

        // PnL for options = (intrinsic value - premium paid) * quantity
        position.pnl = (position.intrinsicValue - position.premium) * position.quantity
        position.pnlPercentage = ((position.intrinsicValue - position.premium) / position.premium) * 100

        // Check for option expiration
        if (position.expirationDate) {
          const now = new Date().getTime()
          const expiration = new Date(position.expirationDate).getTime()

          if (now >= expiration) {
            // Option expired, auto-exercise if in the money
            if (position.intrinsicValue > 0) {
              mockDioneApi.exerciseOption(position.id)
            } else {
              // Option expired worthless, remove position
              userPositions = userPositions.filter(p => p.id !== position.id)
            }
          }
        }
      } else {
        // Calculate base PnL for non-options
        const basePnL = (newPrice - position.avgPrice) * position.quantity

        // Apply leverage multiplier to PnL
        if (position.tradingType === 'leverage' && position.leverage && position.leverage > 1) {
          position.pnl = basePnL * position.leverage
        } else {
          position.pnl = basePnL
        }

        position.pnlPercentage = ((newPrice - position.avgPrice) / position.avgPrice) * 100

        // Check for liquidation
        if (position.liquidationPrice && newPrice <= position.liquidationPrice) {
          // Auto-liquidate position
          mockDioneApi.liquidatePosition(position.id)
        }
      }
    }
  },

  // Liquidate a position (auto-triggered when price hits liquidation level)
  liquidatePosition: async (positionId: string): Promise<void> => {
    const position = userPositions.find(p => p.id === positionId)
    if (!position) return

    console.log(`Position ${positionId} liquidated at ${position.currentPrice}`)

    // For leveraged positions, user loses all margin
    // No balance refund - margin is lost

    // Remove position
    userPositions = userPositions.filter(p => p.id !== positionId)

    // Create a trade record for the liquidation
    const trade: Trade = {
      id: `liquidation-${Date.now()}`,
      symbol: position.symbol,
      type: 'sell',
      quantity: position.quantity,
      entryPrice: position.avgPrice,
      exitPrice: position.currentPrice,
      pnl: position.marginUsed ? -position.marginUsed : position.pnl, // Loss of entire margin
      status: 'closed',
      timestamp: new Date().toISOString()
    }
    userTrades.unshift(trade)
  },

  // Exercise an option (auto-triggered at expiration if in the money)
  exerciseOption: async (positionId: string): Promise<void> => {
    const position = userPositions.find(p => p.id === positionId)
    if (!position || position.tradingType !== 'options') return
    if (!position.strikePrice || !position.optionType || !position.intrinsicValue) return

    console.log(`Option ${positionId} exercised at ${position.currentPrice}`)

    const balance = await mockThemisApi.getUserBalance()

    // Calculate profit from exercising option
    // User receives intrinsic value per share * quantity
    const exerciseValue = position.intrinsicValue * position.quantity

    // Add exercise value to balance
    await mockThemisApi.updateBalance('networth', balance.networth + exerciseValue)

    // Remove option position
    userPositions = userPositions.filter(p => p.id !== positionId)

    // Create trade record for the exercise
    const trade: Trade = {
      id: `exercise-${Date.now()}`,
      symbol: position.symbol,
      type: 'sell',
      quantity: position.quantity,
      entryPrice: position.premium || 0,
      exitPrice: position.intrinsicValue,
      pnl: position.pnl,
      status: 'closed',
      timestamp: new Date().toISOString()
    }
    userTrades.unshift(trade)
  },

  // Modify an existing order
  modifyOrder: async (orderId: string, params: {
    type?: string
    quantity?: number
    price?: number
    stopPrice?: number
  }): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const order = userOrders.find(o => o.id === orderId)
    if (order && order.status === 'open') {
      // Calculate balance adjustment for buy orders
      if (order.side === 'buy') {
        const oldCost = order.quantity * order.price
        const newQuantity = params.quantity !== undefined ? params.quantity : order.quantity
        const newPrice = params.price !== undefined ? params.price : order.price
        const newCost = newQuantity * newPrice
        const costDifference = newCost - oldCost

        // Adjust balance based on cost change
        const balance = await mockThemisApi.getUserBalance()
        if (costDifference > 0) {
          // Order costs more, check if user has enough
          if (balance.networth < costDifference) {
            throw new Error('Insufficient balance for order modification')
          }
        }
        // If costDifference < 0, refund; if > 0, charge
        await mockThemisApi.updateBalance('networth', balance.networth - costDifference)
      }

      // Update order fields
      if (params.type) order.type = params.type as Order['type']
      if (params.quantity) order.quantity = params.quantity
      if (params.price) order.price = params.price
      if (params.stopPrice !== undefined) order.stopPrice = params.stopPrice

      // After modifying, check if order should execute immediately
      if (order.type === 'Limit') {
        await mockDioneApi.checkLimitOrders(order.symbol)
      } else if (order.type === 'Stop loss' || order.type === 'Stop limit') {
        await mockDioneApi.checkStopOrders(order.symbol)
      }
    }
  },

  // Close a position
  closePosition: async (positionId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500))

    // Find the position to close
    const position = userPositions.find(p => p.id === positionId)
    if (!position) return

    const balance = await mockThemisApi.getUserBalance()
    let returnValue = 0

    // Handle different trading types
    if (position.tradingType === 'leverage' && position.leverage && position.leverage > 1) {
      // For leveraged positions: return margin + leveraged PnL
      const basePnL = (position.currentPrice - position.avgPrice) * position.quantity
      const leveragedPnL = basePnL * position.leverage
      returnValue = (position.marginUsed || 0) + leveragedPnL
    } else if (position.tradingType === 'margin') {
      // For margin positions: return margin + PnL, minus borrowed amount
      const pnl = (position.currentPrice - position.avgPrice) * position.quantity
      returnValue = (position.marginUsed || 0) + pnl
    } else if (position.tradingType === 'options') {
      // For options: return intrinsic value
      returnValue = (position.intrinsicValue || 0) * position.quantity
    } else {
      // For spot positions: return full current value
      returnValue = position.currentPrice * position.quantity
    }

    // Update balance
    await mockThemisApi.updateBalance('networth', balance.networth + returnValue)

    // Create a trade record for the closed position
    const pnl = position.pnl
    const trade: Trade = {
      id: `trade-${Date.now()}`,
      symbol: position.symbol,
      type: 'sell', // Closing long position = selling
      quantity: position.quantity,
      entryPrice: position.avgPrice,
      exitPrice: position.currentPrice,
      pnl: pnl,
      status: 'closed',
      timestamp: new Date().toISOString()
    }
    userTrades.unshift(trade)

    // Remove position
    userPositions = userPositions.filter(p => p.id !== positionId)
  },

  // Get user balance (unified with Themis)
  getUserBalance: async () => {
    return mockThemisApi.getUserBalance()
  },

  // Get user trades
  getUserTrades: async (): Promise<Trade[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...userTrades]
  },

  // ============= MARKET DATA ENDPOINTS =============

  // Get all available markets/tokens
  getMarkets: async (): Promise<Token[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockTokens]
  },

  // Get market by symbol
  getMarketBySymbol: async (symbol: string): Promise<Token | null> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockTokens.find(t => t.symbol === symbol) || null
  },

  // Get OHLC candlestick data for a symbol
  getOHLCData: async (symbol: string, interval: TimeInterval): Promise<OHLCData[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return getCandlestickData(symbol, interval)
  }
}

// Re-export types for easier imports
export type { Token, OHLCData, TimeInterval }
