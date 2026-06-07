
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
import { Loader2, Play, ShieldCheck, CheckCircle2, Trophy, AlertTriangle, LogOut, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Elite CBT Attempt Engine v17.0.
 * OPTIMIZED: Zero-lag question transitions and backgrounded auto-save.
 * UI: High-fidelity focus mode with immersive dark-palette header.
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
      if (!db || !user || !mockId) return;
      try {
        const mockSnap = await getDoc(doc(db, "mocks", mockId));
        if (!mockSnap.exists()) throw new Error("Mock series not found in registry.");
        const mockData = mockSnap.data();

        const questionIds = mockData.questionIds || [];
        const fetchedQuestions: any[] = [];
        
        // Elite Chunking: Max 30 IDs per query to bypass Firestore limits
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

        // Maintain strict ordering as defined in mock questionIds
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

        if (questions.length === 0) throw new Error("Question bank nodes empty.");

        const attemptRef = doc(db, "attempts", `${user.uid}_${mockId}`);
        const attemptSnap = await getDoc(attemptRef);
        const savedState = attemptSnap.exists() ? attemptSnap.data() : undefined;

        examStore.initExam(mockId, mockData.title || "Elite Series", user.uid, questions, mockData.duration || 120, savedState, mockData.languageMode);
      } catch (err: any) {
        toast({ variant: "destructive", title: "Sync Failure", description: err.message });
        router.push(`/mocks/${mockId}`);
      } finally {
        setIsInitializing(false);
      }
    }
    loadExam();
  }, [db, user, mockId, router, toast, examStore]);

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
    
    // Performance Marking Engine
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
      timeTaken: (examStore.timeLeft < (examStore.questions.length * 60)) ? (examStore.startTime + (examStore.questions.length * 60000) - Date.now()) : 0,
      createdAt: serverTimestamp()
    };

    const resultRef = doc(db, "results", `${user.uid}_${mockId}`);
    setDoc(resultRef, resultPayload).catch(() => {});
    updateDoc(doc(db, "attempts", `${user.uid}_${mockId}`), { status: 'COMPLETED', updatedAt: serverTimestamp() }).catch(() => {});
    
    toast({ title: "Assessment Synchronized" });
    router.push(`/results/${mockId}`);
  }, [db, user, isSubmittingFinal, examStore, router, toast, mockId]);

  if (isInitializing) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0B1528] space-y-8">
       <div className="relative">
          <Zap className="h-16 w-16 text-primary animate-pulse" />
          <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full animate-ping" />
       </div>
       <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Initializing Elite CBT Hub...</p>
    </div>
  );

  const q = examStore.questions[examStore.currentIdx];
  const selectedAnswer = examStore.answers[examStore.currentIdx];

  return (
    <div className="flex flex-col h-[100dvh] bg-white font-body select-none overflow-hidden relative">
      <AntiCheat />
      <ExamHeader 
        onPaletteToggle={() => setIsMobilePaletteOpen(true)} 
        onExitRequest={() => setShowExitModal(true)}
      />
      <SubjectTabs />

      <main className="flex-1 flex overflow-hidden relative bg-slate-50/30">
        <AnimatePresence>
          {examStore.isPaused && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-[#0B1528]/95 backdrop-blur-xl flex items-center justify-center p-6"
            >
              <div className="bg-white rounded-[3rem] shadow-5xl p-12 space-y-8 text-center max-w-sm w-full">
                 <div className="h-20 w-20 bg-orange-50 rounded-[2rem] flex items-center justify-center mx-auto text-primary shadow-2xl">
                    <Play className="h-10 w-10 fill-current" />
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-2xl font-headline font-black text-[#0F172A] uppercase tracking-tight">Attempt Paused</h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Time Node Locked</p>
                 </div>
                 <Button onClick={() => examStore.setPaused(false)} className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-3xl">Resume Assessment</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center">
           <div className="w-full max-w-4xl p-3 md:p-10 space-y-6">
              {q && (
                <motion.div 
                   key={examStore.currentIdx}
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.2 }}
                >
                  <QuestionRenderer 
                    language={examStore.language as any} 
                    question={{...q, displayId: (examStore.currentIdx + 1).toString()}} 
                    selectedAnswer={selectedAnswer}
                    onSelect={(idx) => examStore.setAnswer(examStore.currentIdx, idx, db)}
                    className="shadow-xl border-none p-6 md:p-12 rounded-[2.5rem]"
                  />
                </motion.div>
              )}
              <TacticalFooter onSubmit={() => setShowSubmitModal(true)} />
           </div>
        </div>

        <aside className="hidden lg:block w-[400px] bg-white border-l border-slate-100 h-full shrink-0 shadow-2xl z-20">
           <QuestionPalette onSelect={(idx) => examStore.setCurrentIdx(idx)} onSubmit={() => setShowSubmitModal(true)} />
        </aside>
      </main>
      
      <Sheet open={isMobilePaletteOpen} onOpenChange={setIsMobilePaletteOpen}>
        <SheetContent 
          side="right" 
          className="p-0 border-none overflow-hidden shadow-5xl w-[320px] max-w-[85vw] h-full"
        >
          <SheetHeader className="sr-only">
             <SheetTitle>Registry Palette</SheetTitle>
          </SheetHeader>
          <QuestionPalette onSelect={(idx) => { examStore.setCurrentIdx(idx); setIsMobilePaletteOpen(false); }} onSubmit={() => setShowSubmitModal(true)} />
        </SheetContent>
      </Sheet>

      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
         <DialogContent className="max-w-[400px] rounded-[2.5rem] p-12 bg-white border-none shadow-5xl text-center">
            <div className="space-y-8">
               <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                  <LogOut className="h-8 w-8" />
               </div>
               <div className="space-y-2">
                  <DialogTitle className="text-2xl font-headline font-black uppercase text-[#0F172A]">Pause Assessment?</DialogTitle>
                  <p className="text-sm font-medium text-slate-500">Your current state will be safely cached in the registry. You can resume from any device.</p>
               </div>
               <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setShowExitModal(false)} className="flex-1 h-14 rounded-xl font-black uppercase text-[10px]">Cancel</Button>
                  <Button 
                    onClick={() => {
                       setShowExitModal(false);
                       router.push('/dashboard');
                    }}
                    className="flex-1 h-14 bg-[#0F172A] hover:bg-black text-white rounded-xl font-black uppercase text-[10px] shadow-xl"
                  >
                     Yes, Pause
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>

      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
         <DialogContent className="max-w-[440px] rounded-[3rem] p-12 bg-[#0F172A] text-white border-none shadow-5xl text-center">
            <div className="space-y-10">
               <div className="h-24 w-24 bg-primary/20 rounded-[3rem] flex items-center justify-center mx-auto text-primary shadow-3xl">
                  <ShieldCheck className="h-12 w-12" />
               </div>
               <div className="space-y-3">
                  <DialogTitle className="text-3xl font-headline font-black uppercase text-white tracking-tight">Final Registry Submission</DialogTitle>
                  <p className="text-slate-400 font-medium leading-relaxed">Commit your evaluation nodes for this series? This action finalizes your rank index.</p>
               </div>
               <div className="flex gap-4 pt-4">
                  <Button variant="ghost" onClick={() => setShowSubmitModal(false)} className="flex-1 h-16 rounded-2xl text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-widest">Cancel</Button>
                  <Button 
                     onClick={handleSubmitFinal}
                     disabled={isSubmittingFinal}
                     className="flex-1 h-16 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-3xl shadow-primary/20 gap-3"
                  >
                     {isSubmittingFinal ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                     Commit Hub
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
