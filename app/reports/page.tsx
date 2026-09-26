'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { IncidentCategory, IncidentReport } from '@/types';
import { 
  FileText, 
  Search, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  ThumbsUp, 
  MessageSquare, 
  MapPin, 
  Clock, 
  EyeOff, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';
import { ReportIncidentModal } from '@/components/incidents/ReportIncidentModal';
import { ComplaintTrackerModal } from '@/components/incidents/ComplaintTrackerModal';

export default function ReportsPage() {
  const { reports } = useApp();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [trackerComplaintId, setTrackerComplaintId] = useState<string | null>(null);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter(r => {
    const matchesCat = selectedCatFilter === 'all' || r.category === selectedCatFilter;
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.complaintId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenTracker = (complaintId: string) => {
    setTrackerComplaintId(complaintId);
    setIsTrackerModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Main Action CTAs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase mb-1">
            <FileText className="w-3.5 h-3.5" />
            Community Incident & Concern Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Incident Reports & Case Tracker
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Report safety hazards anonymously, monitor official police actions, and verify community alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsTrackerModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-card border border-border hover:bg-muted text-xs font-bold text-foreground shadow-sm flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-blue-500" />
            <span>Track by Complaint ID</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-primary hover:opacity-90 text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 flex items-center gap-2 transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Report a Safety Concern</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Reports' },
            { id: 'harassment', label: '🗣️ Harassment' },
            { id: 'stalking', label: '👁️ Stalking' },
            { id: 'unsafe_transport', label: '🚕 Transport' },
            { id: 'poor_lighting', label: '💡 Lighting' },
            { id: 'suspicious_activity', label: '⚠️ Suspicious' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedCatFilter(item.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCatFilter === item.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, location, title..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Reports List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((rep) => (
          <div
            key={rep.id}
            className="p-6 rounded-3xl bg-card border border-border shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header Badge Row */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenTracker(rep.complaintId)}
                  className="px-2.5 py-1 rounded-lg bg-muted border border-border text-xs font-mono font-bold text-foreground hover:border-primary transition-colors"
                  title="Click to track lifecycle"
                >
                  ID: {rep.complaintId}
                </button>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    rep.status === 'action_taken' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                    rep.status === 'closed' ? 'bg-slate-500/10 text-slate-400' :
                    rep.status === 'under_review' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                    'bg-blue-500/10 text-blue-600'
                  }`}>
                    {rep.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-bold text-base text-foreground leading-snug">
                  {rep.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed">
                  {rep.description}
                </p>
              </div>

              {/* Location & Time */}
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{rep.locationName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>🕒 Time: {rep.timeOfDay.toUpperCase()}</span>
                  {rep.isAnonymous && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <EyeOff className="w-3 h-3" /> Anonymous
                    </span>
                  )}
                </div>
              </div>

              {/* Authority Feedback Banner */}
              {rep.officialFeedback && (
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-card-foreground">
                  <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 uppercase text-[10px] mb-0.5">
                    <MessageSquare className="w-3 h-3" />
                    <span>Official Police Feedback</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-tight">
                    {rep.officialFeedback}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <button
                onClick={() => handleOpenTracker(rep.complaintId)}
                className="text-primary font-bold hover:underline flex items-center gap-1"
              >
                <span>View Full Timeline & Actions</span>
              </button>

              <div className="flex items-center gap-1 text-muted-foreground font-semibold">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{rep.upvotes || 0} community upvotes</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <ComplaintTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => {
          setIsTrackerModalOpen(false);
          setTrackerComplaintId(null);
        }}
        initialComplaintId={trackerComplaintId || undefined}
      />
    </div>
  );
}
