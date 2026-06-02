
"use client"

import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Input } from "@/components/ui/input"
import { Search as SearchIcon, Zap, BookOpen, Newspaper, Bell, ChevronRight, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function SearchPage() {
  const [query, setQuery] = useState("")

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
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
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Search Results for "{query}"</h3>
                 <div className="grid grid-cols-1 gap-4">
                    <SearchResultItem icon={<BookOpen className="text-primary" />} title="PSSSB Patwari Mock 01" category="Mock Test" href="/mocks" />
                    <SearchResultItem icon={<Newspaper className="text-emerald-500" />} title="Punjab Solar Policy 2026 Analysis" category="Current Affair" href="/current-affairs" />
                    <SearchResultItem icon={<Bell className="text-orange-500" />} title="Punjab Police SI Result 2025" category="Alert" href="/notifications" />
                 </div>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
                 <Card className="border-none shadow-xl rounded-[2.5rem] p-10 bg-[#0B1528] text-white">
                    <h4 className="font-headline font-black text-xl mb-4">Trending Searches</h4>
                    <ul className="space-y-4">
                       <TrendingItem text="PSSSB Senior Assistant Syllabus" />
                       <TrendingItem text="Punjab Police SI 2026 Cutoff" />
                       <TrendingItem text="Daily Punjab GK MCQ" />
                       <TrendingItem text="Current Affairs PDF June" />
                    </ul>
                 </Card>
                 <Card className="border-none shadow-xl rounded-[2.5rem] p-10 bg-white">
                    <h4 className="font-headline font-black text-xl mb-4 text-[#0F172A]">Recent Modules</h4>
                    <div className="flex flex-wrap gap-3">
                       <Badge variant="outline" className="rounded-xl px-4 py-2 border-slate-100 text-[10px] font-bold">Exam Calendar</Badge>
                       <Badge variant="outline" className="rounded-xl px-4 py-2 border-slate-100 text-[10px] font-bold">PYQ Archives</Badge>
                       <Badge variant="outline" className="rounded-xl px-4 py-2 border-slate-100 text-[10px] font-bold">AI Tutor</Badge>
                       <Badge variant="outline" className="rounded-xl px-4 py-2 border-slate-100 text-[10px] font-bold">Leaderboard</Badge>
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
               <div>
                  <p className="font-bold text-[#0F172A] group-hover:text-primary transition-colors">{title}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{category}</p>
               </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-1" />
         </div>
      </Link>
   )
}

function TrendingItem({ text }: { text: string }) {
   return (
      <li className="flex items-center gap-3 text-slate-400 text-sm font-bold hover:text-white cursor-pointer transition-colors">
         <Sparkles className="h-4 w-4 text-primary" /> {text}
      </li>
   )
}
