
"use client"

import { cn } from "@/lib/utils"

interface QuestionPaletteProps {
  totalQuestions: number
  currentIndex: number
  answeredIndices: number[]
  flaggedIndices: number[]
  onSelect: (index: number) => void
}

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  onSelect
}: QuestionPaletteProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-headline font-black text-xs uppercase tracking-[0.2em] text-slate-400">
          Question Palette
        </h3>
        <span className="text-[10px] font-black text-[#F97316] px-3 py-1 bg-orange-50 rounded-lg border border-orange-100">
          {answeredIndices.length} / {totalQuestions}
        </span>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const isCurrent = currentIndex === i
          const isAnswered = answeredIndices.includes(i)
          const isFlagged = flaggedIndices.includes(i)

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={cn(
                "h-10 w-10 rounded-xl text-xs font-black transition-all duration-200 border-2 flex items-center justify-center",
                isCurrent && "border-[#F97316] bg-orange-50 text-[#F97316] shadow-lg shadow-orange-500/10 scale-110 z-10",
                !isCurrent && isAnswered && "bg-blue-600 border-blue-600 text-white",
                !isCurrent && isFlagged && "bg-amber-500 border-amber-500 text-white",
                !isCurrent && !isAnswered && !isFlagged && "bg-slate-50 border-slate-100 hover:border-slate-300 text-slate-400"
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-y-4 gap-x-6">
        <LegendItem variant="current" label="Current" />
        <LegendItem variant="answered" label="Answered" />
        <LegendItem variant="flagged" label="Flagged" />
        <LegendItem variant="remaining" label="Not Visited" />
      </div>
    </div>
  )
}

function LegendItem({ variant, label }: { variant: 'current' | 'answered' | 'flagged' | 'remaining', label: string }) {
  const getStyles = () => {
    switch (variant) {
      case 'current': return "bg-orange-50 border-orange-200"
      case 'answered': return "bg-blue-600"
      case 'flagged': return "bg-amber-500"
      case 'remaining': return "bg-slate-100"
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className={cn("h-4 w-4 rounded-md border", getStyles())} />
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  )
}
