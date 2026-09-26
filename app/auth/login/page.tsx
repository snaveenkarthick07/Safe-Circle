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
  Users, 
  Building2, 
  GraduationCap 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('priya.sharma@example.com');
  const [password, setPassword] = useState('••••••••');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, 'user');
    router.push('/dashboard');
  };

  const handleQuickRoleLogin = (role: UserRole, targetPath: string) => {
    switchRole(role);
    router.push(targetPath);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-pink-600/30">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="font-heading text-3xl font-black text-foreground">
          Welcome to SafeCircle
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Secure, privacy-conscious platform access. Choose your portal or login below.
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
            onClick={() => handleQuickRoleLogin('user', '/dashboard')}
            className="p-3 rounded-2xl bg-muted/50 hover:bg-pink-500/10 border border-border hover:border-pink-500/30 text-left transition-all group"
          >
            <div className="font-bold text-xs text-foreground group-hover:text-pink-600">👩 Woman / User</div>
            <div className="text-[10px] text-muted-foreground">Priya Sharma (Dashboard & SOS)</div>
          </button>

          <button
            onClick={() => handleQuickRoleLogin('guardian', '/guardian')}
            className="p-3 rounded-2xl bg-muted/50 hover:bg-purple-500/10 border border-border hover:border-purple-500/30 text-left transition-all group"
          >
            <div className="font-bold text-xs text-foreground group-hover:text-purple-600">🛡️ Guardian Circle</div>
            <div className="text-[10px] text-muted-foreground">Rajesh Sharma (Live Tracking)</div>
          </button>

          <button
            onClick={() => handleQuickRoleLogin('authority', '/authority')}
            className="p-3 rounded-2xl bg-muted/50 hover:bg-blue-500/10 border border-border hover:border-blue-500/30 text-left transition-all group"
          >
            <div className="font-bold text-xs text-foreground group-hover:text-blue-600">👮 Police / Authority</div>
            <div className="text-[10px] text-muted-foreground">Inspector Anita (Command Center)</div>
          </button>

          <button
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
        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-muted/60 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setAuthMode('password')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'password' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('otp')}
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
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30 hover:opacity-95 transition-all"
            >
              Sign In to Account
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono"
                />
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 582910"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono text-center tracking-widest"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (!otpSent) setOtpSent(true);
                else {
                  login(email, 'user');
                  router.push('/dashboard');
                }
              }}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30"
            >
              {otpSent ? 'Verify OTP & Continue' : 'Send One-Time Passcode'}
            </button>
          </div>
        )}

        {/* Google OAuth Mockup */}
        <div className="pt-4 border-t border-border">
          <button
            onClick={() => {
              login('google.user@example.com', 'user');
              router.push('/dashboard');
            }}
            className="w-full py-3 rounded-2xl bg-muted/60 hover:bg-muted border border-border text-foreground font-semibold text-xs flex items-center justify-center gap-2"
          >
            <span>Continue with Google</span>
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
