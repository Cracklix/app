'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { X, Zap, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @fileOverview Smart Institutional PWA Install Node v11.0 (Hardened State).
 */
export default function PWAManager() {
  const pathname = usePathname();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const checkStatus = useCallback(() => {
    if (typeof window === 'undefined') return;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    const isExcluded = pathname?.includes('/attempt') || pathname?.startsWith('/admin') || pathname === '/install';
    const isDismissed = localStorage.getItem('cracklix_pwa_dismissed') === 'true';
    
    setIsInstalled(isStandalone);
    setShowPrompt(!isStandalone && !isExcluded && !isDismissed && !!(window as any).deferredPrompt);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    const handlePrompt = (e: any) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      window.dispatchEvent(new CustomEvent('pwa-installable'));
      checkStatus();
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('pwa-installable', checkStatus);
    window.addEventListener('appinstalled', () => setIsInstalled(true));
    checkStatus();

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('pwa-installable', checkStatus);
    };
  }, [checkStatus]);

  if (!mounted || isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-28 md:bottom-12 left-4 md:right-8 z-[2000] w-[calc(100%-2rem)] md:w-[360px]">
        <div className="bg-[#0B1528] text-white p-6 rounded-[2.5rem] shadow-5xl border border-white/10 relative overflow-hidden group">
          <div className="flex flex-col gap-6 relative z-10">
             <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 shadow-inner"><Zap className="h-6 w-6 text-primary" /></div>
                   <div className="text-left"><h4 className="text-sm font-black uppercase tracking-tight">Cracklix App</h4><p className="text-[9px] font-black uppercase text-primary tracking-widest">Get Native Experience</p></div>
                </div>
                <button onClick={() => { localStorage.setItem('cracklix_pwa_dismissed', 'true'); setShowPrompt(false); }} className="p-2 hover:bg-white/5 rounded-xl transition-colors"><X className="h-4 w-4 text-slate-500" /></button>
             </div>
             <p className="text-[13px] font-bold text-slate-300 leading-snug text-left">Practice faster and better with the official app.</p>
             <Button onClick={async () => {
                const prompt = (window as any).deferredPrompt;
                if (prompt) {
                   prompt.prompt();
                   const { outcome } = await prompt.userChoice;
                   if (outcome === 'accepted') setShowPrompt(false);
                }
             }} className="w-full h-14 bg-primary hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl border-none shadow-3xl">INSTALL NOW</Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
