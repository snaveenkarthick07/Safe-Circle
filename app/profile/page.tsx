'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Phone, 
  Mail, 
  MapPin, 
  Moon, 
  GraduationCap, 
  CheckCircle2, 
  KeyRound, 
  Radio, 
  AlertTriangle 
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, updateUserSettings } = useAuth();
  const { guardians } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [city, setCity] = useState(currentUser.city);
  const [discreetPin, setDiscreetPin] = useState(currentUser.discreetPin || '1234');
  const [policeDispatch, setPoliceDispatch] = useState(currentUser.consentPoliceDispatch);
  const [audioRecording, setAudioRecording] = useState(currentUser.consentAudioRecording);
  const [locationTracking, setLocationTracking] = useState(currentUser.consentLocationTracking);
  const [nightSafety, setNightSafety] = useState(currentUser.nightSafetyMode);
  const [collegeSafety, setCollegeSafety] = useState(currentUser.collegeSafetyMode);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings({
      name,
      phone,
      city,
      discreetPin,
      consentPoliceDispatch: policeDispatch,
      consentAudioRecording: audioRecording,
      consentLocationTracking: locationTracking,
      nightSafetyMode: nightSafety,
      collegeSafetyMode: collegeSafety,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase mb-1">
          <Lock className="w-3.5 h-3.5" />
          Privacy & Safety Preferences
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
          Profile & Consent Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Manage your personal safety preferences, secret PIN, and explicit data sharing consents.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Safety preferences saved and updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Details Card */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-4">
          <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span>Personal Profile</span>
          </h2>

          <div className="flex items-center gap-4 pb-4 border-b border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary"
            />
            <div>
              <h3 className="font-bold text-lg text-foreground">{currentUser.name}</h3>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase">
                Active Role: {currentUser.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Phone Number (Linked for SOS)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Primary City / Zone
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Discreet Screen PIN (Unlocks Calculator)
              </label>
              <input
                type="password"
                maxLength={4}
                value={discreetPin}
                onChange={(e) => setDiscreetPin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono tracking-widest"
              />
            </div>
          </div>
        </div>

        {/* Explicit Privacy & Consent Card */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-6">
          <div>
            <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>Explicit Privacy & Consent Matrix</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              SafeCircle strictly follows non-negotiable user autonomy. No signals are dispatched without your consent.
            </p>
          </div>

          <div className="space-y-4">
            {/* Consent 1: Police Dispatch */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">
                    Automatic Police Dispatch on SOS
                  </span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded-full">
                    Opt-In Only
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  When toggled OFF (recommended), SOS triggers notify your Guardian Circle first. Police are only notified if you explicitly dial 112.
                </p>
              </div>
              <input
                type="checkbox"
                checked={policeDispatch}
                onChange={(e) => setPoliceDispatch(e.target.checked)}
                className="rounded text-primary focus:ring-primary w-5 h-5 mt-1"
              />
            </div>

            {/* Consent 2: Audio Recording */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-sm text-foreground block">
                  Encrypted Background Audio Recording
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Allows SafeCircle to record encrypted audio evidence locally in your vault during SOS countdown and active journeys.
                </p>
              </div>
              <input
                type="checkbox"
                checked={audioRecording}
                onChange={(e) => setAudioRecording(e.target.checked)}
                className="rounded text-primary focus:ring-primary w-5 h-5 mt-1"
              />
            </div>

            {/* Consent 3: Auto-Expiring Live Location */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-sm text-foreground block">
                  Auto-Expiring Live GPS Sharing
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Your location coordinates are shared with linked Guardians only while a trip is active and expire instantly upon arrival.
                </p>
              </div>
              <input
                type="checkbox"
                checked={locationTracking}
                onChange={(e) => setLocationTracking(e.target.checked)}
                className="rounded text-primary focus:ring-primary w-5 h-5 mt-1"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-4 rounded-2xl bg-primary hover:opacity-90 text-white font-bold text-sm shadow-xl shadow-primary/30 transition-all hover:scale-102"
          >
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
