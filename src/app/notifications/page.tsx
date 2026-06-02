
"use client"

import { useMemo } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, CheckCircle2, AlertCircle, TrendingUp, FileText, ChevronRight, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
  const db = useFirestore()
  
  const noticeQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "notifications"), orderBy("createdAt", "desc"))
  }, [db])

  const { data: notices, loading } = useCollection<any>(noticeQuery)

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-headline font-black text-[#0F172A] tracking-tight uppercase">Exam Alerts</h1>
              <p className="text-slate-500 font-medium">Real-time updates from Punjab recruitment boards (PSSSB, PPSC, Police).</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Feed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))
            ) : notices && notices.length > 0 ? (
              notices.map((n) => (
                <Card key={n.id} className="border-none shadow-lg shadow-slate-200/50 bg-white hover:shadow-xl transition-all duration-300 rounded-2xl group cursor-pointer overflow-hidden">
                  <CardContent className="p-0 flex items-stretch">
                    <div className={`w-2 ${n.type === 'result' ? 'bg-emerald-500' : n.type === 'alert' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                    <div className="p-6 flex-1 flex gap-6 items-center">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                        n.type === 'result' ? 'bg-emerald-50 text-emerald-500' : 
                        n.type === 'alert' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
                      }`}>
                        {n.type === 'result' ? <TrendingUp className="h-6 w-6" /> : 
                         n.type === 'alert' ? <AlertCircle className="h-6 w-6" /> : <Bell className="h-6 w-6" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <Badge className="bg-slate-100 text-slate-500 border-none text-[9px] font-black uppercase px-2 py-0.5">{n.board || 'Official'}</Badge>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{n.time}</span>
                           </div>
                           {n.important && <Badge className="bg-rose-500 text-white border-none text-[8px] font-black animate-bounce">Crucial</Badge>}
                        </div>
                        <h4 className="font-bold text-lg text-[#0F172A] group-hover:text-primary transition-colors">{n.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-1">{n.message}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="h-5 w-5 text-slate-300" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white rounded-[2rem] border-2 border-dashed">
                <Bell className="h-12 w-12 mb-4 opacity-10" />
                <p className="font-bold uppercase tracking-widest text-xs">No active alerts found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
