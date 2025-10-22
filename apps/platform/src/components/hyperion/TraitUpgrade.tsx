import { useState } from 'react'
import { useBalance } from '../../contexts/BalanceContext'
import ResonanceIcon from '../shared/ResonanceIcon'
import TraitsRadarChart from './TraitsRadarChart'

interface Trait {
  id: string
  name: string
  icon: string
  level: number
  maxLevel: number
}

const TRAIT_COLORS: Record<string, string> = {
  'analysis': '#1F2937',      // Dark Gray/Black
  'confidence': '#F59E0B',    // Amber/Gold
  'execution': '#EF4444',     // Red
  'innovation': '#8B5CF6',    // Purple
  'integrity': '#10B981',     // Emerald Green
  'preservation': '#06B6D4',  // Cyan
  'resilience': '#F97316',    // Orange
  'spirit': '#3B82F6',        // Blue
  'versatility': '#14B8A6',   // Teal
  'vision': '#A855F7'         // Light Purple
}

const TRAITS_DATA: Trait[] = [
  { id: 'analysis', name: 'Analysis', icon: '/hyperion/traits/analysis.svg', level: 3.5, maxLevel: 7.0 },
  { id: 'confidence', name: 'Confidence', icon: '/hyperion/traits/confidence.svg', level: 2.0, maxLevel: 7.0 },
  { id: 'execution', name: 'Execution', icon: '/hyperion/traits/execution.svg', level: 4.2, maxLevel: 7.0 },
  { id: 'innovation', name: 'Innovation', icon: '/hyperion/traits/innovation.svg', level: 1.5, maxLevel: 7.0 },
  { id: 'integrity', name: 'Integrity', icon: '/hyperion/traits/integrity.svg', level: 5.0, maxLevel: 7.0 },
  { id: 'preservation', name: 'Preservation', icon: '/hyperion/traits/preservation.svg', level: 2.8, maxLevel: 7.0 },
  { id: 'resilience', name: 'Resilience', icon: '/hyperion/traits/resilience.svg', level: 3.0, maxLevel: 7.0 },
  { id: 'spirit', name: 'Spirit', icon: '/hyperion/traits/spirit.svg', level: 4.5, maxLevel: 7.0 },
  { id: 'versatility', name: 'Versatility', icon: '/hyperion/traits/versatility.svg', level: 1.8, maxLevel: 7.0 },
  { id: 'vision', name: 'Vision', icon: '/hyperion/traits/vision.svg', level: 3.2, maxLevel: 7.0 },
]

// Dynamic trait upgrade costs based on trait level
const getUpgradeCost = (currentLevel: number): number => {
  const traitUpgradeCosts: Record<number, number> = {
    0: 10,   // 0.00-1.00 range: 10 resonance per 0.1
    1: 15,   // 1.00-2.00 range: 15 resonance per 0.1
    2: 20,   // 2.00-3.00 range: 20 resonance per 0.1
    3: 30,   // 3.00-4.00 range: 30 resonance per 0.1
    4: 40,   // 4.00-5.00 range: 40 resonance per 0.1
    5: 80,   // 5.00-6.00 range: 80 resonance per 0.1 (2x scaling)
    6: 160,  // 6.00-7.00 range: 160 resonance per 0.1 (4x scaling)
    7: 320   // 7.00+ range: 320 resonance per 0.1 (8x scaling)
  }
  const tier = Math.floor(currentLevel)
  return traitUpgradeCosts[Math.min(tier, 7)]
}

