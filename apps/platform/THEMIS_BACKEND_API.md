# Themis Prediction Markets - Backend API Specification

## Overview
This document defines the REST API contract that the backend needs to implement for the Themis prediction markets platform.

## Base URL
- Development: `http://localhost:3000/api/v1`
- Production: `https://api.yourplatform.com/v1`

## Authentication
All endpoints require JWT Bearer token authentication:
```
Authorization: Bearer <jwt_token>
```

---

## 📋 API Endpoints

### 1. GET /markets
**Description:** Returns all 16 prediction markets

**Response Example:**
```json
[
  {
    "id": 1,
    "question": "Israel & Hamas ceasefire end?",
    "category": "politics",
    "type": "2-option",
    "yes": "63%",
    "no": "37%",
    "volume": "$842K",
    "closesAt": "2025-12-01T00:00:00Z",
    "imageUrl": "/themis/questions/themis-test.png"
  },
  {
    "id": 3,
    "question": "Who will President Trump Pardon in 2025?",
    "category": "politics",
    "type": "multi-option",
    "options": [
      {
        "id": 1,
        "name": "Hunter Biden",
        "percentage": "28%",
        "trend": "▲ 2%",
        "buyYesPrice": "28¢",
        "buyNoPrice": "72¢"
      },
      {
        "id": 2,
        "name": "January 6 defendants",
        "percentage": "22%",
        "trend": "▲ 1%",
        "buyYesPrice": "22¢",
        "buyNoPrice": "78¢"
      }
    ],
    "volume": "$2.8M",
    "closesAt": "2025-12-31T23:59:59Z"
  }
]
```

---

### 2. GET /markets/:id
**Description:** Get a single market by ID

**Path Parameters:**
- `id` (number): Market ID

**Response:** Same format as single market object from `/markets`

---

### 3. GET /markets/by-slug/:questionSlug
**Description:** Get market by URL-friendly question slug

**Path Parameters:**
- `questionSlug` (string): URL-friendly version of the question
  - Example: `israel-hamas-ceasefire-end`
  - Example: `who-will-president-trump-pardon-in-2025`

**Response:** Same format as single market object

**Note:** Convert questions to slugs by:
1. Converting to lowercase
2. Replacing non-alphanumeric characters with hyphens
3. Removing leading/trailing hyphens

---

### 4. GET /markets/:id/holders?outcome=optionName
**Description:** Get top holders for a market

**Path Parameters:**
- `id` (number): Market ID

**Query Parameters:**
- `outcome` (string, optional): For multi-option markets, filter by specific option name
  - For 2-option markets: omit this parameter
  - For multi-option markets: pass option name (e.g., "Hunter Biden")

**Response Example:**
```json
{
  "marketId": 3,
  "outcome": "Hunter Biden",
  "yes": [
    {
      "id": 1,
      "username": "politicalbet99",
      "shares": "1,124,973",
      "avatar": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      "id": 2,
      "username": "dcinsider",
      "shares": "831,793",
      "avatar": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    }
  ],
  "no": [
    {
      "id": 1,
      "username": "skeptic_analyst",
      "shares": "508,946",
      "avatar": "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
    }
  ]
}
```

---

### 5. GET /markets/:id/activity?outcome=optionName
**Description:** Get recent trading activity for a market

**Path Parameters:**
- `id` (number): Market ID

**Query Parameters:**
- `outcome` (string, optional): Filter by specific outcome/option name

**Response Example:**
```json
[
  {
    "id": 1,
    "username": "btcbull",
    "action": "bought",
    "amount": "1K Yes",
    "type": "yes",
    "outcome": "$110,000 - $125,000",
    "price": "45¢",
    "dollarValue": "$450",
    "timestamp": "30s ago",
    "avatar": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": 2,
    "username": "cryptotrader",
    "action": "sold",
    "amount": "500 No",
    "type": "no",
    "outcome": "$110,000 - $125,000",
    "price": "55¢",
    "dollarValue": "$275",
    "timestamp": "2m ago",
    "avatar": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  }
]
```

---

### 6. POST /trades
**Description:** Place a bet/trade on a market

**Request Body:**
```json
{
  "marketId": 3,
  "type": "buy",
  "outcome": "Hunter Biden",
  "amount": 100
}
```

