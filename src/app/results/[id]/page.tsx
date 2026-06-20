"use client"

import React, { useState, useMemo, useEffect, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, 
  CheckCircle2, 
  Target, 
  Zap, 
  Loader2, 
  ShieldCheck,
  BarChart3,
  RefreshCw,
  XCircle,
  AlertCircle,
  Users
} from "lucide-react"
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase"
import { collection, query, where, doc, getDoc, documentId, getDocs, limit } from "firebase/firestore"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import QuestionRenderer from "@/components/questions/QuestionRenderer"
import StudentAvatar from "@/components/brand/StudentAvatar"

/**
 * @fileOverview Hardened Test Results Hub v42.0 (UI/UX Optimized).
 * FIXED: User-friendly labels, responsive stats grid, and full-width content cards.
 */

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="h-10 w-10 text-primary animate-spin" /></div>}>
      <ResultContent />
    </Suspense>
  )
}

function ResultContent() {
  const params = useParams()
  const router = useRouter()
  const mockId = params.id as string
  const db = useFirestore()
  const { user, profile } = useUser()
  const { toast } = useToast()

  const [questions, setQuestions] = useState<any[]>([])
  const [mockData, setMockData] = useState<any>(null)
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [activeReviewFilter, setActiveReviewFilter] = useState<'ALL' | 'CORRECT' | 'WRONG' | 'SKIPPED'>('ALL')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const resultRef = useMemo(() => (db && user && mockId ? doc(db, "results", `${user.uid}_${mockId}`) : null), [db, user, mockId]);
  const { data: sessionData, loading: resultLoading } = useDoc<any>(resultRef);

  const globalResultsQuery = useMemo(() => {
    if (!db || !mockId) return null
    return query(collection(db, "results"), where("mockId", "==", mockId), limit(300))
  }, [db, mockId])

  const { data: rawGlobalResults } = useCollection<any>(globalResultsQuery)

  const merit = useMemo(() => {
     if (!rawGlobalResults || !sessionData) return { rank: '?', total: 0, percentile: 0, list: [] };
     
     const uniqueMap = new Map<string, any>();
     [...rawGlobalResults].sort((a: any, b: any) => (b.score || 0) - (a.score || 0)).forEach((r: any) => {
        if (!uniqueMap.has(r.userId) || uniqueMap.get(r.userId).score < r.score) {
           uniqueMap.set(r.userId, r);
        }
     });
     const meritList = Array.from(uniqueMap.values()).sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
     
     const rank = meritList.findIndex((r: any) => r.userId === user?.uid) + 1;
     const actualRank = rank > 0 ? rank : 1;
     const total = meritList.length;
     const percentile = total > 0 ? Math.round(((total - actualRank + 1) / (total || 1)) * 1000) / 10 : 0;
     
     return { rank: actualRank, total, percentile, list: meritList };
  }, [rawGlobalResults, sessionData, user]);

  useEffect(() => {
    async function loadQuestions() {
      if (!db || !mockId) return;
      try {
        const mockSnap = await getDoc(doc(db, "mocks", mockId))
        if (mockSnap.exists()) {
          const mData = mockSnap.data();
          setMockData(mData);
          const questionIds: string[] = mData.questionIds || []
          if (questionIds.length > 0) {
            const fetched: any[] = []
            const chunks = []
            for (let i = 0; i < questionIds.length; i += 30) { chunks.push(questionIds.slice(i, i + 30)) }
            const chunkSnaps = await Promise.all(chunks.map((chunk: string[]) => getDocs(query(collection(db, "questions"), where(documentId(), "in", chunk)))))
            chunkSnaps.forEach(snap => snap.docs.forEach(d => fetched.push({ ...d.data(), id: d.id })))
            setQuestions(questionIds.map((id: string) => fetched.find((q: any) => q.id === id)).filter(Boolean))
          }
        }
      } catch (e) {
        console.error("[AUDIT_HYDRATION_ERROR]:", e);
      } finally { 
        setLoadingQuestions(false) 
      }
    }
    loadQuestions()
  }, [db, mockId]);

  const filteredQuestions = useMemo(() => {
     if (!sessionData) return [];
     return questions.map((q: any, i: number) => ({ ...q, index: i })).filter((q: any) => {
        const ans = sessionData.answers?.[q.index];
        const isCorrect = ans !== undefined && ['A','B','C','D'][ans] === q.correctAnswer;
        if (activeReviewFilter === 'ALL') return true;
        if (activeReviewFilter === 'CORRECT') return isCorrect;
        if (activeReviewFilter === 'WRONG') return ans !== undefined && !isCorrect;
        if (activeReviewFilter === 'SKIPPED') return ans === undefined || ans === null;
        return true;
     });
  }, [questions, sessionData, activeReviewFilter]);

  if (resultLoading || (loadingQuestions && questions.length === 0)) return (
     <div className="h-screen w-full flex flex-col items-center justify-center bg-white space-y-6">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Auditing Session...</p>
     </div>
  );

  if (!sessionData) return (
     <div className="h-screen flex flex-col items-center justify-center text-center bg-white p-6 space-y-6">
        <AlertCircle className="h-12 w-12 text-slate-200" />
        <div className="space-y-2">
           <h2 className="text-2xl font-headline font-black uppercase text-[#0F172A]">Registry Link Missing</h2>
           <p className="text-slate-400 font-medium max-w-xs mx-auto">This attempt data node could not be verified in the master repository.</p>
        </div>
        <Button asChild className="bg-[#0F172A] hover:bg-black text-white rounded-xl h-12 px-10 font-black uppercase text-[10px]"><Link href="/dashboard">Return Dashboard</Link></Button>
     </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-body pb-safe text-left overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto px-4 md:px-8 py-6 md:py-12 max-w-7xl space-y-8 md:space-y-12">
        
        {/* HERO SECTION - REFINED LAYOUT */}
        <div className="bg-[#0B1528] rounded-[2rem] md:rounded-[4rem] shadow-5xl overflow-hidden p-6 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 border border-white/5">
           <div className="flex items-center gap-6 md:gap-10 min-w-0 flex-1 w-full text-center lg:text-left">
              <div className="h-14 w-14 md:h-20 md:w-20 rounded-2xl md:rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-2xl border border-primary/20">
                 <Trophy className="h-7 w-7 md:h-10 md:w-10" />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                 <h1 className="text-xl md:text-4xl font-black text-white uppercase tracking-tight break-words whitespace-normal leading-[1.1]">{sessionData.mockTitle}</h1>
                 <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-[0.4em]">Test Performance Hub</p>
              </div>
           </div>

           {/* STATS GRID - WRAPPING SUPPORT */}
           <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6 md:gap-10 lg:gap-14 shrink-0 w-full lg:w-auto px-2">
              <ResultPill label="YOUR SCORE" val={(sessionData.score || 0).toFixed(1)} color={(sessionData.score || 0) < 0 ? "text-rose-400" : "text-primary"} />
              <div className="hidden md:block w-px h-16 bg-white/10" />
              <ResultPill label="YOUR RANK" val={`#${merit.rank}`} color="text-white" />
              <div className="hidden md:block w-px h-16 bg-white/10" />
              <ResultPill label="SCORE ACCURACY" val={`${sessionData.accuracy || 0}%`} color="text-emerald-400" />
           </div>

           <div className="flex gap-4 shrink-0 w-full lg:w-auto">
              <Button asChild className="w-full lg:w-auto h-14 md:h-18 px-8 md:px-12 bg-primary hover:bg-blue-700 text-white font-black uppercase text-[10px] md:text-sm tracking-[0.2em] rounded-2xl shadow-3xl shadow-primary/20 border-none active:scale-95 transition-all">
                 <Link href={`/mocks/${sessionData.mockId}/instructions`} className="flex items-center justify-center gap-3">
                    <RefreshCw className="h-4 w-4 md:h-5 md:w-5" /> TRY AGAIN
                 </Link>
              </Button>
           </div>
        </div>

        <Tabs defaultValue="SOLUTIONS" className="space-y-8 md:space-y-12">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <TabsList className="bg-white border border-slate-100 p-1.5 h-14 md:h-16 rounded-2xl shadow-md inline-flex overflow-x-auto no-scrollbar max-w-full">
                 <TabsTrigger value="SOLUTIONS" className="rounded-xl px-6 md:px-12 font-black uppercase text-[10px] md:text-xs h-full data-[state=active]:bg-[#0B1528] data-[state=active]:text-white transition-all whitespace-nowrap">Review Answers</TabsTrigger>
                 <TabsTrigger value="TOPPER" className="rounded-xl px-6 md:px-12 font-black uppercase text-[10px] md:text-xs h-full data-[state=active]:bg-[#0B1528] data-[state=active]:text-white transition-all whitespace-nowrap">Leaderboard</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
                 <FilterBtn active={activeReviewFilter === 'ALL'} onClick={() => setActiveReviewFilter('ALL')} label="ALL" count={questions.length} icon={<BarChart3 className="h-4 w-4" />} activeColor="bg-slate-900 border-slate-900" />
                 <FilterBtn active={activeReviewFilter === 'CORRECT'} onClick={() => setActiveReviewFilter('CORRECT')} label="CORRECT" count={sessionData.correctCount || 0} icon={<CheckCircle2 className="h-4 w-4" />} activeColor="bg-emerald-600 border-emerald-600" />
                 <FilterBtn active={activeReviewFilter === 'WRONG'} onClick={() => setActiveReviewFilter('WRONG')} label="WRONG" count={sessionData.wrongCount || 0} icon={<XCircle className="h-4 w-4" />} activeColor="bg-rose-600 border-rose-600" />
              </div>
           </div>

           <TabsContent value="SOLUTIONS" className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-700">
              {filteredQuestions.length > 0 ? filteredQuestions.map((q: any) => {
                 const ans = sessionData.answers?.[q.index];
                 const isCorrect = ans !== undefined && ['A','B','C','D'][ans] === q.correctAnswer;
                 const isSkipped = ans === undefined || ans === null;
                 return (
                    <Card key={q.id} className="border-none shadow-xl rounded-[2rem] md:rounded-[3.5rem] overflow-hidden bg-white text-left relative group border border-slate-100">
                       <div className={cn("absolute top-0 left-0 w-1.5 md:w-2.5 h-full transition-all duration-500", isCorrect ? 'bg-emerald-500' : isSkipped ? 'bg-slate-200' : 'bg-rose-500')} />
                       <CardContent className="p-6 md:p-14 lg:p-20">
                          <div className="flex items-center justify-between mb-8 md:mb-12">
                             <div className="flex items-center gap-4">
                                <span className={cn("h-10 w-10 md:h-16 md:w-16 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-sm md:text-2xl shadow-inner", isCorrect ? "bg-emerald-50 text-emerald-600" : isSkipped ? "bg-slate-50 text-slate-400" : "bg-rose-50 text-rose-600")}>{q.index + 1}</span>
                                <Badge variant="outline" className="border-slate-100 text-slate-400 uppercase text-[9px] md:text-[12px] font-black px-3 py-1 rounded-lg">{(q.subjectId || "GK").toUpperCase()}</Badge>
                             </div>
                             {isCorrect ? (
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] md:text-sm uppercase px-4 py-1.5 rounded-full shadow-sm">CORRECT</Badge>
                             ) : isSkipped ? (
                                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[10px] md:text-sm uppercase px-4 py-1.5 rounded-full">SKIPPED</Badge>
                             ) : (
                                <Badge className="bg-rose-50 text-rose-600 border-none font-black text-[10px] md:text-sm uppercase px-4 py-1.5 rounded-full shadow-sm">WRONG ANSWER</Badge>
                             )}
                          </div>
                          <div className="w-full">
                            <QuestionRenderer 
                              question={q} 
                              language={mockData?.languageMode || 'ENGLISH_PUNJABI'} 
                              showSolution={true} 
                              selectedAnswer={ans ?? null} 
                              className="p-0 border-none shadow-none max-w-none" 
                            />
                          </div>
                       </CardContent>
                    </Card>
                 )
              }) : (
                 <div className="py-32 flex flex-col items-center justify-center text-center opacity-30 space-y-6">
                    <AlertCircle className="h-16 w-16 text-slate-300" />
                    <p className="font-headline font-black text-2xl uppercase tracking-[0.4em]">No Questions Found</p>
                    <p className="text-sm font-medium uppercase tracking-widest">Adjust your filters to see more results.</p>
                 </div>
              )}
           </TabsContent>

           <TabsContent value="TOPPER" className="animate-in fade-in slide-in-from-bottom-3 duration-700">
              <Card className="border-none shadow-3xl rounded-[2.5rem] md:rounded-[4rem] bg-white p-6 md:p-14 text-left border border-slate-100 overflow-hidden">
                 <div className="space-y-8 md:space-y-12">
                    <div className="p-6 md:p-10 bg-slate-50 rounded-2xl md:rounded-[3rem] border border-slate-100 flex items-center justify-between mb-6">
                       <div className="flex items-center gap-4">
                          <Users className="h-6 w-6 text-primary" />
                          <p className="text-xs md:text-lg font-black uppercase text-slate-500 tracking-widest">Global Registry: <span className="text-[#0F172A]">{merit.total} Active Aspirants</span></p>
                       </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                       {merit.list?.slice(0, 100).map((r: any, i: number) => {
                          const name = (r.userName && r.userName !== 'Aspirant' && !r.userName.includes('@')) ? r.userName : (r.userEmail?.split('@')[0] || "Aspirant");
                          const isCurrentUser = r.userId === user?.uid;
                          
                          return (
                           <div key={r.id} className={cn("flex items-center justify-between py-4 md:py-8 md:px-10 rounded-2xl md:rounded-[2.5rem] transition-all duration-500 my-2", isCurrentUser ? "bg-primary/5 ring-2 ring-primary/10 shadow-2xl" : "hover:bg-slate-50/80")}>
                              <div className="flex items-center gap-4 md:gap-10 flex-1 min-w-0">
                                 <span className={cn("font-black w-8 md:w-16 text-sm md:text-4xl leading-none tabular-nums", i < 3 ? "text-primary" : "text-slate-200")}>#{i+1}</span>
                                 <StudentAvatar profile={{ name, gender: r.gender }} className="h-10 w-10 md:h-20 md:w-20 rounded-xl md:rounded-3xl shadow-xl border-2 border-white" />
                                 <div className="min-w-0 flex-1 space-y-1">
                                    <p className={cn("font-black text-sm md:text-2xl uppercase truncate tracking-tight break-words whitespace-normal", isCurrentUser ? "text-primary" : "text-[#0F172A]")}>{name} {isCurrentUser && "(You)"}</p>
                                    <p className="text-[8px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Session Score: {(r.score || 0).toFixed(1)}</p>
                                 </div>
                              </div>
                              <div className="shrink-0 ml-4">
                                 <Badge className={cn("border-none text-[10px] md:text-lg font-black px-3 md:px-8 md:py-3 rounded-xl md:rounded-2xl shadow-md tabular-nums", r.accuracy > 85 ? "bg-emerald-50 text-emerald-600" : r.accuracy > 60 ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500")}>{r.accuracy}%</Badge>
                              </div>
                           </div>
                          );
                       })}
                    </div>
                 </div>
              </Card>
           </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

function ResultPill({ label, val, color, className }: any) {
   return (
      <div className={cn("flex flex-col items-center lg:items-start gap-2", className)}>
         <span className="text-[8px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">{label}</span>
         <span className={cn("text-2xl md:text-5xl font-headline font-black leading-none tabular-nums tracking-tighter", color)}>{val}</span>
      </div>
   )
}

function FilterBtn({ active, onClick, label, count, icon, activeColor }: any) {
   return (
      <button onClick={onClick} className={cn("px-4 md:px-8 py-3 md:py-5 rounded-xl md:rounded-[1.8rem] text-[9px] md:text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-3 whitespace-nowrap active:scale-95 shadow-md", active ? `${activeColor} text-white shadow-2xl` : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50")}>
         {icon} {label} <span className="opacity-50 font-bold ml-1">({count})</span>
      </button>
   )
}
