interface ResonanceIconProps {
  className?: string
}

export default function ResonanceIcon({ className = 'w-4 h-4' }: ResonanceIconProps) {
  return (
    <img
      src="/shared/token-logos/svg-white/resonance-logo.svg"
      alt="Resonance"
      className={`inline-block align-baseline ${className}`}
      style={{
        marginRight: '2px',
        height: '1em',
        width: 'auto',
        verticalAlign: 'baseline',
        position: 'relative',
        top: '0.125em'
      }}
    />
  )
}
