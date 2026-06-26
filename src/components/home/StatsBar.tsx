'use client';

import React, { useMemo } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Zap, ClipboardList, ShieldCheck, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @fileOverview High-Fidelity Stats Bar v9.0 - Ultra Compact Mobile.
 * REDUCED: Sizes by 15% on mobile for premium PWA feel.
 */

const formatCompact = (num: number) => {
  if (num === undefined || num === null) return null;
  if (num === 0) return "0";
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default function StatsBar() {
  const db = useFirestore();
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading } = useDoc<any>(statsRef);

  const items = useMemo(() => [
    { 
      label: "Practice Questions", 
      val: (formatCompact(stats?.totalQuestions) || "12K") + "+", 
      icon: <Zap className="h-4 w-4 md:h-8 md:w-8" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50/50",
      borderColor: "border-blue-100/50"
    },
    { 
      label: "Mock Series", 
      val: (formatCompact(stats?.totalMocks) || "450") + "+", 
      icon: <ClipboardList className="h-4 w-4 md:h-8 md:w-8" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50/50",
      borderColor: "border-purple-100/50"
    },
    { 
      label: "Exam Verticals", 
      val: (formatCompact(stats?.totalCategories) || "85") + "+", 
      icon: <ShieldCheck className="h-4 w-4 md:h-8 md:w-8" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50/50",
      borderColor: "border-emerald-100/50"
    },
    { 
      label: "Active Aspirants", 
      val: (formatCompact(stats?.totalUsers) || "10K") + "+", 
      icon: <Users className="h-4 w-4 md:h-8 md:w-8" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50/50",
      borderColor: "border-orange-100/50"
    }
  ], [stats]);

  return (
    <section className="bg-blue-50 py-6 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-2 md:gap-8 grid-cols-2 md:grid-cols-4">
          {items.map((item, i) => (
            <Card key={i} className="border border-slate-100 shadow-sm rounded-xl md:rounded-[var(--radius)] p-3 md:p-12 lg:p-16 bg-white flex flex-col items-center justify-center gap-2 md:gap-6 transition-all duration-500 hover:shadow-2xl group h-full">
              <div className={cn(
                "h-9 w-9 md:h-24 md:w-24 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-500 group-hover:scale-110 shadow-inner",
                item.bgColor,
                item.borderColor,
                item.color
              )}>
                {item.icon}
              </div>
              <div className="text-center flex flex-col justify-center min-w-0 space-y-0.5 md:space-y-2">
                {loading && !stats ? (
                  <Skeleton className="h-5 md:h-16 w-12 md:w-40 bg-slate-50 rounded-lg mx-auto" />
                ) : (
                  <span className="text-[20px] md:text-6xl font-black text-[#0F172A] tabular-nums tracking-tighter leading-none antialiased">
                    {item.val}
                  </span>
                )}
                <span className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none truncate w-full">
                  {item.label}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
