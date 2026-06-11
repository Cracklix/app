'use client';

import { useExamStore } from '@/store/useExamStore';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

/**
 * @fileOverview Refined Subject Switching Hub.
 * UPDATED: Fixed horizontal width for mobile to prevent overflow/cutting.
 */
export default function SubjectTabs() {
  const questions = useExamStore(s => s.questions);
  const currentIdx = useExamStore(s => s.currentIdx);
  const setCurrentIdx = useExamStore(s => s.setCurrentIdx);
  const status = useExamStore(s => s.status);

  const sections = useMemo(() => {
    const map = new Map<string, { id: string, name: string, startIdx: number, total: number, answered: number }>();
    
    (questions || []).forEach((q, idx) => {
      const sid = q.sectionId || 'General Hub';
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

  const activeSectionId = questions[currentIdx]?.sectionId || 'General Hub';

  return (
    <nav className="bg-white border-b border-slate-100 h-14 md:h-16 flex items-center px-3 overflow-x-auto no-scrollbar gap-2 shrink-0 sticky top-0 z-40 shadow-sm">
      {sections.map((s) => {
        const isActive = activeSectionId === s.id;
        return (
          <button
            key={s.id}
            onClick={() => setCurrentIdx(s.startIdx)}
            className={cn(
              "h-10 md:h-11 flex items-center justify-center px-4 rounded-xl border-2 transition-all whitespace-nowrap min-w-[130px] md:min-w-[180px]",
              isActive 
                ? "border-primary text-primary bg-white shadow-sm" 
                : "border-slate-100 text-slate-400 bg-white"
            )}
          >
            <span className="text-[9px] md:text-[10px] font-[900] uppercase tracking-tighter leading-tight text-center truncate">
               {s.name.replace(/-/g, ' ')}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
