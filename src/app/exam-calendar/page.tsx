
"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, MapPin, ShieldCheck, Zap, Clock, ArrowRight, Bell, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * @fileOverview Phase 75: Official Punjab Exam Calendar.
 * Centralized registry for all PSSSB, PPSC, and Punjab Police recruitment dates.
 */

const RECRUITMENTS = [
  { board: "PSSSB", post: "Revenue Patwari", date: "15 Mar 2026", status: "Notification Out", type: "Exam", color: "bg-primary" },
  { board: "PPSC", post: "PCS Executive", date: "24 Apr 2026", status: "Form Active", type: "Registration", color: "bg-blue-600" },
  { board: "Police", post: "Sub-Inspector", date: "10 May 2026", status: "Upcoming", type: "Exam", color: "bg-emerald-600" },
  { board: "PSSSB", post: "Junior Auditor", date: "02 Feb 2026", status: "Admit Card", type: "Event", color: "bg-orange-500" },
  { board: "Technical", post: "PSPCL Clerk", date: "12 Jun 2026", status: "Expected", type: "Forecast", color: "bg-slate-400" },
]

export default function ExamCalendarPage() {
  return (
    <div className="min-h-screen bg-slate-50/30">
      <Navbar />
      <main className="container mx-auto px-6 py-24 max-w-5xl">
        <div className="space-y-16">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <CalendarIcon className="h-5 w-5 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Official Recruitment Registry</span>
              </div>
              <h1 className="text-6xl font-headline font-black text-[#0F172A] tracking-tight uppercase leading-[0.9]">
                Exam <br/> <span className="text-primary">Calendar</span>
              </h1>
              <p className="text-slate-500 font-medium text-lg max-w-xl">
                Stay updated with the latest cabinet-approved recruitment schedules across all Punjab Government boards.
              </p>
            </div>
            <div className="bg-[#0F172A] text-white p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl">
               <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Timer className="h-6 w-6 text-primary" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Next Major Exam</p>
                  <p className="text-xl font-black">Patwari • 42 Days</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-200 hidden md:block" />
            
            {RECRUITMENTS.map((r, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="md:w-1/2 w-full">
                  <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden group hover:translate-y-[-8px] transition-all duration-500">
                    <div className={`h-1.5 w-full ${r.color}`} />
                    <CardContent className="p-10 space-y-6">
                       <div className="flex items-center justify-between">
                          <Badge className={`${r.color} text-white border-none font-black text-[9px] uppercase tracking-widest px-3`}>{r.board}</Badge>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.type}</span>
                       </div>
                       <div>
                          <h3 className="text-2xl font-headline font-black text-[#0F172A] group-hover:text-primary transition-colors">{r.post}</h3>
                          <p className="text-sm font-bold text-slate-400 uppercase mt-1 flex items-center gap-2">
                             <Clock className="h-4 w-4 text-primary" /> {r.date}
                          </p>
                       </div>
                       <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                          <Badge variant="outline" className="border-slate-100 text-slate-400 font-black text-[9px] uppercase px-3 py-1">{r.status}</Badge>
                          <Button variant="ghost" className="text-primary font-black uppercase text-[10px] gap-2 p-0 hover:bg-transparent">
                             Set Alert <Bell className="h-3 w-3" />
                          </Button>
                       </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="relative z-10 hidden md:flex h-12 w-12 rounded-full bg-white border-4 border-slate-50 shadow-xl items-center justify-center font-black text-xs text-primary">
                  {i + 1}
                </div>
                <div className="md:w-1/2 hidden md:block" />
              </div>
            ))}
          </div>

          <div className="bg-primary/5 rounded-[4rem] p-16 text-center space-y-8 border border-primary/10">
             <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-3xl font-headline font-black text-[#0F172A] uppercase">Sync with WhatsApp</h3>
                <p className="text-slate-500 font-medium">Get instant notifications for admit cards and results directly on your mobile.</p>
                <Button className="h-16 px-12 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-widest text-xs rounded-2xl gap-3 shadow-2xl mt-4">
                   Initialize Broadcast Link <ArrowRight className="h-5 w-5" />
                </Button>
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
