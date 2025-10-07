import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { mockThemisApi } from '../../services/mockThemisApi'
import type { Market } from '../../services/mockThemisApi'

// Slider styles
const customStyles = `
  .custom-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    outline: none;
    transition: all 0.3s ease;
    position: relative;
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
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  }

  .slider-container-yes {
    position: relative;
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
  }

  .slider-container-no {
    position: relative;
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
  }
`

interface ThemisHomeProps {
  onMarketClick?: (market: Market) => void
  userBalance?: number
}

export default function ThemisHome({ onMarketClick, userBalance = 10000 }: ThemisHomeProps) {
  const navigate = useNavigate()
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeCardIndex, setActiveCardIndex] = useState(0) // Track which card is active for background
  const [backgroundLayer1, setBackgroundLayer1] = useState('')
  const [backgroundLayer2, setBackgroundLayer2] = useState('')
  const [activeLayer, setActiveLayer] = useState<1 | 2>(1) // Which layer is currently visible
  const [betAmount, setBetAmount] = useState(500)
  const [bettingMode, setBettingMode] = useState<any>(null)
  const [savedMarkets, setSavedMarkets] = useState<string[]>([])

  // Categories for navigation
  const categories = ['FINANCE', 'CRYPTO', 'ECONOMICS', 'POLITICS']

  // Background colors (solid instead of images)
  const backgroundColors = {
    finance: ['#FF8480', '#FF8480', '#FF8480', '#FF8480'],
    crypto: ['#FF8480', '#FF8480', '#FF8480', '#FF8480'],
    economics: ['#FF8480', '#FF8480', '#FF8480', '#FF8480'],
    politics: ['#FF8480', '#FF8480', '#FF8480', '#FF8480']
  }

  // Get background color for specific card
  const getBackgroundColor = (sectionIndex: number, cardIndex: number) => {
    const categoryKey = categories[sectionIndex].toLowerCase() as keyof typeof backgroundColors
    const colors = backgroundColors[categoryKey]
    return colors ? colors[cardIndex] : '#1a1a1a'
  }

  // Initialize first background
  useEffect(() => {
    const initialBg = getBackgroundColor(0, 0)
    setBackgroundLayer1(initialBg)
    setBackgroundLayer2(initialBg)
  }, [])

  // Handle background changes with cross-fade
  useEffect(() => {
    const newBackground = getBackgroundColor(currentSectionIndex, activeCardIndex)

    if (activeLayer === 1) {
      // If layer 1 is active, update layer 2 and switch to it
      setBackgroundLayer2(newBackground)
      setTimeout(() => setActiveLayer(2), 50) // Small delay to ensure image loads
    } else {
      // If layer 2 is active, update layer 1 and switch to it
      setBackgroundLayer1(newBackground)
      setTimeout(() => setActiveLayer(1), 50)
    }
  }, [currentSectionIndex, activeCardIndex])

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const data = await mockThemisApi.getMarkets()
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
      setActiveCardIndex(0) // Reset to first card when changing sections
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
  }, [currentSectionIndex, isTransitioning])

  const calculateWinnings = (betAmount: number, percentage: string) => {
    const percent = parseInt(percentage) / 100
    return Math.floor(betAmount / percent)
  }

  const handleBetClick = (e: React.MouseEvent, marketId: string, option: string, betType: 'yes' | 'no', cardIndex: number) => {
    e.stopPropagation()
    setBettingMode({ cardId: marketId, option, betType, cardIndex })
    setBetAmount(500)
  }

  const toggleSaveMarket = (marketId: string) => {
    setSavedMarkets(prev =>
      prev.includes(marketId)
        ? prev.filter(id => id !== marketId)
        : [...prev, marketId]
    )
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
    const backgroundColor = getBackgroundColor(currentSectionIndex, cardIndex)

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
          className="w-full h-full border border-white/10 relative overflow-hidden rounded-lg"
          style={{
            backgroundColor: `${backgroundColor}CC`
          }}
        >
          <div className="p-4 h-full flex flex-col justify-between relative z-10">
            {isInBettingMode ? (
              // Betting Mode
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-geist text-white">
                    {market.type === '2-option' ? market.question : bettingMode.option}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setBettingMode(null)
                    }}
                    className="hover:opacity-80 transition-opacity text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center py-2">
                  <div className="w-full flex flex-col space-y-2">
                    {/* Amount Display */}
                    <div className="text-center">
                      <div className="font-geist-mono-extralight text-xl text-white">
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
                      backdrop-blur-sm border transition-all duration-200 text-white hover:opacity-80"
                    style={{
                      backgroundColor: bettingMode.betType === 'yes'
                        ? '#FF8480'
                        : '#000000',
                      borderColor: bettingMode.betType === 'yes'
                        ? '#FF8480'
                        : '#000000'
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
                <div className="relative">
                  <div className="text-white font-geist text-sm leading-tight mb-2">
                    {market.question}
                  </div>

                  {/* Percentage Bar for 2-option markets */}
                  {market.type === '2-option' && (
                    <div className="absolute right-0 top-0 flex items-center space-x-2">
                      {/* Progress Bar */}
                      <div className="relative bg-white bg-opacity-30 overflow-hidden rounded-full" style={{
                        width: '8px',
                        height: '40px'
                      }}>
                        <div
                          className="w-full absolute bottom-0 transition-all duration-300 rounded-full"
                          style={{
                            height: `${parseInt(market.yes || '50')}%`,
                            backgroundColor: '#FF8480'
                          }}
                        />
                      </div>

                      {/* YES percentage */}
                      <div className="flex flex-col">
                        <span className="font-geist-mono-extralight text-xs text-white">
                          {market.yes}
                        </span>
                        <span className="font-geist-mono-extralight text-xs" style={{ color: '#FF8480' }}>
                          YES
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  {market.type === '2-option' ? (
                    <div className="flex gap-2">
                      <button
                        className="font-geist-mono-extralight text-xs flex-1 py-2 px-3 rounded
                          backdrop-blur-sm border transition-all duration-200 text-white"
                        style={{
                          backgroundColor: '#FF8480',
                          borderColor: '#FF8480'
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
                          backdrop-blur-sm border transition-all duration-200 text-white"
                        style={{
                          backgroundColor: '#000000',
                          borderColor: '#000000'
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
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {market.options?.slice(0, 3).map((option, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <span className="font-geist-mono-extralight text-xs text-white truncate flex-1">
                            {option.name}
                          </span>
                          <span className="font-geist-mono-extralight text-xs text-white/60 mx-1">
                            {option.percentage}
                          </span>
                          <button
                            className="font-geist-mono-extralight ml-1 px-2 py-1 text-xs rounded
                              backdrop-blur-sm border transition-all duration-200 text-white"
                            style={{
                              backgroundColor: '#FF8480',
                              borderColor: '#FF8480'
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
                              backdrop-blur-sm border transition-all duration-200 text-white"
                            style={{
                              backgroundColor: '#000000',
                              borderColor: '#000000'
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

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-geist-mono-extralight text-white/60">Vol: {market.volume}</span>

                    {/* Save and Logo icons */}
                    <div className="flex items-center gap-2">
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
                          fill={savedMarkets.includes(market.id.toString()) ? "#FFFFFF" : "none"}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          className="w-4 h-4"
                        >
                          <path d="M5 2v20l7-3 7 3V2H5z"/>
                        </svg>
                      </button>

                      {/* NetWorth Logo */}
                      <img
                        src="/shared/logo/networth-white.svg"
                        alt="NetWorth"
                        className="w-4 h-4 hover:opacity-70 transition-opacity"
                      />
                    </div>
                  </div>
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

          {/* Question Card */}
          <div
            className="p-6 flex items-center justify-center relative"
            style={{
              gridColumn: '11 / 21',
              gridRow: '4 / 6'
            }}
          >
            {/* Layer 1 Text */}
            <div
              className="absolute top-6 bottom-6 left-6 -right-1 text-white font-geist text-4xl text-right leading-relaxed transition-opacity duration-700 ease-in-out uppercase"
              style={{ opacity: activeLayer === 1 ? 1 : 0 }}
            >
              {categoryMarkets[activeCardIndex]?.question || ''}
            </div>

            {/* Layer 2 Text */}
            <div
              className="absolute top-6 bottom-6 left-6 -right-1 text-white font-geist text-4xl text-right leading-relaxed transition-opacity duration-700 ease-in-out uppercase"
              style={{ opacity: activeLayer === 2 ? 1 : 0 }}
            >
              {categoryMarkets[activeCardIndex]?.question || ''}
            </div>
          </div>

          {/* PREDICT Button - Separate from card */}
          <button
            className="font-geist-mono-extralight px-6 py-2 text-sm backdrop-blur-sm border transition-all duration-200 text-white hover:text-black rounded justify-self-end align-self-start"
            style={{
              gridColumn: '17 / 21',
              gridRow: '6 / 7',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onClick={() => {
              const market = categoryMarkets[activeCardIndex]
              if (market) {
                const questionSlug = market.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                navigate(`/themis/${market.category}/${questionSlug}`)
                onMarketClick?.(market)
              }
            }}
          >
            PREDICT
          </button>

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
        {/* Dual Layer Background System for Cross-Fade */}
      {/* Layer 1 */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
        style={{
          backgroundColor: backgroundLayer1,
          opacity: activeLayer === 1 ? 1 : 0
        }}
      />

      {/* Layer 2 */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
        style={{
          backgroundColor: backgroundLayer2,
          opacity: activeLayer === 2 ? 1 : 0
        }}
      />

      <div className="absolute inset-0 bg-black opacity-50" />

      {/* Navigation Controls - Top */}
      <div className="absolute top-3 left-0 right-0 z-50 flex items-center justify-between px-8 pr-16">
        <div className="flex gap-2">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => handleSectionChange(index)}
              className={`
                font-geist-mono-extralight px-3 py-2 transition-all duration-300 relative
                ${index === currentSectionIndex
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80'
                }
              `}
              style={{ width: '100px' }}
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

      {/* Progress Dots - Left side, vertical */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-3">
        {categories.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSectionChange(index)}
            className={`
              transition-all duration-300 transform rotate-45
              ${index === currentSectionIndex
                ? 'w-3 h-3 bg-white'
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }
            `}
          />
        ))}
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
