import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// ShootingStars — a single faint streak that crosses the far sky every
// 10–20 seconds (randomized). Deliberately subtle: a short, additive,
// low-opacity trail read as gentle ambient motion, not a flashy effect.
// ---------------------------------------------------------------------------

export default function ShootingStars() {
  const matRef = useRef()
  const positions = useMemo(() => new Float32Array(6), []) // two points (tail, head)
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])
  const head = useMemo(() => new THREE.Vector3(), [])
  const tail = useMemo(() => new THREE.Vector3(), [])

  const s = useRef({
    active: false,
    t: 0,
    duration: 1,
    wait: 4 + Math.random() * 8, // first streak within a few seconds
    from: new THREE.Vector3(),
    to: new THREE.Vector3(),
  })

  function spawn() {
    const st = s.current
    // A point on a far shell (behind the planets, inside the star field).
    const R = 380 + Math.random() * 180
    const theta = Math.random() * Math.PI * 2
    const phi = (0.15 + Math.random() * 0.7) * Math.PI // avoid the exact poles
    st.from.set(
      R * Math.sin(phi) * Math.cos(theta),
      R * Math.cos(phi),
      R * Math.sin(phi) * Math.sin(theta),
    )
    const dir = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5,
    ).normalize()
    st.to.copy(st.from).addScaledVector(dir, 120 + Math.random() * 90)
    st.t = 0
    st.duration = 0.8 + Math.random() * 0.5
    st.active = true
  }

  useFrame((_, delta) => {
    const st = s.current
    const dt = Math.min(delta, 0.05)

    if (!st.active) {
      st.wait -= dt
      if (matRef.current) matRef.current.opacity = 0
      if (st.wait <= 0) spawn()
      return
    }

    st.t += dt / st.duration
    if (st.t >= 1) {
      st.active = false
      st.wait = 10 + Math.random() * 10 // next streak in 10–20s
      if (matRef.current) matRef.current.opacity = 0
      return
    }

    head.lerpVectors(st.from, st.to, st.t)
    tail.lerpVectors(st.from, st.to, Math.max(0, st.t - 0.18))
    positions.set([tail.x, tail.y, tail.z, head.x, head.y, head.z])
    geom.attributes.position.needsUpdate = true
    if (matRef.current) matRef.current.opacity = Math.sin(st.t * Math.PI) * 0.5
  })

  return (
    <line geometry={geom} frustumCulled={false}>
      <lineBasicMaterial
        ref={matRef}
        transparent
        opacity={0}
        color="#dfe6ff"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </line>
  )
}
