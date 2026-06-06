/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { DinoId, ThemeId, GameRules, Obstacle, PowerUpItem, CoinItem, Laser, Particle, ActivePowerUp, ObstacleType, PowerUpType } from '../types';
import { DINOSAURS, THEMES, INITIAL_RULES } from '../lib/constants';
import { audio } from '../lib/AudioEngine';
import { ArrowUp, ArrowDown, Shield, Zap, Sparkles, AlertCircle, Play, Undo, Volume2, VolumeX, Eye, XCircle } from 'lucide-react';

interface GameCanvasProps {
  dinoId: DinoId;
  themeId: ThemeId;
  customRules: GameRules;
  onGameOver: (score: number, coins: number, level: number) => void;
  isPaused: boolean;
  onPauseToggle: () => void;
  onAbort?: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  dinoId,
  themeId,
  customRules,
  onGameOver,
  isPaused,
  onPauseToggle,
  onAbort,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Controls display state: default to touch capabilities, but allow manual toggle
  const [showTouchControls, setShowTouchControls] = useState(() => {
    if (typeof window !== 'undefined') {
      return ('ontouchstart' in window) || window.innerWidth < 768;
    }
    return false;
  });

  // Sound triggers state
  const [muted, setMuted] = useState(audio.getMutedStatus());
  const [currentScore, setCurrentScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [ammo, setAmmo] = useState(5);
  const [activeEffects, setActiveEffects] = useState<ActivePowerUp[]>([]);

  // Internal game engine references (avoiding reactivity overhead to maintain flawless 60fps)
  const engineRef = useRef({
    // Game running configurations
    score: 0,
    coins: 0,
    level: 1,
    ammo: 5,
    lastAmmoChargeTime: 0,
    
    // Physics / Positional tracking
    dinoY: 0, // 0 means on ground
    dinoVy: 0,
    isJumping: false,
    jumpCount: 0,
    isDucking: false,
    
    // Canvas resolution
    width: 800,
    height: 350,
    groundY: 300,
    
    // Parallax background scrolls
    bgScroll1: 0,
    bgScroll2: 0,
    groundScroll: 0,
    
    // Game clock / spawning timers
    gameTime: 0,
    lastObstacleSpawn: 0,
    lastPowerUpSpawn: 0,
    lastCoinSpawn: 0,
    speedMultiplier: 1.0,
    currentSpeed: customRules.baseSpeed,

    // Collections
    obstacles: [] as Obstacle[],
    powerups: [] as PowerUpItem[],
    fallingCoins: [] as CoinItem[],
    lasers: [] as Laser[],
    particles: [] as Particle[],
    activePowerUps: [] as ActivePowerUp[],

    // Controls input states
    keys: {
      up: false,
      down: false,
      shoot: false,
    },
    
    // Game entities generators
    idCounter: 0,
  });

  // Load dinosaur and theme configs
  const dinoConfig = DINOSAURS.find((d) => d.id === dinoId) || DINOSAURS[0];
  const themeConfig = THEMES.find((t) => t.id === themeId) || THEMES[0];

  useEffect(() => {
    // Sync current keys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        engineRef.current.keys.up = true;
        triggerJump();
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        engineRef.current.keys.down = true;
        engineRef.current.isDucking = true;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyF') {
        e.preventDefault();
        engineRef.current.keys.shoot = true;
        triggerShoot();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        engineRef.current.keys.up = false;
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        engineRef.current.keys.down = false;
        engineRef.current.isDucking = false;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyF') {
        engineRef.current.keys.shoot = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, dinoId]);

  // Handle resizing of the canvas container smoothly
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = containerRef.current.getBoundingClientRect();
      
      const targetWidth = Math.max(600, rect.width);
      const targetHeight = window.innerWidth < 768 ? 230 : 270;

      canvasRef.current.width = targetWidth * dpr;
      canvasRef.current.height = targetHeight * dpr;
      canvasRef.current.style.width = `${targetWidth}px`;
      canvasRef.current.style.height = `${targetHeight}px`;

      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      engineRef.current.width = targetWidth;
      engineRef.current.height = targetHeight;
      engineRef.current.groundY = targetHeight - 50;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set up the high speed frame execution loops
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const gameLoop = (timestamp: number) => {
      if (isPaused) {
        lastTime = timestamp;
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const elapsed = timestamp - lastTime;
      lastTime = timestamp;

      // Limit large deltas in case page hangs
      const dt = Math.min(elapsed, 40);

      updateGame(dt);
      drawGame();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, dinoId, themeId, customRules]);

  // Jump Action Trigger with Double Jump support
  const triggerJump = () => {
    const engine = engineRef.current;
    if (isPaused) return;

    const gravityAdjustment = customRules.gravity / 0.6;
    const baseJumpSpeed = dinoConfig.jumpForce * customRules.jumpForceMultiplier;

    // Normal single Jump
    if (!engine.isJumping && engine.dinoY === 0) {
      engine.isJumping = true;
      engine.jumpCount = 1;
      engine.dinoVy = baseJumpSpeed;
      
      // Spawn tiny jump smoke particles
      createExplosion(70, engine.groundY, dinoConfig.color, 8, 'circle');
      audio.playJump();
    }
    // Double Jump handling
    else if (dinoConfig.hasDoubleJump && engine.jumpCount === 1) {
      engine.jumpCount = 2;
      engine.dinoVy = baseJumpSpeed * 0.95; // slightly weaker second jump
      
      // Spawn cool double circular burst particles
      createExplosion(70, engine.groundY - engine.dinoY, '#38bdf8', 12, 'star');
      audio.playDoubleJump();
    }
  };

  // Shield checking utilities
  const hasActiveShield = () => {
    const engine = engineRef.current;
    const shieldPower = engine.activePowerUps.find(p => p.type === 'shield');
    return !!shieldPower || (dinoConfig.id === 'electric_tri' && engineRef.current.level >= 1 && engineRef.current.score < 5); // Tank starts sheltered
  };

  // Slide Action trigger
  const setDucking = (ducking: boolean) => {
    engineRef.current.isDucking = ducking;
    if (ducking && engineRef.current.dinoY === 0) {
      // Spawn skid marks dust particle
      createExplosion(55, engineRef.current.groundY, '#94a3b8', 2, 'square');
    }
  };

  // Laser Weapon Blaster shoot trigger
  const triggerShoot = () => {
    const engine = engineRef.current;
    if (!dinoConfig.canShoot || isPaused) return;

    const hasLaserPower = engine.activePowerUps.find(p => p.type === 'laser');
    
    if (engine.ammo > 0 || customRules.unlimitedAmmo || hasLaserPower) {
      // Shoot!
      if (!customRules.unlimitedAmmo && !hasLaserPower) {
        engine.ammo -= 1;
        setAmmo(engine.ammo);
      }

      engine.idCounter++;
      engine.lasers.push({
        id: engine.idCounter,
        x: 85,
        y: engine.groundY - engine.dinoY - (engine.isDucking ? 20 : 42),
        width: 25,
        height: 6,
        speed: 13,
      });

      audio.playLaser();
      
      // Visual recoil sparks
      createExplosion(80, engine.groundY - engine.dinoY - (engine.isDucking ? 20 : 42), dinoConfig.color, 4, 'circle');
    }
  };

  // Create customized vector particle arrays
  const createExplosion = (x: number, y: number, color: string, count = 10, shape: 'circle' | 'square' | 'star' = 'circle') => {
    const engine = engineRef.current;
    for (let i = 0; i < count; i++) {
      engine.idCounter++;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 4.5;
      engine.particles.push({
        id: engine.idCounter,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 2), // slightly upwards drift
        radius: 2 + Math.random() * 4,
        color,
        alpha: 1.0,
        decay: 0.015 + Math.random() * 0.02,
        shape,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
      });
    }
  };

