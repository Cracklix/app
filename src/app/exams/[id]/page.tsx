
"use client"

import React, { useMemo, useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useDoc, useCollection, useFirestore, useUser } from "@/firebase"
import { doc, collection, query, where, limit, orderBy } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight,
  FileText,
  Zap,
  ChevronLeft,
  Info,
  Lock,
  GraduationCap,
  List,
  Download,
  Layers,
  RefreshCw,
  Play,
  BarChart3,
  Newspaper
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Institutional Exam Hub v29.0.
 * UPDATED: Fully live data linkage for all tabs and performance trackers.
 */

const SUPER_ADMIN_WHITELIST = ['arshdeepgrewal1122@gmail.com'];

export default function ExamHubPage() {
  const params = useParams()
  const router = useRouter()
  const db = useFirestore()
  const { user, profile, loading: userLoading } = useUser()
  const examId = params.id as string

  // 1. PRIMARY REGISTRY LISTENERS
  const { data: exam, loading: examLoading } = useDoc<any>(useMemo(() => (db && examId ? doc(db, "exams", examId) : null), [db, examId]))
  
  const mocksQuery = useMemo(() => (db ? query(collection(db, "mocks"), where("published", "==", true)) : null), [db]);
  const notesQuery = useMemo(() => (db && examId ? query(collection(db, "notes"), where("examId", "==", examId)) : null), [db, examId]);
  const resultsQuery = useMemo(() => (db && user ? query(collection(db, "results"), where("userId", "==", user.uid)) : null), [db, user]);
  const hubQuery = useMemo(() => (db ? query(collection(db, "current_affairs_hub"), where("status", "==", "PUBLISHED")) : null), [db])

  const { data: rawMocks, loading: mocksLoading } = useCollection<any>(mocksQuery)
  const { data: rawNotes, loading: notesLoading } = useCollection<any>(notesQuery)
  const { data: userResults, loading: resultsLoading } = useCollection<any>(resultsQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: caHub, loading: caLoading } = useCollection<any>(hubQuery);

  // PASS ACCESS FIREWALL
  const isPassActive = useMemo(() => {
     if (!user || !profile) return false;
     const userEmail = user.email?.toLowerCase();
     const isFounder = userEmail && SUPER_ADMIN_WHITELIST.includes(userEmail);
     if (profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN' || isFounder) return true;
     
     if (profile.pass?.active === true) {
        return new Date(profile.pass.expiryDate) > new Date();
     }
     return false;
  }, [user, profile]);

  // CONTENT GROUPING LOGIC
  const groupedContent = useMemo(() => {
    const mocks = (rawMocks || []).filter(m => {
       const isDirectMatch = m.examId === examId;
       const isArrayMatch = m.examIds?.includes(examId);
       return isDirectMatch || isArrayMatch;
    });
    return {
      FULL: mocks.filter(m => m.mockType === 'FULL'),
      SUBJECT: mocks.filter(m => m.mockType === 'SUBJECT'),
      SECTIONAL: mocks.filter(m => m.mockType === 'SECTIONAL'),
      PYQ: mocks.filter(m => m.mockType === 'PYQ'),
      NOTES: (rawNotes || []).filter(n => n.category === 'NOTES'),
      SYLLABUS: (rawNotes || []).filter(n => n.category === 'SYLLABUS'),
      CA: (caHub || []).filter(item => {
         const term = (exam?.name || "").toLowerCase();
         // Show specific CA or latest Daily Hub
         return item.title?.toLowerCase().includes(term) || item.type === 'DAILY';
      }).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 10)
    }
  }, [rawMocks, rawNotes, caHub, examId, exam])

  // HARDENED PERFORMANCE AUDIT
  const examPerformance = useMemo(() => {
     if (!rawMocks || !userResults) return { attempted: 0, avgAcc: 0, bestScore: 0 };
     
     const allAssociatedMocks = [...groupedContent.FULL, ...groupedContent.SUBJECT, ...groupedContent.SECTIONAL, ...groupedContent.PYQ];
     const mockIds = new Set(allAssociatedMocks.map(m => m.id));

     const examResults = (userResults || []).filter(r => mockIds.has(r.mockId));
     
     if (examResults.length === 0) return { attempted: 0, avgAcc: 0, bestScore: 0 };
     return {
        attempted: examResults.length,
        avgAcc: Math.round(examResults.reduce((acc, r) => acc + (r.accuracy || 0), 0) / examResults.length),
        bestScore: Math.max(...examResults.map(r => r.score || 0))
     }
  }, [userResults, groupedContent, rawMocks]);

  if (examLoading || userLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-6">
       <Zap className="h-12 w-12 text-primary animate-pulse" />
       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Synchronizing Prep Hub...</p>
    </div>
  );

  if (!exam) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-10 text-center space-y-6">
       <div className="h-20 w-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 shadow-inner">
          <Info className="h-10 w-10" />
       </div>
       <div className="space-y-2">
          <h2 className="text-2xl font-headline font-black uppercase">Vertical Not Found</h2>
          <p className="text-slate-400 font-medium">This exam hub could not be verified in the live registry.</p>
       </div>
       <Button onClick={() => router.push('/exams')} className="h-12 px-8 bg-[#0F172A] text-white rounded-xl font-black uppercase text-[10px]">Return to Registry</Button>
    </div>
  );

  const activeBoard = boards?.find((b: any) => b.id === exam.boardId || b.abbreviation === exam.boardId);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-body text-left">
      <Navbar />
      
      {/* 2. HEADER: LIVE PERFORMANCE TRACKER */}
      <section className="bg-white border-b border-slate-100 py-8 md:py-16 text-left">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-center gap-10">
               <div className="flex items-center gap-6 flex-1">
                  <button onClick={() => router.back()} className="h-12 w-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-black shrink-0 transition-all active:scale-90">
                     <ChevronLeft className="h-6 w-6" />
                  </button>
                  <div className="min-w-0 space-y-3">
                     <div className="flex items-center gap-3">
                        <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase px-3 py-1 rounded-lg shadow-sm">
                           {activeBoard?.abbreviation || 'GOVT'} HUB
                        </Badge>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hidden sm:inline">OFFICIAL VERTICAL</span>
                     </div>
                     <h1 className="text-3xl md:text-6xl font-black text-[#0F172A] uppercase leading-none tracking-tight truncate">
                        {exam.name}
                     </h1>
                  </div>
               </div>
               
               <div className="flex items-center gap-8 bg-white px-10 py-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                  <div className="text-center min-w-[100px] space-y-1">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">ACCURACY</p>
                     {resultsLoading ? (
                        <Skeleton className="h-8 w-16 bg-slate-100 mx-auto rounded-lg" />
                     ) : (
                        <p className="text-4xl font-headline font-black text-primary tabular-nums">{examPerformance.avgAcc}%</p>
                     )}
                  </div>
                  <div className="h-10 w-px bg-slate-100" />
                  <div className="text-center min-w-[100px] space-y-1">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">ATTEMPTED</p>
                     {resultsLoading ? (
                        <Skeleton className="h-8 w-16 bg-slate-100 mx-auto rounded-lg" />
                     ) : (
                        <p className="text-4xl font-headline font-black text-[#0F172A] tabular-nums">{examPerformance.attempted}</p>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. MAIN TABBED NAVIGATION HUB */}
      <main className="container mx-auto px-4 py-12 max-w-7xl pb-40">
         <Tabs defaultValue="FULL" className="space-y-12">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-1.5 shadow-xl shadow-slate-200/20 overflow-x-auto no-scrollbar">
               <TabsList className="bg-transparent border-none p-0 flex h-16 w-full justify-start gap-1.5">
                  <DashboardTab value="FULL" label="Full Length Mock" icon={<Zap />} />
                  <DashboardTab value="SUBJECT" label="Subject-Wise Test" icon={<BookOpen />} />
                  <DashboardTab value="SECTIONAL" label="Sectional Test" icon={<List />} />
                  <DashboardTab value="CA" label="Current Affairs" icon={<Newspaper />} />
                  <DashboardTab value="PYQ" label="PYQ Paper" icon={<Layers />} />
                  <DashboardTab value="NOTES" label="Study Notes" icon={<FileText />} />
                  <DashboardTab value="ANALYTICS" label="Performance" icon={<BarChart3 />} />
               </TabsList>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
               <TabsContent value="FULL" className="m-0">
                  <MockList data={groupedContent.FULL} results={userResults} isPassActive={isPassActive} user={user} loading={mocksLoading} />
               </TabsContent>
               <TabsContent value="SUBJECT" className="m-0">
                  <MockList data={groupedContent.SUBJECT} results={userResults} isPassActive={isPassActive} user={user} loading={mocksLoading} />
               </TabsContent>
               <TabsContent value="SECTIONAL" className="m-0">
                  <MockList data={groupedContent.SECTIONAL} results={userResults} isPassActive={isPassActive} user={user} loading={mocksLoading} />
               </TabsContent>
               <TabsContent value="CA" className="m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {caLoading ? (
                        Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-44 w-full rounded-[2.5rem]" />)
                     ) : groupedContent.CA.length > 0 ? (
                        groupedContent.CA.map((item: any) => (
                           <Link key={item.id} href="/current-affairs">
                              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 md:p-10 flex items-center justify-between group hover:shadow-4xl hover:translate-y-[-4px] transition-all">
                                 <div className="flex items-center gap-8">
                                    <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center text-primary shadow-inner transition-transform group-hover:scale-110">
                                       <Newspaper className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-1">
                                       <h3 className="text-xl font-black text-[#0F172A] uppercase leading-tight truncate max-w-[200px]">{item.title}</h3>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.month} {item.year} Hub</p>
                                    </div>
                                 </div>
                                 <ChevronRight className="h-6 w-6 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-1" />
                              </Card>
                           </Link>
                        ))
                     ) : (
                        <div className="col-span-full py-24 text-center opacity-20 italic font-black uppercase text-[10px]">Awaiting CA Hub Deployment.</div>
                     )}
                  </div>
               </TabsContent>
               <TabsContent value="PYQ" className="m-0">
                  <MockList data={groupedContent.PYQ} results={userResults} isPassActive={isPassActive} user={user} loading={mocksLoading} />
               </TabsContent>
               <TabsContent value="NOTES" className="m-0">
                  <NotesList data={groupedContent.NOTES} isPassActive={isPassActive} loading={notesLoading} />
               </TabsContent>
               <TabsContent value="ANALYTICS" className="m-0">
                  <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-12 text-center space-y-12">
                     <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary shadow-inner">
                        <BarChart3 className="h-12 w-12" />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-4xl font-headline font-black uppercase text-[#0F172A]">Exam Readiness Audit</h3>
                        <p className="text-slate-500 max-w-md mx-auto font-medium">Track your accuracy and state-level rank compared to thousands of aspirants for {exam.name}.</p>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-3xl mx-auto pt-6">
                        <PerformanceNode label="AVERAGE ACCURACY" val={`${examPerformance.avgAcc}%`} color="text-primary" />
                        <PerformanceNode label="TOTAL ATTEMPTS" val={examPerformance.attempted} color="text-blue-600" />
                        <PerformanceNode label="BEST SCORE" val={examPerformance.bestScore.toFixed(1)} color="text-emerald-600" />
                     </div>
                  </Card>
               </TabsContent>
            </div>
         </Tabs>
      </main>
      <Footer />
    </div>
  )
}

