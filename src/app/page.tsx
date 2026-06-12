
"use client"

import React, { useMemo, useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ContinueLearning from "@/components/home/ContinueLearning";
import TrendingExams from "@/components/home/TrendingExams";
import LatestMocks from "@/components/home/LatestMocks";
import Features from "@/components/home/Features";
import AppPreview from "@/components/home/AppPreview";
import MeetFounder from "@/components/home/MeetFounder";
import Footer from "@/components/layout/Footer";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { ShieldCheck, Zap, Trophy, Target, Award, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * @fileOverview Official Home Hub v90.0.
 * UPDATED: Premium dark trust bar matching new Hero identity.
 */

export default function HomePage() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading: statsLoading } = useDoc<any>(statsRef);

  const liveStats = useMemo(() => {
    if (!mounted || !stats) return { hubs: "8+", solutions: "10k+", rankers: "15k+", accuracy: "94%" };
    
    const hubs = stats.totalBoards || 8;
    const qCount = stats.totalQuestions || 10000;
    const uCount = stats.totalUsers || 15000;
    const avgAcc = stats.averageAccuracy || 94;
    
    const formatNumber = (num: number) => {
       if (!num) return "0";
       if (num >= 1000) return (num / 1000).toFixed(1) + 'k+';
       return num.toString();
    }
    
    return {
      hubs: hubs.toString() + "+",
      solutions: formatNumber(qCount),
      rankers: formatNumber(uCount),
      accuracy: `${avgAcc}%`
    };
  }, [stats, mounted]);

  return (
    <main className="min-h-screen bg-white font-body pb-safe overflow-x-hidden text-left">
      <Navbar />
      <Hero />

      {/* TRUST BAR HUB - DARK ELITE THEME */}
      <section className="bg-[#0B1528] py-8 md:py-12 border-y border-white/5 relative overflow-hidden">
         <div className="absolute inset-0 bg-primary/5 opacity-50" />
         <div className="container mx-auto px-3 md:px-6 max-w-7xl relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
               <TrustCard loading={statsLoading || !mounted} icon={<ShieldCheck className="text-primary h-5 w-5 md:h-6 md:w-6" />} label="OFFICIAL HUBS" val={liveStats.hubs} />
               <TrustCard loading={statsLoading || !mounted} icon={<Zap className="text-primary h-5 w-5 md:h-6 md:w-6" />} label="STEP SOLUTIONS" val={liveStats.solutions} />
               <TrustCard loading={statsLoading || !mounted} icon={<Trophy className="text-amber-500 h-5 w-5 md:h-6 md:w-6" />} label="STATE RANKING" val={liveStats.rankers} isLive={true} />
               <TrustCard loading={statsLoading || !mounted} icon={<Target className="text-blue-400 h-5 w-5 md:h-6 md:w-6" />} label="AVG ACCURACY" val={liveStats.accuracy} />
            </div>
         </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl space-y-16 md:space-y-32">
         <ContinueLearning />
         <FeaturedCategories />
         <TrendingExams />
         <LatestMocks />
      </div>

      <AppPreview />
      <Features />
      <MeetFounder />
      <Footer />
    </main>
  );
}

function TrustCard({ icon, label, val, loading, isLive }: any) {
   return (
      <div className="bg-white/5 p-5 md:p-8 rounded-[2rem] border border-white/10 shadow-2xl hover:bg-white/10 transition-all group relative flex items-center gap-4 md:gap-6 flex-1">
         <div className="h-10 w-10 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform border border-white/10">
            {icon}
         </div>
         <div className="space-y-1 min-w-0">
            {loading ? (
               <Skeleton className="h-6 w-16 bg-white/10" />
            ) : (
               <p className="text-xl md:text-4xl font-headline font-black text-white leading-none tabular-nums truncate">{val}</p>
            )}
            <p className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 md:mt-1 truncate">{label}</p>
         </div>
         {isLive && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
               <span className="text-[7px] font-black text-emerald-400 hidden md:inline uppercase tracking-widest">LIVE SYNC</span>
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>
         )}
      </div>
   )
}
