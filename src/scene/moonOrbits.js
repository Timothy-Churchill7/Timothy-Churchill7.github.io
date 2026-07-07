import { hashString, mulberry32 } from './rng.js'

// ---------------------------------------------------------------------------
// moonOrbits — give each planet's moons compact, varied orbit radii/speeds.
// ---------------------------------------------------------------------------
// Moons hug their planet in a tight band (so the whole system stays compact)
// but are spread with a seeded (per-planet, stable across reloads) jitter so
// they don't march in lockstep. Radius is derived from the planet size + moon
// index, not from the data, keeping the layout tight regardless of authoring.
// ---------------------------------------------------------------------------

// Returns [{ radius, speed, angle }] aligned to planet.moons.
export function generateMoonOrbits(planet) {
  const moons = planet.moons ?? []
  const n = moons.length
  if (n === 0) return []

  const rand = mulberry32(hashString(planet.slug))
  const rMin = planet.size + 1.6
  const step = 1.4 // tight spacing between successive moon orbits
  const rMax = rMin + Math.max(n - 1, 0) * step
  const span = Math.max(rMax - rMin, 1)

  return moons.map((_, i) => {
    const base = n === 1 ? rMin : rMin + span * (i / (n - 1))
    const jitter = (rand() - 0.5) * (span / Math.max(n - 1, 1)) * 0.75
    const radius = Math.min(rMax, Math.max(rMin, base + jitter))
    const speed = 0.16 + rand() * 0.46 // 0.16 .. 0.62 rad/s
    const angle = rand() * Math.PI * 2
    return { radius, speed, angle }
  })
}
