"use client"

import React, { useState, useEffect } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"
import { 
  Smartphone, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Apple, 
  Share,
  PlusSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * @fileOverview High-Fidelity PWA Install Hub v1.1 (Build Fixed).
 * FIXED: Imported Badge from standard UI node and added React for cloneElement.
 */

export default function InstallPage() {
  const [device, setDevice] = useState<'android' | 'ios' | 'desktop' | 'unknown'>('desktop');
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) setDevice('android');
    else if (/iphone|ipad|ipod/.test(ua)) setDevice('ios');
    else setDevice('desktop');

    const updateInstallable = () => {
      setCanInstall(!!(window as any).deferredPrompt);
    };

    window.addEventListener('beforeinstallprompt', updateInstallable);
    window.addEventListener('pwa-installable', updateInstallable);
    updateInstallable();

    return () => {
      window.removeEventListener('beforeinstallprompt', updateInstallable);
      window.removeEventListener('pwa-installable', updateInstallable);
    };
  }, []);

  const handleAndroidInstall = async () => {
    const prompt = (window as any).deferredPrompt;
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') (window as any).deferredPrompt = null;
    }
  };

  return (
    <div className="min-h-screen bg-white font-body text-left">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 md:py-24 max-w-5xl space-y-16 md:space-y-24">
        
        <div className="text-center space-y-6 max-w-3xl mx-auto">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="h-20 w-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-primary shadow-2xl"
           >
              <Zap className="h-10 w-10 fill-current" />
           </motion.div>
           <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-black text-[#0F172A] tracking-tighter leading-[0.95] uppercase">
                Install <span className="text-primary">Cracklix</span>
              </h1>
              <p className="text-sm md:text-2xl text-slate-500 font-medium leading-tight">
                 Get the true app experience on your home screen without the Play Store costs.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           
           {/* DEVICE SPECIFIC CARD */}
           <div className="lg:col-span-7">
              <Card className="border-none shadow-5xl rounded-[3rem] bg-[#0B1528] text-white overflow-hidden p-8 md:p-14 space-y-10 relative">
                 <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
                    {device === 'ios' ? <Apple className="h-64 w-64" /> : <Smartphone className="h-64 w-64" />}
                 </div>
                 
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                       <Badge className="bg-primary text-white border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">
                          {device.toUpperCase()} DETECTION ACTIVE
                       </Badge>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                       {device === 'ios' ? 'Steps for iPhone' : device === 'android' ? 'Install Android App' : 'Desktop App Setup'}
                    </h2>

                    {device === 'ios' ? (
                       <div className="space-y-6">
                          <IOSStep num={1} icon={<Share className="h-4 w-4" />} text="Tap the 'Share' button in Safari browser" />
                          <IOSStep num={2} icon={<PlusSquare className="h-4 w-4" />} text="Scroll down and tap 'Add to Home Screen'" />
                          <IOSStep num={3} icon={<Sparkles className="h-4 w-4" />} text="Confirm and start preparing with Cracklix" />
                       </div>
                    ) : (
                       <div className="space-y-8">
                          <p className="text-slate-400 text-lg font-medium leading-relaxed">
                             Cracklix is optimized for your {device === 'android' ? 'Android device' : 'Computer'}. Install now for a faster, full-screen experience.
                          </p>
                          <Button 
                             onClick={device === 'android' ? handleAndroidInstall : undefined}
                             disabled={device === 'android' && !canInstall}
                             className="w-full h-16 md:h-20 bg-primary hover:bg-blue-600 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl shadow-3xl transition-all active:scale-95 border-none gap-4"
                          >
                             <Download className="h-6 w-6" /> {canInstall ? 'INSTALL CRACKLIX APP' : 'ALREADY INSTALLED'}
                          </Button>
                          {device === 'android' && !canInstall && (
                             <p className="text-[10px] text-center font-bold text-slate-500 uppercase tracking-widest">
                                Tip: Check your browser menu if the install prompt didn't appear.
                             </p>
                          )}
                       </div>
                    )}
                 </div>
              </Card>
           </div>

           {/* BENEFITS SIDEBAR */}
           <div className="lg:col-span-5 space-y-8">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] ml-1">App Benefits</h3>
              <div className="grid grid-cols-1 gap-4">
                 <BenefitRow icon={<Smartphone />} title="Fullscreen Mode" desc="Zero distractions during mock tests." />
                 <BenefitRow icon={<Zap />} title="Instant Loading" desc="Cached assets for rapid navigation." />
                 <BenefitRow icon={<ShieldCheck />} title="Verified Node" desc="Institutional security on every session." />
              </div>
           </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}

function IOSStep({ num, icon, text }: any) {
   return (
      <div className="flex items-center gap-6 group">
         <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-primary shadow-inner">
            {num}
         </div>
         <div className="flex items-center gap-3 text-slate-200">
            <span className="p-2 bg-white/10 rounded-lg text-primary">{icon}</span>
            <span className="text-sm md:text-lg font-bold uppercase tracking-tight">{text}</span>
         </div>
      </div>
   )
}

function BenefitRow({ icon, title, desc }: any) {
   return (
      <div className="p-6 md:p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-xl transition-all">
         <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform shrink-0">
            {React.cloneElement(icon, { className: "h-6 w-6" })}
         </div>
         <div className="text-left">
            <h4 className="font-black text-sm uppercase text-[#0F172A] tracking-tight">{title}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{desc}</p>
         </div>
      </div>
   )
}
