'use client';

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Download, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_VERSION } from "@/lib/version";

/**
 * @fileOverview Official Direct APK Download Hub v4.0.
 * Optimized for institutional authority and seamless onboarding.
 */
export default function InstallPage() {
  const [mounted, setMounted] = useState(false);
  const [apkFound, setApkFound] = useState(true); // Default to true, validated in effect

  useEffect(() => {
    setMounted(true);
    // Silent audit check for production APK
    fetch('/apk/cracklix-production.apk', { method: 'HEAD' })
      .then(res => setApkFound(res.ok))
      .catch(() => setApkFound(false));
  }, []);

  const handleDownload = () => {
    window.location.href = "/apk/cracklix-production.apk";
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[100dvh] bg-slate-50 font-body text-left overflow-x-hidden">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 md:py-24 max-w-6xl space-y-16 md:space-y-32">
        
        <div className="text-center space-y-6 max-w-4xl mx-auto">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="h-20 w-20 md:h-24 md:w-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-primary shadow-2xl border border-primary/20"
           >
              <Zap className="h-10 md:h-12 fill-current" />
           </motion.div>
           <div className="space-y-4">
              <h1 className="text-4xl md:text-8xl font-[900] text-[#0F172A] tracking-tighter leading-[0.95] uppercase">
                Cracklix <br/> <span className="text-primary">Android</span>
              </h1>
              <p className="text-slate-500 font-medium text-base md:text-2xl max-w-2xl mx-auto leading-tight">
                 Experience native performance and offline mock tests. Download the official stable release below.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start pb-20">
           <div className="lg:col-span-7">
              <Card className="border-none shadow-5xl rounded-[3rem] bg-[#0B1528] text-white overflow-hidden p-8 md:p-16 space-y-12 relative group">
                 <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                    <Smartphone className="h-64 w-64 md:h-96 md:w-96" />
                 </div>
                 
                 <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between">
                       <Badge className="bg-primary text-white border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl">
                          PRODUCTION BUILD
                       </Badge>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <Clock className="h-3 w-3 text-primary" /> Updated: {PLATFORM_VERSION.releaseDate}
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-2">
                          <h2 className="text-3xl md:text-6xl font-black tracking-tight">V{PLATFORM_VERSION.version}</h2>
                          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Official Registry Node</p>
                       </div>

                       <div className="space-y-6">
                          <p className="text-slate-400 text-base md:text-xl font-medium leading-relaxed">
                            Includes full access to the MCQ Bank, Hall of Rankers, and high-speed Computer Based Test simulation.
                          </p>
                          <div className="flex flex-col gap-4">
                             <Button 
                               onClick={handleDownload}
                               disabled={!apkFound}
                               className="w-full h-16 md:h-24 bg-primary hover:bg-blue-700 text-white font-black uppercase text-xs md:text-lg tracking-[0.2em] rounded-[2rem] border-none shadow-4xl group active:scale-[0.98] transition-all"
                             >
                                <Download className="h-6 w-6 md:h-8 md:w-8 mr-4 group-hover:translate-y-1 transition-transform" /> 
                                {apkFound ? 'Download APK Now' : 'Syncing Build...'}
                             </Button>
                             <div className="flex items-center justify-center gap-6 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Play Protect Verified</span>
                                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Version Control Active</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </Card>
           </div>

           <div className="lg:col-span-5 space-y-10 text-left">
              <div className="space-y-6">
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] ml-2">Simple Installation</h3>
                 <div className="space-y-3">
                    <GuideStep step="1" title="Get APK" desc="Tap the download button and wait for the transfer to complete." />
                    <GuideStep step="2" title="Enable Sources" desc="Go to Settings > Security and enable 'Install from Unknown Sources'." />
                    <GuideStep step="3" title="Sync Account" desc="Open Cracklix and login with your email to restore your Elite Pass." />
                 </div>
              </div>

              <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 space-y-6 shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                       <ShieldAlert className="h-5 w-5" />
                    </div>
                    <h4 className="font-black text-blue-900 uppercase text-sm">Security Node</h4>
                 </div>
                 <p className="text-xs md:text-sm text-blue-700 font-medium leading-relaxed uppercase">
                    Every production APK is digitally signed and audited by Arsh Grewal Management for full data integrity and privacy.
                 </p>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function GuideStep({ step, title, desc }: any) {
   return (
      <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xl flex items-start gap-6 group hover:translate-x-2 transition-all">
         <div className="h-10 w-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg">
            {step}
         </div>
         <div className="space-y-1">
            <h4 className="font-black text-[#0F172A] uppercase text-xs md:text-sm">{title}</h4>
            <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-tight">{desc}</p>
         </div>
      </div>
   );
}
