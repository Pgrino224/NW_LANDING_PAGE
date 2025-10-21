// Dione API - currently using mock implementation
// Switch to real API by importing from real implementation instead of mock

import {
  mockDioneApi,
  type Position,
  type Order,
  type OrderBookEntry,
  type Trade,
  type Token,
  type OHLCData,
  type TimeInterval
} from '../mock/mockDioneApi'

// Re-export types
export type { Position, Order, OrderBookEntry, Trade, Token, OHLCData, TimeInterval }

// Export mock API as default API for now
export const dioneApi = mockDioneApi

// When ready for real API, replace with:
// import { realDioneApi } from './realDioneApi'
// export const dioneApi = realDioneApi
