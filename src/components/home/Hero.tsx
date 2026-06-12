'use client';

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Zap, 
  ArrowRight, 
  Trophy, 
  ShieldCheck,
  RefreshCw,
  Star,
  Users,
  CheckCircle2,
  Download
} from "lucide-react";
import { useUser, useDoc, useFirestore } from "@/firebase";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { useMemo, useState, useEffect } from "react";

/**
 * @fileOverview Official Academy Restoration v45.0.
 * RESTORED: Massive Punjabi headline and student visual nodes.
 */
export default function Hero() {
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  
  const [mounted, setMounted] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleInstallable = () => setCanInstall(true);
    window.addEventListener('pwa-installable', handleInstallable);
    return () => window.removeEventListener('pwa-installable', handleInstallable);
  }, []);

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-academy')?.imageUrl || "https://picsum.photos/seed/academy/800/600";

  const handleAction = (path: string) => {
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  };

  const handleInstall = () => {
    const prompt = (window as any).deferredPrompt;
    if (prompt) prompt.prompt();
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-24 md:pb-32 bg-white overflow-hidden text-left">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
          
          {/* LEFT: CONTENT HUB */}
          <div className="lg:col-span-7 space-y-8 md:space-y-12">
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-3 bg-[#0B1528] border border-white/10 px-6 py-2.5 rounded-full text-[10px] md:text-xs font-black tracking-tight text-white shadow-2xl"
            >
              <Star className="h-4 w-4 text-primary fill-current" />
              <span className="tracking-[0.2em] uppercase">PUNJAB&apos;S NO.1 STUDY HUB</span>
            </motion.div>

            <div className="space-y-4">
               <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[3.5rem] sm:text-[5rem] md:text-[7.5rem] font-black leading-[0.85] tracking-tighter uppercase text-[#0F172A] flex flex-col"
               >
                  <span>ਤਿਆਰੀ ਪੰਜਾਬ ਦੀ,</span>
                  <span className="text-primary">ਸੁਪਨਾ ਸਰਕਾਰੀ</span>
                  <span className="text-primary">ਅਫ਼ਸਰ ਦਾ!</span>
               </motion.h1>
               <p className="text-lg md:text-2xl font-bold text-slate-400 uppercase tracking-tight">
                  Prepare for Punjab, Dream of a Govt. Officer!
               </p>
            </div>

            <div className="space-y-4 pt-2">
               <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 text-primary" /> OFFICIAL RECRUITMENTS:
               </p>
               <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2 text-sm md:text-xl font-black text-[#0F172A] uppercase">
                  <span>PSSSB</span>
                  <div className="h-1 w-1 rounded-full bg-slate-200" />
                  <span>POLICE</span>
                  <div className="h-1 w-1 rounded-full bg-slate-200" />
                  <span>PSPCL</span>
                  <div className="h-1 w-1 rounded-full bg-slate-200" />
                  <span>PSTET</span>
                  <div className="h-1 w-1 rounded-full bg-slate-200" />
                  <span>CTET</span>
                  <div className="h-1 w-1 rounded-full bg-slate-200" />
                  <span>ETT</span>
                  <div className="h-1 w-1 rounded-full bg-slate-200" />
                  <span className="text-primary">MASTER CADRE</span>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => handleAction('/mocks')}
                className="bg-primary hover:bg-orange-600 transition-all font-black px-12 h-16 md:h-20 rounded-2xl text-white flex items-center justify-center gap-4 shadow-3xl uppercase text-[11px] tracking-[0.2em] border-none active:scale-95"
              >
                🚀 Start Free Mock
              </Button>
              
              {mounted && canInstall && (
                <Button 
                  onClick={handleInstall}
                  className="bg-emerald-600 hover:bg-emerald-700 transition-all font-black px-10 h-16 md:h-20 rounded-2xl text-white flex items-center justify-center gap-4 shadow-3xl uppercase text-[11px] tracking-[0.2em] border-none active:scale-95 group"
                >
                  <div className="relative">
                    <Download className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-white rounded-full animate-ping" />
                  </div>
                  INSTALL APP
                </Button>
              )}

              {!canInstall && (
                 <Button 
                  onClick={() => handleAction('/pass')}
                  className="border-2 border-slate-100 hover:border-primary/20 bg-white text-[#0F172A] font-black px-10 h-16 md:h-20 rounded-2xl transition-all uppercase text-[11px] tracking-[0.2em] shadow-xl gap-3 active:scale-95"
                >
                  <Trophy className="h-5 w-5 text-primary" /> Unlock Elite Pass
                </Button>
              )}
            </div>
          </div>

          {/* RIGHT: ACADEMY VISUAL HUB */}
          <div className="lg:col-span-5 relative group">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="relative aspect-[4/5] rounded-[3.5rem] md:rounded-[5rem] overflow-hidden shadow-5xl border-[12px] border-white bg-slate-100"
             >
                <Image 
                  src={heroImage} 
                  fill 
                  alt="Academy Hub" 
                  className="object-cover transition-transform duration-[3s] group-hover:scale-110" 
                  priority
                  data-ai-hint="students classroom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-transparent to-transparent opacity-60" />
                
                {/* Floating Activity Overlay */}
                <div className="absolute bottom-10 left-6 right-6 space-y-4">
                   <Card className="bg-[#0F172A]/90 backdrop-blur-2xl border-white/10 p-6 rounded-[2rem] shadow-5xl animate-in slide-in-from-bottom-6 duration-1000">
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-2">
                            <RefreshCw className="h-3 w-3 text-primary animate-spin" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Activity Hub</span>
                         </div>
                         <Badge className="bg-primary text-white border-none text-[8px] font-black">REGISTRY SYNC</Badge>
                      </div>
                      <div className="space-y-4">
                         <ActivityRow initials="AM" name="Amanpreet M." action="Cleared Mock #4" status="Rank #2" isRank />
                         <ActivityRow initials="KS" name="Kuldeep Singh" action="Unlocked Police Batch" status="10s ago" />
                      </div>
                   </Card>
                </div>

                {/* State Rank Badge */}
                <div className="absolute top-10 right-8">
                   <div className="bg-white p-4 rounded-[1.5rem] shadow-2xl flex flex-col items-center gap-1 border border-slate-50 scale-110 animate-bounce">
                      <Trophy className="h-6 w-6 text-primary fill-current" />
                      <span className="text-[8px] font-black text-slate-400 uppercase leading-none">ALL PUNJAB</span>
                      <span className="text-xl font-black text-[#0F172A] leading-none">RANK 1</span>
                   </div>
                </div>
             </motion.div>

             {/* Background Decoration */}
             <div className="absolute -inset-10 bg-primary/5 blur-[100px] rounded-full -z-10 opacity-50" />
          </div>

        </div>
      </div>
    </section>
  );
}

function ActivityRow({ initials, name, action, status, isRank }: any) {
  return (
    <div className="flex items-center justify-between group/row">
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center font-black text-[10px] shadow-inner",
          isRank ? "bg-primary text-white" : "bg-white/5 text-slate-400"
        )}>
           {initials}
        </div>
        <div className="text-left">
           <p className="text-[11px] font-black text-white leading-none uppercase">{name}</p>
           <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">{action}</p>
        </div>
      </div>
      <span className={cn(
        "text-[9px] font-black uppercase tracking-tight",
        isRank ? "text-emerald-400" : "text-slate-600"
      )}>{status}</span>
    </div>
  )
}
