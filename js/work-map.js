// ===========================================================================
// work-map.js — the orbit map on the professional page, and its background engines.
//
// The page ships as a complete static index (#index). This file opts into the
// map as its very last statement, and only when: JS runs, reduced motion is
// off, the viewport is at least 1160×620, AND the measured box actually fits
// the ring and the tallest card. Anything that throws before that line
// leaves the index alone.
//
//   ?map=off    never map            ?map=ring   map regardless of the gate
//   ?map=debug  map + geometry overlay
//
// Orbit: node i sits at angle base + i·2π/N; the focus point is the
// ellipse's leftmost point (θ = π). Node i is focused when
// base ≡ π − i·2π/N. One revolution takes 21 s × N.
// ===========================================================================

import content from "../content.js?v=c5a9a613";

export const TAU = Math.PI * 2;
export const periodFor = (n) => 21 * n;

export function wrapPi(a) {
  const w = (((a + Math.PI) % TAU) + TAU) % TAU - Math.PI;
  return w <= -Math.PI ? Math.PI : w;
}

export const focusBase = (i, n) => (((Math.PI - (i * TAU) / n) % TAU) + TAU) % TAU;
export const shortestDelta = (from, to) => wrapPi(to - from);

export function focusedIndex(base, n) {
  const k = Math.round((Math.PI - base) / (TAU / n));
  return ((k % n) + n) % n;
}

// 1 while a node is near the focus point, easing to 0 exactly at the handoff
// (half a slot away), so every card swap passes through black.
export function envelope(base, n, fade = 0.35) {
  const i = focusedIndex(base, n);
  const d = Math.min(1, Math.abs(wrapPi(base + (i * TAU) / n - Math.PI)) / (Math.PI / n));
  if (d <= 1 - fade) return 1;
  const u = Math.min(1, Math.max(0, (d - (1 - fade)) / fade));
  return 1 - u * u * (3 - 2 * u);
}

const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ===========================================================================
// BACKGROUND ENGINES — one per project subject. Each is a factory taking a
// canvas and returning { resize(w, h), frame(t, dt) }. They never run their
// own loop: the map drives the focused one, so a hidden tab, an off-screen
// map or a non-focused project costs nothing. All grayscale.
// ===========================================================================

function sizeCanvas(canvas, w, h) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

// draws at ~30 fps regardless of the display rate
function throttled(draw) {
  let acc = 1;
  return (t, dt) => {
    acc += dt;
    if (acc < 1 / 30) return;
    draw(t, acc);
    acc = 0;
  };
}

