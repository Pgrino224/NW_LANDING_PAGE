# HYPERION FIXES - Implementation Plan

**Last Updated:** 2025-10-17
**Background Image Location:** `public/hyperion/hyperion-bg/hyperion-bg.svg`
**Status:** Trait icons already updated ✅

---

## ✅ PHASE 1: CAN IMPLEMENT NOW (No Assets Needed) - **COMPLETE (8/8)**

### **FIX #9: Update Background to Hyperion-BG** ⭐ PRIORITY 1
**Status:** ✅ COMPLETED
**Components:** `Chrysoplos.tsx`, `Archetypes.tsx`, `TraitUpgrade.tsx`

**Current State:**
- All three components use `bg-[#0a0a0a]` solid background

**Changes Required:**
```tsx
<div
  className="w-full h-screen relative overflow-hidden"
  style={{
    backgroundImage: 'url(/hyperion/hyperion-bg.jpg)', // or .png - verify extension
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  {/* Dark overlay for readability */}
  <div className="absolute inset-0 bg-black/70" />

  {/* All content goes here with relative z-10 */}
  <div className="relative z-10">
    {/* Content */}
  </div>
</div>
```

**Files to Update:**
- `Chrysoplos.tsx` - Line 121
- `Archetypes.tsx` - Line 17
- `TraitUpgrade.tsx` - Line 111

---

### **FIX #12: Font Updates - Geist Mono for Subtext**
**Status:** ✅ COMPLETED
**Components:** All three Hyperion sections

**Completed Changes:**
- ✅ TraitUpgrade.tsx - Updated all descriptions, labels, costs to Geist Mono
- ✅ Chrysoplos.tsx - Updated tagline, description, type badge to Geist Mono
- ✅ Archetypes.tsx - Updated personality, theme, requirements, progress to Geist Mono
- ✅ All headers remain in Geist font as specified

**Rule:**
- Headers (h1, h2, h3) → Keep `font-['Geist']`
- All subtext, descriptions, labels, data → Change to `font-['Geist_Mono']`

**Specific Locations to Update:**

**TraitUpgrade.tsx:**
- Line 117: Trait description text
- Line 122: Balance display
- Line 125: Cost per level text
- All trait card labels and values

**Chrysoplos.tsx:**
- Line 272: Chrysoplos tagline
- Line 277: Description text
- Line 284: Type badge text
- All forge panel labels (lines 298, 301, 328, 364, 411)

**Archetypes.tsx:**
- Line 74: Personality quote
- Line 82: Theme description
- Line 90: Requirements text
- Line 106: Progress percentage

---

### **FIX #2: Remove Tier Icons from Inventory Grid**
**Status:** ✅ COMPLETED
**Component:** `Chrysoplos.tsx`

**Completed Changes:**
- ✅ Removed tier indicator icons from top-right corner of inventory grid items (lines 183-190)
- ✅ Kept equipped indicator and new badge as intended

**Location:** Lines 183-190

**Action:** DELETE this entire block:
```tsx
<img
  src={`/hyperion/chrysoplos-tiers/${item.tier.toLowerCase()}-icon.svg`}
  alt={`${item.tier} tier`}
  className="absolute top-1 right-1 w-4 h-4"
  style={{ filter: `drop-shadow(0 0 4px ${TIER_COLORS[item.tier]}80)` }}
/>
```

**Note:** Keep the equipped indicator (lines 193-200) and new badge (lines 204-208)

---

### **FIX #6: Change Title to "INVENTORY"**
**Status:** ✅ COMPLETED
**Component:** `Chrysoplos.tsx`

**Completed Changes:**
- ✅ Changed title from "Chrysoplos" to "INVENTORY"
- ✅ Added Geist Mono font, uppercase, and tracking-wider styling
- ⏳ Icon will be added in Phase 2 when assets are ready

**Location:** Lines 136-138

**Change FROM:**
```tsx
<h1 className="text-white text-2xl font-semibold">Chrysoplos</h1>
```

**Change TO:**
```tsx
<h1 className="text-white text-2xl font-semibold font-['Geist_Mono'] uppercase tracking-wider">
  INVENTORY
</h1>
```

**Note:** Icon will be added in Phase 2 when assets are ready

---

### **FIX #8: Forge Section Text Cleanup**
**Status:** ✅ COMPLETED
**Component:** `Chrysoplos.tsx` (RIGHT SECTION, lines 294-441)

**Completed Changes:**
- ✅ Changed "Item" header to "ITEM TO FORGE" (uppercase, xs size, Geist Mono)
- ✅ Removed italic "To Forge" line
- ✅ Changed "Preview" to "PREVIEW" (uppercase, xs size, Geist Mono)
- ✅ Changed "Material Cost" to "MATERIAL COST" (uppercase, xs size, Geist Mono)
- ✅ Changed "Forge:" label to "FORGE COST:" (uppercase, sm size, Geist Mono)
- ✅ Simplified forge button text from "Forge: {cost} ◆" to just "FORGE"
- ✅ All headers now consistent in capitalization and sizing

**Issues to Fix:**
1. Inconsistent header capitalization and sizing
2. Duplicate forge button text
3. Italic "To Forge" line is unnecessary
4. Mixed font styles

