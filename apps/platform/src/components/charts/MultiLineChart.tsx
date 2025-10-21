import ReactECharts from 'echarts-for-react'
import type { PricePoint } from '../../data/mockChartData'

interface MultiLineChartProps {
  data: Record<string, PricePoint[]>
  colors?: Record<string, string>
  height?: string
}

export default function MultiLineChart({
  data,
  colors = {},
  height = '500px'
}: MultiLineChartProps) {
  const defaultColors = ['#FFFFFF', '#000000', '#FF8480', '#888888']
  const candidateNames = Object.keys(data)

  // Get all unique timestamps
  const timestamps = data[candidateNames[0]]?.map(d => d.timestamp) || []

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '3%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    legend: {
      bottom: 0,
      textStyle: {
        color: '#FFFFFF',
        fontFamily: 'Geist, sans-serif',
        fontSize: 12
      },
      itemWidth: 20,
      itemHeight: 12
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#FFFFFF',
        fontFamily: 'Geist Mono, monospace'
      },
      formatter: (params: any) => {
        const date = new Date(params[0].axisValue)
        let result = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}<br/>`
        params.forEach((p: any) => {
          result += `${p.seriesName}: ${(p.value * 100).toFixed(1)}%<br/>`
        })
        return result
      }
    },
    xAxis: {
      type: 'category',
      data: timestamps,
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: '#1a1a1a' }
      },
      axisLabel: {
        color: '#1a1a1a',
        fontFamily: 'Geist Mono, monospace',
        fontSize: 10,
        showMaxLabel: true,
        showMinLabel: true,
        interval: (index: number) => {
          // Show every 10th label
          return index % 10 === 0
        },
        formatter: (value: string) => {
          const date = new Date(value)
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      position: 'right',
      axisLine: {
        lineStyle: { color: '#1a1a1a' }
      },
      axisLabel: {
        color: '#1a1a1a',
        fontFamily: 'Geist Mono, monospace',
        fontSize: 10,
        formatter: (value: number) => `${(value * 100).toFixed(0)}%`
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(26, 26, 26, 0.1)'
        }
      },
      min: 0,
      max: 1
    },
    series: candidateNames.map((name, index) => ({
      name,
      type: 'line',
      data: data[name].map(d => d.price),
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: colors[name] || defaultColors[index % defaultColors.length],
        width: 2
      }
    }))
  }

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  )
}
