import { useState, useEffect } from 'react'
import StatusModal from '../common/StatusModal'
import type { ChryspolosItem, Aspect } from './types'
import { TIER_COLORS, CHRYSOPLOS_LIBRARY, rollChryspolosStat, extractStatName, formatRolledStat } from './types'
import { useHyperion } from '../../contexts/HyperionContext'

// Helper function to convert Chrysoplos name to image filename
const getImageFilename = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[']/g, '')     // Remove apostrophes
    .replace(/ö/g, 'o')      // Normalize special characters (Gödel → Godel)
    .replace(/\s+/g, '-')    // Replace spaces with hyphens
}

// Helper function to get decorative border SVG
const getBorderSvg = (): string => {
  return `/hyperion/decorations/chrysoplos-border-white/border-white.svg`
}

const mockAspects: Aspect[] = [
  // RARE tier aspects (required: 5)
  { id: '1', name: 'Convergence Algorithm', count: 8, requiredCount: 5, unlocksChrysoplos: 'Convergence Algorithm', tier: 'Rare' },
  { id: '2', name: 'Resonance Protocol', count: 6, requiredCount: 5, unlocksChrysoplos: 'Resonance Protocol', tier: 'Rare' },
  { id: '3', name: 'Entropy Database', count: 5, requiredCount: 5, unlocksChrysoplos: 'Entropy Database', tier: 'Rare' },
  { id: '4', name: 'Synthesis Compiler', count: 7, requiredCount: 5, unlocksChrysoplos: 'Synthesis Compiler', tier: 'Rare' },
  { id: '5', name: 'Nexus Engine', count: 3, requiredCount: 5, unlocksChrysoplos: 'Nexus Engine', tier: 'Rare' },
  { id: '6', name: 'Paradox Matrix', count: 9, requiredCount: 5, unlocksChrysoplos: 'Paradox Matrix', tier: 'Rare' },
  { id: '7', name: 'Oracle Processor', count: 4, requiredCount: 5, unlocksChrysoplos: 'Oracle Processor', tier: 'Rare' },
  { id: '8', name: 'Equilibrium Core', count: 6, requiredCount: 5, unlocksChrysoplos: 'Equilibrium Core', tier: 'Rare' },
  { id: '9', name: 'Memetic Codec', count: 5, requiredCount: 5, unlocksChrysoplos: 'Memetic Codec', tier: 'Rare' },
  { id: '10', name: 'Veil Interface', count: 8, requiredCount: 5, unlocksChrysoplos: 'Veil Interface', tier: 'Rare' },
  { id: '11', name: 'Harbinger Array', count: 2, requiredCount: 5, unlocksChrysoplos: 'Harbinger Array', tier: 'Rare' },
  { id: '12', name: 'Monolith Node', count: 7, requiredCount: 5, unlocksChrysoplos: 'Monolith Node', tier: 'Rare' },

  // UNIQUE tier aspects (required: 10)
  { id: '13', name: 'All Weather Protocol', count: 12, requiredCount: 10, unlocksChrysoplos: 'All Weather Protocol', tier: 'Unique' },
  { id: '14', name: 'Turing Test', count: 8, requiredCount: 10, unlocksChrysoplos: 'Turing Test', tier: 'Unique' },
  { id: '15', name: "Gödel's Loop", count: 15, requiredCount: 10, unlocksChrysoplos: "Gödel's Loop", tier: 'Unique' },
  { id: '16', name: 'Basilisk Gaze', count: 9, requiredCount: 10, unlocksChrysoplos: 'Basilisk Gaze', tier: 'Unique' },
  { id: '17', name: "Maxwell's Demon", count: 11, requiredCount: 10, unlocksChrysoplos: "Maxwell's Demon", tier: 'Unique' },
  { id: '18', name: "Schrödinger's Trade", count: 6, requiredCount: 10, unlocksChrysoplos: "Schrödinger's Trade", tier: 'Unique' },
  { id: '19', name: 'Ship of Theseus', count: 13, requiredCount: 10, unlocksChrysoplos: 'Ship of Theseus', tier: 'Unique' },
  { id: '20', name: "Laplace's Oracle", count: 10, requiredCount: 10, unlocksChrysoplos: "Laplace's Oracle", tier: 'Unique' },

  // MYTHIC tier aspects (required: 15)
  { id: '21', name: 'Fire of Prometheus', count: 18, requiredCount: 15, unlocksChrysoplos: 'Fire of Prometheus', tier: 'Mythic' },
  { id: '22', name: "Pandora's Box", count: 12, requiredCount: 15, unlocksChrysoplos: "Pandora's Box", tier: 'Mythic' },
  { id: '23', name: 'Wings of Icarus', count: 14, requiredCount: 15, unlocksChrysoplos: 'Wings of Icarus', tier: 'Mythic' },
  { id: '24', name: "Sisyphus' Rock", count: 16, requiredCount: 15, unlocksChrysoplos: "Sisyphus' Rock", tier: 'Mythic' },
  { id: '25', name: 'Midas Touch', count: 11, requiredCount: 15, unlocksChrysoplos: 'Midas Touch', tier: 'Mythic' },

  // GLITCH tier aspects (required: 20)
  { id: '26', name: 'VVoid', count: 22, requiredCount: 20, unlocksChrysoplos: 'VVoid', tier: 'Glitch' },
  { id: '27', name: 'Sccorch', count: 19, requiredCount: 20, unlocksChrysoplos: 'Sccorch', tier: 'Glitch' },
  { id: '28', name: 'Corre', count: 25, requiredCount: 20, unlocksChrysoplos: 'Corre', tier: 'Glitch' },
]

