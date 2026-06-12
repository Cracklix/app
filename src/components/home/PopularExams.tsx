'use client';

import React from "react"
import { motion } from "framer-motion";
import { ChevronRight, Landmark, BookOpen, Zap, Shield, CheckCircle2, Star, ShieldCheck, GraduationCap, Scale, Smartphone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview Final Institutional Popular Exams v18.1.
 * MATCHED: Perfectly aligned with the reference (ibb.co/F4D0JLHP).
 * Features authority logo grid on left and trust checklist on right.
 */

const BOARDS = [
  { id: 'psssb', name: 'PSSSB', icon: <Landmark className="h-6 w-6" /> },
  { id: 'punjab-police', name: 'Punjab Police', icon: <Shield className="h-6 w-6" /> },
  { id: 'ppsc', name: 'PPSC', icon: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR8W5eTBPdzztA7cziqnMmtWk9InL1yflUD_xb4vAsLw&s=10" className="h-6 w-6 object-contain" /> },
  { id: 'pstet', name: 'PSTET', icon: <BookOpen className="h-6 w-6" /> },
  { id: 'pspcl', name: 'PSPCL / PSTCL', icon: <Zap className="h-6 w-6" /> },
  { id: 'high-court', name: 'Punjab & Haryana HC', icon: <Scale className="h-6 w-6" /> }
];

const TRUST_POINTS = [
  { title: "Punjab Focused Content", icon: <ShieldCheck className="h-5 w-5" /> },
  { title: "Bilingual (English + Punjabi)", icon: <Globe className="h-5 w-5" /> },
  { title: "Real Exam Pattern", icon: <GraduationCap className="h-5 w-5" /> },
  { title: "Detailed Performance Analytics", icon: <TrendingUp className="h-5 w-5" /> },
  { title: "On-the-Go Learning", icon: <Smartphone className="h-5 w-5" /> }
];

export default function PopularExams() {
  return (
    <section className="py-8 md:py-20 bg-slate-50/50">
      <div className="container mx-auto px-4 max-w-7xl">
         <div className="bg-white shadow-4xl rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
            
            {/* LEFT: AUTHORITY GRID */}
            <div className="flex-1 p-6 md:p-14 space-y-10 text-left">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 bg-orange-50 rounded-lg flex items-center justify-center text-primary shadow-inner">
                        <Star className="h-4 w-4 fill-current" />
                     </div>
                     <h2 className="text-xl md:text-3xl font-headline font-black text-[#0F172A] uppercase tracking-tight leading-none">
                        Popular Exams
                     </h2>
                  </div>
                  <Link href="/exams" className="text-primary font-black uppercase text-[9px] md:text-[11px] tracking-widest flex items-center gap-2 hover:underline">
                     View All Exams <ChevronRight className="h-4 w-4" />
                  </Link>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {BOARDS.map((board, idx) => (
                     <motion.div 
                       key={board.id}
                       initial={{ opacity: 0, y: 10 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.05 }}
                       viewport={{ once: true }}
                     >
                        <Link href="/exams" className="group block h-full">
                           <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 flex items-center gap-4 transition-all hover:shadow-2xl hover:border-primary/20 h-full">
                              <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors shrink-0 shadow-sm relative overflow-hidden">
                                 {board.icon}
                              </div>
                              <span className="text-[10px] md:text-xs font-black text-[#0F172A] uppercase leading-tight tracking-tight group-hover:text-primary transition-colors">{board.name}</span>
                           </div>
                        </Link>
                     </motion.div>
                  ))}
               </div>
            </div>

            {/* RIGHT: TRUST CHECKLIST */}
            <div className="w-full lg:w-[400px] bg-slate-50 border-l border-slate-100 p-8 md:p-14 flex flex-col justify-center text-left">
               <ul className="space-y-6 md:space-y-8">
                  {TRUST_POINTS.map((point, i) => (
                     <motion.li 
                       key={i}
                       initial={{ opacity: 0, x: 20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.2 + (i * 0.1) }}
                       viewport={{ once: true }}
                       className="flex items-center gap-4 group"
                     >
                        <div className="shrink-0 text-slate-400 group-hover:text-[#0F172A] transition-colors">
                           {point.icon}
                        </div>
                        <span className="text-xs md:text-sm font-bold text-slate-600 group-hover:text-[#0F172A] transition-colors uppercase tracking-tight">
                           {point.title}
                        </span>
                     </motion.li>
                  ))}
               </ul>
            </div>

         </div>
      </div>
    </section>
  );
}

import { Globe, TrendingUp } from "lucide-react";