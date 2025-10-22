# Dione Fixes Checklist

**Created:** 2025-10-19
**Status:** In Progress
**Total Fixes:** 12

---

## Progress Overview
- [x] **Tier 1:** Trivial Fixes (4 items) - ✅ ALL COMPLETED
- [x] **Tier 2:** Simple Fixes (2 items) - 🟡 1/2 COMPLETED (Fix 5 done, Fix 6 remaining)
- [ ] **Tier 3:** Moderate Complexity (2 items) - 🔴 NOT STARTED
- [ ] **Tier 4:** Complex Changes (2 items) - 🔴 NOT STARTED
- [ ] **Tier 5:** Most Complex (2 items) - 🔴 NOT STARTED

**Completed:** 5/12 fixes (41.7%)
**Remaining:** 7/12 fixes

---

## TIER 1: TRIVIAL FIXES (30 min total)

### ✅ Fix 1: Remove NetworthIcon from Watchlist Small Numbers
**Status:** ✅ COMPLETED (2025-10-19)
**File:** `src/components/dione/Watchlist.tsx`
**Estimated Time:** 5 minutes
**Actual Time:** 3 minutes
**Complexity:** 🟢 Very Easy

**Changes Completed:**
- ✅ Line 228: Removed `<NetworthIcon />` from Last price column
- ✅ Line 279: Removed `<NetworthIcon />` from description panel price display
- ✅ Removed unused NetworthIcon import
- ✅ Plain numbers only for cleaner look

**Code Changes:**
```tsx
// FROM:
<NetworthIcon />{formatPrice(token.price)}

// TO:
{formatPrice(token.price)}
```

**Notes:**
- Affects "Last" column in watchlist rows
- Also affects bottom description panel

---

### ✅ Fix 2: Remove Watchlist Shading
**Status:** ✅ COMPLETED (2025-10-19)
**File:** `src/components/dione/Watchlist.tsx`
**Estimated Time:** 10 minutes
**Actual Time:** 4 minutes
**Complexity:** 🟢 Very Easy

**Changes Completed:**
- ✅ Line 86: Removed `bg-white/15` from header
- ✅ Line 192: Replaced `bg-white/15` selection with `border-l-2 border-l-white` indicator
- ✅ Line 192: Added `border-l-2 border-l-transparent` for non-selected items (clean borders)
- ✅ Line 190: Removed `hover:bg-white/[0.08]` hover effect
- ✅ Pure transparent backgrounds throughout

**Code Changes:**
```tsx
// Line 87 - Header
className="px-4 py-3 border-b border-white/10 bg-white/15"
// TO:
className="px-4 py-3 border-b border-white/10"

// Line 193 - Selected item
${isSelected && !isRemovalMode ? 'bg-white/15' : ''}
// TO:
${isSelected && !isRemovalMode ? 'border-l-2 border-white' : ''}

// Line 191 - Hover
border-b border-white/5 hover:bg-white/[0.08]
// TO:
border-b border-white/5
```

**Notes:**
- Use left border for selection indicator instead
- Pure transparent backgrounds throughout

---

### ✅ Fix 3: Make Watchlist Rows Thinner
**Status:** ✅ COMPLETED (2025-10-19)
**File:** `src/components/dione/Watchlist.tsx`
**Estimated Time:** 5 minutes
**Actual Time:** 2 minutes
**Complexity:** 🟢 Easy

**Changes Completed:**
- ✅ Line 189: Reduced vertical padding from `py-1.5` → `py-1`
- ✅ Watchlist token rows are now more compact
- ✅ More items visible without scrolling
- ✅ Cleaner, tighter vertical spacing

**Code Changes:**
```tsx
// Find all table row padding:
className="py-3 px-4..."
// TO:
className="py-1.5 px-4..."

// Optional font size reduction if needed:
text-sm → text-xs
```

**Notes:**
- Test visual balance after padding changes
- Ensure touch targets are still adequate

---

