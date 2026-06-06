
'use client';

import { useMemo, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useExamStore } from '@/store/useExamStore';

/**
 * @fileOverview Institutional CBT Matrix v16.0.
 * Redesigned for Testbook-style information density.
 * Fixed 5x5 grid (25 questions) per view.
 */
export default function QuestionPalette({ onSelect }: { onSelect: (index: number) => void }) {
  const { questions, status, currentIdx, visited } = useExamStore();
  const totalQuestions = questions.length;
  const pageSize = 25;
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(Math.floor(currentIdx / pageSize));
  }, [currentIdx]);

  const summary = useMemo(() => {
    const s = { answered: 0, marked: 0, notAnswered: 0, notVisited: 0, ansMarked: 0 };
    questions.forEach((_, i) => {
      const st = status[i];
      if (st === 'answered') s.answered++;
      else if (st === 'marked') s.marked++;
      else if (st === 'answered-marked') s.ansMarked++;
      else if (visited.includes(i)) s.notAnswered++;
      else s.notVisited++;
    });
    return s;
  }, [questions, status, visited]);

  const visibleQuestions = useMemo(() => {
    return questions.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }, [questions, currentPage]);

  const totalPages = Math.ceil(totalQuestions / pageSize);

  return (
    <div className="flex flex-col h-full bg-white text-left font-body p-6">
      
      {/* 1. STATISTICS HUB */}
      <div className="grid grid-cols-2 gap-3 mb-8 shrink-0">
         <LegendItem count={summary.answered} label="Answered" color="bg-emerald-500" />
         <LegendItem count={summary.notAnswered} label="Not Answered" color="bg-rose-500" />
         <LegendItem count={summary.marked} label="Marked" color="bg-purple-600" />
         <LegendItem count={summary.notVisited} label="Not Visited" color="bg-slate-100" textColor="text-slate-400" />
         <LegendItem count={summary.ansMarked} label="Ans & Marked" color="bg-indigo-600" colSpan={2} />
      </div>

      {/* 2. NAVIGATION GRID - 5x5 Matrix */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-5 gap-3 justify-items-center">
            {visibleQuestions.map((_, i) => {
              const idx = currentPage * pageSize + i
              const st = status[idx];
              const isVisited = visited.includes(idx);
              const isCurrent = currentIdx === idx;

              return (
                <button
                  key={idx}
                  onClick={() => onSelect(idx)}
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center font-black text-sm transition-all border-2",
                    isCurrent ? "border-primary bg-white text-primary scale-110 shadow-lg z-10" : "border-transparent",
                    !isCurrent && st === 'answered' ? "bg-emerald-500 text-white" :
                    !isCurrent && st === 'marked' ? "bg-purple-600 text-white" :
                    !isCurrent && st === 'answered-marked' ? "bg-indigo-600 text-white" :
                    !isCurrent && isVisited ? "bg-rose-500 text-white" :
                    !isCurrent && "bg-slate-100 text-slate-400"
                  )}
                >
                  {idx + 1}
                </button>
              )
            })}
         </div>
      </div>

      {/* 3. PAGINATION HUB */}
      {totalPages > 1 && (
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
           <button 
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(p => p - 1)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-30 transition-all border border-slate-200"
           >
              <ChevronLeft className="h-5 w-5" />
           </button>
           <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
             Palette {currentPage + 1} of {totalPages}
           </span>
           <button 
              disabled={currentPage === totalPages - 1}
              onClick={() => setCurrentPage(p => p + 1)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-30 transition-all border border-slate-200"
           >
              <ChevronRight className="h-5 w-5" />
           </button>
        </div>
      )}

      <div className="mt-4 pt-2">
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] text-center">
            CRACKLIX CBT v1.0
         </p>
      </div>
    </div>
  )
}

function LegendItem({ count, label, color, textColor = "text-white", colSpan = 1 }: any) {
  return (
    <div className={cn("flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-white shadow-sm", colSpan > 1 && "col-span-2")}>
       <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 shadow-sm", color, textColor)}>
          {count}
       </div>
       <span className="text-[10px] font-black uppercase text-slate-500 tracking-tight truncate">{label}</span>
    </div>
  )
}
