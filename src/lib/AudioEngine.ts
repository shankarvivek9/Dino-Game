/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private volume: number = 0.5; // 0 to 1
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMutedStatus(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  private createSound(type: OscillatorType = 'sine'): { osc: OscillatorNode; gain: GainNode } | null {
    this.initContext();
    if (!this.ctx || this.isMuted || this.volume <= 0) return null;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    return { osc, gain };
  }

  public playJump() {
    const sound = this.createSound('triangle');
    if (!sound) return;

    const { osc, gain } = sound;
    const now = this.ctx!.currentTime;

    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gain.gain.setValueAtTime(this.volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playDoubleJump() {
    const sound = this.createSound('sine');
    if (!sound) return;

    const { osc, gain } = sound;
    const now = this.ctx!.currentTime;

    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playLaser() {
    const sound = this.createSound('sawtooth');
    if (!sound) return;

    const { osc, gain } = sound;
    const now = this.ctx!.currentTime;

    osc.frequency.setValueAtTime(880, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.18);

    gain.gain.setValueAtTime(this.volume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playCoin() {
    this.initContext();
    if (!this.ctx || this.isMuted || this.volume <= 0) return;

    const now = this.ctx!.currentTime;

    // First note
    const s1 = this.createSound('sine');
    if (s1) {
      s1.osc.frequency.setValueAtTime(987.77, now); // B5
      s1.gain.gain.setValueAtTime(this.volume * 0.25, now);
      s1.gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      s1.osc.start(now);
      s1.osc.stop(now + 0.1);
    }

    // Second note slightly delayed
    setTimeout(() => {
      const s2 = this.createSound('sine');
      if (s2) {
        const delayedNow = this.ctx!.currentTime;
        s2.osc.frequency.setValueAtTime(1318.51, delayedNow); // E6
        s2.gain.gain.setValueAtTime(this.volume * 0.25, delayedNow);
        s2.gain.gain.exponentialRampToValueAtTime(0.01, delayedNow + 0.15);
        s2.osc.start(delayedNow);
        s2.osc.stop(delayedNow + 0.18);
      }
    }, 80);
  }

  public playPowerUp() {
    this.initContext();
    if (!this.ctx || this.isMuted || this.volume <= 0) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C major arpeggio
    
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const s = this.createSound('triangle');
        if (s) {
          const itemNow = this.ctx!.currentTime;
          s.osc.frequency.setValueAtTime(freq, itemNow);
          s.osc.frequency.exponentialRampToValueAtTime(freq * 1.5, itemNow + 0.15);
          s.gain.gain.setValueAtTime(this.volume * 0.2, itemNow);
          s.gain.gain.exponentialRampToValueAtTime(0.01, itemNow + 0.2);
          s.osc.start(itemNow);
          s.osc.stop(itemNow + 0.22);
        }
      }, idx * 60);
    });
  }

  public playExplode() {
    const sound = this.createSound('sawtooth');
    if (!sound) return;

    const { osc, gain } = sound;
    const now = this.ctx!.currentTime;

    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.25);

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.26);

    // Add noise simulation
    const noise = this.createSound('triangle');
    if (noise) {
      noise.osc.frequency.setValueAtTime(100, now);
      noise.osc.frequency.linearRampToValueAtTime(10, now + 0.2);
      noise.gain.gain.setValueAtTime(this.volume * 0.4, now);
      noise.gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      noise.osc.start(now);
      noise.osc.stop(now + 0.22);
    }
  }

  public playHit() {
    const sound = this.createSound('sawtooth');
    if (!sound) return;

    const { osc, gain } = sound;
    const now = this.ctx!.currentTime;

    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(30, now + 0.4);

    gain.gain.setValueAtTime(this.volume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  public playLevelUp() {
    this.initContext();
    if (!this.ctx || this.isMuted || this.volume <= 0) return;

    const startNote = this.ctx.currentTime;
    const arpeggio = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    arpeggio.forEach((f, i) => {
      setTimeout(() => {
        const item = this.createSound('sine');
        if (item) {
          const t = this.ctx!.currentTime;
          item.osc.frequency.setValueAtTime(f, t);
          item.gain.gain.setValueAtTime(this.volume * 0.3, t);
          item.gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
          item.osc.start(t);
          item.osc.stop(t + 0.28);
        }
      }, i * 100);
    });
  }
}

export const audio = new AudioEngine();
