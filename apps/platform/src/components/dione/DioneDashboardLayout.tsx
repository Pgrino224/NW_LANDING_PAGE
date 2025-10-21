import { ReactNode, useState } from 'react'
import Watchlist from './Watchlist'
import type { Token } from '../../services/api/dioneApi'

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

  const handleRemoveToken = (token: Token) => {
    setWatchlistTokens(watchlistTokens.filter(t => t.symbol !== token.symbol))
  }

  return (
    <div
      className="w-full h-screen grid"
      style={{
        gridTemplateColumns: '4fr 1fr',
        gap: '0',
        backgroundImage: 'url(/dione/dione-bg/dione-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Main content area - 80% */}
      <div className="h-full overflow-auto custom-scrollbar">
        {children}
      </div>

      {/* Watchlist - 20% */}
      <Watchlist
        tokens={watchlistTokens}
        allTokens={initialTokens}
        onAddToken={handleAddToken}
        onRemoveToken={handleRemoveToken}
      />
    </div>
  )
}
