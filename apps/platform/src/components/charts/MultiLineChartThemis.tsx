import { useEffect, useRef } from 'react'
import { createChart, LineSeries } from 'lightweight-charts'

interface DataPoint {
  time: number
  value: number
}

interface MultiLineChartThemisProps {
  data: Record<string, DataPoint[]>
  colors?: Record<string, string>
  height?: string
}

export default function MultiLineChartThemis({
  data,
  colors = {},
  height = '100%'
}: MultiLineChartThemisProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const seriesRefs = useRef<Record<string, any>>({})

  const defaultColors = ['#FFFFFF', '#000000', '#FF8480', '#888888']

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart with black background theme styling
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: 'rgba(255, 255, 228, 0.6)', // Cream text for black background (#ffffe4)
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
          color: 'rgba(255, 255, 228, 0.2)',
          width: 1,
          style: 0,
          labelBackgroundColor: 'rgba(255, 255, 228, 0.8)',
        },
        horzLine: {
          color: 'rgba(255, 255, 228, 0.2)',
          width: 1,
          style: 0,
          labelBackgroundColor: 'rgba(255, 255, 228, 0.8)',
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

    // Add a line series for each data set
    const candidateNames = Object.keys(data)
    seriesRefs.current = {}

    candidateNames.forEach((name, index) => {
      const lineColor = colors[name] || defaultColors[index % defaultColors.length]
      const lineSeries = chart.addSeries(LineSeries, {
        color: lineColor,
        lineWidth: 2,
        lastValueVisible: false,
        priceLineVisible: false,
        autoscaleInfoProvider: () => ({
          priceRange: {
            minValue: 0,
            maxValue: 100,
          },
        }),
      })

      seriesRefs.current[name] = lineSeries
    })

    chartRef.current = chart

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
  }, []) // Only run once on mount

  // Update data when it changes
  useEffect(() => {
    if (!chartRef.current || Object.keys(seriesRefs.current).length === 0) return

    Object.keys(data).forEach(name => {
      if (seriesRefs.current[name]) {
        seriesRefs.current[name].setData(data[name])
      }
    })

    // Fit content to the visible range
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent()
    }
  }, [data])

  return <div ref={chartContainerRef} style={{ width: '100%', height }} />
}
