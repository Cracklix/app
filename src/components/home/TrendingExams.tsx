
'use client';

import React, { useMemo, useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, limit, where } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, GraduationCap, ChevronRight, Zap, Sparkles, Landmark, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * @fileOverview High-Fidelity Trending Grid v6.0.
 * UPDATED: Replaced difficult words with easy ones (Hubs -> Exams).
 */

export default function TrendingExams() {
  const db = useFirestore();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  
  // 1. Real-time listener for trending exams
  const examsQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, "exams"), 
      where("isTrending", "==", true), 
      limit(4)
    );
  }, [db]);

  const boardsQuery = useMemo(() => (db ? collection(db, "boards") : null), [db]);

  const { data: exams, loading } = useCollection<any>(examsQuery);
  const { data: boards } = useCollection<any>(boardsQuery);

  // If no exams are marked as trending, hide the section entirely
  if (!loading && (!exams || exams.length === 0)) return null;

  return (
    <section className="space-y-10 text-left">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-rose-500" />
            <h2 className="text-2xl md:text-4xl font-headline font-black text-[#0F172A] uppercase tracking-widest leading-none">POPULAR EXAMS</h2>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
         {loading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" />)
         ) : exams?.map((exam: any, idx: number) => {
            const board = boards?.find((b: any) => b.id === exam.boardId || b.abbreviation === exam.boardId);
            const logoUrl = exam.iconUrl || board?.iconUrl;
            const isPolice = (board?.id || "").toLowerCase().includes('police') || (exam.name || "").toLowerCase().includes('police');
            const isImgFailed = failedImages[exam.id];

            return (
               <motion.div 
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
               >
                  <Link href={`/exams/${exam.id}`}>
                     <Card className="border-none shadow-xl hover:shadow-4xl rounded-[2.5rem] bg-white p-8 md:p-10 flex flex-col items-center text-center transition-all hover:translate-y-[-8px] group border border-slate-100 h-full">
                        <div className="relative mb-6">
                           <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-slate-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform overflow-hidden">
                              {logoUrl && !isImgFailed ? (
                                 <img 
                                    src={logoUrl} 
                                    className={cn("h-full w-full object-contain p-2 transition-all duration-500", isPolice && "scale-125")} 
                                    alt="Logo" 
                                    referrerPolicy="no-referrer"
                                    onError={() => setFailedImages(p => ({ ...p, [exam.id]: true }))}
                                 />
                              ) : (
                                 isPolice ? <ShieldCheck className="h-8 w-8 text-primary" /> : <GraduationCap className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
                              )}
                           </div>
                        </div>
                        
                        <div className="space-y-4 flex-1">
                           <Badge className="bg-rose-50 text-rose-500 border-none text-[8px] font-black uppercase px-2 py-0.5 animate-pulse">TRENDING</Badge>
                           <h3 className="text-lg md:text-xl font-black text-[#0F172A] uppercase leading-tight tracking-tight">{exam.name}</h3>
                        </div>

                        <div className="mt-8 flex items-center gap-2 text-[9px] font-black uppercase text-primary tracking-widest group-hover:gap-4 transition-all">
                           <Zap className="h-3.5 w-3.5 fill-current" /> VIEW EXAM <ChevronRight className="h-3 w-3" />
                        </div>
                     </Card>
                  </Link>
               </motion.div>
            );
         })}
      </div>
    </section>
  );
}
