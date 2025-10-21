import { ReactNode } from 'react'
import ThemisSavedMarkets from './ThemisSavedMarkets'

interface ThemisDashboardLayoutProps {
  children: ReactNode
  savedMarkets: string[]
  onRemoveMarket: (marketId: string) => void
}

export default function ThemisDashboardLayout({
  children,
  savedMarkets,
  onRemoveMarket
}: ThemisDashboardLayoutProps) {
  return (
    <div className="w-full h-screen grid" style={{
      gridTemplateColumns: '4fr 1fr',
      gap: '0'
    }}>
      {/* Main Content Area - 80% */}
      <div className="h-full overflow-auto custom-scrollbar bg-[#0a0a0a]">
        {children}
      </div>

      {/* Saved Markets Sidebar - 20% */}
      <ThemisSavedMarkets
        savedMarkets={savedMarkets}
        onRemoveMarket={onRemoveMarket}
      />
    </div>
  )
}
