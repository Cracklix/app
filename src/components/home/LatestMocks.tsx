'use client';

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Clock, ChevronRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * @fileOverview High-Density Mock Feed.
 * Reduced card heights and padding for mobile-first scanning.
 */

export default function LatestMocks() {
  const db = useFirestore()
  
  const mocksQuery = useMemo(() => (db ? query(collection(db, "mocks"), where("published", "==", true)) : null), [db])
  const { data: rawMocks, loading } = useCollection<any>(mocksQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))

  const mocks = useMemo(() => {
    if (!rawMocks) return []
    return [...rawMocks].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 8)
  }, [rawMocks])

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <Zap className="h-3 w-3 text-primary" />
               <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Live Feed</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-headline font-black text-[#000000] uppercase tracking-tight">
              LATEST <span className="text-primary">MOCKS</span>
            </h2>
            <p className="text-[11px] md:text-lg text-slate-500 font-medium">Updated for upcoming exams.</p>
          </div>
          <Link href="/mocks" className="text-primary font-black text-[7px] md:text-[11px] uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            View All <ChevronRight className="h-3 w-3 inline" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
             Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 md:h-64 w-full rounded-2xl" />)
          ) : mocks.map((mock, i) => {
            const board = boards?.find((b: any) => b.id === mock.boardId);
            return (
              <motion.div key={mock.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <div className="bg-white rounded-xl md:rounded-[2.5rem] border border-slate-100 shadow-md hover:shadow-xl transition-all p-4 md:p-8 text-left flex flex-col h-full group">
                  <div className="flex justify-between items-start mb-3 md:mb-6">
                    <div className="h-8 w-8 md:h-12 md:w-12 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                       {board?.iconUrl ? <img src={board.iconUrl} className="p-1.5 h-full w-full object-contain" alt="Logo" referrerPolicy="no-referrer" /> : <Zap className="h-4 w-4 text-primary" />}
                    </div>
                    <Badge className="bg-primary/5 text-primary border-none text-[6px] font-black uppercase">{board?.abbreviation || 'GOVT'}</Badge>
                  </div>
                  <h3 className="font-black text-[13px] md:text-base text-[#000000] leading-tight mb-2 uppercase line-clamp-2 min-h-[32px] md:min-h-[40px]">{mock.title}</h3>
                  
                  <div className="flex items-center gap-3 mb-4 text-[7px] md:text-[9px] text-slate-400 font-bold uppercase">
                     <span className="flex items-center gap-1"><BookOpen className="h-2.5 w-2.5 text-primary" /> {mock.totalQuestions} Qs</span>
                     <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5 text-primary" /> {mock.duration}m</span>
                  </div>

                  <Button asChild className="w-full h-9 md:h-12 bg-[#0F172A] hover:bg-primary text-white font-black text-[8px] md:text-[9px] uppercase tracking-widest rounded-lg mt-auto transition-all shadow-lg">
                    <Link href={`/mocks/${mock.id}`}>Attempt Now</Link>
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
