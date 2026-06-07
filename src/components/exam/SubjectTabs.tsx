'use client';

import { useExamStore } from '@/store/useExamStore';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

/**
 * @fileOverview High-Fidelity Subject Hub v6.0.
 * Matches the horizontally scrollable boxed design from the reference image.
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
    <nav className="bg-white border-b border-slate-100 h-14 flex items-center px-4 overflow-x-auto no-scrollbar gap-2 shrink-0 sticky top-0 z-40">
      {sections.map((s) => {
        const isActive = activeSectionId === s.id;
        return (
          <button
            key={s.id}
            onClick={() => setCurrentIdx(s.startIdx)}
            className={cn(
              "h-10 flex items-center px-4 rounded-lg border-2 transition-all whitespace-nowrap text-[11px] font-black uppercase tracking-tight",
              isActive 
                ? "border-primary text-primary bg-primary/5" 
                : "border-slate-200 text-slate-400 hover:border-slate-300"
            )}
          >
            {s.name.replace(/-/g, ' ')}
          </button>
        );
      })}
    </nav>
  );
}
