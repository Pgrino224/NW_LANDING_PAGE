import { createContext, useContext, useState, ReactNode } from 'react'

interface SavedMarketsContextType {
  savedMarkets: string[]
  toggleSaveMarket: (marketId: string) => void
  isSaved: (marketId: string) => boolean
}

const SavedMarketsContext = createContext<SavedMarketsContextType | undefined>(undefined)

export function SavedMarketsProvider({ children }: { children: ReactNode }) {
  const [savedMarkets, setSavedMarkets] = useState<string[]>([])

  const toggleSaveMarket = (marketId: string) => {
    setSavedMarkets(prev =>
      prev.includes(marketId)
        ? prev.filter(id => id !== marketId)
        : [...prev, marketId]
    )
  }

  const isSaved = (marketId: string) => {
    return savedMarkets.includes(marketId)
  }

  return (
    <SavedMarketsContext.Provider value={{ savedMarkets, toggleSaveMarket, isSaved }}>
      {children}
    </SavedMarketsContext.Provider>
  )
}

export function useSavedMarkets() {
  const context = useContext(SavedMarketsContext)
  if (!context) {
    throw new Error('useSavedMarkets must be used within SavedMarketsProvider')
  }
  return context
}
