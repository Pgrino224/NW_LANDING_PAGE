import { useEffect, useRef, useState } from 'react'

interface DataPoint {
  time: number
  value: number
}

interface CustomAreaChartProps {
  data: DataPoint[]
  color: string
  onHover?: (data: { value: number; time: number } | null) => void
}

export default function CustomAreaChart({ data, color, onHover }: CustomAreaChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: DataPoint } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || data.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size with pixel ratio for retina displays
    const pixelRatio = window.devicePixelRatio || 1
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * pixelRatio
    canvas.height = rect.height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)

    // Padding for labels
    const padding = { top: 10, right: 60, bottom: 30, left: 10 }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = rect.height - padding.top - padding.bottom

    // Find min and max values
    const values = data.map(d => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const valueRange = maxValue - minValue
    const paddedMin = minValue - valueRange * 0.1
    const paddedMax = maxValue + valueRange * 0.1

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

    // Draw time labels (bottom axis)
    ctx.fillStyle = `${color}99` // 60% opacity
    ctx.font = '11px Geist'
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

    // Draw value labels (right axis)
    ctx.textAlign = 'right'
    const numValueLabels = 5
    for (let i = 0; i <= numValueLabels; i++) {
      const value = paddedMin + (paddedMax - paddedMin) * (i / numValueLabels)
      const y = yScale(value)
      const label = `$${Math.round(value).toLocaleString()}`
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
      ctx.strokeStyle = '#ff8480'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [data, color, hoveredPoint])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || data.length === 0) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left

    const padding = { top: 10, right: 60, bottom: 30, left: 10 }
    const chartWidth = rect.width - padding.left - padding.right

    // Find nearest data point
    const relativeX = x - padding.left
    const normalizedX = Math.max(0, Math.min(1, relativeX / chartWidth))
    const index = Math.round(normalizedX * (data.length - 1))
    const point = data[index]

    if (point) {
      const values = data.map(d => d.value)
      const minValue = Math.min(...values)
      const maxValue = Math.max(...values)
      const valueRange = maxValue - minValue
      const paddedMin = minValue - valueRange * 0.1
      const paddedMax = maxValue + valueRange * 0.1

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
