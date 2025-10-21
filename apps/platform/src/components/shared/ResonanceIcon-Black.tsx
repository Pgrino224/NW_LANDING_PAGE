interface ResonanceIconBlackProps {
  className?: string
}

export default function ResonanceIconBlack({ className = 'w-4 h-4' }: ResonanceIconBlackProps) {
  return (
    <img
      src="/shared/token-logos/svg-black/resonance-logo-black.svg"
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
