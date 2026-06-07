'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { cn } from '@/lib/utils';

/**
 * @file Overview High-Fidelity Tactical Action Bar.
 * Reordered and styled to match the specific mobile screenshot layout.
 */
export default function TacticalFooter({ onSubmit }: { onSubmit: () => void }) {
  const currentIdx = useExamStore(s => s.currentIdx);
  const questions = useExamStore(s => s.questions);
  const clearAnswer = useExamStore(s => s.clearAnswer);
  const markForReview = useExamStore(s => s.markForReview);
  const saveAndNext = useExamStore(s => s.saveAndNext);
  
  const db = useFirestore();
  const isLast = currentIdx === questions.length - 1;

  return (
    <div className="w-full grid grid-cols-3 gap-3 pt-6 pb-8 bg-white/80 backdrop-blur-sm sticky bottom-0 z-40">
      <Button 
        variant="outline" 
        onClick={() => markForReview(currentIdx, db)}
        className="h-14 rounded-xl font-black uppercase text-[10px] tracking-tight border-slate-300 text-[#0F172A] bg-white active:scale-95"
      >
        Mark & Next
      </Button>

      <Button 
        variant="outline" 
        onClick={() => clearAnswer(currentIdx, db)}
        className="h-14 rounded-xl font-black uppercase text-[10px] tracking-tight border-slate-300 text-[#0F172A] bg-white active:scale-95"
      >
        Clear
      </Button>

      <Button 
        onClick={isLast ? onSubmit : () => saveAndNext(db)}
        className="h-14 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-black uppercase text-[10px] tracking-tight shadow-xl shadow-blue-500/20 active:scale-95"
      >
        {isLast ? 'Finish Test' : 'Save & Next'}
      </Button>
    </div>
  );
}
