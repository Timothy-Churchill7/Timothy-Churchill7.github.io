import { useEffect, useMemo, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import { FLIGHT } from '../config/camera.js'
import { useSelection } from '../interaction/SelectionContext.js'

// ---------------------------------------------------------------------------
// SpaceshipControls
// ---------------------------------------------------------------------------
// Free-flight camera with a "piloting a small craft" feel:
//   • Mouse-look via pointer lock (drei's PointerLockControls handles rotation)
//   • WASD  -> forward / back / strafe, relative to where you're looking
//   • Space -> thrust up,  Shift -> thrust down (relative to craft orientation)
//   • Hold the boost key (CapsLock-free: we use the "r" key? no) -> see below
//   • Velocity-based movement with inertia/drift and a hard speed cap
//   • Soft boundaries so the camera can't clip the sun or escape the system
//
// The component renders drei's <PointerLockControls>; all translation happens
// in a useFrame loop that mutates the camera position directly.
// ---------------------------------------------------------------------------

// Keys we care about -> semantic action names.
const KEY_MAP = {
  KeyW: 'forward',
  KeyS: 'back',
  KeyA: 'left',
  KeyD: 'right',
  Space: 'up',
  ShiftLeft: 'down',
  ShiftRight: 'down',
  KeyE: 'boost', // hold E for a speed boost (ergonomic next to WASD)
}

export default function SpaceshipControls({ onLockChange }) {
  const { camera } = useThree()
  const controlsRef = useRef()
  const { selected } = useSelection()

  // Which actions are currently active (held keys).
  const keys = useRef({})

  // Persistent scratch objects so we don't allocate every frame.
  const velocity = useRef(new THREE.Vector3())
  const scratch = useMemo(
    () => ({
      forward: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(),
      desired: new THREE.Vector3(),
      offset: new THREE.Vector3(),
    }),
    [],
  )

  // Face the sun on first load so the whole system is framed nicely.
  useEffect(() => {
    camera.lookAt(0, 0, 0)
  }, [camera])

  // ---- keyboard listeners --------------------------------------------------
  useEffect(() => {
    const down = (e) => {
      const action = KEY_MAP[e.code]
      if (action) {
        keys.current[action] = true
        // Space would otherwise scroll the page.
        if (e.code === 'Space') e.preventDefault()
      }
    }
    const up = (e) => {
      const action = KEY_MAP[e.code]
      if (action) keys.current[action] = false
    }
    // If focus is lost (alt-tab, etc.) drop all keys so we don't drift forever.
    const clear = () => (keys.current = {})

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
    }
  }, [])

  // ---- per-frame flight integration ---------------------------------------
  useFrame((_, rawDelta) => {
    // While a body is selected, the CameraController owns the camera (fly-to)
    // or it's parked at the vantage reading the panel. Stand down and keep
    // velocity at zero so free flight resumes cleanly (no lurch) on close.
    if (selected) {
      velocity.current.set(0, 0, 0)
      return
    }

    // Clamp delta so a stutter/tab-away doesn't launch the camera.
    const dt = Math.min(rawDelta, 0.05)
    const k = keys.current

    // Build craft-relative basis vectors from the camera's orientation.
    scratch.forward.set(0, 0, -1).applyQuaternion(camera.quaternion)
    scratch.right.set(1, 0, 0).applyQuaternion(camera.quaternion)
    scratch.up.set(0, 1, 0).applyQuaternion(camera.quaternion)

    // Accumulate the desired thrust direction from held keys.
    scratch.desired.set(0, 0, 0)
    if (k.forward) scratch.desired.add(scratch.forward)
    if (k.back) scratch.desired.sub(scratch.forward)
    if (k.right) scratch.desired.add(scratch.right)
    if (k.left) scratch.desired.sub(scratch.right)
    if (k.up) scratch.desired.add(scratch.up)
    if (k.down) scratch.desired.sub(scratch.up)

    const thrusting = scratch.desired.lengthSq() > 0
    if (thrusting) {
      const accel = FLIGHT.acceleration * (k.boost ? FLIGHT.boostMultiplier : 1)
      scratch.desired.normalize().multiplyScalar(accel * dt)
      velocity.current.add(scratch.desired)
    }

    // Inertia: exponential damping toward zero, framerate-independent.
    const drag = Math.pow(FLIGHT.damping, dt)
    velocity.current.multiplyScalar(drag)

    // Cap top speed (boost raises the ceiling while held).
    const maxSpeed = FLIGHT.maxSpeed * (k.boost ? FLIGHT.boostMultiplier : 1)
    if (velocity.current.length() > maxSpeed) {
      velocity.current.setLength(maxSpeed)
    }

    // Integrate position.
    scratch.offset.copy(velocity.current).multiplyScalar(dt)
    camera.position.add(scratch.offset)

    // ---- boundaries --------------------------------------------------------
    const dist = camera.position.length()
    if (dist < FLIGHT.minDistanceFromSun) {
      // Push back out along the radial direction and kill inward velocity.
      camera.position.setLength(FLIGHT.minDistanceFromSun)
      velocity.current.multiplyScalar(0.2)
    } else if (dist > FLIGHT.maxDistanceFromOrigin) {
      camera.position.setLength(FLIGHT.maxDistanceFromOrigin)
      velocity.current.multiplyScalar(0.2)
    }
  })

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={() => onLockChange?.(true)}
      onUnlock={() => onLockChange?.(false)}
    />
  )
}
