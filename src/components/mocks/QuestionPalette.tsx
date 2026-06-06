
"use client"

import { useMemo, useState, useEffect } from "react"
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
 * @fileOverview Institutional CBT Matrix v15.0.
 * Layout Fix: Ensures all parts are viewed by using proper flex-grow on the grid area.
 * Rule: 1-25 questions visible in a 5x5 grid without scrolling.
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

  // Sync page with current index when it changes externally
  useEffect(() => {
    const pageOfIndex = Math.floor(currentIndex / pageSize);
    if (pageOfIndex !== currentPage) {
      setCurrentPage(pageOfIndex);
    }
  }, [currentIndex]);

  const summary = useMemo(() => {
    const answered = answeredIndices.length
    const review = flaggedIndices.length
    const visited = visitedIndices.length
    
    return {
      answered: answered,
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
    <div className="flex flex-col h-full text-left font-body bg-white">
      
      {/* 1. STATISTICS HUB - ANCHORED TOP */}
      <div className="grid grid-cols-2 gap-2 mb-2 shrink-0">
         <LegendItem count={summary.answered} label="Answered" color="bg-emerald-500" />
         <LegendItem count={summary.notAnswered} label="Not Answered" color="bg-rose-500" />
         <LegendItem count={summary.review} label="Review" color="bg-purple-600" />
         <LegendItem count={summary.notVisited} label="Not Visited" color="bg-slate-100" textColor="text-slate-400" />
      </div>

      {/* 2. NAVIGATION GRID - FLEX FILL WITH SCROLL */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
         <div className="grid grid-cols-5 gap-2.5 justify-items-center">
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
                    "w-[42px] h-[42px] md:w-[48px] md:h-[48px] rounded-lg text-[14px] font-black transition-all flex items-center justify-center border-2",
                    isCurrent ? "border-primary bg-white text-primary ring-4 ring-primary/10 shadow-lg z-10" : "border-transparent",
                    !isCurrent && isFlagged ? "bg-purple-600 text-white" :
                    !isCurrent && isAnswered ? "bg-emerald-500 text-white" :
                    !isCurrent && isVisited ? "bg-rose-500 text-white" :
                    !isCurrent && "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200"
                  )}
                >
                  {idx + 1}
                </button>
              )
            })}
         </div>
      </div>

      {/* 3. PAGINATION HUB - ANCHORED BOTTOM */}
      <div className="mt-auto pt-4 border-t border-slate-100 shrink-0 space-y-4">
         {totalPages > 1 && (
            <div className="flex items-center justify-between">
               <button 
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-30 transition-all border border-slate-200"
               >
                  <ChevronLeft className="h-5 w-5" />
               </button>
               <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Grid Range</p>
                  <span className="text-[11px] font-bold text-[#0F172A]">
                    {currentPage * pageSize + 1} – {Math.min((currentPage + 1) * pageSize, totalQuestions)}
                  </span>
               </div>
               <button 
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-30 transition-all border border-slate-200"
               >
                  <ChevronRight className="h-5 w-5" />
               </button>
            </div>
         )}
         
         <div className="pt-2">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] text-center">
               CRACKLIX CBT
            </p>
         </div>
      </div>
    </div>
  )
}

function LegendItem({ count, label, color, textColor = "text-white" }: any) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-slate-200">
       <div className={cn("h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm", color, textColor)}>
          {count}
       </div>
       <span className="text-[9px] font-black uppercase text-slate-500 tracking-tight truncate">{label}</span>
    </div>
  )
}
