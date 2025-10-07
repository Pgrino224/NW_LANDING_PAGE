import { ReactNode, useState } from 'react'
import Watchlist from './Watchlist'
import type { Token } from './mockData'
import { mockTokens } from './mockData'

interface DioneDashboardLayoutProps {
  children: ReactNode
  tokens: Token[]
}

export default function DioneDashboardLayout({ children, tokens: initialTokens }: DioneDashboardLayoutProps) {
  const [watchlistTokens, setWatchlistTokens] = useState<Token[]>(initialTokens)

  const handleAddToken = (token: Token) => {
    // Add token to watchlist if not already present
    if (!watchlistTokens.find(t => t.symbol === token.symbol)) {
      setWatchlistTokens([...watchlistTokens, token])
    }
  }

  return (
    <div className="w-full h-screen grid" style={{
      gridTemplateColumns: '4fr 1fr',
      gap: '0'
    }}>
      {/* Main content area - 80% */}
      <div className="h-full overflow-auto bg-[#0a0a0a]">
        {children}
      </div>

      {/* Watchlist - 20% */}
      <Watchlist
        tokens={watchlistTokens}
        allTokens={mockTokens}
        onAddToken={handleAddToken}
      />
    </div>
  )
}
