// Mock Themis API for prediction markets

export interface MarketOption {
  id?: number
  name: string
  percentage: string
  trend?: string  // "▲ 2%" or "▼ 1%"
  volume?: string  // Option-specific volume
  buyYesPrice?: string  // Calculated from percentage
  buyNoPrice?: string
}

export interface Market {
  id: number
  question: string
  category: 'finance' | 'crypto' | 'economics' | 'politics'
  type: '2-option' | 'multi-option'
  yes?: string
  no?: string
  options?: MarketOption[]
  volume: string
  closesAt?: string  // ISO date
  imageUrl?: string
}

const mockMarkets: Market[] = [
  // ============= POLITICS (4) =============
  {
    id: 1,
    question: 'Israel & Hamas ceasefire end?',
    category: 'politics',
    type: '2-option',
    yes: '63%',
    no: '37%',
    volume: '$842K',
    closesAt: '2025-12-01T00:00:00Z',
    imageUrl: '/themis/questions/market-1.webp'
  },
  {
    id: 2,
    question: 'Russia & Ukraine ceasefire in 2025?',
    category: 'politics',
    type: '2-option',
    yes: '41%',
    no: '59%',
    volume: '$1.2M',
    closesAt: '2025-12-31T23:59:59Z',
    imageUrl: '/themis/questions/market-2.webp'
  },
  {
    id: 3,
    question: 'Who will President Trump Pardon in 2025?',
    category: 'politics',
    type: 'multi-option',
    options: [
      { id: 1, name: 'Hunter Biden', percentage: '28%', trend: '▲ 2%', buyYesPrice: '28¢', buyNoPrice: '72¢' },
      { id: 2, name: 'January 6 defendants', percentage: '22%', trend: '▲ 1%', buyYesPrice: '22¢', buyNoPrice: '78¢' },
      { id: 3, name: 'Sam Bankman-Fried', percentage: '15%', trend: '▼ 1%', buyYesPrice: '15¢', buyNoPrice: '85¢' },
      { id: 4, name: 'Ross Ulbricht (Silk Road)', percentage: '12%', buyYesPrice: '12¢', buyNoPrice: '88¢' },
      { id: 5, name: 'Changpeng Zhao (CZ)', percentage: '8%', buyYesPrice: '8¢', buyNoPrice: '92¢' },
      { id: 6, name: 'Rudy Giuliani', percentage: '5%', buyYesPrice: '5¢', buyNoPrice: '95¢' },
      { id: 7, name: 'Steve Bannon', percentage: '4%', buyYesPrice: '4¢', buyNoPrice: '96¢' },
      { id: 8, name: 'Edward Snowden', percentage: '3%', buyYesPrice: '3¢', buyNoPrice: '97¢' },
      { id: 9, name: 'Julian Assange', percentage: '2%', buyYesPrice: '2¢', buyNoPrice: '98¢' },
      { id: 10, name: 'None of the above', percentage: '1%', buyYesPrice: '1¢', buyNoPrice: '99¢' }
    ],
    volume: '$2.8M',
    closesAt: '2025-12-31T23:59:59Z',
    imageUrl: '/themis/questions/market-3.webp'
  },
  {
    id: 4,
    question: 'Will North Korea conduct a nuclear test by December 1, 2025?',
    category: 'politics',
    type: '2-option',
    yes: '34%',
    no: '66%',
    volume: '$567K',
    closesAt: '2025-12-01T00:00:00Z',
    imageUrl: '/themis/questions/market-4.webp'
  },

  // ============= CRYPTO (4) =============
  {
    id: 5,
    question: 'Bitcoin price on December 1st?',
    category: 'crypto',
    type: 'multi-option',
    options: [
      { id: 1, name: 'Below $110,000', percentage: '18%', trend: '▼ 2%', buyYesPrice: '18¢', buyNoPrice: '82¢' },
      { id: 2, name: '$110,000 - $125,000', percentage: '45%', trend: '▲ 3%', buyYesPrice: '45¢', buyNoPrice: '55¢' },
      { id: 3, name: '$125,000 - $140,000', percentage: '28%', trend: '▲ 1%', buyYesPrice: '28¢', buyNoPrice: '72¢' },
      { id: 4, name: 'Above $140,000', percentage: '9%', trend: '▼ 1%', buyYesPrice: '9¢', buyNoPrice: '91¢' }
    ],
    volume: '$3.4M',
    closesAt: '2025-12-01T00:00:00Z',
    imageUrl: '/themis/questions/market-5.webp'
  },
  {
    id: 6,
    question: 'XRP ETF approved by December?',
    category: 'crypto',
    type: '2-option',
    yes: '52%',
    no: '48%',
    volume: '$1.8M',
    closesAt: '2025-12-31T23:59:59Z',
    imageUrl: '/themis/questions/market-6.webp'
  },
  {
    id: 7,
    question: 'ETH reach ATH in 2025?',
    category: 'crypto',
    type: '2-option',
    yes: '67%',
    no: '33%',
    volume: '$2.1M',
    closesAt: '2025-12-31T23:59:59Z',
    imageUrl: '/themis/questions/market-7.webp'
  },
  {
    id: 8,
    question: 'Will Solana reach $200 by December 1, 2025?',
    category: 'crypto',
    type: '2-option',
    yes: '58%',
    no: '42%',
    volume: '$1.5M',
    closesAt: '2025-12-01T00:00:00Z',
    imageUrl: '/themis/questions/market-8.webp'
  },

  // ============= ECONOMICS (4) =============
  {
    id: 9,
    question: 'US November Inflation (Core PCE year-over-year)',
    category: 'economics',
    type: 'multi-option',
    options: [
      { id: 1, name: 'Below 2.0%', percentage: '22%', trend: '▲ 1%', buyYesPrice: '22¢', buyNoPrice: '78¢' },
      { id: 2, name: '2.0% - 2.5%', percentage: '48%', trend: '▲ 2%', buyYesPrice: '48¢', buyNoPrice: '52¢' },
      { id: 3, name: '2.5% - 3.0%', percentage: '24%', trend: '▼ 1%', buyYesPrice: '24¢', buyNoPrice: '76¢' },
      { id: 4, name: 'Above 3.0%', percentage: '6%', trend: '▼ 2%', buyYesPrice: '6¢', buyNoPrice: '94¢' }
    ],
    volume: '$1.9M',
    closesAt: '2025-11-30T23:59:59Z',
    imageUrl: '/themis/questions/market-9.webp'
  },
  {
    id: 10,
    question: 'US enter recession in 2025?',
    category: 'economics',
    type: '2-option',
    yes: '28%',
    no: '72%',
    volume: '$1.6M',
    closesAt: '2025-12-31T23:59:59Z',
    imageUrl: '/themis/questions/market-10.webp'
  },
  {
    id: 11,
    question: 'Fed rate cut in November?',
    category: 'economics',
    type: '2-option',
    yes: '64%',
    no: '36%',
    volume: '$2.3M',
    closesAt: '2025-11-07T00:00:00Z',
    imageUrl: '/themis/questions/market-11.webp'
  },
  {
    id: 12,
    question: 'US GDP growth in 2025?',
    category: 'economics',
    type: 'multi-option',
    options: [
      { id: 1, name: 'Below 1.5%', percentage: '15%', trend: '▼ 1%', buyYesPrice: '15¢', buyNoPrice: '85¢' },
      { id: 2, name: '1.5% - 2.0%', percentage: '38%', trend: '▲ 1%', buyYesPrice: '38¢', buyNoPrice: '62¢' },
      { id: 3, name: '2.0% - 2.5%', percentage: '35%', trend: '▲ 2%', buyYesPrice: '35¢', buyNoPrice: '65¢' },
      { id: 4, name: 'Above 2.5%', percentage: '12%', trend: '▼ 1%', buyYesPrice: '12¢', buyNoPrice: '88¢' }
    ],
    volume: '$1.4M',
    closesAt: '2025-12-31T23:59:59Z',
    imageUrl: '/themis/questions/market-12.webp'
  },

  // ============= FINANCE (4) =============
  {
    id: 13,
    question: 'S&P 500 close above 6,800 in November?',
    category: 'finance',
    type: '2-option',
    yes: '55%',
    no: '45%',
    volume: '$2.7M',
    closesAt: '2025-11-29T00:00:00Z',
    imageUrl: '/themis/questions/market-13.webp'
  },
  {
    id: 14,
    question: '10-year Treasury yield close at on November 29, 2025?',
    category: 'finance',
    type: 'multi-option',
    options: [
      { id: 1, name: 'Below 4.0%', percentage: '25%', trend: '▲ 1%', buyYesPrice: '25¢', buyNoPrice: '75¢' },
      { id: 2, name: '4.0% - 4.5%', percentage: '42%', trend: '▲ 2%', buyYesPrice: '42¢', buyNoPrice: '58¢' },
      { id: 3, name: '4.5% - 5.0%', percentage: '28%', trend: '▼ 1%', buyYesPrice: '28¢', buyNoPrice: '72¢' },
      { id: 4, name: 'Above 5.0%', percentage: '5%', trend: '▼ 2%', buyYesPrice: '5¢', buyNoPrice: '95¢' }
    ],
    volume: '$1.8M',
    closesAt: '2025-11-29T00:00:00Z',
    imageUrl: '/themis/questions/market-14.webp'
  },
  {
    id: 15,
    question: 'Gold price above $2,750 in December?',
    category: 'finance',
    type: '2-option',
    yes: '71%',
    no: '29%',
    volume: '$1.3M',
    closesAt: '2025-12-31T23:59:59Z',
    imageUrl: '/themis/questions/market-15.webp'
  },
  {
    id: 16,
    question: 'X hire a CEO?',
    category: 'finance',
    type: '2-option',
    yes: '38%',
    no: '62%',
    volume: '$920K',
    closesAt: '2025-12-31T23:59:59Z',
    imageUrl: '/themis/questions/market-16.webp'
  }
]