**Changes:**

**1. Standardize Header at Line 298-300:**
```tsx
<h3 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-['Geist_Mono']">
  ITEM TO FORGE
</h3>
```

**2. REMOVE Line 301 (italic "To Forge" text):**
```tsx
<p className="text-gray-400 text-xs italic mb-4">To Forge</p>  // DELETE THIS
```

**3. Update Preview Header at Line 328-330:**
```tsx
<h3 className="text-white text-xs uppercase tracking-widest mb-4 font-['Geist_Mono']">
  PREVIEW
</h3>
```

**4. Update Material Cost Header at Line 363-365:**
```tsx
<h3 className="text-gray-400 text-xs uppercase tracking-widest mb-6 font-['Geist_Mono'] text-center">
  MATERIAL COST
</h3>
```

**5. Fix Forge Cost Label at Line 411:**
```tsx
<span className="text-white text-sm uppercase tracking-wider font-['Geist_Mono']">
  FORGE COST:
</span>
```

**6. Simplify Forge Button at Line 437:**
```tsx
// FROM:
Forge: {selectedChrysoplos.resonanceRequired} ◆

// TO:
FORGE
```

---

### **FIX #13: Standardize Alignment Across Sections**
**Status:** ✅ COMPLETED
**Components:** All three sections

**Completed Changes:**
- ✅ Chrysoplos.tsx - Already had correct `px-8 py-6` title area with border
- ✅ Archetypes.tsx - Updated from `p-6` to `px-8 py-6` with border-b
- ✅ TraitUpgrade.tsx - Restructured to have consistent `px-8 py-6` title area with border-b
- ✅ All sections now have consistent header structure and spacing
- ✅ All title margins standardized to `mb-6` where applicable

**Standard Structure:**
```tsx
<div className="w-full h-screen relative overflow-y-auto">
  {/* Title area - CONSISTENT ACROSS ALL */}
  <div className="px-8 py-6 border-b border-white/[0.08]">
    <h1 className="text-white text-2xl font-semibold">SECTION TITLE</h1>
  </div>

  {/* Content area */}
  <div className="p-8"> {/* Adjust per section needs */}
    {/* Content */}
  </div>
</div>
```

**Files to Update:**

**Chrysoplos.tsx Line 136:**
- Already correct: `px-8 py-6` ✅

**Archetypes.tsx Line 19:**
- Change FROM: `<div className="p-6">`
- Change TO: `<div className="px-8 py-6 border-b border-white/[0.08]">`

**TraitUpgrade.tsx Line 114:**
- Current: `<div className="mb-8">`
- Ensure parent has `px-8 py-6` structure
- Change title margin to `mb-6` for consistency

**Additional Consistency:**
- All h1 titles: `text-2xl`
- All h2 subtitles: `text-xl`
- All h3 labels: `text-xs uppercase`
- Border color: `border-white/[0.08]`

---

### **FIX #14: Dynamic Trait Upgrade Costs**
**Status:** ✅ COMPLETED
**Component:** `TraitUpgrade.tsx`

**Completed Changes:**
- ✅ Created `getUpgradeCost()` function with exponential scaling (10 → 320 resonance)
- ✅ Replaced fixed `UPGRADE_COST = 100` with dynamic cost calculation
- ✅ Updated `handleUpgrade()` to calculate and deduct dynamic costs
- ✅ Updated header text to show cost range: "Cost varies by level (10-320 ◆)"
- ✅ Added "Next upgrade: X ◆" display to each trait card
- ✅ Updated upgrade button text to show dynamic cost: "Upgrade (X ◆)"
- ✅ Updated modal button to show dynamic cost
- ✅ All button disabled states now check against dynamic costs
- ✅ Cost tiers implemented:
  - Level 0-1: 10 ◆ per 0.1
  - Level 1-2: 15 ◆ per 0.1
  - Level 2-3: 20 ◆ per 0.1
  - Level 3-4: 30 ◆ per 0.1
  - Level 4-5: 40 ◆ per 0.1
  - Level 5-6: 80 ◆ per 0.1 (2x)
  - Level 6-7: 160 ◆ per 0.1 (4x)
  - Level 7+: 320 ◆ per 0.1 (8x)

**Background:**
Current implementation uses fixed cost of 100 resonance per upgrade. Need to implement exponential scaling based on trait level.

**Cost Structure:**
```
Level Range  →  Cost per 0.1 increase
0.00-1.00    →  10 resonance
1.00-2.00    →  15 resonance
2.00-3.00    →  20 resonance
3.00-4.00    →  30 resonance
4.00-5.00    →  40 resonance
5.00-6.00    →  80 resonance (2x scaling)
6.00-7.00    →  160 resonance (4x scaling)
7.00+        →  320 resonance (8x scaling)
```

**Implementation Steps:**

