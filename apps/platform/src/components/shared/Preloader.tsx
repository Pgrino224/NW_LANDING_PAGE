import React, { useState, useEffect } from 'react'
import { getAllAssets, getTotalAssetCount } from '../../utils/assetManifest'

interface PreloaderProps {
  onLoadComplete: () => void
}

export default function Preloader({ onLoadComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [logoOpacity, setLogoOpacity] = useState(1)

  useEffect(() => {
    // Fade in/out animation for logo
    const fadeInterval = setInterval(() => {
      setLogoOpacity((prev) => {
        const newOpacity = prev === 1 ? 0.3 : 1
        return newOpacity
      })
    }, 1500)

    // Load all assets
    const loadAssets = async () => {
      const allAssets = getAllAssets()
      const totalAssets = getTotalAssetCount()
      let loadedCount = 0

      const loadPromises = allAssets.map((src) => {
        return new Promise<void>((resolve) => {
          const img = new Image()

          img.onload = () => {
            loadedCount++
            setProgress(Math.round((loadedCount / totalAssets) * 100))
            resolve()
          }

          img.onerror = () => {
            // Still count as loaded even if error, so progress continues
            loadedCount++
            setProgress(Math.round((loadedCount / totalAssets) * 100))
            resolve()
          }

          img.src = src
        })
      })

      await Promise.all(loadPromises)

      // Small delay to show 100% before transitioning
      setTimeout(() => {
        clearInterval(fadeInterval)
        onLoadComplete()
      }, 300)
    }

    loadAssets()

    return () => clearInterval(fadeInterval)
  }, [onLoadComplete])

  return (
    <div className="fixed inset-0 bg-black z-[9999]">
      {/* Blurred circle background - same as Home */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: '#a11913',
          filter: 'blur(120px)',
          opacity: 0.3,
          zIndex: 1
        }}
      />

      {/* Logo - centered */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <img
          src="/shared/acepyr-logo/acepyr-logo-white.svg"
          alt="ACEPYR"
          className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 transition-opacity duration-1000"
          style={{ opacity: logoOpacity }}
        />
      </div>

      {/* Loading text and progress bar - bottom left */}
      <div className="absolute bottom-8 left-8 z-10">
        {/* Loading text */}
        <p className="text-white/60 text-xs sm:text-sm font-geist mb-2">
          Loading...
        </p>

        {/* Progress bar */}
        <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
