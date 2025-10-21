export default function Trinet() {
  return (
    <div className="w-full h-screen bg-[#FFFFE4] overflow-auto custom-scrollbar">
      <div className="w-full h-full p-6">
        {/* Title */}
        <h1 className="font-geist text-black text-2xl mb-6">Guilds</h1>

        {/* Bento Grid: 3 columns x 2 rows */}
        <div className="w-full grid gap-4 pb-4" style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: 'minmax(300px, auto)'
        }}>
          {/* My Guild */}
          <div className="bg-white border border-black/10 rounded-lg p-6">
            <h3 className="text-black/70 font-geist text-sm mb-4">My Guild</h3>
            {/* Guild content will go here */}
          </div>

          {/* Guild Discovery - spans 2 columns */}
          <div
            className="bg-white border border-black/10 rounded-lg p-6"
            style={{ gridColumn: 'span 2' }}
          >
            <h3 className="text-black/70 font-geist text-sm mb-4">Guild Discovery</h3>
            {/* Discovery content will go here */}
          </div>

          {/* Guild Rankings - spans 2 columns */}
          <div
            className="bg-white border border-black/10 rounded-lg p-6"
            style={{ gridColumn: 'span 2' }}
          >
            <h3 className="text-black/70 font-geist text-sm mb-4">Guild Rankings</h3>
            {/* Rankings content will go here */}
          </div>

          {/* Guild Activity Feed */}
          <div className="bg-white border border-black/10 rounded-lg p-6">
            <h3 className="text-black/70 font-geist text-sm mb-4">Activity Feed</h3>
            {/* Activity feed content will go here */}
          </div>
        </div>
      </div>
    </div>
  )
}