// Group items by tier and sort by ownership (owned first)
const groupByTier = (items: ChryspolosItem[]) => {
  const tiers: { [key: string]: ChryspolosItem[] } = {
    'Rare': [],
    'Unique': [],
    'Mythic': [],
    'Glitch': []
  }
  items.forEach(item => {
    if (tiers[item.tier]) {
      tiers[item.tier].push(item)
    }
  })

  // Sort each tier: owned items first, then unowned
  Object.keys(tiers).forEach(tier => {
    tiers[tier].sort((a, b) => {
      if (a.owned === b.owned) return 0
      return a.owned ? -1 : 1
    })
  })

  return tiers
}

export default function Chrysoplos() {
  const { equippedChrysoplos, setEquippedChrysoplos } = useHyperion()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [userResonance] = useState(150) // Mock user resonance

  // Initialize equipped chrysoplos if none set
  useEffect(() => {
    if (!equippedChrysoplos) {
      setEquippedChrysoplos(CHRYSOPLOS_LIBRARY[0])
    }
  }, [])

  // Status modal state
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'info',
    title: '',
    message: ''
  })

  const selectedChrysoplos = CHRYSOPLOS_LIBRARY[selectedIndex]
  const groupedInventory = groupByTier(CHRYSOPLOS_LIBRARY)

  // Handle click on item - selects AND equips (only if owned)
  const handleItemClick = (item: ChryspolosItem) => {
    // Always allow selection (update selectedIndex)
    const index = CHRYSOPLOS_LIBRARY.findIndex(c => c.id === item.id)
    if (index !== -1) {
      setSelectedIndex(index)
    }

    // Only equip if owned - this will sync to HubPanel via context
    if (item.owned) {
      setEquippedChrysoplos(item)
    }
  }

  // Handle forging
  const handleForge = () => {
    // Check if item is already owned
    if (selectedChrysoplos.owned) {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Already Owned',
        message: 'You already own this Chrysoplos!'
      })
      return
    }

    // Check aspect requirements
    const hasAllAspects = selectedChrysoplos.aspectRequirements?.every(req => {
      const aspect = mockAspects.find(a => a.name === req.aspectName)
      return aspect && aspect.count >= req.required
    }) ?? true

    // Check resonance requirement
    const hasResonance = userResonance >= (selectedChrysoplos.resonanceRequired ?? 0)

    if (!hasAllAspects || !hasResonance) {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Insufficient Resources',
        message: 'You do not have enough aspects or resonance to forge this Chrysoplos.'
      })
      return
    }

    // Roll the stat for this Chrysoplos
    const rolledValue = rollChryspolosStat(selectedChrysoplos.skillDescription || '')
    const statName = extractStatName(selectedChrysoplos.skillDescription || '')
    const formattedRoll = rolledValue !== null
      ? formatRolledStat(rolledValue, selectedChrysoplos.skillDescription || '')
      : null

    // Show success notification with rolled value
    setStatusModal({
      isOpen: true,
      type: 'success',
      title: 'Forging Successful',
      message: formattedRoll
        ? `You have successfully forged ${selectedChrysoplos.name}!\n\nYour roll: ${formattedRoll} ${statName}`
        : `You have successfully forged ${selectedChrysoplos.name}!`
    })

    // Here you would typically:
    // - Store rolledValue and statName in user's Chrysoplos inventory (backend call)
    // - Mark chrysoplos as owned with the rolled stats
    // - Deduct aspects from inventory
    // - Deduct resonance
    // - Update backend/state management

    // TODO: Backend integration to persist:
    // { ...selectedChrysoplos, owned: true, rolledValue, rolledStatName: statName }
  }

  // Check if user can forge the selected chrysoplos
  const canForge = () => {
    if (selectedChrysoplos.owned) return false

    const hasAllAspects = selectedChrysoplos.aspectRequirements?.every(req => {
      const aspect = mockAspects.find(a => a.name === req.aspectName)
      return aspect && aspect.count >= req.required
    }) ?? true

    const hasResonance = userResonance >= (selectedChrysoplos.resonanceRequired ?? 0)

    return hasAllAspects && hasResonance
  }

  return (
    <div
      className="w-full h-screen relative overflow-hidden font-['Geist']"
      style={{
        backgroundImage: 'url(/hyperion/hyperion-bg/hyperion-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Status Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        variant="default"
        autoCloseDuration={3000}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Title */}
        <div className="px-8 py-6">
          <div className="flex items-center gap-3">
            <img src="/hyperion/title-icons/chrysoplos.svg" alt="" className="w-12 h-12" />
            <h1 className="font-geist-bold text-white text-3xl">CHRYSOPLOS</h1>
          </div>
        </div>

        {/* Three-Section Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SECTION - Inventory Grid */}
          <div className="w-[30%] overflow-y-auto custom-scrollbar">
            <div className="px-6 pb-6">
              {/* Instruction Text */}
              <div className="mb-4 text-center">
                <p className="text-white/60 text-xs uppercase tracking-wider font-['Geist_Mono']">
                  Click to Equip Chrysoplos
                </p>
              </div>

              {Object.entries(groupedInventory).map(([tier, items]) => {
                if (items.length === 0) return null

                return (
                  <div key={tier} className="mb-6 last:mb-0">
                    {/* Items Grid - 4 per row */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {items.map((item) => {
                        const isSelected = selectedChrysoplos.id === item.id
                        const isEquipped = equippedChrysoplos?.id === item.id

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`relative w-16 h-16 rounded-lg transition-all duration-300 ease-in-out overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 shadow-lg ${
                              isSelected
                                ? 'border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                                : 'border-white/20 hover:border-white/30'
                            }`}
                            style={{
                              filter: item.owned ? 'grayscale(0%)' : 'grayscale(100%)',
                              opacity: item.owned ? 1 : 0.3,
                              boxShadow: item.owned
                                ? `0 0 8px ${TIER_COLORS[item.tier]}80, inset 0 0 12px ${TIER_COLORS[item.tier]}30`
                                : isSelected
                                  ? '0 0 12px rgba(59, 130, 246, 0.4)'
                                  : 'none'
                            }}
                          >
                            {/* Chrysoplos Image */}
                            <img
                              src={`/hyperion/chrysoplos-images/${getImageFilename(item.name)}.png`}
                              alt={item.name}
                              className="absolute inset-0 w-full h-full object-contain p-1"
                              onError={(e) => {
                                // Fallback to placeholder if image not found
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const placeholder = target.nextElementSibling as HTMLElement
                                if (placeholder) placeholder.style.display = 'flex'
                              }}
                            />
                            {/* Fallback Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                              <span className="text-2xl text-gray-600 font-bold font-['Geist_Mono']">C</span>
                            </div>

                            {/* Equipped Indicator */}
                            {isEquipped && item.owned && (
                              <div className="absolute top-1 left-1">
                                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}

                            {/* New Badge */}
                            {item.isNew && item.owned && (
                              <div className="absolute bottom-0 left-0 right-0 bg-blue-500/80 text-white text-[8px] uppercase tracking-wider font-['Geist_Mono'] py-0.5 text-center">
                                New
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Horizontal Separator with Tier Color */}
                    <div
                      className="h-1 bg-gradient-to-r from-transparent to-transparent"
                      style={{
                        backgroundImage: `linear-gradient(to right, transparent, ${TIER_COLORS[tier as keyof typeof TIER_COLORS]}60, transparent)`
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Vertical Separator 1 */}
          <div className="w-px bg-gradient-to-b from-transparent via-white/[0.1] to-transparent" />

          {/* CENTER SECTION - Chrysoplos Details */}
          <div className="w-[40%] overflow-y-auto custom-scrollbar">
            <div className="px-12 pb-12 flex flex-col items-center">
              {/* Weapon Name - Top Left */}
              <div className="w-full max-w-[601px] mb-6">
                <h2 className="text-white text-3xl font-['Geist_Mono'] font-semibold text-left leading-none m-0">
                  {selectedChrysoplos.name}
                </h2>
              </div>

              {/* Large Chrysoplos Visual with Decorative Border - 3:2 Aspect Ratio */}
              <div className="relative w-[600px] h-[400px] mb-8">
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-lg overflow-hidden">
                  {/* Chrysoplos Image */}
                  <img
                    src={`/hyperion/chrysoplos-images/${getImageFilename(selectedChrysoplos.name)}.png`}
                    alt={selectedChrysoplos.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Hide image if not found, show gradient background instead
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />

                  {/* Not Owned Overlay */}
                  {!selectedChrysoplos.owned && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white/60 text-xl uppercase tracking-wider font-['Geist_Mono']">Not Owned</span>
                    </div>
                  )}
                </div>

                {/* Border Overlay */}
                <img
                  src={getBorderSvg()}
                  alt=""
                  className="absolute inset-0 w-full h-full pointer-events-none rounded-lg"
                  style={{ objectFit: 'fill' }}
                />
              </div>

              {/* Description Sections - Elden Ring Style */}
              <div className="w-full max-w-[601px] space-y-0">
                {/* Weapon Lore Section - FIRST */}
                <div className="border-t border-white/[0.15] pt-4 pb-4">
                  <p className="text-white/80 text-sm leading-relaxed font-['Geist_Mono']">
                    {selectedChrysoplos.weaponLore || selectedChrysoplos.description}
                  </p>
                </div>

                {/* Skill Section - Shows skill name and description together */}
                <div className="border-t border-white/[0.15] pt-4 pb-4">
                  <h3 className="text-white text-base font-semibold font-['Geist_Mono'] mb-2">
                    Unique Skill: {selectedChrysoplos.tagline}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed font-['Geist_Mono']">
                    {(() => {
                      const description = selectedChrysoplos.skillDescription || selectedChrysoplos.description
                      // If owned and has rolled value, replace range with rolled value
                      if (selectedChrysoplos.owned && selectedChrysoplos.rolledValue !== null && selectedChrysoplos.rolledValue !== undefined) {
                        return description.replace(
                          /(\d+\.?\d*)\s*-\s*(\d+\.?\d*)(%?)/,
                          `${selectedChrysoplos.rolledValue}$3`
                        )
                      }
                      // Otherwise show the range
                      return description
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Separator 2 */}
          <div className="w-px bg-gradient-to-b from-transparent via-white/[0.1] to-transparent" />

          {/* RIGHT SECTION - Forge Panel */}
          <div className="w-[30%] overflow-y-auto custom-scrollbar px-8 pb-8">
            {/* Single Liquid Glass Container wrapping entire forge panel */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-8 flex flex-col h-full">
              {/* Item to Forge Section */}
              <div className="text-center mb-8">
                <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-['Geist_Mono']">
                  ITEM TO FORGE
                </h3>
                <div className="flex justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg flex items-center justify-center relative">
                    <img
                      src={`/hyperion/aspect-borders/${selectedChrysoplos.tier.toLowerCase()}-aspect.svg`}
                      alt=""
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ objectFit: 'contain' }}
                    />
                    <img
                      src={`/hyperion/chrysoplos-images/${getImageFilename(selectedChrysoplos.name)}.png`}
                      alt={selectedChrysoplos.name}
                      className="w-full h-full object-contain p-2 relative z-10"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const placeholder = target.nextElementSibling as HTMLElement
                        if (placeholder) placeholder.style.display = 'flex'
                      }}
                    />
                    <span className="text-4xl text-gray-600 font-bold font-['Geist_Mono'] relative z-10" style={{ display: 'none' }}>C</span>
                  </div>
                </div>
              </div>

              {/* Connection Line */}
              <div className="flex justify-center my-4">
                <div className="flex flex-col items-center">
                  <div className="w-px h-6 bg-gradient-to-b from-white/40 to-white/60"></div>
                  <div className="text-white/60 text-xs">▼</div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="text-center mb-8">
                <h3 className="text-white text-xs uppercase tracking-widest mb-4 font-['Geist_Mono']">
                  PREVIEW
                </h3>
                {selectedChrysoplos.owned ? (
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-3">
                    <p className="text-green-400 text-sm">Already Owned</p>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg flex items-center justify-center relative">
                      <img
                        src={`/hyperion/aspect-borders/${selectedChrysoplos.tier.toLowerCase()}-aspect.svg`}
                        alt=""
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ objectFit: 'contain' }}
                      />
                      <img
                        src={`/hyperion/chrysoplos-images/${getImageFilename(selectedChrysoplos.name)}.png`}
                        alt={selectedChrysoplos.name}
                        className="w-full h-full object-contain p-2 relative z-10"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const placeholder = target.nextElementSibling as HTMLElement
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                      />
                      <span className="text-4xl text-gray-600 font-bold font-['Geist_Mono'] relative z-10" style={{ display: 'none' }}>C</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Spacer to push bottom section down */}
              <div className="flex-1" />

              {/* Rolled/Possible Stat Display */}
              {(() => {
                const skillDesc = selectedChrysoplos.skillDescription || ''
                const hasRange = /\d+\.?\d*\s*-\s*\d+\.?\d*/.test(skillDesc)

                if (!hasRange) return null // No rollable stats (e.g., Synthesis Compiler, VVoid, etc.)

                // If owned, show actual rolled value
                if (selectedChrysoplos.owned && selectedChrysoplos.rolledValue !== null && selectedChrysoplos.rolledValue !== undefined) {
                  return (
                    <div className="mb-6">
                      <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur-xl border border-cyan-400/30 rounded-lg shadow-lg p-4 text-center">
                        <h4 className="text-cyan-400 text-xs uppercase tracking-widest mb-2 font-['Geist_Mono']">
                          YOUR ROLL
                        </h4>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-white text-2xl font-bold font-['Geist_Mono']">
                            {formatRolledStat(selectedChrysoplos.rolledValue, skillDesc)}
                          </p>
                          <p className="text-white/60 text-xs uppercase tracking-wider font-['Geist_Mono']">
                            {selectedChrysoplos.rolledStatName || extractStatName(skillDesc)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                }

                // If not owned, show possible range
                const rangeMatch = skillDesc.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)(%?)/)
                if (!selectedChrysoplos.owned && rangeMatch) {
                  return (
                    <div className="mb-6">
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-4 text-center">
                        <h4 className="text-white/60 text-xs uppercase tracking-widest mb-2 font-['Geist_Mono']">
                          POSSIBLE ROLL
                        </h4>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-white text-2xl font-bold font-['Geist_Mono']">
                            {rangeMatch[1]} - {rangeMatch[2]}{rangeMatch[3]}
                          </p>
                          <p className="text-white/60 text-xs uppercase tracking-wider font-['Geist_Mono']">
                            {extractStatName(skillDesc)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                }

                return null
              })()}

              {/* Material Cost Title */}
              <h3 className="text-[#ffffe4]/60 text-xs uppercase tracking-widest mb-4 font-['Geist_Mono'] text-center">
                MATERIAL COST
              </h3>

              {/* Bottom Section - Material Cost Cards + Forge Button */}
              <div className="flex gap-3 items-stretch">
                {/* Left - Aspect Cards */}
                {selectedChrysoplos.aspectRequirements && selectedChrysoplos.aspectRequirements.length > 0 && (
                  <div className="flex-1 space-y-2">
                    {selectedChrysoplos.aspectRequirements.map((req) => {
                      const aspect = mockAspects.find(a => a.name === req.aspectName)
                      const hasEnough = aspect ? aspect.count >= req.required : false
                      const aspectTier = aspect?.tier.toLowerCase() || 'rare'

                      return (
                        <div
                          key={req.aspectName}
                          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 flex items-center justify-center">
                              <img
                                src={`/hyperion/aspect-borders/${aspectTier}-aspect.svg`}
                                alt={`${aspect?.tier || 'Rare'} aspect`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="text-white text-xs font-['Geist_Mono']">{req.aspectName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`text-lg font-bold font-['Geist_Mono'] ${hasEnough ? 'text-white' : 'text-red-400'}`}>
                              {aspect?.count || 0}
                            </span>
                            <span className="text-gray-500 text-xs font-['Geist_Mono']">/ {req.required}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Right - Forge Button */}
                <button
                  onClick={handleForge}
                  disabled={!canForge()}
                  className={`w-32 text-sm uppercase tracking-wider font-['Geist_Mono'] transition-all border rounded-lg flex flex-col items-center justify-center ${
                    canForge()
                      ? 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 shadow-lg text-white cursor-pointer hover:border-white/30'
                      : 'bg-black/40 text-gray-600 cursor-not-allowed border-gray-700'
                  }`}
                >
                  <span className="mb-1">FORGE</span>
                  {selectedChrysoplos.resonanceRequired !== undefined && (
                    <span className="text-xs">({selectedChrysoplos.resonanceRequired} ◆)</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
