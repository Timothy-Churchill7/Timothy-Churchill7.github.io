import { useMemo } from 'react'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// OrbitRing — a faint flat ring on the ecliptic marking a planet's orbit.
// ---------------------------------------------------------------------------

export default function OrbitRing({ radius, color = '#9db4e8', opacity = 0.14 }) {
  // A thin annulus lying flat in the XZ plane.
  const geometry = useMemo(() => {
    const g = new THREE.RingGeometry(radius - 0.18, radius + 0.18, 160)
    g.rotateX(-Math.PI / 2)
    return g
  }, [radius])

  return (
    <mesh geometry={geometry} renderOrder={-1}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
