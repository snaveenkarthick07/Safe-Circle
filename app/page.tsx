'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { TRANSLATIONS } from '@/lib/translations';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  Navigation, 
  PhoneCall, 
  Lock, 
  Sparkles, 
  Radio, 
  Car, 
  FileText, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Zap, 
  Compass, 
  Users, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  ChevronRight,
  Plus,
  HelpCircle,
  Activity,
  Mic,
  Volume2
} from 'lucide-react';

export default function HomePage() {
  const { 
    triggerSOS, 
    triggerFakeCall, 
    openFakeCallSettings,
    setRoutePlannerOpen, 
    userLocation,
    language,
    activeMainView,
    setActiveMainView,
    isSOSActive,
    isEmergencyTriggered,
    guardians,
    safePoints,
    activeJourney,
    acousticConfig,
    toggleAcousticTrigger,
    triggerAcousticSimulation
  } = useApp();

  const { login, signup, switchRole, currentRole, currentUser } = useAuth();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Authentication Module State
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authRole, setAuthRole] = useState<'user' | 'guardian' | 'authority'>('user');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [consentLocation, setConsentLocation] = useState(true);
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // Handle Auth Form Submission
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signin') {
      login(emailOrPhone, authRole);
      switchRole(authRole);
      setAuthSuccessMsg(`Welcome back! Signed in as ${authRole.toUpperCase()}. Redirecting to Member Dashboard...`);
    } else {
      signup({
        name: fullName || 'Verified User',
        email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@safecircle.org`,
        phone: emailOrPhone.includes('@') ? '+91 98765 00000' : emailOrPhone,
        city: city || 'Coimbatore',
        consentLocationTracking: consentLocation,
        role: authRole,
      });
      switchRole(authRole);
      setAuthSuccessMsg(`Account created successfully for ${fullName || 'User'}! Redirecting to Member Dashboard...`);
    }

    setTimeout(() => {
      setAuthSuccessMsg('');
      setActiveMainView('dashboard');
    }, 1500);
  };

  /* ==========================================================================
     PAGE 2: LOGIN & REGISTRATION MODULE (MODAL OVERLAY STYLE)
     ========================================================================== */
  if (activeMainView === 'auth') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-indigo-600 text-white shadow-xl shadow-rose-600/30 mb-2">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.authPageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              {t.authPageSubtitle}
            </p>
          </div>

          {/* Success Toast Banner */}
          {authSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-3 mb-6 animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {/* Role Selector Tabs (3 Roles) */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Your Access Portal
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'user', label: t.roleWoman, icon: '👩' },
                { id: 'guardian', label: t.roleGuardian, icon: '🛡️' },
                { id: 'authority', label: t.roleAuthority, icon: '👮' }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setAuthRole(r.id as any)}
                  className={`py-3 px-2 rounded-2xl text-xs font-bold flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 ${
                    authRole === r.id
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-[1.02]'
                      : 'bg-slate-950/70 hover:bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80'
                  }`}
                >
                  <span className="text-base">{r.icon}</span>
                  <span className="truncate w-full text-center">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Auth Mode Toggle (Sign In vs Create Account) */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                authMode === 'signin'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.tabSignIn}
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                authMode === 'signup'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.tabSignUp}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Full Name in Sign Up Mode */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.inputFullName}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Your Full Name"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all placeholder:text-slate-500"
                />
              </div>
            )}

            {/* Email or Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.inputEmailOrPhone}
              </label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="+91 98765 43210 or name@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Password with Eye Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.inputPassword}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  title="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Additional Fields for Signup */}
            {authMode === 'signup' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t.inputCity}
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Coimbatore"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t.inputEmergencyContact}
                    </label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="+91 94432 10987"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consentLocation}
                    onChange={(e) => setConsentLocation(e.target.checked)}
                    className="w-4 h-4 accent-rose-600 rounded mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
                    {t.consentCheckbox}
                  </label>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all duration-200 active:scale-95"
              >
                {authMode === 'signin' ? t.btnSignIn : t.btnCreateAccount}
              </button>
            </div>
          </form>

          {/* Footer Navigation Back to Dashboard */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              className="text-pink-400 hover:text-pink-300 font-semibold transition-colors"
            >
              {authMode === 'signin' ? t.needAccount : t.alreadyHaveAccount}
            </button>

            <button
              onClick={() => setActiveMainView('dashboard')}
              className="text-slate-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <span>{t.guestAccessNotice.split('—')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  /* ==========================================================================
     PAGE 1: DEFAULT MEMBER DASHBOARD (FIRST VIEW)
     ========================================================================== */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. STATUS BANNER: Dark Slate Gradient Card with Live GPS & SILENT SOS Button */}
      <section className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all shadow-2xl backdrop-blur-md ${
        isEmergencyTriggered
          ? 'bg-gradient-to-r from-rose-950/90 via-slate-900/90 to-slate-900/95 border-rose-500/50 shadow-rose-950/40'
          : 'bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-slate-900/95 border-emerald-500/30 shadow-emerald-950/20'
      }`}>
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Status Text & Location */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isEmergencyTriggered ? 'SOS BROADCAST ACTIVE' : t.statusSafeTitle}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {isEmergencyTriggered ? 'Emergency Broadcast Dispatched' : t.tagline}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {isEmergencyTriggered 
                ? 'Encrypted GPS coordinates and live telemetry stream are being transmitted to your primary Guardian Circle and nearby authorities.' 
                : t.statusSafeSubtitle
              }
            </p>

            {/* GPS Telemetry Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-xs">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800/80 text-slate-200 font-semibold shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{t.locationLabel}: <strong className="text-emerald-400 font-semibold">{t.currentLocationVal}</strong></span>
              </span>

              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800/80 text-slate-300">
                <Compass className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>GPS Accuracy: ±4m</span>
              </span>

              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800/80 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Battery: 88%</span>
              </span>
            </div>
          </div>

          {/* High-Contrast SILENT SOS Action Button */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={triggerSOS}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-base tracking-wider uppercase shadow-xl shadow-rose-600/40 flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-95 border border-rose-400/30"
            >
              <Radio className="w-5 h-5 animate-pulse" />
              <span>{t.silentSosBtn}</span>
            </button>
          </div>

        </div>
      </section>

      {/* Guest Mode Info Note */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.guestAccessNotice}</span>
        </div>
        <button
          onClick={() => setActiveMainView('auth')}
          className="text-pink-400 hover:text-pink-300 font-semibold text-xs shrink-0 ml-2 transition-colors"
        >
          {t.loginAction} →
        </button>
      </div>

      {/* 2. QUICK ACTIONS GRID: Responsive Cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-4) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <span>{t.quickActionsTitle}</span>
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">Tap any card to launch safety workflow</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Safe Route Navigation */}
          <div 
            onClick={() => setRoutePlannerOpen(true)}
            className="p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 cursor-pointer group shadow-xl hover:shadow-2xl backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-105 border border-emerald-500/20">
                  <Navigation className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  98% Well-Lit
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {t.safeRouteTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t.safeRouteDesc}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>Compare Safe Routes</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Journey Guardian */}
          <Link 
            href="/journey"
            className="p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 cursor-pointer group shadow-xl hover:shadow-2xl backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-105 border border-indigo-500/20">
                  <Car className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {activeJourney ? 'Active Trip' : 'Auto Alert'}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                {t.journeyTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t.journeyDesc}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
              <span>Start Trip Tracking</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Fake Call Simulator */}
          <div 
            onClick={openFakeCallSettings}
            className="p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 cursor-pointer group shadow-xl hover:shadow-2xl backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center transition-transform group-hover:scale-105 border border-rose-500/20">
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Instant Exit
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                {t.fakeCallTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t.fakeCallDesc}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-rose-400">
              <span>Configure Incoming Call</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Scam & Hacker Call Shield */}
          <Link 
            href="/call-shield"
            className="p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 cursor-pointer group shadow-xl hover:shadow-2xl backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center transition-transform group-hover:scale-105 border border-amber-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  AI Defense
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                Scam & Hacker Call Shield
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Live threat score inspection, spoofing detection, and caller blacklisting.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Scan Phone Numbers</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* 3. SECOND ROW QUICK ACTIONS (Evidence Vault, Safety Map, Reports, Acoustic Scream Trigger) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 5: Evidence Vault */}
        <Link 
          href="/vault"
          className="p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 cursor-pointer group shadow-xl hover:shadow-2xl backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center transition-transform group-hover:scale-105 border border-blue-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                AES-256 GCM
              </span>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
              {t.evidenceVaultTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t.evidenceVaultDesc}
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400">
            <span>Encrypted Storage</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 6: Live Safety Map & Safe Points */}
        <Link 
          href="/map"
          className="p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 cursor-pointer group shadow-xl hover:shadow-2xl backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center transition-transform group-hover:scale-105 border border-rose-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {safePoints.length} Havens
              </span>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
              {t.liveMapTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t.liveMapDesc}
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-rose-400">
            <span>View Spatial Map</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 7: Anonymous Incident Reporting */}
        <Link 
          href="/reports"
          className="p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 cursor-pointer group shadow-xl hover:shadow-2xl backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center transition-transform group-hover:scale-105 border border-amber-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Zero Logs
              </span>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Anonymous Report
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Report harassment, dark areas, or transport threats with instant authority tracking.
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400">
            <span>File Secure Report</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 8: AI Acoustic Scream & Decibel Trigger */}
        <div 
          onClick={() => triggerAcousticSimulation('simulation_test', 92)}
          className="p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 cursor-pointer group shadow-xl hover:shadow-2xl backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="w-11 h-11 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center transition-transform group-hover:scale-105 border border-pink-500/20">
                <Mic className="w-5 h-5 animate-pulse" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20">
                Web Audio
              </span>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-pink-400 transition-colors">
              AI Acoustic Trigger
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Auto-activates 5s cancelable SOS countdown on sudden scream or &gt;85dB spikes.
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-pink-400">
            <span>Test Scream Simulator</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </section>

      {/* 4. GUARDIAN CIRCLE & REGIONAL SAFE HAVENS (Coimbatore Focus) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Guardian Circle Contacts */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 hover:border-slate-700 transition-all space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-white text-base">Your Guardian Circle</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400 text-xs font-medium">
              {guardians.length} Contacts Linked
            </span>
          </div>

          <div className="space-y-3">
            {guardians.map((g) => (
              <div key={g.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700/80 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-sm">
                    {g.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{g.name}</p>
                    <p className="text-xs text-slate-400">{g.relation} • {g.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Standby
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Priority {g.priority}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Safe Havens Nearby (Coimbatore & Environs) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 hover:border-slate-700 transition-all space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Verified Safe Havens Nearby</h3>
            </div>
            <Link href="/map" className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
              View on Map →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Apollo 24/7 Pharmacy & Safe Desk', type: 'Medical Safe Haven', distance: '180m', address: 'Cross Cut Rd, Gandhipuram, Coimbatore' },
              { name: 'Pink Police All-Women Outpost', type: 'Law Enforcement', distance: '320m', address: 'Town Hall Junction, Coimbatore' },
              { name: 'PSG Tech Security Helpdesk Gate 2', type: 'Campus Security', distance: '450m', address: 'Avinashi Rd, Peelamedu, Coimbatore' }
            ].map((sh, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700/80 flex items-center justify-between transition-colors">
                <div>
                  <p className="text-sm font-semibold text-white">{sh.name}</p>
                  <p className="text-xs text-slate-400">{sh.address}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {sh.type}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold font-mono">
                    {sh.distance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}

