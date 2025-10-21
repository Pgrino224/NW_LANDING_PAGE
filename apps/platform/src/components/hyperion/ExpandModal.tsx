import { useState } from 'react'
import type { ChryspolosItem, ChryspolosTier } from './types'
import { TIER_COLORS } from './types'

interface ExpandModalProps {
  isOpen: boolean
  onClose: () => void
  chrysoplosInventory: ChryspolosItem[]
  onEquip: (chrysoplos: ChryspolosItem) => void
  equippedChrysoplosId?: string
}

export default function ExpandModal({
  isOpen,
  onClose,
  chrysoplosInventory,
  onEquip,
  equippedChrysoplosId
}: ExpandModalProps) {
  const [selectedTab, setSelectedTab] = useState<ChryspolosTier | 'A'>('Rare')

  if (!isOpen) return null

  // Filter chrysoplos based on selected tab
  const filteredChrysoplos = selectedTab === 'A'
    ? [] // Aspects tab - will be implemented later
    : chrysoplosInventory.filter(c => c.tier === selectedTab)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] h-[85vh] bg-[#0a0a0a] border border-white/[0.15] rounded-2xl flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Sidebar - Tier Tabs */}
        <div className="w-20 bg-black/40 border-r border-white/[0.08] flex flex-col items-center gap-3 py-8">
          {['Rare', 'Unique', 'Mythic', 'Glitch', 'A'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as typeof selectedTab)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-[10px] font-['Geist_Mono'] font-bold transition-all border-2 ${
                selectedTab === tab
                  ? 'bg-blue-500/20 border-blue-500 text-white'
                  : 'bg-white/[0.03] border-white/[0.08] text-gray-500 hover:border-white/[0.15] hover:text-gray-300'
              }`}
            >
              {tab === 'A' ? 'A' : tab[0]}
            </button>
          ))}
        </div>

        {/* Main Grid Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {selectedTab === 'A' ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-5xl mb-4 opacity-40">✨</div>
                <p className="text-sm font-['Geist_Mono']">Aspects view coming soon</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {filteredChrysoplos.map((chrysoplos) => {
                const isEquipped = equippedChrysoplosId === chrysoplos.id

                return (
                  <div
                    key={chrysoplos.id}
                    className={`relative bg-white/[0.02] border-2 rounded-xl overflow-hidden transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.04] ${
                      isEquipped
                        ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                        : 'border-white/[0.08]'
                    }`}
                  >
                    {/* NEW Badge */}
                    {chrysoplos.isNew && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-black text-[10px] px-2 py-1 font-['Geist_Mono'] uppercase font-bold z-10">
                        NEW
                      </div>
                    )}

                    {/* Tier Indicator */}
                    <div
                      className="absolute top-3 right-3 w-3 h-3 rounded-full z-10"
                      style={{
                        backgroundColor: TIER_COLORS[chrysoplos.tier],
                        boxShadow: `0 0 12px ${TIER_COLORS[chrysoplos.tier]}80`
                      }}
                    />

                    {/* Chrysoplos Image */}
                    <div className="aspect-square bg-gradient-to-br from-gray-800/30 to-gray-900/30 flex items-center justify-center border-b border-white/[0.05]">
                      <span className="text-6xl text-gray-700 font-bold font-['Geist_Mono']">C</span>
                    </div>

                    {/* Info Section */}
                    <div className="p-4 space-y-2">
                      {/* Name */}
                      <div className="text-white text-sm font-semibold truncate">
                        {chrysoplos.name}
                      </div>

                      {/* Tagline */}
                      <div className="text-gray-400 text-xs italic truncate">
                        {chrysoplos.tagline}
                      </div>

                      {/* Type & Platform */}
                      <div className="flex items-center gap-2 text-[10px] font-['Geist_Mono']">
                        <span className={`px-2 py-0.5 rounded ${chrysoplos.type === 'ACTIVE' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {chrysoplos.type}
                        </span>
                        {chrysoplos.platform && (
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                            {chrysoplos.platform}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <div className="text-gray-500 text-[10px] line-clamp-2">
                        {chrysoplos.description}
                      </div>

                      {/* Equip Button */}
                      <button
                        onClick={() => onEquip(chrysoplos)}
                        disabled={isEquipped}
                        className={`w-full py-2 rounded-lg text-xs uppercase tracking-wider font-['Geist_Mono'] transition-all ${
                          isEquipped
                            ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400 cursor-default'
                            : 'bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-white'
                        }`}
                      >
                        {isEquipped ? 'Equipped' : 'Equip'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
