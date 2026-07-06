import { useMemo } from 'react'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Background — a stellar purple/violet gradient dome around the whole scene.
// ---------------------------------------------------------------------------
// A large inside-out sphere with a simple vertical-gradient shader. It renders
// first and never writes depth, so it always sits behind everything (planets,
// stars, glow). `fog: false` keeps it a clean gradient. Doing this in-scene
// (rather than a CSS background) means it's captured by the post-processing
// pass, so bloom/vignette composite correctly over it.
// ---------------------------------------------------------------------------

export default function Background() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
        fog: false,
        uniforms: {
          // Lighter, "twilight sky" purple — roughly halfway between a dusk
          // sky and deep space.
          top: { value: new THREE.Color('#a488d8') }, // soft lavender
          middle: { value: new THREE.Color('#7a63b8') }, // mid violet
          bottom: { value: new THREE.Color('#4e3f86') }, // deeper violet
        },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vDir;
          uniform vec3 top;
          uniform vec3 middle;
          uniform vec3 bottom;
          void main() {
            float h = vDir.y * 0.5 + 0.5; // 0 at bottom, 1 at top
            vec3 col = mix(bottom, middle, smoothstep(0.0, 0.5, h));
            col = mix(col, top, smoothstep(0.5, 1.0, h));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )

  return (
    <mesh scale={900} renderOrder={-1000} material={material} frustumCulled={false}>
      <sphereGeometry args={[1, 32, 32]} />
    </mesh>
  )
}
