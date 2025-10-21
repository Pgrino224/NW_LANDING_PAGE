import type { Aspect, ChryspolosItem } from './types'
import { TIER_COLORS } from './types'

interface ForgeModalProps {
  isOpen: boolean
  onClose: () => void
  aspects: Aspect[]
  selectedChrysoplos: ChryspolosItem
  userResonance?: number
  onForge: (chrysoplos: ChryspolosItem) => void
}

export default function ForgeModal({ isOpen, onClose, aspects, selectedChrysoplos, userResonance = 150, onForge }: ForgeModalProps) {
  if (!isOpen) return null

  const requirements = selectedChrysoplos.aspectRequirements || []
  const resonanceRequired = selectedChrysoplos.resonanceRequired || 0

  // Check if user has enough of each aspect
  const aspectsMet = requirements.map(req => {
    const aspect = aspects.find(a => a.name === req.aspectName)
    return {
      ...req,
      current: aspect?.count || 0,
      met: (aspect?.count || 0) >= req.required,
      tier: aspect?.tier
    }
  })

  const resonanceMet = userResonance >= resonanceRequired
  const canForge = aspectsMet.every(a => a.met) && resonanceMet

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[85vw] h-[80vh] bg-[#0a0a0a] border border-white/[0.15] rounded-2xl flex flex-col overflow-hidden"
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

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full h-full flex items-center gap-12">
            {/* Left Side - Large Circular Chrysoplos Preview */}
            <div className="flex-shrink-0">
              <div className="w-96 h-96 rounded-full bg-gradient-to-br from-gray-800/30 to-gray-900/30 flex items-center justify-center border-[3px] border-blue-500/60 shadow-[0_0_40px_rgba(59,130,246,0.3)] relative">
                <span className="text-9xl text-gray-700 font-bold font-['Geist_Mono']">C</span>
                {/* Tier Indicator */}
                <div
                  className="absolute top-8 right-8 w-8 h-8 rounded-full shadow-lg"
                  style={{
                    backgroundColor: TIER_COLORS[selectedChrysoplos.tier],
                    boxShadow: `0 0 20px ${TIER_COLORS[selectedChrysoplos.tier]}80`
                  }}
                />
              </div>
            </div>

            {/* Right Side - Info and Requirements */}
            <div className="flex-1 flex flex-col justify-center space-y-8">
              {/* Chrysoplos Name */}
              <div>
                <h2 className="text-white text-4xl font-semibold tracking-wide mb-3">
                  {selectedChrysoplos.name}
                </h2>
                <p className="text-gray-400 text-lg italic mb-3">
                  {selectedChrysoplos.tagline}
                </p>
                <div
                  className="inline-block px-4 py-2 text-sm uppercase tracking-wider font-['Geist_Mono'] rounded-full"
                  style={{
                    backgroundColor: `${TIER_COLORS[selectedChrysoplos.tier]}20`,
                    color: TIER_COLORS[selectedChrysoplos.tier],
                    border: `1px solid ${TIER_COLORS[selectedChrysoplos.tier]}40`
                  }}
                >
                  {selectedChrysoplos.tier}
                </div>
              </div>

              {/* Separator */}
              <div className="w-full h-[1px] bg-gray-700/50" />

              {/* Requirements Section */}
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-wider text-gray-400 font-['Geist_Mono']">
                  Forging Requirements
                </div>

                {/* Aspect Requirements */}
                {aspectsMet.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-800/30 border border-white/[0.1] flex items-center justify-center flex-shrink-0 relative">
                      <span className="text-3xl text-gray-600 font-bold font-['Geist_Mono']">A</span>
                      {req.tier && (
                        <div
                          className="absolute top-2 right-2 w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: TIER_COLORS[req.tier],
                            boxShadow: `0 0 8px ${TIER_COLORS[req.tier]}80`
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-base mb-1">
                        {req.aspectName}
                      </div>
                      <div
                        className={`text-xl font-['Geist_Mono'] font-bold ${
                          req.met ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {req.current}/{req.required}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Resonance Requirement */}
                {resonanceRequired > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-800/30 border border-white/[0.1] flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl text-gray-600 font-bold font-['Geist_Mono']">R</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-base mb-1">
                        Resonance
                      </div>
                      <div
                        className={`text-xl font-['Geist_Mono'] font-bold ${
                          resonanceMet ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {userResonance}/{resonanceRequired}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Separator */}
              <div className="w-full h-[1px] bg-gray-700/50" />

              {/* Forge Button */}
              <button
                disabled={!canForge}
                onClick={() => canForge && onForge(selectedChrysoplos)}
                className={`w-full py-4 rounded-xl font-['Geist_Mono'] uppercase tracking-[0.25em] text-sm border-2 transition-all ${
                  canForge
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500 text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                    : 'bg-gray-800/20 border-gray-700 text-gray-600 cursor-not-allowed'
                }`}
              >
                {canForge ? 'Forge Chrysoplos' : 'Insufficient Resources'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
