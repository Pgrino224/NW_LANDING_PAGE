import ReactECharts from 'echarts-for-react'

interface Segment {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  winRate?: number // percentage as a number (e.g., 67.8) - for win rate mode
  segments?: Segment[] // for custom segments mode (e.g., holdings)
  height?: string
}

export default function DonutChart({ winRate, segments, height = '100%' }: DonutChartProps) {
  // Determine which mode we're in
  const isWinRateMode = winRate !== undefined && !segments

  let chartData: any[]
  let centerLabel: string | null = null

  if (isWinRateMode) {
    const lossRate = 100 - winRate!
    centerLabel = `${winRate!.toFixed(1)}%`
    chartData = [
      {
        value: winRate,
        name: 'Wins',
        itemStyle: {
          color: '#FF8480',
        },
      },
      {
        value: lossRate,
        name: 'Losses',
        itemStyle: {
          color: '#FFE4E4',
        },
      },
    ]
  } else if (segments) {
    chartData = segments.map(seg => ({
      value: seg.value,
      name: seg.label,
      itemStyle: {
        color: seg.color,
      },
    }))
  } else {
    chartData = []
  }

  const option = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'pie',
        radius: ['40%', '75%'], // Inner and outer radius for nightingale effect
        center: ['50%', '50%'],
        roseType: 'area', // Convert to nightingale/rose chart
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 2,
        },
        label: {
          show: centerLabel !== null,
          position: 'center',
          fontSize: 32,
          fontWeight: 'bold',
          fontFamily: 'Geist Mono, monospace',
          color: '#ffffff',
          formatter: () => centerLabel || '',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 36,
            fontWeight: 'bold',
          },
          scale: true,
          scaleSize: 10,
          itemStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        labelLine: {
          show: false,
        },
        data: chartData,
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut',
      },
    ],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#FFFFFF',
        fontFamily: 'Geist Mono, monospace',
        fontSize: 12,
      },
      formatter: (params: any) => {
        return `${params.name}: ${params.value.toFixed(2)}%`
      },
    },
    graphic: segments ? [
      {
        type: 'group',
        left: 'center',
        top: 'center',
        children: segments.map((seg, index) => ({
          type: 'group',
          children: [
            {
              type: 'rect',
              left: -50,
              top: -30 + index * 20,
              shape: {
                width: 8,
                height: 8,
                r: 2,
              },
              style: {
                fill: seg.color,
              },
            },
            {
              type: 'text',
              left: -38,
              top: -32 + index * 20,
              style: {
                text: `${seg.label} ${seg.value.toFixed(2)}%`,
                fontSize: 10,
                fontFamily: 'Geist, sans-serif',
                fill: '#ffffff',
                textAlign: 'left',
              },
            },
          ],
        })),
      },
    ] : undefined,
  }

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  )
}
