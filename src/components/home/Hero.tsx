
'use client';

import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Search, Zap, GraduationCap, Trophy, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * @fileOverview Professional Mock Platform Hero.
 * Styled like Adda247 with search hub and broad exam category nodes.
 */

export default function Hero() {
  const policeImage = PlaceHolderImages.find(img => img.id === 'hero-police')?.imageUrl || "https://punjabpolice.gov.in/media/images/pp10.original.jpg";

  return (
    <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 bg-[#08152D] overflow-hidden">
      {/* Institutional Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
         <img 
            src="https://www.mapsofindia.com/maps/punjab/punjab-map.jpg" 
            className="w-full h-full object-cover scale-125 grayscale invert"
            alt="Watermark"
         />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 lg:space-y-10 text-left"
          >
            <div className="space-y-4">
               <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Punjab's #1 Mock Hub 2026</span>
               </div>
               <h1 className="text-4xl lg:text-7xl font-headline font-black leading-[0.95] tracking-tighter text-white uppercase">
                  MASTER EVERY <br/> <span className="text-primary text-glow">GOVT EXAM.</span>
               </h1>
               <p className="text-lg lg:text-xl text-slate-400 font-medium max-w-xl antialiased leading-relaxed">
                  Join 15,000+ aspirants preparing for PSSSB, PPSC, Punjab Police, Indian Army, and National level hubs.
               </p>
            </div>

            {/* Adda247 Style Search Hub */}
            <div className="relative group max-w-2xl">
               <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
               <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-2xl">
                  <Search className="absolute left-6 h-5 w-5 text-slate-400" />
                  <Input 
                    placeholder="Search for PSSSB Clerk, Police SI, Army GD..." 
                    className="h-16 pl-14 pr-4 border-none text-lg font-medium text-[#0F172A] bg-transparent focus-visible:ring-0 w-full"
                  />
                  <Button className="hidden md:flex h-14 px-8 bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-xl ml-2 gap-3 shadow-xl">
                    <ArrowRight className="h-4 w-4" /> Find Test
                  </Button>
               </div>
            </div>

            {/* Quick Category Nodes */}
            <div className="flex flex-wrap gap-4 pt-2">
               <CategoryPill icon={<Zap />} label="PSSSB" href="/exams" />
               <CategoryPill icon={<ShieldCheck />} label="POLICE" href="/exams" />
               <CategoryPill icon={<Trophy />} label="ARMY" href="/exams" />
               <CategoryPill icon={<Globe />} label="SSC/CTET" href="/exams" />
               <CategoryPill icon={<GraduationCap />} label="TEACHING" href="/exams" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            {/* Professional Framed Tactical Asset */}
            <div className="relative aspect-[4/3] w-full max-w-[650px] ml-auto">
               <div className="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full opacity-50" />
               <div className="relative h-full w-full rounded-[4rem] overflow-hidden border-[12px] border-white/5 shadow-5xl group bg-slate-800">
                  <img 
                    src={policeImage} 
                    alt="Punjab Authority Hub" 
                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08152D] via-transparent to-transparent opacity-60" />
               </div>
               
               {/* Floating Stats Badge */}
               <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-[2rem] shadow-4xl flex items-center gap-6 border border-slate-100 animate-bounce-slow">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                     <ShieldCheck className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-left pr-4">
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Official Pattern</p>
                     <p className="text-xl font-headline font-black text-[#0F172A] leading-none">2026 AUDITED</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CategoryPill({ icon, label, href }: any) {
   return (
      <Link href={href}>
         <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 cursor-pointer group shadow-sm">
            <span className="text-primary group-hover:text-white transition-colors">{icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
         </div>
      </Link>
   )
}
