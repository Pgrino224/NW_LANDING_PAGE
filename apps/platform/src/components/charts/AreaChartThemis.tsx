import { useEffect, useRef } from 'react'
import { createChart, LineSeries } from 'lightweight-charts'

interface DataPoint {
  time: number
  value: number
}

interface AreaChartThemisProps {
  data: DataPoint[]
  color?: string
  height?: string
  theme?: 'light' | 'dark'
}

export default function AreaChartThemis({
  data,
  color = '#2D3748',
  height = '100%',
  theme = 'light'
}: AreaChartThemisProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const seriesRef = useRef<any>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Determine text color based on theme
    const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
    const crosshairColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
    const labelBgColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)'

    // Create chart with theme styling
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor,
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
          color: crosshairColor,
          width: 1,
          style: 0,
          labelBackgroundColor: labelBgColor,
        },
        horzLine: {
          color: crosshairColor,
          width: 1,
          style: 0,
          labelBackgroundColor: labelBgColor,
        },
      },
      rightPriceScale: {
        borderVisible: false,
        autoScale: false,
        scaleMargins: {
          top: 0.05,
          bottom: 0.05,
        },
        visible: true,
        entireTextOnly: true,
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
      // Area fill - lighter on yellow background
      topColor: `${color}40`,
      bottomColor: `${color}00`,
      autoscaleInfoProvider: () => ({
        priceRange: {
          minValue: 0,
          maxValue: 100,
        },
      }),
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
  }, [color, theme])

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
