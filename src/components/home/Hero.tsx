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
  Landmark,
  Zap,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";
import PWAInstallButton from "@/components/PWAInstallButton";

/**
 * @fileOverview Original Majestic Hero Center (Restored).
 * Re-integrates the Golden Temple background with institutional branding.
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
      if (num >= 1000) return (num / 1000).toFixed(0) + 'k+';
      return num.toString() + '+';
    };

    return [
      { id: 'q', icon: <Zap className="text-primary h-5 w-5" />, val: formatNumber(stats?.totalQuestions, "50k+"), label: "QUESTIONS" },
      { id: 'm', icon: <ClipboardList className="text-blue-400 h-5 w-5" />, val: formatNumber(stats?.totalMocks, "500+"), label: "MOCKS" },
      { id: 'e', icon: <ShieldCheck className="text-emerald-500 h-5 w-5" />, val: formatNumber(stats?.totalBoards, "50+"), label: "EXAMS" },
      { id: 'u', icon: <Users className="text-primary h-5 w-5" />, val: formatNumber(stats?.totalUsers, "15k+"), label: "ASPIRANTS" }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-[#050B19] overflow-hidden min-h-[600px] lg:h-[750px] flex flex-col justify-center text-left border-b border-white/5">
      
      {/* BACKGROUND IMAGE - Majestic Restoration */}
      <div className="absolute top-0 right-0 w-full lg:w-[65%] h-full z-0 overflow-hidden">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          src="https://i.ibb.co/fYJttX5d/Gemini-Generated-Image-n1so6on1so6on1so.png" 
          alt="Official Punjab Prep Center" 
          className="w-full h-full object-contain lg:object-right-top"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B19]/20 via-[#050B19]/40 to-[#050B19] z-[10]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B19] via-[#050B19]/90 to-transparent z-[10] hidden lg:block" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl relative z-[30]">
         <div className="max-w-3xl space-y-6 md:space-y-8">
            
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2"
            >
               <Star className="h-4 w-4 text-primary fill-current animate-pulse" />
               <span className="text-[10px] md:text-xs font-black text-white tracking-[0.3em] uppercase">OFFICIAL PUNJAB EXAM CENTER</span>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="space-y-2"
            >
               <h1 className="text-4xl md:text-7xl font-headline font-black text-white leading-[0.95] tracking-tighter uppercase">
                  Prepare smarter.
               </h1>
               <h1 className="text-4xl md:text-7xl font-headline font-black text-primary leading-[0.95] tracking-tighter uppercase">
                  Score higher.
               </h1>
            </motion.div>

            <motion.p
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-base md:text-xl text-slate-400 font-medium max-w-2xl leading-relaxed antialiased"
            >
               Punjab Government Exams di Complete Preparation ik hi Center te. <br className="hidden sm:block" />
               Unlock verified mocks, study notes, and AI solutions today.
            </motion.p>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex flex-wrap gap-4 pt-4"
            >
               <Button asChild className="h-14 md:h-18 px-10 md:px-14 bg-primary hover:bg-orange-600 text-white font-black text-xs md:text-sm tracking-[0.15em] rounded-2xl shadow-3xl transition-all border-none uppercase active:scale-95 group">
                  <Link href="/mocks" className="flex items-center gap-3">
                     Free Mock Test <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </Button>
               
               <Button asChild variant="outline" className="h-14 md:h-18 px-10 md:px-14 border-white/20 bg-white/5 text-white font-black text-xs md:text-sm tracking-[0.15em] rounded-2xl transition-all backdrop-blur-md hover:bg-white/10 uppercase active:scale-95">
                  <Link href="/exams">
                     Exams List
                  </Link>
               </Button>
            </motion.div>
         </div>
      </div>

      {/* TRUST STRIP - RESTORED BASE */}
      <div className="mt-12 md:mt-24 z-[40]">
         <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
               {liveStats.map((stat, idx) => (
                  <motion.div
                     key={stat.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4 + (idx * 0.1) }}
                  >
                     <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[2rem] text-left flex items-center gap-4 md:gap-6 group hover:bg-white/10 transition-all duration-500 shadow-2xl overflow-hidden h-24 md:h-32">
                        <div className="shrink-0 h-10 w-10 md:h-14 md:w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
                           {stat.icon}
                        </div>
                        <div className="min-w-0">
                           <p className="text-2xl md:text-4xl font-headline font-black text-white tabular-nums leading-none mb-1">{stat.val}</p>
                           <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] truncate">
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
