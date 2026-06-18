'use client';

import { ReactNode, useMemo, useState, useEffect } from 'react';
import { initializeFirebase } from './app';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import SessionGuard from '@/components/auth/SessionGuard';

/**
 * @fileOverview Master Client Boundary Node v2.3.
 * SECURE: Integrates the real-time Session Guard for one-device policy.
 * STABILITY: Added hydration guard to prevent ChunkLoadError in RootLayout.
 */
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { app, firestore, auth, storage } = useMemo(() => initializeFirebase(), []);

  // Hydration Guard: Prevents ChunkLoadError by ensuring client logic 
  // only runs after the initial mount is stable.
  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <FirebaseProvider app={app} firestore={firestore} auth={auth} storage={storage}>
      <FirebaseErrorListener />
      <SessionGuard />
      {children}
    </FirebaseProvider>
  );
}
