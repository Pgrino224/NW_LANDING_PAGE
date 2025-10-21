import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { themisApi } from '../services/api/themisApi'

interface BalanceContextType {
  balances: { networth: number; influence: number; resonance: number }
  refreshBalance: () => Promise<void>
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined)

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balances, setBalances] = useState({ networth: 0, influence: 0, resonance: 0 })

  const refreshBalance = async () => {
    try {
      const balance = await themisApi.getUserBalance()
      setBalances(balance)
    } catch (error) {
      console.error('Error loading balances:', error)
    }
  }

  // Load initial balance
  useEffect(() => {
    refreshBalance()
  }, [])

  return (
    <BalanceContext.Provider value={{ balances, refreshBalance }}>
      {children}
    </BalanceContext.Provider>
  )
}

export function useBalance() {
  const context = useContext(BalanceContext)
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider')
  }
  return context
}
