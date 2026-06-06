/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { DINOSAURS } from '../lib/constants';
import { DinoCharacter, DinoId } from '../types';
import { Shield, Zap, Sparkles, Footprints } from 'lucide-react';

interface DinosaurSelectorProps {
  selectedId: DinoId;
  onSelect: (id: DinoId) => void;
  onPlay: () => void;
}

export const DinosaurSelector: React.FC<DinosaurSelectorProps> = ({
  selectedId,
  onSelect,
  onPlay,
}) => {
  const currentDino = DINOSAURS.find((d) => d.id === selectedId) || DINOSAURS[0];

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-6 md:p-8 bg-white text-indigo-950 rounded-3xl border-b-8 border-indigo-900/10 shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-black tracking-tight text-indigo-900 uppercase font-display">
          Choose Your Dino Champion
        </h2>
        <p className="text-sm text-indigo-400 mt-1 uppercase tracking-widest font-black">
          Select a species with distinct properties & abilities
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {DINOSAURS.map((dino) => {
          const isSelected = dino.id === selectedId;
          return (
            <motion.button
              key={dino.id}
              onClick={() => onSelect(dino.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 text-center cursor-pointer ${
                isSelected
                  ? 'bg-yellow-50 border-yellow-400 shadow-md scale-[1.02]'
                  : 'bg-indigo-50/20 border-indigo-100/50 hover:border-indigo-200 hover:bg-indigo-50/60'
              }`}
              id={`select-dino-${dino.id}`}
            >
              <div
                className="text-4xl mb-3 flex items-center justify-center w-14 h-14 rounded-2xl transition-transform duration-500 hover:rotate-12 bg-white border-2 border-indigo-100/60 shadow-sm"
              >
                {dino.icon}
              </div>
              <span className="font-extrabold text-sm tracking-tight text-indigo-950 block">
                {dino.name}
              </span>
              <span
                className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full mt-2 inline-block"
                style={{
                  backgroundColor: isSelected ? '#fef08a' : '#e0e7ff',
                  color: isSelected ? '#a16207' : '#4338ca',
                }}
              >
                {dino.abilityName}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Main Stats Panel */}
      <motion.div
        key={selectedId}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-indigo-50/30 p-6 rounded-2xl border-2 border-indigo-50"
      >
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-5xl filter drop-shadow">{currentDino.icon}</span>
              <div>
                <h3 className="text-xl font-black font-display uppercase tracking-tight text-indigo-900">
                  {currentDino.name}
                </h3>
                <span className="text-[10px] text-indigo-400 font-extrabold tracking-widest uppercase">ID: {currentDino.id}</span>
              </div>
            </div>
            <p className="mt-4 text-xs md:text-sm text-indigo-900 leading-relaxed font-medium">
              {currentDino.abilityDesc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white p-3.5 rounded-2xl border-b-4 border-indigo-100/40">
              <div className="flex items-center gap-1.5 text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                Max Shields
              </div>
              <div className="font-black text-base text-indigo-950">{currentDino.maxShields} Stars</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border-b-4 border-indigo-100/40">
              <div className="flex items-center gap-1.5 text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Ammo Pack
              </div>
              <div className="font-black text-base text-indigo-950">
                {currentDino.canShoot ? 'Laser Blaster' : 'Gravity Glider'}
              </div>
            </div>
          </div>
        </div>

        {/* Dino Specifications */}
        <div className="flex flex-col gap-4 justify-center">
          <h4 className="text-xs font-black tracking-widest text-indigo-400 uppercase">Specifications</h4>
          
          {/* Jump Force */}
          <div>
            <div className="flex justify-between text-[10px] font-black uppercase text-indigo-400 mb-1.5">
              <span>Jump Lift Height:</span>
              <span className="font-black text-indigo-950">
                {Math.round(currentDino.jumpForce * 8)}px
              </span>
            </div>
            <div className="h-4 w-full bg-indigo-100/60 rounded-full overflow-hidden border-2 border-indigo-150 p-0.5">
              <div
                className="h-full rounded-full transition-all duration-500 bg-pink-500 border-r-2 border-pink-700"
                style={{
                  width: `${(currentDino.jumpForce / 15) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Weight */}
          <div>
            <div className="flex justify-between text-[10px] font-black uppercase text-indigo-400 mb-1.5">
              <span>Active Body Weight:</span>
              <span className="font-black text-indigo-950">{currentDino.weight} kg</span>
            </div>
            <div className="h-4 w-full bg-indigo-100/60 rounded-full overflow-hidden border-2 border-indigo-150 p-0.5">
              <div
                className="h-full rounded-full bg-emerald-500 border-r-2 border-emerald-700 transition-all duration-500"
                style={{ width: `${(currentDino.weight / 0.8) * 100}%` }}
              />
            </div>
          </div>

          {/* Special properties */}
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center gap-3 text-sm">
              <div
                className={`p-2 rounded-xl border-2 ${
                  currentDino.hasDoubleJump
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-red-50 border-red-200 text-red-500'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-black text-xs text-indigo-950">Agile Double Jump</div>
                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                  {currentDino.hasDoubleJump ? 'Double leaping enabled' : 'Single high vertical leap'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div
                className={`p-2 rounded-xl border-2 ${
                  currentDino.canShoot
                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : 'bg-red-50 border-red-200 text-red-500'
                }`}
              >
                <Footprints className="w-4 h-4" />
              </div>
              <div>
                <div className="font-black text-xs text-indigo-950">Active Weapon System</div>
                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                  {currentDino.canShoot
                    ? 'Blaster fires using Shift key'
                    : 'Unarmed - focuses on light air gliding'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end mt-2">
        <motion.button
          onClick={onPlay}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="px-8 py-4.5 bg-yellow-400 hover:bg-yellow-350 text-indigo-950 font-black tracking-widest text-sm cursor-pointer shadow-xl border-b-6 border-yellow-600 rounded-2xl uppercase transition-transform"
          id="btn-play-selected"
        >
          Confirm and Start
        </motion.button>
      </div>
    </div>
  );
};
