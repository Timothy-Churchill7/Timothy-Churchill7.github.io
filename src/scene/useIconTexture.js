import { useEffect, useState } from 'react'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// useIconTexture — optionally load a body's image as a surface texture.
// ---------------------------------------------------------------------------
// Returns the loaded THREE.Texture, or null if `icon` is undefined or the file
// fails to load (in which case the caller falls back to a flat color). Loading
// is manual (not drei's useTexture) so a missing file degrades gracefully
// instead of throwing a Suspense error.
// ---------------------------------------------------------------------------

export function useIconTexture(icon) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (!icon) {
      setTexture(null)
      return
    }
    let alive = true
    const url = `${import.meta.env.BASE_URL}${icon}`
    new THREE.TextureLoader().load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        if (alive) setTexture(tex)
        else tex.dispose()
      },
      undefined,
      () => {
        /* missing/failed — leave null so the caller uses its color */
      },
    )
    return () => {
      alive = false
    }
  }, [icon])

  return texture
}
