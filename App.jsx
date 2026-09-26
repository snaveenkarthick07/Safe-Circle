import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Navigation,
  Phone,
  PhoneCall,
  PhoneOff,
  Lock,
  Unlock,
  Key,
  FileText,
  FileAudio,
  FileImage,
  Camera,
  Mic,
  Send,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Globe,
  User,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Search,
  Share2,
  Compass,
  Radio,
  Zap,
  Car,
  Bus,
  Footprints,
  Train,
  Calculator as CalcIcon,
  Download,
  Trash2,
  Plus,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Activity,
  Sparkles,
  Bell,
  Sliders,
  Check,
  Building,
  Info
} from 'lucide-react';

/* ==========================================================================
   1. MULTI-LANGUAGE TRANSLATIONS (i18n) - 6 Regional Languages
   ========================================================================== */
const TRANSLATIONS = {
  en: {
    appName: "SafeCircle",
    tagline: "Your Safety. Your Circle. Your Choice.",
    subTagline: "Privacy-conscious AI safety companion for women & community protection",
    navHome: "Dashboard",
    navMap: "Safe Routes",
    navJourney: "Journey Guardian",
    navReports: "Reports & Vault",
    navAuthority: "Dispatch Portal",
    navAdmin: "Admin Console",
    navGuardian: "Guardian View",
    roleWoman: "Woman / User",
    roleGuardian: "Guardian / Family",
    rolePolice: "Police / Authority",
    roleAdmin: "System Admin",
    statusSafe: "You are currently protected",
    statusSafeDesc: "Live GPS active • Guardian Circle standing by",
    statusEmergency: "EMERGENCY BROADCAST ACTIVE",
    statusEmergencyDesc: "Live coordinates and audio stream dispatched to guardians & units",
    sosButton: "SOS",
    sosTriggered: "Triggering Silent SOS...",
    sosCountdownNotice: "Emergency broadcast dispatches in",
    sosCancel: "Cancel — I am Safe",
    sosConfirmTitle: "Silent SOS Dispatched",
    sosConfirmDesc: "Encrypted distress packet sent to your 3 primary guardians.",
    fakeCallBtn: "Fake Call Escape",
    calculatorBtn: "Discreet Mode",
    activeLocation: "Indiranagar 100ft Rd, Bengaluru",
    batteryLevel: "Battery: 84%",
    gpsAccuracy: "GPS: ±4m accuracy",
    guardianCircle: "Guardian Circle",
    addGuardian: "Add Guardian",
    quickActions: "Rapid Safety Tools",
    safeWalk: "Safe Route Planner",
    safeWalkDesc: "AI-illuminated route analysis with real-time zone risk evaluation",
    startJourney: "Track My Journey",
    startJourneyDesc: "Monitored transit with ETA countdown and overdue alerts",
    fileReport: "Report Incident",
    fileReportDesc: "Encrypted anonymous reporting with instant case tracking",
    evidenceVault: "Evidence Vault",
    evidenceVaultDesc: "Client-side encrypted repository for media and timestamped logs",
    routeComparison: "AI Safe Route Recommendation",
    saferRoute: "Safer Route (Recommended)",
    saferRouteDesc: "98% well-lit streets, verified safe havens every 250m, active patrol zone",
    fastestRoute: "Shortest Route (Cautionary)",
    fastestRouteDesc: "Saves 4 mins, but passes 2 poorly lit alleyways with recent evening reports",
    safetyScore: "Safety Score",
    eta: "ETA",
    distance: "Distance",
    cctvCoverage: "CCTV Coverage",
    illumination: "Street Lighting",
    safeHavensNearby: "Safe Havens Nearby",
    aiInsightTitle: "AI Risk Pattern Analysis",
    aiInsightText: "Historical report clustering indicates elevated risk along Cross Road 4 after 9:30 PM. The system routed you via Main Boulevard.",
    transportMode: "Select Transport Mode",
    vehicleNumber: "Vehicle / Cab Registration Number",
    vehiclePlaceholder: "e.g., KA-05-MJ-9821 (Uber / Auto)",
    driverName: "Driver Name (Optional)",
    destination: "Destination Address",
    destinationPlaceholder: "Enter work, home, or transit destination",
    expectedMinutes: "Expected Trip Duration (Minutes)",
    startMonitoring: "Start Monitored Journey",
    activeJourney: "Journey Monitoring Active",
    arrivalConfirmation: "I Have Arrived Safely",
    cancelJourney: "End Journey",
    reportCategory: "Incident Category",
    severityLevel: "Severity Level",
    incidentDesc: "Describe what occurred (Optional)",
    anonymousConsent: "Submit strictly anonymously (no user metadata shared)",
    submitReport: "Submit Encrypted Report",
    complaintHistory: "Complaint Tracker",
    vaultTitle: "Encrypted Evidence Vault",
    vaultNotice: "Files are encrypted on-device with AES-256 before mock local storage.",
    uploadEvidence: "Upload Evidence",
    recordAudio: "Discreet Audio Log",
    disguiseNotice: "Enter 9999= to exit camouflage calculator",
    incomingCall: "Incoming Call...",
    callerMom: "Mom (Home)",
    acceptCall: "Accept",
    declineCall: "Decline",
    callDuration: "Call in progress...",
    endCall: "End Call",
    dispatchQueue: "Emergency Dispatch Queue",
    activeIncidents: "Active Incident Triage",
    resolveAction: "Acknowledge & Dispatch",
    adminMetrics: "Platform Integrity & Verification Queue",
    verifiedSafePoints: "Verified Safe Points",
    activeUsers: "Active Tracked Users",
    avgResponseTime: "Avg Emergency Response"
  },
  hi: {
    appName: "SafeCircle",
    tagline: "आपकी सुरक्षा। आपका दायरा। आपका अधिकार।",
    subTagline: "महिलाओं और समुदाय की सुरक्षा के लिए गोपनीयता-केंद्रित AI साथी",
    navHome: "डैशबोर्ड",
    navMap: "सुरक्षित मार्ग",
    navJourney: "यात्रा रक्षक",
    navReports: "रिपोर्ट और वॉल्ट",
    navAuthority: "डिस्पैच पोर्टल",
    navAdmin: "एडमिन कंसोल",
    navGuardian: "अभिभावक दृश्य",
    roleWoman: "महिला / उपयोगकर्ता",
    roleGuardian: "अभिभावक / परिवार",
    rolePolice: "पुलिस / प्राधिकरण",
    roleAdmin: "सिस्टम व्यवस्थापक",
    statusSafe: "आप वर्तमान में सुरक्षित हैं",
    statusSafeDesc: "लाइव GPS सक्रिय • संरक्षक मंडल तैयार",
    statusEmergency: "आपातकालीन प्रसारण सक्रिय",
    statusEmergencyDesc: "लाइव निर्देशांक और ऑडियो अभिभावकों और इकाइयों को भेजे गए",
    sosButton: "SOS",
    sosTriggered: "मूक SOS सक्रिय हो रहा है...",
    sosCountdownNotice: "आपातकालीन प्रसारण रवाना होगा",
    sosCancel: "रद्द करें — मैं सुरक्षित हूँ",
    sosConfirmTitle: "मूक SOS भेजा गया",
    sosConfirmDesc: "आपके 3 प्रमुख अभिभावकों को एन्क्रिप्टेड संकट संदेश भेजा गया।",
    fakeCallBtn: "नकली कॉल बचाव",
    calculatorBtn: "गुप्त मोड",
    activeLocation: "इंद्रा नगर 100 फीट रोड, बेंगलुरु",
    batteryLevel: "बैटरी: 84%",
    gpsAccuracy: "GPS: ±4m सटीकता",
    guardianCircle: "संरक्षक मंडल",
    addGuardian: "अभिभावक जोड़ें",
    quickActions: "त्वरित सुरक्षा उपकरण",
    safeWalk: "सुरक्षित मार्ग योजनाकार",
    safeWalkDesc: "वास्तविक समय जोखिम मूल्यांकन के साथ AI-प्रबुद्ध मार्ग विश्लेषण",
    startJourney: "मेरी यात्रा ट्रैक करें",
    startJourneyDesc: "ETA उलटी गिनती और सुरक्षा अलर्ट के साथ निगरानी",
    fileReport: "घटना की रिपोर्ट करें",
    fileReportDesc: "त्वरित केस ट्रैकिंग के साथ एन्क्रिप्टेड अनाम रिपोर्टिंग",
    evidenceVault: "सबूत वॉल्ट",
    evidenceVaultDesc: "मीडिया और टाइमस्टैम्प्ड लॉग के लिए एन्क्रिप्टेड रिपॉजिटरी",
    routeComparison: "AI सुरक्षित मार्ग सिफारिश",
    saferRoute: "अधिक सुरक्षित मार्ग (अनुशंसित)",
    saferRouteDesc: "98% अच्छी रोशनी वाली सड़कें, हर 250 मीटर पर सुरक्षित केंद्र",
    fastestRoute: "सबसे छोटा मार्ग (सावधानी)",
    fastestRouteDesc: "4 मिनट बचाता है, लेकिन कम रोशनी वाले मार्ग से गुजरता है",
    safetyScore: "सुरक्षा स्कोर",
    eta: "अनुमानित समय",
    distance: "दूरी",
    cctvCoverage: "CCTV कवरेज",
    illumination: "स्ट्रीट लाइटिंग",
    safeHavensNearby: "पास के सुरक्षित केंद्र",
    aiInsightTitle: "AI जोखिम पैटर्न अंतर्दृष्टि",
    aiInsightText: "रात 9:30 बजे के बाद क्रॉस रोड 4 पर बढ़ा हुआ जोखिम है। सिस्टम ने मुख्य मार्ग चुना।",
    transportMode: "परिवहन साधन चुनें",
    vehicleNumber: "वाहन / कैब पंजीकरण संख्या",
    vehiclePlaceholder: "उदा., KA-05-MJ-9821 (ओला / ऑटो)",
    driverName: "चालक का नाम (वैकल्पिक)",
    destination: "गंतव्य पता",
    destinationPlaceholder: "घर या कार्यालय का पता दर्ज करें",
    expectedMinutes: "अनुमानित यात्रा समय (मिनट)",
    startMonitoring: "निगरानी यात्रा शुरू करें",
    activeJourney: "यात्रा की निगरानी सक्रिय है",
    arrivalConfirmation: "मैं सुरक्षित पहुँच गई हूँ",
    cancelJourney: "यात्रा समाप्त करें",
    reportCategory: "घटना की श्रेणी",
    severityLevel: "गंभीरता स्तर",
    incidentDesc: "क्या हुआ विवरण दें (वैकल्पिक)",
    anonymousConsent: "पूरी तरह से गुमनाम रूप से सबमिट करें",
    submitReport: "सुरक्षित रिपोर्ट दर्ज करें",
    complaintHistory: "शिकायत ट्रैकर",
    vaultTitle: "एन्क्रिप्टेड साक्ष्य वॉल्ट",
    vaultNotice: "फ़ाइलें स्थानीय डिवाइस पर AES-256 द्वारा सुरक्षित हैं।",
    uploadEvidence: "सबूत अपलोड करें",
    recordAudio: "गुप्त ऑडियो लॉग",
    disguiseNotice: "कैलकुलेटर छिपाने के लिए 9999= दर्ज करें",
    incomingCall: "आने वाली कॉल...",
    callerMom: "माँ (घर)",
    acceptCall: "उत्तर दें",
    declineCall: "अस्वीकार करें",
    callDuration: "कॉल जारी है...",
    endCall: "कॉल समाप्त करें",
    dispatchQueue: "आपातकालीन डिस्पैच कतार",
    activeIncidents: "सक्रिय घटनाएँ",
    resolveAction: "स्वीकार करें और भेजें",
    adminMetrics: "मंच अखंडता और सत्यापन",
    verifiedSafePoints: "सत्यापित सुरक्षित बिंदु",
    activeUsers: "सक्रिय उपयोगकर्ता",
    avgResponseTime: "औसत प्रतिक्रिया समय"
  },
  ta: {
    appName: "SafeCircle",
    tagline: "உங்கள் பாதுகாப்பு. உங்கள் வட்டம். உங்கள் உரிமை.",
    subTagline: "பெண்களின் பாதுகாப்பு மற்றும் சமூகப் பாதுகாப்பிற்கான பிரைவசி-மைய AI தளம்",
    navHome: "முகப்பு",
    navMap: "பாதுகாப்பான வழி",
    navJourney: "பயணக் காப்பாளர்",
    navReports: "புகார் & வால்ட்",
    navAuthority: "காவல்துறை போர்டல்",
    navAdmin: "நிர்வாகக் குழு",
    navGuardian: "பாதுகாவலர் பார்வை",
    roleWoman: "பெண் / பயனர்",
    roleGuardian: "பாதுகாவலர் / குடும்பம்",
    rolePolice: "காவல்துறை / அதிகாரி",
    roleAdmin: "கணினி நிர்வாகி",
    statusSafe: "நீங்கள் பாதுகாப்பாக உள்ளீர்கள்",
    statusSafeDesc: "நேரலை GPS செயலில் உள்ளது • பாதுகாவலர் வட்டம் தயாராக உள்ளது",
    statusEmergency: "அவசர எச்சரிக்கை ஒலிபரப்பு செயலில் உள்ளது",
    statusEmergencyDesc: "இருப்பிடம் மற்றும் ஆடியோ பாதுகாவலர்களுக்கு அனுப்பப்பட்டது",
    sosButton: "SOS",
    sosTriggered: "ரகசிய SOS தொடங்குகிறது...",
    sosCountdownNotice: "அவசர அழைப்பு புறப்படும் நேரம்",
    sosCancel: "ரத்துசெய் — நான் பாதுகாப்பாக உள்ளேன்",
    sosConfirmTitle: "ரகசிய SOS அனுப்பப்பட்டது",
    sosConfirmDesc: "உங்கள் 3 முதன்மை பாதுகாவலர்களுக்கு உடனடி தகவல் அனுப்பப்பட்டது.",
    fakeCallBtn: "போலி அழைப்பு",
    calculatorBtn: "மறைமுக முறை",
    activeLocation: "இந்திரா நகர் 100 அடி சாலை, பெங்களூரு",
    batteryLevel: "மின்கலன்: 84%",
    gpsAccuracy: "GPS: ±4m துல்லியம்",
    guardianCircle: "பாதுகாவலர் வட்டம்",
    addGuardian: "பாதுகாவலரைச் சேர்",
    quickActions: "விரைவுப் பாதுகாப்புக் கருவிகள்",
    safeWalk: "பாதுகாப்பான பாதை திட்டமிடு",
    safeWalkDesc: "AI ஒளிமயமான பாதை பகுப்பாய்வு மற்றும் நிகழ்நேர அபாய மதிப்பீடு",
    startJourney: "பயணத்தைக் கண்கானி",
    startJourneyDesc: "வருகை நேரக் கணிப்பு மற்றும் தாமத எச்சரிக்கைகளுடன் பயணம்",
    fileReport: "சம்பவத்தைப் பதிவு செய்",
    fileReportDesc: "ரகசிய குறியீட்டுடன் கூடிய அநாமதேய அறிக்கை",
    evidenceVault: "சான்று பெட்டகம்",
    evidenceVaultDesc: "மீடியா மற்றும் நேர முத்திரையிடப்பட்ட கோப்புகளின் பாதுகாப்பகம்",
    routeComparison: "AI பாதுகாப்பான வழிப் பரிந்துரை",
    saferRoute: "பாதுகாப்பான வழி (பரிந்துரைக்கப்படும்)",
    saferRouteDesc: "98% நல்ல வெளிச்சம், 250 மீட்டருக்கு ஒரு பாதுகாப்பு மையம்",
    fastestRoute: "குறுகிய வழி (எச்சரிக்கை)",
    fastestRouteDesc: "4 நிமிடம் மிச்சம், ஆனால் இருண்ட பாதையைக் கடக்கிறது",
    safetyScore: "பாதுகாப்பு மதிப்பெண்",
    eta: "வருகை நேரம்",
    distance: "தூரம்",
    cctvCoverage: "CCTV பாதுகாப்பு",
    illumination: "தெரு விளக்குகள்",
    safeHavensNearby: "அருகிலுள்ள புகலிடங்கள்",
    aiInsightTitle: "AI இடர் மாதிரி பகுப்பாய்வு",
    aiInsightText: "இரவு 9:30 மணிக்கு மேல் குறுக்குச் சாலையில் இடர் அதிகம். பிரதான சாலையை அமைப்பு தேர்வு செய்தது.",
    transportMode: "போக்குவரத்து முறை",
    vehicleNumber: "வாகனப் பதிவு எண்",
    vehiclePlaceholder: "எ.கா: KA-05-MJ-9821 (ஆட்டோ / கார்)",
    driverName: "ஓட்டுநர் பெயர் (விருப்பத்திற்குரியது)",
    destination: "செல்ல வேண்டிய இடம்",
    destinationPlaceholder: "வீடு அல்லது அலுவலக முகவரி",
    expectedMinutes: "பயண நேரம் (நிமிடங்கள்)",
    startMonitoring: "பயணக் கண்காணிப்பைத் தொடங்கு",
    activeJourney: "பயணக் கண்காணிப்பு செயலில் உள்ளது",
    arrivalConfirmation: "நான் பாதுகாப்பாக வந்துவிட்டேன்",
    cancelJourney: "பயணத்தை முடி",
    reportCategory: "சம்பவ வகை",
    severityLevel: "தீவிர நிலை",
    incidentDesc: "சம்பவ விவரம் (விருப்பத்திற்குரியது)",
    anonymousConsent: "முழுமையாக அநாமதேயமாக சமர்ப்பிக்கவும்",
    submitReport: "ரகசிய அறிக்கையை அனுப்பு",
    complaintHistory: "புகார் கண்காணிப்பு",
    vaultTitle: "சான்று பெட்டகம்",
    vaultNotice: "கோப்புகள் AES-256 கொண்டு உங்கள் சாதனத்தில் பாதுகாக்கப்படுகின்றன.",
    uploadEvidence: "சான்றை பதிவேற்று",
    recordAudio: "ரகசிய ஒலிப்பதிவு",
    disguiseNotice: "மறைமுக கால்குலேட்டரிலிருந்து வெளியேற 9999= ஐ அழுத்தவும்",
    incomingCall: "உள்வரும் அழைப்பு...",
    callerMom: "அம்மா (வீடு)",
    acceptCall: "ஏற்றுக்கொள்",
    declineCall: "நிராகரி",
    callDuration: "அழைப்பு தொடர்கிறது...",
    endCall: "அழைப்பை முடி",
    dispatchQueue: "அவசரக் காவல் வரிசை",
    activeIncidents: "செயலில் உள்ள சம்பவங்கள்",
    resolveAction: "ஏற்றுக்கொண்டு குழுவை அனுப்பு",
    adminMetrics: "தளத்தின் ஒருமைப்பாடு",
    verifiedSafePoints: "சரிபார்க்கப்பட்ட மையங்கள்",
    activeUsers: "செயலில் உள்ள பயனர்கள்",
    avgResponseTime: "சராசரி உதவி நேரம்"
  },
  te: {
    appName: "SafeCircle",
    tagline: "మీ రక్షణ. మీ వలయం. మీ హక్కు.",
    subTagline: "మహిళల భద్రత కోసం గోప్యతా-ఆధారిత AI ప్లాట్‌ఫారమ్",
    navHome: "డాష్‌బోర్డ్",
    navMap: "సురక్షిత మార్గాలు",
    navJourney: "జర్నీ గార్డియన్",
    navReports: "ఫిర్యాదు & వాల్ట్",
    navAuthority: "డిస్పాచ్ పోర్టల్",
    navAdmin: "అడ్మిన్ కన్సోల్",
    navGuardian: "గార్డియన్ వీక్షణ",
    roleWoman: "మహిళ / వినియోగదారు",
    roleGuardian: "సంరక్షకుడు / కుటుంబం",
    rolePolice: "పోలీసులు / అధికారులు",
    roleAdmin: "సిస్టమ్ అడ్మిన్",
    statusSafe: "మీరు ప్రస్తుతం సురక్షితంగా ఉన్నారు",
    statusSafeDesc: "లైవ్ GPS యాక్టివ్ • గార్డియన్ సర్కిల్ సిద్ధంగా ఉంది",
    statusEmergency: "అత్యవసర ప్రసారం యాక్టివ్‌లో ఉంది",
    statusEmergencyDesc: "లైవ్ లొకేషన్ మరియు ఆడియో సంరక్షకులకు పంపబడ్డాయి",
    sosButton: "SOS",
    sosTriggered: "సైలెంట్ SOS ప్రారంభమవుతోంది...",
    sosCountdownNotice: "అత్యవసర హెచ్చరిక వెళ్లే సమయం",
    sosCancel: "రద్దు చేయి — నేను సురక్షితంగా ఉన్నాను",
    sosConfirmTitle: "సైలెంట్ SOS పంపబడింది",
    sosConfirmDesc: "మీ 3 ప్రాథమిక సంరక్షకులకు అత్యవసర సమాచారం పంపబడింది.",
    fakeCallBtn: "ఫేక్ కాల్ ఎస్కేప్",
    calculatorBtn: "రహస్య మోడ్",
    activeLocation: "ఇందిరా నగర్ 100 అడుగుల రోడ్డు, బెంగళూరు",
    batteryLevel: "బ్యాటరీ: 84%",
    gpsAccuracy: "GPS: ±4m ఖచ్చితత్వం",
    guardianCircle: "గార్డియన్ సర్కిల్",
    addGuardian: "గార్డియన్‌ను జోడించండి",
    quickActions: "త్వరిత భద్రతా సాధనాలు",
    safeWalk: "సురక్షిత మార్గ ప్లానర్",
    safeWalkDesc: "AI రూట్ విశ్లేషణ మరియు రియల్-టైమ్ రిస్క్ మూల్యాంకనం",
    startJourney: "జర్నీ ట్రాకింగ్ ప్రారంభించండి",
    startJourneyDesc: "ETA కౌంట్‌డౌన్ మరియు అలర్ట్‌లతో ప్రయాణం",
    fileReport: "సంఘటనను నివేదించండి",
    fileReportDesc: "తక్షణ కేసు ట్రాకింగ్‌తో అనామక నివేదిక",
    evidenceVault: "సాక్ష్యాల వాల్ట్",
    evidenceVaultDesc: "ఎన్‌క్రిప్ట్ చేయబడిన మీడియా మరియు టైమ్‌స్టాంప్ చేసిన లాగ్‌లు",
    routeComparison: "AI సురక్షిత మార్గ సిఫార్సు",
    saferRoute: "సురక్షితమైన మార్గం (సిఫార్సు చేయబడింది)",
    saferRouteDesc: "98% వెలుతురు ఉన్న వీధులు, ప్రతి 250 మీటర్లకు సేఫ్ పాయింట్",
    fastestRoute: "తక్కువ దూరం మార్గం (హెచ్చరిక)",
    fastestRouteDesc: "4 నిమిషాలు ఆదా అవుతుంది, కానీ చీకటి సందుల గుండా వెళుతుంది",
    safetyScore: "భద్రతా స్కోరు",
    eta: "చేరే సమయం",
    distance: "దూరం",
    cctvCoverage: "CCTV రక్షణ",
    illumination: "వీధి దీపాలు",
    safeHavensNearby: "సమీపంలోని సేఫ్ పాయింట్లు",
    aiInsightTitle: "AI రిస్క్ ప్యాటర్న్ అంతర్దృష్టి",
    aiInsightText: "రాత్రి 9:30 తర్వాత క్రాస్ రోడ్ 4 వద్ద ప్రమాదం ఎక్కువ. సిస్టమ్ ప్రధాన రహదారిని ఎంచుకుంది.",
    transportMode: "రవాణా మోడ్ ఎంచుకోండి",
    vehicleNumber: "వాహనం / క్యాబ్ నంబర్",
    vehiclePlaceholder: "ఉదా., KA-05-MJ-9821 (ఆటో / క్యాబ్)",
    driverName: "డ్రైవర్ పేరు (ఐచ్ఛికం)",
    destination: "చేరుకోవలసిన ప్రదేశం",
    destinationPlaceholder: "ఇంటి లేదా ఆఫీసు చిరునామా",
    expectedMinutes: "అంచనా సమయం (నిమిషాలు)",
    startMonitoring: "ట్రాకింగ్ ప్రారంభించండి",
    activeJourney: "ప్రయాణ పర్యవేక్షణ కొనసాగుతోంది",
    arrivalConfirmation: "నేను సురక్షితంగా చేరుకున్నాను",
    cancelJourney: "ప్రయాణం ముగించు",
    reportCategory: "సంఘటన వర్గం",
    severityLevel: "తీవ్రత స్థాయి",
    incidentDesc: "వివరాలు తెలియజేయండి",
    anonymousConsent: "పూర్తిగా అనామకంగా సమర్పించండి",
    submitReport: "ఎన్‌క్రిప్ట్ చేసిన నివేదికను పంపండి",
    complaintHistory: "ఫిర్యాదు ట్రాకర్",
    vaultTitle: "ఎన్‌క్రిప్టెడ్ సాక్ష్యాల నిల్వ",
    vaultNotice: "ఫైల్స్ పరికరంలోనే AES-256 తో భద్రపరచబడతాయి.",
    uploadEvidence: "సాక్ష్యం అప్‌లోడ్ చేయండి",
    recordAudio: "ఆడియో రికార్డ్ చేయండి",
    disguiseNotice: "కాలిక్యులేటర్ నుండి బయటపడటానికి 9999= టైప్ చేయండి",
    incomingCall: "ఇన్‌కమింగ్ కాల్...",
    callerMom: "అమ్మ (ఇల్లు)",
    acceptCall: "లిఫ్ట్ చేయి",
    declineCall: "కట్ చేయి",
    callDuration: "కాల్ కొనసాగుతోంది...",
    endCall: "కాల్ ముగించు",
    dispatchQueue: "ఎమర్జెన్సీ డిస్పాచ్ క్యూ",
    activeIncidents: "యాక్టివ్ కేసులు",
    resolveAction: "అంగీకరించి బృందాన్ని పంపండి",
    adminMetrics: "ప్లాట్‌ఫారమ్ స్థితిగతులు",
    verifiedSafePoints: "ధృవీకరించబడిన కేంద్రాలు",
    activeUsers: "యాక్టివ్ వినియోగదారులు",
    avgResponseTime: "సగటు సహాయ సమయం"
  },
  ml: {
    appName: "SafeCircle",
    tagline: "നിങ്ങളുടെ സുരക്ഷ. നിങ്ങളുടെ വൃത്തം. നിങ്ങളുടെ അവകാശം.",
    subTagline: "സ്ത്രീകളുടെ സുരക്ഷയ്‌ക്കായി സ്വകാര്യത അടിസ്ഥാനമാക്കിയുള്ള AI പ്ലാറ്റ്‌ഫോം",
    navHome: "ഡാഷ്‌ബോർഡ്",
    navMap: "സുരക്ഷിത പാതകൾ",
    navJourney: "യാത്രാ സംരക്ഷകൻ",
    navReports: "റിപ്പോർട്ടുകൾ & വോൾട്ട്",
    navAuthority: "പോലീസ് പോർട്ടൽ",
    navAdmin: "അഡ്മിൻ പാനൽ",
    navGuardian: "രക്ഷിതാവിന്റെ കാഴ്‌ച",
    roleWoman: "വനിത / ഉപയോക്താവ്",
    roleGuardian: "രക്ഷിതാവ് / കുടുംബം",
    rolePolice: "പോലീസ് / അധികാരികൾ",
    roleAdmin: "സിസ്റ്റം അഡ്മിൻ",
    statusSafe: "നിങ്ങൾ ഇപ്പോൾ സുരക്ഷിതയാണ്",
    statusSafeDesc: "തത്സമയ GPS സജീവം • രക്ഷാകർതൃ വൃത്തം സജ്ജമാണ്",
    statusEmergency: "അടിയന്തര സഹായ സംപ്രേക്ഷണം സജീവം",
    statusEmergencyDesc: "തത്സമയ വിവരങ്ങളും ഓഡിയോയും രക്ഷിതാക്കൾക്ക് കൈമാറി",
    sosButton: "SOS",
    sosTriggered: "നിശ്ശബ്ദ SOS ആരംഭിക്കുന്നു...",
    sosCountdownNotice: "അടിയന്തര സന്ദേശം അയയ്‌ക്കുന്ന സമയം",
    sosCancel: "റദ്ദാക്കുക — ഞാൻ സുരക്ഷിതയാണ്",
    sosConfirmTitle: "നിശ്ശബ്ദ SOS അയച്ചു",
    sosConfirmDesc: "നിങ്ങളുടെ 3 പ്രധാന രക്ഷിതാക്കൾക്ക് അടിയന്തര സന്ദേശം കൈമാറി.",
    fakeCallBtn: "വ്യാജ കോൾ",
    calculatorBtn: "രഹസ്യ മോഡ്",
    activeLocation: "ഇന്ദിരാ നഗർ 100 അടി റോഡ്, ബെംഗളൂരു",
    batteryLevel: "ബാറ്ററി: 84%",
    gpsAccuracy: "GPS: ±4m കൃത്യത",
    guardianCircle: "രക്ഷാകർതൃ വൃത്തം",
    addGuardian: "രക്ഷിതാവിനെ ചേർക്കുക",
    quickActions: "ദ്രുത സുരക്ഷാ ഉപകരണങ്ങൾ",
    safeWalk: "സുരക്ഷിത റൂട്ട് പ്ലാനർ",
    safeWalkDesc: "AI അടിസ്ഥാനമാക്കിയുള്ള റൂട്ട് വിശകലനം",
    startJourney: "യാത്ര ട്രാക്ക് ചെയ്യുക",
    startJourneyDesc: "ETA കൗണ്ട്ഡൗണും മുന്നറിയിപ്പുകളും സഹിതം",
    fileReport: "സംഭവം റിപ്പോർട്ട് ചെയ്യുക",
    fileReportDesc: "കേസ് ട്രാക്കിംഗ് ഉള്ള അജ്ഞാത റിപ്പോർട്ടിംഗ്",
    evidenceVault: "തെളിവ് വോൾട്ട്",
    evidenceVaultDesc: "എൻക്രിപ്റ്റ് ചെയ്ത മീഡിയയും വിവരങ്ങളും",
    routeComparison: "AI സുരക്ഷിത പാത ശുപാർശ",
    saferRoute: "സുരക്ഷിതമായ പാത (ശുപാർശ ചെയ്യുന്നത്)",
    saferRouteDesc: "98% പ്രകാശമുള്ള വീഥികൾ, ഓരോ 250 മീറ്ററിലും സുരക്ഷിത കേന്ദ്രങ്ങൾ",
    fastestRoute: "എളുപ്പവഴി (ശ്രദ്ധിക്കുക)",
    fastestRouteDesc: "4 മിനിറ്റ് ലാഭിക്കാം, എന്നാൽ വെളിച്ചം കുറവുള്ള വഴികളിലൂടെയാണ്",
    safetyScore: "സുരക്ഷാ സ്കോർ",
    eta: "എത്തുന്ന സമയം",
    distance: "ദൂരം",
    cctvCoverage: "CCTV നിരീക്ഷണം",
    illumination: "തെരുവ് വിളക്കുകൾ",
    safeHavensNearby: "അടുത്തുള്ള അഭയകേന്ദ്രങ്ങൾ",
    aiInsightTitle: "AI റിസ്ക് പാറ്റേൺ ഉൾക്കാഴ്ച",
    aiInsightText: "രാത്രി 9:30 ന് ശേഷം ക്രോസ് റോഡ് 4 ൽ അപകടസാധ്യത കൂടുതലാണ്. പ്രധാന റോഡ് തിരഞ്ഞെടുക്കുക.",
    transportMode: "യാത്രാ മാർഗ്ഗം",
    vehicleNumber: "വാഹന നമ്പർ",
    vehiclePlaceholder: "ഉദാ., KA-05-MJ-9821 (ഓട്ടോ / കാബ്)",
    driverName: "ഡ്രൈവറുടെ പേര് (ഓപ്ഷണൽ)",
    destination: "എത്തിച്ചേരേണ്ട സ്ഥലം",
    destinationPlaceholder: "വീട്ടിലെ അല്ലെങ്കിൽ ഓഫീസിലെ വിലാസം",
    expectedMinutes: "പ്രതീക്ഷിക്കുന്ന സമയം (മിനിറ്റ്)",
    startMonitoring: "യാത്രാ നിരീക്ഷണം തുടങ്ങുക",
    activeJourney: "യാത്രാ നിരീക്ഷണം തുടരുന്നു",
    arrivalConfirmation: "ഞാൻ സുരക്ഷിതമായി എത്തിച്ചേർന്നു",
    cancelJourney: "യാത്ര പൂർത്തിയാക്കുക",
    reportCategory: "സംഭവ വിഭാഗം",
    severityLevel: "തീവ്രത നില",
    incidentDesc: "വിശദാംശങ്ങൾ നൽകുക",
    anonymousConsent: "പൂർണ്ണമായും അജ്ഞാതമായി സമർപ്പിക്കുക",
    submitReport: "എൻക്രിപ്റ്റ് ചെയ്ത റിപ്പോർട്ട് അയക്കുക",
    complaintHistory: "പരാതി ട്രാക്കർ",
    vaultTitle: "സുരക്ഷിത തെളിവ് ശേഖരം",
    vaultNotice: "ഫയലുകൾ ഉപകരണത്തിൽ തന്നെ AES-256 ഉപയോഗിച്ച് സുരക്ഷിതമാക്കുന്നു.",
    uploadEvidence: "തെളിവ് അപ്‌ലോഡ് ചെയ്യുക",
    recordAudio: "ഓഡിയോ റെക്കോർഡ് ചെയ്യുക",
    disguiseNotice: "കാൽക്കുലേറ്ററിൽ നിന്ന് പുറത്തുകടക്കാൻ 9999= അമർത്തുക",
    incomingCall: "ഇൻകമിംഗ് കോൾ...",
    callerMom: "അമ്മ (വീട്)",
    acceptCall: "എടുക്കുക",
    declineCall: "കട്ട് ചെയ്യുക",
    callDuration: "സംഭാഷണം തുടരുന്നു...",
    endCall: "കോൾ അവസാനിപ്പിക്കുക",
    dispatchQueue: "എമർജൻസി ഡിസ്പാച്ച് ലിസ്റ്റ്",
    activeIncidents: "സജീവ കേസുകൾ",
    resolveAction: "സ്ഥിരീകരിച്ച് സേനയെ അയക്കുക",
    adminMetrics: "സിസ്റ്റം മേൽനോട്ടം",
    verifiedSafePoints: "സ്ഥിരീകരിച്ച സുരക്ഷിത കേന്ദ്രങ്ങൾ",
    activeUsers: "സജീവ ഉപയോക്താക്കൾ",
    avgResponseTime: "ശരാശരി പ്രതികരണ സമയം"
  },
  kn: {
    appName: "SafeCircle",
    tagline: "ನಿಮ್ಮ ರಕ್ಷಣೆ. ನಿಮ್ಮ ವಲಯ. ನಿಮ್ಮ ಆಯ್ಕೆ.",
    subTagline: "ಮಹಿಳೆಯರ ಮತ್ತು ಸಮಾಜದ ಸುರಕ್ಷತೆಗಾಗಿ ಗೌಪ್ಯತಾ-ಆಧಾರಿತ AI ವೇದಿಕೆ",
    navHome: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navMap: "ಸುರಕ್ಷಿತ ಮಾರ್ಗಗಳು",
    navJourney: "ಜರ್ನಿ ಗಾರ್ಡಿಯನ್",
    navReports: "ವರದಿಗಳು & ವಾಲ್ಟ್",
    navAuthority: "ಪೊಲೀಸ್ ಪೋರ್ಟಲ್",
    navAdmin: "ಅಡ್ಮಿನ್ ಕನ್ಸೋಲ್",
    navGuardian: "ಪೋಷಕರ ನೋಟ",
    roleWoman: "ಮಹಿಳೆ / ಬಳಕೆದಾರ",
    roleGuardian: "ಪೋಷಕರು / ಕುಟುಂಬ",
    rolePolice: "ಪೊಲೀಸ್ / ಪ್ರಾಧಿಕಾರ",
    roleAdmin: "ವ್ಯವಸ್ಥಾಪಕರು",
    statusSafe: "ನೀವು ಪ್ರಸ್ತುತ ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಿ",
    statusSafeDesc: "ಲೈವ್ GPS ಸಕ್ರಿಯವಾಗಿದೆ • ರಕ್ಷಕರ ವಲಯ ಸಿದ್ಧವಾಗಿದೆ",
    statusEmergency: "ತುರ್ತು ಪ್ರಸಾರ ಸಕ್ರಿಯವಾಗಿದೆ",
    statusEmergencyDesc: "ಲೈವ್ ಸ್ಥಳ ಮತ್ತು ಆಡಿಯೊ ವಿವರಗಳನ್ನು ರಕ್ಷಕರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ",
    sosButton: "SOS",
    sosTriggered: "ಮೌನ SOS ಪ್ರಾರಂಭವಾಗುತ್ತಿದೆ...",
    sosCountdownNotice: "ತುರ್ತು ಕರೆ ರವಾನೆಯಾಗುವ ಸಮಯ",
    sosCancel: "ರದ್ದುಮಾಡಿ — ನಾನು ಸುರಕ್ಷಿತವಾಗಿದ್ದೇನೆ",
    sosConfirmTitle: "ಮೌನ SOS ರವಾನಿಸಲಾಗಿದೆ",
    sosConfirmDesc: "ನಿಮ್ಮ 3 ಪ್ರಮುಖ ರಕ್ಷಕರಿಗೆ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ.",
    fakeCallBtn: "ನಕಲಿ ಕರೆ ರಕ್ಷಣೆ",
    calculatorBtn: "ರಹಸ್ಯ ಮೋಡ್",
    activeLocation: "ಇಂದಿರಾನಗರ 100 ಅಡಿ ರಸ್ತೆ, ಬೆಂಗಳೂರು",
    batteryLevel: "ಬ್ಯಾಟರಿ: 84%",
    gpsAccuracy: "GPS: ±4m ನಿಖರತೆ",
    guardianCircle: "ರಕ್ಷಕರ ವಲಯ",
    addGuardian: "ರಕ್ಷಕರನ್ನು ಸೇರಿಸಿ",
    quickActions: "ತ್ವರಿತ ಸುರಕ್ಷತಾ ಪರಿಕರಗಳು",
    safeWalk: "ಸುರಕ್ಷಿತ ಮಾರ್ಗ ಯೋಜಕ",
    safeWalkDesc: "AI ಮಾರ್ಗ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ನೈಜ-ಸಮಯದ ಅಪಾಯ ಮೌಲ್ಯಮಾಪನ",
    startJourney: "ಪ್ರಯಾಣವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    startJourneyDesc: "ETA ಕೌಂಟ್‌ಡೌನ್ ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳೊಂದಿಗೆ ಪ್ರಯಾಣ",
    fileReport: "ಘಟನೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    fileReportDesc: "ತ್ವರಿತ ಪ್ರಕರಣ ಟ್ರ್ಯಾಕಿಂಗ್‌ನೊಂದಿಗೆ ಅನಾಮಧೇಯ ವರದಿ",
    evidenceVault: "ಸಾಕ್ಷ್ಯ ವಾಲ್ಟ್",
    evidenceVaultDesc: "ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಮಾಧ್ಯಮ ಮತ್ತು ದಾಖಲೆಗಳು",
    routeComparison: "AI ಸುರಕ್ಷಿತ ಮಾರ್ಗ ಶಿಫಾರಸು",
    saferRoute: "ಹೆಚ್ಚು ಸುರಕ್ಷಿತ ಮಾರ್ಗ (ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ)",
    saferRouteDesc: "98% ಬೆಳಕಿನ ರಸ್ತೆಗಳು, ಪ್ರತಿ 250 ಮೀಟರ್‌ಗೆ ಸುರಕ್ಷಿತ ತಾಣಗಳು",
    fastestRoute: "ಹತ್ತಿರದ ಮಾರ್ಗ (ಎಚ್ಚರಿಕೆ)",
    fastestRouteDesc: "4 ನಿಮಿಷ ಉಳಿತಾಯ, ಆದರೆ ಕತ್ತಲೆಯ ಗಲ್ಲಿಗಳ ಮೂಲಕ ಸಾಗುತ್ತದೆ",
    safetyScore: "ಸುರಕ್ಷತಾ ಅಂಕ",
    eta: "ತಲುಪುವ ಸಮಯ",
    distance: "ದೂರ",
    cctvCoverage: "CCTV ಕವರೇಜ್",
    illumination: "ಬೀದಿ ದೀಪಗಳು",
    safeHavensNearby: "ಹತ್ತಿರದ ಸುರಕ್ಷಿತ ಕೇಂದ್ರಗಳು",
    aiInsightTitle: "AI ಅಪಾಯದ ಮಾದರಿ ಒಳನೋಟ",
    aiInsightText: "ರಾತ್ರಿ 9:30 ರ ನಂತರ ಕ್ರಾಸ್ ರೋಡ್ 4 ರಲ್ಲಿ ಹೆಚ್ಚಿನ ಅಪಾಯವಿದೆ. ಮುಖ್ಯ ರಸ್ತೆಯನ್ನು ಬಳಸಿ.",
    transportMode: "ಸಾರಿಗೆ ವಿಧಾನ ಆಯ್ಕೆಮಾಡಿ",
    vehicleNumber: "ವಾಹನ ನೋಂದಣಿ ಸಂಖ್ಯೆ",
    vehiclePlaceholder: "ಉದಾ., KA-05-MJ-9821 (ಕ್ಯಾಬ್ / ಆಟೋ)",
    driverName: "ಚಾಲಕರ ಹೆಸರು (ಐಚ್ಛಿಕ)",
    destination: "ತಲುಪಬೇಕಾದ ಸ್ಥಳ",
    destinationPlaceholder: "ಮನೆ ಅಥವಾ ಕಚೇರಿ ವಿಳಾಸ ನಮೂದಿಸಿ",
    expectedMinutes: "ಅಂದಾಜು ಸಮಯ (ನಿಮಿಷಗಳು)",
    startMonitoring: "ಪ್ರಯಾಣದ ಮೇಲ್ವಿಚಾರಣೆ ಪ್ರಾರಂಭಿಸಿ",
    activeJourney: "ಪ್ರಯಾಣದ ಮೇಲ್ವಿಚಾರಣೆ ಸಕ್ರಿಯವಾಗಿದೆ",
    arrivalConfirmation: "ನಾನು ಸುರಕ್ಷಿತವಾಗಿ ತಲುಪಿದ್ದೇನೆ",
    cancelJourney: "ಪ್ರಯಾಣ ಮುಗಿಸಿ",
    reportCategory: "ಘಟನೆಯ ವರ್ಗ",
    severityLevel: "ತೀವ್ರತೆಯ ಮಟ್ಟ",
    incidentDesc: "ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ",
    anonymousConsent: "ಸಂಪೂರ್ಣ ಅನಾಮಧೇಯವಾಗಿ ಸಲ್ಲಿಸಿ",
    submitReport: "ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ವರದಿ ಕಳುಹಿಸಿ",
    complaintHistory: "ದೂರು ಟ್ರ್ಯಾಕರ್",
    vaultTitle: "ಸಾಕ್ಷ್ಯ ವಾಲ್ಟ್",
    vaultNotice: "ಫೈಲ್‌ಗಳನ್ನು ಸಾಧನದಲ್ಲಿಯೇ AES-256 ನೊಂದಿಗೆ ಸುರಕ್ಷಿತಗೊಳಿಸಲಾಗಿದೆ.",
    uploadEvidence: "ಸಾಕ್ಷ್ಯ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    recordAudio: "ಧ್ವನಿಮುದ್ರಣ ಮಾಡಿ",
    disguiseNotice: "ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಮುಚ್ಚಲು 9999= ಒತ್ತಿ",
    incomingCall: "ಒಳಬರುವ ಕರೆ...",
    callerMom: "ಅಮ್ಮ (ಮನೆ)",
    acceptCall: "ಸ್ವೀಕರಿಸಿ",
    declineCall: "ತಿರಸ್ಕರಿಸಿ",
    callDuration: "ಕರೆ ಮುಂದುವರಿದಿದೆ...",
    endCall: "ಕರೆ ಮುಗಿಸಿ",
    dispatchQueue: "ತುರ್ತು ರವಾನೆ ಸರತಿ ಸಾಲು",
    activeIncidents: "ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು",
    resolveAction: "ಒಪ್ಪಿಕೊಂಡು ತಂಡವನ್ನು ಕಳುಹಿಸಿ",
    adminMetrics: "ವೇದಿಕೆಯ ಸ್ಥಿತಿಗತಿ",
    verifiedSafePoints: "ದೃಢೀಕೃತ ಸುರಕ್ಷಿತ ಕೇಂದ್ರಗಳು",
    activeUsers: "ಸಕ್ರಿಯ ಬಳಕೆದಾರರು",
    avgResponseTime: "ಸರಾಸರಿ ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ"
  }
};

