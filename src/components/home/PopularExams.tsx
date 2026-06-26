'use client';

import React from "react"
import { motion } from "framer-motion"
import { 
  ChevronRight, 
  Target
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AuthorityLogo } from "@/lib/exam-icons";
import { Button } from "@/components/ui/button";

const POPULAR_LIST = [
  { name: "PCS", id: "pcs", boardId: "PPSC", hasMocks: true },
  { name: "Constable", id: "constable", boardId: "Punjab Police", hasMocks: true },
  { name: "Patwari", id: "patwari", boardId: "PSSSB", hasMocks: true },
  { name: "Clerk", id: "clerk", boardId: "PSSSB", hasMocks: true },
  { name: "PSTET", id: "pstet-paper-1", boardId: "PSTET", hasMocks: true },
  { name: "ALM", id: "alm", boardId: "PSPCL", hasMocks: true },
  { name: "Staff Nurse", id: "staff-nurse", boardId: "BFUHS", hasMocks: true },
  { name: "SSC CGL", id: "ssc-cgl", boardId: "SSC", hasMocks: true }
];

export default function PopularExams() {
  return (
    <section className="section-py bg-slate-50/50 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto container-px space-y-8 md:space-y-16">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary shadow-inner shrink-0">
                    <Target className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <h2 className="tracking-tight">Popular Exams</h2>
               </div>
               <p className="max-w-2xl">Direct access to the most attempted recruitment preparation hubs.</p>
            </div>
            <Link href="/exams" className="text-primary font-bold text-base tracking-tight hover:underline flex items-center gap-2 group shrink-0">
               View Registry <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
         </div>

         <div className="grid gap-4 md:gap-8 lg:gap-10 grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))]">
            {POPULAR_LIST.map((p, idx) => (
               <motion.div 
                 key={p.id} 
                 initial={{ opacity: 0, scale: 0.95 }} 
                 whileInView={{ opacity: 1, scale: 1 }} 
                 viewport={{ once: true }} 
                 transition={{ duration: 0.4, delay: idx * 0.05 }} 
                 className="flex flex-col"
               >
                  <Link href={`/exams/view?id=${p.id}`} className="h-full block">
                     <Card className="border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[var(--radius)] bg-white p-6 md:p-10 lg:p-12 flex flex-col justify-between group h-full min-h-[260px] md:min-h-[320px] relative overflow-hidden">
                        <div className="flex flex-col h-full">
                           <div className="mb-6 md:mb-10">
                              <div className="h-14 w-14 md:h-20 md:w-20 bg-slate-50 rounded-xl md:rounded-2xl shadow-inner flex items-center justify-center overflow-hidden p-2 group-hover:scale-110 transition-transform">
                                 <AuthorityLogo boardId={p.boardId} size="md" className="h-full w-full" />
                              </div>
                           </div>
                           
                           <div className="space-y-3 flex-1">
                              <h3 className="tracking-tight truncate">{p.name}</h3>
                              <div className="flex flex-wrap gap-2">
                                 <MiniChip emoji="📚" label="Mocks" />
                                 <MiniChip emoji="⚡" label="Live" />
                              </div>
                           </div>

                           <div className="mt-8 pt-6 border-t border-slate-50">
                              <Button variant="ghost" className="w-full h-12 md:h-14 rounded-full bg-[#0F172A] text-white group-hover:bg-primary transition-all font-semibold text-base border-none shadow-md active:scale-95">
                                 Open Exam <ChevronRight className="h-4 w-4 ml-1" />
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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-400">
         <span>{emoji}</span> {label}
      </span>
   )
}