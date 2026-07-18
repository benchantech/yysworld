import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <canvas id="stage" width="1200" height="760"></canvas>
`;

const canvas = document.querySelector('#stage');
const ctx = canvas.getContext('2d');

const WORLD = { width: 1200, height: 760 };
const SPRITE = {
  size: 150,
  columns: 4,
  rows: 4,
  frameMs: 120,
  speed: 250,
  idleColumn: 1,
  facingRows: { left: 0, right: 1, down: 2, up: 3 },
};

const YY_SPRITE = {
  size: 138,
  columns: 4,
  rows: 4,
  frameMs: 120,
  speed: 200,
  idleColumn: 1,
  facingRows: { down: 0, up: 1, left: 2, right: 3 },
};

const SPEED_POWERUP = {
  size: 88,
  speed: 300,
  boostSpeed: 360,
  boostSeconds: 12,
};

const DIFFICULTY_SETTINGS = {
  novice: {
    playerSpeed: 240,
    aiSpeed: 160,
    speedPowerupSpeed: 150,
    boostSpeed: 400,
    boostSeconds: 15,
    powerupAccess: 'player',
  },
  medium: {
    speedPowerupSpeed: SPEED_POWERUP.speed,
    boostSpeed: SPEED_POWERUP.boostSpeed,
    boostSeconds: SPEED_POWERUP.boostSeconds,
    powerupAccess: 'pursued',
  },
  advanced: {
    playerSpeed: 300,
    aiSpeed: 370,
    speedPowerupSpeed: 200,
    boostSpeed: 420,
    boostSeconds: 10,
    powerupAccess: 'ai',
  },
};

const FLEE_AI = {
  dangerDistance: 520,
  panicDistance: 250,
  targetSecondsMin: 0.28,
  targetSecondsMax: 0.78,
  wallMargin: 190,
  cornerPenaltyMargin: 230,
  powerupInterestDistance: 420,
};

const ROLE_HIT_AREAS = {
  pursuer: { x: 170, y: 460, width: 500, height: 270 },
  pursued: { x: 780, y: 460, width: 500, height: 270 },
};

const DIFFICULTY_BOXES = [
  { label: 'Novice', value: 'novice', x: 205, y: 820, width: 260, height: 105 },
  { label: 'Medium', value: 'medium', x: 570, y: 820, width: 260, height: 105 },
  { label: 'Advanced', value: 'advanced', x: 935, y: 820, width: 260, height: 105 },
];

const DIFFICULTY_HIT_AREAS = Object.fromEntries(
  DIFFICULTY_BOXES.filter((box) => box.value).map((box) => [
    box.value,
    { x: box.x, y: box.y, width: box.width, height: box.height },
  ]),
);

const CHARACTER_HIT_AREAS = {
  yy: { x: 20, y: 130, width: 675, height: 820 },
  fox: { x: 725, y: 130, width: 700, height: 820 },
};

const CHEAT_SQUIRREL_AREA = { x: 1127, y: 673, width: 46, height: 46 };
const CHEAT_BUBBLE_AREA = { x: 1058, y: 622, width: 116, height: 42 };
const CHEAT_RESTART_BUTTON = { x: 430, y: 444, width: 340, height: 112 };
const SURVIVAL_SECONDS = 30;

const FOX_START = {
  x: WORLD.width * 0.64,
  y: WORLD.height * 0.46,
  facing: 'down',
};

const YY_START = {
  x: WORLD.width * 0.3,
  y: WORLD.height * 0.5,
  facing: 'down',
};

const fox = {
  x: FOX_START.x,
  y: FOX_START.y,
  facing: FOX_START.facing,
  moving: false,
  frame: 0,
  frameTimer: 0,
  loaded: false,
  speed: SPRITE.speed,
  boostTimer: 0,
  fleeBrain: createFleeBrain(),
};

const yy = {
  x: YY_START.x,
  y: YY_START.y,
  facing: YY_START.facing,
  moving: false,
  frame: 0,
  frameTimer: 0,
  loaded: false,
  speed: YY_SPRITE.speed,
  boostTimer: 0,
  fleeBrain: createFleeBrain(),
};

const speedPowerup = {
  x: WORLD.width * 0.5,
  y: WORLD.height * 0.22,
  targetX: WORLD.width * 0.5,
  targetY: WORLD.height * 0.22,
  loaded: false,
};

const keys = new Set();
let screen = 'role';
let playerRole = 'pursued';
let selectedRole = null;
let selectedDifficulty = null;
let playerCharacter = 'fox';
let gameOver = false;
let won = false;
let elapsedTime = 0;
let cheatQueued = false;
let cheatActive = false;
const roleImage = new Image();
const characterImage = new Image();
const backgroundImage = new Image();
const cheatImage = new Image();
const spriteSheet = document.createElement('canvas');
const spriteContext = spriteSheet.getContext('2d', { willReadFrequently: true });
const spriteImage = new Image();
const yySpriteSheet = document.createElement('canvas');
const yySpriteContext = yySpriteSheet.getContext('2d', { willReadFrequently: true });
const yySpriteImage = new Image();
const speedPowerupSheet = document.createElement('canvas');
const speedPowerupContext = speedPowerupSheet.getContext('2d', { willReadFrequently: true });
const speedPowerupImage = new Image();

roleImage.src = new URL('../ChatGPT Image Jul 4, 2026 at 01_22_26 PM.jpg', import.meta.url).href;
characterImage.src = new URL('../ChatGPT Image Jul 4, 2026 at 01_08_13 PM.jpg', import.meta.url).href;
backgroundImage.src = new URL('../ChatGPT Image Jun 28, 2026 at 12_07_13 PM.jpg', import.meta.url).href;
cheatImage.src = new URL('../ChatGPT Image Jul 17, 2026 at 07_29_28 PM.jpg', import.meta.url).href;

spriteImage.addEventListener('load', () => {
  spriteSheet.width = spriteImage.naturalWidth;
  spriteSheet.height = spriteImage.naturalHeight;
  spriteContext.drawImage(spriteImage, 0, 0);

  const imageData = spriteContext.getImageData(0, 0, spriteSheet.width, spriteSheet.height);
  removeSpriteBackground(imageData, SPRITE.columns, SPRITE.rows);
  spriteContext.putImageData(imageData, 0, 0);
  fox.loaded = true;
});

spriteImage.src = new URL('../ChatGPT Image Jun 27, 2026 at 07_02_15 PM.jpg', import.meta.url).href;

yySpriteImage.addEventListener('load', () => {
  yySpriteSheet.width = yySpriteImage.naturalWidth;
  yySpriteSheet.height = yySpriteImage.naturalHeight;
  yySpriteContext.drawImage(yySpriteImage, 0, 0);

  const imageData = yySpriteContext.getImageData(0, 0, yySpriteSheet.width, yySpriteSheet.height);
  removeSpriteBackground(imageData, YY_SPRITE.columns, YY_SPRITE.rows);
  yySpriteContext.putImageData(imageData, 0, 0);
  yy.loaded = true;
});

yySpriteImage.src = new URL(
  '../ChatGPT Image Jun 29, 2026 at 08_51_28 PM.jpg',
  import.meta.url,
).href;

speedPowerupImage.addEventListener('load', () => {
  speedPowerupSheet.width = speedPowerupImage.naturalWidth;
  speedPowerupSheet.height = speedPowerupImage.naturalHeight;
  speedPowerupContext.drawImage(speedPowerupImage, 0, 0);

  const imageData = speedPowerupContext.getImageData(0, 0, speedPowerupSheet.width, speedPowerupSheet.height);
  removeSpriteBackground(imageData, 1, 1);
  speedPowerupContext.putImageData(imageData, 0, 0);
  speedPowerup.loaded = true;
});

speedPowerupImage.src = new URL('../ChatGPT Image Jun 28, 2026 at 11_57_08 AM.jpg', import.meta.url).href;

function createFleeBrain() {
  return {
    targetX: WORLD.width / 2,
    targetY: WORLD.height / 2,
    retargetTimer: 0,
    lastThreatX: null,
    lastThreatY: null,
    strafe: 1,
    seed: Math.random() * Math.PI * 2,
  };
}

function removeSpriteBackground(imageData, columns, rows) {
  const { data, width, height } = imageData;
  const cellWidth = Math.floor(width / columns);
  const cellHeight = Math.floor(height / rows);
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);

  const isBackground = (pixel) => {
    const offset = pixel * 4;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    const lightness = (red + green + blue) / 3;
    const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
    return lightness > 158 && chroma < 38;
  };

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const left = column * cellWidth;
      const top = row * cellHeight;
      const right = column === columns - 1 ? width - 1 : (column + 1) * cellWidth - 1;
      const bottom = row === rows - 1 ? height - 1 : (row + 1) * cellHeight - 1;
      let head = 0;
      let tail = 0;

      const enqueue = (x, y) => {
        const pixel = y * width + x;
        if (visited[pixel] || !isBackground(pixel)) return;
        visited[pixel] = 1;
        queue[tail] = pixel;
        tail += 1;
      };

      for (let x = left; x <= right; x += 1) {
        enqueue(x, top);
        enqueue(x, bottom);
      }
      for (let y = top; y <= bottom; y += 1) {
        enqueue(left, y);
        enqueue(right, y);
      }

      while (head < tail) {
        const pixel = queue[head];
        head += 1;
        data[pixel * 4 + 3] = 0;
        const x = pixel % width;
        const y = Math.floor(pixel / width);
        if (x > left) enqueue(x - 1, y);
        if (x < right) enqueue(x + 1, y);
        if (y > top) enqueue(x, y - 1);
        if (y < bottom) enqueue(x, y + 1);
      }
    }
  }
}

function drawBackground() {
  if (!backgroundImage.complete || backgroundImage.naturalWidth === 0) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    return;
  }

  const scale = Math.max(WORLD.width / backgroundImage.naturalWidth, WORLD.height / backgroundImage.naturalHeight);
  const width = backgroundImage.naturalWidth * scale;
  const height = backgroundImage.naturalHeight * scale;
  const x = (WORLD.width - width) / 2;
  const y = (WORLD.height - height) / 2;

  ctx.drawImage(backgroundImage, x, y, width, height);
}

function getContainedImageRect(image) {
  if (!image.complete || image.naturalWidth === 0) {
    return { x: 0, y: 0, width: WORLD.width, height: WORLD.height, scale: 1 };
  }

  const scale = Math.min(WORLD.width / image.naturalWidth, WORLD.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  return {
    x: (WORLD.width - width) / 2,
    y: (WORLD.height - height) / 2,
    width,
    height,
    scale,
  };
}

function drawMenuScreen(image) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  if (!image.complete || image.naturalWidth === 0) return;

  const rect = getContainedImageRect(image);
  ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);

  if (image === roleImage) {
    drawDifficultyBoxes(rect);
    if (selectedRole) drawSelectedMenuArea(ROLE_HIT_AREAS[selectedRole], rect);
    if (selectedDifficulty) drawSelectedMenuArea(DIFFICULTY_HIT_AREAS[selectedDifficulty], rect);
  }

  if (image === characterImage) {
    drawCheatPrompt();
  }
}

function drawRoundRect(x, y, width, height, radius) {
  const boundedRadius = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + boundedRadius, y);
  ctx.lineTo(x + width - boundedRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + boundedRadius);
  ctx.lineTo(x + width, y + height - boundedRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - boundedRadius, y + height);
  ctx.lineTo(x + boundedRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - boundedRadius);
  ctx.lineTo(x, y + boundedRadius);
  ctx.quadraticCurveTo(x, y, x + boundedRadius, y);
  ctx.closePath();
}

function drawDifficultyBoxes(rect) {
  ctx.save();
  ctx.translate(rect.x, rect.y);
  ctx.scale(rect.scale, rect.scale);

  ctx.fillStyle = '#d2f6b8';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 8;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 44px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  for (const box of DIFFICULTY_BOXES) {
    drawRoundRect(box.x, box.y, box.width, box.height, 34);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.fillText(box.label, box.x + box.width / 2, box.y + box.height / 2);
    ctx.fillStyle = '#d2f6b8';
  }

  ctx.restore();
}

function drawSelectedMenuArea(area, rect) {
  ctx.save();
  ctx.translate(rect.x, rect.y);
  ctx.scale(rect.scale, rect.scale);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 14;
  drawRoundRect(area.x, area.y, area.width, area.height, 42);
  ctx.stroke();
  ctx.restore();
}

function pointInRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

function drawCheatPrompt() {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#171717';
  ctx.lineWidth = 2;
  drawRoundRect(
    CHEAT_BUBBLE_AREA.x,
    CHEAT_BUBBLE_AREA.y,
    CHEAT_BUBBLE_AREA.width,
    CHEAT_BUBBLE_AREA.height,
    12,
  );
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(CHEAT_BUBBLE_AREA.x + CHEAT_BUBBLE_AREA.width - 28, CHEAT_BUBBLE_AREA.y + CHEAT_BUBBLE_AREA.height);
  ctx.lineTo(CHEAT_SQUIRREL_AREA.x + 12, CHEAT_SQUIRREL_AREA.y + 3);
  ctx.lineTo(CHEAT_BUBBLE_AREA.x + CHEAT_BUBBLE_AREA.width - 48, CHEAT_BUBBLE_AREA.y + CHEAT_BUBBLE_AREA.height);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#171717';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 15px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(
    'Wanna cheat?',
    CHEAT_BUBBLE_AREA.x + CHEAT_BUBBLE_AREA.width / 2,
    CHEAT_BUBBLE_AREA.y + CHEAT_BUBBLE_AREA.height / 2,
  );

  if (cheatImage.complete && cheatImage.naturalWidth > 0) {
    ctx.drawImage(
      cheatImage,
      CHEAT_SQUIRREL_AREA.x,
      CHEAT_SQUIRREL_AREA.y,
      CHEAT_SQUIRREL_AREA.width,
      CHEAT_SQUIRREL_AREA.height,
    );
  } else {
    ctx.fillStyle = '#8b5a2b';
    ctx.beginPath();
    ctx.arc(
      CHEAT_SQUIRREL_AREA.x + CHEAT_SQUIRREL_AREA.width / 2,
      CHEAT_SQUIRREL_AREA.y + CHEAT_SQUIRREL_AREA.height / 2,
      CHEAT_SQUIRREL_AREA.width / 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  ctx.restore();
}

function resetCharacter(character, start) {
  character.x = start.x;
  character.y = start.y;
  character.facing = start.facing;
  character.moving = false;
  character.frame = 0;
  character.frameTimer = 0;
  if (character.fleeBrain) {
    character.fleeBrain.targetX = character.x;
    character.fleeBrain.targetY = character.y;
    character.fleeBrain.retargetTimer = 0;
    character.fleeBrain.lastThreatX = null;
    character.fleeBrain.lastThreatY = null;
    character.fleeBrain.strafe = Math.random() < 0.5 ? -1 : 1;
    character.fleeBrain.seed = Math.random() * Math.PI * 2;
  }
}

function configureRoles() {
  fox.speed = getNormalSpeed('fox');
  yy.speed = getNormalSpeed('yy');
  fox.boostTimer = 0;
  yy.boostTimer = 0;
}

function pickSpeedPowerupTarget() {
  speedPowerup.targetX = 18 + Math.random() * (WORLD.width - SPEED_POWERUP.size - 36);
  speedPowerup.targetY = 18 + Math.random() * (WORLD.height - SPEED_POWERUP.size - 36);
}

function resetSpeedPowerup() {
  speedPowerup.x = 18 + Math.random() * (WORLD.width - SPEED_POWERUP.size - 36);
  speedPowerup.y = 18 + Math.random() * (WORLD.height - SPEED_POWERUP.size - 36);
  pickSpeedPowerupTarget();
}

function restartGame() {
  screen = 'play';
  gameOver = false;
  won = false;
  elapsedTime = 0;
  keys.clear();
  resetCharacter(fox, FOX_START);
  resetCharacter(yy, YY_START);
  configureRoles();
  resetSpeedPowerup();
}

function startGame(character) {
  playerCharacter = character;
  cheatActive = cheatQueued;
  cheatQueued = false;
  restartGame();
}

function startCheat() {
  cheatQueued = true;
}

function chooseRole(role) {
  playerRole = role;
  selectedRole = role;
  if (selectedDifficulty) screen = 'character';
}

function chooseDifficulty(difficulty) {
  selectedDifficulty = difficulty;
  if (selectedRole) screen = 'character';
}

function moveCharacter(character, sprite, dt, dx, dy) {
  character.moving = dx !== 0 || dy !== 0;
  if (!character.moving) {
    character.frameTimer = 0;
    return;
  }

  if (Math.abs(dy) >= Math.abs(dx)) {
    character.facing = dy < 0 ? 'up' : 'down';
  } else {
    character.facing = dx < 0 ? 'left' : 'right';
  }

  const magnitude = Math.hypot(dx, dy);
  const speed = character.speed ?? sprite.speed;
  dx /= magnitude;
  dy /= magnitude;
  character.x = Math.max(18, Math.min(WORLD.width - sprite.size - 18, character.x + dx * speed * dt));
  character.y = Math.max(18, Math.min(WORLD.height - sprite.size - 18, character.y + dy * speed * dt));

  character.frameTimer += dt;
  const frameInterval = sprite.frameMs / 1000;
  while (character.frameTimer >= frameInterval) {
    character.frame = (character.frame + 1) % sprite.columns;
    character.frameTimer -= frameInterval;
  }
}

function updateControlledCharacter(character, sprite, dt, controls) {
  const left = keys.has(controls.left);
  const right = keys.has(controls.right);
  const up = keys.has(controls.up);
  const down = keys.has(controls.down);

  moveCharacter(
    character,
    sprite,
    dt,
    Number(right) - Number(left),
    Number(down) - Number(up),
  );
}

function getCenter(character, sprite) {
  return {
    x: character.x + sprite.size / 2,
    y: character.y + sprite.size / 2,
  };
}

function getPowerupCenter() {
  return {
    x: speedPowerup.x + SPEED_POWERUP.size / 2,
    y: speedPowerup.y + SPEED_POWERUP.size / 2,
  };
}

function getDifficultySettings() {
  return DIFFICULTY_SETTINGS[selectedDifficulty] ?? DIFFICULTY_SETTINGS.medium;
}

function getNormalSpeed(characterName) {
  const settings = getDifficultySettings();
  if (cheatActive && characterName !== playerCharacter) return 100;
  if (settings.playerSpeed !== undefined && settings.aiSpeed !== undefined) {
    if (isAdvancedPursuingAi(characterName)) return 301;
    if (isAdvancedPursuedAi(characterName)) return settings.aiSpeed - 50;
    return characterName === playerCharacter ? settings.playerSpeed : settings.aiSpeed;
  }

  return getCharacterRole(characterName) === 'pursued' ? SPRITE.speed : YY_SPRITE.speed;
}

function isAdvancedDifficulty() {
  return selectedDifficulty === 'advanced';
}

function isAdvancedPursuedAi(characterName) {
  return (
    isAdvancedDifficulty() &&
    characterName !== playerCharacter &&
    getCharacterRole(characterName) === 'pursued'
  );
}

function isAdvancedPursuingAi(characterName) {
  return (
    isAdvancedDifficulty() &&
    characterName !== playerCharacter &&
    getCharacterRole(characterName) === 'pursuer'
  );
}

function isAdvancedPursuedAiCharacter(character) {
  const aiName = getAiCharacterName();
  return isAdvancedPursuedAi(aiName) && getCharacterConfig(aiName).character === character;
}

function getBoostSpeed(characterName) {
  const settings = getDifficultySettings();
  if (isAdvancedPursuingAi(characterName)) return 330;
  return isAdvancedPursuedAi(characterName) ? settings.boostSpeed - 50 : settings.boostSpeed;
}

function updateBoost(character, normalSpeed, dt) {
  if (character.boostTimer <= 0) return;

  character.boostTimer = Math.max(0, character.boostTimer - dt);
  if (character.boostTimer === 0) {
    character.speed = normalSpeed;
  }
}

function updateAiCharacter(chaser, chaserSprite, target, targetSprite, dt) {
  const chaserCenter = getCenter(chaser, chaserSprite);
  const targetCenter = getCenter(target, targetSprite);
  moveCharacter(chaser, chaserSprite, dt, targetCenter.x - chaserCenter.x, targetCenter.y - chaserCenter.y);
}

function getVelocityFromKeys() {
  const dx = Number(keys.has('ArrowRight')) - Number(keys.has('ArrowLeft'));
  const dy = Number(keys.has('ArrowDown')) - Number(keys.has('ArrowUp'));
  const magnitude = Math.hypot(dx, dy);
  if (magnitude === 0) return { x: 0, y: 0 };
  return { x: dx / magnitude, y: dy / magnitude };
}

function getAdvancedPowerupVector(character, sprite) {
  const characterCenter = getCenter(character, sprite);
  const powerupCenter = getPowerupCenter();
  return {
    x: powerupCenter.x - characterCenter.x,
    y: powerupCenter.y - characterCenter.y,
    distance: Math.hypot(powerupCenter.x - characterCenter.x, powerupCenter.y - characterCenter.y),
  };
}

function getAdvancedPursuitScore(candidate, character, sprite, target, targetSprite, predictedTarget) {
  const candidateCenter = {
    x: candidate.x + sprite.size / 2,
    y: candidate.y + sprite.size / 2,
  };
  const targetCenter = getCenter(target, targetSprite);
  const distanceToTarget = Math.hypot(candidateCenter.x - targetCenter.x, candidateCenter.y - targetCenter.y);
  const distanceToPrediction = Math.hypot(
    candidateCenter.x - predictedTarget.x,
    candidateCenter.y - predictedTarget.y,
  );
  const wallClearance = getWallClearance(candidate.x, candidate.y, sprite);
  const powerup = getAdvancedPowerupVector(character, sprite);
  const candidatePowerupDistance = Math.hypot(
    candidateCenter.x - getPowerupCenter().x,
    candidateCenter.y - getPowerupCenter().y,
  );
  const playerPowerup = getAdvancedPowerupVector(target, targetSprite);
  const closeEnoughToCatch = distanceToTarget < 190;
  const softenedPursuer = isAdvancedPursuingAi(getAiCharacterName());

  let score = 900 - distanceToTarget * 1.35 - distanceToPrediction * (softenedPursuer ? 0.42 : 1.05);
  score += Math.min(wallClearance, 170) * (softenedPursuer ? 0.45 : 0.75);

  if (closeEnoughToCatch) score += (190 - distanceToTarget) * (softenedPursuer ? 1.2 : 2.2);
  if (wallClearance < 60) score -= (60 - wallClearance) * 4;

  if (character.boostTimer <= 0 && powerup.distance < 560) {
    const canBeatPlayerToBall = powerup.distance < playerPowerup.distance + 150;
    const chaseIsNotImmediate = distanceToTarget > 135;
    if (canBeatPlayerToBall && chaseIsNotImmediate) {
      score += Math.max(0, 560 - candidatePowerupDistance) * (softenedPursuer ? 0.85 : 1.55);
    }
  }

  return score + (softenedPursuer ? Math.random() * 95 : 0);
}

function updateAdvancedPursuingAi(character, sprite, target, targetSprite, dt) {
  const characterCenter = getCenter(character, sprite);
  const targetCenter = getCenter(target, targetSprite);
  const playerVelocity = getVelocityFromKeys();
  const pursuitDistance = Math.hypot(targetCenter.x - characterCenter.x, targetCenter.y - characterCenter.y);
  const softenedPursuer = isAdvancedPursuingAi(getAiCharacterName());
  const leadSeconds = Math.min(
    softenedPursuer ? 0.35 : 0.7,
    pursuitDistance / Math.max(character.speed, 1) * (softenedPursuer ? 0.2 : 0.42),
  );
  const predictedTarget = {
    x: targetCenter.x + playerVelocity.x * target.speed * leadSeconds,
    y: targetCenter.y + playerVelocity.y * target.speed * leadSeconds,
  };

  const candidates = [
    getClampedCharacterPoint(targetCenter.x - sprite.size / 2, targetCenter.y - sprite.size / 2, sprite),
    getClampedCharacterPoint(predictedTarget.x - sprite.size / 2, predictedTarget.y - sprite.size / 2, sprite),
    getClampedCharacterPoint(speedPowerup.x, speedPowerup.y, sprite),
  ];

  const candidateCount = softenedPursuer ? 8 : 12;
  for (let index = 0; index < candidateCount; index += 1) {
    const angle = (Math.PI * 2 * index) / candidateCount;
    const radius = pursuitDistance < 220 ? 95 : softenedPursuer ? 150 : 190;
    candidates.push(getClampedCharacterPoint(
      character.x + Math.cos(angle) * radius,
      character.y + Math.sin(angle) * radius,
      sprite,
    ));
  }

  let bestCandidate = candidates[0];
  let bestScore = -Infinity;
  for (const candidate of candidates) {
    const score = getAdvancedPursuitScore(candidate, character, sprite, target, targetSprite, predictedTarget);
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  moveCharacter(
    character,
    sprite,
    dt,
    bestCandidate.x + sprite.size / 2 - characterCenter.x,
    bestCandidate.y + sprite.size / 2 - characterCenter.y,
  );
}

function getWallClearance(x, y, sprite) {
  return Math.min(
    x - 18,
    y - 18,
    WORLD.width - sprite.size - 18 - x,
    WORLD.height - sprite.size - 18 - y,
  );
}

function getCornerDistance(x, y, sprite) {
  const maxX = WORLD.width - sprite.size;
  const maxY = WORLD.height - sprite.size;
  return Math.min(
    Math.hypot(x, y),
    Math.hypot(maxX - x, y),
    Math.hypot(x, maxY - y),
    Math.hypot(maxX - x, maxY - y),
  );
}

function getClampedCharacterPoint(x, y, sprite) {
  return {
    x: Math.max(18, Math.min(WORLD.width - sprite.size - 18, x)),
    y: Math.max(18, Math.min(WORLD.height - sprite.size - 18, y)),
  };
}

function getFleeCandidateScore(candidate, character, sprite, threatCenter, predictedThreat, currentCenter) {
  const candidateCenter = {
    x: candidate.x + sprite.size / 2,
    y: candidate.y + sprite.size / 2,
  };
  const distanceFromThreat = Math.hypot(
    candidateCenter.x - predictedThreat.x,
    candidateCenter.y - predictedThreat.y,
  );
  const currentDistance = Math.hypot(candidate.x - character.x, candidate.y - character.y);
  const wallClearance = getWallClearance(candidate.x, candidate.y, sprite);
  const cornerDistance = getCornerDistance(candidate.x, candidate.y, sprite);
  const centerDistance = Math.hypot(
    candidateCenter.x - WORLD.width / 2,
    candidateCenter.y - WORLD.height / 2,
  );
  const awayDot =
    (candidateCenter.x - currentCenter.x) * (currentCenter.x - threatCenter.x) +
    (candidateCenter.y - currentCenter.y) * (currentCenter.y - threatCenter.y);
  const powerupCenter = getPowerupCenter();
  const distanceToPowerup = Math.hypot(
    candidateCenter.x - powerupCenter.x,
    candidateCenter.y - powerupCenter.y,
  );
  const powerupSafety = Math.hypot(
    powerupCenter.x - predictedThreat.x,
    powerupCenter.y - predictedThreat.y,
  );

  let score = distanceFromThreat * 2.3;
  score += Math.max(0, awayDot) * 0.012;
  score += Math.min(wallClearance, FLEE_AI.wallMargin) * 1.7;
  score += Math.min(cornerDistance, FLEE_AI.cornerPenaltyMargin) * 1.2;
  score -= centerDistance * 0.22;
  score -= currentDistance * 0.12;

  if (wallClearance < 80) score -= (80 - wallClearance) * 5.5;
  if (cornerDistance < 150) score -= (150 - cornerDistance) * 4.2;
  if (currentDistance < 95) score -= 90;

  if (powerupSafety > FLEE_AI.powerupInterestDistance) {
    score += Math.max(0, FLEE_AI.powerupInterestDistance - distanceToPowerup) * 0.95;
  }

  if (isAdvancedDifficulty() && character.boostTimer <= 0) {
    const threatDistance = Math.hypot(currentCenter.x - threatCenter.x, currentCenter.y - threatCenter.y);
    const powerupNeed = Math.max(0, (720 - threatDistance) / 720);
    const safePowerup = powerupSafety > Math.max(260, threatDistance * 0.62);
    const powerupWeight = isAdvancedPursuedAiCharacter(character) ? 0.72 : 1;
    if (safePowerup) {
      score += Math.max(0, 620 - distanceToPowerup) * (1.15 + powerupNeed) * powerupWeight;
    } else {
      score -= Math.max(0, 260 - powerupSafety) * 2.4;
    }
  }

  return score + Math.random() * 55;
}

function chooseFleeTarget(character, sprite, threat, threatSprite, dt) {
  const brain = character.fleeBrain;
  const characterCenter = getCenter(character, sprite);
  const threatCenter = getCenter(threat, threatSprite);
  const threatVelocity = {
    x: brain.lastThreatX === null ? 0 : (threatCenter.x - brain.lastThreatX) / Math.max(dt, 0.001),
    y: brain.lastThreatY === null ? 0 : (threatCenter.y - brain.lastThreatY) / Math.max(dt, 0.001),
  };
  const predictedThreat = {
    x: threatCenter.x + threatVelocity.x * 0.38,
    y: threatCenter.y + threatVelocity.y * 0.38,
  };
  const awayMagnitude = Math.hypot(characterCenter.x - threatCenter.x, characterCenter.y - threatCenter.y) || 1;
  const away = {
    x: (characterCenter.x - threatCenter.x) / awayMagnitude,
    y: (characterCenter.y - threatCenter.y) / awayMagnitude,
  };
  const lateral = { x: -away.y, y: away.x };
  const candidates = [];

  const softenedAdvancedPursued = isAdvancedPursuedAiCharacter(character);
  const candidateCount = softenedAdvancedPursued ? 18 : isAdvancedDifficulty() ? 24 : 16;
  for (let index = 0; index < candidateCount; index += 1) {
    const angle = (Math.PI * 2 * index) / candidateCount + Math.random() * 0.25;
    const radius = isAdvancedDifficulty()
      ? 150 + (index % (softenedAdvancedPursued ? 2 : 3)) * 150
      : 190 + Math.random() * 430;
    candidates.push(getClampedCharacterPoint(
      character.x + Math.cos(angle) * radius,
      character.y + Math.sin(angle) * radius,
      sprite,
    ));
  }

  candidates.push(
    getClampedCharacterPoint(
      character.x + away.x * 470 + lateral.x * brain.strafe * 230,
      character.y + away.y * 470 + lateral.y * brain.strafe * 230,
      sprite,
    ),
    getClampedCharacterPoint(
      character.x + away.x * 430 - lateral.x * brain.strafe * 260,
      character.y + away.y * 430 - lateral.y * brain.strafe * 260,
      sprite,
    ),
    getClampedCharacterPoint(
      character.x + away.x * 330 + lateral.x * brain.strafe * 390,
      character.y + away.y * 330 + lateral.y * brain.strafe * 390,
      sprite,
    ),
    getClampedCharacterPoint(
      character.x + away.x * 330 - lateral.x * brain.strafe * 390,
      character.y + away.y * 330 - lateral.y * brain.strafe * 390,
      sprite,
    ),
    getClampedCharacterPoint(WORLD.width * 0.5 - sprite.size / 2, WORLD.height * 0.5 - sprite.size / 2, sprite),
    getClampedCharacterPoint(speedPowerup.x, speedPowerup.y, sprite),
  );

  let bestCandidate = candidates[0];
  let bestScore = -Infinity;
  for (const candidate of candidates) {
    const score = getFleeCandidateScore(
      candidate,
      character,
      sprite,
      threatCenter,
      predictedThreat,
      characterCenter,
    );
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  brain.targetX = bestCandidate.x;
  brain.targetY = bestCandidate.y;
  const targetSecondsMin = softenedAdvancedPursued ? 0.28 : isAdvancedDifficulty() ? 0.18 : FLEE_AI.targetSecondsMin;
  const targetSecondsMax = softenedAdvancedPursued ? 0.62 : isAdvancedDifficulty() ? 0.48 : FLEE_AI.targetSecondsMax;
  brain.retargetTimer = targetSecondsMin + Math.random() * (targetSecondsMax - targetSecondsMin);
  if (Math.random() < 0.42) brain.strafe *= -1;
}

function updateFleeingAi(character, sprite, threat, threatSprite, dt) {
  const brain = character.fleeBrain;
  const characterCenter = getCenter(character, sprite);
  const threatCenter = getCenter(threat, threatSprite);
  const threatDistance = Math.hypot(characterCenter.x - threatCenter.x, characterCenter.y - threatCenter.y);
  const targetDistance = Math.hypot(brain.targetX - character.x, brain.targetY - character.y);
  brain.retargetTimer -= dt;

  if (
    brain.retargetTimer <= 0 ||
    targetDistance < 70 ||
    threatDistance < FLEE_AI.panicDistance ||
    getWallClearance(character.x, character.y, sprite) < 42
  ) {
    chooseFleeTarget(character, sprite, threat, threatSprite, dt);
  }

  const awayMagnitude = Math.hypot(characterCenter.x - threatCenter.x, characterCenter.y - threatCenter.y) || 1;
  const away = {
    x: (characterCenter.x - threatCenter.x) / awayMagnitude,
    y: (characterCenter.y - threatCenter.y) / awayMagnitude,
  };
  const lateral = { x: -away.y, y: away.x };
  const dangerWeight = Math.max(0, (FLEE_AI.dangerDistance - threatDistance) / FLEE_AI.dangerDistance);
  const weave = Math.sin(elapsedTime * 7.4 + brain.seed) * 0.55;
  let dx = brain.targetX - character.x;
  let dy = brain.targetY - character.y;

  dx += away.x * dangerWeight * 420;
  dy += away.y * dangerWeight * 420;
  dx += lateral.x * brain.strafe * weave * 180;
  dy += lateral.y * brain.strafe * weave * 180;

  const edgePush = 2.7;
  if (character.x < FLEE_AI.wallMargin) dx += (FLEE_AI.wallMargin - character.x) * edgePush;
  if (character.x > WORLD.width - sprite.size - FLEE_AI.wallMargin) {
    dx -= (character.x - (WORLD.width - sprite.size - FLEE_AI.wallMargin)) * edgePush;
  }
  if (character.y < FLEE_AI.wallMargin) dy += (FLEE_AI.wallMargin - character.y) * edgePush;
  if (character.y > WORLD.height - sprite.size - FLEE_AI.wallMargin) {
    dy -= (character.y - (WORLD.height - sprite.size - FLEE_AI.wallMargin)) * edgePush;
  }

  brain.lastThreatX = threatCenter.x;
  brain.lastThreatY = threatCenter.y;
  moveCharacter(character, sprite, dt, dx, dy);
}

function updateSpeedPowerup(dt) {
  const settings = getDifficultySettings();
  const dx = speedPowerup.targetX - speedPowerup.x;
  const dy = speedPowerup.targetY - speedPowerup.y;
  const distance = Math.hypot(dx, dy);

  if (distance < 12) {
    pickSpeedPowerupTarget();
    return;
  }

  speedPowerup.x += (dx / distance) * settings.speedPowerupSpeed * dt;
  speedPowerup.y += (dy / distance) * settings.speedPowerupSpeed * dt;
}

function charactersTouch() {
  const yyCenter = getCenter(yy, YY_SPRITE);
  const foxCenter = getCenter(fox, SPRITE);
  const distance = Math.hypot(foxCenter.x - yyCenter.x, foxCenter.y - yyCenter.y);
  return distance < (SPRITE.size + YY_SPRITE.size) * 0.28;
}

function characterTouchesSpeedPowerup(character, sprite) {
  const characterCenter = getCenter(character, sprite);
  const powerupCenter = getPowerupCenter();
  const distance = Math.hypot(characterCenter.x - powerupCenter.x, characterCenter.y - powerupCenter.y);
  return distance < (sprite.size + SPEED_POWERUP.size) * 0.25;
}

function getCharacterRole(characterName) {
  if (characterName === playerCharacter) return playerRole;
  return playerRole === 'pursuer' ? 'pursued' : 'pursuer';
}

function getCharacterConfig(characterName) {
  return characterName === 'fox'
    ? { character: fox, sprite: SPRITE }
    : { character: yy, sprite: YY_SPRITE };
}

function getAiCharacterName() {
  return playerCharacter === 'fox' ? 'yy' : 'fox';
}

function getSpeedPowerupCharacterName() {
  const settings = getDifficultySettings();
  if (cheatActive) return playerCharacter;
  if (settings.powerupAccess === 'player') return playerCharacter;
  if (settings.powerupAccess === 'ai') return getAiCharacterName();
  return getCharacterRole('fox') === 'pursued' ? 'fox' : 'yy';
}

function update(dt) {
  if (screen !== 'play') return;
  if (gameOver || won) return;

  updateBoost(fox, getNormalSpeed('fox'), dt);
  updateBoost(yy, getNormalSpeed('yy'), dt);

  const playerConfig = getCharacterConfig(playerCharacter);
  const aiCharacterName = playerCharacter === 'fox' ? 'yy' : 'fox';
  const aiConfig = getCharacterConfig(aiCharacterName);
  const speedPowerupCharacterName = getSpeedPowerupCharacterName();
  const speedPowerupConfig = getCharacterConfig(speedPowerupCharacterName);

  updateControlledCharacter(playerConfig.character, playerConfig.sprite, dt, {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    up: 'ArrowUp',
    down: 'ArrowDown',
  });

  if (isAdvancedDifficulty() && getCharacterRole(aiCharacterName) === 'pursuer') {
    updateAdvancedPursuingAi(
      aiConfig.character,
      aiConfig.sprite,
      playerConfig.character,
      playerConfig.sprite,
      dt,
    );
  } else if (getCharacterRole(aiCharacterName) === 'pursuer') {
    updateAiCharacter(
      aiConfig.character,
      aiConfig.sprite,
      playerConfig.character,
      playerConfig.sprite,
      dt,
    );
  } else {
    updateFleeingAi(
      aiConfig.character,
      aiConfig.sprite,
      playerConfig.character,
      playerConfig.sprite,
      dt,
    );
  }

  updateSpeedPowerup(dt);

  if (characterTouchesSpeedPowerup(speedPowerupConfig.character, speedPowerupConfig.sprite)) {
    const settings = getDifficultySettings();
    speedPowerupConfig.character.speed = getBoostSpeed(speedPowerupCharacterName);
    speedPowerupConfig.character.boostTimer = settings.boostSeconds;
    resetSpeedPowerup();
  }

  if (charactersTouch()) {
    won = playerRole === 'pursuer';
    gameOver = playerRole === 'pursued';
    fox.moving = false;
    yy.moving = false;
    return;
  }

  elapsedTime = Math.min(SURVIVAL_SECONDS, elapsedTime + dt);
  if (elapsedTime >= SURVIVAL_SECONDS) {
    won = playerRole === 'pursued';
    gameOver = playerRole === 'pursuer';
    fox.moving = false;
    yy.moving = false;
  }
}

function drawFox() {
  if (!fox.loaded) return;
  const sourceWidth = spriteSheet.width / SPRITE.columns;
  const sourceHeight = spriteSheet.height / SPRITE.rows;
  const column = fox.moving ? fox.frame : SPRITE.idleColumn;
  const row = SPRITE.facingRows[fox.facing];
  const bob = fox.moving ? Math.sin((fox.frameTimer / (SPRITE.frameMs / 1000)) * Math.PI) * 2 : 0;

  ctx.drawImage(
    spriteSheet,
    column * sourceWidth,
    row * sourceHeight,
    sourceWidth,
    sourceHeight,
    fox.x,
    fox.y + bob,
    SPRITE.size,
    SPRITE.size,
  );
}

function drawYY() {
  if (!yy.loaded) return;
  const sourceWidth = yySpriteSheet.width / YY_SPRITE.columns;
  const sourceHeight = yySpriteSheet.height / YY_SPRITE.rows;
  const column = yy.moving ? yy.frame : YY_SPRITE.idleColumn;
  const row = YY_SPRITE.facingRows[yy.facing];
  const bob = yy.moving
    ? Math.sin((yy.frameTimer / (YY_SPRITE.frameMs / 1000)) * Math.PI) * 7
    : 0;

  ctx.drawImage(
    yySpriteSheet,
    column * sourceWidth,
    row * sourceHeight,
    sourceWidth,
    sourceHeight,
    yy.x,
    yy.y + bob,
    YY_SPRITE.size,
    YY_SPRITE.size,
  );
}

function drawSpeedPowerup() {
  if (!speedPowerup.loaded) return;

  ctx.drawImage(
    speedPowerupSheet,
    0,
    0,
    speedPowerupSheet.width,
    speedPowerupSheet.height,
    speedPowerup.x,
    speedPowerup.y,
    SPEED_POWERUP.size,
    SPEED_POWERUP.size,
  );
}

function drawGameOver() {
  if (!gameOver && !won) return;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  ctx.fillStyle = '#171717';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '700 56px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(won ? 'You Win!' : 'You Lose', 28, 24);

  if (!cheatActive) return;

  if (won) {
    ctx.font = '700 30px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('(but you cheated...)', 32, 92);
  }

  drawCheatRestartButton();
}

function drawCheatRestartButton() {
  ctx.save();
  ctx.fillStyle = '#bfe8ff';
  ctx.strokeStyle = '#171717';
  ctx.lineWidth = 4;
  drawRoundRect(
    CHEAT_RESTART_BUTTON.x,
    CHEAT_RESTART_BUTTON.y,
    CHEAT_RESTART_BUTTON.width,
    CHEAT_RESTART_BUTTON.height,
    14,
  );
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#171717';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 25px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const centerX = CHEAT_RESTART_BUTTON.x + CHEAT_RESTART_BUTTON.width / 2;
  ctx.fillText('Oh! THAT was', centerX, CHEAT_RESTART_BUTTON.y + 34);
  ctx.fillText('what it did!', centerX, CHEAT_RESTART_BUTTON.y + 76);
  ctx.restore();
}

function drawStopwatch() {
  const seconds = Math.floor(elapsedTime).toString().padStart(2, '0');

  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
  ctx.fillRect(WORLD.width - 160, 24, 132, 58);

  ctx.strokeStyle = '#171717';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(WORLD.width - 122, 53, 15, 0, Math.PI * 2);
  ctx.moveTo(WORLD.width - 122, 53);
  ctx.lineTo(WORLD.width - 122, 42);
  ctx.moveTo(WORLD.width - 122, 53);
  ctx.lineTo(WORLD.width - 113, 53);
  ctx.moveTo(WORLD.width - 131, 32);
  ctx.lineTo(WORLD.width - 113, 32);
  ctx.stroke();

  ctx.fillStyle = '#171717';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.font = '700 34px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(`00:${seconds}`, WORLD.width - 42, 34);
}

let previousTime = performance.now();
function render(time) {
  const dt = Math.min((time - previousTime) / 1000, 0.05);
  previousTime = time;
  update(dt);
  if (screen === 'role') {
    drawMenuScreen(roleImage);
    requestAnimationFrame(render);
    return;
  }
  if (screen === 'character') {
    drawMenuScreen(characterImage);
    requestAnimationFrame(render);
    return;
  }

  drawBackground();
  drawSpeedPowerup();
  drawYY();
  drawFox();
  drawGameOver();
  drawStopwatch();
  requestAnimationFrame(render);
}

function setKey(event, pressed) {
  if (screen !== 'play') return;

  if ((gameOver || won) && pressed) {
    if (cheatActive) return;
    event.preventDefault();
    restartGame();
    return;
  }

  const controlKeys = new Set([
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ]);
  if (!controlKeys.has(event.code)) return;
  event.preventDefault();
  if (pressed) keys.add(event.code);
  else keys.delete(event.code);
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * WORLD.width,
    y: ((event.clientY - rect.top) / rect.height) * WORLD.height,
  };
}

function getMenuChoice(point, image, hitAreas) {
  if (!image.complete || image.naturalWidth === 0) return null;

  const rect = getContainedImageRect(image);
  if (
    point.x < rect.x ||
    point.x > rect.x + rect.width ||
    point.y < rect.y ||
    point.y > rect.y + rect.height
  ) {
    return null;
  }

  const imagePoint = {
    x: (point.x - rect.x) / rect.scale,
    y: (point.y - rect.y) / rect.scale,
  };

  for (const [choice, area] of Object.entries(hitAreas)) {
    if (
      imagePoint.x >= area.x &&
      imagePoint.x <= area.x + area.width &&
      imagePoint.y >= area.y &&
      imagePoint.y <= area.y + area.height
    ) {
      return choice;
    }
  }

  return null;
}

function getCurrentMenuChoice(point) {
  if (screen === 'role') {
    return (
      getMenuChoice(point, roleImage, ROLE_HIT_AREAS) ||
      getMenuChoice(point, roleImage, DIFFICULTY_HIT_AREAS)
    );
  }
  if (screen === 'character') {
    if (pointInRect(point, CHEAT_SQUIRREL_AREA) || pointInRect(point, CHEAT_BUBBLE_AREA)) return 'cheat';
    return getMenuChoice(point, characterImage, CHARACTER_HIT_AREAS);
  }
  if (screen === 'play' && cheatActive && (gameOver || won) && pointInRect(point, CHEAT_RESTART_BUTTON)) {
    return 'cheat-restart';
  }
  return null;
}

window.addEventListener('keydown', (event) => setKey(event, true), { passive: false });
window.addEventListener('keyup', (event) => setKey(event, false));
canvas.addEventListener('pointermove', (event) => {
  canvas.style.cursor = getCurrentMenuChoice(getCanvasPoint(event)) ? 'pointer' : 'default';
});
canvas.addEventListener('pointerleave', () => {
  canvas.style.cursor = 'default';
});
window.addEventListener('pointerdown', (event) => {
  if (screen === 'role') {
    const point = getCanvasPoint(event);
    const roleChoice = getMenuChoice(point, roleImage, ROLE_HIT_AREAS);
    const difficultyChoice = getMenuChoice(point, roleImage, DIFFICULTY_HIT_AREAS);
    if (roleChoice) chooseRole(roleChoice);
    if (difficultyChoice) chooseDifficulty(difficultyChoice);
    return;
  }

  if (screen === 'character') {
    const point = getCanvasPoint(event);
    if (pointInRect(point, CHEAT_SQUIRREL_AREA) || pointInRect(point, CHEAT_BUBBLE_AREA)) {
      startCheat();
      return;
    }
    const choice = getMenuChoice(point, characterImage, CHARACTER_HIT_AREAS);
    if (choice) startGame(choice);
    return;
  }

  if (gameOver || won) {
    const point = getCanvasPoint(event);
    if (cheatActive) {
      if (pointInRect(point, CHEAT_RESTART_BUTTON)) {
        cheatActive = false;
        restartGame();
      }
      return;
    }
    restartGame();
  }
});
window.addEventListener('blur', () => {
  keys.clear();
});

requestAnimationFrame(render);
