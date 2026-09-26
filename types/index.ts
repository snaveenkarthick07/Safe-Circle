export type UserRole = 'user' | 'guardian' | 'authority' | 'organization' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  city: string;
  campusOrg?: string;
  emergencyContactsCount?: number;
  consentPoliceDispatch: boolean;
  consentAudioRecording: boolean;
  consentLocationTracking: boolean;
  nightSafetyMode: boolean;
  collegeSafetyMode: boolean;
  discreetPin: string;
}

export interface GuardianContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  priority: 1 | 2 | 3;
  isLinked: boolean;
  batteryLevel?: number;
  lastSeen?: string;
  liveLocationActive?: boolean;
}

export interface SafePoint {
  id: string;
  name: string;
  category: 'pharmacy' | 'hospital' | 'police' | 'store_247' | 'campus_security' | 'shelter' | 'fuel_station';
  address: string;
  phone: string;
  lat: number;
  lng: number;
  verified: boolean;
  distance: string;
  openHours: string;
  facilities: string[];
  contactPerson?: string;
  rating: number;
}

export type IncidentCategory = 
  | 'harassment'
  | 'stalking'
  | 'unsafe_transport'
  | 'poor_lighting'
  | 'isolated_place'
  | 'suspicious_activity'
  | 'threat'
  | 'physical_assault'
  | 'cyber_threat';

export type IncidentStatus = 'submitted' | 'received' | 'under_review' | 'action_taken' | 'closed';

export interface IncidentReport {
  id: string;
  complaintId: string;
  title: string;
  category: IncidentCategory;
  description: string;
  timestamp: string;
  locationName: string;
  lat: number;
  lng: number;
  isAnonymous: boolean;
  status: IncidentStatus;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidenceCount: number;
  officialFeedback?: string;
  actionTakenNotes?: string;
  upvotes?: number;
  reporterId?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'late_night';
}

export interface EvidenceItem {
  id: string;
  title: string;
  category: string;
  mediaType: 'photo' | 'audio' | 'video' | 'document' | 'notes';
  size: string;
  timestamp: string;
  hash: string;
  location: string;
  encrypted: boolean;
  notes?: string;
  filePreview?: string;
}

export type TransportMode = 'cab' | 'auto' | 'bus' | 'metro' | 'walking' | 'bike';

export interface Journey {
  id: string;
  startLocation: string;
  destination: string;
  startLat: number;
  startLng: number;
  destLat: number;
  destLng: number;
  transportMode: TransportMode;
  vehicleNumber?: string;
  driverName?: string;
  cabCompany?: string;
  etaMinutes: number;
  startedAt: string;
  expectedArrivalTime: string;
  isLive: boolean;
  currentProgressPct: number;
  checkInIntervalMinutes: number;
  lastCheckInAt: string;
  nextCheckInMinutes: number;
  deviationsDetected: number;
  overdueGracePeriodActive: boolean;
  status: 'active' | 'completed' | 'sos_triggered' | 'overdue';
}

export interface RouteOption {
  id: string;
  name: string;
  type: 'fastest' | 'safer' | 'alternative';
  durationMinutes: number;
  distanceKm: number;
  safetyScore: number; // 0-100
  lightingScore: number; // 0-100
  policeProximityScore: number; // 0-100
  crowdScore: number; // 0-100
  cautionZonesCount: number;
  reasons: string[];
  warningNote?: string;
  color: string;
  coordinates: [number, number][];
}

export interface AIRiskTrend {
  hour: string;
  riskLevel: number; // 0-100
  incidentCount: number;
  lightingQuality: number;
  policePatrolPresence: number;
}

export interface HotspotZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  riskLevel: 'normal' | 'caution' | 'high';
  incidentCount: number;
  dominantCategory: IncidentCategory;
  peakRiskHours: string;
  safetyAdvisory: string;
}

export interface CampusSafetyAlert {
  id: string;
  title: string;
  type: 'alert' | 'advisory' | 'patrol_update' | 'safe_walk';
  campusName: string;
  timestamp: string;
  message: string;
  active: boolean;
}

export type ScamCategory = 
  | 'financial_fraud'
  | 'police_impersonation'
  | 'otp_theft'
  | 'harassment'
  | 'job_scam'
  | 'phishing';

export interface ScamCallReport {
  id: string;
  phoneNumber: string;
  callerName: string;
  category: ScamCategory;
  riskLevel: 'safe' | 'suspicious' | 'high' | 'critical';
  trustScore: number; // 0 - 100%
  flagCount: number;
  carrier: string;
  location: string;
  reportedAt: string;
  notes: string;
  sampleKeywords: string[];
  isSpoofedVoip: boolean;
  upvotes: number;
}

export interface BlockedNumber {
  id: string;
  phoneNumber: string;
  label: string;
  category: ScamCategory | 'custom';
  blockedAt: string;
  reason?: string;
}

export interface CallShieldAnalysis {
  phoneNumber: string;
  callerName: string;
  trustScore: number; // 0 - 100
  riskLevel: 'safe' | 'suspicious' | 'high' | 'critical';
  category?: ScamCategory;
  isDatabaseMatch: boolean;
  isSpoofedVoip: boolean;
  flagCount: number;
  carrier: string;
  location: string;
  matchedKeywords: string[];
  threatSummary: string;
  recommendation: 'block_immediately' | 'proceed_with_caution' | 'verified_safe';
  simulatedAudioScript?: string;
}

export type AcousticSensitivity = 'low' | 'medium' | 'high' | 'custom';
export type SensorTriggerType = 'scream_decibel' | 'rapid_shake' | 'bluetooth_fob' | 'simulation_test';
export type MicPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface AcousticTriggerConfig {
  isEnabled: boolean;
  sensitivity: AcousticSensitivity;
  thresholdDecibels: number;
  shakeDetectionEnabled: boolean;
  bluetoothFobEnabled: boolean;
  micPermissionStatus: MicPermissionState;
  isListening: boolean;
  currentDecibels: number;
  peakDecibels: number;
  lastTriggerType: SensorTriggerType | null;
  lastTriggerTimestamp: string | null;
}

export interface AcousticTriggerAlert {
  type: SensorTriggerType;
  decibels?: number;
  description: string;
  timestamp: string;
}

