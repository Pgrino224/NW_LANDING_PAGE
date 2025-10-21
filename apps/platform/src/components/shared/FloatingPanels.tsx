import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import HubPanel from './HubPanel'

interface ModuleButton {
  id: string
  name: string
  icon: string
  action: 'navigate' | 'panel'
  path?: string
}

const moduleButtons: ModuleButton[] = [
  { id: 'leda', name: 'Leda', icon: '/shared/module-logos/leda-logo.svg', action: 'navigate', path: '/leda' },
  { id: 'hyperion', name: 'Hyperion', icon: '/shared/module-logos/hyperion-logo.svg', action: 'navigate', path: '/hyperion' },
  { id: 'themis', name: 'Themis', icon: '/shared/module-logos/themis-logo.svg', action: 'navigate', path: '/themis' },
  { id: 'dione', name: 'Dione', icon: '/shared/module-logos/dione-logo.svg', action: 'navigate', path: '/dione' },
  { id: 'zone', name: 'Zone', icon: '/shared/module-logos/zone-logo.svg', action: 'navigate', path: '/zone' },
  { id: 'hub', name: 'Hub', icon: '/shared/syncr-logo/syncr-logo.svg', action: 'panel' }
]

export default function FloatingPanels() {
  const [isHubOpen, setIsHubOpen] = useState(false)
  const [isDockVisible, setIsDockVisible] = useState(false)
  const navigate = useNavigate()
  const dockRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleHubToggle = () => {
    setIsHubOpen(prev => !prev)
  }

  const handleModuleClick = (module: ModuleButton) => {
    if (module.action === 'navigate' && module.path) {
      navigate(module.path)
    } else if (module.action === 'panel') {
      setIsHubOpen(true)
    }
  }

  // Handle mouse movement to show/hide dock
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const windowWidth = window.innerWidth
      const mouseX = event.clientX
      const triggerZone = 50 // pixels from right edge to trigger

      // Show dock when mouse is near right edge
      if (windowWidth - mouseX <= triggerZone) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        setIsDockVisible(true)
      } else {
        // Check if mouse is over the dock itself
        if (dockRef.current) {
          const dockRect = dockRef.current.getBoundingClientRect()
          const isOverDock =
            event.clientX >= dockRect.left &&
            event.clientX <= dockRect.right &&
            event.clientY >= dockRect.top &&
            event.clientY <= dockRect.bottom

          if (!isOverDock) {
            // Hide dock immediately when mouse leaves
            setIsDockVisible(false)
          }
        }
      }
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <HubPanel
        isOpen={isHubOpen}
        onToggle={handleHubToggle}
      />

      {/* macOS-style Dock */}
      {!isHubOpen && (
        <div
          ref={dockRef}
          className="fixed top-1/2 -translate-y-1/2 z-[1000] transition-all duration-300 ease-out"
          style={{
            right: isDockVisible ? '24px' : '-100px'
          }}
        >
          {/* Dock Container */}
          <div className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl px-3 py-4">
            {/* Module Buttons */}
            <div className="flex flex-col items-center gap-3">
              {moduleButtons.map((module) => (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-110 hover:-translate-x-1"
                  style={{
                    width: '56px',
                    height: '56px'
                  }}
                  title={module.name}
                >
                  <img
                    src={module.icon}
                    alt={module.name}
                    className="w-14 h-14 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
