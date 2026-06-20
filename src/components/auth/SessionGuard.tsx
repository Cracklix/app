'use client';

import { useEffect, useRef } from 'react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview Hardened Takeover Session Guard v12.0 (Handshake suppression).
 * LOGIC: Suppression delay added to allow login writes to propagate before invalidating.
 */
export default function SessionGuard() {
  const { user, profile, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const isSigningOut = useRef(false);
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    // 1. Guard against unauthenticated states
    if (loading || !user || !profile || isSigningOut.current) return;
    
    // 2. Ignore guard if on login or registration nodes
    if (pathname === '/login' || pathname === '/profile-setup') return;

    // 3. Handshake Suppression
    // Suppress takeover check for 2 seconds after mount to allow login state propagation
    if (Date.now() - mountedAt.current < 2000) return;

    // 4. Authority Validation
    const localSessionId = localStorage.getItem('cracklix_session_id');
    const cloudSessionId = profile.activeDeviceId;

    // 5. Takeover Detection
    if (cloudSessionId && localSessionId && cloudSessionId !== localSessionId) {
      isSigningOut.current = true;
      
      console.warn("[SESSION_TAKEOVER]: Invalidation triggered by cloud authority mismatch.");

      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Your account was logged in on another device. This session has been terminated for security.",
      });

      // Atomic Sign Out node
      signOut(auth).then(() => {
        localStorage.removeItem('cracklix_session_id');
        router.replace('/login');
        isSigningOut.current = false;
      }).catch(err => {
        console.error("[SESSION_TERMINATION_FAILURE]:", err);
        isSigningOut.current = false;
      });
    }
  }, [user, profile, loading, auth, router, toast, pathname]);

  return null;
}
