'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';

/**
 * @file Overview High-Fidelity Tactical Action Bar v2.1 (Absolute Minimum).
 * UPDATED: Replaced orange button with Primary Blue.
 */
export default function TacticalFooter({ onSubmit }: { onSubmit: () => void }) {
  const currentIdx = useExamStore(s => s.currentIdx);
  const questions = useExamStore(s => s.questions);
  const clearAnswer = useExamStore(s => s.clearAnswer);
  const markForReview = useExamStore(s => s.markForReview);
  const saveAndNext = useExamStore(s => s.saveAndNext);
  
  const db = useFirestore();
  
  return (
    <div className="w-full grid grid-cols-3 gap-1 md:gap-4 pt-2 pb-4 bg-white/80 backdrop-blur-sm sticky bottom-0 z-40">
      <Button 
        variant="outline" 
        onClick={() => markForReview(currentIdx, db)}
        className="h-9 md:h-12 rounded-md font-black uppercase text-[6px] md:text-[9px] tracking-tighter border-slate-200 text-[#334155] bg-white active:scale-95 shadow-sm"
      >
        Mark Node
      </Button>

      <Button 
        variant="outline" 
        onClick={() => clearAnswer(currentIdx, db)}
        className="h-9 md:h-12 rounded-md font-black uppercase text-[6px] md:text-[9px] tracking-tighter border-slate-200 text-[#334155] bg-white active:scale-95 shadow-sm"
      >
        Clear
      </Button>

      <Button 
        onClick={() => saveAndNext(db)}
        className="h-9 md:h-12 bg-primary hover:bg-blue-700 text-white rounded-md font-black uppercase text-[6px] md:text-[9px] tracking-tighter shadow-xl border-none active:scale-95"
      >
        Save & Next
      </Button>
    </div>
  );
}
