'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Shield, Lock, Mail, Phone, User, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [consentTerms, setConsentTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    router.push('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-pink-600/30">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="font-heading text-3xl font-black text-foreground">
          Create SafeCircle Account
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Join the privacy-conscious women safety network.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: 'user', label: '👩 Woman / User' },
                { role: 'guardian', label: '🛡️ Family Guardian' },
                { role: 'authority', label: '👮 Police / Govt' },
                { role: 'organization', label: '🎓 Campus / College' },
              ].map(r => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setRole(r.role as UserRole)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    role === r.role
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/40 border-border text-muted-foreground'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Phone Number
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono"
              />
            </div>
          </div>

          {role === 'user' && (
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Primary Emergency Contact Number (Guardian)
              </label>
              <input
                type="text"
                required
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+91 98765 11223 (Dad / Mother / Friend)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono"
              />
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border flex items-start gap-2.5 text-xs text-muted-foreground">
            <input
              type="checkbox"
              required
              checked={consentTerms}
              onChange={(e) => setConsentTerms(e.target.checked)}
              className="rounded text-primary focus:ring-primary w-4 h-4 mt-0.5"
            />
            <span>
              I agree to the SafeCircle privacy commitments, zero third-party commercialization policy, and encrypted emergency assistance protocol.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30 hover:opacity-95"
          >
            Create Free Account
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
