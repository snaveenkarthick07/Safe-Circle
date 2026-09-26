'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Mic, MicOff, Volume2, ShieldAlert, Sparkles, X, Check } from 'lucide-react';

export function VoiceTriggerModal() {
  const { isVoiceTriggerOpen, setVoiceTriggerOpen, triggerSOS } = useApp();
  const [isListening, setIsListening] = useState(true);
  const [detectedPhrase, setDetectedPhrase] = useState<string | null>(null);

  useEffect(() => {
    if (!isVoiceTriggerOpen) {
      setDetectedPhrase(null);
    }
  }, [isVoiceTriggerOpen]);

  if (!isVoiceTriggerOpen) return null;

  const handleSimulateKeyword = (word: string) => {
    setDetectedPhrase(word);
    setTimeout(() => {
      setVoiceTriggerOpen(false);
      triggerSOS();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl text-card-foreground">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Voice Distress Listener</h3>
              <p className="text-xs text-muted-foreground">Hands-free emergency activation</p>
            </div>
          </div>
          <button
            onClick={() => setVoiceTriggerOpen(false)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center py-6">
          {/* Animated sound wave visualizer */}
          <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-violet-500/10 text-violet-500 mb-6 border border-violet-500/20">
            <div className="absolute inset-0 rounded-full border-2 border-violet-500 animate-ping opacity-30" />
            <Mic className="w-10 h-10 animate-pulse" />
          </div>

          <div className="flex items-center gap-1.5 h-8 mb-4">
            {[40, 75, 90, 60, 100, 45, 80, 50, 95, 30].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className="w-1.5 bg-violet-500 rounded-full animate-pulse"
              />
            ))}
          </div>

          <h4 className="text-base font-bold text-foreground mb-1">
            {detectedPhrase ? `Trigger detected: "${detectedPhrase}"` : 'Listening for Trigger Words...'}
          </h4>
          <p className="text-xs text-muted-foreground max-w-xs mb-6">
            Say any of the pre-configured distress keywords clearly. The app will immediately initialize a 5-second cancelable SOS.
          </p>

          {/* Keyword test buttons */}
          <div className="w-full">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 text-left">
              Tap to Test Distress Keywords
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { word: 'Help!', desc: 'Standard trigger' },
                { word: 'Bachao!', desc: 'Hindi distress' },
                { word: 'SafeCircle SOS', desc: 'App passphrase' },
                { word: 'Emergency!', desc: 'General alert' }
              ].map((item) => (
                <button
                  key={item.word}
                  onClick={() => handleSimulateKeyword(item.word)}
                  className="p-3 rounded-2xl bg-muted/70 hover:bg-violet-600 hover:text-white border border-border text-left transition-all group"
                >
                  <div className="font-bold text-sm text-foreground group-hover:text-white flex items-center justify-between">
                    <span>"{item.word}"</span>
                    <ShieldAlert className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] text-muted-foreground group-hover:text-violet-200">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
