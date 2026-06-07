'use client';

import { useExamStore } from '@/store/useExamStore';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

/**
 * @fileOverview Adaptive Institutional Subject Navigation v5.0.
 * TESTBOOK STYLE: 2 sections visible on mobile, 3+ on desktop.
 * Optimized for high-density evaluation hubs.
 */
export default function SubjectTabs() {
  const questions = useExamStore(s => s.questions);
  const currentIdx = useExamStore(s => s.currentIdx);
  const setCurrentIdx = useExamStore(s => s.setCurrentIdx);
  const status = useExamStore(s => s.status);

  const sections = useMemo(() => {
    const map = new Map<string, { id: string, name: string, startIdx: number, total: number, answered: number }>();
    
    (questions || []).forEach((q, idx) => {
      const sid = q.sectionId || 'General Knowledge';
      const st = status[idx];
      const isAnswered = st === 'answered' || st === 'answered-marked';

      if (!map.has(sid)) {
        map.set(sid, { 
          id: sid, 
          name: sid.toUpperCase(), 
          startIdx: idx,
          total: 0,
          answered: 0
        });
      }
      
      const current = map.get(sid)!;
      current.total++;
      if (isAnswered) current.answered++;
    });
    
    return Array.from(map.values());
  }, [questions, status]);

  const activeSectionId = questions[currentIdx]?.sectionId || 'General Knowledge';

  return (
    <nav className="bg-white border-b border-slate-200 h-12 flex items-center px-1 overflow-x-auto no-scrollbar gap-1 shrink-0 sticky top-0 z-40 pointer-events-auto">
      {sections.map((s) => {
        const isActive = activeSectionId === s.id;
        return (
          <button
            key={s.id}
            onClick={() => setCurrentIdx(s.startIdx)}
            className={cn(
              "h-full flex items-center justify-between gap-3 transition-all whitespace-nowrap border-b-2 px-4 cursor-pointer active:scale-95",
              // MOBILE: 2 sections (48%) | DESKTOP: Fit 3+ (min 200px)
              "min-w-[48%] md:min-w-[200px] md:flex-1 md:max-w-[300px]",
              isActive 
                ? "border-primary text-primary bg-primary/5 shadow-[inset_0_-2px_0_0_hsl(var(--primary))]" 
                : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            )}
          >
            <span className="text-[10px] md:text-[11px] font-[900] uppercase tracking-tighter leading-none truncate flex-1 text-left">
               {s.name.replace(/-/g, ' ')}
            </span>
            <span className={cn(
              "text-[9px] font-black px-2 py-0.5 rounded-md shrink-0 shadow-sm border",
              isActive 
                ? "bg-primary text-white border-primary" 
                : "bg-white text-slate-400 border-slate-100"
            )}>
              {s.answered}/{s.total}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
