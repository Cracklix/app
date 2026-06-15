'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import { UserProfile } from '@/types';
import { getDeviceId } from '@/lib/device';

/**
 * @fileOverview Hardened Auth & Profile Hook v7.0.
 * OPTIMIZED: Granular loading states to prevent full-page blocking.
 */
export function useUser() {
  const auth = useAuth();
  const db = useFirestore();
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>("");
  
  const profileLoaded = useRef(false);

  useEffect(() => {
    getDeviceId().then(setCurrentDeviceId);
  }, []);

  // 1. Handle Firebase Auth Session
  useEffect(() => {
    if (!auth) return;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthResolved(true);
      if (firebaseUser) {
        setProfileLoading(!profileLoaded.current);
      } else {
        setProfileLoading(false);
        profileLoaded.current = true;
      }
    }, (err) => {
      console.error("[AUTH_SYNC_FAILURE]:", err);
      setAuthResolved(true);
      setProfileLoading(false);
    });

    return () => unsubscribeAuth();
  }, [auth]);

  // 2. Handle Firestore Profile Real-time Sync
  useEffect(() => {
    if (!user || !db) {
      setProfile(null);
      return;
    }

    const unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ ...docSnap.data(), id: docSnap.id } as UserProfile);
      } else {
        setProfile(null);
      }
      
      profileLoaded.current = true;
      setProfileLoading(false);
    }, (err) => {
      console.error("[PROFILE_HUB_FAILURE]:", err);
      profileLoaded.current = true;
      setProfileLoading(false);
    });

    return () => unsubscribeProfile();
  }, [user, db]);

  const isDeviceAuthorized = useMemo(() => {
    if (!profile) return true;
    if (!profile.deviceLock?.deviceId) return true;
    if (profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN') return true;
    if (profile.deviceLock.enforcementLevel < 3) return true;
    return profile.deviceLock.deviceId === currentDeviceId;
  }, [profile, currentDeviceId]);

  return { 
    user, 
    profile, 
    loading: !authResolved, // Main loading only tracks the auth handshake
    profileLoading,         // Profile loading is separate for UI skeletons
    currentDeviceId,
    isDeviceAuthorized
  };
}