### ✅ Fix 4: Download & Setup Icon Libraries + Implement All Icons
**Status:** ✅ COMPLETED (2025-10-19)
**Location:** `public/shared/asset-icons/` + Multiple components
**Estimated Time:** 30 minutes (setup) + 2 hours (implementation)
**Actual Time:** 25 minutes (setup) + 1.5 hours (implementation)
**Complexity:** 🟢 Easy (setup) + 🟡 Medium (implementation)

**Tasks Completed - Setup:**
1. ✅ Downloaded cryptocurrency-icons from https://github.com/spothq/cryptocurrency-icons
2. ✅ Extracted SVG icons for: BTC, ETH, SOL, ADA, DOT, LINK (6 crypto icons)
3. ✅ Organized in `/public/shared/asset-icons/crypto/`
4. ✅ Created icons for:
   - Indices: NDX, DJI, SP500, DAX, FTSE (5 icons)
   - Commodities: Gold, Silver, Oil, Gas (4 icons)
   - ETFs: SPY, QQQ, IVV, VTI, IWM, VEA, EFA, BND (8 icons)
5. ✅ Created icon mapping helper function at `src/utils/iconHelper.tsx`

**Total Icons Created:** 23 SVG files

**Tasks Completed - Implementation:**
1. ✅ MarketSummary.tsx - Major Indices Card (4 icons: NDX, DJI, DAX, FTSE)
2. ✅ MarketSummary.tsx - Crypto Market Cap Card (2 icons: BTC, ETH)
3. ✅ MarketSummary.tsx - Commodities Card (4 icons: Gold, Silver, Oil, Gas)
4. ✅ MarketSummary.tsx - Top ETFs Main Charts (2 icons: SPY, QQQ)
5. ✅ MarketSummary.tsx - Top ETFs Horizontal List (6 icons: IVV, VTI, IWM, VEA, EFA, BND)
6. ✅ Watchlist.tsx - All token rows (dynamic icons based on category)
7. ✅ Watchlist.tsx - Description panel (large icon in bottom section)
8. ✅ PortfolioDashboard.tsx - Recent Activity (icons for each trade)

**Total Icon Placements:** ~35+ locations across 3 files
**Files Modified:**
- `MarketSummary.tsx` (19 icon placements)
- `Watchlist.tsx` (all token rows + description panel)
- `PortfolioDashboard.tsx` (Recent Activity section)

---

## **ICON QUALITY UPGRADE - COMPLETED (2025-10-19)**

### **Company/Stock Logos Integration** ✅
- **Logo.dev API** integrated with API key
- Stocks (AAPL, TSLA, NFLX) now use real company logos dynamically
- API key stored in `.env` as `VITE_LOGODEV_API_KEY`

### **Commodities Icons Upgraded** ✅
**Source:** UXWing (professional quality SVG)
- Gold, Silver, Oil, Gas - All high-quality icons

### **Indices Icons Upgraded** ✅
**Style:** TradingView-inspired circular badges with ticker text
- NDX, DJI, SP500, DAX, FTSE - Clean, distinctive colors

### **ETF Icons Upgraded** ✅
**Style:** TradingView-inspired circular badges
- SPY, QQQ, IVV, VTI, IWM, VEA, EFA, BND - All color-coded

**Total:** 23 icons + Logo.dev API integration

**Icon Structure:**
```
public/shared/asset-icons/
├── crypto/
│   ├── btc.svg
│   ├── eth.svg
│   ├── sol.svg
│   └── ...
├── indices/
│   ├── nasdaq.svg
│   ├── dow.svg
│   ├── sp500.svg
│   └── ...
├── commodities/
│   ├── gold.svg
│   ├── silver.svg
│   ├── oil.svg
│   └── ...
└── etfs/
    ├── spy.svg
    ├── qqq.svg
    └── ...
```

