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
  position: [0, 36, 112],
  fov: 70,
  near: 0.1,
  far: 4000,
}

// ---------------------------------------------------------------------------
// Fly-to (click a body -> ease camera to a shallow vantage; body sits on the
// left, info panel anchored to its right)
// ---------------------------------------------------------------------------
export const FOCUS = {
  durationMs: 900, // length of the eased fly-to (wall-clock, framerate-independent)
  elevationDeg: 15, // how high above the body the camera sits (shallow angle)
}

// Compute the fly-to for a body. The camera settles at a shallow (~15°) vantage
// on the approach side; we aim slightly to the right of the body so it lands on
// the LEFT of the frame, leaving room on the RIGHT for the info panel — which
// is anchored out to the side (panelAnchor) rather than above.
// Inputs/outputs are plain [x,y,z] arrays.
export function computeVantage(objPos, camPos, size) {
  const UP = new THREE.Vector3(0, 1, 0)
  const obj = new THREE.Vector3().fromArray(objPos)
  const cam = new THREE.Vector3().fromArray(camPos)

  // Horizontal direction from the object toward the camera (approach side).
  const horiz = new THREE.Vector3(cam.x - obj.x, 0, cam.z - obj.z)
  if (horiz.lengthSq() < 1e-4) horiz.set(0, 0, 1)
  horiz.normalize()

  // Shallow-elevation vantage (mostly side-on).
  const elev = THREE.MathUtils.degToRad(FOCUS.elevationDeg)
  const dir = horiz
    .clone()
    .multiplyScalar(Math.cos(elev))
    .addScaledVector(UP, Math.sin(elev))
  const camDist = size * 3.6 + 15
  const position = obj.clone().addScaledVector(dir, camDist)

  // Camera-right at the vantage (screen-right when looking at the body).
  const forward = obj.clone().sub(position).normalize()
  const right = forward.clone().cross(UP).normalize()

  // The (compact) panel is anchored out to the right of the body; we aim
  // between them so the body sits left-of-center and the panel sits to the
  // right with comfortable margin.
  const panelOffset = size * 1.3 + 16
  const panelAnchor = obj
    .clone()
    .addScaledVector(right, panelOffset)
    .addScaledVector(UP, size * 0.05)
  const lookAt = obj.clone().addScaledVector(right, panelOffset * 0.5)

  return {
    position: position.toArray(),
    lookAt: lookAt.toArray(),
    panelAnchor: panelAnchor.toArray(),
    panelDistanceFactor: camDist * 0.6,
  }
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
