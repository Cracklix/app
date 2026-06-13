
'use client';

import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import { UserProfile } from '@/types';

/**
 * @fileOverview Hardened Auth & Profile Hook v3.0.
 * FIXED: Aggressive loading state management to prevent redirect loops on mobile.
 * Loading remains true until Auth state is resolved AND profile is fetched (if user exists).
 */
export function useUser() {
  const auth = useAuth();
  const db = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authResolved, setAuthResolved] = useState(false);
  
  const initialCheckDone = useRef(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthResolved(true);
      
      // If no user, we can stop loading immediately
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
      initialCheckDone.current = true;
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!user || !db) return;

    // If we have a user but no profile yet, we are still loading
    setLoading(true);

    const unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ ...docSnap.data(), id: docSnap.id } as UserProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("[PROFILE SYNC ERROR]:", err);
      setLoading(false);
    });

    return () => unsubscribeProfile();
  }, [user, db]);

  // Combined loading state: True if auth hasn't even started checking, 
  // or if it's checking, or if user is found but profile is still pending.
  const isActuallyLoading = !authResolved || (user && loading);

  return { 
    user, 
    profile, 
    loading: isActuallyLoading 
  };
}
