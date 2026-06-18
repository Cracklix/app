'use client';

import { useEffect } from 'react';
import { useExamStore } from '@/store/useExamStore';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';

/**
 * @fileOverview Institutional Anti-Cheat Node v1.2.
 * FIXED: Pass Firestore instance to addViolation as required by store.
 */

export default function AntiCheat() {
  const { addViolation } = useExamStore();
  const { toast } = useToast();
  const db = useFirestore();

  useEffect(() => {
    const handleBlur = () => {
      if (!db) return;
      addViolation(db);
      toast({
        variant: "destructive",
        title: "Security Warning",
        description: "Switching tabs or windows is prohibited during the test. This violation has been recorded."
      });
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [addViolation, toast, db]);

  return null;
}
