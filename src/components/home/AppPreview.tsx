
'use client';

import { motion } from "framer-motion";
import { Apple, Play, Smartphone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview Final App Preview Hub.
 * Fixed image clipping issues by using object-contain and proper framing.
 */

export default function AppPreview() {
  const mockPolice = PlaceHolderImages.find(img => img.id === 'mock-police')?.imageUrl;
  const armyHero = PlaceHolderImages.find(img => img.id === 'hero-army')?.imageUrl;
  const armyStrategic = PlaceHolderImages.find(img => img.id === 'army-strategic')?.imageUrl;

  return (
    <section className="py-32 bg-white overflow-hidden border-t border-slate-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 text-left"
          >
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
               <Smartphone className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-5xl lg:text-7xl font-headline font-black text-[#0F172A] leading-[0.95] tracking-tight uppercase">
              CRACKLIX IN <br/>
              <span className="text-primary">YOUR POCKET</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
              Download the official mobile node to access high-fidelity mocks and AI rationalizations anywhere in Punjab.
            </p>

            <ul className="space-y-5 pt-4">
               <FeatureItem text="Bilingual CBT Interface (PA/EN)" />
               <FeatureItem text="AI-Powered Audit Rationalizations" />
               <FeatureItem text="All Punjab State Ranking Index" />
            </ul>

            <div className="flex flex-wrap gap-4 pt-8">
              <Button className="h-16 px-8 bg-[#0F172A] hover:bg-black text-white rounded-2xl flex items-center gap-4 shadow-xl transition-all active:scale-95">
                <Apple className="h-8 w-8" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold opacity-50 leading-none">Download on</p>
                  <p className="text-xl font-bold mt-1 leading-none">App Store</p>
                </div>
              </Button>
              <Button className="h-16 px-8 bg-[#0F172A] hover:bg-black text-white rounded-2xl flex items-center gap-4 shadow-xl transition-all active:scale-95">
                <Play className="h-8 w-8" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold opacity-50 leading-none">Get it on</p>
                  <p className="text-xl font-bold mt-1 leading-none">Google Play</p>
                </div>
              </Button>
            </div>
          </motion.div>

          <div className="flex justify-center items-end gap-6 lg:gap-8">
             {/* Phone Mockups with FIXED object-fit to prevent clipping */}
             <div className="relative w-44 md:w-52 aspect-[9/19] bg-[#0F172A] rounded-[2.5rem] border-[8px] border-[#0F172A] shadow-5xl overflow-hidden group hover:-translate-y-4 transition-all duration-500">
                <img 
                  src={mockPolice!} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
             
             <div className="relative w-52 md:w-60 aspect-[9/19] bg-[#0B1528] rounded-[3rem] border-[10px] border-[#0B1528] shadow-5xl overflow-hidden z-10 hover:-translate-y-6 transition-all duration-500">
                <img 
                  src={armyHero!} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
             </div>

             <div className="relative w-44 md:w-52 aspect-[9/19] bg-[#0F172A] rounded-[2.5rem] border-[8px] border-[#0F172A] shadow-5xl overflow-hidden group hover:-translate-y-4 transition-all duration-500">
                <img 
                  src={armyStrategic!} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 text-[#0F172A] font-bold uppercase text-xs tracking-tight">
       <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
       </div>
       {text}
    </li>
  );
}
