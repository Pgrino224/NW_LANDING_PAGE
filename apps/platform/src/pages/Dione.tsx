import SectionNavigation from '../components/shared/SectionNavigation'
import DioneDashboardLayout from '../components/dione/DioneDashboardLayout'
import PortfolioDashboard from '../components/dione/PortfolioDashboard'
import DEXTrading from '../components/dione/DEXTrading'
import { mockTokens } from '../components/dione/mockData'

export default function Dione() {
  const sections = [
    // Section 1: Portfolio Dashboard
    <DioneDashboardLayout key="portfolio" tokens={mockTokens}>
      <PortfolioDashboard />
    </DioneDashboardLayout>,

    // Section 2: DEX Trading
    <DioneDashboardLayout key="dex" tokens={mockTokens}>
      <DEXTrading />
    </DioneDashboardLayout>
  ]

  return <SectionNavigation sections={sections} />
}
