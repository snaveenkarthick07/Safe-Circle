'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  MapPin, 
  Phone, 
  Battery, 
  Radio, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Navigation,
  Share2
} from 'lucide-react';
import { SafetyMap } from '@/components/maps/SafetyMap';
import { UserAvatar } from '@/components/common/UserAvatar';

export default function GuardianDashboard() {
  const { currentUser } = useAuth();
  const { guardians, toggleGuardianLink, activeJourney, isSOSActive, isEmergencyTriggered, userLocation } = useApp();
  const [selectedContact, setSelectedContact] = useState(guardians[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Sister');
  const [newPhone, setNewPhone] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase mb-1">
            <Users className="w-3.5 h-3.5" />
            Guardian Family & Trusted Circle Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Guardian Monitoring Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor protected family members, receive instant SOS alerts, and verify safe trip arrivals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl bg-card border border-border shadow-xs">
            <UserAvatar user={currentUser} size="sm" showBadge />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-tight text-foreground">{currentUser.name}</div>
              <div className="text-[10px] text-muted-foreground capitalize">{currentUser.role}</div>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            <span>Link New Family Member</span>
          </button>
        </div>
      </div>

      {/* Emergency Distress Alert Banner (if SOS active) */}
      {(isSOSActive || isEmergencyTriggered) && (
        <div className="p-6 rounded-3xl bg-red-600 text-white shadow-2xl shadow-red-600/40 animate-bounce flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ShieldAlert className="w-10 h-10" />
            <div>
              <h3 className="text-xl font-black">
                🚨 EMERGENCY DISTRESS ALERT: {currentUser.name || 'Protected Ward'} Triggered SOS!
              </h3>
              <p className="text-xs text-red-100 mt-0.5">
                Location: {userLocation.address} ({userLocation.lat}, {userLocation.lng}) • Audio recording streaming
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${currentUser.phone || '+919876500000'}`}
              className="px-5 py-2.5 rounded-xl bg-white text-red-600 font-bold text-xs shadow-md"
            >
              Call {currentUser.name || 'Member'} ({currentUser.phone || '+91 98765 00000'})
            </a>
            <a
              href="tel:112"
              className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs"
            >
              Dial 112 Police Dispatch
            </a>
          </div>
        </div>
      )}

      {/* Main Content Layout: Protected User List & Live Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Linked Circle Cards (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">
            Linked Circle Members ({guardians.length + 1})
          </h2>

          <div className="space-y-3">
            {/* Primary Protected Member */}
            <div
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                selectedContact?.id === 'usr_main'
                  ? 'bg-primary/5 border-primary shadow-lg'
                  : 'bg-card border-border hover:bg-muted/40'
              }`}
              onClick={() => setSelectedContact(guardians[0])}
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <UserAvatar user={currentUser} size="lg" />
                  <div>
                    <h3 className="font-bold text-base text-foreground">{currentUser.name || 'Protected Member'}</h3>
                    <span className="text-xs text-muted-foreground">Primary Protected User • Linked Circle</span>
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Safe
                </span>
              </div>

              <div className="pt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Current GPS Location:</span>
                  <span className="font-semibold text-foreground truncate max-w-[180px]">{userLocation.address}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Phone Battery:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-500" /> 88% (Charging)
                  </span>
                </div>
                {activeJourney && (
                  <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 font-semibold text-[11px]">
                    🚕 Live Trip Active: {activeJourney.startLocation} → {activeJourney.destination} (ETA {activeJourney.expectedArrivalTime})
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs">
                <a
                  href="tel:+919876543210"
                  className="text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" /> Call +91 98765 43210
                </a>
                <span className="text-[11px] text-muted-foreground">Last Ping: Just now</span>
              </div>
            </div>

            {/* Other Guardians in Circle */}
            {guardians.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-3 shadow-sm hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted font-bold flex items-center justify-center text-xs">
                    {g.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{g.name}</span>
                      <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-semibold">
                        {g.relation}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{g.phone}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleGuardianLink(g.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    g.isLinked
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {g.isLinked ? '✓ Linked' : '+ Link'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Map Tracking (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-foreground">
              Live SafeCircle Location Radar
            </h2>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
              <Radio className="w-3 h-3 text-emerald-500 animate-ping" />
              Real-time GPS Stream
            </span>
          </div>

          <SafetyMap heightClass="h-[480px] sm:h-[580px]" />
        </div>
      </div>
    </div>
  );
}
