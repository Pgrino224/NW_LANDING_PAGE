# Leda Components - PnL Share Integration

## When implementing Leda game history, add Share functionality:

### Required Imports
```tsx
import PnLCardModal from '../shared/PnLCardModal'
```

### State Management
```tsx
const [shareModalOpen, setShareModalOpen] = useState(false)
const [shareModalData, setShareModalData] = useState<{
  gameMode: 'leda' | 'themis' | 'dione'
  userData: { username: string; profileImage?: string }
  transactionData: any
} | null>(null)
```

### Share Handler Example
```tsx
const handleShareGame = (game: GameHistory) => {
  setShareModalData({
    gameMode: 'leda',
    userData: {
      username: 'taut-dogwood', // Replace with actual user context
      profileImage: undefined
    },
    transactionData: {
      opponentName: game.opponent,
      gameResult: game.result as 'VICTORY' | 'DEFEAT',
      pnl: game.pnl,
      pnlPercentage: (game.pnl / game.wager) * 100,
      currency: 'RES' // or 'INF' depending on game type
    }
  })
  setShareModalOpen(true)
}
```

### Share Button in Table
```tsx
<button
  onClick={(e) => {
    e.stopPropagation()
    handleShareGame(game)
  }}
  className="p-1.5 rounded hover:bg-white/10 transition-colors"
  title="Share"
>
  <svg className="w-4 h-4 text-[#ffffe4]/60 hover:text-[#ffffe4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
</button>
```

### Modal Component (at end of return statement)
```tsx
{/* Share PnL Card Modal */}
{shareModalOpen && shareModalData && (
  <PnLCardModal
    isOpen={shareModalOpen}
    onClose={() => setShareModalOpen(false)}
    {...shareModalData}
  />
)}
```

## References
- See [OrdersPositions.tsx](../dione/OrdersPositions.tsx) for Dione implementation
- See [ThemisProfileSection.tsx](../themis/ThemisProfileSection.tsx) for Themis implementation
- PnLCard component: [PnLCard.tsx](../shared/PnLCard.tsx)
- Modal wrapper: [PnLCardModal.tsx](../shared/PnLCardModal.tsx)
