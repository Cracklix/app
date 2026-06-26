'use client';

import React from "react"
import { motion } from "framer-motion"
import { 
  ChevronRight, 
  Target,
  Zap
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AuthorityLogo } from "@/lib/exam-icons";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview Popular Exam Verticals v9.0 - Layout Precision.
 */

const POPULAR_LIST = [
  { name: "PCS Hub", id: "pcs", boardId: "PPSC", hasMocks: true },
  { name: "Constable", id: "constable", boardId: "Punjab Police", hasMocks: true },
  { name: "Patwari Hub", id: "patwari", boardId: "PSSSB", hasMocks: true },
  { name: "Clerk Hub", id: "clerk", boardId: "PSSSB", hasMocks: true },
  { name: "PSTET Paper 1", id: "pstet-paper-1", boardId: "PSTET", hasMocks: true },
  { name: "ALM Tech", id: "alm", boardId: "PSPCL", hasMocks: true },
  { name: "Staff Nurse", id: "staff-nurse", boardId: "BFUHS", hasMocks: true },
  { name: "SSC CGL", id: "ssc-cgl", boardId: "SSC", hasMocks: true }
];

export default function PopularExams() {
  return (
    <section className="section-py bg-slate-50/50 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto container-px space-y-8 md:space-y-16">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 text-left">
            <div className="space-y-1">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-12 md:w-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary shadow-inner shrink-0">
                    <Target className="h-5 w-5 md:h-7 md:w-7" />
                  </div>
                  <h2 className="text-[28px] md:text-5xl font-black tracking-tight text-[#0F172A]">Popular Exams</h2>
               </div>
               <p className="max-w-2xl text-sm md:text-xl font-medium text-slate-500">Instant access to the most attempted recruitment preparation hubs.</p>
            </div>
            <Link href="/exams" className="text-primary font-bold text-sm md:text-base tracking-tight hover:underline flex items-center gap-2 group shrink-0">
               Explore Full Registry <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-8 lg:gap-10">
            {POPULAR_LIST.map((p, idx) => (
               <motion.div 
                 key={p.id} 
                 initial={{ opacity: 0, scale: 0.98 }} 
                 whileInView={{ opacity: 1, scale: 1 }} 
                 viewport={{ once: true }} 
                 transition={{ duration: 0.4, delay: idx * 0.05 }} 
                 className="flex flex-col"
               >
                  <Link href={`/exams/view?id=${p.id}`} className="h-full block">
                     <Card className="border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[24px] md:rounded-[3rem] bg-white p-6 md:p-10 flex flex-col h-[230px] md:h-[340px] relative overflow-hidden group">
                        <div className="flex flex-col h-full justify-between">
                           <div className="space-y-4">
                              <div className="h-12 w-12 md:h-20 md:w-20 bg-slate-50 rounded-xl md:rounded-[2rem] shadow-inner flex items-center justify-center overflow-hidden p-2 group-hover:scale-110 transition-transform">
                                 <AuthorityLogo boardId={p.boardId} size="sm" className="h-full w-full" />
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-[17px] md:text-2xl font-black tracking-tight truncate text-[#0F172A] group-hover:text-primary transition-colors uppercase">{p.name}</h3>
                                <div className="flex flex-wrap gap-2">
                                   <MiniChip emoji="📚" label="Mocks" />
                                   <MiniChip emoji="⚡" label="Live" />
                                </div>
                              </div>
                           </div>

                           <div className="mt-4 shrink-0">
                              <Button variant="ghost" className="w-full h-11 md:h-14 rounded-full bg-[#0F172A] text-white group-hover:bg-primary transition-all font-black text-[10px] md:text-xs tracking-widest uppercase border-none shadow-md active:scale-95 gap-2">
                                 Open <ChevronRight className="h-3 w-3" />
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

function MiniChip({ emoji, label }: { emoji: string, label: string }) {
   return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-tight">
         <span>{emoji}</span> {label}
      </span>
   )
}
