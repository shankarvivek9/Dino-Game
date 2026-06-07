/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Shield, FileText, Info, HardDrive, Cpu, Terminal, CheckCircle2 } from 'lucide-react';
import { GameState } from '../types';

interface InfoPagesProps {
  currentPage: 'ABOUT' | 'CONTACT' | 'PRIVACY' | 'TERMS';
  onNavigate: (state: GameState) => void;
}

export const InfoPages: React.FC<InfoPagesProps> = ({ currentPage, onNavigate }) => {
  // Navigation layout helper
  const renderNavLinks = () => {
    const links = [
      { id: 'ABOUT' as GameState, label: 'About Us' },
      { id: 'CONTACT' as GameState, label: 'Contact Us' },
      { id: 'PRIVACY' as GameState, label: 'Privacy Policy' },
      { id: 'TERMS' as GameState, label: 'Terms & Conditions' },
    ];

    return (
      <div className="flex flex-wrap gap-2.5 justify-center py-4 border-t border-b border-indigo-100 my-6">
        {links.map((link) => {
          const isActive = currentPage === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-650 text-white shadow-md border-b-2 border-indigo-800'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-b-2 border-indigo-200'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white text-indigo-950 rounded-3xl border-b-8 border-indigo-900/10 shadow-2xl flex flex-col gap-6">
      
      {/* Header with Title and back navigation button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-indigo-50">
        <button
          onClick={() => onNavigate('MENU')}
          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-150 text-indigo-950 rounded-2xl font-black tracking-widest text-xs flex items-center gap-2 cursor-pointer transition uppercase"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          Dino Ingress Menu
        </button>

        <div className="flex items-center gap-2">
          {currentPage === 'ABOUT' && (
            <span className="p-2 bg-indigo-100 rounded-xl text-indigo-650">
              <Info className="w-5 h-5" />
            </span>
          )}
          {currentPage === 'CONTACT' && (
            <span className="p-2 bg-pink-100 rounded-xl text-pink-500">
              <Mail className="w-5 h-5" />
            </span>
          )}
          {currentPage === 'PRIVACY' && (
            <span className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
              <Shield className="w-5 h-5" />
            </span>
          )}
          {currentPage === 'TERMS' && (
            <span className="p-2 bg-yellow-100 rounded-xl text-yellow-600">
              <FileText className="w-5 h-5" />
            </span>
          )}
          <h2 className="text-2xl font-black uppercase tracking-tight text-indigo-900 font-display">
            {currentPage === 'ABOUT' && 'About Us'}
            {currentPage === 'CONTACT' && 'Contact Us'}
            {currentPage === 'PRIVACY' && 'Privacy Policy'}
            {currentPage === 'TERMS' && 'Terms & Conditions'}
          </h2>
        </div>
      </div>

      {/* Embedded Sub-navigation */}
      {renderNavLinks()}

      {/* Main Content Area */}
      <div className="text-sm md:text-base leading-relaxed text-indigo-900 space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* =======================================
            ABOUT US PAGE
           ======================================= */}
        {currentPage === 'ABOUT' && (
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-r from-amber-50 to-pink-50 rounded-2xl border-2 border-amber-100/40 text-indigo-950">
              <h3 className="text-base font-black text-amber-700 uppercase tracking-wider flex items-center gap-2">
                🦖 Welcome to Neon Dino Dash
              </h3>
              <p className="mt-2 text-sm leading-relaxed font-semibold">
                Neon Dino Dash is a fast-paced, high-octane 2D retro runner experience designed with physics-engine customizers, neon companions, vibrant background backdrops, and retro synthesis tracks. Dash with Neon Rex and evade oncoming obstacles, lasers, and volcanic spikes across multiple action-packed levels!
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">Our Mission & Principles</h3>
              <p className="text-sm">
                Our vision is to provide high-quality visual games directly in the browser with zero barriers to entry. 
                We believe that web-based arcade games should be <strong>completely free to play</strong> for everyone, requiring no downloads, no heavy installations, and no intrusive registration walls.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-indigo-500 mb-1 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> Physics Lab
                </h4>
                <p className="text-xs text-indigo-900">
                  Adjust gravity force multipliers, jump height, obstacle intervals, and speed limits inside our sandbox interface.
                </p>
              </div>

              <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-indigo-500 mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> High Performance
                </h4>
                <p className="text-xs text-indigo-900">
                  Engineered built on lightweight, performant canvas mechanics designed to function beautifully on laptops, tablets, and smartphones.
                </p>
              </div>

              <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-indigo-500 mb-1 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5" /> 100% Client-Side
                </h4>
                <p className="text-xs text-indigo-900">
                  Your leaderboards, sound synthesizer settings, and custom adjustments run locally, saving your high scores right in your workspace browser.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">Monetization & Free Availability</h3>
              <p className="text-sm">
                To keep this venture running without putting up paywalls, <strong>Neon Dino Dash may display Google AdSense advertisement banners</strong> in the future. These displays help cover layout services, development maintenance, and the hosting infrastructure costs. We promise to construct clean, non-intrusive placements so they never disrupt your core responsive gameplay mechanics.
              </p>
            </div>

            <div className="p-4 bg-indigo-50/20 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-xs text-indigo-800 font-medium">
                Thank you for playing Neon Dino Dash! We hope you set elite high scores. Keep dashing, dodging, and customizing!
              </p>
            </div>
          </div>
        )}

        {/* =======================================
            CONTACT US PAGE
           ======================================= */}
        {currentPage === 'CONTACT' && (
          <div className="space-y-6">
            <p className="text-sm">
              We adore hearing from you! If you have caught a bug, want to request specific retro-looking dinosaurs, want to ask questions about our physics engine, or just wish to say hello, do not hesitate to contact us.
            </p>

            <div className="p-6 bg-pink-50/30 rounded-2xl border-2 border-pink-100/30 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-pink-500 text-white rounded-xl shadow-md">
                  <Mail className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-pink-600">Official Communication Channel</h4>
                  <p className="text-xl font-black text-indigo-950 mt-0.5 select-all">
                    contact@example.com
                  </p>
                </div>
              </div>
              <p className="text-xs text-pink-600 font-bold uppercase tracking-wider">
                We make every effort to read and address user queries within 48 business hours.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">Frequently Addressed Topics</h3>
              <ul className="space-y-3">
                <li className="flex gap-2 text-sm">
                  <span className="text-pink-500">◆</span>
                  <div>
                    <strong className="text-indigo-950 font-extrabold">Bug Reporting:</strong> Please include details about your viewport size, browser (Chrome, Safari, Firefox), and the level or modifier you were playing when the problem occurred.
                  </div>
                </li>
                <li className="flex gap-2 text-sm">
                  <span className="text-pink-500">◆</span>
                  <div>
                    <strong className="text-indigo-950 font-extrabold">AdSense & Business Queries:</strong> For business partnerships or inquiry details concerning advertising spaces on our domain, clearly mark your draft heading with <em>[Advertising Inquiries]</em>.
                  </div>
                </li>
                <li className="flex gap-2 text-sm">
                  <span className="text-pink-500">◆</span>
                  <div>
                    <strong className="text-indigo-950 font-extrabold">Code Contributions:</strong> If you are interested in making contributions or integrations for the custom themes and layout options, give us some briefs about your proposal!
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* =======================================
            PRIVACY POLICY PAGE
           ======================================= */}
        {currentPage === 'PRIVACY' && (
          <div className="space-y-6">
            <p className="text-xs text-indigo-500 font-black uppercase tracking-wider">
              Last Updated: June 2026
            </p>

            <p className="text-sm">
              At Neon Dino Dash, accessible from our Vercel web domain, one of our top priorities is the privacy of our visitors. This Privacy Policy document outlines the types of data that are collected and recorded by Neon Dino Dash and how we utilize them.
            </p>

            <div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">1. Local State Storage (No Server Data Collection)</h3>
              <p className="text-sm">
                Neon Dino Dash operates as a fully client-side single page applet (SPA). This means your high scores, customized game rules, custom dinosaur skin selections, and sound synthesizer settings are stored entirely in your browser's local sandbox memory (using <code>localStorage</code> metrics). We do not transmit, upload, or collect your custom statistics, gameplay logs, or chosen nickname inputs to any central data servers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">2. Google AdSense & Cookies Policy</h3>
              <p className="text-sm leading-relaxed">
                To support server deployment costs and keep the platform completely free, <strong>Google AdSense advertisements may be served on our web application in the future</strong>. 
                Third-party vendors, including Google, use cookie technologies (like the DoubleClick cookie) to serve relevant advertisements to users based on their prior visits to our web platform or other internet domains. 
                These cookies enable Google and its network partners to show ads based on your digital travels on the internet.
              </p>
              <p className="text-sm mt-2">
                Users may choose to opt-out of personalized advertisements by visiting Google's Ads Settings page or by configuring their browser cookie filters.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">3. Standard Log Files and Analytics</h3>
              <p className="text-sm">
                Like most hosted sites, Neon Dino Dash utilizes standard analytic engines provided by Vercel hosting platform. These platforms automatically capture brief log metrics when you view the application. These parameters include internet protocol (IP) address pools, browser models, Internet Service Providers (ISPs), date/timestamp markings, referring pages, and simple demographic patterns. These variables are completely anonymous, are not linked to any personally identifiable elements, and are compiled solely for analyzing app health and performance metrics.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">4. Third Party Privacy Policies</h3>
              <p className="text-sm">
                Our policy does not apply to other third-party websites or advertisement vendors. We heavily advise you to inspect the respective Privacy Policies of these third parties for more descriptive tutorials, including instruction details on how to disable specific cookies or trackings.
              </p>
            </div>

            <div className="p-4 bg-indigo-50/30 rounded-xl border border-indigo-150">
              <h4 className="text-xs font-black uppercase text-indigo-950 mb-1">Consent</h4>
              <p className="text-xs text-indigo-800 font-medium">
                By entering or playing inside our Neon Dino Dash virtual runtime, you hereby consent to our Privacy Policy terms and agree to its standard operational structures.
              </p>
            </div>
          </div>
        )}

        {/* =======================================
            TERMS & CONDITIONS PAGE
           ======================================= */}
        {currentPage === 'TERMS' && (
          <div className="space-y-6">
            <p className="text-xs text-indigo-500 font-black uppercase tracking-wider">
              Effective Date: June 2026
            </p>

            <p className="text-sm">
              These Terms & Conditions outline the rules and regulations for the use of Neon Dino Dash web application, hosted via our Vercel platform. By visiting this application, you agree to comply with all rules stated below. Do not continue to utilize Neon Dino Dash if you do not agree to all terms stated on this screen.
            </p>

            <div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">1. Eligibility & Free Service Description</h3>
              <p className="text-sm">
                Neon Dino Dash is a browser game designed for general public engagement and entertainment, and is <strong>100% free to play</strong>. We reserve the absolute right to suspend, restyle, update, or terminate access to any features or customization tools within the game environment at our convenience without any prior notification.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">2. Intellect and Fair Gameplay Terms</h3>
              <p className="text-sm leading-relaxed">
                All code, user interface graphics, sound synthesizers, logo icons, custom CSS styles, and structural layouts of Neon Dino Dash are protected under intellectual property declarations. Users are granted a limited dashboard license to interact with the game in a standard browser setting.
              </p>
              <p className="text-sm mt-1.5 font-bold text-pink-600 block">
                You are expressly forbidden from:
              </p>
              <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                <li>Automating gameplay or spoofing scoreboard entries via third-party scripts.</li>
                <li>Redistributing or wrapping our game inside standalone client packages without written authorization.</li>
                <li>Hotlinking or scraping assets in a manner that creates server strain or compromises browser integrity.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">3. Future Advertising Placements</h3>
              <p className="text-sm">
                As expressed in our Privacy Statement, we partner with external providers such as Google to display promotional elements. You agree not to manipulate, hide, or alter standard blocks or code layout associated with virtual banner spaces displayed inside our layout framework.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">4. Disclaimers and Limitations of Liability</h3>
              <p className="text-sm">
                Our application is delivered "AS IS" and without any warranty of any kind, whether direct or implied. We do not promise that the web code will run completely error-free or uninterrupted. In no event shall Neon Dino Dash or its developers be held liable for any data losses or machine strain related to standard web interactions.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer copyright section */}
      <div className="pt-4 border-t border-indigo-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-indigo-400 font-extrabold uppercase tracking-wide gap-3">
        <span>© 2026 Neon Dino Dash. All Rights Reserved.</span>
        <span>Free to Play Web Arcade</span>
      </div>

    </div>
  );
};
