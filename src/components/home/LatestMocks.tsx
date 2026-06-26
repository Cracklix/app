'use client';

import React, { useMemo } from "react"
import { motion } from "framer-motion"
import { BookOpen, Clock, Zap, Lock, ChevronRight } from "lucide-react"
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
 * @fileOverview Standardized Mock Grid v82.0 - Title Case & Normalized Case.
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
    <section className="py-12 md:py-24 bg-white border-t border-slate-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 gap-4 text-left px-1">
           <div className="space-y-1">
              <h2 className="text-xl md:text-5xl font-black text-[#0F172A] tracking-tight leading-none">Latest Mock Tests</h2>
              <p className="text-slate-500 font-medium text-sm md:text-lg">Freshly updated series for all major Punjab recruitments.</p>
           </div>
           <Link href="/mocks" className="text-primary font-bold text-base tracking-tight hover:underline flex items-center gap-2 group">
              View All <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
           </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {loading ? (
             Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 md:h-80 w-full rounded-xl md:rounded-[2.5rem] bg-slate-50" />)
          ) : mocks.length > 0 ? mocks.map((mock, i) => {
            const tier = (mock.accessLevel || 'FREE').toUpperCase();
            const isPremium = tier === 'PREMIUM';
            const locked = isPremium && !isPassActive;
            const boardId = mock.boardId || mock.boardIds?.[0] || "GENERAL";
            
            return (
              <motion.div key={mock.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <Card className="border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl md:rounded-[2.5rem] bg-white p-6 md:p-12 text-left md:text-center flex flex-col h-full group relative overflow-hidden">
                  
                  <div className="mb-6 md:mb-10 flex justify-start md:justify-center">
                     <AuthorityLogo boardId={boardId} size="md" className="h-16 w-16 md:h-24 md:w-24 bg-slate-50 rounded-xl md:rounded-[2rem] shadow-inner group-hover:scale-105 transition-transform" />
                  </div>

                  <CardHeader className="p-0 flex-1 space-y-4 md:space-y-6">
                     <CardTitle className="text-xl md:text-3xl font-black text-[#0F172A] leading-tight tracking-tight line-clamp-2">
                        {mock.title}
                     </CardTitle>
                     
                     <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center justify-center gap-2 md:gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                        <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-primary/50" /> {mock.totalQuestions} Questions</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary/50" /> {mock.duration} Mins</span>
                     </div>

                     <div className="flex items-center justify-center gap-1.5 pt-0.5">
                        {isPremium && <Badge className="bg-orange-50 text-orange-600 border-none text-[11px] font-black px-3 py-1 rounded-full">Elite Pass</Badge>}
                     </div>
                  </CardHeader>

                  <div className="mt-8 md:mt-14 pt-4 border-t border-slate-50">
                     <Button asChild className={cn(
                       "w-full h-12 md:h-16 rounded-full font-semibold text-base tracking-tight shadow-md border-none transition-all active:scale-95 gap-3", 
                       locked ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-[#0F172A] hover:bg-black text-white"
                     )}>
                        <Link href={locked ? '/pass' : `/mocks/view?id=${mock.id}`} className="flex items-center justify-center gap-2">
                           {locked ? <Lock className="h-4 w-4" /> : null}
                           {locked ? 'Unlock Pass' : 'Start Learning'}
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