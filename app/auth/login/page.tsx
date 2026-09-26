'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { 
  Shield, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid email or password.');
        setIsSubmitting(false);
        return;
      }
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
      setIsSubmitting(false);
    }
  };

  const handleQuickRoleLogin = async (role: UserRole, targetPath: string) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await login('', undefined, role);
      switchRole(role);
      router.push(targetPath);
    } catch (err: any) {
      setErrorMessage(err.message || 'Quick login failed.');
      setIsSubmitting(false);
    }
  };

  const handleOtpLogin = async () => {
    setErrorMessage(null);
    if (!otpSent) {
      if (!phone.trim()) {
        setErrorMessage('Please enter your mobile phone number.');
        return;
      }
      setOtpSent(true);
      return;
    }

    if (!otp.trim() || otp.length < 4) {
      setErrorMessage('Please enter the 6-digit OTP code sent to your phone.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Authenticate via mobile number
      const result = await login(phone.trim());
      if (result.success) {
        router.push('/dashboard');
      } else {
        // If not found, log in with demo fallback
        await login('', undefined, 'user');
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to verify OTP.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-pink-600/30">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="font-heading text-3xl font-black text-foreground">
          Welcome to SafeCircle
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Secure, privacy-conscious platform access. Sign in to your verified safety profile.
        </p>
      </div>

      {/* 1-Click Role Logins for Demo / Testing */}
      <div className="p-5 rounded-3xl bg-card border border-border shadow-md space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick 1-Click Role Login (Demo Portals)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleQuickRoleLogin('user', '/dashboard')}
            className="p-3 rounded-2xl bg-muted/50 hover:bg-pink-500/10 border border-border hover:border-pink-500/30 text-left transition-all group"
          >
            <div className="font-bold text-xs text-foreground group-hover:text-pink-600">👩 Woman / User</div>
            <div className="text-[10px] text-muted-foreground">Member Portal (Dashboard & SOS)</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleLogin('guardian', '/guardian')}
            className="p-3 rounded-2xl bg-muted/50 hover:bg-purple-500/10 border border-border hover:border-purple-500/30 text-left transition-all group"
          >
            <div className="font-bold text-xs text-foreground group-hover:text-purple-600">🛡️ Guardian Circle</div>
            <div className="text-[10px] text-muted-foreground">Rajesh Sharma (Live Tracking)</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleLogin('authority', '/authority')}
            className="p-3 rounded-2xl bg-muted/50 hover:bg-blue-500/10 border border-border hover:border-blue-500/30 text-left transition-all group"
          >
            <div className="font-bold text-xs text-foreground group-hover:text-blue-600">👮 Police / Authority</div>
            <div className="text-[10px] text-muted-foreground">Inspector Anita (Command Center)</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleLogin('organization', '/campus')}
            className="p-3 rounded-2xl bg-muted/50 hover:bg-emerald-500/10 border border-border hover:border-emerald-500/30 text-left transition-all group"
          >
            <div className="font-bold text-xs text-foreground group-hover:text-emerald-600">🎓 Campus / College</div>
            <div className="text-[10px] text-muted-foreground">Christ University Safety Cell</div>
          </button>
        </div>
      </div>

      {/* Main Login Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-muted/60 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'password' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('otp');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'otp' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Mobile & OTP
          </button>
        </div>

        {authMode === 'password' ? (
          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-input bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to SafeCircle</span>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {otpSent && (
              <div className="animate-in fade-in">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="582910"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono text-center tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-[11px] text-muted-foreground mt-1 text-center">
                  Mock OTP: Enter any 6 digits (e.g. 123456)
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleOtpLogin}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>{otpSent ? 'Verify OTP & Continue' : 'Send One-Time Passcode'}</span>
              )}
            </button>
          </div>
        )}

        {/* Google OAuth Mockup */}
        <div className="pt-4 border-t border-border">
          <button
            type="button"
            onClick={async () => {
              setIsSubmitting(true);
              await login('', undefined, 'user');
              router.push('/dashboard');
            }}
            className="w-full py-3 rounded-2xl bg-muted/60 hover:bg-muted border border-border text-foreground font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue with Google / Apple ID</span>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-primary font-bold hover:underline">
            Register for SafeCircle
          </Link>
        </p>
      </div>
    </div>
  );
}
