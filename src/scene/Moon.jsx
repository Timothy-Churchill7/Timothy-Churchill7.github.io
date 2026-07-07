import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSelection } from '../interaction/SelectionContext.js'
import { useIconTexture } from './useIconTexture.js'
import { bodyVariation } from './bodyVariation.js'
import { proximityFactor } from '../config/camera.js'

// ---------------------------------------------------------------------------
// Moon — a sub-item that orbits its parent planet.
// ---------------------------------------------------------------------------
// Orbit radius/speed/angle come from the parent (moonOrbits.js); inclination,
// direction, axial tilt and spin come from bodyVariation() so each moon varies.
// When selected, the moon and its parent planet both freeze; otherwise the moon
// eases toward stationary as the camera approaches. The panel is drawn by Scene.
// ---------------------------------------------------------------------------

export default function Moon({ moon, parentSlug, orbit }) {
  const pivot = useRef()
  const bodyGroup = useRef()
  const spin = useRef()
  const worldPos = useMemo(() => new THREE.Vector3(), [])
  const { selected } = useSelection()
  const texture = useIconTexture(moon.icon, moon.slug)
  const v = useMemo(() => bodyVariation(moon.slug), [moon.slug])

  const radius = orbit?.radius ?? moon.orbitRadius
  const baseSpeed = orbit?.speed ?? moon.orbitSpeed
  const angle = orbit?.angle ?? moon.initialAngle

  const isSelected = selected?.kind === 'moon' && selected.slug === moon.slug

  const selectData = {
    kind: 'moon',
    slug: moon.slug,
    parentSlug,
    size: moon.size,
    content: moon.content,
    color: moon.color,
    icon: moon.icon,
  }

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    if (!isSelected && pivot.current) {
      let s = baseSpeed * v.direction
      if (bodyGroup.current) {
        bodyGroup.current.getWorldPosition(worldPos)
        s *= proximityFactor(worldPos.distanceTo(state.camera.position), moon.size)
      }
      pivot.current.rotation.y += d * s
      if (spin.current) spin.current.rotation.y += d * v.spin
    }
  })

  return (
    <group rotation={v.inclination}>
      <group ref={pivot} rotation={[0, angle, 0]}>
        <group ref={bodyGroup} position={[radius, 0, 0]}>
          <group rotation={v.axialTilt}>
            <group
              ref={spin}
              userData={{ select: selectData }}
              onPointerOver={() => (document.body.style.cursor = 'pointer')}
              onPointerOut={() => (document.body.style.cursor = 'default')}
            >
              <mesh>
                <icosahedronGeometry args={[moon.size, 1]} />
                <meshStandardMaterial
                  color={moon.color}
                  emissive={moon.color}
                  emissiveIntensity={isSelected ? 0.4 : 0.08}
                  flatShading
                  roughness={0.75}
                  metalness={0.1}
                />
              </mesh>
              {texture && (
                <mesh scale={1.01}>
                  <sphereGeometry args={[moon.size, 32, 32]} />
                  <meshBasicMaterial
                    map={texture}
                    transparent
                    opacity={0.94}
                    depthWrite={false}
                    toneMapped
                  />
                </mesh>
              )}
            </group>
          </group>

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
        </group>
      </group>
    </group>
  )
}
