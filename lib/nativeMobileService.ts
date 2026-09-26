/**
 * SafeCircle Native Mobile & Capacitor Integration Service
 * 
 * Provides unified interfaces for:
 * 1. High-accuracy mobile GPS location permissions & background tracking
 * 2. Push & Local notification permissions and emergency heads-up dispatches
 * 3. Haptic vibration feedback (Single pulse, warning, SOS triple vibration)
 * 4. Android Status Bar & Splash Screen native lifecycle control
 * 
 * Uses runtime `window.Capacitor.Plugins` bridging with automatic fallbacks
 * when running in standard Web browser / PWA mode.
 */

export interface NativeLocationCoords {
  lat: number;
  lng: number;
  accuracy: number;
  altitude?: number | null;
  speed?: number | null;
}

export interface NativePermissionStatus {
  location: 'granted' | 'denied' | 'prompt';
  notifications: 'granted' | 'denied' | 'prompt';
  isNative: boolean;
  platform: 'android' | 'ios' | 'web';
}

/**
 * Access the global Capacitor object safely
 */
function getCapacitorGlobal(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).Capacitor || null;
}

/**
 * Access a registered Capacitor native plugin from window.Capacitor.Plugins
 */
function getCapacitorPlugin(pluginName: string): any {
  const cap = getCapacitorGlobal();
  if (cap && cap.Plugins && cap.Plugins[pluginName]) {
    return cap.Plugins[pluginName];
  }
  return null;
}

/**
 * Detects if the current environment is running inside a Capacitor Native container
 */
export function isCapacitorNative(): boolean {
  const cap = getCapacitorGlobal();
  return !!(cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform());
}

/**
 * Returns current platform name
 */
export function getAppPlatform(): 'android' | 'ios' | 'web' {
  const cap = getCapacitorGlobal();
  if (cap && typeof cap.getPlatform === 'function') {
    return cap.getPlatform();
  }
  if (typeof window === 'undefined') return 'web';
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  if (/android/i.test(userAgent)) return 'android';
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) return 'ios';
  return 'web';
}

/**
 * 1. Request High-Accuracy Mobile GPS Location Permissions
 */
export async function requestLocationPermissions(): Promise<'granted' | 'denied' | 'prompt'> {
  if (typeof window === 'undefined') return 'prompt';

  // Capacitor Native Execution via bridge
  const geoPlugin = getCapacitorPlugin('Geolocation');
  if (geoPlugin && typeof geoPlugin.requestPermissions === 'function') {
    try {
      const status = await geoPlugin.requestPermissions();
      return status.location === 'granted' ? 'granted' : 'denied';
    } catch (err) {
      console.warn('Capacitor Geolocation error:', err);
    }
  }

  // Web Browser Geolocation API Fallback
  if ('permissions' in navigator && navigator.permissions.query) {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return permissionStatus.state;
    } catch (e) {
      // Some browsers don't support geolocation query
    }
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      () => resolve('granted'),
      () => resolve('denied'),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
}

/**
 * Fetch Current High-Accuracy Mobile Coordinates
 */
export async function getNativeCurrentPosition(): Promise<NativeLocationCoords> {
  const geoPlugin = getCapacitorPlugin('Geolocation');
  if (geoPlugin && typeof geoPlugin.getCurrentPosition === 'function') {
    try {
      const pos = await geoPlugin.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
      return {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        altitude: pos.coords.altitude,
        speed: pos.coords.speed,
      };
    } catch (err) {
      console.warn('Capacitor getCurrentPosition failed, falling back to web:', err);
    }
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your device'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          speed: position.coords.speed,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

/**
 * 2. Request Mobile Notification Permissions
 */
export async function requestNotificationPermissions(): Promise<'granted' | 'denied' | 'prompt'> {
  if (typeof window === 'undefined') return 'prompt';

  // Capacitor Native Execution via bridge
  const notifPlugin = getCapacitorPlugin('LocalNotifications');
  if (notifPlugin && typeof notifPlugin.requestPermissions === 'function') {
    try {
      const status = await notifPlugin.requestPermissions();
      return status.display === 'granted' ? 'granted' : 'denied';
    } catch (err) {
      console.warn('Capacitor LocalNotifications request error:', err);
    }
  }

  // Web Browser Notification API Fallback
  if ('Notification' in window) {
    try {
      const result = await Notification.requestPermission();
      return result === 'granted' ? 'granted' : result === 'denied' ? 'denied' : 'prompt';
    } catch (e) {
      console.warn('Web Notification request error:', e);
    }
  }

  return 'prompt';
}

/**
 * Dispatch Immediate Native Heads-up Emergency Notification
 */
export async function dispatchNativeEmergencyNotification(title: string, body: string, actionId = 'sos') {
  if (typeof window === 'undefined') return;

  const notifPlugin = getCapacitorPlugin('LocalNotifications');
  if (notifPlugin && typeof notifPlugin.schedule === 'function') {
    try {
      await notifPlugin.schedule({
        notifications: [
          {
            title: `🚨 ${title}`,
            body,
            id: Date.now() % 100000,
            sound: 'emergency_beacon.wav',
            smallIcon: 'ic_stat_safecircle',
            iconColor: '#E11D48',
            schedule: { at: new Date(Date.now() + 100) },
            extra: { action: actionId },
          },
        ],
      });
      return;
    } catch (err) {
      console.warn('Capacitor local notification schedule error:', err);
    }
  }

  // Web Notification fallback
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`🚨 ${title}`, {
      body,
      icon: '/icons/icon-192x192.svg',
      badge: '/icons/icon-192x192.svg',
      tag: 'safecircle-emergency',
    });
  }
}

