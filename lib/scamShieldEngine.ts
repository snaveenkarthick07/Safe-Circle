import { ScamCallReport, BlockedNumber, CallShieldAnalysis, ScamCategory } from '@/types';

// Critical Scam Trigger Keywords
export const SCAM_KEYWORDS = [
  'otp',
  'one time password',
  'bank account suspended',
  'account blocked',
  'urgent verification',
  'police fine',
  'arrest warrant',
  'digital arrest',
  'cbi officer',
  'customs parcel',
  'narcotics seizure',
  'aadhaar card linked',
  'pan card invalid',
  'debit card expired',
  'cvv',
  'atm pin',
  'remote access',
  'anydesk',
  'teamviewer',
  'lottery prize',
  'part time job telegram',
  'send money immediately',
  'pay penalty',
];

// Initial Community Threat Feed Data
export const INITIAL_SCAM_REPORTS: ScamCallReport[] = [
  {
    id: 'scam_001',
    phoneNumber: '+91 91234 56789',
    callerName: 'SBI Yono KYC Verification Desk',
    category: 'financial_fraud',
    riskLevel: 'critical',
    trustScore: 8,
    flagCount: 142,
    carrier: 'VoIP Virtual PBX (Spoofed Route)',
    location: 'Mumbai / Routed via Hong Kong IP',
    reportedAt: '12 mins ago',
    notes: 'Impersonating State Bank of India. Claims Yono mobile banking will be disabled in 24 hours unless a 6-digit OTP code is shared.',
    sampleKeywords: ['OTP', 'Bank Account Suspended', 'Yono Login', 'Urgent Verification'],
    isSpoofedVoip: true,
    upvotes: 89,
  },
  {
    id: 'scam_002',
    phoneNumber: '+91 94808 99112',
    callerName: 'Delhi Police Cyber Cell Special Unit',
    category: 'police_impersonation',
    riskLevel: 'critical',
    trustScore: 12,
    flagCount: 96,
    carrier: 'Unregistered SIP Trunk Provider',
    location: 'Delhi NCR (Virtual Server)',
    reportedAt: '45 mins ago',
    notes: 'Threatens student with a fake criminal arrest warrant regarding a courier package with contraband. Demands Rs 50,000 security deposit on UPI.',
    sampleKeywords: ['Digital Arrest', 'Arrest Warrant', 'Police Fine', 'Transfer Money'],
    isSpoofedVoip: true,
    upvotes: 67,
  },
  {
    id: 'scam_003',
    phoneNumber: '+91 98888 12345',
    callerName: 'Amazon / YouTube Task HR Recruiter',
    category: 'job_scam',
    riskLevel: 'high',
    trustScore: 28,
    flagCount: 64,
    carrier: 'Prepaid SIM (Unverified KYC)',
    location: 'Kolkata, West Bengal',
    reportedAt: '2 hours ago',
    notes: 'Offers Rs 3,500 daily for liking videos on Telegram, then demands Rs 5,000 "crypto deposit" to release earned commissions.',
    sampleKeywords: ['Part Time Job Telegram', 'Registration Fee', 'Daily Payout'],
    isSpoofedVoip: false,
    upvotes: 41,
  },
  {
    id: 'scam_004',
    phoneNumber: '+91 97777 54321',
    callerName: 'FedEx Customs Clearance Hub',
    category: 'phishing',
    riskLevel: 'critical',
    trustScore: 15,
    flagCount: 88,
    carrier: 'Cloud Hosted Interactive Voice Response (IVR)',
    location: 'Bengaluru / Spoofed Gateway',
    reportedAt: '3 hours ago',
    notes: 'Automated robo-voice claims illegal narcotics discovered in a parcel sent under your Aadhaar name to Taiwan. Transfers call to a fake police handler.',
    sampleKeywords: ['Customs Parcel', 'Narcotics Seizure', 'Aadhaar Card Linked'],
    isSpoofedVoip: true,
    upvotes: 75,
  },
  {
    id: 'scam_005',
    phoneNumber: '+91 96666 44321',
    callerName: 'State Electricity Board Notice Unit',
    category: 'financial_fraud',
    riskLevel: 'high',
    trustScore: 22,
    flagCount: 53,
    carrier: 'Toll-Free Spoof Range',
    location: 'Chennai Circle',
    reportedAt: '5 hours ago',
    notes: 'Claims residential electricity connection will be disconnected tonight at 9:30 PM due to pending bill. Directs user to download an AnyDesk remote viewer APK.',
    sampleKeywords: ['AnyDesk', 'Remote Access', 'Immediate Payment', 'Power Disconnection'],
    isSpoofedVoip: true,
    upvotes: 38,
  },
];

