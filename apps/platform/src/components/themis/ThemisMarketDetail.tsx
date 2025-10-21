import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { themisApi } from '../../services/api/themisApi'
import type { Market } from '../../services/api/themisApi'
import Themis2Options from './Themis2Options'
import ThemisMultiOptions from './ThemisMultiOptions'

export default function ThemisMarketDetail() {
  const { question } = useParams()
  const [market, setMarket] = useState<Market | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMarket = async () => {
      if (!question) {
        setLoading(false)
        return
      }

      try {
        const marketData = await themisApi.getMarketByQuestionSlug(question)
        setMarket(marketData || null)
      } catch (error) {
        console.error('Error fetching market:', error)
        setMarket(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMarket()
  }, [question])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FF8480] flex items-center justify-center">
        <div className="text-white font-geist text-xl">Loading market...</div>
      </div>
    )
  }

  if (!market) {
    return (
      <div className="min-h-screen bg-[#FF8480] flex items-center justify-center">
        <div className="text-white font-geist text-xl">Market not found</div>
      </div>
    )
  }

  // Determine which component to render based on market type
  if (market.type === 'multi-option') {
    return <ThemisMultiOptions market={market} />
  }

  return <Themis2Options market={market} />
}
