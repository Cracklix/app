'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFirestore, useUser } from "@/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, where, documentId, getDocs } from "firebase/firestore";
import { useExamStore } from "@/store/useExamStore";
import ExamHeader from "@/components/exam/ExamHeader";
import SubjectTabs from "@/components/exam/SubjectTabs";
import TacticalFooter from "@/components/exam/TacticalFooter";
import AntiCheat from "@/components/exam/AntiCheat";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import QuestionPalette from "@/components/mocks/QuestionPalette";
import { Button } from "@/components/ui/button";
import { Loader2, Play, ShieldCheck, CheckCircle2, Trophy, AlertTriangle, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { initializeFirebase } from "@/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Institutional CBT Attempt Node v15.0.
 * Optimized: Split-view for desktop (380px Sidebar) and Native App feel for mobile.
 */
export default function MockAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const mockId = params.id as string;

  const [isInitializing, setIsInitializing] = useState(true);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);

  const examStore = useExamStore();

  useEffect(() => {
    async function loadExam() {
      if (!db || typeof db !== 'object' || !user || !mockId) return;
      try {
        const mockSnap = await getDoc(doc(db, "mocks", mockId));
        if (!mockSnap.exists()) throw new Error("Mock series not found.");
        const mockData = mockSnap.data();

        const questionIds = mockData.questionIds || [];
        const fetchedQuestions: any[] = [];
        
        const chunks = [];
        for (let i = 0; i < questionIds.length; i += 30) {
          chunks.push(questionIds.slice(i, i + 30));
        }

        const chunkSnaps = await Promise.all(
          chunks.map(chunk => getDocs(query(collection(db, "questions"), where(documentId(), "in", chunk))))
        );

        chunkSnaps.forEach(snap => {
          snap.docs.forEach(d => fetchedQuestions.push({ ...d.data(), id: d.id }));
        });

        const questions = questionIds.map(id => fetchedQuestions.find(q => q.id === id)).filter(Boolean);

        if (mockData.sections && mockData.sections.length > 0) {
           let currentIndex = 0;
           mockData.sections.forEach((sec: any) => {
              for (let i = 0; i < sec.count; i++) {
                 if (questions[currentIndex]) {
                    questions[currentIndex].sectionId = sec.name;
                 }
                 currentIndex++;
              }
           });
        }

        if (questions.length === 0) throw new Error("Question bank node empty.");

        const attemptRef = doc(db, "attempts", `${user.uid}_${mockId}`);
        const attemptSnap = await getDoc(attemptRef);
        const savedState = attemptSnap.exists() ? attemptSnap.data() : undefined;

        examStore.initExam(mockId, mockData.title || "Evaluation Series", user.uid, questions, mockData.duration || 120, savedState, mockData.languageMode);
      } catch (err: any) {
        toast({ variant: "destructive", title: "Sync Failure", description: err.message });
        router.push(`/mocks/${mockId}`);
      } finally {
        setIsInitializing(false);
      }
    }
    loadExam();
  }, [db, user, mockId, router, toast]);

  useEffect(() => {
    if (isInitializing) return;
    const interval = setInterval(() => {
      examStore.tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [isInitializing, examStore]);

  const handleSubmitFinal = useCallback(async () => {
    if (!db || isSubmittingFinal || !user) return;
    setIsSubmittingFinal(true);
    
    let score = 0;
    examStore.questions.forEach((q, idx) => {
      const studentAnsIdx = examStore.answers[idx];
      const correctAnsIdx = ['A', 'B', 'C', 'D'].indexOf(q.correctAnswer);
      if (studentAnsIdx === correctAnsIdx) score += 1;
      else if (studentAnsIdx !== undefined) score -= 0.25;
    });

    const attempted = Object.keys(examStore.answers).length;
    const accuracy = attempted > 0 ? Math.round((score / attempted) * 100) : 0;

    const resultPayload = {
      userId: user.uid,
      mockId: examStore.mockId,
      mockTitle: examStore.mockTitle,
      score,
      totalQuestions: examStore.questions.length,
      accuracy,
      answers: examStore.answers,
      timestamp: new Date().toISOString(),
      timeTaken: (examStore.questions.length * 60) - examStore.timeLeft,
      createdAt: serverTimestamp()
    };

    const resultRef = doc(db, "results", `${user.uid}_${mockId}`);
    setDoc(resultRef, resultPayload).catch(() => {});
    updateDoc(doc(db, "attempts", `${user.uid}_${mockId}`), { status: 'COMPLETED', updatedAt: serverTimestamp() }).catch(() => {});
    
    toast({ title: "Assessment Synced" });
    router.push(`/results/${mockId}`);
  }, [db, user, isSubmittingFinal, examStore, router, toast, mockId]);

  if (isInitializing) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white space-y-4">
       <Loader2 className="h-8 w-8 text-primary animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Synchronizing Hub...</p>
    </div>
  );

  const q = examStore.questions[examStore.currentIdx];
  const selectedAnswer = examStore.answers[examStore.currentIdx];

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 font-body select-none overflow-hidden relative">
      <AntiCheat />
      <ExamHeader 
        onPaletteToggle={() => setIsMobilePaletteOpen(true)} 
        onExitRequest={() => setShowExitModal(true)}
      />
      <SubjectTabs />

      <main className="flex-1 flex overflow-hidden relative">
        <AnimatePresence>
          {examStore.isPaused && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-md flex items-center justify-center p-4"
            >
              <div className="mobile-app-shell bg-white rounded-[2rem] shadow-2xl p-8 space-y-6 text-center">
                 <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto text-primary">
                    <Play className="h-7 w-7 fill-current" />
                 </div>
                 <h2 className="text-xl font-headline font-black text-[#0F172A] uppercase">Test Paused</h2>
                 <Button onClick={() => examStore.setPaused(false)} className="w-full h-14 bg-primary text-white rounded-xl font-black uppercase tracking-widest">Resume Attempt</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN QUESTION FEED */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 flex flex-col items-center">
           <div className="w-full max-w-4xl p-2 md:p-8 space-y-4">
              {q && (
                <>
                  <QuestionRenderer 
                    language={examStore.language as any} 
                    question={{...q, displayId: (examStore.currentIdx + 1).toString()}} 
                    selectedAnswer={selectedAnswer}
                    onSelect={(idx) => examStore.setAnswer(examStore.currentIdx, idx, db)}
                  />
                  <TacticalFooter onSubmit={() => setShowSubmitModal(true)} />
                </>
              )}
           </div>
        </div>

        {/* DESKTOP DOCKED PALETTE (Match reference) */}
        <aside className="hidden lg:block w-[380px] bg-white border-l h-full shrink-0 shadow-2xl">
           <QuestionPalette onSelect={(idx) => examStore.setCurrentIdx(idx)} onSubmit={() => setShowSubmitModal(true)} />
        </aside>
      </main>
      
      {/* MOBILE OVERLAY PALETTE */}
      <Sheet open={isMobilePaletteOpen} onOpenChange={setIsMobilePaletteOpen}>
        <SheetContent 
          side="right" 
          className={cn(
            "p-0 border-none overflow-hidden shadow-2xl transition-all duration-300",
            "!w-[180px] !max-w-[180px] h-full"
          )}
        >
          <SheetHeader className="sr-only">
             <SheetTitle>Question Palette</SheetTitle>
          </SheetHeader>
          <QuestionPalette onSelect={(idx) => { examStore.setCurrentIdx(idx); setIsMobilePaletteOpen(false); }} onSubmit={() => setShowSubmitModal(true)} />
        </SheetContent>
      </Sheet>

      {/* PAUSE / EXIT CONFIRMATION MODAL */}
      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
         <DialogContent className="max-w-[90%] sm:max-w-[400px] rounded-2xl p-0 bg-white overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
            <div className="p-8 space-y-10 text-center">
               <h2 className="text-xl font-bold text-[#0F172A] leading-tight px-2">
                  Are you sure you want to pause the test?
               </h2>
               
               <div className="flex gap-4">
                  <Button 
                    onClick={() => {
                       setShowExitModal(false);
                       router.push('/dashboard');
                    }}
                    className="flex-1 h-14 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-md font-bold text-lg shadow-md transition-all active:scale-95"
                  >
                     Yes
                  </Button>
                  <Button 
                    onClick={() => setShowExitModal(false)}
                    className="flex-1 h-14 bg-[#94A3B8] hover:bg-slate-500 text-white rounded-md font-bold text-lg shadow-md transition-all active:scale-95"
                  >
                     No
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>

      {/* FINAL SUBMISSION MODAL */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
         <DialogContent className="max-w-[90%] sm:max-w-[440px] rounded-3xl p-10 bg-[#0F172A] text-white border-none shadow-4xl text-center">
            <div className="space-y-8">
               <div className="h-20 w-20 bg-primary/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-primary shadow-2xl">
                  <ShieldCheck className="h-10 w-10" />
               </div>
               <div className="space-y-2">
                  <DialogTitle className="text-3xl font-headline font-black uppercase text-white">Commit Assessment?</DialogTitle>
                  <p className="text-slate-400 font-medium">Finalize your evaluation nodes for this series. This action is irreversible.</p>
               </div>
               <div className="flex gap-4 pt-4">
                  <Button variant="ghost" onClick={() => setShowSubmitModal(false)} className="flex-1 h-16 rounded-2xl text-slate-400 hover:text-white font-black uppercase text-[10px]">Cancel</Button>
                  <Button 
                     onClick={handleSubmitFinal}
                     disabled={isSubmittingFinal}
                     className="flex-1 h-16 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-primary/20 gap-3"
                  >
                     {isSubmittingFinal ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                     Commit Final
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
