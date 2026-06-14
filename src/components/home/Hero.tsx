'use client';

import React from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, Download, BookOpen, ClipboardList, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Absolute Screenshot-Matched Hero Hub v71.0.
 * FIXED: Added missing Card import to resolve ReferenceError.
 * DATA: 439+ Questions, 8+ Mocks, 92+ Exams, 5+ Aspirants.
 */

export default function Hero() {
  const templeImg = "https://i.ibb.co/LXgcLVVq/Gemini-Generated-Image-n1so6on1so6on1so.png";

  return (
    <section className="relative w-full min-h-[700px] lg:min-h-[850px] bg-[#0B0F19] flex flex-col justify-start overflow-hidden font-body text-left">
      
      {/* 1. BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 right-0 w-full lg:w-[60%] h-[70%] lg:h-[80%] pointer-events-none">
           <img 
              src={templeImg} 
              alt="Golden Temple" 
              className="w-full h-full object-cover object-bottom opacity-80"
              referrerPolicy="no-referrer"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent lg:block hidden" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent lg:hidden" />
        </div>
      </div>

      {/* 2. MAIN CONTENT HUB */}
      <div className="container mx-auto px-6 relative z-10 max-w-7xl pt-16 md:pt-24">
        <div className="max-w-4xl space-y-6 md:space-y-8 text-left">
          
           {/* BRAND BADGE */}
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
           >
              <div className="h-4 w-4 bg-[#F97316]/20 rounded-full flex items-center justify-center">
                <Star className="h-2.5 w-2.5 text-[#F97316] fill-current" />
              </div>
              <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">
                 ★ #1 PUNJAB PREP PLATFORM
              </span>
           </motion.div>

           {/* HEADLINES */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="space-y-1"
           >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-headline font-black text-white leading-[0.9] tracking-tighter uppercase">
                 PREPARE SMARTER.
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-headline font-black text-[#F97316] leading-[0.9] tracking-tighter uppercase">
                 SCORE HIGHER.
              </h1>
           </motion.div>

           {/* SUBTEXT */}
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-sm md:text-lg lg:text-xl text-white font-medium max-w-2xl leading-relaxed antialiased opacity-90"
           >
              Punjab Government Exams di Complete Preparation <br className="hidden md:block" />
              ik hi Center te, Latest Official Patterns de Naal.
           </motion.p>

           {/* ACTIONS - SCREENSHOT MATCHED */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="flex flex-wrap items-center gap-3 md:gap-4 pt-6 md:pt-10"
           >
              <Button asChild className="h-12 md:h-14 px-8 bg-[#F97316] hover:bg-orange-600 text-white font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] rounded-xl shadow-3xl transition-all active:scale-95 border-none gap-2">
                 <Link href="/mocks">
                    FREE MOCK <ArrowRight className="h-4 w-4" />
                 </Link>
              </Button>
              <Button asChild className="h-12 md:h-14 px-8 bg-white hover:bg-slate-50 text-[#0F172A] font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] rounded-xl transition-all active:scale-95 border-none gap-2 shadow-xl">
                 <Link href="/download">
                    <Download className="h-4 w-4" /> INSTALL APP
                 </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 md:h-14 px-10 bg-white/5 border-white/10 text-white hover:bg-white/10 font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] rounded-xl transition-all active:scale-95">
                 <Link href="/exams">EXAMS</Link>
              </Button>
           </motion.div>

           {/* METRICS GRID - SCREENSHOT MATCHED */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-16 md:pt-24"
           >
              <MetricCard 
                icon={<BookOpen className="text-blue-400 h-5 w-5" />} 
                count="439+" 
                label="QUESTIONS" 
              />
              <MetricCard 
                icon={<ClipboardList className="text-orange-400 h-5 w-5" />} 
                count="8+" 
                label="MOCKS" 
              />
              <MetricCard 
                icon={<ShieldCheck className="text-blue-500 h-5 w-5" />} 
                count="92+" 
                label="EXAMS" 
              />
              <MetricCard 
                icon={<Users className="text-emerald-500 h-5 w-5" />} 
                count="5+" 
                label="ASPIRANTS" 
              />
           </motion.div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ icon, count, label }: { icon: React.ReactNode, count: string, label: string }) {
  return (
    <Card className="border-none bg-[#111827]/80 backdrop-blur-xl rounded-[2rem] p-5 md:p-8 flex items-center gap-4 md:gap-6 border border-white/5 shadow-2xl group hover:bg-[#111827] transition-all">
       <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <div className="text-left space-y-0.5">
          <p className="text-xl md:text-3xl font-headline font-black text-white leading-none tracking-tight">{count}</p>
          <p className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
       </div>
    </Card>
  )
}
