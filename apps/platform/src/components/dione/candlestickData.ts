// Mock candlestick data generator
// Format: [timestamp, open, close, low, high, volume]

type TimeInterval = '1D' | '1W' | '1M' | '3M' | 'YTD' | '1Y' | '5Y' | 'All'

const intervalToDays: Record<TimeInterval, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  'YTD': 365, // Simplified for now
  '1Y': 365,
  '5Y': 1825,
  'All': 3650
}

const generateCandlestickData = (basePrice: number, days: number = 60) => {
  const data: [string, number, number, number, number, number][] = []
  let currentPrice = basePrice

  const now = new Date()
  now.setHours(0, 0, 0, 0) // Reset to start of day

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Format as YYYY-MM-DD for lightweight-charts (better compatibility)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    // Generate realistic OHLC data
    const open = currentPrice
    const changePercent = (Math.random() - 0.5) * 0.05 // ±2.5% daily change
    const close = open * (1 + changePercent)
    const high = Math.max(open, close) * (1 + Math.random() * 0.02)
    const low = Math.min(open, close) * (1 - Math.random() * 0.02)
    const volume = Math.random() * 100000000 + 50000000

    data.push([dateStr, open, close, low, high, volume])
    currentPrice = close
  }

  return data
}

// Base prices for common tokens
const basePrices: Record<string, number> = {
  'BTC': 95000,
  'ETH': 3500,
  'SOL': 180,
  'AVAX': 42,
  'MATIC': 0.95,
  'LINK': 22,
  'NVDA': 195,
  'AAPL': 225,
  'TSLA': 390,
  'MSFT': 380,
  'GOOGL': 175,
  'AMZN': 210,
}

export const getCandlestickData = (symbol: string, interval: TimeInterval = '1M') => {
  const basePrice = basePrices[symbol] || 100
  const days = intervalToDays[interval]

  // Generate data based on the interval
  return generateCandlestickData(basePrice, days)
}

export const getLatestOHLC = (symbol: string, interval: TimeInterval = '1M') => {
  const data = getCandlestickData(symbol, interval)
  const latest = data[data.length - 1]

  if (!latest) {
    return { open: 0, high: 0, low: 0, close: 0, volume: 0 }
  }

  return {
    open: latest[1],
    close: latest[2],
    low: latest[3],
    high: latest[4],
    volume: latest[5]
  }
}
