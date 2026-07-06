// ---------------------------------------------------------------------------
// moonOrbits — give each planet's moons varied orbit radii and speeds.
// ---------------------------------------------------------------------------
// The data file only needs to list the moons and the overall radius envelope;
// this spreads them out with a seeded (per-planet, stable across reloads)
// randomness so the moons don't march in lockstep. Radii stay within the
// planet's existing [min, max] envelope so nothing overlaps neighbouring orbits.
// ---------------------------------------------------------------------------

function hashString(s) {
  let h = 1779033703 ^ s.length
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Returns [{ radius, speed, angle }] aligned to planet.moons.
export function generateMoonOrbits(planet) {
  const moons = planet.moons ?? []
  const n = moons.length
  if (n === 0) return []

  const rand = mulberry32(hashString(planet.slug))
  const declared = moons.map((m) => m.orbitRadius)
  const rMin = Math.max(planet.size + 2, Math.min(...declared))
  const rMax = Math.max(...declared, rMin + 2)
  const span = rMax - rMin

  return moons.map((_, i) => {
    // Even base position across the envelope, then jitter for variety.
    const base = n === 1 ? (rMin + rMax) / 2 : rMin + span * (i / (n - 1))
    const jitter = (rand() - 0.5) * (span / Math.max(n - 1, 1)) * 0.9
    const radius = Math.min(rMax, Math.max(rMin, base + jitter))
    const speed = 0.16 + rand() * 0.46 // 0.16 .. 0.62 rad/s
    const angle = rand() * Math.PI * 2
    return { radius, speed, angle }
  })
}
