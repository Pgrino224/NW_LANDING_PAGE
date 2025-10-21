import { ReactNode, useState, useEffect, cloneElement, isValidElement } from 'react'

interface SectionNavigationProps {
  sections: ReactNode[]
  initialSection?: number
}

export default function SectionNavigation({ sections, initialSection = 0 }: SectionNavigationProps) {
  const [currentSection, setCurrentSection] = useState(initialSection)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const navigateToSection = (index: number) => {
    if (index >= 0 && index < sections.length && !isTransitioning) {
      setIsTransitioning(true)
      setCurrentSection(index)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 600)
    }
  }

  const goToPrevious = () => {
    if (currentSection > 0) {
      navigateToSection(currentSection - 1)
    }
  }

  const goToNext = () => {
    if (currentSection < sections.length - 1) {
      navigateToSection(currentSection + 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSection, isTransitioning])

  return (
    <div className="relative w-full h-screen overflow-y-auto overflow-x-hidden themis-scrollbar">
      {/* Sections Container */}
      <div className="relative w-full h-full">
        {sections.map((section, index) => {
          const isActive = index === currentSection
          const isPrevious = index < currentSection
          const isNext = index > currentSection

          let transform = ''
          if (isActive) {
            transform = 'translateX(0)'
          } else if (isPrevious) {
            transform = 'translateX(-100%)'
          } else if (isNext) {
            transform = 'translateX(100%)'
          }

          return (
            <div
              key={index}
              className="absolute inset-0 w-full h-full"
              style={{
                transform,
                transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
              }}
            >
              {isValidElement(section) ? cloneElement(section, { isActive: isActive } as any) : section}
            </div>
          )
        })}
      </div>


      {/* Section Indicators - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1 flex gap-1">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => navigateToSection(index)}
            className={`
              w-8 h-1 rounded-full transition-all duration-300
              ${index === currentSection
                ? 'bg-white'
                : 'bg-white/30 hover:bg-white/50'
              }
            `}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
