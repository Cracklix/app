
'use client';

import { useEffect } from 'react';
import { useExamStore } from '@/store/useExamStore';
import { useToast } from '@/hooks/use-toast';

export default function AntiCheat() {
  const { addViolation } = useExamStore();
  const { toast } = useToast();

  useEffect(() => {
    const handleBlur = () => {
      addViolation();
      toast({
        variant: "destructive",
        title: "Security Warning",
        description: "Switching tabs or windows is prohibited during the test. This violation has been recorded."
      });
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [addViolation, toast]);

  return null;
}
