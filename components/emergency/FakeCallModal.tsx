'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Phone, 
  PhoneOff, 
  PhoneCall, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  User as UserIcon, 
  Play, 
  Clock, 
  Sparkles,
  X,
  Grid,
  Shield,
  Briefcase,
  Car,
  Check,
  RotateCcw,
  Volume1,
  MessageSquare,
  BellRing,
  LogOut,
  Sliders
} from 'lucide-react';
import { soundEffects } from '@/lib/audioEffects';

// Identity Presets Configuration
interface CallerPreset {
  id: 'mom' | 'dad' | 'police' | 'boss' | 'taxi' | 'custom';
  label: string;
  name: string;
  number: string;
  avatar: string;
  defaultMessage: string;
  voiceType: 'parent' | 'authority' | 'friend';
  icon: any;
}

const CALLER_PRESETS: CallerPreset[] = [
  {
    id: 'mom',
    label: 'Mom',
    name: 'Mom (Sunita)',
    number: '+91 98765 11224',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    defaultMessage: 'Beta, where are you right now? Dinner is on the table and it is getting late. Papa and I are waiting for you, please take an auto and head home immediately.',
    voiceType: 'parent',
    icon: UserIcon,
  },
  {
    id: 'dad',
    label: 'Dad',
    name: 'Dad (Rajesh)',
    number: '+91 98765 11223',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    defaultMessage: "Hey sweetheart, I am just parked right outside in the car with the hazard lights on waiting for you. Are you coming down right now? Hurry up, let's head home.",
    voiceType: 'parent',
    icon: UserIcon,
  },
  {
    id: 'police',
    label: 'Police 112',
    name: 'Sub-Inspector Sharma (112 Patrol)',
    number: '112 / +91 94808 00001',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    defaultMessage: 'SafeCircle Emergency Dispatch Unit. We have your live GPS location on our precinct monitor and a Pink Patrol vehicle is 200 meters away. Please confirm if you require immediate escort.',
    voiceType: 'authority',
    icon: Shield,
  },
  {
    id: 'boss',
    label: 'Boss / Work',
    name: 'Vikram Malhotra (Director)',
    number: '+91 98220 54321',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    defaultMessage: 'Hi there, sorry to call you so late, but we have an urgent project escalation on the client server. Are you near your laptop? Please jump on the call right away.',
    voiceType: 'authority',
    icon: Briefcase,
  },
  {
    id: 'taxi',
    label: 'Cab Driver',
    name: 'Ramesh (Uber Premier)',
    number: '+91 99012 34567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    defaultMessage: 'Madam, I have arrived at your pickup location with the white Swift Dzire. I am right in front of the gate with headlights on. Please come quickly.',
    voiceType: 'friend',
    icon: Car,
  },
];

const PRESET_SCRIPTS = [
  { label: 'Dinner / Family Waiting', text: 'Beta, where are you right now? Dinner is on the table and it is getting late. Papa and I are waiting for you, please head home immediately.' },
  { label: 'Parked Outside Waiting', text: "Hey sweetheart, I am just parked right outside in the car with the hazard lights on waiting for you. Are you coming down right now? Let's head home." },
  { label: 'Taxi Arrived Outside', text: 'Madam, I have arrived at your pickup location with the white Swift Dzire. I am right in front of the gate with headlights on. Please come quickly.' },
  { label: 'Police 112 Dispatch Check', text: 'SafeCircle Emergency Dispatch Unit. We have your live GPS location on our precinct monitor and a Pink Patrol vehicle is 200 meters away. Please confirm if you require immediate escort.' },
  { label: 'Urgent Office Work Call', text: 'Hi, sorry to call you so late, but we have an urgent escalation on the client server. Are you near your laptop? Please jump on the call right away.' },
];

