const app = document.getElementById('app');

if (!app) {
  throw new Error('App root was not found.');
}

app.innerHTML = `
  <div id="route-outlet"></div>
`;

const gamePageMarkup = `
  <main class="app game-page">
    <section class="shell" aria-label="Stuffed animal control room">
      <div class="panel">
        <canvas id="stage" width="960" height="640" aria-label="Playable rectangle for the squirrel sprite"></canvas>
        <div id="game-timer" class="game-timer" aria-live="off">0s</div>
        <div id="polygon-layer" class="polygon-layer" aria-hidden="true"></div>
        <div id="editor-controls" class="editor-controls" aria-label="Collision editor controls"></div>
        <div id="editor-status" class="editor-status" aria-live="polite"></div>
      </div>
    </section>
  </main>
`;

const homeBackgroundUrl = new URL('../ChatGPT Image May 22, 2026 at 07_02_43 PM.jpg', import.meta.url).href;

const style = document.createElement('style');
style.textContent = `
  :root {
    color-scheme: dark;
    --bg-0: #110f0b;
    --bg-1: #24180f;
    --panel-border: rgba(255, 235, 214, 0.22);
    --text: #fff5e8;
    --muted: rgba(255, 245, 232, 0.72);
    --accent: #ffb77c;
    --accent-strong: #ffd7b0;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    min-height: 100%;
  }

  body {
    font-family:
      ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
    color: var(--text);
    background:
      radial-gradient(circle at top, rgba(255, 180, 120, 0.18), transparent 34%),
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.08), transparent 20%),
      linear-gradient(180deg, var(--bg-1), var(--bg-0));
  }

  .app {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .text-page {
    width: min(840px, 100%);
    align-content: center;
  }

  .text-page .shell {
    gap: 22px;
  }

  .page-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .button-link {
    display: inline-flex;
    min-height: 42px;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    color: var(--text);
    font-weight: 700;
    text-decoration: none;
  }

  .home-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    overflow: hidden;
    padding: 0;
    background: #8cc3ac;
  }

  .home-art {
    position: relative;
    width: min(100vw, calc(100vh * 0.75));
    height: min(100vh, calc(100vw / 0.75));
    background-image: url("${homeBackgroundUrl}");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .home-start-hit {
    position: absolute;
    left: 23.5%;
    top: 61.5%;
    width: 53.5%;
    height: 16.6%;
    border-radius: 22px;
    color: transparent;
    text-indent: -999px;
    overflow: hidden;
  }

  .home-start-hit:focus-visible {
    outline: 4px solid rgba(255, 245, 232, 0.95);
    outline-offset: 4px;
  }

  .game-page {
    overflow: hidden;
    padding: 0;
  }

  .game-page .shell {
    width: auto;
    gap: 0;
  }

  .shell {
    width: min(1100px, 100%);
    display: grid;
    gap: 18px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: end;
    padding: 4px 2px;
  }

  .eyebrow {
    margin: 0 0 6px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--accent-strong);
  }

  h1 {
    margin: 0;
    font-size: clamp(1.8rem, 4vw, 3.6rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
  }

  .copy {
    max-width: 38rem;
    margin: 0;
    color: var(--muted);
    line-height: 1.5;
    text-align: right;
  }

  .panel {
    position: relative;
    padding: 0;
    border-radius: 0;
    background: transparent;
    border: 0;
    box-shadow: none;
    overflow: hidden;
  }

  .panel::before {
    content: none;
  }

  canvas {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0;
    background: transparent;
  }

  .game-timer {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 58px;
    padding: 7px 10px;
    background: #120d08;
    border: 1px solid rgba(255, 231, 196, 0.45);
    color: #fff5e8;
    font-size: 18px;
    font-weight: 900;
    line-height: 1;
    text-align: center;
    z-index: 5;
  }

  .polygon-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
  }

  .editor-controls {
    position: absolute;
    right: 8px;
    bottom: 8px;
    display: none;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    z-index: 4;
    pointer-events: none;
  }

.editor-status {
    position: absolute;
    right: 16px;
    bottom: 92px;
    max-width: min(340px, calc(100% - 32px));
    padding: 10px 12px;
    border-radius: 14px;
    background: rgba(16, 13, 10, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 245, 232, 0.9);
    font-size: 0.92rem;
    line-height: 1.35;
    backdrop-filter: blur(10px);
    z-index: 4;
    cursor: pointer;
    pointer-events: auto;
  }

  .editor-status[hidden] {
    display: none;
  }

  .editor-controls button,
  .polygon-delete {
    appearance: none;
    border: 0;
    border-radius: 999px;
    font: inherit;
    cursor: pointer;
    transition: transform 120ms ease, background 120ms ease, color 120ms ease, opacity 120ms ease;
  }

  .editor-controls button {
    min-width: 36px;
    min-height: 36px;
    padding: 0;
    background: rgba(18, 14, 11, 0.52);
    color: var(--text);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16);
    font-size: 1.05rem;
    letter-spacing: 0.01em;
    opacity: 0.68;
  }

  .editor-controls button[data-action="pause-toggle"] {
    display: grid;
    place-items: center;
    font-size: 1.1rem;
    opacity: 0.86;
  }

  .editor-controls button:hover,
  .polygon-delete:hover {
    transform: translateY(-1px);
  }

  .editor-controls button[data-tone="green"] {
    color: #a6ffb8;
  }

  .editor-controls button[data-tone="red"] {
    color: #ffb0a6;
  }

  .editor-controls button[data-tone="neutral"] {
    color: var(--accent-strong);
  }

  .polygon-delete {
    position: absolute;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    pointer-events: auto;
    background: rgba(14, 12, 10, 0.9);
    color: #fff3eb;
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.26);
    transform: translate(-50%, -50%);
  }

  .polygon-delete[data-kind="green"] {
    color: #a6ffb8;
  }

  .polygon-delete[data-kind="red"] {
    color: #ffb0a6;
  }

  .editor-controls button[data-tone="blue"],
  .polygon-delete[data-kind="teleport"] {
    color: #8addff;
  }

  @media (max-width: 700px) {
    .header {
      flex-direction: column;
      align-items: start;
    }

    .copy {
      text-align: left;
      max-width: none;
    }

    .panel {
      padding: 0;
    }
  }
`;
document.head.appendChild(style);

const outlet = document.getElementById('route-outlet');

if (!outlet) {
  throw new Error('Route outlet was not found.');
}

const routes = {
  '/': renderHomePage,
  '/play': renderGamePage,
  '/about': renderAboutPage,
};

let activePageCleanup = null;

function renderHomePage() {
  outlet.innerHTML = `
    <main class="home-page" aria-label="Acornquest home">
      <section class="home-art" aria-label="Acornquest title screen">
        <a class="home-start-hit" href="/play" data-route aria-label="Start game">Start</a>
      </section>
    </main>
  `;
  return () => {};
}

function renderAboutPage() {
  outlet.innerHTML = `
    <main class="app text-page">
      <section class="shell" aria-label="About Acornquest">
        <header class="header">
          <div>
            <p class="eyebrow">About</p>
            <h1>Stuffed animal control room</h1>
          </div>
          <p class="copy">
            This page is routed separately from the playable canvas so page changes can mount and unmount game controls.
          </p>
        </header>
        <div class="page-actions">
          <a class="button-link" href="/play" data-route>Play</a>
        </div>
      </section>
    </main>
  `;
  return () => {};
}

function getCurrentRoutePath() {
  return routes[window.location.pathname] ? window.location.pathname : '/';
}

function renderRoute() {
  if (activePageCleanup) {
    activePageCleanup();
    activePageCleanup = null;
  }

  const path = getCurrentRoutePath();
  activePageCleanup = routes[path]();
}

function navigateTo(path) {
  if (window.location.pathname === path) {
    renderRoute();
    return;
  }

  window.history.pushState({}, '', path);
  renderRoute();
}

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const link = target.closest('[data-route]');
  if (!(link instanceof HTMLAnchorElement) || link.origin !== window.location.origin) {
    return;
  }

  event.preventDefault();
  navigateTo(link.pathname);
});

window.addEventListener('popstate', renderRoute);

function renderGamePage() {
  outlet.innerHTML = gamePageMarkup;

const canvas = document.getElementById('stage');

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas element #stage was not found.');
}

const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('Canvas support is required.');
}

const timerDisplay = document.getElementById('game-timer');

const WORLD = {
  width: 960,
  height: 640,
};

const PLAYFIELD = {
  x: 48,
  y: 48,
  width: 864,
  height: 544,
};

