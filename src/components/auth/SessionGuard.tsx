'use client';

import { useEffect, useRef } from 'react';
import { useUser, useAuth, useDoc, useFirestore } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { doc } from 'firebase/firestore';

/**
 * @fileOverview Hardened Takeover Session Guard v15.0 (Global Logout Aware).
 */
export default function SessionGuard() {
  const { user, profile, loading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  const isSigningOut = useRef(false);
  const mountedAt = useRef(Date.now());

  // Listen to Global Maintenance/Security Node
  const { data: globalSettings } = useDoc<any>(doc(db!, 'settings', 'global'));

  useEffect(() => {
    if (loading || !user || !profile || isSigningOut.current || !globalSettings) return;
    
    if (pathname === '/login' || pathname === '/profile-setup') return;

    // 1. Handshake Suppression
    if (Date.now() - mountedAt.current < 2000) return;

    // 2. Global Force Logout Check
    // If the maintenance timestamp is newer than user's last login, invalidate session.
    if (globalSettings.maintenanceModeAt) {
       const maintenanceTime = globalSettings.maintenanceModeAt.seconds * 1000;
       const lastLoginTime = profile.lastLoginAt?.seconds ? profile.lastLoginAt.seconds * 1000 : 0;
       
       if (maintenanceTime > lastLoginTime) {
          terminateSession("System Maintenance", "All active sessions have been reset by the administrator.");
          return;
       }
    }

    // 3. Multi-Device Takeover Check
    const localSessionId = localStorage.getItem('cracklix_session_id');
    const cloudSessionId = profile.activeDeviceId;

    if (cloudSessionId && localSessionId && cloudSessionId !== localSessionId) {
       terminateSession("Session Expired", "Your account was logged in on another device.");
    }

    async function terminateSession(title: string, desc: string) {
      isSigningOut.current = true;
      toast({ variant: "destructive", title, description: desc });
      
      try {
        await signOut(auth);
        localStorage.removeItem('cracklix_session_id');
        router.replace('/login');
      } finally {
        isSigningOut.current = false;
      }
    }

  }, [user, profile, loading, auth, router, toast, pathname, globalSettings]);

  return null;
}