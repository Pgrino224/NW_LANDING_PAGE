import { useEffect, useRef } from 'react'
import { createChart, CandlestickSeries } from 'lightweight-charts'
import type { Token, TimeInterval } from '../../services/api/dioneApi'
import { getCandlestickData } from '../../services/mock/mockDioneData'

interface CandlestickChartProps {
  token: Token
  interval: TimeInterval
}

export default function CandlestickChart({ token, interval }: CandlestickChartProps) {
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
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
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

  // Update data when token or interval changes
  useEffect(() => {
    if (!seriesRef.current) return

    const data = getCandlestickData(token.symbol, interval)

    // Convert data to lightweight-charts format with proper time
    const formattedData = data.map(item => {
      // Parse the YYYY-MM-DD date string
      const [year, month, day] = item.time.split('-').map(Number)
      // Create timestamp (lightweight-charts uses seconds, not milliseconds)
      const timestamp = Math.floor(new Date(year, month - 1, day).getTime() / 1000)

      return {
        time: timestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }
    })

    seriesRef.current.setData(formattedData)

    // Fit content to the visible range
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent()
    }
  }, [token.symbol, interval])

  return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
}
