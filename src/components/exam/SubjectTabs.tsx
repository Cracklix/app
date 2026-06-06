
'use client';

import { useExamStore } from '@/store/useExamStore';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

/**
 * @fileOverview Subject Navigation with grouping logic.
 */
export default function SubjectTabs() {
  const { questions, currentIdx, setCurrentIdx } = useExamStore();

  const sections = useMemo(() => {
    const map = new Map<string, { id: string, name: string, startIdx: number }>();
    questions.forEach((q, idx) => {
      const sid = q.subjectId || 'general';
      if (!map.has(sid)) {
        map.set(sid, { 
          id: sid, 
          name: sid.replace(/-/g, ' ').toUpperCase(), 
          startIdx: idx 
        });
      }
    });
    return Array.from(map.values());
  }, [questions]);

  const activeSectionId = questions[currentIdx]?.subjectId || '';

  return (
    <nav className="bg-white border-b border-slate-200 h-12 md:h-14 flex items-center px-4 overflow-x-auto no-scrollbar gap-2 shrink-0 sticky top-16 md:top-20 z-40 shadow-sm">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => setCurrentIdx(s.startIdx)}
          className={cn(
            "px-6 h-full flex items-center justify-center text-[10px] md:text-[11px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap",
            activeSectionId === s.id 
              ? "border-primary text-primary bg-primary/5" 
              : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          {s.name}
        </button>
      ))}
    </nav>
  );
}
