
"use client"

import { useEffect, useState, useRef } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerProps {
  onTimeUp: () => void
  initialSeconds: number
  onTick?: (seconds: number) => void
  isPaused?: boolean
}

/**
 * @file Overview High-Visibility Timer Node.
 * Design: Pure black background, white text, 24px bold.
 */

export default function Timer({ onTimeUp, initialSeconds, onTick, isPaused }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const onTickRef = useRef(onTick)
  const hasSubmitted = useRef(false)

  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  useEffect(() => {
    if (onTickRef.current && !isPaused) {
      onTickRef.current(timeLeft)
    }
  }, [timeLeft, isPaused])

  useEffect(() => {
    if (isPaused) {
       if (timerRef.current) clearInterval(timerRef.current)
       return
    }

    if (timeLeft <= 0 && !hasSubmitted.current) {
      hasSubmitted.current = true
      onTimeUp()
      return
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timeLeft, onTimeUp, isPaused])

  const formatTime = (seconds: number) => {
    const safeSecs = Math.max(0, seconds)
    const h = Math.floor(safeSecs / 3600)
    const m = Math.floor((safeSecs % 3600) / 60)
    const s = safeSecs % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const isLowTime = timeLeft < 600

  return (
    <div className={cn(
      "flex items-center gap-4 px-6 h-14 rounded-2xl font-black transition-all duration-500 tabular-nums shadow-2xl border",
      isLowTime ? "bg-rose-600 border-rose-500 text-white animate-pulse" : "bg-[#0F172A] border-white/15 text-white"
    )}>
      <Clock className={cn("h-5 w-5", isLowTime ? "text-white" : "text-[#F97316]")} />
      <span className="text-[24px] tracking-widest leading-none">{formatTime(timeLeft)}</span>
    </div>
  )
}