**Helper Function to Create:**
```tsx
// src/utils/iconHelper.ts
export const getAssetIcon = (
  type: 'crypto' | 'index' | 'commodity' | 'etf',
  symbol: string
): string => {
  const normalizedSymbol = symbol.toLowerCase()
  return `/shared/asset-icons/${type}/${normalizedSymbol}.svg`
}

export const AssetIcon = ({
  type,
  symbol,
  size = 24,
  className = ''
}: {
  type: 'crypto' | 'index' | 'commodity' | 'etf'
  symbol: string
  size?: number
  className?: string
}) => {
  const [error, setError] = useState(false)

  if (error) {
    // Fallback: colored circle with first letter
    return (
      <div
        className={`rounded-full flex items-center justify-center text-white ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: '#666',
          fontSize: size * 0.5
        }}
      >
        {symbol.charAt(0)}
      </div>
    )
  }

  return (
    <img
      src={getAssetIcon(type, symbol)}
      alt={symbol}
      width={size}
      height={size}
      className={className}
      onError={() => setError(true)}
    />
  )
}
```

**Sources:**
- Crypto: https://github.com/spothq/cryptocurrency-icons
- Generic: https://simpleicons.org/
- Commodities: Heroicons or custom SVGs

---

## TIER 2: SIMPLE FIXES (1.5 hours total)

### ✅ Fix 5: Global Color Change - Limey Green
**Status:** ✅ COMPLETED (2025-10-19)
**Files:** Multiple (all Dione components)
**Estimated Time:** 45 minutes
**Actual Time:** 35 minutes
**Complexity:** 🟡 Medium-Easy

**Changes Completed:**
- ✅ Replaced all 70 instances of `#10b981` (emerald-500) with `#84cc16` (lime-500)
- ✅ Updated Tailwind classes: `text-green-500` → `text-lime-500` (2 instances)
- ✅ Updated Tailwind classes: `bg-green-500` → `bg-lime-500` (2 instances)
- ✅ All positive indicators now display in vibrant limey green

**Files Updated (18 total):**
- ✅ `src/components/dione/QuickTrade.tsx` (2 occurrences)
- ✅ `src/components/dione/CandlestickChart.tsx` (3 occurrences)
- ✅ `src/components/dione/DEXTrading.tsx` (4 hex + 2 Tailwind)
- ✅ `src/components/dione/OrdersPositions.tsx` (8 occurrences)
- ✅ `src/components/dione/PriceAlerts.tsx` (1 occurrence)
- ✅ `src/components/dione/GaugeChart.tsx` (1 occurrence)
- ✅ `src/components/dione/Watchlist.tsx` (4 occurrences)
- ✅ `src/components/dione/HeatMap.tsx` (1 occurrence)
- ✅ `src/components/dione/MarketSummary.tsx` (25 occurrences - most)
- ✅ `src/components/dione/PortfolioDashboard.tsx` (4 occurrences)
- ✅ `src/components/dione/ModifyOrderModal.tsx` (3 occurrences)
- ✅ `src/components/dione/TradingPanel.tsx` (4 occurrences)
- ✅ `src/components/dione/TradeHistory.tsx` (2 occurrences)
- ✅ `src/components/dione/VolumeLeaders.tsx` (2 occurrences)
- ✅ `src/components/dione/OptionsChain.tsx` (3 occurrences)
- ✅ `src/components/dione/Leaderboard.tsx` (2 occurrences)
- ✅ `src/components/dione/SymbolSelector.tsx` (2 Tailwind classes)
- ✅ `src/components/charts/MiniAreaChart.tsx` (1 occurrence)

**Visual Impact:**
- Portfolio PnL gains
- Positive price changes
- Profit indicators
- Upward trend lines in charts
- Gain percentages
- Win rate gauges
- Positive market movements

**Total Replacements:** ~74 across 18 files