**1. Replace UPGRADE_COST constant (Line 26):**
```tsx
// DELETE:
const UPGRADE_COST = 100

// ADD:
const getUpgradeCost = (currentLevel: number): number => {
  const traitUpgradeCosts: Record<number, number> = {
    0: 10,   // 0.00-1.00 range
    1: 15,   // 1.00-2.00 range
    2: 20,   // 2.00-3.00 range
    3: 30,   // 3.00-4.00 range
    4: 40,   // 4.00-5.00 range
    5: 80,   // 5.00-6.00 range
    6: 160,  // 6.00-7.00 range
    7: 320   // 7.00+ range
  }
  const tier = Math.floor(currentLevel)
  return traitUpgradeCosts[Math.min(tier, 7)]
}
```

**2. Update handleUpgrade function (Lines 33-53):**
```tsx
const handleUpgrade = (traitId: string) => {
  const trait = traits.find(t => t.id === traitId)
  if (!trait) return

  // Check if max level reached
  if (trait.level >= trait.maxLevel) return

  // Calculate dynamic cost
  const upgradeCost = getUpgradeCost(trait.level)

  // Check if enough Resonance
  if (balances.resonance < upgradeCost) {
    alert('Not enough Resonance!')
    return
  }

  // Upgrade the trait by 0.1
  setTraits(traits.map(t =>
    t.id === traitId ? { ...t, level: Math.round((t.level + 0.1) * 10) / 10 } : t
  ))

  // Deduct dynamic cost
  updateBalance('resonance', balances.resonance - upgradeCost)
}
```

**3. Add cost display to trait cards (After line 163):**
```tsx
<div className="flex items-center justify-between mb-1">
  <span className="text-white/60 font-['Geist_Mono'] text-xs">
    Next Upgrade Cost
  </span>
  <span className="text-white font-['Geist_Mono'] text-sm font-semibold">
    {getUpgradeCost(trait.level)} ◆
  </span>
</div>
```

**4. Update upgrade button logic (Lines 178-186):**
```tsx
<button
  onClick={(e) => {
    e.stopPropagation()
    handleUpgrade(trait.id)
  }}
  disabled={trait.level >= trait.maxLevel || balances.resonance < getUpgradeCost(trait.level)}
  className={`px-6 py-3 rounded-xl font-['Geist_Mono'] font-medium transition-all duration-300 ${
    trait.level >= trait.maxLevel
      ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/20'
      : balances.resonance < getUpgradeCost(trait.level)
      ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/20'
      : 'bg-gradient-to-r from-[#ff8480] to-[#ff6b66] text-white shadow-lg shadow-[#ff8480]/30 hover:shadow-xl hover:scale-105'
  }`}
>
  {trait.level >= trait.maxLevel ? 'Maxed' : `Upgrade (${getUpgradeCost(trait.level)} ◆)`}
</button>
```

**5. Update modal button (Lines 234-246):**
```tsx
<button
  onClick={() => {
    handleUpgrade(selectedTrait.id)
    setSelectedTrait(traits.find(t => t.id === selectedTrait.id) || null)
  }}
  disabled={selectedTrait.level >= selectedTrait.maxLevel || balances.resonance < getUpgradeCost(selectedTrait.level)}
  className={`flex-1 px-6 py-4 rounded-xl font-['Geist_Mono'] font-medium text-lg transition-all duration-300 ${
    selectedTrait.level >= selectedTrait.maxLevel
      ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/20'
      : balances.resonance < getUpgradeCost(selectedTrait.level)
      ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/20'
      : 'bg-gradient-to-r from-[#ff8480] to-[#ff6b66] text-white shadow-lg shadow-[#ff8480]/30 hover:shadow-xl hover:scale-105'
  }`}
>
  {selectedTrait.level >= selectedTrait.maxLevel
    ? 'Max Level Reached'
    : `Upgrade for ${getUpgradeCost(selectedTrait.level)} Resonance`
  }
</button>
```

**6. Update header cost display (Line 125):**
```tsx
<span className="text-white/60 font-['Geist_Mono'] text-sm">
  Cost varies by level (10-320 ◆)
</span>
```

---

### **FIX #7: Chrysoplos Layout Restructure** (REVISED - Elden Ring Matching)
**Status:** ✅ COMPLETED (with lore integration)
**Components:** `Chrysoplos.tsx` (lines 236-300), `types.ts` (data structure)

**Completed Changes (Session 1 - Initial Layout):**
- ✅ Changed Chrysoplos image aspect ratio from 1:1 (500x500) to 3:2 (600x400)
- ✅ Moved weapon name from center-below-image to top-left-above-image
- ✅ Removed centered layout (`items-center`), changed to left-aligned
- ✅ Replaced boxed description area with bordered sections
- ✅ All sections use CSS border separators (`border-t border-white/[0.15]`)
- ✅ All text uses Geist Mono font for consistency

**Completed Changes (Session 2 - Elden Ring Matching + Lore):**
- ✅ **Removed ALL circular styling** - eliminated `rounded-full` and `m-12` margins from image
- ✅ Image now displays as clean rectangle (matching Elden Ring exactly)
- ✅ **Updated type system** - added `weaponLore` and `skillDescription` fields to `ChryspolosItem` interface
- ✅ **Added lore data** - populated all 28 Chrysoplos items with weapon lore paragraphs and skill descriptions
- ✅ **Restructured description sections** to match Elden Ring format exactly:
  1. Weapon Lore paragraph FIRST (the story/background)
  2. "Unique Skill: [Skill Name]" header with skill effect description
