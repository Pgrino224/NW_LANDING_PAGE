import React from 'react'
import ReactECharts from 'echarts-for-react'
import type { Trade } from '../../services/api/dioneApi'

interface TradingQuadrantScatterProps {
  trades: Trade[]
}

interface ScatterPoint {
  x: number
  y: number
  symbol: string
  pnl: number
  pnlPercent: number
  type: string
  size: number
}

export default function TradingQuadrantScatter({ trades }: TradingQuadrantScatterProps) {
  // Filter only closed trades
  const closedTrades = trades.filter(t => t.status === 'closed')

  // Process trades into scatter points
  const scatterPoints: ScatterPoint[] = closedTrades.map((trade) => {
    const tradeType = trade.tradingType
    const tradeSize = trade.entryPrice * trade.quantity
    const pnlPercent = trade.exitPrice
      ? ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100
      : 0

    // Determine quadrant base position
    const quadrantOffsets = {
      margin: { baseX: -50, baseY: 50 },    // Top-left
      futures: { baseX: 50, baseY: 50 },    // Top-right
      spot: { baseX: -50, baseY: -50 },     // Bottom-left
      options: { baseX: 50, baseY: -50 }    // Bottom-right
    }

    const offset = quadrantOffsets[tradeType]

    // Add variation within quadrant based on PnL and size
    const xVariation = (trade.pnl / 500) * 15  // Spread based on PnL
    const yVariation = (tradeSize / 5000) * 15 // Spread based on size

    // Add some randomness for better distribution
    const randomX = (Math.random() - 0.5) * 10
    const randomY = (Math.random() - 0.5) * 10

    return {
      x: offset.baseX + xVariation + randomX,
      y: offset.baseY + yVariation + randomY,
      symbol: trade.symbol,
      pnl: trade.pnl,
      pnlPercent,
      type: tradeType,
      size: Math.min(Math.abs(pnlPercent) * 2, 20) // Dot size based on % gain/loss
    }
  })

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff',
        fontFamily: 'Geist Mono, monospace',
        fontSize: 12
      },
      formatter: (params: any) => {
        const point = params.data.point
        return `
          <div style="padding: 4px;">
            <div style="font-weight: bold; text-transform: uppercase; color: rgba(255,255,255,0.6); font-size: 10px; margin-bottom: 4px;">${point.type}</div>
            <div style="color: #fff; font-size: 14px; font-weight: 600; margin-bottom: 2px;">${point.symbol}</div>
            <div style="color: ${point.pnl >= 0 ? '#84cc16' : '#ef4444'}; font-weight: bold; font-size: 16px;">
              ${point.pnl >= 0 ? '+' : ''}$${point.pnl.toFixed(2)}
            </div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.7);">
              ${point.pnlPercent >= 0 ? '+' : ''}${point.pnlPercent.toFixed(2)}%
            </div>
          </div>
        `
      }
    },
    grid: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
      containLabel: false
    },
    xAxis: {
      type: 'value',
      min: -100,
      max: 100,
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.05)',
          width: 1
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
          width: 2
        }
      },
      axisLabel: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      min: -100,
      max: 100,
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.05)',
          width: 1
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
          width: 2
        }
      },
      axisLabel: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (data: any) => data[2], // Use size from data
        data: scatterPoints.map(point => ({
          value: [point.x, point.y, point.size],
          point: point,
          itemStyle: {
            color: point.pnl >= 0 ? '#84cc16' : '#ef4444',
            opacity: 0.7,
            borderColor: point.pnl >= 0 ? 'rgba(132, 204, 22, 0.4)' : 'rgba(239, 68, 68, 0.4)',
            borderWidth: 2
          }
        })),
        emphasis: {
          itemStyle: {
            opacity: 1,
            shadowBlur: 15,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          scale: true,
          scaleSize: 5
        }
      }
    ],
    // Quadrant labels - positioned in corners with proper spacing
    graphic: [
      // MARGIN label (top-left corner)
      {
        type: 'text',
        left: '4%',
        top: '4%',
        style: {
          text: 'MARGIN',
          fill: 'rgba(255,255,255,0.6)',
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Geist Mono, monospace',
          textAlign: 'left'
        }
      },
      // FUTURES label (top-right corner)
      {
        type: 'text',
        right: '4%',
        top: '4%',
        style: {
          text: 'FUTURES',
          fill: 'rgba(255,255,255,0.6)',
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Geist Mono, monospace',
          textAlign: 'right'
        }
      },
      // SPOT label (bottom-left corner)
      {
        type: 'text',
        left: '4%',
        bottom: '4%',
        style: {
          text: 'SPOT',
          fill: 'rgba(255,255,255,0.6)',
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Geist Mono, monospace',
          textAlign: 'left'
        }
      },
      // OPTIONS label (bottom-right corner)
      {
        type: 'text',
        right: '4%',
        bottom: '4%',
        style: {
          text: 'OPTIONS',
          fill: 'rgba(255,255,255,0.6)',
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Geist Mono, monospace',
          textAlign: 'right'
        }
      }
    ]
  }

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  )
}
