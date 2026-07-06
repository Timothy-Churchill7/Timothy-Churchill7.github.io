import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import InfoPanel from './InfoPanel.jsx'
import { useSelection } from '../interaction/SelectionContext.js'

// ---------------------------------------------------------------------------
// Moon — a sub-item that orbits its parent planet.
// ---------------------------------------------------------------------------
// Lives inside the planet's frame, so it inherits the planet's position. When
// a moon is selected, the parent planet also freezes (see Planet.jsx) AND the
// moon freezes its own mini-orbit, so its info panel stays put.
// ---------------------------------------------------------------------------

export default function Moon({ moon, parentSlug }) {
  const pivot = useRef()
  const { selected, setSelected } = useSelection()

  const isSelected = selected?.kind === 'moon' && selected.slug === moon.slug

  const selectData = {
    kind: 'moon',
    slug: moon.slug,
    parentSlug,
    content: moon.content,
    color: moon.color,
  }

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05)
    if (pivot.current && !isSelected) {
      pivot.current.rotation.y += d * moon.orbitSpeed
    }
  })

  return (
    <group ref={pivot} rotation={[0, moon.initialAngle, 0]}>
      <group position={[moon.orbitRadius, 0, 0]}>
        <mesh
          userData={{ select: selectData }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'default')}
        >
          <icosahedronGeometry args={[moon.size, 1]} />
          <meshStandardMaterial
            color={moon.color}
            flatShading
            roughness={0.75}
            metalness={0.1}
            emissive={moon.color}
            emissiveIntensity={isSelected ? 0.4 : 0.08}
          />
        </mesh>

        {!isSelected && (
          <Html
            position={[0, moon.size + 1.4, 0]}
            center
            distanceFactor={90}
            zIndexRange={[20, 0]}
            wrapperClass="planet-label-wrapper"
          >
            <div className="planet-label planet-label--moon">{moon.name}</div>
          </Html>
        )}

        {isSelected && (
          <InfoPanel
            data={selectData}
            offsetY={moon.size + 4}
            distanceFactor={9}
            onClose={() => setSelected(null)}
          />
        )}
      </group>
    </group>
  )
}
