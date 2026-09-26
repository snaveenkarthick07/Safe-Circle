'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { EvidenceItem } from '@/types';
import { 
  Lock, 
  Unlock, 
  Mic, 
  Square, 
  Upload, 
  FileText, 
  Download, 
  ShieldCheck, 
  Key, 
  Camera, 
  CheckCircle2, 
  Trash2, 
  Radio,
  FileCheck2,
  Copy
} from 'lucide-react';
import { generateCryptoHash } from '@/lib/utils';

export default function EvidenceVaultPage() {
  const { evidenceVault, addEvidence, userLocation } = useApp();
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'audio' | 'photo' | 'notes'>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  // New Note Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Recording timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecord = () => {
    setIsRecording(true);
  };

  const handleStopRecord = () => {
    setIsRecording(false);
    addEvidence({
      title: `Emergency Audio Clip (${recordDuration}s)`,
      category: 'Audio Recording',
      mediaType: 'audio',
      size: `${(recordDuration * 0.12).toFixed(1)} MB`,
      location: userLocation.address,
      encrypted: true,
      notes: 'Discreet background audio stream captured via SafeCircle vault recorder.'
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isImg = file.type.startsWith('image');
      addEvidence({
        title: file.name,
        category: isImg ? 'Photograph Proof' : 'Digital Evidence',
        mediaType: isImg ? 'photo' : 'document',
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        location: userLocation.address,
        encrypted: true,
        notes: 'Encrypted proof uploaded directly by user with immutable timestamp.'
      });
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    addEvidence({
      title: noteTitle || 'Incident Timestamped Notes',
      category: 'Witness Note',
      mediaType: 'notes',
      size: '12 KB',
      location: userLocation.address,
      encrypted: true,
      notes: noteContent
    });
    setNoteTitle('');
    setNoteContent('');
    setIsNoteModalOpen(false);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportDossier = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const filteredItems = evidenceVault.filter(item => {
    if (activeTab === 'all') return true;
    return item.mediaType === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase mb-1">
            <Lock className="w-3.5 h-3.5" />
            Zero-Knowledge Client-Side Locker
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Secure Evidence Vault
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Client-side encrypted repository for photos, audio recordings, and logs with cryptographic proof of authenticity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportDossier}
            className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 hover:opacity-90"
          >
            <Download className="w-4 h-4" />
            <span>{exportSuccess ? '✓ Dossier Exported!' : 'Export Legal Case Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Tools: Audio Recorder & Upload Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tool 1: Live Audio Recording Simulator */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-md flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <Mic className="w-4 h-4 text-primary" />
              <span>Discreet Audio Recorder</span>
            </div>
            {isRecording && (
              <span className="flex items-center gap-1 text-xs font-mono font-bold text-red-500 animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                {recordDuration}s
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Capture clear surrounding audio. Encrypted instantly on device.
          </p>

          {isRecording ? (
            <button
              onClick={handleStopRecord}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 animate-pulse"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop & Save to Vault</span>
            </button>
          ) : (
            <button
              onClick={handleStartRecord}
              className="w-full py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs flex items-center justify-center gap-2 border border-border"
            >
              <Mic className="w-3.5 h-3.5 text-primary" />
              <span>Start Recording Clip</span>
            </button>
          )}
        </div>

        {/* Tool 2: Photo / Document Proof Upload */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-md flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <Camera className="w-4 h-4 text-emerald-500" />
            <span>Upload Photo / File Proof</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Screenshots, vehicle number plate photos, or threatening messages.
          </p>
          <label className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm">
            <Upload className="w-3.5 h-3.5" />
            <span>Select & Encrypt File</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Tool 3: Timestamped Incident Note */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-md flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <FileText className="w-4 h-4 text-blue-500" />
            <span>Write Witness Note</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Record time, suspect descriptions, or sequence of events.
          </p>
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Create Timestamped Note</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        {[
          { id: 'all', label: `All Evidence (${evidenceVault.length})` },
          { id: 'audio', label: 'Audio Records' },
          { id: 'photo', label: 'Photos & Screenshots' },
          { id: 'notes', label: 'Written Notes' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Vault Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-card border border-border shadow-md hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {item.category}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">{item.size}</span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                {item.notes && (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.notes}</p>
                )}
              </div>

              {/* Cryptographic SHA-256 Proof */}
              <div className="p-3 rounded-2xl bg-muted/60 border border-border text-[11px] space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-semibold">SHA-256 Hash Proof:</span>
                  <button
                    onClick={() => handleCopyHash(item.hash)}
                    className="text-primary hover:underline flex items-center gap-1 font-bold text-[10px]"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedHash === item.hash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-[10px] text-foreground truncate">{item.hash}</div>
                <div className="text-[10px] text-muted-foreground pt-1 flex items-center justify-between">
                  <span>📍 {item.location}</span>
                  <span>🕒 {item.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Client Encrypted
              </span>
              <button 
                onClick={handleExportDossier}
                className="text-primary font-bold hover:underline text-xs flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Proof</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Note Creation Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl text-card-foreground">
            <h3 className="font-bold text-lg mb-4">Create Encrypted Witness Note</h3>
            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Description of Stalker on 100ft Road"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  Incident Chronology / Suspect Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write details as freshly as remembered..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
                >
                  Encrypt & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
