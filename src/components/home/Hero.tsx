'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, BookOpen, ClipboardList, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Unified Hero Node v22.0.
 * MATCHED: Content (Text + Stats) layered over Golden Temple background.
 * SHADING: Sky-blue Punjab map watermark on the left.
 * POSITIONING: Top-Left anchored text, Bottom-anchored stats.
 */

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goldenTempleImg = "https://i.ibb.co/LXgcLVVq/Gemini-Generated-Image-n1so6on1so6on1so.png";
  const punjabMap = "https://www.mapsofindia.com/maps/punjab/punjab-map.jpg";

  if (!mounted) {
    return <section className="w-full h-[500px] bg-[#020817]" />;
  }

  return (
    <section className="relative w-full overflow-hidden flex flex-col bg-[#020817] min-h-[600px] md:min-h-[700px]">
      
      {/* 1. UNIFIED BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
         {/* BASE: GOLDEN TEMPLE */}
         <img 
            src={goldenTempleImg} 
            alt="Golden Temple" 
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
         />

         {/* OVERLAY: SKY BLUE SHADING (LEFT) */}
         <div className="absolute left-0 top-0 h-full w-full md:w-[70%] bg-gradient-to-r from-sky-100/90 via-sky-50/50 to-transparent z-10" />

         {/* OVERLAY: PUNJAB MAP WATERMARK (LEFT) */}
         <div className="absolute left-0 top-0 h-full w-full md:w-[40%] z-20 pointer-events-none opacity-[0.12] mix-blend-multiply">
            <img 
               src={punjabMap} 
               className="w-full h-full object-contain object-left" 
               alt="Punjab Map overlay"
            />
         </div>
      </div>

      {/* 2. CONTENT HUB - ALL LAYERED OVER BACKGROUND */}
      <div className="container mx-auto px-4 md:px-16 max-w-7xl relative z-30 flex flex-col justify-between flex-1 py-12 md:py-20">
         
         {/* TOP-LEFT BRAND AREA */}
         <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-xl text-left space-y-6 md:space-y-8"
         >
            {/* BRAND BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/20 shadow-sm">
               <Star className="h-3 w-3 text-[#F97316] fill-current" />
               <span className="text-[8px] md:text-[10px] font-black text-[#0F172A] uppercase tracking-widest">#1 Punjab Exam Preparation Platform</span>
            </div>

            {/* HEADLINES */}
            <div className="space-y-1 md:space-y-2">
               <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-headline font-black text-[#0F172A] leading-none tracking-tighter uppercase">
                  PREPARE SMARTER.
               </h1>
               <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-headline font-black text-[#F97316] leading-none tracking-tighter uppercase">
                  SCORE HIGHER.
               </h1>
            </div>

            <p className="text-[#0F172A] font-bold uppercase text-[9px] md:text-sm tracking-[0.2em] max-w-md leading-relaxed antialiased opacity-90">
               Official CBT engine verified by <br className="hidden md:block" />
               Arsh Grewal Management.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
               <Button asChild className="h-10 md:h-16 px-6 md:px-12 bg-[#F97316] hover:bg-orange-600 text-white font-black uppercase text-[9px] md:text-xs tracking-widest rounded-xl md:rounded-2xl shadow-3xl border-none transition-all active:scale-95">
                  <Link href="/mocks">Start Free Mock <ArrowRight className="h-4 w-4 ml-1" /></Link>
               </Button>
               <Button asChild variant="outline" className="h-10 md:h-16 px-6 md:px-12 border-[#0F172A]/20 bg-white/30 backdrop-blur-md text-[#0F172A] hover:bg-white/50 font-black uppercase text-[9px] md:text-xs tracking-widest rounded-xl md:rounded-2xl shadow-xl transition-all active:scale-95">
                  <Link href="/exams">Explore Exams</Link>
               </Button>
            </div>
         </motion.div>

         {/* BOTTOM STATS AREA - NO WHITE BACKGROUND */}
         <div className="pt-12 md:pt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
               <StatCard icon={<BookOpen />} label="QUESTIONS" val="50k+" color="text-blue-600" />
               <StatCard icon={<ClipboardList />} label="MOCK TESTS" val="500+" color="text-[#F97316]" />
               <StatCard icon={<ShieldCheck />} label="ASPIRANTS" val="15k+" color="text-emerald-600" />
               <StatCard icon={<BarChart3 />} label="ACCURACY" val="94%" color="text-indigo-600" />
            </div>
         </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, val, color }: any) {
   return (
      <div className="p-4 md:p-8 bg-white/20 backdrop-blur-sm border border-white/20 rounded-[1.5rem] md:rounded-[2.5rem] space-y-3 shadow-inner group hover:bg-white/40 transition-all text-left">
         <div className={cn("h-8 w-8 md:h-12 md:w-12 rounded-xl bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm", color)}>
            {React.cloneElement(icon, { className: "h-4 w-4 md:h-6 md:w-6" })}
         </div>
         <div className="space-y-0.5">
            <p className="text-xl md:text-4xl font-headline font-black text-[#0F172A] leading-none tracking-tighter">{val}</p>
            <p className="text-[7px] md:text-[10px] font-black text-[#0F172A]/60 uppercase tracking-widest">{label}</p>
         </div>
      </div>
   )
}
