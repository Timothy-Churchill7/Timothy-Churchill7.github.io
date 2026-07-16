import { useEffect, useState } from 'react'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// useIconTexture — load a body's image as a sphere-ready surface texture.
// ---------------------------------------------------------------------------
// Before use, every image is drawn onto a SQUARE canvas (contain-fit, centered)
// so equirectangular sphere mapping doesn't stretch/smear non-square art. The
// padding around the image is either transparent (so the planet's accent color
// shows through) or a solid background for the handful of dark/flat/transparent
// logos that don't read well on their own (item 6).
//
// Returns the THREE.Texture, or null if `icon` is missing / fails to load
// (caller falls back to the flat accent color).
// ---------------------------------------------------------------------------

const CANVAS_SIZE = 512

// A shared light lavender-gray backdrop for logos whose source art is dark,
// flat, or transparent and would otherwise disappear on the sphere/panel.
const LOGO_BG = '#e8e5f0'
const ICON_BG = {
  'technical-skills': LOGO_BG,
  '23-cubed': LOGO_BG,
  'goldminers-daughter': LOGO_BG,
  certifications: LOGO_BG,
}

// Draw `image` centered on a square canvas (contain-fit at `inset`), filling the
// padding with `bg` (or leaving it transparent), and return a CanvasTexture.
export function padToSquareTexture(image, bg, inset = 0.85) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = CANVAS_SIZE
  const ctx = canvas.getContext('2d')
  if (bg) {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  }
  const max = CANVAS_SIZE * inset
  const scale = Math.min(max / image.width, max / image.height)
  const w = image.width * scale
  const h = image.height * scale
  ctx.drawImage(image, (CANVAS_SIZE - w) / 2, (CANVAS_SIZE - h) / 2, w, h)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export function useIconTexture(icon, slug) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (!icon) {
      setTexture(null)
      return
    }
    let alive = true
    const bg = ICON_BG[slug] ?? null
    const inset = bg ? 0.76 : 0.82
    const img = new Image()
    img.onload = () => {
      if (alive) setTexture(padToSquareTexture(img, bg, inset))
    }
    img.onerror = () => {
      /* missing/failed — leave null so the caller uses its accent color */
    }
    img.src = `${import.meta.env.BASE_URL}${icon}`

    return () => {
      alive = false
    }
  }, [icon, slug])

  return texture
}