**Response:**
```json
{
  "id": "123",
  "marketId": 3,
  "type": "buy",
  "outcome": "Hunter Biden",
  "amount": 100,
  "shares": 357,
  "price": 0.28,
  "timestamp": "2025-01-20T10:30:00Z"
}
```

---

### 7. GET /user/positions
**Description:** Get user's current open positions

**Response Example:**
```json
[
  {
    "id": "1",
    "marketId": 5,
    "outcome": "yes",
    "shares": 4200,
    "avgPrice": 0.58,
    "currentPrice": 0.58,
    "invested": 2436,
    "currentValue": 2436,
    "pnl": 0
  }
]
```

---

### 8. GET /user/balance
**Description:** Get user's balance

**Response Example:**
```json
{
  "networth": 10000,
  "influence": 8732,
  "resonance": 5921
}
```

---

### 9. GET /markets/:id/comments
**Description:** Get comments for a market

**Response Example:**
```json
[
  {
    "id": "1",
    "marketId": 1,
    "user": "edgarbird4420",
    "position": "1.5k No",
    "timestamp": "2025-01-20T08:00:00Z",
    "text": "this is free",
    "likes": 1,
    "isHolder": true
  }
]
```

---

### 10. POST /markets/:id/comments
**Description:** Add a comment to a market

**Request Body:**
```json
{
  "user": "Anonymous",
  "text": "Great market!",
  "position": "1K Yes",
  "isHolder": true
}
```

---

## 📊 Data Structure Reference

See TypeScript interfaces in: `apps/platform/src/services/mock/mockThemisApi.ts`

### Key Types:

#### Market
```typescript
{
  id: number
  question: string
  category: 'finance' | 'crypto' | 'economics' | 'politics'
  type: '2-option' | 'multi-option'
  yes?: string  // For 2-option markets
  no?: string   // For 2-option markets
  options?: MarketOption[]  // For multi-option markets
  volume: string
  closesAt?: string  // ISO 8601 date
  imageUrl?: string
}
```

#### MarketOption (for multi-option markets)
```typescript
{
  id?: number
  name: string  // e.g., "Hunter Biden"
  percentage: string  // e.g., "28%"
  trend?: string  // e.g., "▲ 2%" or "▼ 1%"
  volume?: string
  buyYesPrice?: string  // e.g., "28¢"
  buyNoPrice?: string  // e.g., "72¢"
}
```

#### Holder
```typescript
{
  id: number
  username: string
  shares: string  // Formatted with commas: "1,124,973"
  avatar: string  // CSS gradient or image URL
}
```

#### ActivityItem
```typescript
{
  id: number
  username: string
  action: 'bought' | 'sold'
  amount: string  // e.g., "1K Yes"
  type: 'yes' | 'no'
  outcome?: string  // For multi-option markets
  price: string  // e.g., "28¢"
  dollarValue: string  // e.g., "$140"
  timestamp: string  // Human-readable or ISO 8601
  avatar: string
}
```

---

## 🎯 Implementation Steps for Backend Developer

### Step 1: Study the Mock Data
1. Open `apps/platform/src/services/mock/mockThemisApi.ts`
2. Review all TypeScript interfaces
3. Examine the sample data to understand structure

### Step 2: Create REST Endpoints
Implement the 10 endpoints listed above matching the exact response format.

### Step 3: Test with Mock Data First
Before connecting to real database:
1. Return the mock data from your endpoints
2. Verify the frontend works with your API
3. Then connect to real database

### Step 4: Create Real API Implementation
Create `apps/platform/src/services/api/realThemisApi.ts`:

