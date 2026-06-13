"use client"

import { useMemo, useState, useEffect } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useUser, useCollection, useFirestore } from "@/firebase"
import { collection, query, where, limit } from "firebase/firestore"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Target, 
  ClipboardList, 
  Zap, 
  ChevronRight, 
  Bookmark, 
  History, 
  Flame,
  Clock,
  LayoutGrid,
  ShieldCheck,
  TrendingUp,
  Calendar,
  Loader2,
  Award
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import StudentAvatar from "@/components/brand/StudentAvatar"
import ShareButton from "@/components/navigation/ShareButton"

/**
 * @fileOverview Hardened Student Dashboard v22.0 (Micro UI).
 * UPDATED: Reduced typography and icon scale for a cleaner mobile interface.
 */
export default function StudentDashboard() {
  const { user, profile, loading } = useUser()
  const db = useFirestore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  const resultsQuery = useMemo(() => {
    if (!db || !user) return null
    return query(collection(db, "results"), where("userId", "==", user.uid), limit(20))
  }, [db, user])

  const { data: rawResults, loading: resultsLoading } = useCollection<any>(resultsQuery)

  const results = useMemo(() => {
    if (!rawResults) return []
    return [...rawResults].sort((a, b) => {
      const tA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const tB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return tB - tA;
    });
  }, [rawResults])

  const stats = useMemo(() => {
    if (!results || results.length === 0) return { total: 0, avgAccuracy: 0, streak: 0, readiness: 0, hours: "0h", correct: 0 }
    
    const total = results.length
    const correct = results.reduce((acc: number, r: any) => acc + (r.correctCount || r.score || 0), 0)
    const attempted = results.reduce((acc: number, r: any) => acc + (r.attemptedCount || r.totalQuestions || 0), 0)
    const avgAcc = attempted > 0 ? Math.round((correct / attempted) * 100) : 0
    
    const totalSeconds = results.reduce((acc: number, r: any) => acc + (r.timeTaken || 0), 0)
    let timeFormatted = "0s";
    if (totalSeconds >= 3600) {
      timeFormatted = `${(totalSeconds / 3600).toFixed(1)}h`;
    } else if (totalSeconds >= 60) {
      timeFormatted = `${Math.floor(totalSeconds / 60)}m`;
    } else {
      timeFormatted = `${totalSeconds}s`;
    }
    
    const uniqueDays = new Set(results.filter(r => r.timestamp).map(r => new Date(r.timestamp).toDateString()))
    const streak = uniqueDays.size
    const readiness = Math.min(100, Math.round((avgAcc * 0.7) + (Math.min(total, 30) * 1)))

    return { total, avgAccuracy: avgAcc, streak, readiness, hours: timeFormatted, correct }
  }, [results])

  if (!mounted || loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-4">
       <Loader2 className="h-8 w-8 text-primary animate-spin" />
       <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">Syncing Hub...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-32 text-left">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 py-4 md:py-12 max-w-7xl space-y-6 md:space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
           
           <div className="lg:col-span-8 space-y-6 md:space-y-8">
              <section className="bg-[#0B1528] text-white p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden text-left group">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="relative shrink-0">
                     <StudentAvatar profile={profile} className="h-20 w-20 md:h-36 md:w-32 border-[3px] border-white/10 rounded-[1.8rem] md:rounded-[2.5rem] shadow-2xl" />
                     <div className="absolute -bottom-1 -right-1 bg-emerald-500 h-6 w-6 md:h-8 md:w-8 rounded-lg border-[3px] border-[#0B1528] flex items-center justify-center text-white">
                        <ShieldCheck className="h-3 w-3 md:h-4 md:w-4" />
                     </div>
                  </div>
                  <div className="flex-1 space-y-3 md:space-y-4 text-center md:text-left overflow-hidden">
                     <div className="space-y-1">
                        <h2 className="text-2xl md:text-6xl font-headline font-black tracking-tight uppercase truncate">{profile?.name || "Student"}</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4">
                           <Badge className="bg-primary text-white border-none text-[8px] md:text-[10px] font-black uppercase px-3 py-0.5 md:px-4 md:py-1 rounded shadow-xl">
                             {(profile?.status || 'Free').toUpperCase()} PASS
                           </Badge>
                           <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px] flex items-center gap-1.5 md:gap-2">
                             <Target className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" /> {profile?.targetExam || 'General Hub'}
                           </p>
                        </div>
                     </div>
                     <div className="pt-2 md:pt-4 flex flex-wrap justify-center md:justify-start gap-2 md:gap-4">
                        <Button asChild className="h-10 md:h-12 px-6 md:px-8 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest border border-white/10 shadow-xl transition-all active:scale-95">
                           <Link href="/profile">Details</Link>
                        </Button>
                        <Button asChild className="h-10 md:h-12 px-6 md:px-8 bg-primary hover:bg-orange-600 text-white rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-xl transition-all active:scale-95 border-none">
                           <Link href="/pass">Upgrade</Link>
                        </Button>
                     </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
                 <MetricItem label="PREP SCORE" val={`${stats.readiness}%`} icon={<TrendingUp className="text-primary h-3.5 w-3.5" />} />
                 <MetricItem label="ACCURACY" val={`${stats.avgAccuracy}%`} icon={<Target className="text-emerald-500 h-3.5 w-3.5" />} />
                 <MetricItem label="TESTS DONE" val={stats.total} icon={<ClipboardList className="text-blue-500 h-3.5 w-3.5" />} />
                 <MetricItem label="TIME SPENT" val={stats.hours} icon={<Clock className="text-amber-500 h-3.5 w-3.5" />} />
              </div>

              <Card className="border-none shadow-2xl rounded-[2rem] md:rounded-[3rem] bg-white overflow-hidden text-left border border-slate-100">
                 <CardHeader className="p-6 md:p-12 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                       <h3 className="font-headline text-lg md:text-2xl font-black text-[#0F172A] uppercase">Test History</h3>
                       <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Recent performance</p>
                    </div>
                    <Button asChild variant="ghost" className="h-8 text-[8px] font-black uppercase tracking-widest text-primary gap-1">
                       <Link href="/my-exams">View All <ChevronRight className="h-3 w-3" /></Link>
                    </Button>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                       {resultsLoading ? (
                          Array.from({ length: 2 }).map((_, i) => <div key={i} className="p-6 w-full bg-slate-50 animate-pulse" />)
                       ) : results && results.length > 0 ? (
                          results.slice(0, 5).map((r: any) => (
                             <Link key={r.id} href={`/results/${r.id || r.mockId}`} className="p-6 md:p-10 flex items-center justify-between hover:bg-slate-50/50 transition-all group border-l-[3px] border-transparent hover:border-primary">
                                <div className="flex items-center gap-4 md:gap-10 min-w-0 flex-1">
                                   <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                                      <Zap className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                                   </div>
                                   <div className="min-w-0 space-y-1">
                                      <p className="font-black text-[#0B1528] text-xs md:text-2xl uppercase truncate leading-none">{r.mockTitle}</p>
                                      <div className="flex items-center gap-4 text-[8px] md:text-[12px] font-bold text-slate-400 uppercase tracking-tight">
                                         <span className="flex items-center gap-1">
                                           <Calendar className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-slate-300" /> 
                                           {r.timestamp ? new Date(r.timestamp).toLocaleDateString() : 'N/A'}
                                         </span>
                                         <Badge className="bg-emerald-50 text-emerald-600 border-none font-black px-1.5 py-0 rounded text-[7px]">Score: {r.score}</Badge>
                                      </div>
                                   </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-1" />
                             </Link>
                          ))
                       ) : (
                          <div className="p-16 text-center opacity-30 italic text-[9px] uppercase font-black tracking-widest text-slate-400">No tests done yet.</div>
                       )}
                    </div>
                 </CardContent>
              </Card>
           </div>

           <div className="lg:col-span-4 space-y-6 md:space-y-12">
              <Card className="border-none shadow-3xl bg-gradient-to-br from-orange-500 to-primary text-white p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group">
                 <div className="absolute bottom-0 right-0 p-6 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000"><Flame className="h-48 w-48 md:h-64 md:w-64" /></div>
                 <div className="relative z-10 space-y-4 md:space-y-6">
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/70">Study Streak</p>
                    <div className="flex items-baseline gap-3 md:gap-4">
                       <p className="text-5xl md:text-9xl font-headline font-black leading-none">{stats.streak}</p>
                       <div className="space-y-0.5">
                          <p className="text-base md:text-xl font-black uppercase">Days</p>
                          <p className="text-[7px] md:text-[9px] font-bold uppercase text-white/60">Success hub</p>
                       </div>
                    </div>
                    <div className="pt-2 md:pt-4 flex gap-1.5">
                       {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className={cn("h-1 flex-1 rounded-full", i < stats.streak ? 'bg-white' : 'bg-white/20')} />
                       ))}
                    </div>
                 </div>
              </Card>

              <div className="grid grid-cols-2 gap-3 md:gap-6">
                 <DashboardTile icon={<Bookmark className="text-primary h-4 w-4" />} label="REVISION" href="/revision" />
                 <DashboardTile icon={<Trophy className="text-amber-500 h-4 w-4" />} label="RANKINGS" href="/leaderboard" />
                 <DashboardTile icon={<LayoutGrid className="text-blue-500 h-4 w-4" />} label="ALL HUBS" href="/exams" />
                 <DashboardTile icon={<Activity className="text-emerald-500 h-4 w-4" />} label="REPORT" href="/analytics" />
              </div>

              <Card className="border-none shadow-xl bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] text-left space-y-6 md:space-y-8 border border-slate-100">
                 <div className="flex items-center gap-4 md:gap-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shadow-inner">
                       <Award className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                    <div className="space-y-0.5">
                       <h4 className="text-base md:text-lg font-black uppercase text-[#0B1528]">Invite Hub</h4>
                       <p className="text-[8px] md:text-[9px] font-bold uppercase text-slate-400">Share with students</p>
                    </div>
                 </div>
                 <ShareButton 
                   variant="dark" 
                   className="w-full h-12 md:h-16 rounded-xl md:rounded-2xl bg-[#0B1528] hover:bg-black text-white shadow-2xl transition-all active:scale-95 border-none text-[9px]" 
                 />
              </Card>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function MetricItem({ label, val, icon }: any) {
  return (
    <Card className="border-none shadow-lg bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-left group hover:translate-y-[-4px] transition-all border border-slate-50">
      <div className="h-8 w-8 md:h-12 md:w-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary/5 transition-all shadow-inner border border-slate-100">
        {icon}
      </div>
      <p className="text-xl md:text-4xl font-headline font-black text-[#0F172A] leading-none tracking-tight">{val}</p>
      <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1.5 md:mt-2">{label}</p>
    </Card>
  )
}

function DashboardTile({ icon, label, href }: any) {
   return (
      <Link href={href} className="block active:scale-95 transition-all">
         <Card className="border-none shadow-md bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col items-center gap-2 md:gap-4 group hover:shadow-xl border border-slate-100">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary/5 transition-all">
               {icon}
            </div>
            <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 text-center leading-tight">{label}</span>
         </Card>
      </Link>
   )
}
