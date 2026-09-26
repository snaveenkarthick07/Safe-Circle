'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  initSafeCircleMobileEngine, 
  triggerHapticFeedback, 
  dispatchNativeEmergencyNotification,
  isCapacitorNative,
  getAppPlatform
} from '@/lib/nativeMobileService';

export function MobileLifecycleManager() {
  const { isEmergencyTriggered, isSOSActive } = useApp();
  const [platform, setPlatform] = useState<string>('web');
  const [isNative, setIsNative] = useState(false);

  // Initialize mobile hardware on app mount
  useEffect(() => {
    initSafeCircleMobileEngine().then((status) => {
      setPlatform(status.platform);
      setIsNative(status.isNative);
    });
  }, []);

  // Vibrate phone and send native heads-up notification when Emergency SOS triggers
  useEffect(() => {
    if (isEmergencyTriggered || isSOSActive) {
      triggerHapticFeedback('emergency');
      dispatchNativeEmergencyNotification(
        'EMERGENCY SOS BROADCAST ACTIVE',
        'Live GPS coordinates and audio telemetry broadcasted to your Guardian Circle.'
      );
    }
  }, [isEmergencyTriggered, isSOSActive]);

  return null;
}
