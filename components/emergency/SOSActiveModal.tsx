'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldAlert, 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  Navigation, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';

export function SOSActiveModal() {
  const { 
    isSOSActive, 
    sosCountdown, 
    isEmergencyTriggered, 
    isSirenEnabled, 
    toggleSiren, 
    cancelSOS,
    guardians,
    safePoints,
    userLocation,
    policeDispatchOptIn
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPinPad, setShowPinPad] = useState(false);

  if (!isSOSActive && !isEmergencyTriggered) return null;

  const handleCancel = () => {
    if (showPinPad) {
      const ok = cancelSOS(pinInput);
      if (!ok) {
        setPinError(true);
        setTimeout(() => setPinError(false), 2000);
      } else {
        setPinInput('');
        setShowPinPad(false);
      }
    } else {
      cancelSOS('1234');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/50 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Glow effect behind modal */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Phase 1: 5-Second Countdown Screen */}
        {sosCountdown > 0 && !isEmergencyTriggered ? (
          <div className="flex flex-col items-center text-center py-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold tracking-wide uppercase mb-4 animate-pulse">
              <Radio className="w-3.5 h-3.5 animate-spin" />
              Emergency SOS Initializing
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
              Sending Distress Alert in...
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
              Live GPS telemetry and encrypted beacon will be dispatched to your {guardians.filter(g => g.isLinked).length} Guardian contacts and emergency desks.
            </p>

            {/* Huge Animated Countdown Ring */}
            <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-rose-500/10 border-4 border-rose-500/30 text-rose-400 text-6xl font-black mb-8 shadow-inner animate-pulse">
              <span>{sosCountdown}</span>
              <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin" />
            </div>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={handleCancel}
                className="w-full py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-sm sm:text-base border border-slate-700/80 shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Cancel — I am Safe (False Alarm)</span>
              </button>

              <button
                onClick={() => cancelSOS('1234')}
                className="text-xs text-slate-400 hover:text-white underline transition-colors"
              >
                Quick dismiss without PIN
              </button>
            </div>
          </div>
        ) : (
          /* Phase 2: Live Emergency Active Screen */
          <div className="flex flex-col gap-5 py-2">
            {/* Header banner */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 animate-bounce">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-rose-400 tracking-tight flex items-center gap-2">
                    EMERGENCY SOS ACTIVE
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  </h3>
                  <p className="text-xs text-slate-400">Guardian network alerted • GPS beacon streaming</p>
                </div>
              </div>

              {/* Siren button */}
              <button
                onClick={toggleSiren}
                className={`p-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all duration-200 active:scale-95 ${
                  isSirenEnabled 
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-lg shadow-rose-600/30' 
                    : 'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                {isSirenEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{isSirenEnabled ? 'Siren ON' : 'Turn Siren ON'}</span>
              </button>
            </div>

            {/* Status alerts */}
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4 animate-pulse text-rose-400" />
                  Live GPS Streaming Activated
                </span>
                <span className="font-mono text-slate-300">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
              </div>
              <p className="text-xs text-slate-400">
                Location broadcasted to {guardians.filter(g => g.isLinked).map(g => g.name).join(', ')}.
                {!policeDispatchOptIn && ' (Police dispatch inactive as per privacy settings).'}
              </p>
            </div>

            {/* Quick Emergency Hotlines */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                1-Tap Emergency Hotlines
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <a
                  href="tel:112"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md shadow-rose-600/30 active:scale-95"
                >
                  <span className="text-[10px] opacity-80">All Emergency</span>
                  <span className="text-lg">112</span>
                </a>
                <a
                  href="tel:1091"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-bold transition-all border border-slate-700/80 active:scale-95"
                >
                  <span className="text-[10px] text-slate-400">Women Helpline</span>
                  <span className="text-lg text-rose-400">1091</span>
                </a>
                <a
                  href="tel:181"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-bold transition-all border border-slate-700/80 active:scale-95"
                >
                  <span className="text-[10px] text-slate-400">Distress Support</span>
                  <span className="text-lg text-rose-400">181</span>
                </a>
                <a
                  href="tel:100"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-bold transition-all border border-slate-700/80 active:scale-95"
                >
                  <span className="text-[10px] text-slate-400">Police Direct</span>
                  <span className="text-lg text-rose-400">100</span>
                </a>
              </div>
            </div>

            {/* Nearest Safe Points */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Closest Verified Safe Havens
              </p>
              <div className="space-y-2">
                {safePoints.slice(0, 2).map((sp) => (
                  <div 
                    key={sp.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{sp.name}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold px-2 py-0.5 rounded-full">
                          {sp.distance}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-[280px] mt-0.5">{sp.address}</p>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${sp.lat},${sp.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 text-xs font-bold transition-all active:scale-95"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Disarm / Cancel Emergency Area with PIN */}
            <div className="pt-2 border-t border-slate-800/80">
              {showPinPad ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="Enter 4-digit PIN (default 1234)"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-rose-500"
                    />
                    <button
                      onClick={handleCancel}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all active:scale-95"
                    >
                      Confirm Safe
                    </button>
                  </div>
                  {pinError && (
                    <p className="text-xs text-rose-400 font-medium text-center">Incorrect PIN. Try 1234.</p>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowPinPad(true)}
                  className="w-full py-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-slate-200 border border-slate-800/80 text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Deactivate SOS with Safe PIN</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

