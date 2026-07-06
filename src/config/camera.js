// ---------------------------------------------------------------------------
// Camera / flight tuning
// ---------------------------------------------------------------------------
// All the "feel" of the spaceship lives here so it can be tweaked in one place
// without touching the control logic. Units are world-units and world-units/sec.
// ---------------------------------------------------------------------------

export const FLIGHT = {
  // Thrust (acceleration) applied while a movement key is held.
  acceleration: 95, // world-units / sec^2
  boostMultiplier: 2.6, // hold Shift-equivalent boost key to go faster

  // Top speed the craft will coast at.
  maxSpeed: 72, // world-units / sec

  // Inertia: fraction of velocity RETAINED per second when no thrust is applied.
  // Lower = more drag / snappier stop. Higher = more floaty drift.
  damping: 0.08, // (~92% of speed bled off each second)

  // How fast the ship visually banks/rolls — reserved for a later polish pass.
  // (kept here so the config is the single source of truth)

  // ----- Boundaries so the camera never clips the sun or flies away forever ---
  minDistanceFromSun: 14, // don't let the camera enter the sun
  maxDistanceFromOrigin: 900, // soft outer wall of the play space
}

// Initial camera placement: pulled back and above the ecliptic, angled down at
// the sun so the system reads clearly the moment the page loads.
export const INITIAL_CAMERA = {
  position: [0, 90, 300],
  fov: 70,
  near: 0.1,
  far: 4000,
}
