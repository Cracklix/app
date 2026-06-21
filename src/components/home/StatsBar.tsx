'use client';

import React, { useMemo } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Zap, ClipboardList, ShieldCheck, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @fileOverview High-Fidelity Live Stats Bar v3.0.
 * UPDATED: Fully dynamic engine powered by synchronized registry node.
 * LABELS: Optimized to match user screenshot requirements.
 */

const formatCompact = (num: number) => {
  if (num === undefined || num === null) return "...";
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
      label: "QUESTIONS", 
      val: formatCompact(stats?.totalQuestions) + "+", 
      icon: <Zap className="h-6 w-6 text-white" />,
      color: "bg-blue-600"
    },
    { 
      label: "MOCK TESTS", 
      val: formatCompact(stats?.totalMocks) + "+", 
      icon: <ClipboardList className="h-6 w-6 text-white" />,
      color: "bg-purple-600"
    },
    { 
      label: "CATEGORIES", 
      val: formatCompact(stats?.totalCategories) + "+", 
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      color: "bg-emerald-600"
    },
    { 
      label: "ASPIRANTS", 
      val: formatCompact(stats?.totalUsers) + "+", 
      icon: <Users className="h-6 w-6 text-white" />,
      color: "bg-orange-500"
    }
  ], [stats]);

  return (
    <section className="bg-white py-12 border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex overflow-x-auto no-scrollbar gap-6 pb-4 -mx-4 px-4 md:mx-0 md:px-0 lg:grid lg:grid-cols-4">
          {items.map((item, i) => (
            <Card key={i} className="border-none shadow-xl rounded-[2rem] p-6 md:p-8 bg-white flex items-center gap-6 min-w-[280px] lg:min-w-0 group hover:translate-y-[-4px] transition-all duration-300">
              <div className={cn("h-14 w-14 md:h-16 md:w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-transform group-hover:scale-110", item.color)}>
                {item.icon}
              </div>
              <div className="text-left space-y-0.5">
                <div className="flex flex-col">
                  {loading ? (
                    <Skeleton className="h-10 w-24" />
                  ) : (
                    <span className="text-3xl md:text-5xl font-black text-[#0F172A] tabular-nums tracking-tighter leading-none">{item.val}</span>
                  )}
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{item.label}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