const SPRITE = {
  size: 138,
  columns: 4,
  rows: 4,
  frameMs: 120,
  speed: 220,
  idleColumn: 1,
  hitboxInsetX: 18,
  facingRows: {
    up: 1,
    down: 0,
    right: 2,
    left: 3,
  },
  minScale: 0.5,
  maxScale: 1.12,
};

const PICKUP = {
  columns: 4,
  rows: 4,
  frameMs: 180,
  durationMs: 720,
  facingRows: {
    up: 1,
    down: 1,
    right: 2,
    left: 0,
  },
};

const ACORN = {
  size: 38,
  reach: 42,
  standingReach: 24,
  caveChance: 0.5,
  pathEndChance: 0.65,
  edgeChance: 0.39,
  minDistanceFromPrevious: 220,
  crop: {
    x: 24,
    y: 192,
    width: 92,
    height: 100,
  },
  regions: [
    { x: 338, y: 360, width: 128, height: 96 },
    { x: 584, y: 350, width: 118, height: 98 },
    { x: 704, y: 368, width: 104, height: 104 },
    { x: 330, y: 440, width: 150, height: 106 },
    { x: 606, y: 412, width: 128, height: 122 },
    { x: 724, y: 470, width: 126, height: 78 },
    { x: 552, y: 520, width: 148, height: 52 },
    { x: 246, y: 506, width: 112, height: 58 },
  ],
  edgeRegions: [
    { x: 340, y: 318, width: 82, height: 0 },
    { x: 586, y: 318, width: 104, height: 0 },
    { x: 704, y: 326, width: 76, height: 0 },
    { x: 334, y: 318, width: 88, height: 94 },
    { x: 574, y: 318, width: 138, height: 88 },
    { x: 704, y: 326, width: 96, height: 90 },
  ],
  pathEndRegions: [
    { x: 610, y: 222, width: 128, height: 88 },
    { x: 650, y: 258, width: 116, height: 72 },
  ],
  fallbackSpot: { x: 712, y: 506 },
  caveRegions: [
    { x: 336, y: 474, width: 142, height: 96 },
    { x: 484, y: 398, width: 132, height: 92 },
    { x: 626, y: 438, width: 112, height: 92 },
    { x: 698, y: 508, width: 132, height: 70 },
    { x: 184, y: 348, width: 136, height: 70 },
  ],
  caveEdgeRegions: [
    { x: 188, y: 318, width: 118, height: 46 },
    { x: 462, y: 358, width: 124, height: 54 },
    { x: 668, y: 408, width: 112, height: 52 },
  ],
  cavePathEndRegions: [
    { x: 610, y: 188, width: 120, height: 82 },
    { x: 698, y: 220, width: 118, height: 78 },
  ],
  caveFallbackSpot: { x: 548, y: 470 },
};

const SCENES = {
  forest: 'forest',
  cave: 'cave',
};

const FALL_DURATION_MS = 3000;
const FALL_GRAVITY = 920;
const FALL_DRIFT = -18;
const SCENE_TRANSITION_SECONDS = 0.55;
const TRANSITION_COOLDOWN_SECONDS = 0.45;
const TELEPORT_TRIGGER_PADDING = 32;
const START_POSITION = {
  x: PLAYFIELD.x + 220,
  y: PLAYFIELD.y + PLAYFIELD.height - SPRITE.size - 24,
};
const CAVE_START_POSITION = {
  x: 138,
  y: PLAYFIELD.y + PLAYFIELD.height - SPRITE.size - 16,
};
const FOREST_RETURN_POSITION = {
  x: 640,
  y: 196,
};
const DEFAULT_TELEPORT_CONFIG = {
  forest: [
    {
      id: 'forest-to-cave',
      points: [
        { x: 0.581, y: 0.085 },
        { x: 0.813, y: 0.085 },
        { x: 0.813, y: 0.511 },
        { x: 0.581, y: 0.511 },
      ],
    },
  ],
  cave: [
    {
      id: 'cave-to-forest',
      points: [
        { x: 0.696, y: 0.085 },
        { x: 0.854, y: 0.085 },
        { x: 0.854, y: 0.433 },
        { x: 0.696, y: 0.433 },
      ],
    },
  ],
};

const COLLISION_STORAGE = {
  key: 'acornquest.yyCollisionConfig',
  fileName: 'yy-collision-config.json',
};
const BOUNDARY_CONFIG_VERSION = 3;

const keys = new Set();

const forestBackgroundImage = new Image();
forestBackgroundImage.src = new URL('../ChatGPT Image May 23, 2026 at 02_24_32 PM.jpg', import.meta.url).href;

const caveBackgroundImage = new Image();
caveBackgroundImage.src = new URL('../ChatGPT Image May 27, 2026 at 04_58_18 PM.jpg', import.meta.url).href;

const spriteSheet = document.createElement('canvas');
const spriteSheetCtx = spriteSheet.getContext('2d', { willReadFrequently: true });
const spriteSheetImage = new Image();
spriteSheetImage.onload = () => {
  buildTransparentSpriteSheet();
  state.loaded = true;
};
spriteSheetImage.onerror = () => {
  state.loaded = false;
};
spriteSheetImage.src = new URL('../ChatGPT Image May 22, 2026 at 07_04_38 PM.jpg', import.meta.url).href;

const pickupSheet = document.createElement('canvas');
const pickupSheetCtx = pickupSheet.getContext('2d', { willReadFrequently: true });
const pickupSheetImage = new Image();
pickupSheetImage.onload = () => {
  buildTransparentImage(pickupSheetImage, pickupSheet, pickupSheetCtx);
  state.pickupLoaded = true;
};
pickupSheetImage.onerror = () => {
  state.pickupLoaded = false;
};
pickupSheetImage.src = new URL('../ChatGPT Image May 22, 2026 at 07_03_51 PM.jpg', import.meta.url).href;

const state = {
  x: START_POSITION.x,
  y: START_POSITION.y,
  facing: 'up',
  moving: false,
  frame: 0,
  frameTimer: 0,
  falling: false,
  fallTimer: 0,
  fallScale: 1,
  fallVelocityX: 0,
  fallVelocityY: 0,
  loaded: false,
  pickupLoaded: false,
  pickingUp: false,
  pickupTimer: 0,
  acornVisible: true,
  acornScene: SCENES.forest,
  acornSpot: { ...ACORN.fallbackSpot },
  scene: SCENES.forest,
  sceneTransition: null,
  transitionCooldown: 0,
  won: false,
  elapsedSeconds: 0,
  winSeconds: 0,
  winScene: SCENES.forest,
  paused: false,
};

if (spriteSheetImage.complete && spriteSheetImage.naturalWidth > 0) {
  buildTransparentSpriteSheet();
  state.loaded = true;
}

if (pickupSheetImage.complete && pickupSheetImage.naturalWidth > 0) {
  buildTransparentImage(pickupSheetImage, pickupSheet, pickupSheetCtx);
  state.pickupLoaded = true;
}

const BUILTIN_DEFAULT_COLLISION_CONFIG = {
  greenPolygons: [
    {
      id: 'left-tree',
      points: [
        { x: 0.000, y: 0.000 },
        { x: 0.070, y: 0.000 },
        { x: 0.088, y: 0.190 },
        { x: 0.082, y: 0.430 },
        { x: 0.057, y: 0.620 },
        { x: 0.000, y: 0.640 },
      ],
    },
    {
      id: 'center-tree',
      points: [
        { x: 0.472, y: 0.200 },
        { x: 0.552, y: 0.200 },
        { x: 0.575, y: 0.425 },
        { x: 0.578, y: 0.565 },
        { x: 0.548, y: 0.585 },
        { x: 0.470, y: 0.485 },
      ],
    },
    {
      id: 'mushroom',
      points: [
        { x: 0.805, y: 0.255 },
        { x: 0.850, y: 0.195 },
        { x: 0.918, y: 0.205 },
        { x: 0.940, y: 0.300 },
        { x: 0.925, y: 0.430 },
        { x: 0.882, y: 0.455 },
        { x: 0.822, y: 0.435 },
        { x: 0.800, y: 0.330 },
      ],
    },
    {
      id: 'right-tree',
      points: [
        { x: 0.955, y: 0.000 },
        { x: 1.000, y: 0.000 },
        { x: 1.000, y: 0.640 },
        { x: 0.968, y: 0.620 },
        { x: 0.955, y: 0.380 },
      ],
    },
  ],
  redPolygons: [
    {
      id: 'left-chasm',
      points: [
        { x: 0.000, y: 0.160 },
        { x: 0.072, y: 0.156 },
        { x: 0.118, y: 0.205 },
        { x: 0.154, y: 0.305 },
        { x: 0.176, y: 0.470 },
        { x: 0.188, y: 0.685 },
        { x: 0.190, y: 1.000 },
        { x: 0.000, y: 1.000 },
      ],
    },
  ],
};

