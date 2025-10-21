export type TraitType = 'Reason' | 'Valor' | 'Guard' | 'Accord' | 'Will' | 'Flex' | 'Foresight' | 'Strike' | 'Mind' | 'Truth'

export type ArchetypeTier = 'Foundation' | 'Advanced' | 'Elite' | 'Legendary'

// Trait icon mapping
export const TRAIT_ICONS: Record<TraitType, string> = {
  Reason: '/hyperion/traits/analysis.svg',
  Valor: '/hyperion/traits/innovation.svg',
  Guard: '/hyperion/traits/preservation.svg',
  Accord: '/hyperion/traits/resilience.svg',
  Will: '/hyperion/traits/confidence.svg',
  Flex: '/hyperion/traits/versatility.svg',
  Foresight: '/hyperion/traits/vision.svg',
  Strike: '/hyperion/traits/execution.svg',
  Mind: '/hyperion/traits/spirit.svg',
  Truth: '/hyperion/traits/integrity.svg'
}

export interface TraitRequirement {
  trait: string
  requiredLevel: number
}

export interface Trait {
  name: TraitType
  fullName: string
  description: string
  color: string
}

export interface Archetype {
  id: string
  name: string
  tier: ArchetypeTier
  nmtiCode: string // 4-letter NMTI code
  traits: TraitType[]
  requirements: TraitRequirement[]
  personality: string // Personality quote
  theme: string // Archetype theme description (cosmetic only, no abilities)
  unlockRequirements: string
  isUnlocked: boolean
  progress: number // 0-100 for unlock progress
  tierColor: string // Color for tier indicator
}

// 10 Core Traits
export const TRAITS: Record<TraitType, Trait> = {
  Reason: {
    name: 'Reason',
    fullName: 'Analytical Rigor',
    description: 'The discipline to break down complex information and make logic-driven decisions',
    color: '#3B82F6'
  },
  Valor: {
    name: 'Valor',
    fullName: 'Creativity & Contrarian Thinking',
    description: 'The courage to see opportunities where others see risks',
    color: '#EF4444'
  },
  Guard: {
    name: 'Guard',
    fullName: 'Long-Term Orientation & Preservation',
    description: 'Prioritizing survival and sustainability over short-term gains',
    color: '#10B981'
  },
  Accord: {
    name: 'Accord',
    fullName: 'Emotional Discipline',
    description: 'The ability to stay calm under pressure and avoid emotional overreactions',
    color: '#8B5CF6'
  },
  Will: {
    name: 'Will',
    fullName: 'Confidence',
    description: 'Trusting judgment enough to act decisively when conviction is high',
    color: '#F59E0B'
  },
  Flex: {
    name: 'Flex',
    fullName: 'Adaptability & Continuous Learning',
    description: 'The mindset to evolve through experience and feedback loops',
    color: '#06B6D4'
  },
  Foresight: {
    name: 'Foresight',
    fullName: 'Strategic Vision',
    description: 'Seeing how individual decisions fit into larger systems',
    color: '#84CC16'
  },
  Strike: {
    name: 'Strike',
    fullName: 'Execution & Action Orientation',
    description: 'Turning plans into outcomes through thoughtful action',
    color: '#DC2626'
  },
  Mind: {
    name: 'Mind',
    fullName: 'Self-Awareness',
    description: 'Understanding your own strengths, weaknesses, and biases',
    color: '#7C3AED'
  },
  Truth: {
    name: 'Truth',
    fullName: 'Integrity',
    description: 'Ethical decision-making and principle adherence',
    color: '#059669'
  }
}

