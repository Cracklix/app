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
    <section className="py-8 md:py-24 bg-slate-50/50 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8 md:space-y-16">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 px-1">
            <div className="space-y-1">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center text-primary shadow-inner shrink-0"><Target className="h-5 w-5" /></div>
                  <h2 className="text-3xl md:text-5xl font-bold text-[#04102B] tracking-tight">Popular Exams</h2>
               </div>
               <p className="text-slate-500 font-medium text-base md:text-2xl max-w-2xl leading-tight">Direct links to most attempted preparation hubs.</p>
            </div>
            <Link href="/exams" className="text-primary font-bold text-base tracking-tight hover:underline flex items-center gap-2 group shrink-0">
               View Registry <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {POPULAR_LIST.map((p, idx) => (
               <motion.div 
                 key={p.id} 
                 initial={{ opacity: 0, y: 10 }} 
                 whileInView={{ opacity: 1, y: 0 }} 
                 viewport={{ once: true }} 
                 transition={{ delay: idx * 0.05 }} 
               >
                  <Link href={`/exams/view?id=${p.id}`} className="h-full block">
                     <Card className="border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[24px] md:rounded-[3rem] bg-white p-[18px] md:p-12 text-left h-[230px] md:h-full group flex flex-col justify-between relative overflow-hidden">
                        <div>
                           <div className="mb-4 md:mb-12 flex justify-start">
                              <div className="h-12 w-12 md:h-24 md:w-24 bg-slate-50 rounded-[1rem] md:rounded-[2.5rem] shadow-inner flex items-center justify-center overflow-hidden p-2">
                                 <AuthorityLogo boardId={p.boardId} size="md" className="h-full w-full" />
                              </div>
                           </div>
                           
                           <div className="space-y-1">
                              <h3 className="text-[18px] md:text-3xl font-bold text-[#04102B] leading-tight tracking-tight truncate">
                                 {p.name}
                              </h3>
                              
                              <div className="flex flex-wrap gap-1.5">
                                 <MiniChip emoji="📚" label="Mocks" />
                                 <MiniChip emoji="⚡" label="Live" />
                              </div>
                           </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-50">
                           <Button variant="ghost" className="w-full h-[52px] md:h-14 rounded-full bg-[#0F172A] text-white group-hover:bg-primary transition-all font-semibold text-base border-none shadow-md">
                              Open <ChevronRight className="h-4 w-4 ml-1" />
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

function MiniChip({ emoji, label }: { emoji: string, label: string }) {
   return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-400">
         <span className="text-[10px]">{emoji}</span> {label}
      </span>
   )
}
