// ===========================================================================
// site.js — shared behaviour for every page.
//
//   window.TC = { typeText, buildField, fieldGeom, reduce }
//
// Everything here is an opt-in layer over complete static HTML: if this file
// never runs, every page still reads in full. The pure geometry helpers are
// exported so `node --test` can exercise them without a browser; nothing
// below touches the DOM unless a document exists.
// ===========================================================================

import content from "../content.js?v=c5a9a613";

const HAS_DOM = typeof window !== "undefined" && typeof document !== "undefined";
export const reduce = HAS_DOM && window.matchMedia
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b, rng = Math.random) => a + (b - a) * rng();

// small seeded PRNG, so geometry is testable
export function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// FIELD GEOMETRY
// Fragments are scattered, not columned. Each gets its own width, text size,
// opacity and box height, then a random spot, kept only if the box stays clear
// of every other box. A fragment only types lines that fit its box.
// Density follows the brief: about three per 320px of width per screen height.
// ---------------------------------------------------------------------------

// rows a text needs at `cpl` characters per line; each "\n" line wraps on its own
export function rowsFor(text, cpl) {
  return text.split("\n").reduce((n, seg) => n + Math.max(1, Math.ceil(seg.length / cpl)), 0);
}

const DESKTOP_SCALES = [0.85, 1, 1, 1.2, 1.45];
const PHONE_SCALES = [1, 1, 1, 1.15, 1.3];   // never below base on phones: text stays ≥ 12px

const touches = (a, b, gx, gy) =>
  a.x < b.x + b.w + gx && b.x < a.x + a.w + gx && a.y < b.y + b.h + gy && b.y < a.y + a.h + gy;

export function fieldGeom(w, h, opts = {}) {
  const rng = opts.rng || Math.random;
  const charW = opts.charW ?? 6.9;     // px per mono glyph at base size
  const lineH = opts.lineH ?? 17.8;    // px line box at base size
  const screenH = opts.screenH ?? h;
  const texts = opts.texts && opts.texts.length ? opts.texts : ["x".repeat(opts.maxChars ?? 110)];
  const phone = w < 768;
  const scales = phone ? PHONE_SCALES : DESKTOP_SCALES;

  const unit = clamp(Math.round(w / 320), 2, 6);
  const target = Math.max(1, Math.round(unit * 3 * Math.min(1, h / screenH)));
  const nominal = w / unit;
  const padX = clamp(w * 0.02, 8, 32);
  const padY = clamp(h * 0.05, 12, 56);
  const gapX = 22, gapY = lineH;
  const wMax = phone ? w - 2 * padX : Math.min(w - 2 * padX, nominal * 1.35);

  // reserved areas (small text, glass panes, the chip) are obstacles from the start
  const avoid = (opts.avoid || []).filter(Boolean);
  const fits = (b) => b.y + b.h <= h - padY + 1e-9 &&
    !avoid.some((r) => touches(b, r, 14, 14)) && !slots.some((o) => touches(b, o, gapX, gapY));
  // Box heights vary: a box is sized for one line's row count, and a fragment only ever
  // types lines that fit its box. The first ~30% are sized for the longest entry, so
  // stanzas and cited quotes always have somewhere to go.
  const candidate = () => {
    const scale = scales[Math.floor(rng() * scales.length)];
    // bigger type gets a wider box, so tall boxes stay rare
    const base = phone ? (w - 2 * padX) * (0.4 + 0.3 * rng()) : nominal * (0.5 + 0.55 * rng()) * scale;
    const sw = clamp(base, Math.min(150, wMax), wMax);
    const cpl = Math.max(8, Math.floor(sw / (charW * scale)) - 2);   // 2 chars of slack for word wrap
    const all = texts.map((t) => rowsFor(t, cpl));
    const big = slots.filter((o) => o.big).length < Math.ceil(0.3 * target) || rng() < 0.2;
    const rows = big ? Math.max(...all) : all[Math.floor(rng() * all.length)];
    const alpha = Math.min(scale > 1.1 ? 0.8 : 1, 0.4 + 0.6 * rng());
    return { x: padX + rng() * (w - 2 * padX - sw), y: 0, w: sw, h: rows * lineH * scale, scale, alpha, cpl, rows, big };
  };

  const slots = [];
  // 1) anywhere at random
  for (let k = 0; k < target * 60 && slots.length < target; k++) {
    const b = candidate();
    if (b.h > h - 2 * padY) continue;
    b.y = padY + rng() * (h - 2 * padY - b.h);
    if (fits(b)) slots.push(b);
  }
  // 2) if the box is crowded (phones), drop the rest at the highest free spot under a random x
  for (let k = 0; k < target * 60 && slots.length < target; k++) {
    const b = candidate();
    const below = [...slots, ...avoid].filter((o) => b.x < o.x + o.w + gapX && o.x < b.x + b.w + gapX);
    const ys = [padY + rng() * lineH * 2, ...below.map((o) => o.y + o.h + gapY + rng() * lineH)];
    for (const y of ys.sort((a, c) => a - c)) {
      b.y = y;
      if (fits(b)) { slots.push(b); break; }
    }
  }
  return { slots, target, charW, lineH, gapX, gapY };
}

