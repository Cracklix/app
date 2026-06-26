'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Star,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { AuthorityLogo } from "@/lib/exam-icons";
import Image from "next/image"

/**
 * @fileOverview Hero Hub v6.0 - Restored Image & Optimized Mobile Stack.
 */
export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-blue-50 pt-5 pb-8 md:pt-24 md:pb-32">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 md:gap-20 items-center">

          {/* 1. TEXT CONTENT - PRIMARY NODE */}
          <div className="text-center lg:text-left space-y-6 md:space-y-10 order-1">
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm group hover:border-primary/30 transition-all cursor-default"
            >
              <Star className="h-3.5 w-3.5 md:h-4 md:w-4 text-yellow-500 fill-yellow-500 animate-pulse" />
              <span className="text-[11px] md:text-[13px] font-bold text-slate-700 tracking-tight">
                Punjab's smartest exam platform
              </span>
            </motion.div>

            <div className="space-y-4 md:space-y-6">
              <h1 className="text-[32px] md:text-5xl lg:text-7xl font-[800] tracking-tight text-slate-900 leading-[1.1] md:leading-[1.05] [text-wrap:balance]">
                Crack Punjab Govt Exams <br className="hidden md:block"/>
                <span className="block text-primary">With Confidence</span>
              </h1>

              <p className="text-[14px] md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Practice tests, previous papers, and study material verified by official board patterns.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md mx-auto lg:mx-0">
               <Button asChild className="w-full h-14 md:h-16 px-10 rounded-full font-bold text-base tracking-tight shadow-xl active:scale-95 transition-all border-none">
                  <Link href="/mocks" className="flex items-center justify-center gap-2">
                    Start Learning <ArrowRight className="h-5 w-5" />
                  </Link>
               </Button>
               <Button asChild variant="outline" className="w-full h-14 md:h-16 px-10 rounded-full font-bold text-base tracking-tight shadow-sm border-2 active:scale-95 transition-all">
                  <Link href="/exams">Explore Exams</Link>
               </Button>
            </div>
          </div>

          {/* 2. HERO IMAGE - RESTORED & POSITIONED */}
          <div className="flex flex-col items-center order-2 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} 
              className="relative w-full aspect-[4/3] md:aspect-square max-h-[240px] md:max-h-none overflow-visible"
            >
              <Image 
                src="/images/hero-student.png" 
                alt="Cracklix Preparation Hub" 
                fill
                className="object-contain drop-shadow-[0_20px_50px_rgba(22,119,255,0.2)]" 
                priority
              />
            </motion.div>
          </div>
        </div>

        {/* QUICK ACTIONS HUB */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 mt-12 md:mt-24">
          <QuickActionCard 
            boardId="mock-test"
            label="Practice Tests" 
            href="/mocks" 
          />
          <QuickActionCard 
            boardId="study-material"
            label="Study Material" 
            href="/study-material" 
          />
          <QuickActionCard 
            boardId="pyq"
            label="Previous Papers" 
            href="/pyqs" 
          />
          <QuickActionCard 
            boardId="current-affairs"
            label="Current Affairs" 
            href="/current-affairs" 
          />
        </div>
      </div>
    </section>
  );
}

function QuickActionCard({ boardId, label, href }: { boardId: string, label: string, href: string }) {
  return (
    <Link href={href} className="block group h-full">
      <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-4 md:p-10 flex items-center gap-4 md:gap-8 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer border border-slate-100 active:scale-[0.98] h-full">
        <div className="h-10 w-10 md:h-16 md:w-16 rounded-xl bg-slate-50 shadow-inner flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
          <AuthorityLogo boardId={boardId} size="sm" className="bg-transparent shadow-none p-0 h-6 w-6 md:h-10 md:w-10" />
        </div>
        <div className="text-left min-w-0 flex-1">
          <h3 className="text-[14px] md:text-xl font-[800] text-[#0F172A] leading-tight group-hover:text-primary transition-colors tracking-tight truncate">
            {label}
          </h3>
          <p className="text-[9px] md:text-sm font-bold text-slate-400 mt-1 uppercase tracking-tight">Verified Hub</p>
        </div>
      </div>
    </Link>
  )
}
