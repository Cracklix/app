
'use client';

import { useMemo } from "react"
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, GraduationCap, Target, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, limit } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

/**
 * @fileOverview Comprehensive Exam Vertical Hub.
 * Adda247 aesthetic with detailed catalog cards and multi-vertical markers.
 */

export default function PopularExams() {
  const db = useFirestore()
  
  const examsQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "exams"), limit(8))
  }, [db])

  const boardsQuery = useMemo(() => (db ? collection(db, "boards") : null), [db])

  const { data: exams, loading } = useCollection<any>(examsQuery)
  const { data: boards } = useCollection<any>(boardsQuery)

  return (
    <section className="py-10 bg-transparent">
      <div className="container mx-auto px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 text-left">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-[#000000] font-headline uppercase tracking-tight">
              EXAM <span className="text-primary">HUB CATALOG</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Complete preparation matrices for State and Central verticals.
            </p>
          </div>
          <Link href="/exams" className="text-primary font-black text-[8px] uppercase tracking-[0.2em] flex items-center group gap-2 px-6 py-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all">
            Full Catalog <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
             Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-[3rem]" />)
          ) : exams && exams.length > 0 ? (
            exams.map((exam, idx) => {
              const board = boards?.find(b => b.id === exam.boardId)
              return (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/exams/${exam.id}`}>
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-4xl hover:-translate-y-1 transition-all duration-500 h-full flex flex-col group p-8 text-left overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform"><GraduationCap className="h-40 w-40" /></div>
                      
                      <div className="flex items-center gap-8 relative z-10">
                        <div className="shrink-0 h-20 w-20 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center transition-all group-hover:shadow-xl shadow-inner relative overflow-hidden group-hover:bg-white">
                           {board?.iconUrl || board?.id === 'psssb' ? (
                             <img 
                               src={board?.iconUrl || 'https://sssb.punjab.gov.in/images/logo.png'} 
                               className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-110" 
                               alt="Logo" 
                               referrerPolicy="no-referrer"
                             />
                           ) : (
                             <GraduationCap className="h-9 w-9 text-slate-300 group-hover:text-primary transition-colors" />
                           )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                             <Badge className="bg-primary/5 text-primary border-none text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg">
                                {board?.abbreviation || 'OFFICIAL'} BOARD
                             </Badge>
                             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{exam.category}</span>
                          </div>
                          <h3 className="text-2xl font-black text-[#000000] group-hover:text-primary transition-colors leading-tight uppercase truncate tracking-tight">
                            {exam.name}
                          </h3>
                          <div className="flex items-center gap-6 pt-2">
                             <div className="flex items-center gap-2">
                                <Zap className="h-3.5 w-3.5 text-primary" />
                                <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-tighter">{exam.totalMocks || 0} Series</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <BookOpen className="h-3.5 w-3.5 text-primary" />
                                <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-tighter">{exam.activeQuestions || '1k+'}+ MCQs</span>
                             </div>
                          </div>
                        </div>
                        <div className="shrink-0 hidden sm:block">
                           <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                              <ChevronRight className="h-5 w-5" />
                           </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })
          ) : (
            <div className="col-span-full py-20 text-center opacity-20 border-2 border-dashed border-slate-100 rounded-[3rem]">
               <ShieldCheck className="h-16 w-16 mx-auto mb-4" />
               <p className="font-black uppercase tracking-widest text-sm">Registry Synchronizing...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
