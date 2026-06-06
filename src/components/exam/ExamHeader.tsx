
'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { Pause, Play, Languages, LayoutGrid, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

/**
 * @fileOverview Professional Fixed CBT Header.
 */
export default function ExamHeader({ title, onPaletteToggle }: { title: string, onPaletteToggle: () => void }) {
  const { timeLeft, isPaused, setPaused, language, setLanguage } = useExamStore();

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-[#0F172A] text-white h-16 md:h-20 flex items-center justify-between px-4 md:px-8 shrink-0 shadow-xl border-b border-white/10 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setPaused(!isPaused)}
          className="h-10 w-10 rounded-xl bg-white/5 text-white hover:bg-white/10"
        >
          {isPaused ? <Play className="h-5 w-5 fill-current" /> : <Pause className="h-5 w-5 fill-current" />}
        </Button>
        <div className="hidden md:block">
           <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">CBT ENGINE</p>
           <h1 className="font-black text-sm uppercase tracking-tight truncate max-w-[200px]">{title}</h1>
        </div>
      </div>

      <div className="flex flex-col items-center">
         <div className={cn(
           "flex items-center gap-2 px-4 py-1.5 rounded-xl border tabular-nums transition-all duration-500",
           timeLeft < 300 ? "bg-rose-600 border-rose-500 animate-pulse" : "bg-black/20 border-white/10"
         )}>
           <span className="text-xl md:text-2xl font-black tracking-widest">{formatTime(timeLeft)}</span>
         </div>
         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Time Remaining</p>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center bg-white/5 p-1 rounded-lg border border-white/10">
           {(['en', 'pa', 'hi', 'bilingual'] as const).map(l => (
             <button 
               key={l}
               onClick={() => setLanguage(l)}
               className={cn(
                 "px-2.5 py-1 rounded text-[10px] font-black tracking-tighter transition-all",
                 language === l ? "bg-primary text-white" : "text-slate-400 hover:text-white"
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
          className="h-10 w-10 rounded-xl bg-white/5 text-white hover:bg-white/10"
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
