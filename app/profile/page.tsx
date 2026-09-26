'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { EmergencyContactInput, UserRole } from '@/types';
import { ProfilePhotoUpload } from '@/components/common/ProfilePhotoUpload';
import { UserAvatar } from '@/components/common/UserAvatar';
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
  AlertTriangle,
  LogOut,
  Plus,
  Trash2,
  RefreshCw,
  Camera,
  Building2,
  Shield
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, updateUserSettings, logout, currentRole, switchRole } = useAuth();
  const { guardians } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [city, setCity] = useState(currentUser.city || 'Bengaluru');
  const [campusOrg, setCampusOrg] = useState(currentUser.campusOrg || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [discreetPin, setDiscreetPin] = useState(currentUser.discreetPin || '1234');
  const [policeDispatch, setPoliceDispatch] = useState(currentUser.consentPoliceDispatch);
  const [audioRecording, setAudioRecording] = useState(currentUser.consentAudioRecording);
  const [locationTracking, setLocationTracking] = useState(currentUser.consentLocationTracking);
  const [nightSafety, setNightSafety] = useState(currentUser.nightSafetyMode);
  const [collegeSafety, setCollegeSafety] = useState(currentUser.collegeSafetyMode);

  // Emergency contacts list
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactInput[]>(
    currentUser.emergencyContacts || []
  );

  // New emergency contact fields
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Mom');
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state if currentUser changes
  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setPhone(currentUser.phone);
    setCity(currentUser.city || 'Bengaluru');
    setCampusOrg(currentUser.campusOrg || '');
    setAvatar(currentUser.avatar || '');
    setRole(currentUser.role);
    setDiscreetPin(currentUser.discreetPin || '1234');
    setPoliceDispatch(currentUser.consentPoliceDispatch);
    setAudioRecording(currentUser.consentAudioRecording);
    setLocationTracking(currentUser.consentLocationTracking);
    setNightSafety(currentUser.nightSafetyMode);
    setCollegeSafety(currentUser.collegeSafetyMode);
    setEmergencyContacts(currentUser.emergencyContacts || []);
  }, [currentUser]);

  const handleAddEmergencyContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) {
      setErrorMessage('Please provide both contact name and phone number.');
      return;
    }

    const newContact: EmergencyContactInput = {
      id: `ec_${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relation: newContactRelation,
      priority: (emergencyContacts.length + 1) as 1 | 2 | 3,
    };

    setEmergencyContacts(prev => [...prev, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    setIsAddingContact(false);
    setErrorMessage(null);
  };

  const handleRemoveContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    try {
      updateUserSettings({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        campusOrg: campusOrg.trim() || undefined,
        avatar,
        role,
        discreetPin,
        emergencyContacts,
        emergencyContactsCount: emergencyContacts.length,
        consentPoliceDispatch: policeDispatch,
        consentAudioRecording: audioRecording,
        consentLocationTracking: locationTracking,
        nightSafetyMode: nightSafety,
        collegeSafetyMode: collegeSafety,
      });

      if (role !== currentRole) {
        switchRole(role);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase mb-1">
            <Lock className="w-3.5 h-3.5" />
            Privacy & Identity Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Profile & Safety Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your personal profile, custom photo, emergency guardians, and explicit privacy consents.
          </p>
        </div>

        {/* Sign Out Button in Header */}
        <div>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Profile changes, custom photo, and emergency contacts saved permanently!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Profile Photo & Identity Banner */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-6">
          <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span>Personal Profile & Avatar</span>
          </h2>

          {/* Current Avatar Preview Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-border">
            <UserAvatar user={{ name, avatar, role }} size="2xl" showBadge />
            <div className="space-y-1">
              <h3 className="font-bold text-xl text-foreground">{name || currentUser.name}</h3>
              <p className="text-xs text-muted-foreground">{email || currentUser.email}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase border border-primary/20">
                  Active Role: {role}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[10px] border border-emerald-500/20">
                  {emergencyContacts.length} Linked Contacts
                </span>
              </div>
            </div>
          </div>

          {/* Photo Upload Component */}
          <ProfilePhotoUpload
            value={avatar}
            onChange={(newAvatar) => setAvatar(newAvatar)}
            label="Upload New Profile Picture"
            helperText="Drag & drop or select PNG, JPG, or WEBP file (auto-compressed & stored locally)"
          />

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Phone Number (Linked for SOS)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Primary City / Zone
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Active System Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="user">👩 Woman / Primary User</option>
                <option value="guardian">🛡️ Family Guardian</option>
                <option value="authority">👮 Police / Govt Authority</option>
                <option value="organization">🎓 Campus Safety Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Discreet Screen PIN (Unlocks Calculator)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  maxLength={4}
                  value={discreetPin}
                  onChange={(e) => setDiscreetPin(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Emergency Contacts Management */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Emergency Contacts & Guardian Circle ({emergencyContacts.length})</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Saved contacts receive instant SMS coordinates, live maps, and emergency escalation
              </p>
            </div>
            {!isAddingContact && (
              <button
                type="button"
                onClick={() => setIsAddingContact(true)}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-primary/20 hover:opacity-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact</span>
              </button>
            )}
          </div>

          {/* Add contact inline drawer */}
          {isAddingContact && (
            <div className="p-4 rounded-2xl bg-muted/40 border border-primary/40 space-y-3 animate-in fade-in">
              <span className="text-xs font-bold text-primary">New Emergency Contact</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Contact Name (e.g. Dad)"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-input bg-background text-xs text-foreground"
                />
                <input
                  type="text"
                  placeholder="Phone Number (+91 ...)"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-input bg-background text-xs font-mono text-foreground"
                />
                <select
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-input bg-background text-xs text-foreground"
                >
                  <option value="Mom">Mom</option>
                  <option value="Dad">Dad</option>
                  <option value="Sister">Sister</option>
                  <option value="Brother">Brother</option>
                  <option value="Friend">Friend</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingContact(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddEmergencyContact}
                  className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm"
                >
                  Save to Circle
                </button>
              </div>
            </div>
          )}

          {/* Contact Cards List */}
          <div className="space-y-2.5">
            {emergencyContacts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-muted/20 border border-dashed border-border text-center text-xs text-muted-foreground">
                No emergency contacts configured yet. Add at least 1 contact to enable SOS alerts.
              </div>
            ) : (
              emergencyContacts.map((contact, idx) => (
                <div
                  key={contact.id || idx}
                  className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{contact.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground font-semibold">
                          {contact.relation || 'Guardian'}
                        </span>
                      </div>
                      <span className="text-muted-foreground font-mono text-[11px]">{contact.phone}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveContact(contact.id)}
                    className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Remove contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Explicit Privacy & Consent Card */}
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
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
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

        {/* Submit & Sign Out Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={logout}
            className="px-6 py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of SafeCircle</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-2xl bg-primary hover:opacity-95 text-primary-foreground font-bold text-sm shadow-xl shadow-primary/30 transition-all hover:scale-102 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving All Preferences...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save All Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
