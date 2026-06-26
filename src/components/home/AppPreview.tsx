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

/**
 * @fileOverview Study Anywhere Hub v28.5 - Normalized Case.
 */

export default function AppPreview() {
  return (
    <section className="py-12 md:py-24 bg-white overflow-hidden border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
        
        {/* Study Anywhere Section */}
        <div className="space-y-6 md:space-y-12">
           <div className="space-y-1 px-1">
              <div className="flex items-center gap-3">
                 <Smartphone className="h-5 w-5 text-primary shrink-0" />
                 <h2 className="text-xl md:text-4xl font-black text-[#0F172A] tracking-tight">Study Anywhere</h2>
              </div>
              <p className="text-slate-500 font-medium text-sm md:text-lg">Experience Punjab's smartest app on your mobile device.</p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <FeatureCard icon={Smartphone} label="Mobile Friendly" desc="Optimized for Android" color="text-blue-500" />
              <FeatureCard icon={Zap} label="Fast Loading" desc="Rapid test engine" color="text-orange-500" />
              <FeatureCard icon={LayoutGrid} label="Offline Support" desc="Study without limits" color="text-indigo-500" />
              <FeatureCard icon={Activity} label="Live Analytics" desc="Track your progress" color="text-emerald-500" />
           </div>
        </div>

        {/* Elite Membership Banner */}
        <div className="px-1">
           <Card className="bg-[#0B1528] rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 text-white relative overflow-hidden shadow-4xl group border border-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">
                <Gem className="h-32 w-32 md:h-48 md:w-48" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="text-center md:text-left space-y-4 md:space-y-6">
                    <h3 className="text-2xl md:text-5xl font-black tracking-tight leading-none">Elite Membership</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-xs md:text-sm font-medium text-slate-400">
                       <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Full Mock Series</span>
                       <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Premium Study Notes</span>
                       <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> State Rank Index</span>
                    </div>
                 </div>
                 <Button asChild className="w-full md:w-auto h-14 md:h-16 px-12 bg-primary hover:bg-blue-700 text-white font-bold text-base shadow-2xl transition-all border-none active:scale-95 shrink-0">
                    <Link href="/pass" className="flex items-center gap-2">
                      Join Now <ChevronRight className="h-5 w-5" />
                    </Link>
                 </Button>
              </div>
           </Card>
        </div>

      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, label, desc, color }: any) {
   return (
      <Card className="border border-slate-100 shadow-xl rounded-[1.5rem] p-6 md:p-10 text-center space-y-3 md:space-y-4 hover:translate-y-[-4px] transition-all group cursor-default h-full flex flex-col items-center justify-center">
         <div className={cn("h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform", color)}>
            <Icon className="h-6 w-6 md:h-8 md:w-8" />
         </div>
         <div className="space-y-1">
            <h4 className="text-base md:text-xl font-black text-[#0F172A] leading-tight">{label}</h4>
            <p className="text-sm md:text-base font-medium text-slate-400 leading-snug">{desc}</p>
         </div>
      </Card>
   )
}