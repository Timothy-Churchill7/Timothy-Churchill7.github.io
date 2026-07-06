import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Sun — the "home" body at the center of the system.
// ---------------------------------------------------------------------------
// A slowly rotating emissive core, a point light that illuminates the planets,
// and two additive "glow" shells that fake a soft corona. Bloom/postprocessing
// comes in the polish phase; this reads well on its own for now.
// ---------------------------------------------------------------------------

export const SUN_RADIUS = 10

export default function Sun() {
  const coreRef = useRef()

  useFrame((_, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.05
  })

  return (
    <group>
      {/* Light source for the whole system. */}
      <pointLight
        position={[0, 0, 0]}
        intensity={4}
        distance={0}
        decay={0}
        color="#fff2cc"
      />
      {/* A little ambient so the dark side of planets isn't pure black. */}
      <ambientLight intensity={0.12} />

      {/* Glowing core. */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[SUN_RADIUS, 6]} />
        <meshBasicMaterial color="#ffcf59" toneMapped={false} />
      </mesh>

      {/* Inner glow shell. */}
      <mesh scale={1.25}>
        <sphereGeometry args={[SUN_RADIUS, 32, 32]} />
        <meshBasicMaterial
          color="#ff9d2f"
          transparent
          opacity={0.28}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Outer, softer glow halo. */}
      <mesh scale={1.7}>
        <sphereGeometry args={[SUN_RADIUS, 32, 32]} />
        <meshBasicMaterial
          color="#ff7b1a"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
