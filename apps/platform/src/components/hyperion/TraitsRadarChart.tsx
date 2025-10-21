import { useEffect, useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface Trait {
  id: string
  name: string
  icon: string
  level: number
  maxLevel: number
}

interface TraitsRadarChartProps {
  traits: Trait[]
  pendingUpgrades: Record<string, number>
}

export default function TraitsRadarChart({ traits, pendingUpgrades }: TraitsRadarChartProps) {
  const chartRef = useRef<ReactECharts>(null)

  // Prepare radar indicators (axis labels and max values)
  const indicators = traits.map(trait => ({
    name: trait.name,
    max: trait.maxLevel
  }))

  // Calculate current levels
  const currentLevels = traits.map(trait => trait.level)

  // Calculate projected levels (with pending upgrades)
  const projectedLevels = traits.map(trait => {
    const pending = pendingUpgrades[trait.id] || 0
    return trait.level + pending * 0.1
  })

  // Check if there are any pending upgrades
  const hasPendingUpgrades = Object.values(pendingUpgrades).some(count => count > 0)

  const option: EChartsOption = {
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitNumber: 7,
      center: ['50%', '50%'],
      radius: '65%',
      startAngle: 90,
      axisName: {
        show: false
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
          // Current levels
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
          },
          // Projected levels (only show if there are pending upgrades)
          ...(hasPendingUpgrades
            ? [
                {
                  value: projectedLevels,
                  name: 'Projected',
                  lineStyle: {
                    color: 'rgba(34, 197, 94, 0.8)',
                    width: 2,
                    type: 'dashed' as const
                  },
                  areaStyle: {
                    color: 'rgba(34, 197, 94, 0.1)'
                  },
                  itemStyle: {
                    color: 'rgba(34, 197, 94, 0.9)'
                  }
                }
              ]
            : [])
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
        fontSize: 12
      },
      formatter: (params: any) => {
        if (!params.value) return ''
        const traitName = params.name
        const values = params.value
        let tooltip = `<div style="font-weight: 600; margin-bottom: 4px;">${traitName}</div>`

        traits.forEach((trait, index) => {
          const current = currentLevels[index].toFixed(1)
          const projected = projectedLevels[index].toFixed(1)
          const pending = pendingUpgrades[trait.id] || 0

          tooltip += `<div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 2px;">
            <span>${trait.name}:</span>
            <span style="font-weight: 600;">${current}${pending > 0 ? ` → ${projected}` : ''}</span>
          </div>`
        })

        return tooltip
      }
    }
  }

  // Calculate icon positions around the radar chart
  const getIconPosition = (index: number, total: number) => {
    // Now that startAngle is set to 90, first axis is at top (12 o'clock)
    // ECharts goes clockwise from there
    const angleDegrees = 90 - (index * 360 / total) // Start at 90° (top), go clockwise
    const angleRadians = angleDegrees * (Math.PI / 180)

    const containerWidth = 550
    const containerHeight = 550
    const chartCenterX = containerWidth / 2
    const chartCenterY = containerHeight / 2
    const iconSize = 64

    // Position icons just outside the chart radius (65% of container)
    const iconRadius = (containerWidth / 2) * 0.65 + 50 // Chart radius + spacing

    const x = chartCenterX + iconRadius * Math.cos(angleRadians) - (iconSize / 2)
    const y = chartCenterY - iconRadius * Math.sin(angleRadians) - (iconSize / 2)

    return { x, y }
  }

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-['Geist_Mono'] text-sm font-semibold text-center">
          TRAIT PROFILE
        </h3>
      </div>
      <div className="relative flex-1 flex items-center justify-center">
        <div style={{ width: '550px', height: '550px' }}>
        {/* Trait Icons positioned around the radar */}
        {traits.map((trait, index) => {
          const position = getIconPosition(index, traits.length)
          return (
            <div
              key={trait.id}
              className="absolute w-16 h-16 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center p-3"
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
      </div>
      {hasPendingUpgrades && (
        <div className="mt-4 flex items-center justify-center gap-4 text-xs font-['Geist_Mono']">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-white/80"></div>
            <span className="text-white/60">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 border-t-2 border-dashed border-green-500"></div>
            <span className="text-white/60">Projected</span>
          </div>
        </div>
      )}
    </div>
  )
}