const CAVE_COLLISION_CONFIG = normalizeCollisionConfig({
  greenPolygons: [
    {
      id: 'cave-left-wall',
      points: [
        { x: 0.000, y: 0.000 },
        { x: 0.165, y: 0.000 },
        { x: 0.155, y: 0.510 },
        { x: 0.000, y: 0.520 },
      ],
    },
    {
      id: 'cave-center-pillar',
      points: [
        { x: 0.335, y: 0.000 },
        { x: 0.515, y: 0.000 },
        { x: 0.505, y: 0.515 },
        { x: 0.430, y: 0.560 },
        { x: 0.360, y: 0.480 },
      ],
    },
    {
      id: 'cave-right-wall',
      points: [
        { x: 0.925, y: 0.000 },
        { x: 1.000, y: 0.000 },
        { x: 1.000, y: 1.000 },
        { x: 0.935, y: 0.960 },
        { x: 0.910, y: 0.570 },
      ],
    },
  ],
  redPolygons: [
    {
      id: 'cave-left-gap',
      points: [
        { x: 0.180, y: 0.370 },
        { x: 0.315, y: 0.340 },
        { x: 0.390, y: 0.565 },
        { x: 0.270, y: 0.670 },
        { x: 0.145, y: 0.570 },
      ],
    },
    {
      id: 'cave-center-gap',
      points: [
        { x: 0.445, y: 0.480 },
        { x: 0.580, y: 0.430 },
        { x: 0.645, y: 0.720 },
        { x: 0.515, y: 0.910 },
        { x: 0.380, y: 0.730 },
      ],
    },
    {
      id: 'cave-right-gap',
      points: [
        { x: 0.660, y: 0.340 },
        { x: 0.820, y: 0.300 },
        { x: 0.875, y: 0.500 },
        { x: 0.765, y: 0.610 },
        { x: 0.640, y: 0.510 },
      ],
    },
  ],
});

let committedCollisionConfig = cloneCollisionConfig(BUILTIN_DEFAULT_COLLISION_CONFIG);
let committedCaveCollisionConfig = cloneCollisionConfig(CAVE_COLLISION_CONFIG);
let committedTeleportConfig = cloneTeleportConfig(DEFAULT_TELEPORT_CONFIG);
let editorState = null;

forestBackgroundImage.onload = () => {
  if (!state.won) {
    placeAcorn();
  }
};

function buildTransparentSpriteSheet() {
  buildTransparentImage(spriteSheetImage, spriteSheet, spriteSheetCtx);
}

function buildTransparentImage(image, targetCanvas, targetContext) {
  if (!targetContext || image.naturalWidth === 0 || image.naturalHeight === 0) {
    return;
  }

  targetCanvas.width = image.naturalWidth;
  targetCanvas.height = image.naturalHeight;
  targetContext.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
  targetContext.drawImage(image, 0, 0);

  const imageData = targetContext.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245) {
      data[i + 3] = 0;
    }
  }

  targetContext.putImageData(imageData, 0, 0);
}

function createPolygonId(prefix = 'poly') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizePoint(point) {
  return {
    x: clamp(Number(point?.x) || 0, 0, 1),
    y: clamp(Number(point?.y) || 0, 0, 1),
  };
}

function normalizePolygonEntry(entry, prefix) {
  const points = Array.isArray(entry)
    ? entry
    : Array.isArray(entry?.points)
      ? entry.points
      : null;

  if (!points || points.length < 3) {
    return null;
  }

  return {
    id: typeof entry === 'object' && entry && typeof entry.id === 'string' ? entry.id : createPolygonId(prefix),
    points: points.map(normalizePoint),
  };
}

function normalizeCollisionConfig(raw) {
  return {
    greenPolygons: Array.isArray(raw?.greenPolygons)
      ? raw.greenPolygons.map((entry) => normalizePolygonEntry(entry, 'green')).filter(Boolean)
      : [],
    redPolygons: Array.isArray(raw?.redPolygons)
      ? raw.redPolygons.map((entry) => normalizePolygonEntry(entry, 'red')).filter(Boolean)
      : [],
  };
}

function normalizeTeleportConfig(raw) {
  return {
    forest: Array.isArray(raw?.forest)
      ? raw.forest.map((entry) => normalizePolygonEntry(entry, 'teleport')).filter(Boolean)
      : [],
    cave: Array.isArray(raw?.cave)
      ? raw.cave.map((entry) => normalizePolygonEntry(entry, 'teleport')).filter(Boolean)
      : [],
  };
}

function cloneCollisionConfig(config) {
  return normalizeCollisionConfig(config);
}

function cloneTeleportConfig(config) {
  return normalizeTeleportConfig(config);
}

function normalizeBoundaryConfig(raw) {
  if (raw?.version >= 2 || raw?.forestCollision || raw?.caveCollision || raw?.teleport) {
    return {
      forestCollision: cloneCollisionConfig(raw?.forestCollision || BUILTIN_DEFAULT_COLLISION_CONFIG),
      caveCollision: cloneCollisionConfig(raw?.caveCollision || CAVE_COLLISION_CONFIG),
      teleport: cloneTeleportConfig(raw?.teleport || DEFAULT_TELEPORT_CONFIG),
    };
  }

  return {
    forestCollision: cloneCollisionConfig(raw || BUILTIN_DEFAULT_COLLISION_CONFIG),
    caveCollision: cloneCollisionConfig(CAVE_COLLISION_CONFIG),
    teleport: cloneTeleportConfig(DEFAULT_TELEPORT_CONFIG),
  };
}

function serializeBoundaryConfig(config) {
  return JSON.stringify({
    version: BOUNDARY_CONFIG_VERSION,
    owner: 'user',
    updatedAt: new Date().toISOString(),
    forestCollision: {
      greenPolygons: config.forestCollision.greenPolygons.map((polygon) => ({
        id: polygon.id,
        points: polygon.points.map((point) => ({ x: point.x, y: point.y })),
      })),
      redPolygons: config.forestCollision.redPolygons.map((polygon) => ({
        id: polygon.id,
        points: polygon.points.map((point) => ({ x: point.x, y: point.y })),
      })),
    },
    caveCollision: {
      greenPolygons: config.caveCollision.greenPolygons.map((polygon) => ({
        id: polygon.id,
        points: polygon.points.map((point) => ({ x: point.x, y: point.y })),
      })),
      redPolygons: config.caveCollision.redPolygons.map((polygon) => ({
        id: polygon.id,
        points: polygon.points.map((point) => ({ x: point.x, y: point.y })),
      })),
    },
    teleport: {
      forest: config.teleport.forest.map((polygon) => ({
        id: polygon.id,
        points: polygon.points.map((point) => ({ x: point.x, y: point.y })),
      })),
      cave: config.teleport.cave.map((polygon) => ({
        id: polygon.id,
        points: polygon.points.map((point) => ({ x: point.x, y: point.y })),
      })),
    },
  }, null, 2);
}

