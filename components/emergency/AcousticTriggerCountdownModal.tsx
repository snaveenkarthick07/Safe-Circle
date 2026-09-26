'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldAlert, 
  Volume2, 
  X, 
  Radio, 
  AlertTriangle, 
  Mic, 
  Zap, 
  Smartphone, 
  Bluetooth, 
  Check, 
  Navigation
} from 'lucide-react';
import { soundEffects } from '@/lib/audioEffects';

export function AcousticTriggerCountdownModal() {
  const { 
    acousticAlert, 
    dismissAcousticAlert, 
    triggerSOS, 
    userLocation 
  } = useApp();

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!acousticAlert) {
      setCountdown(5);
      return;
    }

    setCountdown(5);
    // Play initial warning alert beep
    soundEffects.playCountdownBeep(650);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // 5 seconds elapsed without cancel -> Trigger Silent SOS!
          dismissAcousticAlert();
          triggerSOS();
          return 0;
        }
        soundEffects.playCountdownBeep(650 + (5 - prev + 1) * 80);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [acousticAlert]);

  if (!acousticAlert) return null;

  const triggerIcons = {
    scream_decibel: <Mic className="w-8 h-8 text-red-500 animate-pulse" />,
    rapid_shake: <Smartphone className="w-8 h-8 text-amber-500 animate-bounce" />,
    bluetooth_fob: <Bluetooth className="w-8 h-8 text-blue-500 animate-pulse" />,
    simulation_test: <Zap className="w-8 h-8 text-rose-500 animate-bounce" />,
  };

  const triggerTitles = {
    scream_decibel: `🚨 AI Scream / Decibel Spike (${acousticAlert.decibels || 85} dB)`,
    rapid_shake: `⚡ Rapid Physical Phone Shake Detected`,
    bluetooth_fob: `🔘 Wearable SOS Button Signal Received`,
    simulation_test: `🎯 Demo Sensor Trigger Simulation`,
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/50 text-slate-100 text-center space-y-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Pulsating background aura */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-600/10 via-transparent to-pink-600/10 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header alert badge */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          <span className="px-3.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            Automatic Acoustic SOS Trigger
          </span>
        </div>

        {/* Trigger type icon + title */}
        <div className="relative z-10 flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-1">
            {triggerIcons[acousticAlert.type] || <ShieldAlert className="w-8 h-8 text-rose-500" />}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {triggerTitles[acousticAlert.type]}
          </h2>
          <p className="text-xs text-slate-400 max-w-sm">
            {acousticAlert.description}
          </p>
        </div>

        {/* Massive Animated Circular Countdown */}
        <div className="relative z-10 flex flex-col items-center justify-center my-2">
          <div className="relative flex items-center justify-center w-36 h-36">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border-4 border-rose-500/30 animate-ping opacity-40" />
            <div className="absolute inset-2 rounded-full border-2 border-rose-500/60 animate-pulse" />
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-rose-600 to-pink-600 flex flex-col items-center justify-center text-white shadow-xl shadow-rose-600/50">
              <span className="text-5xl font-black leading-none">
                {countdown}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 mt-1">
                Seconds
              </span>
            </div>
          </div>
          <p className="text-xs font-bold text-rose-400 mt-3 animate-pulse">
            Silent SOS activating automatically...
          </p>
        </div>

        {/* Location lock info */}
        <div className="relative z-10 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-left text-xs">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="truncate max-w-[260px]">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">GPS Location Locked</span>
              <span className="font-semibold text-white truncate block">{userLocation.address}</span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
            GUARDIANS READY
          </span>
        </div>

        {/* Cancel Action Button (Aborts False Alarm) */}
        <div className="relative z-10 space-y-2 pt-1">
          <button
            onClick={dismissAcousticAlert}
            className="w-full py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-sm uppercase tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
          >
            <Check className="w-5 h-5 text-emerald-400" />
            <span>Cancel False Alarm (I Am Safe)</span>
          </button>
          <p className="text-[11px] text-slate-400">
            Tap button above to cancel if triggered by accident.
          </p>
        </div>
      </div>
    </div>
  );
}

