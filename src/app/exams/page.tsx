"use client"

import { useMemo, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore, useUser } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { Landmark, ChevronRight, Zap, ShieldCheck, BookOpen, Layers } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { AuthorityLogo } from "@/lib/exam-icons"

/**
 * @fileOverview Strict Category Explorer v24.0.
 * UI FIX: Removed 'uppercase' from page heading and category titles.
 */

const AUTHORIZED_CATEGORY_IDS = [
  "punjab-government-exams",
  "punjab-teaching-exams",
  "punjab-technical-exams",
  "banking-exams",
  "punjab-health-exams",
  "judiciary-exams",
  "high-court-exams"
];

export default function ExamsEntryPage() {
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useUser();
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, authLoading, router, pathname]);

  const { data: rawCategories, loading: catLoading } = useCollection<any>(useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db]));
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]));
  const { data: mocks } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]));
  const { data: pyqs } = useCollection<any>(useMemo(() => (db ? collection(db, "pyqs") : null), [db]));

  const categories = useMemo(() => {
    if (!rawCategories) return [];
    return rawCategories.filter(c => AUTHORIZED_CATEGORY_IDS.includes(c.id));
  }, [rawCategories]);

  if (authLoading || !user) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white space-y-4">
       <Zap className="h-10 w-10 text-primary animate-pulse" />
       <p className="text-[10px] font-black uppercase text-slate-300">Authenticating Hub...</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-body text-left">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-left mb-12 space-y-3 px-2">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner"><Landmark className="h-4 w-4" /></div>
             <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Exam Selection</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-black text-[#0F172A] leading-tight tracking-tight">Choose Your Exam</h1>
          <p className="text-slate-600 font-medium text-sm md:text-lg max-w-2xl">Select an official category to explore verified exams and authority boards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {catLoading ? (
             Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-[2rem] bg-slate-50" />)
           ) : categories.map((cat) => {
              const catExams = exams?.filter(e => e.categoryId === cat.id) || [];
              const catExamIds = catExams.map(e => e.id);
              const catMocksCount = mocks?.filter(m => catExamIds.includes(m.examId) || (m.examIds && m.examIds.some(id => catExamIds.includes(id)))).length || 0;
              const catPyqsCount = pyqs?.filter(p => catExamIds.includes(p.examId)).length || 0;

              return (
                <Link key={cat.id} href={`/exams/category/${cat.id}`}>
                    <Card className="border-none shadow-xl hover:shadow-4xl transition-all duration-500 rounded-[2.5rem] bg-white group overflow-hidden h-full flex flex-col p-8">
                       <div className="flex justify-between items-start mb-8">
                          <AuthorityLogo category={cat} size="lg" className="bg-slate-50 rounded-2xl group-hover:scale-105 transition-transform" />
                          <Badge className="bg-[#0F172A] text-white border-none text-[8px] font-black uppercase px-3 py-1 rounded-lg">VERIFIED</Badge>
                       </div>
                       <h3 className="text-xl md:text-2xl font-black text-[#0F172A] group-hover:text-primary transition-colors leading-tight mb-4">{cat.title}</h3>
                       
                       <div className="space-y-2 mt-2 flex-1">
                          <MiniStat label="Exams" count={catExams.length} icon={BookOpen} />
                          {catMocksCount > 0 && <MiniStat label="Tests" count={catMocksCount} icon={Zap} />}
                          {catPyqsCount > 0 && <MiniStat label="Papers" count={catPyqsCount} icon={Layers} />}
                       </div>

                       <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Explore</span>
                          <Button variant="ghost" className="h-10 px-6 rounded-xl bg-[#0F172A] text-white group-hover:bg-primary transition-all font-bold text-[10px] tracking-widest uppercase border-none shadow-md">View Exams <ChevronRight className="ml-2 h-3.5 w-3.5" /></Button>
                       </div>
                    </Card>
                </Link>
              )
           })}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function MiniStat({ label, count, icon: Icon }: any) {
   return (
      <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase">
         <Icon className="h-3.5 w-3.5 text-primary opacity-50" />
         <span className="text-[#0F172A] font-black tabular-nums">{count}</span>
         <span className="text-[9px] tracking-tight">{label}</span>
      </div>
   )
}
