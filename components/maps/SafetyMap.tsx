'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { RouteOption } from '@/types';
import { Compass, ShieldCheck } from 'lucide-react';
import type { SafetyMapCanvasProps } from './SafetyMapCanvas';

// Dynamically import the Leaflet Canvas client component to ensure 100% SSR-safety
const SafetyMapCanvas = dynamic(
  () => import('./SafetyMapCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] rounded-3xl bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center border border-border space-y-3">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Compass className="w-5 h-5 text-primary absolute" />
        </div>
        <div className="text-center">
          <span className="text-sm font-bold text-foreground block">
            Initializing High-Precision Safety Map...
          </span>
          <span className="text-xs text-muted-foreground">
            Loading vector road grids, live GPS havens & heatmaps
          </span>
        </div>
      </div>
    ),
  }
);

export function SafetyMap(props: SafetyMapCanvasProps) {
  return <SafetyMapCanvas {...props} />;
}