```typescript
import type { Market, Holder, ActivityItem, HoldersResponse, Comment, Trade, UserPosition } from '../mock/mockThemisApi'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1'

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
})

export const realThemisApi = {
  getMarkets: async (): Promise<Market[]> => {
    const response = await fetch(`${API_BASE}/markets`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch markets')
    return response.json()
  },

  getMarketByQuestionSlug: async (slug: string): Promise<Market | undefined> => {
    const response = await fetch(`${API_BASE}/markets/by-slug/${slug}`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) return undefined
    return response.json()
  },

  getHolders: async (marketId: number, optionName?: string): Promise<HoldersResponse> => {
    const url = optionName
      ? `${API_BASE}/markets/${marketId}/holders?outcome=${encodeURIComponent(optionName)}`
      : `${API_BASE}/markets/${marketId}/holders`
    const response = await fetch(url, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch holders')
    return response.json()
  },

  getActivity: async (marketId: number, outcomeFilter?: string): Promise<ActivityItem[]> => {
    const url = outcomeFilter
      ? `${API_BASE}/markets/${marketId}/activity?outcome=${encodeURIComponent(outcomeFilter)}`
      : `${API_BASE}/markets/${marketId}/activity`
    const response = await fetch(url, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch activity')
    return response.json()
  },

  placeBet: async (params: { marketId: number; type: 'buy' | 'sell'; outcome: string; amount: number }): Promise<Trade> => {
    const response = await fetch(`${API_BASE}/trades`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params)
    })
    if (!response.ok) throw new Error('Failed to place bet')
    return response.json()
  },

  getUserPositions: async (): Promise<UserPosition[]> => {
    const response = await fetch(`${API_BASE}/user/positions`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch positions')
    return response.json()
  },

  getUserBalance: async () => {
    const response = await fetch(`${API_BASE}/user/balance`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch balance')
    return response.json()
  },

  getComments: async (marketId: number): Promise<Comment[]> => {
    const response = await fetch(`${API_BASE}/markets/${marketId}/comments`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch comments')
    return response.json()
  },

  addComment: async (params: { marketId: number; user: string; text: string; position?: string; isHolder?: boolean }): Promise<Comment> => {
    const response = await fetch(`${API_BASE}/markets/${params.marketId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params)
    })
    if (!response.ok) throw new Error('Failed to add comment')
    return response.json()
  },

  // Add other methods as needed...
}
```

### Step 5: Switch to Real API (ONE LINE CHANGE!)
In `apps/platform/src/services/api/themisApi.ts`, change line 9:

```typescript
// FROM:
export const themisApi = mockThemisApi

// TO:
export const themisApi = realThemisApi
```

Done! The entire frontend will now use your real backend.

---

## 📝 Important Notes for Backend Developer

### Multi-Option Markets
For markets like "Who will President Trump Pardon in 2025?":
- `type: "multi-option"`
- The `options` array contains ALL possible outcomes
- Each option has its own percentage, pricing, etc.
- Holders and activity are filtered by option name

### Data Format Rules

#### Percentages
- **Always** include the % symbol: `"63%"` not `0.63`
- For prices use ¢ symbol: `"28¢"` not `0.28`

#### Volumes
- Format with $ and K/M suffix: `"$842K"`, `"$2.8M"`
- Use K for thousands, M for millions

#### Shares
- Format with commas: `"1,124,973"` not `1124973`

#### Timestamps
- ISO 8601 for machine dates: `"2025-12-01T00:00:00Z"`
- Human-readable for activity: `"30s ago"`, `"2m ago"`, `"3h ago"`

#### Avatars
- Can be CSS gradients: `"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"`
- Or image URLs: `"/avatars/user123.png"`

---

## 🧪 Testing Your Implementation

### Test Markets:
- **Market 1** (2-option): Israel & Hamas ceasefire
- **Market 3** (multi-option, 10 options): Trump Pardons
- **Market 5** (multi-option, 4 options): Bitcoin Price
- **Market 13** (2-option): S&P 500

### Test Cases:
1. Fetch all markets → should return 16 markets
2. Fetch market by slug `who-will-president-trump-pardon-in-2025`
3. Get holders for market 3, option "Hunter Biden"
4. Get activity for market 5, filtered by "$110,000 - $125,000"
5. Place a bet on market 1, outcome "yes", amount 100

---

## 🎯 Benefits of This Approach

### For You (Backend Developer):
- ✅ Clear TypeScript interfaces to follow
- ✅ Simple REST endpoints (standard patterns)
- ✅ Can test independently
- ✅ No need to understand React code

### For the Team:
- ✅ Frontend and backend can be developed in parallel
- ✅ Switch between mock/real with one line
- ✅ Type-safe contract prevents bugs

---

## 🆘 Support

If you have questions about:
- **Data structure**: See `mockThemisApi.ts` for examples
- **Expected responses**: See this document's examples
- **Frontend behavior**: Ask the frontend team
