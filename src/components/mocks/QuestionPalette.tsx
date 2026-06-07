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
 * @fileOverview Institutional CBT Palette Hub v19.0.
 * PRECISE MATCH: Legend cards and sectional bullet headers as per user screenshot.
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
    <div className="flex flex-col h-full bg-white text-left font-body select-none pointer-events-auto">
      <ScrollArea className="h-full">
        <div className="p-5 md:p-8 pt-8 md:pt-10 space-y-10 pb-32">
           
           {/* 1. HIGH-FIDELITY LEGEND HUB */}
           <div className="grid grid-cols-2 gap-3">
              <SummaryCard count={stats.answered} label="ANSWERED" color="bg-[#1E5EFF]" />
              <SummaryCard count={stats.notAnswered} label="NOT ANSWERED" color="bg-[#94A3B8]" />
              <SummaryCard count={stats.marked} label="MARKED" color="bg-[#F43F5E]" />
              <SummaryCard count={stats.notVisited} label="NOT VISITED" color="bg-white" textColor="text-[#94A3B8]" border="border-slate-100" />
              <SummaryCard count={stats.ansMarked} label="ANS & MARKED" color="bg-[#6366F1]" colSpan={2} />
           </div>

           <div className="h-px w-full bg-slate-50" />

           {/* 2. SECTIONAL GRIDS WITH BULLET HEADERS */}
           <div className="space-y-12">
              {sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#F97316] shrink-0" />
                      <h4 className="text-[11px] md:text-xs font-black uppercase text-[#0F172A] tracking-[0.05em] leading-none">
                         {section.name}
                      </h4>
                   </div>
                   <div className="grid grid-cols-5 gap-3">
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

           {/* 3. TACTICAL SUBMIT BUTTON */}
           <div className="pt-4">
              <Button 
                onClick={(e) => {
                   e.preventDefault();
                   onSubmit();
                }}
                className="w-full h-16 bg-[#10B981] hover:bg-[#059669] text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-emerald-900/10 gap-3 group transition-all active:scale-95"
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
      "flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-50 shadow-lg shadow-slate-900/5",
      colSpan > 1 && "col-span-2"
    )}>
       <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 shadow-lg border-4 border-white", color, textColor, border)}>
          {count}
       </div>
       <div className="min-w-0">
          <span className="text-[10px] font-black uppercase text-[#64748B] tracking-tight block leading-tight">{label}</span>
       </div>
    </div>
  )
}

function QuestionNode({ index, isActive, status, isVisited, onClick }: any) {
  const isAnswered = status === 'answered';
  const isMarked = status === 'marked';
  const isAnsMarked = status === 'answered-marked';
  
  const colorClass = isActive 
    ? "bg-white text-[#F97316] border-[#F97316] border-[3px] shadow-lg scale-105 z-10" 
    : isAnswered ? "bg-[#1E5EFF] text-white border-transparent"
    : isMarked ? "bg-[#F43F5E] text-white border-transparent"
    : isAnsMarked ? "bg-[#6366F1] text-white border-transparent"
    : isVisited ? "bg-[#94A3B8] text-white border-transparent"
    : "bg-white text-[#94A3B8] border-slate-100";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-square rounded-xl flex items-center justify-center font-black text-[15px] md:text-[16px] transition-all border shadow-sm shrink-0 active:scale-90 w-full cursor-pointer",
        colorClass
      )}
    >
      {index + 1}
      {isAnsMarked && (
        <div className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
           <CheckCircle2 className="h-2.5 w-2.5 text-white" />
        </div>
      )}
    </button>
  );
}
