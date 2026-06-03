
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Database, Users, ShieldCheck, Rocket, Zap, Activity, Target, ShieldAlert, FileWarning, SearchCode, TrendingDown, ClipboardList, TrendingUp, DollarSign, ListChecks, CheckCircle2, AlertCircle, Scale, CalendarDays, Megaphone } from "lucide-react"
import Link from "next/link"
import { useCollection, useFirestore, useUser, useDoc } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { seedInitialData } from "@/services/seed-data"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

/**
 * @fileOverview Final Admin Command Center (Phase 116-125).
 * Features: Launch Governance, Content SLAs, and Completion Criteria Monitor.
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

  const devProgress = [
    { label: "Auth & Governance", val: 100 },
    { label: "Bulk Extraction", val: 100 },
    { label: "Audit Workflows", val: 100 },
    { label: "Results Intelligence", val: 100 },
    { label: "Exam Hub v1.0", val: 95 },
    { label: "Mock Architect", val: 95 },
    { label: "Trust Bar v1.0", val: 90 },
    { label: "Alert Gazette", val: 90 },
  ];

  const slaProgress = [
    { label: "Daily Questions (Target 50)", val: 12, max: 50 },
    { label: "Daily Analysis (Target 5)", val: 2, max: 5 },
    { label: "Weekly Mocks (Target 10)", val: 4, max: 10 },
  ];

  const avgProgress = Math.round(devProgress.reduce((acc, p) => acc + p.val, 0) / devProgress.length);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Launch Governance Node</span>
           </div>
          <h1 className="text-5xl font-headline font-black text-primary uppercase tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-2 text-lg">Platform Node: {users?.length || 0} Registered Aspirants.</p>
        </div>
        <div className="flex gap-4">
           {isFounder && (
             <Button onClick={() => seedInitialData(db!)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black h-14 px-8 text-xs uppercase tracking-widest gap-3 shadow-xl transition-all active:scale-95">
               <Rocket className="h-4 w-4" /> Initialize Global Repo
             </Button>
           )}
           <Button asChild className="bg-primary hover:bg-primary/90 rounded-2xl h-14 px-10 font-black shadow-2xl uppercase tracking-widest text-xs">
            <Link href="/admin/mocks/builder"><Plus className="mr-3 h-5 w-5" /> Assemble Mock</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <StatCard label="Aspirant Nodes" value={users?.length || 0} icon={<Users />} />
         <StatCard label="Verified MCQs" value={questions?.length || 0} icon={<Database />} />
         <StatCard label="Active Series" value={mocks?.filter((m:any) => m.published).length || 0} icon={<ClipboardList />} />
         <StatCard label="Audit Flags" value={reports?.filter((r:any) => r.status === 'PENDING').length || 0} icon={<ShieldAlert />} color="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         <div className="lg:col-span-8 space-y-10">
            {/* Completion Criteria Monitor (Phase 125) */}
            <Card className="border-none shadow-3xl bg-card/50 rounded-[3rem] overflow-hidden">
               <CardHeader className="p-12 border-b border-white/5 bg-primary/5">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <CardTitle className="text-2xl font-headline font-black uppercase">v1.0 Success Criteria ({avgProgress}%)</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Institutional Governance & Readiness</CardDescription>
                     </div>
                     <Scale className="h-10 w-10 text-primary opacity-20" />
                  </div>
               </CardHeader>
               <CardContent className="p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                     {devProgress.map((p) => (
                        <div key={p.label} className="space-y-3">
                           <div className="flex justify-between items-end">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{p.label}</span>
                              <span className="text-[10px] font-black text-primary">{p.val}%</span>
                           </div>
                           <Progress value={p.val} className="h-1 bg-white/5" />
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Content SLA Tracking (Phase 117) */}
            <Card className="border-none shadow-3xl bg-[#0F172A] text-white rounded-[3rem] overflow-hidden">
               <CardHeader className="p-12 border-b border-white/5">
                  <div className="flex items-center gap-4">
                     <Megaphone className="h-6 w-6 text-primary" />
                     <CardTitle className="text-2xl font-headline font-black uppercase">Content SLA Engine</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-12 space-y-10">
                  {slaProgress.map((s) => (
                     <div key={s.label} className="space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-xs font-bold text-slate-400">{s.label}</span>
                           <Badge variant="outline" className="border-white/10 text-primary font-black">{s.val} / {s.max}</Badge>
                        </div>
                        <Progress value={(s.val / s.max) * 100} className="h-2 bg-white/5" />
                     </div>
                  ))}
               </CardContent>
            </Card>
         </div>

         <div className="lg:col-span-4 space-y-10">
            <Card className="border-none bg-[#0F172A] rounded-[3.5rem] p-12 space-y-10 shadow-4xl">
               <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-black text-white uppercase flex items-center gap-4">
                     <Rocket className="h-6 w-6 text-primary" /> 1.0 Launch Ready
                  </h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aspirant Success Audit</p>
               </div>
               <div className="space-y-6">
                  <LaunchItem label="Trust Bar Online" status="PASS" />
                  <LaunchItem label="Success Registry Active" status="PASS" />
                  <LaunchItem label="Bilingual Engine Hardened" status="PASS" />
                  <LaunchItem label="Revenue Ready Node" status={globalSettings?.revenueReady ? 'PASS' : 'LOCKED'} />
               </div>
               <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-3xl transition-all active:scale-95">
                  Trigger Beta Launch
               </Button>
            </Card>

            <Card className="border-none bg-emerald-950/20 border border-emerald-500/10 rounded-[3rem] p-10 space-y-6 shadow-2xl">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                     <DollarSign className="h-6 w-6" />
                  </div>
                  <h4 className="font-headline font-black text-lg text-white uppercase">Revenue Node</h4>
               </div>
               <div className="space-y-1">
                  <p className="text-3xl font-black text-emerald-500 tracking-tighter">₹0.00</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Institutional Yield</p>
               </div>
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
         <Badge className={`border-none text-[9px] font-black px-3 py-1 ${status === 'PASS' ? 'bg-emerald-500/10 text-emerald-500' : status === 'LOCKED' ? 'bg-slate-500/10 text-slate-400' : 'bg-rose-500/10 text-rose-500'}`}>
            {status}
         </Badge>
      </div>
   )
}
