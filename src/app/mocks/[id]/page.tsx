"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDoc, useFirestore, useUser } from "@/firebase"
import { doc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import Timer from "@/components/mocks/Timer"
import QuestionPalette from "@/components/mocks/QuestionPalette"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Flag, ShieldCheck, AlertCircle, Trash2, Sparkles } from "lucide-react"
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
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors"

export default function MockAttempt() {
  const params = useParams()
  const router = useRouter()
  const db = useFirestore()
  const { user } = useUser()
  const mockId = params.id as string
  
  const { data: mockConfig, loading: mockLoading } = useDoc<any>(useMemo(() => (db ? doc(db, "mocks", mockId) : null), [db, mockId]))
  
  const [questions, setQuestions] = useState<any[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)

  useEffect(() => {
    async function fetchQuestions() {
      if (!db || !mockConfig?.questionIds) return
      
      try {
        const qRefs = mockConfig.questionIds.map((id: string) => doc(db, "questions", id))
        const qSnaps = await Promise.all(qRefs.map((ref: any) => getDocs(query(collection(db, "questions"), where("id", "==", ref.id)))))
        const qData = qSnaps.map(snap => snap.docs[0]?.data()).filter(Boolean)
        setQuestions(qData)
      } catch (e) {
        // Handled via listener in onSnapshot within useDoc/useCollection usually,
        // but since this is manual Promise.all, we handle specifically if needed.
      } finally {
        setLoadingQuestions(false)
      }
    }
    fetchQuestions()
  }, [db, mockConfig])

  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const question = questions[currentIdx]

  useEffect(() => {
    setIsMounted(true)
    const saved = localStorage.getItem(`mock_progress_${mockId}`)
    if (saved) {
      try {
        const { answers: savedAnswers, flagged: savedFlagged, currentIdx: savedIdx } = JSON.parse(saved)
        setAnswers(savedAnswers || {})
        setFlagged(savedFlagged || [])
        setCurrentIdx(savedIdx || 0)
      } catch (e) {
        console.error("Failed to load progress")
      }
    }
  }, [mockId])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(`mock_progress_${mockId}`, JSON.stringify({
        answers,
        flagged,
        currentIdx
      }))
    }
  }, [answers, flagged, currentIdx, isMounted, mockId])

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
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

  const clearResponse = () => {
    const newAnswers = { ...answers }
    delete newAnswers[currentIdx]
    setAnswers(newAnswers)
  }

  const submitMock = () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    const correctCount = questions.reduce((acc, q, idx) => {
      return answers[idx] === q.correctAnswer ? acc + 1 : acc
    }, 0)
    
    const topicStats: Record<string, { total: number; correct: number }> = {}
    questions.forEach((q, idx) => {
      const topic = q.topic || "General"
      if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0 }
      topicStats[topic].total++
      if (answers[idx] === q.correctAnswer) topicStats[topic].correct++
    })

    const weakTopics = Object.entries(topicStats)
      .filter(([topic, stats]) => (stats.correct / stats.total) < 0.7)
      .map(([topic]) => topic)
    
    const resultData = {
      mockId: mockId,
      mockTitle: mockConfig?.title || "Mock Test",
      userId: user?.uid || "guest",
      userName: user?.displayName || "Anonymous Aspirant",
      answers,
      score: correctCount,
      accuracy: Math.round((correctCount / (Object.keys(answers).length || 1)) * 100),
      weakTopics,
      correctCount,
      incorrectCount: Object.keys(answers).length - correctCount,
      totalQuestions: questions.length,
      timestamp: new Date().toISOString()
    }
    
    if (db) {
      const resultsRef = collection(db, "results")
      addDoc(resultsRef, {
        ...resultData,
        createdAt: serverTimestamp()
      })
      .then(() => {
        localStorage.setItem(`last_result_${mockId}`, JSON.stringify(resultData))
        localStorage.removeItem(`mock_progress_${mockId}`)
        router.push(`/results/${mockId}`)
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: resultsRef.path,
          operation: 'create',
          requestResourceData: resultData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        setIsSubmitting(false)
      })
    } else {
      setIsSubmitting(false)
    }
  }

  if (!isMounted || mockLoading || loadingQuestions) {
    return <div className="h-screen flex items-center justify-center bg-white"><Sparkles className="h-10 w-10 text-primary animate-spin" /></div>
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-slate-900">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-white shrink-0 shadow-sm relative z-50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#F97316] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-headline font-black text-sm sm:text-lg tracking-tight truncate max-w-[200px] sm:max-w-md">
              {mockConfig?.title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <Timer initialMinutes={mockConfig?.duration || 120} onTimeUp={submitMock} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl px-6 shadow-xl shadow-orange-500/10">Submit Exam</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-headline text-2xl font-black">Ready to submit?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500">
                  You have attempted {Object.keys(answers).length} out of {questions.length} questions.
                  Submission is final and your performance analytics will be available immediately.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl font-bold">Back to Test</AlertDialogCancel>
                <AlertDialogAction onClick={submitMock} className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl px-8 shadow-xl shadow-orange-500/20">
                  {isSubmitting ? "Processing..." : "Submit Now"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar bg-slate-50/50">
          <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-[#F97316] bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 tracking-widest uppercase">
                  Question {currentIdx + 1}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Topic: {question?.topic}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                <AlertCircle className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  Difficulty: {question?.difficulty}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-xl sm:text-2xl font-bold leading-relaxed text-[#0F172A]">
                {question?.text}
              </h2>

              <RadioGroup 
                value={answers[currentIdx]?.toString() || ""} 
                onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(val) }))}
                className="grid grid-cols-1 gap-4"
              >
                {question?.options?.map((opt: string, i: number) => {
                  const isSelected = answers[currentIdx] === i
                  return (
                    <div 
                      key={i} 
                      onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))}
                      className={`flex items-center space-x-4 p-5 border-2 rounded-2xl transition-all duration-200 cursor-pointer group ${isSelected ? 'border-[#F97316] bg-orange-50/30 ring-4 ring-orange-500/5' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                    >
                      <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="text-[#F97316] border-slate-300 shrink-0" />
                      <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-base font-bold select-none text-slate-700">
                        <span className={`mr-4 text-xs font-black uppercase tracking-widest transition-colors ${isSelected ? 'text-[#F97316]' : 'text-slate-300 group-hover:text-slate-400'}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-12 border-t border-slate-100">
              <div className="flex gap-4 w-full sm:w-auto">
                <Button variant="outline" size="lg" className="flex-1 sm:flex-none font-bold rounded-xl border-slate-200" onClick={handlePrev} disabled={currentIdx === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button variant="outline" size="lg" className="flex-1 sm:flex-none font-bold rounded-xl border-slate-200" onClick={handleNext} disabled={currentIdx === questions.length - 1}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-400 hover:text-red-500 gap-2 h-12 rounded-xl px-4"
                  onClick={clearResponse}
                  disabled={answers[currentIdx] === undefined}
                >
                  <Trash2 className="h-4 w-4" /> Clear
                </Button>
                <Button 
                  variant="ghost" 
                  className={`flex-1 sm:flex-none font-black uppercase tracking-widest text-[10px] transition-all h-12 px-6 rounded-xl border-2 ${flagged.includes(currentIdx) ? "text-amber-600 bg-amber-50 border-amber-200" : "border-transparent text-slate-400 hover:bg-slate-100"}`} 
                  onClick={toggleFlag}
                >
                  <Flag className={`mr-2 h-3.5 w-3.5 ${flagged.includes(currentIdx) ? "fill-current" : ""}`} />
                  {flagged.includes(currentIdx) ? "Marked" : "Review Later"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-80 border-l border-slate-100 bg-white overflow-y-auto hidden lg:block">
          <div className="p-8">
             <QuestionPalette 
              totalQuestions={questions.length}
              currentIndex={currentIdx}
              answeredIndices={Object.keys(answers).map(Number)}
              flaggedIndices={flagged}
              onSelect={setCurrentIdx}
            />
          </div>
        </aside>
      </main>
    </div>
  )
}