
'use client';

import { useMemo } from "react"
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, GraduationCap, Target, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, limit } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

/**
 * @fileOverview Final Dynamic Popular Exams Hub.
 * Fetches real exam verticals from Firestore with institutional styling.
 */

export default function PopularExams() {
  const db = useFirestore()
  
  const examsQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "exams"), limit(8))
  }, [db])

  const boardsQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "boards"))
  }, [db])

  const { data: exams, loading } = useCollection<any>(examsQuery)
  const { data: boards } = useCollection<any>(boardsQuery)

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="container mx-auto px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-black text-[#000000] font-headline uppercase tracking-tight">
              Exam <span className="text-primary">Hubs</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium mt-1">
              Structured preparation for all major Punjab recruitment verticals.
            </p>
          </div>

          <Link href="/exams" className="text-primary font-black text-[11px] uppercase tracking-[0.2em] flex items-center group gap-2">
            View All Boards <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
             Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 w-full rounded-[2.5rem]" />)
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
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-500 h-full flex flex-col group p-8">
                      <div className="flex items-center gap-8">
                        <div className="shrink-0 h-20 w-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-all group-hover:shadow-lg shadow-inner relative overflow-hidden">
                           {board?.iconUrl || board?.id === 'psssb' ? (
                             <img src={board?.iconUrl || 'https://sssb.punjab.gov.in/images/logo.png'} className="w-full h-full object-contain p-3" alt="Logo" />
                           ) : (
                             <GraduationCap className="h-8 w-8 text-primary" />
                           )}
                        </div>
                        <div className="text-left min-w-0 flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                             <Badge className="bg-primary/5 text-primary border-none text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                                {board?.abbreviation || 'PSSSB'} BOARD
                             </Badge>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{exam.category}</span>
                          </div>
                          <h3 className="text-2xl font-black text-[#000000] group-hover:text-primary transition-colors leading-tight uppercase truncate">
                            {exam.name}
                          </h3>
                          <p className="text-[13px] text-slate-400 font-medium leading-relaxed line-clamp-1">
                            {exam.description || "Official syllabus and preparation matrix."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#1E3A8A]">
                        <div className="flex items-center gap-6">
                           <span className="flex items-center gap-2 text-[#0F172A]">
                              <Target className="h-3.5 w-3.5 text-primary" /> 
                              {exam.totalMocks || 0} Series
                           </span>
                           <span className="flex items-center gap-2 text-[#0F172A]">
                              <BookOpen className="h-3.5 w-3.5 text-primary" /> 
                              {exam.activeQuestions || '1k+'}+ MCQs
                           </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })
          ) : (
            <div className="col-span-full py-20 text-center opacity-20">
               <ShieldCheck className="h-16 w-16 mx-auto mb-4" />
               <p className="font-black uppercase tracking-widest text-sm">Registry Synchronizing...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
