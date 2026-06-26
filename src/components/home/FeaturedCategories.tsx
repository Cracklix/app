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
    <section className="section-py bg-white border-t border-slate-50">
      <div className="max-w-[1440px] mx-auto container-px space-y-8 md:space-y-16">
        
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
               <Layers className="h-5 w-5 md:h-6 md:w-6" />
             </div>
             <h2 className="tracking-tight">Choose Category</h2>
          </div>
          <p className="max-w-2xl">Select your recruitment category to explore verified preparation hubs.</p>
        </div>

        <div className="grid gap-4 md:gap-8 lg:gap-10 grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          {catLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className="aspect-[4/5] md:aspect-square w-full rounded-[var(--radius)] bg-slate-50" 
              />
            ))
          ) : categories.map((cat, idx) => {
            const catBoards = boards?.filter(b => b.categoryId === cat.id) || [];
            const boardLabel = catBoards.length > 0 ? catBoards[0].abbreviation : "Official";
            
            return (
              <motion.div 
                key={cat.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col"
              >
                 <Link href={`/exams/category/${cat.id}`} className="h-full block">
                    <Card className="border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[var(--radius)] bg-white group overflow-hidden flex flex-col p-6 md:p-10 lg:p-12 h-full min-h-[380px] md:min-h-[440px]">
                       <div className="flex flex-col h-full">
                          <div className="space-y-4 mb-6">
                             <div className="h-16 w-16 md:h-24 md:w-24 bg-slate-50 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-inner overflow-hidden">
                                <AuthorityLogo category={cat} size="md" className="h-full w-full p-2" />
                             </div>
                             <Badge className="bg-primary/5 text-primary border-none font-bold text-[13px] px-3 py-1 rounded-full shadow-sm w-fit tracking-tight">
                                {boardLabel} Hub
                             </Badge>
                          </div>
                          
                          <div className="space-y-2 flex-1">
                             <h3 className="leading-tight line-clamp-2">{cat.title}</h3>
                             <p className="line-clamp-3 leading-relaxed font-medium">
                               {cat.description || "Browse official preparation series."}
                             </p>
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-50">
                             <Button variant="ghost" className="w-full h-12 md:h-14 rounded-full bg-[#0F172A] text-white group-hover:bg-primary transition-all font-semibold text-base gap-3 shadow-md border-none active:scale-95">
                                Start Learning
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