import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './scene/Scene.jsx'
import { INITIAL_CAMERA } from './config/camera.js'

// ---------------------------------------------------------------------------
// App — hosts the R3F canvas and the flat 2D HUD overlay.
// ---------------------------------------------------------------------------
// HUD state:
//   locked   — pointer lock engaged (currently flying) -> show crosshair
//   selected — a planet/moon panel is open -> adjust the hint
// The HUD is pointer-events:none so it never steals clicks from the canvas.
// ---------------------------------------------------------------------------

export default function App() {
  const [locked, setLocked] = useState(false)
  const [selected, setSelected] = useState(null)
  const [ready, setReady] = useState(false)

  return (
    <>
      <Canvas
        camera={{
          position: INITIAL_CAMERA.position,
          fov: INITIAL_CAMERA.fov,
          near: INITIAL_CAMERA.near,
          far: INITIAL_CAMERA.far,
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={() => setReady(true)}
      >
        <Scene onLockChange={setLocked} onSelectChange={setSelected} />
      </Canvas>

      {/* ---- Loading screen (fades out once WebGL is ready) ---- */}
      <div className={`loader ${ready ? 'loader--hidden' : ''}`}>
        <div className="loader__sun" />
        <div className="loader__name">TIM CHURCHILL</div>
        <div className="loader__sub">entering orbit…</div>
      </div>

      {/* ---- HUD overlay ---- */}
      <div className="hud">
        <div className="hud__badge">Tim Churchill · Solar System</div>

        {/* Flight crosshair — only while piloting. */}
        {locked && <div className="hud__reticle" />}

        <div className={`hud__hint ${locked && !selected ? 'hud__hint--dim' : ''}`}>
          {selected ? (
            <>
              Reading <strong>{selected.content?.title}</strong> · click the
              &nbsp;<kbd>×</kbd>&nbsp; or click empty space to close
            </>
          ) : locked ? (
            <>
              Center a planet in the crosshair and <kbd>click</kbd> to inspect
              &nbsp;·&nbsp; <kbd>Esc</kbd> to release the mouse
            </>
          ) : (
            <>
              <div style={{ marginBottom: 6, fontWeight: 600 }}>
                Click to start flying
              </div>
              <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> move&nbsp;·&nbsp;
              <kbd>Space</kbd>/<kbd>Shift</kbd> up·down&nbsp;·&nbsp;
              <kbd>E</kbd> boost&nbsp;·&nbsp; mouse to look
            </>
          )}
        </div>
      </div>
    </>
  )
}