// Initial Blocked Numbers
export const INITIAL_BLOCKED_NUMBERS: BlockedNumber[] = [
  {
    id: 'blk_01',
    phoneNumber: '+91 91234 56789',
    label: 'Fake SBI KYC Phishing Bot',
    category: 'financial_fraud',
    blockedAt: '2026-09-24T18:30:00Z',
    reason: 'Reported by 142 SafeCircle users for bank OTP theft',
  },
  {
    id: 'blk_02',
    phoneNumber: '+91 94808 99112',
    label: 'Imposter Police Arrest Extortion',
    category: 'police_impersonation',
    blockedAt: '2026-09-23T11:15:00Z',
    reason: 'Aggressive VoIP extortion call',
  },
];

// Known Verified Safe Numbers
const VERIFIED_SAFE_DIRECTORY: Record<string, { name: string; carrier: string; location: string }> = {
  '112': { name: 'National Emergency Response Support System (ERSS)', carrier: 'Govt. Emergency Trunk', location: 'India National' },
  '1091': { name: 'Women Helpline Desk (Central)', carrier: 'Ministry of Home Affairs', location: 'India' },
  '181': { name: 'Women in Distress State Helpline', carrier: 'Dept. of Women & Child Dev', location: 'Karnataka / State' },
  '+918025250001': { name: 'Apollo 24/7 Pharmacy & Emergency Haven', carrier: 'Airtel Enterprise Verified', location: 'Indiranagar, Bengaluru' },
  '+918040129100': { name: 'Christ University Campus Safety Desk', carrier: 'Campus PBX Verified', location: 'Bengaluru' },
  '+919876511223': { name: 'Rajesh Sharma (Dad - Verified Guardian)', carrier: 'Jio Verified Postpaid', location: 'Bengaluru' },
  '+919876511224': { name: 'Dr. Meera Sharma (Mom - Verified Guardian)', carrier: 'Airtel Verified Postpaid', location: 'Bengaluru' },
};

/**
 * Normalizes phone numbers by removing spaces, dashes, parentheses
 */
export function normalizePhoneNumber(num: string): string {
  return num.replace(/[\s\-\(\)]/g, '');
}

/**
 * High-Precision AI Scam & Hacker Spoofing Analysis Engine
 */