export interface UserPosition {
  id: string
  marketId: number
  outcome: 'yes' | 'no' | string
  shares: number
  avgPrice: number
  currentPrice: number
  invested: number
  currentValue: number
  pnl: number
}

export interface Trade {
  id: string
  marketId: number
  type: 'buy' | 'sell'
  outcome: 'yes' | 'no' | string
  amount: number
  shares: number
  price: number
  timestamp: string
}

export interface ResolvedPosition {
  id: string
  marketId: number
  outcome: 'yes' | 'no' | string
  invested: number
  payout: number
  profit: number
  profitPercentage: number
  resolvedAt: string
}

export interface Comment {
  id: string
  marketId: number
  user: string
  position: string
  timestamp: string
  text: string
  likes: number
  isHolder: boolean
}

export interface Holder {
  id: number
  username: string
  shares: string
  avatar: string
}

export interface ActivityItem {
  id: number
  username: string
  action: 'bought' | 'sold'
  amount: string
  type: 'yes' | 'no'
  outcome?: string  // For multi-option markets
  price: string
  dollarValue: string
  timestamp: string
  avatar: string
}

export interface HoldersResponse {
  marketId: number
  outcome?: string
  yes: Holder[]
  no: Holder[]
}

// In-memory storage with initial mock data
let userPositions: UserPosition[] = [
  {
    id: '1',
    marketId: 5, // Bitcoin reach $150K
    outcome: 'yes',
    shares: 4200,
    avgPrice: 0.58,
    currentPrice: 0.58,
    invested: 2436,
    currentValue: 2436,
    pnl: 0
  },
  {
    id: '2',
    marketId: 4, // Tesla stock hit $400
    outcome: 'no',
    shares: 700,
    avgPrice: 0.62,
    currentPrice: 0.62,
    invested: 434,
    currentValue: 434,
    pnl: 0
  },
  {
    id: '3',
    marketId: 1, // S&P 500 reach 6000
    outcome: 'yes',
    shares: 1500,
    avgPrice: 0.67,
    currentPrice: 0.67,
    invested: 1005,
    currentValue: 1005,
    pnl: 0
  }
]

