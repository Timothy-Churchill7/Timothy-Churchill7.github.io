import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ABOUT_ME } from '../data/about.js'
import { padToSquareTexture } from './useIconTexture.js'
import { useSelection } from '../interaction/SelectionContext.js'

// ---------------------------------------------------------------------------
// Sun — the "home" body at the center of the system.
// ---------------------------------------------------------------------------
// A slowly rotating emissive core, a point light that illuminates the planets,
// two additive "glow" shells that fake a soft corona, and a faint translucent
// headshot blended over the core so Tim reads as a soft presence in the light
// rather than a photo stuck on a sphere.
//
// The headshot loads from /public/assets/tim_headshot.jpg. If that file isn't
// present, a warm procedural gradient is used as a fallback so nothing breaks.
// ---------------------------------------------------------------------------

export const SUN_RADIUS = 10

// Warm radial-gradient fallback texture (used until the headshot loads / if
// the file is missing). Keeps the "soft presence" look with no external asset.
function makeFallbackTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(
    size * 0.5,
    size * 0.42,
    size * 0.05,
    size * 0.5,
    size * 0.5,
    size * 0.55,
  )
  g.addColorStop(0, '#fff2cc')
  g.addColorStop(0.5, '#ffb84d')
  g.addColorStop(1, '#ff7b1a')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function Sun() {
  const coreRef = useRef()
  const fallback = useMemo(makeFallbackTexture, [])
  const [headshot, setHeadshot] = useState(fallback)
  // The headshot face overlay is hidden by default; clicking the floating
  // easter egg reveals it (see EasterEgg + SelectionManager).
  const { faceVisible } = useSelection()

  // The sun is clickable like any body: clicking it flies to it and opens the
  // "About Me" panel (see src/data/about.js). The panel itself is rendered by
  // Scene; here we just tag the sun group as selectable.

  // Try to load the real headshot; keep the fallback if it isn't there yet.
  // Square-pad it (transparent margins) so the portrait doesn't smear at the
  // sphere's poles — the glow shows through the transparent padding.
  useEffect(() => {
    const img = new Image()
    img.onload = () => setHeadshot(padToSquareTexture(img, null, 0.86))
    img.onerror = () => {
      /* file not present — keep the procedural fallback */
    }
    img.src = `${import.meta.env.BASE_URL}assets/tim_headshot.jpg`
  }, [])

  useFrame((_, delta) => {
    // Slow, graceful spin so the headshot drifts across the sun's face
    // (~50s per full rotation) rather than sitting static.
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.12
  })

  return (
    // The whole sun group is tagged selectable, so clicking any part of it
    // (core or glow) opens the About Me panel.
    <group userData={{ select: ABOUT_ME }}>
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

      {/* Rotating core + headshot overlay. */}
      <group
        ref={coreRef}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        {/* Glowing core. */}
        <mesh>
          <icosahedronGeometry args={[SUN_RADIUS, 6]} />
          <meshBasicMaterial color="#ffcf59" toneMapped={false} />
        </mesh>

        {/* Translucent headshot blended over the core (soft presence).
            Hidden until revealed via the easter egg. */}
        <mesh scale={1.008} visible={faceVisible}>
          <sphereGeometry args={[SUN_RADIUS, 48, 48]} />
          <meshBasicMaterial
            map={headshot}
            transparent
            opacity={0.38}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

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
