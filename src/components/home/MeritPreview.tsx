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

export default function MeritPreview() {
  const db = useFirestore();
  
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const resultsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "results"), orderBy("score", "desc"), limit(50));
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
    return Array.from(uniqueMap.values()).sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 10);
  }, [results]);

  return (
    <section className="py-12 md:py-24 bg-slate-50/50 border-t border-slate-100 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8 md:space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-1">
           <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <Trophy className="h-5 w-5 md:h-8 md:w-8 text-primary shrink-0" />
                 <h2 className="text-xl md:text-5xl font-black text-[#0F172A] tracking-tight leading-none">Hall of Rankers</h2>
              </div>
              <p className="text-sm md:text-lg font-medium text-slate-500">Real-time merit hub for every Punjab aspirant.</p>
           </div>
           <Button asChild variant="ghost" className="text-primary font-bold text-base tracking-tight gap-2 group shrink-0">
              <Link href="/leaderboard" className="flex items-center gap-2">View Full List <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
           </Button>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:mx-0 md:px-0 scroll-smooth pb-4">
           {resultsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="flex-shrink-0 min-w-[260px] h-32 rounded-[2rem] bg-white" />)
           ) : topRankers.map((res, i) => {
              const name = (res.userName && res.userName !== 'Aspirant' && !res.userName.includes('@')) ? res.userName : (res.userEmail?.split('@')[0] || "Aspirant");
              return (
                 <div key={res.id} className="flex-shrink-0 min-w-[280px] md:min-w-0 snap-start">
                    <Card className="border border-slate-100 shadow-xl rounded-[2.5rem] bg-white p-6 hover:shadow-2xl transition-all group overflow-hidden">
                       <div className="flex items-center gap-5 relative z-10">
                          <div className="relative">
                             <StudentAvatar profile={{ name, gender: res.gender }} className="h-14 w-14 md:h-18 md:w-18 rounded-2xl border-2 border-slate-50 shadow-md" />
                             <div className={cn("absolute -bottom-1 -right-1 h-7 w-7 rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-lg border-2 border-white", i === 0 ? "bg-amber-400" : i === 1 ? "bg-slate-300" : "bg-orange-400")}>
                                {i + 1}
                             </div>
                          </div>
                          <div className="min-w-0">
                             <p className="font-black text-base md:text-lg text-[#0F172A] uppercase truncate">{name}</p>
                             <p className="text-[11px] font-bold text-slate-400 uppercase truncate mt-1">Score: {res.score}</p>
                             <Badge className="bg-emerald-50 text-emerald-600 border-none text-[11px] font-black mt-2 px-3 py-0.5 rounded-full">Rank {i + 1}</Badge>
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
