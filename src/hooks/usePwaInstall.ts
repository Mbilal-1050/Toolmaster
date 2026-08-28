import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  useEffect(() => {
    // 1. Detect if running in standalone/installed mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      
      const storedInstalled = localStorage.getItem('toolmaster_pwa_installed') === 'true';

      setIsStandalone(isStandaloneMode);
      if (isStandaloneMode || storedInstalled) {
        setIsInstalled(true);
      }
    };

    checkStandalone();

    // 2. Detect iOS device (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    
    setIsIos(isIosDevice);

    // 3. Listen for Chromium/Android beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent automatic mini-infobar from appearing
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    // 4. Listen for appinstalled event
    const handleAppInstalled = () => {
      localStorage.setItem('toolmaster_pwa_installed', 'true');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    if (isInstalled || isStandalone) {
      return;
    }

    if (isIos) {
      setShowIosModal(true);
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          localStorage.setItem('toolmaster_pwa_installed', 'true');
          setIsInstalled(true);
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Error triggering PWA install prompt:', err);
      }
    } else {
      // Fallback: If not iOS and prompt not captured yet (e.g. desktop non-Chrome or general instructions)
      setShowIosModal(true);
    }
  }, [deferredPrompt, isInstalled, isStandalone, isIos]);

  // Determine if the Install button should be shown:
  // Should show if:
  // - Not running in standalone mode
  // - Not previously marked as installed
  // - Either beforeinstallprompt fired (Android/Chrome/Edge) OR it's an iOS device
  const canShowButton = !isStandalone && !isInstalled && (isInstallable || isIos);

  return {
    isInstallable,
    isInstalled,
    isIos,
    isStandalone,
    canShowButton,
    showIosModal,
    setShowIosModal,
    triggerInstall,
  };
}
