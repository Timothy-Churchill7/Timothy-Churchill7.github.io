import { Billboard } from '@react-three/drei'

// ---------------------------------------------------------------------------
// BodyBadge — the body's logo/photo shown as a camera-facing disc on its face.
// ---------------------------------------------------------------------------
// Wrapping a logo (which usually has a flat background) around a sphere looks
// like a plain light ball, and the bright sun blows out the lit side. Instead
// we float a flat circular "badge" of the image on the near face, always turned
// toward the camera. It uses an UNLIT material so the image reads at its true
// brightness (no overexposure), with the colored body showing as a rim.
// ---------------------------------------------------------------------------

export default function BodyBadge({ texture, size }) {
  if (!texture) return null
  return (
    <Billboard>
      {/* Pushed just in front of the sphere's near surface so it isn't clipped. */}
      <mesh position={[0, 0, size * 1.02]}>
        <circleGeometry args={[size * 0.94, 48]} />
        <meshBasicMaterial map={texture} transparent toneMapped />
      </mesh>
    </Billboard>
  )
}
