import { useEffect, useRef } from 'react'
import { createChart, CandlestickSeries } from 'lightweight-charts'

interface DataPoint {
  time: number
  value: number
}

interface SimpleCandlestickChartProps {
  data: DataPoint[]
  color: string
}

interface OHLCData {
  time: number
  open: number
  high: number
  low: number
  close: number
}

// Convert area chart data to OHLC format
const convertToOHLC = (data: DataPoint[]): OHLCData[] => {
  return data.map((point, index) => {
    const prevValue = data[index - 1]?.value || point.value
    const nextValue = data[index + 1]?.value || point.value

    // Use current value as close, previous as open
    const open = prevValue
    const close = point.value

    // Generate realistic high/low based on volatility
    const volatility = Math.abs(close - open) * 0.15
    const high = Math.max(open, close) + volatility
    const low = Math.min(open, close) - volatility

    return {
      time: point.time,
      open,
      high,
      low,
      close
    }
  })
}

export default function SimpleCandlestickChart({ data, color }: SimpleCandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const seriesRef = useRef<any>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.5)',
        fontFamily: 'Geist Mono, monospace',
        attributionLogo: false,
      },
      watermark: {
        visible: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: 'rgba(255, 255, 255, 0.2)',
          width: 1,
          style: 0,
          labelBackgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.2)',
          width: 1,
          style: 0,
          labelBackgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
      },
      handleScale: {
        axisPressedMouseMove: false,
        mouseWheel: false,
        pinch: false,
      },
    })

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#84cc16',
      downColor: '#ef4444',
      borderUpColor: '#84cc16',
      borderDownColor: '#ef4444',
      wickUpColor: '#84cc16',
      wickDownColor: '#ef4444',
    })

    chartRef.current = chart
    seriesRef.current = candlestickSeries

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current)
    }

    handleResize()

    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [])

  // Update data when it changes
  useEffect(() => {
    if (!seriesRef.current || data.length === 0) return

    const ohlcData = convertToOHLC(data)
    seriesRef.current.setData(ohlcData)

    // Fit content to the visible range
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent()
    }
  }, [data])

  return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
}
