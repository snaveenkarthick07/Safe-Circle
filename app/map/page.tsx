'use client';

import React, { useState, useEffect } from 'react';
import { SafetyMap } from '@/components/maps/SafetyMap';
import { LocationSearch } from '@/components/maps/LocationSearch';
import { useApp } from '@/context/AppContext';
import { mockRouteOptions, mockHotspotZones } from '@/lib/mockData';
import { calculateRealRoadRoutes } from '@/lib/routingService';
import { RouteOption } from '@/types';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  Clock, 
  Radio, 
  ArrowRight,
  Flame,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export default function MapPage() {
  const router = useRouter();
  const { setRoutePlannerOpen, userLocation, safePoints, startJourney } = useApp();

  const [origin, setOrigin] = useState({
    name: '100 Feet Rd, Indiranagar',
    lat: userLocation.lat,
    lng: userLocation.lng,
    address: userLocation.address || '100 Feet Rd, Indiranagar, Bengaluru'
  });

  const [destination, setDestination] = useState({
    name: 'Christ University Central Campus',
    lat: 12.9345,
    lng: 77.6060,
    address: 'Hosur Road, Bhavani Nagar, S.G. Palya, Bengaluru'
  });

  const [routes, setRoutes] = useState<RouteOption[]>(mockRouteOptions);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(mockRouteOptions[0]);
  const [isCalculatingRoutes, setIsCalculatingRoutes] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Safe Havens', icon: '📍' },
    { id: 'pharmacy', label: '24/7 Pharmacies', icon: '💊' },
    { id: 'police', label: 'Pink Police / Outposts', icon: '👮' },
    { id: 'hospital', label: 'Hospitals / Trauma', icon: '🏥' },
    { id: 'campus_security', label: 'Campus Desks', icon: '🎓' },
    { id: 'store_247', label: '24/7 Stores', icon: '🏪' },
    { id: 'shelter', label: 'Women Shelters', icon: '🏠' },
  ];

  // Calculate real road routes when origin or destination changes
  useEffect(() => {
    let isCancelled = false;

    async function loadRoutes() {
      setIsCalculatingRoutes(true);
      try {
        const calculated = await calculateRealRoadRoutes(
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
          safePoints,
          mockHotspotZones
        );
        if (!isCancelled && calculated.length > 0) {
          setRoutes(calculated);
          // Default to safer route
          const safer = calculated.find(r => r.type === 'safer') || calculated[0];
          setSelectedRoute(safer);
        }
      } catch (err) {
        console.warn('Could not calculate real routes:', err);
      } finally {
        if (!isCancelled) {
          setIsCalculatingRoutes(false);
        }
      }
    }

    loadRoutes();

    return () => {
      isCancelled = true;
    };
  }, [origin.lat, origin.lng, destination.lat, destination.lng, safePoints]);

  const handleDestinationSelect = (dest: { name: string; lat: number; lng: number }) => {
    setDestination({
      name: dest.name,
      lat: dest.lat,
      lng: dest.lng,
      address: dest.name,
    });
  };

  const handleStartMonitoredJourney = () => {
    if (!selectedRoute) return;
    startJourney({
      startLocation: origin.name,
      destination: destination.name,
      transportMode: 'cab',
      etaMinutes: selectedRoute.durationMinutes,
    });
    router.push('/journey');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase mb-1.5 border border-indigo-500/20">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>High-Precision Safety Spatial Grid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interactive Safety Map & Real-Road Routes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Turn-by-turn road overlays, verified Safe Havens, and spatial crime risk heatmaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRoutePlannerOpen(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>Route Planner Modal</span>
          </button>
        </div>
      </div>

      {/* Origin & Destination Autocomplete Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 p-4 sm:p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-2xl">
        <div className="md:col-span-5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Origin (Starting Point)</span>
          </label>
          <LocationSearch
            placeholder="Starting Point (Address, GPS, or Landmark)..."
            initialValue={origin.name}
            onSelectLocation={(loc) => {
              setOrigin({
                name: loc.name,
                lat: loc.lat,
                lng: loc.lng,
                address: loc.address,
              });
            }}
          />
        </div>

        <div className="md:col-span-5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>Destination (Safe Haven or Address)</span>
          </label>
          <LocationSearch
            placeholder="Search Destination or click safe point..."
            initialValue={destination.name}
            onSelectLocation={(loc) => {
              setDestination({
                name: loc.name,
                lat: loc.lat,
                lng: loc.lng,
                address: loc.address,
              });
            }}
          />
        </div>

        <div className="md:col-span-2 flex items-end">
          <button
            onClick={() => {
              setIsCalculatingRoutes(true);
              calculateRealRoadRoutes(
                [origin.lat, origin.lng],
                [destination.lat, destination.lng],
                safePoints,
                mockHotspotZones
              ).then((r) => {
                setRoutes(r);
                setSelectedRoute(r[0]);
                setIsCalculatingRoutes(false);
              });
            }}
            disabled={isCalculatingRoutes}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 font-bold text-xs text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCalculatingRoutes ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{isCalculatingRoutes ? 'Routing...' : 'Update Route'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const count = cat.id === 'all' 
            ? safePoints.length 
            : safePoints.filter(s => s.category === cat.id).length;
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                activeCategoryFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                  : 'bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeCategoryFilter === cat.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Map & Route Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Map Viewport Container: Floating card layout (rounded-2xl shadow-2xl overflow-hidden border border-slate-800) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl shadow-2xl overflow-hidden border border-slate-800 bg-slate-900/80">
            <SafetyMap
              selectedRoute={selectedRoute}
              availableRoutes={routes}
              onSelectRoute={setSelectedRoute}
              activeCategoryFilter={activeCategoryFilter}
              onDestinationSelect={handleDestinationSelect}
              heightClass="h-[600px] w-full"
            />
          </div>
        </div>

        {/* Right Info Cards (Col 4) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Active Safe Route Comparison Widget */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 hover:border-slate-700 transition-all shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Real-Road Analysis</h3>
              </div>
              <div className="flex items-center gap-1.5">
                {isCalculatingRoutes && <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Safety: {selectedRoute?.safetyScore || 96}%
                </span>
              </div>
            </div>

            {/* 3 Color-Coded Route Options Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80">
              {routes.map((r) => {
                const isSelected = selectedRoute?.id === r.id;
                const isSafer = r.type === 'safer';
                const isFastest = r.type === 'fastest';

                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoute(r)}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all flex flex-col items-center gap-0.5 ${
                      isSelected
                        ? 'bg-slate-800 text-white shadow-md scale-[1.02]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                      <span>{isSafer ? 'Safer' : isFastest ? 'Direct' : 'Alt'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {r.durationMinutes}m • {r.distanceKm}km
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedRoute && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedRoute.color }} />
                    <span>{selectedRoute.name}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Estimated Time: <b className="text-slate-200">{selectedRoute.durationMinutes} mins</b> ({selectedRoute.distanceKm} km via road network)
                  </p>
                </div>

                {/* Road Safety Metric Gauges */}
                <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-800/80 text-center">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Lighting</span>
                    <span className="font-bold text-xs text-emerald-400">💡 {selectedRoute.lightingScore}%</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Patrol Presence</span>
                    <span className="font-bold text-xs text-indigo-400">👮 {selectedRoute.policeProximityScore}%</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Crowd Density</span>
                    <span className="font-bold text-xs text-amber-400">👥 {selectedRoute.crowdScore}%</span>
                  </div>
                </div>

                {/* Safety Reasons */}
                <div className="space-y-1.5">
                  {selectedRoute.reasons.map((res, i) => (
                    <p key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <span>{res}</span>
                    </p>
                  ))}
                  {selectedRoute.warningNote && (
                    <p className="text-xs font-semibold text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 flex items-start gap-2 mt-2">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{selectedRoute.warningNote}</span>
                    </p>
                  )}
                </div>

                {/* Direct Action: Start Monitored Journey */}
                <button
                  onClick={handleStartMonitoredJourney}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all duration-200 hover:scale-[1.01] active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Start Monitored Journey</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Caution Hotspots List */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 hover:border-slate-700 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Identified Caution Zones</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-400 bg-slate-950 border border-slate-800">
                {mockHotspotZones.length} Active
              </span>
            </div>

            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {mockHotspotZones.map((zone) => (
                <div
                  key={zone.id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 text-xs space-y-1 hover:border-slate-700/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{zone.name}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        zone.riskLevel === 'high'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {zone.riskLevel}
                    </span>
                  </div>
                  <p className="text-slate-400">{zone.safetyAdvisory}</p>
                  <div className="text-[10px] text-slate-500 font-semibold pt-1">
                    🕒 Peak Risk: {zone.peakRiskHours} • {zone.incidentCount} recent reports
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

