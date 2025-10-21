import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { themisApi } from '../../services/api/themisApi'
import type { Market } from '../../services/api/themisApi'
import { useSavedMarkets } from '../../contexts/SavedMarketsContext'

// Slider styles
const customStyles = `
  .custom-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 20px;
    background: transparent;
    outline: none;
    transition: all 0.3s ease;
    position: relative;
    margin: 0;
    padding: 0;
  }

  .custom-slider::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  .custom-slider::-moz-range-track {
    width: 100%;
    height: 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  .custom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background-image: url('/shared/logo/networth-white.svg');
    background-size: 60%;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #FF8480;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    filter: drop-shadow(0 0 10px rgba(255, 132, 128, 0.5));
    margin-top: -6px;
  }

  .custom-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background-image: url('/shared/logo/networth-white.svg');
    background-size: 60%;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #FF8480;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    filter: drop-shadow(0 0 10px rgba(255, 132, 128, 0.5));
  }

  .slider-container-yes {
    position: relative;
    height: 20px;
    display: flex;
    align-items: center;
  }

  .slider-fill-yes {
    position: absolute;
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(to right,
      rgba(255, 132, 128, 0.2) 0%,
      #FF8480 100%
    );
    pointer-events: none;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }

  .slider-container-no {
    position: relative;
    height: 20px;
    display: flex;
    align-items: center;
  }

  .slider-fill-no {
    position: absolute;
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(to right,
      rgba(0, 0, 0, 0.2) 0%,
      #000000 100%
    );
    pointer-events: none;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }

  /* Dark Scrollbar for Themis (light background) */
  .themis-scrollbar::-webkit-scrollbar {
    width: 0.2px !important;
    height: 0.2px !important;
  }

  .themis-scrollbar::-webkit-scrollbar-track {
    background: transparent !important;
    background-color: transparent !important;
  }

  .themis-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.6) !important;
    border-radius: 0.5px !important;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.8) !important;
  }

  .themis-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.8) !important;
    box-shadow: 0 0 6px rgba(0, 0, 0, 1) !important;
  }

  .themis-scrollbar::-webkit-scrollbar-button {
    display: none !important;
  }

  /* Firefox */
  .themis-scrollbar {
    scrollbar-width: thin !important;
    scrollbar-color: rgba(0, 0, 0, 0.6) transparent !important;
  }
`

interface ThemisHomeProps {
  onMarketClick?: (market: Market) => void
  userBalance?: number
  isActive?: boolean
}