- ✅ Fallback to `description` field for backwards compatibility

**Completed Changes (Session 3 - Cleanup):**
- ✅ **Removed SVG border decorations** (cleaner, less cluttered look)
- ✅ **Removed placeholder "C" text** (empty gradient background until actual weapon images ready)
- ✅ **Removed PASSIVE/ACTIVE type badge** (user feedback: looked ugly)
- ✅ Final result matches Elden Ring screenshot exactly with minimal, clean design

**Files Modified:**
1. `types.ts` (lines 11-26) - Added `weaponLore` and `skillDescription` fields to interface
2. `types.ts` (lines 67-490) - Populated all 28 items with lore from weapon descriptions document
3. `Chrysoplos.tsx` (lines 243-253) - Simplified image container (removed SVG borders, placeholder text, circular styling)
4. `Chrysoplos.tsx` (lines 255-272) - Restructured description sections to Elden Ring format (2 sections only, no type badge)

**Note:** Using CSS borders for separator lines. Decorative SVG separator lines will be added in Phase 2 when assets are ready.

**New Layout Structure (Final - Elden Ring Style):**
```
┌────────────────────────────────────────┐
│ WEAPON NAME (top-left)                │
│                                        │
│  ┌──────────────────────────────┐     │
│  │                              │     │
│  │   Empty Gradient Background  │     │  ← NO circles, borders, or text
│  │      (3:2 aspect ratio)      │     │     (placeholder for weapon image)
│  │                              │     │
│  └──────────────────────────────┘     │
│                                        │
│ ────────────────────────────────────  │
│ Weapon lore paragraph describing       │
│ the history and story behind this      │
│ Chrysoplos weapon...                   │
│ ────────────────────────────────────  │
│ Unique Skill: Binary Protocol          │
│ Mechanical effect description of       │
│ what the skill actually does...        │
└────────────────────────────────────────┘
```
(Note: Type badge removed - user feedback indicated it looked ugly)

**Example (Turing Test):**
```
TURING TEST

[Empty gradient background - 600x400px]
(Awaiting actual weapon image)

────────────────────────────────────

Alan Turing's final algorithm, written the night before he died.
It recognizes patterns in your actions, rewarding consistency with
mechanical efficiency. Every second move costs less. The machine
understands rhythm better than humans ever could.

────────────────────────────────────

Unique Skill: Binary Protocol
Every 2nd LEDA match, DIONE trade, or THEMIS prediction costs 1-3% less fees.
```

**Implementation:**

**1. Move weapon name ABOVE the image (before line 234):**
```tsx
<div className="p-12 flex flex-col items-center">
  {/* Weapon Name - NEW POSITION */}
  <div className="w-full max-w-[500px] mb-4">
    <h2 className="text-white text-3xl font-semibold text-left">
      {selectedChrysoplos.name}
    </h2>
  </div>

  {/* Large Chrysoplos Visual */}
  <div className="relative w-[500px] h-[500px] mb-6">
    {/* ... existing image code ... */}
  </div>

  {/* Description sections below... */}
</div>
```

**2. Replace description area (lines 263-286) with new structure:**
```tsx
<div className="w-full max-w-[500px] space-y-0">
  {/* Skill Name Section */}
  <div className="border-t border-white/[0.15] pt-4 pb-3">
    <h3 className="text-white text-lg font-semibold uppercase tracking-wide font-['Geist_Mono']">
      SKILL NAME
    </h3>
  </div>

  {/* Skill Description Section */}
  <div className="border-t border-white/[0.15] pt-4 pb-3">
    <p className="text-white/70 text-sm leading-relaxed font-['Geist_Mono']">
      {selectedChrysoplos.tagline}
    </p>
  </div>

  {/* Weapon Description Section */}
  <div className="border-t border-white/[0.15] pt-4 pb-3">
    <p className="text-white/80 text-sm leading-relaxed font-['Geist_Mono']">
      {selectedChrysoplos.description}
    </p>
  </div>

  {/* Type Badge Section */}
  <div className="border-t border-white/[0.15] pt-4">
    <span className="inline-block px-4 py-2 bg-white/[0.05] border border-white/[0.1] text-white/70 text-xs font-['Geist_Mono'] uppercase tracking-wider">
      {selectedChrysoplos.type}
    </span>
  </div>
</div>
```

**Notes:**
- Using CSS borders (`border-t border-white/[0.15]`) as separator lines for now
- Decorative SVG separator lines will be added in Phase 2
- All text now uses Geist Mono for consistency
- Maintains clean, readable spacing

---

## 🔄 PHASE 2: NEEDS ICONS (You're Creating)

### **FIX #4: Action Icons**
**Status:** ⬜ Waiting on Assets

**Assets Needed:**
- `/public/hyperion/icons/expand-icon.svg`
- `/public/hyperion/icons/forge-icon.svg`
- `/public/hyperion/icons/equip-icon.svg`
- `/public/hyperion/icons/inventory-icon.svg`
- `/public/hyperion/icons/lock-icon.svg`

**Implementation Plan:**

