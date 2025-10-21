import { useEffect, useRef } from 'react'
import { createChart, LineSeries } from 'lightweight-charts'

interface DataPoint {
  time: number
  value: number
}

interface AreaChartProps {
  data: DataPoint[]
  color?: string
  height?: string
}

export default function AreaChart({ data, color = '#FF8480', height = '100%' }: AreaChartProps) {
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

    // Add area series (line with filled area beneath)
    const areaSeries = chart.addSeries(LineSeries, {
      color: color,
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
    })

    // Apply area style
    areaSeries.applyOptions({
      lineStyle: 0,
      lineWidth: 2,
      color: color,
      // Area fill
      topColor: `${color}80`,
      bottomColor: `${color}00`,
    })

    chartRef.current = chart
    seriesRef.current = areaSeries

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
  }, [color])

  // Update data when it changes
  useEffect(() => {
    if (!seriesRef.current) return

    seriesRef.current.setData(data)

    // Fit content to the visible range
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent()
    }
  }, [data])

  return <div ref={chartContainerRef} style={{ width: '100%', height }} />
}
