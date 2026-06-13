'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

/**
 * @fileOverview Hardened Error Bridge.
 * Ensures Firestore permission errors trigger a clean Next.js error boundary without [object Event] crashes.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: unknown) => {
      // 1. Audit Error Identity - Strictly only throw Error objects
      if (error instanceof Error) {
        // Use setTimeout to ensure the throw happens outside the event emitter call stack
        setTimeout(() => {
          throw error;
        }, 0);
      } else {
        // 2. Fallback for non-standard events (prevents nextjs [object Event] crash)
        console.error("[CBT SECURITY EVENT]:", error);
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null;
}
