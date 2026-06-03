
"use client"

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PopularExams from "@/components/home/PopularExams";
import LatestMocks from "@/components/home/LatestMocks";
import Features from "@/components/home/Features";
import AppPreview from "@/components/home/AppPreview";
import Footer from "@/components/layout/Footer";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  ChevronRight, 
  Trophy, 
  Zap, 
  Star, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Landmark, 
  BrainCircuit, 
  Sparkles, 
  Timer, 
  Scale, 
  BookOpen, 
  ClipboardList,
  Users,
  ArrowRight,
  Bell
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * @fileOverview Final Homepage Module (Phase 116-125).
 * Features: Institutional Trust Bar, Success Alumni, and Alert Hub.
 */

export default function HomePage() {
  const db = useFirestore();
  
  const caQuery = useMemo(() => (db ? query(collection(db, "current_affairs"), orderBy("date", "desc"), limit(3)) : null), [db]);
  const { data: latestCA } = useCollection<any>(caQuery);

  const noticeQuery = useMemo(() => (db ? query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(5)) : null), [db]);
  const { data: notices } = useCollection<any>(noticeQuery);

  const { data: users } = useCollection<any>(useMemo(() => (db ? collection(db, "users") : null), [db]));
  const { data: questions } = useCollection<any>(useMemo(() => (db ? collection(db, "questions") : null), [db]));
  const { data: mocks } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]));

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* Institutional Trust Bar (Phase 118) */}
      <section className="bg-[#08152D] border-y border-white/5 py-12">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center items-center">
               <TrustMetric icon={<BookOpen className="text-primary" />} label="Practice MCQs" value={`${questions?.length || '10,000'}+`} />
               <TrustMetric icon={<ClipboardList className="text-blue-400" />} label="Mock Series" value={`${mocks?.length || '500'}+`} />
               <TrustMetric icon={<Users className="text-emerald-400" />} label="Registered Aspirants" value={`${users?.length || '15,000'}+`} />
               <TrustMetric icon={<ShieldCheck className="text-amber-400" />} label="Official Patterns" value="2026 Ready" />
            </div>
         </div>
      </section>
      
      <section className="py-12 bg-[#F8FAFC] -mt-1 relative z-20">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               
               <div className="lg:col-span-8">
                  <PopularExams />

                  <div className="mt-12 bg-white rounded-[3.5rem] p-12 shadow-3xl shadow-slate-900/5 border border-slate-100 overflow-hidden relative group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><CalendarDays className="h-32 w-32" /></div>
                     <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="space-y-4 text-center md:text-left">
                           <div className="flex items-center justify-center md:justify-start gap-3">
                              <CalendarDays className="h-5 w-5 text-primary" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Exam Calendar 2026</span>
                           </div>
                           <h3 className="text-3xl font-headline font-black text-[#0F172A] uppercase leading-tight">Sync Your <br/> Preparation Schedule</h3>
                           <p className="text-slate-500 font-medium">Track application deadlines and official board exam dates for all Punjab verticals.</p>
                        </div>
                        <Button asChild className="h-16 px-12 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-widest text-xs rounded-2xl gap-3 shadow-2xl group">
                           <Link href="/exam-calendar">Open Full Calendar <ChevronRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" /></Link>
                        </Button>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-8 pt-16">
                  {/* Daily Mastery Challenge */}
                  <Card className="rounded-[3rem] border-none bg-[#0F172A] text-white p-12 overflow-hidden relative shadow-4xl group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform"><Sparkles className="h-40 w-40" /></div>
                     <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-4">
                           <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl"><BrainCircuit className="h-7 w-7 text-white" /></div>
                           <div className="space-y-0.5">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Aspirant Mastery</span>
                              <h4 className="text-xl font-headline font-black leading-tight uppercase">Daily Challenge</h4>
                           </div>
                        </div>
                        <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 shadow-inner">
                           <p className="text-slate-300 text-lg leading-relaxed font-medium italic">"The Battle of Aliwal was fought between Sikhs and British in which year?"</p>
                        </div>
                        <Button asChild className="w-full bg-white text-[#0F172A] hover:bg-slate-100 h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-3xl">
                           <Link href="/dashboard">Attempt & Earn XP</Link>
                        </Button>
                     </div>
                  </Card>

                  {/* Official Recruitment Gazette */}
                  <Card className="rounded-[3rem] border-none shadow-2xl bg-white p-12 overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-8 opacity-5"><Bell className="h-24 w-24" /></div>
                     <div className="flex items-center justify-between mb-10 relative z-10">
                        <h3 className="font-headline font-black text-2xl flex items-center gap-4">
                           <Bell className="h-6 w-6 text-primary" /> Official Feed
                        </h3>
                        <div className="flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Live</span>
                        </div>
                     </div>
                     <div className="space-y-8 relative z-10">
                        {notices && notices.length > 0 ? notices.map((n: any) => (
                           <Link key={n.id} href="/notifications" className="flex gap-6 group cursor-pointer border-b border-slate-50 pb-8 last:border-0 last:pb-0">
                              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                                n.category === 'Result' ? 'bg-emerald-50 text-emerald-500' : 
                                'bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary shadow-sm'
                              }`}>
                                 <Zap className="h-7 w-7" />
                              </div>
                              <div className="space-y-1.5 flex-1 min-w-0">
                                 <p className="text-base font-bold leading-snug group-hover:text-primary transition-colors truncate text-[#0F172A]">{n.title}</p>
                                 <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{n.time}</span>
                                    <Badge variant="outline" className="border-slate-100 text-[9px] font-black px-2.5 py-0.5 uppercase text-slate-500 rounded-lg">{n.board}</Badge>
                                 </div>
                              </div>
                           </Link>
                        )) : (
                          <div className="py-10 text-center space-y-4 opacity-30 italic">
                             <Bell className="h-10 w-10 mx-auto" />
                             <p className="text-xs uppercase font-black tracking-widest">Syncing with board feeds...</p>
                          </div>
                        )}
                        <Button asChild variant="ghost" className="w-full pt-8 text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/5 rounded-2xl border-2 border-dashed border-primary/10 h-20">
                           <Link href="/notifications">Full Recruitment Gazette <ChevronRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                     </div>
                  </Card>
               </div>
            </div>
         </div>
      </section>

      {/* Success Alumni Section (Phase 119) */}
      <section className="py-32 bg-white">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center space-y-6 mb-24">
               <Badge className="bg-primary/10 text-primary border-none px-8 py-2.5 rounded-full font-black uppercase tracking-[0.3em] text-[11px]">Institutional Alumni</Badge>
               <h2 className="text-6xl md:text-8xl font-headline font-black text-[#0F172A] uppercase leading-[0.9] tracking-tight">Hall Of <br/><span className="text-primary">Rankers</span></h2>
               <p className="text-slate-500 font-medium max-w-2xl mx-auto text-xl italic mt-8 leading-relaxed">
                  Join hundreds of aspirants who cleared Punjab Government exams with institutional grade mocks.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
               <RankerCard name="Harpreet Singh" exam="PSSSB Patwari" rank="Rank 02" year="2025" />
               <RankerCard name="Kiran Deep Kaur" exam="PPSC PCS" rank="Qualified" year="2024" />
               <RankerCard name="Gursewak Singh" exam="Punjab Police" rank="Sub-Inspector" year="2025" />
               <RankerCard name="Amritpal Kaur" exam="Master Cadre" rank="Math Merit" year="2024" />
            </div>

            <div className="mt-20 text-center">
               <Button asChild variant="ghost" className="text-primary font-black uppercase tracking-[0.3em] text-xs gap-3 rounded-2xl h-16 px-12 border-2 border-dashed border-primary/10 hover:bg-primary/5 transition-all">
                  <Link href="/success-stories">View All Success Stories <ArrowRight className="h-5 w-5" /></Link>
               </Button>
            </div>
         </div>
      </section>

      <LatestMocks />
      <Features />
      <AppPreview />
      <Footer />
    </main>
  );
}

function TrustMetric({ icon, label, value }: any) {
   return (
      <div className="space-y-3 group">
         <div className="flex justify-center transition-transform group-hover:scale-110">{icon}</div>
         <p className="text-4xl font-headline font-black text-white tracking-tight">{value}</p>
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      </div>
   )
}

function RankerCard({ name, exam, rank, year }: any) {
   return (
      <Card className="border-none shadow-3xl shadow-slate-900/5 rounded-[3.5rem] bg-white overflow-hidden group hover:translate-y-[-10px] transition-all duration-500">
         <div className="h-72 w-full bg-slate-100 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
            <Image src={`https://picsum.photos/seed/${name}/400/500`} fill alt={name} className="object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute top-8 right-8 h-14 w-14 bg-white rounded-2xl shadow-3xl flex items-center justify-center border border-slate-50">
               <Trophy className="text-amber-500 h-7 w-7" />
            </div>
         </div>
         <CardContent className="p-12 text-center space-y-4">
            <p className="text-2xl font-black text-[#0F172A] uppercase tracking-tight">{name}</p>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">{exam}</p>
            <div className="pt-8">
               <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[11px] font-black px-6 py-2 rounded-xl">{rank} • {year}</Badge>
            </div>
         </CardContent>
      </Card>
   )
}
