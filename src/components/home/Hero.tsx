
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
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";
import PWAInstallButton from "@/components/PWAInstallButton";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview High-Fidelity Hero Hub v250.0.
 * UPDATED: Integrated hero-student asset from registry.
 */

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const studentImg = PlaceHolderImages.find(img => img.id === 'hero-student')?.imageUrl || "https://picsum.photos/seed/student/800/800";

  const liveStats = useMemo(() => {
    const formatNumber = (num: number, fallback: string) => {
      if (!num) return fallback;
      if (num >= 1000) return (num / 1000).toFixed(0) + ',000+';
      return num.toString() + '+';
    };

    return [
      { id: 'q', icon: <BookOpen className="text-blue-400 h-4 w-4 md:h-5 md:w-5" />, val: formatNumber(stats?.totalQuestions, "439+"), label: "QUESTIONS" },
      { id: 'm', icon: <ClipboardList className="text-orange-400 h-4 w-4 md:h-5 md:w-5" />, val: formatNumber(stats?.totalMocks, "8+"), label: "MOCKS" },
      { id: 'e', icon: <ShieldCheck className="text-blue-500 h-4 w-4 md:h-5 md:w-5" />, val: formatNumber(stats?.totalBoards, "92+"), label: "EXAMS" },
      { id: 'u', icon: <Users className="text-emerald-400 h-4 w-4 md:h-5 md:w-5" />, val: formatNumber(stats?.totalUsers, "5+"), label: "ASPIRANTS" }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-[#050B19] overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col justify-center text-left border-b border-white/5 pb-12">
      
      {/* BACKGROUND ASSET HUB */}
      <div className="absolute top-0 right-0 h-full w-full md:w-1/2 z-0 overflow-hidden pointer-events-none">
        <motion.img 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ duration: 1.5 }}
          src={studentImg}
          data-ai-hint="student studying"
          alt="Official Punjab Prep Student" 
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B19] via-[#050B19]/80 to-transparent z-[10]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B19]/20 to-[#050B19] z-[10]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl relative z-[30]">
         <div className="max-w-3xl space-y-6 md:space-y-8">
            
            <motion.div
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2"
            >
               <Star className="h-4 w-4 text-[#F97316] fill-current animate-pulse" />
               <span className="text-[10px] md:text-xs font-black text-white tracking-[0.2em] uppercase">#1 PUNJAB PREP PLATFORM</span>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="space-y-1 md:space-y-2"
            >
               <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-headline font-black text-white leading-[1.05] tracking-tighter uppercase">
                  Crack Punjab <br/>
                  <span className="text-[#F97316]">Exams Now.</span>
               </h1>
            </motion.div>

            <motion.p
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-base md:text-xl lg:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed antialiased"
            >
               Practice with high-fidelity bilingual mock tests, previous year papers, and official patterns.
            </motion.p>

            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex flex-wrap gap-4 pt-6"
            >
               <Button asChild className="h-14 md:h-16 px-10 md:px-14 bg-[#F97316] hover:bg-orange-600 text-white font-black text-[11px] md:text-xs tracking-[0.2em] rounded-2xl shadow-3xl transition-all border-none uppercase active:scale-95">
                  <Link href="/mocks" className="flex items-center gap-3">
                     Free Mock Test <ArrowRight className="h-5 w-5" />
                  </Link>
               </Button>
               
               <PWAInstallButton 
                className="h-14 md:h-16 px-8 md:px-10 bg-white text-[#0B1528] hover:bg-slate-100 font-black text-[11px] md:text-xs tracking-[0.2em] rounded-2xl shadow-3xl border-none"
               />
            </motion.div>
         </div>

         {/* LIVE TRUST REGISTRY */}
         <div className="mt-16 md:mt-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
               {liveStats.map((stat, idx) => (
                  <motion.div
                     key={stat.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4 + (idx * 0.1) }}
                  >
                     <Card className="bg-[#0B1528]/60 backdrop-blur-xl border border-white/5 p-4 md:p-6 rounded-[2rem] text-left flex items-center gap-4 group hover:bg-[#0B1528] transition-all duration-300 shadow-2xl overflow-hidden">
                        <div className="shrink-0 h-10 w-10 md:h-14 md:w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
                           {stat.icon}
                        </div>
                        <div className="min-w-0 flex flex-col justify-center">
                           <p className="text-2xl md:text-4xl font-headline font-black text-white tabular-nums leading-none mb-1">{stat.val}</p>
                           <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] truncate">
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
