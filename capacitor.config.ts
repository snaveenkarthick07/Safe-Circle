import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.safecircle.app',
  appName: 'SafeCircle',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#020617',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK' as any,
      backgroundColor: '#020617',
      overlaysWebView: false,
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_safecircle',
      iconColor: '#E11D48',
    },
    Geolocation: {
      requestPermissions: true,
    },
  },
};

export default config;
