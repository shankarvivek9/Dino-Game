/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DinoCharacter, ThemeConfig } from '../types';

export const DINOSAURS: DinoCharacter[] = [
  {
    id: 'neon_rex',
    name: 'Neon Rex',
    color: '#22c55e', // vivid emerald neon green
    eyeColor: '#ef4444',
    accentColor: '#10b981',
    jumpForce: 13,
    weight: 0.5,
    abilityName: 'Electro Pulse',
    abilityDesc: 'Highly balanced. Can shoot laser pulse with a fast cooldown.',
    maxShields: 1,
    hasDoubleJump: true,
    canShoot: true,
    icon: '🦖',
  },
  {
    id: 'cyber_pter',
    name: 'Cyber Ptera',
    color: '#ec4899', // hot pink neon
    eyeColor: '#eab308',
    accentColor: '#f43f5e',
    jumpForce: 11,
    weight: 0.38, // super light
    abilityName: 'Gravity Glide',
    abilityDesc: 'Ultra light and aerodynamic. High double jump & slower falling speed.',
    maxShields: 1,
    hasDoubleJump: true,
    canShoot: false,
    icon: '🦅',
  },
  {
    id: 'electric_tri',
    name: 'Volt Tricera',
    color: '#06b6d4', // neon cyan/electric blue
    eyeColor: '#ffffff',
    accentColor: '#3b82f6',
    jumpForce: 12.5,
    weight: 0.55, // heavier
    abilityName: 'Hyper Laser',
    abilityDesc: 'A heavy defensive tank. Starts with an extra shield. Shoots double-strength beams.',
    maxShields: 2,
    hasDoubleJump: false,
    canShoot: true,
    icon: '🦏',
  },
  {
    id: 'golden_steg',
    name: 'Aureum Steg',
    color: '#fbbf24', // radiant amber/gold
    eyeColor: '#000000',
    accentColor: '#f59e0b',
    jumpForce: 12.2,
    weight: 0.52,
    abilityName: 'Golden Magnet & Coin Bonus',
    abilityDesc: 'A divine golden warrior. Attracts coins automatically and earns double scores!',
    maxShields: 1,
    hasDoubleJump: false,
    canShoot: true,
    icon: '🦕',
  },
];

export const THEMES: ThemeConfig[] = [
  {
    id: 'neon',
    name: 'Retro Cyberpunk',
    bgGradient: 'from-slate-950 via-slate-900 to-indigo-950',
    skyColor: '#0c0f24',
    groundColor: '#1e1b4b',
    gridColor: '#4f46e5',
    accentColor: '#d946ef',
    obstacleColor: '#06b6d4',
    particleColors: ['#ec4899', '#06b6d4', '#d946ef', '#a855f7'],
    description: 'Neon synthwave grid with starry space sky and digital glitches.',
  },
  {
    id: 'jungle',
    name: 'Vibrant Jungle',
    bgGradient: 'from-emerald-950 via-teal-900 to-sky-950',
    skyColor: '#0f172a',
    groundColor: '#064e3b',
    gridColor: '#10b981',
    accentColor: '#10b981',
    obstacleColor: '#fbbf24',
    particleColors: ['#10b981', '#a7f3d0', '#fbbf24', '#f59e0b'],
    description: 'Lush tropical paradise under a deep celestial tree canopy.',
  },
  {
    id: 'volcano',
    name: 'Magma Chamber',
    bgGradient: 'from-orange-950 via-red-950 to-stone-950',
    skyColor: '#1c1917',
    groundColor: '#451a03',
    gridColor: '#ea580c',
    accentColor: '#dc2626',
    obstacleColor: '#f97316',
    particleColors: ['#dc2626', '#f97316', '#ef4444', '#f59e0b'],
    description: 'An active lava hazard zone. Glowing embers drift in the air.',
  },
  {
    id: 'candy',
    name: 'Sweet Candy Land',
    bgGradient: 'from-fuchsia-950 via-pink-900 to-purple-950',
    skyColor: '#2e1065',
    groundColor: '#701a75',
    gridColor: '#db2777',
    accentColor: '#f472b6',
    obstacleColor: '#38bdf8',
    particleColors: ['#f472b6', '#38bdf8', '#c084fc', '#fb7185'],
    description: 'A whimsical landscape of sugary trees and sprinkles.',
  },
];

export const INITIAL_RULES = {
  gravity: 0.6,
  jumpForceMultiplier: 1.0,
  baseSpeed: 5.5,
  speedCap: 15.0,
  spawnRateMultiplier: 1.0,
  powerUpRate: 1.0,
  unlimitedAmmo: false,
  obstacleDestructible: true,
};
