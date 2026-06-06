/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, DinoId, ThemeId, GameRules, ScoreEntry } from './types';
import { DINOSAURS, THEMES, INITIAL_RULES } from './lib/constants';
import { DinosaurSelector } from './components/DinosaurSelector';
import { RuleCustomizer } from './components/RuleCustomizer';
import { GameCanvas } from './components/GameCanvas';
import { Leaderboard } from './components/Leaderboard';
import { audio } from './lib/AudioEngine';
import { LucideGamepad2, Sliders, Trophy, ChevronRight, User, ShieldCheck, RefreshCw, Zap, Moon, Play, AlertCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'dino_neon_highscores';

const DEFAULT_SCORES: ScoreEntry[] = [
  { playerName: "DINO_KING", score: 1540, level: 4, dinoId: "neon_rex", themeId: "neon", date: "06/05/2026" },
  { playerName: "AERO_GLIDER", score: 1120, level: 3, dinoId: "cyber_pter", themeId: "candy", date: "06/06/2026" },
  { playerName: "HEAVY_VOLT", score: 810, level: 2, dinoId: "electric_tri", themeId: "volcano", date: "06/06/2026" }
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [selectedDinoId, setSelectedDinoId] = useState<DinoId>('neon_rex');
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>('neon');
  const [customRules, setCustomRules] = useState<GameRules>({ ...INITIAL_RULES });
  
  // Scoring parameters
  const [highScores, setHighScores] = useState<ScoreEntry[]>([]);
  const [lastSessionScore, setLastSessionScore] = useState(0);
  const [lastSessionCoins, setLastSessionCoins] = useState(0);
  const [lastSessionLevel, setLastSessionLevel] = useState(1);
  const [playerNameInput, setPlayerNameInput] = useState('PLAYER_1');
  const [isPaused, setIsPaused] = useState(false);

  // Load high scores from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        setHighScores(JSON.parse(raw));
      } catch (err) {
        setHighScores(DEFAULT_SCORES);
      }
    } else {
      setHighScores(DEFAULT_SCORES);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SCORES));
    }
  }, []);

  const saveHighScore = (playerName: string, finalScore: number, finalLevel: number) => {
    const newEntry: ScoreEntry = {
      playerName: playerName.trim().substring(0, 12) || "ANON_DINO",
      score: finalScore,
      level: finalLevel,
      dinoId: selectedDinoId,
      themeId: selectedThemeId,
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    };

    const updated = [...highScores, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // keep top 10

    setHighScores(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const currentDino = DINOSAURS.find((d) => d.id === selectedDinoId) || DINOSAURS[0];
  const currentTheme = THEMES.find((t) => t.id === selectedThemeId) || THEMES[0];

  const handleGameOver = (finalScore: number, finalCoins: number, finalLevel: number) => {
    setLastSessionScore(finalScore);
    setLastSessionCoins(finalCoins);
    setLastSessionLevel(finalLevel);
    setGameState('GAME_OVER');
  };

  // Handle keyboard Pause toggle [Escape]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (gameState === 'PLAYING') {
          setIsPaused(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const handleResetRules = () => {
    setCustomRules({ ...INITIAL_RULES });
  };

  const handleClearScores = () => {
    setHighScores([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-indigo-600 transition-colors duration-1000 p-2 sm:p-4 md:p-6 flex items-center justify-center font-sans selection:bg-pink-500/30 selection:text-white relative overflow-hidden select-none">
      {/* Absolute dot grid pattern from Vibrant Palette */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
      
      <div className="w-full max-w-4xl flex flex-col gap-4 z-10">
        
        {/* Dynamic Route Switching with AnimatePresence */}
        <AnimatePresence mode="wait">
          {gameState === 'MENU' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
              id="menu-panel"
            >
              {/* Header Title branding */}
              <div className="text-center flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 rounded-3xl border-b-6 border-pink-700 shadow-xl mb-4 text-white">
                  <span className="text-3xl">🦖</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase font-display drop-shadow-[0_4px_0_rgba(0,0,0,0.2)]">
                  Neon Dino Dash
                </h1>
                <p className="text-sm md:text-base text-indigo-100 mt-2 max-w-lg font-medium">
                  Leap, sprint, and duck with customizable physics in this highly vibrant neon runner adventure!
                </p>
              </div>

              {/* Main Landing Panel */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                
                {/* Left block: Play and Settings buttons */}
                <div className="md:col-span-3 flex flex-col gap-5 bg-white text-indigo-950 p-6 md:p-8 rounded-3xl shadow-2xl border-b-8 border-indigo-900/10 justify-between">
                  <div>
                    <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">Your Dino Companion</div>
                    
                    <div className="flex items-center gap-4 bg-indigo-50/50 p-4 rounded-2xl border-2 border-indigo-100/30">
                      <span className="text-5xl animate-pulse filter drop-shadow-md">
                        {currentDino.icon}
                      </span>
                      <div>
                        <div className="font-black text-lg tracking-tight flex items-center gap-2" style={{ color: currentDino.accentColor }}>
                          {currentDino.name}
                          <span className="text-[10px] text-white font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500 shadow-inner">
                            Active
                          </span>
                        </div>
                        <p className="text-xs text-indigo-900 mt-1 font-medium">
                          {currentDino.abilityDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Character stats quick preview */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-indigo-50/40 rounded-2xl border-b-4 border-indigo-100 flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-indigo-400 tracking-wider">JUMP RATING</span>
                      <span className="text-sm font-black text-indigo-950">{(currentDino.jumpForce * 8)}px leap</span>
                    </div>
                    <div className="p-3 bg-indigo-50/40 rounded-2xl border-b-4 border-indigo-100 flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-indigo-400 tracking-wider">ENVIRONMENT</span>
                      <span className="text-sm font-black text-pink-500 uppercase tracking-tight">{currentTheme.name}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    <button
                      onClick={() => { audio.playJump(); setGameState('PLAYING'); }}
                      className="w-full py-4 bg-yellow-400 hover:bg-yellow-350 text-indigo-950 font-black tracking-widest rounded-2xl block text-center cursor-pointer transition shadow-lg hover:shadow-yellow-400/10 hover:-translate-y-0.5 border-b-6 border-yellow-600 uppercase text-sm"
                      id="btn-play-arcade"
                    >
                      Engage Dash
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { audio.playPowerUp(); setGameState('CHAR_SELECT'); }}
                        className="py-3 px-4 bg-pink-500 hover:bg-pink-450 text-white font-black rounded-2xl flex items-center justify-center gap-2 border-b-4 border-pink-700 text-xs transition active:translate-y-0.5 cursor-pointer"
                        id="btn-switch-skin"
                      >
                        <User className="w-4 h-4 text-white" /> Choose Dino
                      </button>

                      <button
                        onClick={() => { audio.playPowerUp(); setGameState('DINO_RULES'); }}
                        className="py-3 px-4 bg-emerald-500 hover:bg-emerald-450 text-white font-black rounded-2xl flex items-center justify-center gap-2 border-b-4 border-emerald-700 text-xs transition active:translate-y-0.5 cursor-pointer"
                        id="btn-rules-engine"
                      >
                        <Sliders className="w-4 h-4 text-white" /> Customize Rules
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right block: Leaderboard stats review */}
                <div className="md:col-span-2">
                  <Leaderboard entries={highScores} onClear={handleClearScores} />
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'CHAR_SELECT' && (
            <motion.div
              key="char_select"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <DinosaurSelector
                selectedId={selectedDinoId}
                onSelect={setSelectedDinoId}
                onPlay={() => { audio.playJump(); setGameState('PLAYING'); }}
              />
              <div className="text-center mt-3">
                <button
                  onClick={() => setGameState('MENU')}
                  className="text-xs text-slate-500 hover:text-slate-300 font-mono underline cursor-pointer"
                >
                  Back to Main Ingress
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'DINO_RULES' && (
            <motion.div
              key="dino_rules"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <RuleCustomizer
                rules={customRules}
                onChangeRules={setCustomRules}
                selectedThemeId={selectedThemeId}
                onChangeTheme={setSelectedThemeId}
                onReset={handleResetRules}
                onBack={() => setGameState('MENU')}
              />
            </motion.div>
          )}

          {gameState === 'PLAYING' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col w-full"
            >
              {/* Game Screen Canvas Component */}
              <GameCanvas
                dinoId={selectedDinoId}
                themeId={selectedThemeId}
                customRules={customRules}
                onGameOver={handleGameOver}
                isPaused={isPaused}
                onPauseToggle={() => setIsPaused(!isPaused)}
                onAbort={() => { audio.playExplode(); setGameState('MENU'); }}
              />
            </motion.div>
          )}

          {gameState === 'GAME_OVER' && (
            <motion.div
              key="game_over"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl mx-auto p-8 bg-white text-indigo-950 rounded-3xl border-b-8 border-indigo-900/10 shadow-2xl text-center"
              id="game-over-panel"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-pink-100 text-pink-500 mb-4 border-2 border-pink-200">
                <AlertCircle className="w-10 h-10" />
              </div>

              <h2 className="text-4xl font-black tracking-tight text-pink-500 uppercase font-display">
                Crash! Game Over
              </h2>
              <p className="text-xs text-indigo-400 mt-1 uppercase tracking-widest font-black">
                Your dinosaur hit an obstacle!
              </p>

              {/* Score dashboard breakdown */}
              <div className="grid grid-cols-3 gap-3 my-6">
                <div className="p-4 bg-indigo-50/50 rounded-2xl border-b-4 border-indigo-100">
                  <span className="text-[10px] text-indigo-400 font-extrabold block mb-1">SCORE</span>
                  <span className="text-2xl font-black text-indigo-950">
                    {lastSessionScore}
                  </span>
                </div>
                
                <div className="p-4 bg-indigo-50/50 rounded-2xl border-b-4 border-indigo-100">
                  <span className="text-[10px] text-indigo-400 font-extrabold block mb-1">LEVEL</span>
                  <span className="text-2xl font-black text-pink-500">
                    {lastSessionLevel}
                  </span>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-2xl border-b-4 border-indigo-100">
                  <span className="text-[10px] text-indigo-400 font-extrabold block mb-1">COINS</span>
                  <span className="text-2xl font-black text-yellow-600">
                    {lastSessionCoins}
                  </span>
                </div>
              </div>

              {/* Leaderboard saving form */}
              <div className="bg-indigo-50/30 p-5 rounded-2xl border-2 border-indigo-50 text-left flex flex-col gap-3">
                <label className="text-xs font-black text-indigo-500 flex items-center gap-1.5 uppercase tracking-wide">
                  <User className="w-4 h-4" /> Enter Your Player Name:
                </label>
                
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    maxLength={10}
                    value={playerNameInput}
                    onChange={(e) => setPlayerNameInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-white border-2 border-indigo-100 rounded-xl px-4 py-2.5 text-sm text-indigo-950 uppercase tracking-widest font-black font-mono outline-none focus:border-indigo-400 text-center"
                    placeholder="PLAYER_1"
                  />
                  
                  <button
                    onClick={() => {
                      saveHighScore(playerNameInput, lastSessionScore, lastSessionLevel);
                      setGameState('MENU');
                    }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs tracking-wider uppercase rounded-xl transition cursor-pointer border-b-4 border-indigo-800"
                  >
                    Save Score
                  </button>
                </div>
              </div>

              {/* Navigation retries */}
              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={() => { audio.playJump(); setGameState('PLAYING'); }}
                  className="px-6 py-3 bg-yellow-400 hover:bg-yellow-350 text-indigo-950 font-black tracking-wider text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:-translate-y-0.5 border-b-4 border-yellow-600"
                >
                  <RefreshCw className="w-4 h-4" /> Restart Level
                </button>

                <button
                  onClick={() => setGameState('MENU')}
                  className="px-6 py-3 bg-indigo-100 hover:bg-indigo-150 border-b-4 border-indigo-300 rounded-xl font-black text-xs tracking-wider text-indigo-900 cursor-pointer"
                >
                  Exit to Menu
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer bottom copyright line */}
        <div className="text-center text-[10px] text-white/50 font-mono tracking-widest uppercase mt-2" id="credit-line">
          Neon Dino Dash — Compiles 100% Client-Side.
        </div>
      </div>
    </div>
  );
}
