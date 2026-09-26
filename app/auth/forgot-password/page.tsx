'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-lg shadow-primary/30">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="font-heading text-2xl font-black text-foreground">
          Reset Password
        </h1>
        <p className="text-xs text-muted-foreground">
          Enter your registered email address to receive an encrypted reset link.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-card border border-border shadow-xl">
        {isSubmitted ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-base text-foreground">Recovery Link Dispatched</h3>
            <p className="text-xs text-muted-foreground">
              If an account is associated with <strong>{email}</strong>, you will receive password reset instructions shortly.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-md"
            >
              Send Reset Link
            </button>

            <div className="text-center pt-2">
              <Link
                href="/auth/login"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
