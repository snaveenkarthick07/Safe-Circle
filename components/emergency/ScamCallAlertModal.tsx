'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldAlert, 
  PhoneOff, 
  PhoneCall, 
  MicOff, 
  Volume2, 
  AlertTriangle, 
  Radio, 
  ShieldCheck, 
  Ban, 
  Check, 
  X,
  VolumeX,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';
import { soundEffects } from '@/lib/audioEffects';
import { SCAM_KEYWORDS } from '@/lib/scamShieldEngine';
import { CallShieldAnalysis } from '@/types';

export function ScamCallAlertModal() {
  const { 
    activeScamAlert, 
    dismissScamAlert, 
    blockNumber 
  } = useApp();

  const [isAnsweredWithSafeguard, setIsAnsweredWithSafeguard] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isDoneSpeaking, setIsDoneSpeaking] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  // Trigger continuous ringtone when scam alert opens
  useEffect(() => {
    if (activeScamAlert) {
      setIsAnsweredWithSafeguard(false);
      setTranscribedText('');
      setIsDoneSpeaking(false);
      setCallTimer(0);
      soundEffects.startPhoneRingtone();
    } else {
      soundEffects.stopPhoneRingtone();
      soundEffects.stopSpeaking();
    }

    return () => {
      soundEffects.stopPhoneRingtone();
      soundEffects.stopSpeaking();
    };
  }, [activeScamAlert]);

  // Call timer when answered
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnsweredWithSafeguard) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAnsweredWithSafeguard]);

  if (!activeScamAlert) return null;

  const handleBlockAndReport = () => {
    soundEffects.stopPhoneRingtone();
    soundEffects.stopSpeaking();
    blockNumber(
      activeScamAlert.phoneNumber, 
      activeScamAlert.callerName, 
      activeScamAlert.category || 'phishing'
    );
    dismissScamAlert();
  };

  const handleDismiss = () => {
    soundEffects.stopPhoneRingtone();
    soundEffects.stopSpeaking();
    dismissScamAlert();
  };

  const handleAnswerSafeguard = () => {
    soundEffects.stopPhoneRingtone();
    setIsAnsweredWithSafeguard(true);

    const fullDialogue = activeScamAlert.simulatedAudioScript || 
      `Attention citizen. This is an urgent verification notice regarding your bank account. Your account status is marked suspended. Please confirm your identity by providing the 6-digit OTP code sent via SMS immediately.`;

    // Simulate word-by-word streaming live transcription
    const words = fullDialogue.split(' ');
    let currentIdx = 0;
    setTranscribedText('');

    // Speak through browser speech synthesis
    soundEffects.speak(fullDialogue, 'authority');

    const transcriptionInterval = setInterval(() => {
      if (currentIdx < words.length) {
        setTranscribedText(words.slice(0, currentIdx + 1).join(' '));
        currentIdx++;
      } else {
        setIsDoneSpeaking(true);
        clearInterval(transcriptionInterval);
      }
    }, 280);
  };

  // Helper to highlight scam keywords in text
  const renderHighlightedTranscript = (text: string) => {
    if (!text) return 'Listening to caller audio stream...';

    // Regex match any known scam keywords
    const regex = new RegExp(`(${SCAM_KEYWORDS.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      const isKeyword = SCAM_KEYWORDS.some(kw => kw.toLowerCase() === part.toLowerCase());
      if (isKeyword) {
        return (
          <span 
            key={idx} 
            className="bg-rose-500/25 text-rose-400 font-extrabold px-1.5 py-0.5 rounded border border-rose-500/40 inline-block animate-pulse mx-0.5"
          >
            ⚠️ {part.toUpperCase()}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-slate-950 text-white select-none overflow-hidden animate-in fade-in duration-300">
      {/* Red Ambient Warning Pulse Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/70 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-rose-600/20 blur-3xl pointer-events-none animate-pulse" />

      {/* Top Warning Badges */}
      <div className="w-full max-w-md pt-8 px-6 flex flex-col items-center gap-2 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/40 animate-bounce">
          <ShieldAlert className="w-4 h-4" />
          <span>SUSPECTED BANK PHISHING SCAN</span>
        </div>

        {activeScamAlert.isSpoofedVoip && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>POSSIBLE NUMBER SPOOFING DETECTED</span>
          </div>
        )}
      </div>

      {/* Center Screen: Incoming Alert vs AI Safeguard Active Call */}
      {!isAnsweredWithSafeguard ? (
        <div className="flex flex-col items-center text-center z-10 px-6 my-auto max-w-sm">
          {/* Pulsing Hazard Shield Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 -m-4 rounded-full bg-rose-500/30 animate-ping duration-1000" />
            <div className="relative w-28 h-28 rounded-full border-4 border-rose-500 bg-rose-950/80 shadow-2xl shadow-rose-500/50 flex items-center justify-center">
              <ShieldAlert className="w-14 h-14 text-rose-400 animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-1">
            {activeScamAlert.callerName}
          </h2>
          <p className="text-base font-mono text-rose-300 font-bold mb-3">
            {activeScamAlert.phoneNumber}
          </p>

          {/* Risk Score Pill */}
          <div className="flex items-center gap-2 bg-rose-950/90 border border-rose-800/80 px-4 py-2 rounded-2xl mb-4 shadow-xl">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-bold text-rose-200">
              Trust Score: <b className="text-white text-sm">{activeScamAlert.trustScore}%</b> (Critical Risk)
            </span>
          </div>

          {/* Community Warning Note */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-xs text-slate-300 text-left space-y-1.5 shadow-xl">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-400">
              <span>COMMUNITY THREAT INTELLIGENCE</span>
              <span>Flagged {activeScamAlert.flagCount}x</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {activeScamAlert.threatSummary}
            </p>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
              <span>Carrier: {activeScamAlert.carrier}</span>
              <span>{activeScamAlert.location}</span>
            </div>
          </div>
        </div>
      ) : (
        /* AI Safeguard Live Transcription Active Screen */
        <div className="flex-1 w-full max-w-md z-10 px-6 my-auto flex flex-col justify-center space-y-4">
          {/* Active Call Header */}
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black block text-emerald-400">
                  AI Call Safeguard Active
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {activeScamAlert.phoneNumber} • {formatTimer(callTimer)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-amber-400">
              <MicOff className="w-3 h-3 text-rose-400" />
              <span>Mic Muted (Safe)</span>
            </div>
          </div>

          {/* Live Audio Transcription Feed */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-2xl flex-1 max-h-[300px] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                Live Speech Transcription & Keyword Intercept
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                {isDoneSpeaking ? 'Call Audio Ended' : 'Transcribing...'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 text-xs leading-relaxed text-slate-200 font-medium">
              {renderHighlightedTranscript(transcribedText)}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Your microphone is isolated. Scammer cannot clone your voice or record biometric audio.</span>
            </div>
          </div>
        </div>
      )}

      {/* 3 Quick Action Buttons Footer */}
      <div className="w-full max-w-md px-6 pb-10 z-10 space-y-3">
        {!isAnsweredWithSafeguard ? (
          <div className="space-y-2.5">
            {/* 1. Block & Report Button (Red Primary) */}
            <button
              onClick={handleBlockAndReport}
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-600/40 transition-all hover:scale-[1.01] active:scale-95"
            >
              <Ban className="w-4 h-4" />
              <span>Block & Report Number (+1 Flag)</span>
            </button>

            {/* 2. Answer with AI Safeguard (Green) */}
            <button
              onClick={handleAnswerSafeguard}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Answer with AI Safeguard (Mute Mic & Transcribe)</span>
            </button>

            {/* 3. Dismiss Alert (Neutral) */}
            <button
              onClick={handleDismiss}
              className="w-full py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs transition-colors"
            >
              Dismiss Alert
            </button>
          </div>
        ) : (
          /* Hang Up & Block from active safeguard */
          <div className="flex items-center gap-3">
            <button
              onClick={handleBlockAndReport}
              className="flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-600/50 transition-all active:scale-95"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Hang Up & Block Scammer</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
