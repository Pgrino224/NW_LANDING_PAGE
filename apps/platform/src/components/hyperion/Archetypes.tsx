import { useState, useEffect, useCallback } from 'react'
import { ARCHETYPES, TRAIT_ICONS, type Archetype } from '../../services/hyperion/archetypes'

export default function Archetypes() {
  const [selectedIndex, setSelectedIndex] = useState(0) // Default to first archetype
  const selectedArchetype = ARCHETYPES[selectedIndex]

  // Calculate offset to keep selected card perfectly centered (like game carousels)
  const calculateOffset = useCallback((index: number) => {
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    const CARD_WIDTH = 80 // Base card size
    const GAP = 12 // Gap between cards (must match CSS gap-3 which is 12px)
    const SCALE = 1.15 // Scale factor for selected card

    // Calculate the position of the selected card in the track
    const cardWithGap = CARD_WIDTH + GAP
    const selectedCardOffset = index * cardWithGap

    // Calculate center position of viewport
    const viewportCenter = containerWidth / 2

    // Calculate center position of card, accounting for scale transform
    // When a card scales, it grows equally on both sides, so we need to adjust
    // The visual center shifts by half the difference in size
    const scaledCardWidth = CARD_WIDTH * SCALE
    const scaleDifference = scaledCardWidth - CARD_WIDTH
    const scaleAdjustment = scaleDifference / 2

    const cardCenter = CARD_WIDTH / 2

    // The offset needed to center the selected card
    // Add scaleAdjustment to compensate for the visual size increase from scale transform
    return viewportCenter - cardCenter - selectedCardOffset + scaleAdjustment
  }, [])

  const [carouselOffset, setCarouselOffset] = useState(calculateOffset(selectedIndex))

  // Handle archetype selection
  const handleSelect = (index: number) => {
    setSelectedIndex(index)
    setCarouselOffset(calculateOffset(index))
  }

  // Handle carousel navigation one card at a time
  const scrollBy = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left'
      ? Math.max(0, selectedIndex - 1)
      : Math.min(ARCHETYPES.length - 1, selectedIndex + 1)
    handleSelect(newIndex)
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && selectedIndex > 0) {
        handleSelect(selectedIndex - 1)
      } else if (e.key === 'ArrowRight' && selectedIndex < ARCHETYPES.length - 1) {
        handleSelect(selectedIndex + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex])

  // Recalculate offset on window resize
  useEffect(() => {
    const handleResize = () => {
      setCarouselOffset(calculateOffset(selectedIndex))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [selectedIndex, calculateOffset])

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
      {/* Character Image */}
      <div className="absolute inset-0 z-0 flex items-center justify-start pl-16">
        <div className="relative w-[50%] h-full flex items-center justify-center">
          <img
            src={`/hyperion/archetypes/${selectedArchetype.tier.toLowerCase()}/${selectedArchetype.id.replace('the-', '')}.png`}
            alt={selectedArchetype.name}
            className="h-[85%] w-auto object-contain transition-opacity duration-500"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(0, 0, 0, 0.5))'
            }}
          />
          {/* Gradient fade on right edge */}
          <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Title */}
        <div className="px-8 py-6">
          <div className="flex items-center gap-3">
            <img src="/hyperion/title-icons/archetypes.svg" alt="" className="w-12 h-12" />
            <h1 className="font-geist-bold text-white text-3xl">ARCHETYPES</h1>
          </div>
        </div>

        {/* Content Area - Right Side Info Panel */}
        <div className="flex-1 flex items-start justify-end px-16 pt-12">
          <div className="w-[500px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-8 space-y-6">
            {/* NMTI Code */}
            <div className="text-cyan-400 text-sm uppercase tracking-widest font-['Geist_Mono']">
              {selectedArchetype.nmtiCode}
            </div>

            {/* Archetype Name */}
            <h2 className="text-white text-5xl font-['Geist_Mono'] font-semibold leading-tight">
              {selectedArchetype.name}
            </h2>

            {/* Trait Icons */}
            <div className="flex gap-3">
              {selectedArchetype.traits.map((trait) => (
                <div
                  key={trait}
                  className="w-14 h-14 rounded-md bg-white/10 border border-white/20 flex items-center justify-center p-2"
                >
                  <img
                    src={TRAIT_ICONS[trait]}
                    alt={trait}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Personality Quote */}
            <p className="text-white/90 italic text-lg leading-relaxed font-['Geist_Mono']">
              "{selectedArchetype.personality}"
            </p>

            {/* Theme */}
            <p className="text-white/70 text-base leading-relaxed font-['Geist_Mono']">
              {selectedArchetype.theme}
            </p>
          </div>
        </div>

        {/* ACTIVATE Button - Centered Above Carousel */}
        <div className="absolute bottom-[180px] left-1/2 -translate-x-1/2 z-20 w-[200px]">
          {selectedArchetype.isUnlocked ? (
            <button className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white uppercase tracking-wider font-['Geist_Mono'] font-bold text-base transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 hover:scale-[1.02]">
              ACTIVATE
            </button>
          ) : (
            <div className="w-full py-3 bg-red-900/30 border-2 border-red-700/50 text-red-400 uppercase tracking-wider font-['Geist_Mono'] font-bold text-base flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>LOCKED</span>
            </div>
          )}
        </div>

        {/* Bottom Horizontal Carousel */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent py-8">
          {/* Left Navigation Arrow - Always visible */}
          <button
            onClick={() => scrollBy('left')}
            disabled={selectedIndex === 0}
            className={`absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${
              selectedIndex === 0
                ? 'bg-white/5 opacity-30 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 hover:scale-110'
            }`}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Navigation Arrow - Always visible */}
          <button
            onClick={() => scrollBy('right')}
            disabled={selectedIndex === ARCHETYPES.length - 1}
            className={`absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${
              selectedIndex === ARCHETYPES.length - 1
                ? 'bg-white/5 opacity-30 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 hover:scale-110'
            }`}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Container with fade gradients */}
          <div className="relative w-full h-[100px] flex items-center justify-center overflow-hidden">
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />

            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

            {/* Carousel Track */}
            <div
              className="flex gap-3 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(${carouselOffset}px)`
              }}
            >
              {ARCHETYPES.map((archetype, index) => {
                const isSelected = index === selectedIndex
                const distance = Math.abs(index - selectedIndex)

                return (
                  <button
                    key={archetype.id}
                    onClick={() => handleSelect(index)}
                    className="relative flex-shrink-0 w-[80px] h-[80px] transition-all duration-300"
                    style={{
                      opacity: distance > 5 ? 0.2 : distance > 3 ? 0.5 : distance > 1 ? 0.75 : 1,
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    {/* Thumbnail Card Container - Parallelogram with rounded corners */}
                    <div
                      className={`relative w-full h-full overflow-hidden transition-all duration-300 ${
                        isSelected
                          ? 'border-2 border-cyan-400 shadow-lg shadow-cyan-400/60'
                          : 'border border-white/20 hover:border-white/40'
                      }`}
                      style={{
                        transform: 'skewX(-8deg)',
                        borderRadius: '8px'
                      }}
                    >
                      {/* Thumbnail Preview Area - Counter-skewed content */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-gray-800/60 to-gray-900/80 flex items-center justify-center"
                        style={{ transform: 'skewX(8deg)' }}
                      >
                        <span className={`font-bold font-['Geist_Mono'] transition-all duration-300 ${
                          isSelected ? 'text-lg text-gray-400' : 'text-sm text-gray-600'
                        }`}>
                          {archetype.nmtiCode}
                        </span>
                      </div>

                      {/* Lock Overlay - Counter-skewed */}
                      {!archetype.isUnlocked && (
                        <div
                          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center"
                          style={{ transform: 'skewX(8deg)' }}
                        >
                          <svg className="w-4 h-4 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}

                      {/* Tier Indicator Strip */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{ backgroundColor: archetype.tierColor }}
                      />

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Navigation Hint */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-white/40 text-xs uppercase tracking-wider font-['Geist_Mono']">
              Use arrow keys or click to navigate
            </div>
            <div className="text-white/60 text-xs font-['Geist_Mono']">
              {selectedIndex + 1} / {ARCHETYPES.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