function getEditorModeLabel(mode) {
  if (mode === 'teleport') {
    return 'teleport boundaries';
  }

  return mode === 'green' ? 'green boundaries' : 'red boundaries';
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function distanceBetweenPoints(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getActiveBackgroundImage(scene = state.scene) {
  return scene === SCENES.cave ? caveBackgroundImage : forestBackgroundImage;
}

function getActiveCollisionConfig(scene = state.scene) {
  return scene === SCENES.cave ? committedCaveCollisionConfig : committedCollisionConfig;
}

function getSpriteScale(y) {
  const minY = PLAYFIELD.y;
  const maxY = PLAYFIELD.y + PLAYFIELD.height - SPRITE.size;
  const t = clamp((y - minY) / (maxY - minY || 1), 0, 1);
  const eased = Math.pow(t, 1.45);
  return SPRITE.minScale + (SPRITE.maxScale - SPRITE.minScale) * eased;
}

function getSpriteDrawScale() {
  if (state.falling) {
    return state.fallScale;
  }

  return getSpriteScale(state.y);
}

function getMovementBounds(y) {
  const scale = getSpriteScale(y);
  const drawSize = SPRITE.size * scale;
  const sideInset = (SPRITE.size - drawSize) / 2;
  const topInset = SPRITE.size - drawSize;

  return {
    minX: PLAYFIELD.x - sideInset,
    maxX: PLAYFIELD.x + PLAYFIELD.width - drawSize - sideInset,
    minY: PLAYFIELD.y - topInset,
    maxY: PLAYFIELD.y + PLAYFIELD.height - SPRITE.size,
  };
}

function clampYYPosition(x, y) {
  const yBounds = getMovementBounds(y);
  const clampedY = clamp(y, yBounds.minY, yBounds.maxY);
  const xBounds = getMovementBounds(clampedY);

  return {
    x: clamp(x, xBounds.minX, xBounds.maxX),
    y: clampedY,
  };
}

function getBackgroundPlacement(scene = state.scene) {
  const backgroundImage = getActiveBackgroundImage(scene);
  if (!backgroundImage.complete || backgroundImage.naturalWidth === 0 || backgroundImage.naturalHeight === 0) {
    return null;
  }

  const imageRatio = backgroundImage.naturalWidth / backgroundImage.naturalHeight;
  const worldRatio = WORLD.width / WORLD.height;

  if (imageRatio > worldRatio) {
    const drawHeight = WORLD.height;
    const drawWidth = Math.ceil(drawHeight * imageRatio);
    return {
      x: Math.floor((WORLD.width - drawWidth) / 2),
      y: 0,
      width: drawWidth,
      height: drawHeight,
    };
  }

  const drawWidth = WORLD.width;
  const drawHeight = Math.ceil(drawWidth / imageRatio);
  return {
    x: 0,
    y: Math.floor((WORLD.height - drawHeight) / 2),
    width: drawWidth,
    height: drawHeight,
  };
}

function worldToNormalized(point) {
  const placement = getBackgroundPlacement();
  if (!placement) {
    return { x: 0, y: 0 };
  }

  return {
    x: clamp((point.x - placement.x) / (placement.width || 1), 0, 1),
    y: clamp((point.y - placement.y) / (placement.height || 1), 0, 1),
  };
}

function mapPolygonToWorld(placement, polygon) {
  return polygon.map((point) => ({
    x: placement.x + placement.width * point.x,
    y: placement.y + placement.height * point.y,
  }));
}

function getObstaclePolygons(scene = state.scene) {
  const placement = getBackgroundPlacement(scene);
  if (!placement) {
    return [];
  }

  return getActiveCollisionConfig(scene).greenPolygons.map((polygon) => mapPolygonToWorld(placement, polygon.points));
}

function getHazardPolygons(scene = state.scene) {
  const placement = getBackgroundPlacement(scene);
  if (!placement) {
    return [];
  }

  return getActiveCollisionConfig(scene).redPolygons.map((polygon) => mapPolygonToWorld(placement, polygon.points));
}

function getTeleportPolygons(scene = state.scene) {
  const placement = getBackgroundPlacement(scene);
  if (!placement) {
    return [];
  }

  const polygons = scene === SCENES.cave ? committedTeleportConfig.cave : committedTeleportConfig.forest;
  return polygons.map((polygon) => mapPolygonToWorld(placement, polygon.points));
}

function getSpriteHitbox(x, y, scale = 1) {
  const width = SPRITE.size * scale;
  const hitboxWidth = width * 0.2;
  const hitboxHeight = width * 0.1;
  const left = x + (SPRITE.size - hitboxWidth) / 2;
  const top = y + SPRITE.size - hitboxHeight;
  return {
    left,
    top,
    right: left + hitboxWidth,
    bottom: y + SPRITE.size,
  };
}

function getSpriteFootPoint() {
  const scale = getSpriteScale(state.y);
  const hitbox = getSpriteHitbox(state.x, state.y, scale);
  return {
    x: (hitbox.left + hitbox.right) / 2,
    y: hitbox.bottom,
  };
}

function getSpriteFootPointAt(x, y) {
  const scale = getSpriteScale(y);
  const hitbox = getSpriteHitbox(x, y, scale);
  return {
    x: (hitbox.left + hitbox.right) / 2,
    y: hitbox.bottom,
  };
}

function getFacingPickupPoint() {
  const foot = getSpriteFootPoint();

  if (state.facing === 'left') {
    return { x: foot.x - ACORN.reach * 0.75, y: foot.y - 10 };
  }

  if (state.facing === 'right') {
    return { x: foot.x + ACORN.reach * 0.75, y: foot.y - 10 };
  }

  if (state.facing === 'up') {
    return { x: foot.x, y: foot.y - ACORN.reach * 0.75 };
  }

  return { x: foot.x, y: foot.y + ACORN.reach * 0.25 };
}

function getYYPositionForFootPoint(point) {
  return clampYYPosition(point.x - SPRITE.size / 2, point.y - SPRITE.size);
}

function getCurrentAcornSpot() {
  return state.acornSpot;
}

function isNearAcorn() {
  if (state.scene !== state.acornScene || !state.acornVisible || state.won) {
    return false;
  }

  const foot = getSpriteFootPoint();
  const facingTarget = getFacingPickupPoint();
  const acorn = getCurrentAcornSpot();
  return distanceBetweenPoints(foot, acorn) <= ACORN.standingReach
    || distanceBetweenPoints(facingTarget, acorn) <= ACORN.reach;
}

function isReachableAcornSpot(point, scene = state.scene) {
  const yyPosition = getYYPositionForFootPoint(point);
  const footAtPosition = getSpriteFootPointAt(yyPosition.x, yyPosition.y);

  if (distanceBetweenPoints(footAtPosition, point) > ACORN.reach * 0.7) {
    return false;
  }

  return !collidesAt(yyPosition.x, yyPosition.y, scene) && !fallsIntoChasmAt(yyPosition.x, yyPosition.y, scene);
}

function getRandomPointInRegion(region) {
  return {
    x: region.x + Math.random() * region.width,
    y: region.y + Math.random() * region.height,
  };
}

function findRandomReachableAcornSpot(regions, previousSpot = state.acornSpot, attemptLimit = 120, scene = state.scene) {
  const shuffledRegions = [...regions].sort(() => Math.random() - 0.5);
  let bestSpot = null;
  let bestDistance = -1;

  for (let attempt = 0; attempt < attemptLimit; attempt += 1) {
    const region = shuffledRegions[attempt % shuffledRegions.length];
    const candidate = getRandomPointInRegion(region);

    if (!isReachableAcornSpot(candidate, scene)) {
      continue;
    }

    const distanceFromPrevious = previousSpot ? distanceBetweenPoints(candidate, previousSpot) : Number.POSITIVE_INFINITY;

    if (distanceFromPrevious > bestDistance) {
      bestSpot = candidate;
      bestDistance = distanceFromPrevious;
    }

    if (distanceFromPrevious >= ACORN.minDistanceFromPrevious) {
      return candidate;
    }
  }

  return bestSpot;
}

function chooseRandomAcornSpot(scene, previousSpot = state.acornSpot) {
  const regions = scene === SCENES.cave ? ACORN.caveRegions : ACORN.regions;
  const edgeRegions = scene === SCENES.cave ? ACORN.caveEdgeRegions : ACORN.edgeRegions;
  const pathEndRegions = scene === SCENES.cave ? ACORN.cavePathEndRegions : ACORN.pathEndRegions;
  const fallbackSpot = scene === SCENES.cave ? ACORN.caveFallbackSpot : ACORN.fallbackSpot;

  if (Math.random() < ACORN.pathEndChance) {
    const pathEndSpot = findRandomReachableAcornSpot(pathEndRegions, previousSpot, 140, scene);
    if (pathEndSpot) {
      return pathEndSpot;
    }
  }

  if (Math.random() < ACORN.edgeChance) {
    const edgeSpot = findRandomReachableAcornSpot(edgeRegions, previousSpot, 80, scene);
    if (edgeSpot) {
      return edgeSpot;
    }
  }

  return findRandomReachableAcornSpot(regions, previousSpot, 120, scene) || fallbackSpot;
}

function placeAcorn() {
  const scene = Math.random() < ACORN.caveChance ? SCENES.cave : SCENES.forest;
  const previousSpot = state.acornScene === scene ? state.acornSpot : null;
  state.acornScene = scene;
  state.acornSpot = chooseRandomAcornSpot(scene, previousSpot);
  state.acornVisible = state.scene === state.acornScene && !state.won;
}

function getSceneStartPosition(scene = state.scene) {
  return scene === SCENES.cave ? CAVE_START_POSITION : START_POSITION;
}

function moveYYTo(position, facing = state.facing) {
  const clamped = clampYYPosition(position.x, position.y);
  state.x = clamped.x;
  state.y = clamped.y;
  state.facing = facing;
  state.moving = false;
  state.frameTimer = 0;
}

function completeSceneTransition() {
  if (!state.sceneTransition || state.sceneTransition.swapped) {
    return;
  }

  const { to, position, facing } = state.sceneTransition;
  state.scene = to;
  state.falling = false;
  state.fallTimer = 0;
  state.fallScale = 1;
  state.fallVelocityX = 0;
  state.fallVelocityY = 0;
  state.pickingUp = false;
  state.pickupTimer = 0;
  state.acornVisible = to === state.acornScene && !state.won;
  moveYYTo(position, facing);
  state.sceneTransition.swapped = true;
  updateEditorControls();
}

function beginSceneTransition(scene, position, facing) {
  if (state.sceneTransition) {
    return;
  }

  state.sceneTransition = {
    from: state.scene,
    to: scene,
    position,
    facing,
    timer: 0,
    swapped: false,
  };
  state.transitionCooldown = TRANSITION_COOLDOWN_SECONDS + SCENE_TRANSITION_SECONDS;
  state.moving = false;
  state.frameTimer = 0;
  keys.clear();
}

function updateSceneTransition(dt) {
  if (!state.sceneTransition) {
    return false;
  }

  state.sceneTransition.timer += dt;
  if (state.sceneTransition.timer >= SCENE_TRANSITION_SECONDS / 2) {
    completeSceneTransition();
  }

  if (state.sceneTransition.timer >= SCENE_TRANSITION_SECONDS) {
    completeSceneTransition();
    state.sceneTransition = null;
  }

  state.moving = false;
  state.frameTimer = 0;
  return true;
}

function yyIntersectsTeleportPolygonAt(x, y, polygon) {
  const foot = getSpriteFootPointAt(x, y);
  const hitbox = getSpriteHitbox(x, y, getSpriteScale(y));
  const triggerBox = {
    left: hitbox.left - TELEPORT_TRIGGER_PADDING,
    top: hitbox.top - TELEPORT_TRIGGER_PADDING,
    right: hitbox.right + TELEPORT_TRIGGER_PADDING,
    bottom: hitbox.bottom + TELEPORT_TRIGGER_PADDING,
  };

  return pointInPolygon(foot, polygon) || polygonIntersectsRect(polygon, triggerBox);
}

function checkSceneTransitions(x = state.x, y = state.y) {
  if (state.transitionCooldown > 0 || state.sceneTransition || state.falling || state.pickingUp || state.won) {
    return false;
  }

  if (state.scene === SCENES.forest && getTeleportPolygons(SCENES.forest).some((polygon) => yyIntersectsTeleportPolygonAt(x, y, polygon))) {
    beginSceneTransition(SCENES.cave, CAVE_START_POSITION, 'up');
    return true;
  }

  if (state.scene === SCENES.cave && getTeleportPolygons(SCENES.cave).some((polygon) => yyIntersectsTeleportPolygonAt(x, y, polygon))) {
    beginSceneTransition(SCENES.forest, FOREST_RETURN_POSITION, 'down');
    return true;
  }

  return false;
}

function rectsOverlap(a, b) {
  return a.left < b.x + b.width && a.right > b.x && a.top < b.y + b.height && a.bottom > b.y;
}

function pointInPolygon(point, polygon) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersects = (yi > point.y) !== (yj > point.y)
      && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi || 1) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function orientation(a, b, c) {
  const value = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (Math.abs(value) < 1e-9) {
    return 0;
  }
  return value > 0 ? 1 : 2;
}

function onSegment(a, b, c) {
  return (
    Math.min(a.x, c.x) <= b.x &&
    b.x <= Math.max(a.x, c.x) &&
    Math.min(a.y, c.y) <= b.y &&
    b.y <= Math.max(a.y, c.y)
  );
}

function segmentsIntersect(p1, q1, p2, q2) {
  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  if (o1 === 0 && onSegment(p1, p2, q1)) return true;
  if (o2 === 0 && onSegment(p1, q2, q1)) return true;
  if (o3 === 0 && onSegment(p2, p1, q2)) return true;
  if (o4 === 0 && onSegment(p2, q1, q2)) return true;

  return false;
}

function polygonIntersectsRect(polygon, rect) {
  const rectPoints = [
    { x: rect.left, y: rect.top },
    { x: rect.right, y: rect.top },
    { x: rect.right, y: rect.bottom },
    { x: rect.left, y: rect.bottom },
  ];

  if (rectPoints.some((point) => pointInPolygon(point, polygon))) {
    return true;
  }

  if (polygon.some((point) => point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom)) {
    return true;
  }

  const polygonEdges = polygon.map((point, index) => [point, polygon[(index + 1) % polygon.length]]);
  const rectEdges = [
    [rectPoints[0], rectPoints[1]],
    [rectPoints[1], rectPoints[2]],
    [rectPoints[2], rectPoints[3]],
    [rectPoints[3], rectPoints[0]],
  ];

  return polygonEdges.some(([a, b]) => rectEdges.some(([c, d]) => segmentsIntersect(a, b, c, d)));
}

function collidesAt(x, y, scene = state.scene) {
  const hitbox = getSpriteHitbox(x, y, getSpriteScale(y));
  return getObstaclePolygons(scene).some((polygon) => polygonIntersectsRect(polygon, hitbox));
}

function fallsIntoChasmAt(x, y, scene = state.scene) {
  const foot = getSpriteFootPointAt(x, y);
  return getHazardPolygons(scene).some((polygon) => pointInPolygon(foot, polygon));
}

function resetYY() {
  const start = getSceneStartPosition();
  state.x = start.x;
  state.y = start.y;
  state.facing = 'up';
  state.moving = false;
  state.frame = 0;
  state.frameTimer = 0;
  state.falling = false;
  state.fallTimer = 0;
  state.fallScale = 1;
  state.fallVelocityX = 0;
  state.fallVelocityY = 0;
  state.pickingUp = false;
  state.pickupTimer = 0;
  state.sceneTransition = null;
  state.transitionCooldown = TRANSITION_COOLDOWN_SECONDS;
}

function updateTimerDisplay() {
  if (timerDisplay) {
    timerDisplay.textContent = `${Math.floor(state.elapsedSeconds)}s`;
  }
}

function getPauseButtonLabel() {
  return state.paused ? 'Resume game' : 'Pause game';
}

function getPauseButtonIcon() {
  return state.paused ? '▶' : '⏸';
}

function updatePauseButton() {
  const button = document.querySelector('[data-action="pause-toggle"]');
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  button.textContent = getPauseButtonIcon();
  button.title = getPauseButtonLabel();
  button.setAttribute('aria-label', getPauseButtonLabel());
  button.setAttribute('aria-pressed', String(state.paused));
}

function togglePaused() {
  if (state.won || editorState) {
    return;
  }

  state.paused = !state.paused;
  state.moving = false;
  state.frameTimer = 0;
  keys.clear();
  updatePauseButton();
}

function startFalling() {
  if (state.falling || state.pickingUp || state.won) {
    return;
  }

  state.falling = true;
  state.fallTimer = 0;
  state.fallScale = getSpriteScale(state.y);
  state.moving = false;
  state.frameTimer = 0;
  state.fallVelocityX = FALL_DRIFT;
  state.fallVelocityY = 180;
}

function startPickup() {
  if (state.pickingUp || state.falling || !isNearAcorn()) {
    return;
  }

  keys.clear();
  state.pickingUp = true;
  state.pickupTimer = 0;
  state.acornVisible = false;
  state.moving = false;
  state.frame = 0;
  state.frameTimer = 0;
}

function completePickup() {
  state.pickingUp = false;
  state.pickupTimer = 0;
  state.won = true;
  state.winSeconds = Math.floor(state.elapsedSeconds);
  state.winScene = state.scene;
  state.moving = false;
  keys.clear();
  updateTimerDisplay();
}

function resetRoundAfterWin() {
  if (!state.won) {
    return;
  }

  const activeBoundaryConfig = getCommittedBoundaryConfig();
  const respawnScene = state.winScene;

  state.won = false;
  state.scene = respawnScene;
  state.sceneTransition = null;
  state.elapsedSeconds = 0;
  state.winSeconds = 0;
  state.paused = false;
  resetYY();
  committedCollisionConfig = cloneCollisionConfig(activeBoundaryConfig.forestCollision);
  committedCaveCollisionConfig = cloneCollisionConfig(activeBoundaryConfig.caveCollision);
  committedTeleportConfig = cloneTeleportConfig(activeBoundaryConfig.teleport);
  placeAcorn();
  keys.clear();
  updateTimerDisplay();
  updateEditorControls();
  updatePauseButton();
}

function setEditorStatus(message) {
  const status = document.getElementById('editor-status');
  if (status) {
    status.textContent = message;
    status.hidden = !message;
  }
}

function updateEditorControls() {
  const controls = document.getElementById('editor-controls');
  if (!controls) {
    return;
  }

  if (!editorState) {
    const sceneLabel = state.scene === SCENES.cave ? 'cave' : 'forest';
    controls.innerHTML = `
      <button type="button" data-tone="neutral" data-action="pause-toggle" aria-label="${getPauseButtonLabel()}" aria-pressed="${state.paused}" title="${getPauseButtonLabel()}">${getPauseButtonIcon()}</button>
      <button type="button" data-tone="green" data-action="mode" data-mode="green" aria-label="Edit green ${sceneLabel} boundaries" title="Edit green ${sceneLabel} boundaries">G</button>
      <button type="button" data-tone="red" data-action="mode" data-mode="red" aria-label="Edit red ${sceneLabel} boundaries" title="Edit red ${sceneLabel} boundaries">R</button>
      <button type="button" data-tone="blue" data-action="mode" data-mode="teleport" aria-label="Edit ${sceneLabel} teleport boundaries" title="Edit ${sceneLabel} teleport boundaries">T</button>
    `;
    return;
  }

  controls.innerHTML = `
    <button type="button" data-tone="neutral" data-action="save">Save</button>
    <button type="button" data-tone="neutral" data-action="cancel">Cancel</button>
  `;
}

function overlayPointToWorld(point) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return null;
  }

  const worldX = ((point.clientX - rect.left) / rect.width) * WORLD.width;
  const worldY = ((point.clientY - rect.top) / rect.height) * WORLD.height;
  return { x: worldX, y: worldY };
}

