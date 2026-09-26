// SafeCircle Web Audio Synthesizer for SOS Alarm, Siren, Countdown Beeps, and Fake Call Audio

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isSirenPlaying = false;
  private sirenOscillator: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;

  private getAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Beep sound for countdown ticks
  playCountdownBeep(frequency = 880, duration = 0.15) {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user interaction
    }
  }

  // Emergency Siren Tone
  startEmergencySiren() {
    if (this.isSirenPlaying) return;
    try {
      const ctx = this.getAudioContext();
      this.isSirenPlaying = true;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);

      // Pitch sweep up and down
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(2, ctx.currentTime); // 2 Hz sweep
      lfoGain.gain.setValueAtTime(300, ctx.currentTime);

      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.4, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      this.sirenOscillator = osc;
      this.sirenGain = gain;
    } catch {
      // Audio not allowed yet
    }
  }

  stopEmergencySiren() {
    if (this.sirenOscillator) {
      try {
        this.sirenOscillator.stop();
        this.sirenOscillator.disconnect();
      } catch {}
      this.sirenOscillator = null;
    }
    this.isSirenPlaying = false;
  }

  private ringtoneInterval: NodeJS.Timeout | null = null;

  // Phone Ringtone Simulator for Fake Call (Repeating loop)
  startPhoneRingtone() {
    this.stopPhoneRingtone();
    this.playPhoneRing();
    this.ringtoneInterval = setInterval(() => {
      this.playPhoneRing();
    }, 2800);
  }

  stopPhoneRingtone() {
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  // Single phone ring burst
  playPhoneRing() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Two dual-frequency bursts: 440Hz + 480Hz standard telephone bell
      [440, 480].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.setValueAtTime(0.2, now + 1.2);
        gain.gain.linearRampToValueAtTime(0, now + 1.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.4);
      });
    } catch {}
  }

  // Keypad DTMF touch-tone simulator
  playKeypadTone(digit: string) {
    try {
      const ctx = this.getAudioContext();
      const dtmfMap: Record<string, [number, number]> = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
      };
      const freqs = dtmfMap[digit] || [697, 1209];
      const now = ctx.currentTime;
      freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      });
    } catch {}
  }

  // Synthetic speech generation for Fake Call conversations & Voice guidance
  speak(text: string, voiceType: 'parent' | 'authority' | 'friend' = 'parent') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    
    if (voiceType === 'parent') {
      utterance.pitch = 0.92;
    } else if (voiceType === 'authority') {
      utterance.pitch = 0.85;
      utterance.rate = 0.92;
    } else {
      utterance.pitch = 1.05;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferred = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen'))
      );
      if (preferred) utterance.voice = preferred;
    }

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundEffects = new SoundEffectsManager();

