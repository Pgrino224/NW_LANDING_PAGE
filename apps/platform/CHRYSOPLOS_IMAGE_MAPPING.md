# Chrysoplos Image Mapping Guide

## Current Status

**Directory**: `apps/platform/public/hyperion/chrysoplos-images`

### Files Already Correctly Named ✅

| Current Filename | Chrysoplos Name | Tier | Status |
|-----------------|-----------------|------|--------|
| all-weather-protocol.png | All Weather Protocol | Unique | ✅ Correct |
| atom-of-bohr.png | Atom of Bohr | Unique | ✅ Correct |
| davincis-code.png | Da Vinci's Code | Unique | ✅ Correct |
| entropy-database.png | Entropy Database | Rare | ✅ Correct |
| eulers-ruler.png | Euler's Ruler | Unique | ✅ Correct |
| friedman-doctrine.png | Friedman Doctrine | Unique | ✅ Correct |
| godels-loop.png | Gödel's Loop | Unique | ✅ Correct |
| latency-matrix.png | Latency Matrix | Rare | ✅ Correct |
| newtons-apple.png | Newton's Apple | Unique | ✅ Correct |
| recursion-engine.png | Recursion Engine | Rare | ✅ Correct |
| turing-test.png | Turing Test | Unique | ✅ Correct |

**Count**: 11 files correctly named

---

## Files That Need Renaming

### Generic Gemini Files (12 total)

These files need to be inspected visually and mapped to the correct chrysoplos:

1. `Gemini_Generated_Image_1wmzcn1wmzcn1wmz.png`
2. `Gemini_Generated_Image_47ctpb47ctpb47ct.png`
3. `Gemini_Generated_Image_65zu0565zu0565zu.png`
4. `Gemini_Generated_Image_bzjnp3bzjnp3bzjn.png`
5. `Gemini_Generated_Image_cxwi9gcxwi9gcxwi.png`
6. `Gemini_Generated_Image_iuhg1jiuhg1jiuhg.png`
7. `Gemini_Generated_Image_nqn7hlnqn7hlnqn7.png`
8. `Gemini_Generated_Image_u8rdeyu8rdeyu8rd.png`
9. `Gemini_Generated_Image_x8p1mtx8p1mtx8p1.png`
10. `Gemini_Generated_Image_xedygmxedygmxedy.png`
11. `Gemini_Generated_Image_xh7wd1xh7wd1xh7w.png`
12. `Gemini_Generated_Image_xs121exs121exs12.png`

---

## Target Chrysoplos Names (Need Images)

### RARE TIER (6 remaining)

| Target Filename | Chrysoplos Name | Tagline | Description |
|----------------|-----------------|---------|-------------|
| convergence-algorithm.png | Convergence Algorithm | Limit Order Master | Precision trading algorithm from Archegos Capital ruins |
| resonance-protocol.png | Resonance Protocol | Confidence Pays | Amplifies high-confidence predictions |
| equilibrium-framework.png | Equilibrium Framework | Perfect Chemistry | Sacred geometry of unit harmony from LTCM |
| volatility-sequence.png | Volatility Sequence | Stop Loss Reward | Forged in Black Monday 1987 fires |
| momentum-architecture.png | Momentum Architecture | Territory Chain | Alexander's military conquest blueprint |
| parallax-network.png | Parallax Network | Category Expert | 47 Super Bowl prediction savant |
| synthesis-compiler.png | Synthesis Compiler | Chemistry Override | Forbidden alchemical formula from Helvetius |
| amplitude-server.png | Amplitude Server | Early Bird | First HFT firm relic |
| frequency-validator.png | Frequency Validator | Contrarian Bonus | Jesse Livermore's final compass |

### MYTHIC TIER (5 total)

| Target Filename | Chrysoplos Name | Tagline | Description |
|----------------|-----------------|---------|-------------|
| fire-of-prometheus.png | Fire of Prometheus | Divine Ascension | Stolen divine flame from Olympus |
| pandoras-box.png | Pandora's Box | Last Hope | Zeus's cursed box with Hope remaining |
| wings-of-icarus.png | Wings of Icarus | Soaring Ambition | Daedalus's wings with hubris warning |
| sisyphus-rock.png | Sisyphus' Rock | Eternal Return | Boulder from eternal punishment |
| midas-touch.png | Midas Touch | Golden Hour | King Midas's blessing and curse |

### GLITCH TIER (3 total)

| Target Filename | Chrysoplos Name | Tagline | Description |
|----------------|-----------------|---------|-------------|
| vvoid.png | VVoid | Null Absorption | Y2K bug source code artifact |
| sccorch.png | Sccorch | Burning Fortune | Burned dice from 1997 Las Vegas fire |
| corre.png | Corre | Glitch Cascade | Knight Capital $440M glitch fragment |

---

## Naming Convention

**Format**: `lowercase-with-hyphens.png`

**Examples**:
- "All Weather Protocol" → `all-weather-protocol.png`
- "Da Vinci's Code" → `davincis-code.png` (remove apostrophes)
- "Gödel's Loop" → `godels-loop.png` (normalize special characters)
- "VVoid" → `vvoid.png`
- "Sisyphus' Rock" → `sisyphus-rock.png`

---

## Action Required

### Step 1: Visual Inspection
Open each `Gemini_Generated_Image_*.png` file and identify which chrysoplos it represents based on:
- Visual theme (trading/math/mythology/glitch aesthetic)
- Color scheme (matches tier: Gold=Rare, Emerald=Unique, Purple=Mythic, Pink=Glitch)
- Symbolic elements in the image

### Step 2: Provide Mapping
Fill in this mapping table:

```
Gemini_Generated_Image_1wmzcn1wmzcn1wmz.png → [chrysoplos-name].png
Gemini_Generated_Image_47ctpb47ctpb47ct.png → [chrysoplos-name].png
Gemini_Generated_Image_65zu0565zu0565zu.png → [chrysoplos-name].png
Gemini_Generated_Image_bzjnp3bzjnp3bzjn.png → [chrysoplos-name].png
Gemini_Generated_Image_cxwi9gcxwi9gcxwi.png → [chrysoplos-name].png
Gemini_Generated_Image_iuhg1jiuhg1jiuhg.png → [chrysoplos-name].png
Gemini_Generated_Image_nqn7hlnqn7hlnqn7.png → [chrysoplos-name].png
Gemini_Generated_Image_u8rdeyu8rdeyu8rd.png → [chrysoplos-name].png
Gemini_Generated_Image_x8p1mtx8p1mtx8p1.png → [chrysoplos-name].png
Gemini_Generated_Image_xedygmxedygmxedy.png → [chrysoplos-name].png
Gemini_Generated_Image_xh7wd1xh7wd1xh7w.png → [chrysoplos-name].png
Gemini_Generated_Image_xs121exs121exs12.png → [chrysoplos-name].png
```

### Step 3: Batch Rename
Once mapping is confirmed, execute rename commands:

```bash
cd apps/platform/public/hyperion/chrysoplos-images

mv "Gemini_Generated_Image_1wmzcn1wmzcn1wmz.png" "[target-name].png"
mv "Gemini_Generated_Image_47ctpb47ctpb47ct.png" "[target-name].png"
# ... etc
```

---

## Summary

- ✅ **11 files** correctly named
- 🔄 **12 files** need renaming (Gemini generic names)
- ❌ **5 files** missing (need to be created or are mislabeled)

**Total**: 28 chrysoplos in the library → should have 28 PNG files

---

*Last updated: 2025-10-18*
