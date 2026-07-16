# Tim Churchill — Interactive Solar System Résumé

My personal website — an interactive solar system you can fly through that
doubles as my résumé. The sun sits at the center, and each planet orbiting it is
a part of my background (education, work, leadership & service, research,
athletics, skills, and finance), with moons for the specific chapters inside each
one. You pilot a free-roaming camera through the system and click any world to
open a panel with the story behind it.

**Live site:** https://timothy-churchill7.github.io

## Experiencing it

The whole thing runs live in the browser as a real-time 3D scene — no video, no
backend, just a static site rendering on your machine.

- **Click** anywhere to take the controls and start flying.
- **WASD** to move, **Space / Shift** to rise and fall, **E** to boost, **mouse** to look.
- Line a planet or moon up in the crosshair and **click** to fly to it and read its panel.
- Click the **×** or empty space to close a panel; **Esc** frees the mouse.

Fly slowly and look closely — a couple of things only show themselves to people
who take their time.

## How it's built

- **React Three Fiber** + **drei** — the 3D scene, camera, and helpers as React components.
- **Three.js** — the WebGL engine underneath.
- **@react-three/postprocessing** — the bloom and vignette that give space its glow.
- **Vite** — bundles it to static HTML, CSS, and JavaScript, deployed to GitHub Pages.

The scene is entirely data-driven: every planet, moon, color, orbit, and line of
résumé text lives in `src/data/planets.js`, and the 3D world builds itself from
that file. Flight feel (speed, inertia, boundaries) is isolated in
`src/config/camera.js`.

```
src/
  App.jsx            the canvas, HUD, and info-panel overlay
  data/planets.js    all résumé content and layout — the single source of truth
  config/camera.js   flight feel (speed, inertia, boundaries)
  controls/          the free-flight, pointer-locked spaceship camera
  interaction/       click-to-select and selection state
  scene/             the sun, starfield, planets, moons, panels, and effects
```

## Running it locally

```bash
npm install
npm run dev      # local dev server with hot reload
npm run build    # produces the static site in dist/
```

## Acknowledgements

Built with the help of **Claude** (Anthropic's Claude Code), which assisted with
the 3D scene, the flight controls and interactions, the styling, and this
documentation — working from my own direction, design choices, and résumé content.
