/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { GameRules, ThemeId } from '../types';
import { THEMES } from '../lib/constants';
import { Play, RotateCcw, Sliders, ShieldCheck, Gauge, Eye } from 'lucide-react';

interface RuleCustomizerProps {
  rules: GameRules;
  onChangeRules: (rules: GameRules) => void;
  selectedThemeId: ThemeId;
  onChangeTheme: (themeId: ThemeId) => void;
  onReset: () => void;
  onBack: () => void;
}

export const RuleCustomizer: React.FC<RuleCustomizerProps> = ({
  rules,
  onChangeRules,
  selectedThemeId,
  onChangeTheme,
  onReset,
  onBack,
}) => {
  const updateRule = (key: keyof GameRules, value: number | boolean) => {
    onChangeRules({
      ...rules,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-6 md:p-8 bg-white text-indigo-950 rounded-3xl border-b-8 border-indigo-900/10 shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-black tracking-tight text-indigo-900 uppercase font-display flex items-center justify-center gap-2.5">
          <Sliders className="w-7 h-7 text-indigo-600" />
          Rule Customizer & Physics Lab
        </h2>
        <p className="text-sm text-indigo-400 mt-1 uppercase tracking-widest font-black">
          Harness the laws of gravity, speed limits, and environment backdrops
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Physics and Rate Controls */}
        <div className="flex flex-col gap-5 bg-indigo-50/30 p-5 rounded-2xl border-2 border-indigo-50">
          <h4 className="text-xs font-black tracking-widest text-indigo-400 flex items-center gap-2 uppercase">
            <Gauge className="w-4 h-4 text-indigo-500" /> Physics & Motility
          </h4>

          {/* Gravity Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-black text-indigo-500 mb-2 uppercase tracking-wide">
              <span>Gravity Force:</span>
              <span className="font-extrabold text-indigo-950">{rules.gravity.toFixed(2)}G</span>
            </div>
            <input
              type="range"
              min="0.25"
              max="1.5"
              step="0.05"
              value={rules.gravity}
              onChange={(e) => updateRule('gravity', parseFloat(e.target.value))}
              className="w-full h-3 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-indigo-200 lg:p-0.5"
            />
            <div className="flex justify-between text-[10px] text-indigo-400 font-bold uppercase mt-1.5 font-mono">
              <span>Low (0.25G)</span>
              <span>Heavy (1.50G)</span>
            </div>
          </div>

          {/* Base Speed Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-black text-indigo-500 mb-2 uppercase tracking-wide">
              <span>Base Jump Speed:</span>
              <span className="font-extrabold text-indigo-950">{rules.baseSpeed.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="12.0"
              step="0.5"
              value={rules.baseSpeed}
              onChange={(e) => updateRule('baseSpeed', parseFloat(e.target.value))}
              className="w-full h-3 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-indigo-200 lg:p-0.5"
            />
            <div className="flex justify-between text-[10px] text-indigo-400 font-bold uppercase mt-1.5 font-mono">
              <span>Slow Tortoise (3.0)</span>
              <span>Turbo Speed (12.0)</span>
            </div>
          </div>

          {/* Speed Cap Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-black text-indigo-500 mb-2 uppercase tracking-wide">
              <span>Maximum Speed Cap:</span>
              <span className="font-extrabold text-indigo-950">{rules.speedCap.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min="8.0"
              max="25.0"
              step="1.0"
              value={rules.speedCap}
              onChange={(e) => updateRule('speedCap', parseFloat(e.target.value))}
              className="w-full h-3 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-indigo-200 lg:p-0.5"
            />
            <div className="flex justify-between text-[10px] text-indigo-400 font-bold uppercase mt-1.5 font-mono">
              <span>Gentle (8.00)</span>
              <span>Limitless (25.0)</span>
            </div>
          </div>

          {/* Spawning multipliers */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[10px] font-black text-indigo-400 mb-1.5 uppercase tracking-wider">Obstacle Spawn Rate:</label>
              <select
                value={rules.spawnRateMultiplier}
                onChange={(e) => updateRule('spawnRateMultiplier', parseFloat(e.target.value))}
                className="w-full bg-white border-2 border-indigo-100 rounded-xl px-3 py-2 text-xs text-indigo-950 outline-none focus:border-indigo-400 font-extrabold uppercase tracking-tight"
              >
                <option value="0.6">Sparse (0.6x)</option>
                <option value="1.0">Normal (1.0x)</option>
                <option value="1.5">Chaos (1.5x)</option>
                <option value="2.2">Mayhem (2.2x)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-indigo-400 mb-1.5 uppercase tracking-wider">Power-ups Bonus Rate:</label>
              <select
                value={rules.powerUpRate}
                onChange={(e) => updateRule('powerUpRate', parseFloat(e.target.value))}
                className="w-full bg-white border-2 border-indigo-100 rounded-xl px-3 py-2 text-xs text-indigo-950 outline-none focus:border-indigo-400 font-extrabold uppercase tracking-tight"
              >
                <option value="0.4">Scarce (0.4x)</option>
                <option value="1.0">Frequent (1.0x)</option>
                <option value="1.8">Abundant (1.8x)</option>
                <option value="3.0">Extreme (3.0x)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Theme Selection & Rules */}
        <div className="flex flex-col gap-5 bg-indigo-50/30 p-5 rounded-2xl border-2 border-indigo-50 justify-between">
          <div>
            <h4 className="text-xs font-black tracking-widest text-indigo-400 flex items-center gap-2 uppercase mb-4">
              <Eye className="w-4 h-4 text-indigo-500" /> Environment Backdrops
            </h4>
            
            {/* Theme Picker Grid */}
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((theme) => {
                const isActive = theme.id === selectedThemeId;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onChangeTheme(theme.id)}
                    className={`p-3 text-left cursor-pointer transition-all rounded-2xl border-2 ${
                      isActive
                        ? 'bg-yellow-50 border-yellow-400 shadow-sm'
                        : 'bg-white border-indigo-100/55 hover:border-indigo-200 hover:bg-indigo-50/60'
                    }`}
                  >
                    <span className="font-extrabold text-xs block text-indigo-950 uppercase tracking-tight">
                      {theme.name}
                    </span>
                    <span className="text-[10px] text-indigo-400 mt-1 block leading-tight font-medium">
                      {theme.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-indigo-100 pt-4 flex flex-col gap-4">
            <h4 className="text-xs font-black tracking-widest text-indigo-400 flex items-center gap-2 uppercase">
              <ShieldCheck className="w-4 h-4 text-indigo-500" /> Modifiers & Combat Mechanics
            </h4>

            {/* Checkbox logic */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rules.obstacleDestructible}
                  onChange={(e) => updateRule('obstacleDestructible', e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 bg-white border-2 border-indigo-150 focus:ring-indigo-500 focus:ring-opacity-25 accent-indigo-600 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-extrabold block text-indigo-950 uppercase tracking-tight">Destructible Obstacles</span>
                  <span className="text-[10px] font-bold text-indigo-450 block mt-0.5">
                    Your blaster's lasers can vaporize incoming cacti.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rules.unlimitedAmmo}
                  onChange={(e) => updateRule('unlimitedAmmo', e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 bg-white border-2 border-indigo-150 focus:ring-indigo-500 focus:ring-opacity-25 accent-indigo-600 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-extrabold block text-indigo-950 uppercase tracking-tight">Infinite Ammo Blaster</span>
                  <span className="text-[10px] font-bold text-indigo-450 block mt-0.5">
                    Start each level with infinite weapon ammo.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-3 pt-4 border-t border-indigo-100">
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="px-5 py-3 bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-600 font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 cursor-pointer transition active:translate-y-0.5"
        >
          <RotateCcw className="w-4 h-4" /> Reset Lab Defaults
        </motion.button>

        <div className="flex gap-3">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-350 text-indigo-950 rounded-2xl font-black tracking-widest text-xs border-b-4 border-yellow-600 flex items-center gap-2 cursor-pointer uppercase transition"
          >
            <Play className="w-4 h-4" /> Save & Return
          </motion.button>
        </div>
      </div>
    </div>
  );
};