function gauss() {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

// A theme colour as "r,g,b" for canvas drawing. In light mode the canvases are
// inverted by CSS (white lines become black), so the channels are inverted here
// to come out right on screen: the moss accent would otherwise land pink-lilac.
function themeRGB(name, fallback) {
  const cs = getComputedStyle(document.documentElement);
  let rgb = cs.getPropertyValue(name).trim().split(/\s+/).map(Number);
  if (rgb.length !== 3 || rgb.some(Number.isNaN)) rgb = fallback;
  if (cs.getPropertyValue("--canvas-filter").includes("invert")) rgb = rgb.map((v) => 255 - v);
  return rgb.join(",");
}

// the page's ground, for canvases that paint over things to hide them (panels, spectra)
const groundFill = () => `rgb(${themeRGB("--paper-rgb", [0, 0, 0])})`;
// the accent: moss green in light mode, plain white in dark (like the rest of the accents)
const accentRGB = () => themeRGB("--accent-rgb", [255, 255, 255]);

// --- solar panels: two rows along the bottom, a glint sweeping across -----
// Shared by the scenes that sit on a "floor". Each panel is a tilted face with a
// 6×3 cell grid, legs short in front and long behind; drawn solid so it hides
// whatever is behind it.
function solarPanels(W, H) {
  const out = [];
  for (const row of [{ n: 7, w: 0.068, y: 0.885, alpha: 0.7, stagger: 0 }, { n: 6, w: 0.086, y: 0.96, alpha: 1, stagger: 0.45 }]) {
    const pw = W * row.w, gap = (W * 0.54 - row.n * pw) / Math.max(1, row.n - 1);
    for (let k = 0; k < row.n; k++) {
      out.push({ x: W * 0.445 + pw * row.stagger + k * (pw + gap), y: H * row.y, w: pw, h: pw * 0.36, skew: pw * 0.14, alpha: row.alpha });
    }
  }
  return out;
}

function drawPanel(ctx, p, glintX, ground) {
  const { x, y, w, h, skew, alpha } = p;
  const face = () => {
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w + skew, y - h); ctx.lineTo(x + skew, y - h);
    ctx.closePath();
  };
  // legs: short in front, long behind, so the panel tilts toward the sun
  ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.6})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const f of [0.18, 0.82]) {
    ctx.moveTo(x + w * f, y); ctx.lineTo(x + w * f, y + h * 0.22);
    ctx.moveTo(x + skew + w * f, y - h); ctx.lineTo(x + skew + w * f, y + h * 0.22);
  }
  ctx.stroke();
  // solid face hides the hills and towers behind it, then a faint tint
  face();
  ctx.fillStyle = ground;
  ctx.fill();
  ctx.fillStyle = `rgba(255,255,255,${alpha * 0.1})`;
  ctx.fill();
  // cell grid: 6 columns, 3 rows
  ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.5})`;
  ctx.beginPath();
  for (let i = 1; i < 6; i++) { const u = (w * i) / 6; ctx.moveTo(x + u, y); ctx.lineTo(x + skew + u, y - h); }
  for (let j = 1; j < 3; j++) { const f = j / 3; ctx.moveTo(x + skew * f, y - h * f); ctx.lineTo(x + w + skew * f, y - h * f); }
  ctx.stroke();
  face();
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.stroke();
  // the glint: a soft bright band passing across the cells
  const u = (glintX - x) / w;
  if (u > -0.3 && u < 1.3) {
    ctx.save();
    face();
    ctx.clip();
    const g = ctx.createLinearGradient(glintX - w * 0.25, 0, glintX + w * 0.25, 0);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.55})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - w * 0.3, y - h - 2, w * 1.6 + skew, h + 4);
    ctx.restore();
  }
}

// --- decay: quantum dots, pulsed excitation, a TCSPC histogram building up, --
// --- and solar panels along the floor --------------------------------------
function decay(canvas) {
  let ctx, W = 0, H = 0, dots = [], events = [], clock = 0, sincePulse = 9, panels = [];
  const PULSE = 2.2, WINDOW = 1.9, BINS = 72;
  const hist = new Float32Array(BINS);

  function resize(w, h) {
    ctx = sizeCanvas(canvas, w, h);
    W = w; H = h;
    const n = clamp(Math.round((w * h) / 7000), 90, 320);
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.78,
      r: clamp(4.2 * Math.exp(0.28 * gauss()), 2, 9),     // log-normal size spread, like a TEM grid
      tau: 0.18 + Math.random() * 0.55,
      e: 0,
      accent: Math.random() < 0.14,   // about one in seven
    }));
    panels = solarPanels(w, h);
  }

  function pulse() {
    for (const d of dots) {
      if (Math.random() > 0.5) continue;
      d.e = 1;
      const delay = -d.tau * Math.log(Math.random() || 1e-6);
      if (delay < WINDOW) events.push({ d, at: clock + delay, bin: Math.floor((delay / WINDOW) * BINS) });
    }
    for (let b = 0; b < BINS; b++) hist[b] *= 0.86;
  }

  const frame = throttled((t, dt) => {
    clock += dt;
    sincePulse += dt;
    if (sincePulse > PULSE) { sincePulse = 0; pulse(); }
    ctx.clearRect(0, 0, W, H);

    // emissions that have happened by now land in the histogram and flash
    const flashes = [];
    events = events.filter((ev) => {
      if (ev.at > clock) return true;
      hist[ev.bin] += 1;
      flashes.push(ev.d);
      return false;
    });

    const acc = accentRGB();
    for (const d of dots) {
      d.e *= Math.exp(-dt / d.tau);
      const rgb = d.accent ? acc : "255,255,255";
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, TAU);
      ctx.fillStyle = `rgba(${rgb},${d.accent ? 0.45 + d.e * 0.55 : 0.05 + d.e * 0.55})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${rgb},${d.accent ? 1 : 0.16 + d.e * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    for (const d of flashes) {
      ctx.fillRect(d.x - 0.5, d.y - d.r - 7, 1, 4);
      ctx.fillRect(d.x - 0.5, d.y + d.r + 3, 1, 4);
    }

    // histogram just above the panels: counts per time bin after each pulse
    const x0 = W * 0.5, x1 = W * 0.97, base = H * 0.81, top = H * 0.12;
    let max = 1;
    for (let b = 0; b < BINS; b++) max = Math.max(max, hist[b]);
    const bw = (x1 - x0) / BINS;
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    for (let b = 0; b < BINS; b++) {
      const hgt = (hist[b] / max) * top;
      ctx.fillRect(x0 + b * bw, base - hgt, Math.max(1, bw - 2), hgt);
    }
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(x0, base + 4, x1 - x0, 1);
    // the time-since-pulse cursor
    const cx = x0 + clamp(sincePulse / WINDOW, 0, 1) * (x1 - x0);
    ctx.fillRect(cx, base - top - 10, 1, top + 14);

    // solar panels on the floor; the glint crosses the array every ~11 s
    const glintX = W * (0.35 + ((clock / 11) % 1) * 0.8);
    const ground = groundFill();
    for (const pn of panels) drawPanel(ctx, pn, glintX, ground);
  });

  return { resize, frame };
}