**1. Inventory Icon (Chrysoplos.tsx line 136):**
```tsx
<div className="flex items-center gap-3">
  <img src="/hyperion/icons/inventory-icon.svg" className="w-6 h-6" />
  <h1 className="text-white text-2xl font-semibold font-['Geist_Mono'] uppercase tracking-wider">
    INVENTORY
  </h1>
</div>
```

**2. Forge Button Icon (Chrysoplos.tsx line 428):**
```tsx
<button
  onClick={handleForge}
  disabled={!canForge()}
  className={`w-full py-4 text-base uppercase tracking-wider font-['Geist_Mono'] transition-all border-2 flex items-center justify-center gap-3 ${
    canForge()
      ? 'bg-red-900/40 hover:bg-red-900/60 border-red-700 text-white cursor-pointer'
      : 'bg-black/40 text-gray-600 cursor-not-allowed border-gray-700'
  }`}
>
  <img src="/hyperion/icons/forge-icon.svg" className="w-5 h-5" />
  <span>FORGE</span>
</button>
```

**3. Equip Button (to be added to Chrysoplos - currently click-to-equip):**
```tsx
{/* Add after the center display section */}
{selectedChrysoplos.owned && (
  <button
    onClick={() => setEquippedChrysoplos(selectedChrysoplos)}
    className="flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
  >
    <img src="/hyperion/icons/equip-icon.svg" className="w-5 h-5" />
    <span className="font-['Geist_Mono'] uppercase text-sm">
      {equippedChrysoplos.id === selectedChrysoplos.id ? 'EQUIPPED' : 'EQUIP'}
    </span>
  </button>
)}
```

**4. Lock Icon (for Archetypes - Phase 3):**
```tsx
{!archetype.isUnlocked && (
  <div className="locked-overlay">
    <img src="/hyperion/icons/lock-icon.svg" className="w-8 h-8" />
    <span>LOCKED</span>
  </div>
)}
```

---

### **FIX #1: Stylized Rarity Borders**
**Status:** ⬜ Waiting on Assets

**Assets Needed:**
- `/public/hyperion/decorations/rare-border.svg` - Simple, minimal border
- `/public/hyperion/decorations/unique-border.svg` - More decorative
- `/public/hyperion/decorations/mythic-border.svg` - Highly ornate
- `/public/hyperion/decorations/glitch-border.svg` - Distorted/glitchy effect

**Location:** `Chrysoplos.tsx` lines 235-248

**Current Code:**
```tsx
<img
  src={`/hyperion/decorations/${selectedChrysoplos.tier.toLowerCase()}-border.svg`}
  alt={`${selectedChrysoplos.tier} tier border`}
  className="absolute inset-0 w-full h-full pointer-events-none"
  style={{
    filter: `drop-shadow(0 0 8px ${TIER_COLORS[selectedChrysoplos.tier]}40)`
  }}
  onError={(e) => {
    const img = e.target as HTMLImageElement;
    img.src = '/hyperion/decorations/chrysoplos-view.svg';
  }}
/>
```

**Notes:**
- Code structure already in place
- Just needs the actual SVG files
- Border complexity should increase: Rare < Unique < Mythic < Glitch
- Consider animated elements for Glitch tier

---

### **FIX #10: Cyberpunk Tech Line Decorations**
**Status:** ⬜ Waiting on Assets

**Assets Needed:**
- `/public/shared/cyberpunk-decals/tech-line-corner-tl.jpg` (top-left)
- `/public/shared/cyberpunk-decals/tech-line-corner-tr.jpg` (top-right)
- `/public/shared/cyberpunk-decals/tech-line-corner-bl.jpg` (bottom-left)
- `/public/shared/cyberpunk-decals/tech-line-corner-br.jpg` (bottom-right)
- `/public/shared/cyberpunk-decals/tech-line-edge-*.jpg` (various edges)
- `/public/shared/cyberpunk-decals/tech-scan-line.jpg` (animated overlay)

**Implementation Plan for Chrysoplos.tsx:**

```tsx
{/* Add after main container div */}
<div className="absolute inset-0 pointer-events-none">
  {/* Corner Decorations */}
  <img
    src="/shared/cyberpunk-decals/tech-line-corner-tl.jpg"
    className="absolute top-0 left-0 w-32 h-32 opacity-40"
    alt=""
  />
  <img
    src="/shared/cyberpunk-decals/tech-line-corner-tr.jpg"
    className="absolute top-0 right-0 w-32 h-32 opacity-40"
    alt=""
  />
  <img
    src="/shared/cyberpunk-decals/tech-line-corner-bl.jpg"
    className="absolute bottom-0 left-0 w-32 h-32 opacity-40"
    alt=""
  />
  <img
    src="/shared/cyberpunk-decals/tech-line-corner-br.jpg"
    className="absolute bottom-0 right-0 w-32 h-32 opacity-40"
    alt=""
  />

  {/* Scan Line Animation */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-scan" />
</div>
```

**CSS Animation to Add:**
```css
@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.animate-scan {
  animation: scan 3s linear infinite;
}
```

**Apply to all three sections:**
- Chrysoplos (inventory/forge area)
- Archetypes (around character display)
- TraitUpgrade (around trait cards)

---

## 🎨 PHASE 3: NEEDS CHARACTER ART

