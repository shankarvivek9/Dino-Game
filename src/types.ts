/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeId = 'neon' | 'jungle' | 'volcano' | 'candy';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgGradient: string;
  skyColor: string;
  groundColor: string;
  gridColor: string;
  accentColor: string;
  obstacleColor: string;
  particleColors: string[];
  description: string;
}

export type DinoId = 'neon_rex' | 'cyber_pter' | 'electric_tri' | 'golden_steg';

export interface DinoCharacter {
  id: DinoId;
  name: string;
  color: string;
  eyeColor: string;
  accentColor: string;
  jumpForce: number;
  weight: number; // effect on gravity
  abilityName: string;
  abilityDesc: string;
  maxShields: number;
  hasDoubleJump: boolean;
  canShoot: boolean;
  icon: string;
}

export type GameState = 'MENU' | 'CHAR_SELECT' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'DINO_RULES' | 'ABOUT' | 'CONTACT' | 'PRIVACY' | 'TERMS';

export type ObstacleType = 'cactus_small' | 'cactus_large' | 'pterodactyl' | 'meteor' | 'lava_drip' | 'lollipop';

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
  speed: number;
  rotation?: number;
  frame?: number;
  passed: boolean;
}

export type PowerUpType = 'shield' | 'slow_mo' | 'laser' | 'jump_boost';

export interface PowerUpItem {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PowerUpType;
}

export interface CoinItem {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  durationRemaining: number; // in milliseconds or frames
  maxDuration: number;
}

export interface Laser {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  shape: 'circle' | 'square' | 'star';
  rotation?: number;
  rotSpeed?: number;
}

export interface GameRules {
  gravity: number;
  jumpForceMultiplier: number;
  baseSpeed: number;
  speedCap: number;
  spawnRateMultiplier: number;
  powerUpRate: number;
  unlimitedAmmo: boolean;
  obstacleDestructible: boolean;
}

export interface ScoreEntry {
  playerName: string;
  score: number;
  level: number;
  dinoId: DinoId;
  themeId: ThemeId;
  date: string;
}
