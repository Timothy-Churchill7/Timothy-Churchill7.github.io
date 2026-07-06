import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import Moon from './Moon.jsx'
import { useSelection } from '../interaction/SelectionContext.js'
import { useIconTexture } from './useIconTexture.js'
import { generateMoonOrbits } from './moonOrbits.js'
import { proximityFactor } from '../config/camera.js'

// ---------------------------------------------------------------------------
// Planet — one resume category orbiting the sun, with optional moons.
// ---------------------------------------------------------------------------
// If the planet has an `icon`, the image is mapped onto the body (smooth
// sphere); otherwise it's a flat-shaded low-poly sphere in its accent color.
// Moons get varied, seeded-random orbit radii/speeds (see moonOrbits.js).
//
// The orbit FREEZES while this planet (or one of its moons) is selected so the
// panel doesn't drift; otherwise it eases down as the camera approaches
// (proximityFactor) so a moving target stays clickable. The info panel itself
// is rendered by Scene, anchored to the right of the body.
// ---------------------------------------------------------------------------

export default function Planet({ planet }) {
  const orbitPivot = useRef()
  const bodyGroup = useRef()
  const planetSpin = useRef()
  const worldPos = useMemo(() => new THREE.Vector3(), [])
  const { selected } = useSelection()
  const texture = useIconTexture(planet.icon)
  const moonOrbits = useMemo(() => generateMoonOrbits(planet), [planet])

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
        {/* Spinning, clickable body: an accent-colored core with the planet's
            image mapped over it (like the sun's headshot) when it has one. */}
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
          {texture && (
            <mesh scale={1.01}>
              <sphereGeometry args={[planet.size, 48, 48]} />
              <meshBasicMaterial
                map={texture}
                transparent
                opacity={0.9}
                depthWrite={false}
                toneMapped
              />
            </mesh>
          )}
        </group>

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
  )
}