export default function TraitUpgrade() {
  const [traits, setTraits] = useState<Trait[]>(TRAITS_DATA)
  const [pendingUpgrades, setPendingUpgrades] = useState<Record<string, number>>({})
  const { balances, updateBalance } = useBalance()

  const incrementUpgrade = (traitId: string) => {
    const trait = traits.find(t => t.id === traitId)
    if (!trait) return

    const currentPending = pendingUpgrades[traitId] || 0
    const newLevel = trait.level + (currentPending + 1) * 0.1

    // Check if would exceed max level
    if (newLevel > trait.maxLevel) return

    // Check if can afford
    const cost = getUpgradeCost(trait.level + currentPending * 0.1)
    if (balances.resonance < calculateTotalCost() + cost) return

    setPendingUpgrades(prev => ({
      ...prev,
      [traitId]: currentPending + 1
    }))
  }

  const decrementUpgrade = (traitId: string) => {
    setPendingUpgrades(prev => ({
      ...prev,
      [traitId]: Math.max(0, (prev[traitId] || 0) - 1)
    }))
  }

  const calculateTotalCost = () => {
    return Object.entries(pendingUpgrades).reduce((total, [traitId, count]) => {
      const trait = traits.find(t => t.id === traitId)
      if (!trait || count === 0) return total

      let cost = 0
      for (let i = 0; i < count; i++) {
        cost += getUpgradeCost(trait.level + i * 0.1)
      }
      return total + cost
    }, 0)
  }

  const getTotalPendingUpgrades = () => {
    return Object.values(pendingUpgrades).reduce((sum, count) => sum + count, 0)
  }

  const handleConfirmUpgrades = () => {
    const totalCost = calculateTotalCost()

    if (balances.resonance < totalCost) {
      alert('Not enough Resonance!')
      return
    }

    // Apply all upgrades
    setTraits(prevTraits => prevTraits.map(trait => {
      const pending = pendingUpgrades[trait.id] || 0
      if (pending === 0) return trait

      return {
        ...trait,
        level: Math.min(trait.maxLevel, Math.round((trait.level + pending * 0.1) * 10) / 10)
      }
    }))

    // Deduct cost
    updateBalance('resonance', balances.resonance - totalCost)

    // Clear pending upgrades
    setPendingUpgrades({})
  }

  const handleCancel = () => {
    setPendingUpgrades({})
  }

  return (
    <div
      className="w-full h-screen relative overflow-y-auto custom-scrollbar font-['Geist']"
      style={{
        backgroundImage: 'url(/hyperion/hyperion-bg/hyperion-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <img src="/hyperion/title-icons/traits.svg" alt="" className="w-12 h-12" />
            <h1 className="font-geist-bold text-white text-3xl">TRAITS</h1>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="max-w-[1200px] mx-auto space-y-6">
            {/* Top Row: Balance Card with buttons spanning full width */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Cancel and Confirm Buttons side by side */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={getTotalPendingUpgrades() === 0}
                    className={`px-4 py-2 rounded-lg font-['Geist_Mono'] text-sm font-semibold transition-all duration-300 ${
                      getTotalPendingUpgrades() === 0
                        ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/20'
                        : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                    }`}
                  >
                    CANCEL
                  </button>

                  <button
                    onClick={handleConfirmUpgrades}
                    disabled={getTotalPendingUpgrades() === 0}
                    className={`px-4 py-2 rounded-lg font-['Geist_Mono'] text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1 whitespace-nowrap ${
                      getTotalPendingUpgrades() === 0
                        ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/20'
                        : 'text-white shadow-lg hover:shadow-xl hover:scale-105'
                    }`}
                    style={getTotalPendingUpgrades() > 0 ? { backgroundColor: '#84cc16', boxShadow: '0 10px 15px -3px rgba(132, 204, 22, 0.3)' } : {}}
                  >
                    <span>CONFIRM</span>
                    {getTotalPendingUpgrades() > 0 && (
                      <span className="flex items-center gap-1 text-xs">
                        ({calculateTotalCost()} <ResonanceIcon className="w-3 h-3" />)
                      </span>
                    )}
                  </button>
                </div>

                {/* Resonance Balance on right */}
                <div className="flex items-center gap-3">
                  <ResonanceIcon className="w-6 h-6" />
                  <span className="text-white font-geist-mono text-2xl font-bold">
                    {balances.resonance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content: Radar Chart + Single Column Trait List */}
            <div className="grid grid-cols-[600px_550px] gap-12">
              {/* Left: Radar Chart */}
              <div>
                <TraitsRadarChart traits={traits} pendingUpgrades={pendingUpgrades} />
              </div>

              {/* Right: Single Column Trait List */}
              <div className="space-y-3">
                {traits.map((trait) => (
                  <div
                    key={trait.id}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-3 flex items-center gap-3"
                  >
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-md border border-white/20 flex items-center justify-center p-1.5"
                      style={{ backgroundColor: `${TRAIT_COLORS[trait.id]}40` }}
                    >
                      <img
                        src={trait.icon}
                        alt={trait.name}
                        className="w-full h-full object-contain filter brightness-0 invert"
                      />
                    </div>

                    {/* Trait Name */}
                    <span className="text-white font-['Geist_Mono'] text-sm font-medium w-28">
                      {trait.name}
                    </span>

                    {/* Current Level / Max Level */}
                    <span className="font-['Geist_Mono'] text-sm w-16">
                      <span className="text-white font-bold">{trait.level.toFixed(1)}</span>
                      <span className="text-white/40 text-xs">/{trait.maxLevel.toFixed(1)}</span>
                    </span>

                    {/* Spacer */}
                    <div className="flex-1"></div>

                    {/* Decrement Button */}
                    <button
                      onClick={() => decrementUpgrade(trait.id)}
                      disabled={(pendingUpgrades[trait.id] || 0) <= 0}
                      className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-300 ${
                        (pendingUpgrades[trait.id] || 0) <= 0
                          ? 'bg-white/20 text-white/40 cursor-not-allowed'
                          : 'bg-white/30 text-white hover:bg-white/40'
                      }`}
                    >
                      <span className="text-lg leading-none">−</span>
                    </button>

                    {/* Pending Upgrade Value (starts at 0.0) */}
                    <div className="w-12 text-center">
                      <span className="text-white font-geist-mono text-base font-bold">
                        {((pendingUpgrades[trait.id] || 0) * 0.1).toFixed(1)}
                      </span>
                    </div>

                    {/* Increment Button */}
                    <button
                      onClick={() => incrementUpgrade(trait.id)}
                      disabled={trait.level >= trait.maxLevel}
                      className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-300 ${
                        trait.level >= trait.maxLevel
                          ? 'bg-white/20 text-white/40 cursor-not-allowed'
                          : 'bg-white/30 text-white hover:bg-white/40'
                      }`}
                    >
                      <span className="text-lg leading-none">+</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0.2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 0.5px;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 6px rgba(255, 255, 255, 1);
        }
        .custom-scrollbar::-webkit-scrollbar-button {
          display: none;
        }
      `}</style>
    </div>
  )
}
