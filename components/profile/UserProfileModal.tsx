'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { EmergencyContactInput, UserRole } from '@/types';
import { ProfilePhotoUpload } from '@/components/common/ProfilePhotoUpload';
import { UserAvatar } from '@/components/common/UserAvatar';
import { 
  X, 
  User as UserIcon, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { currentUser, updateUserSettings, logout, currentRole, switchRole } = useAuth();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [city, setCity] = useState(currentUser.city || 'Bengaluru');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [discreetPin, setDiscreetPin] = useState(currentUser.discreetPin || '1234');
  const [policeDispatch, setPoliceDispatch] = useState(currentUser.consentPoliceDispatch);
  const [audioRecording, setAudioRecording] = useState(currentUser.consentAudioRecording);
  const [locationTracking, setLocationTracking] = useState(currentUser.consentLocationTracking);

  // Emergency contacts state
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactInput[]>(
    currentUser.emergencyContacts || []
  );

  // New contact draft
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Mom');
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Status feedback
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Keep state synchronized when currentUser changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
      setCity(currentUser.city || 'Bengaluru');
      setAvatar(currentUser.avatar || '');
      setRole(currentUser.role);
      setDiscreetPin(currentUser.discreetPin || '1234');
      setPoliceDispatch(currentUser.consentPoliceDispatch);
      setAudioRecording(currentUser.consentAudioRecording);
      setLocationTracking(currentUser.consentLocationTracking);
      setEmergencyContacts(currentUser.emergencyContacts || []);
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleAddEmergencyContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) {
      setErrorMessage('Please enter both contact name and phone number.');
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
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      updateUserSettings({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        avatar,
        role,
        discreetPin,
        emergencyContacts,
        emergencyContactsCount: emergencyContacts.length,
        consentPoliceDispatch: policeDispatch,
        consentAudioRecording: audioRecording,
        consentLocationTracking: locationTracking,
      });

      if (role !== currentRole) {
        switchRole(role);
      }

      setSuccessMessage('Profile and emergency contacts successfully saved!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutClick = () => {
    onClose();
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <UserAvatar user={{ name, avatar, role }} size="lg" />
            <div>
              <h2 className="font-heading font-black text-xl text-white">Profile & Safety Settings</h2>
              <p className="text-xs text-slate-400">View and update your verified identity and emergency circle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form id="profile-settings-form" onSubmit={handleSave} className="space-y-6">
            {/* 1. Profile Photo Upload */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
              <ProfilePhotoUpload
                value={avatar}
                onChange={(newAvatar) => setAvatar(newAvatar)}
                label="Custom Profile Photo"
                helperText="Upload your custom picture to display across SafeCircle"
              />
            </div>

            {/* 2. Basic Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Phone Number (Linked to SOS)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  City / Location Zone
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Role Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Active System Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { r: 'user' as UserRole, label: '👩 Primary User' },
                  { r: 'guardian' as UserRole, label: '🛡️ Guardian' },
                  { r: 'authority' as UserRole, label: '👮 Police / Govt' },
                  { r: 'organization' as UserRole, label: '🎓 Campus Admin' },
                ].map(item => (
                  <button
                    key={item.r}
                    type="button"
                    onClick={() => setRole(item.r)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      role === item.r
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Emergency Contacts Management */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Emergency Contacts & Guardians ({emergencyContacts.length})</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">These contacts receive instant SMS & live coordinates on SOS trigger</p>
                </div>
                {!isAddingContact && (
                  <button
                    type="button"
                    onClick={() => setIsAddingContact(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Contact</span>
                  </button>
                )}
              </div>

              {/* Add Contact Form Inline */}
              {isAddingContact && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-3 animate-in fade-in">
                  <div className="text-xs font-bold text-indigo-300">Add New Emergency Contact</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Contact Name (e.g. Dad)"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number (+91 ...)"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-mono text-white"
                    />
                    <select
                      value={newContactRelation}
                      onChange={(e) => setNewContactRelation(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white"
                    >
                      <option value="Mom">Mom</option>
                      <option value="Dad">Dad</option>
                      <option value="Sister">Sister</option>
                      <option value="Brother">Brother</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Friend">Friend</option>
                      <option value="Colleague">Colleague</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingContact(false)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddEmergencyContact}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                    >
                      Save Contact
                    </button>
                  </div>
                </div>
              )}

              {/* Contacts List */}
              <div className="space-y-2">
                {emergencyContacts.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-3 text-center">
                    No emergency contacts added yet. Add at least one contact for SOS alerts.
                  </div>
                ) : (
                  emergencyContacts.map((contact, index) => (
                    <div
                      key={contact.id || index}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white mr-2">{contact.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-300">
                            {contact.relation || 'Guardian'}
                          </span>
                          <div className="text-slate-400 font-mono text-[11px]">{contact.phone}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveContact(contact.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Remove contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 5. Discreet PIN */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Discreet Screen PIN (Calculator Unlock)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  4-digit PIN to safely cancel false SOS alarms and unlock secret mode
                </p>
              </div>
              <input
                type="password"
                maxLength={4}
                value={discreetPin}
                onChange={(e) => setDiscreetPin(e.target.value)}
                className="w-24 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-center font-mono text-sm tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </form>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="profile-settings-form"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
