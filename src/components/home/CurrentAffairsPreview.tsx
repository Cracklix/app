'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Calendar, ChevronRight, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthorityLogo } from '@/lib/exam-icons';

export default function CurrentAffairsPreview() {
  const db = useFirestore();
  
  const hubQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, "current_affairs_hub"), 
      where("status", "==", "PUBLISHED"),
      limit(3)
    );
  }, [db]);

  const { data: items, loading } = useCollection<any>(hubQuery);

  return (
    <section className="py-12 md:py-24 bg-slate-50/50 border-t border-slate-100 overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-16 text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-1">
           <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <AuthorityLogo boardId="current-affairs" size="sm" className="bg-transparent shadow-none p-0 shrink-0" />
                 <span className="text-[9px] font-bold text-slate-400 tracking-tight uppercase">Study Material</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-none">Current Affairs</h2>
              <p className="text-slate-500 font-medium text-sm md:text-lg">Daily bilingual updates verified for Punjab recruitments.</p>
           </div>
           <Link href="/current-affairs" className="text-blue-600 font-black uppercase text-[9px] md:text-xs tracking-widest hover:underline flex items-center gap-2 group shrink-0">
              View All <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
           </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 gap-4 md:grid md:grid-cols-3 md:mx-0 md:px-0 md:gap-10 pb-4">
           {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="flex-shrink-0 w-[85vw] max-w-[330px] h-[450px] md:w-auto md:max-w-none md:h-80 rounded-2xl bg-white" />)
           ) : items?.map((item) => (
              <div 
                key={item.id}
                className="flex-shrink-0 w-[85vw] max-w-[330px] h-[450px] md:w-auto md:max-w-none md:h-full snap-start"
              >
                 <Link href="/current-affairs" className="h-full block">
                    <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[1.5rem] md:rounded-[2.5rem] bg-white group overflow-hidden h-full flex flex-col p-6 md:p-12">
                       <div className="flex justify-between items-start mb-6 md:mb-10">
                          <Badge variant="outline" className="bg-slate-50 border-slate-100 text-slate-400 text-[7px] md:text-[9px] font-black px-2 py-1 rounded-lg uppercase">CA Hub</Badge>
                          <span className="text-[8px] md:text-[10px] font-bold text-slate-300 tracking-tight flex items-center gap-1.5 uppercase">
                             <Calendar className="h-3.5 w-3.5 text-blue-600/50" /> {item.month} {item.year}
                          </span>
                       </div>
                       <h3 className="text-base md:text-2xl font-black text-[#0F172A] leading-tight group-hover:text-blue-600 transition-colors flex-1 mb-6 uppercase tracking-tight line-clamp-3">
                          {item.title}
                       </h3>
                       <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                          <span className="text-[8px] md:text-[11px] font-black text-[#0F172A] tracking-widest flex items-center gap-2 uppercase">
                             <Zap className="h-3.5 w-3.5 text-blue-600 fill-current" /> Read Now
                          </span>
                          <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-blue-600 transition-all" />
                       </div>
                    </Card>
                 </Link>
              </div>
           ))}
        </div>
      </div>
    </section>
  );
}