/* ==========================================================================
   2. MOCK DATASETS & CONSTANTS
   ========================================================================== */
const INITIAL_GUARDIANS = [
  { id: 'g1', name: 'Dr. Neha Verma', relation: 'Sister', phone: '+91 98765 43210', priority: 1, battery: 92, status: 'Active' },
  { id: 'g2', name: 'Rajesh Sen', relation: 'Father', phone: '+91 94451 88921', priority: 2, battery: 78, status: 'Active' },
  { id: 'g3', name: 'Ananya Rao', relation: 'Friend / Roommate', phone: '+91 91234 56789', priority: 3, battery: 64, status: 'Standby' }
];

const INITIAL_SAFE_POINTS = [
  { id: 'sp1', name: 'Apollo 24/7 Pharmacy', type: 'Pharmacy', address: '12th Main Rd, Indiranagar', distance: '140m', openNow: true, x: 260, y: 190 },
  { id: 'sp2', name: 'Indiranagar Police Station', type: 'Police', address: 'CMH Road Junction', distance: '380m', openNow: true, x: 420, y: 120 },
  { id: 'sp3', name: 'Cafe Coffee Day (24/7)', type: 'Cafe/SafeHaven', address: '100ft Road Corner', distance: '210m', openNow: true, x: 180, y: 310 },
  { id: 'sp4', name: 'Metro Security Helpdesk', type: 'Transit', address: 'Indiranagar Metro Gate 2', distance: '450m', openNow: true, x: 510, y: 270 }
];

