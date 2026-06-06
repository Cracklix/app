
'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { Pause, Play, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import Timer from '@/components/mocks/Timer';

/**
 * @fileOverview Professional Testbook-style CBT Header.
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
    timeLeft,
    saveAndNext 
  } = useExamStore();

  return (
    <header className="bg-[#0F172A] text-white h-16 md:h-20 flex items-center justify-between px-4 md:px-8 shrink-0 shadow-xl border-b border-white/10 sticky top-0 z-50">
      
      {/* 1. LEFT ZONE: EXAM & SECTION IDENTITY */}
      <div className="flex items-center gap-6 text-left min-w-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setPaused(!isPaused)}
          className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10"
        >
          {isPaused ? <Play className="h-5 w-5 fill-current" /> : <Pause className="h-5 w-5 fill-current" />}
        </Button>
        <div className="hidden md:flex flex-col min-w-0">
           <h1 className="font-black text-sm uppercase tracking-tight truncate">{title}</h1>
           <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-0.5 truncate">
             Section: {currentSectionId || 'Evaluation Node'}
           </p>
        </div>
      </div>

      {/* 2. CENTER ZONE: TIMER & COUNTER */}
      <div className="flex flex-col items-center">
         <div className="flex items-center gap-4">
            <Timer 
               onTimeUp={() => {}} 
               initialSeconds={timeLeft} 
               isPaused={isPaused} 
            />
            <div className="hidden lg:flex flex-col items-center ml-2">
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Question</span>
               <span className="text-sm font-black text-white">{currentIdx + 1} of {questions.length}</span>
            </div>
         </div>
      </div>

      {/* 3. RIGHT ZONE: CONTROLS & FINISH */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
           {(['en', 'pa', 'bi'] as const).map(l => (
             <button 
               key={l}
               onClick={() => setLanguage(l)}
               className={cn(
                 "px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all",
                 language === l ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
               )}
             >
               {l.toUpperCase()}
             </button>
           ))}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onPaletteToggle}
          className="h-10 w-10 rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10 lg:hidden"
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>

        <Button className="hidden md:flex bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl border-none">
           Finish Test
        </Button>
      </div>
    </header>
  );
}