let userTrades: Trade[] = [
  {
    id: '1',
    marketId: 5,
    type: 'buy',
    outcome: 'yes',
    amount: 4056,
    shares: 4200,
    price: 0.97,
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() // 18 hours ago
  },
  {
    id: '2',
    marketId: 5,
    type: 'buy',
    outcome: 'yes',
    amount: 670,
    shares: 700,
    price: 0.96,
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() // 18 hours ago
  },
  {
    id: '3',
    marketId: 5,
    type: 'buy',
    outcome: 'yes',
    amount: 1468,
    shares: 1500,
    price: 0.98,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: '4',
    marketId: 1,
    type: 'sell',
    outcome: 'yes',
    amount: 0.01,
    shares: 0,
    price: 0.86,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
]

let resolvedPositions: ResolvedPosition[] = [
  {
    id: '1',
    marketId: 2, // Will interest rates be cut in Q1 2025?
    outcome: 'no',
    invested: 5000,
    payout: 9100,
    profit: 4100,
    profitPercentage: 82,
    resolvedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
  },
  {
    id: '2',
    marketId: 8, // Will a Bitcoin ETF be approved in 2025?
    outcome: 'yes',
    invested: 3200,
    payout: 3776,
    profit: 576,
    profitPercentage: 18,
    resolvedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() // 45 days ago
  },
  {
    id: '3',
    marketId: 12, // Will unemployment rate stay below 4%?
    outcome: 'yes',
    invested: 2500,
    payout: 3472,
    profit: 972,
    profitPercentage: 38.88,
    resolvedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days ago
  }
]

let comments: Comment[] = [
  {
    id: '1',
    marketId: 1,
    user: 'edgarbird4420',
    position: '1.5k No',
    timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
    text: 'this is free',
    likes: 1,
    isHolder: true
  },
  {
    id: '2',
    marketId: 1,
    user: 'Patrick',
    position: '',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    text: 'the near-term delivery sentiment appears bullish, suggesting the potential for a revenue beat.',
    likes: 1,
    isHolder: false
  },
  {
    id: '3',
    marketId: 1,
    user: 'Orderly-Venture',
    position: '1.3K Yes',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    text: 'sold 29% more cars than last quarter why this is a question',
    likes: 0,
    isHolder: true
  }
]

let tradeIdCounter = 4
let positionIdCounter = 3
let commentIdCounter = 3

// Holders data - key format: "marketId" or "marketId_optionName" for multi-option
const holdersData: Record<string, HoldersResponse> = {
  // Market 1 - Israel & Hamas (2-option)
  '1': {
    marketId: 1,
    yes: [
      { id: 1, username: 'geopoliticswatcher', shares: '524,973', avatar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { id: 2, username: 'newsanalyst42', shares: '431,793', avatar: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
      { id: 3, username: 'worldaffairs', shares: '324,454', avatar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
      { id: 4, username: 'middleeastwatch', shares: '219,430', avatar: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
      { id: 5, username: 'politicaltrader', shares: '180,000', avatar: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
    ],
    no: [
      { id: 1, username: 'peacewatcher', shares: '708,946', avatar: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
      { id: 2, username: 'diplomatfollower', shares: '427,524', avatar: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
      { id: 3, username: 'optimist2025', shares: '223,282', avatar: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
      { id: 4, username: 'ceasefire_believer', shares: '150,000', avatar: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
      { id: 5, username: 'hope_trader', shares: '120,000', avatar: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)' }
    ]
  },
  // Market 3 - Trump Pardons - Hunter Biden option
  '3_Hunter Biden': {
    marketId: 3,
    outcome: 'Hunter Biden',
    yes: [
      { id: 1, username: 'politicalbet99', shares: '1,124,973', avatar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { id: 2, username: 'dcinsider', shares: '831,793', avatar: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
      { id: 3, username: 'trumpwatcher', shares: '624,454', avatar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
    ],
    no: [
      { id: 1, username: 'skeptic_analyst', shares: '508,946', avatar: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
      { id: 2, username: 'politicaldoubt', shares: '287,524', avatar: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
    ]
  },
  // Market 5 - Bitcoin Price - $110,000 - $125,000 option
  '5_$110,000 - $125,000': {
    marketId: 5,
    outcome: '$110,000 - $125,000',
    yes: [
      { id: 1, username: 'btcmaximalist', shares: '2,124,973', avatar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { id: 2, username: 'cryptowhale88', shares: '1,531,793', avatar: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
      { id: 3, username: 'hodlgang', shares: '924,454', avatar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
    ],
    no: [
      { id: 1, username: 'bearmarket2025', shares: '308,946', avatar: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
      { id: 2, username: 'btcskeptic', shares: '187,524', avatar: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
    ]
  },
  // Market 13 - S&P 500 (2-option)
  '13': {
    marketId: 13,
    yes: [
      { id: 1, username: 'wallstreetbull', shares: '1,674,973', avatar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { id: 2, username: 'sp500tracker', shares: '1,231,793', avatar: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
      { id: 3, username: 'indexfund_pro', shares: '824,454', avatar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
    ],
    no: [
      { id: 1, username: 'marketbear', shares: '908,946', avatar: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
      { id: 2, username: 'recession_watch', shares: '527,524', avatar: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
    ]
  }
}

// Activity data - key is marketId
const activityData: Record<number, ActivityItem[]> = {
  1: [  // Israel & Hamas
    { id: 1, username: 'newsreader42', action: 'bought', amount: '200 Yes', type: 'yes', price: '63¢', dollarValue: '$126', timestamp: '2m ago', avatar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 2, username: 'geopolitics101', action: 'sold', amount: '150 No', type: 'no', price: '37¢', dollarValue: '$55', timestamp: '5m ago', avatar: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 3, username: 'middleeast_watch', action: 'bought', amount: '500 Yes', type: 'yes', price: '63¢', dollarValue: '$315', timestamp: '12m ago', avatar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
  ],
  3: [  // Trump Pardons
    { id: 1, username: 'politicalbet', action: 'bought', amount: '500 Yes', type: 'yes', outcome: 'Hunter Biden', price: '28¢', dollarValue: '$140', timestamp: '1m ago', avatar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 2, username: 'dctrader', action: 'bought', amount: '300 Yes', type: 'yes', outcome: 'January 6 defendants', price: '22¢', dollarValue: '$66', timestamp: '3m ago', avatar: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 3, username: 'trumpwatcher2025', action: 'sold', amount: '200 No', type: 'no', outcome: 'Hunter Biden', price: '72¢', dollarValue: '$144', timestamp: '8m ago', avatar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
  ],
  5: [  // Bitcoin Price
    { id: 1, username: 'btcbull', action: 'bought', amount: '1K Yes', type: 'yes', outcome: '$110,000 - $125,000', price: '45¢', dollarValue: '$450', timestamp: '30s ago', avatar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 2, username: 'cryptotrader', action: 'sold', amount: '500 No', type: 'no', outcome: '$110,000 - $125,000', price: '55¢', dollarValue: '$275', timestamp: '2m ago', avatar: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 3, username: 'whale_btc', action: 'bought', amount: '2K Yes', type: 'yes', outcome: '$125,000 - $140,000', price: '28¢', dollarValue: '$560', timestamp: '5m ago', avatar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
  ],
  13: [  // S&P 500
    { id: 1, username: 'wallstreetbull', action: 'bought', amount: '800 Yes', type: 'yes', price: '55¢', dollarValue: '$440', timestamp: '1m ago', avatar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 2, username: 'indextrader', action: 'sold', amount: '300 No', type: 'no', price: '45¢', dollarValue: '$135', timestamp: '4m ago', avatar: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 3, username: 'sp500watcher', action: 'bought', amount: '1.2K Yes', type: 'yes', price: '55¢', dollarValue: '$660', timestamp: '10m ago', avatar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
  ]
}

// User balance tracking
let userBalance = {
  networth: 10000, // Starting balance for trading
  influence: 8732,
  resonance: 5921
}

export const mockThemisApi = {
  getMarkets: async (): Promise<Market[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockMarkets
  },

  getMarketById: async (id: number): Promise<Market | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockMarkets.find(m => m.id === id)
  },

  getMarketsByCategory: async (category: Market['category']): Promise<Market[]> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockMarkets.filter(m => m.category === category)
  },

  getMarketByQuestionSlug: async (questionSlug: string): Promise<Market | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    // Convert question to slug and match
    return mockMarkets.find(m => {
      const slug = m.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return slug === questionSlug
    })
  },

  placeBet: async (params: {
    marketId: number
    type: 'buy' | 'sell'
    outcome: 'yes' | 'no' | string
    amount: number
  }): Promise<Trade> => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const market = mockMarkets.find(m => m.id === params.marketId)
    if (!market) throw new Error('Market not found')

    // Check if user has enough balance for buy orders
    if (params.type === 'buy' && userBalance.networth < params.amount) {
      throw new Error('Insufficient balance')
    }

    // Calculate shares based on probability
    let probability = 0.5
    if (market.type === '2-option') {
      probability = parseInt(params.outcome === 'yes' ? market.yes || '50%' : market.no || '50%') / 100
    }

    const shares = Math.floor(params.amount / probability)

    const newTrade: Trade = {
      id: String(++tradeIdCounter),
      marketId: params.marketId,
      type: params.type,
      outcome: params.outcome,
      amount: params.amount,
      shares,
      price: probability,
      timestamp: new Date().toISOString()
    }

    userTrades.unshift(newTrade)

    // Update balance
    if (params.type === 'buy') {
      userBalance.networth -= params.amount
    } else {
      userBalance.networth += params.amount
    }

    // Update or create position
    if (params.type === 'buy') {
      const existingPosition = userPositions.find(
        p => p.marketId === params.marketId && p.outcome === params.outcome
      )

      if (existingPosition) {
        const totalInvested = existingPosition.invested + params.amount
        const totalShares = existingPosition.shares + shares
        existingPosition.shares = totalShares
        existingPosition.avgPrice = totalInvested / totalShares
        existingPosition.invested = totalInvested
        existingPosition.currentValue = totalShares * probability
        existingPosition.pnl = existingPosition.currentValue - totalInvested
      } else {
        const newPosition: UserPosition = {
          id: String(++positionIdCounter),
          marketId: params.marketId,
          outcome: params.outcome,
          shares,
          avgPrice: probability,
          currentPrice: probability,
          invested: params.amount,
          currentValue: shares * probability,
          pnl: 0
        }
        userPositions.push(newPosition)
      }
    } else {
      // Sell logic
      const existingPosition = userPositions.find(
        p => p.marketId === params.marketId && p.outcome === params.outcome
      )

      if (existingPosition) {
        existingPosition.shares -= shares
        existingPosition.currentValue = existingPosition.shares * probability
        existingPosition.pnl = existingPosition.currentValue - existingPosition.invested

        if (existingPosition.shares <= 0) {
          userPositions = userPositions.filter(p => p.id !== existingPosition.id)
        }
      }
    }

    return newTrade
  },

  getUserPositions: async (): Promise<UserPosition[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...userPositions]
  },

  getUserTrades: async (): Promise<Trade[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...userTrades]
  },

  getResolvedPositions: async (): Promise<ResolvedPosition[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...resolvedPositions]
  },

  getBiggestWin: async (): Promise<ResolvedPosition | null> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    if (resolvedPositions.length === 0) return null
    return resolvedPositions.reduce((max, pos) => pos.profit > max.profit ? pos : max)
  },

  getComments: async (marketId: number): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return comments.filter(c => c.marketId === marketId)
  },

  addComment: async (params: {
    marketId: number
    user: string
    text: string
    position?: string
    isHolder?: boolean
  }): Promise<Comment> => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const newComment: Comment = {
      id: String(++commentIdCounter),
      marketId: params.marketId,
      user: params.user,
      position: params.position || '',
      timestamp: new Date().toISOString(),
      text: params.text,
      likes: 0,
      isHolder: params.isHolder || false
    }

    comments.unshift(newComment)
    return newComment
  },

  getUserBalance: async (): Promise<typeof userBalance> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return { ...userBalance }
  },

  updateBalance: async (currency: 'networth' | 'influence' | 'resonance', newValue: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    userBalance[currency] = newValue
  },

  /**
   * Get holders for a market
   * For 2-option markets: just pass marketId
   * For multi-option markets: pass marketId and optionName to get holders for that specific option
   */
  getHolders: async (marketId: number, optionName?: string): Promise<HoldersResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const key = optionName ? `${marketId}_${optionName}` : String(marketId)
    const data = holdersData[key]

    if (!data) {
      // Return empty holders if not found
      return {
        marketId,
        outcome: optionName,
        yes: [],
        no: []
      }
    }

    return data
  },

  /**
   * Get recent activity for a market
   * Optional: filter by specific outcome for multi-option markets
   */
  getActivity: async (marketId: number, outcomeFilter?: string): Promise<ActivityItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const marketActivity = activityData[marketId] || []

    // If outcomeFilter provided (for multi-option markets), filter by outcome
    if (outcomeFilter && outcomeFilter !== 'All') {
      return marketActivity.filter(a => a.outcome === outcomeFilter)
    }

    return marketActivity
  }
}