const INITIAL_REPORTS = [
  { id: 'CR-8821', category: 'Poor Lighting', severity: 'Medium', location: '80ft Road Underpass', time: 'Yesterday, 10:15 PM', status: 'Action Taken', notes: 'Municipal crew dispatched; dual 150W LED fixtures installed.' },
  { id: 'CR-8819', category: 'Unsafe Loitering / Stalking', severity: 'High', location: 'Cross 4 Metro Exit', time: 'Sep 22, 9:40 PM', status: 'Under Review', notes: 'Forwarded to local PCR patrol unit 12 for night rounds.' },
  { id: 'CR-8804', category: 'Unregistered Transport', severity: 'Critical', location: 'Old Airport Road', time: 'Sep 20, 11:20 PM', status: 'Closed', notes: 'Vehicle identified and flagged at transport department.' }
];

const INITIAL_VAULT_FILES = [
  { id: 'vf-1', name: 'Audio_Log_NightWalk_2209.enc', type: 'audio', size: '2.4 MB', timestamp: '2026-09-22 22:45', hash: 'e3b0c442...98af' },
  { id: 'vf-2', name: 'Auto_Plate_KA05MJ9821.enc', type: 'image', size: '4.1 MB', timestamp: '2026-09-20 23:12', hash: '8f4b2311...c291' },
  { id: 'vf-3', name: 'Incident_GPS_Breadcrumbs.enc', type: 'document', size: '512 KB', timestamp: '2026-09-18 20:30', hash: '1a2b3c4d...e5f6' }
];

