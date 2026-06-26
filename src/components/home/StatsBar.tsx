'use client';

import React, { useMemo } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Zap, ClipboardList, ShieldCheck, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const formatCompact = (num: number) => {
  if (num === undefined || num === null) return null;
  if (num === 0) return "0";
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

/**
 * @fileOverview Institutional Stats Bar v1.2 (Compact Refinement).
 * UPDATED: Reduced all scales and padding to eliminate the "oversized" look.
 */
export default function StatsBar() {
  const db = useFirestore();
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading } = useDoc<any>(statsRef);

  const items = useMemo(() => [
    { 
      label: "Practice", 
      val: (formatCompact(stats?.totalQuestions) || "12K") + "+", 
      icon: <Zap className="h-5 w-5 md:h-6 md:w-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50/50",
      borderColor: "border-blue-100/50"
    },
    { 
      label: "Mock Tests", 
      val: (formatCompact(stats?.totalMocks) || "450") + "+", 
      icon: <ClipboardList className="h-5 w-5 md:h-6 md:w-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50/50",
      borderColor: "border-purple-100/50"
    },
    { 
      label: "Exams", 
      val: (formatCompact(stats?.totalCategories) || "85") + "+", 
      icon: <ShieldCheck className="h-5 w-5 md:h-6 md:w-6" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50/50",
      borderColor: "border-emerald-100/50"
    },
    { 
      label: "Students", 
      val: (formatCompact(stats?.totalUsers) || "10K") + "+", 
      icon: <Users className="h-5 w-5 md:h-6 md:w-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50/50",
      borderColor: "border-orange-100/50"
    }
  ], [stats]);

  return (
    <section className="bg-blue-50/30 py-6 md:py-12 border-y border-slate-100">
      <div className="max-w-[1440px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:gap-8 grid-cols-2 md:grid-cols-4">
          {items.map((item, i) => (
            <Card key={i} className="border border-slate-100 shadow-sm rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 bg-white flex flex-col items-center justify-center gap-4 md:gap-6 transition-all duration-700 hover:shadow-4xl group h-full">
              <div className={cn(
                "h-10 w-10 md:h-14 md:w-14 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-700 group-hover:scale-110 shadow-inner",
                item.bgColor,
                item.borderColor,
                item.color
              )}>
                {item.icon}
              </div>
              <div className="text-center flex flex-col justify-center min-w-0 space-y-1 md:space-y-2">
                {loading && !stats ? (
                  <Skeleton className="h-6 md:h-10 w-16 md:w-32 bg-slate-50 rounded-xl mx-auto" />
                ) : (
                  <span className="text-[20px] md:text-3xl lg:text-4xl font-black text-[#0F172A] tabular-nums tracking-tighter leading-none antialiased">
                    {item.val}
                  </span>
                )}
                <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none truncate w-full">
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