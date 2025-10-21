import ReactECharts from 'echarts-for-react'
import type { PricePoint } from '../../data/mockChartData'

interface PriceChartProps {
  data: PricePoint[]
  lineColor?: string
  title?: string
  height?: string
}

export default function PriceChart({
  data,
  lineColor = '#FFFFFF',
  title,
  height = '500px'
}: PriceChartProps) {
  const option = {
    backgroundColor: 'transparent',
    title: title ? {
      text: title,
      textStyle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'normal'
      }
    } : undefined,
    grid: {
      left: '3%',
      right: '3%',
      bottom: '10%',
      top: title ? '15%' : '10%',
      containLabel: true
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
        const point = params[0]
        const date = new Date(point.axisValue)
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}<br/>${(point.value * 100).toFixed(1)}%`
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.timestamp),
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
    series: [
      {
        type: 'line',
        data: data.map(d => d.price),
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: lineColor,
          width: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${lineColor}40` },
              { offset: 1, color: `${lineColor}00` }
            ]
          }
        }
      }
    ]
  }

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  )
}
