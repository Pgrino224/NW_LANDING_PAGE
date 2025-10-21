import { useRef } from 'react'
import PnLCard from './PnLCard'

interface PnLCardModalProps {
  isOpen: boolean
  onClose: () => void
  gameMode: 'leda' | 'themis' | 'dione'
  userData: {
    username: string
    profileImage?: string
  }
  transactionData: {
    tradeSymbol?: string
    entryPrice?: number
    exitPrice?: number
    side?: 'buy' | 'sell'
    quantity?: number
    marketQuestion?: string
    prediction?: 'YES' | 'NO'
    shares?: number
    avgPrice?: number
    opponentName?: string
    gameResult?: 'VICTORY' | 'DEFEAT'
    pnl: number
    pnlPercentage: number
    currency: 'NW' | 'INF' | 'RES'
  }
}

export default function PnLCardModal({
  isOpen,
  onClose,
  gameMode,
  userData,
  transactionData
}: PnLCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const handleDownload = async () => {
    if (!cardRef.current) return

    try {
      // Dynamically import html-to-image to avoid SSR issues
      const htmlToImage = await import('html-to-image')

      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        width: 1200,
        height: 630,
      })

      // Create download link
      const link = document.createElement('a')
      link.download = `pnl-${gameMode}-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Failed to generate image. Please try again.')
    }
  }

  const handleCopyToClipboard = async () => {
    if (!cardRef.current) return

    try {
      const htmlToImage = await import('html-to-image')

      const blob = await htmlToImage.toBlob(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        width: 1200,
        height: 630,
      })

      if (!blob) {
        throw new Error('Failed to generate image blob')
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ])

      alert('Image copied to clipboard!')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      alert('Failed to copy image. Please try downloading instead.')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-6 max-w-[95vw] max-h-[95vh] overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-0">
          <h2 className="text-[#ffffe4] font-geist-bold text-xl">Share Your {gameMode === 'dione' ? 'Trade' : gameMode === 'themis' ? 'Prediction' : 'Victory'}</h2>
          <button
            onClick={onClose}
            className="text-[#ffffe4]/60 hover:text-[#ffffe4] transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Card Preview */}
        <div className="mb-0 flex justify-center">
          <div
            ref={cardRef}
            className="transform scale-75 origin-center shadow-2xl rounded-lg overflow-hidden"
            style={{ transformOrigin: 'center' }}
          >
            <PnLCard
              gameMode={gameMode}
              userData={userData}
              transactionData={transactionData}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:from-white/15 hover:to-white/10 text-[#ffffe4] font-geist-bold rounded-lg transition-all flex items-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download as PNG
          </button>

          <button
            onClick={handleCopyToClipboard}
            className="px-6 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:from-white/15 hover:to-white/10 text-[#ffffe4] font-geist-bold rounded-lg transition-all flex items-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  )
}
