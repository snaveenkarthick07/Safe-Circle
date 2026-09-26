import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { SOSFloatingButton } from '@/components/emergency/SOSFloatingButton';
import { SOSActiveModal } from '@/components/emergency/SOSActiveModal';
import { FakeCallModal } from '@/components/emergency/FakeCallModal';
import { DiscreetCalculator } from '@/components/emergency/DiscreetCalculator';
import { VoiceTriggerModal } from '@/components/emergency/VoiceTriggerModal';
import { SafeRouteModal } from '@/components/maps/SafeRouteModal';
import { ScamCallAlertModal } from '@/components/emergency/ScamCallAlertModal';
import { AcousticTriggerCountdownModal } from '@/components/emergency/AcousticTriggerCountdownModal';
import { MobileLifecycleManager } from '@/components/mobile/MobileLifecycleManager';

export const metadata: Metadata = {
  title: 'SafeCircle — Privacy-Conscious AI Women Safety Platform',
  description: 'AI-powered women safety, route risk analysis, guardian circle, and community assistance network.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SafeCircle',
  },
};

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#020617" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
          crossOrigin="" 
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-rose-600 selection:text-white">
        <AuthProvider>
          <AppProvider>
            {/* Native Mobile Lifecycle & Permissions Initializer */}
            <MobileLifecycleManager />

            {/* Global Navigation Header */}
            <Navbar />

            {/* Page Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Global Footer */}
            <Footer />

            {/* Mobile Bottom Navigation */}
            <BottomNav />

            {/* Global Emergency Modals & Floating Tools */}
            <SOSFloatingButton />
            <SOSActiveModal />
            <FakeCallModal />
            <DiscreetCalculator />
            <VoiceTriggerModal />
            <SafeRouteModal />
            <ScamCallAlertModal />
            <AcousticTriggerCountdownModal />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

