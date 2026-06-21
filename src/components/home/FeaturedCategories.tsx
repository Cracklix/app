"use client"

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Landmark, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @fileOverview Canonical Punjab Categories Hub v28.0.
 */

export default function FeaturedCategories() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const catQuery = useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db]);
  const { data: categories, loading: catLoading } = useCollection<any>(catQuery);

  if (!mounted) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl space-y-10 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-3">
                <Landmark className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold text-slate-400 tracking-tight uppercase">Exam Categories</span>
             </div>
             <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] leading-tight">Explore Categories</h2>
          </div>
          <Button asChild variant="ghost" className="text-primary font-black uppercase text-[10px] tracking-widest gap-2 p-0 h-auto hover:bg-transparent"><Link href="/exams">All Categories <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {catLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl bg-slate-50" />)
          ) : categories?.map((cat, idx) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}>
               <Link href={`/exams/category/${cat.id}`}>
                  <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] bg-white group overflow-hidden flex flex-col p-6 min-h-[220px]">
                     <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 shadow-inner text-primary shrink-0 transition-transform group-hover:scale-110"><ShieldCheck className="h-6 w-6" /></div>
                     <h3 className="text-xl font-black text-[#0F172A] group-hover:text-primary transition-colors leading-tight mb-2">{cat.title}</h3>
                     <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-2">{cat.description}</p>
                     <div className="mt-auto pt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary"><span>Open Exam</span><ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" /></div>
                  </Card>
               </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
