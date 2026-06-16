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
  ClipboardCheck,
  ShieldCheck,
  LayoutGrid,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * @fileOverview Official Cracklix High-Fidelity Hero v30.0.
 * REDESIGNED: Premium Blue/Indigo SaaS layout with 2-column desktop structure.
 */

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading: statsLoading } = useDoc<any>(statsRef);

  const heroImage = "/images/hero-student.png";

  const liveStats = useMemo(() => {
    const format = (n: number) => n >= 1000 ? `${(n/1000).toFixed(0)}k+` : (n || 0).toString() + "+";
    return [
      { label: "Questions", val: format(stats?.totalQuestions || 50000), icon: <Zap className="text-blue-600" /> },
      { label: "Mock Tests", val: format(stats?.totalMocks || 500), icon: <LayoutGrid className="text-indigo-600" /> },
      { label: "Exams", val: format(stats?.totalBoards || 50), icon: <ShieldCheck className="text-emerald-600" /> },
      { label: "Aspirants", val: format(stats?.totalUsers || 15000), icon: <Star className="text-orange-500 fill-current" /> }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] pt-12 pb-24 md:pt-20 md:pb-32 text-left w-full">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* 1. LEFT COLUMN: CONTENT HUB */}
          <div className="space-y-8 z-20 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mx-auto lg:mx-0"
            >
              <Star className="h-4 w-4 text-blue-600 fill-current" />
              <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-widest">10,000+ Aspirants Trust Cracklix</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight antialiased">
                Crack Punjab <br />
                <span className="text-blue-600">Government Exams</span> <br />
                With Confidence
              </h1>
              
              <p className="text-base md:text-xl text-slate-600 font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
                Practice bilingual mock tests and prepare for Punjab Government Exams with confidence. Access exam-focused practice, previous papers and performance tracking in one place.
              </p>

              {/* Recruitment Board Pills */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                {["PSSSB", "Punjab Police", "PSTET", "PSPCL", "PPSC"].map((pill) => (
                  <Link key={pill} href="/exams">
                    <div className="bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest shadow-sm hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95">
                      {pill}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* CTA Hub */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            >
              <Button asChild className="h-12 md:h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 gap-3 border-none transition-all active:scale-95">
                <Link href="/mocks">Start Free Mock Test <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" className="h-12 md:h-14 px-10 border-2 border-slate-200 bg-white text-slate-700 font-black text-sm tracking-widest rounded-2xl shadow-sm transition-all active:scale-95 hover:bg-slate-50">
                <Link href="/exams">Browse Exams</Link>
              </Button>
            </motion.div>
          </div>

          {/* 2. RIGHT COLUMN: ILLUSTRATION HUB */}
          <div className="relative flex items-center justify-center lg:justify-end w-full">
             <div className="relative w-full max-w-[320px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[620px] aspect-square flex items-center justify-center">
                
                {/* Center Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="relative z-10 w-[85%] h-[85%] flex items-center justify-center"
                >
                   <img 
                     src={heroImage}
                     className="w-full h-auto drop-shadow-3xl object-contain" 
                     alt="Cracklix Preparation Center" 
                     referrerPolicy="no-referrer"
                     onError={(e) => {
                        // Fallback to stylized illustration if local path is missing
                        (e.target as HTMLImageElement).src = "https://i.ibb.co/fYJttX5d/Gemini-Generated-Image-n1so6on1so6on1so.png";
                     }}
                   />
                </motion.div>

                {/* Floating Action Cards - Desktop Only */}
                <div className="hidden lg:block">
                  <FloatingNode 
                     position="top-[8%] left-[-5%]"
                     icon={<ClipboardCheck className="h-5 w-5 text-blue-600" />}
                     title="Mock Tests"
                     href="/mocks"
                     delay={0.3}
                  />
                  <FloatingNode 
                     position="bottom-[10%] left-[-5%]"
                     icon={<Landmark className="h-5 w-5 text-orange-500" />}
                     title="Punjab Exams"
                     href="/exams"
                     delay={0.5}
                  />
                  <FloatingNode 
                     position="top-[8%] right-[-5%]"
                     icon={<FileStack className="h-5 w-5 text-emerald-600" />}
                     title="Previous Papers"
                     href="/previous-papers"
                     delay={0.4}
                  />
                  <FloatingNode 
                     position="bottom-[10%] right-[-5%]"
                     icon={<Zap className="h-5 w-5 text-purple-600 fill-current" />}
                     title="Free Practice"
                     href="/practice"
                     delay={0.6}
                  />
                </div>
             </div>
          </div>
        </div>

        {/* Mobile-Only Feature Grid */}
        <div className="grid grid-cols-2 gap-4 mt-12 lg:hidden">
          <MobileFeatureCard icon={<ClipboardCheck className="h-5 w-5 text-blue-600" />} title="Mock Tests" href="/mocks" />
          <MobileFeatureCard icon={<Landmark className="h-5 w-5 text-orange-500" />} title="Punjab Exams" href="/exams" />
          <MobileFeatureCard icon={<FileStack className="h-5 w-5 text-emerald-600" />} title="Previous Papers" href="/previous-papers" />
          <MobileFeatureCard icon={<Zap className="h-5 w-5 text-purple-600 fill-current" />} title="Free Practice" href="/practice" />
        </div>

        {/* 3. BASE ROW: FIREBASE STATS NODES */}
        <div className="mt-16 md:mt-24">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {liveStats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + (idx * 0.1) }}
                >
                  <Card className="border-none shadow-xl rounded-[1.5rem] md:rounded-3xl p-5 md:p-8 bg-white flex flex-col items-center text-center gap-3 hover:translate-y-[-4px] transition-all border border-slate-100 group">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div className="space-y-1">
                      {statsLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-200" />
                      ) : (
                        <p className="text-2xl md:text-4xl font-headline font-black text-slate-900 tracking-tighter leading-none">{stat.val}</p>
                      )}
                      <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
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

function FloatingNode({ position, icon, title, href, delay }: { position: string, icon: React.ReactNode, title: string, href: string, delay: number }) {
   return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.8 }}
        className={cn("absolute z-20 w-[180px] pointer-events-auto", position)}
      >
         <Link href={href}>
            <Card className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex items-center gap-3 hover:scale-105 hover:shadow-2xl transition-all group">
               <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-50 transition-colors">
                  {icon}
               </div>
               <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate leading-none group-hover:text-blue-600 transition-colors">{title}</p>
            </Card>
         </Link>
      </motion.div>
   )
}

function MobileFeatureCard({ icon, title, href }: { icon: React.ReactNode, title: string, href: string }) {
   return (
      <Link href={href}>
         <Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-lg flex items-center gap-3 active:scale-95 transition-all">
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
               {icon}
            </div>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-tight">{title}</p>
         </Card>
      </Link>
   )
}