function worldToOverlayPoint(point) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return null;
  }

  return {
    x: (point.x / WORLD.width) * rect.width,
    y: (point.y / WORLD.height) * rect.height,
  };
}

function createPolygonFromDraft(points, prefix) {
  if (points.length < 3) {
    return null;
  }

  return {
    id: createPolygonId(prefix),
    points: points.map(normalizePoint),
  };
}

function enterEditorMode(mode) {
  keys.clear();
  editorState = {
    mode,
    scene: state.scene,
    draftConfig: cloneCollisionConfig(getActiveCollisionConfig()),
    draftTeleportConfig: cloneTeleportConfig(committedTeleportConfig),
    draftPoints: [],
  };
  updateEditorControls();
  setEditorStatus(`Editing ${state.scene} ${getEditorModeLabel(mode)}. Click points to draw a polygon, click near the first point to close it, and use Save or Cancel when you are done.`);
  render();
}

function exitEditorMode() {
  keys.clear();
  editorState = null;
  updateEditorControls();
  setEditorStatus('');
  render();
}

function finalizeDraftPolygon(force = false) {
  if (!editorState || editorState.draftPoints.length < 3) {
    editorState.draftPoints = [];
    return false;
  }

  if (!force && editorState.draftPoints.length >= 3) {
    const first = editorState.draftPoints[0];
    const last = editorState.draftPoints[editorState.draftPoints.length - 1];
    if (distanceBetweenPoints(first, last) > 18) {
      return false;
    }
  }

  const polygon = createPolygonFromDraft(editorState.draftPoints, editorState.mode);
  if (!polygon) {
    editorState.draftPoints = [];
    return false;
  }

  if (editorState.mode === 'teleport') {
    const key = editorState.scene === SCENES.cave ? 'cave' : 'forest';
    editorState.draftTeleportConfig[key] = [...editorState.draftTeleportConfig[key], polygon];
  } else {
    const key = editorState.mode === 'red' ? 'redPolygons' : 'greenPolygons';
    editorState.draftConfig[key] = [...editorState.draftConfig[key], polygon];
  }
  editorState.draftPoints = [];
  return true;
}

