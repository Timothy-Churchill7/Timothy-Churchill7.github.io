import { useState } from 'react'

// ---------------------------------------------------------------------------
// InfoPanel — the resume card. Rendered as a fixed DOM overlay (by App) in a
// fixed screen-space region on the right, shared by every planet, moon, and the
// sun's About Me. Content model (src/data/planets.js, src/data/about.js):
//   { title, subtitle?, body?, bullets?, sections?, links? }
// The logo shows `data.icon` if present, else a colored disc with the initial.
// ---------------------------------------------------------------------------

function paragraphs(body) {
  return Array.isArray(body) ? body : body ? [body] : []
}

// Minimal inline formatter: **bold** -> <strong>, *italic* -> <em>.
// (The panel renders plain text, so this is the only markup supported.)
function renderInline(text) {
  if (typeof text !== 'string') return text
  const nodes = []
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g
  let last = 0
  let key = 0
  let m
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[1] !== undefined) nodes.push(<strong key={key++}>{m[1]}</strong>)
    else nodes.push(<em key={key++}>{m[2]}</em>)
    last = regex.lastIndex
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

function Bullets({ items }) {
  return (
    <ul className="info-panel__bullets">
      {items.map((b, i) => (
        <li key={i}>{renderInline(b)}</li>
      ))}
    </ul>
  )
}

export default function InfoPanel({ data, onClose }) {
  const c = data.content
  const [iconOk, setIconOk] = useState(true)
  const iconUrl = data.icon ? `${import.meta.env.BASE_URL}${data.icon}` : null
  const showImage = iconUrl && iconOk

  return (
    <div className="info-panel" style={{ '--accent': data.color }}>
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
            c.title?.[0] ?? '•'
          )}
        </div>
        <div className="info-panel__heading">
          <div className="info-panel__title">{c.title}</div>
          {c.subtitle && <div className="info-panel__subtitle">{c.subtitle}</div>}
        </div>
      </div>

      {paragraphs(c.body).map((p, i) => (
        <p key={i} className="info-panel__body">
          {renderInline(p)}
        </p>
      ))}

      {c.bullets?.length > 0 && <Bullets items={c.bullets} />}

      {c.sections?.map((s, i) => (
        <div key={i} className="info-panel__section">
          {s.heading && (
            <div className="info-panel__section-heading">{s.heading}</div>
          )}
          {s.subtitle && (
            <div className="info-panel__subtitle">{s.subtitle}</div>
          )}
          {paragraphs(s.body).map((p, j) => (
            <p key={j} className="info-panel__body">
              {renderInline(p)}
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
  )
}
