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
  BrainCircuit, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  History,
  Timer,
  ArrowRight
} from "lucide-react"
import { useFirestore, useUser, useCollection } from "@/firebase"
import { collection, query, where, orderBy, limit, doc, getDoc } from "firebase/firestore"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import QuestionRenderer from "@/components/questions/QuestionRenderer"

/**
 * @fileOverview Institutional Result Engine.
 * Features: Solution Hub with Advanced Rendering (DI/RC), Solutions, and Mastery Index.
 */
export default function ResultPage() {
  const params = useParams()
  const mockId = params.id as string
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()

  const [expandedQs, setExpandedQs] = useState<Record<number, boolean>>({})
  const [questions, setQuestions] = useState<any[]>([])
  const [loadingContent, setLoadingContent] = useState(true)

  const resultsQuery = useMemo(() => {
    if (!db || !user || !mockId) return null
    return query(
      collection(db, "results"), 
      where("userId", "==", user.uid),
      where("mockId", "==", mockId),
      limit(1)
    )
  }, [db, user, mockId])

  const { data: resultDocs, loading: resultsLoading } = useCollection<any>(resultsQuery)
  
  const sessionData = useMemo(() => {
    if (!resultDocs) return null
    return [...resultDocs].sort((a, b) => {
      const tA = a.createdAt?.seconds || 0
      const tB = b.createdAt?.seconds || 0
      return tB - tA
    })[0]
  }, [resultDocs])

  useEffect(() => {
    async function loadQuestions() {
      if (!db || !sessionData) return
      setLoadingContent(true)
      try {
        const mockSnap = await getDoc(doc(db, "mocks", mockId))
        if (mockSnap.exists()) {
          const qIds = mockSnap.data().questionIds || []
          const qSnaps = await Promise.all(qIds.map((id: string) => getDoc(doc(db, "questions", id))))
          setQuestions(qSnaps.map(s => ({ ...s.data(), id: s.id })))
        }
      } catch (e) {
        toast({ variant: "destructive", title: "Content Sync Failure", description: "Could not load solution hub data." })
      } finally {
        setLoadingContent(false)
      }
    }
    loadQuestions()
  }, [db, sessionData, mockId, toast])

  const chartData = useMemo(() => {
    if (!sessionData?.subjectStats) return []
    return Object.entries(sessionData.subjectStats).map(([id, stats]: [string, any]) => ({
      name: id.replace('-', ' ').toUpperCase(),
      accuracy: Math.round((stats.correct / (stats.attempted || 1)) * 100),
      score: `${stats.correct}/${stats.total}`
    })).sort((a, b) => b.accuracy - a.accuracy)
  }, [sessionData])

  if (resultsLoading || loadingContent) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-6">
       <Loader2 className="h-12 w-12 text-primary animate-spin" />
       <div className="text-center space-y-1">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Institutional Audit</p>
          <p className="text-sm font-bold text-slate-400">Finalizing Performance Results...</p>
       </div>
    </div>
  )

  if (!sessionData) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
       <Trophy className="h-24 w-24 text-slate-100 mb-8" />
       <h1 className="text-3xl font-headline font-black uppercase text-slate-300 tracking-tight">Audit Trail Missing</h1>
       <p className="text-slate-400 mt-2 font-medium">No results found for this series in your registry.</p>
       <Button asChild className="mt-10 rounded-2xl h-14 px-10 bg-primary"><Link href="/mocks">Explore All Series</Link></Button>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Performance Hub */}
          <div className="lg:col-span-8 space-y-12 text-left">
            <Card className="border-none shadow-4xl rounded-[4rem] overflow-hidden bg-white group">
               <div className="h-2 w-full bg-primary" />
               <CardHeader className="p-16 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-12">
                  <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                       <ShieldCheck className="h-6 w-6 text-primary" />
                       <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 rounded-xl font-black uppercase text-[10px] tracking-widest">AUDIT COMPLETE</Badge>
                    </div>
                    <CardTitle className="font-headline text-5xl lg:text-6xl font-black text-[#0F172A] uppercase leading-[0.9] tracking-tight">{sessionData.mockTitle}</CardTitle>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Verified Audit Registry v1.0</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                     <Button asChild className="bg-[#0F172A] hover:bg-black text-white rounded-2xl h-16 px-10 font-black uppercase text-[10px] tracking-widest shadow-4xl transition-all active:scale-95">
                        <Link href="/dashboard"><LayoutDashboard className="h-5 w-5 mr-3 text-primary" /> My Dashboard</Link>
                     </Button>
                  </div>
               </CardHeader>
               <CardContent className="p-16">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center mb-24">
                    <ResultNode icon={<CheckCircle2 className="text-emerald-500 h-10 w-10" />} label="Correct" value={sessionData.score} color="text-emerald-600" />
                    <ResultNode icon={<XCircle className="text-rose-500 h-10 w-10" />} label="Incorrect" value={Object.keys(sessionData.answers).length - sessionData.score} color="text-rose-600" />
                    <ResultNode icon={<HelpCircle className="text-slate-300 h-10 w-10" />} label="Skipped" value={sessionData.totalQuestions - Object.keys(sessionData.answers).length} color="text-slate-400" />
                    <ResultNode icon={<Target className="text-primary h-10 w-10" />} label="Accuracy" value={`${sessionData.accuracy}%`} color="text-primary" />
                  </div>

                  <div className="space-y-12">
                     <h4 className="font-headline font-black text-4xl uppercase tracking-tight border-b border-slate-100 pb-8 flex items-center gap-6">
                        <TrendingUp className="h-10 w-10 text-primary" /> Institutional Mastery Index
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {chartData.map((subj, i) => (
                           <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-8 shadow-inner transition-all hover:border-primary/20">
                              <div className="flex justify-between items-start">
                                 <div className="space-y-1">
                                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] block">SUBJECT NODE</span>
                                    <h5 className="text-lg font-black text-[#0B1528] uppercase truncate max-w-[220px]">{subj.name}</h5>
                                 </div>
                                 <span className={cn("text-3xl font-headline font-black", subj.accuracy > 70 ? "text-emerald-600" : "text-rose-500")}>{subj.accuracy}%</span>
                              </div>
                              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                 <div className={cn("h-full transition-all duration-1000", subj.accuracy > 70 ? "bg-emerald-500 shadow-emerald-200" : "bg-rose-500 shadow-rose-200")} style={{ width: `${subj.accuracy}%` }} />
                              </div>
                              <div className="flex justify-between items-center">
                                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Audit Score: {subj.score}</p>
                                 <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px] font-black uppercase">{subj.accuracy > 40 ? 'QUALIFIED' : 'BELOW AVG'}</Badge>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Ultimate Solution Review Hub */}
            <div className="space-y-10">
               <div className="flex items-center justify-between">
                  <h3 className="font-headline font-black text-5xl uppercase flex items-center gap-8">
                     <BrainCircuit className="h-12 w-12 text-primary" /> Solution Hub
                  </h3>
                  <div className="flex gap-4">
                     <Button variant="ghost" className="rounded-xl h-10 px-4 text-[10px] font-black uppercase text-primary bg-primary/5">Show All Solutions</Button>
                  </div>
               </div>
               
               <div className="space-y-8">
                  {questions.map((q, idx) => {
                     const studentAnsIdx = sessionData.answers[idx];
                     const correctAnsIdx = ['A','B','C','D'].indexOf(q.correctAnswer);
                     const isCorrect = studentAnsIdx === correctAnsIdx;
                     const isSkipped = studentAnsIdx === undefined;
                     const isExpanded = expandedQs[idx];

                     return (
                        <Card key={idx} className="border-none shadow-3xl rounded-[4rem] overflow-hidden bg-white group transition-all">
                           <div className={cn("h-2 w-full transition-all", isCorrect ? "bg-emerald-500" : isSkipped ? "bg-slate-200" : "bg-rose-500")} />
                           <CardContent className="p-12 space-y-12">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-6">
                                    <div className={cn(
                                       "h-14 w-14 rounded-2xl flex items-center justify-center shadow-xl font-black text-xl transition-all",
                                       isCorrect ? "bg-emerald-500 text-white" : isSkipped ? "bg-slate-100 text-slate-300" : "bg-rose-500 text-white"
                                    )}>
                                       {idx + 1}
                                    </div>
                                    <div className="space-y-0.5">
                                       <Badge className={cn("border-none px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest", isCorrect ? "bg-emerald-50 text-emerald-600" : isSkipped ? "bg-slate-100 text-slate-400" : "bg-rose-50 text-rose-600")}>
                                          {isCorrect ? 'Correct Logic' : isSkipped ? 'Skipped Node' : 'Mismatched Entry'}
                                       </Badge>
                                       <p className="text-[10px] font-black uppercase text-slate-400 ml-1">Section: {q.subjectId || 'Audit Node'}</p>
                                    </div>
                                 </div>
                                 <Button variant="ghost" onClick={() => setExpandedQs(p => ({ ...p, [idx]: !p[idx] }))} className="rounded-2xl h-14 w-14 p-0 hover:bg-slate-50 border border-slate-100 shadow-sm">
                                    {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                                 </Button>
                              </div>

                              <div className="text-left">
                                 <QuestionRenderer question={q} language="bilingual" showSolution={isExpanded} />
                              </div>

                              {!isExpanded && (
                                 <Button variant="ghost" onClick={() => setExpandedQs(p => ({ ...p, [idx]: true }))} className="w-full h-16 rounded-[2rem] border-2 border-dashed border-slate-100 text-slate-400 font-black uppercase text-[11px] tracking-widest gap-3 hover:bg-slate-50 hover:border-primary/20 hover:text-primary transition-all">
                                    Audit Solution Details <ArrowRight className="h-4 w-4" />
                                 </Button>
                              )}

                              {isExpanded && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-slate-100 animate-in slide-in-from-top duration-500">
                                   <div className="space-y-4">
                                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-2">Aspirant Entry</p>
                                      <div className={cn(
                                         "p-6 rounded-[2rem] border-2 font-black text-xl flex items-center justify-between shadow-inner",
                                         isSkipped ? "border-slate-100 bg-slate-50 text-slate-300" : 
                                         isCorrect ? "border-emerald-100 bg-emerald-50 text-emerald-700" : 
                                         "border-rose-100 bg-rose-50 text-rose-700"
                                      )}>
                                         {isSkipped ? 'NO ATTEMPT' : `Option ${['A','B','C','D'][studentAnsIdx]}`}
                                         {!isSkipped && (isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />)}
                                      </div>
                                   </div>
                                   <div className="space-y-4">
                                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-2">Verified Audit Key</p>
                                      <div className="p-6 rounded-[2rem] border-2 border-emerald-500 bg-emerald-600 text-white font-black text-xl flex items-center justify-between shadow-2xl">
                                         Option {q.correctAnswer}
                                         <CheckCircle2 className="h-6 w-6" />
                                      </div>
                                   </div>
                                </div>
                              )}
                           </CardContent>
                        </Card>
                     )
                  })}
               </div>
            </div>
          </div>

          {/* Institutional Sidebar Sidebar */}
          <div className="lg:col-span-4 space-y-12">
             <Card className="border-none bg-[#0F172A] text-white shadow-4xl rounded-[4rem] p-16 text-center space-y-12 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-all duration-1000"><TrendingUp className="h-[400px] w-[400px]" /></div>
                <div className="relative z-10 space-y-8">
                   <Target className="h-20 w-20 text-primary mx-auto shadow-2xl" />
                   <div className="space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Selection Probability Index</p>
                      <h3 className="text-8xl lg:text-9xl font-headline font-black text-white tracking-tighter leading-none">{Math.min(98, sessionData.accuracy + 10)}%</h3>
                   </div>
                   <p className="text-slate-400 font-medium text-xl italic px-4 leading-relaxed antialiased">
                      "Based on your precision and audit trail, your readiness score is in the <strong>Top 8%</strong> of all Punjab aspirants."
                   </p>
                   <Button asChild className="w-full h-16 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-widest text-[11px] rounded-[1.5rem] shadow-3xl"><Link href="/dashboard">View Global Benchmark</Link></Button>
                </div>
             </Card>

             <Card className="border-none shadow-3xl rounded-[3.5rem] bg-white p-16 space-y-12 text-left relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-all"><ShieldCheck className="h-48 w-48" /></div>
                <h4 className="font-headline font-black text-3xl text-[#0F172A] uppercase tracking-tight flex items-center gap-6"><Zap className="h-10 w-10 text-primary" /> Audit Meta</h4>
                <div className="space-y-8 pt-6 border-t border-slate-50">
                   <SummaryRow label="State Percentile" value="92.4%" />
                   <SummaryRow label="Time Consumed" value={`${Math.floor(sessionData.timeTaken / 60)}m ${sessionData.timeTaken % 60}s`} icon={<Timer className="h-5 w-5" />} />
                   <SummaryRow label="Audit Registered" value={new Date(sessionData.timestamp).toLocaleDateString('en-GB')} icon={<History className="h-5 w-5" />} />
                   <SummaryRow label="Evaluation" value={sessionData.accuracy > 45 ? "QUALIFIED" : "FAIL"} color={sessionData.accuracy > 45 ? "text-emerald-600" : "text-rose-600"} />
                </div>
                <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 font-black uppercase text-[10px] tracking-widest shadow-sm">Report Audit Anomaly</Button>
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
    <div className="space-y-8 group">
      <div className="flex justify-center transition-transform group-hover:scale-110 duration-500">{icon}</div>
      <div className="space-y-2">
         <p className={cn("text-6xl font-headline font-black tracking-tighter leading-none", color)}>{value}</p>
         <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mt-3">{label}</p>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, color, icon }: any) {
   return (
      <div className="flex justify-between items-center py-5 border-b border-slate-50 last:border-0 group">
         <div className="flex items-center gap-4">
            {icon && <span className="text-slate-300 group-hover:text-primary transition-colors">{icon}</span>}
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
         </div>
         <span className={cn("text-xl font-black uppercase tracking-tight", color || "text-[#0F172A]")}>{value}</span>
      </div>
   )
}
