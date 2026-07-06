import { useCallback, useState } from 'react'
import Sun from './Sun.jsx'
import Background from './Background.jsx'
import Starfield from './Starfield.jsx'
import Planets from './Planets.jsx'
import Effects from './Effects.jsx'
import SpaceshipControls from '../controls/SpaceshipControls.jsx'
import CameraController from '../controls/CameraController.jsx'
import { SelectionContext } from '../interaction/SelectionContext.js'
import SelectionManager from '../interaction/SelectionManager.jsx'
import { computeVantage } from '../config/camera.js'

// ---------------------------------------------------------------------------
// Scene — everything that lives *inside* the R3F <Canvas>.
// ---------------------------------------------------------------------------
// Owns the selection + focus state and shares it with the whole 3D tree via
// context. Selecting a body is a two-stage flow:
//   1. focusOnBody(): freeze the body, ease the camera to a 45° vantage
//      (phase = 'approaching'). CameraController drives the camera.
//   2. markArrived(): once settled, open the info panel (phase = 'open').
// clearSelection() returns control to free flight from wherever the camera is.
// Only one body can be selected at a time.
// ---------------------------------------------------------------------------

export default function Scene({ onLockChange, onSelectChange }) {
  const [selected, setSelected] = useState(null)
  const [phase, setPhase] = useState('idle') // 'idle' | 'approaching' | 'open'
  const [focus, setFocus] = useState(null) // { position:[x,y,z], lookAt:[x,y,z] }

  // Kick off a fly-to for a clicked body.
  const focusOnBody = useCallback(
    (data, objPos, camPos) => {
      const vantage = computeVantage(objPos, camPos, data.size ?? 4)
      setSelected(data)
      setFocus(vantage)
      setPhase('approaching')
      onSelectChange?.(data)
    },
    [onSelectChange],
  )

  const markArrived = useCallback(() => setPhase('open'), [])

  const clearSelection = useCallback(() => {
    setSelected(null)
    setFocus(null)
    setPhase('idle')
    onSelectChange?.(null)
  }, [onSelectChange])

  return (
    <SelectionContext.Provider
      value={{ selected, phase, focus, focusOnBody, markArrived, clearSelection }}
    >
      {/* Purple gradient dome instead of a flat black background. Fog tinted
          to match so distant bodies fade into the violet rather than to black. */}
      <fog attach="fog" args={['#1a1038', 350, 1500]} />

      <Background />
      <Starfield />
      <Sun />
      <Planets />

      <SelectionManager />
      <CameraController />
      <SpaceshipControls onLockChange={onLockChange} />

      <Effects />
    </SelectionContext.Provider>
  )
}
