// Mock Themis API for prediction markets

export interface Market {
  id: number
  question: string
  category: 'finance' | 'crypto' | 'economics' | 'politics'
  type: '2-option' | 'multi-option'
  yes?: string
  no?: string
  options?: { name: string; percentage: string }[]
  volume: string
}

const mockMarkets: Market[] = [
  // FINANCE
  {
    id: 1,
    question: 'Will the S&P 500 reach 6000 by end of 2025?',
    category: 'finance',
    type: '2-option',
    yes: '67%',
    no: '33%',
    volume: '$1.2M'
  },
  {
    id: 2,
    question: 'Will interest rates be cut in Q1 2025?',
    category: 'finance',
    type: '2-option',
    yes: '45%',
    no: '55%',
    volume: '$890K'
  },
  {
    id: 3,
    question: 'Which sector will perform best in 2025?',
    category: 'finance',
    type: 'multi-option',
    options: [
      { name: 'Tech', percentage: '42%' },
      { name: 'Healthcare', percentage: '28%' },
      { name: 'Energy', percentage: '18%' },
      { name: 'Finance', percentage: '12%' }
    ],
    volume: '$650K'
  },
  {
    id: 4,
    question: 'Will Tesla stock hit $400 by end of year?',
    category: 'finance',
    type: '2-option',
    yes: '38%',
    no: '62%',
    volume: '$1.5M'
  },

  // CRYPTO
  {
    id: 5,
    question: 'Will Bitcoin reach $150K in 2025?',
    category: 'crypto',
    type: '2-option',
    yes: '58%',
    no: '42%',
    volume: '$2.1M'
  },
  {
    id: 6,
    question: 'Will Ethereum flip Bitcoin by market cap?',
    category: 'crypto',
    type: '2-option',
    yes: '22%',
    no: '78%',
    volume: '$780K'
  },
  {
    id: 7,
    question: 'Which L1 will have highest TVL growth?',
    category: 'crypto',
    type: 'multi-option',
    options: [
      { name: 'Solana', percentage: '35%' },
      { name: 'Ethereum', percentage: '30%' },
      { name: 'Avalanche', percentage: '20%' },
      { name: 'Cardano', percentage: '15%' }
    ],
    volume: '$920K'
  },
  {
    id: 8,
    question: 'Will a Bitcoin ETF be approved in 2025?',
    category: 'crypto',
    type: '2-option',
    yes: '85%',
    no: '15%',
    volume: '$1.8M'
  },

  // ECONOMICS
  {
    id: 9,
    question: 'Will US enter recession in 2025?',
    category: 'economics',
    type: '2-option',
    yes: '35%',
    no: '65%',
    volume: '$1.4M'
  },
  {
    id: 10,
    question: 'Will inflation drop below 2% in 2025?',
    category: 'economics',
    type: '2-option',
    yes: '48%',
    no: '52%',
    volume: '$1.1M'
  },
  {
    id: 11,
    question: 'Which country will have highest GDP growth?',
    category: 'economics',
    type: 'multi-option',
    options: [
      { name: 'India', percentage: '38%' },
      { name: 'China', percentage: '32%' },
      { name: 'USA', percentage: '18%' },
      { name: 'Brazil', percentage: '12%' }
    ],
    volume: '$540K'
  },
  {
    id: 12,
    question: 'Will unemployment rate stay below 4%?',
    category: 'economics',
    type: '2-option',
    yes: '72%',
    no: '28%',
    volume: '$890K'
  },

  // POLITICS
  {
    id: 13,
    question: 'Will there be a US government shutdown in 2025?',
    category: 'politics',
    type: '2-option',
    yes: '41%',
    no: '59%',
    volume: '$760K'
  },
  {
    id: 14,
    question: 'Will student loan forgiveness pass in 2025?',
    category: 'politics',
    type: '2-option',
    yes: '29%',
    no: '71%',
    volume: '$670K'
  },
  {
    id: 15,
    question: 'Who will win the next election?',
    category: 'politics',
    type: 'multi-option',
    options: [
      { name: 'Candidate A', percentage: '45%' },
      { name: 'Candidate B', percentage: '38%' },
      { name: 'Candidate C', percentage: '12%' },
      { name: 'Other', percentage: '5%' }
    ],
    volume: '$2.3M'
  },
  {
    id: 16,
    question: 'Will climate legislation pass in 2025?',
    category: 'politics',
    type: '2-option',
    yes: '52%',
    no: '48%',
    volume: '$920K'
  }
]

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
  }
}
