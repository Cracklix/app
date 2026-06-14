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
 * @fileOverview Institutional CBT Palette Hub v40.0 (Ultra-Compact Micro).
 * UPDATED: Absolute minimum sizing for question nodes and summary blocks.
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
      const sid = q.sectionId || 'General';
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
        <div className="p-1 md:p-2 pt-10 md:pt-12 space-y-1.5 md:space-y-3 pb-32">
           
           {/* 1. STATUS LEGEND HUB - MICRO SCALE */}
           <div className="grid grid-cols-2 gap-0.5 md:gap-1.5">
              <SummaryCard count={stats.answered} label="ANS" color="bg-[#1E5EFF]" />
              <SummaryCard count={stats.notAnswered} label="N-ANS" color="bg-[#94A3B8]" />
              <SummaryCard count={stats.marked} label="MRK" color="bg-[#F43F5E]" />
              <SummaryCard count={stats.notVisited} label="N-VIS" color="bg-white" textColor="text-[#94A3B8]" border="border-slate-100" />
              <SummaryCard count={stats.ansMarked} label="ANS+MRK" color="bg-[#6366F1]" colSpan={2} />
           </div>

           <div className="h-px w-full bg-slate-50" />

           {/* 2. SECTIONAL GRIDS */}
           <div className="space-y-2 md:space-y-4">
              {sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-1 md:space-y-2">
                   <h4 className="text-[5px] md:text-[8px] font-[900] uppercase text-slate-400 tracking-wider truncate pl-0.5">
                      {section.name}
                   </h4>
                   <div className="grid grid-cols-5 gap-0.5 md:gap-1">
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

           {/* 3. SUBMIT NODE - COMPACT */}
           <div className="pt-0.5">
              <Button 
                onClick={(e) => {
                   e.preventDefault();
                   onSubmit();
                }}
                className="w-full h-7 md:h-9 bg-[#10B981] hover:bg-[#059669] text-white font-black uppercase tracking-tighter text-[6px] md:text-[8px] rounded-md shadow-sm border-none transition-all active:scale-95"
              >
                 FINISH TEST
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
      "flex items-center gap-0.5 p-0.5 md:p-1.5 rounded-sm bg-white border border-slate-50",
      colSpan > 1 && "col-span-2"
    )}>
       <div className={cn("h-3 w-3 md:h-5 md:w-5 rounded-full flex items-center justify-center text-[5px] md:text-xs font-black shrink-0 border-[1px] border-white shadow-sm", color, textColor, border)}>
          {count}
       </div>
       <div className="min-w-0">
          <span className="text-[4px] md:text-[6px] font-black uppercase text-slate-400 tracking-tighter block leading-none truncate">{label}</span>
       </div>
    </div>
  )
}

function QuestionNode({ index, isActive, status, isVisited, onClick }: any) {
  const isAnswered = status === 'answered';
  const isMarked = status === 'marked';
  const isAnsMarked = status === 'answered-marked';
  
  const colorClass = isActive 
    ? "bg-white text-[#F97316] border-[#F97316] border-[1.5px] shadow-sm z-10" 
    : isAnswered ? "bg-[#1E5EFF] text-white border-transparent"
    : isMarked ? "bg-[#F43F5E] text-white border-transparent"
    : isAnsMarked ? "bg-[#6366F1] text-white border-transparent"
    : isVisited ? "bg-[#94A3B8] text-white border-transparent"
    : "bg-white text-slate-300 border-slate-50";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-square rounded-sm flex items-center justify-center font-black text-[8px] md:text-xs transition-all border shrink-0 active:scale-90 w-full cursor-pointer",
        colorClass
      )}
    >
      {index + 1}
    </button>
  );
}
