import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import Moon from './Moon.jsx'
import InfoPanel from './InfoPanel.jsx'
import { useSelection } from '../interaction/SelectionContext.js'

// ---------------------------------------------------------------------------
// Planet — one resume category orbiting the sun, with optional moons.
// ---------------------------------------------------------------------------
// Structure:
//   <orbitPivot>            rotates around the sun (the orbit)
//     <group @ radius>      the planet's position on its orbit
//       <mesh/> (spins)     the body — tagged selectable via userData
//       <label/> / <panel/> label when idle, info panel when selected
//       <Moon/> ...         moons live in this frame
//
// When this planet (or one of its moons) is selected we FREEZE the orbit so the
// panel doesn't drift away. Orbit angle is integrated incrementally (+= delta)
// so freezing/unfreezing never causes a positional jump.
// ---------------------------------------------------------------------------

export default function Planet({ planet }) {
  const orbitPivot = useRef()
  const planetSpin = useRef()
  const { selected, setSelected } = useSelection()

  const isSelected = selected?.kind === 'planet' && selected.slug === planet.slug
  // Freeze if this planet is selected OR one of its moons is selected.
  const frozen = isSelected || selected?.parentSlug === planet.slug

  // Data attached to the mesh so the raycaster can identify what was clicked.
  const selectData = {
    kind: 'planet',
    slug: planet.slug,
    parentSlug: null,
    content: planet.content,
    color: planet.color,
  }

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05)
    if (orbitPivot.current && !frozen) {
      orbitPivot.current.rotation.y += d * planet.orbitSpeed
    }
    if (planetSpin.current) {
      planetSpin.current.rotation.y += d * (planet.spinSpeed ?? 0.2)
    }
  })

  return (
    <group ref={orbitPivot} rotation={[0, planet.initialAngle, 0]}>
      <group position={[planet.orbitRadius, 0, 0]}>
        {/* Spinning, clickable body. */}
        <mesh
          ref={planetSpin}
          userData={{ select: selectData }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'default')}
        >
          <icosahedronGeometry args={[planet.size, 2]} />
          <meshStandardMaterial
            color={planet.color}
            flatShading
            roughness={0.65}
            metalness={0.15}
            emissive={planet.color}
            emissiveIntensity={isSelected ? 0.35 : 0.06}
          />
        </mesh>

        {/* Idle label — hidden while its panel is open. */}
        {!isSelected && (
          <Html
            position={[0, planet.size + 3, 0]}
            center
            distanceFactor={140}
            zIndexRange={[30, 0]}
            wrapperClass="planet-label-wrapper"
          >
            <div className="planet-label">{planet.name}</div>
          </Html>
        )}

        {/* Info panel — anchored beside/above the planet when selected. */}
        {isSelected && (
          <InfoPanel
            data={selectData}
            offsetY={planet.size + 8}
            distanceFactor={14}
            onClose={() => setSelected(null)}
          />
        )}

        {/* Moons orbit within the planet's local frame. */}
        {planet.moons?.map((moon) => (
          <Moon key={moon.slug} moon={moon} parentSlug={planet.slug} />
        ))}
      </group>
    </group>
  )
}
