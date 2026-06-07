
"use client"

import { useEffect, useState, useRef } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerProps {
  onTimeUp: () => void
  initialSeconds: number
  isPaused?: boolean
}

/**
 * @fileOverview High-Contrast CBT Timer Pill.
 * Optimized: Tabular numbers for clean digit swapping and high visibility.
 * Fixed: Synchronized with store logic for pause-resumption stability.
 */
export default function Timer({ onTimeUp, initialSeconds, isPaused }: TimerProps) {
  const formatTime = (seconds: number) => {
    const safeSecs = Math.max(0, seconds)
    const h = Math.floor(safeSecs / 3600)
    const m = Math.floor((safeSecs % 3600) / 60)
    const s = safeSecs % 60
    return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const isLowTime = initialSeconds < 300 // 5 minutes

  return (
    <div className={cn(
      "flex items-center gap-2 md:gap-3 px-4 md:px-6 h-9 md:h-12 rounded-full font-bold transition-all tabular-nums border shadow-inner",
      isLowTime ? "bg-rose-600 border-rose-500 text-white animate-pulse" : "bg-[#050B19] border-white/10 text-white",
      isPaused && "opacity-50 grayscale"
    )}>
      <Clock className={cn("h-3.5 w-3.5 md:h-4 md:w-4", isLowTime ? "text-white" : "text-primary")} />
      <span className="text-[15px] md:text-[22px] font-[900] tracking-widest leading-none">
         {formatTime(initialSeconds)}
      </span>
    </div>
  )
}