const DISPATCH_CASES = [
  { id: 'DISP-101', priority: 'Critical', alertType: 'Silent SOS', user: 'Anjali V. (+91 98451 ***21)', location: 'Indiranagar 100ft Rd near Apollo', etaMinutes: 3, unitAssigned: 'PCR Van #14', time: '2 mins ago' },
  { id: 'DISP-102', priority: 'High', alertType: 'Journey Overdue (+4m)', user: 'Meera K. (+91 97412 ***55)', location: 'Old Airport Road Junction', etaMinutes: 6, unitAssigned: 'Beat Patrol 08', time: '7 mins ago' },
  { id: 'DISP-103', priority: 'Medium', alertType: 'Suspicious Vehicle Report', user: 'Anonymous Reporter', location: 'CMH Road Metro Pillar 42', etaMinutes: 11, unitAssigned: 'Traffic Squad 3', time: '18 mins ago' }
];

/* ==========================================================================
   3. MAIN COMPONENT (EXPORTED AS DEFAULT)
   ========================================================================== */
export default function App() {
  // Theme & Language State
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | map | journey | reports | vault
  const [currentRole, setCurrentRole] = useState('woman'); // woman | guardian | police | admin

  // Emergency SOS State
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosDispatched, setSosDispatched] = useState(false);
  const countdownTimerRef = useRef(null);

  // Fake Call State
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [callAnswered, setCallAnswered] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef(null);

  // Discreet Calculator Disguise Mode
  const [calculatorMode, setCalculatorMode] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');

  // Interactive Route Planner State
  const [selectedRoute, setSelectedRoute] = useState('safer'); // safer | shortest
  const [selectedSafePoint, setSelectedSafePoint] = useState(null);

  // Journey Guardian State
  const [journeyActive, setJourneyActive] = useState(false);
  const [journeyMode, setJourneyMode] = useState('cab'); // cab | bus | walking | metro
  const [vehicleReg, setVehicleReg] = useState('KA-05-MJ-9821');
  const [driverName, setDriverName] = useState('Ramesh Gowda');
  const [destination, setDestination] = useState('HSR Layout Sector 2');
  const [tripMinutes, setTripMinutes] = useState(25);
  const [tripRemainingSeconds, setTripRemainingSeconds] = useState(25 * 60);
  const [safeArrivalNotice, setSafeArrivalNotice] = useState(false);

  // Incident Reports & Vault State
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [newReportCategory, setNewReportCategory] = useState('Harassment');
  const [newReportSeverity, setNewReportSeverity] = useState('High');
  const [newReportDesc, setNewReportDesc] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reportSuccessBanner, setReportSuccessBanner] = useState(false);

  // Vault Files
  const [vaultFiles, setVaultFiles] = useState(INITIAL_VAULT_FILES);
  const [vaultPassword, setVaultPassword] = useState('••••••••');
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultPreviewFile, setVaultPreviewFile] = useState(null);
  const [uploadMockToast, setUploadMockToast] = useState('');

  // Mobile Menu Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Translation Helper
  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.en, [lang]);

  // Synchronize document theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // SOS Countdown Timer Engine
  useEffect(() => {
    if (sosActive && !sosDispatched) {
      if (sosCountdown > 0) {
        countdownTimerRef.current = setTimeout(() => {
          setSosCountdown((prev) => prev - 1);
        }, 1000);
      } else {
        setSosDispatched(true);
      }
    }
    return () => clearTimeout(countdownTimerRef.current);
  }, [sosActive, sosCountdown, sosDispatched]);

  const handleStartSOS = () => {
    setSosActive(true);
    setSosCountdown(5);
    setSosDispatched(false);
  };

  const handleCancelSOS = () => {
    setSosActive(false);
    setSosCountdown(5);
    setSosDispatched(false);
    clearTimeout(countdownTimerRef.current);
  };

  // Fake Call Timer Engine
  useEffect(() => {
    if (callAnswered) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => clearInterval(callTimerRef.current);
  }, [callAnswered]);

  const handleTriggerFakeCall = () => {
    setFakeCallActive(true);
    setCallAnswered(false);
    setCallDuration(0);
  };

  const handleEndFakeCall = () => {
    setFakeCallActive(false);
    setCallAnswered(false);
    setCallDuration(0);
    clearInterval(callTimerRef.current);
  };

  // Calculator Logic with Secret Escape Code "9999="
  const handleCalcClick = (val) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
      return;
    }
    if (val === '=') {
      // Check Secret Escape Code
      if (calcInput === '9999') {
        setCalculatorMode(false);
        setCalcInput('');
        setCalcResult('');
        return;
      }
      try {
        // Safe evaluation of standard arithmetic
        const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized})`)();
        setCalcResult(String(res));
      } catch (err) {
        setCalcResult('Error');
      }
      return;
    }
    setCalcInput((prev) => prev + val);
  };

  // Journey Timer
  useEffect(() => {
    let interval = null;
    if (journeyActive && tripRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTripRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [journeyActive, tripRemainingSeconds]);

  const handleStartJourney = () => {
    setJourneyActive(true);
    setTripRemainingSeconds(tripMinutes * 60);
    setSafeArrivalNotice(false);
  };

  const handleEndJourney = (isSafeArrival = false) => {
    setJourneyActive(false);
    if (isSafeArrival) {
      setSafeArrivalNotice(true);
      setTimeout(() => setSafeArrivalNotice(false), 5000);
    }
  };

  // Incident Submission Handler
  const handleNewReportSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `CR-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newReportCategory,
      severity: newReportSeverity,
      location: t.activeLocation,
      time: 'Just now',
      status: 'Under Review',
      notes: 'Encrypted packet received and queued for authority triage.'
    };
    setReports([newEntry, ...reports]);
    setReportModalOpen(false);
    setNewReportDesc('');
    setReportSuccessBanner(true);
    setTimeout(() => setReportSuccessBanner(false), 5000);
  };

  // Mock Upload Evidence
  const handleUploadSim = (type) => {
    const ext = type === 'audio' ? 'enc' : type === 'image' ? 'enc' : 'enc';
    const newFile = {
      id: `vf-${Date.now()}`,
      name: `${type.toUpperCase()}_Evidence_${Math.floor(100 + Math.random() * 900)}.${ext}`,
      type: type,
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      hash: 'a9b2c8...' + Math.random().toString(36).substring(2, 6)
    };
    setVaultFiles([newFile, ...vaultFiles]);
    setUploadMockToast(`Evidence encrypted with AES-256 and stored!`);
    setTimeout(() => setUploadMockToast(''), 4000);
  };

  /* ==========================================================================
     RENDER: DISCREET CALCULATOR DISGUISE MODE
     ========================================================================== */
  if (calculatorMode) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-900'}`}>
        <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Standard Calculator</span>
            <span className="text-[10px] text-zinc-600 font-mono">Stealth Cover</span>
          </div>

          <div className="bg-black/60 rounded-2xl p-4 mb-5 border border-zinc-800 text-right">
            <div className="text-zinc-500 text-sm font-mono h-6 overflow-hidden">{calcInput || '0'}</div>
            <div className="text-3xl font-mono text-emerald-400 font-bold tracking-wider h-10">{calcResult || calcInput || '0'}</div>
          </div>

          <div className="grid grid-cols-4 gap-3 text-lg font-semibold font-mono">
            {['C', '/', '*', '-'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn)}
                className="h-14 rounded-2xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-pink-400 transition-all"
              >
                {btn}
              </button>
            ))}
            {['7', '8', '9', '+'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn)}
                className={`h-14 rounded-2xl active:scale-95 transition-all ${btn === '+' ? 'bg-zinc-800 hover:bg-zinc-700 text-pink-400' : 'bg-zinc-800/60 hover:bg-zinc-800 text-white'}`}
              >
                {btn}
              </button>
            ))}
            {['4', '5', '6', '='].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn)}
                className={`h-14 rounded-2xl active:scale-95 transition-all ${btn === '=' ? 'row-span-2 h-auto bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30' : 'bg-zinc-800/60 hover:bg-zinc-800 text-white'}`}
              >
                {btn}
              </button>
            ))}
            {['1', '2', '3'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn)}
                className="h-14 rounded-2xl bg-zinc-800/60 hover:bg-zinc-800 text-white active:scale-95 transition-all"
              >
                {btn}
              </button>
            ))}
            {['0', '.'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn)}
                className={`h-14 rounded-2xl bg-zinc-800/60 hover:bg-zinc-800 text-white active:scale-95 transition-all ${btn === '0' ? 'col-span-2' : ''}`}
              >
                {btn}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
            <p className="text-[11px] text-zinc-500">{t.disguiseNotice}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0b0f17] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* ==========================================================================
         TOP HEADER BAR
         ========================================================================== */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${theme === 'dark' ? 'bg-[#0b0f17]/90 border-slate-800/80 shadow-black/40' : 'bg-white/90 border-slate-200/90 shadow-slate-200/50'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 shadow-lg shadow-pink-500/25 text-white">
              <Shield className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0b0f17] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20">
                  AI Defense
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">{t.subTagline}</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'map' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              {t.navMap}
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'journey' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              {t.navJourney}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'reports' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              {t.navReports}
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'vault' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              {t.evidenceVault}
            </button>
          </nav>

          {/* Right Header Utilities: Language, Theme, Camouflage, Fake Call, Role Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Quick Camouflage Calculator Trigger */}
            <button
              onClick={() => setCalculatorMode(true)}
              title={t.calculatorBtn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-all active:scale-95"
            >
              <CalcIcon className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">{t.calculatorBtn}</span>
            </button>

            {/* Quick Fake Call Trigger */}
            <button
              onClick={handleTriggerFakeCall}
              title={t.fakeCallBtn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 text-xs font-medium border border-emerald-500/30 transition-all active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">{t.fakeCallBtn}</span>
            </button>

            {/* Multi-Language Selector (6 Regional Languages) */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className={`pl-8 pr-3 py-1.5 rounded-xl text-xs font-medium appearance-none cursor-pointer border transition-colors ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'}`}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ml">മലയാളം (Malayalam)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700 text-amber-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'}`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-900/60 to-pink-900/60 text-pink-300 border border-pink-500/30 cursor-pointer"
              >
                <option value="woman">{t.roleWoman}</option>
                <option value="guardian">{t.roleGuardian}</option>
                <option value="police">{t.rolePolice}</option>
                <option value="admin">{t.roleAdmin}</option>
              </select>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900/95 p-4 space-y-2">
            {[
              { id: 'dashboard', label: t.navHome },
              { id: 'map', label: t.navMap },
              { id: 'journey', label: t.navJourney },
              { id: 'reports', label: t.navReports },
              { id: 'vault', label: t.evidenceVault }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-pink-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ==========================================================================
         ROLE DEMO BANNER: Instant Persona Swapping Bar
         ========================================================================== */}
      <section className="bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-indigo-950/40 border-b border-pink-500/15 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 font-bold uppercase tracking-wider text-[10px]">
              Active Role
            </span>
            <span className="font-semibold text-slate-200">
              {currentRole === 'woman' && t.roleWoman}
              {currentRole === 'guardian' && t.roleGuardian}
              {currentRole === 'police' && t.rolePolice}
              {currentRole === 'admin' && t.roleAdmin}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] hidden md:inline">Quick-Switch Portal:</span>
            {[
              { id: 'woman', label: 'Woman / User' },
              { id: 'guardian', label: 'Guardian' },
              { id: 'police', label: 'Police Dispatch' },
              { id: 'admin', label: 'Admin' }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setCurrentRole(r.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${currentRole === r.id ? 'bg-pink-600 text-white font-bold shadow-sm' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================================
         MAIN CONTENT AREA (SWITCHED BY ROLE OR TAB)
         ========================================================================== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-28 sm:pb-20 space-y-6">

        {/* Global Toast for Success Banners */}
        {reportSuccessBanner && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Incident reported anonymously. Encrypted Case ID generated and tracked in your Complaint Tracker below.</span>
            </div>
            <button onClick={() => setReportSuccessBanner(false)} className="text-emerald-400 hover:text-white text-xs">Dismiss</button>
          </div>
        )}

        {safeArrivalNotice && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs sm:text-sm font-semibold">Safe arrival broadcasted to your Guardian Circle. Trip tracking automatically resolved!</span>
            </div>
          </div>
        )}

        {uploadMockToast && (
          <div className="p-4 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center gap-3 shadow-xl">
            <Lock className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{uploadMockToast}</span>
          </div>
        )}

        {/* ----------------------------------------------------------------------
           ROLE 1: WOMAN / PRIMARY USER (TABS: DASHBOARD, MAP, JOURNEY, REPORTS, VAULT)
           ---------------------------------------------------------------------- */}
        {currentRole === 'woman' && (
          <>
            {/* SUB-VIEW 1: USER DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Hero Status Banner */}
                <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all ${sosDispatched ? 'bg-gradient-to-r from-red-950/90 to-rose-900/80 border-red-500/50 shadow-2xl shadow-red-900/40' : 'bg-gradient-to-r from-pink-950/30 via-slate-900/60 to-purple-950/30 border-pink-500/20 shadow-xl'}`}>
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        {sosDispatched ? t.statusEmergency : t.statusSafe}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        {sosDispatched ? t.statusEmergency : t.tagline}
                      </h1>
                      <p className="text-sm text-slate-300 max-w-xl">
                        {sosDispatched ? t.statusEmergencyDesc : t.statusSafeDesc}
                      </p>
                      
                      {/* Real-time telemetry badges */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <MapPin className="w-3.5 h-3.5 text-pink-400" />
                          {t.activeLocation}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          {t.batteryLevel}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <Compass className="w-3.5 h-3.5 text-blue-400" />
                          {t.gpsAccuracy}
                        </span>
                      </div>
                    </div>

                    {/* Prominent Emergency Action Module */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                      {!sosDispatched ? (
                        <button
                          onClick={handleStartSOS}
                          className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-extrabold text-base tracking-wider uppercase shadow-xl shadow-red-600/40 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95"
                        >
                          <Radio className="w-6 h-6 animate-pulse" />
                          <span>Trigger Silent SOS</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleCancelSOS}
                          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span>{t.sosCancel}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Rapid Action Cards Grid */}
                <div>
                  <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    {t.quickActions}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Safe Walk Card */}
                    <div
                      onClick={() => setActiveTab('map')}
                      className="p-5 rounded-3xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-pink-500/40 transition-all cursor-pointer group shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Navigation className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-pink-400 transition-colors">{t.safeWalk}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.safeWalkDesc}</p>
                      <div className="mt-4 flex items-center text-xs font-semibold text-pink-400 group-hover:translate-x-1 transition-transform">
                        <span>Calculate Routes</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>

                    {/* Journey Guardian Card */}
                    <div
                      onClick={() => setActiveTab('journey')}
                      className="p-5 rounded-3xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 transition-all cursor-pointer group shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Car className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">{t.startJourney}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.startJourneyDesc}</p>
                      <div className="mt-4 flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                        <span>Setup Monitor</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>

                    {/* Anonymous Report Card */}
                    <div
                      onClick={() => {
                        setActiveTab('reports');
                        setReportModalOpen(true);
                      }}
                      className="p-5 rounded-3xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 transition-all cursor-pointer group shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">{t.fileReport}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.fileReportDesc}</p>
                      <div className="mt-4 flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                        <span>Report Instantly</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>

                    {/* Evidence Vault Card */}
                    <div
                      onClick={() => setActiveTab('vault')}
                      className="p-5 rounded-3xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 transition-all cursor-pointer group shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{t.evidenceVault}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.evidenceVaultDesc}</p>
                      <div className="mt-4 flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                        <span>Open Vault</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Guardian Circle & Nearby Safe Havens Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Guardian Circle Contacts */}
                  <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-pink-400" />
                        <h3 className="font-bold text-white text-base">{t.guardianCircle}</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                        3 Linked
                      </span>
                    </div>

                    <div className="space-y-3">
                      {INITIAL_GUARDIANS.map((g) => (
                        <div key={g.id} className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 font-bold flex items-center justify-center text-sm">
                              {g.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{g.name}</p>
                              <p className="text-xs text-slate-400">{g.relation} • {g.phone}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              {g.battery}%
                            </span>
                            <p className="text-[10px] text-slate-500 font-mono">Priority {g.priority}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nearest Verified Safe Points */}
                  <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-bold text-white text-base">{t.safeHavensNearby}</h3>
                      </div>
                      <span className="text-xs text-slate-400">Within 500m</span>
                    </div>

                    <div className="space-y-3">
                      {INITIAL_SAFE_POINTS.map((sp) => (
                        <div key={sp.id} className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                              {sp.type === 'Police' ? <Shield className="w-5 h-5" /> : sp.type === 'Pharmacy' ? <Plus className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{sp.name}</p>
                              <p className="text-xs text-slate-400">{sp.address}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                              {sp.distance}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-1 font-mono">Verified 24/7</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* SUB-VIEW 2: DYNAMIC SAFE ROUTING & INTERACTIVE VECTOR MAP */}
            {activeTab === 'map' && (
              <div className="space-y-6">
                
                {/* Route Header & Control Panel */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/70 border border-slate-800">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <Navigation className="w-6 h-6 text-pink-400" />
                      {t.routeComparison}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Real-time path assessment weighing historical incidents, CCTV coverage, and night illumination.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
                    <button
                      onClick={() => setSelectedRoute('safer')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedRoute === 'safer' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'text-slate-400 hover:text-white'}`}
                    >
                      Safer Route (94 Score)
                    </button>
                    <button
                      onClick={() => setSelectedRoute('shortest')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedRoute === 'shortest' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' : 'text-slate-400 hover:text-white'}`}
                    >
                      Shortest Route (58 Score)
                    </button>
                  </div>
                </div>

                {/* SVG Vector Interactive Map Canvas */}
                <div className="relative w-full h-[420px] rounded-3xl overflow-hidden border border-slate-800 bg-[#070b12] shadow-2xl">
                  
                  {/* SVG Street Grid & Routes */}
                  <svg className="w-full h-full" viewBox="0 0 700 420" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="saferGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="shortestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#172033" strokeWidth="1" />
                      </pattern>
                    </defs>

                    {/* Background Grid & Roads */}
                    <rect width="700" height="420" fill="#070b12" />
                    <rect width="700" height="420" fill="url(#grid)" />

                    {/* Secondary Arterial Roads */}
                    <path d="M 50 150 L 650 150" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
                    <path d="M 50 280 L 650 280" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
                    <path d="M 200 40 L 200 380" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
                    <path d="M 450 40 L 450 380" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />

                    {/* Risk Hotspot Zones (Pulsing Circles) */}
                    <circle cx="340" cy="150" r="45" fill="#ef4444" fillOpacity="0.18" className="animate-pulse" />
                    <circle cx="340" cy="150" r="22" fill="#ef4444" fillOpacity="0.3" />
                    <text x="340" y="145" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">Cross 4 Risk Zone</text>
                    <text x="340" y="160" textAnchor="middle" fill="#fca5a5" fontSize="8">Low Lighting (4 Reports)</text>

                    {/* Shortest Route (Cautionary) Path */}
                    <path
                      d="M 120 280 L 200 280 L 340 150 L 550 150"
                      fill="none"
                      stroke={selectedRoute === 'shortest' ? 'url(#shortestGrad)' : '#78350f'}
                      strokeWidth={selectedRoute === 'shortest' ? '6' : '3'}
                      strokeDasharray={selectedRoute === 'shortest' ? 'none' : '6 6'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={selectedRoute === 'shortest' ? 1 : 0.4}
                    />

                    {/* Safer Route (Recommended) Path */}
                    <path
                      d="M 120 280 L 200 280 L 200 150 L 450 150 L 450 280 L 550 280 L 550 150"
                      fill="none"
                      stroke={selectedRoute === 'safer' ? 'url(#saferGrad)' : '#064e3b'}
                      strokeWidth={selectedRoute === 'safer' ? '6' : '3'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={selectedRoute === 'safer' ? 1 : 0.4}
                    />

                    {/* Origin Pin (Current Location) */}
                    <g transform="translate(120, 280)">
                      <circle r="16" fill="#ec4899" fillOpacity="0.25" className="animate-ping" />
                      <circle r="8" fill="#ec4899" />
                      <circle r="3" fill="#ffffff" />
                      <text x="0" y="-14" textAnchor="middle" fill="#f472b6" fontSize="10" fontWeight="bold">Start (You)</text>
                    </g>

                    {/* Destination Pin */}
                    <g transform="translate(550, 150)">
                      <circle r="14" fill="#8b5cf6" fillOpacity="0.3" />
                      <circle r="8" fill="#8b5cf6" />
                      <text x="0" y="-14" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontWeight="bold">Destination</text>
                    </g>

                    {/* Safe Point Icons Placed on Map */}
                    {INITIAL_SAFE_POINTS.map((sp) => (
                      <g
                        key={sp.id}
                        transform={`translate(${sp.x}, ${sp.y})`}
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => setSelectedSafePoint(sp)}
                      >
                        <circle r="10" fill="#10b981" fillOpacity="0.2" />
                        <circle r="6" fill="#10b981" />
                        <text x="0" y="16" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="bold">{sp.name.split(' ')[0]}</text>
                      </g>
                    ))}
                  </svg>

                  {/* Floating Map Legend & Inspector */}
                  <div className="absolute top-4 left-4 p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs space-y-2 max-w-xs shadow-xl">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-pink-400" />
                      Map Legend
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span className="w-3 h-1 bg-emerald-500 rounded-full" />
                      <span>Safer Route (98% Illumination)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span className="w-3 h-1 bg-amber-500 rounded-full" />
                      <span>Shortest Path (Cautionary Zone)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 animate-pulse" />
                      <span>Historical Incident Hotspot</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span>Verified 24/7 Safe Haven Pin</span>
                    </div>
                  </div>

                  {/* Safe Point Click Popover */}
                  {selectedSafePoint && (
                    <div className="absolute bottom-4 right-4 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-lg border border-emerald-500/40 text-xs space-y-1.5 max-w-sm shadow-2xl animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" />
                          {selectedSafePoint.name}
                        </span>
                        <button onClick={() => setSelectedSafePoint(null)} className="text-slate-400 hover:text-white">✕</button>
                      </div>
                      <p className="text-slate-300">{selectedSafePoint.address}</p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                        <span>Distance: {selectedSafePoint.distance}</span>
                        <span className="text-emerald-400">● Open 24/7 Verified</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* AI Route Comparison Card Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Safer Route Card */}
                  <div className={`p-5 rounded-3xl border transition-all ${selectedRoute === 'safer' ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/30' : 'bg-slate-900/40 border-slate-800'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        Recommended
                      </span>
                      <span className="text-2xl font-black text-emerald-400">94 / 100</span>
                    </div>
                    <h3 className="font-bold text-white text-base">{t.saferRoute}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.saferRouteDesc}</p>
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block">ETA</span>
                        <span className="font-bold text-white">18 mins</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Distance</span>
                        <span className="font-bold text-white">2.8 km</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Lighting</span>
                        <span className="font-bold text-emerald-400">98% High</span>
                      </div>
                    </div>
                  </div>

                  {/* Shortest Route Card */}
                  <div className={`p-5 rounded-3xl border transition-all ${selectedRoute === 'shortest' ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/30' : 'bg-slate-900/40 border-slate-800'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                        Cautionary
                      </span>
                      <span className="text-2xl font-black text-amber-400">58 / 100</span>
                    </div>
                    <h3 className="font-bold text-white text-base">{t.fastestRoute}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.fastestRouteDesc}</p>
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block">ETA</span>
                        <span className="font-bold text-white">14 mins</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Distance</span>
                        <span className="font-bold text-white">2.1 km</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Lighting</span>
                        <span className="font-bold text-amber-400">42% Low</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* AI Risk Pattern Insights Panel */}
                <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    {t.aiInsightTitle}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t.aiInsightText}
                  </p>
                </div>

              </div>
            )}

            {/* SUB-VIEW 3: JOURNEY GUARDIAN */}
            {activeTab === 'journey' && (
              <div className="space-y-6">
                
                <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Car className="w-6 h-6 text-purple-400" />
                    {t.navJourney}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Live transit monitoring with automatic countdown, overdue detection, and discreet guardian check-ins.
                  </p>
                </div>

                {!journeyActive ? (
                  /* Journey Setup Form */
                  <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-6 max-w-2xl mx-auto shadow-xl">
                    <h3 className="font-bold text-lg text-white">Configure Monitored Transit</h3>

                    {/* Mode Selector */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-2">{t.transportMode}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: 'cab', label: 'Cab / Taxi', icon: Car },
                          { id: 'bus', label: 'Public Bus', icon: Bus },
                          { id: 'walking', label: 'Walking', icon: Footprints },
                          { id: 'metro', label: 'Metro', icon: Train }
                        ].map((m) => {
                          const IconComp = m.icon;
                          return (
                            <button
                              key={m.id}
                              onClick={() => setJourneyMode(m.id)}
                              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${journeyMode === m.id ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-bold' : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'}`}
                            >
                              <IconComp className="w-5 h-5" />
                              <span className="text-xs">{m.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Vehicle Plate Input */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-2">{t.vehicleNumber}</label>
                      <input
                        type="text"
                        value={vehicleReg}
                        onChange={(e) => setVehicleReg(e.target.value)}
                        placeholder={t.vehiclePlaceholder}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500 uppercase font-mono"
                      />
                    </div>

                    {/* Driver Name (Optional) */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-2">{t.driverName}</label>
                      <input
                        type="text"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Destination */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-2">{t.destination}</label>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder={t.destinationPlaceholder}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Trip Duration Slider */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span className="text-slate-400">{t.expectedMinutes}</span>
                        <span className="text-purple-400 font-bold">{tripMinutes} Minutes</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="90"
                        step="5"
                        value={tripMinutes}
                        onChange={(e) => setTripMinutes(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={handleStartJourney}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-all"
                    >
                      {t.startMonitoring}
                    </button>
                  </div>
                ) : (
                  /* Active Journey Tracking View */
                  <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-purple-500/40 space-y-6 max-w-2xl mx-auto shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                        {t.activeJourney}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Trip Mode: {journeyMode.toUpperCase()}</span>
                    </div>

                    {/* Countdown Display */}
                    <div className="text-center py-6 bg-slate-950/60 rounded-3xl border border-slate-800">
                      <span className="text-xs text-slate-500 uppercase tracking-widest font-mono">Estimated Arrival In</span>
                      <div className="text-5xl font-black font-mono text-purple-400 mt-2">
                        {String(Math.floor(tripRemainingSeconds / 60)).padStart(2, '0')}:
                        {String(tripRemainingSeconds % 60).padStart(2, '0')}
                      </div>
                      <p className="text-xs text-slate-400 mt-2 font-mono">Destination: {destination}</p>
                      <p className="text-[11px] text-slate-500">Plate: {vehicleReg} • Driver: {driverName}</p>
                    </div>

                    {/* Live Progress Bar */}
                    <div>
                      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                          style={{
                            width: `${Math.min(100, Math.max(5, ((tripMinutes * 60 - tripRemainingSeconds) / (tripMinutes * 60)) * 100))}%`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                        <span>Departed</span>
                        <span>Approaching</span>
                        <span>Arrived</span>
                      </div>
                    </div>

                    {/* Safe Arrival & Cancel Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleEndJourney(true)}
                        className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{t.arrivalConfirmation}</span>
                      </button>

                      <button
                        onClick={() => handleEndJourney(false)}
                        className="py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                      >
                        <X className="w-4 h-4" />
                        <span>{t.cancelJourney}</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* SUB-VIEW 4: INCIDENT REPORTS & COMPLAINT LIFECYCLE TRACKER */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                
                {/* Header with New Report Trigger */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/70 border border-slate-800">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <FileText className="w-6 h-6 text-amber-400" />
                      {t.complaintHistory}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      File encrypted incidents with GPS geo-tagging and follow the official action lifecycle.
                    </p>
                  </div>

                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.fileReport}</span>
                  </button>
                </div>

                {/* Complaint Lifecycle Cards */}
                <div className="space-y-4">
                  {reports.map((rep) => (
                    <div key={rep.id} className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-lg border border-pink-500/20">
                            {rep.id}
                          </span>
                          <span className="text-sm font-bold text-white">{rep.category}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rep.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : rep.severity === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {rep.severity} Severity
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">{rep.time}</span>
                      </div>

                      <p className="text-xs text-slate-300 font-medium">Location: {rep.location}</p>

                      {/* Visual Lifecycle Stepper */}
                      <div className="pt-2">
                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                          {[
                            { name: 'Submitted', active: true },
                            { name: 'Under Review', active: rep.status === 'Under Review' || rep.status === 'Action Taken' || rep.status === 'Closed' },
                            { name: 'Action Taken', active: rep.status === 'Action Taken' || rep.status === 'Closed' },
                            { name: 'Resolved / Closed', active: rep.status === 'Closed' }
                          ].map((step, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className={`h-1.5 rounded-full ${step.active ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-800'}`} />
                              <span className={step.active ? 'text-emerald-400' : 'text-slate-600'}>{step.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Official Note: </span>
                        {rep.notes}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* SUB-VIEW 5: ENCRYPTED EVIDENCE VAULT */}
            {activeTab === 'vault' && (
              <div className="space-y-6">
                
                <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <Lock className="w-6 h-6 text-blue-400" />
                      {t.vaultTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {t.vaultNotice}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUploadSim('audio')}
                      className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{t.recordAudio}</span>
                    </button>
                    <button
                      onClick={() => handleUploadSim('image')}
                      className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{t.uploadEvidence}</span>
                    </button>
                  </div>
                </div>

                {/* Vault Password Protection Shield */}
                {!vaultUnlocked ? (
                  <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-md mx-auto space-y-4 shadow-xl">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                      <Key className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg text-white">Unlock Evidence Vault</h3>
                    <p className="text-xs text-slate-400">
                      Zero-knowledge local encryption. Master key never leaves this browser tab.
                    </p>
                    <input
                      type="password"
                      value={vaultPassword}
                      onChange={(e) => setVaultPassword(e.target.value)}
                      className="w-full text-center tracking-widest px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => setVaultUnlocked(true)}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
                    >
                      Decrypt & View Files
                    </button>
                  </div>
                ) : (
                  /* Decrypted File List */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                      <span>{vaultFiles.length} Encrypted Artifacts Loaded</span>
                      <button onClick={() => setVaultUnlocked(false)} className="text-pink-400 hover:underline">Lock Vault</button>
                    </div>

                    {vaultFiles.map((file) => (
                      <div key={file.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                            {file.type === 'audio' ? <FileAudio className="w-5 h-5" /> : file.type === 'image' ? <FileImage className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white font-mono">{file.name}</p>
                            <p className="text-[11px] text-slate-500 font-mono">
                              {file.size} • {file.timestamp} • SHA: {file.hash}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setVaultPreviewFile(file)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Inspect Metadata"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setUploadMockToast(`Downloaded verified decrypt package: ${file.name}`);
                              setTimeout(() => setUploadMockToast(''), 4000);
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Export Decrypted"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}
          </>
        )}

        {/* ----------------------------------------------------------------------
           ROLE 2: GUARDIAN / FAMILY PORTAL
           ---------------------------------------------------------------------- */}
        {currentRole === 'guardian' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-pink-400" />
                  {t.navGuardian}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Real-time status of your linked family members, geofence logs, and battery monitoring.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                Circle Active
              </span>
            </div>

            {/* Tracked Member Card */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white font-bold flex items-center justify-center text-lg shadow-md">
                    A
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Ananya Sharma (You)</h3>
                    <p className="text-xs text-slate-400">Primary Ward • +91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${sosDispatched ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {sosDispatched ? 'EMERGENCY TRIGGERED' : 'Safe in Transit'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Battery: 84%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Last GPS Fix</span>
                  <span className="font-semibold text-slate-200">{t.activeLocation}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Active Monitored Transit</span>
                  <span className="font-semibold text-slate-200">{journeyActive ? `ETA: ${Math.floor(tripRemainingSeconds / 60)} mins` : 'No active trip'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Emergency Consent</span>
                  <span className="font-semibold text-emerald-400">Auto Police Dispatch Allowed</span>
                </div>
              </div>

              {sosDispatched && (
                <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
                  <div>
                    <p className="font-bold text-sm">LIVE EMERGENCY BROADCAST IN PROGRESS</p>
                    <p className="text-xs text-red-300">GPS coordinates updated every 3 seconds. Local authority notified.</p>
                  </div>
                  <button
                    onClick={() => alert("Calling local police dispatch PCR 112...")}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                  >
                    Direct Call PCR 112
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------
           ROLE 3: POLICE / AUTHORITY / NGO PORTAL
           ---------------------------------------------------------------------- */}
        {currentRole === 'police' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-red-400" />
                  {t.dispatchQueue}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Official authority triage board for responding to silent SOS alarms and overdue alerts.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">
                PCR Network Active
              </span>
            </div>

            {/* Active Dispatch Queue Table */}
            <div className="space-y-4">
              {DISPATCH_CASES.map((cs) => (
                <div key={cs.id} className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {cs.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cs.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {cs.priority} Priority
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{cs.time}</span>
                    </div>
                    <h3 className="font-bold text-white text-base">{cs.alertType} — {cs.user}</h3>
                    <p className="text-xs text-slate-300">Location: {cs.location}</p>
                    <p className="text-xs text-slate-500 font-mono">Assigned: {cs.unitAssigned} • Response ETA: {cs.etaMinutes} mins</p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => alert(`Patrol Unit dispatched to ${cs.location}!`)}
                      className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-600/30"
                    >
                      {t.resolveAction}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------
           ROLE 4: SYSTEM ADMIN CONSOLE
           ---------------------------------------------------------------------- */}
        {currentRole === 'admin' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-purple-400" />
                  {t.adminMetrics}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Global monitoring, safe point audit records, and platform telemetry.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
                Admin Secure
              </span>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400">{t.verifiedSafePoints}</span>
                <div className="text-3xl font-black text-emerald-400 mt-1">1,482</div>
                <span className="text-[11px] text-slate-500">+12 pending verification</span>
              </div>
              <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400">{t.activeUsers}</span>
                <div className="text-3xl font-black text-pink-400 mt-1">42,890</div>
                <span className="text-[11px] text-slate-500">Across 6 major cities</span>
              </div>
              <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400">{t.avgResponseTime}</span>
                <div className="text-3xl font-black text-blue-400 mt-1">3.4 Mins</div>
                <span className="text-[11px] text-slate-500">99.8% SLA compliance</span>
              </div>
            </div>

            {/* Verification Queue Preview */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base">New Safe Point Applications Pending Audit</h3>
              <div className="space-y-3">
                {[
                  { name: 'Kaveri Hospital Emergency Desk', city: 'Bengaluru', type: 'Medical Safe Haven', applied: 'Today, 2:30 PM' },
                  { name: 'RV College of Engineering Gate 1 Booth', city: 'Bengaluru', type: 'Campus Security', applied: 'Yesterday' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.type} • {item.city} • Applied {item.applied}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => alert("Safe point verified and added to map!")} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
                        Approve
                      </button>
                      <button onClick={() => alert("Safe point request rejected.")} className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ==========================================================================
         PERSISTENT FLOATING SOS EMERGENCY TRIGGER BUTTON (ALL SCREENS)
         ========================================================================== */}
      <div className="fixed bottom-20 sm:bottom-6 right-6 z-50">
        <button
          onClick={handleStartSOS}
          title="Silent SOS Emergency Trigger"
          className="relative group flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-pink-600 text-white font-black text-lg tracking-wider shadow-2xl shadow-red-600/60 hover:scale-105 active:scale-95 transition-all focus:outline-none"
        >
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
          <Radio className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white" />
          </span>
        </button>
      </div>

      {/* ==========================================================================
         MOBILE BOTTOM NAVIGATION BAR
         ========================================================================== */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl bg-slate-950/95 border-t border-slate-800 py-2 px-4 flex items-center justify-around shadow-2xl">
        {[
          { id: 'dashboard', label: t.navHome, icon: Shield },
          { id: 'map', label: t.navMap, icon: Navigation },
          { id: 'journey', label: t.navJourney, icon: Car },
          { id: 'reports', label: t.navReports, icon: FileText },
          { id: 'vault', label: t.evidenceVault, icon: Lock }
        ].map((item) => {
          const IconC = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${isActive ? 'text-pink-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <IconC className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==========================================================================
         MODAL: 5-SECOND CANCELABLE SOS COUNTDOWN MODAL
         ========================================================================== */}
      {sosActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border-2 border-red-500/80 text-center space-y-6 shadow-2xl shadow-red-900/60">
            
            <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 text-red-400 flex items-center justify-center mx-auto animate-pulse">
              <Radio className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-red-400">{t.sosTriggered}</span>
              <h2 className="text-3xl font-black text-white mt-1">Silent SOS Engine</h2>
              <p className="text-xs text-slate-300 mt-2">
                {t.sosCountdownNotice}
              </p>
            </div>

            {/* Big Countdown Number */}
            {!sosDispatched ? (
              <div className="text-6xl font-black font-mono text-red-500 animate-pulse">
                {sosCountdown}s
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs">
                <span className="font-bold block text-sm mb-1">{t.sosConfirmTitle}</span>
                {t.sosConfirmDesc}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleCancelSOS}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/40 active:scale-95 transition-all"
              >
                {t.sosCancel}
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Dispatches encrypted GPS coordinates and ambient mic recording to your primary guardian circle.
            </p>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL: REALISTIC FULL-SCREEN FAKE CALL OVERLAY
         ========================================================================== */}
      {fakeCallActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white select-none">
          <div className="w-full max-w-sm h-full max-h-[700px] flex flex-col justify-between p-8 text-center relative overflow-hidden bg-gradient-to-b from-slate-900 via-zinc-950 to-black rounded-3xl border border-zinc-800 shadow-2xl">
            
            {/* Top Caller Info */}
            <div className="pt-10 space-y-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 text-white flex items-center justify-center mx-auto text-3xl font-bold shadow-xl shadow-pink-600/30">
                <User className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black tracking-wide">{t.callerMom}</h2>
              <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
                {callAnswered ? `${t.callDuration} (${callDuration}s)` : t.incomingCall}
              </p>
            </div>

            {/* Bottom Controls */}
            <div className="pb-10 space-y-6">
              {!callAnswered ? (
                <div className="flex items-center justify-around">
                  {/* Decline Button */}
                  <button
                    onClick={handleEndFakeCall}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-18 h-18 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 group-active:scale-95 transition-all">
                      <PhoneOff className="w-8 h-8" />
                    </div>
                    <span className="text-xs text-slate-400">{t.declineCall}</span>
                  </button>

                  {/* Accept Button */}
                  <button
                    onClick={() => setCallAnswered(true)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-18 h-18 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 group-active:scale-95 transition-all animate-bounce">
                      <Phone className="w-8 h-8" />
                    </div>
                    <span className="text-xs text-slate-400">{t.acceptCall}</span>
                  </button>
                </div>
              ) : (
                /* Connected Call Controls */
                <div className="space-y-4">
                  <div className="text-xs text-emerald-400 font-mono flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Audio Stream Active
                  </div>
                  <button
                    onClick={handleEndFakeCall}
                    className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                  >
                    <PhoneOff className="w-5 h-5" />
                    <span>{t.endCall}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL: ANONYMOUS INCIDENT REPORTING FORM
         ========================================================================== */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white">{t.fileReport}</h3>
              </div>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleNewReportSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">{t.reportCategory}</label>
                <select
                  value={newReportCategory}
                  onChange={(e) => setNewReportCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                >
                  <option value="Harassment">Harassment / Misconduct</option>
                  <option value="Stalking">Suspicious Following / Stalking</option>
                  <option value="Poor Lighting">Poor Street Lighting / Dark Stretch</option>
                  <option value="Unsafe Transport">Unsafe Cab / Refusal / Overcharging</option>
                  <option value="Verbal Threat">Verbal Threat / Intimidation</option>
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">{t.severityLevel}</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'Critical'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewReportSeverity(lvl)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${newReportSeverity === lvl ? 'bg-amber-600/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incident Description */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">{t.incidentDesc}</label>
                <textarea
                  rows="3"
                  value={newReportDesc}
                  onChange={(e) => setNewReportDesc(e.target.value)}
                  placeholder="Describe landmarks, vehicle details, or circumstances..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Anonymous Consent Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-pink-500 rounded"
                />
                <label htmlFor="anonCheck" className="text-xs text-slate-300 cursor-pointer">
                  {t.anonymousConsent}
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30"
                >
                  {t.submitReport}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL: VAULT FILE INSPECTION METADATA
         ========================================================================== */}
      {vaultPreviewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Encrypted Evidence Metadata</h3>
              <button onClick={() => setVaultPreviewFile(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <p><span className="text-slate-500">Filename:</span> {vaultPreviewFile.name}</p>
              <p><span className="text-slate-500">File Type:</span> {vaultPreviewFile.type}</p>
              <p><span className="text-slate-500">File Size:</span> {vaultPreviewFile.size}</p>
              <p><span className="text-slate-500">Timestamp:</span> {vaultPreviewFile.timestamp}</p>
              <p><span className="text-slate-500">Algorithm:</span> AES-256-GCM Authenticated</p>
              <p className="break-all"><span className="text-slate-500">Integrity Hash:</span> {vaultPreviewFile.hash}</p>
            </div>
            <button
              onClick={() => setVaultPreviewFile(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
