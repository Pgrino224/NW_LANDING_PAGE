import { useState, useEffect } from 'react'

// Cache for logo URLs to avoid repeated API calls
const logoCache = new Map<string, string>()

/**
 * Fetch logo URL from Logo.dev API
 * @param companyName - Company name (e.g., "Apple Inc", "Tesla Inc")
 * @returns Promise with the logo URL or null if failed
 */
const fetchLogoUrl = async (companyName: string): Promise<string | null> => {
  const cacheKey = `stock:${companyName}`

  // Check cache first
  if (logoCache.has(cacheKey)) {
    return logoCache.get(cacheKey)!
  }

  try {
    const secretKey = import.meta.env.VITE_LOGODEV_SECRET_KEY

    // Debug: Check if secret key is loaded
    if (!secretKey) {
      console.error('VITE_LOGODEV_SECRET_KEY is not defined in environment variables')
      return null
    }

    // Clean company name: remove Inc, Corp, Ltd, etc.
    const cleanName = companyName
      .replace(/\s+(Inc\.?|Corp\.?|Corporation|Ltd\.?|Limited|LLC|L\.P\.?|PLC)$/i, '')
      .trim()

    console.log(`Fetching logo for: ${companyName} -> cleaned: ${cleanName}`)
    console.log(`Secret key loaded: ${secretKey ? secretKey.substring(0, 8) + '...' : 'MISSING'}`)

    const response = await fetch(`https://api.logo.dev/search?q=${encodeURIComponent(cleanName)}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`
      }
    })

    if (!response.ok) {
      console.error(`Logo.dev API error for ${companyName}: ${response.status}`)
      console.error(`Full URL: https://api.logo.dev/search?q=${encodeURIComponent(companyName)}`)
      return null
    }

    const data = await response.json()

    // Extract logo URL from response (adjust based on actual API response structure)
    const logoUrl = data[0]?.logo_url || data[0]?.image || data.logo_url || null

    if (logoUrl) {
      logoCache.set(cacheKey, logoUrl)
    }

    return logoUrl
  } catch (error) {
    console.error(`Failed to fetch logo for ${companyName}:`, error)
    return null
  }
}

/**
 * Get the path/URL to an asset icon
 * @param type - The type of asset (crypto, index, commodity, etf, stock)
 * @param symbol - The symbol of the asset (e.g., 'BTC', 'SPY', 'AAPL')
 * @returns The path or URL to the icon
 */
export const getAssetIcon = (
  type: 'crypto' | 'index' | 'commodity' | 'etf' | 'stock',
  symbol: string
): string => {
  // For all types, try local SVG files first
  const normalizedSymbol = symbol.toLowerCase().replace(/usdt$|usd$/i, '')

  // Map type to folder name (plural forms)
  const folderMap: Record<string, string> = {
    'crypto': 'crypto',
    'index': 'indices',
    'commodity': 'commodities',
    'etf': 'etfs',
    'stock': 'stocks'
  }

  const folder = folderMap[type] || type
  return `/shared/asset-icons/${folder}/${normalizedSymbol}.svg`
}

/**
 * AssetIcon component - displays an asset icon with fallback
 * @param type - The type of asset (crypto, index, commodity, etf, stock)
 * @param symbol - The symbol of the asset
 * @param name - The name of the asset (required for stocks to fetch logo)
 * @param size - Size of the icon in pixels (default: 24)
 * @param className - Additional CSS classes
 */
interface AssetIconProps {
  type: 'crypto' | 'index' | 'commodity' | 'etf' | 'stock'
  symbol: string
  name?: string
  size?: number
  className?: string
}

export const AssetIcon = ({
  type,
  symbol,
  name,
  size = 24,
  className = ''
}: AssetIconProps) => {
  const [error, setError] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [tryingFallback, setTryingFallback] = useState(false)

  // Try local file first for all types
  useEffect(() => {
    // Always start with local file path
    setLogoUrl(getAssetIcon(type, symbol))
    setError(false)
    setLoading(false)
    setTryingFallback(false)
  }, [type, symbol, name])

  if (error || (!loading && !logoUrl)) {
    // Fallback: colored circle with first letter
    return (
      <div
        className={`rounded-full flex items-center justify-center text-white ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: '#666',
          fontSize: size * 0.5,
          fontWeight: 'bold'
        }}
      >
        {symbol.charAt(0).toUpperCase()}
      </div>
    )
  }

  if (loading) {
    // Show loading placeholder
    return (
      <div
        className={`rounded-full ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: '#333'
        }}
      />
    )
  }

  // Handle image load error - try Logo.dev as fallback for stocks
  const handleError = () => {
    if (type === 'stock' && name && !tryingFallback) {
      // Try Logo.dev API as fallback
      setTryingFallback(true)
      setLoading(true)
      fetchLogoUrl(name).then((url) => {
        if (url) {
          setLogoUrl(url)
        } else {
          setError(true)
        }
        setLoading(false)
      })
    } else {
      setError(true)
    }
  }

  return (
    <img
      src={logoUrl}
      alt={symbol}
      width={size}
      height={size}
      className={`${type === 'stock' ? 'rounded-full object-cover' : ''} ${className}`}
      onError={handleError}
    />
  )
}
