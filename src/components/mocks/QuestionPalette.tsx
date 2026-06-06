
"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface QuestionPaletteProps {
  totalQuestions: number
  currentIndex: number
  answeredIndices: number[]
  flaggedIndices: number[]
  visitedIndices: number[]
  onSelect: (index: number) => void
}

/**
 * @fileOverview Final High-Density Audit Matrix v2.0.
 * Optimized: Compact sizing to fit more nodes in view.
 */

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  visitedIndices,
  onSelect
}: QuestionPaletteProps) {
  
  const allIndices = Array.from({ length: totalQuestions }, (_, i) => i)

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
      answeredAndReview
    }
  }, [totalQuestions, answeredIndices, flaggedIndices, visitedIndices])

  return (
    <div className="space-y-4 flex flex-col h-full text-left">
      <div className="grid grid-cols-2 gap-1.5">
         <PaletteStat count={summary.answered} label="Ans" color="bg-emerald-600" />
         <PaletteStat count={summary.notAnswered} label="Unans" color="bg-rose-500" />
         <PaletteStat count={summary.notVisited} label="Skip" color="bg-slate-100" textColor="text-slate-400" />
         <PaletteStat count={summary.review} label="Rev" color="bg-amber-500" />
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-100 flex-1">
         <div className="flex items-center justify-between px-1">
            <h4 className="text-[9px] font-black uppercase text-black tracking-[0.1em]">Audit Grid ({totalQuestions})</h4>
         </div>

         <div className="grid grid-cols-5 gap-2 px-0.5 justify-items-center">
            {allIndices.map((idx) => {
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
                        "h-8 w-8 md:h-9 md:w-9 rounded-full text-[9px] font-black transition-all border flex items-center justify-center shadow-sm shrink-0",
                        isCurrent ? "ring-2 ring-primary ring-offset-2 scale-105 z-10 bg-white text-primary border-primary" : "",
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
    </div>
  )
}

function PaletteStat({ count, label, color, textColor = "text-white" }: any) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-50 bg-white shadow-sm">
       <div className={cn("h-4 w-4 rounded-md flex items-center justify-center text-[8px] font-black shrink-0", color, textColor)}>
          {count}
       </div>
       <span className="text-[7px] font-black uppercase text-slate-500 tracking-tight truncate">{label}</span>
    </div>
  )
}
