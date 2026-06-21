"use client"

import { useMemo, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore, useUser } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { ShieldCheck, Landmark, ChevronRight, Zap, BookOpen, Layers } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { AuthorityLogo } from "@/lib/exam-icons"

/**
 * @fileOverview Institutional Master Registry v12.0.
 * UI FIX: Removed 'uppercase' from primary registry headlines and category titles.
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

export default function MocksDiscoveryPage() {
  const db = useFirestore();
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (!authLoading && !user) {
      router.push(`/login?returnUrl=${encodeURIComponent('/mocks')}`);
    }
  }, [user, authLoading, router]);

  const { data: rawCategories, loading: catLoading } = useCollection<any>(useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db]));
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]));
  const { data: mocks } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]));
  const { data: pyqs } = useCollection<any>(useMemo(() => (db ? collection(db, "pyqs") : null), [db]));

  const categories = useMemo(() => {
    if (!rawCategories) return [];
    return rawCategories.filter(c => AUTHORIZED_CATEGORY_IDS.includes(c.id));
  }, [rawCategories]);

  if (!mounted || authLoading || !user) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
       <Zap className="h-10 w-10 text-primary animate-pulse" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-body text-left">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-white border-b border-slate-100 py-12 md:py-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
              
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 md:space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col items-center lg:items-start gap-4">
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                      <Landmark className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <p className="text-xs md:sm font-bold tracking-[0.3em] uppercase text-slate-400">
                      Official Exam Registry
                    </p>
                  </div>
                  
                  <h1 className="text-[32px] sm:text-[42px] md:text-[48px] lg:text-[60px] xl:text-[72px] font-black tracking-tight text-[#0F172A] leading-[0.95] antialiased">
                    Master <br/>
                    <span className="text-primary">Registry</span>
                  </h1>

                  <p className="text-slate-500 font-medium text-base md:text-xl lg:text-2xl max-w-2xl leading-tight">
                    Select a recruitment category to browse verified authority boards and mock tests.
                  </p>
                </div>
              </div>

              <div className="relative hidden lg:flex justify-end">
                <div className="relative h-[280px] md:h-[350px] w-full max-w-[450px]">
                  <Image 
                    src="/images/hero-student.png" 
                    alt="Registry Hub" 
                    fill 
                    priority
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 1024px) 100vw, 450px"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CONTENT AREA */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
             {catLoading ? (
               Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-[2.5rem] bg-white" />)
             ) : categories && categories.length > 0 ? (
               categories.map((cat) => {
                  const catExams = exams?.filter(e => e.categoryId === cat.id) || [];
                  const catExamIds = catExams.map(e => e.id);
                  const catMocksCount = mocks?.filter(m => catExamIds.includes(m.examId) || (m.examIds && m.examIds.some(id => catExamIds.includes(id)))).length || 0;
                  const catPyqsCount = pyqs?.filter(p => catExamIds.includes(p.examId)).length || 0;

                  return (
                    <Link key={cat.id} href={`/exams/category/${cat.id}`}>
                       <Card className="border-none shadow-xl hover:shadow-4xl hover:translate-y-[-8px] transition-all duration-700 rounded-[2.5rem] bg-white group overflow-hidden h-full flex flex-col border border-slate-100">
                          <CardContent className="p-8 md:p-12 flex flex-col h-full">
                             <div className="flex justify-between items-start mb-8">
                                <AuthorityLogo category={cat} size="lg" className="bg-slate-50 rounded-2xl group-hover:scale-105 transition-transform shadow-inner" />
                                <Badge className="bg-[#0F172A] text-white border-none text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 md:px-4 md:py-1.5 rounded-xl shadow-lg">
                                   AUTHORIZED
                                </Badge>
                             </div>
                             
                             <div className="space-y-4 flex-1">
                                <h3 className="text-[20px] md:text-[28px] font-black leading-tight tracking-tight text-[#0F172A] group-hover:text-primary transition-colors">
                                   {cat.title}
                                </h3>
                                <p className="text-sm md:text-base text-slate-400 leading-snug line-clamp-2">
                                   {cat.description}
                                </p>

                                <div className="flex flex-wrap gap-4 pt-4">
                                   <MetricBlock label="Exams" val={catExams.length} icon={BookOpen} />
                                   {catMocksCount > 0 && <MetricBlock label="Tests" val={catMocksCount} icon={Zap} />}
                                   {catPyqsCount > 0 && <MetricBlock label="PYQs" val={catPyqsCount} icon={Layers} />}
                                </div>
                             </div>

                             <div className="mt-10 pt-6 border-t border-slate-50">
                                <Button variant="ghost" className="w-full h-14 rounded-2xl bg-[#0F172A] text-white group-hover:bg-primary transition-all shadow-xl font-black text-xs tracking-widest uppercase gap-3 border-none">
                                   View Exams <ChevronRight className="h-4 w-4" />
                                </Button>
                             </div>
                          </CardContent>
                       </Card>
                    </Link>
                  )
               })
             ) : (
               <div className="col-span-full py-20 text-center opacity-20 italic font-black uppercase tracking-widest text-sm">No categories deployed.</div>
             )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function MetricBlock({ label, val, icon: Icon }: any) {
   return (
      <div className="flex items-center gap-2">
         <Icon className="h-3.5 w-3.5 text-primary opacity-40" />
         <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-[#0F172A] tabular-nums">{val}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">{label}</span>
         </div>
      </div>
   )
}
