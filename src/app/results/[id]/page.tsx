"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Trophy, 
  Target, 
  Zap, 
  LayoutDashboard, 
  Loader2, 
  TrendingUp, 
  ArrowRight, 
  BrainCircuit, 
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { useFirestore, useUser, useCollection } from "@/firebase"
import { collection, query, where, orderBy, limit, doc, getDoc } from "firebase/firestore"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import QuestionRenderer from "@/components/questions/QuestionRenderer"

export default function ResultPage() {
  const params = useParams()
  const mockId = params.id as string
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()

  const [expandedQs, setExpandedQs] = useState<Record<number, boolean>>({})
  const [questions, setQuestions] = useState<any[]>([])

  const resultsQuery = useMemo(() => {
    if (!db || !user || !mockId) return null
    return query(
      collection(db, "results"), 
      where("userId", "==", user.uid),
      where("mockId", "==", mockId),
      orderBy("createdAt", "desc"),
      limit(1)
    )
  }, [db, user, mockId])

  const { data: resultDocs, loading: resultsLoading } = useCollection<any>(resultsQuery)
  const sessionData = resultDocs?.[0]

  useEffect(() => {
    async function loadQuestions() {
      if (!db || !sessionData?.answers) return
      // We need to fetch the mock first to get question IDs
      const mockSnap = await getDoc(doc(db, "mocks", mockId))
      if (mockSnap.exists()) {
        const qIds = mockSnap.data().questionIds || []
        const qSnaps = await Promise.all(qIds.map((id: string) => getDoc(doc(db, "questions", id))))
        setQuestions(qSnaps.map(s => ({ ...s.data(), id: s.id })))
      }
    }
    loadQuestions()
  }, [db, sessionData, mockId])

  const chartData = useMemo(() => {
    if (!sessionData?.subjectStats) return []
    return Object.entries(sessionData.subjectStats).map(([id, stats]: [string, any]) => ({
      name: id.replace('-', ' ').toUpperCase(),
      accuracy: Math.round((stats.correct / (stats.attempted || 1)) * 100),
      score: `${stats.correct}/${stats.total}`
    })).sort((a, b) => b.accuracy - a.accuracy)
  }, [sessionData])

  if (resultsLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-4">
       <Loader2 className="h-10 w-10 text-primary animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analyzing Audit Nodes...</p>
    </div>
  )

  if (!sessionData) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
       <Trophy className="h-20 w-20 text-slate-100 mb-6" />
       <h1 className="text-3xl font-headline font-black uppercase text-slate-300">No Trail Found</h1>
       <Button asChild className="mt-8 rounded-xl"><Link href="/mocks">Browse Tests</Link></Button>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-12 text-left">
            <Card className="border-none shadow-4xl rounded-[4rem] overflow-hidden bg-white">
               <CardHeader className="p-16 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="space-y-3">
                    <CardTitle className="font-headline text-4xl lg:text-5xl font-black text-[#0F172A] uppercase leading-[0.9] tracking-tight">{sessionData.mockTitle}</CardTitle>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 rounded-xl font-black uppercase text-[10px]">AUDIT COMPLETED</Badge>
                  </div>
                  <div className="flex gap-4">
                     <Button asChild className="bg-[#0F172A] hover:bg-black text-white rounded-2xl h-16 px-10 font-black uppercase text-[10px] tracking-widest shadow-4xl"><Link href="/dashboard"><LayoutDashboard className="h-5 w-5 mr-3 text-primary" /> My Dashboard</Link></Button>
                  </div>
               </CardHeader>
               <CardContent className="p-16">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center mb-24">
                    <ResultNode icon={<CheckCircle2 className="text-emerald-500 h-8 w-8" />} label="Correct" value={sessionData.score} color="text-emerald-600" />
                    <ResultNode icon={<XCircle className="text-rose-500 h-8 w-8" />} label="Incorrect" value={Object.keys(sessionData.answers).length - sessionData.score} color="text-rose-600" />
                    <ResultNode icon={<HelpCircle className="text-slate-300 h-8 w-8" />} label="Skipped" value={sessionData.totalQuestions - Object.keys(sessionData.answers).length} color="text-slate-400" />
                    <ResultNode icon={<Target className="text-primary h-8 w-8" />} label="Accuracy" value={`${sessionData.accuracy}%`} color="text-primary" />
                  </div>

                  <div className="space-y-12">
                     <h4 className="font-headline font-black text-3xl uppercase tracking-tight border-b border-slate-100 pb-6">Performance Mastery Index</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {chartData.map((subj, i) => (
                           <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-6 shadow-inner">
                              <div className="flex justify-between items-start">
                                 <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest truncate max-w-[200px]">{subj.name}</span>
                                 <span className={cn("text-2xl font-headline font-black", subj.accuracy > 70 ? "text-emerald-600" : "text-rose-500")}>{subj.accuracy}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                 <div className={cn("h-full", subj.accuracy > 70 ? "bg-emerald-500" : "bg-rose-500")} style={{ width: `${subj.accuracy}%` }} />
                              </div>
                              <p className="text-[10px] font-black uppercase text-slate-500">Node Score: {subj.score}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Solution Review Hub */}
            <div className="space-y-8">
               <h3 className="font-headline font-black text-4xl uppercase flex items-center gap-6">
                  <BrainCircuit className="h-10 w-10 text-primary" /> Solution Review Node
               </h3>
               <div className="space-y-6">
                  {questions.map((q, idx) => {
                     const isCorrect = sessionData.answers[idx] === ['A','B','C','D'].indexOf(q.correctAnswer);
                     const isSkipped = sessionData.answers[idx] === undefined;
                     const isExpanded = expandedQs[idx];

                     return (
                        <Card key={idx} className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white group">
                           <div className={cn("h-1.5 w-full", isCorrect ? "bg-emerald-500" : isSkipped ? "bg-slate-200" : "bg-rose-500")} />
                           <CardContent className="p-10 space-y-6">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <Badge className={cn("border-none px-4 py-1 rounded-xl text-[9px] font-black uppercase", isCorrect ? "bg-emerald-50 text-emerald-600" : isSkipped ? "bg-slate-100 text-slate-400" : "bg-rose-50 text-rose-600")}>
                                       {isCorrect ? 'Correct Node' : isSkipped ? 'Skipped Node' : 'Mismatched Node'}
                                    </Badge>
                                    <span className="text-[10px] font-black uppercase text-slate-400">Question {idx + 1}</span>
                                 </div>
                                 <Button variant="ghost" onClick={() => setExpandedQs(p => ({ ...p, [idx]: !p[isExpanded] }))} className="rounded-xl h-10 w-10 p-0 hover:bg-slate-50">
                                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                                 </Button>
                              </div>

                              <div className="text-left">
                                 <QuestionRenderer question={q} language="bilingual" showSolution={true} />
                              </div>
                           </CardContent>
                        </Card>
                     )
                  })}
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-12">
             <Card className="border-none bg-[#0F172A] text-white shadow-4xl rounded-[4rem] p-16 text-center space-y-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-5"><TrendingUp className="h-80 w-80" /></div>
                <div className="relative z-10 space-y-6">
                   <Target className="h-16 w-16 text-primary mx-auto" />
                   <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Selection Probability</p>
                   <h3 className="text-8xl font-headline font-black text-white tracking-tighter leading-none">{Math.min(96, sessionData.accuracy + 8)}%</h3>
                   <p className="text-slate-400 font-medium text-lg italic px-4">"Your logic in Reasoning vertical is 12% higher than state average."</p>
                </div>
             </Card>

             <Card className="border-none shadow-3xl rounded-[3.5rem] bg-white p-16 space-y-10 text-left relative overflow-hidden">
                <div className="absolute bottom-0 right-0 p-8 opacity-5"><ShieldCheck className="h-32 w-32" /></div>
                <h4 className="font-headline font-black text-2xl text-[#0F172A] uppercase tracking-tight flex items-center gap-4"><Zap className="h-8 w-8 text-primary" /> Summary Node</h4>
                <div className="space-y-6 pt-4 border-t border-slate-50">
                   <SummaryRow label="State Avg Score" value="64.2%" />
                   <SummaryRow label="Percentile Ranking" value={`${(100 - (sessionData.accuracy/10)).toFixed(1)}%`} />
                   <SummaryRow label="Audit Status" value="QUALIFIED" color="text-emerald-600" />
                </div>
             </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ResultNode({ icon, label, value, color }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">{icon}</div>
      <div className="space-y-1">
         <p className={cn("text-5xl font-headline font-black tracking-tighter leading-none", color)}>{value}</p>
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">{label}</p>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, color }: any) {
   return (
      <div className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0">
         <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
         <span className={cn("text-lg font-black uppercase tracking-tight", color || "text-[#0F172A]")}>{value}</span>
      </div>
   )
}
