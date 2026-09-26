'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SafePoint, 
  IncidentReport, 
  EvidenceItem, 
  GuardianContact, 
  Journey, 
  TransportMode,
  IncidentStatus,
  ScamCallReport,
  BlockedNumber,
  CallShieldAnalysis,
  ScamCategory,
  AcousticTriggerConfig,
  AcousticSensitivity,
  SensorTriggerType,
  MicPermissionState,
  AcousticTriggerAlert
} from '@/types';
import { 
  mockSafePoints, 
  mockIncidentReports, 
  mockEvidenceItems, 
  mockGuardianContacts 
} from '@/lib/mockData';
import { soundEffects } from '@/lib/audioEffects';
import { SupportedLanguage } from '@/lib/translations';
import { INITIAL_SCAM_REPORTS, INITIAL_BLOCKED_NUMBERS } from '@/lib/scamShieldEngine';
import { acousticEngine, SENSITIVITY_THRESHOLDS } from '@/lib/acousticTriggerEngine';

export interface FakeCallConfig {
  callerName: string;
  callerNumber: string;
  callerImage: string;
  audioMessage: string;
  delaySeconds: number;
  presetId?: 'mom' | 'dad' | 'police' | 'boss' | 'taxi' | 'custom';
  ringtoneEnabled?: boolean;
  voiceType?: 'parent' | 'authority' | 'friend';
}

interface AppContextType {
  // SOS & Emergency
  isSOSActive: boolean;
  sosCountdown: number; // 5 to 0
  isEmergencyTriggered: boolean;
  isSirenEnabled: boolean;
  triggerSOS: () => void;
  cancelSOS: (pin?: string) => boolean;
  toggleSiren: () => void;
  policeDispatchOptIn: boolean;
  setPoliceDispatchOptIn: (val: boolean) => void;

  // Discreet Mode & Camouflage
  isDiscreetMode: boolean;
  toggleDiscreetMode: () => void;

  // Fake Call
  isFakeCallModalOpen: boolean;
  isIncomingCallActive: boolean;
  fakeCallConfig: FakeCallConfig;
  setFakeCallConfig: (cfg: Partial<FakeCallConfig>) => void;
  triggerFakeCall: (delayOverride?: number) => void;
  dismissFakeCall: () => void;
  openFakeCallSettings: () => void;
  closeFakeCallSettings: () => void;
  scheduledFakeCallCountdown: number | null;
  cancelScheduledFakeCall: () => void;

  // Scam & Hacker Call Shield
  activeScamAlert: CallShieldAnalysis | null;
  triggerScamAlert: (analysis: CallShieldAnalysis) => void;
  dismissScamAlert: () => void;
  blockedNumbers: BlockedNumber[];
  blockNumber: (phoneNumber: string, label?: string, category?: string) => void;
  unblockNumber: (id: string) => void;
  scamReports: ScamCallReport[];
  reportScamNumber: (data: Omit<ScamCallReport, 'id' | 'reportedAt' | 'upvotes'>) => void;
  upvoteScamReport: (id: string) => void;

  // AI Scream & High-Decibel Acoustic Trigger
  acousticConfig: AcousticTriggerConfig;
  acousticAlert: AcousticTriggerAlert | null;
  liveDecibels: number;
  toggleAcousticTrigger: () => Promise<void>;
  setAcousticSensitivity: (sensitivity: AcousticSensitivity) => void;
  toggleShakeDetection: () => void;
  toggleBluetoothFob: () => void;
  triggerAcousticSimulation: (type?: SensorTriggerType, simulatedDb?: number) => void;
  dismissAcousticAlert: () => void;

  // Voice Trigger
  isVoiceTriggerOpen: boolean;
  setVoiceTriggerOpen: (open: boolean) => void;

  // Active Journey
  activeJourney: Journey | null;
  startJourney: (data: {
    startLocation: string;
    destination: string;
    transportMode: TransportMode;
    vehicleNumber?: string;
    driverName?: string;
    etaMinutes: number;
  }) => void;
  checkInJourney: () => void;
  endJourney: () => void;

