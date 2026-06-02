
"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Users, 
  TrendingUp, 
  Zap, 
  Database, 
  Calendar, 
  ArrowUpRight, 
  BarChart3, 
  ShieldCheck, 
  Clock,
  MapPin,
  Landmark
} from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from "recharts"

const chartData = [
  { day: "Mon", users: 420 },
  { day: "Tue", users: 580 },
  { day: "Wed", users: 890 },
  { day: "Thu", users: 760 },
  { day: "Fri", users: 1200 },
  { day: "Sat", users: 950 },
  { day: "Sun", users: 1400 },
]

export default function AdminAnalytics() {
  const db = useFirestore()
  
  const { data: users } = useCollection(useMemo(() => (db ? collection(db, "users") : null), [db]))
  const { data: mocks } = useCollection(useMemo(() => (db ? collection(db, "mocks") : null), [db]))

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-center">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Institutional Performance Engine</span>
           </div>
          <h1 className="text-4xl font-black font-headline text-primary uppercase tracking-tight">System Analytics</h1>
          <p className="text-muted-foreground mt-1">Growth oversight and student activity monitoring portal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <MetricCard label="Total Users" value={users?.length || "0"} trend="+24%" icon={<Users className="text-blue-400" />} />
         <MetricCard label="Mock Attempts" value="1.2M" trend="+15%" icon={<Zap className="text-primary" />} />
         <MetricCard label="Active Series" value={mocks?.length || "0"} trend="+2 today" icon={<Calendar className="text-emerald-400" />} />
         <MetricCard label="Avg. Accuracy" value="64%" trend="-2%" icon={<TrendingUp className="text-rose-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <Card className="lg:col-span-8 border-none shadow-2xl shadow-slate-900/10 rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-10 border-b border-slate-50">
               <CardTitle className="font-headline font-black text-2xl text-[#0F172A]">User Acquisition Trend</CardTitle>
               <CardDescription>Daily active registrations across all Punjab boards.</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
               <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={chartData}>
                        <defs>
                           <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 700}} />
                        <YAxis hide />
                        <Tooltip content={({active, payload}) => {
                           if (active && payload && payload.length) {
                              return <div className="bg-[#0F172A] text-white p-4 rounded-2xl shadow-3xl text-sm font-bold">{payload[0].value} New Signups</div>
                           }
                           return null
                        }} />
                        <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         <Card className="lg:col-span-4 border-none shadow-2xl shadow-slate-900/10 rounded-[2.5rem] bg-[#0F172A] text-white p-10 space-y-8">
            <h3 className="font-headline font-black text-xl flex items-center gap-3">
               <Landmark className="h-6 w-6 text-primary" /> Board Popularity
            </h3>
            <div className="space-y-6">
               <BoardProgress label="PSSSB" value={78} />
               <BoardProgress label="Punjab Police" value={92} />
               <BoardProgress label="PPSC" value={45} />
               <BoardProgress label="Teaching" value={65} />
               <BoardProgress label="High Court" value={32} />
            </div>
            <div className="pt-6 border-t border-white/5">
               <div className="flex items-center gap-3 text-emerald-500">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Platform Integrity Verified</span>
               </div>
            </div>
         </Card>
      </div>
    </div>
  )
}

function MetricCard({ label, value, trend, icon }: any) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl p-8 bg-white hover:translate-y-[-4px] transition-all">
       <div className="flex items-center justify-between mb-6">
          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
             {icon}
          </div>
          <div className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${trend.includes('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
             {trend}
          </div>
       </div>
       <p className="text-3xl font-headline font-black text-[#0F172A] tracking-tighter">{value}</p>
       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{label}</p>
    </Card>
  )
}

function BoardProgress({ label, value }: any) {
   return (
      <div className="space-y-2">
         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>{label}</span>
            <span>{value}% Activity</span>
         </div>
         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${value}%` }} />
         </div>
      </div>
   )
}
