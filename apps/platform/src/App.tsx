import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Leda from './pages/Leda'
import Themis from './pages/Themis'
import Dione from './pages/Dione'
import Hyperion from './pages/Hyperion'
import Zone from './pages/Zone'
import ThemisMarketDetail from './components/themis/ThemisMarketDetail'
import FloatingPanels from './components/shared/FloatingPanels'

function App() {
  // AUTH TEMPORARILY DISABLED FOR TESTING
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/leda" element={<Leda />} />
        <Route path="/themis" element={<Themis />} />
        <Route path="/themis/:category/:question" element={<ThemisMarketDetail />} />
        <Route path="/dione" element={<Dione />} />
        <Route path="/hyperion" element={<Hyperion />} />
        <Route path="/zone" element={<Zone />} />
        <Route path="/" element={<Navigate to="/themis" />} />
      </Routes>
      <FloatingPanels />
    </BrowserRouter>
  )
}

export default App