// NetWorth Archetypes with NMTI Codes
export const ARCHETYPES: Archetype[] = [
  // Foundation Archetypes (2-Trait Requirements)
  {
    id: 'the-analyst',
    name: 'Analyst',
    tier: 'Foundation',
    nmtiCode: 'VLED',
    traits: ['Reason', 'Foresight'],
    requirements: [
      { trait: 'Analytical Rigor', requiredLevel: 3.50 },
      { trait: 'Strategic Vision', requiredLevel: 3.50 }
    ],
    personality: 'The chess master who sees three moves ahead',
    theme: 'Master of data-driven decision making and pattern recognition',
    unlockRequirements: 'Analytical Rigor ≥ 3.50, Strategic Vision ≥ 3.50',
    isUnlocked: false,
    progress: 65,
    tierColor: '#10B981'
  },
  {
    id: 'the-contrarian',
    name: 'Contrarian',
    tier: 'Foundation',
    nmtiCode: 'CSER',
    traits: ['Valor', 'Will'],
    requirements: [
      { trait: 'Creativity & Contrarian Thinking', requiredLevel: 3.50 },
      { trait: 'Confidence', requiredLevel: 3.50 }
    ],
    personality: 'When everyone zigs, you zag with conviction',
    theme: 'Thrives on unconventional thinking and challenging consensus',
    unlockRequirements: 'Creativity & Contrarian ≥ 3.50, Confidence ≥ 3.50',
    isUnlocked: false,
    progress: 45,
    tierColor: '#10B981'
  },
  {
    id: 'the-guardian',
    name: 'Guardian',
    tier: 'Foundation',
    nmtiCode: 'ALGD',
    traits: ['Guard', 'Accord'],
    requirements: [
      { trait: 'Long-Term Preservation', requiredLevel: 3.50 },
      { trait: 'Emotional Discipline', requiredLevel: 3.50 }
    ],
    personality: 'The fortress builder who never loses what matters',
    theme: 'Focused on wealth preservation and risk management',
    unlockRequirements: 'Long-Term Preservation ≥ 3.50, Emotional Discipline ≥ 3.50',
    isUnlocked: false,
    progress: 30,
    tierColor: '#10B981'
  },
  {
    id: 'the-executor',
    name: 'Executor',
    tier: 'Foundation',
    nmtiCode: 'ASED',
    traits: ['Strike', 'Accord'],
    requirements: [
      { trait: 'Execution & Action', requiredLevel: 3.50 },
      { trait: 'Emotional Discipline', requiredLevel: 3.00 }
    ],
    personality: 'Strike fast, strike true, no hesitation',
    theme: 'Excellence in timing, implementation, and follow-through',
    unlockRequirements: 'Execution & Action ≥ 3.50, Emotional Discipline ≥ 3.00',
    isUnlocked: true,
    progress: 100,
    tierColor: '#10B981'
  },
  {
    id: 'the-stoic',
    name: 'Stoic',
    tier: 'Foundation',
    nmtiCode: 'VLGD',
    traits: ['Accord', 'Mind'],
    requirements: [
      { trait: 'Emotional Discipline', requiredLevel: 4.00 },
      { trait: 'Self-Awareness', requiredLevel: 3.50 }
    ],
    personality: 'Ice in your veins when markets burn',
    theme: 'Emotional mastery and disciplined decision-making',
    unlockRequirements: 'Emotional Discipline ≥ 4.00, Self-Awareness ≥ 3.50',
    isUnlocked: false,
    progress: 20,
    tierColor: '#10B981'
  },
  {
    id: 'the-innovator',
    name: 'Innovator',
    tier: 'Foundation',
    nmtiCode: 'CFER',
    traits: ['Valor', 'Strike'],
    requirements: [
      { trait: 'Creativity & Contrarian', requiredLevel: 4.00 },
      { trait: 'Execution & Action', requiredLevel: 3.00 }
    ],
    personality: 'Creating tomorrow\'s strategies today',
    theme: 'Pioneer of new strategies and market approaches',
    unlockRequirements: 'Creativity & Contrarian ≥ 4.00, Execution & Action ≥ 3.00',
    isUnlocked: false,
    progress: 55,
    tierColor: '#10B981'
  },
  {
    id: 'the-optimizer',
    name: 'Optimizer',
    tier: 'Foundation',
    nmtiCode: 'AEPR',
    traits: ['Strike', 'Reason'],
    requirements: [
      { trait: 'Execution & Action', requiredLevel: 4.00 },
      { trait: 'Analytical Rigor', requiredLevel: 3.00 }
    ],
    personality: 'Every basis point matters, every inefficiency must die',
    theme: 'Relentless pursuit of efficiency and performance maximization',
    unlockRequirements: 'Execution & Action ≥ 4.00, Analytical Rigor ≥ 3.00',
    isUnlocked: false,
    progress: 75,
    tierColor: '#10B981'
  },
  {
    id: 'the-alchemist',
    name: 'Alchemist',
    tier: 'Foundation',
    nmtiCode: 'CFEI',
    traits: ['Valor', 'Flex'],
    requirements: [
      { trait: 'Creativity & Contrarian', requiredLevel: 3.50 },
      { trait: 'Adaptability & Learning', requiredLevel: 3.50 }
    ],
    personality: 'Turning market lead into portfolio gold',
    theme: 'Transforms market chaos into opportunity',
    unlockRequirements: 'Creativity & Contrarian ≥ 3.50, Adaptability ≥ 3.50',
    isUnlocked: false,
    progress: 40,
    tierColor: '#10B981'
  },
  {
    id: 'the-sentinel',
    name: 'Sentinel',
    tier: 'Foundation',
    nmtiCode: 'ASGD',
    traits: ['Reason', 'Mind'],
    requirements: [
      { trait: 'Analytical Rigor', requiredLevel: 3.50 },
      { trait: 'Self-Awareness', requiredLevel: 3.50 }
    ],
    personality: 'Patient as stone, strikes like lightning',
    theme: 'Watches and waits for perfect moments',
    unlockRequirements: 'Analytical Rigor ≥ 3.50, Self-Awareness ≥ 3.50',
    isUnlocked: false,
    progress: 10,
    tierColor: '#10B981'
  },
  {
    id: 'the-maverick',
    name: 'Maverick',
    tier: 'Foundation',
    nmtiCode: 'CSER',
    traits: ['Valor', 'Strike'],
    requirements: [
      { trait: 'Creativity & Contrarian', requiredLevel: 3.50 },
      { trait: 'Execution & Action', requiredLevel: 3.50 }
    ],
    personality: 'Rules? Where we\'re going, we don\'t need rules',
    theme: 'Bold, unconventional rapid strikes',
    unlockRequirements: 'Creativity & Contrarian ≥ 3.50, Execution & Action ≥ 3.50',
    isUnlocked: false,
    progress: 35,
    tierColor: '#10B981'
  },
  {
    id: 'the-sage',
    name: 'Sage',
    tier: 'Foundation',
    nmtiCode: 'VLPI',
    traits: ['Foresight', 'Truth'],
    requirements: [
      { trait: 'Strategic Vision', requiredLevel: 4.00 },
      { trait: 'Integrity', requiredLevel: 3.50 }
    ],
    personality: 'Profit with purpose, wealth with wisdom',
    theme: 'Wisdom-based ethical investing',
    unlockRequirements: 'Strategic Vision ≥ 4.00, Integrity ≥ 3.50',
    isUnlocked: false,
    progress: 25,
    tierColor: '#10B981'
  },
  {
    id: 'the-catalyst',
    name: 'Catalyst',
    tier: 'Foundation',
    nmtiCode: 'CFPR',
    traits: ['Will', 'Flex'],
    requirements: [
      { trait: 'Confidence', requiredLevel: 4.00 },
      { trait: 'Adaptability & Learning', requiredLevel: 3.00 }
    ],
    personality: 'Be the change the market hasn\'t priced in yet',
    theme: 'Sparks change and momentum',
    unlockRequirements: 'Confidence ≥ 4.00, Adaptability ≥ 3.00',
    isUnlocked: false,
    progress: 60,
    tierColor: '#10B981'
  },

  // Advanced Archetypes (3-Trait Requirements)
  {
    id: 'the-balanced-investor',
    name: 'Balanced Investor',
    tier: 'Advanced',
    nmtiCode: 'AFPD',
    traits: ['Reason', 'Accord', 'Foresight'],
    requirements: [
      { trait: 'Analytical Rigor', requiredLevel: 2.50 },
      { trait: 'Emotional Discipline', requiredLevel: 2.50 },
      { trait: 'Strategic Vision', requiredLevel: 2.50 }
    ],
    personality: 'Jack of all trades, master of enough',
    theme: 'Well-rounded development across all traits',
    unlockRequirements: 'Sum of top 3 traits ≥ 10.50, gap ≤ 1.50',
    isUnlocked: false,
    progress: 15,
    tierColor: '#3B82F6'
  },
  {
    id: 'the-adaptive-trader',
    name: 'Adaptive Trader',
    tier: 'Advanced',
    nmtiCode: 'VFEI',
    traits: ['Flex', 'Mind', 'Strike'],
    requirements: [
      { trait: 'Adaptability & Continuous Learning', requiredLevel: 3.50 },
      { trait: 'Self-Awareness', requiredLevel: 3.00 },
      { trait: 'Execution & Action Orientation', requiredLevel: 2.50 }
    ],
    personality: 'Like water, taking the shape of any market',
    theme: 'Excels at learning from markets and evolving strategies',
    unlockRequirements: 'Sum of top 3 traits ≥ 10.50, gap ≤ 1.50',
    isUnlocked: false,
    progress: 12,
    tierColor: '#3B82F6'
  },
  {
    id: 'the-visionary',
    name: 'Visionary',
    tier: 'Advanced',
    nmtiCode: 'VLPI',
    traits: ['Foresight', 'Reason', 'Guard'],
    requirements: [
      { trait: 'Strategic Vision', requiredLevel: 3.50 },
      { trait: 'Analytical Rigor', requiredLevel: 3.00 },
      { trait: 'Long-Term Orientation & Preservation', requiredLevel: 2.50 }
    ],
    personality: 'Seeing tomorrow\'s world today',
    theme: 'Master of long-term trends and strategic foresight',
    unlockRequirements: 'Sum of top 3 traits ≥ 10.50, gap ≤ 1.50',
    isUnlocked: false,
    progress: 18,
    tierColor: '#3B82F6'
  },
  {
    id: 'the-networker',
    name: 'Networker',
    tier: 'Advanced',
    nmtiCode: 'VFPI',
    traits: ['Flex', 'Foresight', 'Truth'],
    requirements: [
      { trait: 'Adaptability & Continuous Learning', requiredLevel: 3.00 },
      { trait: 'Strategic Vision', requiredLevel: 3.00 },
      { trait: 'Integrity', requiredLevel: 3.00 }
    ],
    personality: 'Your network is your net worth',
    theme: 'Master of information flow and social trading dynamics',
    unlockRequirements: 'Sum of top 3 traits ≥ 10.50, gap ≤ 1.50',
    isUnlocked: false,
    progress: 20,
    tierColor: '#3B82F6'
  },
  {
    id: 'the-philosopher',
    name: 'Philosopher',
    tier: 'Advanced',
    nmtiCode: 'ALPI',
    traits: ['Mind', 'Reason', 'Truth'],
    requirements: [
      { trait: 'Self-Awareness', requiredLevel: 4.00 },
      { trait: 'Analytical Rigor', requiredLevel: 3.00 },
      { trait: 'Integrity', requiredLevel: 3.00 }
    ],
    personality: 'Know thyself, know the market',
    theme: 'Deep understanding of market psychology and human behavior',
    unlockRequirements: 'Sum of top 3 traits ≥ 10.50, gap ≤ 1.50',
    isUnlocked: false,
    progress: 8,
    tierColor: '#3B82F6'
  },
  {
    id: 'the-orchestrator',
    name: 'Orchestrator',
    tier: 'Advanced',
    nmtiCode: 'VLPD',
    traits: ['Foresight', 'Strike', 'Accord'],
    requirements: [
      { trait: 'Strategic Vision', requiredLevel: 3.50 },
      { trait: 'Execution & Action', requiredLevel: 3.00 },
      { trait: 'Emotional Discipline', requiredLevel: 3.00 }
    ],
    personality: 'Every position plays its part in the grand design',
    theme: 'Conducts complex multi-strategy symphonies',
    unlockRequirements: 'Sum of top 3 traits ≥ 10.50, gap ≤ 1.50',
    isUnlocked: false,
    progress: 14,
    tierColor: '#3B82F6'
  },
  {
    id: 'the-architect',
    name: 'Architect',
    tier: 'Advanced',
    nmtiCode: 'ALPI',
    traits: ['Reason', 'Guard', 'Foresight'],
    requirements: [
      { trait: 'Analytical Rigor', requiredLevel: 3.50 },
      { trait: 'Long-Term Preservation', requiredLevel: 3.50 },
      { trait: 'Strategic Vision', requiredLevel: 3.00 }
    ],
    personality: 'Constructing wealth one calculated brick at a time',
    theme: 'Builds complete systematic approaches',
    unlockRequirements: 'Sum of top 3 traits ≥ 10.50, gap ≤ 1.50',
    isUnlocked: false,
    progress: 10,
    tierColor: '#3B82F6'
  },
  {
    id: 'the-polymath',
    name: 'Polymath',
    tier: 'Advanced',
    nmtiCode: 'VFEI',
    traits: ['Reason', 'Valor', 'Foresight'],
    requirements: [
      { trait: 'Analytical Rigor', requiredLevel: 3.00 },
      { trait: 'Creativity & Contrarian', requiredLevel: 3.00 },
      { trait: 'Strategic Vision', requiredLevel: 3.00 }
    ],
    personality: 'Renaissance trader in a digital age',
    theme: 'Master of multiple disciplines',
    unlockRequirements: 'Sum of top 3 traits ≥ 10.50, gap ≤ 1.50',
    isUnlocked: false,
    progress: 22,
    tierColor: '#3B82F6'
  },

  // Elite Archetypes (4-Trait Requirements)
  {
    id: 'the-sovereign',
    name: 'Sovereign',
    tier: 'Elite',
    nmtiCode: 'VLGD',
    traits: ['Foresight', 'Reason', 'Guard', 'Accord'],
    requirements: [
      { trait: 'Strategic Vision', requiredLevel: 4.00 },
      { trait: 'Analytical Rigor', requiredLevel: 3.50 },
      { trait: 'Long-Term Preservation', requiredLevel: 3.50 },
      { trait: 'Emotional Discipline', requiredLevel: 3.00 }
    ],
    personality: 'The king stays the king',
    theme: 'Complete mastery across multiple dimensions',
    unlockRequirements: 'Sum of top 4 traits ≥ 14.00, gap ≤ 2.00',
    isUnlocked: false,
    progress: 5,
    tierColor: '#9333EA'
  },
  {
    id: 'the-transcendent',
    name: 'Transcendent',
    tier: 'Elite',
    nmtiCode: 'VFPI',
    traits: ['Mind', 'Foresight', 'Flex', 'Truth'],
    requirements: [
      { trait: 'Self-Awareness', requiredLevel: 4.00 },
      { trait: 'Strategic Vision', requiredLevel: 3.50 },
      { trait: 'Adaptability & Learning', requiredLevel: 3.50 },
      { trait: 'Integrity', requiredLevel: 3.00 }
    ],
    personality: 'Not playing the game, transcending it',
    theme: 'Beyond conventional trading paradigms',
    unlockRequirements: 'Sum of top 4 traits ≥ 14.00, gap ≤ 2.00',
    isUnlocked: false,
    progress: 3,
    tierColor: '#9333EA'
  },
  {
    id: 'the-oracle',
    name: 'Oracle',
    tier: 'Elite',
    nmtiCode: 'VLPI',
    traits: ['Foresight', 'Reason', 'Mind', 'Guard'],
    requirements: [
      { trait: 'Strategic Vision', requiredLevel: 4.50 },
      { trait: 'Analytical Rigor', requiredLevel: 3.50 },
      { trait: 'Self-Awareness', requiredLevel: 3.00 },
      { trait: 'Long-Term Preservation', requiredLevel: 3.00 }
    ],
    personality: 'The future whispers to those who listen',
    theme: 'Prophetic market insight',
    unlockRequirements: 'Sum of top 4 traits ≥ 14.00, gap ≤ 2.00',
    isUnlocked: false,
    progress: 2,
    tierColor: '#9333EA'
  },
  {
    id: 'the-titan',
    name: 'Titan',
    tier: 'Elite',
    nmtiCode: 'AEED',
    traits: ['Strike', 'Will', 'Reason', 'Accord'],
    requirements: [
      { trait: 'Execution & Action', requiredLevel: 4.50 },
      { trait: 'Confidence', requiredLevel: 4.00 },
      { trait: 'Analytical Rigor', requiredLevel: 3.00 },
      { trait: 'Emotional Discipline', requiredLevel: 2.50 }
    ],
    personality: 'Move markets, don\'t follow them',
    theme: 'Unstoppable force in markets',
    unlockRequirements: 'Sum of top 4 traits ≥ 14.00, gap ≤ 2.00',
    isUnlocked: false,
    progress: 4,
    tierColor: '#9333EA'
  },

  // Legendary Archetypes (Perfect Balance)
  {
    id: 'the-equilibrium',
    name: 'Equilibrium',
    tier: 'Legendary',
    nmtiCode: 'FFPD',
    traits: ['Reason', 'Valor', 'Guard', 'Accord', 'Will', 'Flex', 'Foresight', 'Strike', 'Mind', 'Truth'],
    requirements: [
      { trait: 'All Traits', requiredLevel: 3.75 }
    ],
    personality: 'In perfect balance, infinite possibility',
    theme: 'Perfect harmony across all dimensions',
    unlockRequirements: 'All traits between 3.75-4.25 (perfect balance)',
    isUnlocked: false,
    progress: 0,
    tierColor: '#DC2626'
  },
  {
    id: 'the-singularity',
    name: 'Singularity',
    tier: 'Legendary',
    nmtiCode: 'VFEI',
    traits: ['Reason', 'Valor', 'Guard', 'Accord', 'Will', 'Flex', 'Foresight', 'Strike', 'Mind', 'Truth'],
    requirements: [
      { trait: 'All Traits', requiredLevel: 5.00 }
    ],
    personality: 'Where all paths meet, new ones begin',
    theme: 'Convergence of all mastery',
    unlockRequirements: 'All traits ≥ 5.00, Total sum ≥ 50.00',
    isUnlocked: false,
    progress: 0,
    tierColor: '#DC2626'
  }
]

// Helper functions
export function getArchetypesByTier(tier: ArchetypeTier): Archetype[] {
  return ARCHETYPES.filter(archetype => archetype.tier === tier)
}

export function getUnlockedArchetypes(): Archetype[] {
  return ARCHETYPES.filter(archetype => archetype.isUnlocked)
}

export function getArchetypeById(id: string): Archetype | undefined {
  return ARCHETYPES.find(archetype => archetype.id === id)
}
