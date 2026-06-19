'use client';

import { useEffect } from 'react';
import { useExamStore } from '@/store/useExamStore';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';

/**
 * @fileOverview Institutional Anti-Cheat Node v1.5 (Build Fixed).
 * FIXED: Explicitly passed Firestore instance to addViolation.
 */

export default function AntiCheat() {
  const { addViolation } = useExamStore();
  const { toast } = useToast();
  const db = useFirestore();

  useEffect(() => {
    const handleBlur = () => {
      if (!db) return;
      // Pass the db instance as required by the global store.
      addViolation(db);
      
      toast({
        variant: "destructive",
        title: "Security Warning",
        description: "Switching tabs or windows is prohibited during the test. This violation has been recorded in the registry hub."
      });
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [addViolation, toast, db]);

  return null;
}
