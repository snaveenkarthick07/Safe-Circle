'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  Radio, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Send, 
  Clock, 
  Flame, 
  Wrench,
  Car
} from 'lucide-react';
import { IncidentReport, IncidentStatus } from '@/types';

export default function AuthorityDashboard() {
  const { reports, updateReportStatus } = useApp();
  const { currentUser } = useAuth();
  const [selectedRep, setSelectedRep] = useState<IncidentReport | null>(reports[0] || null);
  const [feedbackText, setFeedbackText] = useState('');
  const [patrolTicketText, setPatrolTicketText] = useState('');
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

  const handleUpdateStatus = (status: IncidentStatus) => {
    if (!selectedRep) return;
    updateReportStatus(selectedRep.id, status, feedbackText || undefined);
    setStatusSuccess(`Report ${selectedRep.complaintId} marked as ${status.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setStatusSuccess(null), 3000);
  };

  const handleDispatchPatrol = () => {
    if (!selectedRep) return;
    const patrolLog = `Pink Patrol unit #BLR-PK-${Math.floor(100 + Math.random() * 900)} deployed to ${selectedRep.locationName}. Active surveillance active.`;
    updateReportStatus(selectedRep.id, 'action_taken', patrolLog);
    setStatusSuccess(`Patrol Dispatched for ${selectedRep.complaintId}`);
    setTimeout(() => setStatusSuccess(null), 3000);
  };

  const handleLogCivicTicket = () => {
    if (!selectedRep) return;
    const civicLog = `Civic maintenance repair ticket #BBMP-LT-${Math.floor(1000 + Math.random() * 9000)} escalated for streetlight overhaul.`;
    updateReportStatus(selectedRep.id, 'action_taken', civicLog);
    setStatusSuccess(`Civic Infrastructure Ticket Logged!`);
    setTimeout(() => setStatusSuccess(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Law Enforcement & Incident Command Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Police Authority Command Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Logged in as {currentUser.name} ({currentUser.city}) • Triage cases, dispatch pink patrol beats, and log civic infrastructure repairs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Precinct Dispatch Online
          </span>
        </div>
      </div>

      {/* Status Success Alert */}
      {statusSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusSuccess}</span>
        </div>
      )}

      {/* KPI Triage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-muted-foreground">Total Logged Cases</span>
          <div className="text-2xl font-black text-foreground">{reports.length} Cases</div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-amber-500">Under Review</span>
          <div className="text-2xl font-black text-amber-500">
            {reports.filter(r => r.status === 'under_review' || r.status === 'submitted' || r.status === 'received').length} Open
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-emerald-500">Action Taken / Patrol Logged</span>
          <div className="text-2xl font-black text-emerald-500">
            {reports.filter(r => r.status === 'action_taken').length} Active
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-blue-500">Closed & Verified</span>
          <div className="text-2xl font-black text-blue-500">
            {reports.filter(r => r.status === 'closed').length} Resolved
          </div>
        </div>
      </div>

      {/* 2-Column Incident Command Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Incident Triage Queue (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">
            Incident Triage & Case Queue
          </h2>

          <div className="space-y-3">
            {reports.map((rep) => {
              const isSelected = selectedRep?.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => {
                    setSelectedRep(rep);
                    setFeedbackText(rep.officialFeedback || '');
                  }}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-500/5 border-blue-500 shadow-md'
                      : 'bg-card border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-primary">
                      {rep.complaintId}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      rep.status === 'action_taken' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                      rep.status === 'closed' ? 'bg-slate-500/10 text-slate-400' :
                      'bg-amber-500/10 text-amber-600'
                    }`}>
                      {rep.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground">{rep.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{rep.description}</p>

                  <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span className="truncate max-w-[200px]">{rep.locationName}</span>
                    </span>
                    <span className="font-semibold text-red-500 uppercase text-[10px]">
                      Severity: {rep.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Case Actions & Logger (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">
            Official Case Action & Dispatch Logger
          </h2>

          {selectedRep ? (
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xl space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-muted px-2.5 py-1 rounded-md text-foreground">
                    Case #{selectedRep.complaintId}
                  </span>
                  <span className="text-xs text-muted-foreground">{selectedRep.timestamp}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mt-2">{selectedRep.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{selectedRep.description}</p>
              </div>

              {/* Location & Reporter Privacy */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Tagged GPS:</span>
                  <span className="font-mono text-foreground">{selectedRep.lat}, {selectedRep.lng}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Location:</span>
                  <span className="font-semibold text-foreground">{selectedRep.locationName}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Reporter Privacy:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {selectedRep.isAnonymous ? '✓ Anonymous Identity Protected' : 'Registered User'}
                  </span>
                </div>
              </div>

              {/* Instant Dispatch / Preventive Actions */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-muted-foreground">
                  Instant Authority Dispatch Actions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDispatchPatrol}
                    className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102"
                  >
                    <Car className="w-4 h-4" />
                    <span>Deploy Pink Patrol Unit</span>
                  </button>

                  <button
                    onClick={handleLogCivicTicket}
                    className="p-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Log Civic Streetlight Fix</span>
                  </button>
                </div>
              </div>

              {/* Official Feedback Note Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-muted-foreground">
                  Official Feedback to Complainant
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Enter official resolution feedback notes visible on public complaint tracker..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Lifecycle Status Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => handleUpdateStatus('under_review')}
                  className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold border border-border"
                >
                  Mark Under Review
                </button>
                <button
                  onClick={() => handleUpdateStatus('action_taken')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Confirm Action Taken
                </button>
                <button
                  onClick={() => handleUpdateStatus('closed')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700"
                >
                  Close Case Resolved
                </button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Select an incident from the queue to take action.</p>
          )}
        </div>
      </div>
    </div>
  );
}
