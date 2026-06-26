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
      limit(4)
    );
  }, [db]);

  const { data: items, loading } = useCollection<any>(hubQuery);

  return (
    <section className="py-8 md:py-24 bg-slate-50/50 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-16 text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 px-1">
           <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <AuthorityLogo boardId="current-affairs" size="sm" className="bg-transparent shadow-none p-0 shrink-0" />
                 <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] tracking-tight">Current Affairs</h2>
              </div>
              <p className="text-slate-500 font-medium text-base md:text-lg leading-tight">Daily bilingual updates for Punjab recruitments.</p>
           </div>
           <Link href="/current-affairs" className="text-blue-600 font-bold text-base tracking-tight hover:underline flex items-center gap-2 group shrink-0">
              View All <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
           </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
           {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[200px] md:h-80 rounded-[24px] md:rounded-2xl bg-white" />)
           ) : items?.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                 <Link href="/current-affairs" className="h-full block">
                    <Card className="border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[24px] md:rounded-[2.5rem] bg-white p-[18px] md:p-12 h-full flex flex-col justify-between">
                       <div className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-4 md:mb-10">
                             <Badge variant="outline" className="bg-slate-50 border-slate-100 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase">CA</Badge>
                             <span className="text-[10px] font-bold text-slate-300 tracking-tight flex items-center gap-1 uppercase">
                                <Calendar className="h-3 w-3" /> {item.month}
                             </span>
                          </div>
                          <h3 className="text-[18px] md:text-2xl font-bold text-[#0F172A] leading-tight mb-4 uppercase tracking-tight line-clamp-2">
                             {item.title}
                          </h3>
                          <div className="mt-auto pt-4 border-t border-slate-50">
                             <Button variant="ghost" className="w-full h-[52px] md:h-14 rounded-full bg-[#0F172A] text-white group-hover:bg-primary transition-all font-semibold text-base border-none shadow-md">
                                Read <ChevronRight className="h-4 w-4" />
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
import { motion } from 'framer-motion';
