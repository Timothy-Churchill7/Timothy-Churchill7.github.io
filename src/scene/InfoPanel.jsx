import { Html } from '@react-three/drei'

// ---------------------------------------------------------------------------
// InfoPanel — the resume card that appears anchored next to a selected body.
// ---------------------------------------------------------------------------
// Uses drei <Html transform sprite>: the panel is a real object in 3D space
// (it scales with distance and sits *at* the planet), but `sprite` keeps it
// billboarded toward the camera so it's always readable. This is what makes it
// feel "attached to the planet" rather than a flat 2D overlay.
//
// Content comes from the planet/moon `content` object in src/data/planets.js:
//   { title, subtitle, body, bullets? }
// The logo is a placeholder colored disc with the initial — drop a real image
// into /public/assets/planets/<slug>-icon.svg later and swap the <div> here.
// ---------------------------------------------------------------------------

export default function InfoPanel({ data, offsetY, distanceFactor = 12, onClose }) {
  const c = data.content

  return (
    <Html
      transform
      sprite
      distanceFactor={distanceFactor}
      position={[0, offsetY, 0]}
      zIndexRange={[100, 0]}
      occlude={false}
      wrapperClass="info-panel-wrapper"
    >
      {/* stopPropagation so clicks inside the card don't bubble anywhere. */}
      <div
        className="info-panel"
        style={{ '--accent': data.color }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="info-panel__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="info-panel__head">
          <div className="info-panel__logo" style={{ background: data.color }}>
            {c.title?.[0] ?? '•'}
          </div>
          <div className="info-panel__heading">
            <div className="info-panel__title">{c.title}</div>
            {c.subtitle && (
              <div className="info-panel__subtitle">{c.subtitle}</div>
            )}
          </div>
        </div>

        {c.body && <p className="info-panel__body">{c.body}</p>}

        {c.bullets?.length > 0 && (
          <ul className="info-panel__bullets">
            {c.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </Html>
  )
}
