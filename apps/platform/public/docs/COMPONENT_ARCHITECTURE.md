# Platform Component Architecture

**Location**: `apps/platform/public/docs/COMPONENT_ARCHITECTURE.md`
**Last Updated**: 2025-10-21

Comprehensive documentation of all components, services, utilities, and architectural patterns in the platform.

---

## Table of Contents

1. [Core Application](#core-application)
2. [Module: Dione (Trading)](#module-dione-trading)
3. [Module: Hyperion (NFT/Gaming)](#module-hyperion-nftgaming)
4. [Module: Themis (Prediction Markets)](#module-themis-prediction-markets)
5. [Module: Zone (Social)](#module-zone-social)
6. [Module: Leda](#module-leda)
7. [Shared Components](#shared-components)
8. [Chart Components](#chart-components-reusable)
9. [Common Components](#common-components)
10. [Context Providers](#context-providers-state-management)
11. [Services & APIs](#services--apis)
12. [Utilities](#utilities--helpers)
13. [Icon System](#icon-system)
14. [Mock Data Architecture](#mock-data-architecture)
15. [Styling System](#styling-system)
16. [Component Patterns](#component-patterns)
17. [Module Summary](#module-summary)

---

## Core Application

### Main Entry Points
- `src/App.tsx` - Main application component with routing and providers
- `src/index.css` - Global styles and Tailwind configuration

### Pages (Top-level Routes)
- `src/pages/Home.tsx` - Landing/module selector page
- `src/pages/Leda.tsx` - Leda module page
- `src/pages/Themis.tsx` - Themis prediction markets module
- `src/pages/Dione.tsx` - Dione trading module
- `src/pages/Hyperion.tsx` - Hyperion NFT module
- `src/pages/Zone.tsx` - Zone social module
- `src/pages/Login.tsx` - Authentication page

---

## Module: Dione (Trading)

### Core Components
- `src/components/dione/DioneDashboardLayout.tsx` - Main layout wrapper with sidebar navigation
- `src/components/dione/DEXTrading.tsx` - Decentralized exchange trading interface with widget system
- `src/components/dione/TradingPanel.tsx` - Trading controls and order placement modal
- `src/components/dione/QuickTrade.tsx` - Quick trade widget for rapid order execution

### Orders & Portfolio
- `src/components/dione/OrdersPositions.tsx` - Orders and positions management with expandable modal
- `src/components/dione/PortfolioDashboard.tsx` - Portfolio overview with allocations and P&L
- `src/components/dione/TradeHistory.tsx` - Trade history display with share functionality
- `src/components/dione/Watchlist.tsx` - Symbol watchlist with category filtering and asset icons

### Market Data
- `src/components/dione/SymbolSelector.tsx` - Asset symbol selector dropdown with search
- `src/components/dione/MarketSummary.tsx` - Market overview with indices, crypto, commodities, ETFs
- `src/components/dione/Leaderboard.tsx` - Trading leaderboard with rankings
- `src/components/dione/VolumeLeaders.tsx` - Top volume assets display
- `src/components/dione/PriceAlerts.tsx` - Price alert management widget
- `src/components/dione/HeatMap.tsx` - Market heatmap visualization

### Charts
- `src/components/dione/AreaChart.tsx` - Area chart component (legacy)
- `src/components/dione/CandlestickChart.tsx` - Candlestick chart with TradingView integration
- `src/components/dione/DonutChart.tsx` - Donut chart for portfolio allocation
- `src/components/dione/GaugeChart.tsx` - Gauge chart visualization
- `src/components/dione/TradingQuadrantScatter.tsx` - Scatter plot for trading quadrant analysis

### Options & Modals
- `src/components/dione/OptionsChain.tsx` - Options chain display with calls and puts
- `src/components/dione/AddSymbolModal.tsx` - Add symbol to watchlist modal
- `src/components/dione/ModifyOrderModal.tsx` - Modify existing orders modal

### Data & Utilities
- `src/components/dione/candlestickData.ts` - Candlestick chart data utilities and generators

---

## Module: Hyperion (NFT/Gaming)

### Components
- `src/components/hyperion/Archetypes.tsx` - NFT archetypes display and management
- `src/components/hyperion/Chrysoplos.tsx` - Chrysoplos interface for NFT collection
- `src/components/hyperion/ForgeModal.tsx` - NFT forging modal with trait selection
- `src/components/hyperion/ExpandModal.tsx` - Expand NFT details modal
- `src/components/hyperion/TraitUpgrade.tsx` - Trait upgrade interface
- `src/components/hyperion/TraitsRadarChart.tsx` - Radar chart for NFT trait visualization

### Types & Services
- `src/components/hyperion/types.ts` - TypeScript type definitions for NFTs and traits
- `src/services/hyperion/archetypes.ts` - Archetypes data service and utilities

---

## Module: Themis (Prediction Markets)

### Core Components
- `src/components/themis/ThemisHome.tsx` - Main Themis dashboard with featured markets
- `src/components/themis/ThemisDashboardLayout.tsx` - Layout wrapper with navigation
- `src/components/themis/ThemisMarketDetail.tsx` - Individual market details and betting interface

### Market Types
- `src/components/themis/Themis2Options.tsx` - Binary (2-option) prediction markets
- `src/components/themis/ThemisMultiOptions.tsx` - Multi-option prediction markets

### User Features
- `src/components/themis/ThemisProfileSection.tsx` - User profile section with stats
- `src/components/themis/ThemisSavedMarkets.tsx` - Saved/favorited markets list

### Charts
- `src/components/themis/GaugeChartLight.tsx` - Light-themed gauge chart for market sentiment

---

## Module: Zone (Social)

### Core Components
- `src/components/zone/ZoneDashboardLayout.tsx` - Main layout wrapper for Zone
- `src/components/zone/UserProfile.tsx` - User profile page with stats and achievements

### Social Features
- `src/components/zone/Chat.tsx` - Chat interface with real-time messaging
- `src/components/zone/Friends.tsx` - Friends list and management
- `src/components/zone/Leaderboard.tsx` - Zone leaderboard with rankings

### Network Tabs
- `src/components/zone/Trinet.tsx` - Trinet social network view
- `src/components/zone/Valnet.tsx` - Valnet network view
- `src/components/zone/Skynet.tsx` - Skynet network view

### Modals
- `src/components/zone/ProfilePreviewModal.tsx` - Quick profile preview modal

---

## Module: Leda

**Status**: Module page exists, components to be developed
- `src/pages/Leda.tsx` - Leda module page
- `src/components/leda/README.md` - Module documentation

---

## Shared Components

### Navigation & Layout
- `src/components/shared/FloatingPanels.tsx` - Floating panel system with macOS-style dock
- `src/components/shared/SectionNavigation.tsx` - Section navigation controls

### Panels
- `src/components/shared/HubPanel.tsx` - Hub panel with module overview
- `src/components/shared/MinervaPanel.tsx` - AI assistant panel (Minerva)
- `src/components/shared/MessagesPanel.tsx` - Messages/notifications panel

### UI Components
- `src/components/shared/Preloader.tsx` - Loading preloader animation
- `src/components/shared/Dropdown.tsx` - Dropdown component
- `src/components/shared/OrderBookTable.tsx` - Order book table display
- `src/components/shared/CompanyLogo.tsx` - Company/stock logo fetcher with Elbstream integration
- `src/components/shared/PnLCard.tsx` - Profit & Loss card component
- `src/components/shared/PnLCardModal.tsx` - Shareable P&L card modal with social features

### Icons & Assets
- `src/components/shared/NetworthIcon.tsx` - Networth currency icon component (white)
- `src/components/shared/NetworthIcon-Black.tsx` - Networth currency icon (black variant)
- `src/components/shared/ResonanceIcon.tsx` - Resonance currency icon component (white)
- `src/components/shared/ResonanceIcon-Black.tsx` - Resonance currency icon (black variant)

---

## Chart Components (Reusable)

### Area Charts
- `src/components/charts/CustomAreaChart.tsx` - Custom area chart with hover functionality
- `src/components/charts/CustomAreaChartDione.tsx` - Dione-specific area chart
- `src/components/charts/AreaChartLight.tsx` - Light-themed area chart
- `src/components/charts/AreaChartThemis.tsx` - Themis-specific area chart
- `src/components/charts/MiniAreaChart.tsx` - Compact area chart for widgets

### Line Charts
- `src/components/charts/MultiLineChart.tsx` - Multi-line chart component
- `src/components/charts/MultiLineChartThemis.tsx` - Themis multi-line chart

### Specialized Charts
- `src/components/charts/PriceChart.tsx` - Price chart component
- `src/components/charts/OrderBookDepthChart.tsx` - Order book depth visualization
- `src/components/charts/SimpleCandlestickChart.tsx` - Lightweight candlestick chart for trading views

---

## Common Components

### Modals
- `src/components/common/ConfirmationModal.tsx` - Confirmation dialog with customizable buttons
- `src/components/common/StatusModal.tsx` - Status/notification modal (success/error states)

---

## Context Providers (State Management)

- `src/contexts/SavedMarketsContext.tsx` - Saved markets state for Themis
- `src/contexts/BalanceContext.tsx` - User balance state (NW and Resonance)
- `src/contexts/OrdersContext.tsx` - Trading orders state with refresh triggers
- `src/contexts/ModuleSelectorContext.tsx` - Module selector overlay state

---

## Services & APIs

### Dione Trading
- `src/services/api/dioneApi.ts` - Dione API client with order management
- `src/services/mock/mockDioneApi.ts` - Mock API implementation for development
- `src/services/mock/mockDioneData.ts` - Centralized mock data (tokens, OHLC, candlestick)

### Themis Prediction Markets
- `src/services/api/themisApi.ts` - Themis API client for markets and bets
- `src/services/mock/mockThemisApi.ts` - Mock API implementation

### Hyperion NFT/Gaming
- `src/services/hyperion/archetypes.ts` - Archetypes data service

---

## Utilities & Helpers

### Asset Management
- `src/utils/assetManifest.ts` - Asset management utilities and constants
- `src/utils/iconHelper.tsx` - Asset icon helper with local SVG + Logo.dev API fallback

### Mock Data
- `src/data/mockChartData.ts` - Mock chart data for development and testing

---

## Icon System

### Overview
The platform uses a robust icon system with automatic fallbacks for different asset types.

### AssetIcon Component
**Location**: `src/utils/iconHelper.tsx`

**Supported Asset Types**:
- `crypto` - Cryptocurrency icons
- `index` - Stock market indices
- `commodity` - Commodities (gold, oil, etc.)
- `etf` - Exchange-traded funds
- `stock` - Company stocks

**Icon Resolution Strategy**:
1. **Local SVG First**: Attempts to load from `/shared/asset-icons/{folder}/{symbol}.svg`
2. **Logo.dev API Fallback** (stocks only): Uses Logo.dev API with company name
3. **Colored Circle Fallback**: Shows first letter in colored circle

### Directory Structure
```
public/shared/asset-icons/
├── crypto/         # btc.svg, eth.svg, sol.svg, etc.
├── indices/        # spx.svg, ndx.svg, dji.svg, etc.
├── commodities/    # gold.svg, silver.svg, oil.svg, etc.
├── etfs/          # spy.svg, qqq.svg, etc.
└── stocks/        # aapl.svg, tsla.svg, nflx.svg, etc.
```

### Usage Example
```tsx
<AssetIcon
  type="stock"
  symbol="AAPL"
  name="Apple Inc"  // Required for stocks to enable Logo.dev fallback
  size={32}
  className="flex-shrink-0"
/>
```

### Category Mapping Helper
```tsx
const getAssetTypeFromCategory = (category: Category): AssetType => {
  const mapping = {
    'crypto': 'crypto',
    'indices': 'index',
    'commodities': 'commodity',
    'etfs': 'etf',
    'stocks': 'stock'
  }
  return mapping[category] || 'crypto'
}
```

---

## Mock Data Architecture

### Overview
Centralized mock data system for consistent development and testing.

### Token Data Structure
**Location**: `src/services/mock/mockDioneData.ts`

**Token Interface**:
```typescript
interface Token {
  symbol: string          // Trading symbol (e.g., 'AAPL', 'BTC')
  name: string           // Full name
  price: number          // Current price
  change: number         // Price change (absolute)
  changePercent: number  // Price change (percentage)
  category: 'indices' | 'stocks' | 'etfs' | 'crypto' | 'commodities'
  exchange?: string      // Exchange name
  iconColor?: string     // Fallback icon color
  description?: string   // Asset description
  news?: string         // Latest news item
}
```

### Candlestick Data Generation
**Functions**:
- `getCandlestickData(symbol, interval)` - Generate OHLC data for time intervals
- `getLatestOHLC(symbol, interval)` - Get most recent OHLC values

**Time Intervals**:
- `1D`, `1W`, `1M`, `3M`, `YTD`, `1Y`, `5Y`, `All`

**Features**:
- Realistic price movements with random walk
- Volume generation
- Date formatting for TradingView compatibility

---

## Styling System

### Liquid Glass Design
The platform uses a consistent "liquid glass" design language for all UI components.

### Core Patterns

#### Glass Background
```tsx
className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"
```

#### Borders
```tsx
className="border border-white/20"
```

#### Hover States
```tsx
className="hover:bg-white/5 hover:border-white/30"
```

#### Complete Card Example
```tsx
<div className="
  bg-gradient-to-br from-white/10 to-white/5
  backdrop-blur-xl
  border border-white/20
  rounded-lg
  shadow-lg
  hover:shadow-xl
  transition-all duration-300
  hover:border-white/30
">
  {/* Content */}
</div>
```

### Color Palette

**Positive/Green**: `#84cc16` (lime-500)
**Negative/Red**: `#ef4444` (red-500)
**Neutral**: `white` with varying opacity

**Text Hierarchy**:
- Primary: `text-white`
- Secondary: `text-white/60`
- Tertiary: `text-white/40`

### Typography

**Fonts**:
- `font-geist` - Primary UI font
- `font-geist-bold` - Headings
- `font-geist-mono` - Numbers and data
- `font-geist-mono-regular` - Regular mono
- `font-geist-mono-extralight` - Light mono for secondary data

---

## Component Patterns

### Widget System (Dione DEX)

**Location**: `src/components/dione/DEXTrading.tsx`

**Features**:
- 5 customizable widget slots
- Widget library modal for selection
- Three-dot edit buttons with liquid glass styling
- Widget swapping on-the-fly

**Slots**:
- `topRight`, `middleRight`, `bottomLeft`, `bottomMiddle`, `bottomRight`

**Available Widgets**:
- Options Chain
- Orders & Positions
- Leaderboard
- Market Heat Map
- Trade History
- Price Alerts
- Quick Trade
- Volume Leaders

### Modal Patterns

**Standard Modal Structure**:
```tsx
{isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg max-w-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <h2 className="text-white font-geist text-lg">Modal Title</h2>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* ... */}
      </div>
    </div>
  </div>
)}
```

### Dropdown Pattern

**Features**:
- Click outside to close
- Search functionality
- Keyboard navigation support
- Asset icon integration

**Example**: `SymbolSelector.tsx`, `AddSymbolModal.tsx`

### Chart Integration

**TradingView Lightweight Charts**:
- Used for candlestick charts
- Area charts
- Time series data

**Recharts**:
- Used for custom visualizations
- Donut charts
- Gauge charts
- Scatter plots

---

## Module Summary

| Module | Components | Description |
|--------|-----------|-------------|
| **Dione** | 22 | Trading platform with DEX, charts, orders, portfolio, widgets |
| **Hyperion** | 6 | NFT/gaming module with archetypes, forging, and trait visualization |
| **Themis** | 8 | Prediction markets with binary and multi-option bets |
| **Zone** | 9 | Social platform with chat, friends, and network views |
| **Leda** | 0 | Module page only (components TBD) |
| **Shared** | 15 | Cross-module components (panels, navigation, icons, P&L cards) |
| **Charts** | 10 | Reusable chart components for all modules |
| **Common** | 2 | Common UI components (modals) |

**Total Components**: 72+

---

## File Naming Conventions

- **Components**: PascalCase (e.g., `TradingPanel.tsx`)
- **Services**: camelCase (e.g., `dioneApi.ts`)
- **Utilities**: camelCase (e.g., `iconHelper.tsx`)
- **Types**: PascalCase (e.g., `types.ts`)
- **Data**: camelCase (e.g., `mockDioneData.ts`)
- **Contexts**: PascalCase + Context suffix (e.g., `BalanceContext.tsx`)

---

## Development Guidelines

### Adding New Components

1. Place in appropriate module folder (`dione`, `themis`, etc.)
2. Use liquid glass styling consistently
3. Integrate with existing context providers
4. Add to this documentation
5. Follow naming conventions

### Using Icons

1. Prefer `AssetIcon` component over custom icons
2. Always provide `name` prop for stocks
3. Use appropriate asset type based on category
4. Add local SVG files when possible

### Mock Data

1. Centralize in `mockDioneData.ts` or equivalent
2. Use consistent interfaces
3. Include realistic values and variations
4. Document data generation logic

---

*Last updated: 2025-10-21*
*Maintained by: Development Team*
*Location: `apps/platform/public/docs/COMPONENT_ARCHITECTURE.md`*
