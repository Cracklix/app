
"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
 * @fileOverview Institutional CBT Matrix v14.0.
 * Refinement: Compact grid, 1-25 questions immediately visible, pagination for > 25.
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
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 25

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

  const visibleQuestions = useMemo(() => {
    return questions.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }, [questions, currentPage])

  const totalPages = Math.ceil(totalQuestions / pageSize)

  return (
    <div className="flex flex-col h-full text-left font-body space-y-4">
      
      {/* 1. STATISTICS HUB - COMPACT 8px GAP */}
      <div className="grid grid-cols-2 gap-2">
         <LegendItem count={summary.answered} label="Answered" color="bg-emerald-500" />
         <LegendItem count={summary.notAnswered} label="Not Answered" color="bg-rose-500" />
         <LegendItem count={summary.review} label="Review" color="bg-purple-600" />
         <LegendItem count={summary.notVisited} label="Not Visited" color="bg-slate-100" textColor="text-slate-400" />
      </div>

      <div className="h-[8px]" />

      {/* 2. NAVIGATION GRID - HIGH DENSITY 5x5 */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
         <div className="grid grid-cols-5 gap-2 justify-items-center">
            {visibleQuestions.map((_, i) => {
              const idx = currentPage * pageSize + i
              const isCurrent = currentIndex === idx
              const isAnswered = answeredIndices.includes(idx)
              const isFlagged = flaggedIndices.includes(idx)
              const isVisited = visitedIndices.includes(idx)

              return (
                <button
                  key={idx}
                  onClick={() => onSelect(idx)}
                  className={cn(
                    "w-[40px] h-[40px] md:w-[44px] md:h-[44px] rounded-lg text-[13px] font-bold transition-all flex items-center justify-center border",
                    isCurrent ? "border-primary bg-white text-primary ring-2 ring-primary/20 shadow-lg z-10" : "border-transparent",
                    !isCurrent && isFlagged ? "bg-purple-600 text-white" :
                    !isCurrent && isAnswered ? "bg-emerald-500 text-white" :
                    !isCurrent && isVisited ? "bg-rose-500 text-white" :
                    !isCurrent && "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
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
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
           <button 
             disabled={currentPage === 0}
             onClick={() => setCurrentPage(p => p - 1)}
             className="h-8 px-2 rounded-md hover:bg-slate-50 disabled:opacity-30 transition-all"
           >
             <ChevronLeft className="h-4 w-4" />
           </button>
           <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
             Palette {currentPage + 1} / {totalPages}
           </span>
           <button 
             disabled={currentPage === totalPages - 1}
             onClick={() => setCurrentPage(p => p + 1)}
             className="h-8 px-2 rounded-md hover:bg-slate-50 disabled:opacity-30 transition-all"
           >
             <ChevronRight className="h-4 w-4" />
           </button>
        </div>
      )}
      
      <div className="pt-2">
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] text-center">
            CRACKLIX CBT
         </p>
      </div>
    </div>
  )
}

function LegendItem({ count, label, color, textColor = "text-white" }: any) {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-100 bg-white shadow-sm">
       <div className={cn("h-5 w-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0", color, textColor)}>
          {count}
       </div>
       <span className="text-[8px] font-black uppercase text-slate-500 tracking-tight truncate">{label}</span>
    </div>
  )
}
