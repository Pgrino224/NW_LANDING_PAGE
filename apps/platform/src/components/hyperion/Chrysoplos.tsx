import { useState } from 'react'
import StatusModal from '../common/StatusModal'
import type { ChryspolosItem, Aspect } from './types'
import { TIER_COLORS, CHRYSOPLOS_LIBRARY } from './types'

// Helper function to convert Chrysoplos name to image filename
const getImageFilename = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[']/g, '')     // Remove apostrophes
    .replace(/ö/g, 'o')      // Normalize special characters (Gödel → Godel)
    .replace(/\s+/g, '-')    // Replace spaces with hyphens
}

// Helper function to get decorative border SVG based on tier
const getBorderSvg = (tier: ChryspolosTier): string => {
  return `/hyperion/decorations/chrysoplos-border-white/${tier.toLowerCase()}-border-white.svg`
}

const mockAspects: Aspect[] = [
  { id: '1', name: 'Void Essence', count: 15, requiredCount: 20, unlocksChrysoplos: 'Void Master', tier: 'Mythic' },
  { id: '2', name: 'Storm Fragment', count: 8, requiredCount: 10, unlocksChrysoplos: 'Thunder God', tier: 'Unique' },
  { id: '3', name: 'Shadow Shard', count: 5, requiredCount: 5, unlocksChrysoplos: 'Night Stalker', tier: 'Rare' },
  { id: '4', name: 'Glitch Core', count: 12, requiredCount: 3, unlocksChrysoplos: 'Corrupted One', tier: 'Glitch' },
]

// Group items by tier
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
  return tiers
}

export default function Chrysoplos() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [equippedChrysoplos, setEquippedChrysoplos] = useState<ChryspolosItem>(CHRYSOPLOS_LIBRARY[0])
  const [userResonance] = useState(150) // Mock user resonance

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

    // Only equip if owned
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

    // Show success notification
    setStatusModal({
      isOpen: true,
      type: 'success',
      title: 'Forging Successful',
      message: `You have successfully forged ${selectedChrysoplos.name}!`
    })

    // Here you would typically:
    // - Deduct aspects from inventory
    // - Deduct resonance
    // - Mark chrysoplos as owned
    // - Update backend/state management
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
          <div className="w-[25%] overflow-y-auto custom-scrollbar">
            <div className="px-6 pb-6">
              {Object.entries(groupedInventory).map(([tier, items]) => {
                if (items.length === 0) return null

                return (
                  <div key={tier} className="mb-6 last:mb-0">
                    {/* Items Grid - 4 per row */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {items.map((item) => {
                        const isSelected = selectedChrysoplos.id === item.id
                        const isEquipped = equippedChrysoplos.id === item.id

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`relative aspect-square rounded-lg transition-all duration-300 ease-in-out overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 shadow-lg ${
                              isSelected
                                ? 'border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                                : 'border-white/20 hover:border-white/30'
                            }`}
                            style={{
                              filter: item.owned ? 'grayscale(0%)' : 'grayscale(100%)',
                              opacity: item.owned ? 1 : 0.3,
                            }}
                          >
                            {/* Tier-specific background image */}
                            <img
                              src={`/hyperion/chrysoplos-squares/${item.tier.toLowerCase()}-square.webp`}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Chrysoplos Image */}
                            <img
                              src={`/hyperion/chrysoplos-images/${getImageFilename(item.name)}.png`}
                              alt={item.name}
                              className="absolute inset-0 w-full h-full object-contain p-2"
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
                      className="h-px bg-gradient-to-r from-transparent to-transparent"
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
          <div className="w-[45%] overflow-y-auto custom-scrollbar">
            <div className="px-12 pb-12 flex flex-col items-center">
              {/* Weapon Name - Top Left */}
              <div className="w-full max-w-[601px] mb-6">
                <h2 className="text-white text-3xl font-['Geist_Mono'] font-semibold text-left">
                  {selectedChrysoplos.name}
                </h2>
              </div>

              {/* Large Chrysoplos Visual with Decorative Border - 3:2 Aspect Ratio */}
              <div className="relative w-[600px] h-[400px] mb-8">
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg overflow-hidden">
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
                  src={getBorderSvg(selectedChrysoplos.tier)}
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
                    {selectedChrysoplos.skillDescription || selectedChrysoplos.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Separator 2 */}
          <div className="w-px bg-gradient-to-b from-transparent via-white/[0.1] to-transparent" />

          {/* RIGHT SECTION - Forge Panel */}
          <div className="w-[30%] overflow-y-auto custom-scrollbar p-8">
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
                      src={`/hyperion/chrysoplos-images/${getImageFilename(selectedChrysoplos.name)}.png`}
                      alt={selectedChrysoplos.name}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const placeholder = target.nextElementSibling as HTMLElement
                        if (placeholder) placeholder.style.display = 'flex'
                      }}
                    />
                    <span className="text-4xl text-gray-600 font-bold font-['Geist_Mono']" style={{ display: 'none' }}>C</span>
                    <img
                      src={`/hyperion/chrysoplos-tiers/${selectedChrysoplos.tier.toLowerCase()}-icon.svg`}
                      alt={`${selectedChrysoplos.tier} tier`}
                      className="absolute top-1 right-1 w-5 h-5"
                      style={{
                        filter: `drop-shadow(0 0 4px ${TIER_COLORS[selectedChrysoplos.tier]}80)`
                      }}
                    />
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
                        src={`/hyperion/chrysoplos-images/${getImageFilename(selectedChrysoplos.name)}.png`}
                        alt={selectedChrysoplos.name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const placeholder = target.nextElementSibling as HTMLElement
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                      />
                      <span className="text-4xl text-gray-600 font-bold font-['Geist_Mono']" style={{ display: 'none' }}>C</span>
                      <img
                        src={`/hyperion/chrysoplos-tiers/${selectedChrysoplos.tier.toLowerCase()}-icon.svg`}
                        alt={`${selectedChrysoplos.tier} tier`}
                        className="absolute top-1 right-1 w-5 h-5"
                        style={{
                          filter: `drop-shadow(0 0 4px ${TIER_COLORS[selectedChrysoplos.tier]}80)`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Spacer to push bottom section down */}
              <div className="flex-1" />

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

                      return (
                        <div
                          key={req.aspectName}
                          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/[0.1] rounded-md flex items-center justify-center">
                              <span className="text-xs font-bold font-['Geist_Mono'] text-gray-400">A</span>
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
