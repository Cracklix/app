
'use client';

import React, { useMemo } from 'react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, History, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * @fileOverview High-Fidelity "Continue Learning" Hub v3.0.
 * UPDATED: Strictly matched to user screenshot with "MASTERY INDEX" and large orange action nodes.
 */

export default function ContinueLearning() {
  const { user } = useUser();
  const db = useFirestore();

  // STABILIZED LIVE STATUS FETCHING
  const resultsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, "results"), where("userId", "==", user.uid), limit(2));
  }, [db, user]);

  const { data: recentAttempts, loading } = useCollection<any>(resultsQuery);

  if (!user || loading || !recentAttempts || recentAttempts.length === 0) return null;

  return (
    <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center gap-3">
         <History className="h-6 w-6 text-primary" />
         <h2 className="text-2xl md:text-3xl font-headline font-black text-[#0F172A] uppercase tracking-widest">CONTINUE LEARNING</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {recentAttempts.map((res: any) => (
            <Card key={res.id} className="border-none shadow-5xl rounded-[3rem] bg-[#0B1528] text-white p-8 md:p-12 overflow-hidden relative group">
               {/* Institutional Watermark */}
               <div className="absolute bottom-0 right-0 p-8 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                  <Trophy className="h-48 w-48" />
               </div>

               <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 md:gap-12">
                  {/* Lightning Bolt Node */}
                  <div className="h-20 w-20 md:h-24 md:w-24 rounded-[2rem] bg-[#1A2536] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                     <Zap className="h-10 w-10 md:h-12 md:w-12 text-primary fill-current" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-6 text-center sm:text-left">
                     <div className="space-y-1">
                        <p className="text-primary font-black text-[12px] md:text-[14px] uppercase tracking-[0.4em] leading-none">RESUME</p>
                        <h3 className="text-xl md:text-3xl font-black uppercase text-white/90 truncate tracking-tight">{res.mockTitle}</h3>
                     </div>

                     <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10">
                        <Button asChild className="h-16 px-10 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-3xl shadow-primary/20 transition-all active:scale-95 border-none">
                           <Link href={`/results/${res.mockId}`}>REVIEW RESULT <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>

                        <div className="flex items-center gap-4 text-left">
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">MASTERY</span>
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 leading-none">INDEX</span>
                           </div>
                           <span className="text-2xl md:text-3xl font-black text-primary tabular-nums">{res.accuracy}%</span>
                        </div>
                     </div>
                  </div>
               </div>
            </Card>
         ))}
      </div>
    </section>
  );
}
