import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { ChryspolosItem } from '../components/hyperion/types'
import type { Archetype } from '../services/hyperion/archetypes'

interface HyperionContextType {
  equippedChrysoplos: ChryspolosItem | null
  activatedArchetype: Archetype | null
  setEquippedChrysoplos: (chrysoplos: ChryspolosItem | null) => void
  setActivatedArchetype: (archetype: Archetype | null) => void
}

const HyperionContext = createContext<HyperionContextType | undefined>(undefined)

export function HyperionProvider({ children }: { children: ReactNode }) {
  const [equippedChrysoplos, setEquippedChrysoplosState] = useState<ChryspolosItem | null>(null)
  const [activatedArchetype, setActivatedArchetypeState] = useState<Archetype | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedChrysoplos = localStorage.getItem('equippedChrysoplos')
      const savedArchetype = localStorage.getItem('activatedArchetype')

      if (savedChrysoplos) {
        setEquippedChrysoplosState(JSON.parse(savedChrysoplos))
      }
      if (savedArchetype) {
        setActivatedArchetypeState(JSON.parse(savedArchetype))
      }
    } catch (error) {
      console.error('Error loading Hyperion state from localStorage:', error)
    }
  }, [])

  // Wrapper functions that also save to localStorage
  const setEquippedChrysoplos = (chrysoplos: ChryspolosItem | null) => {
    setEquippedChrysoplosState(chrysoplos)
    try {
      if (chrysoplos) {
        localStorage.setItem('equippedChrysoplos', JSON.stringify(chrysoplos))
      } else {
        localStorage.removeItem('equippedChrysoplos')
      }
    } catch (error) {
      console.error('Error saving Chrysoplos to localStorage:', error)
    }
  }

  const setActivatedArchetype = (archetype: Archetype | null) => {
    setActivatedArchetypeState(archetype)
    try {
      if (archetype) {
        localStorage.setItem('activatedArchetype', JSON.stringify(archetype))
      } else {
        localStorage.removeItem('activatedArchetype')
      }
    } catch (error) {
      console.error('Error saving Archetype to localStorage:', error)
    }
  }

  return (
    <HyperionContext.Provider
      value={{
        equippedChrysoplos,
        activatedArchetype,
        setEquippedChrysoplos,
        setActivatedArchetype
      }}
    >
      {children}
    </HyperionContext.Provider>
  )
}

export function useHyperion() {
  const context = useContext(HyperionContext)
  if (context === undefined) {
    throw new Error('useHyperion must be used within a HyperionProvider')
  }
  return context
}
