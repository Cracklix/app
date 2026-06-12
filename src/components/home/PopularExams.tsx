'use client';

import React, { useMemo } from "react"
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, GraduationCap, ShieldCheck, Zap, Shield, Flame, Landmark, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, limit, where } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview Refined Popular Exams Hub v15.0.
 * ALIGNED: White card design with right-side checklist from design reference.
 */

const BOARDS = [
  { id: 'psssb', name: 'PSSSB', icon: <Landmark className="h-6 w-6" /> },
  { id: 'punjab-police', name: 'Punjab Police', icon: <Shield className="h-6 w-6" /> },
  { id: 'ppsc', name: 'PPSC', icon: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR8W5eTBPdzztA7cziqnMmtWk9InL1yflUD_xb4vAsLw&s=10" className="h-6 w-6 object-contain" /> },
  { id: 'pstet', name: 'PSTET', icon: <BookOpen className="h-6 w-6" /> },
  { id: 'pspcl', name: 'PSPCL / PSTCL', icon: <Zap className="h-6 w-6" /> },
  { id: 'high-court', name: 'Punjab & Haryana HC', icon: <Landmark className="h-6 w-6" /> }
];

const FEATURES = [
  "Punjab Focused Content",
  "Bilingual (English + Punjabi)",
  "Real Exam Pattern",
  "Detailed Performance Analytics",
  "On-the-Go Learning"
];

export default function PopularExams() {
  const db = useFirestore()
  
  return (
    <section className="py-12 md:py-24 bg-transparent">
      <div className="container mx-auto px-4 max-w-7xl">
         <Card className="border-none shadow-5xl rounded-[3rem] bg-white overflow-hidden p-8 md:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
               
               {/* LEFT: EXAM LOGOS */}
               <div className="lg:col-span-8 space-y-12">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center text-primary shadow-inner">
                           <Flame className="h-5 w-5 fill-current" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-headline font-black text-[#0F172A] uppercase tracking-tight">
                           Popular Exams
                        </h2>
                     </div>
                     <Button asChild variant="ghost" className="text-primary font-black uppercase text-[10px] tracking-widest gap-2">
                        <Link href="/exams">View All Exams <ChevronRight className="h-4 w-4" /></Link>
                     </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                     {BOARDS.map((board) => (
                        <Link key={board.id} href="/exams" className="block group">
                           <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex items-center gap-4 transition-all group-hover:bg-white group-hover:shadow-2xl group-hover:border-primary/20 h-full">
                              <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shrink-0 shadow-sm border border-slate-50 overflow-hidden">
                                 {board.icon}
                              </div>
                              <span className="text-xs md:text-sm font-black text-[#0F172A] uppercase leading-tight">{board.name}</span>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>

               {/* RIGHT: CHECKLIST */}
               <div className="lg:col-span-4 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-12 lg:pt-0 lg:pl-12">
                  <ul className="space-y-6">
                     {FEATURES.map((feat, i) => (
                        <li key={i} className="flex items-center gap-4 text-left group">
                           <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                           </div>
                           <span className="text-[13px] md:text-[15px] font-bold text-slate-600 group-hover:text-[#0F172A] transition-colors">{feat}</span>
                        </li>
                     ))}
                  </ul>
               </div>

            </div>
         </Card>
      </div>
    </section>
  );
}

function Card({ children, className }: any) {
   return <div className={cn("bg-white", className)}>{children}</div>;
}
