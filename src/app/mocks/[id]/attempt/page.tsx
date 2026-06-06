
'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDoc, useFirestore, useUser } from "@/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useExamStore } from "@/store/useExamStore";
import ExamHeader from "@/components/exam/ExamHeader";
import SubjectTabs from "@/components/exam/SubjectTabs";
import TacticalFooter from "@/components/exam/TacticalFooter";
import PaletteDrawer from "@/components/exam/PaletteDrawer";
import AntiCheat from "@/components/exam/AntiCheat";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, Bookmark, Flag, Info, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview Professional Testbook-style Exam Engine.
 * Fully viewport-locked, mobile-first, production-grade CBT.
 */
export default function MockAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const mockId = params.id as string;

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const examStore = useExamStore();

  useEffect(() => {
    async function loadExam() {
      if (!db || !user || !mockId) return;

      try {
        // 1. Load Mock Meta
        const mockSnap = await getDoc(doc(db, "mocks", mockId));
        if (!mockSnap.exists()) throw new Error("Mock test not found.");
        const mockData = mockSnap.data();

        // 2. Load Questions
        const qSnaps = await Promise.all(
          mockData.questionIds.map((id: string) => getDoc(doc(db, "questions", id)))
        );
        const questions = qSnaps.map(s => ({ ...s.data(), id: s.id })).filter(Boolean) as any[];

        // 3. Load Saved Attempt (Resume Logic)
        const attemptSnap = await getDoc(doc(db, "attempts", `${user.uid}_${mockId}`));
        const savedState = attemptSnap.exists() ? attemptSnap.data() : undefined;

        examStore.initExam(mockId, user.uid, questions, mockData.duration, savedState);
      } catch (err: any) {
        toast({ variant: "destructive", title: "CBT Initialization Error", description: err.message });
        router.push(`/mocks/${mockId}`);
      } finally {
        setIsInitializing(false);
      }
    }
    loadExam();
  }, [db, user, mockId]);

  // Timer & Sync Logic
  useEffect(() => {
    if (isInitializing) return;
    const interval = setInterval(() => {
      examStore.tick();
      // Auto-sync to Firestore every 30 seconds
      if (Math.floor(Date.now() / 1000) % 30 === 0) {
        examStore.syncToFirestore(db!);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isInitializing, db]);

  const handleSubmitTest = async () => {
    if (!db || !user) return;
    examStore.setPaused(true);
    // Simple logic: final sync and redirect
    await examStore.syncToFirestore(db);
    toast({ title: "Audit Submitted", description: "Your performance node is being generated." });
    router.push(`/results/${mockId}`);
  };

  if (isInitializing) return (
    <div className="h-svh flex flex-col items-center justify-center bg-white space-y-6">
       <Loader2 className="h-12 w-12 text-primary animate-spin" />
       <p className="font-black uppercase text-[10px] tracking-[0.4em] text-slate-400">Syncing CBT Repository...</p>
    </div>
  );

  const q = examStore.questions[examStore.currentIdx];
  const selectedOption = examStore.answers[examStore.currentIdx];

  return (
    <div className="flex flex-col h-svh overflow-hidden bg-[#F8FAFC] text-[#0F172A] font-body select-none relative">
      <AntiCheat />
      
      <ExamHeader title={examStore.questions[0]?.boardId || "Exam Portal"} onPaletteToggle={() => setIsPaletteOpen(true)} />
      
      <SubjectTabs />

      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Control Node */}
        <div className="h-14 md:h-16 border-b border-slate-100 flex items-center justify-between px-4 md:px-8 shrink-0 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-black text-base md:text-xl shadow-lg">
                 {examStore.currentIdx + 1}
              </div>
              <div className="hidden sm:flex flex-col">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Positive: +{q?.positiveMarks || 1}</p>
                 <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest leading-none mt-1">Negative: -{q?.negativeMarks || 0.25}</p>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => examStore.toggleBookmark(examStore.currentIdx)}
                className={cn("h-9 rounded-lg font-black uppercase text-[9px] gap-2", examStore.bookmarks.includes(examStore.currentIdx) ? "text-primary bg-primary/5" : "text-slate-400")}
              >
                 <Bookmark className={cn("h-3.5 w-3.5", examStore.bookmarks.includes(examStore.currentIdx) && "fill-current")} /> Bookmark
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 rounded-lg font-black uppercase text-[9px] gap-2 text-slate-400"
              >
                 <AlertTriangle className="h-3.5 w-3.5" /> Report
              </Button>
           </div>
        </div>

        {/* Content Node */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
           {examStore.isPaused && (
             <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                <div className="h-24 w-24 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary mb-8 shadow-2xl">
                   <Clock className="h-12 w-12" />
                </div>
                <h2 className="text-4xl font-headline font-black text-[#0F172A] uppercase tracking-tight mb-4">Test Paused</h2>
                <p className="text-slate-500 font-medium mb-12 max-w-sm">The CBT registry is currently locked. Your progress is secure.</p>
                <Button onClick={() => examStore.setPaused(false)} className="bg-[#0F172A] text-white h-16 px-16 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-4xl active:scale-95 transition-all">Resume Evaluation</Button>
             </div>
           )}

           <div className="max-w-[1200px] mx-auto p-4 md:p-10 lg:p-16 space-y-12">
              <QuestionRenderer 
                 language={examStore.language} 
                 question={q} 
                 hideOptions={true}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {['A', 'B', 'C', 'D'].map((key, i) => {
                    const isSelected = selectedOption === i;
                    const enVal = (q as any)[`option${key}English`];
                    const paVal = (q as any)[`option${key}Punjabi`];
                    const hiVal = (q as any)[`option${key}Hindi`];

                    return (
                       <button
                         key={i}
                         onClick={() => examStore.setAnswer(examStore.currentIdx, i)}
                         className={cn(
                           "flex items-center gap-5 p-5 md:p-6 rounded-[2rem] border-2 transition-all text-left shadow-sm group",
                           isSelected 
                             ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                             : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-md"
                         )}
                       >
                          <div className={cn(
                             "h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center font-black text-sm md:text-lg shrink-0 transition-all",
                             isSelected ? "bg-primary text-white shadow-xl" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                          )}>
                             {key}
                          </div>
                          <div className="flex-1 overflow-hidden">
                             {examStore.language === 'en' && <p className="font-bold text-slate-800">{enVal}</p>}
                             {examStore.language === 'pa' && <p className="font-bold text-slate-800">{paVal || enVal}</p>}
                             {examStore.language === 'hi' && <p className="font-bold text-slate-800">{hiVal || enVal}</p>}
                             {examStore.language === 'bilingual' && (
                                <div className="space-y-1">
                                   <p className="font-bold text-slate-800 leading-tight">{enVal}</p>
                                   <p className="font-bold text-slate-400 leading-tight text-sm">{paVal || hiVal}</p>
                                </div>
                             )}
                          </div>
                       </button>
                    )
                 })}
              </div>
           </div>
        </div>
      </main>

      <TacticalFooter onSubmit={handleSubmitTest} />
      
      <PaletteDrawer open={isPaletteOpen} onOpenChange={setIsPaletteOpen} />
    </div>
  );
}
