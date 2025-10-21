// Chrysoplos types
export type ChryspolosTier = 'Rare' | 'Unique' | 'Mythic' | 'Glitch'
export type ChryspolosType = 'PASSIVE' | 'ACTIVE'
export type ChryspolosPlatform = 'Leda' | 'Dione' | 'Themis'

export interface AspectRequirement {
  aspectName: string
  required: number
}

export interface ChryspolosItem {
  id: string
  name: string
  tagline: string              // Skill name (e.g., "Binary Protocol")
  weaponLore?: string          // Lore paragraph explaining the weapon's story
  skillDescription?: string    // Mechanical effect description of the skill
  platform?: ChryspolosPlatform
  tier: ChryspolosTier
  type: ChryspolosType
  abilityName: string
  description: string          // Kept for backwards compatibility
  owned: boolean
  isNew?: boolean
  aspectRequirements?: AspectRequirement[]
  resonanceRequired?: number
}

export interface Aspect {
  id: string
  name: string
  count: number
  requiredCount: 3 | 5 | 10 | 20
  unlocksChrysoplos: string
  tier: ChryspolosTier
}

export const TIER_COLORS: Record<ChryspolosTier, string> = {
  Rare: '#21E86F',       // Green (🟢)
  Unique: '#13A9EA',     // Blue (🔵)
  Mythic: '#E62A17',     // Red (🔴)
  Glitch: '#523CF2'      // Purple (⚡)
}

export const TIER_NUMBERS: Record<ChryspolosTier, number> = {
  Rare: 1,
  Unique: 2,
  Mythic: 3,
  Glitch: 4
}

export const CHRYSOPLOS_TIERS: ChryspolosTier[] = [
  'Rare',
  'Unique',
  'Mythic',
  'Glitch'
]

// Mock ownership data - in production this would come from user profile
// Generate stable ownership based on item position
export const generateMockOwnership = (index?: number): boolean => {
  // Use a deterministic pattern instead of random
  if (index !== undefined) {
    return index % 3 !== 0 // ~66% ownership rate, but stable
  }
  return false
}

