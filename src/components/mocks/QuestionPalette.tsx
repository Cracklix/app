
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
  examName?: string
}

/**
 * @fileOverview Institutional CBT Matrix v12.0.
 * Design: No whitespace, statistics at top, dense grid (1-25 first view).
 */

export default function QuestionPalette({
  questions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  visitedIndices,
  onSelect,
}: QuestionPaletteProps) {
  
  const totalQuestions = questions.length

  const summary = useMemo(() => {
    const answered = answeredIndices.length
    const review = flaggedIndices.length
    const visited = visitedIndices.length
    const answeredAndReview = flaggedIndices.filter(idx => answeredIndices.includes(idx)).length
    
    return {
      answered: answered - answeredAndReview,
      review: review,
      notVisited: Math.max(0, totalQuestions - visited),
      notAnswered: Math.max(0, visited - answered),
    }
  }, [totalQuestions, answeredIndices, flaggedIndices, visitedIndices])

  return (
    <div className="flex flex-col h-full text-left font-body space-y-6">
      
      {/* 1. STATISTICS HUB - COMPACT */}
      <div className="grid grid-cols-2 gap-2">
         <LegendItem count={summary.answered} label="Answered" color="bg-emerald-500" />
         <LegendItem count={summary.notAnswered} label="Not Answered" color="bg-rose-500" />
         <LegendItem count={summary.review} label="Review" color="bg-purple-600" />
         <LegendItem count={summary.notVisited} label="Not Visited" color="bg-slate-100" textColor="text-slate-400" />
      </div>

      {/* 2. NAVIGATION GRID - HIGH DENSITY */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-5 gap-2.5">
            {questions.map((_, idx) => {
              const isCurrent = currentIndex === idx
              const isAnswered = answeredIndices.includes(idx)
              const isFlagged = flaggedIndices.includes(idx)
              const isVisited = visitedIndices.includes(idx)

              return (
                <button
                  key={idx}
                  onClick={() => onSelect(idx)}
                  className={cn(
                    "w-[48px] h-[48px] rounded-xl text-[14px] font-black transition-all flex items-center justify-center border-2",
                    isCurrent ? "border-primary bg-white text-primary shadow-2xl scale-110 z-10" : "border-transparent",
                    !isCurrent && isFlagged ? "bg-purple-600 text-white shadow-lg" :
                    !isCurrent && isAnswered ? "bg-emerald-500 text-white shadow-lg" :
                    !isCurrent && isVisited ? "bg-rose-500 text-white shadow-lg" :
                    !isCurrent && "bg-slate-50 text-slate-300 border-slate-100 hover:bg-slate-100"
                  )}
                >
                  {idx + 1}
                </button>
              )
            })}
         </div>
      </div>
      
      <div className="pt-4 border-t border-slate-100">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] text-center">
            CRACKLIX CBT ENGINE
         </p>
      </div>
    </div>
  )
}

function LegendItem({ count, label, color, textColor = "text-white" }: any) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 bg-white shadow-sm">
       <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0", color, textColor)}>
          {count}
       </div>
       <span className="text-[9px] font-black uppercase text-slate-400 tracking-tight">{label}</span>
    </div>
  )
}
