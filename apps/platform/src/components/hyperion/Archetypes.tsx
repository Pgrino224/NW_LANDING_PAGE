import { useState, useEffect, useCallback } from 'react'
import { ARCHETYPES, TRAIT_ICONS, type Archetype } from '../../services/hyperion/archetypes'
import { useHyperion } from '../../contexts/HyperionContext'

export default function Archetypes() {
  const { activatedArchetype, setActivatedArchetype } = useHyperion()
  const [selectedIndex, setSelectedIndex] = useState(0) // Default to first archetype
  const selectedArchetype = ARCHETYPES[selectedIndex]

  // Handler for activating an archetype
  const handleActivate = () => {
    if (selectedArchetype.isUnlocked) {
      setActivatedArchetype(selectedArchetype)
    }
  }

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
      <div className="absolute inset-0 z-0 flex items-start justify-start">
        <div className="relative w-[65vh] h-full flex items-start justify-center">
          <img
            src={`/shared/archetypes/archetype-webp/${selectedArchetype.tier.toLowerCase()}/${selectedArchetype.id.replace('the-', '')}.webp`}
            alt={selectedArchetype.name}
            className="h-full w-full object-cover object-top transition-opacity duration-500"
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
        {/* Title and Info Panel Row - Same Level */}
        <div className="flex-1 flex items-start justify-between pl-8 lg:pl-12 xl:pl-16 pr-4 lg:pr-6 xl:pr-8 py-6 gap-8">
          {/* Title - Left Side */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img src="/hyperion/title-icons/archetypes.svg" alt="" className="w-12 h-12" />
            <h1 className="font-geist-bold text-white text-3xl">ARCHETYPES</h1>
          </div>

          {/* Info Panel - Right Side */}
          <div className="w-full max-w-[850px] max-h-[calc(100vh-300px)] overflow-y-auto bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-8 lg:p-10 xl:p-12 space-y-6 lg:space-y-7 xl:space-y-8">
              {/* Archetype Name */}
              <h2 className="text-white text-4xl lg:text-6xl xl:text-7xl font-black uppercase leading-tight tracking-wide" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 900 }}>
                {selectedArchetype.name}
              </h2>

              {/* Horizontal Separator */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {/* NMTI Code - Letter Boxes */}
              <div className="flex gap-2 lg:gap-3">
                {selectedArchetype.nmtiCode.split('').map((letter, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-2 border-cyan-400/60 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20"
                  >
                    <span className="text-cyan-300 text-xl lg:text-2xl font-['Geist_Mono'] font-bold">
                      {letter}
                    </span>
                  </div>
                ))}
              </div>

              {/* Horizontal Separator */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {/* Trait Icons */}
              <div className="flex gap-2 lg:gap-3 xl:gap-4 flex-wrap">
                {selectedArchetype.traits.map((trait) => (
                  <div
                    key={trait}
                    className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-md bg-white/10 border border-white/20 flex items-center justify-center p-2 lg:p-2.5 xl:p-3 hover:bg-white/15 transition-all duration-300"
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
              <p className="text-white/90 italic text-lg lg:text-xl xl:text-2xl leading-relaxed font-['Geist_Mono']">
                "{selectedArchetype.personality}"
              </p>

              {/* Lore */}
              <p className="text-white/70 text-base lg:text-lg leading-relaxed font-['Geist']">
                {selectedArchetype.lore}
              </p>
            </div>
          </div>
        </div>

        {/* ACTIVATE Button - Centered Above Carousel */}
        <div className="absolute bottom-[180px] left-1/2 -translate-x-1/2 z-20 w-[200px]">
          {selectedArchetype.isUnlocked ? (
            <button
              onClick={handleActivate}
              className={`w-full py-3 uppercase tracking-wider font-['Geist_Mono'] font-bold text-base transition-all duration-300 ${
                activatedArchetype?.id === selectedArchetype.id
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 hover:scale-[1.02]'
              }`}
            >
              {activatedArchetype?.id === selectedArchetype.id ? 'ACTIVATED' : 'ACTIVATE'}
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
        <div className="absolute bottom-0 left-0 right-0 py-8">
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

          {/* Navigation Hint */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-white/40 text-xs uppercase tracking-wider font-['Geist_Mono']">
              Use arrow keys or click to navigate
            </div>
            <div className="text-white/60 text-xs font-['Geist_Mono']">
              {selectedIndex + 1} / {ARCHETYPES.length}
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative w-full h-[100px] flex items-center justify-center overflow-hidden">

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
                        className="absolute inset-0 overflow-hidden"
                        style={{ transform: 'skewX(8deg)' }}
                      >
                        <img
                          src={`/shared/archetypes/archetype-webp/${archetype.tier.toLowerCase()}/${archetype.id.replace('the-', '')}.webp`}
                          alt={archetype.name}
                          className="w-full h-full object-cover object-top transition-all duration-300"
                          style={{
                            filter: isSelected ? 'brightness(1.2)' : 'brightness(1.0)'
                          }}
                        />
                        {/* NMTI Code overlay at bottom */}
                        <div className="absolute bottom-1 left-0 right-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                          <span className={`font-bold font-['Geist_Mono'] text-white drop-shadow-lg transition-all duration-300 ${
                            isSelected ? 'text-xs' : 'text-[10px]'
                          }`}>
                            {archetype.nmtiCode}
                          </span>
                        </div>
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
        </div>
    </div>
  )
}