function DashboardTab({ value, label, icon }: any) {
   return (
      <TabsTrigger value={value} className="px-8 h-full font-black text-[10px] uppercase tracking-widest text-slate-400 data-[state=active]:bg-[#0F172A] data-[state=active]:text-white rounded-[1.4rem] transition-all whitespace-nowrap flex items-center gap-3">
         {React.cloneElement(icon, { className: "h-4 w-4" })} {label}
      </TabsTrigger>
   )
}

function MockList({ data, results, isPassActive, user, loading }: { data: any[], results: any[], isPassActive: boolean, user: any, loading: boolean }) {
   const router = useRouter();
   
   if (loading) return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-[3rem]" />)}
      </div>
   );

   if (data.length === 0) return (
      <div className="py-40 text-center opacity-20 flex flex-col items-center gap-6">
         <Zap className="h-20 w-20 text-slate-300" />
         <p className="font-headline font-black text-2xl uppercase tracking-widest">Registry Hub Empty</p>
      </div>
   );

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {data.map((mock: any) => {
            const result = results?.find((r: any) => r.mockId === mock.id);
            const tier = (mock.accessLevel || mock.accessType || 'FREE').trim().toUpperCase();
            const isPremium = tier === 'PREMIUM';
            const locked = isPremium && !isPassActive;

            return (
               <Card key={mock.id} className="border-none shadow-xl rounded-[3rem] bg-white hover:shadow-5xl hover:translate-y-[-6px] transition-all group p-10 text-left border border-slate-100 flex flex-col h-full relative overflow-hidden">
                  <div className="flex justify-between items-start mb-10">
                     <Badge className={cn(
                        "border-none text-[9px] font-black px-4 py-1.5 rounded-xl shadow-lg uppercase tracking-widest", 
                        isPremium ? "bg-amber-100 text-amber-600" : "bg-emerald-50 text-emerald-600"
                     )}>
                        {isPremium ? '🔒 PREMIUM' : 'FREE'}
                     </Badge>
                     {result && <Badge className="bg-primary text-white border-none text-[9px] font-black px-3 py-1 rounded-xl shadow-xl shadow-primary/20">AUDITED</Badge>}
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-black text-[#0F172A] uppercase leading-tight group-hover:text-primary transition-colors flex-1 mb-8">
                     {mock.title}
                  </h3>

                  <div className="flex items-center gap-8 pt-6 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <span className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-primary" /> {mock.duration}m</span>
                     <span className="flex items-center gap-2.5"><BookOpen className="h-4 w-4 text-primary" /> {mock.totalQuestions} Qs</span>
                  </div>

                  <div className="mt-10">
                     {locked ? (
                        <Button onClick={() => router.push('/pass')} className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-3xl shadow-orange-500/20 gap-3 border-none transition-all active:scale-95">
                           <Lock className="h-4 w-4" /> UNLOCK HUB
                        </Button>
                     ) : (
                        <Button onClick={() => router.push(user ? `/mocks/${mock.id}/instructions` : `/login?returnUrl=/mocks/${mock.id}`)} className="w-full h-16 bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-3xl transition-all active:scale-95 border-none gap-4">
                           <Play className="h-6 w-6 fill-current text-primary" /> START TEST
                        </Button>
                     )}
                  </div>
               </Card>
            )
         })}
      </div>
   )
}

