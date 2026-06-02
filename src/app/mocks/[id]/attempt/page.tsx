
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDoc, useFirestore, useUser } from "@/firebase"
import { doc, collection, query, where, getDocs, addDoc, setDoc, serverTimestamp } from "firebase/firestore"
import Timer from "@/components/mocks/Timer"
import QuestionPalette from "@/components/mocks/QuestionPalette"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Flag, ShieldCheck, AlertCircle, Trash2, Sparkles, Languages } from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MockAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const db = useFirestore()
  const { user } = useUser()
  const mockId = params.id as string
  
  const { data: mockConfig, loading: mockLoading } = useDoc<any>(useMemo(() => (db ? doc(db, "mocks", mockId) : null), [db, mockId]))
  
  const [questions, setQuestions] = useState<any[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [language, setLanguage] = useState<'english' | 'punjabi'>('english')
  const [remainingTime, setRemainingTime] = useState(0)

  // Fetch Questions
  useEffect(() => {
    async function fetchQuestions() {
      if (!db || !mockConfig?.questionIds) return
      setLoadingQuestions(true)
      try {
        const qRefs = mockConfig.questionIds.map((id: string) => doc(db, "questions", id))
        // Fetch questions in batches or individually for security rules check
        const qData: any[] = []
        for (const id of mockConfig.questionIds) {
          const qSnap = await getDocs(query(collection(db, "questions"), where("id", "==", id)))
          if (!qSnap.empty) qData.push(qSnap.docs[0].data())
        }
        setQuestions(qData)
        setRemainingTime((mockConfig.duration || 120) * 60)
      } catch (e) {
        console.error("Failed to fetch questions", e)
      } finally {
        setLoadingQuestions(false)
      }
    }
    fetchQuestions()
  }, [db, mockConfig])

  // Resume Session Logic
  useEffect(() => {
    if (!db || !user || questions.length === 0) return
    const sessionRef = doc(db, "test_sessions", `${user.uid}_${mockId}`)
    getDocs(query(collection(db, "test_sessions"), where("id", "==", sessionRef.id))).then(snap => {
      if (!snap.empty) {
        const data = snap.docs[0].data()
        if (data.status === 'IN_PROGRESS') {
          setAnswers(data.answers || {})
          setFlagged(data.flagged || [])
          setCurrentIdx(data.currentIdx || 0)
          setRemainingTime(data.remainingTime)
        }
      }
    })
  }, [db, user, mockId, questions])

  // Auto-Save Logic (Every 10 seconds)
  useEffect(() => {
    if (!db || !user || questions.length === 0 || isSubmitting) return
    const interval = setInterval(() => {
      const sessionRef = doc(db, "test_sessions", `${user.uid}_${mockId}`)
      setDoc(sessionRef, {
        id: sessionRef.id,
        userId: user.uid,
        mockId,
        currentIdx,
        answers,
        flagged,
        remainingTime,
        status: 'IN_PROGRESS',
        updatedAt: serverTimestamp()
      }, { merge: true })
    }, 10000)
    return () => clearInterval(interval)
  }, [db, user, mockId, currentIdx, answers, flagged, remainingTime, questions, isSubmitting])

  const question = questions[currentIdx]

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1)
  }

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  const toggleFlag = () => {
    setFlagged(prev => prev.includes(currentIdx) ? prev.filter(i => i !== currentIdx) : [...prev, currentIdx])
  }

  const clearResponse = () => {
    const newAnswers = { ...answers }
    delete newAnswers[currentIdx]
    setAnswers(newAnswers)
  }

  const submitMock = useCallback(() => {
    if (isSubmitting || questions.length === 0) return
    setIsSubmitting(true)

    const correctCount = questions.reduce((acc, q, idx) => {
      const userAns = answers[idx]
      const correctMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
      return userAns === correctMap[q.correctAnswer] ? acc + 1 : acc
    }, 0)
    
    const resultData = {
      mockId,
      mockTitle: mockConfig?.title || "Mock Test",
      userId: user?.uid || "guest",
      score: correctCount,
      accuracy: Math.round((correctCount / (Object.keys(answers).length || 1)) * 100),
      correctCount,
      incorrectCount: Object.keys(answers).length - correctCount,
      skippedCount: questions.length - Object.keys(answers).length,
      totalQuestions: questions.length,
      weakTopics: [], // In real app, calculate based on topic performance
      timestamp: new Date().toISOString(),
      answers
    }
    
    if (db) {
      addDoc(collection(db, "results"), { ...resultData, createdAt: serverTimestamp() })
        .then(() => {
          // Cleanup session
          const sessionRef = doc(db, "test_sessions", `${user?.uid}_${mockId}`)
          setDoc(sessionRef, { status: 'SUBMITTED' }, { merge: true })
          localStorage.setItem(`last_result_${mockId}`, JSON.stringify(resultData))
          router.push(`/results/${mockId}`)
        })
        .catch(async (error) => {
          setIsSubmitting(false)
        })
    }
  }, [isSubmitting, questions, answers, mockId, mockConfig, user, db, router])

  if (mockLoading || loadingQuestions) {
    return <div className="h-screen flex items-center justify-center bg-white"><Sparkles className="h-10 w-10 text-primary animate-spin" /></div>
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-slate-900">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-[#0B1528] text-white shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-headline font-black text-sm sm:text-lg tracking-tight truncate max-w-[200px] sm:max-w-md">
            {mockConfig?.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <Timer initialMinutes={mockConfig?.duration || 120} onTimeUp={submitMock} />
          
          <Tabs value={language} onValueChange={(v: any) => setLanguage(v)} className="hidden md:block">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="english" className="text-[10px] font-black uppercase"><Languages className="h-3 w-3 mr-2" /> English</TabsTrigger>
              <TabsTrigger value="punjabi" className="text-[10px] font-black uppercase"><Languages className="h-3 w-3 mr-2" /> ਪੰਜਾਬੀ</TabsTrigger>
            </TabsList>
          </Tabs>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs px-6 rounded-xl shadow-xl">Submit Test</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-headline text-2xl font-black">Final Submission?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500">
                  Total Questions: {questions.length}<br/>
                  Answered: {Object.keys(answers).length}<br/>
                  Marked: {flagged.length}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl font-bold">Back</AlertDialogCancel>
                <AlertDialogAction onClick={submitMock} className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8">
                  {isSubmitting ? "Generating Result..." : "Submit Now"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-12 bg-slate-50/50 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-primary bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 tracking-widest uppercase">
                Section: {question?.topic || "General Studies"}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Question {currentIdx + 1} of {questions.length}
              </span>
            </div>

            <div className="space-y-10">
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-[#0F172A]">
                {language === 'english' ? question?.text : (question?.questionPa || question?.text)}
              </h2>

              <RadioGroup 
                value={answers[currentIdx]?.toString() || ""} 
                onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(val) }))}
                className="grid grid-cols-1 gap-4"
              >
                {['A', 'B', 'C', 'D'].map((key, i) => {
                  const isSelected = answers[currentIdx] === i
                  const optionText = language === 'english' 
                    ? question?.[`option${key}En`] || question?.options?.[i]
                    : question?.[`option${key}Pa`] || question?.options?.[i]

                  return (
                    <div 
                      key={i} 
                      onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))}
                      className={`flex items-center space-x-6 p-6 border-2 rounded-2xl transition-all duration-200 cursor-pointer group ${isSelected ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-white bg-white hover:border-slate-200 shadow-sm'}`}
                    >
                      <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="text-primary border-slate-300" />
                      <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-lg font-bold select-none text-slate-700">
                        <span className={`mr-4 text-xs font-black uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-slate-300'}`}>
                          {key}
                        </span>
                        {optionText}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-slate-200">
              <div className="flex gap-4 w-full sm:w-auto">
                <Button variant="outline" size="lg" className="flex-1 sm:flex-none font-bold rounded-xl border-slate-200" onClick={handlePrev} disabled={currentIdx === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button className="flex-1 sm:flex-none bg-[#0F172A] hover:bg-[#1E293B] text-white font-black uppercase tracking-widest text-xs px-10 rounded-xl shadow-xl" onClick={handleNext} disabled={currentIdx === questions.length - 1}>
                  Save & Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-4 w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  className="text-slate-400 hover:text-red-500 font-bold"
                  onClick={clearResponse}
                  disabled={answers[currentIdx] === undefined}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Clear
                </Button>
                <Button 
                  variant="ghost" 
                  className={`flex-1 sm:flex-none font-black uppercase tracking-widest text-[10px] transition-all h-12 px-6 rounded-xl border-2 ${flagged.includes(currentIdx) ? "text-amber-600 bg-amber-50 border-amber-200" : "border-transparent text-slate-400"}`} 
                  onClick={toggleFlag}
                >
                  <Flag className={`mr-2 h-3.5 w-3.5 ${flagged.includes(currentIdx) ? "fill-current" : ""}`} />
                  {flagged.includes(currentIdx) ? "Marked" : "Review Later"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-96 border-l border-slate-200 bg-white overflow-y-auto hidden lg:block p-8">
           <QuestionPalette 
            totalQuestions={questions.length}
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
