'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';

/**
 * @file Overview High-Fidelity Tactical Action Bar.
 * UPDATED: Restored standard "Mark for Review" and "Clear Response" flow.
 */
export default function TacticalFooter({ onSubmit }: { onSubmit: () => void }) {
  const currentIdx = useExamStore(s => s.currentIdx);
  const questions = useExamStore(s => s.questions);
  const clearAnswer = useExamStore(s => s.clearAnswer);
  const markForReview = useExamStore(s => s.markForReview);
  const saveAndNext = useExamStore(s => s.saveAndNext);
  
  const db = useFirestore();
  
  return (
    <div className="w-full grid grid-cols-3 gap-3 pt-6 pb-8 bg-white/80 backdrop-blur-sm sticky bottom-0 z-40">
      <Button 
        variant="outline" 
        onClick={() => markForReview(currentIdx, db)}
        className="h-14 rounded-xl font-black uppercase text-[10px] tracking-tight border-slate-300 text-[#0F172A] bg-white active:scale-95 shadow-sm"
      >
        Mark & Next
      </Button>

      <Button 
        variant="outline" 
        onClick={() => clearAnswer(currentIdx, db)}
        className="h-14 rounded-xl font-black uppercase text-[10px] tracking-tight border-slate-300 text-[#0F172A] bg-white active:scale-95 shadow-sm"
      >
        Clear Response
      </Button>

      <Button 
        onClick={() => saveAndNext(db)}
        className="h-14 bg-[#F97316] hover:bg-orange-600 text-white rounded-xl font-black uppercase text-[10px] tracking-tight shadow-xl shadow-orange-500/20 active:scale-95 border-none"
      >
        Save & Next
      </Button>
    </div>
  );
}