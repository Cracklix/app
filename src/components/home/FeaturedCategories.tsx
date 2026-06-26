"use client"

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layers, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthorityLogo } from '@/lib/exam-icons';
import { Badge } from '@/components/ui/badge';

const STRICT_WHITELIST = [
  "punjab-government-exams",
  "punjab-teaching-exams",
  "punjab-technical-exams",
  "banking-exams",
  "judiciary-exams",
  "central-government-exams"
];

export default function FeaturedCategories() {
  const db = useFirestore();
  
  const { data: rawCategories, loading: catLoading } = useCollection<any>(useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db]));
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]));

  const categories = useMemo(() => {
     if (!rawCategories) return [];
     return rawCategories.filter(c => STRICT_WHITELIST.includes(c.id));
  }, [rawCategories]);

  return (
    <section className="py-8 md:py-24 bg-white border-t border-slate-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 px-1">
           <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shadow-inner shrink-0">
                   <Layers className="h-5 w-5" />
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] tracking-tight">Choose Category</h2>
              </div>
              <p className="text-slate-500 font-medium text-base md:text-2xl max-w-2xl leading-tight">Select your recruitment category to explore verified hubs.</p>
           </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {catLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className="h-[320px] md:h-96 w-full rounded-[24px] md:rounded-[3rem] bg-slate-50" 
              />
            ))
          ) : categories.map((cat, idx) => {
            const catBoards = boards?.filter(b => b.categoryId === cat.id) || [];
            const boardLabel = catBoards.length > 0 ? catBoards[0].abbreviation : "Official";
            
            return (
              <motion.div 
                key={cat.id} 
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                 <Link href={`/exams/category/${cat.id}`} className="h-full block">
                    <Card className="border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[24px] md:rounded-[3rem] bg-white group overflow-hidden flex flex-col justify-between p-[18px] md:p-14 h-[320px] md:h-full relative">
                       <div className="flex flex-col h-full">
                          <div className="space-y-3 mb-4">
                             <div className="h-14 w-14 md:h-24 md:w-24 bg-slate-50 rounded-[1.25rem] md:rounded-[2.5rem] flex items-center justify-center shadow-inner overflow-hidden">
                                <AuthorityLogo category={cat} size="md" className="h-full w-full p-2" />
                             </div>
                             <Badge className="bg-primary/5 text-primary border-none font-bold text-[13px] px-3 py-1 rounded-full shadow-sm w-fit tracking-tight">
                                {boardLabel} Hub
                             </Badge>
                          </div>
                          
                          <div className="space-y-1 flex-1">
                             <h3 className="text-[18px] md:text-3xl font-bold text-[#0F172A] leading-tight line-clamp-1 tracking-tight">{cat.title}</h3>
                             <p className="text-[15px] md:text-lg text-slate-500 line-clamp-2 leading-relaxed font-medium">
                               {cat.description || "Browse official preparation series."}
                             </p>
                          </div>

                          <div className="mt-4 pt-4 border-t border-slate-50">
                             <Button variant="ghost" className="w-full h-[52px] md:h-16 rounded-full bg-[#0F172A] text-white group-hover:bg-primary transition-all font-semibold text-base gap-3 shadow-md border-none">
                                <span className="hidden md:inline">Start Learning</span>
                                <span className="md:hidden text-[15px]">Start Learning</span>
                                <ChevronRight className="h-4 w-4" />
                             </Button>
                          </div>
                       </div>
                    </Card>
                 </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
