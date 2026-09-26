'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { RouteOption, TransportMode } from '@/types';
import { mockRouteOptions, mockHotspotZones } from '@/lib/mockData';
import { calculateRealRoadRoutes } from '@/lib/routingService';
import { LocationSearch } from './LocationSearch';
import { 
  Navigation, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Footprints, 
  Car, 
  Bus, 
  Train, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  X,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SafeRouteModalProps {
  onSelectRoute?: (route: RouteOption) => void;
}

export function SafeRouteModal({ onSelectRoute }: SafeRouteModalProps) {
  const router = useRouter();
  const { 
    isRoutePlannerOpen, 
    setRoutePlannerOpen, 
    startJourney, 
    userLocation,
    safePoints 
  } = useApp();

  const [origin, setOrigin] = useState({
    name: userLocation.address || 'Current Location (100ft Rd, Indiranagar)',
    lat: userLocation.lat,
    lng: userLocation.lng,
  });

  const [destination, setDestination] = useState({
    name: 'Christ University Central Campus',
    lat: 12.9345,
    lng: 77.6060,
  });

  const [selectedMode, setSelectedMode] = useState<TransportMode>('cab');
  const [routes, setRoutes] = useState<RouteOption[]>(mockRouteOptions);
  const [activeRouteId, setActiveRouteId] = useState<string>('route_safer');
  const [isCalculating, setIsCalculating] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('KA 03 AA 4921');
  const [driverName, setDriverName] = useState('Ramesh Kumar (Uber Premier)');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRoutePlannerOpen) {
        setRoutePlannerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRoutePlannerOpen, setRoutePlannerOpen]);

  // Recalculate routes dynamically when modal opens or coordinates change
  useEffect(() => {
    if (!isRoutePlannerOpen) return;

    let isCancelled = false;
    async function loadDynamicRoutes() {
      setIsCalculating(true);
      try {
        const calculated = await calculateRealRoadRoutes(
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
          safePoints,
          mockHotspotZones
        );
        if (!isCancelled && calculated.length > 0) {
          setRoutes(calculated);
          const safer = calculated.find(r => r.type === 'safer') || calculated[0];
          setActiveRouteId(safer.id);
          if (onSelectRoute) {
            onSelectRoute(safer);
          }
        }
      } catch (err) {
        console.warn('Modal routing error:', err);
      } finally {
        if (!isCancelled) {
          setIsCalculating(false);
        }
      }
    }

    loadDynamicRoutes();

    return () => {
      isCancelled = true;
    };
  }, [isRoutePlannerOpen, origin.lat, origin.lng, destination.lat, destination.lng, safePoints, onSelectRoute]);

  if (!isRoutePlannerOpen) return null;

  const selectedRoute = routes.find(r => r.id === activeRouteId) || routes[0];

  const handleStartJourney = () => {
    startJourney({
      startLocation: origin.name,
      destination: destination.name,
      transportMode: selectedMode,
      vehicleNumber: selectedMode === 'cab' || selectedMode === 'auto' ? vehicleNumber : undefined,
      driverName: selectedMode === 'cab' || selectedMode === 'auto' ? driverName : undefined,
      etaMinutes: selectedRoute.durationMinutes,
    });
    setRoutePlannerOpen(false);
    router.push('/journey');
  };

  const handleRouteSelect = (route: RouteOption) => {
    setActiveRouteId(route.id);
    if (onSelectRoute) {
      onSelectRoute(route);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setRoutePlannerOpen(false);
        }
      }}
    >
      <div 
        className="w-full max-w-3xl max-h-[92vh] flex flex-col bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg sm:text-xl text-white tracking-tight">
                  Safe Route & Spatial Risk Analysis
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  OSRM Real-Road
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Evaluates road streetlighting, historical crime hotspots, verified safe havens, and police proximity.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setRoutePlannerOpen(false)}
            aria-label="Close modal"
            className="p-2 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-all duration-200 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          
          {/* Origin & Destination Autocomplete Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Starting Point (Origin)</span>
              </label>
              <LocationSearch
                initialValue={origin.name}
                placeholder="Search origin or lock GPS..."
                onSelectLocation={(loc) => {
                  setOrigin({
                    name: loc.name,
                    lat: loc.lat,
                    lng: loc.lng,
                  });
                }}
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Destination (Safe Haven or Address)</span>
              </label>
              <LocationSearch
                initialValue={destination.name}
                placeholder="Search destination address..."
                onSelectLocation={(loc) => {
                  setDestination({
                    name: loc.name,
                    lat: loc.lat,
                    lng: loc.lng,
                  });
                }}
              />
            </div>
          </div>


          {/* Mode of Travel */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Mode of Travel
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { id: 'cab', label: 'Cab / Taxi', icon: Car },
                { id: 'auto', label: 'Auto', icon: Car },
                { id: 'bus', label: 'Public Bus', icon: Bus },
                { id: 'metro', label: 'Metro', icon: Train },
                { id: 'walking', label: 'Walking', icon: Footprints },
              ].map((item) => {
                const IconComp = item.icon;
                const isSelected = selectedMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedMode(item.id as TransportMode)}
                    className={`py-2.5 px-2 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                        : 'bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span className="text-[11px] truncate w-full text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicle / Driver fields if Cab or Auto */}
          {(selectedMode === 'cab' || selectedMode === 'auto') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Vehicle Registration Plate
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g., KA 03 AA 4921"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-mono uppercase focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Driver Name / Cab Provider
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g., Ramesh Kumar (Uber)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Route Options Comparison */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Available Route Recommendations</span>
                {isCalculating && <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />}
              </label>
              <span className="text-[11px] text-slate-400">Select a route to proceed</span>
            </div>

            <div className="space-y-3">
              {routes.map((rt) => {
                const isSelected = activeRouteId === rt.id;
                const isSafer = rt.type === 'safer';
                const isFastest = rt.type === 'fastest';

                return (
                  <div
                    key={rt.id}
                    onClick={() => handleRouteSelect(rt)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? isSafer
                          ? 'border-emerald-500/80 bg-emerald-950/20 shadow-lg shadow-emerald-950/30'
                          : 'border-indigo-500/80 bg-indigo-950/20 shadow-lg shadow-indigo-950/30'
                        : 'border-slate-800/80 bg-slate-950/40 hover:bg-slate-950/80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isSafer && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3" />
                            AI Recommended
                          </span>
                        )}
                        {isFastest && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white flex items-center gap-1 shadow-sm">
                            <Clock className="w-3 h-3" />
                            Direct / Fastest
                          </span>
                        )}
                        {!isSafer && !isFastest && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                            Alternative Road
                          </span>
                        )}
                        <h4 className="font-bold text-sm sm:text-base text-white">{rt.name}</h4>
                      </div>

                      <div className="flex items-center gap-3 text-xs shrink-0">
                        <span className="font-semibold text-slate-400">
                          {rt.durationMinutes} mins ({rt.distanceKm} km)
                        </span>
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                            rt.safetyScore >= 90
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : rt.safetyScore >= 75
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          Safety: {rt.safetyScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Metric Badges */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800/80 text-center text-xs">
                      <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                        <span className="text-[10px] text-slate-400 block">Lighting</span>
                        <span className="font-bold text-emerald-400">💡 {rt.lightingScore}%</span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                        <span className="text-[10px] text-slate-400 block">Patrol Proximity</span>
                        <span className="font-bold text-indigo-400">👮 {rt.policeProximityScore}%</span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                        <span className="text-[10px] text-slate-400 block">Crowd Activity</span>
                        <span className="font-bold text-amber-400">👥 {rt.crowdScore}%</span>
                      </div>
                    </div>

                    {/* Explanations & Warnings */}
                    <div className="space-y-1 mt-3">
                      {rt.reasons.map((reason, idx) => (
                        <p key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span> {reason}
                        </p>
                      ))}
                      {rt.warningNote && (
                        <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mt-1 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{rt.warningNote}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safety Disclaimer */}
          <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
            * Note: Route safety scores are generated using historical reports, lighting audits, and safe point density. SafeCircle provides context-aware guidance and never guarantees absolute safety.
          </p>

        </div>

        {/* Sticky Footer Action Bar */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur shrink-0">
          <button
            onClick={() => setRoutePlannerOpen(false)}
            className="px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 font-bold text-xs sm:text-sm text-slate-200 border border-slate-700/80 transition-all duration-200 active:scale-95"
          >
            Close / View Map
          </button>
          
          <button
            onClick={handleStartJourney}
            className="flex-1 max-w-md py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all duration-200 hover:scale-[1.01] active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Start Monitored Journey Guardian</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

      </div>
    </div>
  );
}

