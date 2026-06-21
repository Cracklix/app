'use client';

import React, { useMemo } from "react"
import { motion } from "framer-motion"
import { BookOpen, Clock, Zap, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Card,
  CardHeader,
  CardTitle 
} from "@/components/ui/card"
import Link from "next/link"
import { useCollection, useFirestore, useUser } from "@/firebase"
import { collection, query, where, limit } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Elite Latest Mock Hub v53.0.
 * NORMALIZED: Title Case and simplified language.
 */

const SUPER_ADMIN_WHITELIST = ['arshdeepgrewal1122@gmail.com'];

export default function LatestMocks() {
  const db = useFirestore()
  const { user, profile } = useUser()
  
  const mocksQuery = useMemo(() => (db ? query(collection(db, "mocks"), where("published", "==", true), limit(6)) : null), [db])
  const { data: rawMocks, loading } = useCollection<any>(mocksQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))

  const mocks = useMemo(() => {
    if (!rawMocks) return []
    return [...rawMocks].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  }, [rawMocks])

  const isPassActive = useMemo(() => {
    if (!user || !profile) return false;
    const userEmail = user.email?.toLowerCase();
    if (profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN' || (userEmail && SUPER_ADMIN_WHITELIST.includes(userEmail))) return true;
    if (profile.passExpiresAt) return new Date(profile.passExpiresAt) > new Date();
    return false;
  }, [user, profile]);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 text-left">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-blue-600 fill-current" />
                <span className="text-[10px] font-bold text-slate-400 tracking-tight uppercase">Latest Pattern</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-none">New Mock Tests</h2>
              <p className="text-slate-500 font-medium text-sm md:text-base">Recently updated tests based on official commission notifications.</p>
           </div>
           <Link href="/mocks" className="bg-slate-50 px-5 py-2 rounded-xl text-primary font-bold text-xs tracking-tight hover:bg-primary hover:text-white transition-all flex items-center gap-2">
              Explore All <ArrowRight className="h-3.5 w-3.5" />
           </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-[2rem]" />)
          ) : mocks.map((mock, i) => {
            const board = boards?.find((b: any) => b.id === (mock.boardIds?.[0] || mock.boardId));
            const tier = (mock.accessLevel || 'FREE').toUpperCase();
            const isPremium = tier === 'PREMIUM';
            const locked = isPremium && !isPassActive;
            
            return (
              <motion.div key={mock.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] bg-white p-6 md:p-8 text-center flex flex-col h-[360px] group relative overflow-hidden">
                  <div className="h-10 w-10 mx-auto rounded-xl bg-slate-50 flex items-center justify-center p-2 mb-6 shadow-inner border border-slate-100">
                     <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <CardHeader className="p-0 flex-1 space-y-4">
                     <CardTitle className="font-black text-lg md:text-xl text-[#0F172A] leading-tight tracking-tight line-clamp-2">
                        {mock.title}
                     </CardTitle>
                     <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {mock.totalQuestions} Qs</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {mock.duration}m</span>
                     </div>
                     <div className="flex items-center justify-center gap-2">
                        {isPremium && <Badge className="bg-amber-50 text-amber-600 border-none text-[8px] font-black px-2 py-0.5 rounded">PREMIUM</Badge>}
                        <Badge variant="outline" className="border-slate-100 text-slate-400 text-[8px] font-black px-2 py-0.5 rounded uppercase">{board?.abbreviation || 'PSSSB'}</Badge>
                     </div>
                  </CardHeader>
                  <div className="mt-6">
                     <Button asChild className={cn("w-full h-11 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-md border-none", locked ? "bg-amber-500" : "bg-[#0F172A] hover:bg-black")}>
                        <Link href={locked ? '/pass' : `/mocks/${mock.id}`}>
                           {locked ? <><Lock className="h-3.5 w-3.5 mr-2" /> Unlock Test</> : 'Start Test'}
                        </Link>
                     </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
