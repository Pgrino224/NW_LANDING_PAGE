import { useEffect, useRef, useState } from 'react'

interface DataPoint {
  time: number
  value: number
}

interface CustomAreaChartDioneProps {
  data: DataPoint[]
  color: string
  onHover?: (data: { value: number; time: number } | null) => void
}

export default function CustomAreaChartDione({ data, color, onHover }: CustomAreaChartDioneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: DataPoint } | null>(null)
  const networthImgRef = useRef<HTMLImageElement | null>(null)

  // Load Networth logo image
  useEffect(() => {
    const img = new Image()
    img.src = '/shared/token-logos/svg-white/networth-logo.svg'
    img.onload = () => {
      networthImgRef.current = img
      // Trigger redraw when image loads
      if (canvasRef.current) {
        const event = new CustomEvent('redraw')
        canvasRef.current.dispatchEvent(event)
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || data.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawChart = () => {
      // Set canvas size with pixel ratio for retina displays
      const pixelRatio = window.devicePixelRatio || 1
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * pixelRatio
      canvas.height = rect.height * pixelRatio
      ctx.scale(pixelRatio, pixelRatio)

      // Find min and max values first (needed for dynamic padding calculation)
      const values = data.map(d => d.value)
      const minValue = Math.min(...values)
      const maxValue = Math.max(...values)
      const valueRange = maxValue - minValue
      const paddedMin = minValue - valueRange * 0.1
      const paddedMax = maxValue + valueRange * 0.1

      // Measure y-axis label widths dynamically for consistent spacing
      ctx.font = '11px Geist Mono'
      const numValueLabels = 5
      let maxLabelWidth = 0
      for (let i = 0; i <= numValueLabels; i++) {
        const value = paddedMin + (paddedMax - paddedMin) * (i / numValueLabels)
        const label = Math.round(value).toLocaleString()
        const metrics = ctx.measureText(label)
        maxLabelWidth = Math.max(maxLabelWidth, metrics.width)
      }

      // Dynamic padding: maxLabelWidth + consistent spacing
      const LABEL_SPACING = 15 // Consistent gap between chart and labels
      const dynamicRightPadding = maxLabelWidth + LABEL_SPACING + 5 // +5 for edge margin

      // Padding for labels (increased top padding to prevent label clipping)
      const padding = { top: 30, right: dynamicRightPadding, bottom: 30, left: 10 }
      const chartWidth = rect.width - padding.left - padding.right
      const chartHeight = rect.height - padding.top - padding.bottom

      // Scale functions
      const xScale = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth
      const yScale = (value: number) => {
        const normalized = (value - paddedMin) / (paddedMax - paddedMin)
        return padding.top + chartHeight - normalized * chartHeight
      }

      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Draw gradient fill
      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
      gradient.addColorStop(0, `${color}33`) // 20% opacity
      gradient.addColorStop(1, `${color}00`) // 0% opacity

      ctx.beginPath()
      ctx.moveTo(xScale(0), padding.top + chartHeight)
      data.forEach((point, i) => {
        ctx.lineTo(xScale(i), yScale(point.value))
      })
      ctx.lineTo(xScale(data.length - 1), padding.top + chartHeight)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw line
      ctx.beginPath()
      data.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(xScale(i), yScale(point.value))
        } else {
          ctx.lineTo(xScale(i), yScale(point.value))
        }
      })
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw time labels (bottom axis) - white for dark background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)' // 50% opacity white
      ctx.font = '11px Geist Mono'
      ctx.textAlign = 'center'

      const numTimeLabels = 6
      for (let i = 0; i <= numTimeLabels; i++) {
        const index = Math.floor((i / numTimeLabels) * (data.length - 1))
        const point = data[index]
        const x = xScale(index)
        const date = new Date(point.time * 1000)
        const label = date.toLocaleDateString('en-US', { month: 'short' })
        ctx.fillText(label, x, rect.height - 10)
      }

      // Draw value labels (right axis) - no logo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)' // 50% opacity white
      ctx.font = '11px Geist Mono'
      ctx.textAlign = 'right'

      // Reuse numValueLabels from above (already declared at line 60)
      for (let i = 0; i <= numValueLabels; i++) {
        const value = paddedMin + (paddedMax - paddedMin) * (i / numValueLabels)
        const y = yScale(value)
        const label = Math.round(value).toLocaleString()

        // Draw number only
        ctx.fillText(label, rect.width - 5, y + 4)
      }

      // Draw crosshair if hovering
      if (hoveredPoint) {
        ctx.strokeStyle = `${color}CC` // 80% opacity
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])

        // Vertical line
        ctx.beginPath()
        ctx.moveTo(hoveredPoint.x, padding.top)
        ctx.lineTo(hoveredPoint.x, padding.top + chartHeight)
        ctx.stroke()
        ctx.setLineDash([])

        // Circle marker
        ctx.beginPath()
        ctx.arc(hoveredPoint.x, hoveredPoint.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = '#131313' // Dark background color for contrast
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    drawChart()

    // Redraw when image loads
    const handleRedraw = () => drawChart()
    canvas.addEventListener('redraw', handleRedraw)

    return () => {
      canvas.removeEventListener('redraw', handleRedraw)
    }
  }, [data, color, hoveredPoint])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || data.length === 0) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left

    // Calculate values and padding (same as drawChart)
    const values = data.map(d => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const valueRange = maxValue - minValue
    const paddedMin = minValue - valueRange * 0.1
    const paddedMax = maxValue + valueRange * 0.1

    // Measure y-axis label widths dynamically (must match drawChart)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.font = '11px Geist Mono'
    const numValueLabels = 5
    let maxLabelWidth = 0
    for (let i = 0; i <= numValueLabels; i++) {
      const value = paddedMin + (paddedMax - paddedMin) * (i / numValueLabels)
      const label = Math.round(value).toLocaleString()
      const metrics = ctx.measureText(label)
      maxLabelWidth = Math.max(maxLabelWidth, metrics.width)
    }

    const LABEL_SPACING = 15
    const dynamicRightPadding = maxLabelWidth + LABEL_SPACING + 5

    const padding = { top: 30, right: dynamicRightPadding, bottom: 30, left: 10 }
    const chartWidth = rect.width - padding.left - padding.right

    // Find nearest data point
    const relativeX = x - padding.left
    const normalizedX = Math.max(0, Math.min(1, relativeX / chartWidth))
    const index = Math.round(normalizedX * (data.length - 1))
    const point = data[index]

    if (point) {

      const chartHeight = rect.height - padding.top - padding.bottom
      const xScale = (i: number) => padding.left + (i / (data.length - 1)) * chartWidth
      const yScale = (value: number) => {
        const normalized = (value - paddedMin) / (paddedMax - paddedMin)
        return padding.top + chartHeight - normalized * chartHeight
      }

      setHoveredPoint({
        x: xScale(index),
        y: yScale(point.value),
        data: point
      })

      onHover?.(point)
    }
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
    onHover?.(null)
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full cursor-crosshair"
        style={{ display: 'block' }}
      />
    </div>
  )
}
