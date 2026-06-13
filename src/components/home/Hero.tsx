
'use client';

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck,
  Zap,
  ArrowRight,
  Users,
  FileStack,
  Globe,
  Star,
  Search,
  Target,
  TrendingUp,
  Award
} from "lucide-react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { useState, useEffect, useMemo } from "react";
import { doc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Institutional Hero Hub v160.0.
 * RE-LOCKED: Background imagery updated to institutional preparation photo.
 * IMAGE: https://i.ibb.co/gZCGMQNJ/IMG-20260612-WA0010.jpg
 */
export default function Hero() {
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const handleAction = (path: string) => {
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  };

  if (!mounted) return null;

  const heroImageUrl = "https://i.ibb.co/gZCGMQNJ/IMG-20260612-WA0010.jpg";

  return (
    <section className="relative pt-12 pb-24 md:pt-24 md:pb-40 bg-[#0B1528] overflow-hidden text-left">
      {/* 1. INSTITUTIONAL BACKGROUND NODE */}
      <div className="absolute inset-0 z-0">
         <Image 
            src={heroImageUrl}
            alt="Punjab Exam Hub"
            fill
            className="object-cover opacity-40 grayscale-[0.2]"
            priority
         />
         <div className="absolute inset-0 bg-gradient-to-r from-[#0B1528] via-[#0B1528]/95 to-transparent" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* LEFT: COMMAND CONTENT */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 md:space-y-8"
            >
              <div className="space-y-2">
                 <p className="text-primary font-black uppercase text-[10px] md:text-xs tracking-[0.4em] leading-none mb-4">
                    PREPARE FOR
                 </p>
                 <div className="flex flex-wrap items-center gap-2 md:gap-4 text-white/60 font-black text-[9px] md:text-[11px] uppercase tracking-widest">
                    <span className="text-primary">PSSSB</span>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-primary">POLICE</span>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-primary">PPSC</span>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-primary">PSPCL</span>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-primary">TEACHING</span>
                 </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                 <h1 className="text-4xl md:text-8xl font-headline font-black leading-[0.85] tracking-tighter text-white uppercase">
                    Selection Hub <br />
                    <span className="text-primary">For Punjab</span>
                 </h1>
                 <p className="text-slate-400 text-sm md:text-xl font-medium max-w-2xl leading-relaxed antialiased">
                    Practice with the most accurate mock tests. Get detailed AI rationalizations, previous year papers, and real-time state rankings.
                 </p>
              </div>

              <div className="flex flex-wrap gap-3">
                 <FeatureTag icon={<Zap />} label="500+ Mocks" />
                 <FeatureTag icon={<FileStack />} label="Official PYQs" />
                 <FeatureTag icon={<Globe />} label="Bilingual Hub" />
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button 
                onClick={() => handleAction('/mocks')}
                className="w-full sm:w-auto h-16 md:h-20 px-12 bg-primary hover:bg-orange-600 text-white rounded-[1.5rem] md:rounded-[2.5rem] font-black uppercase text-[12px] md:text-[14px] tracking-[0.2em] shadow-3xl shadow-primary/20 border-none transition-all active:scale-95 gap-4"
              >
                Start Free Mock <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                onClick={() => handleAction('/exams')}
                className="w-full sm:w-auto h-16 md:h-20 px-12 rounded-[1.5rem] md:rounded-[2.5rem] bg-white text-[#0B1528] hover:bg-slate-100 font-black uppercase text-[12px] md:text-[14px] tracking-[0.2em] transition-all active:scale-95 gap-4 border-none shadow-xl"
              >
                Explore Hubs <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
               <span className="text-[10px] font-black uppercase text-primary tracking-widest">Trending:</span>
               {['Patwari Hub', 'Police SI', 'Master Cadre', 'High Court'].map((t) => (
                  <Link key={t} href={`/search?q=${t}`}>
                    <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer shadow-sm">
                       {t}
                    </Badge>
                  </Link>
               ))}
            </div>
          </div>

          {/* RIGHT: DASHBOARD PREVIEW */}
          <div className="lg:col-span-5 relative hidden md:block">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative"
             >
                <div className="absolute -inset-1 bg-primary/20 rounded-[3.5rem] blur-3xl opacity-50" />
                
                <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 space-y-8 shadow-5xl">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase text-primary tracking-widest">STUDENT DASHBOARD</p>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-none">LIVE HUB</Badge>
                   </div>
                   
                   <div className="flex items-center gap-8">
                      <div className="relative h-24 w-24 md:h-32 md:w-32 flex items-center justify-center">
                         <svg className="h-full w-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="45%" className="stroke-white/10 fill-none" strokeWidth="8" />
                            <circle cx="50%" cy="50%" r="45%" className="stroke-primary fill-none" strokeWidth="8" strokeDasharray="283" strokeDashoffset="50" strokeLinecap="round" />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white">82%</span>
                            <span className="text-[8px] font-bold text-slate-400">READY</span>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <StatPreview label="READINESS SCORE" val="82%" icon={<TrendingUp className="text-primary" />} />
                         <StatPreview label="AVG ACCURACY" val="94%" icon={<Target className="text-emerald-400" />} />
                         <StatPreview label="ALL PUNJAB RANK" val="#12" icon={<Award className="text-amber-400" />} />
                      </div>
                   </div>

                   <div className="pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                               <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                               <p className="text-[11px] font-black text-white uppercase">VERIFIED STATUS</p>
                               <p className="text-[9px] text-slate-400 font-medium">Registry Audited 1m ago</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-xl font-black text-primary tabular-nums">{stats?.totalUsers?.toLocaleString() || '15,000'}</p>
                            <p className="text-[8px] font-black text-slate-500 uppercase">ASPIRANTS</p>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>

        {/* BOTTOM STATS STRIP */}
        <div className="mt-20 md:mt-32 bg-[#0F172A]/80 backdrop-blur-xl rounded-[2rem] md:rounded-[3.5rem] border border-white/5 shadow-5xl overflow-hidden p-6 md:p-12 relative">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
              <LegacyStatNode 
                label="Questions" 
                val={`${stats?.totalQuestions?.toLocaleString() || '50,000'}+`} 
                icon={<Zap />} 
                color="bg-blue-600" 
              />
              <LegacyStatNode 
                label="Mock Tests" 
                val={`${stats?.totalMocks || '500'}+`} 
                icon={<Star />} 
                color="bg-emerald-600" 
              />
              <LegacyStatNode 
                label="State Rank" 
                val="94%" 
                icon={<Trophy />} 
                color="bg-orange-600" 
              />
              <LegacyStatNode 
                label="Accuracy" 
                val={`${stats?.averageAccuracy || '94'}%`} 
                icon={<ShieldCheck />} 
                color="bg-purple-600" 
              />
           </div>
        </div>
      </div>
    </section>
  );
}

function FeatureTag({ icon, label }: any) {
   return (
      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-primary/40">
         {icon && Object.assign({}, icon, { props: { className: "h-3.5 w-3.5 text-primary" } })}
         <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
   )
}

function LegacyStatNode({ label, val, icon, color }: any) {
   return (
      <div className="flex items-center gap-4 md:gap-8 text-left group">
         <div className={cn("h-12 w-12 md:h-16 md:w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-110", color)}>
            {icon && Object.assign({}, icon, { props: { className: "h-6 w-6 md:h-8 md:w-8 text-white" } })}
         </div>
         <div>
            <p className="text-xl md:text-3xl font-headline font-black text-white tabular-nums leading-none tracking-tight">{val}</p>
            <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2">{label}</p>
         </div>
      </div>
   )
}

function StatPreview({ label, val, icon }: any) {
   return (
      <div className="flex items-center gap-3">
         <div className="h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            {React.cloneElement(icon, { className: "h-3 w-3" })}
         </div>
         <div>
            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none">{label}</p>
            <p className="text-[12px] font-black text-white leading-tight mt-0.5">{val}</p>
         </div>
      </div>
   )
}
import React from "react"
import { Trophy } from "lucide-react";
