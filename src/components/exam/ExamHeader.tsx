
'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { Pause, Play, PanelRightOpen, PanelRightClose, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import Timer from '@/components/mocks/Timer';

/**
 * @fileOverview Institutional CBT Header v7.0.
 * Optimized: Adaptive layout for mobile rows (Name -> Timer -> Palette).
 */
export default function ExamHeader({ onPaletteToggle }: { onPaletteToggle: () => void }) {
  const { 
    isPaused, 
    setPaused, 
    language, 
    setLanguage, 
    mockTitle,
    timeLeft,
    currentIdx,
    questions,
    isPaletteVisible,
    togglePalette
  } = useExamStore();

  return (
    <header className="bg-[#0B1528] text-white flex flex-col shrink-0 shadow-2xl z-50 select-none border-b border-white/5">
      {/* Mobile Top Row: Exam Name */}
      <div className="flex lg:hidden items-center px-4 h-10 border-b border-white/5 bg-black/20">
         <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary truncate">
           {mockTitle}
         </p>
      </div>

      <div className="h-14 md:h-16 flex items-center justify-between px-3 md:px-8">
        
        {/* LEFT: PAUSE & PROGRESS */}
        <div className="flex items-center gap-2 md:gap-4">
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => setPaused(!isPaused)}
             className="h-10 w-10 rounded-xl bg-white/5 text-white hover:bg-white/10 shrink-0"
           >
             {isPaused ? <Play className="h-4 w-4 fill-current text-[#F97316]" /> : <Pause className="h-4 w-4 fill-current" />}
           </Button>
           
           <div className="flex flex-col items-start leading-none">
              <p className="text-[7px] font-black uppercase text-slate-500 tracking-widest mb-0.5">PROGRESS</p>
              <p className="text-sm font-black text-white">
                 {currentIdx + 1}<span className="text-slate-500 text-xs font-bold">/{questions.length}</span>
              </p>
           </div>
        </div>

        {/* CENTER: TIMER (Always Central) */}
        <div className="flex-1 flex justify-center px-4">
           <Timer 
             onTimeUp={() => {}} 
             initialSeconds={timeLeft} 
             isPaused={isPaused} 
           />
        </div>

        {/* RIGHT: TACTICAL CONTROLS */}
        <div className="flex items-center gap-2 md:gap-5">
           {/* Language Toggle (Desktop Only) */}
           <div className="hidden lg:flex items-center bg-white/5 p-0.5 rounded-lg border border-white/10">
              {(['en', 'pa', 'bilingual'] as const).map(l => (
                <button 
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-all",
                    language === l ? "bg-[#F97316] text-white shadow-lg" : "text-slate-500 hover:text-white"
                  )}
                >
                  {l === 'bilingual' ? 'Bilingual' : l.toUpperCase()}
                </button>
              ))}
           </div>
           
           <Button 
             variant="ghost"
             onClick={() => {
                if (window.innerWidth < 1024) onPaletteToggle();
                else togglePalette();
             }}
             className="bg-[#F97316] hover:bg-orange-600 h-10 md:h-12 px-4 md:px-6 rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest gap-2 shadow-xl"
           >
              <Menu className="h-4 w-4 lg:hidden" />
              {isPaletteVisible ? <PanelRightClose className="h-4 w-4 hidden lg:inline" /> : <PanelRightOpen className="h-4 w-4 hidden lg:inline" />}
              <span className="hidden sm:inline">{isPaletteVisible ? 'Close Palette' : 'Question Palette'}</span>
              <span className="sm:hidden">Nodes</span>
           </Button>
        </div>
      </div>
    </header>
  );
}