**Notes:**
- New limey green (#84cc16) provides better contrast and more vibrant appearance
- More modern, energetic feel to the interface
- Successfully tested across all components

---

### ✅ Fix 6: Add Padding to Y-Axis Labels (Chart Spacing)
**Status:** 🔴 Not Started
**Files:**
- `src/components/charts/CustomAreaChartDione.tsx`
- `src/components/dione/CandlestickChart.tsx`

**Estimated Time:** 30 minutes
**Complexity:** 🟡 Medium-Easy

**Changes Required:**
- Increase top grid padding in ECharts configuration
- Add margin to Y-axis labels
- Prevent labels from touching chart container top edge

**ECharts Configuration Changes:**
```tsx
// In chart options:
option = {
  grid: {
    top: 40,        // INCREASE from ~20-30 to 40
    right: 20,
    bottom: 40,
    left: 60
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      margin: 15,    // Add space between label and axis
      // ... other config
    }
  }
}
```

**Files to Update:**
- CustomAreaChartDione.tsx - used in Portfolio PnL, Market Summary charts
- CandlestickChart.tsx - used in DEX section

**Notes:**
- May need to adjust based on visual testing
- Should apply to all chart types uniformly

---

## TIER 3: MODERATE COMPLEXITY (3.5 hours total)

### ✅ Fix 7: Add Asset Icons - Watchlist & Simple Locations
**Status:** 🔴 Not Started
**Files:**
- `src/components/dione/Watchlist.tsx`
- `src/components/dione/SymbolSelector.tsx`

**Estimated Time:** 1.5 hours
**Complexity:** 🟡 Medium

**Dependencies:**
- Requires Fix 4 (Icon setup) to be completed first

**Changes Required:**
- Replace colored circle placeholders with actual asset icons
- Add fallback for missing icons
- Implement AssetIcon component usage
- Update SymbolSelector dropdown to show icons

**Watchlist.tsx Changes:**
```tsx
// Line 213-217: Replace colored circle
// FROM:
<div
  className="w-4 h-4 rounded-full flex items-center justify-center text-white flex-shrink-0"
  style={{ backgroundColor: token.iconColor || '#666', fontSize: '9px' }}
>
  {token.symbol.substring(0, 1)}
</div>

// TO:
<AssetIcon
  type={token.category === 'crypto' ? 'crypto' : token.category === 'indices' ? 'index' : 'commodity'}
  symbol={token.symbol}
  size={16}
  className="flex-shrink-0"
/>
```

**SymbolSelector.tsx Changes:**
- Add icons to dropdown list items
- Add icon next to selected token display

**Notes:**
- Test fallback behavior for missing icons
- Ensure icons load quickly

---

### ✅ Fix 8: Add Toggle Button for Chart Types (Area vs Candlestick)
**Status:** 🔴 Not Started
**File:** `src/components/dione/MarketSummary.tsx`
**Estimated Time:** 2 hours
**Complexity:** 🟡 Medium

**Changes Required:**
- Add chart type state management for 3 sections (S&P 500, Crypto, ETFs)
- Create toggle button UI component
- Generate OHLC data from area chart data
- Conditional rendering between area and candlestick charts

**Sections to Update:**
1. **S&P 500 Chart** (lines 625-667)
2. **Crypto Market Cap Chart** (lines 718-843)
3. **Top ETFs Charts** (lines 879-979) - SPY and QQQ

**Add State:**
```tsx
const [spChartType, setSpChartType] = useState<'area' | 'candlestick'>('area')
const [cryptoChartType, setCryptoChartType] = useState<'area' | 'candlestick'>('area')
const [etfChartType, setEtfChartType] = useState<'area' | 'candlestick'>('area')
```

**Toggle Button Component:**
```tsx
// Add next to time interval buttons:
<div className="h-4 w-px bg-white/20 mx-2" /> {/* Divider */}
<button
  onClick={() => setSpChartType(prev => prev === 'area' ? 'candlestick' : 'area')}
  className="px-2 py-1 rounded border border-white/20 text-white/60 hover:text-white transition-colors"
  title={spChartType === 'area' ? 'Switch to candlestick' : 'Switch to area'}
>
  {spChartType === 'area' ? (
    // Area chart icon (line with fill)
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 17l6-6 4 4 8-8" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 17h18v4H3z" fill="currentColor" opacity="0.3"/>
    </svg>
  ) : (
    // Candlestick icon
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="8" width="3" height="8"/>
      <line x1="6.5" y1="6" x2="6.5" y2="18" stroke="currentColor"/>
      <rect x="11" y="10" width="3" height="6"/>
      <line x1="12.5" y1="8" x2="12.5" y2="18" stroke="currentColor"/>
      <rect x="17" y="6" width="3" height="10"/>
      <line x1="18.5" y1="4" x2="18.5" y2="18" stroke="currentColor"/>
    </svg>
  )}
</button>
```

**Data Generation Function:**
```tsx
// Generate OHLC data from area chart data
const generateOHLCFromArea = (areaData: {time: number, value: number}[]) => {
  return areaData.map((point, index) => {
    const open = point.value
    const close = areaData[index + 1]?.value || point.value
    const volatility = Math.abs(close - open) * 0.2
    const high = Math.max(open, close) + volatility
    const low = Math.min(open, close) - volatility

    return {
      time: point.time,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000 // Mock volume
    }
  })
}
```

**Conditional Rendering:**
```tsx
{spChartType === 'area' ? (
  <CustomAreaChartDione
    data={spChartData}
    color={spChartColor}
    onHover={(data) => setHoveredSpData(data)}
  />
) : (
  <CandlestickChart
    data={generateOHLCFromArea(spChartData)}
    symbol="S&P 500"
  />
)}
```

**Notes:**
- Apply to all 3 chart sections
- Ensure candlestick component exists or adapt DEX candlestick chart

---

## TIER 4: COMPLEX CHANGES (4.5 hours total)

### ✅ Fix 9: Add Asset Icons - Market Summary (All Sections)
**Status:** 🔴 Not Started
**File:** `src/components/dione/MarketSummary.tsx`
**Estimated Time:** 2.5 hours
**Complexity:** 🟠 Medium-Hard

**Dependencies:**
- Requires Fix 4 (Icon setup) to be completed first

**Sections Requiring Icons:**

#### 1. Major Indices (lines 669-716)
- Nasdaq 100 (NDX)
- Dow Jones (DJI)
- DAX
- FTSE 100

```tsx
// Line 675-684: Add icon before name
<div className="flex items-center gap-2">
  <AssetIcon type="index" symbol="NDX" size={20} />
  <div>
    <div className="text-white font-geist text-sm">Nasdaq 100</div>
    <div className="text-white/40 font-geist-mono text-xs">NDX</div>
  </div>
</div>
```

#### 2. Crypto Market Cap (lines 718-843)
- Bitcoin (line 788-801)
- Ethereum (line 803-817)
- Others (line 818-831)

```tsx
// Replace colored circles with actual icons:
<AssetIcon type="crypto" symbol="BTC" size={32} className="rounded-full" />
```

#### 3. Commodities (lines 845-877)
- Gold
- Silver
- Crude Oil
- Natural Gas

```tsx
// Add icons to each commodity display:
<div className="flex items-center gap-2">
  <AssetIcon type="commodity" symbol="GOLD" size={24} />
  <div>
    <div className="text-white/60 font-geist text-xs mb-1">Gold</div>
    <div className="text-white font-geist-mono text-lg">$2,045</div>
    <div className="font-geist-mono text-xs" style={{ color: '#10b981' }}>+0.42%</div>
  </div>
</div>
```

#### 4. Top ETFs (lines 879-979)
- SPY header
- QQQ header
- Horizontal scroll list (IVV, VTI, IWM, VEA, EFA, BND)

```tsx
// Add to ETF displays:
<div className="flex items-center gap-2">
  <AssetIcon type="etf" symbol="SPY" size={20} />
  <div>
    <div className="text-white font-geist text-sm">SPDR S&P 500</div>
    <div className="text-white/40 font-geist-mono text-xs">SPY</div>
  </div>
</div>
```

**Total Icon Locations:** ~20+ placements

**Notes:**
- Consistent sizing across similar elements
- Ensure all fallbacks work properly
- May need to create some commodity/index icons manually

---

### ✅ Fix 10: Improve Top Holdings Visualization
**Status:** 🔴 Not Started
**File:** `src/components/dione/PortfolioDashboard.tsx` (lines 275-289)
**Estimated Time:** 2 hours
**Complexity:** 🟠 Medium-Hard

**Current:** Basic donut chart showing percentage breakdown

**Enhancement Options:**

**Option A: Enhanced Donut (Recommended)**
- Keep donut structure
- Add hover interactions with tooltips
- Center displays total portfolio value
- Legend shows both % and $ amounts
- Smooth animations on load
- Interactive hover states

**Option B: Sunburst Chart**
- Hierarchical visualization
- Inner ring: Categories (Crypto, Stocks, etc.)
- Outer ring: Individual holdings
- More sophisticated, more data-dense

**Implementation (Enhanced Donut):**
```tsx
// Update DonutChart.tsx
<ReactECharts
  option={{
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold;">${params.name}</div>
            <div>${params.value.toFixed(2)}%</div>
            <div>$${(portfolioValue * params.value / 100).toLocaleString()}</div>
          </div>
        `
      }
    },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'], // Donut hole
      center: ['50%', '50%'],
      data: topHoldings,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: { show: false },
      labelLine: { show: false }
    }],
    graphic: [{
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: `$${portfolioValue.toLocaleString()}`,
        fontSize: 20,
        fontWeight: 'bold',
        fill: '#ffffff'
      }
    }]
  }}
