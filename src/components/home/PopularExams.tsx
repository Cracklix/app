'use client';

import React from "react"
import { motion } from "framer-motion";
import { ChevronRight, Landmark, BookOpen, Zap, Shield, CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview High-Fidelity Popular Exams Hub v16.0.
 * ALIGNED: White institutional card with the professional feature checklist.
 */

const BOARDS = [
  { id: 'psssb', name: 'PSSSB Hub', abbrev: 'PSSSB', icon: <Landmark className="h-6 w-6" /> },
  { id: 'punjab-police', name: 'Punjab Police', abbrev: 'Police', icon: <Shield className="h-6 w-6" /> },
  { id: 'ppsc', name: 'PPSC Executive', abbrev: 'PPSC', icon: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR8W5eTBPdzztA7cziqnMmtWk9InL1yflUD_xb4vAsLw&s=10" className="h-6 w-6 object-contain" /> },
  { id: 'pstet', name: 'Teaching Board', abbrev: 'PSTET', icon: <BookOpen className="h-6 w-6" /> },
  { id: 'pspcl', name: 'Technical Hub', abbrev: 'PSPCL', icon: <Zap className="h-6 w-6" /> },
  { id: 'high-court', name: 'Judicial Hub', abbrev: 'High Court', icon: <Landmark className="h-6 w-6" /> }
];

const FEATURES = [
  { title: "Punjab Focused Content", desc: "100% aligned with state patterns." },
  { title: "Bilingual Hub", desc: "Study in English + Punjabi (Gurmukhi)." },
  { title: "Real Exam Simulation", desc: "High-fidelity CBT attempt engine." },
  { title: "Advanced Analytics", desc: "Track weak subjects & accuracy." },
  { title: "Selection Verified", desc: "94% Accuracy in previous papers." }
];

export default function PopularExams() {
  return (
    <section className="py-12 md:py-24 bg-transparent -mt-16 md:-mt-20">
      <div className="container mx-auto px-4 max-w-7xl">
         <div className="bg-white shadow-5xl rounded-[3rem] md:rounded-[4.5rem] overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
            
            {/* LEFT: AUTHORITY GRID */}
            <div className="flex-1 p-8 md:p-16 lg:p-20 space-y-12 text-left">
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                        <Star className="h-5 w-5 fill-current" />
                     </div>
                     <h2 className="text-2xl md:text-4xl font-headline font-black text-[#0F172A] uppercase tracking-tight">
                        Popular <span className="text-primary">Exam Hubs</span>
                     </h2>
                  </div>
                  <p className="text-slate-400 font-medium text-lg">Browse official preparation nodes for all major boards.</p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                  {BOARDS.map((board, idx) => (
                     <motion.div 
                       key={board.id}
                       initial={{ opacity: 0, y: 10 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.05 }}
                       viewport={{ once: true }}
                     >
                        <Link href="/exams" className="group block h-full">
                           <div className="bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-6 flex flex-col items-center gap-4 transition-all group-hover:bg-white group-hover:shadow-3xl group-hover:border-primary/20 h-full text-center">
                              <div className="h-14 w-14 md:h-20 md:w-20 rounded-2xl md:rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors shrink-0 shadow-sm relative overflow-hidden">
                                 {board.icon}
                              </div>
                              <span className="text-xs md:text-base font-black text-[#0F172A] uppercase leading-tight tracking-tight">{board.abbrev}</span>
                           </div>
                        </Link>
                     </motion.div>
                  ))}
               </div>

               <div className="pt-8">
                  <Button asChild className="h-16 px-12 bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl gap-3">
                     <Link href="/exams">Browse Full Registry <ChevronRight className="h-4 w-4" /></Link>
                  </Button>
               </div>
            </div>

            {/* RIGHT: INSTITUTIONAL CHECKLIST */}
            <div className="w-full lg:w-[420px] bg-slate-50 border-l border-slate-100 p-8 md:p-16 flex flex-col justify-center text-left">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">Institutional Advantage</h4>
               <ul className="space-y-10">
                  {FEATURES.map((feat, i) => (
                     <motion.li 
                       key={i}
                       initial={{ opacity: 0, x: 20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.3 + (i * 0.1) }}
                       viewport={{ once: true }}
                       className="flex items-start gap-6 group"
                     >
                        <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 mt-1 shadow-sm">
                           <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-base md:text-lg font-black text-[#0F172A] uppercase leading-tight group-hover:text-primary transition-colors">{feat.title}</p>
                           <p className="text-xs font-medium text-slate-400">{feat.desc}</p>
                        </div>
                     </motion.li>
                  ))}
               </ul>

               <div className="mt-16 pt-10 border-t border-slate-200 text-center">
                  <div className="flex items-center justify-center gap-3">
                     <Shield className="h-5 w-5 text-slate-300" />
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Registry Secure Hub</span>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </section>
  );
}