### **FIX #11: Archetypes Valorant-Style Redesign**
**Status:** ⬜ Waiting on Assets

**Assets Needed:**
- 26 full-resolution archetype character images (1920x1080 or higher)
  - Format: PNG with transparency preferred
  - Naming: `/public/hyperion/archetypes/{archetype-id}-full.png`
  - Example: `/public/hyperion/archetypes/the-analyst-full.png`
- Colorless cyberpunk decal overlays (from cyberpunk-decals vol 2)

**Reference:** Valorant Agent Select Screen
- Character fills entire background
- Minimal UI overlay on left/right
- Character partially visible through UI elements
- Clean, modern aesthetic
- Smooth transitions between selections

**Major Structural Changes Required:**

**Current Layout (Lines 17-186):**
```tsx
<div className="bg-[#0a0a0a] relative">
  {/* Left side: Character in container */}
  <div className="character-container">
    <div className="w-[400px] h-[500px] bg-gradient">
      {/* Character placeholder */}
    </div>
  </div>

  {/* Right side: Info panel in bento box */}
  <div className="info-panel bg-black/60 border">
    {/* Details */}
  </div>
</div>
```

**New Layout:**
```tsx
<div
  className="w-full h-screen relative overflow-hidden"
  style={{
    backgroundImage: `url(/hyperion/archetypes/${selectedArchetype.id}-full.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 0.3s ease-in-out'
  }}
