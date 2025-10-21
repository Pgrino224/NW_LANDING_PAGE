interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  confirmColor?: 'red' | 'green' | 'blue' | 'yellow'
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  confirmColor = 'red',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const colorClasses = {
    red: 'bg-red-500 hover:bg-red-600',
    green: 'bg-green-500 hover:bg-green-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600'
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-[#131313] border border-white/20 rounded-lg shadow-2xl w-[400px] max-w-[90vw]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-white font-geist text-lg">{title}</h3>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-white/70 font-geist text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-geist text-sm rounded transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white font-geist text-sm rounded transition-colors ${colorClasses[confirmColor]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
