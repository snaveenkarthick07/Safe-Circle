'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  Polyline, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SafePoint, IncidentReport, HotspotZone, RouteOption } from '@/types';
import { mockHotspotZones } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { getCurrentHighAccuracyLocation, reverseGeocode } from '@/lib/geoService';
import { LocationSearch } from './LocationSearch';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Navigation, 
  Layers, 
  Flame, 
  Crosshair, 
  Plus, 
  Minus, 
  Maximize2, 
  Phone, 
  Clock, 
  Sparkles,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Info,
  Radio,
  Map as MapIcon,
  Globe2,
  AlertCircle
} from 'lucide-react';

// Tile Layer Configuration
export type MapBaseLayer = 'voyager' | 'satellite' | 'dark';

const TILE_LAYERS: Record<MapBaseLayer, { 
  name: string; 
  url: string; 
  subdomains: string[];
  attribution: string; 
  icon: string;
}> = {
  voyager: {
    name: 'Street View',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    icon: '🗺️',
  },
  satellite: {
    name: 'Satellite View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    subdomains: ['a', 'b', 'c', 'd'],
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Earthstar Geographics',
    icon: '🛰️',
  },
  dark: {
    name: 'Night Safety Dark Mode',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    icon: '🌙',
  },
};

// Map Auto Resizer and Visibility Recovery Sub-Component
function MapController({
  center,
  zoom,
  onMapReady,
}: {
  center: [number, number];
  zoom: number;
  onMapReady?: (map: L.Map) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }

    // Fix grey/blank tile issue by forcing size invalidation after mount and on active state
    const t0 = setTimeout(() => map.invalidateSize(), 50);
    const t1 = setTimeout(() => map.invalidateSize(), 200);
    const t2 = setTimeout(() => map.invalidateSize(), 600);
    const t3 = setTimeout(() => map.invalidateSize(), 1200);

    // ResizeObserver ensures proper rendering if parent card resizes or collapses
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (container) {
      observer.observe(container);
    }

    // Fix blank map when switching browser tabs or windows
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        map.invalidateSize();
      }
    };
    const handleResize = () => {
      map.invalidateSize();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
    };
  }, [map, onMapReady]);

  return null;
}

// Canvas-based Dynamic Safety Incident Heatmap Layer
function SafetyHeatmapOverlay({
  incidents,
  hotspots,
  visible,
}: {
  incidents: IncidentReport[];
  hotspots: HotspotZone[];
  visible: boolean;
}) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawHeatmap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = map.getSize();
    canvas.width = size.x;
    canvas.height = size.y;
    ctx.clearRect(0, 0, size.x, size.y);

    const heatCanvas = document.createElement('canvas');
    heatCanvas.width = size.x;
    heatCanvas.height = size.y;
    const heatCtx = heatCanvas.getContext('2d');
    if (!heatCtx) return;

    const points: { lat: number; lng: number; intensity: number; radius: number }[] = [];

    incidents.forEach((rep) => {
      const weight = rep.severity === 'critical' ? 1.0 : rep.severity === 'high' ? 0.8 : 0.5;
      points.push({ lat: rep.lat, lng: rep.lng, intensity: weight, radius: 45 });
    });

    hotspots.forEach((hz) => {
      const weight = hz.riskLevel === 'high' ? 0.95 : 0.65;
      points.push({ lat: hz.lat, lng: hz.lng, intensity: weight, radius: 55 });
    });

    points.forEach((pt) => {
      const containerPt = map.latLngToContainerPoint([pt.lat, pt.lng]);
      if (
        containerPt.x < -100 ||
        containerPt.x > size.x + 100 ||
        containerPt.y < -100 ||
        containerPt.y > size.y + 100
      ) {
        return;
      }

      const radGrad = heatCtx.createRadialGradient(
        containerPt.x,
        containerPt.y,
        0,
        containerPt.x,
        containerPt.y,
        pt.radius
      );
      radGrad.addColorStop(0, `rgba(0,0,0,${pt.intensity})`);
      radGrad.addColorStop(0.5, `rgba(0,0,0,${pt.intensity * 0.5})`);
      radGrad.addColorStop(1, 'rgba(0,0,0,0)');

      heatCtx.fillStyle = radGrad;
      heatCtx.beginPath();
      heatCtx.arc(containerPt.x, containerPt.y, pt.radius, 0, Math.PI * 2);
      heatCtx.fill();
    });

    const imgData = heatCtx.getImageData(0, 0, size.x, size.y);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha === 0) continue;

      const norm = alpha / 255;
      let r = 0, g = 0, b = 0, a = norm * 0.75;

      if (norm < 0.25) {
        r = 59;
        g = 130;
        b = 246;
      } else if (norm < 0.55) {
        r = 234;
        g = 179;
        b = 8;
      } else if (norm < 0.8) {
        r = 249;
        g = 115;
        b = 22;
      } else {
        r = 239;
        g = 68;
        b = 68;
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = Math.min(210, a * 255);
    }

    ctx.putImageData(imgData, 0, 0);
  }, [map, incidents, hotspots, visible]);

  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;

    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '250';
      canvas.style.transition = 'opacity 0.3s ease';
      container.appendChild(canvas);
      canvasRef.current = canvas;
    }

    canvas.style.opacity = visible ? '1' : '0';

    drawHeatmap();

    map.on('move', drawHeatmap);
    map.on('zoom', drawHeatmap);
    map.on('resize', drawHeatmap);

    return () => {
      map.off('move', drawHeatmap);
      map.off('zoom', drawHeatmap);
      map.off('resize', drawHeatmap);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [map, visible, drawHeatmap]);

  return null;
}

