'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  ShieldX, 
  AlertTriangle, 
  PhoneCall, 
  PhoneOff, 
  PhoneForwarded,
  Search, 
  Filter, 
  Radio, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  ThumbsUp, 
  PlusCircle, 
  Sparkles, 
  Mic, 
  Zap, 
  Info,
  Server,
  Layers,
  Volume2,
  Trash2,
  Check,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { 
  analyzeIncomingNumber, 
  SCAM_KEYWORDS, 
  INITIAL_SCAM_REPORTS 
} from '@/lib/scamShieldEngine';
import { ScamCategory, CallShieldAnalysis, ScamCallReport } from '@/types';

const CATEGORY_LABELS: Record<ScamCategory, { label: string; color: string; bg: string }> = {
  financial_fraud: { label: 'Financial Fraud', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
  police_impersonation: { label: 'Police Impersonation', color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
  otp_theft: { label: 'OTP Theft', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
  harassment: { label: 'Harassment', color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
  job_scam: { label: 'Job Scam', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
  phishing: { label: 'Cyber Phishing', color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
};

const SAMPLE_NUMBERS = [
  { num: '+91 91234 56789', label: 'SBI Bank Phishing', tag: 'High Threat' },
  { num: '+91 94808 99112', label: 'Fake Police Arrest Extortion', tag: 'Critical' },
  { num: '+91 98888 12345', label: 'Telegram Job Fraud', tag: 'Suspicious' },
  { num: '+91 97777 54321', label: 'FedEx Customs Parcel', tag: 'Critical' },
  { num: '112', label: 'National ERSS Emergency', tag: 'Safe Verified' },
  { num: '+91 98765 11223', label: 'Guardian Contact (Dad)', tag: 'Safe' },
];

export default function CallShieldPage() {
  const { 
    scamReports, 
    blockedNumbers, 
    blockNumber, 
    unblockNumber, 
    reportScamNumber, 
    upvoteScamReport,
    triggerScamAlert,
    openFakeCallSettings
  } = useApp();

  // Scanner state
  const [phoneNumberInput, setPhoneNumberInput] = useState('+91 91234 56789');
  const [simulatedSpeechInput, setSimulatedSpeechInput] = useState('Your bank account is suspended. Send the 6 digit OTP immediately.');
  const [currentAnalysis, setCurrentAnalysis] = useState<CallShieldAnalysis>(() => 
    analyzeIncomingNumber('+91 91234 56789', 'Your bank account is suspended. Send the 6 digit OTP immediately.')
  );

  // Active view tab
  const [activeTab, setActiveTab] = useState<'scanner' | 'community' | 'blocked'>('scanner');

  // Filter state for community reports
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // New report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newReportNum, setNewReportNum] = useState('');
  const [newReportName, setNewReportName] = useState('');
  const [newReportCategory, setNewReportCategory] = useState<ScamCategory>('financial_fraud');
  const [newReportLocation, setNewReportLocation] = useState('Bengaluru');
  const [newReportNotes, setNewReportNotes] = useState('');
  const [newReportKeywords, setNewReportKeywords] = useState('OTP, Verification, Bank');
  const [reportSuccessMessage, setReportSuccessMessage] = useState(false);

  // Handle Scan action
  const handleScan = (num = phoneNumberInput, speech = simulatedSpeechInput) => {
    if (!num.trim()) return;
    const result = analyzeIncomingNumber(num, speech);
    setCurrentAnalysis(result);
  };

  // Filtered Community Feed
  const filteredReports = useMemo(() => {
    return scamReports.filter((report) => {
      const matchesSearch = 
        report.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.callerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [scamReports, searchQuery, selectedCategory]);

  // Handle report submission
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportNum.trim() || !newReportNotes.trim()) return;

    reportScamNumber({
      phoneNumber: newReportNum.trim(),
      callerName: newReportName.trim() || 'Unknown Scam Caller',
      category: newReportCategory,
      riskLevel: 'critical',
      trustScore: 10,
      flagCount: 1,
      carrier: 'Suspected Spoofed VoIP Network',
      location: newReportLocation || 'City Region',
      notes: newReportNotes.trim(),
      sampleKeywords: newReportKeywords.split(',').map(s => s.trim()).filter(Boolean),
      isSpoofedVoip: true,
    });

    setReportSuccessMessage(true);
    setTimeout(() => {
      setReportSuccessMessage(false);
      setIsReportModalOpen(false);
      setNewReportNum('');
      setNewReportName('');
      setNewReportNotes('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & Functional Differentiation Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-red-600/10 via-rose-600/10 to-indigo-600/10 border border-red-500/20 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                AI Scam & Spoofing Shield v2.4
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                • 1,240+ Known Spoof Signatures Monitored
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight">
              Scam & Hacker Call Shield
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
              Real-time cyber defense against illegal caller ID spoofing, bank OTP phishing, fake police extortion, and fraudulent VoIP calls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/25 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Scam Number</span>
            </button>
            <button
              onClick={() => triggerScamAlert(currentAnalysis)}
              className="px-4 py-2.5 rounded-2xl bg-card border border-red-500/40 hover:bg-red-500/10 text-xs font-bold text-red-400 flex items-center gap-2 shadow-sm transition-all"
            >
              <Zap className="w-4 h-4 text-red-500 animate-bounce" />
              <span>Simulate Live Scam Call</span>
            </button>
          </div>
        </div>

        {/* Feature Clarification Callout: Scam Shield vs Fake Call */}
        <div className="mt-6 pt-6 border-t border-border/60 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-red-500 tracking-wide">
                  Active Feature: Scam Call Shield
                </span>
                <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-1.5 py-0.2 rounded">
                  DEFENSE
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Analyzes external incoming phone numbers using AI multi-vector heuristics to block hackers, detect illegal caller ID spoofing, and isolate audio in real-time.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-indigo-500 tracking-wide">
                    Companion Tool: Fake Call Escape
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-bold px-1.5 py-0.2 rounded">
                    ESCAPE
                  </span>
                </div>
                <button
                  onClick={openFakeCallSettings}
                  className="text-[11px] font-bold text-indigo-400 hover:underline flex items-center gap-0.5"
                >
                  Configure <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Schedules a simulated outbound call to yourself ("Mom", "Police", "Boss") to discreetly exit unsafe in-person situations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'scanner'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Call Threat Scanner & Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'community'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Community Threat Feed ({scamReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blocked')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'blocked'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <PhoneOff className="w-4 h-4" />
          <span>My Blocked Numbers ({blockedNumbers.length})</span>
        </button>
      </div>

      {/* TAB 1: SCANNER & SIMULATOR */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Number Input & Quick Presets (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xl space-y-5">
              <div>
                <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  <span>Incoming Call Threat Scanner</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter an incoming number to cross-examine our 4-vector threat intelligence engine.
                </p>
              </div>

              {/* Number Input Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Target Caller Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phoneNumberInput}
                    onChange={(e) => setPhoneNumberInput(e.target.value)}
                    placeholder="+91 98765 43210 or 140xxxx"
                    className="w-full px-4 py-3 rounded-2xl bg-muted/60 border border-border text-foreground font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    onClick={() => handleScan(phoneNumberInput, simulatedSpeechInput)}
                    className="absolute right-2 top-2 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90 transition-all"
                  >
                    Analyze
                  </button>
                </div>
              </div>

              {/* Sample Numbers Quick-Select */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase block">
                  Quick-Test Scenarios
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SAMPLE_NUMBERS.map((sample) => (
                    <button
                      key={sample.num}
                      onClick={() => {
                        setPhoneNumberInput(sample.num);
                        const speech = sample.label.includes('SBI')
                          ? 'Your SBI Yono account will be blocked. Share 6-digit OTP.'
                          : sample.label.includes('Police')
                          ? 'This is Delhi Cyber Cell. An arrest warrant has been issued in your name.'
                          : sample.label.includes('Safe')
                          ? 'Verified safe assistance line.'
                          : 'Urgent verification required for your parcel.';
                        setSimulatedSpeechInput(speech);
                        handleScan(sample.num, speech);
                      }}
                      className="p-2.5 rounded-xl text-left bg-muted/40 hover:bg-muted border border-border transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-foreground truncate">{sample.label}</span>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          sample.tag === 'Critical' || sample.tag === 'High Threat'
                            ? 'bg-red-500/20 text-red-400'
                            : sample.tag === 'Safe' || sample.tag === 'Safe Verified'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {sample.tag}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground mt-1">{sample.num}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speech Simulator Box */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-primary" />
                    Simulated Caller Speech
                  </label>
                  <span className="text-[10px] text-primary font-bold">AI Keyword Engine</span>
                </div>
                <textarea
                  rows={2}
                  value={simulatedSpeechInput}
                  onChange={(e) => {
                    setSimulatedSpeechInput(e.target.value);
                    handleScan(phoneNumberInput, e.target.value);
                  }}
                  placeholder="e.g., 'Your bank account is suspended, share OTP immediately'"
                  className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[10px] text-muted-foreground mr-1">Keyword triggers:</span>
                  {['OTP', 'Bank Suspended', 'Police Fine', 'Digital Arrest', 'AnyDesk'].map((kw) => (
                    <button
                      key={kw}
                      onClick={() => {
                        const newText = simulatedSpeechInput + ` ${kw}`;
                        setSimulatedSpeechInput(newText);
                        handleScan(phoneNumberInput, newText);
                      }}
                      className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border"
                    >
                      +{kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Simulation Launcher Button */}
              <div className="pt-2">
                <button
                  onClick={() => triggerScamAlert(currentAnalysis)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>Test Incoming Scam Call Overlay</span>
                </button>
                <p className="text-[11px] text-muted-foreground text-center mt-2">
                  Launches the full-screen caller alert overlay with AI Speech Safeguard & auto-block.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Risk Meter & 4 Threat Vectors (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Risk Meter Card */}
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-black text-xl text-foreground">
                    Threat Assessment & Trust Score
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Analyzing <span className="font-mono font-bold text-foreground">{currentAnalysis.phoneNumber}</span>
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    currentAnalysis.riskLevel === 'critical'
                      ? 'bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse'
                      : currentAnalysis.riskLevel === 'high'
                      ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                      : currentAnalysis.riskLevel === 'suspicious'
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                  }`}>
                    {currentAnalysis.riskLevel === 'critical' && <ShieldX className="w-4 h-4" />}
                    {currentAnalysis.riskLevel === 'high' && <AlertTriangle className="w-4 h-4" />}
                    {currentAnalysis.riskLevel === 'suspicious' && <Info className="w-4 h-4" />}
                    {currentAnalysis.riskLevel === 'safe' && <ShieldCheck className="w-4 h-4" />}
                    <span>{currentAnalysis.riskLevel.toUpperCase()} RISK</span>
                  </span>
                </div>
              </div>

              {/* 3-Tier Risk Meter Bar */}
              <div className="space-y-3 p-5 rounded-2xl bg-muted/40 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black font-heading text-foreground">
                      {currentAnalysis.trustScore}%
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">
                        {currentAnalysis.trustScore >= 95 ? 'Verified Safe Contact' : currentAnalysis.trustScore >= 40 ? 'Suspicious / Unverified Caller' : 'Confirmed Scam / Phishing Threat'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">SafeCircle Trust Metric</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-muted-foreground">Action Recommended:</span>
                    <span className={`block text-xs font-black uppercase ${
                      currentAnalysis.recommendation === 'block_immediately' ? 'text-red-500' : currentAnalysis.recommendation === 'proceed_with_caution' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {currentAnalysis.recommendation.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Progress Gauge */}
                <div className="relative w-full h-4 rounded-full bg-muted overflow-hidden flex">
                  {/* Confirmed Scam Zone: 0 - 30% */}
                  <div className="w-[30%] h-full bg-red-500/30 border-r border-background flex items-center justify-center text-[9px] text-red-300 font-bold">
                    0-30%
                  </div>
                  {/* Suspicious Zone: 30 - 70% */}
                  <div className="w-[40%] h-full bg-amber-500/30 border-r border-background flex items-center justify-center text-[9px] text-amber-300 font-bold">
                    40-70%
                  </div>
                  {/* Verified Safe Zone: 70 - 100% */}
                  <div className="w-[30%] h-full bg-emerald-500/30 flex items-center justify-center text-[9px] text-emerald-300 font-bold">
                    95-100%
                  </div>

                  {/* Marker Pin */}
                  <div
                    style={{ left: `${Math.min(Math.max(currentAnalysis.trustScore, 3), 97)}%` }}
                    className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-white shadow-lg rounded-full border-2 border-black"
                  />
                </div>

                <div className="grid grid-cols-3 text-[11px] font-semibold text-muted-foreground pt-1">
                  <div className="text-left text-red-400">🔴 Scam / Hacker (0-30%)</div>
                  <div className="text-center text-amber-400">🟡 Suspicious (40-70%)</div>
                  <div className="text-right text-emerald-400">🟢 Verified Safe (95-100%)</div>
                </div>
              </div>

              {/* Threat Summary Alert */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                currentAnalysis.trustScore <= 30
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : currentAnalysis.trustScore <= 70
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-foreground block mb-0.5">
                    {currentAnalysis.callerName}
                  </span>
                  <span>{currentAnalysis.threatSummary}</span>
                </div>
              </div>

              {/* 4 Threat Vector Breakdown Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  4-Vector Threat Intelligence Evaluation
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Vector 1: Known Scam Database */}
                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-primary" />
                        1. Scam DB Match
                      </span>
                      {currentAnalysis.isDatabaseMatch ? (
                        <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.2 rounded">
                          MATCH FOUND
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          CLEAR
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {currentAnalysis.isDatabaseMatch 
                        ? 'Indexed in national Truecaller & SafeCircle fraudulent registry.' 
                        : 'No prior criminal complaints reported in global database.'}
                    </p>
                  </div>

                  {/* Vector 2: Carrier & VoIP Spoofing Analysis */}
                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-primary" />
                        2. Carrier & VoIP Spoof
                      </span>
                      {currentAnalysis.isSpoofedVoip ? (
                        <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.2 rounded">
                          VOIP SPOOF
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          GENUINE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Carrier: <b className="text-foreground">{currentAnalysis.carrier}</b> ({currentAnalysis.location})
                    </p>
                  </div>

                  {/* Vector 3: Community Scam Reports */}
                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-primary" />
                        3. Community Reports
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        currentAnalysis.flagCount > 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {currentAnalysis.flagCount} FLAGS
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {currentAnalysis.flagCount > 0
                        ? `Flagged ${currentAnalysis.flagCount} times by SafeCircle users in your region.`
                        : 'Zero negative community reports recorded.'}
                    </p>
                  </div>

                  {/* Vector 4: AI Speech Keyword Detection */}
                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-primary" />
                        4. Speech Keywords
                      </span>
                      {currentAnalysis.matchedKeywords.length > 0 ? (
                        <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.2 rounded">
                          {currentAnalysis.matchedKeywords.length} TRIGGERED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          NO FLAGS
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentAnalysis.matchedKeywords.length > 0 ? (
                        currentAnalysis.matchedKeywords.map((kw) => (
                          <span key={kw} className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-[10px]">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-muted-foreground">No phishing keywords found in current audio test.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    blockNumber(currentAnalysis.phoneNumber, currentAnalysis.callerName, currentAnalysis.category);
                    alert(`Number ${currentAnalysis.phoneNumber} blocked successfully.`);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-red-600/10 border border-red-500/30 hover:bg-red-600/20 text-red-500 font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Block Number & Increment Community Flags</span>
                </button>

                <button
                  onClick={() => {
                    setNewReportNum(currentAnalysis.phoneNumber);
                    setNewReportName(currentAnalysis.callerName);
                    setIsReportModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs flex items-center gap-2 border border-border transition-all"
                >
                  <PlusCircle className="w-4 h-4 text-primary" />
                  <span>File Detailed Incident Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITY THREAT LOG FEED */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          {/* Search & Filter Header */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <span>Community Scam Threat Intelligence</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Verified reports from SafeCircle community members. Reporter identities are strictly anonymized.
                </p>
              </div>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report New Number</span>
              </button>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search numbers, caller names, keywords..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/40 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-6 flex items-center gap-1.5 overflow-x-auto py-0.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  All Categories
                </button>
                {(Object.keys(CATEGORY_LABELS) as ScamCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {CATEGORY_LABELS[cat].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Report Feed Cards */}
          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-card border border-border">
                <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="font-bold text-foreground">No reports match your search query</p>
                <p className="text-xs text-muted-foreground mt-1">Try searching another number or resetting your filter</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const catInfo = CATEGORY_LABELS[report.category] || CATEGORY_LABELS.phishing;
                return (
                  <div
                    key={report.id}
                    className="p-6 rounded-3xl bg-card border border-border hover:border-red-500/30 transition-all shadow-md space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-base font-black text-foreground">
                            {report.phoneNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${catInfo.bg} ${catInfo.color}`}>
                            {catInfo.label}
                          </span>
                          {report.isSpoofedVoip && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                              VoIP Spoof
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground">
                            • Reported {report.reportedAt}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-foreground mt-1">
                          Claimed Identity: <span className="text-primary">{report.callerName}</span>
                        </h3>
                      </div>

                      {/* Flag Count Badge */}
                      <div className="flex items-center gap-2 self-start">
                        <span className="px-2.5 py-1 rounded-xl bg-red-500/15 text-red-400 text-xs font-bold border border-red-500/20 flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Flagged {report.flagCount} times</span>
                        </span>
                      </div>
                    </div>

                    {/* Report Notes */}
                    <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-2xl border border-border">
                      {report.notes}
                    </p>

                    {/* Routing & Keywords */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
                      <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-[11px]">
                        <span className="flex items-center gap-1">
                          <Server className="w-3 h-3 text-primary" />
                          {report.carrier}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          {report.location}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-500">
                          <Lock className="w-3 h-3" />
                          Anonymous SafeCircle Verification
                        </span>
                      </div>

                      {/* Keywords */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">Detected Phrases:</span>
                        {report.sampleKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-300 font-mono text-[10px] border border-red-500/20"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/60">
                      <button
                        onClick={() => upvoteScamReport(report.id)}
                        className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center gap-1.5 border border-border transition-all"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-primary" />
                        <span>Confirm / Upvote Scam ({report.upvotes})</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setPhoneNumberInput(report.phoneNumber);
                            setActiveTab('scanner');
                            handleScan(report.phoneNumber, report.notes);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-all"
                        >
                          Scan in Engine
                        </button>
                        <button
                          onClick={() => {
                            blockNumber(report.phoneNumber, report.callerName, report.category);
                            alert(`Number ${report.phoneNumber} added to your block list.`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600/20 border border-red-500/20 text-xs font-bold transition-all"
                        >
                          Block Number
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MY BLOCKED NUMBERS */}
      {activeTab === 'blocked' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
                <PhoneOff className="w-5 h-5 text-red-500" />
                <span>My Active Call Block List</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Incoming calls from these numbers are silently rejected and auto-logged to SafeCircle intelligence.
              </p>
            </div>

            <button
              onClick={() => {
                const num = prompt('Enter phone number to block (e.g., +91 98765 00000):');
                if (num && num.trim()) {
                  blockNumber(num.trim(), 'Manual User Block', 'phishing');
                }
              }}
              className="px-4 py-2.5 rounded-2xl bg-card border border-border hover:bg-muted text-foreground text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4 text-primary" />
              <span>Add Custom Block</span>
            </button>
          </div>

          <div className="space-y-3">
            {blockedNumbers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground rounded-2xl bg-muted/20">
                You haven't blocked any numbers yet.
              </div>
            ) : (
              blockedNumbers.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-muted/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-red-500/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      <PhoneOff className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-foreground">
                          {item.phoneNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                          BLOCKED
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-foreground mt-0.5">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.reason} • Blocked: {new Date(item.blockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => unblockNumber(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold border border-border flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Unblock</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. MODAL: REPORT NEW SCAM INCIDENT */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-foreground">
                    Report Scam / Spoofed Call
                  </h3>
                  <p className="text-xs text-muted-foreground">Anonymous Community Incident Submission</p>
                </div>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                ✕
              </button>
            </div>

            {reportSuccessMessage ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto animate-bounce" />
                <h4 className="font-bold text-base text-foreground">Scam Number Flagged!</h4>
                <p className="text-xs text-muted-foreground">
                  The number has been indexed into SafeCircle threat intelligence. Your identity remains strictly anonymous.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    Scammer Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReportNum}
                    onChange={(e) => setNewReportNum(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-2xl bg-muted/40 border border-border text-foreground font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Impersonated Entity / Claimed Name
                    </label>
                    <input
                      type="text"
                      value={newReportName}
                      onChange={(e) => setNewReportName(e.target.value)}
                      placeholder="e.g. Police Inspector, HDFC Manager"
                      className="w-full px-3 py-2 rounded-2xl bg-muted/40 border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Incident Category *
                    </label>
                    <select
                      value={newReportCategory}
                      onChange={(e) => setNewReportCategory(e.target.value as ScamCategory)}
                      className="w-full px-3 py-2 rounded-2xl bg-muted/40 border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="financial_fraud">Financial Fraud</option>
                      <option value="police_impersonation">Police Impersonation</option>
                      <option value="otp_theft">OTP Theft</option>
                      <option value="job_scam">Job Scam</option>
                      <option value="harassment">Harassment</option>
                      <option value="phishing">Cyber Phishing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      City / Region
                    </label>
                    <input
                      type="text"
                      value={newReportLocation}
                      onChange={(e) => setNewReportLocation(e.target.value)}
                      placeholder="e.g. Bengaluru, Mumbai, Delhi"
                      className="w-full px-3 py-2 rounded-2xl bg-muted/40 border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Spoken Keywords (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={newReportKeywords}
                      onChange={(e) => setNewReportKeywords(e.target.value)}
                      placeholder="OTP, Bank Account, Arrest"
                      className="w-full px-3 py-2 rounded-2xl bg-muted/40 border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    Incident Description / Extortion Details *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newReportNotes}
                    onChange={(e) => setNewReportNotes(e.target.value)}
                    placeholder="Describe what the caller said, payment links demanded, threats made..."
                    className="w-full px-3 py-2 rounded-2xl bg-muted/40 border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center gap-2.5 text-[11px] text-muted-foreground">
                  <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Your personal phone, email, and IP address are never revealed or stored with this report.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 rounded-2xl text-xs font-bold text-muted-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
                  >
                    Submit Anonymous Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
