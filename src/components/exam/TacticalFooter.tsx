'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Flag } from 'lucide-react';
import { useFirestore } from '@/firebase';

/**
 * @fileOverview Institutional Tactical Navigation Belt v10.0.
 * Optimized: Aligned to center max-width (1000px) to bring buttons closer to options.
 * Order: [PREVIOUS] ... [MARK & NEXT] [CLEAR RESPONSE] [SAVE & NEXT]
 */
export default function TacticalFooter({ onSubmit }: { onSubmit: () => void }) {
  const { currentIdx, questions, clearAnswer, markForReview, saveAndNext, setCurrentIdx } = useExamStore();
  const db = useFirestore();

  const isLast = currentIdx === questions.length - 1;

  return (
    <footer className="h-16 bg-white border-t border-slate-200 px-4 flex items-center justify-center shrink-0 z-50 select-none shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
      <div className="w-full max-w-[1000px] flex items-center justify-between">
        
        {/* LEFT: PREVIOUS ACTION */}
        <div className="flex items-center">
          <Button 
            variant="outline" 
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="h-10 px-4 md:px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-slate-200 text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
        </div>

        {/* RIGHT: CORE TACTICAL ACTIONS */}
        <div className="flex items-center gap-2 md:gap-3">
          <Button 
            variant="outline" 
            onClick={() => markForReview(currentIdx, db)}
            className="h-10 px-3 md:px-6 rounded-xl font-black uppercase text-[9px] tracking-tight border-violet-200 text-violet-600 bg-violet-50 hover:bg-violet-100 hidden sm:flex gap-2 transition-all active:scale-95"
          >
            <Flag className="h-4 w-4" /> Mark & Next
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => clearAnswer(currentIdx, db)}
            className="h-10 px-3 md:px-6 rounded-xl font-black uppercase text-[9px] tracking-tight border-slate-200 text-slate-500 hover:bg-slate-50 gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="h-4 w-4" /> Clear
          </Button>

          {isLast ? (
            <Button 
              onClick={onSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-6 md:px-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl gap-2 transition-all active:scale-95"
            >
              Submit <CheckCircle2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={() => saveAndNext(db)}
              className="bg-[#F97316] hover:bg-orange-600 text-white h-10 px-6 md:px-12 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl gap-2 transition-all active:scale-95"
            >
              Save & Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
