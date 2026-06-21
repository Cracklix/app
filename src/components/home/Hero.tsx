'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  ShieldCheck,
  Users,
  Zap,
  ChevronRight,
  BookOpen,
  FileText,
  BarChart3,
  Star,
  Gem
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useDoc, useFirestore, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * @fileOverview Official Live Hero Hub v21.0 (Normalized).
 */

const formatCompact = (num: number) => {
  if (num === undefined || num === null) return "...";
  if (num === 0) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default function Hero() {
  const { profile } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading: statsLoading } = useDoc<any>(statsRef);

  const liveStats = useMemo(() => [
    {
      id: "q",
      icon: <Zap className="h-4 w-4 text-blue-600 fill-current" />,
      val: statsLoading ? "..." : `${formatCompact(stats?.totalQuestions)}+`,
      label: "QUESTIONS",
      bgColor: "bg-blue-50"
    },
    {
      id: "m",
      icon: <ClipboardList className="h-4 w-4 text-indigo-600" />,
      val: statsLoading ? "..." : `${formatCompact(stats?.totalMocks)}+`,
      label: "MOCK TESTS",
      bgColor: "bg-indigo-50"
    },
    {
      id: "e",
      icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
      val: statsLoading ? "..." : `${formatCompact(stats?.totalCategories)}+`,
      label: "EXAMS LIVE",
      bgColor: "bg-emerald-50"
    },
    {
      id: "u",
      icon: <Users className="h-4 w-4 text-orange-500" />,
      val: statsLoading ? "..." : `${formatCompact(stats?.totalUsers)}+`,
      label: "ASPIRANTS",
      bgColor: "bg-orange-50"
    }
  ], [stats, statsLoading]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-blue-50 py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* LEFT: Text Hub */}
          <div className="text-left space-y-4 md:space-y-6">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm"
            >
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 animate-pulse" />
              <span className="text-[10px] md:text-[11px] font-black text-slate-700 tracking-tight uppercase">
                {statsLoading ? "..." : (stats?.totalUsers || 0).toLocaleString()} ASPIRANTS TRUST CRACKLIX
              </span>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] leading-[1.05]">
                Crack Punjab <br/>
                <span className="block text-primary">
                  Government Exams
                </span>
                With Confidence
              </h1>

              <p className="text-sm md:text-lg text-slate-600 max-w-lg leading-relaxed font-medium">
                Practice with bilingual mock tests, previous papers and exam-focused preparation nodes verified by official patterns.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {["PSSSB", "Police", "PSTET", "PSPCL", "PPSC"].map(
                  (item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-500 tracking-tight"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild className="h-12 md:h-14 px-8 rounded-xl bg-primary hover:bg-blue-700 shadow-lg text-white font-bold text-xs tracking-tight gap-2">
                <Link href="/mocks">Start Free Mock Test <ChevronRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="h-12 md:h-14 px-8 rounded-xl border-slate-200 bg-white font-bold text-slate-700 text-xs tracking-tight gap-2 shadow-sm">
                <Link href="/pass"><Gem className="h-4 w-4 text-primary" /> Elite Pass</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT: Feature Grid */}
          <div className="relative">
             <div className="absolute -inset-10 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
             <div className="grid grid-cols-2 gap-3 md:gap-4 relative z-10">
               <FeatureNode icon={ClipboardList} title="Mock Tests" sub={`${formatCompact(stats?.totalMocks)}+ Series`} href="/mocks" color="text-blue-600" />
               <FeatureNode icon={BookOpen} title="Study Material" sub="Verified PDFs" href="/notes" color="text-indigo-600" />
               <FeatureNode icon={FileText} title="PYQ Archive" sub="Solved Papers" href="/pyqs" color="text-emerald-600" />
               <FeatureNode icon={BarChart3} title="Performance" sub="State Rankings" href="/dashboard" color="text-orange-500" />
             </div>
          </div>
        </div>

        {/* STATS STRIP: Normalized Scale */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mt-12 md:mt-16">
          {liveStats.map((stat) => (
            <div 
              key={stat.id} 
              className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white border border-slate-100 shadow-sm flex items-center gap-4 group transition-all"
            >
              <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center shrink-0 shadow-inner", stat.bgColor)}>
                {stat.icon}
              </div>
              <div className="text-left min-w-0">
                <p className="text-lg md:text-2xl font-black text-[#0F172A] leading-none tabular-nums truncate">
                  {stat.val}
                </p>
                <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureNode({ icon: Icon, title, sub, href, color }: any) {
  return (
    <Link href={href}>
      <Card className="p-5 md:p-8 rounded-[2rem] border-slate-100 bg-white hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 h-full group">
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <div className="space-y-1">
          <h3 className="font-black text-sm md:text-lg text-[#0F172A] uppercase leading-tight">{title}</h3>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
        </div>
      </Card>
    </Link>
  )
}
