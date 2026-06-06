
"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface QuestionPaletteProps {
  questions: any[]
  currentIndex: number
  answeredIndices: number[]
  flaggedIndices: number[]
  visitedIndices: number[]
  onSelect: (index: number) => void
  subjectMap?: Record<string, string>
}

/**
 * @fileOverview Sectional Audit Matrix v3.0.
 * Features: Automatic Subject Grouping, High-Density Grid, and Active Node Highlighting.
 */

export default function QuestionPalette({
  questions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  visitedIndices,
  onSelect,
  subjectMap = {}
}: QuestionPaletteProps) {
  
  const totalQuestions = questions.length

  const groupedQuestions = useMemo(() => {
    const groups: Record<string, { startIdx: number; questions: any[] }> = {};
    
    questions.forEach((q, idx) => {
      const subId = q.subjectId || 'GENERAL';
      if (!groups[subId]) {
        groups[subId] = { startIdx: idx, questions: [] };
      }
      groups[subId].questions.push({ ...q, globalIdx: idx });
    });

    return Object.entries(groups);
  }, [questions]);

  const summary = useMemo(() => {
    const answered = answeredIndices.length
    const review = flaggedIndices.length
    const visited = visitedIndices.length
    const answeredAndReview = flaggedIndices.filter(idx => answeredIndices.includes(idx)).length
    
    return {
      answered: answered - answeredAndReview,
      review: review - answeredAndReview,
      notVisited: Math.max(0, totalQuestions - visited),
      notAnswered: Math.max(0, visited - answered),
    }
  }, [totalQuestions, answeredIndices, flaggedIndices, visitedIndices])

  return (
    <div className="space-y-6 flex flex-col h-full text-left">
      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 gap-2">
         <PaletteStat count={summary.answered} label="Ans" color="bg-emerald-600" />
         <PaletteStat count={summary.notAnswered} label="Unans" color="bg-rose-500" />
         <PaletteStat count={summary.notVisited} label="Skip" color="bg-slate-100" textColor="text-slate-400" />
         <PaletteStat count={summary.review} label="Rev" color="bg-amber-500" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8 pt-4 border-t border-slate-100">
         {groupedQuestions.map(([subId, data]) => (
            <div key={subId} className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="h-1 w-6 bg-primary/20 rounded-full" />
                  <h4 className="text-[10px] font-black uppercase text-slate-800 tracking-widest truncate">
                    {subjectMap[subId] || subId.replace('-', ' ').toUpperCase()}
                  </h4>
               </div>

               <div className="grid grid-cols-5 gap-2.5">
                  {data.questions.map((q) => {
                    const idx = q.globalIdx;
                    const isCurrent = currentIndex === idx
                    const isAnswered = answeredIndices.includes(idx)
                    const isFlagged = flaggedIndices.includes(idx)
                    const isVisited = visitedIndices.includes(idx)
                    const isBoth = isAnswered && isFlagged

                    return (
                      <button
                        key={idx}
                        onClick={() => onSelect(idx)}
                        className={cn(
                          "h-8 w-8 md:h-9 md:w-9 rounded-full text-[10px] font-black transition-all border flex items-center justify-center shadow-sm shrink-0",
                          isCurrent ? "ring-2 ring-primary ring-offset-2 scale-110 z-10 bg-white text-primary border-primary shadow-xl" : "",
                          !isCurrent && isBoth && "bg-purple-600 text-white border-purple-600",
                          !isCurrent && isAnswered && !isFlagged && "bg-emerald-600 text-white border-emerald-600",
                          !isCurrent && isFlagged && !isAnswered && "bg-amber-500 text-white border-amber-500",
                          !isCurrent && isVisited && !isAnswered && !isFlagged && "bg-rose-500 text-white border-rose-500",
                          !isCurrent && !isVisited && "bg-slate-50 text-slate-300 border-transparent",
                        )}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
               </div>
            </div>
         ))}
      </div>
    </div>
  )
}

function PaletteStat({ count, label, color, textColor = "text-white" }: any) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-100 bg-white shadow-sm">
       <div className={cn("h-4 w-4 rounded-md flex items-center justify-center text-[8px] font-black shrink-0", color, textColor)}>
          {count}
       </div>
       <span className="text-[8px] font-black uppercase text-slate-500 tracking-tight truncate">{label}</span>
    </div>
  )
}
