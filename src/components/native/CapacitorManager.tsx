'use client';

import { useEffect } from 'react';
import { Capacitor, PluginListenerHandle, registerPlugin } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useUser } from '@/firebase';

// Bridge to our internal native Security plugin
const Security = registerPlugin<any>('Security');

/**
 * @fileOverview Production Capacitor Bridge v3.0.
 * Handles hardware back button, system status bars, and external browser routing.
 */
export default function CapacitorManager() {
  const { profile } = useUser();

  // 1. Role-based Screenshot Protection
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    if (profile) {
      const isAdmin = profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN';
      // Protect content for students, allow for admins
      Security.setPrivacyScreen({ enabled: !isAdmin }).catch(() => {});
    }
  }, [profile]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let backListenerHandle: PluginListenerHandle | null = null;
    let urlListenerHandle: PluginListenerHandle | null = null;

    const setupListeners = async () => {
      // 2. Hardware Back Button Protocol
      backListenerHandle = await App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });

      // 3. Status Bar Standard (Matches Website Branding)
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#0B1528' });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (e) {
        console.warn('[NATIVE_BRIDGE] StatusBar init failed');
      }

      // 4. App Deep Linking
      urlListenerHandle = await App.addListener('appUrlOpen', (data) => {
        const slug = data.url.split('.app').pop();
        if (slug) window.location.href = slug;
      });
    };

    setupListeners();

    // 5. External Link Interceptor (PDFs and Third-Party)
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href && Capacitor.isNativePlatform()) {
        try {
          const url = new URL(anchor.href);
          const isExternal = url.hostname !== window.location.hostname;
          const isPdf = anchor.href.toLowerCase().endsWith('.pdf');

          if (isExternal || isPdf) {
            e.preventDefault();
            Browser.open({ url: anchor.href });
          }
        } catch (e) {}
      }
    };

    document.addEventListener('click', handleLinkClick);
    
    return () => {
      document.removeEventListener('click', handleLinkClick);
      if (backListenerHandle) backListenerHandle.remove();
      if (urlListenerHandle) urlListenerHandle.remove();
    };
  }, []);

  return null;
}
