import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSelection } from './SelectionContext.js'

// ---------------------------------------------------------------------------
// SelectionManager — turns clicks into planet/moon selections.
// ---------------------------------------------------------------------------
// Two aiming modes so it feels right whether you're flying or not:
//   • Flying (pointer locked): raycast from screen CENTER (the crosshair). Fly
//     toward a body, click, and the thing under the reticle is selected.
//   • Cursor (unlocked): raycast from the mouse position, like a normal click.
//
// Clicking a body: opens its panel, and — if we were flying — releases pointer
// lock so the cursor is available to read/close the panel (and so mouse-look
// stops fighting the reader). We swallow that click so drei's PointerLock
// controls don't immediately re-lock.
//
// Clicking empty space: dismisses any open panel. We DON'T swallow it, so drei
// re-locks and you're flying again — "click away to resume."
//
// The listener runs in the CAPTURE phase on the canvas, ahead of drei's own
// click-to-lock handler, which is what lets us selectively block re-locking.
// ---------------------------------------------------------------------------

export default function SelectionManager() {
  const { selected, setSelected } = useSelection()
  const { camera, gl, scene } = useThree()

  useEffect(() => {
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
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
      for (const hit of hits) {
        let o = hit.object
        while (o) {
          if (o.userData?.select) {
            picked = o.userData.select
            break
          }
          o = o.parent
        }
        if (picked) break
      }

      if (picked) {
        setSelected(picked)
        if (locked) document.exitPointerLock()
        // Prevent drei's PointerLockControls from re-locking on this same click.
        e.stopImmediatePropagation()
        e.preventDefault()
      } else if (selected) {
        // Clicked empty space with a panel open -> dismiss it.
        // (Not swallowed: drei will re-lock so flying resumes.)
        setSelected(null)
      }
    }

    el.addEventListener('click', onClick, { capture: true })
    return () => el.removeEventListener('click', onClick, { capture: true })
  }, [camera, gl, scene, selected, setSelected])

  return null
}
