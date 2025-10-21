import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { mockTokens } from './mockData'
import NetworthIcon from '../shared/NetworthIcon'

export default function HeatMap() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)

    // Prepare data for treemap
    const data = mockTokens.map(token => {
      const volume = Math.random() * 2000000000 // Mock volume data
      const changePercent = token.changePercent || 0

      return {
        name: token.symbol,
        value: volume,
        changePercent: changePercent,
        price: token.price,
        itemStyle: {
          color: changePercent > 5 ? 'rgba(132, 204, 22, 0.6)' :
                 changePercent > 2 ? 'rgba(132, 204, 22, 0.5)' :
                 changePercent > 0 ? 'rgba(132, 204, 22, 0.3)' :
                 changePercent > -2 ? 'rgba(239, 68, 68, 0.3)' :
                 changePercent > -5 ? 'rgba(239, 68, 68, 0.5)' :
                 'rgba(239, 68, 68, 0.6)',
          borderColor: changePercent > 0 ? 'rgba(132, 204, 22, 0.8)' : 'rgba(239, 68, 68, 0.8)',
          borderWidth: 1
        }
      }
    })

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        formatter: (params: any) => {
          const data = params.data
          return `
            <div style="font-family: 'Geist Mono', monospace;">
              <strong style="font-size: 14px;">${data.name}</strong><br/>
              <span style="display: flex; align-items: baseline;"><span style="color: #999;">Price:</span> <img src="/shared/token-logos/svg-white/networth-logo.svg" alt="NW" style="width: 12px; height: 12px; display: inline-block; vertical-align: baseline; margin: 0 2px;" />${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span><br/>
              <span style="color: #999;">Change:</span> <span style="color: ${data.changePercent > 0 ? '#84cc16' : '#ef4444'}">${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%</span><br/>
              <span style="display: flex; align-items: baseline;"><span style="color: #999;">Volume:</span> <img src="/shared/token-logos/svg-white/networth-logo.svg" alt="NW" style="width: 12px; height: 12px; display: inline-block; vertical-align: baseline; margin: 0 2px;" />${(data.value / 1000000).toFixed(2)}M</span>
            </div>
          `
        },
        backgroundColor: 'rgba(19, 19, 19, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 12
        }
      },
      series: [
        {
          type: 'treemap',
          data: data,
          roam: false,
          nodeClick: false,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          breadcrumb: {
            show: false
          },
          label: {
            show: true,
            formatter: (params: any) => {
              const data = params.data
              return `{symbol|${data.name}}\n{change|${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%}`
            },
            rich: {
              symbol: {
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'Geist Mono',
                color: '#fff',
                lineHeight: 18
              },
              change: {
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'Geist Mono',
                lineHeight: 20
              }
            }
          },
          upperLabel: {
            show: false
          },
          levels: [
            {
              itemStyle: {
                borderWidth: 2,
                gapWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }
            }
          ],
          width: '100%',
          height: '100%'
        }
      ]
    }

    chart.setOption(option)

    // Handle resize
    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [])

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <h3 className="text-white font-geist text-lg">Market Heat Map</h3>
        <p className="text-white/40 font-geist-mono-extralight text-[10px]">24H Change %</p>
      </div>

      {/* ECharts Treemap */}
      <div className="flex-1">
        <div ref={chartRef} className="w-full h-full" />
      </div>
    </div>
  )
}
