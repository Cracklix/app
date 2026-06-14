'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, BookOpen, ClipboardList, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * @fileOverview Hardened Unified Hero v705.0.
 * FIXED: Hydration mismatch by using a stable mounted guard.
 * FIXED: Removed shading from Golden Temple for clear visibility.
 * SIZING: 200px mobile height for the image hub.
 */

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Standard background assets
  const goldenTempleImg = "https://i.ibb.co/LXgcLVVq/Gemini-Generated-Image-n1so6on1so6on1so.png";
  const punjabMap = "https://www.mapsofindia.com/maps/punjab/punjab-map.jpg";

  if (!mounted) {
    return (
      <section className="w-full bg-[#050B19] flex flex-col min-h-[400px]">
        <div className="w-full h-[200px] md:h-[400px] bg-[#050B19]" />
      </section>
    );
  }

  return (
    <section className="relative w-full bg-[#050B19] overflow-hidden flex flex-col text-left">
      
      {/* 1. IMAGE HUB - 200PX MOBILE HEIGHT - CLEAR VISIBILITY */}
      <div className="relative w-full h-[200px] md:h-[400px] overflow-hidden">
         <div className="absolute inset-0 z-0">
            <img 
              src={goldenTempleImg} 
              alt="Golden Temple" 
              className="w-full h-full object-cover object-top transition-opacity duration-1000"
              referrerPolicy="no-referrer"
            />
            {/* Soft bottom transition only */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050B19] via-transparent to-transparent opacity-60" />
         </div>

         {/* TOP BADGE */}
         <div className="absolute bottom-6 left-4 md:left-12 z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
               <div className="h-4 w-4 md:h-5 md:w-5 rounded-full bg-primary/20 flex items-center justify-center">
                 <Star className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary fill-current" />
               </div>
               <span className="text-[7.5px] md:text-xs font-black text-white uppercase tracking-widest">#1 Punjab Exam Preparation Platform</span>
            </div>
         </div>
      </div>

      {/* 2. CONTENT HUB - SOLID DARK BACK */}
      <div className="bg-[#050B19] relative z-20 pb-12 md:pb-32 -mt-0.5">
         {/* PUNJAB MAP WATERMARK */}
         <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay overflow-hidden">
            <img 
              src={punjabMap} 
              className="w-full h-full object-cover grayscale invert" 
              alt="Geographical Node"
            />
         </div>

         <div className="container mx-auto px-4 md:px-12 lg:px-16 max-w-[1440px] relative z-10">
            <div className="pt-6 md:pt-12 space-y-2 md:space-y-4">
               <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[28px] sm:text-5xl md:text-7xl lg:text-[90px] font-headline font-black text-white leading-none tracking-tighter uppercase"
               >
                  Prepare Smarter.
               </motion.h1>
               <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[28px] sm:text-5xl md:text-7xl lg:text-[90px] font-headline font-black text-primary leading-none tracking-tighter uppercase"
               >
                  Score Higher.
               </motion.h1>
            </div>

            <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="text-slate-400 font-bold uppercase text-[10px] md:text-lg tracking-[0.2em] mt-8 md:mt-10 max-w-xl leading-relaxed"
            >
               Punjab&apos;s most advanced CBT engine. <br className="hidden md:block" />
               Verified by Arsh Grewal Management.
            </motion.p>

            <div className="mt-10 md:mt-16 flex flex-wrap gap-4">
               <Button asChild className="h-14 md:h-18 px-8 md:px-12 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[10px] md:text-sm tracking-widest rounded-xl md:rounded-2xl shadow-3xl gap-3 border-none transition-all active:scale-95">
                  <Link href="/mocks">Start Free Mock <ArrowRight className="h-5 w-5" /></Link>
               </Button>
               <Button asChild variant="outline" className="h-14 md:h-18 px-8 md:px-12 border-white/10 bg-white/5 text-white hover:bg-white/10 font-black uppercase text-[10px] md:text-sm tracking-widest rounded-xl md:rounded-2xl shadow-xl transition-all active:scale-95">
                  <Link href="/exams">Explore Exams</Link>
               </Button>
            </div>

            {/* INSTITUTIONAL STATS - HIGH DENSITY */}
            <div className="mt-20 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
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
      <div className="p-5 md:p-8 bg-white/[0.03] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] space-y-3 md:space-y-4 shadow-inner group hover:bg-white/[0.05] transition-all">
         <div className={cn("h-8 w-8 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform", color)}>
            {React.cloneElement(icon, { className: "h-4 w-4 md:h-6 md:w-6" })}
         </div>
         <div className="space-y-0.5">
            <p className="text-xl md:text-4xl font-headline font-black text-white leading-none tracking-tighter">{val}</p>
            <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
         </div>
      </div>
   )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
