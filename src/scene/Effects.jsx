import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

// ---------------------------------------------------------------------------
// Effects — screen-space post-processing.
// ---------------------------------------------------------------------------
// Bloom makes the sun and the emissive planet glows bleed light realistically,
// and gives selected (brightened) bodies a subtle halo. A gentle vignette
// darkens the corners so the eye is drawn to the center of the action.
//
// `mipmapBlur` keeps the bloom cheap and smooth; the low luminanceThreshold
// lets the warm sun catch even though its color sits near 1.0.
// ---------------------------------------------------------------------------

export default function Effects() {
  return (
    <EffectComposer disableNormalPass>
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.7}
      />
      <Vignette eskil={false} offset={0.25} darkness={0.5} />
    </EffectComposer>
  )
}