  // Safe Points & Reports
  safePoints: SafePoint[];
  reports: IncidentReport[];
  evidenceVault: EvidenceItem[];
  guardians: GuardianContact[];
  addReport: (report: Omit<IncidentReport, 'id' | 'complaintId' | 'timestamp' | 'status'> & { status?: IncidentStatus }) => IncidentReport;
  updateReportStatus: (id: string, status: IncidentStatus, officialFeedback?: string) => void;
  addEvidence: (evidence: Omit<EvidenceItem, 'id' | 'timestamp' | 'hash'>) => void;
  addSafePoint: (safePoint: Omit<SafePoint, 'id' | 'verified' | 'rating' | 'distance'> & { distance?: string }) => void;
  toggleGuardianLink: (id: string) => void;

  // Route Modal
  isRoutePlannerOpen: boolean;
  setRoutePlannerOpen: (open: boolean) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Language & Main Page Navigation Flow
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  activeMainView: 'dashboard' | 'auth';
  setActiveMainView: (view: 'dashboard' | 'auth') => void;

  // Live User Location
  userLocation: { lat: number; lng: number; address: string };
  setUserLocation: (loc: { lat: number; lng: number; address: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // SOS State
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [isEmergencyTriggered, setIsEmergencyTriggered] = useState(false);
  const [isSirenEnabled, setIsSirenEnabled] = useState(false);
  const [policeDispatchOptIn, setPoliceDispatchOptIn] = useState(false);

  // Discreet Mode
  const [isDiscreetMode, setIsDiscreetMode] = useState(false);

  // Fake Call State
  const [isFakeCallModalOpen, setIsFakeCallModalOpen] = useState(false);
  const [isIncomingCallActive, setIsIncomingCallActive] = useState(false);
  const [fakeCallConfig, setFakeCallConfigState] = useState<FakeCallConfig>({
    callerName: 'Dad (Rajesh)',
    callerNumber: '+91 98765 11223',
    callerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    audioMessage: "Hey sweetheart, I am just parked right outside in the car waiting for you. Are you coming down right now? Hurry up, let's head home.",
    delaySeconds: 5,
  });

  // Voice Trigger State
  const [isVoiceTriggerOpen, setVoiceTriggerOpen] = useState(false);

  // Route Planner
  const [isRoutePlannerOpen, setRoutePlannerOpen] = useState(false);

  // Scam & Hacker Call Shield State
  const [activeScamAlert, setActiveScamAlert] = useState<CallShieldAnalysis | null>(null);
  const [scamReports, setScamReports] = useState<ScamCallReport[]>(INITIAL_SCAM_REPORTS);
  const [blockedNumbers, setBlockedNumbers] = useState<BlockedNumber[]>(INITIAL_BLOCKED_NUMBERS);

  // AI Scream & High-Decibel Acoustic Trigger State
  const [acousticConfig, setAcousticConfig] = useState<AcousticTriggerConfig>({
    isEnabled: false,
    sensitivity: 'medium',
    thresholdDecibels: 82,
    shakeDetectionEnabled: true,
    bluetoothFobEnabled: false,
    micPermissionStatus: 'prompt',
    isListening: false,
    currentDecibels: 0,
    peakDecibels: 0,
    lastTriggerType: null,
    lastTriggerTimestamp: null,
  });
  const [liveDecibels, setLiveDecibels] = useState(0);
  const [acousticAlert, setAcousticAlert] = useState<AcousticTriggerAlert | null>(null);

  // Data Collections
  const [safePoints, setSafePoints] = useState<SafePoint[]>(mockSafePoints);
  const [reports, setReports] = useState<IncidentReport[]>(mockIncidentReports);
  const [evidenceVault, setEvidenceVault] = useState<EvidenceItem[]>(mockEvidenceItems);
  const [guardians, setGuardians] = useState<GuardianContact[]>(mockGuardianContacts);

  // Active Journey
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Language & Page Flow
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [activeMainView, setActiveMainView] = useState<'dashboard' | 'auth'>('dashboard');

  // User Location (Aligned with Indiranagar / Bengaluru Safe Havens Grid)
  const [userLocation, setUserLocation] = useState({
    lat: 12.9716,
    lng: 77.6412,
    address: '100 Feet Rd, Indiranagar, Bengaluru'
  });

  // Handle Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('safecircle_theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('safecircle_theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // SOS Countdown Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSOSActive && sosCountdown > 0) {
      soundEffects.playCountdownBeep(700 + (5 - sosCountdown) * 100);
      timer = setTimeout(() => {
        setSosCountdown(prev => prev - 1);
      }, 1000);
    } else if (isSOSActive && sosCountdown === 0) {
      // Countdown finished -> Emergency activated!
      setIsEmergencyTriggered(true);
      if (isSirenEnabled) {
        soundEffects.startEmergencySiren();
      }
    }
    return () => clearTimeout(timer);
  }, [isSOSActive, sosCountdown, isSirenEnabled]);

  const triggerSOS = () => {
    setIsSOSActive(true);
    setSosCountdown(5);
    setIsEmergencyTriggered(false);
  };

  const cancelSOS = (pin?: string): boolean => {
    if (pin && pin !== '1234') {
      return false; // Wrong pin
    }
    setIsSOSActive(false);
    setSosCountdown(5);
    setIsEmergencyTriggered(false);
    soundEffects.stopEmergencySiren();
    return true;
  };

  const toggleSiren = () => {
    setIsSirenEnabled(prev => {
      const next = !prev;
      if (next && isEmergencyTriggered) {
        soundEffects.startEmergencySiren();
      } else {
        soundEffects.stopEmergencySiren();
      }
      return next;
    });
  };

  // Discreet Mode Toggle
  const toggleDiscreetMode = () => {
    setIsDiscreetMode(prev => !prev);
  };

  // Fake Call State Management
  const [scheduledFakeCallCountdown, setScheduledFakeCallCountdown] = useState<number | null>(null);

  // Scheduled Fake Call countdown ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (scheduledFakeCallCountdown !== null && scheduledFakeCallCountdown > 0) {
      timer = setTimeout(() => {
        setScheduledFakeCallCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (scheduledFakeCallCountdown === 0) {
      setScheduledFakeCallCountdown(null);
      setIsIncomingCallActive(true);
      if (fakeCallConfig.ringtoneEnabled !== false) {
        soundEffects.startPhoneRingtone();
      }
    }
    return () => clearTimeout(timer);
  }, [scheduledFakeCallCountdown, fakeCallConfig.ringtoneEnabled]);

  const setFakeCallConfig = (cfg: Partial<FakeCallConfig>) => {
    setFakeCallConfigState(prev => ({ ...prev, ...cfg }));
  };

  const triggerFakeCall = (delayOverride?: number) => {
    setIsFakeCallModalOpen(false);
    const delay = delayOverride !== undefined ? delayOverride : fakeCallConfig.delaySeconds;
    
    if (delay === 0) {
      setScheduledFakeCallCountdown(null);
      setIsIncomingCallActive(true);
      if (fakeCallConfig.ringtoneEnabled !== false) {
        soundEffects.startPhoneRingtone();
      }
    } else {
      setScheduledFakeCallCountdown(delay);
    }
  };

  const cancelScheduledFakeCall = () => {
    setScheduledFakeCallCountdown(null);
  };

  const dismissFakeCall = () => {
    setIsIncomingCallActive(false);
    setScheduledFakeCallCountdown(null);
    soundEffects.stopPhoneRingtone();
    soundEffects.stopSpeaking();
  };

  const openFakeCallSettings = () => {
    setIsFakeCallModalOpen(true);
  };

  const closeFakeCallSettings = () => {
    setIsFakeCallModalOpen(false);
  };

  // Active Journey Actions
  const startJourney = (data: {
    startLocation: string;
    destination: string;
    transportMode: TransportMode;
    vehicleNumber?: string;
    driverName?: string;
    etaMinutes: number;
  }) => {
    const now = new Date();
    const etaDate = new Date(now.getTime() + data.etaMinutes * 60000);

    const newJourney: Journey = {
      id: 'jrn_' + Date.now(),
      startLocation: data.startLocation,
      destination: data.destination,
      startLat: userLocation.lat,
      startLng: userLocation.lng,
      destLat: 12.9830,
      destLng: 77.6375,
      transportMode: data.transportMode,
      vehicleNumber: data.vehicleNumber,
      driverName: data.driverName,
      etaMinutes: data.etaMinutes,
      startedAt: now.toISOString(),
      expectedArrivalTime: etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLive: true,
      currentProgressPct: 15,
      checkInIntervalMinutes: 10,
      lastCheckInAt: 'Just now',
      nextCheckInMinutes: 8,
      deviationsDetected: 0,
      overdueGracePeriodActive: false,
      status: 'active',
    };

    setActiveJourney(newJourney);
  };

  const checkInJourney = () => {
    if (!activeJourney) return;
    setActiveJourney(prev => prev ? ({
      ...prev,
      lastCheckInAt: 'Just now',
      nextCheckInMinutes: 10,
      currentProgressPct: Math.min(100, prev.currentProgressPct + 25)
    }) : null);
  };

  const endJourney = () => {
    setActiveJourney(null);
  };

  // Safe Points & Reports Adders
  const addReport = (data: Omit<IncidentReport, 'id' | 'complaintId' | 'timestamp' | 'status'> & { status?: IncidentStatus }): IncidentReport => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'SC-';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));

    const newRep: IncidentReport = {
      ...data,
      id: 'rep_' + Date.now(),
      complaintId: code,
      timestamp: new Date().toISOString(),
      status: data.status || 'submitted',
      officialFeedback: 'Report registered in system. Dispatched to local safety review team.',
      upvotes: 1
    };

    setReports(prev => [newRep, ...prev]);
    return newRep;
  };

  const updateReportStatus = (id: string, status: IncidentStatus, officialFeedback?: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          officialFeedback: officialFeedback || r.officialFeedback,
          actionTakenNotes: status === 'action_taken' ? 'Patrol units dispatched and review concluded.' : r.actionTakenNotes
        };
      }
      return r;
    }));
  };

  const addEvidence = (data: Omit<EvidenceItem, 'id' | 'timestamp' | 'hash'>) => {
    const newItem: EvidenceItem = {
      ...data,
      id: 'ev_' + Date.now(),
      timestamp: new Date().toLocaleString(),
      hash: 'sha256:' + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2),
    };
    setEvidenceVault(prev => [newItem, ...prev]);
  };

  const addSafePoint = (data: Omit<SafePoint, 'id' | 'verified' | 'rating' | 'distance'> & { distance?: string }) => {
    const newSp: SafePoint = {
      ...data,
      id: 'sp_' + Date.now(),
      verified: false, // requires admin review
      rating: 5.0,
      distance: 'Pending review'
    };
    setSafePoints(prev => [newSp, ...prev]);
  };

  const toggleGuardianLink = (id: string) => {
    setGuardians(prev => prev.map(g => g.id === id ? { ...g, isLinked: !g.isLinked } : g));
  };

  // Scam & Hacker Call Shield Handlers
  const triggerScamAlert = (analysis: CallShieldAnalysis) => {
    setActiveScamAlert(analysis);
  };

  const dismissScamAlert = () => {
    setActiveScamAlert(null);
  };

  const blockNumber = (phoneNumber: string, label?: string, category?: string) => {
    const newBlocked: BlockedNumber = {
      id: 'blk_' + Date.now(),
      phoneNumber,
      label: label || 'Flagged Scam Number',
      category: (category as ScamCategory) || 'phishing',
      blockedAt: new Date().toISOString(),
      reason: 'Blocked via Call Shield AI',
    };
    setBlockedNumbers(prev => [newBlocked, ...prev.filter(b => b.phoneNumber !== phoneNumber)]);
    setScamReports(prev => prev.map(s => s.phoneNumber === phoneNumber ? { ...s, flagCount: s.flagCount + 1 } : s));
  };

  const unblockNumber = (id: string) => {
    setBlockedNumbers(prev => prev.filter(b => b.id !== id));
  };

  const reportScamNumber = (data: Omit<ScamCallReport, 'id' | 'reportedAt' | 'upvotes'>) => {
    const newReport: ScamCallReport = {
      ...data,
      id: 'scam_' + Date.now(),
      reportedAt: 'Just now',
      upvotes: 1,
    };
    setScamReports(prev => [newReport, ...prev]);
  };

  const upvoteScamReport = (id: string) => {
    setScamReports(prev => prev.map(s => s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s));
  };

  // AI Scream & High-Decibel Acoustic Trigger Handlers
  const handleAcousticTrigger = (type: SensorTriggerType, decibels?: number, notes?: string) => {
    setAcousticConfig(prev => ({
      ...prev,
      lastTriggerType: type,
      lastTriggerTimestamp: new Date().toISOString(),
      peakDecibels: Math.max(prev.peakDecibels, decibels || 0),
    }));

    setAcousticAlert({
      type,
      decibels,
      description: notes || 'Acoustic / Sensor Emergency Event',
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const toggleAcousticTrigger = async () => {
    if (acousticConfig.isEnabled) {
      acousticEngine.stopAcousticMonitoring();
      acousticEngine.stopShakeMonitoring();
      setAcousticConfig(prev => ({ ...prev, isEnabled: false, isListening: false }));
      setLiveDecibels(0);
    } else {
      const result = await acousticEngine.startAcousticMonitoring(
        acousticConfig.thresholdDecibels,
        {
          onDecibelUpdate: (db) => setLiveDecibels(db),
          onTriggerDetected: (type, db, notes) => handleAcousticTrigger(type, db, notes),
          onPermissionChange: (status) => setAcousticConfig(prev => ({ ...prev, micPermissionStatus: status })),
        }
      );

      if (result.success) {
        if (acousticConfig.shakeDetectionEnabled) {
          acousticEngine.startShakeMonitoring({
            onTriggerDetected: (type, db, notes) => handleAcousticTrigger(type, db, notes),
          });
        }
        setAcousticConfig(prev => ({
          ...prev,
          isEnabled: true,
          isListening: true,
          micPermissionStatus: result.permission,
        }));
      } else {
        setAcousticConfig(prev => ({
          ...prev,
          isEnabled: false,
          isListening: false,
          micPermissionStatus: result.permission,
        }));
      }
    }
  };

  const setAcousticSensitivity = (sensitivity: AcousticSensitivity) => {
    const threshold = SENSITIVITY_THRESHOLDS[sensitivity];
    acousticEngine.setThreshold(threshold);
    setAcousticConfig(prev => ({ ...prev, sensitivity, thresholdDecibels: threshold }));
  };

  const toggleShakeDetection = () => {
    setAcousticConfig(prev => {
      const next = !prev.shakeDetectionEnabled;
      if (next && prev.isEnabled) {
        acousticEngine.startShakeMonitoring({
          onTriggerDetected: (type, db, notes) => handleAcousticTrigger(type, db, notes),
        });
      } else {
        acousticEngine.stopShakeMonitoring();
      }
      return { ...prev, shakeDetectionEnabled: next };
    });
  };

  const toggleBluetoothFob = () => {
    setAcousticConfig(prev => ({ ...prev, bluetoothFobEnabled: !prev.bluetoothFobEnabled }));
  };

  const triggerAcousticSimulation = (type: SensorTriggerType = 'simulation_test', simulatedDb = 94) => {
    handleAcousticTrigger(
      type,
      simulatedDb,
      type === 'scream_decibel'
        ? `Simulated scream decibel spike: ${simulatedDb} dB (Threshold exceeded)`
        : type === 'rapid_shake'
        ? 'Simulated rapid physical phone shake detected'
        : type === 'bluetooth_fob'
        ? 'Simulated Web Bluetooth SOS key fob click'
        : 'Demo test simulation initiated by developer / judge'
    );
  };

  const dismissAcousticAlert = () => {
    setAcousticAlert(null);
  };

  useEffect(() => {
    return () => {
      acousticEngine.stopAcousticMonitoring();
      acousticEngine.stopShakeMonitoring();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        isSOSActive,
        sosCountdown,
        isEmergencyTriggered,
        isSirenEnabled,
        triggerSOS,
        cancelSOS,
        toggleSiren,
        policeDispatchOptIn,
        setPoliceDispatchOptIn,

        isDiscreetMode,
        toggleDiscreetMode,

        isFakeCallModalOpen,
        isIncomingCallActive,
        fakeCallConfig,
        setFakeCallConfig,
        triggerFakeCall,
        dismissFakeCall,
        openFakeCallSettings,
        closeFakeCallSettings,
        scheduledFakeCallCountdown,
        cancelScheduledFakeCall,

        activeScamAlert,
        triggerScamAlert,
        dismissScamAlert,
        blockedNumbers,
        blockNumber,
        unblockNumber,
        scamReports,
        reportScamNumber,
        upvoteScamReport,

        // Acoustic Scream Trigger
        acousticConfig,
        acousticAlert,
        liveDecibels,
        toggleAcousticTrigger,
        setAcousticSensitivity,
        toggleShakeDetection,
        toggleBluetoothFob,
        triggerAcousticSimulation,
        dismissAcousticAlert,

        isVoiceTriggerOpen,
        setVoiceTriggerOpen,

        activeJourney,
        startJourney,
        checkInJourney,
        endJourney,

        safePoints,
        reports,
        evidenceVault,
        guardians,
        addReport,
        updateReportStatus,
        addEvidence,
        addSafePoint,
        toggleGuardianLink,

        isRoutePlannerOpen,
        setRoutePlannerOpen,

        theme,
        toggleTheme,

        language,
        setLanguage,
        activeMainView,
        setActiveMainView,

        userLocation,
        setUserLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
