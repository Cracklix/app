
'use client';

import { useEffect, useState, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useDoc, useFirestore, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Info, CheckCircle2, Languages, Clock, BookOpen, Zap } from "lucide-react";
import Link from "next/link";

/**
 * @fileOverview Pre-test Instructions & Language Selection.
 */
export default function InstructionsPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const mockId = params.id as string;
  const { data: mock, loading } = useDoc<any>(useMemo(() => (db ? doc(db, "mocks", mockId) : null), [db, mockId]));

  if (loading) return <div className="h-screen flex items-center justify-center"><Zap className="h-10 w-10 text-primary animate-pulse" /></div>;
  if (!mock) return null;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-4xl text-left">
        <div className="space-y-8">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                 <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest mb-2">OFFICIAL CBT PORTAL</Badge>
                 <h1 className="text-3xl md:text-5xl font-headline font-black text-[#0F172A] uppercase leading-tight">{mock.title}</h1>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard icon={<Clock />} label="Duration" val={`${mock.duration} Mins`} />
              <InfoCard icon={<BookOpen />} label="Total Qs" val={mock.totalQuestions} />
              <InfoCard icon={<Zap />} label="Max Marks" val={mock.totalQuestions * (mock.positiveMarks || 1)} />
              <InfoCard icon={<ShieldCheck />} label="Negative" val={`-${mock.negativeMarks || 0.25}`} />
           </div>

           <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-10 border-b bg-slate-50/50">
                 <CardTitle className="text-2xl font-headline font-black uppercase text-[#0F172A] flex items-center gap-4">
                    <Info className="h-6 w-6 text-primary" /> Instructions Node
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                 <ul className="space-y-4">
                    <InstructionNode text="All questions carry equal marks as per official board norms." />
                    <InstructionNode text="Bilingual toggle (English/Punjabi) is available inside the exam engine." />
                    <InstructionNode text="Answers are auto-saved. You can resume if your browser closes." />
                    <InstructionNode text="Tab switching or minimizing the browser will be flagged as a violation." />
                    <InstructionNode text="Click 'Submit' only after reviewing all your attempted questions." />
                 </ul>

                 <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-6">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select Default Interface Language</p>
                    <div className="flex gap-4">
                       <LanguageOption label="English" active />
                       <LanguageOption label="Punjabi" />
                       <LanguageOption label="Bilingual" />
                    </div>
                 </div>

                 <Button asChild className="w-full h-16 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl shadow-xl mt-8">
                    <Link href={`/mocks/${mockId}/attempt`}>I Agree and Continue</Link>
                 </Button>
              </CardContent>
           </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InfoCard({ icon, label, val }: any) {
  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-lg text-center space-y-1 group hover:border-primary/20 transition-all">
       <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center mx-auto text-primary mb-2 shadow-inner">{icon}</div>
       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
       <p className="text-xl font-black text-[#0F172A] uppercase">{val}</p>
    </div>
  )
}

function InstructionNode({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-4">
       <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
       <p className="text-slate-600 font-medium leading-relaxed">{text}</p>
    </li>
  )
}

function LanguageOption({ label, active }: any) {
  return (
    <button className={cn(
      "px-8 py-3 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest transition-all",
      active ? "border-primary bg-primary/5 text-primary" : "border-slate-100 text-slate-400 hover:border-slate-200"
    )}>
       {label}
    </button>
  )
}