/**
 * 3. Native Mobile Haptic Feedback Triggers
 */
export async function triggerHapticFeedback(pattern: 'light' | 'warning' | 'emergency') {
  if (typeof window === 'undefined') return;

  const hapticsPlugin = getCapacitorPlugin('Haptics');
  if (hapticsPlugin) {
    try {
      if (pattern === 'light' && typeof hapticsPlugin.impact === 'function') {
        await hapticsPlugin.impact({ style: 'LIGHT' });
        return;
      } else if (pattern === 'warning' && typeof hapticsPlugin.notification === 'function') {
        await hapticsPlugin.notification({ type: 'WARNING' });
        return;
      } else if (pattern === 'emergency' && typeof hapticsPlugin.vibrate === 'function') {
        await hapticsPlugin.vibrate({ duration: 1500 });
        return;
      }
    } catch (err) {
      console.warn('Capacitor Haptics bridge error:', err);
    }
  }

  // Web Vibration API fallback
  if ('vibrate' in navigator) {
    if (pattern === 'light') {
      navigator.vibrate(50);
    } else if (pattern === 'warning') {
      navigator.vibrate([100, 50, 100]);
    } else if (pattern === 'emergency') {
      // S-O-S pattern in Morse code: ... --- ...
      navigator.vibrate([100, 50, 100, 50, 100, 150, 300, 50, 300, 50, 300, 150, 100, 50, 100, 50, 100]);
    }
  }
}

/**
 * 4. Native Status Bar & Splash Screen Setup
 */
export async function setupMobileNativeUI() {
  if (typeof window === 'undefined' || !isCapacitorNative()) return;

  const statusBarPlugin = getCapacitorPlugin('StatusBar');
  if (statusBarPlugin) {
    try {
      if (typeof statusBarPlugin.setStyle === 'function') {
        await statusBarPlugin.setStyle({ style: 'DARK' });
      }
      if (typeof statusBarPlugin.setBackgroundColor === 'function') {
        await statusBarPlugin.setBackgroundColor({ color: '#020617' });
      }
      if (typeof statusBarPlugin.setOverlaysWebView === 'function') {
        await statusBarPlugin.setOverlaysWebView({ overlay: false });
      }
    } catch (err) {
      console.warn('StatusBar native setup notice:', err);
    }
  }

  const splashPlugin = getCapacitorPlugin('SplashScreen');
  if (splashPlugin && typeof splashPlugin.hide === 'function') {
    try {
      await splashPlugin.hide();
    } catch (err) {
      console.warn('SplashScreen hide notice:', err);
    }
  }
}

/**
 * 5. Master Launch Initializer: Request permissions and setup hardware on startup
 */
export async function initSafeCircleMobileEngine(): Promise<NativePermissionStatus> {
  const isNative = isCapacitorNative();
  const platform = getAppPlatform();

  // Setup status bar & hide splash screen if native
  if (isNative) {
    await setupMobileNativeUI();
  }

  // Check / prompt location permission
  const locationStatus = await requestLocationPermissions();

  // Request notifications
  const notificationStatus = await requestNotificationPermissions();

  // Register service worker if in PWA mode
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && !isNative) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('SafeCircle ServiceWorker registered successfully:', reg.scope))
      .catch((err) => console.warn('ServiceWorker registration skipped:', err));
  }

  return {
    location: locationStatus,
    notifications: notificationStatus,
    isNative,
    platform,
  };
}

