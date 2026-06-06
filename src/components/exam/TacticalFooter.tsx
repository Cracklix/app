'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Flag } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Institutional Tactical Navigation Belt v13.0.
 * Optimized: Sticky bottom belt with mobile-first button grouping.
 * Touch Targets: Corrected layout to prevent "Save & Next" clipping on mobile.
 */
export default function TacticalFooter({ onSubmit }: { onSubmit: () => void }) {
  const { currentIdx, questions, clearAnswer, markForReview, saveAndNext, setCurrentIdx } = useExamStore();
  const db = useFirestore();

  const isLast = currentIdx === questions.length - 1;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-14 md:h-20 bg-white border-t border-slate-200 px-3 flex items-center justify-center shrink-0 z-[60] select-none shadow-[0_-4px_30px_rgba(0,0,0,0.15)] md:shadow-none pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-[920px] flex items-center justify-between gap-1.5 md:gap-4 h-full py-2 md:py-0">
        
        {/* PREVIOUS (Left side focus) */}
        <Button 
          variant="outline" 
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="h-10 md:h-13 px-2.5 md:px-8 rounded-lg md:rounded-xl font-black uppercase text-[8px] md:text-[11px] tracking-widest border-slate-200 text-slate-500 hover:bg-slate-50 transition-all active:scale-95 shrink-0"
        >
          <ChevronLeft className="h-3.5 w-3.5 md:mr-1" /> <span className="hidden md:inline">Previous</span>
        </Button>

        {/* RIGHT GROUP: Primary Actions */}
        <div className="flex-1 flex items-center justify-end gap-1 md:gap-3">
          {/* Mark (Icon focused on mobile) */}
          <Button 
            variant="outline" 
            onClick={() => markForReview(currentIdx, db)}
            className="h-10 md:h-13 px-2 md:px-6 rounded-lg md:rounded-xl font-black uppercase text-[8px] md:text-[10px] border-violet-100 text-violet-600 bg-violet-50 hover:bg-violet-100 flex gap-1 md:gap-2 transition-all active:scale-95 shrink-0"
          >
            <Flag className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Mark</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => clearAnswer(currentIdx, db)}
            className="h-10 md:h-13 px-2 md:px-6 rounded-lg md:rounded-xl font-black uppercase text-[8px] md:text-[10px] border-slate-100 text-slate-400 hover:bg-slate-50 flex gap-1 md:gap-2 transition-all active:scale-95 shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Clear</span>
          </Button>

          {isLast ? (
            <Button 
              onClick={onSubmit}
              className="flex-1 md:flex-none h-10 md:h-13 px-4 md:px-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg md:rounded-xl font-black uppercase text-[9px] md:text-[11px] tracking-widest shadow-xl gap-1.5 md:gap-2 transition-all active:scale-95"
            >
              Submit <CheckCircle2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={() => saveAndNext(db)}
              className="flex-1 md:flex-none h-10 md:h-13 px-4 md:px-12 bg-[#F97316] hover:bg-orange-600 text-white rounded-lg md:rounded-xl font-black uppercase text-[9px] md:text-[11px] tracking-widest shadow-xl shadow-orange-500/20 gap-1.5 md:gap-2 transition-all active:scale-95 border-none"
            >
              Save & Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