export function analyzeIncomingNumber(
  rawNumber: string,
  extraAudioTranscript?: string
): CallShieldAnalysis {
  const cleaned = normalizePhoneNumber(rawNumber);
  const formatted = rawNumber.trim();

  // 1. Check Verified Safe Directory First
  if (VERIFIED_SAFE_DIRECTORY[cleaned] || cleaned === '112' || cleaned === '100' || cleaned === '1091') {
    const safeData = VERIFIED_SAFE_DIRECTORY[cleaned] || {
      name: 'Official Emergency Service',
      carrier: 'Government Emergency Telecom Network',
      location: 'National Command Center',
    };

    return {
      phoneNumber: formatted,
      callerName: safeData.name,
      trustScore: 99,
      riskLevel: 'safe',
      isDatabaseMatch: false,
      isSpoofedVoip: false,
      flagCount: 0,
      carrier: safeData.carrier,
      location: safeData.location,
      matchedKeywords: [],
      threatSummary: 'Official verified organization with verified carrier trust signature.',
      recommendation: 'verified_safe',
      simulatedAudioScript: 'Hello, this is verified assistance reaching out to ensure your safety status.',
    };
  }

  // 2. Check Known Community Scam Database Match
  const dbMatch = INITIAL_SCAM_REPORTS.find(
    (rep) => normalizePhoneNumber(rep.phoneNumber) === cleaned
  );

  if (dbMatch) {
    return {
      phoneNumber: formatted,
      callerName: dbMatch.callerName,
      trustScore: dbMatch.trustScore,
      riskLevel: dbMatch.riskLevel,
      category: dbMatch.category,
      isDatabaseMatch: true,
      isSpoofedVoip: dbMatch.isSpoofedVoip,
      flagCount: dbMatch.flagCount,
      carrier: dbMatch.carrier,
      location: dbMatch.location,
      matchedKeywords: dbMatch.sampleKeywords,
      threatSummary: `CONFIRMED SCAM: ${dbMatch.notes}`,
      recommendation: 'block_immediately',
      simulatedAudioScript: `Attention customer, your ${dbMatch.category === 'financial_fraud' ? 'banking profile' : 'case file'} requires urgent verification. Do not disconnect or your access will be permanently suspended.`,
    };
  }

  // 3. Number Format & Carrier Threat Analysis
  const isVoIPPrefix = /^(00|\+|91)?(140|160|900|800|999|00880|00234)/.test(cleaned);
  const isTooShort = cleaned.length < 5 && cleaned !== '112' && cleaned !== '100';
  const isSuspiciousInternational = /^\+?(234|880|92|254|977|380)/.test(cleaned);

  // 4. Keyword Analysis if audio transcript is provided
  const matchedKeywords: string[] = [];
  if (extraAudioTranscript) {
    const lowerText = extraAudioTranscript.toLowerCase();
    SCAM_KEYWORDS.forEach((kw) => {
      if (lowerText.includes(kw)) {
        matchedKeywords.push(kw.toUpperCase());
      }
    });
  }

  // Calculate Trust Score & Threat Level
  let calculatedScore = 55; // Base unverified score
  let detectedCategory: ScamCategory = 'phishing';
  let isSpoofed = isVoIPPrefix || isSuspiciousInternational;
  let summary = 'Unverified number. Caller is not in your verified contact list.';
  let rec: 'block_immediately' | 'proceed_with_caution' | 'verified_safe' = 'proceed_with_caution';

  if (isSuspiciousInternational) {
    calculatedScore = 18;
    detectedCategory = 'financial_fraud';
    summary = 'HIGH RISK: Overseas virtual spoof gateway often associated with extortion rings.';
    rec = 'block_immediately';
  } else if (isVoIPPrefix) {
    calculatedScore = 24;
    detectedCategory = 'phishing';
    summary = 'SPOOF DETECTED: Caller is originating from a cloud VoIP PBX masquerading as a local number.';
    rec = 'block_immediately';
  } else if (matchedKeywords.length >= 2) {
    calculatedScore = 14;
    detectedCategory = matchedKeywords.some(k => k.includes('OTP') || k.includes('BANK')) ? 'financial_fraud' : 'police_impersonation';
    summary = `CRITICAL THREAT: Caller speech matched dangerous triggers: ${matchedKeywords.join(', ')}.`;
    rec = 'block_immediately';
  } else if (matchedKeywords.length === 1) {
    calculatedScore = 38;
    summary = `SUSPICIOUS: Speech analysis detected sensitivity keyword "${matchedKeywords[0]}".`;
    rec = 'proceed_with_caution';
  }

  const riskLevel = calculatedScore <= 30 ? 'critical' : calculatedScore <= 45 ? 'high' : calculatedScore <= 70 ? 'suspicious' : 'safe';

  return {
    phoneNumber: formatted,
    callerName: calculatedScore <= 30 ? 'Suspected Cyber Fraud Unit' : 'Unknown / Private Caller',
    trustScore: calculatedScore,
    riskLevel,
    category: detectedCategory,
    isDatabaseMatch: false,
    isSpoofedVoip: isSpoofed,
    flagCount: calculatedScore <= 30 ? 34 : 0,
    carrier: isSpoofed ? 'VoIP Virtual PBX Gateway' : 'Standard Mobile Network (Unverified)',
    location: isSuspiciousInternational ? 'International Route' : 'Unregistered Caller Region',
    matchedKeywords,
    threatSummary: summary,
    recommendation: rec,
    simulatedAudioScript: matchedKeywords.length > 0 
      ? `Dear citizen, urgent action is needed regarding your account. Please provide your ${matchedKeywords[0]} immediately.`
      : 'Hello? Can you hear me? We have an urgent notification regarding your verification documents.',
  };
}
