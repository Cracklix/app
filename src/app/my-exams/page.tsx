"use client"

import React, { useMemo, useEffect, useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useUser, useCollection, useFirestore } from "@/firebase"
import { collection, query, where, doc, updateDoc, arrayRemove, serverTimestamp } from "firebase/firestore"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, ChevronRight, Star, Plus, X, RefreshCw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

/**
 * @fileOverview Institutional My Exams Hub v15.0 (Restructured).
 * STRICT: Content-only visibility. Simplified language.
 */

export default function MyExamsPage() {
  const { user, profile, loading: userLoading } = useUser()
  const db = useFirestore()
  const router = useRouter()
  const { toast } = useToast()
  const [unpinningId, setUnpinningId] = useState<string | null>(null)

  useEffect(() => {
    if (!userLoading && !user) router.push("/login?returnUrl=/my-exams")
  }, [user, userLoading, router])

  const examsQuery = useMemo(() => (db ? collection(db, "exams") : null), [db])
  const mocksQuery = useMemo(() => (db ? collection(db, "mocks") : null), [db])
  const pyqsQuery = useMemo(() => (db ? collection(db, "pyqs") : null), [db])
  
  const { data: allExams, loading: examsLoading } = useCollection<any>(examsQuery)
  const { data: mocks } = useCollection<any>(mocksQuery)
  const { data: pyqs } = useCollection<any>(pyqsQuery)

  const statsMap = useMemo(() => {
    const map: Record<string, any> = {};
    (mocks || []).forEach(m => {
       const eids = m.examIds || (m.examId ? [m.examId] : []);
       eids.forEach((eid: string) => {
          if (!map[eid]) map[eid] = { full: 0, subject: 0, sectional: 0, pyq: 0, total: 0 };
          if (m.mockType === 'FULL') map[eid].full++;
          else if (m.mockType === 'SUBJECT') map[eid].subject++;
          else if (m.mockType === 'SECTIONAL') map[eid].sectional++;
          map[eid].total++;
       });
    });
    (pyqs || []).forEach(p => {
       if (p.examId) {
          if (!map[p.examId]) map[p.examId] = { full: 0, subject: 0, sectional: 0, pyq: 0, total: 0 };
          map[p.examId].pyq++;
          map[p.examId].total++;
       }
    });
    return map;
  }, [mocks, pyqs]);

  const pinnedExams = useMemo(() => {
    if (!allExams || !profile?.pinnedExams) return []
    return (allExams as any[]).filter((e: any) => profile.pinnedExams?.includes(e.id))
  }, [allExams, profile])

  const handleUnpin = async (examId: string) => {
    if (!db || !user || unpinningId) return;
    setUnpinningId(examId);
    try {
      await updateDoc(doc(db, "users", user.uid), { pinnedExams: arrayRemove(examId), updatedAt: serverTimestamp() });
      toast({ title: "Removed from list" });
    } finally { setUnpinningId(null); }
  };

  if (userLoading) return <div className="h-screen flex items-center justify-center bg-white"><Zap className="h-10 w-10 text-primary animate-spin" /></div>

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-body pb-safe text-left">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-7xl space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-black text-[#0F172A] leading-none">My Exams</h1>
              <p className="text-sm md:text-lg text-slate-600 font-medium">Your personalized preparation list.</p>
           </div>
           <Button asChild className="h-12 px-8 bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl gap-3"><Link href="/exams"><Plus className="h-4 w-4" /> Add Exams</Link></Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {examsLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-[2rem] bg-white" />) : 
           pinnedExams.length > 0 ? pinnedExams.map((exam: any) => {
              const s = statsMap[exam.id] || { full: 0, subject: 0, sectional: 0, pyq: 0, total: 0 };
              return (
               <Card key={exam.id} className="border border-[#E5E7EB] shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2rem] bg-white p-8 flex flex-col relative">
                  <div className="flex justify-between items-start mb-6">
                     <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner"><GraduationCap className="h-6 w-6 text-primary" /></div>
                     <button onClick={() => handleUnpin(exam.id)} disabled={unpinningId === exam.id} className="text-slate-300 hover:text-rose-500 transition-colors">
                        {unpinningId === exam.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                     </button>
                  </div>
                  <h4 className="font-black text-xl text-[#0F172A] leading-tight mb-6 flex-1">{exam.name}</h4>
                  <div className="space-y-1.5 mb-8">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400"><span>Full Mocks</span><span className={s.full > 0 ? "text-[#0F172A]" : "text-slate-200"}>{s.full}</span></div>
                      <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400"><span>Subject Tests</span><span className={s.subject > 0 ? "text-[#0F172A]" : "text-slate-200"}>{s.subject}</span></div>
                      <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400"><span>Official PYQs</span><span className={s.pyq > 0 ? "text-[#0F172A]" : "text-slate-200"}>{s.pyq}</span></div>
                  </div>
                  <Button onClick={() => router.push(`/exams/${exam.id}`)} className="w-full h-11 bg-[#0F172A] hover:bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-md border-none">Open Exam <ChevronRight className="h-3.5 w-3.5" /></Button>
               </Card>
              )
           }) : (
              <Card className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 bg-white/50 rounded-[2.5rem] opacity-30 italic font-black uppercase tracking-widest">Select exams to build your list.</Card>
           )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
