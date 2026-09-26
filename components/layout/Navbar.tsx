'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { 
  Shield, 
  MapPin, 
  Navigation, 
  FileText, 
  Lock, 
  Sparkles, 
  PhoneCall, 
  Calculator, 
  Sun, 
  Moon, 
  User as UserIcon, 
  ChevronDown, 
  Radio, 
  Building2, 
  ShieldCheck, 
  ShieldAlert,
  BarChart3, 
  Menu, 
  X,
  AlertCircle,
  Globe,
  LogIn,
  LogOut,
  Camera,
  Grid
} from 'lucide-react';
import { TRANSLATIONS, SupportedLanguage } from '@/lib/translations';
import { UserAvatar } from '@/components/common/UserAvatar';
import { UserProfileModal } from '@/components/profile/UserProfileModal';

const ROLE_OPTIONS: { role: UserRole; label: string; icon: string; desc: string; path: string }[] = [
  { role: 'user', label: 'Woman / User', icon: '👩', desc: 'SOS, Journey Guardian & Safe Routes', path: '/dashboard' },
  { role: 'guardian', label: 'Guardian Circle', icon: '🛡️', desc: 'Live family & friend tracking', path: '/guardian' },
  { role: 'authority', label: 'Police / Authority', icon: '👮', desc: 'Incident triage & patrol planning', path: '/authority' },
  { role: 'organization', label: 'Campus / College', icon: '🎓', desc: 'Campus safety & student alert desk', path: '/campus' },
  { role: 'admin', label: 'Super Admin', icon: '⚙️', desc: 'Safe point verification & moderation', path: '/admin' },
];

