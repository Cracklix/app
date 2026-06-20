'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'primary' | 'secondary' | 'dark';
  showLabel?: boolean;
}

/**
 * @fileOverview Hardened PWA Install Trigger v13.0.
 * LOGIC: Synchronized with PWAManager. Captures direct beforeinstallprompt and custom sync event.
 */
export default function PWAInstallButton({ 
  className, 
  variant = 'default',
  showLabel = true 
}: PWAInstallButtonProps) {
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const updateState = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    setIsInstalled(isStandalone);

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Button should be visible if not installed AND (deferredPrompt exists OR it is iOS)
    const hasPrompt = !!(window as any).deferredPrompt;
    setCanInstall(!isStandalone && (hasPrompt || ios));
  }, []);

  useEffect(() => {
    setMounted(true);

    const handlePrompt = (e: any) => {
      // Prompt event captured at component level if manager missed it or mounted late
      e.preventDefault();
      (window as any).deferredPrompt = e;
      updateState();
    };

    // Listen for both native and custom sync event from PWAManager
    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('pwa-installable', updateState);
    
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setCanInstall(false);
    });
    
    // Initial check
    updateState();

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('pwa-installable', updateState);
    };
  }, [updateState]);

  const handleInstall = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isIOS) {
       toast({
         title: "📱 Add to Home Screen",
         description: "Tap the 'Share' icon in Safari and select 'Add to Home Screen' to install Cracklix.",
       });
       return;
    }

    const prompt = (window as any).deferredPrompt;
    if (!prompt) {
      toast({
        title: "PWA Hub Ready",
        description: "Your browser hasn't triggered the install handshake yet. Try reloading or check your settings.",
      });
      return;
    }

    try {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        (window as any).deferredPrompt = null;
        setCanInstall(false);
      }
    } catch (err) {
      console.error('[PWA_INSTALL_FAILURE]:', err);
    }
  };

  if (!mounted || isInstalled || !canInstall) return null;

  return (
    <Button
      onClick={handleInstall}
      className={cn(
        "font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl transition-all active:scale-95",
        variant === 'primary' ? "bg-primary hover:bg-blue-700 text-white border-none" : 
        variant === 'dark' ? "bg-[#0B1528] hover:bg-black text-white border-none" : 
        variant === 'outline' ? "bg-white border-slate-200 text-[#0F172A] hover:bg-slate-50" : "",
        className
      )}
    >
      {isIOS ? <Smartphone className="h-4 w-4" /> : <Download className="h-4 w-4" />}
      {showLabel && (isIOS ? "Install App" : "Install App")}
      <Sparkles className="h-3 w-3 text-primary animate-pulse" />
    </Button>
  );
}
