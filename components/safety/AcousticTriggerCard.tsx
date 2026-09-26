'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  AlertTriangle, 
  Radio, 
  Smartphone, 
  Bluetooth, 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Sliders,
  Play
} from 'lucide-react';
import { AcousticSensitivity } from '@/types';

export function AcousticTriggerCard() {
  const { 
    acousticConfig, 
    liveDecibels, 
    toggleAcousticTrigger, 
    setAcousticSensitivity, 
    toggleShakeDetection, 
    toggleBluetoothFob, 
    triggerAcousticSimulation 
  } = useApp();

  const { 
    isEnabled, 
    sensitivity, 
    thresholdDecibels, 
    shakeDetectionEnabled, 
    bluetoothFobEnabled, 
    micPermissionStatus 
  } = acousticConfig;

  // Percentage for live decibel bar (30 dB to 110 dB range)
  const decibelPercent = Math.min(Math.max(((liveDecibels - 30) / (110 - 30)) * 100, 0), 100);
  const thresholdPercent = Math.min(Math.max(((thresholdDecibels - 30) / (110 - 30)) * 100, 0), 100);

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-xl space-y-6 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
        isEnabled ? 'bg-red-500/10 opacity-100' : 'bg-muted/10 opacity-30'
      }`} />

      {/* Top Header & Main Toggle Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
            isEnabled
              ? 'bg-red-500/20 text-red-500 shadow-lg shadow-red-500/20'
              : 'bg-muted text-muted-foreground'
          }`}>
            {isEnabled ? <Mic className="w-6 h-6 animate-pulse" /> : <MicOff className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-lg text-foreground">
                AI Scream & Acoustic Trigger
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                ACTIVE SENSORS
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Continuously listens for screams, high-decibel distress cries, or sudden violent struggles to auto-launch Silent SOS.
            </p>
          </div>
        </div>

        {/* Master Feature Toggle Switch */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <span className="text-xs font-bold text-foreground">
            {isEnabled ? 'Monitoring Active' : 'Disabled'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isEnabled}
            onClick={toggleAcousticTrigger}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              isEnabled ? 'bg-red-600' : 'bg-muted'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isEnabled ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Permission Status Indicator & Ambient Sensor Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
        {/* Mic Permission Badge */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
          <div className="shrink-0">
            {micPermissionStatus === 'granted' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : micPermissionStatus === 'denied' ? (
              <XCircle className="w-5 h-5 text-red-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground block text-[10px] font-bold uppercase">
              Microphone Permission
            </span>
            <span className={`font-bold ${
              micPermissionStatus === 'granted'
                ? 'text-emerald-500'
                : micPermissionStatus === 'denied'
                ? 'text-red-500'
                : 'text-amber-500'
            }`}>
              {micPermissionStatus === 'granted'
                ? 'Granted & Active'
                : micPermissionStatus === 'denied'
                ? 'Blocked by Browser'
                : 'Permission Pending'}
            </span>
          </div>
        </div>

        {/* Current Ambient Level */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px] font-bold uppercase">
              Live Ambient Noise
            </span>
            <span className="font-heading font-black text-lg text-foreground">
              {isEnabled ? `${liveDecibels} dB` : '-- dB'}
            </span>
          </div>
          <Volume2 className={`w-5 h-5 ${isEnabled ? 'text-primary animate-pulse' : 'text-muted-foreground opacity-40'}`} />
        </div>

        {/* Active Threshold Level */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px] font-bold uppercase">
              Trigger Threshold
            </span>
            <span className="font-heading font-black text-lg text-red-500">
              {thresholdDecibels} dB SPL
            </span>
          </div>
          <Radio className="w-5 h-5 text-red-500" />
        </div>
      </div>

      {/* Live Decibel SPL Gauge Meter */}
      <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-muted-foreground flex items-center gap-1.5">
            <Radio className={`w-3.5 h-3.5 ${isEnabled ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
            Live Decibel Audio Gauge (Web Audio API)
          </span>
          <span className="font-mono text-xs font-bold text-foreground">
            {liveDecibels} / {thresholdDecibels} dB
          </span>
        </div>

        {/* Progress bar with threshold mark */}
        <div className="relative w-full h-4 rounded-full bg-muted overflow-hidden">
          {/* Animated dB fill */}
          <div
            style={{ width: isEnabled ? `${decibelPercent}%` : '0%' }}
            className={`h-full transition-all duration-100 rounded-full ${
              liveDecibels >= thresholdDecibels
                ? 'bg-red-600 animate-pulse'
                : liveDecibels >= thresholdDecibels - 10
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
          />
          {/* Threshold mark pin */}
          <div
            style={{ left: `${thresholdPercent}%` }}
            className="absolute top-0 bottom-0 w-1 bg-white shadow-md z-10"
            title={`Threshold: ${thresholdDecibels} dB`}
          />
        </div>

        <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
          <span>30 dB (Quiet)</span>
          <span className="text-red-400 font-bold">▲ Threshold ({thresholdDecibels} dB)</span>
          <span>110 dB (Scream Spike)</span>
        </div>
      </div>

      {/* Sensitivity Level Selector */}
      <div className="space-y-2.5 relative z-10">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-primary" />
            Detection Sensitivity & Threshold Calibration
          </label>
          <span className="text-[11px] text-muted-foreground">
            Active: <b className="text-foreground capitalize">{sensitivity} ({thresholdDecibels} dB)</b>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setAcousticSensitivity('high')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              sensitivity === 'high'
                ? 'bg-red-500/15 border-red-500 text-foreground shadow-sm'
                : 'bg-card border-border hover:bg-muted text-muted-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground">High Sensitivity</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400">75 dB</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Quiet residential streets, empty parking lots, lone walks.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setAcousticSensitivity('medium')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              sensitivity === 'medium'
                ? 'bg-primary/15 border-primary text-foreground shadow-sm'
                : 'bg-card border-border hover:bg-muted text-muted-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground">Medium (Recommended)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/20 text-primary">82 dB</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Distress screams, glass break, cries for help.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setAcousticSensitivity('low')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              sensitivity === 'low'
                ? 'bg-amber-500/15 border-amber-500 text-foreground shadow-sm'
                : 'bg-card border-border hover:bg-muted text-muted-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground">Low Sensitivity</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">90 dB</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Public transit, concerts, bustling markets, cafeterias.
            </p>
          </button>
        </div>
      </div>

      {/* Secondary Sensor Toggles: Rapid Shake & BLE Fob */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/60 relative z-10">
        {/* Rapid Shake Toggle */}
        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-foreground block">Rapid Phone Shake Trigger</span>
              <span className="text-[10px] text-muted-foreground">3 rapid violent shakes triggers SOS</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={shakeDetectionEnabled}
            onChange={toggleShakeDetection}
            className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
          />
        </div>

        {/* Web Bluetooth Wearable Fob Toggle */}
        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Bluetooth className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-foreground block">Web Bluetooth Panic Fob</span>
              <span className="text-[10px] text-muted-foreground">Sync with smart jewelry or key fob</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={bluetoothFobEnabled}
            onChange={toggleBluetoothFob}
            className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
          />
        </div>
      </div>

      {/* Developer & Judges Demo Panel: Test Simulation Controls */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600/10 via-rose-600/10 to-purple-600/10 border border-red-500/30 space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span className="font-bold text-xs text-foreground uppercase tracking-wider">
              Developer & Judges Demo Simulation Controls
            </span>
          </div>
          <span className="text-[10px] bg-red-500 text-white font-black px-2 py-0.5 rounded-full">
            NO HARDWARE REQUIRED
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Showcase the 5-second cancelable SOS countdown and acoustic emergency protocol to judges instantly:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => triggerAcousticSimulation('scream_decibel', 95)}
            className="px-3.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <Mic className="w-3.5 h-3.5 animate-bounce" />
            <span>Simulate Scream (95 dB)</span>
          </button>

          <button
            type="button"
            onClick={() => triggerAcousticSimulation('rapid_shake')}
            className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simulate Phone Shake</span>
          </button>

          <button
            type="button"
            onClick={() => triggerAcousticSimulation('bluetooth_fob')}
            className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <Bluetooth className="w-3.5 h-3.5" />
            <span>Simulate BLE Key Fob</span>
          </button>
        </div>
      </div>
    </div>
  );
}
