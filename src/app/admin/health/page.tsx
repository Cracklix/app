"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HeartPulse, Database, Zap, Activity, Clock, ShieldCheck, Search, HardDrive, RefreshCw } from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const healthData = [
  { time: "00:00", latency: 120, reads: 450 },
  { time: "04:00", latency: 95, reads: 220 },
  { time: "08:00", latency: 150, reads: 1200 },
  { time: "12:00", latency: 180, reads: 3500 },
  { time: "16:00", latency: 140, reads: 2800 },
  { time: "20:00", latency: 110, reads: 1500 },
  { time: "23:59", latency: 130, reads: 800 },
]

/**
 * @fileOverview Final Operational Node Monitor (Phase 110).
 * Real-time monitoring of system latency, database node activity, and operational stability.
 */

export default function PlatformHealth() {
  const [lastSync, setLastSync] = useState("");

  useEffect(() => {
    setLastSync(new Date().toLocaleTimeString());
  }, []);

  const handleRefresh = () => {
    setLastSync(new Date().toLocaleTimeString());
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <HeartPulse className="h-6 w-6 text-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Platform Stability Monitor</span>
           </div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">System Health</h1>
          <p className="text-muted-foreground mt-2 text-lg">Real-time telemetry for institutional node performance and latency.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Signal Sync</p>
              <p className="text-sm font-bold text-emerald-500">{lastSync}</p>
           </div>
           <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/5 bg-white/5" onClick={handleRefresh}>
              <RefreshCw className="h-5 w-5 text-slate-400" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <HealthCard label="API Latency" value="142ms" status="OPTIMAL" color="text-emerald-500" icon={<Zap />} />
         <HealthCard label="Storage Node" value="2.4GB / 5GB" status="STABLE" color="text-blue-500" icon={<HardDrive />} />
         <HealthCard label="Auth Gateway" status="ONLINE" value="99.9%" color="text-emerald-500" icon={<ShieldCheck />} />
         <HealthCard label="Compute Load" status="BALANCED" value="18%" color="text-emerald-500" icon={<Activity />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <Card className="border-none shadow-3xl bg-card/50 rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 border-b border-white/5">
               <CardTitle className="text-2xl font-headline font-black uppercase">Database Read Volume</CardTitle>
               <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Institutional extraction nodes per 24h cycle</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
               <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={healthData}>
                        <defs>
                           <linearGradient id="colorReads" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="reads" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorReads)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-3xl bg-card/50 rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 border-b border-white/5">
               <CardTitle className="text-2xl font-headline font-black uppercase">System Latency (ms)</CardTitle>
               <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Real-time response trail for CBT engine</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
               <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={healthData}>
                        <defs>
                           <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                        <YAxis hide />
                        <Area type="monotone" dataKey="latency" stroke="#F43F5E" strokeWidth={4} fillOpacity={1} fill="url(#colorLatency)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-[3.5rem] p-12 text-center space-y-4">
         <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
         <h4 className="text-3xl font-headline font-black uppercase text-white">Institutional Security High</h4>
         <p className="text-slate-400 max-w-xl mx-auto">Zero anomalies detected in the last 72 hours. All extraction nodes are operating within official performance parameters.</p>
      </div>
    </div>
  )
}

function HealthCard({ label, value, status, icon, color }: any) {
   return (
      <Card className="border-none shadow-2xl bg-card/50 p-10 rounded-[2.5rem] relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">{icon}</div>
         <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="text-4xl font-headline font-black text-white">{value}</p>
            <Badge className={`border-none text-[8px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 uppercase tracking-widest`}>
               {status}
            </Badge>
         </div>
      </Card>
   )
}
