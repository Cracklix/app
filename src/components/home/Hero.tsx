'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Landmark, 
  FileStack, 
  ArrowRight,
  Star,
  ChevronRight,
  BookOpen,
  ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import imagePool from '@/app/lib/placeholder-images.json';

/**
 * @fileOverview Official Cracklix High-Fidelity Hero v18.0.
 * FIXED: 'motion/react' import resolution error to 'framer-motion'.
 * FIXED: Floating nodes layout as per strict 5-element specification (Center + 4 Corners).
 */

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroImage = useMemo(() => {
    return imagePool.placeholderImages.find(img => img.id === 'hero-student')?.imageUrl || "https://picsum.photos/seed/student-hero/800/800";
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] pt-12 pb-24 md:pt-20 md:pb-32 border-b border-slate-100 text-left w-full max-w-full overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* 1. TEXT COLUMN (Left Side Desktop) */}
          <div className="space-y-8 z-20 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mx-auto lg:mx-0">
              <Star className="h-4 w-4 text-blue-600 fill-current" />
              <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-widest">10,000+ Aspirants Trust Cracklix</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05] antialiased">
                Your Journey to <br />
                <span className="text-blue-600">Government Job</span> <br />
                Starts Here!
              </h1>
              
              <p className="text-base md:text-xl text-slate-600 font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
                Practice with high-quality mock tests, previous papers and exam-focused preparation for top Punjab exams.
              </p>

              {/* Recruitment Board Registry Pill */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                {["PSSSB", "Punjab Police", "PSTET", "PSPCL", "PPSC"].map((pill) => (
                  <Link key={pill} href="/exams">
                    <div className="bg-white border border-blue-600 text-blue-600 px-5 py-2 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest shadow-sm hover:bg-blue-50 transition-all active:scale-95">
                      {pill}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Action Hub */}
            <div className="hidden lg:flex flex-wrap gap-4 pt-4">
              <Button asChild className="h-16 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 gap-3 border-none transition-all active:scale-95">
                <Link href="/mocks">Start Free Mock Test <ArrowRight className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>

          {/* 2. ILLUSTRATION COLUMN (The 5-Element Preparation Hub) */}
          <div className="relative flex items-center justify-center lg:justify-end py-16 md:py-24 lg:py-0 w-full">
             <div className="relative w-full max-w-[380px] md:max-w-[550px] lg:max-w-[620px] aspect-square flex items-center justify-center">
                
                {/* Visual Anchor: Symmetrical Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-100/40 rounded-full blur-[80px] md:blur-[120px] -z-10" />
                
                {/* CENTER NODE: Student Illustration */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="relative z-10 w-[85%] h-[85%] flex items-center justify-center"
                >
                   <img 
                     src={heroImage}
                     className="w-full h-auto drop-shadow-2xl object-contain" 
                     alt="Cracklix Student Hub" 
                     data-ai-hint="student studying"
                   />
                </motion.div>

                {/* CORNER NODES: Floating Action Matrix */}
                
                {/* Top Left: Mock Tests (Elevation Lock) */}
                <FloatingNode 
                   position="top-[2%] left-[-2%] md:left-[-8%]"
                   icon={<Zap className="h-5 w-5 text-blue-500 fill-current" />}
                   title="Mock Tests"
                   desc="Latest Pattern"
                   delay={0.2}
                />

                {/* Bottom Left: Daily Practice (Base Lock) */}
                <FloatingNode 
                   position="bottom-[5%] left-[-2%] md:left-[-8%]"
                   icon={<Target className="h-5 w-5 text-purple-600" />}
                   title="Daily Practice"
                   desc="Subject mastery"
                   delay={0.4}
                />

                {/* Top Right: Punjab Exams (Elevation Lock) */}
                <FloatingNode 
                   position="top-[2%] right-[-2%] md:right-[-8%]"
                   icon={<Landmark className="h-5 w-5 text-orange-500" />}
                   title="Punjab Exams"
                   desc="All state boards"
                   delay={0.6}
                />

                {/* Bottom Right: Previous Papers (Base Lock) */}
                <FloatingNode 
                   position="bottom-[5%] right-[-2%] md:right-[-8%]"
                   icon={<FileStack className="h-5 w-5 text-emerald-600" />}
                   title="Previous Papers"
                   desc="Official PYQ Bank"
                   delay={0.8}
                />
             </div>
          </div>
        </div>

        {/* 3. MOBILE ACTION HUB (PWA/Compact Optimized) */}
        <div className="flex flex-col gap-3 w-full lg:hidden mt-12">
          <Button asChild className="h-14 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black text-xs tracking-widest shadow-xl border-none transition-all active:scale-95">
            <Link href="/exams" className="flex items-center justify-between w-full px-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-white" />
                <span>Start Learning</span>
              </div>
              <ChevronRight className="h-4 w-4 text-white/60" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-14 w-full bg-white border-2 border-slate-100 rounded-full font-black text-xs tracking-widest shadow-sm transition-all active:scale-95 hover:bg-slate-50">
            <Link href="/mocks" className="flex items-center justify-between w-full px-6">
               <div className="flex items-center gap-3">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                  <span>Take Free Mock Test</span>
               </div>
               <ChevronRight className="h-4 w-4 text-slate-300" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}

/**
 * @fileOverview Individual preparation node card with motion.
 */
function FloatingNode({ position, icon, title, desc, delay }: { position: string, icon: React.ReactNode, title: string, desc: string, delay: number }) {
   return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8 }}
        className={cn(
           "absolute z-20 w-[130px] sm:w-[150px] md:w-[190px] lg:w-[210px] pointer-events-auto",
           position
        )}
      >
         <Card className="p-2.5 md:p-5 rounded-2xl md:rounded-[2rem] bg-white/95 backdrop-blur-xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex items-center gap-3 md:gap-4 transition-all hover:scale-105 hover:shadow-[0_25px_60px_rgba(37,99,235,0.15)] group cursor-default">
            <div className="h-9 w-9 md:h-12 md:w-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-50 transition-colors">
               {icon}
            </div>
            <div className="text-left min-w-0">
               <p className="text-[9px] md:text-sm font-black text-slate-900 uppercase tracking-tighter truncate leading-none mb-1 group-hover:text-blue-600 transition-colors">{title}</p>
               <p className="text-[6px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none truncate">{desc}</p>
            </div>
         </Card>
      </motion.div>
   )
}
