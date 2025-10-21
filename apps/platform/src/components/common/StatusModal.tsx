import { useEffect } from 'react'

type StatusType = 'success' | 'error' | 'info'

interface StatusModalProps {
  isOpen: boolean
  type: StatusType
  title: string
  message: string
  autoCloseDuration?: number // in milliseconds, 0 = no auto-close
  onClose: () => void
  variant?: 'default' | 'themis' | 'zone' // default for Dione, themis for Themis, zone for Zone
}

export default function StatusModal({
  isOpen,
  type,
  title,
  message,
  autoCloseDuration = 3000,
  onClose,
  variant = 'default'
}: StatusModalProps) {
  useEffect(() => {
    if (isOpen && autoCloseDuration > 0) {
      const timer = setTimeout(onClose, autoCloseDuration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoCloseDuration, onClose])

  if (!isOpen) return null

  const typeConfig = {
    success: {
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    info: {
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  const config = typeConfig[type]
  const isThemisSuccess = variant === 'themis' && type === 'success'
  const isZone = variant === 'zone'

  // Zone variant styling
  const getBackgroundColor = () => {
    if (isZone) return 'bg-[#FFFFE4]'
    if (isThemisSuccess) return 'bg-[#ff8480]'
    return 'bg-[#131313]'
  }

  const getBorderColor = () => {
    if (isZone) return 'border-[#d4d4d4]'
    return 'border-white/20'
  }

  const getIconBackground = () => {
    if (isZone) {
      if (type === 'success') return 'bg-green-500/20'
      if (type === 'error') return 'bg-red-500/20'
      return 'bg-blue-500/20'
    }
    if (isThemisSuccess) return 'bg-white/20'
    return config.bgColor
  }

  const getIconBorder = () => {
    if (isZone) {
      if (type === 'success') return 'border-green-500/40'
      if (type === 'error') return 'border-red-500/40'
      return 'border-blue-500/40'
    }
    if (isThemisSuccess) return 'border-white/30'
    return config.borderColor
  }

  const getIconColor = () => {
    if (isZone) return config.textColor
    if (isThemisSuccess) return 'text-white'
    return config.textColor
  }

  const getTitleColor = () => {
    if (isZone) return 'text-[#0a0a0a]'
    return 'text-white'
  }

  const getMessageColor = () => {
    if (isZone) return 'text-[#666]'
    return 'text-white/70'
  }

  const getCloseButtonColor = () => {
    if (isZone) return 'text-[#666] hover:text-[#0a0a0a]'
    return 'text-white/50 hover:text-white'
  }

  const getProgressBarBackground = () => {
    if (isZone) return 'bg-[#d4d4d4]/30'
    return 'bg-white/5'
  }

  const getProgressBarFill = () => {
    if (isZone) {
      if (type === 'success') return 'bg-green-500/50'
      if (type === 'error') return 'bg-red-500/50'
      return 'bg-blue-500/50'
    }
    if (isThemisSuccess) return 'bg-white/50'
    return config.bgColor.replace('/10', '/50')
  }

  return (
    <div className="fixed top-6 right-6 z-[2000] animate-slideIn">
      {/* Toast */}
      <div className={`${getBackgroundColor()} border ${getBorderColor()} rounded-lg shadow-2xl w-[380px] max-w-[calc(100vw-48px)]`}>
        {/* Content */}
        <div className="px-4 py-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getIconBackground()} ${getIconBorder()} border flex items-center justify-center ${getIconColor()}`}>
              {config.icon}
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`${getTitleColor()} font-geist text-sm font-medium mb-1`}>{title}</h3>
              <p className={`${getMessageColor()} font-geist text-xs leading-relaxed`}>
                {message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`flex-shrink-0 ${getCloseButtonColor()} transition-colors`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Auto-close progress bar */}
        {autoCloseDuration > 0 && (
          <div className={`h-1 ${getProgressBarBackground()} overflow-hidden rounded-b-lg`}>
            <div
              className={`h-full ${getProgressBarFill()}`}
              style={{
                animation: `shrink ${autoCloseDuration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
