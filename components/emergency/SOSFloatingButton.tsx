'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  ShieldAlert, 
  PhoneCall, 
  Mic, 
  Calculator, 
  ShieldCheck, 
  Radio, 
  Sparkles,
  Zap,
  X
} from 'lucide-react';

export function SOSFloatingButton() {
  const { 
    triggerSOS, 
    openFakeCallSettings, 
    toggleDiscreetMode, 
    setVoiceTriggerOpen,
    isSOSActive, 
    isEmergencyTriggered,
    triggerAcousticSimulation 
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Floating Menu Action Hub */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end gap-3 pointer-events-auto select-none">
        {/* Expanded Quick Escape & Defense Actions */}
        {isExpanded && (
          <div className="flex flex-col items-end gap-2 mb-2 p-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800/80 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Fake Call Quick Trigger */}
            <button
              onClick={() => {
                setIsExpanded(false);
                openFakeCallSettings();
              }}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-xs transition-all duration-200 active:scale-95 group"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>Fake Call Escape</span>
              </div>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.2 rounded font-bold">
                ESCAPE
              </span>
            </button>

            {/* AI Scream Trigger Simulator */}
            <button
              onClick={() => {
                setIsExpanded(false);
                triggerAcousticSimulation('scream_decibel', 95);
              }}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold text-xs transition-all duration-200 active:scale-95 group"
            >
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                <span>Simulate Scream (95 dB)</span>
              </div>
              <span className="text-[10px] bg-rose-500/30 text-rose-300 px-1.5 py-0.2 rounded font-bold">
                TEST
              </span>
            </button>

            {/* Voice SOS Trigger Modal */}
            <button
              onClick={() => {
                setIsExpanded(false);
                setVoiceTriggerOpen(true);
              }}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold text-xs transition-all duration-200 active:scale-95 group"
            >
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>Voice SOS ("Help")</span>
              </div>
              <span className="text-[10px] bg-purple-500/30 text-purple-300 px-1.5 py-0.2 rounded font-bold">
                VOICE
              </span>
            </button>

            {/* Discreet Calculator Mode */}
            <button
              onClick={() => {
                setIsExpanded(false);
                toggleDiscreetMode();
              }}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 font-semibold text-xs transition-all duration-200 active:scale-95 group"
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
                <span>Discreet Mode (PIN 1234)</span>
              </div>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-bold">
                CAMO
              </span>
            </button>
          </div>
        )}

        {/* Action Toggle & SOS Core Button */}
        <div className="flex items-center gap-3">
          {/* Quick options expander */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title="Quick Safety Tools"
            className="w-11 h-11 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {isExpanded ? (
              <X className="w-5 h-5 text-slate-400" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            )}
          </button>

          {/* Primary SOS Button with Animated Breathing Outer Glow Pulse Ring */}
          <button
            id="persistent-sos-button"
            onClick={triggerSOS}
            className={`relative group flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full font-black text-white text-lg md:text-xl shadow-2xl transition-all duration-200 active:scale-95 ${
              isEmergencyTriggered || isSOSActive
                ? 'bg-rose-600 ring-4 ring-rose-400 animate-pulse shadow-rose-600/70'
                : 'bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-600 shadow-rose-600/50 hover:scale-105'
            }`}
          >
            {/* Outer Breathing Pulse Rings */}
            <span className="absolute -inset-2 rounded-full border-2 border-rose-500/40 animate-ping pointer-events-none" />
            <span className="absolute -inset-4 rounded-full border border-rose-500/20 animate-pulse pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center leading-none">
              <ShieldAlert className="w-6 h-6 md:w-8 md:h-8 mb-0.5 animate-pulse" />
              <span className="tracking-wider text-xs md:text-sm font-black">SOS</span>
            </div>

            {/* Hint Tooltip on hover */}
            <span className="absolute -top-10 right-0 bg-slate-900/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-800 shadow-xl backdrop-blur-md">
              Tap for Silent 5s SOS
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
