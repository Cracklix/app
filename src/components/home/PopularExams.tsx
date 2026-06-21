'use client';

import React from "react"
import { motion } from "framer-motion"
import { 
  ChevronRight, 
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AuthorityLogo } from "@/lib/exam-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview Popular Punjab Exams Hub v75.0 (Mobile High-Density).
 */

const POPULAR_LIST = [
  { name: "PCS", id: "pcs", boardId: "ppsc", hasMocks: true, hasPyqs: true },
  { name: "Constable", id: "constable", boardId: "punjab-police", hasMocks: true, hasPyqs: true },
  { name: "Patwari", id: "patwari", boardId: "psssb", hasMocks: true, hasPyqs: true },
  { name: "Clerk", id: "clerk", boardId: "psssb", hasMocks: true, hasPyqs: true },
  { name: "PSTET", id: "pstet-paper-1", boardId: "pstet", hasMocks: true, hasPyqs: true },
  { name: "ALM", id: "alm", boardId: "pspcl", hasMocks: true, hasPyqs: true },
  { name: "Staff Nurse", id: "staff-nurse", boardId: "bfuhs", hasMocks: true, hasPyqs: true },
  { name: "SSC CGL", id: "ssc-cgl", boardId: "ssc", hasMocks: true, hasPyqs: true }
];

export default function PopularExams() {
  return (
    <section className="py-10 md:py-24 bg-slate-50/50">
      <div className="container mx-auto px-4 max-w-7xl text-left">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 gap-2">
            <div className="space-y-0.5">
               <h2 className="text-2xl md:text-5xl font-black text-[#04102B] tracking-tight leading-none">Popular Exams</h2>
               <p className="text-[#94A3B8] font-bold text-[10px] md:text-sm tracking-tight uppercase">Most Targeted Hubs</p>
            </div>
            <Link href="/exams" className="text-primary font-black uppercase text-[9px] md:text-xs tracking-widest hover:underline flex items-center gap-2 group">
               View All <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {POPULAR_LIST.map((p, idx) => (
               <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} viewport={{ once: true }}>
                  <Link href={`/exams/${p.id}`}>
                     <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[1.5rem] md:rounded-[2.5rem] bg-white p-4 md:p-10 text-left h-full group flex flex-col">
                        <div className="mb-4 md:mb-8 flex justify-center">
                           <AuthorityLogo boardId={p.boardId} size="md" className="bg-slate-50 rounded-xl group-hover:scale-110 transition-transform" />
                        </div>
                        
                        <div className="flex-1 space-y-2 md:space-y-5">
                           <h3 className="text-sm md:text-2xl font-black text-[#04102B] leading-tight group-hover:text-primary transition-colors">
                              {p.name}
                           </h3>
                           
                           <div className="flex flex-wrap gap-1.5">
                              {p.hasMocks && <MiniChip emoji="📚" label="Mocks" />}
                              <MiniChip emoji="⚡" label="Live" />
                           </div>
                        </div>

                        <div className="mt-6 md:mt-10 pt-4 border-t border-slate-50">
                           <Button className="w-full h-10 md:h-12 rounded-xl bg-[#0F172A] hover:bg-primary text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest gap-2 border-none shadow-md">
                              Open <ArrowRight className="h-3 w-3" />
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
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-slate-50 border border-slate-100 text-[8px] md:text-[9px] font-black uppercase text-slate-500">
         <span>{emoji}</span> {label}
      </span>
   )
}