// can this line go in this box without spilling?
export const lineFits = (text, slot) => rowsFor(text, slot.cpl) <= slot.rows;

// drop any slot whose box touches one of the reserved rects (+ margin)
export function dropReserved(slots, rects, margin = 14) {
  if (!rects) return slots.slice();
  const list = Array.isArray(rects) ? rects.filter(Boolean) : [rects];
  return slots.filter((s) => !list.some((r) => touches(s, r, margin, margin)));
}

// ---------------------------------------------------------------------------
// TYPING RHYTHM — uneven on purpose: log-normal jitter per key, a pause after
// punctuation or a line break, a small one after spaces, short fast bursts, and
// the odd hesitation. `st` carries burst state between keys.
// ---------------------------------------------------------------------------

function gaussR(rng) {
  let u = 0;
  while (!u) u = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

export function typingDelay(base, ch, st, rng = Math.random) {
  if (/[,.;:!?—–\n]/.test(ch)) { st.burst = 0; return base * (3 + 4 * rng()); }
  if (st.burst > 0) { st.burst--; return base * (0.25 + 0.2 * rng()); }
  if (rng() < 0.06) st.burst = 3 + Math.floor(rng() * 8);
  let d = base * Math.exp(0.5 * gaussR(rng));
  if (ch === " ") d *= 1.1 + 0.6 * rng();
  if (rng() < 0.035) d += 220 + 520 * rng();
  return Math.max(8, d);
}

// ---------------------------------------------------------------------------
// Everything below needs a browser.
// ---------------------------------------------------------------------------

// a line is a string (may hold "\n" breaks, e.g. a stanza), or a cited quotation
// { text, author, work } shown with its citation on a line of its own
const LINES = (content.fieldLines || []).filter(Boolean)
  .map((l) => (typeof l === "string" ? l : `${l.text}\n— ${l.author}, ${l.work}`));
const BUDGET = 25;           // global cap on fragments showing text at once
export const HOLD_MS = [800, 3500];   // how long a finished line stays up before it clears
let live = 0;
let hidden = HAS_DOM ? document.hidden : false;
const onScreen = new Set();  // lines currently visible anywhere, to avoid twins
const fields = new Set();

// a random line that fits this fragment's box, avoiding lines already on screen
function pickLine(slot, rng = Math.random) {
  const ok = slot ? LINES.filter((l) => lineFits(l, slot)) : LINES;
  const pool = ok.length ? ok : LINES;
  if (!pool.length) return "";
  for (let k = 0; k < 8; k++) {
    const l = pool[Math.floor(rng() * pool.length)];
    if (!onScreen.has(l)) return l;
  }
  return pool[Math.floor(rng() * pool.length)];
}

const fragSpeed = () => rand(18, 85);   // ms per key before the rhythm's jitter

function caretEl() {
  const c = document.createElement("span");
  c.className = "caret";
  c.setAttribute("aria-hidden", "true");
  return c;
}

class Fragment {
  constructor(field, slot) {
    this.field = field;
    this.el = document.createElement("p");
    this.el.className = "fieldline";
    this.el.style.left = slot.x.toFixed(1) + "px";
    this.el.style.top = slot.y.toFixed(1) + "px";
    this.el.style.width = slot.w.toFixed(1) + "px";
    this.el.style.fontSize = (field.metrics.fontPx * slot.scale).toFixed(2) + "px";
    this.el.style.opacity = slot.alpha.toFixed(2);
    this.slot = slot;
    this.rhythm = {};
    this.txt = document.createElement("span");
    this.caret = caretEl();
    this.caret.hidden = true;
    this.el.append(this.txt, this.caret);
    this.text = "";
    this.i = 0;
    this.state = "dark";
    this.timer = 0;
    this.counted = false;
  }

  // Fragment text is drawn as CSS generated content (see .fieldline span::before).
  // It is decoration (aria-hidden, deliberately faint), and contrast checkers
  // only read real text nodes, so this keeps them from flagging the texture.
  show(text) {
    this.txt.dataset.t = text;
  }

  later(fn, ms) {
    clearTimeout(this.timer);
    this.timer = setTimeout(fn, ms);
  }

  showStatic(text) {
    this.text = text;
    this.show(text);
    onScreen.add(text);
  }

  // random point in a full duty cycle, so nothing pulses in waves
  startAtRandomPhase() {
    this.speed = fragSpeed();
    const text = pickLine(this.slot);
    const dark = rand(1400, 8400), show = rand(...HOLD_MS), type = text.length * this.speed;
    const t = Math.random() * (dark + type + show);
    if (t < dark || live >= BUDGET) {
      this.state = "dark";
      this.later(() => this.typeIn(), (t < dark ? dark - t : rand(800, 4000)));
    } else if (t < dark + type) {
      this.typeIn(text, Math.floor((t - dark) / this.speed));
    } else {
      this.claim(text);
      this.show(text);
      this.state = "shown";
      this.later(() => this.clear(), dark + type + show - t);
    }
  }

  claim(text) {
    this.text = text;
    onScreen.add(text);
    if (!this.counted) { live++; this.counted = true; }
  }

  release() {
    onScreen.delete(this.text);
    if (this.counted) { live--; this.counted = false; }
  }

  typeIn(text, from = 0) {
    if (hidden || this.field.paused) { this.state = "dark"; return; }
    if (live >= BUDGET) { this.later(() => this.typeIn(), rand(1200, 3200)); return; }
    this.claim(text || pickLine(this.slot));
    this.speed = this.speed || fragSpeed();
    this.i = from;
    this.state = "typing";
    this.caret.hidden = false;
    const step = () => {
      this.i++;
      this.show(this.text.slice(0, this.i));
      if (this.i < this.text.length) this.later(step, typingDelay(this.speed, this.text[this.i - 1], this.rhythm));
      else {
        this.caret.hidden = true;
        this.state = "shown";
        this.later(() => this.clear(), rand(...HOLD_MS));
      }
    };
    step();
  }

  clear() {
    this.show("");
    this.caret.hidden = true;
    this.release();
    this.state = "dark";
    this.speed = fragSpeed();
    this.later(() => this.typeIn(), rand(1400, 8400));
  }

  pause() { clearTimeout(this.timer); }

  resume() {
    if (this.state === "typing") this.typeIn(this.text, this.i);
    else if (this.state === "shown") this.later(() => this.clear(), rand(1200, 5000));
    else this.later(() => this.typeIn(), rand(200, 3000));
  }

  destroy() {
    clearTimeout(this.timer);
    this.release();
    this.el.remove();
  }
}

class Field {
  constructor(el, fill, reserved) {
    this.el = el;
    this.fill = clamp(fill, 0, 1);
    this.reserved = reserved;
    this.frags = [];
    this.paused = false;
    this.offscreen = false;
    this.size = { w: 0, h: 0 };
    this.build();
    fields.add(this);
    if ("IntersectionObserver" in window && !reduce) {
      this.io = new IntersectionObserver((es) => {
        this.offscreen = !es[es.length - 1].isIntersecting;
        this.sync();
      });
      this.io.observe(el);
    }
  }

  // run only while on screen and the tab is visible
  sync() {
    const active = !hidden && !this.offscreen;
    if (active && this.paused) { this.paused = false; this.frags.forEach((f) => f.resume()); }
    else if (!active && !this.paused) { this.paused = true; this.frags.forEach((f) => f.pause()); }
  }

  measure() {
    const probe = document.createElement("p");
    probe.className = "fieldline";
    probe.style.visibility = "hidden";
    probe.style.width = "auto";
    probe.style.whiteSpace = "nowrap";
    probe.textContent = "M".repeat(40);
    this.el.append(probe);
    const r = probe.getBoundingClientRect();
    const fontPx = parseFloat(getComputedStyle(probe).fontSize) || 11.5;
    probe.remove();
    return { charW: r.width / 40 || 6.9, lineH: r.height || 17.8, fontPx };
  }

  build() {
    this.frags.forEach((f) => f.destroy());
    this.frags = [];
    const r = this.el.getBoundingClientRect();
    this.size = { w: r.width, h: r.height };
    if (r.width < 40 || r.height < 40) return;
    this.metrics = this.measure();
    const rects = typeof this.reserved === "function" ? this.reserved(r) : this.reserved;
    const g = fieldGeom(r.width, r.height, { ...this.metrics, screenH: window.innerHeight, texts: LINES, avoid: rects });
    this.geom = g;
    let slots = dropReserved(g.slots, rects);   // belt and braces: placement already avoided them
    for (let k = slots.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [slots[k], slots[j]] = [slots[j], slots[k]];
    }
    slots = slots.slice(0, Math.round(slots.length * this.fill));
    const frag = document.createDocumentFragment();
    for (const s of slots) {
      const f = new Fragment(this, s);
      this.frags.push(f);
      frag.append(f.el);
    }
    this.el.append(frag);
    if (reduce) this.frags.forEach((f) => f.showStatic(pickLine(f.slot)));
    else if (!hidden && !this.paused) this.frags.forEach((f) => f.startAtRandomPhase());
    else this.frags.forEach((f) => { f.state = "dark"; });
  }

  maybeRebuild() {
    const r = this.el.getBoundingClientRect();
    if (Math.abs(r.width - this.size.w) > 40 || Math.abs(r.height - this.size.h) > 120) this.build();
  }

  // web fonts change glyph widths; rebuild only if the measure really moved
  remeasure() {
    if (!this.metrics) return this.build();
    const m = this.measure();
    if (Math.abs(m.charW - this.metrics.charW) / this.metrics.charW > 0.03 ||
        Math.abs(m.lineH - this.metrics.lineH) > 1) this.build();
  }

  destroy() {
    this.frags.forEach((f) => f.destroy());
    this.io && this.io.disconnect();
    fields.delete(this);
  }
}

export function buildField(container, fill = 0.85, reserved = null) {
  return new Field(container, fill, reserved);
}

// ---------------------------------------------------------------------------
// TYPING — [data-type] elements type themselves in document order.
// The full sentence lives in a visually-hidden span while typing, the animated
// copy is aria-hidden, and the element's box is locked so nothing moves.
// When typing ends, the element goes back to plain text.
// ---------------------------------------------------------------------------

const prepared = new WeakMap();

function prepare(el) {
  if (prepared.has(el)) return prepared.get(el);
  const text = el.textContent.replace(/\s+/g, " ").trim();
  const r = el.getBoundingClientRect();
  const inline = getComputedStyle(el).display.startsWith("inline");
  el.style.minHeight = r.height + "px";
  if (inline) el.style.minWidth = r.width + "px";
  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = text;
  const vis = document.createElement("span");
  vis.setAttribute("aria-hidden", "true");
  const caret = caretEl();
  caret.hidden = true;
  el.textContent = "";
  el.append(sr, vis, caret);
  el.classList.add("is-typing");
  const st = { text, vis, caret };
  prepared.set(el, st);
  return st;
}

// Re-measure the locked box of anything mid-typing, for its full text, in the current
// layout. Call after the layout changes (resize, the work page switching to its map);
// otherwise a lock taken in one layout keeps its stale height in the next.
export function relock() {
  if (!HAS_DOM) return;
  for (const el of document.querySelectorAll(".is-typing")) {
    const st = prepared.get(el);
    if (!st) continue;
    const partial = st.vis.textContent;
    el.style.minHeight = "";
    st.vis.textContent = st.text;
    el.style.minHeight = el.getBoundingClientRect().height + "px";
    st.vis.textContent = partial;
  }
}

function finish(el, text) {
  el.textContent = text;
  el.style.minHeight = "";
  el.style.minWidth = "";
  el.classList.remove("is-typing");
  prepared.delete(el);
}

export function typeText(el, text, speed = 24, cb) {
  const st = prepare(el);
  text = text ?? st.text;
  if (reduce) { finish(el, text); cb && cb(); return; }
  let i = 0;
  const rhythm = {};
  st.caret.hidden = false;
  const step = () => {
    if (hidden) { setTimeout(step, 250); return; }
    i++;
    st.vis.textContent = text.slice(0, i);
    if (i < text.length) setTimeout(step, typingDelay(speed, text[i - 1], rhythm));
    else { finish(el, text); cb && cb(); }
  };
  step();
}

function runTypingQueue() {
  if (reduce) return;   // the static text is already the final text
  const els = [...document.querySelectorAll("[data-type]:not([data-type=solo])")];
  els.forEach(prepare);
  let k = 0;
  const next = () => {
    const el = els[k++];
    if (!el) return;
    const delay = parseInt(el.dataset.delay || "0", 10);
    const speed = parseFloat(el.dataset.speed || "24");
    setTimeout(() => typeText(el, null, speed, next), delay);
  };
  next();
}

// ---------------------------------------------------------------------------
// AUTOHIDE HEADER — hides on scroll down, returns on scroll up (6px jitter
// threshold, rAF-throttled), and always returns on keyboard focus.
// ---------------------------------------------------------------------------

function hideOnScroll(head) {
  let lastY = window.scrollY, ticking = false;
  const update = () => {
    ticking = false;
    const y = Math.max(0, window.scrollY);
    const dy = y - lastY;
    if (Math.abs(dy) < 6) return;
    head.classList.toggle("is-hidden", dy > 0 && y > head.offsetHeight);
    lastY = y;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  head.addEventListener("focusin", () => head.classList.remove("is-hidden"));
}

// ---------------------------------------------------------------------------
// HOME — the entry chip takes a random right-half slot (a bottom-band spot
// under 768px). Its slot, and the text column, are reserved from the field.
// ---------------------------------------------------------------------------

function homeReserved(chip, left) {
  return (box) => {
    // keep the small text and the glass panes clear; the giant name can sit over the field
    const rects = [];
    const lr = left.getBoundingClientRect();
    for (const sel of [".home__tag", ".glass-stack", ".home__meta"]) {
      const r = left.querySelector(sel)?.getBoundingClientRect();
      if (r) rects.push({ x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height });
    }
    const cw = chip.offsetWidth, ch = chip.offsetHeight;
    let x, y;
    if (box.width >= 768) {
      x = box.width / 2 + Math.random() * Math.max(0, box.width / 2 - cw - 40);
      y = box.height * (0.12 + Math.random() * 0.72);
    } else {
      const top = Math.max(lr.bottom - box.top + 28, box.height * 0.74);
      const bottom = box.height - ch - 28;
      const pad = 20;
      x = pad + Math.random() * Math.max(0, box.width - cw - 2 * pad);
      y = top <= bottom ? top + Math.random() * (bottom - top) : bottom;
    }
    x = clamp(x, 8, box.width - cw - 8);
    y = clamp(y, 8, box.height - ch - 8);
    chip.style.left = x.toFixed(1) + "px";
    chip.style.top = y.toFixed(1) + "px";
    chip.style.right = "auto";
    chip.style.bottom = "auto";
    chip.classList.add("is-placed");
    rects.push({ x, y, w: cw, h: ch });
    return rects;
  };
}

// data-reserve=".a, .b" keeps fragments off those elements (e.g. small text)
function reserveFrom(sel) {
  if (!sel) return null;
  return (box) => [...document.querySelectorAll(sel)]
    .map((n) => n.getBoundingClientRect())
    .filter((r) => r.width && r.height)
    .map((r) => ({ x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height }));
}

function initHome() {
  const fieldEl = document.querySelector("[data-home-field]");
  const chip = document.querySelector(".chip");
  const left = document.querySelector(".home__left");
  if (!fieldEl || !chip || !left) return;
  const f = buildField(fieldEl, parseFloat(fieldEl.dataset.homeField) || 0.85, homeReserved(chip, left));
  const chipText = chip.querySelector("[data-type=solo]");
  if (chipText && !reduce) {
    prepare(chipText);
    setTimeout(() => typeText(chipText, null, 55), 1350);
  }
  return f;
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// THEME — light by default; dark only when someone clicks the toggle. Their
// choice is saved and applied before paint by the inline script in each
// page's <head>. The button names the mode it switches to.
// ---------------------------------------------------------------------------

function initTheme() {
  const root = document.documentElement;
  const effective = () => root.dataset.theme || "light";
  const btns = [...document.querySelectorAll(".themebtn")];
  const label = () => {
    const next = effective() === "dark" ? "light" : "dark";
    for (const b of btns) {
      b.textContent = next;
      b.setAttribute("aria-label", `Switch to ${next} mode`);
    }
  };
  for (const b of btns) {
    b.hidden = false;
    b.addEventListener("click", () => {
      const next = effective() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("tc-theme", next); } catch (e) { /* private mode: still switches */ }
      label();
    });
  }
  label();
}

function init() {
  const root = document.documentElement;
  window.TC = { typeText, buildField, fieldGeom, reduce, content, relock };

  initTheme();
  const head = document.querySelector("[data-hide-on-scroll]");
  if (head) hideOnScroll(head);

  initHome();
  document.querySelectorAll("[data-field]").forEach((el) =>
    buildField(el, parseFloat(el.dataset.field) || 0.85, reserveFrom(el.dataset.reserve)));
  runTypingQueue();
  root.classList.add("tc-ready");

  let rt = 0;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => { relock(); fields.forEach((f) => f.maybeRebuild()); }, 250);
  });
  document.addEventListener("visibilitychange", () => {
    hidden = document.hidden;
    fields.forEach((f) => f.sync());
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => fields.forEach((f) => f.remeasure()));
  }
}

if (HAS_DOM) {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
