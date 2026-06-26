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
    <section className="section-py bg-white border-t border-slate-50">
      <div className="max-w-[1440px] mx-auto container-px space-y-8 md:space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-left">
           <div className="space-y-2">
              <h2 className="tracking-tight">Latest Mock Tests</h2>
              <p className="max-w-2xl">Freshly updated practice series mapped to the latest recruitment notifications.</p>
           </div>
           <Link href="/mocks" className="text-primary font-bold text-base tracking-tight hover:underline flex items-center gap-2 group shrink-0">
              View All <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
           </Link>
        </div>
        
        <div className="grid gap-4 md:gap-8 lg:gap-10 grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5] w-full rounded-[var(--radius)] bg-slate-50" />)
          ) : mocks.length > 0 ? mocks.map((mock, i) => {
            const tier = (mock.accessLevel || 'FREE').toUpperCase();
            const isPremium = tier === 'PREMIUM';
            const locked = isPremium && !isPassActive;
            const boardId = mock.boardId || mock.boardIds?.[0] || "GENERAL";
            
            return (
              <motion.div 
                key={mock.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }} 
                className="flex flex-col"
              >
                <Card className="border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[var(--radius)] bg-white p-6 md:p-10 lg:p-12 flex flex-col justify-between group h-full relative overflow-hidden min-h-[360px] md:min-h-[420px]">
                  
                  <div className="flex flex-col h-full">
                     <div className="mb-8 md:mb-12 flex justify-start md:justify-center">
                        <div className="h-14 w-14 md:h-20 md:w-20 bg-slate-50 rounded-2xl md:rounded-3xl shadow-inner group-hover:scale-110 transition-transform overflow-hidden flex items-center justify-center p-2">
                           <AuthorityLogo boardId={boardId} size="md" className="h-full w-full" />
                        </div>
                     </div>

                     <CardHeader className="p-0 flex-1 space-y-4">
                        <CardTitle className="leading-tight tracking-tight line-clamp-2 text-center md:text-center">
                           {mock.title}
                        </CardTitle>
                        
                        <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] font-bold text-slate-400 uppercase tracking-tight">
                           <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-primary/60" /> {mock.totalQuestions} Qs</span>
                           <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary/60" /> {mock.duration}m</span>
                        </div>

                        {isPremium && (
                          <div className="flex justify-center pt-2">
                             <Badge className="bg-amber-50 text-amber-600 border-none text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                                <Lock className="h-3 w-3" /> Elite Pass
                             </Badge>
                          </div>
                        )}
                     </CardHeader>

                     <div className="mt-8 pt-6 border-t border-slate-50">
                        <Button asChild className={cn(
                          "w-full h-12 md:h-14 rounded-full font-bold text-base tracking-tight shadow-md border-none transition-all active:scale-95 gap-2", 
                          locked ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-[#0F172A] hover:bg-black text-white"
                        )}>
                           <Link href={locked ? '/pass' : `/mocks/view?id=${mock.id}`} className="flex items-center justify-center gap-2">
                              {locked ? 'Unlock Series' : 'Start Test'}
                              <ChevronRight className="h-4 w-4" />
                           </Link>
                        </Button>
                     </div>
                  </div>
                </Card>
              </motion.div>
            )
          }) : (
            <div className="col-span-full py-20 text-center opacity-30 italic font-bold text-base">
               No practice tests available in this hub.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}