'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

/**
 * @fileOverview A component that listens for FirestorePermissionError events 
 * and throws them as uncaught exceptions to trigger the Next.js error overlay.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: Error) => {
      // Re-throwing the error here will cause it to be picked up by 
      // the global error handler and displayed in the Next.js development overlay.
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null;
}