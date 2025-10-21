import { useEffect, useRef, useState } from 'react'

interface MiniAreaChartProps {
  data: number[]
  color?: string
  showAxes?: boolean
}

export default function MiniAreaChart({
  data,
  color = '#84cc16',
  showAxes = true
}: MiniAreaChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    // Initial measurement
    updateDimensions()

    // Update on resize
    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(canvas)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0 || dimensions.width === 0 || dimensions.height === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimensions

    // Set canvas size for retina displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Find min and max values first
    const minValue = Math.min(...data)
    const maxValue = Math.max(...data)
    const valueRange = maxValue - minValue || 1

    // Calculate dimensions with dynamic padding for axes
    const paddingLeft = showAxes ? 10 : 0
    const paddingTop = showAxes ? 10 : 0
    const paddingBottom = showAxes ? 25 : 0

    let paddingRight = 0
    if (showAxes) {
      // Measure y-axis label widths dynamically for consistent spacing
      ctx.font = '11px Geist Mono'
      const numYLabels = 5
      let maxLabelWidth = 0
      for (let i = 0; i <= numYLabels; i++) {
        const value = minValue + (i / numYLabels) * valueRange
        const label = Math.round(value).toLocaleString()
        const metrics = ctx.measureText(label)
        maxLabelWidth = Math.max(maxLabelWidth, metrics.width)
      }

      const LABEL_SPACING = 15 // Consistent gap between chart and labels
      paddingRight = maxLabelWidth + LABEL_SPACING + 5 // +5 for edge margin
    }

    const chartWidth = width - paddingLeft - paddingRight
    const chartHeight = height - paddingTop - paddingBottom

    // Draw Y-axis labels if enabled (right side)
    if (showAxes) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '11px Geist Mono'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'

      // Draw 5 y-axis labels
      const numYLabels = 5
      for (let i = 0; i <= numYLabels; i++) {
        const value = minValue + (i / numYLabels) * valueRange
        const y = paddingTop + chartHeight - (i / numYLabels) * chartHeight
        ctx.fillText(Math.round(value).toLocaleString(), width - 5, y + 4)
      }
    }

    // Calculate points
    const points: [number, number][] = data.map((value, index) => {
      const x = paddingLeft + (index / (data.length - 1)) * chartWidth
      const y = paddingTop + chartHeight - ((value - minValue) / valueRange) * chartHeight
      return [x, y]
    })

    // Draw area
    ctx.beginPath()
    const bottomY = paddingTop + chartHeight
    ctx.moveTo(points[0][0], bottomY)
    ctx.lineTo(points[0][0], points[0][1])

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1])
    }

    ctx.lineTo(points[points.length - 1][0], bottomY)
    ctx.closePath()

    // Create gradient
    const gradient = ctx.createLinearGradient(0, paddingTop, 0, bottomY)
    gradient.addColorStop(0, color + '40') // 25% opacity at top
    gradient.addColorStop(1, color + '00') // 0% opacity at bottom

    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    ctx.moveTo(points[0][0], points[0][1])

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1])
    }

    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Draw X-axis labels if enabled (time labels)
    if (showAxes) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '11px Geist Mono'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'

      // Draw x-axis month labels
      const numXLabels = 6
      for (let i = 0; i <= numXLabels; i++) {
        const index = Math.floor((i / numXLabels) * (data.length - 1))
        const x = paddingLeft + (index / (data.length - 1)) * chartWidth
        // Simple month labels (could be customized with actual dates if needed)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        const label = months[i % 6]
        ctx.fillText(label, x, bottomY + 5)
      }
    }
  }, [data, color, dimensions, showAxes])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
