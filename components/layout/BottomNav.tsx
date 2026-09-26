'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Home, MapPin, Navigation, FileText, ShieldAlert } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const { triggerSOS, activeJourney } = useApp();

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/map', label: 'Safety Map', icon: MapPin },
    { isSOS: true },
    { href: '/journey', label: 'Journey', icon: Navigation, isLive: !!activeJourney },
    { href: '/reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-3 py-1.5 flex items-center justify-around shadow-2xl">
      {navItems.map((item, idx) => {
        if (item.isSOS) {
          return (
            <div key="sos-mobile" className="relative -top-5 flex items-center justify-center">
              <span className="absolute -inset-1 rounded-full bg-rose-600/40 animate-ping pointer-events-none" />
              <button
                onClick={triggerSOS}
                aria-label="Trigger Emergency SOS"
                className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-600 text-white flex flex-col items-center justify-center shadow-xl shadow-rose-600/50 ring-4 ring-slate-950 active:scale-95 transition-all"
              >
                <ShieldAlert className="w-6 h-6 animate-pulse" />
                <span className="text-[9px] font-black tracking-widest leading-none mt-0.5">SOS</span>
              </button>
            </div>
          );
        }

        const Icon = item.icon!;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href!}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all duration-200 relative active:scale-95 ${
              isActive 
                ? 'text-white bg-slate-900/80 border border-slate-800/80 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
              {item.isLive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

