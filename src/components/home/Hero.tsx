
'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  ChevronRight, 
  ClipboardList,
  ShieldCheck,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

/**
 * @fileOverview Definitive Full Background Hero v90.0.
 * FIXED: Background image set to full 1024x576 aspect ratio (no cropping).
 * FIXED: Header clipping resolved via pr-14 buffer for italic characters.
 */

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const displayStats = useMemo(() => {
    const qCount = stats?.totalQuestions || 10000;
    const mCount = stats?.totalMocks || 500;
    const eCount = stats?.totalExams || 50;
    const format = (n: number) => n >= 1000 ? `${(n/1000).toFixed(0)},000+` : `${n}+`;

    return [
      { label: "Questions", val: format(qCount), icon: <Zap className="h-5 w-5 text-primary" /> },
      { label: "Mock Tests", val: format(mCount), icon: <ClipboardList className="h-5 w-5 text-orange-400" /> },
      { label: "Exams Hub", val: format(eCount), icon: <ShieldCheck className="h-5 w-5 text-blue-400" /> },
      { label: "Avg. Accuracy", val: "94%", icon: <Target className="h-5 w-5 text-emerald-500" /> }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-[#020817] pt-20 pb-16 overflow-hidden">
      {/* 1024x576 FULL RATIO CONTAINER */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-10 md:space-y-12 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl"
            >
              <Star className="h-4 w-4 text-orange-500 fill-current" />
              <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">
                Punjab's #1 Exam Preparation Hub
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                <span className="block pr-14">Prepare Smarter.</span>
                <span className="text-primary italic pr-14">GOVT EXAMS.</span>
              </h1>
              <p className="text-base md:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed pr-10">
                Complete Preparation for PSSSB, Punjab Police & PPSC. High-Fidelity Mocks and Step-by-Step Logic Solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              <Button asChild className="h-16 md:h-20 px-10 md:px-14 bg-primary hover:bg-orange-600 text-white font-black uppercase text-xs md:text-sm tracking-[0.2em] rounded-2xl shadow-4xl gap-4 border-none transition-all active:scale-95">
                <Link href="/mocks">
                  Start Free Mock <Zap className="h-5 w-5 md:h-6 md:w-6 fill-current" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 md:h-20 px-10 md:px-14 border-white/20 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-xs md:text-sm tracking-[0.2em] rounded-2xl transition-all backdrop-blur-md">
                <Link href="/exams">
                  Explore Hubs
                </Link>
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
               {displayStats.map((s, i) => (
                  <div key={i} className="text-left">
                     <p className="text-xl md:text-3xl font-black text-white tracking-tighter">{s.val}</p>
                     <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-500 tracking-widest mt-1">{s.label}</p>
                  </div>
               ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative group">
             {/* 1024x576 ASPECT WRAPPER */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3 }}
               className="relative aspect-[1024/576] rounded-[2.5rem] overflow-hidden border-[6px] border-white/10 shadow-5xl group-hover:border-primary/20 transition-all duration-700"
             >
                <img 
                  src="https://i.ibb.co/LXgcLVVq/Gemini-Generated-Image-n1so6on1so6on1so.png" 
                  alt="Official Hub Background" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/60 via-transparent to-transparent" />
                
                {/* Visual Glow Points */}
                <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
                <div className="absolute top-10 right-4 h-1.5 w-8 rounded-full bg-white/10" />
             </motion.div>
             
             {/* Decorative Background Elements */}
             <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
