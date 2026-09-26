'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Crosshair, Loader2, X, Compass } from 'lucide-react';
import { searchPlaces, getCurrentHighAccuracyLocation, GeocodedPlace } from '@/lib/geoService';

interface LocationSearchProps {
  placeholder?: string;
  initialValue?: string;
  onSelectLocation: (loc: { name: string; lat: number; lng: number; address: string }) => void;
  className?: string;
  showCurrentLocationOption?: boolean;
}

export function LocationSearch({
  placeholder = 'Search address, landmark, or street...',
  initialValue = '',
  onSelectLocation,
  className = '',
  showCurrentLocationOption = true,
}: LocationSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<GeocodedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const places = await searchPlaces(query, { signal: controller.signal, limit: 6 });
        setResults(places);
        setIsOpen(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Search error:', err);
        }
      } finally {
        setIsLoading(false);
      }
    }, 320);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelectPlace = (place: GeocodedPlace) => {
    setQuery(place.name);
    setIsOpen(false);
    onSelectLocation({
      name: place.name,
      address: place.displayName,
      lat: place.lat,
      lng: place.lng,
    });
  };

  const handleUseCurrentGPS = async () => {
    setIsLocating(true);
    try {
      const pos = await getCurrentHighAccuracyLocation();
      const placeName = 'My Exact GPS Location';
      setQuery(placeName);
      setIsOpen(false);
      onSelectLocation({
        name: placeName,
        address: `Lat: ${pos.lat.toFixed(5)}, Lng: ${pos.lng.toFixed(5)} (±${Math.round(pos.accuracy)}m)`,
        lat: pos.lat,
        lng: pos.lng,
      });
    } catch (err: any) {
      alert(err.message || 'Could not fetch GPS location.');
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0 || showCurrentLocationOption) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white text-xs sm:text-sm placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-indigo-400 mr-1" />}
          
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {showCurrentLocationOption && (
            <button
              type="button"
              onClick={handleUseCurrentGPS}
              disabled={isLocating}
              title="Lock GPS Location"
              className="p-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-[9999] bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {showCurrentLocationOption && (
            <button
              type="button"
              onClick={handleUseCurrentGPS}
              disabled={isLocating}
              className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-indigo-500/10 text-indigo-300 border-b border-slate-800/80 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 shrink-0">
                <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-indigo-400' : ''}`} />
              </div>
              <div>
                <span className="text-xs font-bold block text-white">
                  {isLocating ? 'Acquiring High-Accuracy GPS...' : 'Use Current Live GPS Location'}
                </span>
                <span className="text-[10px] text-slate-400">
                  Lock onto exact HTML5 satellite latitude & longitude
                </span>
              </div>
            </button>
          )}

          {results.length > 0 ? (
            results.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => handleSelectPlace(place)}
                className="w-full px-4 py-2.5 text-left flex items-start gap-2.5 hover:bg-slate-800/80 border-b border-slate-800/50 last:border-0 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-white truncate block">
                      {place.name}
                    </span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0 border border-slate-700/60">
                      {place.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {place.displayName}
                  </span>
                </div>
              </button>
            ))
          ) : query.trim().length >= 2 && !isLoading ? (
            <div className="px-4 py-3 text-center text-xs text-slate-400">
              No matching locations found for "{query}". Try a major street or landmark.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

