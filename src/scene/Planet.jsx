import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import Moon from './Moon.jsx'
import OrbitRing from './OrbitRing.jsx'
import { useSelection } from '../interaction/SelectionContext.js'
import { generateMoonOrbits } from './moonOrbits.js'
import { bodyVariation } from './bodyVariation.js'
import { proximityFactor } from '../config/camera.js'

// ---------------------------------------------------------------------------
// Planet — one resume category orbiting the sun, with optional moons.
// ---------------------------------------------------------------------------
// Nesting (outer -> inner):
//   <inclination>        orbit plane tilted a few degrees (+ its orbit ring)
//     <orbitPivot>       revolves around the sun (direction/speed varied)
//       <bodyGroup>      the body's position on its orbit
//         <axialTilt>    the body's spin-axis tilt
//           <spin>       slow self-rotation; accent core + image overlay
//         <label> <Moon> label + moons (not tilted/spun with the body)
//
// The orbit FREEZES while this planet (or one of its moons) is selected so the
// panel doesn't drift; otherwise it eases down as the camera approaches
// (proximityFactor). The info panel is rendered by Scene, to the body's right.
// ---------------------------------------------------------------------------

export default function Planet({ planet }) {
  const orbitPivot = useRef()
  const bodyGroup = useRef()
  const planetSpin = useRef()
  const worldPos = useMemo(() => new THREE.Vector3(), [])
  const { selected } = useSelection()
  const moonOrbits = useMemo(() => generateMoonOrbits(planet), [planet])
  const v = useMemo(() => bodyVariation(planet.slug), [planet.slug])

  const isSelected = selected?.kind === 'planet' && selected.slug === planet.slug
  // Freeze if this planet is selected OR one of its moons is selected.
  const frozen = isSelected || selected?.parentSlug === planet.slug

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
    if (!frozen && orbitPivot.current) {
      let speed = planet.orbitSpeed * v.speedMul * v.direction
      if (bodyGroup.current) {
        bodyGroup.current.getWorldPosition(worldPos)
        const dist = worldPos.distanceTo(state.camera.position)
        speed *= proximityFactor(dist, planet.size)
      }
      orbitPivot.current.rotation.y += d * speed
      if (planetSpin.current) planetSpin.current.rotation.y += d * v.spin
    }
  })

  return (
    <group rotation={v.inclination}>
      {/* Orbit ring lives in the (inclined) orbital plane. Light grey. */}
      <OrbitRing radius={planet.orbitRadius} color="#c9cdd8" opacity={0.096} />

      <group ref={orbitPivot} rotation={[0, planet.initialAngle, 0]}>
        <group ref={bodyGroup} position={[planet.orbitRadius, 0, 0]}>
          {/* Axial tilt, then slow self-rotation. Solid-colored sphere. */}
          <group rotation={v.axialTilt}>
            <group
              ref={planetSpin}
              userData={{ select: selectData }}
              onPointerOver={() => (document.body.style.cursor = 'pointer')}
              onPointerOut={() => (document.body.style.cursor = 'default')}
            >
              <mesh>
                <icosahedronGeometry args={[planet.size, 2]} />
                <meshStandardMaterial
                  color={planet.color}
                  emissive={planet.color}
                  emissiveIntensity={isSelected ? 0.35 : 0.06}
                  flatShading
                  roughness={0.65}
                  metalness={0.15}
                />
              </mesh>
            </group>
          </group>

          {/* Idle label — hidden once this planet is focused. */}
          {!isSelected && (
            <Html
              position={[0, planet.size + 1.5, 0]}
              center
              distanceFactor={140}
              zIndexRange={[20, 0]}
              wrapperClass="planet-label-wrapper"
            >
              <div className="planet-label">{planet.name}</div>
            </Html>
          )}

          {/* Moons orbit within the planet's local frame. */}
          {planet.moons?.map((moon, i) => (
            <Moon
              key={moon.slug}
              moon={moon}
              parentSlug={planet.slug}
              orbit={moonOrbits[i]}
            />
          ))}
        </group>
      </group>
    </group>
  )
}
