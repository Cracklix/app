
'use client';

import { motion } from "framer-motion";
import { Apple, Play, Smartphone, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AppPreview() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
               <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-5xl lg:text-7xl font-headline font-black text-[#0F172A] leading-tight tracking-tight">
              Cracklix in <br/>
              <span className="text-primary">Your Pocket</span>
            </h2>
            <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
              Download the official Cracklix app to access daily current affairs, attempt mock tests, and get real-time exam alerts on the go.
            </p>

            <ul className="space-y-4 pt-4">
               <FeatureItem text="Bilingual Test Interface (Punjabi/English)" />
               <FeatureItem text="Offline Mode for Study Materials" />
               <FeatureItem text="Instant Result & All Punjab Rank" />
            </ul>

            <div className="flex flex-wrap gap-4 pt-8">
              <Button className="h-16 px-8 bg-[#0F172A] hover:bg-[#1E3A8A] text-white rounded-2xl flex items-center gap-4 shadow-xl">
                <Apple className="h-8 w-8" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold opacity-70">Download on the</p>
                  <p className="text-xl font-bold">App Store</p>
                </div>
              </Button>
              <Button className="h-16 px-8 bg-[#0F172A] hover:bg-[#1E3A8A] text-white rounded-2xl flex items-center gap-4 shadow-xl">
                <Play className="h-8 w-8" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold opacity-70">GET IT ON</p>
                  <p className="text-xl font-bold">Google Play</p>
                </div>
              </Button>
            </div>
          </motion.div>

          <div className="flex justify-center items-center gap-6 lg:gap-10">
             <div className="relative w-52 h-[450px] bg-black rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden mt-20">
                <Image src="https://picsum.photos/seed/m1/400/800" fill alt="App" className="object-cover opacity-80" />
             </div>
             <div className="relative w-60 h-[520px] bg-black rounded-[3rem] border-[10px] border-slate-900 shadow-2xl overflow-hidden z-10">
                <Image src="https://picsum.photos/seed/m2/400/800" fill alt="Dashboard" className="object-cover" />
             </div>
             <div className="relative w-52 h-[450px] bg-black rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden mt-20">
                <Image src="https://picsum.photos/seed/m3/400/800" fill alt="Result" className="object-cover opacity-80" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-slate-700 font-bold">
       <CheckCircle2 className="h-5 w-5 text-emerald-500" />
       {text}
    </li>
  );
}
