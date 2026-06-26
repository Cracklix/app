'use client';

import React from "react";
import { 
  Smartphone, 
  CheckCircle2, 
  Zap, 
  LayoutGrid, 
  Activity, 
  Gem, 
  ChevronRight 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * @fileOverview Study Anywhere Hub v29.0 - Fully Fluid Responsive Overhaul.
 */

export default function AppPreview() {
  const features = [
    { icon: Smartphone, label: "Mobile Hub", desc: "Optimized for Android", color: "text-blue-500", bgColor: "bg-blue-50" },
    { icon: Zap, label: "Fast Engine", desc: "Instant test rendering", color: "text-orange-500", bgColor: "bg-orange-50" },
    { icon: LayoutGrid, label: "Offline First", desc: "Study without data", color: "text-indigo-500", bgColor: "bg-indigo-50" },
    { icon: Activity, label: "Live Ranks", desc: "Real-time merit index", color: "text-emerald-500", bgColor: "bg-emerald-50" }
  ];

  return (
    <section className="section-py bg-white overflow-hidden border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto container-px space-y-12 md:space-y-24">
        
        <div className="space-y-8 md:space-y-16">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <Smartphone className="h-5 w-5 md:h-8 md:w-8 text-primary shrink-0" />
                 <h2 className="tracking-tight">Study Anywhere</h2>
              </div>
              <p className="max-w-2xl">Experience Punjab's smartest preparation app directly on your mobile device.</p>
           </div>

           <div className="grid gap-4 md:gap-8 lg:gap-10 grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))]">
              {features.map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="border border-slate-100 shadow-xl rounded-[var(--radius)] p-8 md:p-12 text-center space-y-4 hover:translate-y-[-4px] transition-all group cursor-default h-full flex flex-col items-center justify-center">
                     <div className={cn("h-14 w-14 md:h-20 md:w-20 rounded-2xl flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform", f.bgColor, f.color)}>
                        <f.icon className="h-7 w-7 md:h-10 md:w-10" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="font-black leading-tight">{f.label}</h4>
                        <p className="font-medium text-slate-400 leading-snug">{f.desc}</p>
                     </div>
                  </Card>
                </motion.div>
              ))}
           </div>
        </div>

        <div className="w-full">
           <motion.div
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
           >
              <Card className="bg-[#0B1528] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 text-white relative overflow-hidden shadow-5xl group border border-white/5">
                 <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                   <Gem className="h-40 w-40 md:h-80 md:w-80 text-primary" />
                 </div>
                 <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="text-center lg:text-left space-y-6 md:space-y-10 flex-1">
                       <h3 className="text-3xl md:text-6xl font-black tracking-tighter leading-[0.95] text-white">Elite Membership</h3>
                       <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-sm md:text-xl font-medium text-slate-400">
                          <span className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-primary" /> Full Mock Series</span>
                          <span className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-primary" /> Premium Hub</span>
                          <span className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-primary" /> State Rankings</span>
                       </div>
                    </div>
                    <Button asChild className="w-full lg:w-auto h-14 md:h-20 px-12 md:px-20 bg-primary hover:bg-blue-700 text-white font-black text-lg shadow-4xl transition-all border-none active:scale-95 shrink-0 rounded-full">
                       <Link href="/pass" className="flex items-center gap-3">
                         Join Elite Now <ChevronRight className="h-6 w-6" />
                       </Link>
                    </Button>
                 </div>
              </Card>
           </motion.div>
        </div>

      </div>
    </section>
  );
}