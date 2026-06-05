
"use client"

import React, { useMemo, ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PopularExams from "@/components/home/PopularExams";
import LatestMocks from "@/components/home/LatestMocks";
import Features from "@/components/home/Features";
import AppPreview from "@/components/home/AppPreview";
import Footer from "@/components/layout/Footer";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, query, limit, where } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  ClipboardList,
  Users,
  ChevronRight,
  Bell,
  Layers,
  FileText,
  Newspaper,
  Map as MapIcon,
  Globe,
  Target,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview Final Dynamic Homepage Hub v6.0.
 * Redesigned for high-fidelity Mock Platform feel (Adda247 style).
 */

export default function HomePage() {
  const db = useFirestore();
  
  const punjabMap = PlaceHolderImages.find(img => img.id === 'map-punjab')?.imageUrl;
  const indiaMap = PlaceHolderImages.find(img => img.id === 'map-india')?.imageUrl;

  const noticeQuery = useMemo(() => (db ? query(collection(db, "notifications"), limit(10)) : null), [db]);
  const { data: allNotices } = useCollection<any>(noticeQuery);

  const notices = useMemo(() => {
    if (!allNotices) return []
    return [...allNotices].sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0
      const timeB = b.createdAt?.seconds || 0
      return timeB - timeA
    }).slice(0, 5)
  }, [allNotices])

  return (
    <main className="min-h-screen bg-white font-body">
      <Navbar />
      
      <Hero />

      {/* High-Fidelity Stats Bar */}
      <section className="bg-white py-12 border-b border-slate-100">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
               <TrustNode icon={<BookOpen className="text-primary" />} label="Practice MCQs" val="10k+" />
               <TrustNode icon={<Zap className="text-blue-500" />} label="Official Mocks" val="500+" />
               <TrustNode icon={<Users className="text-emerald-500" />} label="Live Aspirants" val="15k+" />
               <TrustNode icon={<ShieldCheck className="text-amber-500" />} label="Accuracy Level" val="94%" />
            </div>
         </div>
      </section>

      {/* Comprehensive Coverage Section */}
      <section className="py-24 bg-[#F8FAFC]">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 text-left">
               <div className="space-y-3">
                  <Badge className="bg-primary/10 text-primary border-none uppercase text-[10px] font-black px-6 py-2 rounded-full tracking-[0.3em]">Geographic Hubs</Badge>
                  <h2 className="text-4xl lg:text-6xl font-headline font-black text-[#0F172A] uppercase leading-[0.95] tracking-tight">Regional & <br/> <span className="text-primary">National Coverage</span></h2>
               </div>
               <p className="text-slate-500 text-lg font-medium max-w-md">Access verified preparation nodes across every state board and central authority.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {/* Punjab Regional Node */}
               <Link href="/exams">
                  <Card className="group border-none shadow-3xl rounded-[3.5rem] overflow-hidden bg-[#0F172A] h-[550px] relative transition-all hover:-translate-y-2">
                     <img 
                        src={punjabMap!} 
                        className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-[3s] grayscale invert" 
                        referrerPolicy="no-referrer"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
                     <CardContent className="absolute bottom-0 left-0 right-0 p-12 space-y-6 text-left">
                        <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                           <MapIcon className="h-8 w-8 text-white" />
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-4xl font-headline font-black text-white uppercase">Punjab Hub</h3>
                           <p className="text-slate-400 text-lg font-medium leading-relaxed">PSSSB, PPSC, Punjab Police, and State Power sectors. 22 districts covered.</p>
                        </div>
                        <Button className="bg-white text-[#0F172A] font-black uppercase text-[10px] tracking-widest px-8 h-14 rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-2xl">
                           View State Registry <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                     </CardContent>
                  </Card>
               </Link>

               {/* India National Node */}
               <Link href="/exams">
                  <Card className="group border-none shadow-3xl rounded-[3.5rem] overflow-hidden bg-white h-[550px] relative transition-all hover:-translate-y-2 border border-slate-100">
                     <img 
                        src={indiaMap!} 
                        className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:scale-110 transition-transform duration-[3s]" 
                        referrerPolicy="no-referrer"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                     <CardContent className="absolute bottom-0 left-0 right-0 p-12 space-y-6 text-left">
                        <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl -rotate-3 group-hover:rotate-0 transition-transform">
                           <Globe className="h-8 w-8 text-white" />
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-4xl font-headline font-black text-[#0F172A] uppercase">National Hub</h3>
                           <p className="text-slate-500 text-lg font-medium leading-relaxed">Indian Army, Agniveer, CTET, and Central SSC verticals in registry.</p>
                        </div>
                        <Button className="bg-[#0F172A] text-white font-black uppercase text-[10px] tracking-widest px-8 h-14 rounded-xl group-hover:bg-blue-600 transition-all shadow-2xl">
                           View National Registry <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                     </CardContent>
                  </Card>
               </Link>
            </div>
         </div>
      </section>

      <LatestMocks />
      
      <section className="py-24 bg-white">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               <div className="lg:col-span-8">
                  <PopularExams />
               </div>

               {/* Sidebar Widgets (Adda247 Style) */}
               <div className="lg:col-span-4 space-y-10">
                  <Card className="rounded-[3rem] border-none bg-[#0F172A] text-white p-12 overflow-hidden relative shadow-4xl group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform"><Sparkles className="h-40 w-40 text-primary" /></div>
                     <div className="relative z-10 space-y-8 text-left">
                        <div className="flex items-center gap-4">
                           <div className="h-14 w-14 bg-primary/20 rounded-2xl flex items-center justify-center shadow-2xl"><Target className="h-8 w-8 text-primary" /></div>
                           <h4 className="text-xl font-headline font-black uppercase tracking-tight">AI Mastery Node</h4>
                        </div>
                        <p className="text-slate-400 text-lg font-medium">Unlock daily personalized audit goals based on your historical patterns.</p>
                        <Button asChild className="w-full bg-primary hover:bg-orange-600 text-white h-16 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl">
                           <Link href="/dashboard">Access Dashboard</Link>
                        </Button>
                     </div>
                  </Card>

                  <Card className="rounded-[3rem] border-none shadow-2xl bg-white p-10 overflow-hidden relative border border-slate-50">
                     <div className="flex items-center justify-between mb-8 relative z-10">
                        <h3 className="font-headline font-black text-2xl flex items-center gap-4 text-[#0F172A] uppercase tracking-tight">
                           <Bell className="h-6 w-6 text-primary" /> Gazette
                        </h3>
                        <Link href="/notifications" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</Link>
                     </div>
                     <div className="space-y-6 relative z-10">
                        {notices && notices.length > 0 ? notices.map((n: any) => (
                           <Link key={n.id} href="/notifications" className="flex gap-5 group cursor-pointer border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                              <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-inner">
                                 <Zap className="h-6 w-6" />
                              </div>
                              <div className="space-y-1 text-left min-w-0 flex-1">
                                 <p className="text-sm font-black leading-tight text-[#0F172A] group-hover:text-primary transition-colors truncate uppercase">{n.title}</p>
                                 <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{n.time}</span>
                              </div>
                           </Link>
                        )) : (
                          <div className="py-10 text-center space-y-2 opacity-30">
                             <Zap className="h-8 w-8 mx-auto text-slate-300" />
                             <p className="text-[10px] font-black uppercase tracking-widest">No Alerts Node</p>
                          </div>
                        )}
                     </div>
                  </Card>
               </div>
            </div>
         </div>
      </section>

      {/* Functional Preparation Grids */}
      <section className="py-24 bg-[#08152D] text-white">
         <div className="container mx-auto px-6 max-w-7xl text-left space-y-16">
            <div className="space-y-3">
               <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Audit Matrix</span>
               <h2 className="text-4xl lg:text-6xl font-headline font-black uppercase tracking-tight">Modular <br/> <span className="text-primary">Preparation</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <PrepTile href="/mocks" icon={<Layers className="text-blue-500" />} label="Subject Mastery" desc="Reasoning, Quant, GK" />
               <PrepTile href="/mocks" icon={<Zap className="text-amber-500" />} label="Topic Audits" desc="Section-wise accuracy" />
               <PrepTile href="/pyqs" icon={<FileText className="text-emerald-500" />} label="PYQ Archives" desc="Original State Papers" />
               <PrepTile href="/current-affairs" icon={<Newspaper className="text-rose-500" />} label="Analysis Feed" desc="Daily Strategy Nodes" />
            </div>
         </div>
      </section>

      <Features />
      <AppPreview />
      <Footer />
    </main>
  );
}

function TrustNode({ icon, label, val }: any) {
   return (
      <div className="flex items-center gap-5 p-6 rounded-3xl group hover:bg-slate-50 transition-colors">
         <div className="h-14 w-14 rounded-2xl bg-slate-50 group-hover:bg-white flex items-center justify-center shadow-inner group-hover:shadow-xl transition-all shrink-0">
            <div className="h-7 w-7">{icon}</div>
         </div>
         <div className="text-left min-w-0">
            <p className="text-3xl font-headline font-black text-[#0F172A] leading-none tracking-tighter">{val}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2 truncate">{label}</p>
         </div>
      </div>
   )
}

function PrepTile({ icon, label, desc, href }: any) {
   return (
      <Link href={href}>
         <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-primary transition-all duration-500 group h-full">
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white transition-all">
               <div className="h-8 w-8">{icon}</div>
            </div>
            <h4 className="text-2xl font-headline font-black uppercase mb-2 group-hover:text-white">{label}</h4>
            <p className="text-slate-400 font-medium group-hover:text-white/80">{desc}</p>
         </div>
      </Link>
   )
}
