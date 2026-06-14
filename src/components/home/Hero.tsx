'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, BookOpen, ClipboardList, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Hardened Unified Hero v11.0.
 * POSITIONING: Text at top-left. Map on left. Temple on right.
 * SHADING: Sky blue gradient on the far left for text contrast.
 * BACKGROUND: Unified layer, no divisions, text sits on top of images.
 */

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goldenTempleImg = "https://i.ibb.co/LXgcLVVq/Gemini-Generated-Image-n1so6on1so6on1so.png";
  const punjabMap = "https://www.mapsofindia.com/maps/punjab/punjab-map.jpg";

  if (!mounted) {
    return <section className="w-full bg-[#050B19] h-[500px]" />;
  }

  return (
    <section className="relative w-full min-h-[550px] md:min-h-[700px] bg-[#050B19] overflow-hidden flex flex-col">
      
      {/* 1. UNIFIED BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 flex">
         {/* LEFT SIDE: MAP HUB */}
         <div className="relative w-full md:w-1/2 h-full bg-[#050B19]">
            <img 
              src={punjabMap} 
              className="w-full h-full object-cover opacity-30 grayscale invert contrast-125" 
              alt="Punjab Map"
            />
            {/* SKY BLUE OVERLAY FOR TEXT READABILITY */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C4A6E]/80 via-[#0C4A6E]/40 to-transparent" />
         </div>
         
         {/* RIGHT SIDE: TEMPLE HUB */}
         <div className="relative w-full md:w-1/2 h-full">
            <img 
              src={goldenTempleImg} 
              alt="Golden Temple" 
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            {/* TRANSITION GRADIENT: BLENDS TEMPLE INTO MAP AREA */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050B19] to-transparent" />
         </div>

         {/* BOTTOM FADE: BLENDS BACKGROUND INTO STATS SECTION */}
         <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050B19] to-transparent" />
      </div>

      {/* 2. CONTENT HUB - TOP LEFT ALIGNED */}
      <div className="container mx-auto px-4 md:px-16 max-w-7xl relative z-10 pt-12 md:pt-24 flex-1">
         <div className="max-w-2xl text-left space-y-6 md:space-y-10">
            
            {/* BRAND BADGE */}
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md"
            >
               <Star className="h-3 w-3 text-primary fill-current" />
               <span className="text-[8px] md:text-xs font-black text-white uppercase tracking-widest">#1 Punjab Exam Prep Node</span>
            </motion.div>

            {/* HEADLINES */}
            <div className="space-y-2 md:space-y-4">
               <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[32px] sm:text-5xl md:text-7xl lg:text-[85px] font-headline font-black text-white leading-none tracking-tighter uppercase"
               >
                  PREPARE SMARTER.
               </motion.h1>
               <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[32px] sm:text-5xl md:text-7xl lg:text-[85px] font-headline font-black text-primary leading-none tracking-tighter uppercase"
               >
                  SCORE HIGHER.
               </motion.h1>
            </div>

            <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-slate-200 font-bold uppercase text-[10px] md:text-lg tracking-[0.2em] max-w-lg leading-relaxed antialiased"
            >
               Punjab's most advanced CBT engine. <br className="hidden md:block" />
               Verified by Arsh Grewal Management.
            </motion.p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-4 pt-4">
               <Button asChild className="h-14 md:h-18 px-10 md:px-14 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[10px] md:text-sm tracking-widest rounded-xl md:rounded-2xl shadow-3xl gap-3 border-none transition-all active:scale-95">
                  <Link href="/mocks">Start Free Mock <ArrowRight className="h-5 w-5" /></Link>
               </Button>
               <Button asChild variant="outline" className="h-14 md:h-18 px-10 md:px-14 border-white/20 bg-white/5 text-white hover:bg-white/10 font-black uppercase text-[10px] md:text-sm tracking-widest rounded-xl md:rounded-2xl shadow-xl transition-all active:scale-95">
                  <Link href="/exams">Explore Exams</Link>
               </Button>
            </div>
         </div>
      </div>

      {/* 3. INSTITUTIONAL STATS HUB - BOTTOM ANCHORED */}
      <div className="w-full bg-[#050B19] py-8 md:py-16">
         <div className="container mx-auto px-4 md:px-16 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
               <StatCard icon={<BookOpen />} label="QUESTIONS" val="50k+" color="text-blue-500" />
               <StatCard icon={<ClipboardList />} label="MOCK TESTS" val="500+" color="text-orange-500" />
               <StatCard icon={<ShieldCheck />} label="ASPIRANTS" val="15k+" color="text-emerald-500" />
               <StatCard icon={<BarChart3 />} label="ACCURACY" val="94%" color="text-indigo-500" />
            </div>
         </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, val, color }: any) {
   return (
      <div className="p-5 md:p-8 bg-white/[0.03] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] space-y-3 shadow-inner group hover:bg-white/[0.05] transition-all text-left">
         <div className={cn("h-8 w-8 md:h-12 md:w-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform", color)}>
            {React.cloneElement(icon, { className: "h-4 w-4 md:h-6 md:w-6" })}
         </div>
         <div className="space-y-0.5">
            <p className="text-xl md:text-4xl font-headline font-black text-white leading-none tracking-tighter">{val}</p>
            <p className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
         </div>
      </div>
   )
}