>
  {/* Dark gradient overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

  {/* Cyberpunk decal overlays */}
  <div className="absolute inset-0 pointer-events-none">
    <img src="/shared/cyberpunk-decals/tech-overlay-1.png" className="absolute top-0 left-0 w-full opacity-30" />
    <img src="/shared/cyberpunk-decals/tech-lines.png" className="absolute inset-0 w-full h-full opacity-20" />
  </div>

  {/* Content - REMOVE bento box wrapper */}
  <div className="relative z-10 flex h-full">
    {/* Left Panel - Info */}
    <div className="w-[500px] p-12 flex flex-col justify-center">
      {/* NMTI Code */}
      <div className="text-cyan-400 text-sm uppercase tracking-widest mb-2 font-['Geist_Mono']">
        {selectedArchetype.nmtiCode}
      </div>

      {/* Name */}
      <h1 className="text-white text-6xl font-bold mb-6">
        {selectedArchetype.name}
      </h1>

      {/* Trait Icons */}
      <div className="flex gap-3 mb-6">
        {selectedArchetype.traits.map((trait) => (
          <div key={trait} className="w-12 h-12 rounded-md bg-white/10 border border-white/20 flex items-center justify-center p-2">
            <img src={TRAIT_ICONS[trait]} alt={trait} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>

      {/* Personality */}
      <p className="text-white/90 italic text-lg mb-6 font-['Geist_Mono']">
        "{selectedArchetype.personality}"
      </p>

      {/* Theme */}
      <p className="text-white/70 text-base mb-8 font-['Geist_Mono']">
        {selectedArchetype.theme}
      </p>

      {/* Equip/Lock Status */}
      {selectedArchetype.isUnlocked ? (
        <button className="w-full py-4 bg-green-500/20 border-2 border-green-500 text-green-400 uppercase tracking-wider font-['Geist_Mono'] hover:bg-green-500/30 transition-all flex items-center justify-center gap-3">
          <img src="/hyperion/icons/equip-icon.svg" className="w-5 h-5" />
          <span>EQUIP ARCHETYPE</span>
        </button>
      ) : (
        <div className="w-full py-4 bg-red-500/10 border-2 border-red-500/50 text-red-400 uppercase tracking-wider font-['Geist_Mono'] flex items-center justify-center gap-3">
          <img src="/hyperion/icons/lock-icon.svg" className="w-5 h-5" />
          <span>LOCKED</span>
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs uppercase tracking-wider text-white/50 font-['Geist_Mono']">Progress</span>
          <span className="text-sm text-white font-['Geist_Mono']">{selectedArchetype.progress}%</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${selectedArchetype.progress}%` }}
          />
        </div>
      </div>

      {/* Requirements - collapsed by default */}
      <details className="mt-6">
        <summary className="text-white/50 text-xs uppercase tracking-wider cursor-pointer font-['Geist_Mono']">
          Unlock Requirements
        </summary>
        <p className="text-white/40 text-xs mt-2 font-['Geist_Mono']">
          {selectedArchetype.unlockRequirements}
        </p>
      </details>
    </div>

    {/* Right side - Let character breathe */}
    <div className="flex-1" />
  </div>

  {/* Bottom selector - Cards remain similar but with tech overlay */}
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent px-16 py-8">
    <div className="grid grid-cols-6 gap-3 max-w-[1600px] mx-auto">
      {ARCHETYPES.map(archetype => (
        <button
          key={archetype.id}
          onClick={() => handleArchetypeSelect(archetype)}
          className={`relative aspect-[3/4] rounded overflow-hidden transition-all ${
            selectedArchetype.id === archetype.id
              ? 'ring-2 ring-cyan-400 scale-105'
              : 'ring-1 ring-white/20 hover:ring-white/40'
          }`}
        >
          {/* Mini character preview */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(/hyperion/archetypes/${archetype.id}-thumb.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          {/* Lock overlay */}
          {!archetype.isUnlocked && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <img src="/hyperion/icons/lock-icon.svg" className="w-6 h-6 opacity-60" />
            </div>
          )}

          {/* Name bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/90 px-2 py-1">
            <div className="text-white font-['Geist_Mono'] text-[10px] uppercase tracking-wide truncate">
              {archetype.name}
            </div>
          </div>

          {/* Tier indicator */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ backgroundColor: archetype.tierColor }}
          />
        </button>
      ))}
    </div>
  </div>
</div>
```

**Key Changes Summary:**
1. ❌ Remove: Character container box
2. ❌ Remove: Bento box around info panel
3. ✅ Add: Full-screen character background
4. ✅ Add: Gradient overlay from left
5. ✅ Add: Cyberpunk decal overlays
6. ✅ Add: Equip/Lock button with icons
7. ✅ Add: Cleaner info panel layout
8. ✅ Add: Smooth background transitions
9. ✅ Change: Bottom selector to 6 columns for better fit

---

## ⚠️ NEEDS CLARIFICATION

### **FIX #3: Move Bar and Circle to Left Side**
**Status:** 🤔 Clarification Needed

**Question:** What specific "bar and circle" are you referring to?

**Possible Interpretations:**

**Option A: Inventory Grid Items**
- Add progress bar to left edge of each chrysoplos square
- Add circular level indicator to left side

**Option B: Main Chrysoplos Display**
- Move some existing UI element from right to left
- Could be referring to tier indicator or status indicator

**Option C: Trait Section**
- Move trait level circle/bar from right to left side of trait cards

**Please specify:**
1. Which section? (Chrysoplos/Archetypes/Traits)
2. Which specific UI element?
3. What should it display? (level, progress, status, etc.)

---

### **FIX #5: Savolevsky Graphs for Trait Bars**
**Status:** 🤔 Clarification Needed

**Current State:**
- Trait icons: ✅ Already updated (you mentioned this)
- Trait bars: Currently using segmented bar visualization (lines 55-108 in TraitUpgrade.tsx)

**Question:** Do you still want the bar visualization changed to Savolevsky-style graphs?

**Savolevsky Graph Characteristics:**
- Sharp angles and geometric shapes
- Layered polygons with tech aesthetic
- Angular/crystalline appearance
- Dynamic fill patterns
- Tech-inspired wireframe style

**Current Bar Style:**
- 7 major segments (one per level)
- 10 sub-pills per major segment
- Gradient fills (red/pink)
- Rounded rectangles

**If yes to changing:**
- Would need design reference or mockup
- Significant visual redesign required
- Could use SVG clip-paths for angular shapes
- Would implement tech-inspired fill patterns

**If no:**
- Keep current segmented bars
- Just update colors/styling to match cyberpunk theme
- Add tech overlays/effects

**Please confirm:** Change to Savolevsky graphs, or keep current style with theme updates?

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1 (Ready Now):
- [x] FIX #9: Background image swap (3 files) ✅
- [x] FIX #12: Font updates to Geist Mono (all subtext) ✅
- [x] FIX #2: Remove tier icons from grid ✅
- [x] FIX #6: Change title to INVENTORY ✅
- [x] FIX #8: Forge section text cleanup ✅
- [x] FIX #13: Standardize alignment across sections ✅
- [x] FIX #14: Dynamic trait costs implementation ✅
- [ ] FIX #7: Chrysoplos layout restructure (partial) ⏸️ PENDING

### Phase 2 (After Icons Created):
- [ ] FIX #4: Add action icons (5 icons needed)
- [ ] FIX #1: Add rarity borders (4 SVGs needed)
- [ ] FIX #10: Add cyberpunk tech decorations (multiple assets)

### Phase 3 (After Character Art Created):
- [ ] FIX #11: Complete Archetypes redesign (26+ images needed)

### Needs Clarification:
- [ ] FIX #3: Identify specific bar/circle element
- [ ] FIX #5: Confirm Savolevsky graph requirement

---

## 📝 NOTES & CONVENTIONS

**Font Usage:**
- `font-['Geist']` - Headers, titles, main labels
- `font-['Geist_Mono']` - Subtext, descriptions, data, metrics

**Color Palette:**
- Background: Hyperion BG image with black overlay
- Primary text: `text-white`
- Secondary text: `text-white/70` or `text-white/60`
- Accent: Cyan/Blue for interactive elements
- Borders: `border-white/[0.08]` for separators
- Success: Green tones
- Locked/Disabled: Red tones

**Spacing Standards:**
- Header padding: `px-8 py-6`
- Content padding: `p-8`
- Title margin: `mb-6`
- Section gaps: `mb-8` or `mb-6`

**Border Standards:**
- Section dividers: `border-b border-white/[0.08]`
- Content separators: `border-t border-white/[0.15]`
- Card borders: `border border-white/[0.1]`

**Typography Standards:**
- h1 titles: `text-2xl`
- h2 subtitles: `text-xl` or `text-3xl` (context dependent)
- h3 labels: `text-xs uppercase tracking-widest`
- Body text: `text-sm` or `text-base`

---

## 🔄 UPDATE LOG

**2025-10-17 - Initial Planning:**
- Initial document created
- All 14 fixes documented with implementation details
- Organized into 3 phases based on asset availability
- Added clarification requests for fixes #3 and #5
- Trait icons confirmed as already updated

**2025-10-17 - Phase 1 Implementation (First Session):**
- ✅ Completed FIX #9: All three components now use hyperion-bg.svg with dark overlay
- ✅ Completed FIX #12: All subtext across three components updated to Geist Mono
- ✅ Completed FIX #2: Tier icons removed from inventory grid items
- ✅ Completed FIX #6: Title changed to "INVENTORY" with proper styling
- ✅ Completed FIX #8: All forge section headers standardized and cleaned up
- ✅ Completed FIX #13: All three sections now have consistent alignment and structure
- ✅ Completed FIX #14: Dynamic trait costs fully implemented with exponential scaling
- ⏸️ FIX #7: Pending discussion before implementation

**2025-10-17 - Phase 1 Implementation (Second Session - FIX #7 Initial):**
- ✅ Completed FIX #7 initial restructure: Chrysoplos center panel layout updated
  - Changed image aspect ratio from 1:1 (500x500) to 3:2 (600x400)
  - Moved weapon name from center-below to top-left-above image
  - Replaced centered boxed descriptions with left-aligned bordered sections
  - Created four separate sections with border separators
  - All text converted to Geist Mono for consistency

**2025-10-17 - Phase 1 Implementation (Third Session - FIX #7 Revision):**
- ✅ Revised FIX #7 to match Elden Ring screenshot exactly:
  - **Removed ALL circular styling** (no more rounded-full or m-12 margins)
  - **Removed SVG border decorations** (cleaner look)
  - **Removed placeholder "C" text** (empty image container until assets ready)
  - **Removed PASSIVE/ACTIVE type badge** (user feedback: looked ugly)
  - **Added weapon lore system** - updated ChryspolosItem interface with weaponLore and skillDescription fields
  - **Populated all 28 Chrysoplos items** with lore paragraphs and skill descriptions
  - **Restructured description order** to match Elden Ring:
    1. Weapon lore paragraph (story/background)
    2. "Unique Skill: [Name]" with skill effect
    3. No type badge (removed)

**2025-10-17 - Phase 1 Implementation (Fourth Session - FIX #7 Alignment):**
- ✅ Completed final alignment improvements for Chrysoplos center panel:
  - **Horizontally centered content** - added `items-center` to center panel flex container (line 235)
  - **Removed top padding from center panel** - changed from `px-12 pt-6 pb-12` to `px-12 pb-12` to align with grid
  - **Removed top padding from left panel** - changed from `p-6` to `px-6 pb-6` on inventory grid container (line 157)
  - **Removed title section border** - removed `border-b border-white/[0.08]` from INVENTORY title area (line 147)
  - Result: Inventory grid and Chrysoplos name now perfectly aligned at same vertical position
  - Result: Center panel content (600px wide) now centered horizontally while maintaining left-aligned text

**2025-10-18 - Additional Improvements:**
- ✅ **Added title icons to all three Hyperion sections:**
  - Chrysoplos.tsx - Added `/hyperion/title-icons/chrysoplos.svg` (48x48px)
  - Archetypes.tsx - Added `/hyperion/title-icons/archetypes.svg` (48x48px)
  - TraitUpgrade.tsx - Added `/hyperion/title-icons/traits.svg` (48x48px)
  - Updated all titles to use `font-geist-bold` and `text-3xl` for consistency with Dione
  - Changed titles: "INVENTORY" → "CHRYSOPLOS", "Archetypes" → "ARCHETYPES", "Trait Upgrade" → "TRAITS"

- ✅ **Chrysoplos forge panel UI improvement:**
  - Removed separate "FORGE COST" container
  - Integrated cost directly into forge button: `FORGE (50 ◆)`
  - Cleaner, more actionable UI pattern

- ✅ **Trait background images implementation:**
  - Added individual trait background images to each trait row (TraitUpgrade.tsx lines 172-181)
  - Each trait displays its unique background from `/hyperion/traits-bg/{trait-id}-bg.svg`
  - Added dark overlay (`bg-black/80`) for text readability while showing subtle background
  - Wrapped content in relative z-10 container to ensure proper layering
  - Handled edge case for 'execution' trait (uses `execution.svg` instead of `execution-bg.svg`)

**Phase 1 Summary:**
- **8 out of 8 fixes completed ✅**
- All components now have consistent styling, fonts, and structure
- Background images applied with proper overlays
- Dynamic pricing system implemented for trait upgrades
- Chrysoplos center panel now matches Elden Ring layout exactly with full lore integration
- Clean, minimal design (removed decorative elements that looked ugly)
- Perfect alignment between inventory grid and center content panel
- Title icons added across all Hyperion sections matching Dione pattern
- Trait rows now display unique background images with proper readability
- **Phase 1 is now COMPLETE - Ready to proceed with Phase 2 once assets are created**

**Future Updates:**
- Track asset creation progress for Phase 2
- Add screenshots/previews as sections are finished
- Document any issues or deviations from plan
