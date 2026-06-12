'use client';

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck,
  Zap,
  Target,
  Trophy,
  Users,
  Activity,
  ArrowRight,
  Search,
  LayoutGrid,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Award
} from "lucide-react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { doc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

/**
 * @fileOverview Final Institutional Command Hero v130.0.
 * MATCHED: Perfectly aligned with the modern recruitment hub design reference (ibb.co/F4D0JLHP).
 */
export default function Hero() {
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchTerm] = useState("");

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (!mounted) return null;

  return (
    <section className="relative pt-12 pb-16 md:pt-24 md:pb-40 bg-[#0B1528] overflow-hidden text-left">
      {/* 1. BACKGROUND VISUAL NODE */}
      <div className="absolute inset-0 z-0">
         <Image 
           src="https://grppunjab.org/wp-content/uploads/2025/09/PP10_slider.jpg" 
           fill 
           className="object-cover opacity-30 grayscale-[0.3]" 
           alt="Institutional Background"
           priority
         />
         <div className="absolute inset-0 bg-gradient-to-r from-[#0B1528] via-[#0B1528]/95 to-transparent" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* LEFT: STRATEGIC CONTENT HUB */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/80">
                  Punjab's Smartest Exam Preparation Hub
                </span>
              </div>

              <div className="space-y-4">
                 <p className="text-primary font-black uppercase text-[10px] md:text-xs tracking-[0.2em] leading-tight">
                    PREPARE FOR PSSSB • POLICE • PPSC • PSPCL • PSTET • MASTER CADRE • ETT • ARMY
                 </p>
                 <h1 className="text-4xl md:text-7xl font-headline font-black leading-[0.95] tracking-tight text-white uppercase">
                    Master Punjab <br />
                    <span className="text-primary">Government Exams</span>
                 </h1>
                 <p className="text-slate-400 text-base md:text-xl font-medium max-w-2xl leading-relaxed">
                    High-Fidelity mocks, official previous papers, and real-time performance analytics designed for absolute selection.
                 </p>
              </div>
            </motion.div>

            {/* SEARCH HUB (WIREFRAME MATCHED) */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSearch}
              className="relative max-w-2xl group"
            >
               <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-400 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
               <div className="relative bg-white p-2 rounded-[1.5rem] md:rounded-[2rem] flex items-center shadow-4xl">
                  <Search className="h-6 w-6 text-slate-300 ml-4 md:ml-6" />
                  <Input 
                    value={searchQuery}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search PSSSB, Police, or Subjects..." 
                    className="flex-1 h-14 md:h-16 border-none text-lg font-bold text-[#0F172A] focus-visible:ring-0 placeholder:text-slate-300 bg-transparent px-4"
                  />
                  <Button type="submit" className="h-12 md:h-14 px-6 md:px-10 bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[11px] tracking-widest rounded-2xl md:rounded-[1.5rem] shadow-xl border-none shrink-0 transition-all active:scale-95">
                     Search
                  </Button>
               </div>
            </motion.form>

            {/* TACTICAL ACTION NODES */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Button 
                onClick={() => handleAction('/mocks')}
                className="w-full sm:w-auto h-16 md:h-20 px-12 bg-primary hover:bg-orange-600 text-white rounded-[1.5rem] md:rounded-[2.2rem] font-black uppercase text-[12px] tracking-[0.2em] shadow-3xl shadow-primary/20 border-none transition-all active:scale-95 gap-4"
              >
                <Zap className="h-6 w-6 fill-current" /> Start Practice
              </Button>
              <Button 
                onClick={() => handleAction('/exams')}
                variant="outline"
                className="w-full sm:w-auto h-16 md:h-20 px-12 rounded-[1.5rem] md:rounded-[2.2rem] border-2 border-white/20 bg-transparent text-white hover:bg-white/5 font-black uppercase text-[12px] tracking-[0.2em] transition-all active:scale-95 gap-3"
              >
                Explore Hubs <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* RIGHT: LIVE DASHBOARD PREVIEW NODE */}
          <div className="lg:col-span-5 relative">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="relative"
             >
                {/* Main Dashboard Box */}
                <div className="relative aspect-[4/5] md:aspect-[4/3] rounded-[3rem] md:rounded-[4rem] overflow-hidden border-[8px] border-white/10 shadow-5xl group bg-[#1A2333]">
                   <Image 
                     src="https://grppunjab.org/wp-content/uploads/2025/09/PP10_slider.jpg" 
                     fill 
                     className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" 
                     alt="Selection Dashboard"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-transparent to-transparent opacity-80" />
                   
                   {/* Verification Anchor */}
                   <div className="absolute bottom-10 left-10 right-10">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl flex items-center gap-4">
                         <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <ShieldCheck className="h-6 w-6" />
                         </div>
                         <div className="text-left">
                            <p className="text-[9px] font-black uppercase text-primary tracking-widest leading-none mb-1">OFFICIAL HUB</p>
                            <p className="text-xl font-black text-white uppercase leading-none tracking-tight">VERIFIED CONTENT</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Floating Readiness Node */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-6 md:-right-12 bg-white rounded-[2rem] p-6 shadow-5xl border border-slate-100 z-20 text-left min-w-[200px]"
                >
                   <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                         <Target className="h-5 w-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase text-slate-400">Readiness Score</p>
                         <p className="text-2xl font-headline font-black text-[#0F172A]">82%</p>
                      </div>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[82%]" />
                   </div>
                </motion.div>

                {/* Floating Ranking Node */}
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-32 -left-6 md:-left-12 bg-[#0F172A] rounded-[2rem] p-6 shadow-5xl border border-white/10 z-20 text-left"
                >
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-xl border border-primary/20">
                         <Trophy className="h-6 w-6" />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">LIVE STATUS</p>
                         <p className="text-lg font-black text-white uppercase">All Punjab Rank #12</p>
                      </div>
                   </div>
                </motion.div>
             </motion.div>
          </div>
        </div>

        {/* BOTTOM STATS STRIP (MATCHED TO REFERENCE) */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-12 border-t border-white/5">
           <StatNode label="Total Questions" val={`${stats?.totalQuestions?.toLocaleString() || '50,000'}+`} icon={<Zap />} color="text-primary" />
           <StatNode label="Verified Mocks" val={`${stats?.totalMocks || '500'}+`} icon={<LayoutGrid />} color="text-blue-500" />
           <StatNode label="Live Aspirants" val={`${stats?.totalUsers?.toLocaleString() || '15,000'}+`} icon={<Users />} color="text-emerald-500" />
           <StatNode label="Avg Accuracy" val={`${stats?.averageAccuracy || '94'}%`} icon={<Activity />} color="text-rose-500" />
        </div>
      </div>
    </section>
  );
}

function StatNode({ label, val, icon, color }: any) {
   return (
      <div className="flex items-center gap-4 group cursor-pointer text-left">
         <div className={cn("h-10 w-10 md:h-14 md:w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-white group-hover:text-[#0B1528] transition-all", color)}>
            {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 md:h-7 md:w-7" })}
         </div>
         <div>
            <p className="text-lg md:text-3xl font-headline font-black text-white tabular-nums leading-none">{val}</p>
            <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1.5">{label}</p>
         </div>
      </div>
   )
}
