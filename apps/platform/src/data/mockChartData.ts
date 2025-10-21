// Mock data for price history charts and order books

export interface PricePoint {
  timestamp: string
  price: number
}

export interface OrderBookEntry {
  price: number
  shares: number
  total: number
}

export interface OrderBookData {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  lastPrice: number
  spread: number
}

// Generate realistic price history data
const generatePriceHistory = (basePrice: number, points: number = 100): PricePoint[] => {
  const data: PricePoint[] = []
  const now = Date.now()
  let currentPrice = basePrice

  for (let i = points; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000).toISOString() // Hourly data
    const change = (Math.random() - 0.5) * 0.02 // ±2% change
    currentPrice = Math.max(0.01, Math.min(0.99, currentPrice * (1 + change)))
    data.push({ timestamp, price: currentPrice })
  }

  return data
}

// Mock price history for binary markets (Yes/No)
export const mockBinaryPriceHistory = {
  yes: generatePriceHistory(0.76),
  no: generatePriceHistory(0.24)
}

// Mock price history for multi-option markets
export const mockMultiOptionPriceHistory = {
  'Zohran Mamdani': generatePriceHistory(0.87),
  'Andrew Cuomo': generatePriceHistory(0.13),
  'Curtis Sliwa': generatePriceHistory(0.005),
  'Eric Adams': generatePriceHistory(0.001)
}

// Mock order book data
export const mockOrderBook: OrderBookData = {
  bids: [
    { price: 0.59, shares: 764.94, total: 451.31 },
    { price: 0.58, shares: 7288.02, total: 4678.36 },
    { price: 0.57, shares: 4012.70, total: 6965.60 },
    { price: 0.56, shares: 4838.00, total: 9674.88 },
    { price: 0.55, shares: 3200.00, total: 11474.88 },
    { price: 0.54, shares: 2100.00, total: 12608.88 }
  ],
  asks: [
    { price: 0.63, shares: 3493.00, total: 11791.54 },
    { price: 0.62, shares: 7574.03, total: 9590.95 },
    { price: 0.61, shares: 2950.00, total: 4895.05 },
    { price: 0.60, shares: 5159.25, total: 3095.55 },
    { price: 0.59, shares: 4500.00, total: 2655.00 },
    { price: 0.58, shares: 2800.00, total: 1624.00 }
  ],
  lastPrice: 0.59,
  spread: 0.01
}
