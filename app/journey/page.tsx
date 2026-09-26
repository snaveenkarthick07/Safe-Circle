'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Navigation, 
  Car, 
  Footprints, 
  Bus, 
  Train, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  PhoneCall, 
  Share2, 
  MapPin, 
  Compass, 
  UserCheck 
} from 'lucide-react';

export default function JourneyPage() {
  const { 
    activeJourney, 
    startJourney, 
    checkInJourney, 
    endJourney, 
    triggerSOS, 
    triggerFakeCall,
    guardians,
    userLocation
  } = useApp();

  // New Journey Form State
  const [startLoc, setStartLoc] = useState('Indiranagar 100 Feet Road');
  const [destLoc, setDestLoc] = useState('Christ University Central Campus');
  const [transportMode, setTransportMode] = useState<'cab' | 'auto' | 'bus' | 'metro' | 'walking'>('cab');
  const [vehicleNo, setVehicleNo] = useState('KA 03 AA 4921');
  const [driverName, setDriverName] = useState('Ramesh Kumar (Uber Premier)');
  const [etaMinutes, setEtaMinutes] = useState(20);

  // Periodic Check-In Prompt Simulator
  const [checkInCountdown, setCheckInCountdown] = useState<number | null>(null);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    startJourney({
      startLocation: startLoc,
      destination: destLoc,
      transportMode,
      vehicleNumber: transportMode === 'cab' || transportMode === 'auto' ? vehicleNo : undefined,
      driverName: transportMode === 'cab' || transportMode === 'auto' ? driverName : undefined,
      etaMinutes,
    });
  };

  const handleTriggerCheckInPrompt = () => {
    setCheckInCountdown(30);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (checkInCountdown !== null && checkInCountdown > 0) {
      timer = setTimeout(() => {
        setCheckInCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (checkInCountdown === 0) {
      // Grace period expired -> simulate SOS trigger
      setCheckInCountdown(null);
      triggerSOS();
    }
    return () => clearTimeout(timer);
  }, [checkInCountdown, triggerSOS]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Safe Transport & Live Trip Guardian
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
          Journey Guardian Mode
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Real-time route deviation detection, periodic safety check-ins, and auto-expiring location tracking.
        </p>
      </div>

      {activeJourney ? (
        /* ACTIVE JOURNEY VIEW */
        <div className="space-y-6 animate-in fade-in">
          {/* Main Active Trip Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border-2 border-primary/40 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-pink-600/30 animate-pulse">
                  <Navigation className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider bg-emerald-500 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-ping" />
                      Trip Active & Monitored
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      ETA: {activeJourney.expectedArrivalTime}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                    {activeJourney.startLocation} → {activeJourney.destination}
                  </h2>
                </div>
              </div>

              {/* End Journey Button */}
              <button
                onClick={endJourney}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-102"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>I Have Arrived Safely</span>
              </button>
            </div>

            {/* Trip Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground">Live Route Progress</span>
                <span className="text-primary">{activeJourney.currentProgressPct}% Completed</span>
              </div>
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                <div
                  style={{ width: `${activeJourney.currentProgressPct}%` }}
                  className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-emerald-500 rounded-full transition-all duration-700"
                />
              </div>
            </div>

            {/* Vehicle & Driver Details (if cab/auto) */}
            {activeJourney.vehicleNumber && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Vehicle Plate</span>
                  <span className="text-sm font-mono font-black text-foreground">{activeJourney.vehicleNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Driver / Service</span>
                  <span className="text-sm font-semibold text-foreground">{activeJourney.driverName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Route Status</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    ✓ On Schedule (0 Deviations)
                  </span>
                </div>
              </div>
            )}

            {/* Check-In Action Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-500" />
                  Periodic Safety Check-In
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Last response: {activeJourney.lastCheckInAt} • Next check-in in {activeJourney.nextCheckInMinutes} mins
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={checkInJourney}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
                >
                  Confirm "I'm OK" (+25% Progress)
                </button>
                <button
                  onClick={handleTriggerCheckInPrompt}
                  className="px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border"
                >
                  Test 30s Check-in Prompt
                </button>
              </div>
            </div>

            {/* If 30-second check-in prompt is active */}
            {checkInCountdown !== null && (
              <div className="p-5 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-card-foreground animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="font-black text-base text-amber-600 dark:text-amber-400">
                      SAFETY CHECK-IN REQUIRED: Respond in {checkInCountdown}s
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      If you do not confirm safety, an emergency alert will be dispatched to your Guardians.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCheckInCountdown(null);
                    checkInJourney();
                  }}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg"
                >
                  ✓ I AM SAFE
                </button>
              </div>
            )}

            {/* Linked Guardians Receiving Trip Updates */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Guardians Monitoring This Trip ({guardians.filter(g => g.isLinked).length})
              </p>
              <div className="flex flex-wrap gap-2">
                {guardians.filter(g => g.isLinked).map((g) => (
                  <span key={g.id} className="px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{g.name} ({g.relation})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* START NEW JOURNEY FORM */
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-foreground">
            Configure Your Safe Transport Trip
          </h2>

          <form onSubmit={handleStart} className="space-y-6">
            {/* Origin and Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  Starting Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-primary" />
                  <input
                    type="text"
                    required
                    value={startLoc}
                    onChange={(e) => setStartLoc(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-emerald-500" />
                  <input
                    type="text"
                    required
                    value={destLoc}
                    onChange={(e) => setDestLoc(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Transport Mode */}
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">
                Select Mode of Transport
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { mode: 'cab', label: 'Cab / Uber', icon: Car },
                  { mode: 'auto', label: 'Auto Rickshaw', icon: Car },
                  { mode: 'bus', label: 'Public Bus', icon: Bus },
                  { mode: 'metro', label: 'Metro', icon: Train },
                  { mode: 'walking', label: 'Walking', icon: Footprints },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = transportMode === item.mode;
                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => setTransportMode(item.mode as any)}
                      className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-bold border transition-all ${
                        isSel
                          ? 'bg-primary text-primary-foreground border-primary shadow-md'
                          : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cab / Auto Details */}
            {(transportMode === 'cab' || transportMode === 'auto') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Vehicle Registration Number
                  </label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    placeholder="e.g. KA 03 AA 4921"
                    className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Driver Name & Cab Provider
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar (Uber)"
                    className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm"
                  />
                </div>
              </div>
            )}

            {/* ETA Estimated Minutes */}
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                Estimated Travel Time (Minutes)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="5"
                  value={etaMinutes}
                  onChange={(e) => setEtaMinutes(parseInt(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="font-mono font-bold text-sm text-foreground w-16 text-right">
                  {etaMinutes} mins
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white font-bold text-base shadow-xl shadow-pink-600/30 hover:opacity-95 transition-all"
            >
              Start Monitored Journey Guardian
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
