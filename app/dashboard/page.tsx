'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  Navigation, 
  PhoneCall, 
  Mic, 
  Calculator, 
  Lock, 
  Users, 
  Clock, 
  Radio, 
  Building2, 
  AlertTriangle, 
  ArrowRight, 
  Moon, 
  GraduationCap, 
  Share2, 
  CheckCircle2, 
  Flame, 
  ChevronRight,
  Battery,
  Plus,
  PhoneOff,
  Zap,
  Sparkles,
  Camera,
  User as UserIcon
} from 'lucide-react';
import { ReportIncidentModal } from '@/components/incidents/ReportIncidentModal';
import { AcousticTriggerCard } from '@/components/safety/AcousticTriggerCard';
import { UserAvatar } from '@/components/common/UserAvatar';

export default function UserDashboard() {
  const { currentUser, updateUserSettings, openProfileModal } = useAuth();
  const { 
    userLocation, 
    guardians, 
    safePoints, 
    activeJourney, 
    triggerSOS, 
    triggerFakeCall, 
    openFakeCallSettings,
    toggleDiscreetMode, 
    setVoiceTriggerOpen,
    setRoutePlannerOpen,
    scamReports,
    acousticConfig,
    toggleAcousticTrigger
  } = useApp();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareLiveLocation = () => {
    navigator.clipboard.writeText(`https://safecircle.org/live/${currentUser.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Synchronize custom emergency contacts saved on user profile with Guardian Circle
  const displayGuardians = (currentUser.emergencyContacts && currentUser.emergencyContacts.length > 0)
    ? currentUser.emergencyContacts.map((ec, idx) => ({
        id: ec.id || `ec_${idx}`,
        name: ec.name,
        relation: ec.relation || 'Guardian',
        phone: ec.phone,
        email: '',
        priority: (ec.priority || 1) as 1 | 2 | 3,
        isLinked: true,
        batteryLevel: 92 - (idx * 5) % 15,
        lastSeen: 'Active now',
      }))
    : guardians;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Top Safety Status & Location Bar */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-slate-900/95 border border-emerald-500/30 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Soft Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <button
              onClick={openProfileModal}
              title="Click to view & edit profile"
              className="relative group cursor-pointer"
            >
              <UserAvatar user={currentUser} size="xl" showBadge />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black text-white tracking-tight">
                  Welcome back, {currentUser.name.split(' ')[0]}
                </h1>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {userLocation.address}
                </span>
                <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
                  Zone: Normal (🟢)
                </span>
                <button
                  onClick={openProfileModal}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline decoration-indigo-400/50 hover:decoration-indigo-300"
                >
                  Edit Profile
                </button>
              </p>
            </div>
          </div>

          {/* Quick Location Broadcast & Guardian Sync */}
          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <button
              onClick={handleShareLiveLocation}
              className="px-4 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-800 hover:border-slate-700 flex items-center gap-2 shadow-sm transition-all duration-200 active:scale-95"
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>{copiedLink ? '✓ Live Link Copied!' : 'Share Live GPS Link'}</span>
            </button>

            <button
              onClick={triggerSOS}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black tracking-wide uppercase flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all duration-200 active:scale-95"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>Silent SOS</span>
            </button>
          </div>
        </div>

        {/* Safety Mode Toggles Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          {/* Night Safety Mode */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-xs text-slate-100 block">Night Safety Mode</span>
                <span className="text-[10px] text-slate-400">Heightened 5-min check-ins</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={currentUser.nightSafetyMode}
              onChange={(e) => updateUserSettings({ nightSafetyMode: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* College / Campus Safety Mode */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-xs text-slate-100 block">College Safety Mode</span>
                <span className="text-[10px] text-slate-400">Hostel & campus security sync</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={currentUser.collegeSafetyMode}
              onChange={(e) => updateUserSettings({ collegeSafetyMode: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* AI Scream & Acoustic Trigger Quick Toggle */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
            acousticConfig.isEnabled 
              ? 'bg-rose-950/30 border-rose-500/40 text-rose-300' 
              : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700/80'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${
                acousticConfig.isEnabled ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
              }`}>
                <Mic className={`w-4 h-4 ${acousticConfig.isEnabled ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <span className="font-semibold text-xs text-slate-100 block">Acoustic Scream Shield</span>
                <span className="text-[10px] text-slate-400">
                  {acousticConfig.isEnabled ? `Active (${acousticConfig.thresholdDecibels} dB)` : 'Microphone standby'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={acousticConfig.isEnabled}
              onChange={toggleAcousticTrigger}
              className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Nearby Safe Points Quick Counter */}
          <Link
            href="/safepoints"
            className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-xs text-slate-100 block group-hover:text-emerald-400 transition-colors">
                  {safePoints.length} Verified Havens
                </span>
                <span className="text-[10px] text-slate-400">Pharmacies, police & 24/7 stores</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
          </Link>
        </div>
      </div>

      {/* 2. Active Journey Banner (if live) */}
      {activeJourney && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-950/40 via-rose-950/30 to-purple-950/40 border-2 border-rose-500/40 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center animate-pulse shadow-lg shadow-rose-500/30">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-full">
                    Live Monitored Journey
                  </span>
                  <span className="text-xs text-slate-400">ETA: {activeJourney.expectedArrivalTime}</span>
                </div>
                <h3 className="font-bold text-base text-slate-100 mt-1">
                  {activeJourney.startLocation} → {activeJourney.destination}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/journey"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Open Live Monitor
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span>Journey Progress</span>
              <span>{activeJourney.currentProgressPct}% completed</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                style={{ width: `${activeJourney.currentProgressPct}%` }}
                className="h-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Quick Action Cards Hub */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-slate-100">
          Instant Safety Tools & Escape Controls
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5">
          {/* Action 1: Safe Route */}
          <button
            onClick={() => setRoutePlannerOpen(true)}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/60 shadow-lg flex flex-col items-center text-center gap-2 group transition-all duration-200 active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Navigation className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xs text-slate-100">AI Safe Route</span>
            <span className="text-[10px] text-slate-400">Avoid unlit sectors</span>
          </button>

          {/* Action 2: Fake Call Escape */}
          <button
            onClick={openFakeCallSettings}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-800/60 shadow-lg flex flex-col items-center text-center gap-2 group transition-all duration-200 active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xs text-slate-100">Fake Call Escape</span>
            <span className="text-[10px] text-slate-400">Discrete exit excuse</span>
          </button>

          {/* Action 3: Call Shield & Scam Detector */}
          <Link
            href="/call-shield"
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-rose-500/40 hover:bg-slate-800/60 shadow-lg flex flex-col items-center text-center gap-2 group transition-all duration-200 active:scale-95 relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 text-[9px] font-black uppercase border border-rose-500/30">
              AI
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xs text-slate-100">Call Shield</span>
            <span className="text-[10px] text-slate-400">Scam & Spoof Defend</span>
          </Link>

          {/* Action 4: Report Incident */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-pink-500/40 hover:bg-slate-800/60 shadow-lg flex flex-col items-center text-center gap-2 group transition-all duration-200 active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xs text-slate-100">Report Concern</span>
            <span className="text-[10px] text-slate-400">1-Tap Anonymous</span>
          </button>

          {/* Action 5: Evidence Vault */}
          <Link
            href="/vault"
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-800/60 shadow-lg flex flex-col items-center text-center gap-2 group transition-all duration-200 active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xs text-slate-100">Evidence Vault</span>
            <span className="text-[10px] text-slate-400">Encrypted locker</span>
          </Link>

          {/* Action 6: Voice Listener */}
          <button
            onClick={() => setVoiceTriggerOpen(true)}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-800/60 shadow-lg flex flex-col items-center text-center gap-2 group transition-all duration-200 active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xs text-slate-100">Voice SOS</span>
            <span className="text-[10px] text-slate-400">"Help" detection</span>
          </button>

          {/* Action 7: Calculator Mode */}
          <button
            onClick={toggleDiscreetMode}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-600 hover:bg-slate-800/60 shadow-lg flex flex-col items-center text-center gap-2 group transition-all duration-200 active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 border border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calculator className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xs text-slate-100">Discreet Mode</span>
            <span className="text-[10px] text-slate-400">Calculator skin</span>
          </button>
        </div>

        {/* Feature Clarification & Security Highlight: Scam Call Shield vs Fake Call */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Scam Shield Card */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 shadow-xl backdrop-blur-md flex flex-col justify-between gap-4 transition-all duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-sm text-slate-100">
                    Scam & Hacker Call Shield
                  </span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    CYBER DEFENSE
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AI scans incoming caller numbers against 4 threat vectors: known phishing databases, VoIP spoofing roots, community complaint counts, and live speech keywords.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-rose-400">
                {scamReports.length} Flagged Threats in Database
              </span>
              <Link
                href="/call-shield"
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1 transition-all duration-200 active:scale-95"
              >
                <span>Open Shield Scanner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Fake Call Escape Card */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 shadow-xl backdrop-blur-md flex flex-col justify-between gap-4 transition-all duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-sm text-slate-100">
                    Fake Call Escape Tool
                  </span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                    EMERGENCY EXIT
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Need a discrete reason to walk away from an unsafe conversation or date? Schedule a realistic incoming call with custom caller identity, audio voice scripts, and delays.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-indigo-400">
                Configurable Presets (Mom, Police, Boss)
              </span>
              <button
                onClick={openFakeCallSettings}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-all duration-200 active:scale-95"
              >
                <span>Configure Escape Call</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3B. High-Impact Acoustic & Sensor Trigger Module */}
        <AcousticTriggerCard />
      </div>

      {/* 4. Guardian Circle & Nearby Safe Points Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Guardian Circle Widget (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <h3 className="font-heading font-bold text-lg text-slate-100">Guardian Circle</h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openProfileModal}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add / Edit</span>
              </button>
              <Link
                href="/guardian"
                className="text-xs font-semibold text-indigo-400 flex items-center gap-1 hover:underline"
              >
                <span>Live View ({displayGuardians.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="space-y-2.5">
            {displayGuardians.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between gap-3 shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 font-black flex items-center justify-center text-sm border border-indigo-500/20">
                    {g.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{g.name}</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-semibold border border-slate-700/60">
                        {g.relation}
                      </span>
                      {g.isLinked && (
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.2 rounded border border-emerald-500/20">
                          Linked
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{g.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  {g.batteryLevel && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <Battery className="w-3.5 h-3.5" />
                      {g.batteryLevel}%
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">{g.lastSeen}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Safe Points Directory Preview (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-heading font-bold text-lg text-slate-100">Closest Safe Havens</h3>
            </div>
            <Link
              href="/safepoints"
              className="text-xs font-semibold text-emerald-400 flex items-center gap-1 hover:underline"
            >
              <span>View Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {safePoints.slice(0, 3).map((sp) => (
              <div
                key={sp.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between gap-3 shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{sp.name}</span>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-full">
                      {sp.distance}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{sp.address}</p>
                  <p className="text-[11px] text-emerald-400 font-medium mt-1">
                    ✓ {sp.openHours} • 📞 {sp.phone}
                  </p>
                </div>

                <a
                  href={`https://maps.google.com/?q=${sp.lat},${sp.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-sm transition-all duration-200 active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Reporting Modal */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
