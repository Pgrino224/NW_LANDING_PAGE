import { useState, useEffect } from 'react'
import SectionNavigation from '../components/shared/SectionNavigation'
import DioneDashboardLayout from '../components/dione/DioneDashboardLayout'
import PortfolioDashboard from '../components/dione/PortfolioDashboard'
import DEXTrading from '../components/dione/DEXTrading'
import MarketSummary from '../components/dione/MarketSummary'
import { dioneApi, type Token } from '../services/api/dioneApi'

export default function Dione() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const data = await dioneApi.getMarkets()
        setTokens(data)
      } catch (error) {
        console.error('Error loading markets:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTokens()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white font-geist text-lg">Loading markets...</div>
      </div>
    )
  }

  const sections = [
    // Section 1: Portfolio Dashboard
    <DioneDashboardLayout key="portfolio" tokens={tokens}>
      <PortfolioDashboard />
    </DioneDashboardLayout>,

    // Section 2: Market Summary
    <DioneDashboardLayout key="market-summary" tokens={tokens}>
      <MarketSummary />
    </DioneDashboardLayout>,

    // Section 3: DEX Trading
    <DioneDashboardLayout key="dex" tokens={tokens}>
      <DEXTrading tokens={tokens} />
    </DioneDashboardLayout>
  ]

  return <SectionNavigation sections={sections} />
}
