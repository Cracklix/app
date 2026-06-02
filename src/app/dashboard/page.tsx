
"use client"

import { useMemo } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useUser, useCollection, useFirestore } from "@/firebase"
import { collection, query, where, orderBy, limit } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Target, 
  ClipboardList, 
  Zap, 
  Clock, 
  ChevronRight, 
  Star,
  Bookmark,
  TrendingUp,
  BarChart3,
  BrainCircuit,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  PlayCircle,
  Timer,
  CheckCircle2,
  ListTodo
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

/**
 * @fileOverview Phase 71-72: Advanced Selection Dashboard.
 * Features: Exam Readiness Score, Goal Tracker, and Precision Forecasting.
 */

export default function StudentDashboard() {
  const { user, profile, loading } = useUser()
  const db = useFirestore()
  const router = useRouter()
  const [daysLeft] = useState(87)

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  const resultsQuery = useMemo(() => {
    if (!db || !user) return null
    return query(collection(db, "results"), where("userId", "==", user.uid), orderBy("timestamp", "desc"), limit(20))
  }, [db, user])

  const sessionQuery = useMemo(() => {
    if (!db || !user) return null
    return query(collection(db, "test_sessions"), where("userId", "==", user.uid), where("status", "==", "IN_PROGRESS"), orderBy("updatedAt", "desc"), limit(1))
  }, [db, user])

  const { data: results, loading: resultsLoading } = useCollection<any>(resultsQuery)
  const { data: activeSessions } = useCollection<any>(sessionQuery)
  const lastSession = activeSessions?.[0]

  const analytics = useMemo(() => {
    if (!results || results.length === 0) return { 
      total: 0, 
      avgAccuracy: 0, 
      rank: "N/A", 
      subjectData: [], 
      selectionProb: 45, 
      weakSubject: "N/A",
      readinessScore: 35
    }
    
    const avgAcc = Math.round(results.reduce((acc: number, r: any) => acc + (r.accuracy || 0), 0) / results.length)
    
    const subjectMap: Record<string, { correct: number; total: number }> = {
      'Punjab GK': { correct: 0, total: 0 },
      'Reasoning': { correct: 0, total: 0 },
      'Numerical Ability': { correct: 0, total: 0 },
      'General English': { correct: 0, total: 0 },
      'Punjabi Language': { correct: 0, total: 0 },
    }

    results.forEach((res: any) => {
      if (res.subjectStats) {
        Object.entries(res.subjectStats).forEach(([subj, stats]: [string, any]) => {
          const matchedKey = Object.keys(subjectMap).find(k => k.toLowerCase().includes(subj.toLowerCase())) || subj;
          if (!subjectMap[matchedKey]) subjectMap[matchedKey] = { correct: 0, total: 0 }
          subjectMap[matchedKey].correct += stats.correct || 0
          subjectMap[matchedKey].total += stats.total || 0
        })
      }
    })

    const subjectData = Object.entries(subjectMap).map(([name, stats]) => ({
      name,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    })).sort((a, b) => b.accuracy - a.accuracy)

    const readiness = Math.round(subjectData.reduce((acc, s) => acc + s.accuracy, 0) / subjectData.length)

    return { 
      total: results.length, 
      avgAccuracy: avgAcc, 
      rank: avgAcc > 85 ? "Top 2%" : avgAcc > 70 ? "Top 12%" : "Top 45%", 
      subjectData,
      weakSubject: [...subjectData].reverse().find(s => s.accuracy > 0)?.name || "Baseline Needed",
      selectionProb: Math.min(96, Math.max(30, avgAcc + (avgAcc > 60 ? 12 : -5))),
      readinessScore: readiness > 0 ? readiness : 35
    }
  }, [results])

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0F172A]"><Sparkles className="h-12 w-12 text-primary animate-pulse" /></div>

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-10">
            {/* Profile Overview */}
            <Card className="border-none shadow-3xl shadow-slate-900/5 rounded-[3.5rem] bg-white overflow-hidden group">
               <div className="h-32 w-full bg-[#08152D] relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><ShieldCheck className="h-20 w-20 text-white" /></div>
                  <div className="absolute -bottom-12 left-10">
                     <Avatar className="h-28 w-28 border-8 border-white rounded-[2.5rem] shadow-2xl">
                        <AvatarImage src={user?.photoURL || ""} />
                        <AvatarFallback className="bg-primary text-white font-black text-3xl">{profile?.name?.[0]}</AvatarFallback>
                     </Avatar>
                  </div>
               </div>
               <CardContent className="pt-16 pb-12 px-10 space-y-6">
                  <div>
                    <h2 className="text-3xl font-headline font-black text-[#0F172A] tracking-tight">{profile?.name}</h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{profile?.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-primary text-white border-none px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">{profile?.status || 'Free'} Access</Badge>
                    <Badge variant="outline" className="border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-2xl">Target: {profile?.targetExam || "Punjab Exams"}</Badge>
                  </div>
               </CardContent>
            </Card>

            {/* Today's Goal Tracker (Phase 72) */}
            <Card className="border-none bg-white p-10 rounded-[3rem] shadow-3xl space-y-8">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary">Daily Planner</p>
                     <h3 className="text-2xl font-headline font-black text-[#0F172A]">Today's Goal</h3>
                  </div>
                  <ListTodo className="h-6 w-6 text-slate-300" />
               </div>
               <div className="space-y-6">
                  <GoalItem label="Attempt 50 MCQs" current={analytics.total > 0 ? 12 : 0} total={50} />
                  <GoalItem label="1 Full Mock Series" current={0} total={1} />
                  <GoalItem label="Review 15 Analysis Cards" current={5} total={15} />
               </div>
            </Card>

            {/* Exam Countdown */}
            <Card className="border-none bg-[#0F172A] text-white p-10 rounded-[3rem] shadow-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><Timer className="h-32 w-32" /></div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <Timer className="h-5 w-5 text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Exam Countdown</span>
                  </div>
                  <div className="flex items-end gap-3">
                     <span className="text-7xl font-headline font-black text-primary leading-none">{daysLeft}</span>
                     <span className="text-lg font-black uppercase tracking-widest mb-2">Days Left</span>
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                     Until official {profile?.targetExam || 'PSSSB Patwari'} 2026 attempt cycle.
                  </p>
               </div>
            </Card>

            {lastSession && (
              <Card className="border-none bg-emerald-600 text-white p-10 rounded-[3rem] shadow-3xl shadow-emerald-900/20 relative overflow-hidden group cursor-pointer" onClick={() => router.push(`/mocks/${lastSession.mockId}/attempt`)}>
                 <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:scale-110 transition-transform"><PlayCircle className="h-32 w-32" /></div>
                 <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                       <PlayCircle className="h-5 w-5 text-emerald-200" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">Resume Live Session</span>
                    </div>
                    <h3 className="text-2xl font-headline font-black leading-tight uppercase">Continue Mock</h3>
                    <p className="text-emerald-50 text-sm font-medium opacity-80">Syncing nodes... Continue where you left off.</p>
                 </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div className="space-y-1">
                  <h1 className="text-4xl font-headline font-black text-[#0F172A] tracking-tight uppercase">Performance Engine</h1>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">Institutional Readiness Audit</p>
               </div>
               <div className="flex gap-4">
                 <Button asChild variant="outline" className="rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest h-12 px-8 gap-3 bg-white shadow-sm hover:border-primary">
                    <Link href="/leaderboard"><Trophy className="h-4 w-4 text-amber-500" /> Leaderboard</Link>
                 </Button>
                 <Button asChild variant="outline" className="rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest h-12 px-8 gap-3 bg-white shadow-sm hover:border-primary">
                    <Link href="/revision"><Bookmark className="h-4 w-4 text-primary" /> Revision Hub</Link>
                 </Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {/* Exam Readiness Score (Phase 71) */}
               <Card className="border-none shadow-3xl shadow-slate-900/5 rounded-[3.5rem] bg-white p-12 text-center space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><CheckCircle2 className="h-40 w-40" /></div>
                  <div className="space-y-2 relative z-10">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Exam Readiness Score</p>
                     <p className="text-8xl font-headline font-black text-[#0F172A] tracking-tighter">{analytics.readinessScore}%</p>
                     <div className="flex items-center justify-center gap-3 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                        <ArrowUpRight className="h-5 w-5" /> Institutional Standard: 70%
                     </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-slate-50 relative z-10">
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Vertical: {profile?.targetExam || 'General'}</p>
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${analytics.readinessScore}%` }} />
                     </div>
                  </div>
               </Card>

               {/* AI Rationalization Engine */}
               <Card className="border-none shadow-3xl shadow-slate-900/10 rounded-[3rem] bg-[#0F172A] text-white p-10 space-y-8 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><BrainCircuit className="h-32 w-32 text-primary" /></div>
                  <div className="space-y-6 relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                           <BrainCircuit className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-headline font-black text-xl uppercase tracking-tight">AI Audit Engine</h3>
                     </div>
                     <div className="space-y-4">
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                           Scan detected conceptual weakness in <span className="text-white font-black underline decoration-primary underline-offset-4">"{analytics.weakSubject}"</span>.
                        </p>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all" onClick={() => router.push('/mocks')}>
                           <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-primary tracking-widest">Recommended Series</p>
                              <p className="font-bold text-slate-200">{analytics.weakSubject} Mastery Mock</p>
                           </div>
                           <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-primary transition-all" />
                        </div>
                     </div>
                  </div>
                  <Button asChild className="w-full bg-white text-[#0F172A] hover:bg-slate-100 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl h-16 relative z-10 shadow-2xl">
                     <Link href="/mocks">Improve Readiness Score</Link>
                  </Button>
               </Card>
            </div>

            {/* Subject Matrix */}
            <Card className="border-none shadow-3xl shadow-slate-900/5 rounded-[3.5rem] bg-white overflow-hidden">
               <CardHeader className="p-12 border-b border-slate-50">
                  <div className="space-y-1">
                    <CardTitle className="font-headline text-2xl font-black text-[#0F172A] uppercase">Subject Precision Matrix</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sectional accuracy audit based on last 20 attempts</CardDescription>
                  </div>
               </CardHeader>
               <CardContent className="p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-10">
                        {analytics.subjectData.slice(0, 3).map((s: any) => (
                           <SubjectProgress key={s.name} label={s.name} value={s.accuracy} />
                        ))}
                     </div>
                     <div className="space-y-10">
                        {analytics.subjectData.slice(3).map((s: any) => (
                           <SubjectProgress key={s.name} label={s.name} value={s.accuracy} />
                        ))}
                        {analytics.subjectData.length === 0 && (
                           <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
                              Begin your first mock to generate precision nodes.
                           </div>
                        )}
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-3xl shadow-slate-900/5 rounded-[3.5rem] overflow-hidden bg-white">
               <CardHeader className="p-12 border-b border-slate-50 flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="font-headline text-2xl font-black text-[#0F172A] uppercase">Attempt Registry</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Deep review of your high-fidelity results</CardDescription>
                  </div>
                  <Button asChild variant="ghost" className="text-primary font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-primary/5 h-12 px-8">
                     <Link href="/profile">Full Registry <ChevronRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
               </CardHeader>
               <CardContent className="p-0">
                  {resultsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
                  ) : results && results.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                       {results.slice(0, 5).map((r: any) => (
                          <div key={r.id} className="p-10 flex items-center justify-between hover:bg-slate-50/50 transition-colors group cursor-pointer">
                             <div className="flex items-center gap-8">
                                <div className="h-16 w-16 rounded-[1.5rem] bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                   <Trophy className="h-7 w-7 text-blue-500" />
                                </div>
                                <div className="space-y-1">
                                   <p className="font-black text-[#0F172A] text-xl uppercase tracking-tight group-hover:text-primary transition-colors">{r.mockTitle}</p>
                                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-3">
                                      <Clock className="h-4 w-4" /> {new Date(r.timestamp).toLocaleDateString('en-GB')} • Official Pattern
                                   </p>
                                </div>
                             </div>
                             <div className="flex items-center gap-12">
                                <div className="text-right hidden sm:block space-y-1">
                                   <p className="text-3xl font-headline font-black text-[#0F172A] tracking-tighter leading-none">{r.score}<span className="text-slate-300 text-lg">/{r.totalQuestions}</span></p>
                                   <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${r.accuracy > 70 ? 'text-emerald-500' : 'text-orange-500'}`}>{r.accuracy}% Precision</p>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="rounded-2xl h-14 w-14 hover:bg-white text-slate-200 hover:text-primary border-2 border-transparent hover:border-slate-100 transition-all">
                                   <Link href={`/results/${r.mockId}`}><ChevronRight className="h-6 w-6" /></Link>
                                </Button>
                             </div>
                          </div>
                       ))}
                    </div>
                  ) : (
                    <div className="p-32 text-center text-slate-300 space-y-8">
                       <ClipboardList className="h-24 w-24 mx-auto opacity-10" />
                       <p className="font-headline font-black uppercase text-2xl text-slate-400">Zero Node Activity</p>
                       <Button asChild className="bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-[1.5rem] h-16 px-16 shadow-3xl shadow-primary/20">
                          <Link href="/mocks">Start Your First Mock</Link>
                       </Button>
                    </div>
                  )}
               </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function SubjectProgress({ label, value }: { label: string, value: number }) {
   return (
      <div className="space-y-4">
         <div className="flex justify-between items-end">
            <span className="text-xs font-black uppercase tracking-widest text-[#0F172A]">{label}</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${value > 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{value}% Mastery</span>
         </div>
         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div className={`h-full transition-all duration-1000 ${value > 70 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${value}%` }} />
         </div>
      </div>
   )
}

function GoalItem({ label, current, total }: { label: string, current: number, total: number }) {
   const percent = Math.min(100, (current / total) * 100)
   return (
      <div className="space-y-3">
         <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-500">{label}</span>
            <span className="text-[#0F172A]">{current}/{total}</span>
         </div>
         <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${percent}%` }} />
         </div>
      </div>
   )
}
