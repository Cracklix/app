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
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

/**
 * @fileOverview Official Hero Hub v7.0.
 * TYPOGRAPHY: Title Case applied to main heading with extabold tracking-tight.
 * POSITIONING: Student Hero Image positioned EXACTLY above the feature cards.
 * HYDRATION: Replaced dynamic <p> tags with <div> for stat counters.
 */
export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(
    () => (db ? doc(db, "settings", "stats") : null),
    [db]
  );

  const { data: stats } = useDoc<any>(statsRef);

  const liveStats = useMemo(() => {
    const formatNumber = (num: number, fallback: string) => {
      if (!num) return fallback;
      if (num >= 1000) return Math.floor(num / 1000) + "k+";
      return num + "+";
    };

    return [
      {
        id: "q",
        icon: <Zap className="h-5 w-5 text-blue-600" />,
        val: formatNumber(stats?.totalQuestions, "50k+"),
        label: "Questions"
      },
      {
        id: "m",
        icon: <ClipboardList className="h-5 w-5 text-indigo-600" />,
        val: formatNumber(stats?.totalMocks, "500+"),
        label: "Mock Tests"
      },
      {
        id: "e",
        icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
        val: formatNumber(stats?.totalBoards, "50+"),
        label: "Exams"
      },
      {
        id: "u",
        icon: <Users className="h-5 w-5 text-orange-500" />,
        val: formatNumber(stats?.totalUsers, "15k+"),
        label: "Aspirants"
      }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-blue-50 py-12 md:py-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border shadow-sm mb-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-slate-700">
                  10,000+ Aspirants Trust Cracklix
                </span>
              </div>

              {/* REFINED TYPOGRAPHY: TITLE CASE + EXTRABOLD */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05] antialiased">
                Crack Punjab <br/>
                <span className="block text-blue-600">
                  Government Exams
                </span>
                With Confidence
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl font-medium leading-relaxed">
                Practice with bilingual mock tests, previous papers and
                exam-focused preparation for PSSSB, Punjab Police,
                PSTET, PSPCL and more.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {["PSSSB", "Punjab Police", "PSTET", "PSPCL", "PPSC"].map(
                  (item) => (
                    <span
                      key={item}
                      className="px-4 py-2 rounded-full bg-white border text-sm font-bold text-slate-700 shadow-sm"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* STUDENT HERO IMAGE: POSITIONED EXACTLY ABOVE FEATURE CARDS */}
            <div className="relative flex justify-center lg:justify-start -mb-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative w-full max-w-sm md:max-w-md"
              >
                <img
                  src="/images/hero-student.png"
                  alt="Cracklix Student"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>

            {/* FEATURE GRID */}
            <div className="grid grid-cols-2 gap-4">
              <FeatureCard icon={<ClipboardList className="h-6 w-6 text-blue-600" />} title="Mock Tests" />
              <FeatureCard icon={<BookOpen className="h-6 w-6 text-indigo-600" />} title="Study Material" />
              <FeatureCard icon={<FileText className="h-6 w-6 text-emerald-600" />} title="Previous Papers" />
              <FeatureCard icon={<BarChart3 className="h-6 w-6 text-orange-500" />} title="Analytics Hub" />
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button
                asChild
                className="h-12 md:h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold border-none shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
              >
                <Link href="/mocks">
                  Start Free Mock Test
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 md:h-14 px-8 rounded-2xl border-2 font-bold hover:bg-slate-50 active:scale-95 transition-all"
              >
                <Link href="/exams">
                  Browse Exams
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN (RESERVED FOR DESKTOP BALANCE) */}
          <div className="hidden lg:block relative h-full min-h-[400px]">
             {/* This column maintains grid balance on large screens */}
          </div>
        </div>

        {/* BOTTOM STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 md:mt-24">
          {liveStats.map((stat) => (
            <Card
              key={stat.id}
              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm group hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                <div className="shrink-0 p-2 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-2xl md:text-3xl font-black text-slate-900 tabular-nums leading-none mb-1">
                    {stat.val}
                  </div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <Card className="p-4 md:p-6 rounded-3xl border border-slate-100 bg-white shadow-sm group hover:border-blue-600/30 hover:shadow-md transition-all text-left">
      <div className="mb-3">{icon}</div>
      <p className="font-bold text-[#0F172A] uppercase text-[10px] md:text-xs tracking-tight">{title}</p>
    </Card>
  );
}
