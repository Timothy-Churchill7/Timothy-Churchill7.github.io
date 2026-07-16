import { useMemo, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSelection } from '../interaction/SelectionContext.js'
import { FOCUS } from '../config/camera.js'

// ---------------------------------------------------------------------------
// CameraController — the "fly-to" animation.
// ---------------------------------------------------------------------------
// While phase === 'approaching', eases the camera from wherever it is to the
// focus target (a 45° vantage above/offset from the clicked body, looking down
// at it). When the eased duration completes it calls markArrived() to open the
// info panel.
//
// The animation is driven by WALL-CLOCK time (performance.now) and a smoothstep
// over a fixed duration, so it's framerate-independent: it always takes the
// same real time and always completes, even if the tab is throttled.
//
// Free flight (SpaceshipControls) stands down whenever something is selected,
// so these two never fight over the camera.
// ---------------------------------------------------------------------------

export default function CameraController() {
  const { camera } = useThree()
  const { phase, focus, markArrived } = useSelection()

  const startPos = useMemo(() => new THREE.Vector3(), [])
  const startQuat = useMemo(() => new THREE.Quaternion(), [])
  const targetPos = useMemo(() => new THREE.Vector3(), [])
  const targetQuat = useMemo(() => new THREE.Quaternion(), [])
  // A camera (not a plain Object3D): Object3D.lookAt uses a reversed convention
  // for non-cameras, which would orient us *away* from the target. Using a
  // camera makes lookAt point -Z at the target, matching our real camera.
  const dummy = useMemo(() => new THREE.PerspectiveCamera(), [])
  const startTime = useRef(0)
  const initialized = useRef(false)

  // Re-arm for the next fly-to whenever we're not actively approaching.
  if (phase !== 'approaching') initialized.current = false

  useFrame(() => {
    if (phase !== 'approaching' || !focus) return

    // Capture the start pose + target pose once, at the moment we begin.
    if (!initialized.current) {
      startPos.copy(camera.position)
      startQuat.copy(camera.quaternion)
      targetPos.fromArray(focus.position)
      dummy.position.copy(targetPos)
      dummy.lookAt(focus.lookAt[0], focus.lookAt[1], focus.lookAt[2])
      targetQuat.copy(dummy.quaternion)
      startTime.current = performance.now()
      initialized.current = true
    }

    const t = Math.min((performance.now() - startTime.current) / FOCUS.durationMs, 1)
    const e = t * t * (3 - 2 * t) // smoothstep easing

    camera.position.lerpVectors(startPos, targetPos, e)
    camera.quaternion.slerpQuaternions(startQuat, targetQuat, e)

    if (t >= 1) markArrived()
  })

  return null
}
