
"use client"

import React, { useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PopularExams from "@/components/home/PopularExams";
import LatestMocks from "@/components/home/LatestMocks";
import Features from "@/components/home/Features";
import AppPreview from "@/components/home/AppPreview";
import MeetFounder from "@/components/home/MeetFounder";
import Footer from "@/components/layout/Footer";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { BookOpen, Zap, Users, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * @fileOverview Optimized Institutional Landing Hub v35.0.
 * PERFORMANCE: Removed full collection scans. Now reads pre-computed stats from a single node.
 */

export default function HomePage() {
  const db = useFirestore();

  // STABILIZED SINGLE DOC FETCH (1 Read instead of 10,000)
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading } = useDoc<any>(statsRef);

  return (
    <main className="min-h-screen bg-white font-body pb-safe overflow-x-hidden">
      <Navbar />
      <Hero />

      <section className="bg-white py-4 md:py-12 border-b border-slate-50">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-10">
               <TrustCard 
                  loading={loading}
                  icon={<BookOpen className="text-primary h-4 w-4 md:h-6 md:w-6" />} 
                  label="MCQ Bank" 
                  val={stats?.mcqCount ? `${(stats.mcqCount / 1000).toFixed(1)}k+` : "10k+"} 
               />
               <TrustCard 
                  loading={loading}
                  icon={<Zap className="text-blue-500 h-4 w-4 md:h-6 md:w-6" />} 
                  label="Mocks Live" 
                  val={stats?.mockCount || "500+"} 
               />
               <TrustCard 
                  loading={loading}
                  icon={<Users className="text-emerald-500 h-4 w-4 md:h-6 md:w-6" />} 
                  label="Aspirants" 
                  val={stats?.userCount ? stats.userCount.toLocaleString() : "15,000+"} 
               />
               <TrustCard 
                  loading={loading}
                  icon={<Target className="text-amber-500 h-4 w-4 md:h-6 md:w-6" />} 
                  label="Avg Accuracy" 
                  val={stats?.avgAccuracy ? `${stats.avgAccuracy}%` : "94%"} 
               />
            </div>
         </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl space-y-12 md:space-y-24">
         <PopularExams />
         <LatestMocks />
      </div>

      <AppPreview />
      <Features />
      
      <MeetFounder />

      <Footer />
    </main>
  );
}

function TrustCard({ icon, label, val, loading }: any) {
   return (
      <div className="flex items-center gap-3 p-3 md:p-6 rounded-2xl bg-slate-50/50 border border-slate-50 transition-all hover:bg-white hover:shadow-xl">
         <div className="h-8 w-8 md:h-14 md:w-14 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">{icon}</div>
         <div className="text-left">
            {loading ? (
               <Skeleton className="h-6 w-16 bg-slate-200" />
            ) : (
               <p className="text-sm md:text-3xl font-headline font-black text-[#0F172A] leading-none tracking-tight">{val}</p>
            )}
            <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1 truncate">{label}</p>
         </div>
      </div>
   )
}
