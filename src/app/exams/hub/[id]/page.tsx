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
import { ChevronLeft, ChevronRight, GraduationCap, Zap, BookOpen, Layers, Shield, Loader2, FileText, Landmark, ShieldCheck, Scale, Star, CheckCircle2, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { getAuthorityIcon } from "@/lib/exam-icons"

/**
 * @fileOverview Institutional Hub Explorer v16.1 (Logo Size Hardened).
 * FIXED: Reduced hero logo to 64px and card logos to 40px for balanced hierarchy.
 */

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

  const { data: exams, loading: examsLoading } = useCollection<any>(examsQuery);
  const { data: categories } = useCollection<any>(useMemo(() => (db ? collection(db, "categories") : null), [db]));
  const { data: mocks } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]));

  const statsMap = useMemo(() => {
    if (!mocks) return {};
    const map: Record<string, any> = {};
    mocks.forEach(m => {
      const eids = m.examIds || (m.examId ? [m.examId] : []);
      eids.forEach((eid: string) => {
        if (!map[eid]) map[eid] = { full: 0, subject: 0, pyq: 0, sectional: 0 };
        const type = m.mockType;
        if (type === 'FULL') map[eid].full++;
        else if (type === 'SUBJECT') map[eid].subject++;
        else if (type === 'PYQ') map[eid].pyq++;
        else if (type === 'SECTIONAL') map[eid].sectional++;
      });
    });
    return map;
  }, [mocks]);

  const handleTogglePin = async (e: React.MouseEvent, examId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!db || !user || pinningId) return;
    
    setPinningId(examId);
    const isPinned = profile?.pinnedExams?.includes(examId);
    const userRef = doc(db, "users", user.uid);

    try {
      if (isPinned) {
        await updateDoc(userRef, { pinnedExams: arrayRemove(examId), updatedAt: serverTimestamp() });
        toast({ title: "Removed from Hub" });
      } else {
        await updateDoc(userRef, { pinnedExams: arrayUnion(examId), updatedAt: serverTimestamp() });
        toast({ title: "Pinned to Hub" });
      }
    } catch (err) {
      console.error("[PINNING_FAILURE]:", err);
      toast({ variant: "destructive", title: "Action Failed" });
    } finally {
      setPinningId(null);
    }
  };

  if (hubLoading) return <div className="h-screen bg-white flex flex-col items-center justify-center space-y-6"><Zap className="h-10 w-10 text-primary animate-pulse" /><p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Loading Registry...</p></div>;

  return (
    <div className="min-h-screen bg-slate-50/50 font-body text-left">
      <Navbar />
      
      <section className="bg-white border-b border-slate-100 py-10 md:py-12 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-12 opacity-[0.01]"><GraduationCap className="h-32 w-32 md:h-48 md:w-48" /></div>
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <button onClick={() => router.back()} className="h-9 w-9 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-black mb-6 transition-all active:scale-90">
               <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-10">
               <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-slate-50 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden shrink-0 relative">
                  {hub?.iconUrl && !failedImages['hub'] ? (
                    <Image 
                      src={hub.iconUrl} 
                      alt="Logo" 
                      fill
                      sizes="64px"
                      className="object-contain p-2.5" 
                      referrerPolicy="no-referrer" 
                      onError={() => setFailedImages(p => ({...p, 'hub': true}))} 
                    />
                  ) : (
                    <div className="p-2.5 w-full h-full opacity-40">
                      {getAuthorityIcon(hub?.id, hub?.abbreviation)}
                    </div>
                  )}
               </div>
               
               <div className="space-y-4 text-center lg:text-left min-w-0">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                     <Badge className="bg-primary/5 text-primary border-none font-black px-3 py-0.5 rounded-lg text-[8px] tracking-widest uppercase">
                       {hub?.abbreviation} CENTER
                     </Badge>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0F172A] leading-none tracking-tight break-words antialiased uppercase">
                      {hub?.abbreviation || hub?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-sm md:text-xl font-bold text-slate-400 leading-tight tracking-tight max-w-4xl">
                       {hub?.name}
                    </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
         {examsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[200px] w-full rounded-[2rem]" />)}
            </div>
         ) : exams && exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
               {exams.map((exam) => {
                  const stats = statsMap[exam.id] || { full: 0, subject: 0, pyq: 0, sectional: 0 };
                  const category = categories?.find((c: any) => c.id === exam.categoryId);
                  const effectiveLogo = exam.iconUrl || hub?.iconUrl || category?.iconUrl;
                  const isPinned = profile?.pinnedExams?.includes(exam.id);

                  return (
                    <Card key={exam.id} onClick={() => router.push(`/exams/${exam.id}`)} className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] bg-white group overflow-hidden h-full flex flex-col p-6 md:p-8 text-left cursor-pointer">
                       <div className="flex justify-between items-start mb-6">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden">
                             {effectiveLogo && !failedImages[exam.id] ? (
                                <Image 
                                   src={effectiveLogo} 
                                   alt="Logo" 
                                   fill
                                   sizes="40px"
                                   className="object-contain p-2" 
                                   referrerPolicy="no-referrer" 
                                   onError={() => setFailedImages(p => ({ ...p, [exam.id]: true }))} 
                                />
                             ) : (
                               <div className="p-2 w-full h-full opacity-20">
                                 {getAuthorityIcon(hub?.id, hub?.abbreviation)}
                               </div>
                             )}
                          </div>
                          <button 
                            onClick={(e) => handleTogglePin(e, exam.id)}
                            disabled={pinningId === exam.id}
                            className={cn(
                              "h-9 w-9 rounded-xl border flex items-center justify-center transition-all active:scale-90 z-20",
                              isPinned ? "bg-primary border-primary text-white" : "bg-white border-slate-100 text-slate-300 hover:text-primary hover:border-primary/20"
                            )}
                          >
                             {pinningId === exam.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : isPinned ? <CheckCircle2 className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                          </button>
                       </div>

                       <div className="space-y-2 flex-1">
                          <h3 className="text-xl font-black text-[#0F172A] leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase">{exam.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stats.full + stats.subject + stats.pyq + stats.sectional} PREPARATION NODES</p>
                       </div>

                       <div className="mt-6 md:mt-8">
                          <Button variant="ghost" className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest gap-2 group-hover:bg-primary transition-all border-none shadow-lg">
                             OPEN HUB <ChevronRight className="h-4 w-4" />
                          </Button>
                       </div>
                    </Card>
                  )
               })}
            </div>
         ) : (
            <div className="py-24 text-center opacity-20 flex flex-col items-center">
               <Layers className="h-16 w-16 mb-4" />
               <p className="font-headline font-black text-xl uppercase tracking-widest">No Exam Verticals Registered</p>
            </div>
         )}
      </main>
      <Footer />
    </div>
  )
}
