'use client';

import { useMemo, useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useDoc, useCollection, useFirestore, useUser } from "@/firebase"
import { collection, query, where, doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, GraduationCap, Zap, BookOpen, Layers, Shield, Loader2, FileText, Landmark, ShieldCheck, Scale, Star, CheckCircle2, RefreshCw, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { getAuthorityIcon } from "@/lib/exam-icons"

/**
 * @fileOverview Institutional Exam Hub v46.0 (Strictly Cleaned).
 * RULE: Hide exams with 0 content. Standardized "Open Exam" language.
 */

const ACRONYMS = ["PSSSB", "PPSC", "CTET", "PSTET", "PSPCL", "PSTCL", "SSAPB"];

function formatTitle(name: string) {
  if (!name) return "";
  return name.split(' ').map(word => {
    const upper = word.toUpperCase();
    if (ACRONYMS.includes(upper)) return upper;
    return word;
  }).join(' ');
}

export default function HubExamsPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { user, profile } = useUser();
  const { toast } = useToast();
  const hubId = params.id as string;
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [pinningId, setPinningId] = useState<string | null>(null);

  const { data: hub, loading: hubLoading } = useDoc<any>(useMemo(() => (db ? doc(db, "boards", hubId) : null), [db, hubId]));
  
  const examsQuery = useMemo(() => {
     if (!db || !hub) return null;
     return query(collection(db, "exams"), where("boardId", "in", [hub.id, hub.abbreviation]));
  }, [db, hub]);

  const { data: rawExams, loading: examsLoading } = useCollection<any>(examsQuery);
  const { data: mocks } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]));
  const { data: pyqs } = useCollection<any>(useMemo(() => (db ? collection(db, "pyqs") : null), [db]));

  const statsMap = useMemo(() => {
    const map: Record<string, any> = {};
    (mocks || []).forEach(m => {
      const eids = m.examIds || (m.examId ? [m.examId] : []);
      eids.forEach((eid: string) => {
        if (!map[eid]) map[eid] = { full: 0, subject: 0, sectional: 0, pyq: 0, total: 0 };
        const type = m.mockType;
        if (type === 'FULL') map[eid].full++;
        else if (type === 'SUBJECT') map[eid].subject++;
        else if (type === 'SECTIONAL') map[eid].sectional++;
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

  // STRICT FILTER: Only show exams with content
  const exams = useMemo(() => {
    if (!rawExams) return [];
    return rawExams.filter((e: any) => (statsMap[e.id]?.total || 0) > 0);
  }, [rawExams, statsMap]);

  const handleTogglePin = async (e: React.MouseEvent, examId: string) => {
    e.preventDefault(); e.stopPropagation();
    if (!db || !user || pinningId) return;
    setPinningId(examId);
    const isPinned = profile?.pinnedExams?.includes(examId);
    const userRef = doc(db, "users", user.uid);
    try {
      if (isPinned) await updateDoc(userRef, { pinnedExams: arrayRemove(examId), updatedAt: serverTimestamp() });
      else await updateDoc(userRef, { pinnedExams: arrayUnion(examId), updatedAt: serverTimestamp() });
      toast({ title: isPinned ? "Removed from My Exams" : "Added to My Exams" });
    } finally { setPinningId(null); }
  };

  if (hubLoading) return <div className="h-screen bg-white flex flex-col items-center justify-center space-y-4"><Zap className="h-8 w-8 text-primary animate-pulse" /><p className="text-[10px] font-black uppercase text-slate-300">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-slate-50/50 font-body text-left">
      <Navbar />
      <section className="bg-white border-b border-slate-100 py-10 md:py-12 overflow-hidden relative">
         <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <button onClick={() => router.back()} className="h-9 w-9 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-black mb-6 transition-all active:scale-90"><ChevronLeft className="h-4 w-4" /></button>
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
               <div className="h-14 w-14 rounded-2xl bg-slate-50 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden shrink-0 relative">
                  {hub?.iconUrl && !failedImages['hub'] ? (
                    <Image src={hub.iconUrl} alt="Logo" fill sizes="64px" className="object-contain p-2" referrerPolicy="no-referrer" onError={() => setFailedImages(p => ({...p, 'hub': true}))} />
                  ) : (
                    <div className="p-2 w-full h-full opacity-40">{getAuthorityIcon(hub?.id, hub?.abbreviation)}</div>
                  )}
               </div>
               <div className="space-y-2 text-center lg:text-left min-w-0">
                  <Badge className="bg-primary/5 text-primary border-none font-black px-2.5 py-0.5 rounded-lg text-[8px] tracking-widest uppercase">{hub?.abbreviation} Exams</Badge>
                  <h1 className="text-2xl md:text-5xl font-black text-[#0F172A] leading-tight tracking-tight">{formatTitle(hub?.abbreviation || hub?.name)}</h1>
                  <p className="text-sm md:text-lg font-bold text-slate-500 leading-tight">{hub?.name}</p>
               </div>
            </div>
         </div>
      </section>

      <main className="container mx-auto px-4 py-12 max-w-7xl">
         {examsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-2xl bg-white" />)}</div>
         ) : exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {exams.map((exam) => {
                  const s = statsMap[exam.id] || { full: 0, subject: 0, sectional: 0, pyq: 0, total: 0 };
                  const isPinned = profile?.pinnedExams?.includes(exam.id);
                  return (
                    <Card key={exam.id} onClick={() => router.push(`/exams/${exam.id}`)} className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[1.5rem] bg-white group overflow-hidden h-full flex flex-col p-6 md:p-8 text-left cursor-pointer">
                       <div className="flex justify-between items-start mb-6">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden">
                             <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                          <button onClick={(e) => handleTogglePin(e, exam.id)} disabled={pinningId === exam.id} className={cn("h-8 w-8 rounded-lg border flex items-center justify-center transition-all active:scale-90", isPinned ? "bg-primary border-primary text-white" : "bg-white border-slate-100 text-slate-300")}>
                             {pinningId === exam.id ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : isPinned ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}
                          </button>
                       </div>
                       <div className="space-y-4 flex-1">
                          <h3 className="text-xl font-black text-[#0F172A] leading-tight group-hover:text-primary transition-colors">{exam.name}</h3>
                          <div className="flex flex-wrap items-center gap-1.5 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                             <span>{s.full} Full Mocks</span> <span className="opacity-30">•</span> 
                             <span>{s.subject} Subject</span> <span className="opacity-30">•</span> 
                             <span>{s. sectional} Sectional</span> <span className="opacity-30">•</span> 
                             <span>{s.pyq} PYQs</span>
                          </div>
                       </div>
                       <div className="mt-8">
                          <Button variant="ghost" className="w-full h-11 rounded-xl bg-[#0F172A] hover:bg-primary text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-md border-none">Open Exam <ChevronRight className="h-3.5 w-3.5" /></Button>
                       </div>
                    </Card>
                  )
               })}
            </div>
         ) : (
            <div className="py-32 text-center opacity-20 flex flex-col items-center gap-4">
               <Layers className="h-16 w-16" />
               <p className="font-headline font-black text-2xl uppercase tracking-widest">No Active Exams</p>
            </div>
         )}
      </main>
      <Footer />
    </div>
  )
}
