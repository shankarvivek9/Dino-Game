/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScoreEntry } from '../types';
import { DINOSAURS } from '../lib/constants';
import { Trophy, Calendar, Medal, Star } from 'lucide-react';

interface LeaderboardProps {
  entries: ScoreEntry[];
  onClear: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onClear }) => {
  // Sort high scores descendly
  const sorted = [...entries].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl shadow-2xl border-b-8 border-indigo-900/10 text-indigo-950">
      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
        <h3 className="text-xs font-black tracking-widest text-indigo-400 font-sans flex items-center gap-2 uppercase">
          <Trophy className="w-4 h-4 text-yellow-500" /> High Score Deck
        </h3>

        {sorted.length > 3 && (
          <button
            onClick={onClear}
            className="text-[10px] text-indigo-400 hover:text-red-500 cursor-pointer font-black uppercase tracking-wider transition"
          >
            Clear Scores
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-8 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
          No records registered yet. Give it your first run!
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {sorted.map((entry, index) => {
            const dino = DINOSAURS.find((d) => d.id === entry.dinoId);
            
            // Pick placing medals
            let medalColor = 'text-indigo-400';
            let bgStyle = 'bg-indigo-50/40 border-indigo-100';
            if (index === 0) {
              medalColor = 'text-yellow-600';
              bgStyle = 'bg-yellow-50 border-yellow-200';
            } else if (index === 1) {
              medalColor = 'text-slate-400';
              bgStyle = 'bg-slate-50 border-slate-200';
            } else if (index === 2) {
              medalColor = 'text-orange-600';
              bgStyle = 'bg-orange-50 border-orange-200';
            }

            return (
              <div
                key={`${entry.score}-${index}`}
                className={`flex items-center justify-between px-3.5 py-3 rounded-2xl border-b-4 text-xs transition duration-200 hover:scale-[1.02] ${bgStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`font-black flex items-center justify-center w-5 h-5 ${medalColor}`}>
                    {index < 3 ? <Medal className="w-4.5 h-4.5" /> : <span className="font-mono">#{index + 1}</span>}
                  </div>

                  <span className="text-2xl filter drop-shadow">{dino?.icon || '🦖'}</span>
                  
                  <div className="flex flex-col">
                    <span className="font-black text-indigo-950 tracking-tight uppercase">
                      {entry.playerName}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-extrabold tracking-wide uppercase">
                      Lv {entry.level} — {dino?.name || 'Rex'}
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-sm font-black text-indigo-900 font-sans flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    {entry.score}
                  </span>
                  <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                    <Calendar className="w-2.5 h-2.5" />
                    {entry.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
