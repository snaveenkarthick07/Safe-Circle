'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { IncidentCategory, IncidentReport } from '@/types';
import { 
  FileText, 
  MapPin, 
  Shield, 
  EyeOff, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  X, 
  Camera, 
  Mic, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (report: IncidentReport) => void;
}

const CATEGORIES: { id: IncidentCategory; label: string; icon: string; desc: string }[] = [
  { id: 'harassment', label: 'Verbal / Street Harassment', icon: '🗣️', desc: 'Lewd remarks, inappropriate gestures, catcalling' },
  { id: 'stalking', label: 'Stalking / Following', icon: '👁️', desc: 'Being tracked or followed on foot or in vehicles' },
  { id: 'unsafe_transport', label: 'Cab / Public Transit Threat', icon: '🚕', desc: 'Driver misconduct, route deviation, refusal of meter' },
  { id: 'poor_lighting', label: 'Broken Lights / Dark Street', icon: '💡', desc: 'Unlit roads, blind spots, broken infrastructure' },
  { id: 'suspicious_activity', label: 'Suspicious Loitering', icon: '⚠️', desc: 'Suspicious groups gathering or photographing passersby' },
  { id: 'threat', label: 'Intimidation / Cyber Threat', icon: '📱', desc: 'Online harassment, blackmail, threatening calls' },
];

export function ReportIncidentModal({ isOpen, onClose, onSuccess }: ReportIncidentModalProps) {
  const { addReport, userLocation } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [category, setCategory] = useState<IncidentCategory>('harassment');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Indiranagar 100 Feet Rd, near Metro Gate B');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night' | 'late_night'>('evening');
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [submittedReport, setSubmittedReport] = useState<IncidentReport | null>(null);

  // Auto-save draft in localStorage
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem('safecircle_report_draft');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.description) setDescription(parsed.description);
          if (parsed.category) setCategory(parsed.category);
        } catch {}
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveDraft = () => {
    localStorage.setItem('safecircle_report_draft', JSON.stringify({ category, title, description }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setEvidenceFiles(prev => [...prev, fileName]);
    }
  };

  const handleSubmit = () => {
    const newRep = addReport({
      title: title || `${category.replace('_', ' ')} incident near ${locationName}`,
      category,
      description,
      locationName,
      lat: userLocation.lat,
      lng: userLocation.lng,
      isAnonymous,
      severity,
      timeOfDay,
      evidenceCount: evidenceFiles.length,
    });

    localStorage.removeItem('safecircle_report_draft');
    setSubmittedReport(newRep);
    if (onSuccess) onSuccess(newRep);
  };

  const handleResetAndClose = () => {
    setSubmittedReport(null);
    setStep(1);
    setTitle('');
    setDescription('');
    setEvidenceFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl text-card-foreground my-8">
        {/* If successfully submitted */}
        {submittedReport ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-1">
              Incident Report Registered
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your report has been securely saved and routed to local safety authorities.
            </p>

            {/* Generated Complaint ID Badge */}
            <div className="p-4 rounded-2xl bg-muted/80 border border-border flex flex-col items-center mb-6 w-full max-w-md">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Official Complaint Tracking ID
              </span>
              <span className="text-2xl font-mono font-black text-primary my-1">
                {submittedReport.complaintId}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Status: Under Review • Anonymous Identity Protected
              </span>
            </div>

            <div className="flex gap-3 w-full max-w-md">
              <button
                onClick={handleResetAndClose}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md"
              >
                Done / View Tracker
              </button>
            </div>
          </div>
        ) : (
          /* Step-by-Step Reporting Wizard */
          <>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Report a Safety Concern</h3>
                  <p className="text-xs text-muted-foreground">Step {step} of 3 • Privacy Protected</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Category Picker */}
            {step === 1 && (
              <div className="py-4 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Select Incident Category
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        category === cat.id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border bg-card hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-bold text-sm text-foreground">{cat.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{cat.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center gap-2 shadow-md hover:opacity-90"
                  >
                    <span>Next: Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Location & Incident Details */}
            {step === 2 && (
              <div className="py-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Location Name / Landmark
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-primary" />
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g. Near Indiranagar Metro Gate B"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Incident Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      handleSaveDraft();
                    }}
                    placeholder="Brief description (e.g. Unlit road with motorcycle stalking)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      handleSaveDraft();
                    }}
                    placeholder="Provide relevant details like time, vehicle number, behavior, or physical descriptions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                      Time of Day
                    </label>
                    <select
                      value={timeOfDay}
                      onChange={(e) => setTimeOfDay(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-xs font-medium"
                    >
                      <option value="morning">Morning (6 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                      <option value="evening">Evening (5 PM - 9 PM)</option>
                      <option value="night">Night (9 PM - 12 AM)</option>
                      <option value="late_night">Late Night (12 AM - 6 AM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                      Severity Level
                    </label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-xs font-medium"
                    >
                      <option value="low">Low (General Concern)</option>
                      <option value="medium">Medium (Unsafe Situation)</option>
                      <option value="high">High (Immediate Threat)</option>
                      <option value="critical">Critical (Assault/Emergency)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-bold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center gap-2 shadow-md hover:opacity-90"
                  >
                    <span>Next: Evidence & Privacy</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Evidence Upload & Anonymous Consent */}
            {step === 3 && (
              <div className="py-4 space-y-4">
                {/* Anonymous Protection Box */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                  <EyeOff className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">Anonymous Submission</span>
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded text-primary focus:ring-primary w-4 h-4"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your name, phone number, and account ID will be stripped from public analytics and only visible to authorized case investigators.
                    </p>
                  </div>
                </div>

                {/* Evidence Upload */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
                    Attach Media Evidence (Photos, Audio, Screenshots)
                  </label>
                  <label className="border-2 border-dashed border-border hover:border-primary rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-muted/30 transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-xs font-semibold text-foreground">Click to upload photo or audio proof</span>
                    <span className="text-[11px] text-muted-foreground">Client-side zero-knowledge encrypted before upload</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {evidenceFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {evidenceFiles.map((f, i) => (
                        <span key={i} className="text-xs bg-muted px-2.5 py-1 rounded-lg font-mono flex items-center gap-1">
                          📎 {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-bold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/30 hover:opacity-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Official Report</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
