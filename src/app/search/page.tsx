
"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Input } from "@/components/ui/input"
import { Search as SearchIcon, Zap, BookOpen, Newspaper, Bell, ChevronRight, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore } from "@/firebase"
import { collection } from "firebase/firestore"
import { useSearchParams } from "next/navigation"

/**
 * @fileOverview Phase 136: Punjab AI Search Hub.
 * Functionalized to ingest URL query parameters.
 */

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  )
}

function SearchContent() {
  const db = useFirestore()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")

  // Sync state with URL params on mount
  useEffect(() => {
    const q = searchParams.get("q")
    if (q) setQuery(q)
  }, [searchParams])

  const { data: mocks } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: ca } = useCollection<any>(useMemo(() => (db ? collection(db, "current_affairs") : null), [db]))

  const results = useMemo(() => {
    if (query.length < 2) return []
    const term = query.toLowerCase()
    
    const examMatches = exams?.filter(e => 
      e.name.toLowerCase().includes(term) || 
      e.category?.toLowerCase().includes(term)
    ).map(e => ({ ...e, type: "Exam Vertical", href: `/exams/${e.id}`, icon: <ShieldIcon /> })) || []

    const mockMatches = mocks?.filter(m => 
      m.title.toLowerCase().includes(term) || 
      m.boardId?.toLowerCase().includes(term)
    ).map(m => ({ ...m, type: "Mock Test", href: `/mocks/${m.id}`, icon: <BookOpen className="text-primary" /> })) || []

    const caMatches = ca?.filter(c => 
      c.title.toLowerCase().includes(term) || 
      c.summary?.toLowerCase().includes(term)
    ).map(c => ({ ...c, type: "Strategic Analysis", href: `/current-affairs`, icon: <Newspaper className="text-emerald-500" /> })) || []

    return [...examMatches, ...mockMatches, ...caMatches]
  }, [query, exams, mocks, ca])

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-4xl text-left">
        <div className="space-y-12">
           <div className="space-y-6 text-center">
              <h1 className="text-5xl md:text-6xl font-headline font-black text-[#0F172A] uppercase">Global <span className="text-primary">Search</span></h1>
              <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-400 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                 <div className="relative">
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                    <Input 
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      className="h-20 pl-16 pr-8 text-xl rounded-[2.5rem] border-none shadow-2xl bg-white focus-visible:ring-primary" 
                      placeholder="Search exams, mocks, analysis or alerts..." 
                    />
                 </div>
              </div>
           </div>

           {query.length > 0 ? (
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Registry Results for "{query}"</h3>
                    <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black px-3">{results.length} NODES</Badge>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    {results.length > 0 ? results.map((res, i) => (
                      <SearchResultItem key={i} icon={res.icon} title={res.title || res.name} category={res.type} href={res.href} />
                    )) : (
                      <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <div className="space-y-3 opacity-20 italic flex flex-col items-center">
                           <SearchIcon className="h-10 w-10 mb-2" />
                           <p className="font-black uppercase tracking-widest">No matches found in official database.</p>
                        </div>
                      </div>
                    )}
                 </div>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
                 <Card className="border-none shadow-xl rounded-[2.5rem] p-10 bg-[#0B1528] text-white">
                    <h4 className="font-headline font-black text-xl mb-4 uppercase">Trending Hubs</h4>
                    <ul className="space-y-4">
                       <TrendingItem text="PSSSB Patwari 2026 Mock" />
                       <TrendingItem text="Punjab Police SI Syllabus" />
                       <TrendingItem text="Daily Punjab GK MCQ" />
                       <TrendingItem text="Current Affairs PDF" />
                    </ul>
                 </Card>
                 <Card className="border-none shadow-xl rounded-[2.5rem] p-10 bg-white">
                    <h4 className="font-headline font-black text-xl mb-4 text-[#0F172A] uppercase">Active Modules</h4>
                    <div className="flex flex-wrap gap-3">
                       <Badge variant="outline" className="rounded-xl px-4 py-2 border-slate-100 text-[9px] font-black uppercase">Exam Calendar</Badge>
                       <Badge variant="outline" className="rounded-xl px-4 py-2 border-slate-100 text-[9px] font-black uppercase">PYQ Archives</Badge>
                       <Badge variant="outline" className="rounded-xl px-4 py-2 border-slate-100 text-[9px] font-black uppercase">AI Tutor</Badge>
                       <Badge variant="outline" className="rounded-xl px-4 py-2 border-slate-100 text-[9px] font-black uppercase">Leaderboard</Badge>
                    </div>
                 </Card>
              </div>
           )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function SearchResultItem({ icon, title, category, href }: any) {
   return (
      <Link href={href}>
         <div className="bg-white p-6 rounded-[1.5rem] shadow-lg shadow-slate-200/50 flex items-center justify-between group hover:border-primary border border-transparent transition-all">
            <div className="flex items-center gap-6">
               <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  {icon}
               </div>
               <div className="text-left">
                  <p className="font-bold text-[#0F172A] group-hover:text-primary transition-colors text-lg uppercase leading-none">{title}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">{category}</p>
               </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-1" />
         </div>
      </Link>
   )
}

function TrendingItem({ text }: { text: string }) {
   return (
      <li className="flex items-center gap-3 text-slate-400 text-sm font-bold hover:text-white cursor-pointer transition-colors group">
         <Sparkles className="h-4 w-4 text-primary group-hover:animate-pulse" /> {text}
      </li>
   )
}

function ShieldIcon() {
  return <div className="h-5 w-5 bg-orange-100 rounded flex items-center justify-center text-primary"><Zap className="h-3 w-3" /></div>
}
