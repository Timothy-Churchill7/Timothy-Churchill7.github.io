import { PLANETS } from '../data/planets.js'
import Planet from './Planet.jsx'

// ---------------------------------------------------------------------------
// Planets — lays out every planet from the data file. Each Planet draws its own
// orbit ring inside its (inclined) orbital plane.
// ---------------------------------------------------------------------------

export default function Planets() {
  return (
    <group>
      {PLANETS.map((planet) => (
        <Planet key={planet.slug} planet={planet} />
      ))}
    </group>
  )
}
