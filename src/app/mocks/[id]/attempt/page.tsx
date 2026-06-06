'use client';

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFirestore, useUser } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useExamStore } from "@/store/useExamStore";
import ExamHeader from "@/components/exam/ExamHeader";
import SubjectTabs from "@/components/exam/SubjectTabs";
import TacticalFooter from "@/components/exam/TacticalFooter";
import AntiCheat from "@/components/exam/AntiCheat";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import QuestionPalette from "@/components/mocks/QuestionPalette";
import { Button } from "@/components/ui/button";
import { Loader2, Play, ShieldCheck, ClipboardList, Info, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/**
 * @fileOverview Final Production-Grade CBT Engine v7.0.
 * Responsive, mobile-first, and high-density logic lockdown.
 */
export default function MockAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const mockId = params.id as string;

  const [isInitializing, setIsInitializing] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);

  const examStore = useExamStore();

  useEffect(() => {
    async function loadExam() {
      if (!db || !user || !mockId) return;
      try {
        const mockSnap = await getDoc(doc(db, "mocks", mockId));
        if (!mockSnap.exists()) throw new Error("Mock test not found.");
        const mockData = mockSnap.data();

        const qSnaps = await Promise.all(
          mockData.questionIds.map((id: string) => getDoc(doc(db, "questions", id)))
        );
        const questions = qSnaps.map(s => ({ ...s.data(), id: s.id })).filter(Boolean) as any[];

        const attemptSnap = await getDoc(doc(db, "attempts", `${user.uid}_${mockId}`));
        const savedState = attemptSnap.exists() ? attemptSnap.data() : undefined;

        examStore.initExam(mockId, mockData.title, user.uid, questions, mockData.duration, savedState);
      } catch (err: any) {
        toast({ variant: "destructive", title: "CBT Initialization Error", description: err.message });
        router.push(`/mocks/${mockId}`);
      } finally {
        setIsInitializing(false);
      }
    }
    loadExam();
  }, [db, user, mockId]);

  useEffect(() => {
    if (isInitializing) return;
    const interval = setInterval(() => {
      examStore.tick();
      if (Math.floor(Date.now() / 1000) % 30 === 0) {
        examStore.syncToFirestore(db!);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isInitializing, db]);

  const progressStats = useMemo(() => {
    const s = { answered: 0, marked: 0, notAnswered: 0, notVisited: 0, ansMarked: 0 };
    examStore.questions.forEach((_, i) => {
      const st = examStore.status[i];
      if (st === 'answered') s.answered++;
      else if (st === 'marked') s.marked++;
      else if (st === 'answered-marked') s.ansMarked++;
      else if (examStore.visited.includes(i)) s.notAnswered++;
      else s.notVisited++;
    });
    return s;
  }, [examStore.questions, examStore.status, examStore.visited]);

  const handleSubmitFinal = async () => {
    if (!db || !user) return;
    setIsSubmittingFinal(true);
    
    // 1. Calculate Evaluation Node
    let score = 0;
    const resultsMap: any = {};
    
    examStore.questions.forEach((q, idx) => {
      const studentAnsIdx = examStore.answers[idx];
      const correctAnsIdx = ['A', 'B', 'C', 'D'].indexOf(q.correctAnswer);
      if (studentAnsIdx === correctAnsIdx) score++;
      resultsMap[idx] = studentAnsIdx;
    });

    const accuracy = Math.round((score / (Object.keys(examStore.answers).length || 1)) * 100);

    const resultPayload = {
      userId: user.uid,
      mockId: examStore.mockId,
      mockTitle: examStore.mockTitle,
      score,
      totalQuestions: examStore.questions.length,
      accuracy,
      answers: examStore.answers,
      timestamp: new Date().toISOString(),
      timeTaken: (examStore.questions.length * 60) - examStore.timeLeft, // Simplified duration
    };

    try {
      await setDoc(doc(db, "results", `${user.uid}_${mockId}`), resultPayload);
      toast({ title: "Evaluation Sync Success" });
      router.push(`/results/${mockId}`);
    } catch (e) {
      toast({ variant: "destructive", title: "Submission Failed" });
    } finally {
      setIsSubmittingFinal(false);
      setShowSubmitModal(false);
    }
  };

  if (isInitializing) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-6">
       <Loader2 className="h-10 w-10 text-primary animate-spin" />
       <p className="font-black uppercase text-[10px] tracking-[0.4em] text-slate-400">Loading Evaluation Node...</p>
    </div>
  );

  const q = examStore.questions[examStore.currentIdx];
  const selectedOption = examStore.answers[examStore.currentIdx];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-[#0F172A] font-body select-none relative">
      <AntiCheat />
      
      <ExamHeader 
        title={examStore.mockTitle} 
        onPaletteToggle={() => setIsPaletteOpen(true)} 
      />
      
      <SubjectTabs />

      <main className="flex-1 flex overflow-hidden">
        {/* LEFT ZONE: QUESTION CONTENT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
           
           {/* RESUME TEST INTERFACE (Overlay) */}
           {examStore.isPaused && (
             <div className="absolute inset-0 z-[100] bg-[#0B1528]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-5xl overflow-hidden text-left">
                   <div className="bg-[#F8FAFC] p-8 border-b border-slate-100 flex flex-col items-center text-center space-y-4">
                      <div className="h-16 w-16 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white shadow-xl animate-bounce">
                         <Play className="h-8 w-8 text-primary fill-current" />
                      </div>
                      <div className="space-y-1 text-center w-full">
                         <h2 className="text-3xl font-headline font-black text-[#0F172A] uppercase tracking-tight">Pause Hub</h2>
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Progress Audit Registered</p>
                      </div>
                   </div>

                   <div className="p-8 space-y-8">
                      <div className="grid grid-cols-2 gap-3">
                         <SummaryCard label="Answered" val={progressStats.answered} color="bg-blue-600" />
                         <SummaryCard label="Marked" val={progressStats.marked} color="bg-pink-500" />
                         <SummaryCard label="Unanswered" val={progressStats.notAnswered} color="bg-slate-400" />
                         <SummaryCard label="Not Visited" val={progressStats.notVisited} color="bg-slate-100" textColor="text-slate-400" />
                      </div>

                      <div className="space-y-4 pt-4">
                         <button 
                            onClick={() => examStore.setPaused(false)} 
                            className="w-full h-16 bg-[#F97316] hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-3xl flex items-center justify-center gap-3 transition-all active:scale-95"
                         >
                            <Play className="h-5 w-5 fill-current" /> Resume Test Now
                         </button>
                         <button onClick={() => setShowSubmitModal(true)} className="w-full h-12 text-slate-400 hover:text-rose-500 font-bold uppercase tracking-widest text-[9px]">
                            Submit Assessment
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           )}

           <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 flex-1 flex flex-col h-full min-h-0 text-left">
              <QuestionRenderer 
                 language={examStore.language} 
                 question={q} 
                 hideOptions={true}
              />

              <div className="grid grid-cols-1 gap-2.5 mt-4 pb-4">
                 {['A', 'B', 'C', 'D'].map((key, i) => {
                    const isSelected = selectedOption === i;
                    const enVal = (q as any)[`option${key}English`];
                    const paVal = (q as any)[`option${key}Punjabi`];
                    
                    return (
                       <button
                         key={i}
                         onClick={() => examStore.setAnswer(examStore.currentIdx, i)}
                         className={cn(
                           "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left shadow-sm min-h-[64px] group",
                           isSelected 
                             ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                             : "border-slate-100 bg-white hover:border-slate-300"
                         )}
                       >
                          <div className={cn(
                             "h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-all",
                             isSelected ? "bg-primary text-white shadow-lg" : "bg-[#0F172A] text-white"
                          )}>
                             {key}
                          </div>
                          <div className="flex-1 overflow-hidden">
                             <div className="flex flex-col gap-1">
                                {(examStore.language === 'en' || examStore.language === 'bi') && <p className="font-[600] text-[20px] text-[#111111] leading-tight">{enVal}</p>}
                                {(examStore.language === 'pa' || examStore.language === 'bi') && <p className="font-[600] text-[20px] text-[#111111] leading-tight">{paVal || enVal}</p>}
                             </div>
                          </div>
                       </button>
                    )
                 })}
              </div>
           </div>
        </div>

        {/* RIGHT ZONE: PALETTE (Desktop Only) */}
        <aside className="hidden lg:block w-[320px] shrink-0 h-full">
           <QuestionPalette onSelect={(idx) => examStore.setCurrentIdx(idx)} />
        </aside>
      </main>

      <TacticalFooter onSubmit={() => setShowSubmitModal(true)} />
      
      {/* MOBILE PALETTE DRAWER */}
      <Sheet open={isPaletteOpen} onOpenChange={setIsPaletteOpen}>
        <SheetContent side="right" className="w-[320px] p-0 border-none">
          <QuestionPalette onSelect={(idx) => { examStore.setCurrentIdx(idx); setIsPaletteOpen(false); }} />
        </SheetContent>
      </Sheet>

      {/* FINAL SUBMISSION MODAL */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
         <DialogContent className="max-w-md rounded-[2.5rem] p-10 bg-white border-none shadow-5xl text-left">
            <DialogHeader className="text-center space-y-4">
               <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-xl">
                  <ShieldCheck className="h-8 w-8" />
               </div>
               <DialogTitle className="text-3xl font-headline font-black text-[#0F172A] uppercase">Final Audit</DialogTitle>
               <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Review your preparation node</p>
            </DialogHeader>

            <div className="py-8 grid grid-cols-2 gap-4">
               <SubmissionNode label="Attempted" val={progressStats.answered + progressStats.ansMarked} color="text-blue-600" />
               <SubmissionNode label="Marked" val={progressStats.marked + progressStats.ansMarked} color="text-pink-500" />
               <SubmissionNode label="Unanswered" val={progressStats.notAnswered} color="text-slate-400" />
               <SubmissionNode label="Total Qs" val={examStore.questions.length} color="text-[#0F172A]" />
            </div>

            <DialogFooter className="flex flex-col gap-3">
               <Button 
                  onClick={handleSubmitFinal}
                  disabled={isSubmittingFinal}
                  className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-900/20"
               >
                  {isSubmittingFinal ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle2 className="h-5 w-5 mr-2" />}
                  Submit Evaluation
               </Button>
               <Button variant="ghost" onClick={() => setShowSubmitModal(false)} className="w-full text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                  Cancel & Review
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryCard({ label, val, color, textColor = "text-white" }: any) {
   return (
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
         <span className="text-[9px] font-black uppercase text-slate-400 tracking-tight">{label}</span>
         <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black shadow-lg border", color, textColor)}>
            {val}
         </div>
      </div>
   )
}

function SubmissionNode({ label, val, color }: any) {
   return (
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
         <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{label}</p>
         <p className={cn("text-2xl font-headline font-black", color)}>{val}</p>
      </div>
   )
}
