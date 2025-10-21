export default function Valnet() {
  return (
    <div className="w-full h-screen bg-[#FFFFE4] overflow-auto custom-scrollbar">
      <div className="w-full h-full p-6">
        {/* Title */}
        <h1 className="font-geist text-black text-2xl mb-6">Vault</h1>

        {/* Centered Exchange Interface */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-2xl bg-white border border-black/10 rounded-lg p-8">
            <h2 className="font-geist text-black text-xl mb-6 text-center">Token Exchange</h2>
            {/* Exchange interface will go here */}
            <div className="flex items-center justify-center h-64 text-black/50">
              Exchange interface placeholder
            </div>
          </div>
        </div>

        {/* Financial Services - 2 column grid */}
        <div className="w-full grid gap-4 pb-4" style={{
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridAutoRows: 'minmax(250px, auto)'
        }}>
          {/* NetWorth Storage */}
          <div className="bg-white border border-black/10 rounded-lg p-6">
            <h3 className="text-black/70 font-geist text-sm mb-4">NetWorth Storage</h3>
            <p className="text-black/50 font-geist-mono-extralight text-xs">Earn 2.5% APY</p>
            {/* Storage interface will go here */}
          </div>

          {/* Treasury Loans */}
          <div className="bg-white border border-black/10 rounded-lg p-6">
            <h3 className="text-black/70 font-geist text-sm mb-4">Treasury Loans</h3>
            <p className="text-black/50 font-geist-mono-extralight text-xs">5.0% Interest Rate</p>
            {/* Loans interface will go here */}
          </div>
        </div>
      </div>
    </div>
  )
}
