import { useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface Trait {
  id: string
  name: string
  icon: string
  level: number
  maxLevel: number
}

interface MiniRadarChartProps {
  traits: Trait[]
  size?: number
}

export default function MiniRadarChart({ traits, size = 220 }: MiniRadarChartProps) {
  const chartRef = useRef<ReactECharts>(null)

  // Prepare radar indicators (axis labels and max values)
  const indicators = traits.map(trait => ({
    name: trait.name,
    max: trait.maxLevel
  }))

  // Calculate current levels
  const currentLevels = traits.map(trait => trait.level)

  const option: EChartsOption = {
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitNumber: 7,
      center: ['50%', '50%'],
      radius: '65%',
      startAngle: 90,
      axisName: {
        show: false // Hide labels for compact view
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      splitArea: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.15)'
        }
      }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: currentLevels,
            name: 'Current',
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.8)',
              width: 2
            },
            areaStyle: {
              color: 'rgba(255, 255, 255, 0.15)'
            },
            itemStyle: {
              color: 'rgba(255, 255, 255, 0.9)'
            }
          }
        ],
        emphasis: {
          lineStyle: {
            width: 3
          }
        }
      }
    ],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontFamily: 'Geist Mono',
        fontSize: 11
      },
      formatter: (params: any) => {
        if (!params.value) return ''
        let tooltip = '<div style="font-weight: 600; margin-bottom: 4px;">Traits</div>'

        traits.forEach((trait, index) => {
          const current = currentLevels[index].toFixed(1)

          tooltip += `<div style="display: flex; justify-content: space-between; gap: 12px; margin-top: 2px;">
            <span>${trait.name}:</span>
            <span style="font-weight: 600;">${current}/${trait.maxLevel.toFixed(1)}</span>
          </div>`
        })

        return tooltip
      }
    }
  }

  // Calculate icon positions around the radar chart
  const getIconPosition = (index: number, total: number) => {
    // Start at 90° (top), go clockwise
    const angleDegrees = 90 - (index * 360 / total)
    const angleRadians = angleDegrees * (Math.PI / 180)

    const chartCenterX = size / 2
    const chartCenterY = size / 2
    const iconSize = 24 // Smaller icons for compact view

    // Position icons just outside the chart radius (65% of container)
    const iconRadius = (size / 2) * 0.65 + 20 // Chart radius + spacing

    const x = chartCenterX + iconRadius * Math.cos(angleRadians) - (iconSize / 2)
    const y = chartCenterY - iconRadius * Math.sin(angleRadians) - (iconSize / 2)

    return { x, y }
  }

  return (
    <div className="relative flex items-center justify-center -mt-3" style={{ width: size, height: size }}>
      {/* Trait Icons positioned around the radar */}
      {traits.map((trait, index) => {
        const position = getIconPosition(index, traits.length)
        return (
          <div
            key={trait.id}
            className="absolute w-6 h-6 rounded bg-white/10 border border-white/20 flex items-center justify-center p-1"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 10
            }}
          >
            <img
              src={trait.icon}
              alt={trait.name}
              className="w-full h-full object-contain filter brightness-0 invert"
            />
          </div>
        )
      })}

      {/* ECharts Radar */}
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  )
}
