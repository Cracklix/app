'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Calendar, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthorityLogo } from '@/lib/exam-icons';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

/**
 * @fileOverview Universal Responsive Current Affairs Preview v10.0.
 * SCALING: Mobile (1) -> Tablet (2) -> Desktop (4).
 */
export default function CurrentAffairsPreview() {
  const db = useFirestore();
  
  const hubQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, "current_affairs_hub"), 
      where("status", "==", "PUBLISHED"),
      limit(4)
    );
  }, [db]);

  const { data: items, loading } = useCollection<any>(hubQuery);

  return (
    <section className="py-10 md:py-24 bg-slate-50/50 border-t border-slate-100">
      <div className="max-w-[1440px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-16">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-left">
           <div className="space-y-2">
              <div className="flex items-center gap-3 md:gap-4">
                 <div className="h-8 w-8 md:h-12 md:w-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary shadow-inner shrink-0">
                    <AuthorityLogo boardId="current-affairs" size="sm" className="bg-transparent shadow-none p-0" />
                 </div>
                 <h2 className="text-[clamp(24px,4vw,40px)] font-black tracking-tight leading-none text-[#0F172A]">Current Affairs</h2>
              </div>
              <p className="max-w-2xl text-[clamp(13px,1.5vw,18px)] font-medium text-slate-500">Daily verified updates curated for all Punjab recruitment boards.</p>
           </div>
           <Link href="/current-affairs" className="text-primary font-bold text-[13px] md:text-base tracking-tight hover:underline flex items-center gap-2 group shrink-0">
              View All Updates <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
           {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl md:rounded-[3rem] bg-white border border-slate-50" />)
           ) : items?.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col h-full"
              >
                 <Link href="/current-affairs" className="h-full block">
                    <Card className="border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl md:rounded-[3rem] bg-white p-6 md:p-10 lg:p-12 h-full flex flex-col justify-between min-h-[260px] md:min-h-[340px]">
                       <div className="flex-1 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-6 md:mb-12">
                             <Badge variant="outline" className="bg-slate-50 border-slate-100 text-slate-400 text-[9px] md:text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-sm">Bilingual</Badge>
                             <span className="text-[9px] md:text-[11px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" /> {item.month}
                             </span>
                          </div>
                          <h3 className="text-[clamp(16px,2vw,24px)] font-black leading-tight tracking-tight text-[#0F172A] group-hover:text-primary transition-colors line-clamp-3 flex-1 uppercase">
                             {item.title}
                          </h3>
                       </div>
                       <div className="mt-8 md:mt-12 pt-4 md:pt-8 border-t border-slate-50 shrink-0">
                          <Button variant="ghost" className="w-full h-12 md:h-14 lg:h-16 rounded-full bg-[#0F172A] text-white group-hover:bg-primary transition-all font-bold text-[10px] md:text-xs tracking-widest uppercase border-none shadow-lg active:scale-95 gap-3">
                             Read Hub <ChevronRight className="h-4 w-4" />
                          </Button>
                       </div>
                    </Card>
                 </Link>
              </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