function NotesList({ data, isPassActive, loading }: { data: any[], isPassActive: boolean, loading: boolean }) {
   if (loading) return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-44 w-full rounded-[3rem]" />)}
      </div>
   );

   if (data.length === 0) return (
      <div className="py-40 text-center opacity-20 flex flex-col items-center gap-6">
         <FileText className="h-20 w-20 text-slate-300" />
         <p className="font-headline font-black text-2xl uppercase tracking-widest">No Study Materials Hub</p>
      </div>
   );

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {data.map((note: any) => (
            <Card key={note.id} className="border-none shadow-xl rounded-[2.5rem] bg-white p-10 flex items-center justify-between group hover:shadow-4xl hover:translate-y-[-4px] transition-all border border-slate-100">
               <div className="flex items-center gap-8">
                  <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-105 transition-transform">
                     <FileText className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-xl font-black text-[#0F172A] uppercase group-hover:text-primary transition-colors">{note.title}</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{note.category}</p>
                  </div>
               </div>
               <Button asChild className="h-14 px-8 bg-slate-900 hover:bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 border-none gap-3">
                  <a href={note.pdfUrl} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4" /> Download</a>
               </Button>
            </Card>
         ))}
      </div>
   )
}

function PerformanceNode({ label, val, color }: any) {
   return (
      <div className="space-y-2 p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center shadow-inner">
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
         <p className={cn("text-5xl font-headline font-black tracking-tighter", color)}>{val}</p>
      </div>
   )
}
