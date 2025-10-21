interface NetworthIconBlackProps {
  className?: string
}

export default function NetworthIconBlack({ className = 'w-4 h-4' }: NetworthIconBlackProps) {
  return (
    <img
      src="/shared/token-logos/svg-black/networth-logo-black.svg"
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
