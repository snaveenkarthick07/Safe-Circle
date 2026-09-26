'use client';

import React, { useState } from 'react';
import { 
  mockAIRiskTrends, 
  mockHotspotZones, 
  mockIncidentReports 
} from '@/lib/mockData';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  BarChart3, 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  Lightbulb, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  AlertTriangle 
} from 'lucide-react';

const CATEGORY_DATA = [
  { name: 'Stalking & Following', value: 34, color: '#ec4899' },
  { name: 'Poor Lighting / Dark Sectors', value: 28, color: '#f59e0b' },
  { name: 'Cab & Transit Misconduct', value: 22, color: '#ef4444' },
  { name: 'Verbal Harassment', value: 16, color: '#8b5cf6' },
];

const DAY_DATA = [
  { day: 'Mon', reports: 12, riskScore: 35 },
  { day: 'Tue', reports: 14, riskScore: 38 },
  { day: 'Wed', reports: 11, riskScore: 32 },
  { day: 'Thu', reports: 18, riskScore: 48 },
  { day: 'Fri', reports: 29, riskScore: 82 },
  { day: 'Sat', reports: 34, riskScore: 91 },
  { day: 'Sun', reports: 26, riskScore: 74 },
];

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState<'30days' | '7days' | '24hrs'>('30days');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Predictive AI Risk Pattern Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            AI Spatial Safety Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Aggregated historical incident data, lighting audits, and temporal safety risk modeling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['24hrs', '7days', '30days'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeFilter === tf
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {tf === '24hrs' ? 'Last 24 Hours' : tf === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-card border border-border shadow-md space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Peak Risk Window</span>
            <Clock className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-500">10:00 PM - 02:00 AM</div>
          <p className="text-[11px] text-muted-foreground">74% of high-severity reports occur in this interval</p>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-md space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Critical Factor</span>
            <Lightbulb className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-foreground">Broken Streetlights</div>
          <p className="text-[11px] text-muted-foreground">Correlates with 68% of stalking incidents</p>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-md space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Patrol Coverage</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-500">89.4% Verified</div>
          <p className="text-[11px] text-muted-foreground">Pink patrol beats active across 14 zones</p>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-md space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Safe Haven Radius</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-500">&lt; 450 Meters</div>
          <p className="text-[11px] text-muted-foreground">Average distance to nearest verified sanctuary</p>
        </div>
      </div>

      {/* Main Charts: 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart 1: Hourly Risk Score Curve (Col 8) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-card border border-border shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground">24-Hour Temporal Risk Curve vs Incidents</h3>
              <p className="text-xs text-muted-foreground">Compares risk vulnerability index against reported occurrences</p>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
              Late Night Spike
            </span>
          </div>

          <div className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAIRiskTrends}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.15)" />
                <XAxis dataKey="hour" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Area type="monotone" dataKey="riskLevel" name="Risk Score Index" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#riskGradient)" />
                <Line type="monotone" dataKey="incidentCount" name="Incident Reports" stroke="#3b82f6" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Breakdown Pie (Col 4) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-card border border-border shadow-md space-y-4">
          <h3 className="font-bold text-base text-foreground">Incident Category Distribution</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            {CATEGORY_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-bold text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekday vs Weekend Analysis & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Day of Week Bar Chart (Col 6) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-card border border-border shadow-md space-y-4">
          <h3 className="font-bold text-base text-foreground">Weekly Incident Volume (Weekend Surges)</h3>
          <div className="h-[250px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.15)" />
                <XAxis dataKey="day" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="reports" name="Reports Logged" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Actionable Recommendations (Col 6) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-card border border-border shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold text-base text-foreground">AI Preventive Action Recommendations</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
              <span className="font-bold text-amber-600 dark:text-amber-400 block">
                ⚡ Infrastructure Priority #1: 5th Cross Koramangala
              </span>
              <p className="text-muted-foreground">
                AI analysis identified a 400m lighting blackout cluster. Automated ticket #BBMP-LT-9029 generated for municipal street lamp replacement.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400 block">
                👮 Patrol Optimization: Indiranagar Metro Exit B
              </span>
              <p className="text-muted-foreground">
                Recommend stationing Pink Police beat vehicle from 09:30 PM to 01:00 AM on Friday & Saturday evenings.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                🎓 Campus Safe Walk Coordination: Christ University Gate 3
              </span>
              <p className="text-muted-foreground">
                Deploy student security volunteer escorts between 05:30 PM - 08:30 PM to the nearest metro feeder terminal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
