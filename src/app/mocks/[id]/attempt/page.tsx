
'use client';

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFirestore, useUser } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useExamStore } from "@/store/useExamStore";
import ExamHeader from "@/components/exam/ExamHeader";
import SubjectTabs from "@/components/exam/SubjectTabs";
import TacticalFooter from "@/components/exam/TacticalFooter";
import AntiCheat from "@/components/exam/AntiCheat";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import QuestionPalette from "@/components/mocks/QuestionPalette";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

/**
 * @fileOverview Official Institutional CBT Engine v1.0.
 * Optimized Viewport Lock: Header (Fixed) + Main (Scrollable Area) + Sidebar (Fixed) + Footer (Fixed).
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

  const handleSubmitTest = async () => {
    if (!db || !user) return;
    if (!confirm("Are you sure you want to submit your test?")) return;
    
    examStore.setPaused(true);
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
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] font-body select-none relative">
      <AntiCheat />
      
      <ExamHeader 
        title={examStore.mockTitle} 
        onPaletteToggle={() => setIsPaletteOpen(true)} 
      />
      
      <SubjectTabs />

      <main className="flex-1 flex overflow-hidden bg-white">
        
        {/* LEFT ZONE: QUESTION CONTENT (Scrollable Area) */}
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

           <div className="max-w-[1400px] mx-auto p-6 md:p-8 lg:p-14 space-y-10">
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
                    
                    return (
                       <button
                         key={i}
                         onClick={() => examStore.setAnswer(examStore.currentIdx, i)}
                         className={cn(
                           "flex items-center gap-5 p-5 md:p-6 rounded-[2rem] border-2 transition-all text-left shadow-sm group",
                           isSelected 
                             ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
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
                             {examStore.language === 'en' && <p className="font-bold text-slate-800 text-lg">{enVal}</p>}
                             {examStore.language === 'pa' && <p className="font-bold text-slate-800 text-lg">{paVal || enVal}</p>}
                             {examStore.language === 'bi' && (
                                <div className="space-y-1">
                                   <p className="font-bold text-slate-800 text-lg leading-tight">{enVal}</p>
                                   <p className="font-bold text-[#1E3A8A] leading-tight text-lg">{paVal}</p>
                                </div>
                             )}
                          </div>
                       </button>
                    )
                 })}
              </div>
           </div>
        </div>

        {/* RIGHT ZONE: QUESTION PALETTE (Fixed Panel on Desktop) */}
        <aside className="hidden lg:block w-[320px] shrink-0 border-l border-slate-200 bg-white">
           <QuestionPalette onSelect={(idx) => examStore.setCurrentIdx(idx)} />
        </aside>
      </main>

      <TacticalFooter onSubmit={handleSubmitTest} />
      
      {/* MOBILE PALETTE DRAWER */}
      <Sheet open={isPaletteOpen} onOpenChange={setIsPaletteOpen}>
        <SheetContent side="right" className="w-[320px] p-0 border-none">
          <SheetHeader className="p-6 border-b border-slate-100">
             <SheetTitle className="text-sm font-black uppercase tracking-widest">Question Palette</SheetTitle>
          </SheetHeader>
          <QuestionPalette onSelect={(idx) => { examStore.setCurrentIdx(idx); setIsPaletteOpen(false); }} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
