'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { IncidentReport, IncidentStatus } from '@/types';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  ChevronRight, 
  X, 
  MessageSquare 
} from 'lucide-react';

interface ComplaintTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialComplaintId?: string;
}

const STATUS_STEPS: { key: IncidentStatus; label: string; desc: string }[] = [
  { key: 'submitted', label: 'Submitted', desc: 'Report logged securely' },
  { key: 'received', label: 'Received', desc: 'Acknowledged by precinct' },
  { key: 'under_review', label: 'Under Review', desc: 'Officer assigned & assessing' },
  { key: 'action_taken', label: 'Action Taken', desc: 'Patrol dispatched / civic fix' },
  { key: 'closed', label: 'Closed', desc: 'Case resolved' },
];

export function ComplaintTrackerModal({ isOpen, onClose, initialComplaintId }: ComplaintTrackerModalProps) {
  const { reports } = useApp();
  const [searchQuery, setSearchQuery] = useState(initialComplaintId || '');
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(
    reports.find(r => r.complaintId === initialComplaintId) || reports[0] || null
  );

  if (!isOpen) return null;

  const handleSearch = () => {
    const found = reports.find(
      r => r.complaintId.toLowerCase() === searchQuery.trim().toLowerCase() ||
           r.id.toLowerCase() === searchQuery.trim().toLowerCase()
    );
    if (found) setSelectedReport(found);
  };

  const getStepIndex = (status: IncidentStatus) => {
    return STATUS_STEPS.findIndex(s => s.key === status);
  };

  const currentStepIdx = selectedReport ? getStepIndex(selectedReport.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl text-card-foreground my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Official Complaint Lifecycle Tracker</h3>
              <p className="text-xs text-muted-foreground">Track resolution status & police feedback in real time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 my-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Complaint ID (e.g. SC-8924K1)"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
          >
            Track
          </button>
        </div>

        {/* Quick Selection Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs font-semibold text-muted-foreground self-center">Recent Reports:</span>
          {reports.slice(0, 3).map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedReport?.id === r.id
                  ? 'bg-primary text-primary-foreground font-bold'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {r.complaintId}
            </button>
          ))}
        </div>

        {/* Detailed Progress Lifecycle */}
        {selectedReport ? (
          <div className="space-y-6">
            {/* Complaint Header Summary */}
            <div className="p-4 rounded-2xl bg-muted/60 border border-border">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-background border border-border text-foreground">
                  ID: {selectedReport.complaintId}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  selectedReport.status === 'action_taken' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                  selectedReport.status === 'closed' ? 'bg-slate-500/10 text-slate-400' :
                  'bg-blue-500/10 text-blue-600'
                }`}>
                  {selectedReport.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className="font-bold text-sm text-foreground">{selectedReport.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{selectedReport.locationName}</p>
            </div>

            {/* Horizontal Timeline Bar */}
            <div className="py-2">
              <div className="grid grid-cols-5 gap-1 text-center relative">
                {STATUS_STEPS.map((stepItem, index) => {
                  const isPassed = index <= currentStepIdx;
                  const isCurrent = index === currentStepIdx;

                  return (
                    <div key={stepItem.key} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-lg'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {isPassed && !isCurrent ? '✓' : index + 1}
                      </div>
                      <span className={`text-[11px] font-bold ${isCurrent ? 'text-primary' : isPassed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {stepItem.label}
                      </span>
                      <span className="text-[9px] text-muted-foreground hidden sm:block">
                        {stepItem.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Authority Feedback Box */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-card-foreground">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                <MessageSquare className="w-4 h-4" />
                <span>Official Authority Response & Action Log</span>
              </div>
              <p className="text-xs text-foreground font-medium mb-2">
                {selectedReport.officialFeedback || 'Investigation active. Local precinct has added this sector to the evening patrol itinerary.'}
              </p>
              {selectedReport.actionTakenNotes && (
                <div className="p-2.5 rounded-xl bg-background/80 border border-border text-xs text-muted-foreground font-mono">
                  Patrol Log: {selectedReport.actionTakenNotes}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-8">
            No complaint found with this ID. Please check the reference code.
          </p>
        )}
      </div>
    </div>
  );
}
