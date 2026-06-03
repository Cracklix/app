
"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Search, BookOpen, Clock, ShieldCheck, Zap, Layers, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

/**
 * @fileOverview Institutional Notes Library (Phase 85).
 * Centralized repository for verified study materials and PDFs.
 */

const NOTES = [
  { title: "Punjab History & Culture (Gurus Era)", category: "Punjab GK", format: "PDF", size: "2.4 MB", date: "24 Oct 2026", color: "bg-orange-50 text-primary" },
  { title: "Logical Reasoning Shortcuts 2026", category: "Reasoning", format: "PDF", size: "1.8 MB", date: "22 Oct 2026", color: "bg-blue-50 text-blue-600" },
  { title: "Mandatory Punjabi Grammar Guide", category: "Punjabi", format: "PDF", size: "3.1 MB", date: "20 Oct 2026", color: "bg-emerald-50 text-emerald-600" },
  { title: "Quantitative Aptitude Formulas", category: "Maths", format: "PDF", size: "1.2 MB", date: "18 Oct 2026", color: "bg-purple-50 text-purple-600" },
  { title: "ICT & Digital Literacy (Basics)", category: "Computer", format: "PDF", size: "4.5 MB", date: "15 Oct 2026", color: "bg-slate-50 text-slate-600" },
]

export default function NotesLibrary() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNotes = NOTES.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-slate-50/30">
      <Navbar />
      <main className="container mx-auto px-6 py-24 max-w-6xl">
        <div className="space-y-16">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <Zap className="h-5 w-5 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Official Study Assets</span>
              </div>
              <h1 className="text-6xl font-headline font-black text-[#0F172A] tracking-tight uppercase leading-[0.9]">
                Notes <br/> <span className="text-primary">Library</span>
              </h1>
              <p className="text-slate-500 font-medium text-lg max-w-xl">
                Verified high-fidelity study materials curated by Arsh Grewal Management for all Punjab verticals.
              </p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                className="pl-16 h-16 rounded-[2rem] bg-white border-none shadow-2xl shadow-slate-200/50 text-lg" 
                placeholder="Search notes library..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredNotes.map((note, i) => (
              <Card key={i} className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden group hover:translate-y-[-8px] transition-all duration-500">
                <CardContent className="p-10 flex items-center gap-10">
                   <div className={`h-24 w-24 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform ${note.color}`}>
                      <FileText className="h-10 w-10" />
                   </div>
                   <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-4">
                         <Badge className={`${note.color} border-none font-black text-[9px] uppercase tracking-widest px-3 py-1`}>
                            {note.category}
                         </Badge>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{note.size}</span>
                      </div>
                      <h3 className="text-2xl font-headline font-black text-[#0F172A] leading-tight group-hover:text-primary transition-colors">
                         {note.title}
                      </h3>
                      <div className="flex items-center justify-between pt-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" /> Updated {note.date}
                         </p>
                         <Button className="h-12 px-8 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-widest text-[9px] rounded-xl gap-2 shadow-xl">
                            <Download className="h-4 w-4" /> Save PDF
                         </Button>
                      </div>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-[#0B1528] rounded-[4rem] p-16 text-white relative overflow-hidden shadow-4xl group">
             <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:scale-125 transition-transform"><GraduationCap className="h-40 w-40" /></div>
             <div className="relative z-10 max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                   <ShieldCheck className="h-6 w-6 text-primary" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Arsh Grewal Management</span>
                </div>
                <h2 className="text-4xl font-headline font-black uppercase leading-tight">Master the <br/> Punjabi Qualifying Base</h2>
                <p className="text-slate-400 text-lg font-medium">Download our exclusive 100-page summary of Gurmukhi Grammar and Sikh History verified for all 2026 PSSSB/PPSC exams.</p>
                <Button className="h-16 px-12 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-widest text-xs rounded-2xl gap-3 shadow-2xl mt-4">
                   Unlock Premium Repository <Zap className="h-5 w-5 fill-current" />
                </Button>
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
