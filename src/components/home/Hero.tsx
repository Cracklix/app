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
  Sparkles,
  Search,
  LayoutGrid,
  FileText,
  Newspaper,
  CheckCircle2,
  TrendingUp,
  Clock,
  Check
} from "lucide-react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { doc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview Final High-Fidelity Hero Node v100.0.
 * ALIGNED: Perfectly matched to provided design image.
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

  return (
    <section className="relative pt-10 pb-10 md:pt-16 md:pb-16 bg-[#0B1528] overflow-hidden text-left">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://grppunjab.org/wp-content/uploads/2025/09/PP10_slider.jpg" 
          fill 
          className="object-cover opacity-30" 
          alt="Punjab Police"
          priority
          data-ai-hint="punjab police officers"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1528] via-[#0B1528]/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: CONTENT */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 bg-black/40 border border-yellow-500/30 px-4 py-2 rounded-xl backdrop-blur-md"
            >
              <ShieldCheck className="h-4 w-4 text-yellow-500" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-yellow-500">
                Punjab's Most Trusted Exam Preparation Platform
              </span>
            </motion.div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-7xl font-headline font-black leading-[1.05] tracking-tight text-white uppercase">
                Prepare For Punjab <br />
                <span className="text-primary">Government Exams</span>
              </h1>
              <p className="text-slate-300 text-base md:text-xl font-medium max-w-2xl leading-relaxed">
                Join thousands of aspirants preparing for PSSSB, Punjab Police, PPSC, PSTET, PSPCL and other Punjab Government Exams.
              </p>
            </div>

            {/* FEATURE BADGES */}
            <div className="flex flex-wrap gap-3 md:gap-4">
               <HeroFeature icon={<Zap className="text-primary" />} label="Full-Length Mocks" />
               <HeroFeature icon={<FileText className="text-primary" />} label="PYQs" />
               <HeroFeature icon={<Newspaper className="text-primary" />} label="Current Affairs" />
               <HeroFeature icon={<CheckCircle2 className="text-primary" />} label="Detailed Solutions" />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button 
                onClick={() => handleAction('/mocks')}
                className="w-full sm:w-auto bg-primary hover:bg-orange-600 h-16 px-10 rounded-2xl font-black uppercase text-[12px] tracking-[0.15em] shadow-3xl shadow-primary/20 border-none transition-all active:scale-95 gap-3"
              >
                Start Free Mock <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => handleAction('/exams')}
                className="w-full sm:w-auto bg-[#1A2333] hover:bg-[#252E3F] text-white h-16 px-10 rounded-2xl font-black uppercase text-[12px] tracking-[0.15em] border border-white/10 transition-all active:scale-95 gap-3"
              >
                Explore Exams <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* TRENDING SEARCHES */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
               <span className="text-[10px] font-black text-primary uppercase tracking-widest mr-2">Trending Searches:</span>
               {['PSSSB Clerk', 'Excise Inspector', 'Punjab Police', 'PSTET', 'PPSC PCS'].map(tag => (
                 <button 
                  key={tag} 
                  onClick={() => router.push(`/search?q=${tag}`)}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-400 uppercase transition-all"
                 >
                   {tag}
                 </button>
               ))}
            </div>
          </div>

          {/* RIGHT: READINESS CARD */}
          <div className="lg:col-span-4 hidden lg:block">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-[#1A2333]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-5xl relative overflow-hidden"
             >
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Exam Readiness</h3>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[8px] font-black">ACTIVE</Badge>
                   </div>
                   
                   <div className="flex flex-col items-center justify-center py-4 relative">
                      {/* Radial Progress Simulation */}
                      <div className="relative h-32 w-32 md:h-40 md:w-40 flex items-center justify-center">
                         <svg className="h-full w-full -rotate-90">
                            <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-white/5 stroke-[8]" />
                            <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-primary stroke-[8]" strokeDasharray="251 100" strokeLinecap="round" />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl md:text-5xl font-headline font-black text-white">82%</span>
                         </div>
                      </div>
                      <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mt-6">Keep Practicing!</p>
                   </div>

                   <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400">
                         <TrendingUp className="h-4 w-4" />
                         <span className="text-[10px] font-black uppercase">12% this week</span>
                      </div>
                      <Clock className="h-4 w-4 text-slate-500" />
                   </div>
                </div>
             </motion.div>
          </div>
        </div>

        {/* BOTTOM STATS STRIP */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
           <StatNode label="Questions" val="50,000+" icon={<BookOpen className="text-white" />} color="bg-blue-600" />
           <StatNode label="Mock Tests" val="500+" icon={<LayoutGrid className="text-white" />} color="bg-emerald-600" />
           <StatNode label="Aspirants" val="15,000+" icon={<Users className="text-white" />} color="bg-orange-600" />
           <StatNode label="Success Rate" val="94%" icon={<TrendingUp className="text-white" />} color="bg-indigo-600" />
        </div>
      </div>
    </section>
  );
}

function HeroFeature({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
       {React.cloneElement(icon as React.ReactElement, { className: "h-3.5 w-3.5" })}
       <span className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-tight">{label}</span>
    </div>
  );
}

function StatNode({ label, val, icon, color }: any) {
   return (
      <div className="bg-[#1A2333]/60 backdrop-blur-md border border-white/5 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 group hover:bg-white/10 transition-all">
         <div className={cn("h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-xl", color)}>
            {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 md:h-7 md:w-7" })}
         </div>
         <div className="text-left">
            <p className="text-lg md:text-3xl font-headline font-black text-white leading-none">{val}</p>
            <p className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1 md:mt-2">{label}</p>
         </div>
      </div>
   )
}
