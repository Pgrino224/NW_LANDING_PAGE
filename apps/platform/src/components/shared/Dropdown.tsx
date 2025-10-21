import { useState, useRef, useEffect } from 'react'

interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  className?: string
  placeholder?: string
}

export default function Dropdown({ value, onChange, options, className = '', placeholder }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-[#ffffe4] font-geist-mono text-sm px-4 py-2 rounded border border-white/20 outline-none flex items-center gap-2 hover:bg-white/5 transition-colors shadow-lg"
      >
        <span className="flex-1 text-left">{selectedOption?.label || placeholder || 'Select...'}</span>
        <span className={`transition-transform duration-200 ml-auto ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 font-geist-mono text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                option.value === value
                  ? 'bg-white/20 text-[#ffffe4]'
                  : 'text-[#ffffe4]/80 hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
