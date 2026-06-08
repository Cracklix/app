
"use client"

import React, { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Database, Users, ShieldCheck, Zap, Loader2, Landmark, BookOpen, Send, CheckCircle2, Activity, Clock, ChevronRight, History } from "lucide-react"
import Link from "next/link"
import { useCollection, useFirestore, useDoc } from "@/firebase"
import { collection, query, orderBy, limit, doc } from "firebase/firestore"
import { seedInitialData } from "@/services/seed-data"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import StudentAvatar from "@/components/brand/StudentAvatar"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * @fileOverview Institutional Command Center v29.0.
 * PERFORMANCE: Stabilized Query references and removed scan-heavy stats calculations.
 */

export default function AdminDashboard() {
  const db = useFirestore()
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)

  // STABILIZED DATA LISTENERS (Strictly limited for speed)
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading: statsLoading } = useDoc<any>(statsRef);

  const recentUsersQuery = useMemo(() => (db ? query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5)) : null), [db]);
  const { data: recentUsers } = useCollection<any>(recentUsersQuery);

  const recentResultsQuery = useMemo(() => (db ? query(collection(db, "results"), orderBy("timestamp", "desc"), limit(5)) : null), [db]);
  const { data: recentResults } = useCollection<any>(recentResultsQuery);

  const handlePushToRegistry = async () => {
    if (!db) return
    setIsSyncing(true)
    try {
      await seedInitialData(db)
      toast({ title: "Registry Synced", description: "Official Punjab Exam nodes updated." })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed" })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-6 md:space-y-12 pb-20 text-[#0F172A] text-left pt-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-8 px-2 md:px-4">
        <div className="min-w-0 flex-1">
           <div className="flex items-center gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 shrink-0">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[8px] md:text-[9px] font-black uppercase text-emerald-600 tracking-widest">System Online</span>
              </div>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 truncate">Registry Command Hub</span>
           </div>
          <h1 className="text-3xl md:text-5xl font-headline font-black text-[#0F172A] uppercase tracking-tight leading-tight truncate">Admin Center</h1>
          <p className="text-slate-500 mt-1 md:mt-2 text-sm md:text-lg font-medium">Monitoring Preparation Nodes & Financial Distribution.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
           <Button onClick={handlePushToRegistry} disabled={isSyncing} className="h-12 md:h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl md:rounded-2xl font-black shadow-xl uppercase tracking-widest text-xs px-8">
              {isSyncing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />} Initialize Seeding
           </Button>
           <Button asChild className="bg-[#0F172A] hover:bg-black text-white rounded-xl md:rounded-2xl h-12 md:h-14 px-8 md:px-10 font-black shadow-xl uppercase tracking-widest text-xs border-none">
            <Link href="/admin/bulk-import"><Plus className="mr-2 h-4 w-4" /> Bulk Ingestion</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-2 md:px-4">
         <StatCard label="Global Bank" value={stats?.mcqCount || "..."} icon={<Database className="text-blue-500" />} />
         <StatCard label="Live Mocks" value={stats?.mockCount || "..."} icon={<Zap className="text-primary" />} />
         <StatCard label="Aspirants" value={stats?.userCount || "..."} icon={<Users className="text-emerald-500" />} />
         <StatCard label="Accuracy" value={`${stats?.avgAccuracy || "94"}%`} icon={<Target className="text-rose-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-2 md:px-4">
         <Card className="lg:col-span-8 border-none shadow-3xl bg-white rounded-3xl overflow-hidden text-left border border-slate-100">
            <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
               <CardTitle className="text-2xl font-headline font-black uppercase text-[#0F172A]">Audit Stream</CardTitle>
               <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live operational activity across the hub.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Users className="h-4 w-4" /> Latest Aspirant Registrations</h4>
                  <div className="grid grid-cols-1 gap-3">
                     {recentUsers?.map((u: any) => (
                        <div key={u.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-4">
                              <StudentAvatar profile={u} className="h-10 w-10 rounded-xl" />
                              <div>
                                 <p className="font-bold text-sm text-[#0F172A] uppercase">{u.name}</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase">{u.email}</p>
                              </div>
                           </div>
                           <Badge variant="ghost" className="text-[8px] font-black text-slate-300">NEW HUB</Badge>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Activity className="h-4 w-4" /> Recent CBT Attempts</h4>
                  <div className="grid grid-cols-1 gap-3">
                     {recentResults?.map((r: any) => (
                        <div key={r.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Zap className="h-5 w-5" /></div>
                              <div>
                                 <p className="font-bold text-sm text-[#0F172A] uppercase">{r.mockTitle}</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase">{r.userName} • Score: {r.score}</p>
                              </div>
                           </div>
                           <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px]">{r.accuracy}%</Badge>
                        </div>
                     ))}
                  </div>
               </div>
            </CardContent>
         </Card>

         <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-3xl bg-[#0F172A] text-white p-10 rounded-[3rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><ShieldCheck className="h-64 w-64" /></div>
               <div className="relative z-10 space-y-10">
                  <div className="space-y-2 text-left">
                     <h3 className="text-2xl font-headline font-black uppercase tracking-tight">Quick Launch</h3>
                     <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Launch content generators</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                     <QuickLink label="Assemble Mock" href="/admin/mocks/builder" />
                     <QuickLink label="Manual MCQ Entry" href="/admin/questions/add" />
                     <QuickLink label="Subject Registry" href="/admin/subjects" />
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: any) {
   return (
      <Card className="border-none shadow-xl bg-white p-6 rounded-[2rem] hover:translate-y-[-4px] transition-all text-left">
         <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">{icon}</div>
            <div>
               <p className="text-xl md:text-3xl font-headline font-black text-[#0F172A] tabular-nums leading-none">{value}</p>
               <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-2">{label}</p>
            </div>
         </div>
      </Card>
   )
}

function QuickLink({ label, href }: { label: string, href: string }) {
   return (
      <Link href={href} className="group">
         <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all">
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
         </div>
      </Link>
   )
}

function RefreshCw({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>;
}
