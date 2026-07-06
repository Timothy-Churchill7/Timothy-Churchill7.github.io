import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import Moon from './Moon.jsx'
import InfoPanel from './InfoPanel.jsx'
import { useSelection } from '../interaction/SelectionContext.js'
import { proximityFactor } from '../config/camera.js'

// ---------------------------------------------------------------------------
// Planet — one resume category orbiting the sun, with optional moons.
// ---------------------------------------------------------------------------
// Structure:
//   <orbitPivot>            rotates around the sun (the orbit)
//     <bodyGroup @ radius>  the planet's position on its orbit (world center)
//       <mesh/> (spins)     the body — tagged selectable via userData
//       <label/> / <panel/> label when idle, info panel once focused
//       <Moon/> ...         moons live in this frame
//
// Motion:
//   • FREEZE the orbit when this planet (or one of its moons) is selected.
//   • Otherwise ease the orbit speed down as the camera approaches, so a moving
//     target is clickable (proximityFactor). Orbit angle is integrated
//     incrementally so speed changes never cause a positional jump.
// ---------------------------------------------------------------------------

export default function Planet({ planet }) {
  const orbitPivot = useRef()
  const bodyGroup = useRef()
  const planetSpin = useRef()
  const worldPos = useMemo(() => new THREE.Vector3(), [])
  const { selected, phase, clearSelection } = useSelection()

  const isSelected = selected?.kind === 'planet' && selected.slug === planet.slug
  // Freeze if this planet is selected OR one of its moons is selected.
  const frozen = isSelected || selected?.parentSlug === planet.slug

  // Data attached to the mesh so the raycaster can identify what was clicked.
  const selectData = {
    kind: 'planet',
    slug: planet.slug,
    parentSlug: null,
    size: planet.size,
    content: planet.content,
    color: planet.color,
    icon: planet.icon,
  }

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    if (orbitPivot.current && !frozen) {
      let speed = planet.orbitSpeed
      if (bodyGroup.current) {
        bodyGroup.current.getWorldPosition(worldPos)
        const dist = worldPos.distanceTo(state.camera.position)
        speed *= proximityFactor(dist, planet.size)
      }
      orbitPivot.current.rotation.y += d * speed
    }
    if (planetSpin.current) {
      planetSpin.current.rotation.y += d * (planet.spinSpeed ?? 0.2)
    }
  })

  return (
    <group ref={orbitPivot} rotation={[0, planet.initialAngle, 0]}>
      <group ref={bodyGroup} position={[planet.orbitRadius, 0, 0]}>
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

        {/* Idle label — hidden once this planet is focused. */}
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

        {/* Info panel — opens only after the camera has flown in and settled. */}
        {isSelected && phase === 'open' && (
          <InfoPanel
            data={selectData}
            offsetY={planet.size + 8}
            distanceFactor={14}
            onClose={clearSelection}
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