// --- spectra: a hidden-line waterfall of absorption spectra, scanned -------
function spectra(canvas) {
  let ctx, W = 0, H = 0, clock = 0;
  const M = 15, S = 180, SWEEP = 6.5;
  let shown = [];        // what is on screen, per curve per sample (NaN = cleared)

  const spectrum = (k, x, t) => {
    // first excitonic peak red-shifts slowly, as dots grow; each curve is a later aliquot
    const ph = (t * 0.02 + k * 0.061) % 1;
    const p = 0.22 + 0.62 * ph;
    const fadeIn = Math.min(1, ph / 0.08) * Math.min(1, (1 - ph) / 0.08);
    const exciton = 0.9 * fadeIn * Math.exp(-((x - p) ** 2) / (2 * 0.028 ** 2));
    const second = 0.55 * fadeIn * Math.exp(-((x - (p - 0.13)) ** 2) / (2 * 0.04 ** 2));
    const uv = 1.4 * Math.exp(-x / 0.12);
    return exciton + second + uv + 0.05 * Math.sin(17 * x + k);
  };

  function resize(w, h) {
    ctx = sizeCanvas(canvas, w, h);
    W = w; H = h;
    shown = Array.from({ length: M }, (_, k) => Float32Array.from({ length: S }, (_, s) => spectrum(k, s / (S - 1), clock)));
  }

  const frame = throttled((t, dt) => {
    clock += dt;
    const scan = (clock % SWEEP) / SWEEP;           // 0..1 across wavelength
    const sIdx = Math.floor(scan * (S - 1));
    const gap = 6;                                  // samples cleared ahead of the beam
    for (let k = 0; k < M; k++) {
      const row = shown[k];
      for (let s = Math.max(0, sIdx - 3); s <= sIdx; s++) row[s] = spectrum(k, s / (S - 1), clock);
      for (let s = sIdx + 1; s <= Math.min(S - 1, sIdx + gap); s++) row[s] = NaN;
    }

    ctx.clearRect(0, 0, W, H);
    const ground = groundFill();   // each curve hides the ones behind it with the page's colour
    // the plot lives right of the card, where the scrim is thin
    const left = W * 0.4, right = W * 0.985;
    const top = H * 0.14, bottom = H * 0.9;
    const step = (bottom - top) / (M + 2);
    const amp = step * 2.6;
    // back to front, each curve occludes the ones behind it
    for (let k = 0; k < M; k++) {
      const y0 = top + (k + 2) * step;
      const row = shown[k];
      let s = 0;
      while (s < S) {
        while (s < S && Number.isNaN(row[s])) s++;
        const a = s;
        while (s < S && !Number.isNaN(row[s])) s++;
        const b = s - 1;
        if (b <= a) continue;
        ctx.beginPath();
        for (let q = a; q <= b; q++) {
          const x = left + (q / (S - 1)) * (right - left);
          const y = y0 - Math.min(row[q], 1.9) * amp * 0.5;
          q === a ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const xb = left + (b / (S - 1)) * (right - left);
        const xa = left + (a / (S - 1)) * (right - left);
        ctx.lineTo(xb, y0 + 2);
        ctx.lineTo(xa, y0 + 2);
        ctx.closePath();
        ctx.fillStyle = ground;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,${0.35 + 0.45 * (k / M)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    // the scan line and a wavelength axis
    const xs = left + scan * (right - left);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillRect(xs, top, 1, bottom - top + 12);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(left, bottom + 14, right - left, 1);
    for (let k = 0; k <= 10; k++) ctx.fillRect(left + (k / 10) * (right - left), bottom + 14, 1, 5);
  });

  return { resize, frame };
}

// --- tape: correlated price paths scrolling past, with the odd re-pricing --
function tape(canvas) {
  let ctx, W = 0, H = 0, n = 0, acc = 0, sinceEvent = 0, nextEvent = 9;
  const STEP = 5, TICK = 0.11, K = 4;
  let series = [], vol = [], marks = [];

  function resize(w, h) {
    ctx = sizeCanvas(canvas, w, h);
    W = w; H = h;
    n = Math.ceil(w / STEP) + 2;
    series = Array.from({ length: K }, () => new Float32Array(n));
    vol = new Float32Array(n);
    marks = [];
    for (let i = 1; i < n; i++) push(true);
  }

  function push(silent) {
    const m = gauss() * 0.6;
    for (let k = 0; k < K; k++) {
      const s = series[k];
      const prev = s[n - 1];
      const beta = k === 0 ? 1 : 0.5 + 0.15 * k;
      const v = prev - 0.035 * prev + 0.9 * (beta * m + gauss() * 0.75);
      s.copyWithin(0, 1);
      s[n - 1] = v;
    }
    vol.copyWithin(0, 1);
    vol[n - 1] = Math.abs(gauss()) * (0.4 + Math.abs(m));
    marks = marks.map((x) => x - 1).filter((x) => x > 0);
    if (!silent) {
      sinceEvent += TICK;
      if (sinceEvent > nextEvent) {
        sinceEvent = 0;
        nextEvent = 11 + Math.random() * 9;
        series[0][n - 1] += (Math.random() < 0.5 ? -1 : 1) * (9 + Math.random() * 6);
        vol[n - 1] *= 5;
        marks.push(n - 1);
      }
    }
  }

  const frame = throttled((t, dt) => {
    acc += dt;
    while (acc > TICK) { acc -= TICK; push(false); }
    const shift = -(acc / TICK) * STEP;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    for (let g = 1; g < 8; g++) ctx.fillRect(0, Math.round((g * H) / 8), W, 1);

    const mid = H * 0.46, scale = H * 0.012;
    for (let k = K - 1; k >= 0; k--) {
      const s = series[k];
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = i * STEP + shift, y = mid + (k - 1.5) * H * 0.06 - s[i] * scale;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      // k = 0 is the lead (thick); k = 2, one of the thin ones, carries the accent
      ctx.strokeStyle = k === 0 ? "rgba(255,255,255,0.9)" : k === 2 ? `rgba(${accentRGB()},1)` : `rgba(255,255,255,${0.22 + 0.04 * k})`;
      ctx.lineWidth = k === 0 || k === 2 ? 1.6 : 1;
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.16)";
    const vb = H * 0.95;
    for (let i = 0; i < n; i++) {
      const hgt = Math.min(H * 0.12, vol[i] * H * 0.025);
      ctx.fillRect(i * STEP + shift, vb - hgt, STEP - 2, hgt);
    }
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    for (const m of marks) ctx.fillRect(m * STEP + shift, H * 0.1, 1, H * 0.85);
  });

  return { resize, frame };
}

// --- orrery: a tilted solar system, Keplerian, with a starfield ------------
function orrery(canvas) {
  let ctx, W = 0, H = 0, clock = 0, stars = [], planets = [];

  function resize(w, h) {
    ctx = sizeCanvas(canvas, w, h);
    W = w; H = h;
    stars = Array.from({ length: Math.round((w * h) / 6000) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      a: 0.12 + Math.random() * 0.45, f: 0.3 + Math.random() * 1.2, p: Math.random() * TAU,
    }));
    const R = Math.min(w * 0.62, h * 1.25);
    planets = Array.from({ length: 7 }, (_, k) => {
      const a = R * (0.13 + 0.125 * k);
      return {
        a, size: [2, 2.6, 2.6, 2, 2.2, 2.4, 2.4][k],
        w: 0.42 * Math.pow(a / (R * 0.13), -1.5), ph: Math.random() * TAU,
        moons: k === 2 ? [0, 1, 2, 3].map((m) => ({ r: 9 + 5 * m, w: 1.6 - 0.3 * m, ph: Math.random() * TAU })) : [],
      };
    });
  }

  const frame = throttled((t, dt) => {
    clock += dt;
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      ctx.fillStyle = `rgba(255,255,255,${s.a * (0.7 + 0.3 * Math.sin(clock * s.f + s.p))})`;
      ctx.fillRect(s.x, s.y, 1, 1);
    }
    const cx = W * 0.64, cy = H * 0.52, tilt = 0.34;

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    for (const p of planets) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, p.a, p.a * tilt, 0, 0, TAU);
      ctx.stroke();
    }

    const bodies = planets.map((p) => {
      const th = p.ph + p.w * clock * 0.12;
      return { p, th, x: cx + p.a * Math.cos(th), y: cy + p.a * tilt * Math.sin(th) };
    });
    const drawBody = (b) => {
      const depth = (1 + Math.sin(b.th)) / 2;   // front of the plane is brighter
      ctx.fillStyle = `rgba(255,255,255,${0.45 + 0.5 * depth})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.p.size * (0.8 + 0.4 * depth), 0, TAU);
      ctx.fill();
      for (const m of b.p.moons) {
        const mt = m.ph + m.w * clock;
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(b.x + m.r * Math.cos(mt), b.y + m.r * 0.6 * Math.sin(mt), 1.4, 1.4);
      }
    };
    bodies.filter((b) => Math.sin(b.th) < 0).forEach(drawBody);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 34);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.18, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, 34, 0, TAU);
    ctx.fill();
    bodies.filter((b) => Math.sin(b.th) >= 0).forEach(drawBody);
  });

  return { resize, frame };
}

// --- ecg: a rhythm strip printing from the right, on grid paper -----------
function ecg(canvas) {
  let ctx, W = 0, H = 0, n = 0, clock = 0, beat = 0, rr = 0.85, ecgY = [], plethY = [];
  const STEP = 2, SPEED = 110;     // px per sample, px per second

  // one heartbeat as a sum of bumps: P, Q, R, S, T (phase 0..1 of the RR interval)
  const wave = (ph) => {
    const g = (c, w, a) => a * Math.exp(-((ph - c) ** 2) / (2 * w * w));
    return g(0.16, 0.025, 0.12) + g(0.27, 0.008, -0.12) + g(0.3, 0.011, 1) + g(0.335, 0.01, -0.28) + g(0.56, 0.045, 0.3);
  };
  const pleth = (ph) => {
    const x = (ph - 0.38 + 1) % 1;
    return Math.exp(-((x - 0.18) ** 2) / 0.012) * 0.9 + Math.exp(-((x - 0.42) ** 2) / 0.02) * 0.3;
  };

  function resize(w, h) {
    ctx = sizeCanvas(canvas, w, h);
    W = w; H = h;
    n = Math.ceil(w / STEP) + 2;
    ecgY = new Array(n).fill(0);
    plethY = new Array(n).fill(0);
  }

  function sample(dt) {
    clock += dt;
    if (clock - beat > rr) { beat += rr; rr = 0.78 + Math.random() * 0.14; }   // a little variability, like a real rhythm
    const ph = (clock - beat) / rr;
    ecgY.push(wave(ph) + (Math.random() - 0.5) * 0.02); ecgY.shift();
    plethY.push(pleth(ph)); plethY.shift();
  }

  let acc = 0;
  const frame = throttled((t, dt) => {
    acc += dt * SPEED / STEP;
    while (acc >= 1) { acc -= 1; sample(STEP / SPEED); }
    ctx.clearRect(0, 0, W, H);

    // grid paper: small squares, a brighter line every fifth
    const sq = 10;
    for (let x = 0, i = 0; x < W; x += sq, i++) {
      ctx.fillStyle = i % 5 ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.08)";
      ctx.fillRect(Math.round(x), 0, 1, H);
    }
    for (let y = 0, i = 0; y < H; y += sq, i++) {
      ctx.fillStyle = i % 5 ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.08)";
      ctx.fillRect(0, Math.round(y), W, 1);
    }

    const line = (ys, base, amp, alpha, width, rgb = "255,255,255") => {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = i * STEP, y = base - ys[i] * amp;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = `rgba(${rgb},${alpha})`;
      ctx.lineWidth = width;
      ctx.stroke();
    };
    line(ecgY, H * 0.5, H * 0.2, 0.9, 1.4);
    line(plethY, H * 0.82, H * 0.07, 1, 1.8, accentRGB());   // the lower pulse line carries the accent
    // the pen
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc((n - 1) * STEP, H * 0.5 - ecgY[n - 1] * H * 0.2, 2.2, 0, TAU);
    ctx.fill();
  });

  return { resize, frame };
}

// --- cubes: 23 wireframe cubes, a loose cluster turning slowly, some filling in --
// Positions are sampled in a flattened ball and kept only if a cube's bounding
// sphere clears every other, so the cluster is spread out but never intersects.
export function cubeCluster(n = 23, rng = Math.random) {
  const out = [];
  for (let tries = 0; out.length < n && tries < 20000; tries++) {
    const s = 0.11 + rng() * 0.15;                       // edge length, in cluster units
    const x = rng() * 2 - 1, y = (rng() * 2 - 1) * 0.72, z = rng() * 2 - 1;
    if (x * x + (y / 0.72) ** 2 + z * z > 1) continue;    // inside the (flattened) ball
    const clear = out.every((c) => Math.hypot(c.x - x, c.y - y, c.z - z) >= ((c.s + s) * Math.sqrt(3)) / 2 + 0.03);
    if (!clear) continue;
    out.push({ x, y, z, s, spin: (rng() - 0.5) * 0.5, tilt: rng() * TAU, phase: rng() * TAU, fill: 0, target: rng() < 0.25 ? 1 : 0, accent: false });
  }
  // four of them carry the accent, picked at random
  const order = out.map((_, i) => i).sort(() => rng() - 0.5);
  for (const i of order.slice(0, Math.min(4, out.length))) out[i].accent = true;
  return out;
}

function cubes(canvas) {
  let ctx, W = 0, H = 0, clock = 0, since = 0;
  const cells = cubeCluster(23);
  const CORNERS = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  const EDGES = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const FACES = [[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[0,3,7,4]];

  function resize(w, h) { ctx = sizeCanvas(canvas, w, h); W = w; H = h; }

  const frame = throttled((t, dt) => {
    clock += dt;
    since += dt;
    if (since > 0.9) {   // every so often a block is placed or cleared
      since = 0;
      const c = cells[Math.floor(Math.random() * cells.length)];
      c.target = c.target ? 0 : 1;
    }
    for (const c of cells) c.fill += (c.target - c.fill) * Math.min(1, dt * 2.5);

    ctx.clearRect(0, 0, W, H);
    const acc = accentRGB();
    const cx = W * 0.74, cy = H * 0.5, scale = Math.min(W, H) * 0.34, dist = 3.2;
    // the whole cluster turns slowly; each cube also turns on its own
    const ay = clock * 0.12, ax = 0.35 + Math.sin(clock * 0.06) * 0.1;
    const cY = Math.cos(ay), sY = Math.sin(ay), cX = Math.cos(ax), sX = Math.sin(ax);
    const toScreen = (x, y, z) => {
      const x1 = x * cY + z * sY, z1 = -x * sY + z * cY;
      const y2 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
      const k = dist / (dist + z2);
      return [cx + x1 * scale * k, cy + y2 * scale * k, z2];
    };

    const drawn = cells.map((c) => {
      const a = c.phase + clock * c.spin, ca = Math.cos(a), sa = Math.sin(a), ct = Math.cos(c.tilt), st = Math.sin(c.tilt);
      const h = c.s / 2;
      const pts = CORNERS.map(([u, v, w]) => {
        // own rotation: about y by a, then about x by the cube's fixed tilt
        const x1 = u * ca + w * sa, z1 = -u * sa + w * ca;
        const y2 = v * ct - z1 * st, z2 = v * st + z1 * ct;
        return toScreen(c.x + x1 * h, c.y + y2 * h, c.z + z2 * h);
      });
      return { c, pts, depth: pts.reduce((m, q) => m + q[2], 0) / 8 };
    }).sort((p, q) => q.depth - p.depth);   // far to near

    for (const { c, pts, depth } of drawn) {
      const near = Math.max(0, Math.min(1, 0.55 - depth * 0.5));
      if (c.fill > 0.02) {
        ctx.fillStyle = `rgba(${c.accent ? acc : "255,255,255"},${(c.accent ? 0.3 : 0.08) * c.fill})`;
        for (const f of FACES) {
          ctx.beginPath();
          f.forEach((q, m) => (m ? ctx.lineTo(pts[q][0], pts[q][1]) : ctx.moveTo(pts[q][0], pts[q][1])));
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.strokeStyle = `rgba(${c.accent ? acc : "255,255,255"},${c.accent ? 1 : 0.18 + 0.4 * near + 0.22 * c.fill})`;
      ctx.lineWidth = c.accent ? 1.6 : 1;
      ctx.beginPath();
      for (const [i, j] of EDGES) { ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); }
      ctx.stroke();
    }
  });

  return { resize, frame };
}

export const ENGINES = { decay, ecg, tape, cubes, spectra, orrery };
// per-engine opacity under the scrim, tuned by eye so they read equally quiet
const CAP = { decay: 0.62, ecg: 0.45, tape: 0.5, cubes: 0.45, spectra: 0.5, orrery: 0.7 };

// ===========================================================================
// THE MAP
// ===========================================================================

const MIN_W = 1160, MIN_H = 620;
const RX_MIN = 180, RY_MIN = 110;
const LABEL_ROOM = 170;   // px kept right of the ring for node labels (they may run into the gutter)

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

const pad2 = (i) => String(i + 1).padStart(2, "0");

function fillPanel(parts, p, i, n) {
  parts.n.textContent = `${pad2(i)} / ${String(n).padStart(2, "0")} · ${p.status || ""}`;
  parts.title.textContent = p.title;
  parts.tag.textContent = p.tagline || "";
  parts.tag.hidden = !p.tagline;   // no tagline, no gap
  parts.meta.textContent = [p.role, p.dates, p.org].filter(Boolean).join(" // ");
  parts.body.replaceChildren(...(p.body || []).map((t) => el("p", null, t)));
  parts.links.replaceChildren(...(p.links || []).map((l) => {
    const li = el("li");
    const a = el("a", "tlink", l.label);
    a.href = l.url;
    if (/^https?:/.test(l.url)) {
      a.target = "_blank";
      a.rel = "noopener";
      a.append(el("span", "tlink__arr", " ↗"));
      a.lastChild.setAttribute("aria-hidden", "true");
      a.append(el("span", "sr-only", " (opens in a new tab)"));
    }
    li.append(a);
    return li;
  }));
}

function initMap() {
  const P = content.projects || [];
  const N = P.length;
  const mapEl = document.getElementById("work-map");
  const index = document.getElementById("work-index");
  const backdrop = document.getElementById("backdrop");
  const force = new URLSearchParams(location.search).get("map");
  if (!mapEl || !index || !N || force === "off") return;

  const root = document.documentElement;
  const PERIOD = periodFor(N);
  const mq = window.matchMedia(`(min-width:${MIN_W}px) and (min-height:${MIN_H}px)`);
  const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
  const debug = force === "debug";

  // ---- build the map's DOM once ----
  const inner = el("div", "map__grid");
  const card = el("article", "card");
  card.id = "card";
  card.setAttribute("aria-labelledby", "card-title");
  const parts = {
    n: el("p", "card__n"),
    title: el("h2", "card__title"),
    tag: el("p", "card__tag"),
    meta: el("p", "card__meta"),
    body: el("div", "card__body"),
    links: el("ul", "card__links"),
  };
  parts.title.id = "card-title";
  card.append(...Object.values(parts));

  const orbitbox = el("div", "orbitbox");
  orbitbox.setAttribute("aria-hidden", "true");
  const svgNS = "http://www.w3.org/2000/svg";
  const overlay = document.createElementNS(svgNS, "svg");
  overlay.setAttribute("class", "map__svg");
  overlay.setAttribute("aria-hidden", "true");
  const orbit = document.createElementNS(svgNS, "ellipse");
  orbit.setAttribute("class", "map__orbit");
  const leader = document.createElementNS(svgNS, "line");
  leader.setAttribute("class", "map__leader");
  overlay.append(orbit, leader);

  const list = el("ul", "map__nodes");
  list.setAttribute("aria-label", "Projects");
  const nodes = P.map((p, i) => {
    const li = el("li");
    const b = el("button", "node");
    b.type = "button";
    b.setAttribute("aria-controls", "card");
    if (p.summary) b.title = p.summary;
    const dot = el("span", "node__dot");
    dot.setAttribute("aria-hidden", "true");
    const label = el("span", "node__label");
    label.append(el("span", "node__n", pad2(i)), el("span", "node__t", p.title));
    b.append(dot, label);
    b.addEventListener("click", () => spinTo(i, true));
    li.append(b);
    list.append(li);
    return { b, dot, label };
  });

  const pauseBtn = el("button", "map__pause tlink", "pause");
  pauseBtn.type = "button";
  pauseBtn.setAttribute("aria-pressed", "false");
  pauseBtn.setAttribute("aria-label", "Pause the orbit");

  const live = el("p", "sr-only");
  live.setAttribute("aria-live", "polite");

  const dbg = debug ? el("pre", "map__debug") : null;
  inner.append(card, orbitbox, overlay, list, pauseBtn, live);
  if (dbg) inner.append(dbg);
  mapEl.replaceChildren(inner);

  // ---- state ----
  let base = focusBase(0, N);
  let cur = -1, spin = null, hovered = false, focused = false, userPaused = false;
  let hold = 0, raf = 0, last = 0, running = false, on = false, visible = true;
  let geo = { cx: 0, cy: 0, rx: 0, ry: 0, fits: false };
  const layers = [];   // { el, engine, cap }
  let layersBuilt = false;

  // ---- geometry ----
  function measurePanelMax() {
    const keep = cur;
    let max = 0;
    for (let i = 0; i < N; i++) {
      fillPanel(parts, P[i], i, N);
      max = Math.max(max, card.scrollHeight);
    }
    if (keep >= 0) fillPanel(parts, P[keep], keep, N);
    return max;
  }

  function layout() {
    const panelMax = measurePanelMax();
    const box = inner.getBoundingClientRect();
    const cs = getComputedStyle(inner);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    // Judge the fit against the screen, not the grid: the grid stretches to hold whatever
    // card is showing, so its own height would always "fit".
    const avail = window.innerHeight - (box.top + window.scrollY);
    const sr = orbitbox.getBoundingClientRect();
    const sl = sr.left - box.left, st = sr.top - box.top;
    const rx = (sr.width - LABEL_ROOM) / 2;
    const ry = Math.min(rx * 0.72, (avail - padY) / 2 - 36);
    const cx = sl + rx + 14, cy = st + sr.height / 2;
    const pr = card.getBoundingClientRect();
    const fits = rx >= RX_MIN && ry >= RY_MIN && panelMax + padY <= avail + 1;
    overlay.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    overlay.setAttribute("width", box.width);
    overlay.setAttribute("height", box.height);
    orbit.setAttribute("cx", cx);
    orbit.setAttribute("cy", cy);
    orbit.setAttribute("rx", Math.max(0, rx));
    orbit.setAttribute("ry", Math.max(0, ry));
    geo = { cx, cy, rx, ry, fits, panelMax: panelMax + padY, boxH: avail, panelR: pr.right - box.left };
    for (const L of layers) L.sized = false;
    return fits;
  }

  // ---- background layers (built on idle, never on the critical path) ----
  function buildLayers() {
    if (layersBuilt || !backdrop) return;
    layersBuilt = true;
    P.forEach((p, i) => {
      const make = p.media && ENGINES[p.media];
      const wrap = el("div", "backdrop__layer");
      const canvas = el("canvas");
      wrap.append(canvas);
      backdrop.append(wrap);
      layers[i] = { el: wrap, canvas, engine: make ? make(canvas) : null, cap: CAP[p.media] ?? 0.5, sized: false };
    });
  }

  function sizeLayer(L) {
    if (!L || !L.engine || L.sized) return;
    L.engine.resize(window.innerWidth, window.innerHeight);
    L.sized = true;
  }

  // ---- render ----
  function show(i) {
    cur = i;
    fillPanel(parts, P[i], i, N);
    nodes.forEach((nd, j) => nd.b.setAttribute("aria-current", j === i ? "true" : "false"));
  }

  function render(t, dt) {
    const slot = TAU / N;
    const i = focusedIndex(base, N);
    if (i !== cur) show(i);
    const frozen = hovered || focused;
    hold = frozen ? Math.min(1, hold + dt * 3) : Math.max(0, hold - dt * 1.5);
    const env = Math.max(envelope(base, N), hold);

    card.style.opacity = env.toFixed(3);
    card.style.visibility = env < 0.02 ? "hidden" : "visible";

    let fx = 0, fy = 0, fs = 1;
    nodes.forEach((nd, j) => {
      const th = base + j * slot;
      const x = geo.cx + geo.rx * Math.cos(th);
      const y = geo.cy + geo.ry * Math.sin(th);
      const prox = Math.max(0, 1 - Math.abs(wrapPi(th - Math.PI)) / (slot * 0.6));
      const depth = (1 + Math.sin(th)) / 2;
      const s = 1 + 1.3 * prox;
      nd.b.style.transform = `translate(${(x - 13).toFixed(1)}px, ${y.toFixed(1)}px) translateY(-50%)`;
      nd.dot.style.transform = `scale(${s.toFixed(3)})`;
      nd.dot.style.opacity = (0.5 + 0.2 * depth + 0.3 * prox).toFixed(3);
      nd.label.style.opacity = (0.58 + 0.42 * prox).toFixed(3);
      nd.b.classList.toggle("is-focus", j === i);
      if (j === i) { fx = x; fy = y; fs = s; }
    });

    // leader: focused node → the card's right edge
    const pr = card.getBoundingClientRect(), box = inner.getBoundingClientRect();
    const x2 = pr.right - box.left + 18;
    const y2 = clamp(fy, pr.top - box.top + 10, pr.bottom - box.top - 10);
    leader.setAttribute("x1", (fx - 5 * fs - 6).toFixed(1));
    leader.setAttribute("y1", fy.toFixed(1));
    leader.setAttribute("x2", x2.toFixed(1));
    leader.setAttribute("y2", y2.toFixed(1));
    leader.style.opacity = (env * 0.55).toFixed(3);

    layers.forEach((L, j) => {
      if (!L) return;
      const a = j === i ? env * L.cap : 0;
      L.el.style.opacity = a.toFixed(3);
      if (j === i && L.engine && a > 0.001) { sizeLayer(L); L.engine.frame(t, dt); }
    });

    if (dbg) {
      dbg.textContent = [
        `mode   map${force ? " (forced " + force + ")" : ""}`,
        `fits   ${geo.fits}   rx ${geo.rx.toFixed(0)}  ry ${geo.ry.toFixed(0)}`,
        `card  max ${geo.panelMax}px of ${geo.boxH.toFixed(0)}px`,
        `base   ${(((base % TAU) + TAU) % TAU).toFixed(3)}  focus ${pad2(i)}  env ${env.toFixed(2)}`,
        `frozen ${frozen}  paused ${userPaused}  period ${PERIOD}s`,
      ].join("\n");
    }
  }

  function frame(t) {
    if (!running) return;
    const dt = last ? Math.min(0.1, (t - last) / 1000) : 0;
    last = t;
    if (spin) {
      const k = Math.min(1, (t - spin.t0) / spin.dur);
      base = spin.from + spin.delta * easeInOut(k);
      if (k >= 1) spin = null;
    } else if (!hovered && !focused && !userPaused) {
      base -= (TAU / PERIOD) * dt;   // decreasing base brings 01, 02, 03… round in order
    }
    render(t / 1000, dt);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || !on || !visible || document.hidden) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function spinTo(i, announce) {
    const target = focusBase(i, N);
    const delta = shortestDelta(base, target);
    spin = { from: base, delta, t0: performance.now(), dur: 450 + 750 * (Math.abs(delta) / Math.PI) };
    if (announce) live.textContent = `Showing ${pad2(i)}: ${P[i].title}`;
    if (!running) { base = target; render(0, 0); }
  }

  // freeze while the pointer or keyboard focus is in the card
  card.addEventListener("pointerenter", () => { hovered = true; });
  card.addEventListener("pointerleave", () => { hovered = false; });
  card.addEventListener("focusin", () => { focused = true; });
  card.addEventListener("focusout", (e) => { if (!card.contains(e.relatedTarget)) focused = false; });
  pauseBtn.addEventListener("click", () => {
    userPaused = !userPaused;
    pauseBtn.textContent = userPaused ? "resume" : "pause";
    pauseBtn.setAttribute("aria-pressed", String(userPaused));
    pauseBtn.setAttribute("aria-label", userPaused ? "Resume the orbit" : "Pause the orbit");
  });

  // ---- mode gate ----
  function setMode(next) {
    on = next;
    root.classList.toggle("map-on", next);
    root.classList.toggle("map-debug-on", next && debug);
    index.hidden = next;
    mapEl.hidden = !next;
    if (backdrop) backdrop.hidden = !next;
    window.TC && window.TC.relock && window.TC.relock();
    if (!next) { stop(); return; }
    start();
  }

  function evaluate() {
    const want = force === "ring" || force === "debug" || (mq.matches && !rm.matches);
    if (!want) { setMode(false); return; }
    if (!on) {
      root.classList.add("map-on");
      index.hidden = true;
      mapEl.hidden = false;
    }
    window.TC && window.TC.relock && window.TC.relock();   // the intro may be locked at its non-map height
    const fits = layout();
    if (!fits && force !== "ring" && force !== "debug") { setMode(false); return; }
    if (cur < 0) show(focusedIndex(base, N));
    setMode(true);
    render(0, 0);
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 300));
    if (!layersBuilt) idle(() => { buildLayers(); render(0, 0); });
  }

  let rt = 0;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(evaluate, 150); });
  mq.addEventListener("change", evaluate);
  rm.addEventListener("change", evaluate);
  if (document.fonts) {
    // re-check either way: a first check made with fallback fonts can fail (or pass) wrongly
    document.fonts.ready.then(evaluate);
    document.fonts.addEventListener && document.fonts.addEventListener("loadingdone", evaluate);
  }
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => {
      visible = es[es.length - 1].isIntersecting;
      visible ? start() : stop();
    }).observe(mapEl);
  }

  return evaluate;
}

// the last statement: opt into the map. A throw anywhere above leaves #index.
if (typeof document !== "undefined") {
  const go = () => { const evaluate = initMap(); if (evaluate) evaluate(); };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", go) : go();
}
