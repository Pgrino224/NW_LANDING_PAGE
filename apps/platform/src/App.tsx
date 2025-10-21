import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Preloader from './components/shared/Preloader'
import Home from './pages/Home'
import Leda from './pages/Leda'
import Themis from './pages/Themis'
import Dione from './pages/Dione'
import Hyperion from './pages/Hyperion'
import Zone from './pages/Zone'
import ThemisMarketDetail from './components/themis/ThemisMarketDetail'
import UserProfile from './components/zone/UserProfile'
import ZoneDashboardLayout from './components/zone/ZoneDashboardLayout'
import FloatingPanels from './components/shared/FloatingPanels'
import { SavedMarketsProvider } from './contexts/SavedMarketsContext'
import { BalanceProvider } from './contexts/BalanceContext'
import { OrdersProvider } from './contexts/OrdersContext'
import { ModuleSelectorProvider, useModuleSelector } from './contexts/ModuleSelectorContext'

function AppContent() {
  const { isOverlayOpen, closeOverlay, toggleOverlay } = useModuleSelector()

  // Global ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleOverlay()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleOverlay])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leda" element={<Leda />} />
        <Route path="/themis" element={<Themis />} />
        <Route path="/themis/:category/:question" element={<ThemisMarketDetail />} />
        <Route path="/dione" element={<Dione />} />
        <Route path="/hyperion" element={<Hyperion />} />
        <Route path="/zone" element={<Zone />} />
        <Route path="/zone/:username" element={
          <ZoneDashboardLayout>
            <UserProfile />
          </ZoneDashboardLayout>
        } />
      </Routes>
      <FloatingPanels />

      {/* Module Selector Overlay - Always mounted, toggle visibility for performance */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-200 ${
          isOverlayOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <Home onCloseOverlay={closeOverlay} />
      </div>
    </BrowserRouter>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  // AUTH TEMPORARILY DISABLED FOR TESTING
  return (
    <>
      {isLoading && <Preloader onLoadComplete={handleLoadComplete} />}

      {!isLoading && (
        <BalanceProvider>
          <OrdersProvider>
            <SavedMarketsProvider>
              <ModuleSelectorProvider>
                <AppContent />
              </ModuleSelectorProvider>
            </SavedMarketsProvider>
          </OrdersProvider>
        </BalanceProvider>
      )}
    </>
  )
}

export default App
