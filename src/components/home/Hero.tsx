'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  ShieldCheck,
  Users,
  Zap,
  ChevronRight,
  Star,
  Award,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview Official Hero Section v78.0 (Production Restored).
 * FIXED: Replaced <p> with <div> for dynamic stats to ensure hydration integrity.
 * FIXED: Integrated Badge import and restored two-column layout.
 */

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-student');

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(
    () => (db ? doc(db, "settings", "stats") : null),
    [db]
  );

  const { data: stats, loading } = useDoc<any>(statsRef);

  const liveStats = useMemo(() => {
    const formatNumber = (num: number) => {
      if (!num) return "0";
      if (num >= 1000) return (num / 1000).toFixed(1) + "k+";
      return num.toString() + "+";
    };

    return [
      {
        id: "q",
        icon: <Zap className="h-5 w-5 text-blue-600" />,
        val: stats ? formatNumber(stats.totalQuestions) : null,
        label: "Questions"
      },
      {
        id: "m",
        icon: <ClipboardList className="h-5 w-5 text-indigo-600" />,
        val: stats ? formatNumber(stats.totalMocks) : null,
        label: "Mock Tests"
      },
      {
        id: "e",
        icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
        val: stats ? formatNumber(stats.totalBoards) : null,
        label: "Exams"
      },
      {
        id: "u",
        icon: <Users className="h-5 w-5 text-orange-500" />,
        val: stats ? formatNumber(stats.totalUsers) : null,
        label: "Aspirants"
      }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-12 md:py-24 lg:py-32">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 blur-[120px] rounded-full -z-10 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          
          {/* LEFT: CONTENT HUB */}
          <div className="text-left space-y-8 md:space-y-12">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 shadow-sm"
              >
                <Star className="h-4 w-4 text-primary fill-primary" />
                <div className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  {loading ? <Skeleton className="h-3 w-20 bg-blue-100" /> : <div className="min-w-0">{stats?.totalUsers?.toLocaleString() || "0"} Aspirants Live</div>}
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl xs:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter"
              >
                Crack Punjab <br/>
                <span className="text-primary italic">Exams</span> <br/>
                With Ease.
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm sm:text-lg md:text-xl text-slate-500 font-medium max-w-xl leading-relaxed"
              >
                Experience Punjab's smartest preparation hub. 500+ bilingual mock tests verified against official patterns.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                asChild
                className="h-14 md:h-20 px-8 md:px-14 rounded-2xl bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-widest text-[10px] md:text-[11px] shadow-3xl transition-all active:scale-95 border-none"
              >
                <Link href="/mocks">
                  Start Free Prep
                  <ChevronRight className="ml-2 h-5 w-5 text-primary" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-14 md:h-20 px-8 md:px-14 rounded-2xl border-2 border-slate-100 bg-white text-slate-600 font-black uppercase tracking-widest text-[10px] md:text-[11px] transition-all active:scale-95 hover:bg-slate-50"
              >
                <Link href="/exams">
                  Browse Registry
                </Link>
              </Button>
            </motion.div>

            {/* MOBILE ONLY STATS PREVIEW */}
            <div className="grid grid-cols-2 gap-4 lg:hidden">
               {liveStats.slice(0, 2).map((s) => (
                  <div key={s.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
                     <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary">{s.icon}</div>
                     <div className="text-left"><p className="text-lg font-black leading-none">{loading ? '...' : s.val}</p><p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p></div>
                  </div>
               ))}
            </div>
          </div>

          {/* RIGHT: VISUAL HUB (DESKTOP) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-10 bg-primary/5 blur-[120px] rounded-full -z-10" />
            <div className="relative aspect-square w-full max-w-xl mx-auto rounded-[4rem] overflow-hidden shadow-5xl border border-slate-100 bg-slate-50 group">
               <Image 
                 src={heroImage?.imageUrl || "https://picsum.photos/seed/prep/800/800"} 
                 alt="Preparation Node" 
                 fill
                 sizes="600px"
                 priority
                 className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                 data-ai-hint="student studying"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/20 to-transparent pointer-events-none" />
               
               {/* FLOATING TRUST NODE */}
               <div className="absolute bottom-10 left-10 right-10 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl flex items-center justify-between">
                  <div className="flex items-center gap-5">
                     <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl">
                        <Award className="h-8 w-8" />
                     </div>
                     <div className="text-left">
                        <h4 className="text-xl font-black text-[#0F172A] uppercase leading-tight">Punjab Registry</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified commission patterns</p>
                     </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase px-4 py-1.5 rounded-xl">LIVE NOW</Badge>
               </div>
            </div>
          </motion.div>
        </div>

        {/* STATS STRIP - DESKTOP BALANCED */}
        <div className="hidden lg:grid grid-cols-4 gap-8 mt-32">
          {liveStats.map((stat) => (
            <Card
              key={stat.id}
              className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 text-left group hover:translate-y-[-8px] transition-all duration-500"
            >
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <div className="text-4xl font-black text-[#0F172A] tabular-nums leading-none tracking-tighter">
                    {loading ? <Skeleton className="h-10 w-20 bg-slate-50" /> : <div className="min-w-0">{stat.val || "0"}</div>}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">
                    {stat.label}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
