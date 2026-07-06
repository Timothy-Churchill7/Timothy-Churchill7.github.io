import { useState } from 'react'
import { Html } from '@react-three/drei'

// ---------------------------------------------------------------------------
// InfoPanel — the card that appears anchored next to a selected body.
// ---------------------------------------------------------------------------
// Uses drei <Html transform sprite>: a real object in 3D that scales with
// distance but billboards toward the camera, so it feels attached to the body.
//
// Content model (src/data/planets.js and src/data/about.js):
//   { title, subtitle?, body?, bullets?, sections?, links? }
//     body     : string | string[]            (flowing paragraph(s))
//     bullets  : string[]                      (bullet list)
//     sections : { heading, body?, bullets? }[] (sub-sections, e.g. About Me)
//     links    : { label, url }[]              (outbound link chips)
//
// The logo shows `data.icon` (an image under /public/assets/...) if provided,
// falling back to a colored disc with the title's initial if the file is
// missing or fails to load.
// ---------------------------------------------------------------------------

function paragraphs(body) {
  return Array.isArray(body) ? body : body ? [body] : []
}

function Bullets({ items }) {
  return (
    <ul className="info-panel__bullets">
      {items.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  )
}

export default function InfoPanel({ data, offsetY, distanceFactor = 12, onClose }) {
  const c = data.content
  const [iconOk, setIconOk] = useState(true)
  const iconUrl = data.icon ? `${import.meta.env.BASE_URL}${data.icon}` : null
  const showImage = iconUrl && iconOk

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
        <button className="info-panel__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="info-panel__head">
          <div
            className="info-panel__logo"
            style={{ background: showImage ? '#fff' : data.color }}
          >
            {showImage ? (
              <img src={iconUrl} alt="" onError={() => setIconOk(false)} />
            ) : (
              (c.title?.[0] ?? '•')
            )}
          </div>
          <div className="info-panel__heading">
            <div className="info-panel__title">{c.title}</div>
            {c.subtitle && <div className="info-panel__subtitle">{c.subtitle}</div>}
          </div>
        </div>

        {paragraphs(c.body).map((p, i) => (
          <p key={i} className="info-panel__body">
            {p}
          </p>
        ))}

        {c.bullets?.length > 0 && <Bullets items={c.bullets} />}

        {c.sections?.map((s, i) => (
          <div key={i} className="info-panel__section">
            {s.heading && (
              <div className="info-panel__section-heading">{s.heading}</div>
            )}
            {paragraphs(s.body).map((p, j) => (
              <p key={j} className="info-panel__body">
                {p}
              </p>
            ))}
            {s.bullets?.length > 0 && <Bullets items={s.bullets} />}
          </div>
        ))}

        {c.links?.length > 0 && (
          <div className="info-panel__links">
            {c.links.map((l, i) => (
              <a
                key={i}
                className="info-panel__link"
                href={l.url}
                target="_blank"
                rel="noreferrer"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </Html>
  )
}
