
"use client"

import React, { useMemo, useEffect, useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useUser, useCollection, useFirestore } from "@/firebase"
import { collection, query, where, doc, updateDoc, limit, arrayRemove, serverTimestamp } from "firebase/firestore"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Zap, 
  ChevronRight, 
  History, 
  Star,
  ShieldCheck,
  Clock,
  GraduationCap,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Plus,
  X,
  Smartphone,
  Download,
  Sparkles,
  AlertCircle,
  Gem
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { usePWAInstall } from "@/hooks/use-pwa-install"

/**
 * @fileOverview Institutional My Hub Hub v8.0 (Countdown Integration).
 */

export default function MyExamsPage() {
  const { user, profile, loading: userLoading } = useUser()
  const { isInstalled, canInstall, installApp } = usePWAInstall()
  const db = useFirestore()
  const router = useRouter()
  const { toast } = useToast()
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const [unpinningId, setUnpinningId] = useState<string | null>(null)
  const [settingTargetId, setSettingTargetId] = useState<string | null>(null)
  const [passTimer, setPassTimer] = useState("");

  useEffect(() => {
    if (!userLoading && !user) router.push("/login?returnUrl=/my-exams")
  }, [user, userLoading, router])

  useEffect(() => {
    if (!profile?.passExpiresAt) return;
    
    const interval = setInterval(() => {
      const expiry = new Date(profile.passExpiresAt).getTime();
      const now = new Date().getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setPassTimer("Expired");
        clearInterval(interval);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (d > 0) setPassTimer(`${d} Days Remaining`);
      else if (h > 0) setPassTimer(`${h} Hours Remaining`);
      else setPassTimer(`Ending Soon`);
    }, 1000);

    return () => clearInterval(interval);
  }, [profile]);

  const examsQuery = useMemo(() => (db ? collection(db, "exams") : null), [db])
  const boardsQuery = useMemo(() => (db ? collection(db, "boards") : null), [db])
  
  const { data: allExams, loading: examsLoading } = useCollection<any>(examsQuery)
  const { data: boards } = useCollection<any>(boardsQuery)

  const pinnedExams = useMemo(() => {
    if (!allExams || !profile?.pinnedExams) return []
    return (allExams as any[]).filter((e: any) => profile.pinnedExams?.includes(e.id))
  }, [allExams, profile])

  const resultsQuery = useMemo(() => {
    if (!db || !user) return null
    return query(collection(db, "results"), where("userId", "==", user.uid), limit(10))
  }, [db, user])

  const { data: rawResults, loading: attemptsLoading } = useCollection<any>(resultsQuery)

  const recentAttempts = useMemo(() => {
    if (!rawResults) return []
    return [...rawResults].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [rawResults])

  const handleUnpin = async (examId: string) => {
    if (!db || !user || unpinningId) return;
    setUnpinningId(examId);
    try {
      await updateDoc(doc(db, "users", user.uid), { pinnedExams: arrayRemove(examId), updatedAt: serverTimestamp() });
      toast({ title: "Hub Updated", description: "Vertical removed from your personal hub." });
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed" });
    } finally { setUnpinningId(null); }
  };

  const handleSetTarget = async (examName: string, examId: string) => {
    if (!db || !user || settingTargetId) return;
    setSettingTargetId(examId);
    try {
      await updateDoc(doc(db, "users", user.uid), { targetExam: examName, updatedAt: serverTimestamp() });
      toast({ title: "Target Locked", description: `Your focus is now set to ${examName}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Update Failed" });
    } finally { setSettingTargetId(null); }
  };

  if (userLoading) return <div className="h-screen flex items-center justify-center bg-white"><Zap className="h-10 w-10 text-primary animate-pulse" /></div>

  const passActive = profile?.passStatus === 'active';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-body pb-safe text-left">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-16 max-w-7xl space-y-12 md:space-y-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
           <div className="lg:col-span-8 space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-2">
                 <div className="space-y-4">
                    <h1 className="text-5xl md:text-8xl font-headline font-black text-[#0F172A] uppercase tracking-tighter leading-none">MY <span className="text-primary">HUB</span></h1>
                    <p className="text-sm md:text-2xl text-slate-400 font-medium max-w-xl">Your authoritative preparation registry and target exams.</p>
                 </div>
                 <Button asChild className="h-16 px-10 bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-[2rem] shadow-4xl gap-3 active:scale-95 transition-all border-none">
                    <Link href="/exams"><Plus className="h-5 w-5 text-primary" /> Add Exams</Link>
                 </Button>
              </div>

              <section className="space-y-8">
                 <div className="flex items-center gap-3 px-3">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Active Registry</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                    {examsLoading ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-[400px] w-full rounded-[3.5rem] bg-white" />) : 
                    pinnedExams.length > 0 ? pinnedExams.map((exam: any) => {
                       const board = boards?.find((b: any) => b.id === exam.boardId || b.abbreviation === exam.boardId);
                       const logoUrl = board?.iconUrl || exam.iconUrl;
                       const isTarget = profile?.targetExam === exam.name;
                       return (
                        <Card key={exam.id} className="border-none shadow-2xl hover:shadow-5xl transition-all duration-500 rounded-[3.5rem] bg-white group overflow-hidden h-[420px] flex flex-col border border-slate-100 relative p-8 md:p-12 text-center">
                          {isTarget && (
                            <div className="absolute top-8 right-8 z-20">
                              <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm px-4 py-1.5 font-black text-[9px] uppercase flex items-center gap-2 rounded-xl">
                                <CheckCircle2 className="h-3.5 w-3.5" /> TARGET
                              </Badge>
                            </div>
                          )}
                          <div className="flex flex-col items-center flex-1 h-full pt-4">
                             <div className="h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform overflow-hidden mb-8">{logoUrl && !failedImages[exam.id] ? <img src={logoUrl} className="w-full h-full object-contain p-3" referrerPolicy="no-referrer" alt="Logo" onError={() => setFailedImages(p => ({...p, [exam.id]: true}))} /> : <GraduationCap className="h-10 w-10 text-slate-200" />}</div>
                             <h4 className="font-black text-xl md:text-2xl text-[#0F172A] uppercase leading-tight mb-4 px-4 line-clamp-2">{exam.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{board?.abbreviation || 'PSSSB'} Hub</p>
                          </div>
                          <div className="space-y-6 pt-10 mt-auto">
                             <div className="grid grid-cols-2 gap-4">
                                <Button onClick={() => handleSetTarget(exam.name, exam.id)} disabled={settingTargetId === exam.id || isTarget} variant="outline" className={cn("h-14 rounded-2xl border-2 font-black uppercase text-[9px] tracking-widest gap-2 shadow-sm", isTarget ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-white border-slate-100 text-[#0F172A] hover:bg-slate-50")}>{settingTargetId === exam.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}{isTarget ? 'TARGETED' : 'SET TARGET'}</Button>
                                <Button asChild className="h-14 bg-[#0F172A] hover:bg-black text-white rounded-2xl font-black uppercase text-[9px] tracking-widest border-none shadow-xl transition-all"><Link href={`/exams/${exam.id}`}>OPEN HUB</Link></Button>
                             </div>
                             <button onClick={() => handleUnpin(exam.id)} disabled={unpinningId === exam.id} className="w-fit mx-auto flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 hover:text-rose-500 uppercase tracking-widest transition-colors active:scale-90">{unpinningId === exam.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : <X className="h-3.5 w-3.5" />}REMOVE</button>
                          </div>
                        </Card>
                       )
                    }) : (
                       <Card className="col-span-full border-2 border-dashed border-slate-200 bg-white/50 py-24 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-8">
                          <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 shadow-inner"><Plus className="h-12 w-12" /></div>
                          <div className="space-y-3 px-6"><p className="text-2xl font-headline font-black text-[#0F172A] uppercase">Hub Empty</p><p className="text-sm font-medium text-slate-400 uppercase tracking-widest max-w-xs">Select recruitment verticals to build your hub.</p></div>
                          <Button asChild className="bg-[#0F172A] hover:bg-black rounded-2xl h-16 px-12 font-black uppercase text-[10px] tracking-[0.2em] shadow-4xl border-none"><Link href="/exams">Select Exams</Link></Button>
                       </Card>
                    )}
                 </div>
              </section>
           </div>

           <div className="lg:col-span-4 space-y-10">
              <Card className="border-none shadow-4xl bg-[#0B1528] text-white p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:scale-110 transition-transform"><Gem className="h-48 w-48" /></div>
                 <div className="relative z-10 space-y-8 text-left">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">ACCOUNT STATUS</p>
                       <h3 className="text-2xl md:text-4xl font-headline font-black uppercase">{passActive ? 'Elite Active' : 'Basic Tier'}</h3>
                    </div>
                    
                    {passActive && passTimer ? (
                       <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0"><Clock className="h-6 w-6" /></div>
                          <div className="min-w-0">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">TIME REMAINING</p>
                             <p className="text-sm font-bold text-white uppercase">{passTimer}</p>
                          </div>
                       </div>
                    ) : !passActive && (
                       <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0"><AlertCircle className="h-6 w-6" /></div>
                          <div className="min-w-0">
                             <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest">ACCESS LIMITED</p>
                             <p className="text-sm font-bold text-rose-200 uppercase">Upgrade for Elite Mocks</p>
                          </div>
                       </div>
                    )}

                    <Button asChild className="w-full h-16 bg-primary hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-3xl border-none active:scale-95 transition-all">
                       <Link href="/pass">{passActive ? 'MANAGE PASS' : 'UPGRADE NOW'} <ChevronRight className="h-4 w-4 ml-2" /></Link>
                    </Button>
                 </div>
              </Card>

              {!isInstalled && canInstall && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-6 text-left relative overflow-hidden group">
                   <div className="absolute -bottom-4 -right-4 p-8 opacity-5"><Smartphone className="h-32 w-32" /></div>
                   <div className="space-y-2">
                      <h4 className="text-lg font-black text-[#0F172A] uppercase">Install App</h4>
                      <p className="text-xs text-slate-400 font-medium">Get rapid access to mock tests on your home screen.</p>
                   </div>
                   <Button onClick={installApp} className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-[#0F172A] font-black uppercase text-[9px] tracking-widest rounded-xl border-none shadow-sm gap-2">
                      <Download className="h-4 w-4" /> DOWNLOAD PWA
                   </Button>
                </div>
              )}
           </div>
        </div>

        <section className="space-y-8 pt-8">
           <div className="flex items-center gap-3 px-3">
              <History className="h-5 w-5 text-slate-400" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Preparation Logs</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {attemptsLoading ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-[2.5rem] bg-white" />) : 
              recentAttempts.length > 0 ? recentAttempts.map((r: any) => (
                 <Link key={r.id} href={`/results/${r.mockId}`}>
                    <Card className="border-none shadow-xl hover:shadow-4xl transition-all duration-500 rounded-[2.5rem] bg-white p-8 md:p-10 flex items-center justify-between group overflow-hidden border border-slate-100">
                       <div className="flex items-center gap-8 min-w-0 flex-1">
                          <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary/5 transition-all"><Zap className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-500" /></div>
                          <div className="min-w-0 space-y-2"><h4 className="font-black text-xl md:text-2xl text-[#0F172A] uppercase truncate leading-none">{r.mockTitle}</h4><div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight"><span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {new Date(r.timestamp).toLocaleDateString()}</span><Badge className="bg-emerald-50 text-emerald-600 border-none font-black px-3 py-1 rounded-lg text-[10px]">Score: {r.score}</Badge></div></div>
                       </div>
                       <ChevronRight className="h-6 w-6 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-2 shrink-0 ml-4" />
                    </Card>
                 </Link>
              )) : <div className="col-span-full py-20 text-center bg-white rounded-[3.5rem] border border-slate-100 shadow-sm opacity-30 italic"><p className="font-black uppercase tracking-[0.4em] text-[10px]">No recent test activity detected.</p></div>}
           </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
