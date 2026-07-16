import * as THREE from 'three'
import { hashString, mulberry32 } from './rng.js'

// ---------------------------------------------------------------------------
// bodyVariation — subtle, seeded per-body orbital & spin variety.
// ---------------------------------------------------------------------------
// Gives each planet/moon (keyed by slug, stable across reloads) a natural bit
// of variation so the system doesn't read as mechanically uniform:
//   • inclination — orbit plane tilted up to ~20° in a varied direction
//   • direction   — ~1/3 of bodies orbit the opposite way
//   • axialTilt   — the body's own spin axis tilted up to ~18°
//   • speedMul    — orbit speed scaled 0.65–1.65× (proximity slowdown still
//                   multiplies this, so the click mechanic is unaffected)
//   • spin        — a slow self-rotation (kept subtle so logos stay legible)
// Returned tilts are Euler [x, y, z] arrays ready for a <group rotation>.
// ---------------------------------------------------------------------------

const D = THREE.MathUtils.degToRad

export function bodyVariation(slug) {
  const rand = mulberry32(hashString(slug + '~orbit'))

  const incl = rand() * D(20)
  const inclPhase = rand() * Math.PI * 2
  const axial = (rand() * 2 - 1) * D(18)
  const axialPhase = rand() * Math.PI * 2
  const direction = rand() < 0.34 ? -1 : 1
  const speedMul = 0.65 + rand() * 1.0
  const spin = 0.04 + rand() * 0.06

  return {
    inclination: [incl * Math.cos(inclPhase), 0, incl * Math.sin(inclPhase)],
    axialTilt: [axial * Math.cos(axialPhase), 0, axial * Math.sin(axialPhase)],
    direction,
    speedMul,
    spin,
  }
}