/>
```

**Notes:**
- Add asset icons to legend items
- Smooth color transitions
- Responsive sizing

---

## TIER 5: MOST COMPLEX (6-8 hours total)

### ✅ Fix 11: Scatter Plot with Four Quadrants - Replace Biggest Win Card
**Status:** 🔴 Not Started
**File:** `src/components/dione/PortfolioDashboard.tsx` (lines 251-273)
**Estimated Time:** 4-6 hours
**Complexity:** 🔴 Hard

**Goal:** Replace "Biggest Win" card with scatter plot showing all closed trades across four trading type quadrants.

**Quadrant Layout:**
```
        High Volume
            |
  MARGIN ---+--- FUTURES
            |
    SPOT ---+--- OPTIONS
            |
        Low Volume
```

**Each Quadrant = Trade Type:**
- Top-left: Margin trades
- Top-right: Futures trades
- Bottom-left: Spot trades
- Bottom-right: Options trades

**Dot Properties:**
- **X-axis:** PnL amount (loss ← 0 → profit)
- **Y-axis:** Trade volume/size
- **Color:** Green for profitable, Red for loss
- **Size:** Based on percentage gain/loss
- **Tooltip:** Shows symbol, type, PnL, size

**Data Structure:**
```tsx
interface ScatterTradePoint {
  type: 'spot' | 'margin' | 'futures' | 'options'
  symbol: string
  pnl: number          // Profit/loss in dollars
  size: number         // Trade size in dollars
  pnlPercent: number   // Percentage gain/loss
  timestamp: string
}

