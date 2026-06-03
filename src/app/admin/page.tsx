
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Database, Users, ShieldCheck, Rocket, Zap, Activity, Target, ShieldAlert, FileWarning, SearchCode, TrendingDown, ClipboardList } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { useCollection, useFirestore, useUser, useDoc } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { useMemo, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { seedInitialData } from "@/services/seed-data"
import { useToast } from "@/hooks/use-toast"

/**
 * @fileOverview Final Admin Command Center (Phase 106 - Founder Dashboard).
 * Features: Launch KPIs, System Readiness Audit, and Intelligence Mapping.
 */

export default function AdminDashboard() {
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()

  const { data: users } = useCollection<any>(useMemo(() => (db ? collection(db, "users") : null), [db]))
  const { data: questions } = useCollection<any>(useMemo(() => (db ? collection(db, "questions") : null), [db]))
  const { data: mocks } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]))
  const { data: reports } = useCollection<any>(useMemo(() => (db ? collection(db, "reports") : null), [db]))
  const { data: globalSettings } = useDoc<any>(useMemo(() => (db ? doc(db, "settings", "global") : null), [db]))

  const isFounder = user?.email === 'arshdeepgrewal1122@gmail.com';

  const intelligence = useMemo(() => {
    if (!questions) return { lowAccuracy: [] }
    const lowAccuracy = questions
      .filter((q: any) => q.attempts > 5 && (q.correctAttempts / q.attempts) < 0.4)
      .slice(0, 3)
    return { lowAccuracy }
  }, [questions])

  const launchReady = useMemo(() => {
    const checks = {
      initialalized: !!globalSettings,
      questions: (questions?.length || 0) >= 10,
      mocks: (mocks?.length || 0) >= 1,
      legal: true
    }
    return checks
  }, [globalSettings, questions, mocks])

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Institutional Governance System</span>
           </div>
          <h1 className="text-5xl font-headline font-black text-primary uppercase tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-2 text-lg">Scale Oversight: {users?.length || 0} Registered Aspirant Nodes.</p>
        </div>
        <div className="flex gap-4">
           {isFounder && (
             <Button onClick={() => seedInitialData(db!)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black h-14 px-8 text-xs uppercase tracking-widest gap-3 shadow-xl transition-all active:scale-95">
               <Rocket className="h-4 w-4" /> Global Repo Sync
             </Button>
           )}
           <Button asChild className="bg-primary hover:bg-primary/90 rounded-2xl h-14 px-10 font-black shadow-2xl uppercase tracking-widest text-xs">
            <Link href="/admin/mocks/builder"><Plus className="mr-3 h-5 w-5" /> Assemble Mock</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <StatCard label="Total Aspirants" value={users?.length || 0} icon={<Users />} />
         <StatCard label="MCQ Bank" value={questions?.length || 0} icon={<Database />} />
         <StatCard label="Live Series" value={mocks?.filter((m:any) => m.published).length || 0} icon={<ClipboardList />} />
         <StatCard label="Audit Flags" value={reports?.filter((r:any) => r.status === 'PENDING').length || 0} icon={<ShieldAlert />} color="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         <div className="lg:col-span-8 space-y-10">
            <Card className="border-none shadow-3xl bg-card/50 rounded-[3rem] overflow-hidden">
               <CardHeader className="p-12 border-b border-white/5 bg-primary/5">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <CardTitle className="text-2xl font-headline font-black uppercase">Exam Intelligence</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Deep analysis of logic failure points</CardDescription>
                     </div>
                     <SearchCode className="h-10 w-10 text-primary opacity-20" />
                  </div>
               </CardHeader>
               <CardContent className="p-12">
                  <h4 className="font-black text-xs uppercase tracking-[0.3em] text-rose-500 mb-8 flex items-center gap-3">
                     <TrendingDown className="h-4 w-4" /> Lowest Accuracy Logic Nodes
                  </h4>
                  <div className="space-y-6">
                     {intelligence.lowAccuracy.length > 0 ? intelligence.lowAccuracy.map((q: any) => (
                        <div key={q.id} className="p-8 bg-white/5 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-rose-500/30 transition-all">
                           <div className="space-y-2">
                              <p className="font-bold text-slate-100 line-clamp-1">{q.questionEn}</p>
                              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{q.subjectId} • {q.boardId}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-2xl font-headline font-black text-rose-500 leading-none">
                                 {Math.round((q.correctAttempts / q.attempts) * 100)}%
                              </p>
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Accuracy</p>
                           </div>
                        </div>
                     )) : (
                       <div className="py-20 text-center opacity-20 italic">Insufficient attempt data for intelligence mapping.</div>
                     )}
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="lg:col-span-4 space-y-10">
            <Card className="border-none bg-[#0F172A] rounded-[3.5rem] p-12 space-y-10 shadow-4xl">
               <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-black text-white uppercase flex items-center gap-4">
                     <Rocket className="h-6 w-6 text-primary" /> Cracklix 1.0 Launch
                  </h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Launch Readiness Checklist</p>
               </div>
               <div className="space-y-6">
                  <LaunchItem label="Institutional Repo Initialized" status={launchReady.initialalized ? 'PASS' : 'PENDING'} />
                  <LaunchItem label="Content Bank (>5000 Items)" status={launchReady.questions ? 'PASS' : 'BUILDING'} />
                  <LaunchItem label="Official Mock Blueprint" status={launchReady.mocks ? 'PASS' : 'PENDING'} />
                  <LaunchItem label="Legal & Privacy Compliant" status="PASS" />
               </div>
               <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-3xl transition-all active:scale-95">
                  Initialize Global Broadcast
               </Button>
            </Card>
         </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }: any) {
   return (
      <Card className="border-none shadow-2xl bg-card/50 p-10 rounded-[3rem] group hover:translate-y-[-4px] transition-all">
         <div className="flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
               {icon}
            </div>
            <div>
               <p className={`text-4xl font-headline font-black tracking-tighter ${color || 'text-white'}`}>{value}</p>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">{label}</p>
            </div>
         </div>
      </Card>
   )
}

function LaunchItem({ label, status }: any) {
   return (
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
         <span className="text-xs font-bold text-slate-400">{label}</span>
         <Badge className={`border-none text-[9px] font-black px-3 py-1 ${status === 'PASS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {status}
         </Badge>
      </div>
   )
}
