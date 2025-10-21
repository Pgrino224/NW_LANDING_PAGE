import ReactECharts from 'echarts-for-react'
import type { OrderBookData } from '../../data/mockChartData'

interface OrderBookDepthChartProps {
  data: OrderBookData
  height?: string
}

export default function OrderBookDepthChart({
  data,
  height = '300px'
}: OrderBookDepthChartProps) {
  // Calculate cumulative volumes for depth visualization
  const bidDepth = data.bids
    .sort((a, b) => b.price - a.price)
    .reduce((acc, bid) => {
      const lastDepth = acc.length > 0 ? acc[acc.length - 1][1] : 0
      acc.push([bid.price, lastDepth + bid.shares])
      return acc
    }, [] as [number, number][])

  const askDepth = data.asks
    .sort((a, b) => a.price - b.price)
    .reduce((acc, ask) => {
      const lastDepth = acc.length > 0 ? acc[acc.length - 1][1] : 0
      acc.push([ask.price, lastDepth + ask.shares])
      return acc
    }, [] as [number, number][])

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '10%'
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#FFFFFF',
        fontFamily: 'Geist Mono, monospace'
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      },
      formatter: (params: any) => {
        const point = params[0]
        return `Price: ${(point.data[0] * 100).toFixed(1)}¢<br/>Depth: ${point.data[1].toLocaleString()}`
      }
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.2)' }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontFamily: 'Geist Mono, monospace',
        fontSize: 10,
        formatter: (value: number) => `${(value * 100).toFixed(0)}¢`
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.2)' }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontFamily: 'Geist Mono, monospace',
        fontSize: 10,
        formatter: (value: number) => value.toLocaleString()
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    series: [
      {
        name: 'Bids',
        type: 'line',
        data: bidDepth,
        step: 'end',
        lineStyle: {
          color: '#FFFFFF',
          width: 2
        },
        areaStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        symbol: 'none'
      },
      {
        name: 'Asks',
        type: 'line',
        data: askDepth,
        step: 'start',
        lineStyle: {
          color: '#000000',
          width: 2
        },
        areaStyle: {
          color: 'rgba(0, 0, 0, 0.3)'
        },
        symbol: 'none'
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
