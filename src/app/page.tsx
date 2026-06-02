
'use client';

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
import { Calendar, FileText, Bell, ChevronRight } from "lucide-react";
import Link from "next/link";

/**
 * @fileOverview The primary entry point for the Cracklix platform.
 * Renders the full homepage with institutional SaaS styling and Firestore data.
 */
export default function HomePage() {
  const db = useFirestore();
  
  const caQuery = useMemo(() => (db ? query(collection(db, "current_affairs"), orderBy("date", "desc"), limit(3)) : null), [db]);
  const { data: latestCA } = useCollection<any>(caQuery);

  const noticeQuery = useMemo(() => (db ? query(collection(db, "notifications"), orderBy("time", "desc"), limit(5)) : null), [db]);
  const { data: notices } = useCollection<any>(noticeQuery);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      <section className="py-12 bg-[#F8FAFC] -mt-10 relative z-10">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2">
                  <PopularExams />
               </div>
               <div className="pt-16">
                  <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white p-8">
                     <div className="flex items-center justify-between mb-8">
                        <h3 className="font-headline font-black text-xl flex items-center gap-3">
                           <Bell className="h-5 w-5 text-primary" /> Exam Alerts
                        </h3>
                        <Badge variant="outline" className="border-none text-[10px] font-black uppercase text-slate-400">Live Updates</Badge>
                     </div>
                     <div className="space-y-6">
                        {notices?.map((n: any) => (
                           <div key={n.id} className="flex gap-4 group cursor-pointer">
                              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                 <FileText className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                              </div>
                              <div className="space-y-1">
                                 <p className="text-sm font-bold leading-snug group-hover:text-primary transition-colors">{n.title}</p>
                                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{n.time}</p>
                              </div>
                           </div>
                        ))}
                        <Link href="/notifications" className="block pt-4 text-center text-xs font-black uppercase tracking-widest text-primary hover:underline">
                           View All Notifications
                        </Link>
                     </div>
                  </Card>
               </div>
            </div>
         </div>
      </section>

      <LatestMocks />

      <section className="py-24 bg-[#0B1528] text-white">
         <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
               <div>
                  <h2 className="text-4xl md:text-6xl font-headline font-black tracking-tight uppercase">Current Affairs</h2>
                  <p className="text-slate-400 mt-4 text-lg max-w-xl">Deep-dive analysis of daily events tailored for civil services and state recruitment.</p>
               </div>
               <Link href="/current-affairs" className="bg-white/5 border border-white/10 px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                  Explore Newsroom <ChevronRight className="h-4 w-4" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {latestCA?.map((ca: any) => (
                  <Card key={ca.id} className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.08] transition-all group">
                     <CardContent className="p-10 space-y-6">
                        <div className="flex justify-between items-center">
                           <Badge className="bg-primary text-white border-none px-3 py-1 font-black uppercase text-[9px] tracking-widest">
                              {ca.category}
                           </Badge>
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                              <Calendar className="h-3 w-3" /> {ca.date}
                           </span>
                        </div>
                        <h4 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{ca.title}</h4>
                        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{ca.summary}</p>
                        <Link href="/current-affairs" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:underline">
                           Read More <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>
      </section>

      <Features />
      <AppPreview />
      <Footer />
    </main>
  );
}
