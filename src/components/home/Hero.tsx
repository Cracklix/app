'use client';

import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Zap, ShieldCheck, Download, Award, BookOpen, Users, PlayCircle, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDoc, useFirestore, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * @fileOverview Redesigned Academy-Style Hero Section v96.0.
 * FIXED: Added missing Badge import to resolve ReferenceError.
 * ALIGNMENT: Strictly matched to user reference image with Punjabi Banner and Bottom Stats.
 */

export default function Hero() {
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const [queryText, setQueryText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined' && (window as any).deferredPrompt) {
      setCanInstall(true);
    }

    const handleInstallable = () => setCanInstall(true);
    window.addEventListener('pwa-installable', handleInstallable);
    return () => window.removeEventListener('pwa-installable', handleInstallable);
  }, []);
  
  const academyImg = PlaceHolderImages.find(img => img.id === 'hero-academy');

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const liveStudentCount = useMemo(() => {
    if (!mounted || !stats) return "10,000+";
    const count = stats?.totalUsers || 10000;
    if (count > 999) return `${(count / 1000).toFixed(1)}k+`;
    return count.toLocaleString();
  }, [stats, mounted]);

  const handleActionClick = (path: string) => {
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  };

  const handleInstallApp = async () => {
    const prompt = (window as any).deferredPrompt;
    if (prompt) {
      prompt.prompt();
    }
  };

  return (
    <section className="relative pt-6 pb-12 md:pt-16 md:pb-24 bg-white overflow-hidden border-b border-slate-100">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
         <div className="h-full w-full bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="container mx-auto px-4 relative z-20 max-w-7xl text-left">
        
        {/* 1. TOP BILINGUAL FLOATING BANNER */}
        <motion.div 
           initial={{ y: -20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="max-w-4xl mx-auto mb-12 md:mb-20 text-center"
        >
           <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-4xl p-6 md:p-10 border border-slate-100 relative group overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
              <h2 className="text-2xl md:text-5xl font-black text-primary leading-tight uppercase tracking-tight mb-2 relative z-10">
                 ਤਿਆਰੀ ਪੰਜਾਬ ਦੀ, ਸੁਪਨਾ ਸਰਕਾਰੀ ਅਫ਼ਸਰ ਦਾ!
              </h2>
              <p className="text-sm md:text-xl font-bold text-[#0F172A] relative z-10 uppercase tracking-wide">
                 Prepare for Punjab, Dream of a Govt. Officer!
              </p>
           </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
          
          {/* 2. LEFT CONTENT NODE */}
          <div className="lg:col-span-6 space-y-8 md:space-y-12">
            <div className="space-y-4 md:space-y-6">
               <h1 className="text-3xl sm:text-5xl lg:text-6xl font-headline font-black leading-[1.05] text-[#000000] uppercase tracking-tight">
                  CRACK PSSSB, PUNJAB <br className="hidden sm:block" />
                  POLICE, PATWARI & MORE
               </h1>

               <p className="text-sm md:text-xl text-slate-500 font-medium max-w-lg leading-relaxed antialiased">
                  Join Punjab's #1 Platform for Govt. Exam Success. Start your journey today with Official Mocks, Daily Updates, and Expert Guidance.
               </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button 
                onClick={() => handleActionClick('/mocks')}
                className="bg-primary hover:bg-orange-600 text-white px-8 md:px-12 rounded-xl font-black uppercase tracking-[0.1em] text-[10px] md:text-[11px] h-14 md:h-16 shadow-2xl transition-all active:scale-95 border-none cursor-pointer"
              >
                 START FREE MOCK
              </Button>

              <Button 
                onClick={() => handleActionClick('/pass')}
                className="bg-[#1E5EFF] hover:bg-blue-700 text-white px-8 md:px-12 rounded-xl font-black uppercase tracking-[0.1em] text-[10px] md:text-[11px] h-14 md:h-16 shadow-2xl transition-all active:scale-95 border-none cursor-pointer"
              >
                 GET ELITE PASS
              </Button>

              {mounted && canInstall && (
                <Button 
                  onClick={handleInstallApp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 md:px-12 rounded-xl font-black uppercase tracking-[0.1em] text-[10px] md:text-[11px] h-14 md:h-16 shadow-2xl transition-all active:scale-95 border-none animate-in fade-in zoom-in-95 duration-500"
                >
                   <span className="flex items-center gap-3">INSTALL APP <Download className="h-4 w-4" /></span>
                </Button>
              )}
            </div>

            {/* 3. TRUST STATS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 pt-6 border-t border-slate-100">
               <StatItem icon={<Users className="text-primary" />} val={liveStudentCount} label="Selections" />
               <StatItem icon={<ShieldCheck className="text-primary" />} val="Latest 2026" label="Pattern" />
               <StatItem icon={<Award className="text-primary" />} val="Official" label="Hubs" />
               <StatItem icon={<PlayCircle className="text-primary" />} val="Daily Live" label="Quizzes" />
            </div>
          </div>

          {/* 4. RIGHT IMAGE NODE (ACADEMY THEME) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-video sm:aspect-[4/3] w-full max-w-[620px] mx-auto">
               <div className="absolute -inset-10 bg-primary/5 blur-[100px] rounded-full opacity-50" />
               
               <div className="relative h-full w-full rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border-[8px] md:border-[12px] border-white shadow-5xl bg-slate-50 group">
                  {mounted && academyImg && (
                    <Image 
                      src={academyImg.imageUrl} 
                      alt="Cracklix Academy Students" 
                      fill
                      priority
                      className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                      data-ai-hint={academyImg.imageHint}
                      sizes="(max-width: 768px) 100vw, 620px"
                    />
                  )}
                  
                  {/* Floating Live Badge */}
                  <div className="absolute top-6 right-6">
                     <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex flex-col items-center gap-1 animate-bounce">
                        <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">MOCK TESTS</span>
                        <Badge className="bg-rose-500 text-white border-none text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-lg">LIVE</Badge>
                     </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                     <div className="bg-white/90 backdrop-blur-xl px-5 py-4 rounded-2xl border border-white/50 shadow-2xl inline-flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                           <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                           <p className="text-[10px] font-black text-[#0F172A] leading-none mb-1 uppercase">Official List</p>
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Management Verified</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function StatItem({ icon, val, label }: { icon: React.ReactNode, val: string, label: string }) {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
       <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner mb-1">
          {icon}
       </div>
       <div>
          <p className="text-sm md:text-lg font-black text-[#0F172A] leading-none uppercase">{val}</p>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
       </div>
    </div>
  );
}
