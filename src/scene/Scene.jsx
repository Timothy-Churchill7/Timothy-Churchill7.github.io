import { useCallback, useEffect, useState } from 'react'
import Sun from './Sun.jsx'
import Background from './Background.jsx'
import Starfield from './Starfield.jsx'
import ShootingStars from './ShootingStars.jsx'
import EasterEgg from './EasterEgg.jsx'
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
// Owns the selection + focus state and shares it with the 3D tree via context.
// Selecting a body flies the camera to it (phase 'approaching'), then opens the
// panel (phase 'open'). The panel itself is a fixed DOM overlay rendered by App,
// so Scene just reports the active panel data (onActivePanel) and hands App a
// close handler (registerClose). Also owns `faceVisible` — the sun's headshot
// overlay, restored by clicking the floating easter egg.
// ---------------------------------------------------------------------------

export default function Scene({
  onLockChange,
  onSelectChange,
  onActivePanel,
  registerClose,
}) {
  const [selected, setSelected] = useState(null)
  const [phase, setPhase] = useState('idle') // 'idle' | 'approaching' | 'open'
  const [focus, setFocus] = useState(null)
  const [faceVisible, setFaceVisible] = useState(false)

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

  const revealFace = useCallback(() => setFaceVisible(true), [])

  // Show the DOM panel only once the fly-to has settled.
  useEffect(() => {
    onActivePanel?.(phase === 'open' ? selected : null)
  }, [phase, selected, onActivePanel])

  // Let App's panel close button reach clearSelection.
  useEffect(() => {
    registerClose?.(clearSelection)
  }, [registerClose, clearSelection])

  return (
    <SelectionContext.Provider
      value={{
        selected,
        phase,
        focus,
        focusOnBody,
        markArrived,
        clearSelection,
        faceVisible,
        revealFace,
      }}
    >
      <fog attach="fog" args={['#160f30', 380, 1500]} />

      <Background />
      <Starfield />
      <ShootingStars />
      <Sun />
      <EasterEgg />
      <Planets />

      <SelectionManager />
      <CameraController />
      <SpaceshipControls onLockChange={onLockChange} />

      <Effects />
    </SelectionContext.Provider>
  )
}
