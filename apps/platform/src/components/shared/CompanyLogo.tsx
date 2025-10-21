import { useState } from 'react'

interface CompanyLogoProps {
  ticker: string
  companyName: string
  size?: number
  className?: string
}

export default function CompanyLogo({
  ticker,
  companyName,
  size = 24,
  className = ''
}: CompanyLogoProps) {
  const [error, setError] = useState(false)

  if (error) {
    // Fallback: Show initials avatar
    const initials = ticker.slice(0, 2).toUpperCase()
    return (
      <div
        className={`flex items-center justify-center bg-white/10 rounded-full ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-geist-mono text-xs">{initials}</span>
      </div>
    )
  }

  return (
    <img
      src={`https://elbstream.com/logos/symbol/${ticker}?format=svg`}
      alt={companyName}
      className={`rounded ${className}`}
      style={{ width: size, height: size }}
      onError={() => setError(true)}
    />
  )
}
