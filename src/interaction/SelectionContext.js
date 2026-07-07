import { createContext, useContext } from 'react'

// ---------------------------------------------------------------------------
// Selection state shared across the 3D scene.
// ---------------------------------------------------------------------------
// `selected` is either null or an object describing the picked body:
//   { kind: 'planet' | 'moon', slug, parentSlug, content, color }
// Provided inside the <Canvas> (in Scene) so every 3D child can read it.
// ---------------------------------------------------------------------------

export const SelectionContext = createContext({
  selected: null,
  phase: 'idle',
  focus: null,
  focusOnBody: () => {},
  markArrived: () => {},
  clearSelection: () => {},
  faceVisible: false, // sun's headshot overlay (toggled via the easter egg)
  toggleFace: () => {},
})

export const useSelection = () => useContext(SelectionContext)
