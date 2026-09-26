'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Building2, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Activity, 
  Clock, 
  Filter 
} from 'lucide-react';

export default function AdminDashboard() {
  const { safePoints, reports } = useApp();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'safepoints' | 'moderation' | 'audit'>('safepoints');

  // Local state for pending verification
  const [pendingSafePoints, setPendingSafePoints] = useState([
    {
      id: 'sp_app_01',
      name: 'Green Leaf 24/7 Supermarket & Pharmacy',
      category: '24/7 Store & Haven',
      address: '80 Feet Road, Koramangala 4th Block',
      phone: '+91 80 2553 9988',
      facilities: ['CCTV Monitored', 'Security Guard', 'First Aid Staff'],
      submittedAt: 'Today, 2:15 PM',
      status: 'pending'
    },
    {
      id: 'sp_app_02',
      name: 'Suraksha Pink Community Shelter & Legal Desk',
      category: 'Women Shelter',
      address: 'Old Airport Road, Kodihalli',
      phone: '181 / +91 80 2520 1144',
      facilities: ['CCTV Monitored', 'Female Staff Only', 'Legal Aid Counselor', 'Confidential Entry'],
      submittedAt: 'Yesterday, 6:40 PM',
      status: 'pending'
    }
  ]);

  const [auditLogs] = useState([
    { id: 'log_01', action: 'Emergency SOS Broadcast Dispatched', user: 'Priya Sharma (usr_001)', time: 'Today 18:30:12', ip: '103.21.244.12', status: 'SUCCESS' },
    { id: 'log_02', action: 'Evidence Locker SHA-256 Dossier Exported', user: 'Priya Sharma (usr_001)', time: 'Today 17:45:00', ip: '103.21.244.12', status: 'SUCCESS' },
    { id: 'log_03', action: 'Patrol Unit Dispatch Logged (#BLR-PK-442)', user: 'Inspector Anita Desai (aut_001)', time: 'Today 16:10:22', ip: '49.207.210.98', status: 'SUCCESS' },
    { id: 'log_04', action: 'Safe Haven Application Submitted', user: 'MedPlus Manager (sp_04)', time: 'Today 14:02:11', ip: '122.179.88.5', status: 'SUCCESS' }
  ]);

  const handleVerify = (id: string, approve: boolean) => {
    setPendingSafePoints(prev => prev.filter(sp => sp.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Global Platform Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Super Admin & Verification Panel
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Logged in as {currentUser.name} • Safe haven verification queue, incident report content moderation, and audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            System Integrity 100%
          </span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-3 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('safepoints')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'safepoints'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Safe Point Verification ({pendingSafePoints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'moderation'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Incident Moderation ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Security Audit Logs</span>
        </button>
      </div>

      {/* TAB 1: Safe Point Verification Queue */}
      {activeTab === 'safepoints' && (
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">
            Pending Business & Sanctuary Verification Applications
          </h2>

          {pendingSafePoints.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-card border border-border">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-base text-foreground">All Applications Verified</h3>
              <p className="text-xs text-muted-foreground">The verification queue is currently clear.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingSafePoints.map((sp) => (
                <div
                  key={sp.id}
                  className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        {sp.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{sp.submittedAt}</span>
                    </div>

                    <h3 className="font-bold text-base text-foreground">{sp.name}</h3>
                    <p className="text-xs text-muted-foreground">{sp.address}</p>
                    <p className="text-xs font-mono text-foreground font-semibold">📞 {sp.phone}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sp.facilities.map((f, i) => (
                        <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-medium">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleVerify(sp.id, false)}
                      className="py-2.5 rounded-xl bg-muted hover:bg-red-500/10 hover:text-red-500 text-xs font-bold flex items-center justify-center gap-1.5 border border-border transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>

                    <button
                      onClick={() => handleVerify(sp.id, true)}
                      className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-102"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Verify</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Incident Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">
            Community Reports Content Moderation
          </h2>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{rep.complaintId}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-muted text-foreground">
                      {rep.category}
                    </span>
                    <span className="text-xs text-muted-foreground">• {rep.locationName}</span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{rep.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{rep.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                    ✓ Verified Legit
                  </button>
                  <button className="px-3 py-1.5 rounded-xl bg-muted text-muted-foreground hover:text-red-500 text-xs font-bold">
                    Flag Spam
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">
            Cryptographic Security & System Audit Logs
          </h2>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-xl space-y-3">
            <div className="divide-y divide-border/60">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-foreground block">{log.action}</span>
                    <span className="text-[11px] text-muted-foreground">User: {log.user} • IP: {log.ip}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-muted-foreground">{log.time}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[10px]">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
