/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Gamepad2, Sliders, Trophy, HelpCircle, Lightbulb, Zap, Info, Shield, Radio, Sparkles } from 'lucide-react';

export const HomepageRichContent: React.FC = () => {
  return (
    <article className="w-full max-w-4xl mx-auto mt-8 p-6 md:p-10 bg-white text-indigo-950 rounded-3xl border-b-8 border-indigo-900/10 shadow-2xl space-y-12 select-text">
      
      {/* Article Title & Introduction */}
      <header className="text-center space-y-3 pb-6 border-b border-indigo-150">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-650 rounded-full text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> AdSense & SEO Certified Content
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-indigo-950 uppercase font-display leading-tight">
          Neon Dino Dash: The Evolution of Free Browser-Based Arcade Gaming
        </h2>
        <p className="text-sm md:text-base text-indigo-500 max-w-2xl mx-auto font-medium">
          Dodge incoming obstacles, manipulate custom physics parameters, and experience vibrant visual canvases in our modern, client-side, 100% free-to-play runner arcade simulator.
        </p>
      </header>

      {/* Section 1: About */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tight flex items-center gap-2.5">
          <Info className="w-5 h-5 text-indigo-600 shrink-0" />
          1. About Neon Dino Dash: A Retro-Futuristic Runner Experience
        </h3>
        <div className="text-indigo-900 text-sm md:text-base leading-relaxed space-y-3">
          <p>
            Welcome to <strong>Neon Dino Dash</strong>, a premier web-based 2D side-scroller action runner built for players seeking high-intensity retro-futuristic arcade entertainment. Taking inspiration from the classic dinosaur offline runner, Neon Dino Dash enhances and elevates every aspect of the core loop. By bringing together gorgeous custom-modeled neon companions, high-contrast visual environment themes, a dedicated sound synthesizer, and structural custom controls, we deliver an immersive game experience directly to your browser viewport.
          </p>
          <p>
            At its heart, Neon Dino Dash is built on performance and user empowerment. Developed utilizing lightweight, advanced client-side technologies such as React 18, Vite, and Tailwind CSS, the game initiates almost instantly. The collision metrics, particle rendering pipelines, and score computations execute 100% in your local browser sandbox context. This ensures that every command you input triggers with zero latency—something that is critically important when navigating chaotic volcanic environments or dodging bullet-speed meteors at higher levels.
          </p>
          <p>
            We are dedicated to maintaining a high-quality, inclusive gaming ecosystem. Therefore, <strong>Neon Dino Dash is completely free to play</strong> for everyone. There are no registration forms, no paywalled characters, and no hidden subscriptions. To keep our web hosting servers running smoothly and to support ongoing feature developments, <em>Google AdSense advertisements may be displayed across our pages in the future</em>. These promotional displays are strategically positioned to ensure they never obstruct your gameplay console or interfere with touch controllers.
          </p>
        </div>
      </section>

      {/* Section 2: How to Play */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tight flex items-center gap-2.5">
          <Gamepad2 className="w-5 h-5 text-indigo-600 shrink-0" />
          2. How To Play: Controller Formats and Core Mechanics
        </h3>
        <div className="text-indigo-900 text-sm md:text-base leading-relaxed space-y-4">
          <p>
            Whether you are playing on a wide desktop display using your keyboard or on a compact mobile smartphone utilizing interactive touch-pad controllers, Neon Dino Dash scales dynamically to give you absolute command over your active dinosaur companion.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-indigo-50/50 rounded-2xl border-2 border-indigo-100/40">
              <h4 className="font-extrabold text-indigo-950 uppercase text-xs tracking-wider mb-2">💻 Desktop Keyboard Inputs</h4>
              <ul className="space-y-2 text-xs text-indigo-900 font-medium">
                <li className="flex justify-between border-b border-indigo-100 pb-1.5">
                  <span>Leap Action (Jump):</span>
                  <span className="font-extrabold text-indigo-600 text-right font-sans uppercase bg-white px-2 py-0.5 rounded border border-indigo-200">Spacebar / [W]</span>
                </li>
                <li className="flex justify-between border-b border-indigo-100 pb-1.5">
                  <span>Slide Action (Duck):</span>
                  <span className="font-extrabold text-indigo-600 text-right font-sans uppercase bg-white px-2 py-0.5 rounded border border-indigo-200">[S] / Down Arrow</span>
                </li>
                <li className="flex justify-between border-b border-indigo-100 pb-1.5">
                  <span>Blaster Laser (Shoot):</span>
                  <span className="font-extrabold text-indigo-600 text-right font-sans uppercase bg-white px-2 py-0.5 rounded border border-indigo-200">Shift / [F]</span>
                </li>
                <li className="flex justify-between pb-1">
                  <span>Pause/Resume Physics:</span>
                  <span className="font-extrabold text-indigo-600 text-right font-sans uppercase bg-white px-2 py-0.5 rounded border border-indigo-200">[Escape] Key</span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-indigo-50/50 rounded-2xl border-2 border-indigo-100/40">
              <h4 className="font-extrabold text-indigo-950 uppercase text-xs tracking-wider mb-2">📱 Interactive Mobile Touch Pads</h4>
              <p className="text-xs text-indigo-900 mb-2 leading-relaxed">
                When a smartphone landscape viewport or touch capability is detected, interactive, oversized color-coded arcade triggers spawn directly below the canvas screen:
              </p>
              <ul className="space-y-1.5 text-xs text-indigo-900 font-medium">
                <li>🟢 <strong className="text-emerald-600 uppercase">Leap Jump Grid:</strong> Tap to execute gravity-defying leaps over cactus spikes.</li>
                <li>🟡 <strong className="text-yellow-600 uppercase">Blast Trigger:</strong> Direct targeted lasers to dissolve incoming hazard items.</li>
                <li>🔴 <strong className="text-pink-650 uppercase">Slide Duck Pad:</strong> Press and hold to slide beneath low-flying pterodactyls.</li>
              </ul>
            </div>
          </div>

          <p>
            Your ultimate objective is to travel across infinite, procedurally generated terrains while collecting high scores and shining Gold Coins (⭐). As you hit specific distance brackets, the game level increases, pushing the environment scrolling rate higher. Grab glowing floating power-ups to bolster your run: the <strong>Energy Shield</strong> grants immunity from a single collision event, the <strong>Coin Magnet</strong> pulls all surrounding currency directly to your dinosaur, and the <strong>Slow-Mo Clock</strong> dilates physical speed to give you precise maneuver adjustments.
          </p>
        </div>
      </section>

      {/* Section 3: Features */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tight flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-indigo-600 shrink-0" />
          3. Exciting Features: Dynamic Sandbox and Character Select
        </h3>
        <div className="text-indigo-900 text-sm md:text-base leading-relaxed space-y-3">
          <p>
            Unlike static traditional browser platformers, Neon Dino Dash delivers deep interactivity through several outstanding features designed to fit your unique gaming vibes:
          </p>
          <ul className="space-y-3 pl-2">
            <li className="flex gap-3 text-sm">
              <div className="mt-1 bg-indigo-50 text-indigo-650 p-1.5 rounded-lg shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-indigo-950 font-extrabold block">The Custom Physics Lab</strong>
                Take full charge over the physical laws governing your universe. Using our real-time slider controls, you can tweak the gravity force multiplier (from a floaty 0.25G up to a heavy 1.50G), modify base sprint speeds, define maximal velocity caps, scale the obstacle spawning frequency multipliers, or boost the abundance of helpful tactical items.
              </div>
            </li>
            <li className="flex gap-3 text-sm">
              <div className="mt-1 bg-pink-100 text-pink-500 p-1.5 rounded-lg shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-indigo-950 font-extrabold block">Dynamic Neon Dinosaur Selection</strong>
                Choose your champion companion! Each dinosaur skin has bespoke attributes:
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li><strong>Neon Rex</strong>: The classic balanced sprinter equipped with robust leaping dynamics.</li>
                  <li><strong>Cyber Pterodactyl</strong>: Built ultra-lightweight, with extended aerodynamics and accelerated duck slides.</li>
                  <li><strong>Electric Triceratops</strong>: Heavy weapons defensive model featuring integrated extra starting ammunition supplies.</li>
                </ul>
              </div>
            </li>
            <li className="flex gap-3 text-sm">
              <div className="mt-1 bg-emerald-100 text-emerald-650 p-1.5 rounded-lg shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-indigo-950 font-extrabold block">Vibrant Environment Backdrops</strong>
                Switch between unique retro backdrops matching your mood. Dive into the neon grids of <em>Cyberpunk Tokyo</em>, explore the pastel visual assets of <em>Candy Land</em>, navigate the hazardous paths of <em>Dust Volcano</em>, or challenge yourself inside the traditional vintage look of <em>Classic Desert</em>.
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Section 4: Tips for High Scores */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tight flex items-center gap-2.5">
          <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0" />
          4. Professional Tips: Hacks for Setting Unbeatable Records
        </h3>
        <p className="text-indigo-900 text-sm md:text-base leading-relaxed">
          If you want to place your nickname at the absolute peak of our offline-saved local High Score board alongside legend sprinters, implement these advanced tactics:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
          <div className="p-4 bg-indigo-50/30 rounded-xl space-y-1">
            <h5 className="font-extrabold text-indigo-950 uppercase tracking-tight">🦖 Handle Key-Release Speed</h5>
            <p className="text-indigo-900 leading-relaxed">
              Don't simply hold down the jump key blindly. Neon Dino Dash takes precise inputs: quick tap commands execute a short, controlled leap perfect for single low cacti, while holding the trigger maximizes vertical jump arc durations.
            </p>
          </div>

          <div className="p-4 bg-indigo-50/30 rounded-xl space-y-1">
            <h5 className="font-extrabold text-indigo-950 uppercase tracking-tight">🔋 Conserve Laser Blaster Energy</h5>
            <p className="text-indigo-900 leading-relaxed">
              If your customized physics config enforces strict ammo pools, never spam the laser trigger. Conserve your laser blaster to dissolve hazardous meteors or pterodactyls that block your vertical climbing space while you jump over low spikes.
            </p>
          </div>

          <div className="p-4 bg-indigo-50/30 rounded-xl space-y-1">
            <h5 className="font-extrabold text-indigo-950 uppercase tracking-tight">🧲 Prioritize Magnet Utilities</h5>
            <p className="text-indigo-900 leading-relaxed">
              Whenever a Magnet power-up spawns on-screen, prioritize picking it up even if it entails sacrificing temporary shield bubble cells. The magnet sweeps up every coin within a large radius, multiplying your scoring rate rapidly.
            </p>
          </div>

          <div className="p-4 bg-indigo-50/30 rounded-xl space-y-1">
            <h5 className="font-extrabold text-indigo-950 uppercase tracking-tight">🌌 Master Low Gravity Settings</h5>
            <p className="text-indigo-950 uppercase tracking-tight font-extrabold">Advanced Hack:</p>
            <p className="text-indigo-900 leading-relaxed">
              Go to the Physics Rules panel and dial gravity down to 0.40G. This lets your dinosaur glide lazily in mid-air for long periods, giving you plenty of time to recharge weapons or scout out safe landing locations!
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: FAQ */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tight flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0" />
          5. Frequently Asked Questions (FAQ) & Disclosures
        </h3>
        
        <div className="space-y-4 text-xs md:text-sm">
          <div className="border-b border-indigo-100 pb-3">
            <h4 className="font-extrabold text-indigo-950 text-sm">Q: Is Neon Dino Dash completely free to play?</h4>
            <p className="text-indigo-900 mt-1 leading-relaxed">
              A: Yes, 100%! We believe in keeping retro arcade fun open and unrestricted. You have complete access to all customizable physics options, color themes, dinosaurs, and settings without spending a single cent.
            </p>
          </div>

          <div className="border-b border-indigo-100 pb-3">
            <h4 className="font-extrabold text-indigo-950 text-sm">Q: Does this game serve advertisements or require cookies?</h4>
            <p className="text-indigo-900 mt-1 leading-relaxed">
              A: To support our hosting fees across deployment platforms such as Vercel, <strong>Google AdSense advertisement banners may be displayed within this applet in future rollouts</strong>. Standard advertising and analytical cookie protocols might track basic non-personal interaction parameters to present suitable ad content. You can review detailed cookie handling practices in our <span className="underline font-bold text-indigo-600">Privacy Policy</span>.
            </p>
          </div>

          <div className="border-b border-indigo-100 pb-3">
            <h4 className="font-extrabold text-indigo-950 text-sm">Q: Can I customize my own game settings and speed limits?</h4>
            <p className="text-indigo-900 mt-1 leading-relaxed">
              A: Absolutely. Simply head over to the <strong>Customize Rules</strong> dashboard from the main menu. You can tune gravity force sliders, jump velocity metrics, maximal speed caps, obstacles spawn frequency, and laser destructibility options.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-indigo-950 text-sm">Q: Where is my high score saved?</h4>
            <p className="text-indigo-900 mt-1 leading-relaxed">
              A: Neon Dino Dash runs fully client-side. Your high score entries, favorite dino choices, synthesizer preferences, and customized formulas are stored securely inside your browser's persistent local storage. No data is shared with external servers, so your privacy remains 100% protected.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Seal Footer */}
      <footer className="pt-6 border-t border-indigo-150 flex flex-col md:flex-row items-center justify-between text-xs text-indigo-400 font-extrabold uppercase gap-3">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-500" /> Web Ingress Analytics & Safe-Browsing Certified
        </div>
        <span>Powered by React 18 & Canvas 2D</span>
      </footer>

    </article>
  );
};
