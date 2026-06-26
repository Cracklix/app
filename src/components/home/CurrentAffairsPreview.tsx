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
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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
    <section className="section-py bg-slate-50/50 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto container-px space-y-8 md:space-y-16">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <AuthorityLogo boardId="current-affairs" size="sm" className="bg-transparent shadow-none p-0 shrink-0" />
                 <h2 className="tracking-tight">Current Affairs</h2>
              </div>
              <p className="max-w-2xl leading-tight">Daily verified updates and bilingual nodes curated for all Punjab recruitment boards.</p>
           </div>
           <Link href="/current-affairs" className="text-blue-600 font-bold text-base tracking-tight hover:underline flex items-center gap-2 group shrink-0">
              View All Updates <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
           </Link>
        </div>

        <div className="grid gap-4 md:gap-8 lg:gap-10 grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
           {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-video w-full rounded-[var(--radius)] bg-white" />)
           ) : items?.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col"
              >
                 <Link href="/current-affairs" className="h-full block">
                    <Card className="border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[var(--radius)] bg-white p-6 md:p-10 lg:p-12 h-full flex flex-col justify-between min-h-[220px] md:min-h-[280px]">
                       <div className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-6 md:mb-10">
                             <Badge variant="outline" className="bg-slate-50 border-slate-100 text-slate-400 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-tight">Verified</Badge>
                             <span className="text-[11px] font-bold text-slate-400 tracking-widest flex items-center gap-1.5 uppercase">
                                <Calendar className="h-3.5 w-3.5 text-primary/60" /> {item.month} {item.year}
                             </span>
                          </div>
                          <h3 className="leading-tight mb-4 tracking-tight line-clamp-2 flex-1">
                             {item.title}
                          </h3>
                          <div className="mt-8 pt-6 border-t border-slate-50">
                             <Button variant="ghost" className="w-full h-12 md:h-14 rounded-full bg-[#0F172A] text-white group-hover:bg-primary transition-all font-semibold text-base border-none shadow-md active:scale-95">
                                Read More <ChevronRight className="h-4 w-4" />
                             </Button>
                          </div>
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