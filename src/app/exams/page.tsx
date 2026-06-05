"use client"

import { useMemo, Suspense, useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query } from "firebase/firestore"
import { Input } from "@/components/ui/input"
import { Search, GraduationCap, ChevronRight, Zap, ShieldCheck, BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * @fileOverview High-Density Responsive Exam Catalog.
 * Reduced vertical spacing and compact cards for professional mobile scan.
 */

export default function ExamsCatalog() {
  return (
    <Suspense fallback={null}>
      <CatalogContent />
    </Suspense>
  )
}

function CatalogContent() {
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = useState("")

  const examsQuery = useMemo(() => (db ? query(collection(db, 'exams')) : null), [db])
  const boardsQuery = useMemo(() => (db ? query(collection(db, 'boards')) : null), [db])

  const { data: exams, loading: examsLoading } = useCollection<any>(examsQuery)
  const { data: boards } = useCollection<any>(boardsQuery)

  const categorizedData = useMemo(() => {
    if (!exams || !boards) return { Punjab: [], Teaching: [], National: [] };
    const filtered = exams.filter((e: any) => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return {
      Punjab: filtered.filter((e: any) => boards.find(b => b.id === e.boardId)?.category === 'PUNJAB_STATE'),
      Teaching: filtered.filter((e: any) => boards.find(b => b.id === e.boardId)?.category === 'TEACHING'),
      National: filtered.filter((e: any) => boards.find(b => b.id === e.boardId)?.category === 'CENTRAL')
    }
  }, [exams, boards, searchTerm])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-safe overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-16 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 gap-4 text-left">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Registry 2026</span>
             </div>
             <h1 className="text-2xl md:text-6xl font-headline font-black text-[#0F172A] uppercase tracking-tight leading-none">PREPARATION <span className="text-primary">HUBS</span></h1>
             <p className="text-[11px] md:text-lg text-slate-500 font-medium">Verified prep nodes for official recruitments.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input 
              className="pl-9 h-11 md:h-14 rounded-lg md:rounded-xl bg-white border-none shadow-sm text-sm" 
              placeholder="Search hubs..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <CatalogSection title="State Verticals" data={categorizedData.Punjab} boards={boards} loading={examsLoading} icon={<ShieldCheck className="text-emerald-600 h-4 w-4 md:h-6 md:w-6" />} />
        <CatalogSection title="Teaching Registry" data={categorizedData.Teaching} boards={boards} loading={examsLoading} icon={<BookOpen className="text-blue-600 h-4 w-4 md:h-6 md:w-6" />} />
        <CatalogSection title="Central Hubs" data={categorizedData.National} boards={boards} loading={examsLoading} icon={<Zap className="text-orange-600 h-4 w-4 md:h-6 md:w-6" />} />
      </main>
      <Footer />
    </div>
  )
}

function CatalogSection({ title, data, boards, loading, icon }: any) {
   if (!loading && data.length === 0) return null;
   return (
      <div className="space-y-4 md:space-y-10 mb-8 md:mb-20">
         <div className="flex items-center gap-2">
            <div className="h-7 w-7 md:h-10 md:w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">{icon}</div>
            <h2 className="text-base md:text-3xl font-headline font-black uppercase text-[#0F172A] tracking-tight">{title}</h2>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {loading ? (
               Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 md:h-80 w-full rounded-xl md:rounded-[3.5rem]" />)
            ) : data.map((exam: any) => (
               <ExamVerticalCard key={exam.id} exam={exam} boards={boards} />
            ))}
         </div>
      </div>
   )
}

function ExamVerticalCard({ exam, boards }: any) {
  const board = boards?.find((b: any) => b.id === exam.boardId);
  return (
    <Link href={`/exams/${exam.id}`}>
      <Card className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl md:rounded-[3.5rem] bg-white group overflow-hidden text-left h-full flex flex-col border border-slate-100 p-4 md:p-10">
           <div className="flex justify-between items-start mb-4 md:mb-10">
              <div className="h-10 w-10 md:h-20 md:w-20 rounded-lg md:rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden shrink-0">
                 {board?.iconUrl ? (
                    <img src={board.iconUrl} className="w-full h-full object-contain p-1.5 md:p-3" alt="Logo" referrerPolicy="no-referrer" />
                 ) : (
                    <GraduationCap className="h-5 w-5 md:h-10 md:w-10 text-slate-300" />
                 )}
              </div>
              <Badge className="bg-primary/5 text-primary border-none text-[6px] md:text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md">
                 {board?.abbreviation || 'OFFICIAL'}
              </Badge>
           </div>
           
           <div className="space-y-1 md:space-y-4 flex-1">
              <h3 className="text-[15px] md:text-3xl font-black text-[#0F172A] uppercase leading-tight group-hover:text-primary transition-colors">
                {exam.name}
              </h3>
              <p className="text-[10px] md:text-sm font-medium text-slate-400 leading-relaxed line-clamp-1 md:line-clamp-2">
                {exam.description || "Official syllabus and preparation matrix."}
              </p>
           </div>

           <div className="mt-4 md:mt-8">
              <Button variant="ghost" className="w-full h-9 md:h-16 rounded-lg md:rounded-2xl bg-slate-900 text-white group-hover:bg-primary transition-all font-black uppercase text-[8px] md:text-[10px] tracking-widest gap-2 shadow-lg">
                 Open Hub <ChevronRight className="h-3 w-3 md:h-3.5 md:w-3.5" />
              </Button>
           </div>
      </Card>
    </Link>
  )
}