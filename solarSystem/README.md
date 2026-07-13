# Tim Churchill — Interactive Solar System Résumé

This is my résumé, rebuilt as a solar system you can fly through.

Instead of a page of bullet points, my background is laid out as a small galaxy.
The sun sits at the center, and each planet orbiting it is a part of who I am —
education, work, leadership and service, research, athletics, skills, and finance.
The larger planets have moons, and each moon is a specific chapter within that
category: a job, a trip, a role. You pilot a free-flying camera through the
system, pull up to whatever catches your eye, and click it to open a panel with
the story behind it.

The idea was to make a résumé that rewards curiosity — the more you explore, the
more you find.

## Experiencing it

The whole thing runs live in the browser as a real-time 3D scene. No video, no
backend — just a static site doing everything on your machine.

- **Click** anywhere to take the controls and start flying.
- **WASD** to move, **Space / Shift** to rise and fall, **E** to boost, and the
  **mouse** to look around.
- Line a planet or moon up in the crosshair and **click** to fly to it and read
  its panel.
- Click the **×** or empty space to close a panel and get moving again; **Esc**
  frees the mouse.

Fly slowly and look closely — a couple of things in the system only show
themselves to people who take their time.

## How it's built

- **React Three Fiber** + **drei** — the 3D scene, camera, and helpers, written
  as ordinary React components.
- **Three.js** — the WebGL engine doing the actual rendering underneath.
- **@react-three/postprocessing** — the bloom and vignette that give space its glow.
- **Vite** — bundles it all down to static HTML, CSS, and JavaScript.

Every planet is a low-poly icosphere lit with flat shading, and each body's
orbit, spin, and axial tilt are varied procedurally so no two move quite alike.
Selecting a planet eases the camera onto a framed vantage point and quietly
freezes that planet's orbit, so its panel stays put while you read.

## How it's put together

The scene is entirely data-driven. Every planet, moon, color, orbit, and line of
résumé text lives in one file — `src/data/planets.js` — and the 3D world reads
that file and builds itself. The content and the code that draws it stay cleanly
separated: adding a planet or rewriting a section never means touching the
camera, controls, or rendering. Flight feel (speed, inertia, boundaries) is
similarly isolated in `src/config/camera.js`.

```
src/
  App.jsx            the canvas, HUD, and info-panel overlay
  data/planets.js    all résumé content and layout — the single source of truth
  config/camera.js   flight feel (speed, inertia, boundaries)
  controls/          the free-flight, pointer-locked spaceship camera
  interaction/       click-to-select and selection state
  scene/             the sun, starfield, planets, moons, panels, and effects
```

The finished build is fully static and is hosted on GitHub Pages.

## Running it locally

```bash
npm install
npm run dev      # local dev server with hot reload
npm run build    # produces the static site in dist/
```
