'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileCheck,
  FileText,
  Target,
  Building2,
  Star,
  Zap,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Official Cracklix Majestic Hero v16.0.
 * MATCHED: Strictly aligned with user screenshot (Pills + 4-Card Row).
 */

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const boardPills = [
    "PSSSB",
    "Punjab Police",
    "PSTET",
    "PSPCL",
    "PPSC"
  ];

  const quickCards = [
    {
      title: "Mock Tests",
      desc: "Exam-focused mock tests",
      icon: <FileCheck className="h-5 w-5 text-white" />,
      bgColor: "bg-blue-600"
    },
    {
      title: "Previous Papers",
      desc: "Previous year question papers",
      icon: <FileText className="h-5 w-5 text-white" />,
      bgColor: "bg-emerald-600"
    },
    {
      title: "Daily Practice",
      desc: "Practice daily & stay ahead",
      icon: <Target className="h-5 w-5 text-white" />,
      bgColor: "bg-purple-600"
    },
    {
      title: "Punjab Exams",
      desc: "All major Punjab exams at one place",
      icon: <Building2 className="h-5 w-5 text-white" />,
      bgColor: "bg-orange-500"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] pt-12 pb-24 md:pt-20 md:pb-32 border-b border-slate-100 text-left">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 space-y-10 md:space-y-12">
        
        {/* TOP CONTENT HUB */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <Star className="h-4 w-4 text-blue-600 fill-current" />
              <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-widest">10,000+ Aspirants Trust Cracklix</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
                Your Journey to <br />
                <span className="text-blue-600">Government Job</span> <br />
                Starts Here!
              </h1>
              
              {/* DESCRIPTION FROM SCREENSHOT */}
              <p className="text-base md:text-xl text-slate-600 font-medium max-w-xl leading-relaxed">
                Practice with high-quality mock tests, previous papers and exam-focused preparation for top Punjab exams.
              </p>

              {/* PILLS FROM SCREENSHOT */}
              <div className="flex flex-wrap gap-3 pt-2">
                {boardPills.map((pill) => (
                  <Link key={pill} href="/exams">
                    <div className="bg-white border border-blue-600 text-blue-600 px-5 py-2 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest shadow-sm hover:bg-blue-50 transition-all active:scale-95">
                      {pill}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex flex-wrap gap-4 pt-4">
              <Button asChild className="h-16 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 gap-3 border-none transition-all active:scale-95">
                <Link href="/mocks">Start Free Mock Test <ArrowRight className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>

          {/* ILLUSTRATION HUB */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[550px] aspect-square">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-100/30 rounded-full blur-3xl -z-10" />
              <motion.img 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                src="/images/hero-student.png" 
                className="w-full h-auto drop-shadow-2xl relative z-10" 
                alt="Cracklix Student" 
              />
            </div>
          </div>
        </div>

        {/* 4-CARD ROW FROM SCREENSHOT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-10">
          {quickCards.map((card, idx) => (
            <Card key={idx} className="p-5 md:p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-xl hover:translate-y-[-4px] transition-all text-left">
              <div className={cn("h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform", card.bgColor)}>
                {card.icon}
              </div>
              <div className="space-y-0.5 min-w-0">
                <h3 className="text-sm md:text-base font-black text-slate-900 uppercase tracking-tight truncate">{card.title}</h3>
                <p className="text-[10px] md:text-xs font-medium text-slate-400 leading-tight line-clamp-1">{card.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* MOBILE ACTION HUB */}
        <div className="flex flex-col gap-3 w-full lg:hidden mt-8">
          <Button asChild className="h-14 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black text-xs tracking-widest shadow-xl border-none transition-all active:scale-95">
            <Link href="/exams" className="flex items-center justify-between w-full px-6">
              <div className="flex items-center gap-3">
                <zap className="h-5 w-5 text-white fill-current" />
                <span>Start Learning</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