export interface SafetyMapCanvasProps {
  selectedRoute?: RouteOption | null;
  activeCategoryFilter?: string;
  heightClass?: string;
  showFiltersOverlay?: boolean;
  onDestinationSelect?: (dest: { name: string; lat: number; lng: number }) => void;
  availableRoutes?: RouteOption[];
  onSelectRoute?: (route: RouteOption) => void;
}

export default function SafetyMapCanvas({
  selectedRoute = null,
  activeCategoryFilter = 'all',
  heightClass = 'h-[600px]',
  showFiltersOverlay = true,
  onDestinationSelect,
  availableRoutes = [],
  onSelectRoute,
}: SafetyMapCanvasProps) {
  const { safePoints, reports, userLocation, setUserLocation, theme } = useApp();
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [baseLayer, setBaseLayer] = useState<MapBaseLayer>(theme === 'dark' ? 'dark' : 'voyager');
  const [useGoogleEmbedFallback, setUseGoogleEmbedFallback] = useState(false);
  const [tileErrorCount, setTileErrorCount] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSafePoints, setShowSafePoints] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [userAccuracyRadius, setUserAccuracyRadius] = useState<number | null>(null);

  // Sync default baseLayer with theme changes
  useEffect(() => {
    if (baseLayer === 'dark' || baseLayer === 'voyager') {
      setBaseLayer(theme === 'dark' ? 'dark' : 'voyager');
    }
  }, [theme]);

  // Construct Custom Google Maps-Grade Markers using DivIcons
  const icons = React.useMemo(() => {
    if (typeof window === 'undefined') return null;

    // Green Shield for Safe Havens
    const safeHavenIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 42px; height: 42px; border-radius: 50%; background: #10b981; opacity: 0.25; animation: radar-ping 2.2s infinite;"></div>
          <div style="background: linear-gradient(135deg, #10b981, #059669); width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid #ffffff; box-shadow: 0 8px 18px rgba(16,185,129,0.45); transform: rotate(-45deg);">
            <div style="transform: rotate(45deg); font-size: 19px; display: flex; align-items: center; justify-content: center;">
              🛡️
            </div>
          </div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -22],
    });

    // Yellow Alert for Caution Zones
    const cautionAlertIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: #f59e0b; opacity: 0.25; animation: radar-ping 2.5s infinite;"></div>
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid #ffffff; box-shadow: 0 6px 16px rgba(245,158,11,0.5); font-size: 18px;">
            ⚠️
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });

    // Red Pulse for Incident Hotspots
    const incidentPulseIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 48px; height: 48px; border-radius: 50%; background: #ef4444; opacity: 0.35; animation: radar-ping 1.8s infinite;"></div>
          <div style="background: linear-gradient(135deg, #ef4444, #dc2626); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid #ffffff; box-shadow: 0 6px 18px rgba(239,68,68,0.6); font-size: 17px;">
            🚨
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });

    // User GPS Radar Pin
    const userGpsIcon = L.divIcon({
      className: 'user-radar-pin',
      html: `
        <div class="user-radar-pin">
          <div class="pulse-wave"></div>
          <div class="core-dot"></div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });

    // Origin Flag & Destination Target Pin
    const startFlagIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="background: #10b981; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(16,185,129,0.5); font-size: 16px;">
          🚩
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18],
    });

    const destTargetIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="background: #ef4444; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(239,68,68,0.5); font-size: 16px;">
          🎯
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18],
    });

    return {
      safeHaven: safeHavenIcon,
      caution: cautionAlertIcon,
      incident: incidentPulseIcon,
      user: userGpsIcon,
      startFlag: startFlagIcon,
      destFlag: destTargetIcon,
    };
  }, []);

  // Category filter predicate
  const filteredSafePoints = safePoints.filter((sp) => {
    if (activeCategoryFilter === 'all') return true;
    return sp.category === activeCategoryFilter;
  });

  // High Accuracy Recenter onto User
  const handleRecenterUser = async () => {
    if (!mapInstance) return;
    setIsLocatingUser(true);
    try {
      const pos = await getCurrentHighAccuracyLocation();
      setUserAccuracyRadius(Math.round(pos.accuracy));
      const address = await reverseGeocode(pos.lat, pos.lng);
      setUserLocation({ lat: pos.lat, lng: pos.lng, address });
      mapInstance.flyTo([pos.lat, pos.lng], 16, { duration: 1.2 });
    } catch (err: any) {
      mapInstance.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1 });
    } finally {
      setIsLocatingUser(false);
    }
  };

  // Fit bounds to display all safe points and routes
  const handleFitAllBounds = () => {
    if (!mapInstance) return;
    const group = L.featureGroup();
    group.addLayer(L.marker([userLocation.lat, userLocation.lng]));

    filteredSafePoints.forEach((sp) => group.addLayer(L.marker([sp.lat, sp.lng])));
    mockHotspotZones.forEach((hz) => group.addLayer(L.marker([hz.lat, hz.lng])));

    if (selectedRoute && selectedRoute.coordinates.length > 0) {
      selectedRoute.coordinates.forEach((c) => group.addLayer(L.marker(c)));
    }

    mapInstance.fitBounds(group.getBounds().pad(0.15));
  };

  // Search Bar location selection
  const handleSearchSelect = (loc: { name: string; lat: number; lng: number; address: string }) => {
    if (!mapInstance) return;
    mapInstance.flyTo([loc.lat, loc.lng], 16, { duration: 1.2 });
    if (onDestinationSelect) {
      onDestinationSelect({ name: loc.name, lat: loc.lat, lng: loc.lng });
    }
  };

  const activeRoutesList = availableRoutes.length > 0 ? availableRoutes : selectedRoute ? [selectedRoute] : [];

  return (
    <div className={`h-[600px] w-full rounded-2xl overflow-hidden shadow-inner border border-slate-700 relative bg-slate-900`}>
      {/* 1. Top-Left Floating Google Maps Search Card */}
      <div className="absolute top-4 left-4 z-[400] w-full max-w-sm sm:max-w-md pointer-events-auto">
        <div className="bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-1.5 flex items-center gap-2">
          <div className="flex-1">
            <LocationSearch
              placeholder="Search location or Safe Point..."
              onSelectLocation={handleSearchSelect}
              className="shadow-none border-0"
            />
          </div>
        </div>
      </div>

      {/* 2. Top-Right Floating Controls (Engine Switcher & Layer Selector) */}
      <div className="absolute top-4 right-4 z-[400] flex items-center gap-2 pointer-events-auto">
        {/* Toggle between Leaflet Voyager and Google Maps Embed Fallback */}
        <button
          onClick={() => setUseGoogleEmbedFallback(!useGoogleEmbedFallback)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 border ${
            useGoogleEmbedFallback
              ? 'bg-blue-600 text-white border-blue-500 shadow-blue-600/30'
              : 'bg-card/95 text-foreground border-border hover:bg-card'
          }`}
          title="Switch Map Engine"
        >
          <Globe2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">
            {useGoogleEmbedFallback ? 'Google Maps View' : 'Voyager Engine'}
          </span>
        </button>

        {/* Heatmap Toggle */}
        {!useGoogleEmbedFallback && (
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 border ${
              showHeatmap
                ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30'
                : 'bg-card/95 text-foreground border-border hover:bg-card'
            }`}
            title="Toggle Safety Risk Heatmap"
          >
            <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-amber-200 animate-pulse' : 'text-rose-500'}`} />
            <span className="hidden sm:inline">Heatmap</span>
          </button>
        )}

        {/* Layer Selector Toggle (Street View, Satellite, Night Safety Dark Mode) */}
        {!useGoogleEmbedFallback && (
          <div className="relative">
            <button
              onClick={() => setLayersMenuOpen(!layersMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card/95 hover:bg-card backdrop-blur-xl border border-border shadow-lg text-xs font-bold text-foreground transition-all active:scale-95"
            >
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Layers</span>
              <span className="text-[10px] text-muted-foreground ml-0.5">▼</span>
            </button>

            {layersMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-card/98 backdrop-blur-2xl border border-border p-3.5 rounded-2xl shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-150 z-[9999] space-y-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-2">
                    Base Map Theme
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {(Object.keys(TILE_LAYERS) as MapBaseLayer[]).map((key) => {
                      const lyr = TILE_LAYERS[key];
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setBaseLayer(key);
                            setLayersMenuOpen(false);
                          }}
                          className={`p-2 rounded-xl text-left text-[11px] font-bold flex items-center justify-between transition-all ${
                            baseLayer === key
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{lyr.icon}</span>
                            <span>{lyr.name}</span>
                          </span>
                          {baseLayer === key && <span className="text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                    Overlay Elements
                  </span>

                  <label className="flex items-center gap-2 text-foreground cursor-pointer hover:opacity-80">
                    <input
                      type="checkbox"
                      checked={showSafePoints}
                      onChange={(e) => setShowSafePoints(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                    />
                    <span>Verified Safe Havens ({filteredSafePoints.length})</span>
                  </label>

                  <label className="flex items-center gap-2 text-foreground cursor-pointer hover:opacity-80">
                    <input
                      type="checkbox"
                      checked={showHotspots}
                      onChange={(e) => setShowHotspots(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
                    />
                    <span>Caution Zones ({mockHotspotZones.length})</span>
                  </label>

                  <label className="flex items-center gap-2 text-foreground cursor-pointer hover:opacity-80">
                    <input
                      type="checkbox"
                      checked={showIncidents}
                      onChange={(e) => setShowIncidents(e.target.checked)}
                      className="rounded text-red-500 focus:ring-red-500 w-3.5 h-3.5"
                    />
                    <span>Incident Hotspots ({reports.length})</span>
                  </label>

                  <label className="flex items-center gap-2 text-foreground cursor-pointer hover:opacity-80">
                    <input
                      type="checkbox"
                      checked={showRoutes}
                      onChange={(e) => setShowRoutes(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5"
                    />
                    <span>Glowing Safe Routes</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fit Bounds Button */}
        {!useGoogleEmbedFallback && (
          <button
            onClick={handleFitAllBounds}
            title="Fit All Safe Havens in View"
            className="p-2.5 rounded-xl bg-card/95 hover:bg-card backdrop-blur-xl border border-border shadow-lg text-foreground transition-all active:scale-95"
          >
            <Maximize2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Network Proxy / Blocked Tile Warning Banner */}
      {tileErrorCount > 4 && !useGoogleEmbedFallback && (
        <div className="absolute top-18 left-4 right-4 z-[400] bg-amber-500/90 backdrop-blur-md text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Map tile network requests blocked by environment. Switch to Google Maps interactive view?</span>
          </div>
          <button
            onClick={() => setUseGoogleEmbedFallback(true)}
            className="px-3 py-1 bg-slate-950 text-white rounded-lg text-xs font-black hover:bg-slate-900 transition-colors"
          >
            Switch to Google Maps
          </button>
        </div>
      )}

      {/* 3. Bottom-Right Google Maps Recenter Floating Action Button (FAB) */}
      <div className="absolute bottom-6 right-6 z-[400] flex flex-col items-center gap-2.5 pointer-events-auto">
        <button
          onClick={handleRecenterUser}
          disabled={isLocatingUser}
          title="Recenter on GPS"
          className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 text-primary border-2 border-primary/50 shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group hover:shadow-primary/30"
        >
          <Crosshair className={`w-6 h-6 ${isLocatingUser ? 'animate-spin text-primary' : 'group-hover:rotate-45'} transition-transform duration-300`} />
        </button>

        {!useGoogleEmbedFallback && (
          <div className="flex flex-col rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl overflow-hidden">
            <button
              onClick={() => mapInstance?.zoomIn()}
              title="Zoom In"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors border-b border-border/60"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapInstance?.zoomOut()}
              title="Zoom Out"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 4. Bottom-Left Map Legend */}
      <div className="absolute bottom-6 left-6 z-[400] hidden sm:flex items-center gap-3 bg-card/95 backdrop-blur-xl border border-border px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold text-foreground pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span>Safe Haven (Green Shield)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          <span>Caution Area (Yellow Alert)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
          <span>Hotspot (Red Pulse)</span>
        </div>
      </div>

      {/* 5. Main Map Rendering Engine: Leaflet Voyager or Google Maps Embed Fallback */}
      {useGoogleEmbedFallback ? (
        <div className="w-full h-full relative">
          <iframe
            title="Google Maps Interactive View"
            src={`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=14&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
          {/* Overlay Floating Route HUD */}
          {selectedRoute && (
            <div className="absolute bottom-6 left-6 z-[400] max-w-sm bg-card/95 backdrop-blur-xl border border-border p-3.5 rounded-2xl shadow-2xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-foreground">{selectedRoute.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400">
                  {selectedRoute.safetyScore}% Safe
                </span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                {selectedRoute.durationMinutes} mins • {selectedRoute.distanceKm} km via road network
              </p>
            </div>
          )}
        </div>
      ) : (
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={14}
          zoomControl={false}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <MapController
            center={[userLocation.lat, userLocation.lng]}
            zoom={14}
            onMapReady={setMapInstance}
          />

          {/* CartoDB Voyager / Satellite / Dark Tile Layer */}
          <TileLayer
            key={baseLayer}
            url={TILE_LAYERS[baseLayer].url}
            subdomains={TILE_LAYERS[baseLayer].subdomains}
            attribution={TILE_LAYERS[baseLayer].attribution}
            maxZoom={19}
            crossOrigin="anonymous"
            eventHandlers={{
              tileerror: () => {
                setTileErrorCount((prev) => prev + 1);
              },
            }}
          />

          {/* Dynamic Incident Heatmap Canvas */}
          <SafetyHeatmapOverlay
            incidents={reports}
            hotspots={mockHotspotZones}
            visible={showHeatmap}
          />

          {/* User High Accuracy Location Radius */}
          {userAccuracyRadius && (
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userAccuracyRadius}
              pathOptions={{
                color: '#ec4899',
                fillColor: '#ec4899',
                fillOpacity: 0.12,
                weight: 1.5,
                dashArray: '4, 4',
              }}
            />
          )}

          {/* User Live Radar Pin */}
          {icons && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={icons.user}>
              <Popup>
                <div className="p-3 max-w-xs">
                  <div className="flex items-center gap-1.5 text-pink-600 font-extrabold text-xs uppercase mb-1">
                    <div className="w-2 h-2 rounded-full bg-pink-600 animate-ping" />
                    <span>Your Current Location</span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">
                    {userLocation.address || 'Active Geolocation'}
                  </h4>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Coordinates: {userLocation.lat.toFixed(5)}°N, {userLocation.lng.toFixed(5)}°E
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Safe Havens (Green Shield Custom HTML Markers) */}
          {showSafePoints &&
            icons &&
            filteredSafePoints.map((sp) => (
              <Marker
                key={sp.id}
                position={[sp.lat, sp.lng]}
                icon={icons.safeHaven}
              >
                <Popup>
                  <div className="p-3.5 max-w-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Safe Haven
                      </span>
                      <span className="text-[11px] font-bold text-amber-500">
                        ★ {sp.rating}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-foreground leading-snug">
                        {sp.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{sp.address}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] bg-muted/60 p-2 rounded-xl text-foreground font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span>{sp.openHours}</span>
                      </span>
                      <span className="font-bold text-primary">
                        📍 {sp.distance || '0.5 km'}
                      </span>
                    </div>

                    {sp.facilities && sp.facilities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {sp.facilities.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-border flex items-center gap-2">
                      <a
                        href={`tel:${sp.phone.replace(/[^0-9+]/g, '')}`}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-primary" />
                        <span>Call Haven</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${sp.lat},${sp.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <span>Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Caution Zones (Yellow Alert Custom HTML Markers & Radii) */}
          {showHotspots &&
            icons &&
            mockHotspotZones.map((zone) => (
              <React.Fragment key={zone.id}>
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={zone.radiusMeters}
                  pathOptions={{
                    color: zone.riskLevel === 'high' ? '#ef4444' : '#f59e0b',
                    fillColor: zone.riskLevel === 'high' ? '#ef4444' : '#f59e0b',
                    fillOpacity: 0.22,
                    weight: 2,
                  }}
                />
                <Marker
                  position={[zone.lat, zone.lng]}
                  icon={icons.caution}
                >
                  <Popup>
                    <div className="p-3 max-w-xs space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            zone.riskLevel === 'high'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {zone.riskLevel === 'high' ? 'High Risk Hotspot' : 'Caution Zone'}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-foreground">{zone.name}</h4>
                      <p className="text-xs text-muted-foreground">{zone.safetyAdvisory}</p>

                      <div className="text-[11px] font-medium bg-muted/50 p-2 rounded-xl text-foreground">
                        🕒 Peak Risk Hours: <b>{zone.peakRiskHours}</b>
                        <br />
                        📊 Past Incident Reports: <b>{zone.incidentCount} logged</b>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}

          {/* Incident Hotspots (Red Pulse Custom HTML Markers) */}
          {showIncidents &&
            icons &&
            reports.map((rep) => (
              <Marker
                key={rep.id}
                position={[rep.lat, rep.lng]}
                icon={icons.incident}
              >
                <Popup>
                  <div className="p-3 max-w-xs space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                      {rep.category.replace('_', ' ')}
                    </span>
                    <h4 className="font-extrabold text-sm text-foreground mt-1">
                      {rep.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{rep.description}</p>
                    <div className="text-[10px] text-muted-foreground font-semibold pt-1 border-t border-border">
                      Complaint ID: {rep.complaintId} • Status: {rep.status.toUpperCase()}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Real-Road Polyline Paths with Glowing SVG Strokes */}
          {showRoutes &&
            activeRoutesList.map((rt) => {
              const isSelected = selectedRoute ? selectedRoute.id === rt.id : rt.type === 'safer';
              const isSafer = rt.type === 'safer';
              const routeColor = isSafer ? '#10b981' : rt.type === 'fastest' ? '#0284c7' : '#f59e0b';
              const startCoord = rt.coordinates[0];
              const endCoord = rt.coordinates[rt.coordinates.length - 1];

              return (
                <React.Fragment key={rt.id}>
                  {/* Glowing Ambient Outer Stroke */}
                  {isSelected && (
                    <Polyline
                      positions={rt.coordinates}
                      pathOptions={{
                        color: routeColor,
                        weight: 12,
                        opacity: 0.38,
                        lineCap: 'round',
                        lineJoin: 'round',
                      }}
                    />
                  )}

                  {/* Core Road Path Polyline */}
                  <Polyline
                    positions={rt.coordinates}
                    eventHandlers={{
                      click: () => onSelectRoute && onSelectRoute(rt),
                    }}
                    pathOptions={{
                      color: routeColor,
                      weight: isSelected ? 6 : 4,
                      opacity: isSelected ? 1 : 0.5,
                      dashArray: rt.type === 'fastest' ? '6, 8' : undefined,
                      lineCap: 'round',
                      lineJoin: 'round',
                    }}
                  >
                    <Popup>
                      <div className="p-2.5 max-w-xs space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: routeColor }}
                          >
                            {isSafer ? 'Recommended Safe Route' : rt.type.toUpperCase()}
                          </span>
                          <span className="font-black text-xs text-foreground">
                            {rt.safetyScore}% Safe
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground">{rt.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Duration: <b>{rt.durationMinutes} mins</b> ({rt.distanceKm} km)
                        </p>
                        <div className="text-[11px] text-muted-foreground space-y-0.5 pt-1 border-t border-border">
                          <div>💡 Street Lighting: <b>{rt.lightingScore}%</b></div>
                          <div>👮 Police Proximity: <b>{rt.policeProximityScore}%</b></div>
                        </div>
                      </div>
                    </Popup>
                  </Polyline>

                  {/* Start Flag & Destination Target Pin for Selected Route */}
                  {isSelected && icons && startCoord && endCoord && (
                    <>
                      <Marker position={startCoord} icon={icons.startFlag}>
                        <Popup>
                          <div className="p-1.5 font-bold text-xs">Origin Start Point</div>
                        </Popup>
                      </Marker>
                      <Marker position={endCoord} icon={icons.destFlag}>
                        <Popup>
                          <div className="p-1.5 font-bold text-xs">Journey Destination</div>
                        </Popup>
                      </Marker>
                    </>
                  )}
                </React.Fragment>
              );
            })}
        </MapContainer>
      )}
    </div>
  );
}
