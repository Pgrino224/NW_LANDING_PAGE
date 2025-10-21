import { createContext, useContext, useState, ReactNode } from 'react'

interface OrdersContextType {
  refreshTrigger: number
  triggerRefresh: () => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <OrdersContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}
