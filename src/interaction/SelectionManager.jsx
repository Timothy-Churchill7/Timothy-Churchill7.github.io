import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSelection } from './SelectionContext.js'

// ---------------------------------------------------------------------------
// SelectionManager — turns clicks into planet/moon selections (fly-to focus).
// ---------------------------------------------------------------------------
// Two aiming modes so it feels right whether you're flying or not:
//   • Flying (pointer locked): raycast from screen CENTER (the crosshair).
//   • Cursor (unlocked): raycast from the mouse position, like a normal click.
//
// Clicking a body: kicks off the fly-to (Scene.focusOnBody) and — if we were
// flying — releases pointer lock so the cursor is free to read/close the panel
// once the camera arrives. We swallow that click so drei's PointerLockControls
// don't immediately re-lock.
//
// Clicking empty space: dismisses any open selection. We DON'T swallow it, so
// drei re-locks and you're flying again from wherever you are — "click away."
//
// Runs in the CAPTURE phase on the canvas, ahead of drei's click-to-lock
// handler, which is what lets us selectively block re-locking.
// ---------------------------------------------------------------------------

export default function SelectionManager() {
  const { selected, focusOnBody, clearSelection, toggleFace } = useSelection()
  const { camera, gl, scene } = useThree()

  useEffect(() => {
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const worldPos = new THREE.Vector3()
    const el = gl.domElement

    const onClick = (e) => {
      const locked = document.pointerLockElement === el

      if (locked) {
        ndc.set(0, 0) // aim from the center crosshair
      } else {
        const rect = el.getBoundingClientRect()
        ndc.set(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1,
        )
      }

      raycaster.setFromCamera(ndc, camera)
      const hits = raycaster.intersectObjects(scene.children, true)

      // Walk up from the first hit to find a tagged selectable object.
      let picked = null
      let pickedObj = null
      for (const hit of hits) {
        let o = hit.object
        while (o) {
          if (o.userData?.select) {
            picked = o.userData.select
            pickedObj = o
            break
          }
          o = o.parent
        }
        if (picked) break
      }

      if (picked?.kind === 'easteregg') {
        // The floating easter egg toggles the sun's face overlay. Don't fly to
        // it; swallow the click so we don't re-lock.
        toggleFace()
        e.stopImmediatePropagation()
        e.preventDefault()
      } else if (picked) {
        // Use the body's current world center so the vantage is framed on it.
        pickedObj.getWorldPosition(worldPos)
        focusOnBody(picked, worldPos.toArray(), camera.position.toArray())
        if (locked) document.exitPointerLock()
        // Prevent drei's PointerLockControls from re-locking on this same click.
        e.stopImmediatePropagation()
        e.preventDefault()
      } else if (selected) {
        // Clicked empty space with a selection open -> dismiss it.
        // (Not swallowed: drei will re-lock so flying resumes.)
        clearSelection()
      }
    }

    el.addEventListener('click', onClick, { capture: true })
    return () => el.removeEventListener('click', onClick, { capture: true })
  }, [camera, gl, scene, selected, focusOnBody, clearSelection, toggleFace])

  return null
}
