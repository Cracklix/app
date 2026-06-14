'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, BookOpen, ClipboardList, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Hardened Unified Hero v12.0.
 * UPDATED: Reduced height and restored box text style for better legibility.
 * POSITIONING: Text in a dark box container at top-left. Map on left. Temple on right.
 */

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goldenTempleImg = "https://i.ibb.co/LXgcLVVq/Gemini-Generated-Image-n1so6on1so6on1so.png";
  const punjabMap = "https://www.mapsofindia.com/maps/punjab/punjab-map.jpg";

  if (!mounted) {
    return <section className="w-full bg-[#050B19] h-[400px]" />;
  }

  return (
    <section className="relative w-full min-h-[450px] md:min-h-[600px] bg-[#050B19] overflow-hidden flex flex-col">
      
      {/* 1. UNIFIED BACKGROUND LAYER - SPLIT MAP/TEMPLE */}
      <div className="absolute inset-0 z-0 flex h-[200px] md:h-full">
         {/* LEFT SIDE: MAP HUB */}
         <div className="relative w-full md:w-1/2 h-full bg-[#050B19]">
            <img 
              src={punjabMap} 
              className="w-full h-full object-cover opacity-40 grayscale invert contrast-125" 
              alt="Punjab Map"
            />
            {/* GRADIENT TO BLEND INTO BOX TEXT */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050B19]/60 to-transparent" />
         </div>
         
         {/* RIGHT SIDE: TEMPLE HUB - CLEAR AND UNIFORM */}
         <div className="relative w-full md:w-1/2 h-full">
            <img 
              src={goldenTempleImg} 
              alt="Golden Temple" 
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            {/* SUBTLE BLEND TO MAP AREA */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050B19] to-transparent" />
         </div>
      </div>

      {/* 2. CONTENT HUB - BOX TEXT RESTORED */}
      <div className="container mx-auto px-4 md:px-16 max-w-7xl relative z-10 pt-6 md:pt-16 flex-1 flex flex-col">
         <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl text-left space-y-6 md:space-y-8 bg-[#050B19]/80 backdrop-blur-md p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 shadow-5xl"
         >
            {/* BRAND BADGE */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
               <Star className="h-3 w-3 text-primary fill-current" />
               <span className="text-[8px] md:text-xs font-black text-white uppercase tracking-widest">#1 Punjab Exam Prep Node</span>
            </div>

            {/* HEADLINES */}
            <div className="space-y-2 md:space-y-3">
               <h1 className="text-[28px] sm:text-4xl md:text-6xl lg:text-7xl font-headline font-black text-white leading-none tracking-tighter uppercase">
                  PREPARE SMARTER.
               </h1>
               <h1 className="text-[28px] sm:text-4xl md:text-6xl lg:text-7xl font-headline font-black text-primary leading-none tracking-tighter uppercase">
                  SCORE HIGHER.
               </h1>
            </div>

            <p className="text-slate-400 font-bold uppercase text-[9px] md:text-base tracking-[0.2em] max-w-lg leading-relaxed antialiased">
               Punjab's most advanced CBT engine. <br className="hidden md:block" />
               Verified by Arsh Grewal Management.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-4 pt-2">
               <Button asChild className="h-12 md:h-16 px-8 md:px-10 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl md:rounded-2xl shadow-3xl border-none transition-all active:scale-95">
                  <Link href="/mocks">Start Free Mock <ArrowRight className="h-4 w-4" /></Link>
               </Button>
               <Button asChild variant="outline" className="h-12 md:h-16 px-8 md:px-10 border-white/20 bg-white/5 text-white hover:bg-white/10 font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl md:rounded-2xl shadow-xl transition-all active:scale-95">
                  <Link href="/exams">Explore Exams</Link>
               </Button>
            </div>
         </motion.div>
      </div>

      {/* 3. INSTITUTIONAL STATS HUB - BOTTOM ANCHORED */}
      <div className="w-full bg-[#050B19] py-8 md:py-12 border-t border-white/5 mt-6">
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
      <div className="p-4 md:p-6 bg-white/[0.02] border border-white/5 rounded-[1.2rem] md:rounded-[2rem] space-y-2 shadow-inner group hover:bg-white/[0.04] transition-all text-left">
         <div className={cn("h-7 w-7 md:h-10 md:w-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform", color)}>
            {React.cloneElement(icon, { className: "h-3.5 w-3.5 md:h-5 md:w-5" })}
         </div>
         <div className="space-y-0.5">
            <p className="text-lg md:text-3xl font-headline font-black text-white leading-none tracking-tighter">{val}</p>
            <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
         </div>
      </div>
   )
}
