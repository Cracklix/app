'use client';

import React, { useMemo } from "react"
import { motion } from "framer-motion"
import { BookOpen, Clock, Zap, Lock, ArrowRight, Users } from "lucide-react"
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
import { AuthorityLogo } from "@/lib/exam-icons"

/**
 * @fileOverview High-Density Latest Mock Tests Hub v70.0.
 * FIXED: Removed excessive white space and matched Popular Exams layout.
 */

export default function LatestMocks() {
  const db = useFirestore()
  const { profile } = useUser()
  
  const mocksQuery = useMemo(() => (db ? query(collection(db, "mocks"), where("published", "==", true), limit(6)) : null), [db])
  const { data: rawMocks, loading } = useCollection<any>(mocksQuery)

  const mocks = useMemo(() => {
    if (!rawMocks) return []
    return [...rawMocks].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  }, [rawMocks])

  const isPassActive = useMemo(() => {
    if (!profile) return false;
    if (profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN') return true;
    return profile.passStatus === 'active';
  }, [profile]);

  return (
    <section className="py-6 md:py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-12 gap-2 text-left px-1">
           <div className="space-y-0.5">
              <h2 className="text-xl md:text-4xl font-black text-[#0F172A] tracking-tight leading-none">Latest Mock Tests</h2>
              <p className="text-slate-500 font-medium text-[10px] md:text-lg">Freshly updated series for all exams.</p>
           </div>
           <Link href="/mocks" className="text-primary font-black uppercase text-[9px] md:text-xs tracking-widest hover:underline flex items-center gap-2 group">
              View All <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
           </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 md:h-80 w-full rounded-xl md:rounded-[2.5rem] bg-slate-50" />)
          ) : mocks.length > 0 ? mocks.map((mock, i) => {
            const tier = (mock.accessLevel || 'FREE').toUpperCase();
            const isPremium = tier === 'PREMIUM';
            const locked = isPremium && !isPassActive;
            const boardId = mock.boardIds?.[0] || mock.boardId || "GENERAL";
            
            return (
              <motion.div key={mock.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-xl md:rounded-[2.5rem] bg-white p-3 md:p-8 text-left md:text-center flex flex-col h-full group relative overflow-hidden">
                  
                  <div className="mb-4 md:mb-8 flex justify-start md:justify-center">
                     <AuthorityLogo boardId={boardId} size="sm" className="md:w-16 md:h-16 bg-slate-50 rounded-lg md:rounded-2xl shadow-inner group-hover:scale-105 transition-transform" />
                  </div>

                  <CardHeader className="p-0 flex-1 space-y-1.5 md:space-y-4">
                     <CardTitle className="font-black text-sm md:text-2xl text-[#0F172A] leading-tight tracking-tight line-clamp-2">
                        {mock.title}
                     </CardTitle>
                     
                     <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[7px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><BookOpen className="h-2.5 w-2.5 md:h-4 md:w-4" /> {mock.totalQuestions} Qs</span>
                        <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5 md:h-4 md:w-4" /> {mock.duration}m</span>
                     </div>

                     <div className="flex items-center gap-1.5 pt-1">
                        {isPremium && <Badge className="bg-orange-50 text-orange-600 border-none text-[6px] md:text-[8px] font-black px-1.5 py-0.5 rounded uppercase">PREMIUM</Badge>}
                        <div className="flex items-center gap-1 text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                           <Users className="h-2 w-2 md:h-3 md:w-3" /> {mock.attemptsCount || 450}+ Attempts
                        </div>
                     </div>
                  </CardHeader>

                  <div className="mt-4 md:mt-8 pt-3 border-t border-slate-50">
                     <Button asChild className={cn(
                       "w-full h-8 md:h-14 rounded-lg md:rounded-2xl font-black text-[8px] md:text-[11px] tracking-[0.2em] uppercase shadow-md border-none transition-all active:scale-95 gap-2", 
                       locked ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-[#0F172A] hover:bg-black text-white"
                     )}>
                        <Link href={locked ? '/pass' : `/mocks/${mock.id}`}>
                           {locked ? <><Lock className="h-2.5 w-2.5 md:h-4 md:w-4" /> UNLOCK</> : 'Start Test'}
                        </Link>
                     </Button>
                  </div>
                </Card>
              </motion.div>
            )
          }) : (
            <div className="col-span-full py-20 text-center opacity-20 italic font-black uppercase text-xs tracking-widest">
               No tests deployed.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
