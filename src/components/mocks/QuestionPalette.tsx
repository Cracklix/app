"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface QuestionPaletteProps {
  totalQuestions: number
  currentIndex: number
  answeredIndices: number[]
  flaggedIndices: number[]
  visitedIndices: number[]
  onSelect: (index: number) => void
}

/**
 * @fileOverview Final Paginated Audit Map.
 * Optimized sizing (h-8 w-8) for maximum visibility of all 25 numbers.
 */

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  visitedIndices,
  onSelect
}: QuestionPaletteProps) {
  const PAGE_SIZE = 25
  const totalPages = Math.ceil(totalQuestions / PAGE_SIZE)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    const targetPage = Math.floor(currentIndex / PAGE_SIZE)
    if (targetPage !== currentPage) setCurrentPage(targetPage)
  }, [currentIndex, totalQuestions, currentPage])

  const startIdx = currentPage * PAGE_SIZE
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalQuestions)
  const currentRange = Array.from({ length: endIdx - startIdx }, (_, i) => startIdx + i)

  const summary = useMemo(() => {
    const answered = answeredIndices.length
    const review = flaggedIndices.length
    const visited = visitedIndices.length
    const answeredAndReview = flaggedIndices.filter(idx => answeredIndices.includes(idx)).length
    
    return {
      answered: answered - answeredAndReview,
      review: review - answeredAndReview,
      notVisited: totalQuestions - visited,
      notAnswered: visited - answered,
      answeredAndReview
    }
  }, [totalQuestions, answeredIndices, flaggedIndices, visitedIndices])

  return (
    <div className="space-y-5 flex flex-col h-full text-left">
      {/* Stats Summary Hub */}
      <div className="grid grid-cols-2 gap-2">
         <PaletteStat count={summary.answered} label="Answered" color="bg-emerald-600" />
         <PaletteStat count={summary.notAnswered} label="Wrong" color="bg-rose-500" />
         <PaletteStat count={summary.notVisited} label="Not Visited" color="bg-slate-100" textColor="text-slate-400" />
         <PaletteStat count={summary.review} label="Review" color="bg-amber-500" />
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-100">
         <div className="flex items-center justify-between px-1">
            <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Question Audit Map</h4>
            <div className="flex gap-1">
               <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="p-1 hover:bg-slate-100 rounded disabled:opacity-20"><ChevronLeft className="h-3 w-3" /></button>
               <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1} className="p-1 hover:bg-slate-100 rounded disabled:opacity-20"><ChevronRight className="h-3 w-3" /></button>
            </div>
         </div>

         {/* Compact 5x5 Grid */}
         <div className="grid grid-cols-5 gap-2 pb-4">
            {currentRange.map((idx) => {
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
                        "h-8 w-8 rounded-lg text-[10px] font-black transition-all border flex items-center justify-center",
                        isCurrent ? "ring-2 ring-blue-600 ring-offset-2 scale-110 z-10 bg-white" : "",
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
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl border border-slate-50 bg-white shadow-sm">
       <div className={cn("h-5 w-5 rounded flex items-center justify-center text-[9px] font-black shrink-0", color, textColor)}>
          {count}
       </div>
       <span className="text-[8px] font-black uppercase text-slate-400 truncate">{label}</span>
    </div>
  )
}
