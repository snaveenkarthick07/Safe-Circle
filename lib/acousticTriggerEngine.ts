import { AcousticSensitivity, SensorTriggerType, MicPermissionState } from '@/types';

export interface AcousticEngineCallbacks {
  onDecibelUpdate?: (decibels: number) => void;
  onTriggerDetected: (type: SensorTriggerType, decibels?: number, notes?: string) => void;
  onPermissionChange?: (status: MicPermissionState) => void;
}

export const SENSITIVITY_THRESHOLDS: Record<AcousticSensitivity, number> = {
  high: 75,    // Sensitive (lone night walks, quiet alleys)
  medium: 82,  // Standard (normal screams, distress shouts)
  low: 90,     // High-noise environments (markets, traffic, clubs)
  custom: 80,
};

class AcousticTriggerEngine {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;
  private isListening = false;
  private currentThreshold = 82;
  private spikeFrameCount = 0;
  private callbacks: AcousticEngineCallbacks | null = null;

  // Shake detection properties
  private isShakeListening = false;
  private lastX = 0;
  private lastY = 0;
  private lastZ = 0;
  private lastShakeTime = 0;
  private shakeCount = 0;
  private shakeThreshold = 22; // m/s²

  // Debounce to prevent multiple triggers in short burst
  private lastTriggerTime = 0;
  private triggerDebounceMs = 6000;

  /**
   * Check current microphone permission
   */
  async checkPermission(): Promise<MicPermissionState> {
    if (typeof window === 'undefined') return 'unsupported';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return 'unsupported';
    }

    try {
      if (navigator.permissions && navigator.permissions.query) {
        // @ts-ignore
        const permission = await navigator.permissions.query({ name: 'microphone' });
        return permission.state as MicPermissionState;
      }
    } catch {
      // Fallback
    }

    return 'prompt';
  }

  /**
   * Start Acoustic (Microphone Decibel) Monitoring via Web Audio API
   */
  async startAcousticMonitoring(
    threshold = 82,
    callbacks: AcousticEngineCallbacks
  ): Promise<{ success: boolean; error?: string; permission: MicPermissionState }> {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Window not available', permission: 'unsupported' };
    }

    this.callbacks = callbacks;
    this.currentThreshold = threshold;

    try {
      // Request audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      this.mediaStream = stream;
      this.callbacks.onPermissionChange?.('granted');

      // Initialize Web Audio API
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.3;
      source.connect(this.analyser);

      this.isListening = true;
      this.spikeFrameCount = 0;
      this.processAudioLoop();

      return { success: true, permission: 'granted' };
    } catch (err: any) {
      console.warn('[AcousticEngine] Microphone access failed or denied:', err);
      const permStatus: MicPermissionState = err.name === 'NotAllowedError' ? 'denied' : 'unsupported';
      this.callbacks.onPermissionChange?.(permStatus);
      return { success: false, error: err.message || 'Microphone access denied', permission: permStatus };
    }
  }

  /**
   * Continuous processing loop calculating real-time Decibels SPL approximation
   */
  private processAudioLoop = () => {
    if (!this.isListening || !this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(dataArray);

    // Calculate RMS (Root Mean Square)
    let sumSquares = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sumSquares += normalized * normalized;
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);

    // Realistic Decibel formula calibration (scaled from ambient 32dB to peak 110dB)
    let decibels = Math.round(32 + Math.min(rms * 115, 80));
    if (rms > 0.6) {
      decibels = Math.min(Math.round(85 + (rms - 0.6) * 65), 115);
    }

    // Notify decibel meter in UI
    this.callbacks?.onDecibelUpdate?.(decibels);

    // Check if decibel exceeds emergency threshold
    const now = Date.now();
    if (decibels >= this.currentThreshold) {
      this.spikeFrameCount++;
      // Require 2 consecutive frames to prevent single accidental mic clicks
      if (this.spikeFrameCount >= 2 && now - this.lastTriggerTime > this.triggerDebounceMs) {
        this.lastTriggerTime = now;
        this.spikeFrameCount = 0;
        this.callbacks?.onTriggerDetected('scream_decibel', decibels, `Decibel spike reached ${decibels} dB (Threshold: ${this.currentThreshold} dB)`);
      }
    } else {
      if (this.spikeFrameCount > 0) {
        this.spikeFrameCount--;
      }
    }

    this.animationFrameId = requestAnimationFrame(this.processAudioLoop);
  };

  /**
   * Stop Acoustic Monitoring and cleanly release hardware resources
   */
  stopAcousticMonitoring() {
    this.isListening = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    this.analyser = null;
    this.callbacks?.onDecibelUpdate?.(0);
  }

  /**
   * Set dynamic threshold (e.g. 75, 82, 90 dB)
   */
  setThreshold(threshold: number) {
    this.currentThreshold = threshold;
  }

  /**
   * Start Device Accelerometer Shake Detection
   */
  startShakeMonitoring(callbacks: AcousticEngineCallbacks) {
    if (typeof window === 'undefined' || !window.addEventListener) return;
    this.callbacks = callbacks;
    this.isShakeListening = true;
    this.shakeCount = 0;
    this.lastShakeTime = Date.now();

    window.addEventListener('devicemotion', this.handleDeviceMotion);
  }

  /**
   * Stop Device Accelerometer Shake Detection
   */
  stopShakeMonitoring() {
    this.isShakeListening = false;
    if (typeof window !== 'undefined' && window.removeEventListener) {
      window.removeEventListener('devicemotion', this.handleDeviceMotion);
    }
  }

  private handleDeviceMotion = (e: DeviceMotionEvent) => {
    if (!this.isShakeListening || !e.accelerationIncludingGravity) return;

    const acc = e.accelerationIncludingGravity;
    const x = acc.x || 0;
    const y = acc.y || 0;
    const z = acc.z || 0;

    const deltaX = Math.abs(x - this.lastX);
    const deltaY = Math.abs(y - this.lastY);
    const deltaZ = Math.abs(z - this.lastZ);

    this.lastX = x;
    this.lastY = y;
    this.lastZ = z;

    const totalDelta = deltaX + deltaY + deltaZ;
    const now = Date.now();

    if (totalDelta > this.shakeThreshold) {
      if (now - this.lastShakeTime < 700) {
        this.shakeCount++;
        if (this.shakeCount >= 3 && now - this.lastTriggerTime > this.triggerDebounceMs) {
          this.lastTriggerTime = now;
          this.shakeCount = 0;
          this.callbacks?.onTriggerDetected('rapid_shake', undefined, 'Rapid violent physical shake pattern detected');
        }
      } else {
        this.shakeCount = 1;
      }
      this.lastShakeTime = now;
    }
  };

  /**
   * Direct Simulation Trigger for Demos & Judges
   */
  simulateTrigger(type: SensorTriggerType = 'simulation_test', simulatedDb = 94) {
    const notes = type === 'scream_decibel'
      ? `Simulated scream spike at ${simulatedDb} dB`
      : type === 'rapid_shake'
      ? 'Simulated violent phone struggle shake'
      : type === 'bluetooth_fob'
      ? 'Simulated Web Bluetooth emergency key fob press'
      : 'Demo developer test trigger';

    this.callbacks?.onTriggerDetected(type, simulatedDb, notes);
  }
}

export const acousticEngine = new AcousticTriggerEngine();
