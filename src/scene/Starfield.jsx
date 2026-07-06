import { Stars } from '@react-three/drei'

// ---------------------------------------------------------------------------
// Starfield — deep-space backdrop.
// ---------------------------------------------------------------------------
// drei's <Stars> gives us a large, cheap point-cloud sphere that surrounds the
// whole scene. `saturation`/`fade` keep it subtle so it reads as background.
// ---------------------------------------------------------------------------

export default function Starfield() {
  return (
    <Stars
      radius={1200} // how far out the star shell sits
      depth={120} // thickness of the star shell
      count={7000} // number of stars
      factor={5} // star size factor
      saturation={0}
      fade
      speed={0.4} // very slow twinkle/drift
    />
  )
}
