'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  ArrowRight,
  ClipboardList,
  ShieldCheck,
  Star,
  Users,
  LayoutGrid,
  FileText,
  MousePointer2,
  CheckCircle2,
  Newspaper,
  BookOpen,
  Landmark,
  GraduationCap,
  Trophy,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";
import Image from "next/image";
import { LogoIcon } from "@/components/brand/Logo";

/**
 * @fileOverview Final Redesigned Hero Center v3.0.
 * UPDATED: Uses local /images/hero-student.png and matches the premium SaaS wireframe.
 * REMOVED: All old orange-heavy styles and external background URLs.
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
      if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
      return num.toString() + '+';
    };

    return [
      { id: 'q', icon: <Zap className="text-white h-5 w-5" />, val: formatNumber(stats?.totalQuestions, "50K+"), label: "Questions", sub: "High quality practice questions", color: "bg-blue-600" },
      { id: 'm', icon: <ClipboardList className="text-white h-5 w-5" />, val: formatNumber(stats?.totalMocks, "500+"), label: "Mock Tests", sub: "Topic wise & full length mocks", color: "bg-purple-600" },
      { id: 'e', icon: <ShieldCheck className="text-white h-5 w-5" />, val: formatNumber(stats?.totalBoards, "50+"), label: "Exams", sub: "All major Punjab exams", color: "bg-green-600" },
      { id: 'u', icon: <Users className="text-white h-5 w-5" />, val: formatNumber(stats?.totalUsers, "15K+"), label: "Aspirants", sub: "Trust Cracklix for preparation", color: "bg-orange-600" }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-[#F8FAFC] overflow-hidden pt-8 pb-12 md:py-20 border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-16 items-start">
          
          {/* LEFT: CONTENT HUB */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* 1. Trust Badge */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm"
            >
               <div className="bg-blue-600 rounded-full p-1">
                 <Star className="h-3 w-3 text-white fill-current" />
               </div>
               <span className="text-[10px] md:text-xs font-black text-slate-700 tracking-tight">10,000+ Aspirants Trust Cracklix</span>
            </motion.div>

            {/* 2. Main Heading */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="space-y-4"
            >
               <h1 className="text-4xl md:text-7xl font-black text-[#0F172A] leading-[1.05] tracking-tighter uppercase">
                  Crack Punjab <br/>
                  <span className="text-blue-600">Government Exams</span> <br/>
                  With Confidence
               </h1>
               <p className="text-base md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                  Practice bilingual mock tests and prepare for Punjab Government Exams with confidence. Access exam-focused practice, previous papers and performance tracking in one place.
               </p>
            </motion.div>

            {/* 3. Category Pills */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="flex flex-wrap gap-2 md:gap-3"
            >
               {['PSSSB', 'Punjab Police', 'PSTET', 'PSPCL', 'PPSC'].map((p) => (
                  <div key={p} className="px-5 py-2 bg-white border border-slate-200 rounded-full text-[10px] md:text-xs font-black text-slate-600 shadow-sm uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer">
                     {p}
                  </div>
               ))}
            </motion.div>

            {/* 4. CTA Action Bar */}
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex flex-col sm:flex-row gap-4 pt-4"
            >
               <Button asChild className="h-14 md:h-16 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] md:text-sm tracking-widest rounded-2xl shadow-4xl border-none uppercase group">
                  <Link href="/mocks" className="flex items-center justify-center w-full gap-4">
                     <span>Start Free Mock Test</span>
                     <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </Button>
               <Button asChild variant="outline" className="h-14 md:h-16 px-8 border-2 border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600 font-black text-[11px] md:text-sm tracking-widest rounded-2xl uppercase group transition-all bg-white shadow-sm">
                  <Link href="/exams" className="flex items-center justify-center w-full gap-4">
                     <span>Browse Exams</span>
                     <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </Button>
            </motion.div>

            {/* 5. Feature Hub (Row of 4) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
               <MiniFeatureCard icon={<ClipboardList className="text-blue-600" />} label="Mock Tests" sub="Exam-focused" color="bg-blue-50" />
               <MiniFeatureCard icon={<FileText className="text-green-600" />} label="Punjab Exams" sub="Latest Patterns" color="bg-green-50" />
               <MiniFeatureCard icon={<Zap className="text-purple-600" />} label="Previous Papers" sub="Verified Papers" color="bg-purple-50" />
               <MiniFeatureCard icon={<Landmark className="text-orange-600" />} label="Free Practice" sub="Daily Updates" color="bg-orange-50" />
            </div>
          </div>

          {/* RIGHT: ILLUSTRATION HUB */}
          <div className="lg:col-span-5 relative flex justify-center items-center mt-12 lg:mt-0 px-4">
             <div className="relative w-full max-w-[520px]">
                {/* Main Student Visual - LOCAL ASSET */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative z-10"
                >
                   <img 
                     src="/images/hero-student.png" 
                     alt="Cracklix Student" 
                     className="w-full h-auto drop-shadow-2xl"
                     data-ai-hint="student studying"
                   />
                </motion.div>

                {/* Floating Action Cards */}
                <FloatingIconCard icon={<ClipboardList className="text-blue-600" />} label="Mock Tests" className="top-[10%] left-[-5%]" delay={0.4} />
                <FloatingIconCard icon={<Zap className="text-purple-600" />} label="Previous Papers" className="bottom-[15%] left-[-10%]" delay={0.6} />
                <FloatingIconCard icon={<FileText className="text-green-600" />} label="Punjab Exams" className="top-[25%] right-[-5%]" delay={0.5} />
                <FloatingIconCard icon={<Trophy className="text-orange-600" />} label="Free Practice" className="bottom-[10%] right-[-10%]" delay={0.7} />

                {/* Background Blobs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-500/5 blur-[100px] rounded-full -z-0" />
             </div>
          </div>
        </div>

        {/* BOTTOM: STATS REGISTRY */}
        <div className="mt-16 md:mt-24">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {liveStats.map((stat, idx) => (
                 <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                 >
                    <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] text-left flex items-center gap-6 group hover:shadow-2xl transition-all duration-500 shadow-xl shadow-slate-200/50">
                       <div className={cn("shrink-0 h-16 w-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-slate-200/50", stat.color)}>
                          {stat.icon}
                       </div>
                       <div className="min-w-0">
                          <p className="text-3xl md:text-4xl font-black text-[#0F172A] tabular-nums leading-none mb-1">{stat.val}</p>
                          <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{stat.label}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">{stat.sub}</p>
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

function MiniFeatureCard({ icon, label, sub, color }: { icon: React.ReactNode, label: string, sub: string, color: string }) {
   return (
      <div className={cn("p-5 rounded-2xl flex flex-col gap-3 border border-slate-100 shadow-sm bg-white hover:shadow-md transition-all group cursor-pointer")}>
         <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0 mb-1 group-hover:scale-110 transition-transform", color)}>
            {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6" })}
         </div>
         <div className="text-left space-y-0.5">
            <p className="text-[11px] font-black text-[#0F172A] uppercase leading-tight">{label}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight line-clamp-1">{sub}</p>
         </div>
      </div>
   )
}

function FloatingIconCard({ icon, label, className, delay }: { icon: React.ReactNode, label: string, className: string, delay: number }) {
   return (
      <motion.div 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay, duration: 1 }}
         whileHover={{ y: -5, scale: 1.05 }}
         className={cn("absolute z-20 bg-white rounded-2xl shadow-2xl p-4 flex flex-col items-center gap-2 border border-slate-50 min-w-[120px]", className)}
      >
         <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
            {icon}
         </div>
         <span className="font-black text-[9px] uppercase text-[#0F172A] tracking-widest text-center">{label}</span>
      </motion.div>
   )
}
