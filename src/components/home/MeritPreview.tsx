'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore, useDoc } from '@/firebase';
import { collection, query, limit, doc, orderBy } from 'firebase/firestore';
import { Trophy, ChevronRight, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import StudentAvatar from '@/components/brand/StudentAvatar';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

/**
 * @fileOverview Institutional Merit Hub v19.0 - 4-Item Visible Scroll.
 * UPDATED: Horizontal scroll for mobile showing top 10, with 4 visible at start.
 */
export default function MeritPreview() {
  const db = useFirestore();
  
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const resultsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "results"), orderBy("score", "desc"), limit(40));
  }, [db]);

  const { data: results, loading: resultsLoading } = useCollection<any>(resultsQuery);

  const topRankers = useMemo(() => {
    if (!results) return [];
    const uniqueMap = new Map();
    results.forEach(res => {
      if (!uniqueMap.has(res.userId) || uniqueMap.get(res.userId).score < res.score) {
        uniqueMap.set(res.userId, res);
      }
    });
    // Show top 10 to enable scrolling beyond the top 4
    return Array.from(uniqueMap.values()).sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 10);
  }, [results]);

  return (
    <section className="py-8 md:py-24 bg-slate-50/50 border-t border-slate-100 overflow-hidden">
      <div className="max-w-[1440px] mx-auto container-px text-left space-y-6 md:space-y-16">
        
        {/* Header Hub */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 px-1">
           <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <Trophy className="h-5 w-5 md:h-8 md:w-8 text-primary shrink-0" />
                 <h2 className="text-[22px] md:text-5xl font-black text-[#0F172A] tracking-tight leading-none">Hall of Rankers</h2>
              </div>
              <p className="text-[12px] md:text-xl font-medium text-slate-500">Real-time merit hub for every Punjab aspirant.</p>
           </div>
           <Button asChild variant="ghost" className="text-primary font-bold text-[11px] md:text-base tracking-tight gap-2 group shrink-0 p-0 h-auto">
              <Link href="/leaderboard" className="flex items-center gap-2">View Full List <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></Link>
           </Button>
        </div>

        {/* Merit Horizontal Scroll - 4 Visible on Mobile */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 gap-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-10">
           {resultsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="flex-shrink-0 w-[23%] h-24 md:h-32 md:w-full rounded-xl bg-white" />)
           ) : topRankers.map((res, i) => {
              const name = (res.userName && res.userName !== 'Aspirant' && !res.userName.includes('@')) ? res.userName : (res.userEmail?.split('@')[0] || "Aspirant");
              const cleanName = name.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

              return (
                 <div key={res.id} className="flex-shrink-0 w-[23%] md:w-full snap-start">
                    <Card className="border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-white p-2 md:p-8 h-full flex flex-col justify-center rounded-xl md:rounded-[3rem]">
                       <div className="flex flex-col items-center text-center space-y-1.5 md:space-y-4">
                          <div className="relative shrink-0">
                             <StudentAvatar profile={{ name: cleanName, gender: res.gender }} className="h-8 w-8 md:h-20 md:w-20 rounded-lg md:rounded-3xl border border-slate-50 shadow-inner group-hover:scale-110 transition-transform" />
                             <div className={cn(
                                "absolute -bottom-1 -right-1 h-4 w-4 md:h-8 md:w-8 rounded-md md:rounded-lg flex items-center justify-center text-white text-[7px] md:text-xs font-black shadow-lg border border-white transition-all",
                                i === 0 ? "bg-amber-400" : i === 1 ? "bg-slate-300" : "bg-orange-400"
                             )}>
                                {i + 1}
                             </div>
                          </div>
                          <div className="min-w-0 w-full">
                             <p className="font-black text-[9px] md:text-2xl text-[#0F172A] truncate leading-none">{cleanName}</p>
                             <div className="flex flex-col items-center mt-1">
                                <p className="text-[7px] md:text-sm font-bold text-slate-400 leading-none">Score: {Math.round(res.score)}</p>
                             </div>
                          </div>
                       </div>
                    </Card>
                 </div>
              )
           })}
        </div>
      </div>
    </section>
  );
}
