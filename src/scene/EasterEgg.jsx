import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// EasterEgg — a tiny striped object that drifts across the background (~1 min
// to cross) and gently spins. It does NOT appear until 30s after load. Candy-
// cane red diagonal stripes mark it as intentional (not stray debris). Tagged
// selectable with kind 'easteregg'; clicking it TOGGLES the sun's face overlay
// (see SelectionManager + Scene).
// ---------------------------------------------------------------------------

const CROSS = 190 // half-width of the drift path
const PERIOD = 60 // seconds to cross from one side to the other
const APPEAR_DELAY = 30000 // ms before the egg first appears
const Y = 32
const Z = -95

// Diagonal red-on-light stripes -> reads as a barber-pole/candy-cane on a ball.
function makeStripeTexture() {
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#eef0f7'
  ctx.fillRect(0, 0, size, size)
  ctx.strokeStyle = '#e23b3b'
  ctx.lineWidth = 15
  for (let i = -size; i < size * 2; i += 40) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + size, size)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function EasterEgg() {
  const group = useRef()
  const mesh = useRef()
  const start = useRef(null)
  const stripes = useMemo(makeStripeTexture, [])
  const [appeared, setAppeared] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setAppeared(true), APPEAR_DELAY)
    return () => clearTimeout(id)
  }, [])

  useFrame((state, delta) => {
    if (!appeared) return
    if (start.current == null) start.current = state.clock.elapsedTime
    const t = (((state.clock.elapsedTime - start.current) % PERIOD) / PERIOD)
    if (group.current) {
      group.current.position.set(
        -CROSS + t * 2 * CROSS,
        Y + Math.sin(t * Math.PI * 2) * 6,
        Z,
      )
    }
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.5
      mesh.current.rotation.x += delta * 0.3
    }
  })

  if (!appeared) return null

  return (
    <group ref={group}>
      <mesh
        ref={mesh}
        userData={{ select: { kind: 'easteregg' } }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial
          map={stripes}
          roughness={0.5}
          metalness={0.2}
          emissive="#3a2233"
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  )
}