  // Physics updates and spawn checks
  const updateGame = (dt: number) => {
    const engine = engineRef.current;
    
    // Increase internal game timing
    engine.gameTime += dt;

    // Gradual velocity scaling
    const cap = customRules.speedCap;
    engine.currentSpeed = Math.min(
      customRules.baseSpeed + (engine.score * 0.006),
      cap
    );

    // If slow-mo active, halve speed
    const isSlowMo = engine.activePowerUps.some(pw => pw.type === 'slow_mo');
    if (isSlowMo) {
      engine.currentSpeed *= 0.55;
    }

    // Ammo regenerative charging
    if (engine.gameTime - engine.lastAmmoChargeTime > 3000) {
      if (engine.ammo < 5) {
        engine.ammo += 1;
        setAmmo(engine.ammo);
      }
      engine.lastAmmoChargeTime = engine.gameTime;
    }

    // Score ticks increments
    const gainBonus = dinoConfig.id === 'golden_steg' ? 2 : 1;
    engine.score += (dt * 0.015) * gainBonus;
    
    // Score update matching state layout
    const oldLevel = engine.level;
    const computedLevel = Math.max(1, Math.min(5, Math.floor(engine.score / 350) + 1));
    if (computedLevel !== oldLevel) {
      engine.level = computedLevel;
      setGameLevel(computedLevel);
      audio.playLevelUp();
      // Level progression effect particles
      createExplosion(engine.width / 2, engine.height / 3, '#10b981', 35, 'star');
    }
    
    setCurrentScore(Math.floor(engine.score));

    // Update active powerup timers
    const updatedPowerUps: ActivePowerUp[] = [];
    for (const p of engine.activePowerUps) {
      p.durationRemaining -= dt;
      if (p.durationRemaining > 0) {
        updatedPowerUps.push(p);
      } else {
        // Powerup finished beep
        createExplosion(60, engine.groundY - engine.dinoY, '#a855f7', 10, 'circle');
      }
    }
    engine.activePowerUps = updatedPowerUps;

    // Sync React states less aggressively (only when actual collections shift)
    if (engine.gameTime % 250 < dt) {
      setActiveEffects([...engine.activePowerUps]);
    }

    // Parallax background computations
    engine.bgScroll1 = (engine.bgScroll1 + (engine.currentSpeed * 0.08)) % 800;
    engine.bgScroll2 = (engine.bgScroll2 + (engine.currentSpeed * 0.18)) % 800;
    engine.groundScroll = (engine.groundScroll + engine.currentSpeed) % 800;

    // Apply gravity
    const weightFactor = dinoConfig.weight / 0.5;
    const customGravity = customRules.gravity * weightFactor;

    // Cyber pterodactyl slow-glide mechanic if Up key held while falling
    const isGlider = dinoConfig.id === 'cyber_pter';
    const finalGravity = (isGlider && engine.isJumping && engine.keys.up && engine.dinoVy < 1.0) 
      ? customGravity * 0.45 
      : customGravity;

    engine.dinoY += engine.dinoVy;
    engine.dinoVy -= finalGravity;

    if (engine.dinoY <= 0) {
      engine.dinoY = 0;
      engine.dinoVy = 0;
      engine.isJumping = false;
      engine.jumpCount = 0;
    }

    // Spawn obstacles dynamically based on Level and rules
    const obstaclesCountMultiplier = customRules.spawnRateMultiplier;
    const obstacleSpawnThreshold = Math.max(1200, 2400 - (engine.level * 220)) / obstaclesCountMultiplier;
    
    if (engine.gameTime - engine.lastObstacleSpawn > obstacleSpawnThreshold) {
      spawnObstacle();
      engine.lastObstacleSpawn = engine.gameTime;
    }

    // Spawn rotating coins
    const coinSpawnInterval = Math.max(900, 1800 - (engine.level * 100));
    if (engine.gameTime - engine.lastCoinSpawn > coinSpawnInterval) {
      spawnCoin();
      engine.lastCoinSpawn = engine.gameTime;
    }

    // Spawn valuable powerups
    const powerUpsRateMultiplier = customRules.powerUpRate;
    const powerUpThreshold = (8000 + Math.random() * 6000) / powerUpsRateMultiplier;
    if (engine.gameTime - engine.lastPowerUpSpawn > powerUpThreshold) {
      spawnPowerUp();
      engine.lastPowerUpSpawn = engine.gameTime;
    }

    // UPDATE LASERS
    engine.lasers = engine.lasers.filter((laser) => {
      laser.x += laser.speed;
      
      // Explosion triggers for targets within projectile paths
      let hit = false;
      engine.obstacles = engine.obstacles.filter((obs) => {
        if (!customRules.obstacleDestructible) return true; // not shootable

        const collisionX = laser.x + laser.width >= obs.x && laser.x <= obs.x + obs.width;
        const collisionY = laser.y >= obs.y && laser.y <= obs.y + obs.height;

        if (collisionX && collisionY) {
          hit = true;
          // Spawn neon dust!
          createExplosion(obs.x + obs.width / 2, obs.y + obs.height / 2, themeConfig.obstacleColor, 15, 'star');
          audio.playExplode();
          
          // Small reward tick
          engine.score += 25;
          return false; // delete target
        }
        return true;
      });

      return !hit && laser.x < engine.width; // keep if no hits and on screen
    });

    // UPDATE COINS (Golden aureum steg grabs items magnetically!)
    const magnetActive = dinoConfig.id === 'golden_steg';
    engine.fallingCoins = engine.fallingCoins.filter((coin) => {
      // Move coin left
      if (magnetActive && coin.x < 190 && coin.x > 30) {
        // Float coin towards the dinosaur mouth!
        const dinoHeight = engine.isDucking ? 20 : 45;
        const targetDinoY = engine.groundY - engine.dinoY - dinoHeight;
        
        coin.x += (50 - coin.x) * 0.12;
        coin.y += (targetDinoY - coin.y) * 0.12;
      } else {
        coin.x -= engine.currentSpeed;
      }

      // Check collision
      const dinoHeightLimit = engine.isDucking ? 28 : 56;
      const dinoYPos = engine.groundY - engine.dinoY - dinoHeightLimit;

      const collX = 50 + 45 >= coin.x && 50 <= coin.x + coin.width;
      const collY = dinoYPos + dinoHeightLimit >= coin.y && dinoYPos <= coin.y + coin.height;

      if (collX && collY) {
        engine.coins += 1;
        setCoinsCollected(engine.coins);
        audio.playCoin();
        createExplosion(coin.x + 8, coin.y + 8, '#fbbf24', 6, 'star');
        engine.score += 10;
        return false; // remove
      }

      return coin.x > -30; // remove if off screen
    });

    // UPDATE POWERUPS
    engine.powerups = engine.powerups.filter((pow) => {
      pow.x -= engine.currentSpeed;

      const dinoHeightLimit = engine.isDucking ? 28 : 56;
      const dinoYPos = engine.groundY - engine.dinoY - dinoHeightLimit;

      const collX = 50 + 45 >= pow.x && 50 <= pow.x + pow.width;
      const collY = dinoYPos + dinoHeightLimit >= pow.y && dinoYPos <= pow.y + pow.height;

      if (collX && collY) {
        audio.playPowerUp();
        
        // Activate powerUp benefits
        const duration = pow.type === 'slow_mo' ? 6000 : pow.type === 'laser' ? 8000 : 7000;
        
        const existingIdx = engine.activePowerUps.findIndex((p) => p.type === pow.type);
        if (existingIdx !== -1) {
          engine.activePowerUps[existingIdx].durationRemaining = duration;
        } else {
          engine.activePowerUps.push({
            type: pow.type,
            durationRemaining: duration,
            maxDuration: duration,
          });
        }

        // Shield special behavior
        if (pow.type === 'shield' && dinoConfig.id === 'electric_tri') {
          // Extra protective layer
          createExplosion(pow.x, pow.y, '#3b82f6', 15, 'circle');
        } else {
          createExplosion(pow.x, pow.y, '#c084fc', 12, 'star');
        }

        return false;
      }

      return pow.x > -30;
    });

    // UPDATE OBSTACLES & COLLISIONS
    let obstacleIndexToRemove = -1;
    let index = 0;
    for (const obs of engine.obstacles) {
      obs.x -= engine.currentSpeed;

      // Check collision bounding values
      const raptorWidth = 38;
      const dinoHeightLimit = engine.isDucking ? 26 : 54;
      const dinoYPos = engine.groundY - engine.dinoY - dinoHeightLimit;
      
      const collX = (50 + raptorWidth >= obs.x + 2) && (50 <= obs.x + obs.width - 2);
      const collY = (dinoYPos + dinoHeightLimit >= obs.y + 2) && (dinoYPos <= obs.y + obs.height - 2);

      if (collX && collY) {
        // Collided!
        if (hasActiveShield()) {
          // Break Shield instead of hurting dino!
          audio.playExplode();
          createExplosion(obs.x + obs.width / 2, obs.y + obs.height / 2, '#3b82f6', 20, 'circle');
          
          // Remove active shield power
          engine.activePowerUps = engine.activePowerUps.filter(p => p.type !== 'shield');
          obstacleIndexToRemove = index;
          break;
        } else {
          // Game Over sequence
          audio.playHit();
          onGameOver(Math.floor(engine.score), engine.coins, engine.level);
          return;
        }
      }

      index++;
    }

    if (obstacleIndexToRemove !== -1) {
      engine.obstacles.splice(obstacleIndexToRemove, 1);
    }

    // Filter obstacles offscreen
    engine.obstacles = engine.obstacles.filter((obs) => obs.x > -obs.width);

    // Particles updates
    engine.particles = engine.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.rotation !== undefined && p.rotSpeed !== undefined) {
        p.rotation += p.rotSpeed;
      }
      return p.alpha > 0;
    });

    // Spawn trailing runner smoke particles from dino feet while running
    if (engine.dinoY === 0 && Math.random() < (engine.currentSpeed * 0.02) && !isPaused) {
      engine.idCounter++;
      engine.particles.push({
        id: engine.idCounter,
        x: 48,
        y: engine.groundY - 1,
        vx: -engine.currentSpeed * 0.35 - (Math.random() * 1.5),
        vy: -0.2 - (Math.random() * 1.1),
        radius: 1.5 + Math.random() * 3,
        color: themeConfig.id === 'candy' ? '#db2777' : themeConfig.gridColor,
        alpha: 0.6,
        decay: 0.03 + Math.random() * 0.04,
        shape: 'circle',
      });
    }
  };

  // Create an obstacle
  const spawnObstacle = () => {
    const engine = engineRef.current;
    engine.idCounter++;

    let type: ObstacleType = 'cactus_small';
    let width = 24;
    let height = 44;
    let y = engine.groundY - height;

    // Pick obstacle types depending on level progression & environment
    const randomSeed = Math.random();

    if (engine.level === 1) {
      type = randomSeed < 0.6 ? 'cactus_small' : 'cactus_large';
      width = type === 'cactus_small' ? 22 : 36;
      height = type === 'cactus_small' ? 42 : 54;
      y = engine.groundY - height;
    } else if (engine.level === 2) {
      if (randomSeed < 0.4) {
        type = 'cactus_small';
        width = 22; height = 42;
        y = engine.groundY - height;
      } else if (randomSeed < 0.75) {
        type = 'cactus_large';
        width = 38; height = 56;
        y = engine.groundY - height;
      } else {
        type = 'pterodactyl';
        width = 44; height = 30;
        // high or medium flying height (forcing ducking vs jumping choices!)
        y = Math.random() < 0.5 ? engine.groundY - 32 : engine.groundY - 60;
      }
    } else {
      // Level 3+ gets meteors, volcano drips, candies depending on active theme
      if (themeId === 'volcano') {
        if (randomSeed < 0.4) {
          type = 'cactus_small';
          width = 22; height = 42;
          y = engine.groundY - height;
        } else if (randomSeed < 0.7) {
          type = 'meteor';
          width = 40; height = 40;
          y = 5; // falling from above sky!
        } else {
          type = 'lava_drip';
          width = 15; height = 30;
          y = 0;
        }
      } else if (themeId === 'candy') {
        type = randomSeed < 0.55 ? 'cactus_small' : 'lollipop';
        width = type === 'lollipop' ? 32 : 22;
        height = type === 'lollipop' ? 52 : 42;
        y = engine.groundY - height;
      } else {
        // Standard random selector
        if (randomSeed < 0.35) {
          type = 'cactus_small';
          width = 22; height = 42;
          y = engine.groundY - height;
        } else if (randomSeed < 0.7) {
          type = 'cactus_large';
          width = 38; height = 56;
          y = engine.groundY - height;
        } else {
          type = 'pterodactyl';
          width = 44; height = 32;
          y = Math.random() < 0.5 ? engine.groundY - 32 : engine.groundY - 62;
        }
      }
    }

    engine.obstacles.push({
      id: engine.idCounter,
      x: engine.width + 10,
      y,
      width,
      height,
      type,
      speed: engine.currentSpeed,
      frame: 0,
      passed: false,
    });
  };

  // Create rotating collectibles
  const spawnCoin = () => {
    const engine = engineRef.current;
    engine.idCounter++;

    // Don't clutter ground
    const coinY = engine.groundY - 24 - (Math.random() * 85);
    engine.fallingCoins.push({
      id: engine.idCounter,
      x: engine.width + 30,
      y: coinY,
      width: 16,
      height: 16,
    });
  };

  // Create random glowing items
  const spawnPowerUp = () => {
    const engine = engineRef.current;
    engine.idCounter++;

    const types: PowerUpType[] = ['shield', 'slow_mo', 'laser', 'jump_boost'];
    // Filter shoot power if dinosaur represents non-gun layout
    const activeTypeList = dinoConfig.canShoot ? types : types.filter(t => t !== 'laser');
    
    const pickedType = activeTypeList[Math.floor(Math.random() * activeTypeList.length)];

    const powerUpY = engine.groundY - 35 - (Math.random() * 50);

    engine.powerups.push({
      id: engine.idCounter,
      x: engine.width + 40,
      y: powerUpY,
      width: 22,
      height: 22,
      type: pickedType,
    });
  };

  // RENDER DRAWING DIRECTLY TO CANVAS
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const engine = engineRef.current;

    // Clear background
    ctx.clearRect(0, 0, engine.width, engine.height);

    // Draw sky sky colors
    const gradient = ctx.createLinearGradient(0, 0, 0, engine.height);
    gradient.addColorStop(0, themeConfig.skyColor);
    gradient.addColorStop(0.7, themeConfig.skyColor);
    // ground blend transition colors
    gradient.addColorStop(1, themeConfig.groundColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, engine.width, engine.height);

    // Draw atmospheric sky details depending on Theme selected
    drawThemeAtmosphere(ctx);

    // Draw ground grid / horizontal neon floor
    drawGround(ctx);

    // Draw falling meteors and drips
    drawEnvironmentHazards(ctx);

    // Draw individual active groups
    drawPowerUps(ctx);
    drawCoins(ctx);
    drawLasers(ctx);
    drawObstacles(ctx);
    drawDinosaur(ctx);
    drawParticles(ctx);
  };

  // Weather and backdrop layer items
  const drawThemeAtmosphere = (ctx: CanvasRenderingContext2D) => {
    const engine = engineRef.current;
    
    if (themeConfig.id === 'neon') {
      // Draw massive synthetic wireframe sun
      const sunX = engine.width / 2;
      const sunY = engine.height - 110;
      const radius = 60;
      
      ctx.save();
      const sunGrad = ctx.createLinearGradient(sunX, sunY - radius, sunX, sunY + radius);
      sunGrad.addColorStop(0, '#f43f5e');
      sunGrad.addColorStop(0.5, '#ec4899');
      sunGrad.addColorStop(1, '#eab308');
      
      ctx.fillStyle = sunGrad;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#d946ef';
      
      ctx.beginPath();
      ctx.arc(sunX, sunY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Horizon synth horizontal lines split
      ctx.fillStyle = themeConfig.skyColor;
      for (let i = sunY - radius + 20; i < sunY + radius; i += 10) {
        // increase size
        const h = 2 + (i - (sunY - radius)) * 0.05;
        ctx.fillRect(sunX - radius - 5, i, radius * 2 + 10, h);
      }

      // Draw faint cyber stars stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let i = 0; i < 15; i++) {
        const x = (i * 123) % engine.width;
        const y = (i * 47) % (engine.groundY - 100);
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    } 
    else if (themeConfig.id === 'jungle') {
      // Draw huge pixel mountain silhouettes or starry moon
      ctx.fillStyle = 'rgba(6, 78, 59, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, engine.groundY);
      ctx.quadraticCurveTo(engine.width * 0.25, engine.groundY - 80, engine.width * 0.5, engine.groundY);
      ctx.quadraticCurveTo(engine.width * 0.75, engine.groundY - 110, engine.width, engine.groundY);
      ctx.fill();

      // Draw green hanging vines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 6; i++) {
        const x = (i * 140 + 50) % engine.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.quadraticCurveTo(x + 10, 40, x - 5, 80);
        ctx.stroke();
      }
    } 
    else if (themeConfig.id === 'volcano') {
      // Dark smoldering active background vulcanos
      const scrollX = (engine.bgScroll1 * 0.5) % engine.width;
      ctx.fillStyle = 'rgba(220, 38, 38, 0.15)';
      
      // Left volcano
      ctx.beginPath();
      ctx.moveTo(100 - scrollX, engine.groundY);
      ctx.lineTo(160 - scrollX, engine.groundY - 90);
      ctx.lineTo(200 - scrollX, engine.groundY - 90); // crater opening
      ctx.lineTo(260 - scrollX, engine.groundY);
      ctx.fill();

      // Lava eruption glow line
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(170 - scrollX, engine.groundY - 90);
      ctx.lineTo(165 - scrollX, engine.groundY - 60);
      ctx.lineTo(158 - scrollX, engine.groundY - 20);
      ctx.stroke();

      // Right distant volcano
      ctx.beginPath();
      ctx.moveTo(450 - scrollX, engine.groundY);
      ctx.lineTo(520 - scrollX, engine.groundY - 110);
      ctx.lineTo(550 - scrollX, engine.groundY - 110);
      ctx.lineTo(620 - scrollX, engine.groundY);
      ctx.fill();
    }
    else if (themeConfig.id === 'candy') {
      // Sweet rolling pink jelly mountains
      ctx.fillStyle = 'rgba(112, 26, 117, 0.35)';
      ctx.beginPath();
      ctx.arc(150, engine.groundY, 110, Math.PI, 0);
      ctx.arc(480, engine.groundY, 90, Math.PI, 0);
      ctx.arc(750, engine.groundY, 120, Math.PI, 0);
      ctx.fill();

      // Sparkles in sky
      ctx.fillStyle = 'rgba(244, 114, 182, 0.4)';
      for (let i = 0; i < 8; i++) {
        const x = (i * 97) % engine.width;
        const y = (i * 39) % (engine.groundY - 100);
        ctx.beginPath();
        ctx.arc(x, y, 2.5 + (i % 2), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  // Draw cyber ground grid
  const drawGround = (ctx: CanvasRenderingContext2D) => {
    const engine = engineRef.current;
    
    // Solid floor baseline
    ctx.fillStyle = themeConfig.groundColor;
    ctx.fillRect(0, engine.groundY, engine.width, engine.height - engine.groundY);

    // Futuristic horizontal grid rails
    ctx.strokeStyle = themeConfig.gridColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, engine.groundY);
    ctx.lineTo(engine.width, engine.groundY);
    ctx.stroke();

    if (themeConfig.id === 'neon') {
      // Moving wireframe vertical prospective lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.4)';
      const lineInterval = 40;
      const count = Math.ceil(engine.width / lineInterval) + 4;
      const modX = engine.groundScroll % lineInterval;
      
      for (let i = -2; i < count; i++) {
        const xStart = i * lineInterval - modX;
        ctx.beginPath();
        ctx.moveTo(xStart, engine.groundY);
        // prospective angle projection
        ctx.lineTo(xStart - 40, engine.height);
        ctx.stroke();
      }

      // Decreasing horizon spacing markers
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      for (let y = engine.groundY + 4; y < engine.height; y += 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(engine.width, y);
        ctx.stroke();
      }
    } else {
      // Simpler layered ground texture
      ctx.fillStyle = themeConfig.id === 'candy' ? '#db2777' : 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, engine.groundY + 4, engine.width, 3);
    }
  };

  // Meterological hazards logic
  const drawEnvironmentHazards = (ctx: CanvasRenderingContext2D) => {
    const engine = engineRef.current;

    engine.obstacles.forEach((obs) => {
      if (obs.type === 'meteor') {
        // Fall slowly diagonally
        obs.y += 1.5;
        obs.x -= 0.5;

        // Lava meteor core draw
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#f97316';
        
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Glowing center
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } 
      else if (obs.type === 'lava_drip') {
        obs.y += 3.8; // highly vertical falling

        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(obs.x + obs.width / 2, obs.y);
        ctx.quadraticCurveTo(obs.x + obs.width, obs.y + obs.height, obs.x + obs.width / 2, obs.y + obs.height);
        ctx.quadraticCurveTo(obs.x, obs.y + obs.height, obs.x + obs.width / 2, obs.y);
        ctx.fill();
      }
    });
  };

  // Procedural obstacle vector drawer (Guarantees elegant visuals + 0 assets risk!)
  const drawObstacles = (ctx: CanvasRenderingContext2D) => {
    const engine = engineRef.current;

    engine.obstacles.forEach((obs) => {
      ctx.fillStyle = themeConfig.obstacleColor;
      
      // Add custom lighting glow
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = themeConfig.obstacleColor;

      if (obs.type === 'cactus_small' || obs.type === 'cactus_large') {
        // Draw elegant retro cactus tree
        const w = obs.width;
        const h = obs.height;
        const x = obs.x;
        const y = obs.y;

        // Main central trunk
        ctx.fillRect(x + w / 2 - 4, y, 8, h);
        
        // Left branch check & trunk base
        ctx.fillRect(x, y + h * 0.35, w / 2 - 4, 6);
        ctx.fillRect(x, y + h * 0.18, 6, h * 0.22);

        // Right branch check & trunk base
        ctx.fillRect(x + w / 2 + 4, y + h * 0.45, w / 2 - 4, 6);
        ctx.fillRect(x + w - 6, y + h * 0.28, 6, h * 0.2);

        // Horizontal bottom roots
        ctx.fillRect(x + w / 2 - 8, y + h - 4, 16, 4);
      } 
      else if (obs.type === 'pterodactyl') {
        // Flapping dragon coordinates
        const wingFrame = Math.floor(engine.gameTime / 120) % 2;
        const oX = obs.x;
        const oY = obs.y;
        const w = obs.width;
        const h = obs.height;

        ctx.fillStyle = '#ec4899'; // Neon magenta dragon
        ctx.shadowColor = '#f43f5e';
        
        // Body central diamond
        ctx.beginPath();
        ctx.moveTo(oX, oY + h/2);
        ctx.lineTo(oX + w/2, oY + h*0.2);
        ctx.lineTo(oX + w, oY + h/2);
        ctx.lineTo(oX + w/2, oY + h*0.8);
        ctx.closePath();
        ctx.fill();

        // Wing vector flapping lines
        ctx.beginPath();
        ctx.moveTo(oX + w/2, oY + h*0.4);
        if (wingFrame === 0) {
          // Wing Up
          ctx.lineTo(oX + w*0.2, oY - 6);
          ctx.lineTo(oX + w*0.1, oY + h*0.2);
        } else {
          // Wing Down
          ctx.lineTo(oX + w*0.2, oY + h + 6);
          ctx.lineTo(oX + w*0.1, oY + h*0.6);
        }
        ctx.lineTo(oX + w/2, oY + h*0.5);
        ctx.closePath();
        ctx.fill();

        // Tail spikes
        ctx.fillRect(oX + w - 4, oY + h/2 - 2, 4, 4);
      }
      else if (obs.type === 'lollipop') {
        // Sugar cane spiral
        const oX = obs.x;
        const oY = obs.y;
        const w = obs.width;
        const h = obs.height;

        // Stick
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(oX + w/2 - 2, oY + h/2, 4, h/2);

        // Circular hard pop core
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.beginPath();
        ctx.arc(oX + w/2, oY + w/2, w/2, 0, Math.PI * 2);
        ctx.fill();

        // Swirl line detail
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(oX + w/2, oY + w/2, w/2.8, 0, Math.PI, false);
        ctx.stroke();
      }

      ctx.restore();
    });
  };

  // Draw interactive powerUP assets glowing inside hex boxes
  const drawPowerUps = (ctx: CanvasRenderingContext2D) => {
    const engine = engineRef.current;

    engine.powerups.forEach((pow) => {
      ctx.save();
      ctx.shadowBlur = 12;

      let color = '#c084fc';
      let icon = '⚡';

      if (pow.type === 'shield') {
        color = '#38bdf8';
        icon = '🛡️';
      } else if (pow.type === 'slow_mo') {
        color = '#10b981';
        icon = '⏱️';
      } else if (pow.type === 'laser') {
        color = '#eab308';
        icon = '🔫';
      } else if (pow.type === 'jump_boost') {
        color = '#ec4899';
        icon = '👟';
      }

      ctx.shadowColor = color;
      
      // Outer neon hex spinner
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      const angle = (engine.gameTime * 0.003) % (Math.PI * 2);
      
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const theta = angle + (i * Math.PI) / 3;
        const px = pow.x + pow.width / 2 + Math.cos(theta) * (pow.width / 2);
        const py = pow.y + pow.height / 2 + Math.sin(theta) * (pow.height / 2);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      // Semi-transparent center base box
      ctx.fillStyle = `${color}20`;
      ctx.fill();

      // Core icon text indicator
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, pow.x + pow.width / 2, pow.y + pow.height / 2);

      ctx.restore();
    });
  };

  // Draw floating coin structures
  const drawCoins = (ctx: CanvasRenderingContext2D) => {
    const engine = engineRef.current;

    engine.fallingCoins.forEach((coin) => {
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fbbf24';

      // Shaded 3D oval coin rotation logic based on time
      const shrinkCoeff = Math.abs(Math.sin(engine.gameTime * 0.007));
      const cx = coin.x + coin.width / 2;
      const cy = coin.y + coin.height / 2;

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(cx, cy, (coin.width / 2) * shrinkCoeff, coin.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner stamp
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, (coin.width / 3.5) * shrinkCoeff, coin.height / 3.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    });
  };

  // Draw fired laser projectiles
  const drawLasers = (ctx: CanvasRenderingContext2D) => {
    const engine = engineRef.current;

    engine.lasers.forEach((laser) => {
      ctx.save();
      ctx.shadowBlur = 14;
      ctx.shadowColor = dinoConfig.color;
      
      const gradient = ctx.createLinearGradient(laser.x, 0, laser.x + laser.width, 0);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(0.5, dinoConfig.color);
      gradient.addColorStop(1, '#ffffff');

      ctx.fillStyle = gradient;
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
      ctx.restore();
    });
  };

  // Draw vector dinosaur characters
  const drawDinosaur = (ctx: CanvasRenderingContext2D) => {
    const engine = engineRef.current;
    
    // Position
    const dX = 50;
    const dRectHeight = engine.isDucking ? 30 : 60;
    const dRectWidth = 48;
    const dY = engine.groundY - engine.dinoY - dRectHeight;

    ctx.save();
    
    // Neon glow around the dinosaur
    ctx.shadowBlur = 15;
    ctx.shadowColor = dinoConfig.color;

    // Draw active defensive energy Shield forcefield if active
    if (hasActiveShield()) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(dX + dRectWidth / 2, dY + dRectHeight / 2, Math.max(dRectWidth, dRectHeight) * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    }

    // DRAW DINOSAUR PROCEDURAL BODIES UPON COGNITIVE VECTORS (Jurassic Sparkles!)
    ctx.fillStyle = dinoConfig.color;

    if (engine.isDucking) {
      // SLIDING SQUAT DESIGN (A real cute crawler dino)
      // Main crawl torso
      ctx.fillRect(dX, dY + 6, dRectWidth, 24);
      
      // Slanted duck mouth
      ctx.beginPath();
      ctx.moveTo(dX + dRectWidth, dY + 12);
      ctx.lineTo(dX + dRectWidth + 12, dY + 18);
      ctx.lineTo(dX + dRectWidth, dY + 22);
      ctx.fill();

      // Tail trailing
      ctx.beginPath();
      ctx.moveTo(dX, dY + 10);
      ctx.lineTo(dX - 14, dY + 18);
      ctx.lineTo(dX, dY + 28);
      ctx.fill();

      // Eye sparkling orange
      ctx.fillStyle = dinoConfig.eyeColor;
      ctx.fillRect(dX + dRectWidth - 8, dY + 10, 4, 4);

      // Running horizontal legs
      ctx.fillStyle = dinoConfig.accentColor;
      const rStep = Math.sin(engine.gameTime * 0.02) > 0;
      ctx.fillRect(dX + 8, dY + 28, 5, 2);
      ctx.fillRect(dX + 28, dY + 28, 5, 2);
    } 
    else {
      // STANDARD UPRIGHT T-REX & HERBIVORE RATIONAL SHAPES
      // Large box head
      ctx.fillRect(dX + 18, dY, 26, 22);
      ctx.fillRect(dX + 18, dY + 14, 30, 8); // jaws snout

      // Thick supporting Neck
      ctx.fillRect(dX + 14, dY + 20, 14, 18);
      
      // Large robust ribcage body torso
      ctx.fillRect(dX + 4, dY + 26, 26, 22);
      
      // Dino hands / tiny claws
      ctx.fillStyle = dinoConfig.accentColor;
      ctx.fillRect(dX + 30, dY + 28, 6, 4);
      ctx.fillRect(dX + 4, dY + 60, 4, 4); // foot heels

      // Beautiful long dynamic Tail curving upwards and downwards
      ctx.fillStyle = dinoConfig.color;
      ctx.beginPath();
      ctx.moveTo(dX + 4, dY + 28);
      // tail curve vector
      ctx.lineTo(dX - 12, dY + 32 + Math.sin(engine.gameTime * 0.007) * 4);
      ctx.lineTo(dX + 4, dY + 45);
      ctx.fill();

      // Eye slot
      ctx.fillStyle = dinoConfig.eyeColor;
      ctx.fillRect(dX + 30, dY + 5, 4, 4);

      // Moving animated running feet legs
      ctx.fillStyle = dinoConfig.accentColor;
      const legOffset = Math.sin(engine.gameTime * 0.012) * 8;
      
      if (engine.isJumping) {
        // Bent legs in mid-flight suspension!
        ctx.fillRect(dX + 10, dY + 48, 6, 8);
        ctx.fillRect(dX + 22, dY + 48, 6, 8);
      } else {
        // Alternating stride runner limbs
        ctx.fillRect(dX + 8, dY + 48, 6, 12 + legOffset);
        ctx.fillRect(dX + 20, dY + 48, 6, 12 - legOffset);
      }
    }

    ctx.restore();
  };

  // Draw colorful aesthetic particle bursts
  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    const engine = engineRef.current;

    engine.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'star') {
        const cx = p.x;
        const cy = p.y;
        const spikes = 5;
        const outerRadius = p.radius;
        const innerRadius = p.radius / 2;
        let rot = p.rotation !== undefined ? p.rotation : Math.PI / 2 * 3;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
          let x = cx + Math.cos(rot) * outerRadius;
          let y = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;

          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
      } 
      else if (p.shape === 'square') {
        ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      } 
      else {
        // default circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  };

  // Sound toggling control
  const handleToggleMute = () => {
    const isMuted = audio.toggleMute();
    setMuted(isMuted);
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-4xl mx-auto select-none" ref={containerRef}>
      
      {/* Top Unified HUD Row Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white rounded-2xl border-b-6 border-indigo-900/10 text-indigo-950 font-sans shadow-lg">
        
        {/* Left Side: Level, Active Dino Icon, Theme & Mute */}
        <div className="flex items-center gap-3">
          <span className="text-2xl filter drop-shadow animate-bounce-slow" title={`Dinosaur Companion: ${dinoConfig.name}`}>
            {dinoConfig.icon}
          </span>
          
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">RUNNING</span>
            <span className="text-xs sm:text-sm font-black text-indigo-950 mt-1 uppercase leading-none">
              Lv. {gameLevel} — {themeConfig.name}
            </span>
          </div>

          <button
            onClick={handleToggleMute}
            className="p-1 px-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-150 transition cursor-pointer"
            title="Toggle Synthesizer Mute"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-pink-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
        </div>

        {/* Middle: Active Power-up Progress Bars */}
        <div className="hidden lg:flex items-center gap-2">
          {activeEffects.map((effect) => {
            let color = 'bg-pink-500';
            let label = 'BOOST';
            if (effect.type === 'shield') { color = 'bg-indigo-650'; label = 'SHIELD'; }
            if (effect.type === 'slow_mo') { color = 'bg-emerald-500'; label = 'SLOW-MO'; }
            if (effect.type === 'laser') { color = 'bg-yellow-500'; label = 'BLASTER'; }
            if (effect.type === 'jump_boost') { color = 'bg-fuchsia-500'; label = 'HIGH JUMP'; }

            const percent = Math.max(0, Math.min(100, (effect.durationRemaining / effect.maxDuration) * 100));

            return (
              <div key={effect.type} className="flex items-center gap-1.5 bg-indigo-50 rounded-xl px-2 py-0.5 border border-indigo-100 text-[9px]">
                <span className="font-extrabold text-indigo-900 uppercase tracking-tight">{label}</span>
                <div className="w-12 h-1.5 bg-indigo-150 rounded-full overflow-hidden p-0.5 border border-indigo-200">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Coins, Score, and Actions (Pause, Abort) */}
        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <div className="text-right">
            <span className="text-[9px] font-black leading-none text-indigo-400 uppercase tracking-wider block">COINS</span>
            <span className="text-xs sm:text-sm font-black text-yellow-600 font-sans mt-0.5 block whitespace-nowrap">
              ⭐ {coinsCollected}
            </span>
          </div>

          <div className="text-right font-sans">
            <span className="text-[9px] font-black leading-none text-indigo-400 uppercase tracking-wider block">SCORE</span>
            <span className="text-sm sm:text-base font-black text-indigo-950 mt-0.5 block">
              {currentScore.toString().padStart(5, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 border-l-2 border-indigo-100 pl-2.5">
            <button
              onClick={onPauseToggle}
              className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[10px] font-black text-indigo-600 border-2 border-indigo-150 cursor-pointer transition uppercase"
              title="Pause Game [Esc]"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>

            {onAbort && (
              <button
                onClick={onAbort}
                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-[10px] font-black text-rose-600 border-2 border-rose-150 cursor-pointer transition uppercase"
                title="Exit Game"
              >
                Exit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* The Rendering Canvas Screen Container */}
      <div className="relative overflow-hidden rounded-2xl border-4 md:border-5 border-indigo-950 shadow-2xl bg-indigo-950">
        <canvas ref={canvasRef} className="block w-full" />

        {/* Hover Pause Info Overlays */}
        {isPaused && (
          <div className="absolute inset-0 bg-indigo-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-center text-white" id="canvas-paused-screen">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-6 bg-white rounded-3xl border-b-8 border-indigo-900/10 max-w-sm text-indigo-950 shadow-2xl mx-4 animate-scale-up"
            >
              <h3 className="text-lg font-black uppercase tracking-tight text-indigo-900 font-display">Physics Engine Paused</h3>
              <p className="text-xs text-indigo-500 mt-2 leading-relaxed font-semibold">
                Use Escape key, Spacebar, or tap play below to resume your galactic run!
              </p>
              <button
                onClick={onPauseToggle}
                className="mt-4 px-5 py-2 bg-yellow-400 hover:bg-yellow-350 text-indigo-950 font-black text-xs tracking-widest rounded-xl transition cursor-pointer border-b-4 border-yellow-600 uppercase"
              >
                Resume Run
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Desktop/Console Indicators or Mobile Touch Pads depending on viewport/toggle */}
      {showTouchControls && (
        <div className="grid grid-cols-3 gap-2.5 w-full mt-0.5" id="arcade-mobile-controller">
          {/* Left Side: Jump Action Trigger */}
          <button
            onMouseDown={() => { engineRef.current.keys.up = true; triggerJump(); }}
            onMouseUp={() => { engineRef.current.keys.up = false; }}
            onTouchStart={(e) => { e.preventDefault(); engineRef.current.keys.up = true; triggerJump(); }}
            onTouchEnd={(e) => { e.preventDefault(); engineRef.current.keys.up = false; }}
            className="flex flex-col items-center justify-center p-2.5 bg-emerald-500 hover:bg-emerald-450 active:scale-95 border-b-4 border-emerald-700 rounded-xl text-white cursor-pointer select-none transition"
          >
            <ArrowUp className="w-5 h-5 text-white" />
            <span className="text-[9px] font-black mt-0.5 tracking-wider uppercase">Leap Jump</span>
          </button>

          {/* Middle Side: Weapon Blaster shoot */}
          <button
            onClick={triggerShoot}
            disabled={!dinoConfig.canShoot}
            className={`flex flex-col items-center justify-center p-2.5 active:scale-95 border-b-4 rounded-xl text-white cursor-pointer select-none transition ${
              dinoConfig.canShoot 
                ? 'bg-yellow-400 hover:bg-yellow-350 border-yellow-600 text-indigo-950 font-black' 
                : 'bg-indigo-50 border-indigo-150 text-indigo-300 cursor-not-allowed opacity-50'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[9px] font-black mt-0.5 tracking-wider uppercase">
              {dinoConfig.canShoot ? `Blast (${ammo})` : 'No Blaster'}
            </span>
          </button>

          {/* Right Side: Duck Slider trigger */}
          <button
            onMouseDown={() => setDucking(true)}
            onMouseUp={() => setDucking(false)}
            onTouchStart={(e) => { e.preventDefault(); setDucking(true); }}
            onTouchEnd={(e) => { e.preventDefault(); setDucking(false); }}
            className="flex flex-col items-center justify-center p-2.5 bg-pink-500 hover:bg-pink-450 active:scale-95 border-b-4 border-pink-700 rounded-xl text-white cursor-pointer select-none transition"
          >
            <ArrowDown className="w-5 h-5 text-white" />
            <span className="text-[9px] font-black mt-0.5 tracking-wider uppercase">Slide Duck</span>
          </button>
        </div>
      )}

      {/* Helpful Hint Labels & Touch Toggle Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-1 px-1.5 text-[10px] text-white/50 font-mono tracking-wider uppercase">
        <span>Keyboard: [Space / W] Jump | [S / Down] Duck | [Shift / F] Blast | [Esc] Pause</span>
        <button
          onClick={() => setShowTouchControls(!showTouchControls)}
          className="text-yellow-400 hover:text-yellow-300 font-black underline tracking-wide cursor-pointer uppercase transition-colors"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        >
          [ Toggle Click Controls: {showTouchControls ? 'ON' : 'OFF'} ]
        </button>
      </div>
    </div>
  );
};
