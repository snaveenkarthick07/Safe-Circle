'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole, EmergencyContactInput } from '@/types';
import { ProfilePhotoUpload } from '@/components/common/ProfilePhotoUpload';
import { calculatePasswordStrength } from '@/lib/userStore';
import { 
  Shield, 
  Lock, 
  Mail, 
  Phone, 
  User as UserIcon, 
  CheckCircle2, 
  AlertCircle,
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  RefreshCw,
  Sparkles,
  MapPin,
  Building2,
  Users
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signup } = useAuth();

  // Core Account States
  const [role, setRole] = useState<UserRole>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [campusOrg, setCampusOrg] = useState('');
  const [avatar, setAvatar] = useState('');

  // Password & Security States
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [discreetPin, setDiscreetPin] = useState('1234');

  // Emergency Contacts List
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactInput[]>([
    { id: 'init_1', name: '', phone: '', relation: 'Mom', priority: 1 }
  ]);

  // Consents & Terms
  const [consentTerms, setConsentTerms] = useState(true);
  const [consentAudioRecording, setConsentAudioRecording] = useState(true);
  const [consentLocationTracking, setConsentLocationTracking] = useState(true);
  const [consentPoliceDispatch, setConsentPoliceDispatch] = useState(false);

  // Form Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time password strength
  const pwdStrength = calculatePasswordStrength(password);

  const handleAddContactField = () => {
    setEmergencyContacts(prev => [
      ...prev,
      {
        id: `ec_${Date.now()}_${prev.length}`,
        name: '',
        phone: '',
        relation: 'Family',
        priority: (prev.length + 1) as 1 | 2 | 3,
      }
    ]);
  };

  const handleRemoveContactField = (id: string) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleContactChange = (id: string, field: 'name' | 'phone' | 'relation', val: string) => {
    setEmergencyContacts(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Validate required fields
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMessage('Please provide a valid phone number.');
      return;
    }

    // 2. Validate password
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    // 3. Filter valid emergency contacts
    const validContacts = emergencyContacts.filter(c => c.name.trim() && c.phone.trim());

    if (role === 'user' && validContacts.length === 0) {
      setErrorMessage('As a Primary User, please specify at least one emergency contact (Name + Phone) for instant SOS alerts.');
      return;
    }

    if (!consentTerms) {
      setErrorMessage('You must accept the SafeCircle privacy and safety commitments to create an account.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        password,
        avatar,
        city: city.trim() || 'Bengaluru',
        campusOrg: role === 'organization' ? campusOrg || 'Campus Safety Cell' : undefined,
        emergencyContacts: validContacts,
        consentPoliceDispatch,
        consentAudioRecording,
        consentLocationTracking,
        discreetPin,
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Registration failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Route based on role
      const targetPath =
        role === 'guardian' ? '/guardian' :
        role === 'authority' ? '/authority' :
        role === 'organization' ? '/campus' : '/dashboard';

      router.push(targetPath);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-pink-600/30">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Create SafeCircle Account
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Join the privacy-conscious personal safety network. Fast setup, encrypted vault, and real-time SOS protection.
        </p>
      </div>

      <div className="p-6 sm:p-10 rounded-3xl bg-card border border-border shadow-2xl space-y-8">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Role Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Select Account Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { r: 'user' as UserRole, label: '👩 Woman / User', desc: 'SOS, Safe Walk & Vault' },
                { r: 'guardian' as UserRole, label: '🛡️ Guardian', desc: 'Live Track & Assist' },
                { r: 'authority' as UserRole, label: '👮 Police / Govt', desc: 'Dispatch & Triage' },
                { r: 'organization' as UserRole, label: '🎓 Campus Admin', desc: 'Campus Safety Cell' },
              ].map(item => (
                <button
                  key={item.r}
                  type="button"
                  onClick={() => setRole(item.r)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    role === item.r
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <div className="font-bold text-xs">{item.label}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Profile Photo Upload */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border">
            <ProfilePhotoUpload
              value={avatar}
              onChange={(dataUrl) => setAvatar(dataUrl)}
              label="Profile Picture (Optional)"
              helperText="Upload your custom avatar for verified identity display"
            />
          </div>

          {/* 3. Personal Identity Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  City / Residential Zone
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {role === 'organization' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Campus / University Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="e.g. Christ University"
                      value={campusOrg}
                      onChange={(e) => setCampusOrg(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Discreet 4-Digit PIN
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="1234"
                      value={discreetPin}
                      onChange={(e) => setDiscreetPin(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Password & Strength Indicator */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>Account Password & Security</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">
                  Create Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Real-time Password Strength Meter */}
            {password.length > 0 && (
              <div className="space-y-2 pt-1 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Password Strength:</span>
                  <span
                    className={
                      pwdStrength.score >= 4
                        ? 'text-emerald-500 font-bold'
                        : pwdStrength.score >= 2
                        ? 'text-amber-500 font-bold'
                        : 'text-rose-500 font-bold'
                    }
                  >
                    {pwdStrength.label}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    style={{ width: `${pwdStrength.percent}%` }}
                    className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px] text-muted-foreground pt-1">
                  <span className={pwdStrength.hasMinLength ? 'text-emerald-500 font-bold' : ''}>
                    {pwdStrength.hasMinLength ? '✓' : '○'} 8+ chars
                  </span>
                  <span className={pwdStrength.hasUpper ? 'text-emerald-500 font-bold' : ''}>
                    {pwdStrength.hasUpper ? '✓' : '○'} Uppercase
                  </span>
                  <span className={pwdStrength.hasNumber ? 'text-emerald-500 font-bold' : ''}>
                    {pwdStrength.hasNumber ? '✓' : '○'} Number
                  </span>
                  <span className={pwdStrength.hasSpecial ? 'text-emerald-500 font-bold' : ''}>
                    {pwdStrength.hasSpecial ? '✓' : '○'} Special symbol
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 5. Emergency Contacts Section */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Primary Emergency Contacts (Guardian Circle)
                </label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  These verified guardians receive instant coordinates and audio feeds during SOS alarms
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddContactField}
                className="px-3 py-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {emergencyContacts.map((contact, idx) => (
                <div key={contact.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Name (e.g. Dad / Sister)"
                      value={contact.name}
                      onChange={(e) => handleContactChange(contact.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs text-foreground"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="Phone (+91 ...)"
                      value={contact.phone}
                      onChange={(e) => handleContactChange(contact.id, 'phone', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs font-mono text-foreground"
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      value={contact.relation || 'Family'}
                      onChange={(e) => handleContactChange(contact.id, 'relation', e.target.value)}
                      className="w-full px-2 py-2 rounded-xl border border-input bg-background text-xs text-foreground"
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
                  <div className="col-span-1 flex justify-center">
                    {emergencyContacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveContactField(contact.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Terms and Privacy Consent */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
              <input
                type="checkbox"
                required
                id="terms-check"
                checked={consentTerms}
                onChange={(e) => setConsentTerms(e.target.checked)}
                className="rounded text-primary focus:ring-primary w-4 h-4 mt-0.5 shrink-0"
              />
              <label htmlFor="terms-check" className="cursor-pointer">
                I agree to the SafeCircle zero third-party commercialization policy, strict user-controlled signal dispatch, and encrypted emergency communication protocol.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-pink-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating Verified Account & Encrypting Keys...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Create SafeCircle Account</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary font-bold hover:underline">
            Sign In to SafeCircle
          </Link>
        </p>
      </div>
    </div>
  );
}