function deleteEditorPolygon(id) {
  if (!editorState) {
    return;
  }

  if (editorState.mode === 'teleport') {
    const key = editorState.scene === SCENES.cave ? 'cave' : 'forest';
    editorState.draftTeleportConfig[key] = editorState.draftTeleportConfig[key].filter((polygon) => polygon.id !== id);
  } else {
    const key = editorState.mode === 'red' ? 'redPolygons' : 'greenPolygons';
    editorState.draftConfig[key] = editorState.draftConfig[key].filter((polygon) => polygon.id !== id);
  }
  render();
}

function handleEditorDraftPoint(worldPoint) {
  if (!editorState) {
    return;
  }

  const draftPoint = worldToNormalized(worldPoint);

  if (editorState.draftPoints.length >= 3) {
    const firstPoint = editorState.draftPoints[0];
    if (distanceBetweenPoints(firstPoint, draftPoint) <= 0.035) {
      finalizeDraftPolygon(true);
      render();
      return;
    }
  }

  editorState.draftPoints.push(draftPoint);
  render();
}

function handlePolygonLayerClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest('.polygon-delete');
  if (!(button instanceof HTMLElement)) {
    return;
  }

  const polygonId = button.dataset.polygonId;
  if (!polygonId) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  deleteEditorPolygon(polygonId);
}

function getCommittedBoundaryConfig() {
  return {
    forestCollision: cloneCollisionConfig(committedCollisionConfig),
    caveCollision: cloneCollisionConfig(committedCaveCollisionConfig),
    teleport: cloneTeleportConfig(committedTeleportConfig),
  };
}

async function persistBoundaryConfig(config = getCommittedBoundaryConfig()) {
  const json = serializeBoundaryConfig(normalizeBoundaryConfig(config));

  if (navigator.storage?.getDirectory) {
    try {
      const root = await navigator.storage.getDirectory();
      const handle = await root.getFileHandle(COLLISION_STORAGE.fileName, { create: true });
      const writable = await handle.createWritable();
      await writable.write(json);
      await writable.close();
    } catch (error) {
      // Fall back to localStorage when OPFS is unavailable or blocked.
    }
  }

  try {
    localStorage.setItem(COLLISION_STORAGE.key, json);
  } catch (error) {
    // Nothing else to do if browser storage is blocked.
  }
}

function parseStoredBoundaryConfig(text) {
  if (!text) {
    return null;
  }

  try {
    const raw = JSON.parse(text);
    return {
      config: normalizeBoundaryConfig(raw),
      updatedAt: Number.isFinite(Date.parse(raw?.updatedAt)) ? Date.parse(raw.updatedAt) : 0,
    };
  } catch (error) {
    return null;
  }
}

async function readPersistedBoundaryConfig() {
  try {
    const response = await fetch('/yy-collision-default.json', { cache: 'no-cache' });
    if (response.ok) {
      return normalizeBoundaryConfig(await response.json());
    }
  } catch (error) {
    // Fall back to the built-in object below.
  }

  return normalizeBoundaryConfig(null);
}

async function bootstrapCollisionConfig() {
  const config = await readPersistedBoundaryConfig();
  committedCollisionConfig = cloneCollisionConfig(config.forestCollision);
  committedCaveCollisionConfig = cloneCollisionConfig(config.caveCollision);
  committedTeleportConfig = cloneTeleportConfig(config.teleport);
  placeAcorn();
  setEditorStatus('');
  if (!editorState) {
    render();
  }
}

function normalizeKey(value) {
  if (value === ' ') {
    return 'Space';
  }
  return value.length === 1 ? value.toLowerCase() : value;
}

function isPressed(...options) {
  return options.some((option) => keys.has(option));
}

