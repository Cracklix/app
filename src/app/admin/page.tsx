"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Database, Users, ShieldCheck, Rocket, Zap, Activity, Target, ShieldAlert, FileWarning, SearchCode, TrendingDown, ClipboardList, TrendingUp, DollarSign, ListChecks, CheckCircle2, AlertCircle } from "lucide-react"
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
 * @fileOverview Final Admin Command Center (Phase 115 - Operations Node).
 * Features: Development Progress Tracker, Operational To-Do, and Launch KPIs.
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
    { label: "Auth & Security", val: 100 },
    { label: "Role Management", val: 100 },
    { label: "Question Bank", val: 95 },
    { label: "Bulk Parser", val: 100 },
    { label: "Mock Builder", val: 95 },
    { label: "CBT Engine", val: 100 },
    { label: "Results Logic", val: 100 },
    { label: "Analysis Feed", val: 90 },
    { label: "Exam Gazette", val: 90 },
    { label: "PYQ Archives", val: 90 },
  ];

  const avgProgress = Math.round(devProgress.reduce((acc, p) => acc + p.val, 0) / devProgress.length);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Founder Oversight Node</span>
           </div>
          <h1 className="text-5xl font-headline font-black text-primary uppercase tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-2 text-lg">System Scale: {users?.length || 0} Registered Aspirants.</p>
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
         <StatCard label="Active Nodes" value={users?.length || 0} icon={<Users />} />
         <StatCard label="MCQ Buffer" value={questions?.length || 0} icon={<Database />} />
         <StatCard label="Live Series" value={mocks?.filter((m:any) => m.published).length || 0} icon={<ClipboardList />} />
         <StatCard label="Audit Flags" value={reports?.filter((r:any) => r.status === 'PENDING').length || 0} icon={<ShieldAlert />} color="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         <div className="lg:col-span-8 space-y-10">
            {/* Development Progress Tracker (Phase 115) */}
            <Card className="border-none shadow-3xl bg-card/50 rounded-[3rem] overflow-hidden">
               <CardHeader className="p-12 border-b border-white/5 bg-primary/5">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <CardTitle className="text-2xl font-headline font-black uppercase">Build Integrity ({avgProgress}%)</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cracklix 1.0 Release Management</CardDescription>
                     </div>
                     <ListChecks className="h-10 w-10 text-primary opacity-20" />
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

            {/* Operational Tasks (Phase 108) */}
            <Card className="border-none shadow-3xl bg-card/50 rounded-[3rem] overflow-hidden">
               <CardHeader className="p-12 border-b border-white/5">
                  <CardTitle className="text-2xl font-headline font-black uppercase">Daily Operations</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Recurring institutional maintenance tasks</CardDescription>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                     <TaskItem label="Audit Pending Question Reports" count={reports?.filter((r:any) => r.status === 'PENDING').length || 0} href="/admin/reports" />
                     <TaskItem label="Publish Today's Analysis Feed" count={0} href="/admin/current-affairs" />
                     <TaskItem label="Check Official Board Gazzette" count={0} href="/admin/notifications" />
                     <TaskItem label="Verify New Mock Assemblies" count={mocks?.filter((m:any) => !m.published).length || 0} href="/admin/mocks" />
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="lg:col-span-4 space-y-10">
            <Card className="border-none bg-[#0F172A] rounded-[3.5rem] p-12 space-y-10 shadow-4xl">
               <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-black text-white uppercase flex items-center gap-4">
                     <Rocket className="h-6 w-6 text-primary" /> 1.0 Launch Ready
                  </h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Stability Audit</p>
               </div>
               <div className="space-y-6">
                  <LaunchItem label="Institutional Repo Initialized" status="PASS" />
                  <LaunchItem label="Security Rules Hardened" status="PASS" />
                  <LaunchItem label="Bilingual Engine Verified" status="PASS" />
                  <LaunchItem label="Revenue Ready Status" status={globalSettings?.revenueReady ? 'PASS' : 'LOCKED'} />
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
                  <h4 className="font-headline font-black text-lg text-white uppercase">Growth Mode</h4>
               </div>
               <div className="space-y-1">
                  <p className="text-3xl font-black text-emerald-500 tracking-tighter">₹0.00</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lifetime Repository Revenue</p>
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

function TaskItem({ label, count, href }: { label: string, count: number, href: string }) {
   return (
      <Link href={href}>
         <div className="p-8 flex items-center justify-between hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4">
               <div className={`h-2 w-2 rounded-full ${count > 0 ? 'bg-orange-500' : 'bg-emerald-500'}`} />
               <span className="font-bold text-slate-200 group-hover:text-primary transition-colors">{label}</span>
            </div>
            {count > 0 && <Badge className="bg-orange-500 text-white border-none font-black">{count}</Badge>}
            {count === 0 && <CheckCircle2 className="h-5 w-5 text-emerald-500 opacity-20" />}
         </div>
      </Link>
   )
}
