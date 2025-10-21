import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface HomeProps {
  onCloseOverlay?: () => void
}

export default function Home({ onCloseOverlay }: HomeProps = {}) {
  const navigate = useNavigate()
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Preload hover images
  useEffect(() => {
    const hoverImages = [
      '/shared/module-logos-hover/leda-logo-hover.svg',
      '/shared/module-logos-hover/themis-logo-hover.svg',
      '/shared/module-logos-hover/hyperion-logo-hover.svg',
      '/shared/module-logos-hover/dione-logo-hover.svg',
      '/shared/module-logos-hover/zone-logo-hover.svg'
    ]

    hoverImages.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  const handleCardClick = (cardNumber: number) => {
    setSelectedCard(selectedCard === cardNumber ? null : cardNumber)

    // Close overlay if it exists
    if (onCloseOverlay) {
      onCloseOverlay()
    }

    // Navigate to respective module navigation systems
    switch(cardNumber) {
      case 1: // LEDA
        navigate('/leda')
        break
      case 2: // THEMIS
        navigate('/themis/all')
        break
      case 3: // HYPERION
        navigate('/hyperion')
        break
      case 4: // DIONE
        navigate('/dione')
        break
      case 5: // ZONE
        navigate('/zone')
        break
    }
  }

  const modules = [
    { id: 1, name: 'LEDA', logo: 'leda-logo.svg' },
    { id: 2, name: 'THEMIS', logo: 'themis-logo.svg' },
    { id: 3, name: 'HYPERION', logo: 'hyperion-logo.svg' },
    { id: 4, name: 'DIONE', logo: 'dione-logo.svg' }
  ]

  return (
    <div className="h-screen w-full bg-black relative">
      {/* Blurred circle background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: '#a11913',
          filter: 'blur(120px)',
          opacity: 0.3,
          zIndex: 1
        }}
      />

      {/* 21x21 CSS Grid */}
      <div
        className="h-full w-full grid gap-0 relative z-10"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(21, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(21, minmax(0, 1fr))'
        }}
      >
        {/* Grid items will go here */}

        {/* Logo */}
        <div className="col-start-2 col-span-6 row-start-2 row-span-2 flex items-center">
          <img
            src="/shared/acepyr-logo/acepyr-logo-white.svg"
            alt="ACEPYR"
            className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-14"
          />
        </div>

        {/* Card 1 - LEDA */}
        <div
          className={`col-start-3 col-span-5 row-start-5 row-span-6 border p-4 flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 overflow-hidden
            ${selectedCard === 1
              ? 'bg-white border-white text-black'
              : 'bg-white/10 border-white/20 hover:bg-white hover:text-black text-white'
            }`}
          onClick={() => handleCardClick(1)}
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Hexagons background decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img
              src="/shared/decorations/hexagons.svg"
              alt=""
              className="w-full h-full object-contain scale-150"
            />
          </div>

          {/* Corner brackets - always visible, more prominent when selected */}
          <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${selectedCard === 1 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${selectedCard === 1 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${selectedCard === 1 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${selectedCard === 1 ? 'border-black' : 'border-white/30'}`}></div>

          {/* Logo */}
          <img
            src={hoveredCard === 1 ? '/shared/module-logos-hover/leda-logo-hover.svg' : '/shared/module-logos/leda-logo.svg'}
            alt="LEDA"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mb-2"
          />

          {/* Module name */}
          <p className="font-geist text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">LEDA</p>
        </div>

        {/* Card 2 - THEMIS */}
        <div
          style={{ gridColumn: '15 / 20', gridRow: '5 / 11' }}
          className={`border p-4 flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 overflow-hidden
            ${selectedCard === 2
              ? 'bg-white border-white text-black'
              : 'bg-white/10 border-white/20 hover:bg-white hover:text-black text-white'
            }`}
          onClick={() => handleCardClick(2)}
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Pattern-2 background decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img
              src="/shared/decorations/pattern-2.svg"
              alt=""
              className="w-full h-full object-contain scale-150"
            />
          </div>

          {/* Corner brackets - always visible, more prominent when selected */}
          <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${selectedCard === 2 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${selectedCard === 2 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${selectedCard === 2 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${selectedCard === 2 ? 'border-black' : 'border-white/30'}`}></div>

          {/* Logo */}
          <img
            src={hoveredCard === 2 ? '/shared/module-logos-hover/themis-logo-hover.svg' : '/shared/module-logos/themis-logo.svg'}
            alt="THEMIS"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mb-2"
          />

          {/* Module name */}
          <p className="font-geist text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">THEMIS</p>
        </div>

        {/* Card 3 - HYPERION (rows 12-17) */}
        <div
          className={`col-start-3 col-span-5 row-start-12 row-span-6 border p-4 flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 overflow-hidden
            ${selectedCard === 3
              ? 'bg-white border-white text-black'
              : 'bg-white/10 border-white/20 hover:bg-white hover:text-black text-white'
            }`}
          onClick={() => handleCardClick(3)}
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Micro-chip background decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
            <img
              src="/shared/decorations/micro-chip.svg"
              alt=""
              className="w-full h-full object-contain scale-150"
            />
          </div>

          {/* Corner brackets - always visible, more prominent when selected */}
          <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${selectedCard === 3 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${selectedCard === 3 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${selectedCard === 3 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${selectedCard === 3 ? 'border-black' : 'border-white/30'}`}></div>

          {/* Logo */}
          <img
            src={hoveredCard === 3 ? '/shared/module-logos-hover/hyperion-logo-hover.svg' : '/shared/module-logos/hyperion-logo.svg'}
            alt="HYPERION"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mb-2"
          />

          {/* Module name */}
          <p className="font-geist text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">HYPERION</p>
        </div>

        {/* Card 4 - DIONE */}
        <div
          style={{ gridColumn: '15 / 20', gridRow: '12 / 18' }}
          className={`border p-4 flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 overflow-hidden
            ${selectedCard === 4
              ? 'bg-white border-white text-black'
              : 'bg-white/10 border-white/20 hover:bg-white hover:text-black text-white'
            }`}
          onClick={() => handleCardClick(4)}
          onMouseEnter={() => setHoveredCard(4)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Wireframe background decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img
              src="/shared/decorations/wireframe.svg"
              alt=""
              className="w-full h-full object-contain scale-150"
            />
          </div>

          {/* Corner brackets - always visible, more prominent when selected */}
          <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${selectedCard === 4 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${selectedCard === 4 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${selectedCard === 4 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${selectedCard === 4 ? 'border-black' : 'border-white/30'}`}></div>

          {/* Logo */}
          <img
            src={hoveredCard === 4 ? '/shared/module-logos-hover/dione-logo-hover.svg' : '/shared/module-logos/dione-logo.svg'}
            alt="DIONE"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mb-2"
          />

          {/* Module name */}
          <p className="font-geist text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">DIONE</p>
        </div>

        {/* Card 5 - ZONE (CENTER) */}
        <div
          style={{ gridColumn: '9 / 14', gridRow: '5 / 18' }}
          className={`border p-4 flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 overflow-hidden
            ${selectedCard === 5
              ? 'bg-white border-white text-black'
              : 'bg-white/10 border-white/20 hover:bg-white hover:text-black text-white'
            }`}
          onClick={() => handleCardClick(5)}
          onMouseEnter={() => setHoveredCard(5)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Zone decoration background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img
              src="/shared/decorations/zone-deco.png"
              alt=""
              className="w-full h-full object-contain scale-150"
            />
          </div>

          {/* Corner brackets - always visible, more prominent when selected */}
          <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${selectedCard === 5 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${selectedCard === 5 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${selectedCard === 5 ? 'border-black' : 'border-white/30'}`}></div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${selectedCard === 5 ? 'border-black' : 'border-white/30'}`}></div>

          {/* Logo */}
          <img
            src={hoveredCard === 5 ? '/shared/module-logos-hover/zone-logo-hover.svg' : '/shared/module-logos/zone-logo.svg'}
            alt="ZONE"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mb-2"
          />

          {/* Module name */}
          <p className="font-geist text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">ZONE</p>
        </div>

        {/* Decoration - Pattern-1 (bottom left) */}
        <div
          className="flex items-center justify-center opacity-20"
          style={{ gridColumn: '2 / 4', gridRow: '20' }}
        >
          <img
            src="/shared/decorations/pattern-1.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        {/* Decoration - Pattern-1 (bottom right) */}
        <div
          className="flex items-center justify-center opacity-20"
          style={{ gridColumn: '19 / 21', gridRow: '20' }}
        >
          <img
            src="/shared/decorations/pattern-1.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        {/* Decoration - Pattern-3 (left) */}
        <div
          className="flex items-center justify-center opacity-20"
          style={{ gridColumn: '2', gridRow: '5' }}
        >
          <img
            src="/shared/decorations/pattern-3.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        {/* Decoration - Pattern-3 (right) */}
        <div
          className="flex items-center justify-center opacity-20"
          style={{ gridColumn: '20', gridRow: '5' }}
        >
          <img
            src="/shared/decorations/pattern-3.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        {/* Version text */}
        <div
          style={{ gridColumn: '2', gridRow: '11' }}
          className="flex items-center"
        >
          <p className="text-white/30 text-[8px] font-geist">NETWORTH V 1.0.0</p>
        </div>

        {/* Minerva Link text */}
        <div
          style={{ gridColumn: '20', gridRow: '11' }}
          className="flex items-center justify-end"
        >
          <p className="text-white/30 text-[8px] font-geist">MINERVA LINK</p>
        </div>


        {/* System Card - cols 10-12, row 19 (testing actual position) */}
        <div
          className="border p-2 flex items-center justify-center relative cursor-pointer transition-all duration-300 bg-white/10 border-white/20 hover:bg-white hover:text-black text-white"
          style={{ gridRow: '19', gridColumn: '10 / 13' }}
          onClick={() => navigate('/settings')}
        >
          {/* Corner brackets - on the borders */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 hover:border-black"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30 hover:border-black"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30 hover:border-black"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 hover:border-black"></div>
          <p className="font-geist text-xs sm:text-sm md:text-base lg:text-lg">SYSTEM</p>
        </div>

      </div>
    </div>
  )
}
