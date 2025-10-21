interface NetworthIconProps {
  className?: string
}

export default function NetworthIcon({ className = 'w-4 h-4' }: NetworthIconProps) {
  return (
    <img
      src="/shared/token-logos/svg-white/networth-logo.svg"
      alt="NW"
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
