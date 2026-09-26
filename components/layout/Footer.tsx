'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, PhoneCall, Lock, Heart, CheckCircle2, Radio, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 transition-colors pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Emergency Hotlines Banner */}
        <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 hover:border-slate-700 shadow-xl mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-600/20">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>24/7 National Emergency Helplines</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h4>
                <p className="text-xs text-slate-400">Toll-free emergency dispatch lines accessible from any cellular network</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a 
                href="tel:112" 
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>112</span>
                <span className="text-rose-200 text-[10px] font-normal">(National Emergency)</span>
              </a>
              <a 
                href="tel:1091" 
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>1091</span>
                <span className="text-slate-400 text-[10px] font-normal">(Women Helpline)</span>
              </a>
              <a 
                href="tel:181" 
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>181</span>
                <span className="text-slate-400 text-[10px] font-normal">(Distress Support)</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4-Column Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
                <Shield className="w-4 h-4" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
              </div>
              <span className="font-heading font-black text-lg text-white tracking-tight">SafeCircle</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An elite, privacy-conscious women's safety ecosystem featuring spatial crime analytics, verified Safe Havens, and instant multi-channel SOS alerts.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium pt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Knowledge Client-Side Encryption</span>
            </div>
          </div>

          {/* Quick Core Features */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Core Safety Tools</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/map" className="text-slate-400 hover:text-white transition-colors">Interactive Live Safety Map</Link></li>
              <li><Link href="/journey" className="text-slate-400 hover:text-white transition-colors">Journey Guardian (Safe Transport)</Link></li>
              <li><Link href="/call-shield" className="text-slate-400 hover:text-white transition-colors">Call Shield & Scam Detector</Link></li>
              <li><Link href="/vault" className="text-slate-400 hover:text-white transition-colors">Encrypted Evidence Vault</Link></li>
              <li><Link href="/reports" className="text-slate-400 hover:text-white transition-colors">Anonymous Incident Reports</Link></li>
            </ul>
          </div>

          {/* Role Dashboards */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Role Portals</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">Woman / User Dashboard</Link></li>
              <li><Link href="/guardian" className="text-slate-400 hover:text-white transition-colors">Guardian Family Circle</Link></li>
              <li><Link href="/authority" className="text-slate-400 hover:text-white transition-colors">Police & Authority Command</Link></li>
              <li><Link href="/campus" className="text-slate-400 hover:text-white transition-colors">Campus & Hostel Safety Cell</Link></li>
              <li><Link href="/admin" className="text-slate-400 hover:text-white transition-colors">Super Admin & Moderation</Link></li>
            </ul>
          </div>

          {/* Privacy Commitments */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Privacy Commitments</h5>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>NO automatic police dispatch without explicit user consent.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Live location auto-expires when safe arrival is verified.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero advertising, tracking cookies, or data commercialization.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SafeCircle Platform. Built with security-first architecture for women's autonomy.</p>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="hover:text-slate-300 transition-colors">Privacy Settings</Link>
            <Link href="/analytics" className="hover:text-slate-300 transition-colors">AI Transparency</Link>
            <Link href="/safepoints" className="hover:text-slate-300 transition-colors">Safe Haven Directory</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

