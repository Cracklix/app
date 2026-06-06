
'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { Pause, Play, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import Timer from '@/components/mocks/Timer';

/**
 * @fileOverview Professional Testbook-style CBT Header v3.0.
 * Optimized height (h-12 / h-10) for maximum density.
 */
export default function ExamHeader({ title, onPaletteToggle }: { title: string, onPaletteToggle: () => void }) {
  const { 
    isPaused, 
    setPaused, 
    language, 
    setLanguage, 
    currentIdx, 
    questions, 
    currentSectionId,
    timeLeft 
  } = useExamStore();

  const formattedSection = currentSectionId.replace(/-/g, ' ').toUpperCase();

  return (
    <header className="bg-[#0B1528] text-white flex flex-col shrink-0 shadow-xl border-b border-white/10 sticky top-0 z-50">
      
      {/* ROW 1: PRIMARY CONTROLS (Ultra Compact) */}
      <div className="h-12 md:h-14 flex items-center justify-between px-4 md:px-8 border-b border-white/5">
        
        {/* LEFT: Identity */}
        <div className="flex items-center gap-3">
           <h1 className="hidden md:block font-black text-[11px] uppercase tracking-tight truncate max-w-[200px]">{title}</h1>
           <div className="flex items-center bg-white/5 p-0.5 rounded-lg border border-white/10">
              {(['en', 'pa', 'bi'] as const).map(l => (
                <button 
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[8px] font-black tracking-widest transition-all",
                    language === l ? "bg-[#F97316] text-white shadow-lg" : "text-[#7A8B9E] hover:text-white"
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
           </div>
        </div>

        {/* CENTER: High-Contrast Timer */}
        <div className="flex items-center gap-2">
           <Timer 
             onTimeUp={() => {}} 
             initialSeconds={timeLeft} 
             isPaused={isPaused} 
           />
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => setPaused(!isPaused)}
             className="h-8 w-8 rounded-lg bg-white/5 text-white hover:bg-white/10 border border-white/10"
           >
             {isPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5 fill-current" />}
           </Button>
        </div>

        {/* RIGHT: Finish Button */}
        <div className="flex items-center">
           <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-4 rounded-lg font-black uppercase text-[8px] tracking-widest shadow-lg border-none">
              Finish
           </Button>
        </div>
      </div>

      {/* ROW 2: CONTEXT (Ultra Compact) */}
      <div className="h-9 md:h-10 bg-white/5 flex items-center justify-between px-4 md:px-8">
         <div className="flex items-center gap-3 min-w-0">
            <p className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.2em] truncate">
              SECTION: {formattedSection || 'MASTERY HUB'}
            </p>
         </div>
         
         <div className="flex items-center gap-4">
            <p className="font-black text-[9px] md:text-[10px] text-white uppercase tracking-widest">
               QUESTION {currentIdx + 1} OF {questions.length}
            </p>
            <button 
              onClick={onPaletteToggle}
              className="lg:hidden flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded-md border border-white/10 text-[8px] font-black uppercase"
            >
               <LayoutGrid className="h-2.5 w-2.5 text-primary" /> Palette
            </button>
         </div>
      </div>
    </header>
  );
}
