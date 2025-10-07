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

export const mockTokens: Token[] = [
  // INDICES
  {
    symbol: 'SPX',
    name: 'S&P 500',
    price: 6740.29,
    change: 24.51,
    changePercent: 0.36,
    category: 'indices',
    exchange: 'INDEX',
    iconColor: '#FF6B6B',
    description: 'The S&P 500 is a stock market index tracking the performance of 500 large companies listed on stock exchanges in the United States.'
  },
  {
    symbol: 'NDQ',
    name: 'Nasdaq 100',
    price: 24978.56,
    change: 193.04,
    changePercent: 0.78,
    category: 'indices',
    exchange: 'INDEX',
    iconColor: '#4ECDC4',
    description: 'The NASDAQ-100 is a stock market index of 100 of the largest non-financial companies listed on the Nasdaq stock exchange.'
  },
  {
    symbol: 'DJI',
    name: 'Dow Jones',
    price: 46694.97,
    change: -63.31,
    changePercent: -0.14,
    category: 'indices',
    exchange: 'INDEX',
    iconColor: '#45B7D1',
    description: 'The Dow Jones Industrial Average is a stock market index of 30 prominent companies listed on stock exchanges in the United States.'
  },

  // STOCKS
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    price: 256.69,
    change: -1.33,
    changePercent: -0.52,
    category: 'stocks',
    exchange: 'NASDAQ',
    iconColor: '#000000',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    news: 'On October 2, 2025, Apple CEO Tim Cook sold 129,963 shares for about $33.38 million, reducing his holdings by 3.81%.'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    price: 453.25,
    change: 23.42,
    changePercent: 5.45,
    category: 'stocks',
    exchange: 'NASDAQ',
    iconColor: '#E82127',
    description: 'Tesla, Inc. designs, develops, manufactures, and sells electric vehicles, and energy generation and storage systems.'
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc',
    price: 1163.31,
    change: 9.99,
    changePercent: 0.87,
    category: 'stocks',
    exchange: 'NASDAQ',
    iconColor: '#E50914',
    description: 'Netflix, Inc. provides entertainment services with TV series, documentaries, feature films, and mobile games across various genres and languages.'
  },

  // CRYPTO
  {
    symbol: 'BTCUSDT',
    name: 'Bitcoin',
    price: 67432.10,
    change: 1242.51,
    changePercent: 1.88,
    category: 'crypto',
    exchange: 'BINANCE',
    iconColor: '#F7931A',
    description: 'Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network.'
  },
  {
    symbol: 'ETHUSDT',
    name: 'Ethereum',
    price: 3521.45,
    change: -67.32,
    changePercent: -1.88,
    category: 'crypto',
    exchange: 'BINANCE',
    iconColor: '#627EEA',
    description: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality.'
  },
  {
    symbol: 'SOLUSDT',
    name: 'Solana',
    price: 234.63,
    change: 6.07,
    changePercent: 2.66,
    category: 'crypto',
    exchange: 'BINANCE',
    iconColor: '#14F195',
    description: 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale.'
  },
  {
    symbol: 'ADAUSDT',
    name: 'Cardano',
    price: 0.58,
    change: 0.03,
    changePercent: 5.45,
    category: 'crypto',
    exchange: 'BINANCE',
    iconColor: '#0033AD',
    description: 'Cardano is a proof-of-stake blockchain platform that aims to enable changemakers, innovators, and visionaries.'
  },

  // ETFs
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    price: 567.23,
    change: 2.34,
    changePercent: 0.41,
    category: 'etfs',
    exchange: 'NYSE',
    iconColor: '#1E88E5',
    description: 'The SPDR S&P 500 ETF Trust seeks to provide investment results that correspond to the price and yield performance of the S&P 500 Index.'
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    price: 489.12,
    change: 3.87,
    changePercent: 0.80,
    category: 'etfs',
    exchange: 'NASDAQ',
    iconColor: '#43A047',
    description: 'The Invesco QQQ Trust is an exchange-traded fund based on the Nasdaq-100 Index.'
  },

  // COMMODITIES
  {
    symbol: 'GOLD',
    name: 'Gold',
    price: 3963.90,
    change: 4.63,
    changePercent: 0.12,
    category: 'commodities',
    exchange: 'COMEX',
    iconColor: '#FFD700',
    description: 'Gold is a chemical element with the symbol Au and atomic number 79, making it one of the higher atomic number elements that occur naturally.'
  },
  {
    symbol: 'USOIL',
    name: 'Crude Oil WTI',
    price: 61.68,
    change: -0.03,
    changePercent: -0.05,
    category: 'commodities',
    exchange: 'NYMEX',
    iconColor: '#212121',
    description: 'West Texas Intermediate (WTI) crude oil is a specific grade of crude oil and one of the main three benchmarks in oil pricing.'
  },
  {
    symbol: 'SILVER',
    name: 'Silver',
    price: 48.44,
    change: -0.05,
    changePercent: -0.10,
    category: 'commodities',
    exchange: 'COMEX',
    iconColor: '#C0C0C0',
    description: 'Silver is a chemical element with the symbol Ag and has been valued as a precious metal for currency, ornaments, and jewelry.'
  }
]
