
"use client"

import React, { useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PopularExams from "@/components/home/PopularExams";
import LatestMocks from "@/components/home/LatestMocks";
import Features from "@/components/home/Features";
import AppPreview from "@/components/home/AppPreview";
import Footer from "@/components/layout/Footer";
import { useCollection, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import { BookOpen, Zap, Users, Target, ShieldCheck, ArrowRight, Code } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";

/**
 * @fileOverview Institutional Landing Hub v27.0.
 * Updated: Founder & Developer identity corrected to Arsh Grewal.
 */

export default function HomePage() {
  const db = useFirestore();
  const founderImg = PlaceHolderImages.find(img => img.id === 'founder-arsh')?.imageUrl;

  const usersQuery = useMemo(() => (db ? collection(db, "users") : null), [db]);
  const questionsQuery = useMemo(() => (db ? collection(db, "questions") : null), [db]);
  const mocksQuery = useMemo(() => (db ? collection(db, "mocks") : null), [db]);

  const { data: users } = useCollection<any>(usersQuery);
  const { data: questions } = useCollection<any>(questionsQuery);
  const { data: mocks } = useCollection<any>(mocksQuery);

  const formattedQCount = useMemo(() => {
    const count = questions?.length || 0;
    return count > 999 ? `${(count / 1000).toFixed(1)}k+` : count.toString();
  }, [questions]);

  return (
    <main className="min-h-screen bg-white font-body pb-safe overflow-x-hidden">
      <Navbar />
      <Hero />

      <section className="bg-white py-4 md:py-12 border-b border-slate-50">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-10">
               <TrustCard icon={<BookOpen className="text-primary h-4 w-4 md:h-6 md:w-6" />} label="MCQ Bank" val={formattedQCount} />
               <TrustCard icon={<Zap className="text-blue-500 h-4 w-4 md:h-6 md:w-6" />} label="Mocks Live" val={mocks?.length || "0"} />
               <TrustCard icon={<Users className="text-emerald-500 h-4 w-4 md:h-6 md:w-6" />} label="Aspirants" val={users?.length ? users.length.toLocaleString() : "0"} />
               <TrustCard icon={<Target className="text-amber-500 h-4 w-4 md:h-6 md:w-6" />} label="Avg Accuracy" val="94%" />
            </div>
         </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl space-y-12 md:space-y-24">
         <PopularExams />
         <LatestMocks />
      </div>

      <AppPreview />
      <Features />

      {/* FOUNDER & DEVELOPER SECTION */}
      <section className="py-24 md:py-32 bg-slate-50 overflow-hidden">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="bg-[#0B1528] rounded-[3.5rem] md:rounded-[5rem] overflow-hidden shadow-5xl flex flex-col md:flex-row items-stretch">
               <div className="md:w-2/5 relative min-h-[400px] bg-slate-800">
                  <img 
                    src={founderImg!} 
                    alt="Arsh Grewal" 
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    onError={(e) => {
                       (e.target as HTMLImageElement).src = "https://picsum.photos/seed/arsh/600/800";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-10 left-10 z-10">
                     <Badge className="bg-primary text-white border-none px-4 py-1 rounded-lg font-black uppercase text-[10px] tracking-widest mb-2 shadow-xl">Lead Developer</Badge>
                     <h3 className="text-white font-headline font-black text-3xl md:text-5xl uppercase tracking-tight leading-none">Arsh Grewal</h3>
                  </div>
               </div>
               <div className="md:w-3/5 p-10 md:p-24 flex flex-col justify-center space-y-8 md:space-y-12 text-left">
                  <div className="flex items-center gap-6">
                     <div className="h-14 w-14 md:h-20 md:w-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl">
                        <Code className="text-primary h-8 w-8 md:h-10 md:w-10" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Founder & Creator</p>
                        <h4 className="text-xl md:text-3xl font-headline font-black text-white uppercase">The Visionary Hub</h4>
                     </div>
                  </div>
                  <p className="text-lg md:text-2xl text-slate-300 font-medium leading-relaxed italic border-l-4 border-primary pl-8">
                     "Building a modern platform for competitive exam preparation with mock tests, PYQs, current affairs, analytics, and multilingual support. My goal is to make preparation smart and accessible for every student."
                  </p>
                  <div className="pt-6 flex flex-wrap gap-4">
                     <Button asChild className="h-14 px-10 bg-primary hover:bg-orange-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl border-none">
                        <Link href="/about">Read Full Mission <ArrowRight className="ml-3 h-4 w-4" /></Link>
                     </Button>
                     <div className="flex items-center gap-3 px-6 h-14 bg-white/5 rounded-2xl border border-white/5 text-slate-400">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified Platform Authority</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}

function TrustCard({ icon, label, val }: any) {
   return (
      <div className="flex items-center gap-3 p-3 md:p-6 rounded-2xl bg-slate-50/50 border border-slate-50 transition-all hover:bg-white hover:shadow-xl">
         <div className="h-8 w-8 md:h-14 md:w-14 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">{icon}</div>
         <div className="text-left">
            <p className="text-sm md:text-3xl font-headline font-black text-[#0F172A] leading-none tracking-tight">{val}</p>
            <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1 truncate">{label}</p>
         </div>
      </div>
   )
}
