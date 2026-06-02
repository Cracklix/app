
"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerProps {
  initialMinutes: number
  onTimeUp: () => void
}

export default function Timer({ initialMinutes, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isLowTime = timeLeft < (initialMinutes * 0.1 * 60) // 10% left (e.g. 12 mins for a 120 min test)

  return (
    <div className={cn(
      "flex items-center gap-3 px-5 py-2.5 rounded-2xl font-headline font-black text-lg border-2 transition-all duration-300 shadow-sm",
      isLowTime ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-slate-50 border-slate-100 text-[#0F172A]"
    )}>
      <Clock className={cn("h-5 w-5", isLowTime ? "text-red-500" : "text-[#F97316]")} />
      <span className="tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
    </div>
  )
}
