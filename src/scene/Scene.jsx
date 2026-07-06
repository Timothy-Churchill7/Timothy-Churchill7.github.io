import { useState } from 'react'
import Sun from './Sun.jsx'
import Starfield from './Starfield.jsx'
import Planets from './Planets.jsx'
import Effects from './Effects.jsx'
import SpaceshipControls from '../controls/SpaceshipControls.jsx'
import { SelectionContext } from '../interaction/SelectionContext.js'
import SelectionManager from '../interaction/SelectionManager.jsx'

// ---------------------------------------------------------------------------
// Scene — everything that lives *inside* the R3F <Canvas>.
// ---------------------------------------------------------------------------
// Owns the selection state (which planet/moon has its panel open) and shares it
// with the whole 3D tree via context. Only one body can be selected at a time.
// `onSelectChange` lets the outer HUD react (e.g. hide the flight crosshair).
// ---------------------------------------------------------------------------

export default function Scene({ onLockChange, onSelectChange }) {
  const [selected, setSelectedState] = useState(null)

  const setSelected = (value) => {
    setSelectedState(value)
    onSelectChange?.(value)
  }

  return (
    <SelectionContext.Provider value={{ selected, setSelected }}>
      <color attach="background" args={['#04060f']} />
      <fog attach="fog" args={['#04060f', 600, 1600]} />

      <Starfield />
      <Sun />
      <Planets />

      <SelectionManager />
      <SpaceshipControls onLockChange={onLockChange} />

      <Effects />
    </SelectionContext.Provider>
  )
}
