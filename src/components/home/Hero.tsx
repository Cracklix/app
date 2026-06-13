'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  ArrowRight,
  ClipboardList,
  ShieldCheck,
  Star,
  Users,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";

/**
 * @fileOverview FINAL ABSOLUTE FIDELITY HERO v150.0.
 * MATCHED: Screenshot layout with Sentence case text.
 * FIXED: Reduced overall scale by 30%, zero overlap, horizontal stats.
 */

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const liveStats = useMemo(() => {
    const formatNumber = (num: number, fallback: string) => {
      if (!num) return fallback;
      if (num >= 1000) return (num / 1000).toFixed(0) + ',000+';
      return num.toString() + '+';
    };

    return [
      { id: 'q', icon: <BookOpen className="text-blue-400 h-3 w-3 md:h-5 md:w-5" />, val: formatNumber(stats?.totalQuestions, "439+"), label: "Total practice questions" },
      { id: 'm', icon: <ClipboardList className="text-orange-400 h-3 w-3 md:h-5 md:w-5" />, val: formatNumber(stats?.totalMocks, "8+"), label: "Total mock tests" },
      { id: 'e', icon: <ShieldCheck className="text-blue-500 h-3 w-3 md:h-5 md:w-5" />, val: formatNumber(stats?.totalBoards, "92+"), label: "Total exams covered" },
      { id: 'u', icon: <Users className="text-emerald-400 h-3 w-3 md:h-5 md:w-5" />, val: formatNumber(stats?.totalUsers, "5+"), label: "Registered students" }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-[#050B19] overflow-hidden h-[230px] md:h-[550px] flex flex-col justify-center text-left border-b border-white/5">
      
      {/* 1. BACKGROUND ENGINE */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          src="https://i.ibb.co/fYJttX5d/Gemini-Generated-Image-n1so6on1so6on1so.png" 
          alt="Official Punjab Prep Hub" 
          className="w-full h-full object-cover object-right"
          referrerPolicy="no-referrer"
        />
        
        {/* SHADING OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B19] via-[#050B19]/80 to-transparent z-[10]" />
        
        {/* PUNJAB MAP WATERMARK */}
        <div className="absolute inset-0 z-[11] pointer-events-none opacity-[0.05]">
           <div className="absolute top-[40%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/Outline_Map_of_Punjab_India.svg')] bg-contain bg-no-repeat grayscale invert" />
        </div>
      </div>

      {/* 2. MAIN CONTENT HUB */}
      <div className="container mx-auto px-4 md:px-12 max-w-7xl relative z-20">
         <div className="max-w-2xl space-y-1 md:space-y-4 -mt-8 md:mt-0">
            
            {/* TOP PILL BADGE */}
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-4 md:py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-1"
            >
               <Star className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-[#F97316] fill-current" />
               <span className="text-[7px] md:text-[10px] font-black text-white tracking-widest uppercase">#1 Punjab exam preparation platform</span>
            </motion.div>

            {/* HEADINGS - SENTENCE CASE ONLY */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="space-y-0.5 md:space-y-1"
            >
               <h1 className="text-xl md:text-5xl lg:text-6xl font-headline font-black text-white leading-tight tracking-tight">
                  Prepare smarter.
               </h1>
               <h1 className="text-xl md:text-5xl lg:text-6xl font-headline font-black text-[#F97316] leading-tight tracking-tight">
                  Score higher.
               </h1>
            </motion.div>

            {/* DESCRIPTION */}
            <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-[9px] md:text-lg text-slate-300 font-medium max-w-lg leading-snug antialiased"
            >
               Punjab Government Exams di Complete Preparation ik hi Platform te.
            </motion.p>

            {/* TACTICAL BUTTONS */}
            <motion.div
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex flex-row gap-2 md:gap-4 pt-2 md:pt-4"
            >
               <Button asChild className="h-8 md:h-14 px-4 md:px-8 bg-[#F97316] hover:bg-orange-600 text-white font-black text-[8px] md:text-xs tracking-tight rounded-lg md:rounded-xl shadow-2xl transition-all active:scale-95 border-none">
                  <Link href="/mocks" className="flex items-center">
                     Start free mock <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1.5 md:ml-2" />
                  </Link>
               </Button>
               <Button asChild variant="outline" className="h-8 md:h-14 px-4 md:px-8 border-white/20 bg-white/5 text-white font-black text-[8px] md:text-xs tracking-tight rounded-lg md:rounded-xl transition-all backdrop-blur-md hover:bg-white/10">
                  <Link href="/exams">
                     Explore exams
                  </Link>
               </Button>
            </motion.div>
         </div>
      </div>

      {/* 3. INTEGRATED BOTTOM DATA BAR (HORIZONTAL GLASS) */}
      <div className="absolute bottom-1 md:bottom-8 left-0 right-0 z-30">
         <div className="container mx-auto px-4 md:px-12 max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-4">
               {liveStats.map((stat, idx) => (
                  <motion.div
                     key={stat.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4 + (idx * 0.1) }}
                  >
                     <Card className="bg-[#0B1528]/60 backdrop-blur-2xl border border-white/10 p-1.5 md:p-4 rounded-lg md:rounded-2xl text-left flex items-center gap-2 md:gap-4 group hover:bg-[#0B1528]/80 transition-all duration-300 shadow-2xl overflow-hidden h-10 md:h-20">
                        <div className="shrink-0 h-6 w-6 md:h-12 md:w-12 rounded-md md:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-105 shadow-inner">
                           {stat.icon}
                        </div>
                        <div className="min-w-0 flex flex-col justify-center leading-none">
                           <p className="text-[11px] md:text-2xl font-headline font-black text-white tabular-nums leading-none mb-0.5 md:mb-1">{stat.val}</p>
                           <p className="text-[6px] md:text-[9px] font-black uppercase text-slate-500 tracking-wider truncate">
                              {stat.label}
                           </p>
                        </div>
                     </Card>
                  </motion.div>
               ))}
            </div>
         </div>
      </div>
    </section>
  );
}