export function FakeCallModal() {
  const { 
    isIncomingCallActive, 
    isFakeCallModalOpen, 
    fakeCallConfig, 
    setFakeCallConfig, 
    triggerFakeCall, 
    dismissFakeCall, 
    closeFakeCallSettings,
    scheduledFakeCallCountdown,
    cancelScheduledFakeCall
  } = useApp();

  // Active call states
  const [callState, setCallState] = useState<'incoming' | 'connected' | 'ended'>('incoming');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [keypadInput, setKeypadInput] = useState('');

  // Configuration Form State
  const [selectedPresetId, setSelectedPresetId] = useState<string>(fakeCallConfig.presetId || 'dad');
  const [nameInput, setNameInput] = useState(fakeCallConfig.callerName);
  const [numberInput, setNumberInput] = useState(fakeCallConfig.callerNumber);
  const [imageInput, setImageInput] = useState(fakeCallConfig.callerImage);
  const [messageInput, setMessageInput] = useState(fakeCallConfig.audioMessage);
  const [delayInput, setDelayInput] = useState(fakeCallConfig.delaySeconds);
  const [ringtoneEnabled, setRingtoneEnabled] = useState(fakeCallConfig.ringtoneEnabled !== false);
  const [voiceType, setVoiceType] = useState<'parent' | 'authority' | 'friend'>(fakeCallConfig.voiceType || 'parent');
  const [isPlayingTestAudio, setIsPlayingTestAudio] = useState(false);

  // Sync state when incoming call is triggered
  useEffect(() => {
    if (isIncomingCallActive) {
      setCallState('incoming');
      setCallDuration(0);
      setIsKeypadOpen(false);
      setKeypadInput('');
    }
  }, [isIncomingCallActive]);

  // Call duration ticker when connected
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isIncomingCallActive && callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isIncomingCallActive, callState]);

  // Preset Selection Handler
  const handleSelectPreset = (preset: CallerPreset) => {
    setSelectedPresetId(preset.id);
    setNameInput(preset.name);
    setNumberInput(preset.number);
    setImageInput(preset.avatar);
    setMessageInput(preset.defaultMessage);
    setVoiceType(preset.voiceType);
  };

  // Test Speech Audio
  const handleTestAudio = () => {
    if (isPlayingTestAudio) {
      soundEffects.stopSpeaking();
      setIsPlayingTestAudio(false);
      return;
    }
    setIsPlayingTestAudio(true);
    soundEffects.speak(messageInput || "Hello! This is a test fake call message.", voiceType);
    setTimeout(() => {
      setIsPlayingTestAudio(false);
    }, 4500);
  };

  // Save Config & Schedule
  const handleScheduleOrTrigger = (immediate: boolean = false) => {
    const finalDelay = immediate ? 0 : delayInput;
    setFakeCallConfig({
      callerName: nameInput,
      callerNumber: numberInput,
      callerImage: imageInput,
      audioMessage: messageInput,
      delaySeconds: finalDelay,
      presetId: selectedPresetId as any,
      ringtoneEnabled,
      voiceType,
    });
    closeFakeCallSettings();
    triggerFakeCall(finalDelay);
  };

  // When call is accepted
  const handleAnswerCall = () => {
    soundEffects.stopPhoneRingtone();
    setCallState('connected');
    soundEffects.speak(fakeCallConfig.audioMessage, fakeCallConfig.voiceType || 'parent');
  };

  // When call is declined or ended
  const handleDeclineOrEnd = () => {
    setCallState('ended');
    soundEffects.stopPhoneRingtone();
    soundEffects.stopSpeaking();
    setTimeout(() => {
      dismissFakeCall();
    }, 350);
  };

  // Keypad DTMF touch tone handler
  const handleKeypadPress = (digit: string) => {
    soundEffects.playKeypadTone(digit);
    setKeypadInput(prev => prev + digit);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* 1. DISCREET BACKGROUND COUNTDOWN BANNER */}
      {scheduledFakeCallCountdown !== null && !isIncomingCallActive && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9990] w-11/12 max-w-md bg-slate-950/95 backdrop-blur-2xl border border-indigo-500/40 text-white px-4 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center animate-pulse">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black block">
                  Fake Call in {scheduledFakeCallCountdown}s
                </span>
                <span className="text-[10px] text-slate-400 truncate block max-w-[180px]">
                  Caller: {fakeCallConfig.callerName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => triggerFakeCall(0)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-md transition-colors active:scale-95"
              >
                Call Now
              </button>
              <button
                onClick={cancelScheduledFakeCall}
                className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition-colors active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${Math.min(100, (scheduledFakeCallCountdown / (fakeCallConfig.delaySeconds || 1)) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* 2. PRE-CALL CONFIGURATION DASHBOARD MODAL */}
      {isFakeCallModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeFakeCallSettings();
          }}
        >
          <div 
            className="w-full max-w-lg bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    Fake Call Setup & Escape
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Configure caller identity, audio dialogue, and ring delay.
                  </p>
                </div>
              </div>
              <button 
                onClick={closeFakeCallSettings}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Setup Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {/* Presets Chips */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Quick Identity Presets
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {CALLER_PRESETS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    const IconComp = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-2 rounded-2xl flex flex-col items-center gap-1 border text-center transition-all duration-200 active:scale-95 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 scale-[1.03]'
                            : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-[11px] font-bold truncate w-full">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Caller Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Caller Display Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      setSelectedPresetId('custom');
                    }}
                    placeholder="e.g. Dad, Mom, Police"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Caller Phone Number
                  </label>
                  <input
                    type="text"
                    value={numberInput}
                    onChange={(e) => {
                      setNumberInput(e.target.value);
                      setSelectedPresetId('custom');
                    }}
                    placeholder="+91 98765 11223"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Avatar Image Selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Caller Avatar Photo URL
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    {imageInput ? (
                      <img src={imageInput} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-full h-full p-2 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-indigo-500 truncate"
                  />
                </div>
              </div>


              {/* Activation Delay Timer */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-muted-foreground tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Activation Delay Timer</span>
                  <span className="text-[10px] text-indigo-500 font-bold">
                    {delayInput === 0 ? 'Rings Immediately' : `Rings in ${delayInput}s`}
                  </span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { label: 'Instant', sec: 0 },
                    { label: '10s', sec: 10 },
                    { label: '30s', sec: 30 },
                    { label: '1 min', sec: 60 },
                    { label: '2 min', sec: 120 },
                  ].map((item) => (
                    <button
                      key={item.sec}
                      type="button"
                      onClick={() => setDelayInput(item.sec)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        delayInput === item.sec
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Dialogue Script */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-extrabold uppercase text-muted-foreground tracking-wider">
                    Simulated Voice Script
                  </label>
                  <button
                    type="button"
                    onClick={handleTestAudio}
                    className="text-[11px] font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span>{isPlayingTestAudio ? 'Speaking...' : 'Test Voice'}</span>
                  </button>
                </div>

                {/* Quick script pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-2">
                  {PRESET_SCRIPTS.map((script, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMessageInput(script.text)}
                      className="px-2.5 py-1 rounded-xl bg-muted/60 hover:bg-muted text-[10px] font-bold text-muted-foreground hover:text-foreground border border-border whitespace-nowrap shrink-0 transition-colors"
                    >
                      {script.label}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="What the caller will say when you answer..."
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Ringtone Sound & Voice Settings */}
              <div className="p-3 rounded-2xl bg-muted/30 border border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Realistic Ringtone Audio</span>
                    <span className="text-[10px] text-muted-foreground">Play continuous dual-tone phone ring</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ringtoneEnabled}
                    onChange={(e) => setRingtoneEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="flex items-center gap-2.5 pt-4 border-t border-border shrink-0">
              <button
                type="button"
                onClick={() => handleScheduleOrTrigger(true)}
                className="px-4 py-3 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs sm:text-sm transition-all active:scale-95"
              >
                Instant Ring
              </button>

              <button
                type="button"
                onClick={() => handleScheduleOrTrigger(false)}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>
                  {delayInput === 0 ? 'Trigger Fake Call' : `Schedule Fake Call (${delayInput}s)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FULL SCREEN NATIVE CALL OVERLAY (INCOMING OR ACTIVE) */}
      {isIncomingCallActive && (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-black text-white select-none overflow-hidden animate-in fade-in duration-300">
          {/* Blurred Background Wallpaper from Avatar */}
          {fakeCallConfig.callerImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-125 pointer-events-none"
              style={{ backgroundImage: `url(${fakeCallConfig.callerImage})` }}
            />
          )}

          {/* Top Status & Quick Exit */}
          <div className="w-full max-w-sm pt-10 px-6 flex items-center justify-between z-10">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              SafeCircle Secure Audio
            </span>
            <button
              onClick={handleDeclineOrEnd}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 text-[11px] font-bold text-slate-300 hover:bg-slate-700 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Quick Exit</span>
            </button>
          </div>

          {/* Center Caller Info */}
          <div className="flex flex-col items-center text-center z-10 px-4 my-auto">
            {/* Pulsing Avatar */}
            <div className="relative mb-6">
              {callState === 'incoming' && (
                <div className="absolute inset-0 -m-4 rounded-full bg-emerald-500/25 animate-ping duration-1000" />
              )}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-slate-700/80 overflow-hidden shadow-2xl bg-slate-900 flex items-center justify-center">
                {fakeCallConfig.callerImage ? (
                  <img 
                    src={fakeCallConfig.callerImage} 
                    alt={fakeCallConfig.callerName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <UserIcon className="w-14 h-14 text-slate-400" />
                )}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
              {fakeCallConfig.callerName}
            </h1>
            <p className="text-sm font-mono text-slate-400 mb-2">
              {fakeCallConfig.callerNumber}
            </p>

            <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300">
              {callState === 'incoming' && 'Incoming Call...'}
              {callState === 'connected' && formatDuration(callDuration)}
              {callState === 'ended' && 'Call Terminated'}
            </span>
          </div>

          {/* Active Call In-Call Controls (iOS 3x2 Grid) */}
          {callState === 'connected' && !isKeypadOpen && (
            <div className="w-full max-w-xs grid grid-cols-3 gap-y-6 gap-x-4 z-10 mb-8 animate-in fade-in">
              {/* Mute Button */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`flex flex-col items-center gap-1.5 transition-all ${
                  isMuted ? 'text-black' : 'text-white'
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-white text-black' : 'bg-slate-850/80 bg-slate-800 text-white'
                }`}>
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </div>
                <span className="text-[11px] text-slate-300 font-medium">
                  {isMuted ? 'Muted' : 'Mute'}
                </span>
              </button>

              {/* Keypad Button */}
              <button
                type="button"
                onClick={() => setIsKeypadOpen(true)}
                className="flex flex-col items-center gap-1.5 text-white"
              >
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors">
                  <Grid className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-slate-300 font-medium">Keypad</span>
              </button>

              {/* Speaker Button */}
              <button
                type="button"
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`flex flex-col items-center gap-1.5 transition-all ${
                  isSpeaker ? 'text-black' : 'text-white'
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isSpeaker ? 'bg-white text-black' : 'bg-slate-800 text-white'
                }`}>
                  {isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                </div>
                <span className="text-[11px] text-slate-300 font-medium">Speaker</span>
              </button>

              {/* Replay Dialogue */}
              <button
                type="button"
                onClick={() => soundEffects.speak(fakeCallConfig.audioMessage, fakeCallConfig.voiceType || 'parent')}
                className="flex flex-col items-center gap-1.5 text-white"
              >
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors">
                  <RotateCcw className="w-6 h-6 text-indigo-400" />
                </div>
                <span className="text-[11px] text-slate-300 font-medium">Replay Voice</span>
              </button>

              {/* FaceTime / Video (Cosmetic) */}
              <button
                type="button"
                className="flex flex-col items-center gap-1.5 text-slate-500 opacity-60"
              >
                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-slate-500 font-medium">FaceTime</span>
              </button>

              {/* Add Call (Cosmetic) */}
              <button
                type="button"
                className="flex flex-col items-center gap-1.5 text-slate-500 opacity-60"
              >
                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center">
                  <UserIcon className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Contacts</span>
              </button>
            </div>
          )}

          {/* Interactive DTMF Touch-Tone Keypad Overlay */}
          {callState === 'connected' && isKeypadOpen && (
            <div className="w-full max-w-xs z-10 mb-6 flex flex-col items-center animate-in zoom-in-95 duration-200">
              <div className="h-8 text-center text-xl font-mono tracking-widest text-white mb-2">
                {keypadInput || '\u00A0'}
              </div>
              <div className="grid grid-cols-3 gap-3 w-full">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeypadPress(digit)}
                    className="w-16 h-16 rounded-full bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-white font-bold text-2xl flex items-center justify-center mx-auto transition-transform active:scale-95 shadow-md"
                  >
                    {digit}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsKeypadOpen(false)}
                className="mt-4 px-4 py-1.5 rounded-full bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                Hide Keypad
              </button>
            </div>
          )}

          {/* Bottom Action Bar (Accept/Decline or End Call) */}
          <div className="w-full max-w-sm px-8 pb-12 z-10">
            {callState === 'incoming' ? (
              <div className="flex items-center justify-between px-4">
                {/* Decline Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeclineOrEnd}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl shadow-rose-600/50 transition-all hover:scale-105 active:scale-95"
                    title="Decline Call"
                  >
                    <PhoneOff className="w-8 h-8" />
                  </button>
                  <span className="text-xs font-semibold text-slate-300">Decline</span>
                </div>

                {/* Accept Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAnswerCall}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/50 transition-all hover:scale-110 active:scale-95 animate-bounce"
                    title="Accept Call"
                  >
                    <Phone className="w-8 h-8" />
                  </button>
                  <span className="text-xs font-semibold text-slate-300">Accept</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                {/* End Call Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeclineOrEnd}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl shadow-rose-600/60 transition-all hover:scale-105 active:scale-95"
                    title="End Call"
                  >
                    <PhoneOff className="w-8 h-8" />
                  </button>
                  <span className="text-xs font-semibold text-slate-300">End Call</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
