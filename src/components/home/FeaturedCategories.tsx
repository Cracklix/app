
"use client"

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Landmark, 
  ChevronRight,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @fileOverview Elite Exam Categories Hub v25.0.
 * TYPOGRAPHY: Reduced scale by 40% for better density. Header max 72px, Card title max 28px.
 */

const FALLBACK_ICONS: Record<string, string> = {
  "punjab-govt": "https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg",
  "punjab-teaching": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbNnoge6pNWx1HZYrUJKM58qWk1dDw85xvKPBoG-O4ew&s=10",
  "punjab-technical": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0ZK9JI5KMfg9RoNdIwcsNlpx5IcPBWuKZw&s",
  "banking": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7McWqZqOgKy-BakccvR02WQdEQFrwuvmHBG5rYJzuEg&s=10",
  "central-govt": "https://alchetron.com/cdn/government-of-india-973b74d1-e25f-41f2-ba2b-51595702248-resize-750.jpeg"
};

export default function FeaturedCategories() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const catQuery = useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db]);
  const examsQuery = useMemo(() => (db ? collection(db, "exams") : null), [db]);

  const { data: categories, loading: catLoading } = useCollection<any>(catQuery);
  const { data: exams, loading: examsLoading } = useCollection<any>(examsQuery);

  if (!mounted) return null;

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl space-y-10 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2 max-w-3xl">
             <div className="flex items-center gap-3">
                <Landmark className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <span className="text-[10px] md:text-[11px] font-bold text-slate-500 tracking-tight uppercase">Vertical Library</span>
             </div>
             <h2 className="text-[32px] sm:text-[42px] md:text-[48px] lg:text-[60px] xl:text-[72px] font-black tracking-tight text-[#0F172A] leading-[0.95] break-words">
                Choose Your <span className="text-primary">Exam Category</span>
             </h2>
             <p className="text-slate-500 font-medium text-sm md:text-lg">Select a vertical to browse official preparation centers.</p>
          </div>
          <Button asChild variant="ghost" className="text-primary font-bold text-sm tracking-tight gap-2 p-0 h-auto hover:bg-transparent">
             <Link href="/exams">Full Category List <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {catLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-[2rem]" />)
          ) : categories && categories.length > 0 ? (
            categories.map((cat, idx) => {
              const count = (exams || []).filter((e: any) => e.categoryId === cat.id).length;
              const iconUrl = cat.iconUrl || FALLBACK_ICONS[cat.id] || "";
              
              return (
                <motion.div 
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                   <Link href={`/exams/category/${cat.id}`}>
                      <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:translate-y-[-6px] transition-all duration-500 rounded-[2rem] md:rounded-[2.5rem] bg-white group overflow-hidden min-h-[300px] md:min-h-[380px] flex flex-col p-6 md:p-8 relative">
                         <div className={cn("h-12 w-12 md:h-16 md:w-16 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110 relative shrink-0 bg-slate-50 text-slate-300")}>
                            <div className="h-full w-full flex items-center justify-center overflow-hidden rounded-xl relative p-2">
                              {iconUrl ? (
                                <Image 
                                  src={iconUrl} 
                                  alt={cat.title}
                                  fill
                                  sizes="80px"
                                  className="object-contain p-1.5"
                                />
                              ) : (
                                <ShieldCheck className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                              )}
                            </div>
                         </div>
                         
                         <div className="space-y-3 flex-1 min-w-0">
                            <h3 className="text-[20px] md:text-[24px] lg:text-[28px] font-black leading-tight text-[#0F172A] group-hover:text-primary transition-colors break-words line-clamp-2">
                              {cat.title}
                            </h3>
                            <p className="text-sm md:text-base text-slate-400 tracking-tight leading-snug line-clamp-3">
                              {cat.description}
                            </p>
                         </div>

                         <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[11px] md:text-xs font-bold text-slate-500 tracking-tight">{count} Exams Live</span>
                            <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-slate-300 shadow-sm border border-slate-100">
                               <ChevronRight className="h-4 w-4" />
                            </div>
                         </div>
                      </Card>
                   </Link>
                </motion.div>
              )
            })
          ) : (
            <div className="col-span-full py-20 text-center opacity-20 italic">Awaiting Category Registry...</div>
          )}
        </div>
      </div>
    </section>
  );
}
