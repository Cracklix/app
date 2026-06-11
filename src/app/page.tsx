
"use client"

import React, { useMemo } from "react";
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
import { BookOpen, Zap, Users, Target, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview Optimized Institutional Landing Hub v61.0.
 * UPDATED: Optimized Stats Bar to be compact and space-efficient.
 */

export default function HomePage() {
  const db = useFirestore();

  // STABILIZED DATA LISTENERS
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading: statsLoading } = useDoc<any>(statsRef);

  const liveStats = useMemo(() => {
    if (!stats) return { mcqs: "0", mocks: "0", users: "0", accuracy: "94%" };
    const qCount = stats.totalQuestions || 0;
    const mCount = stats.totalMocks || 0;
    const uCount = stats.totalUsers || 0;
    const avgAcc = stats.averageAccuracy || 94;
    const formatNumber = (num: number) => {
       if (num >= 1000) return (num / 1000).toFixed(1) + 'k+';
       return num.toString();
    }
    return {
      mcqs: formatNumber(qCount),
      mocks: mCount.toLocaleString(),
      users: uCount.toLocaleString(),
      accuracy: `${avgAcc}%`
    };
  }, [stats]);

  return (
    <main className="min-h-screen bg-white font-body pb-safe overflow-x-hidden text-left">
      <Navbar />
      <Hero />

      {/* Trust Stats Bar - Space Efficient Row */}
      <section className="bg-white py-8 md:py-16 border-b border-slate-50 relative overflow-hidden">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
               <TrustCard loading={statsLoading} icon={<BookOpen className="text-primary h-5 w-5 md:h-6 md:w-6" />} label="MCQs" val={liveStats.mcqs} />
               <TrustCard loading={statsLoading} icon={<Zap className="text-blue-500 h-5 w-5 md:h-6 md:w-6" />} label="MOCKS" val={liveStats.mocks} />
               <TrustCard loading={statsLoading} icon={<Users className="text-emerald-500 h-5 w-5 md:h-6 md:w-6" />} label="STUDENTS" val={liveStats.users} isLive />
               <TrustCard loading={statsLoading} icon={<Target className="text-amber-500 h-5 w-5 md:h-6 md:w-6" />} label="ACCURACY" val={liveStats.accuracy} />
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
      <div className="bg-white p-5 md:p-10 rounded-[1.5rem] md:rounded-[3rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all group relative flex items-center gap-4 md:flex-col md:text-center md:justify-center">
         <div className="h-10 w-10 md:h-16 md:w-16 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
            {icon}
         </div>
         <div className="space-y-0.5">
            {loading ? <Skeleton className="h-6 w-16 bg-slate-100" /> : <p className="text-lg md:text-4xl font-headline font-black text-[#0F172A] leading-none tabular-nums">{val}</p>}
            <p className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 md:mt-2">{label}</p>
         </div>
         {isLive && <div className="absolute top-3 right-4 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse hidden md:block" />}
      </div>
   )
}
