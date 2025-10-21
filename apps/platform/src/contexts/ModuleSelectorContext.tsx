import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ModuleSelectorContextType {
  isOverlayOpen: boolean
  openOverlay: () => void
  closeOverlay: () => void
  toggleOverlay: () => void
}

const ModuleSelectorContext = createContext<ModuleSelectorContextType | undefined>(undefined)

export function ModuleSelectorProvider({ children }: { children: ReactNode }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)

  const openOverlay = () => setIsOverlayOpen(true)
  const closeOverlay = () => setIsOverlayOpen(false)
  const toggleOverlay = () => setIsOverlayOpen(prev => !prev)

  return (
    <ModuleSelectorContext.Provider
      value={{
        isOverlayOpen,
        openOverlay,
        closeOverlay,
        toggleOverlay
      }}
    >
      {children}
    </ModuleSelectorContext.Provider>
  )
}

export function useModuleSelector() {
  const context = useContext(ModuleSelectorContext)
  if (context === undefined) {
    throw new Error('useModuleSelector must be used within a ModuleSelectorProvider')
  }
  return context
}
