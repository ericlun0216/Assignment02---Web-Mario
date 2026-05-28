(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const GROUND_Y = 470;
  const GRAVITY = 1650;

  const ui = {
    hud: document.getElementById("hud"),
    score: document.getElementById("score"),
    coins: document.getElementById("coins"),
    life: document.getElementById("life"),
    timer: document.getElementById("timer"),
    menu: document.getElementById("menuScreen"),
    levels: document.getElementById("levelScreen"),
    help: document.getElementById("helpScreen"),
    pause: document.getElementById("pauseScreen"),
    result: document.getElementById("resultScreen"),
    resultBadge: document.getElementById("resultBadge"),
    resultTitle: document.getElementById("resultTitle"),
    resultText: document.getElementById("resultText"),
    sound: document.getElementById("soundButton")
  };

  const keys = new Set();
  const audio = {
    muted: false,
    bgm: new Audio("audio/bgm_1.mp3"),
    files: {
      jump: "audio/jump.wav",
      bump: "audio/coin.wav",
      powerAppear: "audio/powerUpAppear.wav",
      powerUp: "audio/PowerUp.mp3",
      stomp: "audio/stomp.wav",
      hurt: "audio/powerDown.wav",
      death: "audio/loseOneLife.wav",
      clear: "audio/levelClear.mp3"
    }
  };
  audio.bgm.loop = true;
  audio.bgm.volume = 0.32;

  let mode = "menu";
  let lastTime = 0;
  let cameraX = 0;
  let game = null;

  const level = {
    width: 4860,
    spawn: { x: 80, y: GROUND_Y - 44 },
    goalX: 4640,
    solids: [
      { x: 0, y: GROUND_Y, w: 780, h: 70 },
      { x: 870, y: GROUND_Y, w: 570, h: 70 },
      { x: 1535, y: GROUND_Y, w: 900, h: 70 },
      { x: 2520, y: GROUND_Y, w: 520, h: 70 },
      { x: 3135, y: GROUND_Y, w: 1725, h: 70 },
      { x: 335, y: 370, w: 150, h: 22 },
      { x: 1010, y: 354, w: 190, h: 22 },
      { x: 1745, y: 395, w: 130, h: 22 },
      { x: 1945, y: 325, w: 180, h: 22 },
      { x: 2675, y: 370, w: 190, h: 22 },
      { x: 3295, y: 398, w: 115, h: 72 },
      { x: 3410, y: 350, w: 115, h: 120 },
      { x: 3525, y: 302, w: 115, h: 168 },
      { x: 3640, y: 254, w: 115, h: 216 }
    ],
    blocks: [
      { x: 280, y: 315, prize: "mushroom" },
      { x: 540, y: 332, prize: "coin" },
      { x: 1080, y: 290, prize: "mushroom" },
      { x: 1650, y: 330, prize: "coin" },
      { x: 2015, y: 260, prize: "mushroom" },
      { x: 2738, y: 305, prize: "coin" },
      { x: 3940, y: 350, prize: "mushroom" }
    ],
    enemySpawns: [
      { x: 570, y: GROUND_Y - 34, dir: -1 },
      { x: 1090, y: 320, dir: 1 },
      { x: 1290, y: GROUND_Y - 34, dir: -1 },
      { x: 1800, y: 360, dir: -1 },
      { x: 2230, y: GROUND_Y - 34, dir: -1 },
      { x: 2830, y: 336, dir: -1 },
      { x: 3200, y: GROUND_Y - 34, dir: 1 },
      { x: 4040, y: GROUND_Y - 34, dir: -1 },
      { x: 4340, y: GROUND_Y - 34, dir: -1 }
    ]
  };

  function makeGame() {
    return {
      player: {
        x: level.spawn.x,
        y: level.spawn.y,
        w: 32,
        h: 44,
        vx: 0,
        vy: 0,
        grounded: false,
        big: false,
        invincible: 0,
        walking: 0
      },
      lives: 3,
      score: 0,
      coins: 0,
      time: 300,
      blocks: level.blocks.map((b) => ({ ...b, w: 40, h: 40, used: false, bump: 0 })),
      enemies: level.enemySpawns.map((e) => ({
        x: e.x, y: e.y, w: 38, h: 34, vx: e.dir * 58, vy: 0,
        grounded: false, dead: false, frame: 0
      })),
      mushrooms: [],
      particles: [],
      timeBonus: 0
    };
  }

  function showPanel(panel) {
    [ui.menu, ui.levels, ui.help, ui.pause, ui.result].forEach((entry) => entry.classList.add("hidden"));
    if (panel) panel.classList.remove("hidden");
  }

  function toMenu() {
    mode = "menu";
    keys.clear();
    stopMusic();
    ui.hud.classList.add("hidden");
    showPanel(ui.menu);
  }

  function selectLevel() {
    mode = "levels";
    showPanel(ui.levels);
  }

  function startLevel() {
    game = makeGame();
    mode = "playing";
    cameraX = 0;
    lastTime = performance.now();
    ui.hud.classList.remove("hidden");
    showPanel(null);
    updateHud();
    startMusic();
  }

  function togglePause() {
    if (mode === "playing") {
      mode = "paused";
      audio.bgm.pause();
      showPanel(ui.pause);
    } else if (mode === "paused") {
      mode = "playing";
      lastTime = performance.now();
      showPanel(null);
      startMusic();
    }
  }

  function finishLevel(won) {
    mode = won ? "clear" : "gameover";
    keys.clear();
    stopMusic();
    ui.resultBadge.textContent = won ? "COURSE CLEAR" : "GAME OVER";
    ui.resultTitle.textContent = won ? "過關！" : "挑戰失敗";
    if (won) {
      const bonus = Math.ceil(game.time) * 10;
      game.score += bonus;
      ui.resultText.textContent = `時間獎勵 ${bonus}，總分 ${game.score.toString().padStart(6, "0")}`;
      playEffect("clear");
    } else {
      ui.resultText.textContent = `本次分數 ${game.score.toString().padStart(6, "0")}，再試一次吧！`;
    }
    updateHud();
    showPanel(ui.result);
  }

  function startMusic() {
    if (!audio.muted) {
      audio.bgm.play().catch(() => {});
    }
  }

  function stopMusic() {
    audio.bgm.pause();
    audio.bgm.currentTime = 0;
  }

  function playEffect(name) {
    if (audio.muted) return;
    const effect = new Audio(audio.files[name]);
    effect.volume = 0.65;
    effect.play().catch(() => {});
  }

  function toggleSound() {
    audio.muted = !audio.muted;
    ui.sound.textContent = audio.muted ? "SOUND OFF" : "SOUND ON";
    if (audio.muted) {
      audio.bgm.pause();
    } else if (mode === "playing") {
      startMusic();
    }
  }

  function overlaps(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function allSolids() {
    return level.solids.concat(game.blocks);
  }

  function moveBody(body, dt, canHitBlocks) {
    body.x += body.vx * dt;
    for (const solid of allSolids()) {
      if (!overlaps(body, solid)) continue;
      if (body.vx > 0) body.x = solid.x - body.w;
      if (body.vx < 0) body.x = solid.x + solid.w;
      body.vx *= body === game.player ? 0 : -1;
    }

    const priorY = body.y;
    body.grounded = false;
    body.y += body.vy * dt;
    for (const solid of allSolids()) {
      if (!overlaps(body, solid)) continue;
      if (body.vy > 0 && priorY + body.h <= solid.y + 4) {
        body.y = solid.y - body.h;
        body.vy = 0;
        body.grounded = true;
      } else if (body.vy < 0 && priorY >= solid.y + solid.h - 4) {
        body.y = solid.y + solid.h;
        body.vy = 0;
        if (canHitBlocks && solid.prize && !solid.used) {
          hitBlock(solid);
        }
      }
    }
  }

  function hitBlock(block) {
    block.used = true;
    block.bump = 0.18;
    game.score += 100;
    if (block.prize === "mushroom") {
      game.mushrooms.push({
        x: block.x + 4, y: block.y - 34, w: 32, h: 32,
        vx: 82, vy: -130, grounded: false
      });
      playEffect("powerAppear");
    } else {
      game.coins += 1;
      game.score += 100;
      spawnText(block.x + 20, block.y, "200");
      playEffect("bump");
    }
  }

  function spawnText(x, y, text) {
    game.particles.push({ x, y, text, life: 0.75 });
  }

  function updatePlayer(dt) {
    const p = game.player;
    const movingLeft = keys.has("ArrowLeft") || keys.has("KeyA");
    const movingRight = keys.has("ArrowRight") || keys.has("KeyD");
    const desired = (movingRight ? 1 : 0) - (movingLeft ? 1 : 0);
    p.vx = desired * (p.big ? 224 : 210);
    if (desired !== 0 && p.grounded) p.walking += dt * 13;

    p.vy += GRAVITY * dt;
    moveBody(p, dt, true);
    p.x = Math.max(0, Math.min(level.width - p.w, p.x));
    p.invincible = Math.max(0, p.invincible - dt);

    if (p.y > H + 100) loseLife();
  }

  function jump() {
    if (mode !== "playing" || !game.player.grounded) return;
    game.player.vy = game.player.big ? -650 : -620;
    game.player.grounded = false;
    playEffect("jump");
  }

  function updateEnemies(dt) {
    for (const enemy of game.enemies) {
      if (enemy.dead) continue;
      enemy.frame += dt * 8;
      enemy.vy += GRAVITY * dt;
      moveBody(enemy, dt, false);
      if (enemy.y > H + 80) enemy.dead = true;

      const p = game.player;
      if (!overlaps(p, enemy) || p.invincible > 0) continue;
      const stomped = p.vy > 0 && p.y + p.h - p.vy * dt <= enemy.y + 12;
      if (stomped) {
        enemy.dead = true;
        p.vy = -410;
        game.score += 200;
        spawnText(enemy.x, enemy.y, "200");
        playEffect("stomp");
      } else {
        hurtPlayer();
      }
    }
    game.enemies = game.enemies.filter((enemy) => !enemy.dead);
  }

  function updateMushrooms(dt) {
    for (const mushroom of game.mushrooms) {
      mushroom.vy += GRAVITY * dt;
      moveBody(mushroom, dt, false);
      if (overlaps(game.player, mushroom)) {
        mushroom.taken = true;
        growPlayer();
        game.score += 1000;
        spawnText(mushroom.x, mushroom.y, "1000");
        playEffect("powerUp");
      }
    }
    game.mushrooms = game.mushrooms.filter((mushroom) => !mushroom.taken && mushroom.y < H + 100);
  }

  function growPlayer() {
    const p = game.player;
    if (p.big) return;
    p.big = true;
    p.y -= 28;
    p.h = 72;
  }

  function hurtPlayer() {
    const p = game.player;
    if (p.big) {
      p.big = false;
      p.h = 44;
      p.invincible = 1.5;
      playEffect("hurt");
    } else {
      loseLife();
    }
  }

  function loseLife() {
    game.lives -= 1;
    playEffect("death");
    updateHud();
    if (game.lives <= 0) {
      finishLevel(false);
      return;
    }
    const p = game.player;
    Object.assign(p, {
      x: level.spawn.x, y: level.spawn.y, w: 32, h: 44,
      vx: 0, vy: 0, grounded: false, big: false, invincible: 1.5
    });
    cameraX = 0;
  }

  function updatePlaying(dt) {
    updatePlayer(dt);
    if (mode !== "playing") return;
    updateEnemies(dt);
    updateMushrooms(dt);
    for (const block of game.blocks) block.bump = Math.max(0, block.bump - dt);
    game.particles.forEach((particle) => {
      particle.life -= dt;
      particle.y -= 44 * dt;
    });
    game.particles = game.particles.filter((particle) => particle.life > 0);
    game.time -= dt;
    if (game.time <= 0) {
      game.time = 0;
      finishLevel(false);
      return;
    }
    if (game.player.x + game.player.w > level.goalX) {
      finishLevel(true);
      return;
    }
    const targetCamera = game.player.x - W * 0.38;
    cameraX += (targetCamera - cameraX) * Math.min(1, dt * 7);
    cameraX = Math.max(0, Math.min(level.width - W, cameraX));
    updateHud();
  }

  function updateHud() {
    if (!game) return;
    ui.score.textContent = String(game.score).padStart(6, "0");
    ui.coins.textContent = String(game.coins).padStart(2, "0");
    ui.life.textContent = String(game.lives).padStart(2, "0");
    ui.timer.textContent = String(Math.ceil(game.time)).padStart(3, "0");
  }

  function drawSky() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#41b8ec");
    gradient.addColorStop(0.76, "#8bdcf5");
    gradient.addColorStop(1, "#f7d789");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.82)";
    for (let i = 0; i < 8; i += 1) {
      const x = ((i * 370 - cameraX * 0.25) % 1250 + 1250) % 1250 - 100;
      const y = 100 + (i % 3) * 62;
      ctx.beginPath();
      ctx.ellipse(x, y, 58, 22, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 45, y + 7, 48, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#65bb70";
    for (let i = 0; i < 13; i += 1) {
      const x = i * 390 - (cameraX * 0.48) % 390;
      ctx.beginPath();
      ctx.moveTo(x - 120, GROUND_Y);
      ctx.quadraticCurveTo(x, 288 - (i % 2) * 35, x + 130, GROUND_Y);
      ctx.fill();
    }
  }

  function drawPlatforms() {
    for (const solid of level.solids) {
      const x = solid.x - cameraX;
      if (x + solid.w < -5 || x > W + 5) continue;
      ctx.fillStyle = solid.y === GROUND_Y ? "#b45d30" : "#d47b37";
      ctx.fillRect(x, solid.y, solid.w, solid.h);
      ctx.fillStyle = "#45a54f";
      ctx.fillRect(x, solid.y, solid.w, 10);
      ctx.strokeStyle = "rgba(90,42,20,0.3)";
      for (let tileX = x + 14; tileX < x + solid.w; tileX += 38) {
        ctx.beginPath();
        ctx.moveTo(tileX, solid.y + 18);
        ctx.lineTo(tileX, solid.y + solid.h);
        ctx.stroke();
      }
    }
  }

  function drawBlocks() {
    for (const block of game.blocks) {
      const x = block.x - cameraX;
      const y = block.y - (block.bump > 0 ? Math.sin(block.bump * 18) * 8 : 0);
      ctx.fillStyle = block.used ? "#8c755d" : "#f7bf32";
      ctx.fillRect(x, y, block.w, block.h);
      ctx.strokeStyle = "#793c26";
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 1, y + 1, block.w - 2, block.h - 2);
      if (!block.used) {
        ctx.fillStyle = "#fff0b2";
        ctx.font = "bold 27px Arial";
        ctx.fillText("?", x + 12, y + 29);
      }
    }
  }

  function drawGoal() {
    const x = level.goalX - cameraX;
    ctx.fillStyle = "#eef2ec";
    ctx.fillRect(x, 122, 7, GROUND_Y - 122);
    ctx.beginPath();
    ctx.arc(x + 3, 117, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#38a74d";
    ctx.beginPath();
    ctx.moveTo(x + 7, 140);
    ctx.lineTo(x + 82, 160);
    ctx.lineTo(x + 7, 185);
    ctx.fill();
  }

  function drawPlayer() {
    const p = game.player;
    if (p.invincible > 0 && Math.floor(p.invincible * 12) % 2 === 0) return;
    const x = p.x - cameraX;
    const bob = p.grounded && Math.abs(p.vx) > 0 ? Math.sin(p.walking) * 2 : 0;
    const top = p.y + bob;
    ctx.fillStyle = "#e8442e";
    ctx.fillRect(x + 4, top, 25, 10);
    ctx.fillRect(x + 1, top + 8, 31, 8);
    ctx.fillStyle = "#f6bd7d";
    ctx.fillRect(x + 8, top + 16, 19, 14);
    ctx.fillStyle = "#25223a";
    ctx.fillRect(x + 22, top + 19, 4, 5);
    ctx.fillStyle = "#e8442e";
    ctx.fillRect(x + 6, top + 30, 23, p.big ? 27 : 9);
    ctx.fillStyle = "#2360aa";
    if (p.big) ctx.fillRect(x + 9, top + 43, 17, 21);
    const step = p.grounded && Math.abs(p.vx) > 0 ? Math.sin(p.walking) * 5 : 0;
    ctx.fillStyle = "#542d25";
    ctx.fillRect(x + 4, top + p.h - 7, 12, 7 + Math.max(0, step));
    ctx.fillRect(x + 19, top + p.h - 7, 12, 7 + Math.max(0, -step));
  }

  function drawEnemies() {
    for (const enemy of game.enemies) {
      const x = enemy.x - cameraX;
      const foot = Math.sin(enemy.frame) * 3;
      ctx.fillStyle = "#713c28";
      ctx.beginPath();
      ctx.ellipse(x + 19, enemy.y + 18, 19, 18, 0, Math.PI, Math.PI * 2);
      ctx.fillRect(x, enemy.y + 17, enemy.w, 10);
      ctx.fillStyle = "#f2ddba";
      ctx.fillRect(x + 7, enemy.y + 13, 7, 9);
      ctx.fillRect(x + 24, enemy.y + 13, 7, 9);
      ctx.fillStyle = "#1c2132";
      ctx.fillRect(x + 10, enemy.y + 16, 3, 5);
      ctx.fillRect(x + 25, enemy.y + 16, 3, 5);
      ctx.fillRect(x + 2, enemy.y + 27, 13, 6 + Math.max(0, foot));
      ctx.fillRect(x + 23, enemy.y + 27, 13, 6 + Math.max(0, -foot));
    }
  }

  function drawMushrooms() {
    for (const item of game.mushrooms) {
      const x = item.x - cameraX;
      ctx.fillStyle = "#e73c36";
      ctx.beginPath();
      ctx.arc(x + 16, item.y + 13, 16, Math.PI, Math.PI * 2);
      ctx.fillRect(x, item.y + 12, 32, 8);
      ctx.fillStyle = "#fff4d4";
      ctx.fillRect(x + 10, item.y + 17, 13, 14);
      ctx.fillRect(x + 6, item.y + 7, 6, 7);
      ctx.fillRect(x + 21, item.y + 4, 6, 8);
    }
  }

  function drawParticles() {
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#fff7bc";
    for (const particle of game.particles) {
      ctx.fillText(particle.text, particle.x - cameraX, particle.y);
    }
  }

  function drawPreview() {
    drawSky();
    ctx.fillStyle = "#45a54f";
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    ctx.fillStyle = "rgba(10,24,53,0.12)";
    ctx.fillRect(0, 0, W, H);
  }

  function draw() {
    if (!game || mode === "menu" || mode === "levels" || mode === "help") {
      drawPreview();
      return;
    }
    drawSky();
    drawGoal();
    drawPlatforms();
    drawBlocks();
    drawMushrooms();
    drawEnemies();
    drawPlayer();
    drawParticles();
  }

  function frame(time) {
    const dt = Math.min((time - lastTime) / 1000 || 0, 0.035);
    lastTime = time;
    if (mode === "playing") updatePlaying(dt);
    draw();
    requestAnimationFrame(frame);
  }

  window.addEventListener("keydown", (event) => {
    const controls = ["ArrowLeft", "ArrowRight", "ArrowUp", "Space", "KeyA", "KeyD", "KeyW"];
    if (controls.includes(event.code)) event.preventDefault();
    keys.add(event.code);
    if (!event.repeat && ["Space", "ArrowUp", "KeyW"].includes(event.code)) jump();
    if (!event.repeat && event.code === "KeyP" && (mode === "playing" || mode === "paused")) togglePause();
    if (!event.repeat && event.code === "KeyM") toggleSound();
  });
  window.addEventListener("keyup", (event) => keys.delete(event.code));
  window.addEventListener("blur", () => {
    keys.clear();
    if (mode === "playing") togglePause();
  });

  document.getElementById("openLevels").addEventListener("click", selectLevel);
  document.getElementById("openHelp").addEventListener("click", () => {
    mode = "help";
    showPanel(ui.help);
  });
  document.getElementById("closeHelp").addEventListener("click", toMenu);
  document.getElementById("returnMenu").addEventListener("click", toMenu);
  document.getElementById("levelOne").addEventListener("click", startLevel);
  document.getElementById("resumeButton").addEventListener("click", togglePause);
  document.getElementById("quitButton").addEventListener("click", toMenu);
  document.getElementById("retryButton").addEventListener("click", startLevel);
  document.getElementById("resultMenuButton").addEventListener("click", toMenu);
  ui.sound.addEventListener("click", toggleSound);

  toMenu();
  lastTime = performance.now();
  requestAnimationFrame(frame);
})();
