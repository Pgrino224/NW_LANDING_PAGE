# Dione Backend API Specification

This document specifies the API contract for the Dione trading platform. The backend must implement all endpoints described below to enable seamless integration with the frontend.

## Table of Contents
1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [TypeScript Interfaces](#typescript-interfaces)
4. [Data Format Requirements](#data-format-requirements)
5. [Implementation Guide](#implementation-guide)
6. [Testing](#testing)

---

## Overview

The Dione platform requires a backend API to provide:
- Market data (tokens/assets across indices, stocks, ETFs, crypto, commodities)
- Historical OHLC candlestick data
- Trading functionality (orders, positions, trades)
- Order book data
- User balance management

The frontend is already configured to consume this API through a unified interface. Once the real API is implemented, switching from mock to production requires **changing only one line** in `/src/services/api/dioneApi.ts`.

---

## API Endpoints

### 1. Get All Markets
**Endpoint:** `GET /api/dione/markets`

**Description:** Returns all available tradable tokens/assets

**Response:**
```json
[
  {
    "symbol": "BTCUSDT",
    "name": "Bitcoin",
    "price": 67432.10,
    "change": 1242.51,
    "changePercent": 1.88,
    "category": "crypto",
    "exchange": "BINANCE",
    "iconColor": "#F7931A",
    "description": "Bitcoin is a decentralized digital currency..."
  },
  {
    "symbol": "AAPL",
    "name": "Apple Inc",
    "price": 256.69,
    "change": -1.33,
    "changePercent": -0.52,
    "category": "stocks",
    "exchange": "NASDAQ",
    "iconColor": "#000000",
    "description": "Apple Inc. designs, manufactures..."
  }
]
```

**TypeScript Interface:**
```typescript
interface Token {
  symbol: string
  name: string
  price: number
  change: number  // Absolute price change
  changePercent: number  // Percentage change
  category: 'indices' | 'stocks' | 'etfs' | 'crypto' | 'commodities'
  exchange?: string
  iconColor?: string  // Hex color for UI theming
  description?: string
  news?: string  // Optional breaking news headline
}
```

---

### 2. Get Market by Symbol
**Endpoint:** `GET /api/dione/markets/:symbol`

**Description:** Returns detailed information for a specific token

**Example:** `GET /api/dione/markets/BTCUSDT`

**Response:** Same as single Token object from above

**Error Response (404):**
```json
{
  "error": "Market not found",
  "symbol": "INVALID"
}
```

---

### 3. Get OHLC Data
**Endpoint:** `GET /api/dione/markets/:symbol/ohlc`

**Query Parameters:**
- `interval`: `1D | 1W | 1M | 3M | YTD | 1Y | 5Y | All` (required)

**Example:** `GET /api/dione/markets/BTCUSDT/ohlc?interval=1M`

**Description:** Returns historical candlestick data for charting

**Response:**
```json
[
  {
    "time": "2025-09-20",
    "open": 67000.00,
    "high": 67800.00,
    "low": 66500.00,
    "close": 67432.10,
    "volume": 123456789.50
  },
  {
    "time": "2025-09-21",
    "open": 67432.10,
    "high": 68200.00,
    "low": 67100.00,
    "close": 67890.50,
    "volume": 98765432.10
  }
]
```

**TypeScript Interface:**
```typescript
interface OHLCData {
  time: string  // YYYY-MM-DD format
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type TimeInterval = '1D' | '1W' | '1M' | '3M' | 'YTD' | '1Y' | '5Y' | 'All'
```

**Data Requirements:**
- `time` must be in `YYYY-MM-DD` format
- Data points should be in chronological order (oldest first)
- Number of data points depends on interval:
  - `1D`: ~24 hourly candles
  - `1W`: ~7 daily candles
  - `1M`: ~30 daily candles
  - `3M`: ~90 daily candles
  - `1Y`: ~365 daily candles
  - `5Y`: ~1825 daily candles

---

### 4. Place Order
**Endpoint:** `POST /api/dione/orders`

**Description:** Create a new trading order

**Request Body:**
```json
{
  "symbol": "BTCUSDT",
  "type": "Limit",
  "side": "buy",
  "quantity": 0.5,
  "price": 67000.00,
  "stopPrice": null,
  "tradingType": "spot",
  "leverage": null
}
```

**Response:**
```json
{
  "id": "order_12345",
  "symbol": "BTCUSDT",
  "type": "Limit",
  "side": "buy",
  "quantity": 0.5,
  "price": 67000.00,
  "stopPrice": null,
  "status": "open",
  "tradingType": "spot",
  "leverage": null,
  "timestamp": "2025-10-20T14:30:00Z"
}
```

**TypeScript Interface:**
```typescript
interface Order {
  id: string
  symbol: string
  type: 'Limit' | 'Market' | 'Stop loss' | 'Stop limit'
  side: 'buy' | 'sell'
  quantity: number
  price: number
  stopPrice?: number
  status: 'open' | 'filled' | 'cancelled' | 'triggered'
  tradingType: 'spot' | 'margin' | 'leverage' | 'options'
  leverage?: number
  strikePrice?: number
  optionType?: 'call' | 'put'
  expirationDate?: string
  premium?: number
  timestamp: string
}
```

---

### 5. Get User Orders
**Endpoint:** `GET /api/dione/orders`

**Description:** Returns all user orders (open, filled, cancelled)

**Response:** Array of Order objects (see interface above)

---

### 6. Cancel Order
**Endpoint:** `DELETE /api/dione/orders/:orderId`

**Description:** Cancel an open order

**Response:**
```json
{
  "success": true,
  "orderId": "order_12345",
  "message": "Order cancelled successfully"
}
```

---

### 7. Modify Order
**Endpoint:** `PATCH /api/dione/orders/:orderId`

**Description:** Modify an existing open order

**Request Body (partial update):**
```json
{
  "quantity": 1.0,
  "price": 66500.00
}
```

**Response:** Updated Order object

---

### 8. Get User Positions
**Endpoint:** `GET /api/dione/positions`

**Description:** Returns all active positions

**Response:**
```json
[
  {
    "id": "pos_1",
    "symbol": "BTCUSDT",
    "quantity": 0.5,
    "avgPrice": 65000.00,
    "currentPrice": 67432.10,
    "pnl": 1216.05,
    "pnlPercentage": 3.73,
    "tradingType": "spot",
    "leverage": null,
    "marginUsed": null,
    "liquidationPrice": null
  }
]
```

**TypeScript Interface:**
```typescript
interface Position {
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
  borrowedAmount?: number
  strikePrice?: number
  optionType?: 'call' | 'put'
  expirationDate?: string
  premium?: number
  intrinsicValue?: number
}
```

---

### 9. Close Position
**Endpoint:** `POST /api/dione/positions/:positionId/close`

**Description:** Close an active position at current market price

**Response:**
```json
{
  "success": true,
  "positionId": "pos_1",
  "closedTrade": {
    "id": "trade_567",
    "symbol": "BTCUSDT",
    "type": "sell",
    "quantity": 0.5,
    "entryPrice": 65000.00,
    "exitPrice": 67432.10,
    "pnl": 1216.05,
    "status": "closed",
    "timestamp": "2025-10-20T14:35:00Z",
    "tradingType": "spot",
    "assetType": "crypto"
  }
}
```

---

### 10. Get User Trades
**Endpoint:** `GET /api/dione/trades`

**Description:** Returns trade history (closed positions)

**Response:**
```json
[
  {
    "id": "trade_567",
    "symbol": "BTCUSDT",
    "name": "Bitcoin",
    "type": "buy",
    "quantity": 0.5,
    "entryPrice": 65000.00,
    "exitPrice": 67432.10,
    "pnl": 1216.05,
    "status": "closed",
    "timestamp": "2025-10-20T14:35:00Z",
    "tradingType": "spot",
    "assetType": "crypto"
  }
]
```

**TypeScript Interface:**
```typescript
interface Trade {
  id: string
  symbol: string
  name: string
  type: 'buy' | 'sell'
  quantity: number
  entryPrice: number
  exitPrice?: number
  pnl: number
  status: 'open' | 'closed'
  timestamp: string
  tradingType: 'spot' | 'margin' | 'futures' | 'options'
  assetType: 'crypto' | 'index' | 'commodity' | 'etf' | 'stock'
}
```

---

### 11. Get Order Book
**Endpoint:** `GET /api/dione/markets/:symbol/orderbook`

**Description:** Returns current order book (bids and asks)

**Response:**
```json
{
  "bids": [
    {"price": 67400.00, "quantity": 0.5, "total": 33700.00},
    {"price": 67390.00, "quantity": 1.2, "total": 80868.00}
  ],
  "asks": [
    {"price": 67450.00, "quantity": 0.8, "total": 53960.00},
    {"price": 67460.00, "quantity": 1.5, "total": 101190.00}
  ]
}
```

**TypeScript Interface:**
```typescript
interface OrderBookEntry {
  price: number
  quantity: number
  total: number  // price * quantity
}
```

---

### 12. Get User Balance
**Endpoint:** `GET /api/dione/balance`

**Description:** Returns user's current balance (unified with Themis)

**Response:**
```json
{
  "networth": 125000.50,
  "influence": 8500.25,
  "resonance": 4200.75
}
```

**Note:** Balance is shared across Themis and Dione platforms. Dione trades affect Networth balance.

---

## TypeScript Interfaces

Complete TypeScript interface file to be used by backend:

```typescript
// Token/Market Data
export interface Token {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  category: 'indices' | 'stocks' | 'etfs' | 'crypto' | 'commodities'
  exchange?: string
  iconColor?: string
  description?: string
  news?: string
}

// OHLC Data
export interface OHLCData {
  time: string  // YYYY-MM-DD
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type TimeInterval = '1D' | '1W' | '1M' | '3M' | 'YTD' | '1Y' | '5Y' | 'All'

// Trading
export interface Order {
  id: string
  symbol: string
  type: 'Limit' | 'Market' | 'Stop loss' | 'Stop limit'
  side: 'buy' | 'sell'
  quantity: number
  price: number
  stopPrice?: number
  status: 'open' | 'filled' | 'cancelled' | 'triggered'
  tradingType: 'spot' | 'margin' | 'leverage' | 'options'
  leverage?: number
  strikePrice?: number
  optionType?: 'call' | 'put'
  expirationDate?: string
  premium?: number
  timestamp: string
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
  borrowedAmount?: number
  strikePrice?: number
  optionType?: 'call' | 'put'
  expirationDate?: string
  premium?: number
  intrinsicValue?: number
}

export interface Trade {
  id: string
  symbol: string
  name: string
  type: 'buy' | 'sell'
  quantity: number
  entryPrice: number
  exitPrice?: number
  pnl: number
  status: 'open' | 'closed'
  timestamp: string
  tradingType: 'spot' | 'margin' | 'futures' | 'options'
  assetType: 'crypto' | 'index' | 'commodity' | 'etf' | 'stock'
}

export interface OrderBookEntry {
  price: number
  quantity: number
  total: number
}
```

---

## Data Format Requirements

### Numbers
- **Prices**: Float with appropriate precision (e.g., BTC: 67432.10, stocks: 256.69)
- **Percentages**: Float (e.g., 1.88 for 1.88%, NOT "1.88%")
- **Volume**: Integer or large float

### Timestamps
- ISO 8601 format: `2025-10-20T14:30:00Z`
- Include timezone (Z for UTC recommended)

### Symbols
- Use standard exchange symbols
- Crypto: Append quote currency (e.g., `BTCUSDT`, `ETHUSDT`)
- Stocks: Use ticker (e.g., `AAPL`, `TSLA`)

### Categories
Must be one of: `indices`, `stocks`, `etfs`, `crypto`, `commodities`

---

## Implementation Guide

### Step 1: Create realDioneApi.ts

Create file at: `/apps/platform/src/services/api/realDioneApi.ts`

```typescript
import type {
  Token,
  OHLCData,
  TimeInterval,
  Order,
  Position,
  Trade,
  OrderBookEntry
} from '../mock/mockDioneApi'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.yourbackend.com'

export const realDioneApi = {
  // Market data
  getMarkets: async (): Promise<Token[]> => {
    const response = await fetch(`${API_BASE_URL}/api/dione/markets`)
    if (!response.ok) throw new Error('Failed to fetch markets')
    return response.json()
  },

  getMarketBySymbol: async (symbol: string): Promise<Token | null> => {
    const response = await fetch(`${API_BASE_URL}/api/dione/markets/${symbol}`)
    if (response.status === 404) return null
    if (!response.ok) throw new Error('Failed to fetch market')
    return response.json()
  },

  getOHLCData: async (symbol: string, interval: TimeInterval): Promise<OHLCData[]> => {
    const response = await fetch(
      `${API_BASE_URL}/api/dione/markets/${symbol}/ohlc?interval=${interval}`
    )
    if (!response.ok) throw new Error('Failed to fetch OHLC data')
    return response.json()
  },

  // Trading
  placeOrder: async (params: any): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/api/dione/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    if (!response.ok) throw new Error('Failed to place order')
    return response.json()
  },

  getUserOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/api/dione/orders`)
    if (!response.ok) throw new Error('Failed to fetch orders')
    return response.json()
  },

  cancelOrder: async (orderId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/dione/orders/${orderId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to cancel order')
  },

  modifyOrder: async (orderId: string, params: any): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/dione/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    if (!response.ok) throw new Error('Failed to modify order')
  },

  getUserPositions: async (): Promise<Position[]> => {
    const response = await fetch(`${API_BASE_URL}/api/dione/positions`)
    if (!response.ok) throw new Error('Failed to fetch positions')
    return response.json()
  },

  closePosition: async (positionId: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/api/dione/positions/${positionId}/close`,
      { method: 'POST' }
    )
    if (!response.ok) throw new Error('Failed to close position')
  },

  getUserTrades: async (): Promise<Trade[]> => {
    const response = await fetch(`${API_BASE_URL}/api/dione/trades`)
    if (!response.ok) throw new Error('Failed to fetch trades')
    return response.json()
  },

  getOrderBook: async (symbol: string): Promise<{ bids: OrderBookEntry[], asks: OrderBookEntry[] }> => {
    const response = await fetch(`${API_BASE_URL}/api/dione/markets/${symbol}/orderbook`)
    if (!response.ok) throw new Error('Failed to fetch order book')
    return response.json()
  },

  getUserBalance: async () => {
    const response = await fetch(`${API_BASE_URL}/api/dione/balance`)
    if (!response.ok) throw new Error('Failed to fetch balance')
    return response.json()
  },

  // Additional methods from mockDioneApi (market price updates, etc.)
  // Implement as needed based on backend capabilities
  getMarketPrice: (symbol: string): number => {
    throw new Error('Real-time price fetching not implemented')
  },

  updateMarketPrice: (symbol: string, newPrice: number): void => {
    throw new Error('Price updates handled by backend')
  },

  // These are internal mock methods - not needed in real API
  checkLimitOrders: async (symbol: string): Promise<void> => {},
  checkStopOrders: async (symbol: string): Promise<void> => {},
  fillOrder: async (orderId: string): Promise<void> => {},
  updatePositionPrices: (symbol: string, newPrice: number): void => {},
  liquidatePosition: async (positionId: string): Promise<void> => {},
  exerciseOption: async (positionId: string): Promise<void> => {}
}
```

### Step 2: Switch to Real API

In `/apps/platform/src/services/api/dioneApi.ts`, change ONE line:

**FROM:**
```typescript
export const dioneApi = mockDioneApi
```

**TO:**
```typescript
import { realDioneApi } from './realDioneApi'
export const dioneApi = realDioneApi
```

**That's it!** The entire frontend will now use the real backend API.

---

## Testing

### Manual Testing Checklist

1. **Markets Load:**
   - Navigate to Dione page
   - Verify tokens appear in watchlist
   - Check symbol selector shows all tokens

2. **Charts Display:**
   - Select different tokens in DEX Trading
   - Change time intervals (1D, 1W, 1M, etc.)
   - Verify candlestick data loads

3. **Trading Flow:**
   - Place buy/sell orders
   - Verify orders appear in Orders & Positions widget
   - Cancel an order
   - Modify an order

4. **Positions:**
   - Filled orders create positions
   - Positions show correct PnL
   - Close position works

5. **Portfolio Dashboard:**
   - Verify positions display
   - Check trade history
   - Confirm balance updates

### API Testing Tools

**Test with cURL:**
```bash
# Get markets
curl https://api.yourbackend.com/api/dione/markets

# Get OHLC data
curl "https://api.yourbackend.com/api/dione/markets/BTCUSDT/ohlc?interval=1M"

# Place order
curl -X POST https://api.yourbackend.com/api/dione/orders \
  -H "Content-Type: application/json" \
  -d '{"symbol":"BTCUSDT","type":"Market","side":"buy","quantity":0.1,"price":67000,"tradingType":"spot"}'
```

---

## Notes

- Frontend expects all API methods to return Promises
- Error handling: Throw errors with descriptive messages
- Authentication: Add JWT/session tokens as needed (not included in this spec)
- Rate limiting: Implement as needed on backend
- WebSocket support: Consider for real-time price updates (future enhancement)

---

## Questions?

Contact: [Your backend team contact info]

Repository: `/apps/platform/src/services/api/dioneApi.ts`

Mock Implementation Reference: `/apps/platform/src/services/mock/mockDioneApi.ts`
