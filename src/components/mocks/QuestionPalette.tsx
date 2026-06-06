
'use client';

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { useExamStore } from '@/store/useExamStore';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * @fileOverview Professional CBT Question Palette Hub v5.0.
 * Unified Scroll: The entire sidebar (Summary, Sections, Submit) scrolls as one unit.
 * Styled to match provided institutional screenshot.
 */
export default function QuestionPalette({ onSelect }: { onSelect: (index: number) => void }) {
  const { questions, status, currentIdx, visited } = useExamStore();

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

  const sections = useMemo(() => {
    const map: Record<string, { name: string, questions: number[] }> = {};
    
    (questions || []).forEach((q, idx) => {
      const sectionId = String(q.sectionId || 'General');
      if (!map[sectionId]) {
        map[sectionId] = {
          name: sectionId.replace(/-/g, ' ').toUpperCase(),
          questions: []
        };
      }
      map[sectionId].questions.push(idx);
    });
    
    return Object.entries(map);
  }, [questions]);

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 text-left font-body select-none">
      
      {/* UNIFIED SCROLL AREA - Covers everything from Status to Submit */}
      <ScrollArea className="h-full">
        <div className="p-6 space-y-10">
           
           {/* 1. STATUS SUMMARY HUB - Screenshot Styled */}
           <div className="space-y-6">
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Question Status</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <SummaryCard count={stats.answered} label="ANSWERED" color="bg-blue-600" />
                 <SummaryCard count={stats.notAnswered} label="NOT ANSWERED" color="bg-slate-400" />
                 <SummaryCard count={stats.marked} label="MARKED" color="bg-pink-500" />
                 <SummaryCard count={stats.notVisited} label="NOT VISITED" color="bg-white" textColor="text-slate-400" border="border-slate-200" />
                 <SummaryCard count={stats.ansMarked} label="ANS & MARKED" color="bg-violet-600" colSpan={2} />
              </div>
           </div>

           {/* 2. SECTION-WISE GRID */}
           <div className="space-y-10 pt-6 border-t border-slate-50">
              {sections.map(([secId, data]) => (
                <div key={secId} className="space-y-5">
                   <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-[12px] font-black text-[#0B1528] tracking-widest uppercase flex items-center gap-2">
                        <ChevronDown className="h-3.5 w-3.5 text-primary" /> {data.name}
                      </h4>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{data.questions.length} Qs</span>
                   </div>
                   
                   <div className="grid grid-cols-5 gap-4">
                      {data.questions.map((idx) => (
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
              ))}
           </div>

           {/* 3. SUBMIT HUB - End of Scroll */}
           <div className="pt-10 pb-8">
              <Button className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-emerald-900/10 gap-3 group transition-all">
                 <ShieldCheck className="h-5 w-5 group-hover:scale-110 transition-transform" /> SUBMIT FINAL ASSESSMENT
              </Button>
              <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-widest mt-6">Audit Registry Sync v5.0</p>
           </div>

        </div>
      </ScrollArea>
    </div>
  );
}

function SummaryCard({ count, label, color, textColor = "text-white", colSpan = 1, border = "border-transparent" }: any) {
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-primary/20",
      colSpan > 1 && "md:col-span-2"
    )}>
       <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-black shrink-0 shadow-lg border", color, textColor, border)}>
          {count}
       </div>
       <div className="min-w-0">
          <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter block truncate">{label}</span>
       </div>
    </div>
  )
}

function QuestionNode({ index, isActive, status, isVisited, onClick }: any) {
  const isAnswered = status === 'answered';
  const isMarked = status === 'marked';
  const isAnsMarked = status === 'answered-marked';
  
  const colorClass = isActive 
    ? "ring-4 ring-orange-500/20 z-10 bg-white text-[#F97316] border-[#F97316] border-2" 
    : isAnswered ? "bg-blue-600 text-white border-blue-600"
    : isMarked ? "bg-pink-500 text-white border-pink-500"
    : isAnsMarked ? "bg-violet-600 text-white border-violet-600"
    : isVisited ? "bg-slate-400 text-white border-slate-400"
    : "bg-white text-slate-400 border-slate-200";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full aspect-square rounded-full flex items-center justify-center font-black text-[13px] transition-all border shadow-sm shrink-0 active:scale-90 hover:opacity-90",
        colorClass
      )}
    >
      {index + 1}
      {isAnsMarked && (
        <div className="absolute -top-1 -right-1 h-4.5 w-4.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
           <CheckCircle2 className="h-3 w-3 text-white" />
        </div>
      )}
    </button>
  );
}
