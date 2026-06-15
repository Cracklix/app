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
  Target,
  Award,
  Star,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Majestic SaaS Hero Section v6.0.
 * UPDATED: Background color matched to student illustration (#F8FAFC).
 * UPDATED: Precise floating card positioning and mobile-first grid logic.
 */

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const liveStats = useMemo(() => {
    const formatNumber = (num: number, fallback: string) => {
      if (!num) return fallback;
      if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
      return num + "+";
    };

    return [
      {
        id: "q",
        icon: <Zap className="h-6 w-6 text-blue-600" />,
        val: formatNumber(stats?.totalQuestions, "50K+"),
        label: "Questions",
        subLabel: "High quality practice questions",
        color: "bg-blue-600"
      },
      {
        id: "m",
        icon: <ClipboardList className="h-6 w-6 text-indigo-600" />,
        val: formatNumber(stats?.totalMocks, "500+"),
        label: "Mock Tests",
        subLabel: "Topic wise & full length mocks",
        color: "bg-indigo-600"
      },
      {
        id: "e",
        icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
        val: formatNumber(stats?.totalBoards, "50+"),
        label: "Exams",
        subLabel: "All major Punjab exams",
        color: "bg-emerald-600"
      },
      {
        id: "u",
        icon: <Users className="h-6 w-6 text-orange-500" />,
        val: formatNumber(stats?.totalUsers, "15K+"),
        label: "Aspirants",
        subLabel: "Trust Cracklix for preparation",
        color: "bg-orange-500"
      }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-12 md:py-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT COLUMN: CONTENT HUB */}
          <div className="text-left space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
              <span className="text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-widest">
                10,000+ Aspirants Trust Cracklix
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-black text-[#0F172A] leading-[1.1] tracking-tight uppercase">
              Crack Punjab <br />
              <span className="text-blue-600">Government Exams</span> <br />
              With Confidence
            </h1>

            {/* Description */}
            <p className="text-sm md:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
              Practice bilingual mock tests and prepare for Punjab Government Exams with confidence. 
              Access exam-focused practice, previous papers and performance tracking in one place.
            </p>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {["PSSSB", "Punjab Police", "PSTET", "PSPCL", "PPSC"].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-white border border-slate-200 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Horizontal Feature Hub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
               <FeatureMinicard icon={<ClipboardList className="text-blue-600" />} color="bg-blue-50" title="Mock Tests" sub="Exam-focused tests" />
               <FeatureMinicard icon={<FileText className="text-emerald-600" />} color="bg-emerald-50" title="Previous Papers" sub="Verified PDF archives" />
               <FeatureMinicard icon={<Target className="text-indigo-600" />} color="bg-indigo-50" title="Daily Practice" sub="Stay ahead daily" />
               <FeatureMinicard icon={<Award className="text-orange-500" />} color="bg-orange-50" title="Punjab Exams" sub="All state boards" />
            </div>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button
                asChild
                className="w-full sm:w-auto h-12 md:h-16 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 border-none group"
              >
                <Link href="/mocks">
                  Start Free Mock Test
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto h-12 md:h-16 px-10 rounded-2xl border-slate-200 bg-white font-black uppercase tracking-widest text-xs md:text-sm text-slate-600 hover:bg-slate-50 shadow-sm group"
              >
                <Link href="/exams">
                  Browse Exams
                </Link>
              </Button>
            </div>

          </div>

          {/* RIGHT COLUMN: ILLUSTRATION HUB */}
          <div className="relative flex flex-col justify-center items-center py-10 lg:py-0">
            {/* Desktop View: Floating Layout */}
            <div className="relative w-full max-w-[520px] xl:max-w-[620px] aspect-square flex items-center justify-center">
              
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/40 blur-[80px] rounded-full -z-10" />

              <motion.img
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                src="/images/hero-student.png"
                alt="Cracklix Student"
                className="w-full h-full object-contain drop-shadow-2xl relative z-10"
              />

              {/* Floating Cards (Desktop Only) */}
              <div className="hidden lg:block">
                <FloatingBadge 
                  icon={<ClipboardList className="text-blue-600 h-5 w-5" />} 
                  label="Mock Tests" 
                  href="/mocks"
                  className="top-10 -left-12"
                />
                <FloatingBadge 
                  icon={<Target className="text-indigo-600 h-5 w-5" />} 
                  label="Daily Practice" 
                  href="/practice"
                  className="bottom-24 -left-16"
                />
                <FloatingBadge 
                  icon={<FileText className="text-emerald-600 h-5 w-5" />} 
                  label="Previous Papers" 
                  href="/pyqs"
                  className="top-20 -right-16"
                />
                <FloatingBadge 
                  icon={<Award className="text-orange-500 h-5 w-5" />} 
                  label="Punjab Exams" 
                  href="/exams"
                  className="bottom-40 -right-20"
                />
              </div>
            </div>

            {/* Mobile View: Grid Layout for Features */}
            <div className="grid grid-cols-2 gap-3 mt-10 w-full lg:hidden">
              <MobileFeatureCard icon={<ClipboardList />} label="Mock Tests" href="/mocks" color="text-blue-600" />
              <MobileFeatureCard icon={<FileText />} label="Previous Papers" href="/pyqs" color="text-emerald-600" />
              <MobileFeatureCard icon={<Target />} label="Daily Practice" href="/practice" color="text-indigo-600" />
              <MobileFeatureCard icon={<Award />} label="Punjab Exams" href="/exams" color="text-orange-500" />
            </div>
          </div>
        </div>

        {/* INSTITUTIONAL STATS REGISTRY */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16 md:mt-24 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          {liveStats.map((stat) => (
            <Card
              key={stat.id}
              className="p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 group text-left flex flex-col sm:flex-row items-center sm:items-start gap-4"
            >
              <div className={cn("h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform bg-slate-50")}>
                {stat.icon}
              </div>
              <div className="text-center sm:text-left min-w-0">
                <p className="text-2xl md:text-3xl font-black text-[#0F172A] leading-none tracking-tighter uppercase">
                  {stat.val}
                </p>
                <p className="text-[10px] md:text-sm font-black text-[#0F172A] uppercase tracking-tight mt-1">
                  {stat.label}
                </p>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 hidden xs:block">
                  {stat.subLabel}
                </p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}

function FeatureMinicard({ icon, color, title, sub }: { icon: React.ReactNode, color: string, title: string, sub: string }) {
   return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-blue-600/20 transition-all">
         <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", color)}>
            {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4" })}
         </div>
         <div className="min-w-0">
            <p className="text-[9px] font-black uppercase text-[#0F172A] leading-none">{title}</p>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mt-1 truncate">{sub}</p>
         </div>
      </div>
   )
}

function FloatingBadge({ icon, label, href, className }: { icon: React.ReactNode, label: string, href: string, className: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={cn(
        "absolute z-20",
        className
      )}
    >
      <Link href={href}>
        <div className="bg-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 active:scale-95 transition-all">
           <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center">
              {icon}
           </div>
           <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest whitespace-nowrap">{label}</span>
        </div>
      </Link>
    </motion.div>
  );
}

function MobileFeatureCard({ icon, label, href, color }: { icon: React.ReactNode, label: string, href: string, color: string }) {
  return (
    <Link href={href} className="block w-full">
      <Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all">
        <div className={cn("h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center", color)}>
          {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
        </div>
        <span className="text-[10px] font-black uppercase text-[#0F172A] text-center">{label}</span>
      </Card>
    </Link>
  );
}
