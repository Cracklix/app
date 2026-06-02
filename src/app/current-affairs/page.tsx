
"use client"

import { useMemo, useState } from "react"
import Navbar from "@/components/layout/Navbar"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen, Share2, Search, Filter, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

const CATEGORIES = ["All", "Punjab", "India", "International", "Sports", "Economy", "Schemes"]

export default function CurrentAffairs() {
  const db = useFirestore()
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const caQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "current_affairs"), orderBy("date", "desc"))
  }, [db])

  const { data: currentAffairs, loading } = useCollection<any>(caQuery)

  const filteredCA = useMemo(() => {
    if (!currentAffairs) return []
    return currentAffairs.filter(ca => {
      const matchesCategory = activeCategory === "All" || ca.category === activeCategory
      const matchesSearch = ca.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           ca.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [currentAffairs, activeCategory, searchTerm])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      <Navbar />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-headline font-black text-[#0F172A] tracking-tight uppercase">Current Affairs</h1>
              <p className="text-slate-500 font-medium">Verified news and analysis for Punjab Government recruitment exams.</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                className="pl-12 h-14 rounded-2xl bg-white border-none shadow-xl shadow-slate-200/50" 
                placeholder="Search topics or categories..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
             {CATEGORIES.map(cat => (
               <Button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                variant={activeCategory === cat ? "default" : "outline"}
                className={`rounded-xl px-6 h-10 font-bold border-none transition-all ${activeCategory === cat ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-white shadow-sm hover:shadow-md'}`}
               >
                 {cat}
               </Button>
             ))}
          </div>

          <div className="grid grid-cols-1 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-60 w-full rounded-[2.5rem]" />
              ))
            ) : filteredCA.length > 0 ? (
              filteredCA.map((ca) => (
                <Card key={ca.id} className="bg-white border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 rounded-[2.5rem] overflow-hidden group">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-12 p-8 md:p-12 space-y-6">
                      <div className="flex justify-between items-start">
                        <Badge className="bg-orange-50 text-[#F97316] border border-orange-100 hover:bg-orange-100 px-4 py-1.5 rounded-xl font-black uppercase text-[10px] tracking-widest">
                          {ca.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                          <Calendar className="h-3.5 w-3.5" /> {ca.date}
                        </div>
                      </div>
                      
                      <h2 className="text-2xl md:text-3xl font-headline font-black leading-tight text-[#0F172A] group-hover:text-primary transition-colors">
                        {ca.title}
                      </h2>
                      
                      <p className="text-slate-500 text-lg leading-relaxed font-medium line-clamp-3">
                        {ca.summary}
                      </p>

                      <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                        <Button variant="ghost" className="text-primary font-black uppercase tracking-widest text-[10px] gap-2 p-0 hover:bg-transparent hover:translate-x-2 transition-all">
                          Read Full Analysis <ArrowRight className="h-4 w-4" />
                        </Button>
                        <div className="flex gap-4">
                           <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50">
                             <Share2 className="h-4 w-4 text-slate-400" />
                           </Button>
                           <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50">
                             <BookOpen className="h-4 w-4 text-slate-400" />
                           </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-slate-400 bg-white rounded-[3rem] border-2 border-dashed">
                <Search className="h-12 w-12 mb-4 opacity-20" />
                <p className="font-bold">No matching affairs found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
