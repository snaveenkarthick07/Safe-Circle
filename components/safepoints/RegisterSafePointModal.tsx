'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Building2, ShieldCheck, CheckCircle2, X, Plus } from 'lucide-react';

interface RegisterSafePointModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterSafePointModal({ isOpen, onClose }: RegisterSafePointModalProps) {
  const { addSafePoint, userLocation } = useApp();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'pharmacy' | 'store_247' | 'hospital' | 'police' | 'campus_security' | 'shelter'>('store_247');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [openHours, setOpenHours] = useState('24 Hours / 7 Days');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    'CCTV Monitored',
    'Security Guard on Duty',
    'Emergency Phone Access'
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSafePoint({
      name: name || 'Local Safe Haven',
      category,
      address: address || 'Main Road, Bengaluru',
      phone: phone || '+91 80 1234 5678',
      contactPerson,
      openHours,
      facilities: selectedFacilities,
      lat: userLocation.lat + 0.003,
      lng: userLocation.lng + 0.003,
    });
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-in fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div 
        className="w-full max-w-xl max-h-[90vh] flex flex-col bg-card border border-border rounded-3xl shadow-2xl text-card-foreground overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {isSubmitted ? (
          <div className="flex flex-col items-center text-center p-6 sm:p-8 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              Application Submitted
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Thank you for supporting community safety. The SafeCircle verification team and local authorities will inspect and verify your safe point within 24-48 hours.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-5 border-b border-border bg-card shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Register a Verified Safe Haven</h3>
                  <p className="text-xs text-muted-foreground">Join the SafeCircle community assistance network</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  Establishment / Safe Haven Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MedPlus 24x7 Pharmacy & Haven"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs font-medium"
                  >
                    <option value="pharmacy">24/7 Pharmacy</option>
                    <option value="store_247">24/7 Supermarket / Cafe</option>
                    <option value="hospital">Hospital / Clinic</option>
                    <option value="police">Police Help Desk / Outpost</option>
                    <option value="campus_security">Campus / College Security</option>
                    <option value="shelter">Women Shelter / NGO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={openHours}
                    onChange={(e) => setOpenHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  Full Physical Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Landmark, City, Pincode"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Contact Person / Manager
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Ramesh S (Store Mgr)"
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 80 2525 0000"
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs font-mono"
                  />
                </div>
              </div>

              {/* Safety Facilities Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
                  Available Safety Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'CCTV Monitored',
                    'Security Guard on Duty',
                    'Emergency Phone Access',
                    'First Aid Trained Staff',
                    'Well Lit Waiting Area',
                    'Drinking Water & Restrooms'
                  ].map((fac) => (
                    <button
                      key={fac}
                      type="button"
                      onClick={() => toggleFacility(fac)}
                      className={`p-2 rounded-xl text-left text-xs font-medium border flex items-center gap-2 transition-all ${
                        selectedFacilities.includes(fac)
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'bg-muted/40 border-border text-muted-foreground'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[10px]">
                        {selectedFacilities.includes(fac) ? '✓' : ''}
                      </span>
                      <span>{fac}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-muted font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  Submit Safe Point Application
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
