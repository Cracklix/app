'use client';

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  ShieldCheck,
  LayoutGrid
} from "lucide-react";
import { useExamStore } from '@/store/useExamStore';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuestionPaletteProps {
  onSelect: (index: number) => void;
  onSubmit: () => void;
}

/**
 * @fileOverview Institutional CBT Palette Hub v26.0.
 * FIXED: Adjusted SummaryCard internal spacing to prevent text overflow on mobile.
 */
export default function QuestionPalette({ onSelect, onSubmit }: QuestionPaletteProps) {
  const questions = useExamStore(s => s.questions);
  const status = useExamStore(s => s.status);
  const currentIdx = useExamStore(s => s.currentIdx);
  const visited = useExamStore(s => s.visited);

  // Status Aggregation
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

  // Group Questions by Section
  const sections = useMemo(() => {
    const groups: Record<string, { name: string, questions: any[] }> = {};
    
    questions.forEach((q, idx) => {
      const sid = q.sectionId || 'General Knowledge';
      if (!groups[sid]) {
        groups[sid] = { name: sid.toUpperCase(), questions: [] };
      }
      groups[sid].questions.push({ ...q, globalIdx: idx });
    });
    
    return Object.values(groups);
  }, [questions]);

  return (
    <div className="flex flex-col h-full bg-white text-left font-body select-none pointer-events-auto overflow-hidden">
      <ScrollArea className="h-full">
        {/* Anti-Clipping padding calibrated for screenshot visibility */}
        <div className="p-3 md:p-8 pt-24 md:pt-28 space-y-8 md:space-y-10 pb-32">
           
           {/* 1. STATUS LEGEND HUB */}
           <div className="grid grid-cols-2 gap-2 md:gap-4">
              <SummaryCard count={stats.answered} label="ANSWERED" color="bg-[#1E5EFF]" />
              <SummaryCard count={stats.notAnswered} label="NOT ANSWERED" color="bg-[#94A3B8]" />
              <SummaryCard count={stats.marked} label="MARKED" color="bg-[#F43F5E]" />
              <SummaryCard count={stats.notVisited} label="NOT VISITED" color="bg-white" textColor="text-[#94A3B8]" border="border-slate-100" />
              <SummaryCard count={stats.ansMarked} label="ANS & MARKED" color="bg-[#6366F1]" colSpan={2} />
           </div>

           <div className="h-px w-full bg-slate-100" />

           {/* 2. SECTIONAL GRIDS WITH ORANGE BULLETS */}
           <div className="space-y-10 md:space-y-12">
              {sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-5 md:space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#F97316] shrink-0 shadow-sm" />
                      <h4 className="text-[10px] md:text-xs font-[900] uppercase text-[#0F172A] tracking-wider leading-tight">
                         {section.name}
                      </h4>
                   </div>
                   <div className="grid grid-cols-5 gap-2 md:gap-3">
                      {section.questions.map((q) => (
                         <QuestionNode 
                           key={q.globalIdx} 
                           index={q.globalIdx} 
                           isActive={currentIdx === q.globalIdx} 
                           status={status[q.globalIdx]} 
                           isVisited={visited.includes(q.globalIdx)}
                           onClick={() => onSelect(q.globalIdx)}
                         />
                      ))}
                   </div>
                </div>
              ))}
           </div>

           {/* 3. SUBMIT NODE */}
           <div className="pt-6">
              <Button 
                onClick={(e) => {
                   e.preventDefault();
                   onSubmit();
                }}
                className="w-full h-16 bg-[#10B981] hover:bg-[#059669] text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-emerald-900/20 gap-3 group transition-all active:scale-95 border-none"
              >
                 <ShieldCheck className="h-5 w-5 group-hover:scale-110 transition-transform" /> SUBMIT TEST
              </Button>
           </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function SummaryCard({ count, label, color, textColor = "text-white", colSpan = 1, border = "border-transparent" }: any) {
  return (
    <div className={cn(
      "flex items-center gap-2 md:gap-3 p-2 md:p-4 rounded-xl md:rounded-[2rem] bg-white border border-slate-100 shadow-2xl",
      colSpan > 1 && "col-span-2"
    )}>
       <div className={cn("h-8 w-8 md:h-12 md:w-12 rounded-full flex items-center justify-center text-xs md:text-lg font-black shrink-0 shadow-lg border-[2px] md:border-[3px] border-white", color, textColor, border)}>
          {count}
       </div>
       <div className="min-w-0">
          <span className="text-[7px] md:text-[11px] font-black uppercase text-slate-400 tracking-tighter block leading-tight truncate">{label}</span>
       </div>
    </div>
  )
}

function QuestionNode({ index, isActive, status, isVisited, onClick }: any) {
  const isAnswered = status === 'answered';
  const isMarked = status === 'marked';
  const isAnsMarked = status === 'answered-marked';
  
  const colorClass = isActive 
    ? "bg-white text-[#F97316] border-[#F97316] border-[3px] shadow-xl scale-105 z-10" 
    : isAnswered ? "bg-[#1E5EFF] text-white border-transparent shadow-md"
    : isMarked ? "bg-[#F43F5E] text-white border-transparent shadow-md"
    : isAnsMarked ? "bg-[#6366F1] text-white border-transparent shadow-md"
    : isVisited ? "bg-[#94A3B8] text-white border-transparent shadow-md"
    : "bg-white text-[#94A3B8] border-slate-100 shadow-sm";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-square rounded-xl flex items-center justify-center font-black text-[14px] md:text-[18px] transition-all border shrink-0 active:scale-90 w-full cursor-pointer",
        colorClass
      )}
    >
      {index + 1}
      {isAnsMarked && (
        <div className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
           <CheckCircle2 className="h-2.5 w-2.5 text-white" />
        </div>
      )}
    </button>
  );
}
