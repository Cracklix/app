'use client';

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  ShieldCheck
} from "lucide-react";
import { useExamStore } from '@/store/useExamStore';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuestionPaletteProps {
  onSelect: (index: number) => void;
  onSubmit: () => void;
}

/**
 * @fileOverview Professional CBT Question Palette Hub v17.0.
 * UPDATED: Legend at top, Unified grid below. High-density design.
 */
export default function QuestionPalette({ onSelect, onSubmit }: QuestionPaletteProps) {
  const questions = useExamStore(s => s.questions);
  const status = useExamStore(s => s.status);
  const currentIdx = useExamStore(s => s.currentIdx);
  const visited = useExamStore(s => s.visited);

  const stats = useMemo(() => {
    const s = { answered: 0, marked: 0, notAnswered: 0, notVisited: 0, ansMarked: 0 };
    (questions || []).forEach((_, i) => {
      const st = status[i];
      if (st === 'answered') s.answered++;
      else if (st === 'marked') s.marked++;
      else if (st === 'answered-marked') s.ansMarked++;
      else if (visited.includes(i)) s.notAnswered++;
      else s.notVisited++;
    });
    return s;
  }, [questions, status, visited]);

  return (
    <div className="flex flex-col h-full bg-white text-left font-body select-none pointer-events-auto">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6 pt-6 md:pt-8 space-y-8 pb-32">
           
           {/* 1. STATUS LEGEND HUB (TOP) */}
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">LEGEND</p>
              <div className="grid grid-cols-2 gap-2">
                 <SummaryCard count={stats.answered} label="ANSWERED" color="bg-blue-600" shadow="shadow-blue-500/20" />
                 <SummaryCard count={stats.notAnswered} label="NOT ANSWERED" color="bg-slate-400" />
                 <SummaryCard count={stats.marked} label="MARKED" color="bg-pink-500" shadow="shadow-pink-500/20" />
                 <SummaryCard count={stats.notVisited} label="NOT VISITED" color="bg-white" textColor="text-slate-400" border="border-slate-200" />
                 <SummaryCard count={stats.ansMarked} label="ANS & MARKED" color="bg-violet-600" shadow="shadow-violet-500/20" colSpan={2} />
              </div>
           </div>

           <div className="h-px w-full bg-slate-50" />

           {/* 2. UNIFIED QUESTION GRID */}
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">QUESTIONS</p>
              <div className="grid grid-cols-5 gap-2.5">
                 {questions.map((_, idx) => (
                    <QuestionNode 
                      key={idx} 
                      index={idx} 
                      isActive={currentIdx === idx} 
                      status={status[idx]} 
                      isVisited={visited.includes(idx)}
                      onClick={() => onSelect(idx)}
                    />
                 ))}
              </div>
           </div>

           {/* 3. TACTICAL SUBMIT BUTTON */}
           <div className="pt-4">
              <Button 
                onClick={(e) => {
                   e.preventDefault();
                   onSubmit();
                }}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-xl shadow-emerald-900/10 gap-3 group transition-all active:scale-95"
              >
                 <ShieldCheck className="h-4 w-4 group-hover:scale-110 transition-transform" /> SUBMIT TEST
              </Button>
           </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function SummaryCard({ count, label, color, textColor = "text-white", colSpan = 1, border = "border-transparent", shadow = "" }: any) {
  return (
    <div className={cn(
      "flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-sm",
      colSpan > 1 && "col-span-2"
    )}>
       <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 shadow-md border", color, textColor, border, shadow)}>
          {count}
       </div>
       <div className="min-w-0">
          <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter block leading-tight">{label}</span>
       </div>
    </div>
  )
}

function QuestionNode({ index, isActive, status, isVisited, onClick }: any) {
  const isAnswered = status === 'answered';
  const isMarked = status === 'marked';
  const isAnsMarked = status === 'answered-marked';
  
  const colorClass = isActive 
    ? "ring-2 ring-orange-500/20 z-10 bg-white text-[#F97316] border-[#F97316] border-2" 
    : isAnswered ? "bg-blue-600 text-white border-blue-600 shadow-blue-500/10"
    : isMarked ? "bg-pink-500 text-white border-pink-500 shadow-pink-500/10"
    : isAnsMarked ? "bg-violet-600 text-white border-violet-600 shadow-violet-500/10"
    : isVisited ? "bg-slate-400 text-white border-slate-400"
    : "bg-white text-slate-400 border-slate-200";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-square rounded-lg flex items-center justify-center font-black text-[12px] md:text-[14px] transition-all border shadow-sm shrink-0 active:scale-90 w-full cursor-pointer",
        colorClass
      )}
    >
      {index + 1}
      {isAnsMarked && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border border-white flex items-center justify-center shadow-md">
           <CheckCircle2 className="h-2 w-2 text-white" />
        </div>
      )}
    </button>
  );
}
