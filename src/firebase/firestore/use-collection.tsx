'use client';

import { useState, useEffect } from 'react';
import { 
  Query, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData, 
  FirestoreError 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '../errors';

/**
 * @fileOverview Hardened Firestore Collection Hook v2.0.
 * Features: Automatic cleanup, hydration-proof validation, and enterprise error logging.
 */

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    // 1. Enterprise Guard: Prevent initialization with null query or invalid SDK instance
    if (!query || typeof query !== 'object') {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);

    // 2. Real-time Subscription with cleanup
    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(items as T[]);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("[FIRESTORE REGISTRY] Access Exception:", err);
        
        // 3. Security Error Monitoring
        if (err.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: (query as any)?._query?.path?.segments?.join('/') || 'registry_node',
            operation: 'list',
          } satisfies SecurityRuleContext);

          errorEmitter.emit('permission-error', permissionError);
        }
        
        setError(err);
        setLoading(false);
      }
    );

    // 4. Memory Management: Strict cleanup on unmount or query change
    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}