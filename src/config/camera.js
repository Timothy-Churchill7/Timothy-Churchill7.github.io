// ---------------------------------------------------------------------------
// Camera / flight tuning
// ---------------------------------------------------------------------------
// All the "feel" of the spaceship lives here so it can be tweaked in one place
// without touching the control logic. Units are world-units and world-units/sec.
// ---------------------------------------------------------------------------

import * as THREE from 'three'

export const FLIGHT = {
  // Thrust (acceleration) applied while a movement key is held.
  acceleration: 70, // world-units / sec^2
  boostMultiplier: 2.6, // hold Shift-equivalent boost key to go faster

  // Top speed the craft will coast at.
  maxSpeed: 46, // world-units / sec

  // Inertia: fraction of velocity RETAINED per second when no thrust is applied.
  // Lower = more drag / snappier stop. Higher = more floaty drift.
  damping: 0.08, // (~92% of speed bled off each second)

  // ----- Boundaries so the camera never clips the sun or flies away forever ---
  minDistanceFromSun: 14, // don't let the camera enter the sun
  maxDistanceFromOrigin: 320, // soft outer wall of the (now compact) play space
}

// Initial camera placement: pulled back and above the ecliptic, angled down at
// the sun so the whole (compact) system reads clearly the moment it loads.
export const INITIAL_CAMERA = {
  position: [0, 48, 150],
  fov: 70,
  near: 0.1,
  far: 4000,
}

// ---------------------------------------------------------------------------
// Fly-to (click a body -> ease camera to a 45° vantage above/offset from it)
// ---------------------------------------------------------------------------
export const FOCUS = {
  durationMs: 900, // length of the eased fly-to (wall-clock, framerate-independent)
}

// Compute the camera vantage point for focusing on a body: a point offset from
// the object at a ~45° elevation, on the side the camera is already coming from,
// looking back down at the object. Inputs/outputs are plain [x,y,z] arrays.
export function computeVantage(objPos, camPos, size) {
  const obj = new THREE.Vector3().fromArray(objPos)
  const cam = new THREE.Vector3().fromArray(camPos)

  // Horizontal direction from the object toward the camera (approach side).
  const horiz = new THREE.Vector3(cam.x - obj.x, 0, cam.z - obj.z)
  if (horiz.lengthSq() < 1e-4) horiz.set(0, 0, 1)
  horiz.normalize()

  // Equal horizontal + vertical components => 45° elevation.
  const dir = new THREE.Vector3(horiz.x, 1, horiz.z).normalize()
  const dist = size * 3 + 10 // frame the body nicely regardless of its size

  const pos = obj.clone().addScaledVector(dir, dist)
  return { position: pos.toArray(), lookAt: obj.toArray() }
}

// ---------------------------------------------------------------------------
// Proximity slowdown — planets/moons ease toward stationary as the camera nears
// them, so a moving target is actually clickable. Returns an orbit-speed
// multiplier in [0, 1] that eases smoothly with distance.
// ---------------------------------------------------------------------------
export const PROXIMITY = {
  pad: 4, // stationary within (size * 2.5 + pad) units of the body
  range: 40, // ...easing back to full speed over this additional distance
}

export function proximityFactor(dist, size) {
  const near = size * 2.5 + PROXIMITY.pad
  const far = near + PROXIMITY.range
  const t = Math.min(Math.max((dist - near) / (far - near), 0), 1)
  return t * t * (3 - 2 * t) // smoothstep
}