// Process trades into quadrant data
const processTradesForScatter = (trades: Trade[]): ScatterTradePoint[] => {
  return trades
    .filter(t => t.status === 'closed')
    .map(trade => ({
      type: trade.type || 'spot', // Default to spot if not specified
      symbol: trade.symbol,
      pnl: trade.pnl,
      size: trade.entryPrice * trade.quantity,
      pnlPercent: ((trade.exitPrice! - trade.entryPrice) / trade.entryPrice) * 100,
      timestamp: trade.timestamp
    }))
}

// Position within quadrant
const getQuadrantPosition = (point: ScatterTradePoint) => {
  // Base position determined by trade type
  const quadrantOffsets = {
    margin: { baseX: -50, baseY: 50 },   // Top-left
    futures: { baseX: 50, baseY: 50 },   // Top-right
    spot: { baseX: -50, baseY: -50 },    // Bottom-left
    options: { baseX: 50, baseY: -50 }   // Bottom-right
  }

  const offset = quadrantOffsets[point.type]

  // Vary position within quadrant based on PnL and size
  const xVariation = (point.pnl / 1000) * 20 // Spread based on PnL
  const yVariation = (point.size / 10000) * 20 // Spread based on size

  return {
    x: offset.baseX + xVariation,
    y: offset.baseY + yVariation
  }
}
```

**ECharts Configuration:**
```tsx
// Create scatter chart component
<ReactECharts
  option={{
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const trade = params.data.trade
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; text-transform: uppercase;">${trade.type}</div>
            <div style="color: #888;">${trade.symbol}</div>
            <div style="color: ${trade.pnl >= 0 ? '#84cc16' : '#ef4444'}; font-weight: bold;">
              ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}
            </div>
            <div style="font-size: 12px;">
              Size: $${trade.size.toLocaleString()}
            </div>
            <div style="font-size: 12px;">
              ${trade.pnlPercent >= 0 ? '+' : ''}${trade.pnlPercent.toFixed(2)}%
            </div>
          </div>
        `
      }
    },
    grid: {
      top: 40,
      right: 20,
      bottom: 40,
      left: 20
    },
    xAxis: {
      type: 'value',
      min: -100,
      max: 100,
      splitLine: {
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.1)' }
      },
      axisLine: {
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.3)', width: 2 }
      },
      axisLabel: { show: false }
    },
    yAxis: {
      type: 'value',
      min: -100,
      max: 100,
      splitLine: {
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.1)' }
      },
      axisLine: {
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.3)', width: 2 }
      },
      axisLabel: { show: false }
    },
    series: [
      {
        type: 'scatter',
        data: scatterData.map(point => {
          const pos = getQuadrantPosition(point)
          return {
            value: [pos.x, pos.y],
            trade: point,
            itemStyle: {
              color: point.pnl >= 0 ? '#84cc16' : '#ef4444',
              opacity: 0.7
            },
            symbolSize: Math.min(Math.abs(point.pnlPercent) * 2, 20) // Size based on % gain
          }
        }),
        emphasis: {
          itemStyle: { opacity: 1, shadowBlur: 10 }
        }
      }
    ],
    // Quadrant labels
    graphic: [
      {
        type: 'text',
        left: '25%',
        top: '20%',
        style: {
          text: 'MARGIN',
          fill: 'rgba(255,255,255,0.3)',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        left: '70%',
        top: '20%',
        style: {
          text: 'FUTURES',
          fill: 'rgba(255,255,255,0.3)',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        left: '25%',
        top: '75%',
        style: {
          text: 'SPOT',
          fill: 'rgba(255,255,255,0.3)',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        left: '70%',
        top: '75%',
        style: {
          text: 'OPTIONS',
          fill: 'rgba(255,255,255,0.3)',
          fontSize: 12,
          fontWeight: 'bold'
        }
      }
    ]
  }}
  style={{ height: '100%', width: '100%' }}
/>
```

**Card Replacement:**
```tsx
// Replace lines 251-273 with:
<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 flex flex-col overflow-hidden">
  <div className="px-4 py-3 border-b border-white/10 bg-white/5">
    <h3 className="text-white font-geist text-lg">Trading Activity by Type</h3>
  </div>
  <div className="flex-1 p-4">
    <TradingQuadrantScatter trades={trades} />
  </div>
</div>
```

**Mock Data Update:**
```tsx
// Ensure trades have type field in mockData or API
interface Trade {
  // ... existing fields
  type: 'spot' | 'margin' | 'futures' | 'options'
}

// If not present, randomly assign for mock data:
const tradesWithTypes = trades.map(trade => ({
  ...trade,
  type: ['spot', 'margin', 'futures', 'options'][Math.floor(Math.random() * 4)]
}))
```

**Notes:**
- Complex visualization requiring careful positioning logic
- Need to balance distribution within quadrants
- Test with various trade counts
- Ensure tooltips are informative
- May need iterative refinement of positioning algorithm

---

### ✅ Fix 12: Add Asset Icons - DEX & Profile Sections (Comprehensive)
**Status:** 🔴 Not Started
**Files:** Multiple
**Estimated Time:** 3-4 hours
**Complexity:** 🔴 Hard

**Dependencies:**
- Requires Fix 4 (Icon setup) to be completed first

**Sections to Update:**

#### DEX Section Components:
1. **DEXTrading.tsx**
   - Chart headers (lines 88-94, 204-210)
   - Buy/sell button overlays (show asset icon)
   - OHLC data display

2. **OrdersPositions.tsx**
   - Symbol column in orders table
   - Symbol column in positions table

3. **OptionsChain.tsx**
   - Strike price rows with underlying asset icon

4. **TradeHistory.tsx**
   - Symbol column in trade history

5. **VolumeLeaders.tsx**
   - Token column in volume leaders list

6. **HeatMap.tsx**
   - Each cell should show token icon

7. **QuickTrade.tsx**
   - Selected asset icon

8. **Leaderboard.tsx**
   - Player position rows (if showing trades)

9. **Widget Library Previews**
   - Mini previews in modal (lines 440-565)

#### Profile Section:
1. **PortfolioDashboard.tsx**
   - Recent Activity rows (lines 312-325) - add icon before symbol
   - Top Holdings donut legend - add icons to each holding
   - PnL chart header - add icon next to current value

**Example Implementation Pattern:**
```tsx
// For table rows:
<div className="flex items-center gap-2">
  <AssetIcon
    type={determineAssetType(symbol)}
    symbol={symbol}
    size={20}
  />
  <span className="text-white font-geist text-sm">{symbol}</span>
</div>

// For chart headers:
<div className="flex items-center gap-3">
  <AssetIcon type="crypto" symbol={selectedToken.symbol} size={24} />
  <h3 className="text-white font-geist text-lg">PnL</h3>
  <div className="flex items-baseline gap-2">
    {/* ... existing content */}
  </div>
</div>
```

**Helper Function:**
```tsx
// Determine asset type from symbol or context
const determineAssetType = (
  symbol: string,
  category?: string
): 'crypto' | 'index' | 'commodity' | 'etf' => {
  if (category) {
    if (category === 'crypto') return 'crypto'
    if (category === 'indices') return 'index'
    if (category === 'commodities') return 'commodity'
    if (category === 'etfs') return 'etf'
  }

  // Fallback: guess from symbol
  const cryptoSymbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK']
  if (cryptoSymbols.includes(symbol)) return 'crypto'

  return 'index' // default
}
```

**Locations Count:** 30+ icon placements across multiple files

**Notes:**
- Most time-consuming due to sheer number of locations
- Need systematic approach to avoid missing spots
- Test each component individually
- Ensure consistent sizing within each component type

---

## NOTES & DECISIONS

### Icon Library Decision:
- **Primary:** cryptocurrency-icons (https://github.com/spothq/cryptocurrency-icons)
- **Secondary:** Simple Icons for companies/exchanges
- **Tertiary:** Custom SVGs for commodities, indices

### Color Scheme:
- **New Positive Green:** `#84cc16` (lime-500)
- **Negative Red:** `#ef4444` (unchanged)

### Scatter Plot Quadrants:
- **Top-left:** Margin trades
- **Top-right:** Futures trades
- **Bottom-left:** Spot trades
- **Bottom-right:** Options trades
- **Dots:** Individual closed trades
- **X-axis spread:** Based on PnL amount
- **Y-axis spread:** Based on trade size
- **Dot color:** Green (profit) / Red (loss)
- **Dot size:** Based on percentage gain/loss

---

## COMPLETION TRACKING

**Start Date:** [To be filled]
**End Date:** [To be filled]
**Total Time:** [To be filled]

**Completion Log:**
- Fix 1: [ ] Started: ___ | Completed: ___
- Fix 2: [ ] Started: ___ | Completed: ___
- Fix 3: [ ] Started: ___ | Completed: ___
- Fix 4: [ ] Started: ___ | Completed: ___
- Fix 5: [ ] Started: ___ | Completed: ___
- Fix 6: [ ] Started: ___ | Completed: ___
- Fix 7: [ ] Started: ___ | Completed: ___
- Fix 8: [ ] Started: ___ | Completed: ___
- Fix 9: [ ] Started: ___ | Completed: ___
- Fix 10: [ ] Started: ___ | Completed: ___
- Fix 11: [ ] Started: ___ | Completed: ___
- Fix 12: [ ] Started: ___ | Completed: ___

---

**Last Updated:** 2025-10-19
