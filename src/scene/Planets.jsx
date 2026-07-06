import { PLANETS } from '../data/planets.js'
import Planet from './Planet.jsx'
import OrbitRing from './OrbitRing.jsx'

// ---------------------------------------------------------------------------
// Planets — lays out every planet + its orbit ring from the data file.
// ---------------------------------------------------------------------------

export default function Planets() {
  return (
    <group>
      {PLANETS.map((planet) => (
        <group key={planet.slug}>
          <OrbitRing radius={planet.orbitRadius} color={planet.color} opacity={0.16} />
          <Planet planet={planet} />
        </group>
      ))}
    </group>
  )
}