// All 28 Chrysoplos items from new chrysoplos matrix
export const CHRYSOPLOS_LIBRARY: ChryspolosItem[] = [
  // ============================================
  // RARE TIER (12 abilities)
  // ============================================
  {
    id: 'rare_001',
    name: 'Convergence Algorithm',
    tagline: 'Limit Order Master',
    weaponLore: 'The Convergence Algorithm was extracted from the ruins of Archegos Capital, still humming with the ghost of precision. It calculates the moment when order meets price, a fragment of collapsed empire now serving new masters. Those who strike within its calculated window are blessed with reduced tribute.',
    skillDescription: 'Reduces fees by 3.5%-6.5% when limit orders fill within 1% of market price.',
    platform: 'Dione',
    tier: 'Rare',
    type: 'PASSIVE',
    abilityName: 'Convergence_Algorithm',
    description: 'Limit orders that fill within 1% of market price get 5% fee reduction',
    owned: generateMockOwnership(0),
    aspectRequirements: [{ aspectName: 'Shadow Shard', required: 5 }],
    resonanceRequired: 50
  },
  {
    id: 'rare_002',
    name: 'Resonance Protocol',
    tagline: 'Confidence Pays',
    weaponLore: 'Developed by an obsessed quant who believed conviction itself was measurable energy. When his certainty reached 80%, the markets bent to his will. He vanished during the Flash Crash, but his protocol endures, amplifying those bold enough to believe absolutely.',
    skillDescription: 'Grants +5-15 resonance when predictions with 80%+ confidence win.',
    platform: 'Themis',
    tier: 'Rare',
    type: 'PASSIVE',
    abilityName: 'Resonance_Protocol',
    description: 'Predictions with 80%+ confidence that win grant +10 resonance',
    owned: generateMockOwnership(1),
    aspectRequirements: [{ aspectName: 'Shadow Shard', required: 5 }],
    resonanceRequired: 50
  },
  {
    id: 'rare_003',
    name: 'Equilibrium Framework',
    tagline: 'Perfect Chemistry',
    weaponLore: "Ancient framework discovered in LTCM's server rooms after their collapse. It reveals the sacred geometry of unit harmony—when three families align perfectly, action flows without resistance. Balance is power, and power is eternal.",
    skillDescription: 'Grants +0.5-1.5 AP each turn while a perfect chemistry stack (3 matching families) remains alive.',
    platform: 'Leda',
    tier: 'Rare',
    type: 'PASSIVE',
    abilityName: 'Equilibrium_Framework',
    description: 'Getting perfect chemistry (3 matching families) grants +1 AP each turn while that stack remains alive',
    owned: generateMockOwnership(2),
    aspectRequirements: [{ aspectName: 'Shadow Shard', required: 5 }],
    resonanceRequired: 50
  },
  {
    id: 'rare_004',
    name: 'Latency Matrix',
    tagline: 'Patient Limit',
    weaponLore: 'Crystallized from the prayers of high-frequency traders caught in infinite loops. Every minute of patience accumulates like compound interest. When the order finally fills, time itself rewards your discipline with superior execution.',
    skillDescription: 'Limit orders sitting unfilled for 10+ minutes get 2-4% better fill price when executed.',
    platform: 'Dione',
    tier: 'Rare',
    type: 'PASSIVE',
    abilityName: 'Latency_Matrix',
    description: 'Limit orders sitting unfilled for 10+ minutes get 3% better fill price when executed',
    owned: generateMockOwnership(3),
    aspectRequirements: [{ aspectName: 'Shadow Shard', required: 5 }],
    resonanceRequired: 50
  },
  {
    id: 'rare_005',
    name: 'Recursion Engine',
    tagline: 'Short Squeeze',
    weaponLore: "Salvaged from GameStop's aftermath, still spinning with the energy of reversals. Each profitable short closure feeds back into the mechanism, creating a perpetual motion machine of rewards. What falls must rise, and this engine captures both directions.",
    skillDescription: 'Closing a profitable short position grants +3-6 resonance.',
    platform: 'Dione',
    tier: 'Rare',
    type: 'PASSIVE',
    abilityName: 'Recursion_Engine',
    description: 'Closing a profitable short position grants +5 resonance',
    owned: generateMockOwnership(4),
    aspectRequirements: [{ aspectName: 'Shadow Shard', required: 5 }],
    resonanceRequired: 50
  },
  {
    id: 'rare_006',
    name: 'Volatility Sequence',
    tagline: 'Stop Loss Reward',
    weaponLore: 'Forged in the Black Monday fires of 1987. Even when defenses fail and stop losses trigger, this relic salvages something from the wreckage. Traders who survived that day learned: even catastrophe leaves scraps for the survivors.',
    skillDescription: 'When your stop loss triggers, get 1-2% of the loss back as NetWorth.',
    platform: 'Dione',
    tier: 'Rare',
    type: 'PASSIVE',
    abilityName: 'Volatility_Sequence',
    description: 'When your stop loss triggers, get 2% of the loss back as NetWorth',
    owned: generateMockOwnership(5),
    aspectRequirements: [{ aspectName: 'Shadow Shard', required: 5 }],
    resonanceRequired: 50
  },
  {
    id: 'rare_007',
    name: 'Entropy Database',
    tagline: 'Fortress Memory',
    weaponLore: 'The fortress remembers. Built from the logs of a paranoid sysadmin who cataloged every intrusion attempt for 20 years. Attackers who return face escalating countermeasures—for the database never forgets, and vengeance compounds.',
    skillDescription: 'Fortresses deal +0.5-1.5 EV damage to repeat attackers.',
    platform: 'Leda',
    tier: 'Rare',
    type: 'PASSIVE',
    abilityName: 'Entropy_Database',
    description: 'Fortresses remember who attacked them - deal +1 EV damage to repeat attackers',
    owned: generateMockOwnership(6),
    aspectRequirements: [{ aspectName: 'Shadow Shard', required: 5 }],
    resonanceRequired: 50
  },
  {
    id: 'rare_008',
    name: 'Momentum Architecture',
    tagline: 'Territory Chain',
    weaponLore: "Blueprint stolen from Alexander's military archives. Three consecutive conquests trigger a cascade that empowers entire armies. Momentum is the ultimate force multiplier—once the dominoes begin falling, nothing can stop them.",
    skillDescription: 'Capturing 3 territories in consecutive turns grants +1-3 attack to all stacks.',
    platform: 'Leda',
    tier: 'Rare',
    type: 'PASSIVE',
    abilityName: 'Momentum_Architecture',
    description: 'Capturing 3 territories in consecutive turns grants +2 attack to all stacks',
    owned: generateMockOwnership(7),
    aspectRequirements: [{ aspectName: 'Shadow Shard', required: 5 }],
    resonanceRequired: 50
  },
  {
    id: 'rare_009',
    name: 'Parallax Network',
    tagline: 'Category Expert',
    weaponLore: 'Created by a savant who predicted 47 Super Bowls in a row by watching nothing else. Specialization strengthens your signal, but stray twice from your domain and the network severs. Mastery demands monomaniacal focus.',
    skillDescription: 'Making 5+ predictions in the same category grants +1-3% more NetWorth from wins (ends when betting different category twice in a row).',
    platform: 'Themis',
    tier: 'Rare',
    type: 'PASSIVE',
    abilityName: 'Parallax_Network',
    description: 'Making 5+ predictions in the same category in a row grants +2% more NetWorth from wins (bonus ends when you bet on a different category twice in a row)',
    owned: generateMockOwnership(8),
    aspectRequirements: [{ aspectName: 'Shadow Shard', required: 5 }],
    resonanceRequired: 50
  },
  {
    id: 'rare_010',
    name: 'Synthesis Compiler',
    tagline: 'Chemistry Override',
    weaponLore: 'Forbidden alchemical formula from the library of Helvetius. Once per battle, it allows the impossible—elements that should never bond, fighting as one unified force. Reality bends, but only once. Choose the moment wisely.',
    skillDescription: 'Once per game, ignore chemistry requirements for one stack.',
    platform: 'Leda',
    tier: 'Rare',
    type: 'ACTIVE',
    abilityName: 'Synthesis_Compiler',
    description: 'Once per game, ignore chemistry requirements for one stack',
    owned: generateMockOwnership(9),
    aspectRequirements: [{ aspectName: 'Shadow Shard', required: 5 }],
    resonanceRequired: 50
  },
  {
    id: 'rare_011',
    name: 'Amplitude Server',
    tagline: 'Early Bird',
    weaponLore: 'Relic of the first HFT firm, when microseconds meant millions. Those who arrive first to virgin markets pay less tribute to the exchange. Speed is alpha, and alpha belongs to the swift.',
    skillDescription: 'Being first 10 to predict on a new market costs 1-3% less stake.',
    platform: 'Themis',
    tier: 'Rare',
    type: 'PASSIVE',
    abilityName: 'Amplitude_Server',
    description: 'Being first 10 to predict on a new market costs 5% less stake',
    owned: generateMockOwnership(10),
    aspectRequirements: [{ aspectName: 'Shadow Shard', required: 5 }],
    resonanceRequired: 50
  },
  {
    id: 'rare_012',
    name: 'Frequency Validator',
    tagline: 'Contrarian Bonus',
    weaponLore: 'Compass forged by Jesse Livermore during his final trade. When 70% believe one thing and you bet against them, this relic validates your lonely conviction. The crowd is wrong more often than history admits.',
    skillDescription: 'Predicting against 70%+ consensus and winning grants +8-12% payout.',
    platform: 'Themis',
    tier: 'Rare',
    type: 'PASSIVE',
    abilityName: 'Frequency_Validator',
    description: 'Predicting against 70%+ consensus and winning grants +10% payout',
    owned: generateMockOwnership(11),
    aspectRequirements: [{ aspectName: 'Shadow Shard', required: 5 }],
    resonanceRequired: 50
  },

  // ============================================
  // UNIQUE TIER (8 abilities)
  // ============================================
  {
    id: 'unique_001',
    name: 'All Weather Protocol',
    tagline: 'Storm Survivor',
    weaponLore: "Ray Dalio's last gift before ascending beyond markets. Three storms endured transform suffering into explosive power. The protocol teaches: what doesn't kill you makes your next victory transcendent. Endure, adapt, overcome.",
    skillDescription: 'Taking 3 losses in a row grants +30-40% on next win.',
    tier: 'Unique',
    type: 'PASSIVE',
    abilityName: 'All_Weather_Protocol',
    description: 'Taking 3 losses in a row grants +40% on next win',
    owned: generateMockOwnership(12),
    aspectRequirements: [{ aspectName: 'Storm Fragment', required: 10 }],
    resonanceRequired: 100
  },
  {
    id: 'unique_002',
    name: 'Friedman Doctrine',
    tagline: 'Laissez-Faire',
    weaponLore: 'Testament written in the final days of the Chicago School. Those who reject all protection and embrace pure market forces are blessed by the invisible hand itself. Stop losses are for the weak. True believers trade naked.',
    skillDescription: 'Not using protective features in DIONE grants +12-17% to all gains.',
    platform: 'Dione',
    tier: 'Unique',
    type: 'PASSIVE',
    abilityName: 'Friedman_Doctrine',
    description: 'Not using any protective features in DIONE (stop losses, limits) grants +15% to all gains',
    owned: generateMockOwnership(13),
    aspectRequirements: [{ aspectName: 'Storm Fragment', required: 10 }],
    resonanceRequired: 100
  },
  {
    id: 'unique_003',
    name: "Euler's Ruler",
    tagline: 'Hourly Champion',
    weaponLore: 'Leonhard Euler discovered that time could be divided into units of power. Dominate any 60-minute interval and the ruler grants protection for the next hour. Success breeds immunity in the mathematics of time.',
    skillDescription: 'Being top NetWorth earner in any hour reduces losses by 5-15% for the next hour.',
    tier: 'Unique',
    type: 'PASSIVE',
    abilityName: 'Eulers_Ruler',
    description: 'Being the top NetWorth earner in any given hour reduces your losses by 10% for the next hour',
    owned: generateMockOwnership(14),
    aspectRequirements: [{ aspectName: 'Storm Fragment', required: 10 }],
    resonanceRequired: 100
  },
  {
    id: 'unique_004',
    name: "Newton's Apple",
    tagline: 'Gravity Well',
    weaponLore: 'The apple that fell on Newton contained more than physics—it held the law of reversals. When you plummet 10% in a day, gravity itself offers consolation. What falls must rise, and the apple reduces friction for your ascent.',
    skillDescription: 'After NetWorth drops 10%+ in one day, next 3 actions have 3-8% fee reduction.',
    tier: 'Unique',
    type: 'PASSIVE',
    abilityName: 'Newtons_Apple',
    description: 'When NetWorth drops by more than 10% in one day, next 3 actions have 15% fee reduction',
    owned: generateMockOwnership(15),
    aspectRequirements: [{ aspectName: 'Storm Fragment', required: 10 }],
    resonanceRequired: 100
  },
  {
    id: 'unique_005',
    name: 'Turing Test',
    tagline: 'Binary Protocol',
    weaponLore: "Alan Turing's final algorithm, written the night before he died. It recognizes patterns in your actions, rewarding consistency with mechanical efficiency. Every second move costs less. The machine understands rhythm better than humans ever could.",
    skillDescription: 'Every 2nd LEDA match, DIONE trade, or THEMIS prediction costs 1-3% less fees.',
    tier: 'Unique',
    type: 'PASSIVE',
    abilityName: 'Turing_Test',
    description: 'Every 2nd LEDA match, DIONE trade, or THEMIS prediction costs 2% less fees',
    owned: generateMockOwnership(16),
    aspectRequirements: [{ aspectName: 'Storm Fragment', required: 10 }],
    resonanceRequired: 100
  },
  {
    id: 'unique_006',
    name: 'Atom of Bohr',
    tagline: 'Quantum Tunneling',
    weaponLore: 'Niels Bohr proved that electrons occasionally phase through impossible barriers. This atom inherited that property—a small daily chance to tunnel through fee walls as if they never existed. Quantum uncertainty favors the patient.',
    skillDescription: '3-6% chance to bypass one fee per day completely.',
    tier: 'Unique',
    type: 'PASSIVE',
    abilityName: 'Atom_of_Bohr',
    description: '5% chance to bypass one fee per day completely',
    owned: generateMockOwnership(17),
    aspectRequirements: [{ aspectName: 'Storm Fragment', required: 10 }],
    resonanceRequired: 100
  },
  {
    id: 'unique_007',
    name: "Da Vinci's Code",
    tagline: 'Golden Ratio',
    weaponLore: 'Leonardo encoded the golden ratio into a cipher that remained unsolved for 500 years. When NetWorth and Resonance achieve Fibonacci balance, the code unlocks. Beauty and power are one in the spiral.',
    skillDescription: 'When NetWorth and Resonance balance within 10%, gain +7.5-12.5% to all gains.',
    tier: 'Unique',
    type: 'PASSIVE',
    abilityName: 'Da_Vincis_Code',
    description: 'When NetWorth and Resonance are within 10% of each other, +10% gains',
    owned: generateMockOwnership(18),
    aspectRequirements: [{ aspectName: 'Storm Fragment', required: 10 }],
    resonanceRequired: 100
  },
  {
    id: 'unique_008',
    name: "Gödel's Loop",
    tagline: 'Infinite Cycle',
    weaponLore: 'Kurt Gödel proved incompleteness, but found completeness in cycles. Win LEDA, profit in DIONE, predict correctly in THEMIS—complete the sacred cycle and the loop rewards your systematic perfection. In repetition, transcendence.',
    skillDescription: 'Completing full cycle (Win LEDA → Profit DIONE → Correct THEMIS) grants +12-18% to next cycle start.',
    tier: 'Unique',
    type: 'PASSIVE',
    abilityName: 'Godels_Loop',
    description: 'Completing a full cycle (Win LEDA → Profit DIONE → Correct THEMIS) grants +20% to next cycle start',
    owned: generateMockOwnership(19),
    aspectRequirements: [{ aspectName: 'Storm Fragment', required: 10 }],
    resonanceRequired: 100
  },

  // ============================================
  // MYTHIC TIER (5 abilities)
  // ============================================
  {
    id: 'mythic_001',
    name: 'Fire of Prometheus',
    tagline: 'Divine Ascension',
    weaponLore: 'Prometheus stole fire from Olympus and gave it to mortals. This torch carries that same stolen flame. Five consecutive victories ignite you in divine fire—both glory and danger intensified. The gods do not forgive theft, but they respect audacity.',
    skillDescription: 'After 5 consecutive wins, enter Ascended State with +12-18% gains AND +12-18% losses for 1 hour.',
    tier: 'Mythic',
    type: 'PASSIVE',
    abilityName: 'Fire_of_Prometheus',
    description: 'After 5 consecutive wins, enter "Ascended State" (+20% gains AND +20% losses for 1 hour)',
    owned: generateMockOwnership(20),
    aspectRequirements: [{ aspectName: 'Void Essence', required: 20 }],
    resonanceRequired: 200
  },
  {
    id: 'mythic_002',
    name: "Pandora's Box",
    tagline: 'Last Hope',
    weaponLore: "Zeus cursed Pandora's box to release all evils, but one thing remained at the bottom—Hope. Once monthly, when losses mount and darkness surrounds you, the box opens for the worthy. Even the gods could not kill Hope entirely.",
    skillDescription: 'Once a month, gain back 5-15% of NetWorth lost that month only if ending with negative PnL.',
    tier: 'Mythic',
    type: 'PASSIVE',
    abilityName: 'Pandoras_Box',
    description: 'Once a month, gain back 10% of the NetWorth you lost that month only if you were negative PnL in NetWorth for that month',
    owned: generateMockOwnership(21),
    aspectRequirements: [{ aspectName: 'Void Essence', required: 20 }],
    resonanceRequired: 200
  },
  {
    id: 'mythic_003',
    name: 'Wings of Icarus',
    tagline: 'Soaring Ambition',
    weaponLore: 'Daedalus warned his son not to fly too high, but Icarus ignored him. These wings carry you higher with each consecutive victory, amplifying rewards up to 10%. But one defeat melts the wax and you plummet. Hubris always extracts payment.',
    skillDescription: "Each consecutive win increases next action's rewards by 0.5-1.5% (max 10%, resets on loss).",
    tier: 'Mythic',
    type: 'PASSIVE',
    abilityName: 'Wings_of_Icarus',
    description: "Each consecutive win increases next action's rewards by 1% (max 10%, resets on loss)",
    owned: generateMockOwnership(22),
    aspectRequirements: [{ aspectName: 'Void Essence', required: 20 }],
    resonanceRequired: 200
  },
  {
    id: 'mythic_004',
    name: "Sisyphus' Rock",
    tagline: 'Eternal Return',
    weaponLore: 'Sisyphus was cursed to push a boulder uphill for eternity. But once per day, unseen chains catch the stone before it crushes you completely, reducing its weight by half. The struggle never ends, but small mercies exist even in Tartarus.',
    skillDescription: 'Once per day, your biggest loss is reduced by 45-55%.',
    tier: 'Mythic',
    type: 'PASSIVE',
    abilityName: 'Sisyphus_Rock',
    description: 'Once per day, your biggest loss is reduced by 50%',
    owned: generateMockOwnership(23),
    aspectRequirements: [{ aspectName: 'Void Essence', required: 20 }],
    resonanceRequired: 200
  },
  {
    id: 'mythic_005',
    name: 'Midas Touch',
    tagline: 'Golden Hour',
    weaponLore: "King Midas wished that everything he touched would turn to gold. Dionysus granted the wish, but added a curse—Midas couldn't control when the power activated. Once daily, for one random hour, half your actions transmute. The blessing and curse remain inseparable.",
    skillDescription: 'For one random hour daily, actions have 50% chance for 45-55% increased NetWorth rewards.',
    tier: 'Mythic',
    type: 'PASSIVE',
    abilityName: 'Midas_Touch',
    description: 'For one random hour, once a day, actions have a 50% chance to provide 50% increased NetWorth rewards',
    owned: generateMockOwnership(24),
    aspectRequirements: [{ aspectName: 'Void Essence', required: 20 }],
    resonanceRequired: 200
  },

  // ============================================
  // GLITCH TIER (3 abilities)
  // ============================================
  {
    id: 'glitch_001',
    name: 'VVoid',
    tagline: 'Null Absorption',
    weaponLore: "Recovered from the Y2K bug's source code. Sometimes, very rarely, it fires a hole directly through reality. Losses that enter the VVoid are erased completely—not reduced, not mitigated, but deleted from existence. That timeline never happened.",
    skillDescription: '1% chance for any loss to become 0 NetWorth loss.',
    tier: 'Glitch',
    type: 'PASSIVE',
    abilityName: 'VVoid',
    description: '1% chance for any loss to become 0 NetWorth loss',
    owned: generateMockOwnership(25),
    aspectRequirements: [{ aspectName: 'Glitch Core', required: 3 }],
    resonanceRequired: 150
  },
  {
    id: 'glitch_002',
    name: 'Sccorch',
    tagline: 'Burning Fortune',
    weaponLore: 'This dice burned in a server fire at a Las Vegas casino in 1997. When your NetWorth ends in 7, the scorch marks glow and probability warps. Your next action doubles. The dice remembers the fire, and the fire remembers luck.',
    skillDescription: 'When NetWorth ends in 7, next action doubles NetWorth gains.',
    tier: 'Glitch',
    type: 'PASSIVE',
    abilityName: 'Sccorch',
    description: 'When your NetWorth ends in 7, your NEXT action doubles NetWorth gains',
    owned: generateMockOwnership(26),
    aspectRequirements: [{ aspectName: 'Glitch Core', required: 3 }],
    resonanceRequired: 150
  },
  {
    id: 'glitch_003',
    name: 'Corre',
    tagline: 'Glitch Cascade',
    weaponLore: 'Fragment of the Knight Capital glitch that lost $440 million in 45 minutes. Every 100th action triggers the same beautiful malfunction—your next three actions receive random multipliers between 0-200%. The cascade cannot be controlled, only embraced.',
    skillDescription: 'Every 100th action triggers cascade with next 3 actions getting random 0-200% multipliers.',
    tier: 'Glitch',
    type: 'PASSIVE',
    abilityName: 'Corre',
    description: 'Every 100th action triggers cascade: next 3 actions have random 0-200% multipliers',
    owned: generateMockOwnership(27),
    aspectRequirements: [{ aspectName: 'Glitch Core', required: 3 }],
    resonanceRequired: 150
  }
]
