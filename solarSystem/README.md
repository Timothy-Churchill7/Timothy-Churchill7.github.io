# Tim Churchill — Interactive Solar System Resume

A navigable 3D solar system that *is* my resume. Fly a free-roaming camera
through space, approach planets (each a resume category), and click them to open
info panels anchored in 3D next to each world. Built with React Three Fiber and
deployed as fully static files to GitHub Pages — no backend of any kind.

## Tech

- **React Three Fiber** + **drei** — 3D scene & helpers
- **@react-three/postprocessing** — bloom / vignette
- **Vite** — build tool
- **GitHub Actions** — auto-deploy to the `gh-pages` branch on push to `main`

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # preview the production build
```

## Controls

- **Click** the scene to start flying (pointer lock)
- **WASD** — move · **Space / Shift** — up / down · **E** — boost · **mouse** — look
- Center a planet in the crosshair and **click** to open its info panel
- Click the **×** or empty space to close and resume flying · **Esc** releases the mouse

## Editing content — the only file you need

Everything (planets, moons, colors, orbits, and all resume text) is driven by:

```
src/data/planets.js
```

Add a planet, rename a section, recolor, reposition an orbit, or edit any
resume bullet there — the scene updates automatically. You never need to touch
the camera, interaction, or rendering code.

Flight "feel" (speed, inertia, boundaries) lives in `src/config/camera.js`.

## Swapping in real logos / textures

Drop image files into `public/assets/planets/` using each planet's `slug`:

```
public/assets/planets/<slug>-icon.svg      # icon for the planet + panel
public/assets/planets/<slug>-texture.jpg   # optional surface texture
```

(See `public/assets/planets/README.md`. Wiring these in is a small follow-up.)

## Project structure

```
src/
  App.jsx                     Canvas + HUD overlay + loading screen
  config/camera.js            flight tuning (speed, inertia, boundaries)
  data/planets.js             *** all content & layout live here ***
  controls/SpaceshipControls  free-flight camera (pointer lock + inertia)
  interaction/                click-to-select + selection state
  scene/                      Sun, Starfield, Planets, Moon, InfoPanel, Effects
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to the `gh-pages` branch. In the repo's
**Settings → Pages**, set the source to **Deploy from a branch → `gh-pages` / root**.
```
