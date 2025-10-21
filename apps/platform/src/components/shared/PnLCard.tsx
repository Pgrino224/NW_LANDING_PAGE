interface PnLCardProps {
  gameMode: 'leda' | 'themis' | 'dione'
  userData: {
    username: string
    profileImage?: string
  }
  transactionData: {
    // Dione specific
    tradeSymbol?: string
    tradeName?: string
    assetType?: 'crypto' | 'index' | 'commodity' | 'etf' | 'stock'
    entryPrice?: number
    exitPrice?: number
    side?: 'buy' | 'sell'
    quantity?: number

    // Themis specific
    marketQuestion?: string
    prediction?: 'YES' | 'NO'
    shares?: number
    avgPrice?: number

    // Leda specific
    opponentName?: string
    gameResult?: 'VICTORY' | 'DEFEAT'

    // Universal
    pnl: number
    pnlPercentage: number
    currency: 'NW' | 'INF' | 'RES'
  }
}

export default function PnLCard({ gameMode, userData, transactionData }: PnLCardProps) {
  const { username, profileImage } = userData
  const { pnl, pnlPercentage, currency } = transactionData

  // Determine gradient colors based on game mode
  const getGradientColors = () => {
    switch (gameMode) {
      case 'dione':
        return 'from-teal-900 via-cyan-900 to-teal-950'
      case 'themis':
        return 'from-blue-900 via-indigo-900 to-blue-950'
      case 'leda':
        return 'from-purple-900 via-violet-900 to-purple-950'
      default:
        return 'from-gray-900 via-slate-900 to-gray-950'
    }
  }

  // Game mode logos
  const getGameLogo = () => {
    switch (gameMode) {
      case 'dione':
        return '/shared/module-logos/dione-logo.svg'
      case 'themis':
        return '/shared/module-logos/themis-logo.svg'
      case 'leda':
        return '/shared/module-logos/leda-logo.svg'
      default:
        return ''
    }
  }

  // Get currency icon
  const getCurrencyIcon = () => {
    switch (currency) {
      case 'NW':
        return '/shared/token-logos/svg-white/networth-logo.svg'
      case 'INF':
        return '/shared/token-logos/svg-white/influence-logo.svg'
      case 'RES':
        return '/shared/token-logos/svg-white/resonance-logo.svg'
      default:
        return '/shared/token-logos/svg-white/networth-logo.svg'
    }
  }

  // Get asset icon based on symbol and asset type
  const getAssetIcon = (symbol: string, assetType?: string) => {
    if (!assetType) return null

    const iconMap: Record<string, string> = {
      // Crypto
      'BTC': '/dione/crypto/bitcoin.svg',
      'ETH': '/dione/crypto/ethereum.svg',
      'SOL': '/dione/crypto/solana.svg',
      // Stocks
      'AAPL': '/dione/stocks/apple.svg',
      'TSLA': '/dione/stocks/tesla.svg',
      'NVDA': '/dione/stocks/nvidia.svg',
    }

    return iconMap[symbol] || null
  }

  const isProfit = pnl >= 0

  return (
    <div
      className={`relative w-[1200px] h-[630px] bg-gradient-to-br ${getGradientColors()} overflow-hidden`}
      style={{ fontFamily: 'Geist, system-ui, sans-serif' }}
    >
      {/* Content Container */}
      <div className="relative h-full p-12 flex flex-col">

        {/* Header - Logos and Trade Info */}
        <div className="flex items-start justify-between mb-auto">
          {/* Left: NetWorth Logo + Trade Info */}
          <div className="flex flex-col gap-4">
            <img
              src="/shared/token-logos/svg-white/networth-logo.svg"
              alt="NetWorth"
              className="h-10 w-auto"
            />

            {/* Trade Symbol and Badge */}
            {gameMode === 'dione' && transactionData.tradeSymbol && (
              <div className="flex items-center gap-3">
                {getAssetIcon(transactionData.tradeSymbol, transactionData.assetType) && (
                  <img
                    src={getAssetIcon(transactionData.tradeSymbol, transactionData.assetType)!}
                    alt={transactionData.tradeSymbol}
                    className="h-8 w-8"
                  />
                )}
                <div className="text-[#ffffe4] text-2xl font-bold">{transactionData.tradeSymbol}</div>
                <div className="px-3 py-1 bg-[#ffffe4]/20 rounded text-[#ffffe4] text-sm font-bold uppercase">
                  {transactionData.side === 'buy' ? 'LONG' : 'SHORT'}
                </div>
              </div>
            )}

            {gameMode === 'themis' && transactionData.marketQuestion && (
              <div className="max-w-md">
                <div className="text-[#ffffe4] text-lg font-bold line-clamp-2">
                  {transactionData.marketQuestion}
                </div>
                <div className={`inline-block mt-2 px-3 py-1 rounded font-bold text-sm ${
                  transactionData.prediction === 'YES' ? 'bg-lime-500/20 text-lime-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {transactionData.prediction}
                </div>
              </div>
            )}

            {gameMode === 'leda' && transactionData.opponentName && (
              <div>
                <div className="text-[#ffffe4] text-xl font-bold mb-2">
                  vs {transactionData.opponentName}
                </div>
                <div className={`inline-block px-4 py-2 rounded-lg font-bold text-lg ${
                  transactionData.gameResult === 'VICTORY' ? 'bg-lime-500/20 text-lime-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {transactionData.gameResult}
                </div>
              </div>
            )}
          </div>

          {/* Right: Game Mode Logo */}
          <img
            src={getGameLogo()}
            alt={gameMode}
            className="h-10 w-auto"
          />
        </div>

        {/* Center - Giant PnL Display */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-[140px] font-bold leading-none flex items-center justify-center ${
              isProfit ? 'text-[#50fa7b]' : 'text-[#ff5555]'
            }`}>
              {isProfit ? '+' : ''}
              <img src={getCurrencyIcon()} alt={currency} className="h-24 w-auto mx-4" />
              {Math.abs(pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-6xl font-bold mt-4 ${
              isProfit ? 'text-[#50fa7b]/80' : 'text-[#ff5555]/80'
            }`}>
              {isProfit ? '+' : ''}{pnlPercentage.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Bottom - Entry/Exit Details */}
        <div className="mt-auto">
          {gameMode === 'dione' && transactionData.entryPrice && transactionData.exitPrice && (
            <div className="flex gap-12">
              <div>
                <div className="text-[#ffffe4]/50 text-sm mb-1">Entry Price</div>
                <div className="text-[#ffffe4] text-2xl font-mono">{transactionData.entryPrice.toFixed(6)}</div>
              </div>
              <div>
                <div className="text-[#ffffe4]/50 text-sm mb-1">Exit Price</div>
                <div className="text-[#ffffe4] text-2xl font-mono">{transactionData.exitPrice.toFixed(6)}</div>
              </div>
            </div>
          )}

          {gameMode === 'themis' && transactionData.shares && transactionData.avgPrice && (
            <div className="flex gap-12">
              <div>
                <div className="text-[#ffffe4]/50 text-sm mb-1">Shares</div>
                <div className="text-[#ffffe4] text-2xl font-mono">{transactionData.shares.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[#ffffe4]/50 text-sm mb-1">Avg Price</div>
                <div className="text-[#ffffe4] text-2xl font-mono">{(transactionData.avgPrice * 100).toFixed(0)}¢</div>
              </div>
            </div>
          )}

          {/* Username Footer */}
          <div className="mt-6">
            <div className="text-[#ffffe4]/50 text-xs mb-1">Shared by</div>
            <div className="text-[#ffffe4] text-base font-bold">{username}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
