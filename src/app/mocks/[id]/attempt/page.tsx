
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDoc, useFirestore, useUser } from "@/firebase"
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore"
import Timer from "@/components/mocks/Timer"
import QuestionPalette from "@/components/mocks/QuestionPalette"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  ChevronLeft, 
  ChevronRight, 
  PauseCircle, 
  PlayCircle,
  Maximize,
  LayoutGrid,
  CheckCircle2,
  RotateCcw,
  Languages,
  Loader2,
  Trash2,
  Zap
} from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type LangMode = 'en' | 'reg' | 'bilingual'

export default function MockAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  const mockId = params.id as string
  
  const { data: mock, loading: mockLoading } = useDoc<any>(useMemo(() => (db ? doc(db, "mocks", mockId) : null), [db, mockId]))
  
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [visited, setVisited] = useState<number[]>([0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [language, setLanguage] = useState<LangMode>('bilingual')
  const [remainingTime, setRemainingTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [loadingQs, setLoadingQs] = useState(true)

  useEffect(() => {
    async function init() {
      if (!db || !mock?.questionIds) return
      setLoadingQs(true)
      const qData: any[] = []
      for (const id of mock.questionIds) {
        const snap = await getDoc(doc(db, "questions", id))
        if (snap.exists()) qData.push({ ...snap.data(), id: snap.id })
      }
      setQuestions(qData)
      setRemainingTime((mock.duration || 120) * 60)
      setLoadingQs(false)
    }
    init()
  }, [db, mock])

  useEffect(() => {
    if (!db || !user || !mockId) return
    const sessionRef = doc(db, "test_sessions", `${user.uid}_${mockId}`)
    getDoc(sessionRef).then(snap => {
      if (snap.exists() && snap.data().status === 'IN_PROGRESS') {
        const d = snap.data()
        setAnswers(d.answers || {})
        setFlagged(d.flagged || [])
        setVisited(d.visited || [0])
        setCurrentIdx(d.currentIdx || 0)
        setRemainingTime(d.remainingTime || remainingTime)
      }
    })
  }, [db, user, mockId])

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
      if (['1', '2', '3', '4'].includes(e.key)) {
        setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(e.key) - 1 }))
      }
    }
    window.addEventListener('keydown', handleKeys)
    return () => window.removeEventListener('keydown', handleKeys)
  }, [currentIdx, questions.length])

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      const n = currentIdx + 1
      setCurrentIdx(n)
      if (!visited.includes(n)) setVisited(prev => [...prev, n])
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  const markForReview = () => {
    if (!flagged.includes(currentIdx)) setFlagged(prev => [...prev, currentIdx])
    handleNext()
  }

  const clearResponse = () => {
    setAnswers(prev => {
      const next = { ...prev }
      delete next[currentIdx]
      return next
    })
  }

  const submitMock = useCallback(async () => {
    if (isSubmitting || questions.length === 0 || !user || !db) return
    setIsSubmitting(true)

    const correctMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
    let score = 0
    questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && answers[idx] === correctMap[q.correctAnswer]) score++
    })

    const payload = {
      mockId, userId: user.uid, score, totalQuestions: questions.length,
      accuracy: Math.round((score / (Object.keys(answers).length || 1)) * 100),
      timestamp: new Date().toISOString(), answers, createdAt: serverTimestamp(),
      mockTitle: mock?.title || "Mock Test"
    }

    await addDoc(collection(db, "results"), payload)
    await setDoc(doc(db, "test_sessions", `${user.uid}_${mockId}`), { status: 'SUBMITTED' }, { merge: true })
    toast({ title: "Audit Submitted", description: "Your results are now being analyzed." })
    router.push(`/results/${mockId}`)
  }, [isSubmitting, questions, answers, mock, user, db, router, mockId])

  if (mockLoading || loadingQs) return <div className="h-screen flex flex-col items-center justify-center bg-white"><Loader2 className="h-10 w-10 text-primary animate-spin" /><p className="mt-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Loading Exam Hub...</p></div>

  const q = questions[currentIdx]
  const regLabel = mock?.examType === 'central' ? 'हिन्दी' : 'ਪੰਜਾਬੀ'
  const regKey = mock?.examType === 'central' ? 'Hi' : 'Pa'

  const subjectMap: Record<string, string> = {
    'punjabi-qualifying': 'Mandatory Punjabi (Qualifying)',
    'punjab-history': 'Punjab History & Culture',
    'gk-ca': 'General Knowledge & Current Affairs',
    'reasoning': 'Logical Reasoning',
    'math': 'Numerical Ability',
    'ict': 'ICT (Computers)',
    'english': 'General English'
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-[#0F172A] selection:bg-primary/20">
      <header className="h-14 border-b flex items-center justify-between px-4 bg-[#0B1528] text-white shrink-0 z-[60] shadow-sm">
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10">
           <LangTab label="ENGLISH" active={language === 'en'} onClick={() => setLanguage('en')} />
           <LangTab label={regLabel} active={language === 'reg'} onClick={() => setLanguage('reg')} />
           <LangTab label="BILINGUAL" active={language === 'bilingual'} onClick={() => setLanguage('bilingual')} />
        </div>
        
        <div className="flex items-center gap-3">
          <Timer onTimeUp={submitMock} initialSeconds={remainingTime} onTick={setRemainingTime} isPaused={isPaused} />
          
          <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)} className="h-9 w-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
            {isPaused ? <PlayCircle className="h-5 w-5" /> : <PauseCircle className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={() => document.documentElement.requestFullscreen()} className="h-9 w-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 hidden md:flex">
             <Maximize className="h-5 w-5" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] px-6 h-9 rounded-xl shadow-lg">
                Submit Test
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2rem]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black uppercase">Finish Mock?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500 font-medium">Finalize your audit trail for {mock.title}. Completed nodes: {Object.keys(answers).length}/{questions.length}.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Review More</AlertDialogCancel>
                <AlertDialogAction onClick={submitMock} className="bg-emerald-600 rounded-xl">Finalize</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
          <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
             <div className="flex items-center gap-6">
                <div className="flex flex-col text-left">
                   <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">{currentIdx < 50 ? "PAPER A: PUNJABI QUALIFYING" : "PAPER B: MAIN EXAM"}</span>
                   <h2 className="text-xs font-bold text-slate-700 uppercase tracking-tight">{subjectMap[q?.subjectId] || "General Section"}</h2>
                </div>
                <div className="h-6 w-px bg-slate-100" />
                <span className="text-[10px] font-black text-[#0B1528] uppercase tracking-tighter">Question {currentIdx + 1} <span className="text-slate-300 font-medium mx-1">of</span> {questions.length}</span>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
             <div className="max-w-4xl mx-auto space-y-6">
                {/* Question Area - Optimized Font Size */}
                <div className="space-y-4 text-left">
                   {(language === 'en' || language === 'bilingual') && (
                      <p className="text-lg md:text-xl font-bold leading-relaxed text-[#0B1528] antialiased whitespace-pre-line">
                         {q.questionEn}
                      </p>
                   )}
                   {(language === 'reg' || language === 'bilingual') && (
                      <p className={cn(
                        "text-lg md:text-xl font-bold leading-relaxed text-[#0B1528] antialiased whitespace-pre-line",
                        language === 'bilingual' ? 'border-t border-slate-100 pt-4 mt-4' : ''
                      )}>
                         {q[`question${regKey}`] || q.questionEn}
                      </p>
                   )}
                </div>

                <RadioGroup 
                  value={answers[currentIdx]?.toString() || ""} 
                  onValueChange={(v) => setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(v) }))} 
                  className="grid grid-cols-1 gap-3"
                >
                  {['A', 'B', 'C', 'D'].map((k, i) => {
                    const isSelected = answers[currentIdx] === i
                    return (
                      <div key={i} onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))} className={cn(
                        "flex items-center space-x-4 p-4 md:p-5 border-2 rounded-xl transition-all cursor-pointer bg-white shadow-sm",
                        isSelected ? 'border-primary bg-primary/[0.03]' : 'border-slate-50'
                      )}>
                         <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="text-primary border-slate-200 shrink-0" />
                         <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer select-none py-0.5">
                            {language === 'bilingual' ? (
                               <div className="flex flex-col">
                                  <span className="text-xs text-slate-500 font-medium">{q[`option${k}En`]}</span>
                                  <span className="text-sm md:text-base font-bold text-[#0B1528] mt-0.5">{q[`option${k}${regKey}`]}</span>
                               </div>
                            ) : (
                               <span className="text-sm md:text-base font-bold text-[#0B1528]">
                                  {language === 'en' ? q[`option${k}En`] : q[`option${k}${regKey}`]}
                               </span>
                            )}
                         </Label>
                         <div className={cn("h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-[9px] font-black", isSelected ? "bg-primary text-white" : "bg-slate-50 text-slate-400")}>{k}</div>
                      </div>
                    )
                  })}
                </RadioGroup>
             </div>
          </div>

          <footer className="h-16 border-t border-slate-200 bg-white px-6 md:px-8 flex items-center justify-between shrink-0 z-50">
             <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl h-10 px-4 font-black uppercase text-[9px] tracking-widest border-slate-200 hidden md:flex" onClick={handlePrev} disabled={currentIdx === 0}>Previous</Button>
                <Button variant="outline" className="rounded-xl h-10 px-4 font-black uppercase text-[9px] tracking-widest border-slate-200 text-slate-400" onClick={clearResponse}><Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear</Button>
             </div>
             
             <div className="flex items-center gap-2">
                <Button variant="outline" className={cn("rounded-xl h-10 px-6 font-black uppercase text-[9px] tracking-widest transition-all", flagged.includes(currentIdx) ? "bg-amber-500 border-amber-500 text-white" : "border-slate-200 text-amber-600")} onClick={markForReview}>
                   Review & Next
                </Button>
                <Button className="bg-[#0B1528] hover:bg-black text-white h-10 px-8 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg" onClick={handleNext}>
                  {currentIdx === questions.length - 1 ? 'Finalize' : 'Save & Next'}
                </Button>
             </div>
          </footer>
        </div>

        <aside className="w-[320px] border-l border-slate-200 bg-white p-6 hidden lg:flex flex-col overflow-hidden">
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              <QuestionPalette 
                totalQuestions={questions.length} currentIndex={currentIdx} 
                answeredIndices={Object.keys(answers).map(Number)} 
                flaggedIndices={flagged} visitedIndices={visited}
                onSelect={(idx) => { setCurrentIdx(idx); if (!visited.includes(idx)) setVisited(p => [...p, idx]); }} 
              />
           </div>
        </aside>

        <div className="lg:hidden fixed bottom-20 right-4 z-[80]">
           <Sheet>
              <SheetTrigger asChild><Button className="h-12 w-12 rounded-2xl bg-[#0B1528] text-white shadow-xl"><LayoutGrid className="h-5 w-5" /></Button></SheetTrigger>
              <SheetContent side="bottom" className="h-[75vh] p-6 rounded-t-[3rem]">
                 <QuestionPalette totalQuestions={questions.length} currentIndex={currentIdx} answeredIndices={Object.keys(answers).map(Number)} flaggedIndices={flagged} visitedIndices={visited} onSelect={setCurrentIdx} />
              </SheetContent>
           </Sheet>
        </div>
      </main>

      {isPaused && <div className="fixed inset-0 z-[200] bg-[#0B1528]/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
         <div className="h-20 w-20 bg-primary/20 rounded-[2rem] flex items-center justify-center"><PauseCircle className="h-10 w-10 text-primary" /></div>
         <h2 className="text-3xl font-black uppercase text-white tracking-tight">Audit Session Paused</h2>
         <Button onClick={() => setIsPaused(false)} className="h-14 px-10 bg-white text-[#0B1528] font-black uppercase text-xs rounded-2xl shadow-2xl">Resume Journey</Button>
      </div>}
    </div>
  )
}

function LangTab({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={cn("px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all", active ? "bg-white text-[#0B1528] shadow-lg" : "text-white/40 hover:text-white")}>{label}</button>
  )
}