export function Navbar() {
  const pathname = usePathname();
  const { 
    currentUser, 
    currentRole, 
    switchRole, 
    logout, 
    isAuthenticated,
    isProfileModalOpen, 
    openProfileModal, 
    closeProfileModal 
  } = useAuth();
  const { 
    theme, 
    toggleTheme, 
    toggleDiscreetMode, 
    openFakeCallSettings,
    activeJourney,
    language,
    setLanguage,
  } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreToolsOpen, setMoreToolsOpen] = useState(false);

  // Core high-frequency navigation links shown in top bar
  const primaryNavLinks = [
    { href: '/', label: t.navDashboard, icon: Shield },
    { href: '/map', label: t.navMap, icon: MapPin },
    { href: '/journey', label: t.navJourney, icon: Navigation, badge: activeJourney ? 'LIVE' : undefined },
    { href: '/call-shield', label: 'Call Shield', icon: ShieldAlert, badge: 'AI' },
  ];

  // Secondary tools housed in sleek "More Tools" dropdown
  const secondaryNavLinks = [
    { href: '/safepoints', label: t.navSafePoints, icon: Building2, desc: 'Verified 24/7 shelters & pharmacies' },
    { href: '/reports', label: t.navReports, icon: FileText, desc: 'Anonymous police complaints & tracking' },
    { href: '/vault', label: t.navVault, icon: Lock, desc: 'Encrypted audio & incident dossiers' },
    { href: '/analytics', label: t.navAnalytics, icon: BarChart3, desc: 'Spatial hazard heatmaps & metrics' },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition-all duration-200">
      {/* Demo Role Switcher Top Notification Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/70 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none max-w-full">
          <span className="font-semibold text-indigo-400 flex items-center gap-1.5 shrink-0 text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            Active Role:
          </span>
          <div className="flex items-center gap-1 shrink-0 bg-slate-900/90 border border-slate-800/80 p-0.5 rounded-full">
            {ROLE_OPTIONS.map((item) => (
              <button
                key={item.role}
                onClick={() => switchRole(item.role)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all duration-150 ${
                  currentRole === item.role
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{item.icon} {item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-3 shrink-0 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Radio className="w-3 h-3 animate-pulse" />
            AI Safety Active • Indiranagar & Koramangala
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: SafeCircle Brand Logo & Primary Nav Links */}
        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-500/20 group-hover:scale-105 transition-all duration-200">
                <Shield className="w-4 h-4 fill-white/20" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-lg tracking-tight text-white group-hover:text-rose-400 transition-colors">
                  SafeCircle
                </span>
                <span className="text-[9px] font-extrabold uppercase px-1 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  AI
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium -mt-1 hidden sm:block">Privacy & Safety Platform</span>
            </div>
          </Link>

          {/* Desktop Primary Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 relative whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700/70'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Desktop "More Tools" Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreToolsOpen(!moreToolsOpen)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                  moreToolsOpen || secondaryNavLinks.some(s => pathname === s.href)
                    ? 'bg-slate-800 text-white border border-slate-700/70'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>More Tools</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${moreToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreToolsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreToolsOpen(false)} />
                  <div 
                    className="absolute left-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95"
                    onClick={() => setMoreToolsOpen(false)}
                  >
                    <div className="p-2 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800 mb-1">
                      Extended Safety Suite
                    </div>
                    {secondaryNavLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`p-2 rounded-xl flex items-start gap-2.5 transition-colors ${
                            isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 text-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-semibold text-xs text-white">{item.label}</div>
                            <div className="text-[10px] text-slate-400">{item.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* Right Tools & User Profile Hub */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Fake Call Quick Tool */}
          <button
            onClick={openFakeCallSettings}
            title="Configure & Schedule Fake Call"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 text-xs font-semibold transition-all active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Fake Call</span>
          </button>

          {/* Discreet Calculator Mode */}
          <button
            onClick={toggleDiscreetMode}
            title="Switch to Calculator Camouflage (PIN 1234)"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all active:scale-95"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle Dark / Light Theme"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all active:scale-95"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Language Selector */}
          <div className="relative hidden sm:flex items-center">
            <Globe className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="pl-7 pr-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 appearance-none cursor-pointer focus:outline-none transition-colors"
              title="Select Language"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="ta">TA</option>
              <option value="te">TE</option>
              <option value="ml">ML</option>
              <option value="kn">KN</option>
            </select>
          </div>

          {/* Authentication & Profile Section */}
          {isAuthenticated ? (
            /* User Profile Pill & Dropdown */
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm hover:bg-slate-800/80 transition-all text-xs font-semibold focus:outline-none"
              >
                <UserAvatar user={currentUser} size="xs" ring={false} />
                <div className="hidden sm:flex flex-col text-left max-w-[85px]">
                  <span className="text-xs font-bold leading-none text-slate-100 truncate">
                    {currentUser.name ? currentUser.name.split(' ')[0] : 'Member'}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize truncate leading-tight">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Click outside backdrop */}
              {roleDropdownOpen && (
                <div 
                  className="fixed inset-0 z-40 bg-transparent" 
                  onClick={() => setRoleDropdownOpen(false)} 
                />
              )}

              {/* Dropdown Menu - Viewport-Safe with right-0 and max-w */}
              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-slate-900/98 border border-slate-800 p-3 shadow-2xl z-50 text-xs backdrop-blur-2xl animate-in fade-in zoom-in-95"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* User Details Header */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 mb-2 flex items-center gap-3">
                    <UserAvatar user={currentUser} size="md" showBadge />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-100 truncate text-sm">{currentUser.name || 'SafeCircle Member'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email || 'member@safecircle.org'}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase border border-indigo-500/20">
                        <span>Role:</span>
                        <span className="capitalize">{currentUser.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Settings Links */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        openProfileModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 font-semibold text-left transition-colors"
                    >
                      <Camera className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Edit Profile & Photo</span>
                    </button>

                    <Link
                      href="/profile"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 font-semibold transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-pink-500 shrink-0" />
                      <span>Privacy & Safety Preferences</span>
                    </Link>

                    <Link
                      href={
                        currentRole === 'guardian' ? '/guardian' :
                        currentRole === 'authority' ? '/authority' :
                        currentRole === 'organization' ? '/campus' :
                        currentRole === 'admin' ? '/admin' : '/dashboard'
                      }
                      onClick={() => setRoleDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 font-semibold transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Role Dashboard</span>
                    </Link>
                  </div>

                  {/* Switch View Role */}
                  <div className="pt-2 mt-2 border-t border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase px-2 mb-1.5">Switch View Role</p>
                    <div className="space-y-0.5">
                      {ROLE_OPTIONS.map((item) => (
                        <button
                          key={item.role}
                          onClick={() => {
                            switchRole(item.role);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                            currentRole === item.role ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-400'
                          }`}
                        >
                          <span>{item.icon} {item.label}</span>
                          {currentRole === item.role && <span>✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sign Out Action */}
                  <div className="pt-2 mt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-bold transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Sign Out of SafeCircle</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated Login Buttons */
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-3.5 py-1.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold shadow-md transition-all"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800/80 p-4 space-y-3 animate-in slide-in-from-top-2 backdrop-blur-xl">
          {/* Mobile Active User Card */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <UserAvatar user={currentUser} size="md" showBadge />
              <div className="min-w-0">
                <p className="font-bold text-sm text-white truncate">{currentUser.name || 'Member'}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.email || 'member@safecircle.org'}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openProfileModal();
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold shrink-0"
              title="Edit Profile"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 hover:text-white"
            >
              <UserIcon className="w-4 h-4 text-pink-500" />
              <span>Settings</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openFakeCallSettings();
              }}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-semibold flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Fake Call</span>
            </button>
          </div>

          <div className="space-y-1 pt-1">
            {allNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Sign Out Button */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out of SafeCircle</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />
    </header>
  );
}