function roundRectPath(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function resizeCanvas() {
  const availableWidth = window.innerWidth;
  const availableHeight = window.innerHeight;
  const scale = Math.min(availableWidth / WORLD.width, availableHeight / WORLD.height);
  const dpr = window.devicePixelRatio || 1;

  canvas.style.width = `${Math.max(1, Math.round(WORLD.width * scale))}px`;
  canvas.style.height = `${Math.max(1, Math.round(WORLD.height * scale))}px`;
  canvas.width = Math.max(1, Math.round(WORLD.width * scale * dpr));
  canvas.height = Math.max(1, Math.round(WORLD.height * scale * dpr));
  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}

function handleKeyDown(event) {
  if (state.won) {
    event.preventDefault();
    resetRoundAfterWin();
    return;
  }

  if (state.paused) {
    if (
      event.code === 'Space' ||
      event.code === 'ArrowLeft' ||
      event.code === 'ArrowRight' ||
      event.code === 'ArrowUp' ||
      event.code === 'ArrowDown'
    ) {
      event.preventDefault();
    }
    return;
  }

  keys.add(event.code);
  keys.add(normalizeKey(event.key));

  if (event.code === 'Space' || normalizeKey(event.key) === 'Space') {
    event.preventDefault();
    startPickup();
    return;
  }

  if (
    event.code === 'ArrowLeft' ||
    event.code === 'ArrowRight' ||
    event.code === 'ArrowUp' ||
    event.code === 'ArrowDown'
  ) {
    event.preventDefault();
  }
}

function handleKeyUp(event) {
  keys.delete(event.code);
  keys.delete(normalizeKey(event.key));
}

function handleBlur() {
  keys.clear();
}

function handleCanvasPointerDown(event) {
  if (!editorState) {
    return;
  }

  event.preventDefault();

  const worldPoint = overlayPointToWorld(event);
  if (!worldPoint) {
    return;
  }

  handleEditorDraftPoint(worldPoint);
}

function handlePolygonLayerPointerDown(event) {
  if (!editorState) {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest('.polygon-delete');
  if (button instanceof HTMLElement) {
    const polygonId = button.dataset.polygonId;
    if (polygonId) {
      event.preventDefault();
      event.stopPropagation();
      deleteEditorPolygon(polygonId);
    }
    return;
  }

  event.preventDefault();
  const worldPoint = overlayPointToWorld(event);
  if (!worldPoint) {
    return;
  }

  handleEditorDraftPoint(worldPoint);
}

function handleWindowPointerDown(event) {
  if (!state.won) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  resetRoundAfterWin();
}

function handleEditorControlsClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.dataset.action;
  if (!action) {
    return;
  }

  if (action === 'mode') {
    const mode = target.dataset.mode;
    if (mode === 'green' || mode === 'red' || mode === 'teleport') {
      enterEditorMode(mode);
    }
    return;
  }

  if (action === 'pause-toggle') {
    togglePaused();
    return;
  }

  if (!editorState) {
    return;
  }

  if (action === 'save') {
    finalizeDraftPolygon(true);
    if (editorState.mode === 'teleport') {
      committedTeleportConfig = cloneTeleportConfig(editorState.draftTeleportConfig);
    } else if (editorState.scene === SCENES.cave) {
      committedCaveCollisionConfig = cloneCollisionConfig(editorState.draftConfig);
    } else {
      committedCollisionConfig = cloneCollisionConfig(editorState.draftConfig);
    }
    persistBoundaryConfig().catch(() => {
      // Saving is best-effort; the committed config is still applied in memory.
    });
    exitEditorMode();
    return;
  }

  if (action === 'cancel') {
    exitEditorMode();
  }
}

function update(dt) {
  if (editorState) {
    state.moving = false;
    state.frameTimer = 0;
    return;
  }

  if (state.won) {
    state.moving = false;
    state.frameTimer = 0;
    return;
  }

  if (state.paused) {
    state.moving = false;
    state.frameTimer = 0;
    return;
  }

  state.elapsedSeconds += dt;
  state.transitionCooldown = Math.max(0, state.transitionCooldown - dt);
  updateTimerDisplay();

  if (updateSceneTransition(dt)) {
    return;
  }

  if (state.falling) {
    state.fallTimer += dt;
    state.fallVelocityY += FALL_GRAVITY * dt;
    state.x += state.fallVelocityX * dt;
    state.y += state.fallVelocityY * dt;

    if (state.fallTimer >= FALL_DURATION_MS / 1000) {
      resetYY();
    }

    return;
  }

  if (state.pickingUp) {
    state.pickupTimer += dt;
    state.moving = false;

    if (state.pickupTimer >= PICKUP.durationMs / 1000) {
      completePickup();
    }

    return;
  }

  if (checkSceneTransitions()) {
    return;
  }

  const left = isPressed('ArrowLeft');
  const right = isPressed('ArrowRight');
  const up = isPressed('ArrowUp');
  const down = isPressed('ArrowDown');

  let dx = (right ? 1 : 0) - (left ? 1 : 0);
  let dy = (down ? 1 : 0) - (up ? 1 : 0);
  const moving = dx !== 0 || dy !== 0;

  state.moving = moving;

  if (moving) {
    if (Math.abs(dy) >= Math.abs(dx)) {
      if (dy < 0) {
        state.facing = 'up';
      } else if (dy > 0) {
        state.facing = 'down';
      }
    } else if (dx < 0) {
      state.facing = 'left';
    } else if (dx > 0) {
      state.facing = 'right';
    }

    const distance = Math.hypot(dx, dy) || 1;
    dx /= distance;
    dy /= distance;

    const nextX = clampYYPosition(state.x + dx * SPRITE.speed * dt, state.y).x;
    if (checkSceneTransitions(nextX, state.y)) {
      return;
    }

    const fallCheckX = nextX;
    const fallCheckY = state.y;
    if (fallsIntoChasmAt(fallCheckX, fallCheckY)) {
      state.x = fallCheckX;
      state.y = fallCheckY;
      startFalling();
      return;
    }

    if (!collidesAt(nextX, state.y)) {
      state.x = nextX;
    }

    const nextY = clampYYPosition(state.x, state.y + dy * SPRITE.speed * dt).y;
    if (checkSceneTransitions(state.x, nextY)) {
      return;
    }

    if (fallsIntoChasmAt(state.x, nextY)) {
      state.x = state.x;
      state.y = nextY;
      startFalling();
      return;
    }

    if (!collidesAt(state.x, nextY)) {
      state.y = nextY;
    }

    if (checkSceneTransitions()) {
      return;
    }

    state.frameTimer += dt;
    const frameInterval = SPRITE.frameMs / 1000;
    while (state.frameTimer >= frameInterval) {
      state.frame = (state.frame + 1) % SPRITE.columns;
      state.frameTimer -= frameInterval;
    }
  } else {
    state.frameTimer = 0;
  }
}

function drawSprite() {
  if (!state.loaded) {
    const scale = getSpriteDrawScale();
    const drawSize = SPRITE.size * scale;
    const drawX = state.x + (SPRITE.size - drawSize) / 2;
    const drawY = state.y + (SPRITE.size - drawSize);
    ctx.save();
    ctx.fillStyle = 'rgba(255, 178, 117, 0.25)';
    ctx.strokeStyle = 'rgba(255, 220, 196, 0.85)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(drawX + drawSize / 2, drawY + drawSize / 2, drawSize * 0.42, drawSize * 0.52, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 245, 232, 0.9)';
    ctx.font = '700 16px ui-sans-serif, system-ui, sans-serif';
    ctx.fillText('loading squirrel', drawX + 12, drawY + drawSize + 22);
    ctx.restore();
    return;
  }

  const sheet = state.pickingUp && state.pickupLoaded ? pickupSheet : spriteSheet;
  const columns = state.pickingUp && state.pickupLoaded ? PICKUP.columns : SPRITE.columns;
  const rows = state.pickingUp && state.pickupLoaded ? PICKUP.rows : SPRITE.rows;
  const sourceWidth = sheet.width / columns;
  const sourceHeight = sheet.height / rows;
  const row = state.pickingUp && state.pickupLoaded
    ? PICKUP.facingRows[state.facing]
    : SPRITE.facingRows[state.facing];
  const pickupFrame = Math.min(
    columns - 1,
    Math.floor(state.pickupTimer / (PICKUP.frameMs / 1000)),
  );
  const sourceX = (state.pickingUp && state.pickupLoaded
    ? pickupFrame
    : state.moving
      ? state.frame
      : SPRITE.idleColumn) * sourceWidth;
  const sourceY = row * sourceHeight;
  const bob = state.moving && !state.pickingUp ? Math.sin((state.frameTimer / SPRITE.frameMs) * Math.PI) * 7 : 0;
  const scale = getSpriteDrawScale();
  const drawSize = SPRITE.size * scale;
  const drawX = state.x + (SPRITE.size - drawSize) / 2;
  const drawY = state.y + (SPRITE.size - drawSize) + bob;

  ctx.save();
  ctx.shadowColor = 'rgba(63, 36, 20, 0.25)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 8;
  ctx.drawImage(
    sheet,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    drawX,
    drawY,
    drawSize,
    drawSize,
  );
  ctx.restore();
}

function drawAcorn() {
  if (state.scene !== state.acornScene || !state.acornVisible || pickupSheet.width === 0 || pickupSheet.height === 0) {
    return;
  }

  const spot = getCurrentAcornSpot();
  const size = ACORN.size;
  const drawX = spot.x - size / 2;
  const drawY = spot.y - size;

  ctx.save();
  ctx.shadowColor = 'rgba(40, 22, 10, 0.28)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;
  ctx.drawImage(
    pickupSheet,
    ACORN.crop.x,
    ACORN.crop.y,
    ACORN.crop.width,
    ACORN.crop.height,
    drawX,
    drawY,
    size,
    size,
  );

  ctx.restore();
}

function drawPolygonPath(context, polygon) {
  if (!polygon || polygon.length === 0) {
    return;
  }

  context.beginPath();
  context.moveTo(polygon[0].x, polygon[0].y);
  for (let i = 1; i < polygon.length; i += 1) {
    context.lineTo(polygon[i].x, polygon[i].y);
  }
  context.closePath();
}

function getPolygonBounds(polygon) {
  return polygon.reduce(
    (bounds, point) => ({
      left: Math.min(bounds.left, point.x),
      top: Math.min(bounds.top, point.y),
      right: Math.max(bounds.right, point.x),
      bottom: Math.max(bounds.bottom, point.y),
    }),
    {
      left: Number.POSITIVE_INFINITY,
      top: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY,
    },
  );
}

function drawEditorOverlay() {
  const polygonLayer = document.getElementById('polygon-layer');
  if (!editorState) {
    polygonLayer?.replaceChildren();
    if (polygonLayer) {
      polygonLayer.style.pointerEvents = 'none';
    }
    return;
  }

  if (polygonLayer) {
    polygonLayer.style.pointerEvents = 'auto';
  }

  const config = editorState.draftConfig;
  const placement = getBackgroundPlacement();
  if (!placement) {
    return;
  }

  const drawPolygons = (polygons, color, fill, focus) => {
    polygons.forEach((polygon) => {
      const points = mapPolygonToWorld(placement, polygon.points);
      if (points.length === 0) {
        return;
      }

      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      drawPolygonPath(ctx, points);
      ctx.fillStyle = fill;
      ctx.strokeStyle = color;
      ctx.lineWidth = focus ? 3 : 2;
      ctx.fill();
      ctx.stroke();

      if (focus) {
        points.forEach((point) => {
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(point.x, point.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      ctx.restore();
    });
  };

  const activePolygons = editorState.mode === 'teleport'
    ? editorState.draftTeleportConfig[editorState.scene === SCENES.cave ? 'cave' : 'forest']
    : editorState.mode === 'red'
      ? config.redPolygons
      : config.greenPolygons;
  const activeColor = editorState.mode === 'teleport'
    ? 'hsla(196, 100%, 62%, 0.98)'
    : editorState.mode === 'red'
      ? 'hsla(8, 100%, 58%, 0.95)'
      : 'hsla(120, 100%, 50%, 0.95)';
  const activeFill = editorState.mode === 'teleport'
    ? 'hsla(196, 100%, 58%, 0.16)'
    : editorState.mode === 'red'
      ? 'hsla(8, 100%, 55%, 0.14)'
      : 'hsla(120, 100%, 55%, 0.16)';

  drawPolygons(
    activePolygons,
    activeColor,
    activeFill,
    true,
  );

  if (editorState.draftPoints.length > 0) {
    const draftWorldPoints = editorState.draftPoints.map((point) => ({
      x: placement.x + placement.width * point.x,
      y: placement.y + placement.height * point.y,
    }));

    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    drawPolygonPath(ctx, draftWorldPoints);
    ctx.strokeStyle = editorState.mode === 'teleport'
      ? 'rgba(120, 220, 255, 0.98)'
      : editorState.mode === 'red'
        ? 'rgba(255, 150, 140, 0.98)'
        : 'rgba(160, 255, 180, 0.98)';
    ctx.lineWidth = 3;
    ctx.stroke();
    if (draftWorldPoints.length >= 3) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fill();
    }
    draftWorldPoints.forEach((point, index) => {
      ctx.beginPath();
      ctx.fillStyle = index === 0 ? 'rgba(255, 255, 255, 0.98)' : ctx.strokeStyle;
      ctx.arc(point.x, point.y, index === 0 ? 5.5 : 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  if (!polygonLayer) {
    return;
  }

  polygonLayer.replaceChildren();

  activePolygons.forEach((polygon) => {
    const points = mapPolygonToWorld(placement, polygon.points);
    const bounds = getPolygonBounds(points);
    if (!Number.isFinite(bounds.left)) {
      return;
    }

    const anchor = {
      x: clamp(bounds.right + 16, 16, WORLD.width - 16),
      y: clamp(bounds.top + 10, 16, WORLD.height - 16),
    };
    const screen = worldToOverlayPoint(anchor);
    if (!screen) {
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'polygon-delete';
    button.dataset.kind = editorState.mode;
    button.dataset.polygonId = polygon.id;
    button.textContent = '×';
    button.title = `Delete ${getEditorModeLabel(editorState.mode)} polygon`;
    button.style.left = `${screen.x}px`;
    button.style.top = `${screen.y}px`;
    polygonLayer.appendChild(button);
  });
}

function drawBackground() {
  const placement = getBackgroundPlacement();
  if (!placement) {
    return;
  }

  ctx.drawImage(getActiveBackgroundImage(), placement.x, placement.y, placement.width, placement.height);
}

function drawOverlay() {
  if (state.won) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 247, 219, 0.98)';
    ctx.strokeStyle = 'rgba(82, 45, 16, 0.5)';
    ctx.lineWidth = 5;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '900 54px ui-sans-serif, system-ui, sans-serif';
    ctx.strokeText('You WIN!', WORLD.width / 2, 24);
    ctx.fillText('You WIN!', WORLD.width / 2, 24);
    ctx.font = '800 24px ui-sans-serif, system-ui, sans-serif';
    ctx.strokeText(`${state.winSeconds} seconds`, WORLD.width / 2, 88);
    ctx.fillText(`${state.winSeconds} seconds`, WORLD.width / 2, 88);
    ctx.restore();
    return;
  }

  if (!editorState) {
    return;
  }

  ctx.save();
  ctx.fillStyle = 'rgba(255, 245, 232, 0.9)';
  ctx.font = '600 18px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(`Editing ${getEditorModeLabel(editorState.mode)}. Save or Cancel in the corner.`, 34, 38);
  ctx.restore();
}

function drawSceneTransitionOverlay() {
  if (!state.sceneTransition) {
    return;
  }

  const midpoint = SCENE_TRANSITION_SECONDS / 2;
  const t = clamp(state.sceneTransition.timer / midpoint, 0, 2);
  const alpha = t <= 1 ? t : 2 - t;
  ctx.save();
  ctx.fillStyle = `rgba(5, 4, 3, ${clamp(alpha, 0, 1)})`;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, WORLD.width, WORLD.height);
  drawBackground();
  drawAcorn();
  drawEditorOverlay();
  drawSprite();
  drawOverlay();
  drawSceneTransitionOverlay();
}

let previous = performance.now();
let animationFrameId = 0;

function frame(now) {
  const dt = Math.min((now - previous) / 1000, 0.05);
  previous = now;
  update(dt);
  render();
  animationFrameId = window.requestAnimationFrame(frame);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('keydown', handleKeyDown, { passive: false });
window.addEventListener('keyup', handleKeyUp);
window.addEventListener('blur', handleBlur);
window.addEventListener('pointerdown', handleWindowPointerDown, { capture: true });
canvas.addEventListener('pointerdown', handleCanvasPointerDown);
document.getElementById('editor-controls')?.addEventListener('click', handleEditorControlsClick);
document.getElementById('polygon-layer')?.addEventListener('pointerdown', handlePolygonLayerPointerDown);
document.getElementById('editor-status')?.addEventListener('click', () => setEditorStatus(''));

resizeCanvas();
updateEditorControls();
updateTimerDisplay();
setEditorStatus('Loading collision config...');
bootstrapCollisionConfig().catch(() => {
  setEditorStatus('Loaded built-in collision layout.');
});
animationFrameId = window.requestAnimationFrame(frame);

return () => {
  window.cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('blur', handleBlur);
  window.removeEventListener('pointerdown', handleWindowPointerDown, { capture: true });
};
}

renderRoute();
