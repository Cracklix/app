"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Zap, Info, Landmark, GraduationCap, Building2, HeartPulse, Scale, Globe } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Flattened Exam Explorer v30.0.
 * UPDATED: Enforced strict visibility - hidden if totalContent === 0.
 */

const CATEGORY_ICONS: Record<string, any> = {
  "Punjab Government Exams": <Landmark className="h-8 w-8" />,
  "Punjab Teaching Exams": <GraduationCap className="h-8 w-8" />,
  "Punjab Technical Exams": <Zap className="h-8 w-8" />,
  "Banking Exams": <Building2 className="h-8 w-8" />,
  "Medical & Health Exams": <HeartPulse className="h-8 w-8" />,
  "Judiciary Exams": <Scale className="h-8 w-8" />,
  "Central Government Exams": <Globe className="h-8 w-8" />
};

export default function CategoryHubsPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const catId = params.id as string;

  const { data: categories } = useCollection<any>(useMemo(() => (db ? collection(db, "categories") : null), [db]));
  const category = categories?.find(c => c.id === catId);

  const examsQuery = useMemo(() => (db ? query(collection(db, "exams"), where("categoryId", "==", catId)) : null), [db, catId]);
  const { data: rawExams, loading: examsLoading } = useCollection<any>(examsQuery);
  
  const { data: mocks } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]));
  const { data: pyqs } = useCollection<any>(useMemo(() => (db ? collection(db, "pyqs") : null), [db]));

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

  // CONTENT-FIRST VISIBILITY: Hide exams with 0 content
  const exams = useMemo(() => {
    if (!rawExams) return [];
    return rawExams.filter((e: any) => (statsMap[e.id]?.total || 0) > 0);
  }, [rawExams, statsMap]);

  return (
    <div className="min-h-screen bg-slate-50/50 font-body text-left">
      <Navbar />
      
      <section className="bg-white border-b border-slate-100 py-12 md:py-20 relative overflow-hidden">
         <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <button onClick={() => router.back()} className="h-10 w-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-black mb-8 transition-all">
               <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-6">
               <div className="h-16 w-16 md:h-20 md:w-20 rounded-[2rem] bg-primary/5 text-primary flex items-center justify-center shrink-0 shadow-inner">
                  {CATEGORY_ICONS[category?.title || ""] || <Landmark className="h-8 w-8" />}
               </div>
               <div className="space-y-1">
                  <h1 className="text-3xl md:text-5xl font-black text-[#0F172A] leading-tight tracking-tight">
                     {category?.title || "Exam Category"}
                  </h1>
                  <p className="text-sm md:text-xl font-bold text-slate-400 tracking-tight max-w-3xl">
                     {category?.description || "Select an exam to begin preparation."}
                  </p>
               </div>
            </div>
         </div>
      </section>

      <main className="container mx-auto px-4 py-16 max-w-7xl">
         {examsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-[2.5rem]" />)}
            </div>
         ) : exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {exams.map((exam) => {
                  const s = statsMap[exam.id] || { full: 0, subject: 0, sectional: 0, pyq: 0, total: 0 };
                  return (
                    <Card key={exam.id} onClick={() => router.push(`/exams/${exam.id}`)} className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white group overflow-hidden h-full flex flex-col p-8 text-left cursor-pointer">
                       <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center mb-6 text-primary shadow-inner">
                          <Zap className="h-5 w-5" />
                       </div>
                       <h3 className="text-xl font-black text-[#0F172A] leading-tight group-hover:text-primary transition-colors mb-6">{exam.name}</h3>
                       <div className="space-y-4 mb-8">
                          <p className="text-xs font-black text-primary leading-none uppercase">{s.total} Tests Available</p>
                          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                             {s.full > 0 && <span>{s.full} Full Mocks • </span>}
                             {s.subject > 0 && <span>{s.subject} Subject Tests • </span>}
                             {s.sectional > 0 && <span>{s.sectional} Sectional • </span>}
                             {s.pyq > 0 && <span>{s.pyq} PYQs</span>}
                          </div>
                       </div>
                       <Button className="mt-auto w-full h-12 rounded-2xl bg-[#0F172A] hover:bg-primary text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg border-none">
                          Open Exam <ChevronRight className="ml-2 h-4 w-4" />
                       </Button>
                    </Card>
                  )
               })}
            </div>
         ) : (
            <div className="py-40 text-center opacity-20 flex flex-col items-center gap-6">
               <Info className="h-16 w-16" />
               <p className="font-black text-2xl uppercase tracking-widest">No Active Exams</p>
               <p className="text-sm font-bold max-w-xs">Content is being verified for this category node.</p>
            </div>
         )}
      </main>
      <Footer />
    </div>
  )
}
