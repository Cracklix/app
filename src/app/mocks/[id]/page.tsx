
"use client"

import { useState, useEffect } from "react"
import { SAMPLE_MOCK } from "@/lib/mock-data"
import Timer from "@/components/mocks/Timer"
import QuestionPalette from "@/components/mocks/QuestionPalette"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Flag, ShieldCheck, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function MockAttempt() {
  const router = useRouter()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [isMounted, setIsMounted] = useState(false)
  
  const question = SAMPLE_MOCK.questions[currentIdx]

  useEffect(() => {
    setIsMounted(true)
    const saved = localStorage.getItem(`mock_progress_${SAMPLE_MOCK.id}`)
    if (saved) {
      const { answers: savedAnswers, flagged: savedFlagged, currentIdx: savedIdx } = JSON.parse(saved)
      setAnswers(savedAnswers || {})
      setFlagged(savedFlagged || [])
      setCurrentIdx(savedIdx || 0)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(`mock_progress_${SAMPLE_MOCK.id}`, JSON.stringify({
        answers,
        flagged,
        currentIdx
      }))
    }
  }, [answers, flagged, currentIdx, isMounted])

  const handleNext = () => {
    if (currentIdx < SAMPLE_MOCK.questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1)
    }
  }

  const toggleFlag = () => {
    setFlagged(prev => prev.includes(currentIdx) 
      ? prev.filter(i => i !== currentIdx)
      : [...prev, currentIdx]
    )
  }

  const submitMock = () => {
    const correctCount = SAMPLE_MOCK.questions.reduce((acc, q, idx) => {
      return answers[idx] === q.correctAnswer ? acc + 1 : acc
    }, 0)
    
    // Identify weak topics (any topic where accuracy < 70%)
    const topicStats: Record<string, { total: number; correct: number }> = {}
    SAMPLE_MOCK.questions.forEach((q, idx) => {
      if (!topicStats[q.topic]) topicStats[q.topic] = { total: 0, correct: 0 }
      topicStats[q.topic].total++
      if (answers[idx] === q.correctAnswer) topicStats[q.topic].correct++
    })

    const weakTopics = Object.entries(topicStats)
      .filter(([topic, stats]) => (stats.correct / stats.total) < 0.7)
      .map(([topic]) => topic)
    
    const resultData = {
      mockId: SAMPLE_MOCK.id,
      userId: "guest",
      answers,
      score: correctCount,
      accuracy: Math.round((correctCount / (Object.keys(answers).length || 1)) * 100),
      rank: Math.floor(Math.random() * 500) + 1,
      weakTopics,
      correctCount,
      incorrectCount: Object.keys(answers).length - correctCount,
      totalQuestions: SAMPLE_MOCK.questions.length,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem(`last_result_${SAMPLE_MOCK.id}`, JSON.stringify(resultData))
    localStorage.removeItem(`mock_progress_${SAMPLE_MOCK.id}`)
    router.push(`/results/${SAMPLE_MOCK.id}`)
  }

  if (!isMounted) return null

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-card shrink-0 shadow-sm relative z-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-headline font-bold text-sm sm:text-lg truncate max-w-[200px] sm:max-w-md">
              {SAMPLE_MOCK.title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <Timer initialMinutes={SAMPLE_MOCK.durationInMinutes} onTimeUp={submitMock} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="font-bold">Submit Exam</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ready to submit?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have attempted {Object.keys(answers).length} out of {SAMPLE_MOCK.questions.length} questions.
                  Submission is final and results will be calculated immediately.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Back to Test</AlertDialogCancel>
                <AlertDialogAction onClick={submitMock} className="bg-primary hover:bg-primary/90">
                  Submit Now
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar bg-slate-50/30">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 tracking-widest uppercase">
                  Q {currentIdx + 1}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Section: {question.topic}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/5 border border-secondary/10 rounded-lg">
                <AlertCircle className="h-3 w-3 text-secondary" />
                <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
                  Level: {question.difficulty}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-xl sm:text-2xl font-bold leading-relaxed text-primary">
                {question.question}
              </h2>

              <RadioGroup 
                value={answers[currentIdx]?.toString() || ""} 
                onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(val) }))}
                className="grid grid-cols-1 gap-4"
              >
                {question.options.map((opt, i) => {
                  const isSelected = answers[currentIdx] === i
                  return (
                    <div 
                      key={i} 
                      onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))}
                      className={`flex items-center space-x-3 p-5 border-2 rounded-2xl transition-all cursor-pointer ${isSelected ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-border bg-white hover:border-muted-foreground/30'}`}
                    >
                      <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="text-primary border-primary shrink-0" />
                      <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-base font-bold select-none text-primary/80">
                        <span className="mr-4 text-muted-foreground font-headline font-black opacity-30">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-12 border-t">
              <div className="flex gap-4 w-full sm:w-auto">
                <Button variant="outline" size="lg" className="flex-1 sm:flex-none font-bold" onClick={handlePrev} disabled={currentIdx === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button variant="outline" size="lg" className="flex-1 sm:flex-none font-bold" onClick={handleNext} disabled={currentIdx === SAMPLE_MOCK.questions.length - 1}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="ghost" 
                className={`w-full sm:w-auto font-black uppercase tracking-widest text-[10px] transition-all h-12 rounded-xl border-2 ${flagged.includes(currentIdx) ? "text-accent bg-accent/5 border-accent/20" : "border-transparent"}`} 
                onClick={toggleFlag}
              >
                <Flag className={`mr-2 h-4 w-4 ${flagged.includes(currentIdx) ? "fill-current" : ""}`} />
                {flagged.includes(currentIdx) ? "Review Marked" : "Mark for Review"}
              </Button>
            </div>
          </div>
        </div>

        <aside className="w-80 border-l bg-card overflow-y-auto hidden lg:block p-8">
          <QuestionPalette 
            totalQuestions={SAMPLE_MOCK.questions.length}
            currentIndex={currentIdx}
            answeredIndices={Object.keys(answers).map(Number)}
            flaggedIndices={flagged}
            onSelect={setCurrentIdx}
          />
        </aside>
      </main>
    </div>
  )
}
