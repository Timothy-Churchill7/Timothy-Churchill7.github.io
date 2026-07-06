import { Stars } from '@react-three/drei'

// ---------------------------------------------------------------------------
// Starfield — deep-space backdrop.
// ---------------------------------------------------------------------------
// drei's <Stars> gives us a large point-cloud sphere surrounding the scene.
// Tuned brighter/denser than the default so stars read clearly against the
// black of space — the larger `factor` (star size) also gives the bloom pass
// more to catch, which reads as brighter, sharper stars.
// ---------------------------------------------------------------------------

export default function Starfield() {
  return (
    <Stars
      radius={700} // how far out the star shell sits
      depth={110} // thickness of the star shell
      count={9000} // number of stars
      factor={7} // star size factor (bigger = brighter/blooms more)
      saturation={0}
      fade
      speed={0.4} // very slow twinkle/drift
    />
  )
}
