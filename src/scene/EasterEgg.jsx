import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// ---------------------------------------------------------------------------
// EasterEgg — a tiny object that slowly drifts across the background (~1 min to
// cross) and gently spins. Unobtrusive by design. It's tagged selectable with
// kind 'easteregg'; clicking it restores the sun's headshot face overlay (see
// SelectionManager + Sun). Small and dim so it doesn't draw attention on load.
// ---------------------------------------------------------------------------

const CROSS = 190 // half-width of the drift path
const PERIOD = 60 // seconds to cross from one side to the other
const Y = 32
const Z = -95

export default function EasterEgg() {
  const group = useRef()
  const mesh = useRef()

  useFrame((state, delta) => {
    const t = (state.clock.elapsedTime % PERIOD) / PERIOD // 0..1, then loops
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

  return (
    <group ref={group}>
      <mesh
        ref={mesh}
        userData={{ select: { kind: 'easteregg' } }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <icosahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#c3c9dc"
          emissive="#6b74a2"
          emissiveIntensity={0.35}
          flatShading
          roughness={0.5}
          metalness={0.35}
        />
      </mesh>
    </group>
  )
}