export default function ThemisHome({ onMarketClick, userBalance = 10000, isActive = true }: ThemisHomeProps) {
  const navigate = useNavigate()
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [betAmount, setBetAmount] = useState(500)
  const [bettingMode, setBettingMode] = useState<any>(null)
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const { savedMarkets, toggleSaveMarket, isSaved } = useSavedMarkets()

  // Categories for navigation
  const categories = ['FINANCE', 'CRYPTO', 'ECONOMICS', 'POLITICS']


  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const data = await themisApi.getMarkets()
        setMarkets(data)
      } catch (error) {
        console.error('Error loading markets:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMarkets()
  }, [])

  // Group markets by category
  const marketsByCategory = {
    finance: markets.filter(m => m.category === 'finance'),
    crypto: markets.filter(m => m.category === 'crypto'),
    economics: markets.filter(m => m.category === 'economics'),
    politics: markets.filter(m => m.category === 'politics')
  }

  const handleSectionChange = (index: number) => {
    if (!isTransitioning && index !== currentSectionIndex) {
      setIsTransitioning(true)
      setCurrentSectionIndex(index)
      setActiveCardIndex(0)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 600)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentSectionIndex > 0) {
        handleSectionChange(currentSectionIndex - 1)
      } else if (e.key === 'ArrowDown' && currentSectionIndex < categories.length - 1) {
        handleSectionChange(currentSectionIndex + 1)
      }
    }

    const handleWheel = (e: WheelEvent) => {
      // Only prevent default scroll when ThemisHome is the active section
      if (!isActive) return

      e.preventDefault()
      if (!isTransitioning) {
        // Require a threshold to prevent overly sensitive scrolling
        const scrollThreshold = 50
        if (e.deltaY > scrollThreshold && currentSectionIndex < categories.length - 1) {
          handleSectionChange(currentSectionIndex + 1)
        } else if (e.deltaY < -scrollThreshold && currentSectionIndex > 0) {
          handleSectionChange(currentSectionIndex - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [currentSectionIndex, isTransitioning, isActive])

  const calculateWinnings = (betAmount: number, percentage: string) => {
    const percent = parseInt(percentage) / 100
    return Math.floor(betAmount / percent)
  }

  const handleBetClick = (e: React.MouseEvent, marketId: string, option: string, betType: 'yes' | 'no', cardIndex: number) => {
    e.stopPropagation()
    setBettingMode({ cardId: marketId, option, betType, cardIndex })
    setBetAmount(500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white font-geist">Loading markets...</div>
      </div>
    )
  }

  const renderMarketCard = (market: Market, gridColumn: string, gridRow: string, cardIndex: number) => {
    const isInBettingMode = bettingMode && bettingMode.cardId === market.id.toString() && bettingMode.cardIndex === cardIndex

    return (
      <div
        key={market.id}
        className="relative cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 group"
        style={{
          gridColumn,
          gridRow
        }}
        onMouseEnter={() => !isInBettingMode && setActiveCardIndex(cardIndex)}
        onClick={() => {
          if (!isInBettingMode) {
            // Create URL-friendly question slug
            const questionSlug = market.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            navigate(`/themis/${market.category}/${questionSlug}`)
            onMarketClick?.(market)
          }
        }}
      >
        <div
          className="w-full h-full border border-white/20 relative overflow-hidden rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg"
        >
          {/* Progress Bar - Top Right Corner (for 2-option markets) */}
          {!isInBettingMode && market.type === '2-option' && (
            <div className="absolute top-3 right-3 flex items-center space-x-2 z-20">
              {/* Progress Bar */}
              <div className="relative bg-white bg-opacity-30 overflow-hidden rounded-full border-2" style={{
                width: '8px',
                height: '28px',
                borderColor: '#ffffe4'
              }}>
                <div
                  className="w-full absolute bottom-0 transition-all duration-300 rounded-full"
                  style={{
                    height: `${parseInt(market.yes || '50')}%`,
                    backgroundColor: '#ffffe4'
                  }}
                />
              </div>

              {/* YES percentage */}
              <div className="flex flex-col">
                <span className="font-geist text-xs text-[#ffffe4]">
                  {market.yes}
                </span>
                <span className="font-geist text-xs" style={{ color: '#ffffe4' }}>
                  YES
                </span>
              </div>
            </div>
          )}

          <div className="p-3 h-full flex flex-col justify-between relative z-10">
            {isInBettingMode ? (
              // Betting Mode
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-geist text-[#ffffe4]">
                    {market.type === '2-option' ? market.question : bettingMode.option}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setBettingMode(null)
                    }}
                    className="hover:opacity-80 transition-opacity text-[#ffffe4] text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center py-2">
                  <div className="w-full flex flex-col space-y-2">
                    {/* Amount Display */}
                    <div className="text-center">
                      <div className="font-geist-mono-extralight text-xl text-[#ffffe4]">
                        ${betAmount.toLocaleString()}
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="w-full px-2">
                      <div className={bettingMode.betType === 'yes' ? 'slider-container-yes' : 'slider-container-no'} style={{ position: 'relative' }}>
                        <div
                          className={bettingMode.betType === 'yes' ? 'slider-fill-yes' : 'slider-fill-no'}
                          style={{
                            width: `${(betAmount / 10000) * 100}%`,
                            zIndex: 1
                          }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          value={betAmount}
                          onChange={(e) => setBetAmount(Number(e.target.value))}
                          className={`custom-slider ${bettingMode.betType === 'yes' ? 'bet-yes' : 'bet-no'} w-full`}
                          style={{ position: 'relative', zIndex: 2 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom - Betting button */}
                <div className="flex justify-center">
                  <button
                    className="font-geist-mono-extralight px-4 py-2 flex items-center justify-center gap-2 text-xs rounded
                      backdrop-blur-sm border transition-all duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: bettingMode.betType === 'yes'
                        ? '#84cc16'
                        : '#ef4444',
                      borderColor: bettingMode.betType === 'yes'
                        ? '#84cc16'
                        : '#ef4444',
                      color: 'white'
                    }}
                  >
                    <span>
                      {bettingMode.betType.toUpperCase()}
                    </span>
                    <span>
                      To win ${betAmount ? calculateWinnings(betAmount, market.type === '2-option' ? market.yes || '50%' : '50%').toLocaleString() : 0}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              // Normal Display
              <>
                {/* Question Image + Question Text - Horizontal Layout */}
                <div className="flex items-start gap-2 mb-1.5">
                  {/* Question Background Image as Square */}
                  <div
                    className="w-10 h-10 flex-shrink-0 rounded bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${market.imageUrl || '/themis/questions/themis-test.png'})`
                    }}
                  />

                  {/* Question Text */}
                  <div className={`text-[#ffffe4] font-geist text-sm leading-tight overflow-hidden text-ellipsis whitespace-nowrap flex-1 ${market.type === '2-option' ? 'pr-16' : ''}`}>
                    {market.question}
                  </div>
                </div>

                {/* Buttons */}
                <div>
                  {market.type === '2-option' ? (
                    <div className="flex gap-2">
                      <button
                        className="font-geist-mono-extralight text-xs flex-1 py-2 px-3 rounded
                          backdrop-blur-sm border transition-all duration-200"
                        style={{
                          backgroundColor: '#84cc16',
                          borderColor: '#84cc16',
                          color: 'white'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        onClick={(e) => handleBetClick(e, market.id.toString(), 'Yes', 'yes', cardIndex)}
                      >
                        YES
                      </button>

                      <button
                        className="font-geist-mono-extralight text-xs flex-1 py-2 px-3 rounded
                          backdrop-blur-sm border transition-all duration-200"
                        style={{
                          backgroundColor: '#ef4444',
                          borderColor: '#ef4444',
                          color: 'white'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        onClick={(e) => handleBetClick(e, market.id.toString(), 'No', 'no', cardIndex)}
                      >
                        NO
                      </button>
                    </div>
                  ) : (
                    // Multi-option markets
                    <div className="space-y-1 h-20 overflow-y-auto themis-scrollbar">
                      {market.options?.slice(0, 3).map((option, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <span className="font-geist text-xs text-[#ffffe4] truncate flex-1">
                            {option.name}
                          </span>
                          <span className="font-geist text-xs text-[#ffffe4]/60 mx-1">
                            {option.percentage}
                          </span>
                          <button
                            className="font-geist-mono-extralight ml-1 px-2 py-1 text-xs rounded
                              backdrop-blur-sm border transition-all duration-200"
                            style={{
                              backgroundColor: '#84cc16',
                              borderColor: '#84cc16',
                              color: 'white'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = '0.8';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                            onClick={(e) => handleBetClick(e, market.id.toString(), option.name, 'yes', cardIndex)}
                          >
                            Y
                          </button>
                          <button
                            className="font-geist-mono-extralight ml-1 px-2 py-1 text-xs rounded
                              backdrop-blur-sm border transition-all duration-200"
                            style={{
                              backgroundColor: '#ef4444',
                              borderColor: '#ef4444',
                              color: 'white'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = '0.8';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                            onClick={(e) => handleBetClick(e, market.id.toString(), option.name, 'no', cardIndex)}
                          >
                            N
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Volume and Save */}
                <div className="flex justify-between items-center">
                  <span className="text-xs font-geist-mono-extralight text-[#ffffe4]">Vol: {market.volume}</span>

                  {/* Save Button (Bookmark) */}
                  <button
                    className="hover:opacity-70 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSaveMarket(market.id.toString())
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={isSaved(market.id.toString()) ? "#ffffe4" : "none"}
                      stroke="#ffffe4"
                      strokeWidth="2"
                      className="w-4 h-4"
                    >
                      <path d="M5 2v20l7-3 7 3V2H5z"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderSection = (categoryMarkets: Market[], categoryIndex: number) => {
    // Position 4 cards at bottom of grid (rows 14-19)
    const cardPositions = [
      { col: '2 / 6', row: '14 / 19' },
      { col: '7 / 11', row: '14 / 19' },
      { col: '12 / 16', row: '14 / 19' },
      { col: '17 / 21', row: '14 / 19' }
    ]

    // Calculate position and animation based on section state
    const isMovingUp = categoryIndex < currentSectionIndex
    const isMovingDown = categoryIndex > currentSectionIndex
    const isCurrent = categoryIndex === currentSectionIndex

    let transform = ''
    let transition = ''

    if (isCurrent) {
      // Current section - smooth slide to center
      transform = 'translateY(0vh)'
      transition = isTransitioning
        ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' // Material Design standard easing
        : 'none'
    } else if (isMovingUp) {
      // Section above - smooth slide up
      transform = 'translateY(-100vh)'
      transition = isTransitioning
        ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' // Material Design standard easing
        : 'none'
    } else if (isMovingDown) {
      // Section below - smooth slide down
      transform = 'translateY(100vh)'
      transition = isTransitioning
        ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' // Material Design standard easing
        : 'none'
    }

    return (
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform,
          transition
        }}
      >
        {/* 21x21 Grid */}
        <div className="grid-21x21 grid-full">

          {/* Large Question Display */}
          <div
            className="relative flex flex-col items-end justify-center p-8"
            style={{
              gridColumn: '5 / 21',
              gridRow: '5 / 11'
            }}
          >
            <h2 className="font-geist text-5xl text-[#ffffe4] mb-6 leading-tight text-right">
              {categoryMarkets[activeCardIndex]?.question || categoryMarkets[0]?.question}
            </h2>
            <button
              className="font-geist-mono-extralight px-8 py-3 text-sm bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg transition-all duration-200 text-[#ffffe4] hover:border-white/40"
              onClick={() => {
                const market = categoryMarkets[activeCardIndex] || categoryMarkets[0]
                if (market) {
                  const questionSlug = market.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                  navigate(`/themis/${market.category}/${questionSlug}`)
                  onMarketClick?.(market)
                }
              }}
            >
              PREDICT
            </button>
          </div>

          {/* Horizontal line above cards */}
          <div
            className="bg-white/20"
            style={{
              gridColumn: '4 / 21',
              gridRow: '12 / 13',
              height: '2px',
              alignSelf: 'end'
            }}
          />

          {/* Market Cards - Bottom aligned */}
          {categoryMarkets.slice(0, 4).map((market, index) =>
            renderMarketCard(market, cardPositions[index].col, cardPositions[index].row, index)
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Static Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/themis/themis-bg/themis-bg.png)'
          }}
        />

      {/* Navigation Controls - Top */}
      <div className="absolute top-3 left-0 right-0 z-50 flex items-center justify-between px-8 pr-16">
        <div className="flex gap-8">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => handleSectionChange(index)}
              className={`
                font-geist px-3 py-2 transition-all duration-300 relative
                ${index === currentSectionIndex
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80'
                }
              `}
            >
              {category}
              {index === currentSectionIndex && (
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white"
                  style={{
                    width: '25px',
                    height: '2px',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.4)'
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar - Left side, vertical */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSectionChange(index)}
              className={`
                h-8 w-1 rounded-full transition-all duration-300
                ${index === currentSectionIndex
                  ? 'bg-white'
                  : 'bg-white/30 hover:bg-white/50'
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* Sections Container */}
      <div className="relative w-full h-full">
        {renderSection(marketsByCategory.finance, 0)}
        {renderSection(marketsByCategory.crypto, 1)}
        {renderSection(marketsByCategory.economics, 2)}
        {renderSection(marketsByCategory.politics, 3)}
      </div>
    </div>
    </>
  )
}
