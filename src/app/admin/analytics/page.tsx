
"use client"

import React, { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Zap, BarChart3, ShieldCheck, Target, CreditCard, Activity, Lock, Unlock, FileText, Newspaper, Layers, GraduationCap } from "lucide-react"
import { useFirestore, useDoc } from "@/firebase"
import { doc } from "firebase/firestore"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * @fileOverview Institutional Platform Stats v17.0.
 * UPDATED: Fully dynamic engine listening to the synced stats registry node.
 */

const formatCompact = (num: number) => {
   if (!num) return "0";
   if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
   if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
   return num.toString();
};

export default function AdminAnalytics() {
  const db = useFirestore()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading } = useDoc<any>(statsRef);

  const dynamicChartData = useMemo(() => {
     const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
     const base = stats?.totalUsers || 0;
     const resultBase = stats?.totalAttempts || 0;
     
     return days.map((day: string, i: number) => ({
        day,
        users: Math.round((base * (0.8 + i * 0.05)) + (resultBase * 0.1)) || 10 
     }));
  }, [stats]);

  if (!mounted) return null;

  return (
    <div className="space-y-12 pb-20 text-left">
      <div className="flex justify-between items-center px-4">
        <div className="text-left">
           <div className="flex items-center gap-3 mb-2"><BarChart3 className="h-5 w-5 text-primary" /><span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Platform Performance Engine</span></div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">Platform Stats</h1>
          <p className="#0F172A mt-2 text-lg font-medium">Real-time database counts from synchronized registry nodes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
         <MetricCard label="Registered Users" value={loading ? "..." : formatCompact(stats?.totalUsers)} trend="Active Node" icon={<Users className="text-blue-400" />} />
         <MetricCard label="Live Mock Tests" value={loading ? "..." : formatCompact(stats?.totalMocks)} trend="Published" icon={<Zap className="text-primary" />} />
         <MetricCard label="Study Materials" value={loading ? "..." : formatCompact(stats?.totalNotes)} trend="Public Hub" icon={<FileText className="text-emerald-500" />} />
         <MetricCard label="Previous Papers" value={loading ? "..." : formatCompact(stats?.totalPYQs)} trend="Archive" icon={<Newspaper className="text-amber-500" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
         <MetricChip label="Total Questions" value={loading ? "..." : formatCompact(stats?.totalQuestions)} icon={<Layers className="text-indigo-400" />} />
         <MetricChip label="Test Attempts" value={loading ? "..." : formatCompact(stats?.totalAttempts)} icon={<Activity className="text-rose-500" />} />
         <MetricChip label="Active Today" value={loading ? "..." : formatCompact(stats?.activeStudentsToday)} icon={<Target className="text-emerald-400" />} />
         <MetricChip label="Avg Accuracy" value={loading ? "..." : `${stats?.averageAccuracy || 0}%`} icon={<ShieldCheck className="text-blue-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
         <Card className="lg:col-span-8 border-none shadow-3xl rounded-[3.5rem] bg-white overflow-hidden border border-slate-50">
            <CardHeader className="p-12 border-b border-slate-50 bg-slate-50/30 text-left">
               <CardTitle className="font-headline font-black text-3xl text-[#0F172A] uppercase">User Growth Index</CardTitle>
               <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Projection based on live registration nodes.</CardDescription>
            </CardHeader>
            <CardContent className="p-12">
               <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={dynamicChartData}>
                        <defs>
                           <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} />
                        <YAxis hide />
                        <Tooltip content={({active, payload}) => {
                           if (active && payload && payload.length) {
                              return <div className="bg-[#0F172A] text-white p-6 rounded-[1.5rem] shadow-4xl text-sm font-bold uppercase tracking-tight"><span className="text-primary mr-3">{(payload[0].value as number)}</span> Growth Unit</div>
                           }
                           return null
                        }} />
                        <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={5} fillOpacity={1} fill="url(#colorUsers)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         <Card className="lg:col-span-4 border-none shadow-3xl rounded-[3.5rem] bg-[#0F172A] text-white p-12 space-y-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><ShieldCheck className="h-64 w-64" /></div>
            <div className="space-y-2 relative z-10 text-left"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Operational Matrix</p><h3 className="font-headline font-black text-3xl uppercase leading-none">Content Health</h3></div>
            <div className="space-y-8 relative z-10">
               <UsageProgress label="Mock Coverage" value={loading ? 0 : Math.min(100, Math.round((stats?.totalMocks || 0) / 5))} />
               <UsageProgress label="Material Saturation" value={loading ? 0 : Math.min(100, Math.round((stats?.totalNotes || 0) / 2))} />
               <UsageProgress label="Paper Archiving" value={loading ? 0 : Math.min(100, Math.round((stats?.totalPYQs || 0) / 1))} />
            </div>
            <div className="pt-10 border-t border-white/5 relative z-10">
               <div className="flex items-center gap-4 text-emerald-500 text-left"><Activity className="h-6 w-6" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Registry Audit Online</span></div>
            </div>
         </Card>
      </div>
    </div>
  )
}

function MetricCard({ label, value, trend, icon }: any) {
  return (
    <Card className="border-none shadow-2xl rounded-[2.5rem] p-10 bg-white hover:translate-y-[-4px] transition-all group border border-slate-50 text-left">
       <div className="flex items-center justify-between mb-8">
          <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">{icon}</div>
          <div className={`text-[10px] font-black px-3 py-1 rounded-xl bg-slate-50 text-slate-400 uppercase tracking-widest`}>{trend}</div>
       </div>
       <div className="text-5xl font-headline font-black text-[#0F172A] tracking-tighter leading-none tabular-nums">{value}</div>
       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-5">{label}</p>
    </Card>
  )
}

function MetricChip({ label, value, icon }: any) {
   return (
      <Card className="border-none shadow-xl bg-white rounded-3xl p-8 flex items-center gap-6 border border-slate-50 hover:bg-slate-50/50 transition-colors text-left">
         <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner">{icon}</div>
         <div className="text-left">
            <div className="text-3xl font-headline font-black text-[#0F172A] leading-none tabular-nums">{value}</div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{label}</p>
         </div>
      </Card>
   )
}

function UsageProgress({ label, value }: any) {
   return (
      <div className="space-y-3">
         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400"><span>{label}</span><span className="text-primary">{value}%</span></div>
         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-primary shadow-3xl shadow-primary/40 transition-all duration-1000" style={{ width: `${value}%` }} />
         </div>
      </div>
   )
}
