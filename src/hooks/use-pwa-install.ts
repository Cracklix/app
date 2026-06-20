'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * @fileOverview Universal PWA Hook v1.0.
 */
export function usePWAInstall() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  const checkStatus = useCallback(() => {
    if (typeof window === 'undefined') return;
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    setIsInstalled(standalone);
    setCanInstall(!!(window as any).deferredPrompt);
  }, []);

  useEffect(() => {
    checkStatus();
    const handlePrompt = (e: any) => {
       e.preventDefault();
       (window as any).deferredPrompt = e;
       setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', () => setIsInstalled(true));
    
    return () => {
       window.removeEventListener('beforeinstallprompt', handlePrompt);
    };
  }, [checkStatus]);

  const installApp = async () => {
    const prompt = (window as any).deferredPrompt;
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') (window as any).deferredPrompt = null;
  };

  return { isInstalled, canInstall, installApp };
}
