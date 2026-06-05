
'use client';

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, BookOpen, Clock, ChevronRight, Zap, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Professional Mock Test Listing.
 * Adda247 aesthetic with detailed metadata and official board markers.
 */

export default function LatestMocks() {
  const db = useFirestore()
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  
  const mocksQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "mocks"), where("published", "==", true))
  }, [db])

  const boardsQuery = useMemo(() => (db ? collection(db, "boards") : null), [db])

  const { data: rawMocks, loading: mocksLoading } = useCollection<any>(mocksQuery)
  const { data: boards, loading: boardsLoading } = useCollection<any>(boardsQuery)

  const mocks = useMemo(() => {
    if (!rawMocks) return []
    return [...rawMocks].sort((a, b) => {
      const tA = a.createdAt?.seconds || 0
      const tB = b.createdAt?.seconds || 0
      return tB - tA
    }).slice(0, 10)
  }, [rawMocks])

  const stateEmblem = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Emblem_of_Punjab.svg/512px-Emblem_of_Punjab.svg.png";

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                  <Zap className="h-5 w-5" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Live Registry Feed</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-headline font-black text-[#000000] uppercase leading-[0.95] tracking-tight">
              LATEST <span className="text-primary text-glow">MOCK SERIES</span>
            </h2>
            <p className="text-slate-500 font-medium text-xl">Official pattern practice series updated for 2026 notifications.</p>
          </div>
          
          <Link 
            href="/mocks" 
            className="h-14 px-8 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center gap-3 transition-all border border-slate-100 shadow-sm"
          >
            <span className="text-[#0F172A] font-black text-[11px] uppercase tracking-[0.2em]">Full Repository</span>
            <ChevronRight className="h-4 w-4 text-primary" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {mocksLoading || boardsLoading ? (
             Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-[3rem]" />)
          ) : mocks.length > 0 ? (
            mocks.map((mock, i) => {
              const board = boards?.find((b: any) => b.id === mock.boardId);
              const isImgFailed = failedImages[mock.id];
              const isArmy = board?.id === 'indian-army' || board?.abbreviation === 'ARMY';
              
              return (
                <motion.div
                  key={mock.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-4xl hover:-translate-y-2 transition-all duration-500 group h-full flex flex-col p-8 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform"><Zap className="h-32 w-32" /></div>
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="h-16 w-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:shadow-2xl transition-all shadow-inner shrink-0">
                         {isImgFailed ? (
                            <div className="bg-primary text-white h-full w-full flex items-center justify-center font-black text-xl">
                               {board?.abbreviation?.substring(0, 2) || 'OK'}
                            </div>
                         ) : (
                           <img 
                              src={board?.iconUrl || stateEmblem} 
                              referrerPolicy="no-referrer"
                              className={cn("w-full h-full object-contain p-2", isArmy ? "scale-150" : "")} 
                              alt={mock.boardId || 'Board'} 
                              onError={() => setFailedImages(p => ({ ...p, [mock.id]: true }))}
                           />
                         )}
                      </div>
                      <Badge className="bg-primary/5 text-primary border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-lg shadow-sm">
                        {board?.abbreviation || 'OFFICIAL'}
                      </Badge>
                    </div>
                    
                    <h3 className="font-headline font-black text-lg text-[#000000] leading-tight min-h-[52px] group-hover:text-primary transition-colors mb-6 line-clamp-2 uppercase relative z-10">
                      {mock.title}
                    </h3>
                    
                    <div className="space-y-3.5 mb-8 pt-6 border-t border-slate-50 relative z-10">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-primary" /> {mock.totalQuestions} Questions</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-primary" /> {mock.duration} Minutes</span>
                      </div>
                    </div>

                    <Button asChild className="w-full h-14 bg-[#0F172A] hover:bg-primary text-white font-black h-12 rounded-xl text-[10px] uppercase tracking-[0.2em] mt-auto shadow-2xl transition-all active:scale-95 relative z-10">
                      <Link href={`/mocks/${mock.id}`}>Attempt Now</Link>
                    </Button>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="col-span-full py-24 text-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[3rem] opacity-50">
               <GraduationCap className="h-16 w-16 mx-auto mb-4" />
               <p className="font-black uppercase tracking-widest text-sm">Awaiting Registry Sync Node...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
