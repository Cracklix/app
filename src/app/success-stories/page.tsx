"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Quote, Star, GraduationCap, ShieldCheck, ChevronRight, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useDoc, useFirestore, useCollection } from "@/firebase"
import { doc, collection, query, orderBy } from "firebase/firestore"
import { useMemo, useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { SuccessStory } from "@/types"

/**
 * @fileOverview Official Hall of Rankers v5.1.
 * UPDATED: Optimized duration class for Tailwind compatibility.
 */

export default function SuccessStoriesPage() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const storiesQuery = useMemo(() => (db ? query(collection(db, "success_stories"), orderBy("createdAt", "desc")) : null), [db]);

  const { data: stats, loading: statsLoading } = useDoc<any>(statsRef);
  const { data: stories, loading: storiesLoading } = useCollection<SuccessStory>(storiesQuery as any);

  const liveAspirantCount = useMemo(() => {
    if (!stats) return "0";
    const count = stats.totalUsers || 0;
    return count.toLocaleString();
  }, [stats]);

  return (
    <div className="min-h-screen bg-slate-50/50 text-left font-body">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 py-12 md:py-24 max-w-6xl">
        <div className="space-y-16 md:space-y-24">
          <div className="text-center space-y-6">
             <div className="h-16 w-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary shadow-2xl">
                <Trophy className="h-8 w-8" />
             </div>
             <h1 className="text-4xl md:text-8xl font-headline font-black text-[#0F172A] uppercase tracking-tighter leading-[0.9]">Hall of <span className="text-primary">Rankers</span></h1>
             <p className="text-slate-500 font-medium text-lg md:text-xl max-w-2xl mx-auto italic">
                "Preparation starts with inspiration. Success stories from fellow Punjab aspirants using the Cracklix platform."
             </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:gap-20">
            {storiesLoading ? (
               Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-[4rem]" />)
            ) : stories && stories.length > 0 ? (
               stories.map((story, idx) => (
                  <div key={story.id} className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                     <div className="w-full md:w-2/5">
                        <div className="relative aspect-[4/5] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-4xl group border border-slate-100 bg-[#0F172A]">
                           <Image 
                              src={story.imageUrl || "https://picsum.photos/seed/topper/400/500"} 
                              fill 
                              alt={story.name} 
                              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60" />
                           <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                              <Badge className="bg-emerald-50 text-white border-none px-4 py-1 rounded-xl font-black text-[10px] shadow-lg">{story.rank}</Badge>
                           </div>
                        </div>
                     </div>
                     <div className="w-full md:w-3/5 space-y-6 md:space-y-10 text-left">
                        <div className="flex gap-1 text-amber-400">
                           {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="fill-current h-6 w-6 md:h-8 md:w-8" />)}
                        </div>
                        <div className="space-y-4">
                           <Quote className="h-10 w-10 md:h-12 md:w-12 text-primary opacity-20" />
                           <blockquote className="text-xl md:text-5xl font-headline font-medium italic text-[#0F172A] leading-tight">
                              "{story.quote}"
                           </blockquote>
                        </div>
                        <div className="space-y-2">
                           <p className="text-2xl md:text-4xl font-black text-[#0F172A] uppercase tracking-tight">{story.name}</p>
                           <div className="flex flex-wrap items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[11px]">
                              <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> {story.exam}</span>
                              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Batch {story.year}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               ))
            ) : (
               <div className="py-20 text-center opacity-20 flex flex-col items-center gap-6">
                  <Zap className="h-16 w-16" />
                  <p className="font-headline font-black text-2xl uppercase tracking-widest">Awaiting Merit nodes</p>
               </div>
            )}
          </div>

          <div className="bg-[#0F172A] rounded-[3.5rem] md:rounded-[5rem] p-10 md:p-20 text-center space-y-8 md:space-y-10 text-white relative overflow-hidden shadow-4xl">
             <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12"><Trophy className="h-64 w-64" /></div>
             <h2 className="text-4xl md:text-7xl font-headline font-black uppercase leading-tight relative z-10">Your Success <br/> <span className="text-primary">Is Next.</span></h2>
             <p className="text-slate-400 text-base md:text-xl max-w-xl mx-auto font-medium relative z-10">
                Join {statsLoading ? "..." : liveAspirantCount} aspirants already preparing with institutional grade mocks.
             </p>
             <Button asChild className="h-16 md:h-20 px-12 md:px-20 bg-white text-black hover:bg-slate-100 font-black uppercase text-[10px] md:text-sm tracking-widest rounded-3xl gap-4 shadow-4xl relative z-10 group border-none transition-all active:scale-95">
                <Link href="/login">Initialize My Account <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" /></Link>
             </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
