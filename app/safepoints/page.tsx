'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SafePoint } from '@/types';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  Navigation, 
  Phone, 
  Plus, 
  Clock, 
  Star, 
  CheckCircle2, 
  Filter, 
  MapPin 
} from 'lucide-react';
import { RegisterSafePointModal } from '@/components/safepoints/RegisterSafePointModal';

export default function SafePointsPage() {
  const { safePoints, userLocation } = useApp();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Safe Havens', icon: '📍' },
    { id: 'pharmacy', label: '24/7 Pharmacies', icon: '💊' },
    { id: 'police', label: 'Pink Police / Outposts', icon: '👮' },
    { id: 'campus_security', label: 'Campus Security', icon: '🎓' },
    { id: 'store_247', label: '24/7 Stores & Cafes', icon: '🏪' },
    { id: 'hospital', label: 'Hospitals', icon: '🏥' },
    { id: 'shelter', label: 'Women Shelters', icon: '🏠' },
  ];

  const filteredSafePoints = safePoints.filter(sp => {
    const matchesCat = activeCategory === 'all' || sp.category === activeCategory;
    const matchesSearch = 
      sp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase mb-1">
            <Building2 className="w-3.5 h-3.5" />
            Verified Community Sanctuary Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Safe Haven Network
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Verified local establishments with trained staff, CCTV surveillance, and emergency shelter assistance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Register Your Business / Haven</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search safe haven by name or area..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Safe Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSafePoints.map((sp) => (
          <div
            key={sp.id}
            className="p-6 rounded-3xl bg-card border border-border shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Category & Verification Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {sp.verified ? 'Verified Safe Haven' : 'Pending Verification'}
                </span>
                <span className="text-xs font-bold text-foreground flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {sp.rating || 4.9}
                </span>
              </div>

              {/* Title & Address */}
              <div>
                <h3 className="font-bold text-base text-foreground leading-snug">
                  {sp.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{sp.address}</span>
                </p>
              </div>

              {/* Operating Hours & Contact */}
              <div className="p-3 rounded-2xl bg-muted/40 border border-border text-xs space-y-1">
                <div className="flex items-center justify-between text-foreground font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {sp.openHours}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                    {sp.distance}
                  </span>
                </div>
                {sp.contactPerson && (
                  <p className="text-[11px] text-muted-foreground pt-0.5">
                    Contact: {sp.contactPerson}
                  </p>
                )}
              </div>

              {/* Safety Facilities */}
              <div className="flex flex-wrap gap-1.5">
                {sp.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-md"
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-border grid grid-cols-2 gap-2">
              <a
                href={`tel:${sp.phone}`}
                className="py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center justify-center gap-1.5 border border-border"
              >
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>Call Haven</span>
              </a>

              <a
                href={`https://maps.google.com/?q=${sp.lat},${sp.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Safe Point Registration Modal */}
      <RegisterSafePointModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}
