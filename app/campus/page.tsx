'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockCampusAlerts } from '@/lib/mockData';
import { CampusSafetyAlert } from '@/types';
import { 
  GraduationCap, 
  ShieldCheck, 
  Users, 
  Footprints, 
  Bell, 
  Megaphone, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Send,
  Plus
} from 'lucide-react';

export default function CampusDashboard() {
  const { currentUser } = useAuth();
  const [alerts, setAlerts] = useState<CampusSafetyAlert[]>(mockCampusAlerts);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Safe Walk Dispatch Requests
  const [escortRequests, setEscortRequests] = useState([
    { id: 'sw_01', studentName: 'Ananya S (Roll #492)', location: 'Central Library to Gate 1 Hostel', requestedAt: '10 mins ago', status: 'Assigned (Guard Samuel)' },
    { id: 'sw_02', studentName: 'Pooja R (Roll #118)', location: 'Block IV Labs to Dairy Circle Bus Stop', requestedAt: '2 mins ago', status: 'Pending Escort' },
  ]);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: CampusSafetyAlert = {
      id: 'ca_' + Date.now(),
      title: broadcastTitle,
      type: 'alert',
      campusName: currentUser.campusOrg || 'Christ University',
      timestamp: 'Just now',
      message: broadcastMessage,
      active: true
    };
    setAlerts(prev => [newAlert, ...prev]);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  const handleAssignEscort = (id: string) => {
    setEscortRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Assigned (Guard Officer Manoj)' } : req));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            University & Campus Safety Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            {currentUser.campusOrg || 'Christ University'} Safety Cell
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Campus security coordination, late-night Safe Walk escorts, and student emergency alert broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Hostel Safety Grid Online
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-muted-foreground">Active Campus Havens</span>
          <div className="text-2xl font-black text-foreground">6 Security Posts</div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-purple-500">Safe Walk Escorts Dispatched</span>
          <div className="text-2xl font-black text-purple-500">28 Today</div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-emerald-500">Hostel Safety Check-Ins</span>
          <div className="text-2xl font-black text-emerald-500">98.6% Confirmed</div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-blue-500">Pink Police Sync</span>
          <div className="text-2xl font-black text-blue-500">Active at Gate 3</div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Safe Walk Dispatch Queue (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <Footprints className="w-5 h-5 text-purple-500" />
              <span>Safe Walk Escort Requests</span>
            </h2>
            <span className="text-xs font-bold text-primary">Live Desk</span>
          </div>

          <div className="space-y-3">
            {escortRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-3xl bg-card border border-border shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{req.studentName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    req.status.includes('Assigned')
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-600 animate-pulse'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{req.location}</span>
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                  <span className="text-muted-foreground font-medium">{req.requestedAt}</span>
                  {!req.status.includes('Assigned') && (
                    <button
                      onClick={() => handleAssignEscort(req.id)}
                      className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                    >
                      Assign Security Guard
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Emergency Announcement Broadcaster (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-pink-500" />
            <span>Campus Emergency Broadcast Tool</span>
          </h2>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-xl space-y-4">
            {broadcastSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Emergency Broadcast Dispatched to 4,200+ Students & Faculty!</span>
              </div>
            )}

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Broadcast Alert Headline
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Late Night Safe Walk Available from Central Library"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Full Advisory Message
                </label>
                <textarea
                  rows={3}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Provide essential safety instructions or escort meeting points..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 hover:opacity-95"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Alert to Campus Network</span>
              </button>
            </form>

            {/* Active Campus Alerts List */}
            <div className="pt-4 border-t border-border space-y-2">
              <span className="text-xs font-bold uppercase text-muted-foreground block">
                Active Campus Bulletins
              </span>
              {alerts.map((al) => (
                <div key={al.id} className="p-3 rounded-2xl bg-muted/40 border border-border text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>{al.title}</span>
                    <span className="text-[10px] text-muted-foreground">{al.timestamp}</span>
                  </div>
                  <p className="text-muted-foreground leading-tight">{al.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
