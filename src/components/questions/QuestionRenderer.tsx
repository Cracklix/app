'use client';

import React from 'react';
import { Question, LanguageDisplayMode } from '@/types';
import { cn } from '@/lib/utils';
import MathText from './MathText';
import { Clock, AlertTriangle, Bookmark, Star, Info } from 'lucide-react';
import { useExamStore } from '@/store/useExamStore';
import { Badge } from '@/components/ui/badge';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: LanguageDisplayMode | 'en' | 'pa' | 'hi' | 'bilingual' | string;
  showSolution?: boolean;
  hideOptions?: boolean;
  selectedAnswer?: number; 
  onSelect?: (index: number) => void;
  className?: string;
}

/**
 * @fileOverview High-Fidelity Question Engine v38.0 (Simplified).
 * UPDATED: Simplified "Solution Logic" to "Answer Explanation".
 */
export default function QuestionRenderer({ 
  question, 
  language = 'ENGLISH_PUNJABI',
  showSolution = false,
  hideOptions = false,
  selectedAnswer,
  onSelect,
  className
}: QuestionRendererProps) {
  const timeLeft = useExamStore(s => s.timeLeft);
  
  if (!question) return null;

  const q = question as any;
  const normalizedLang = (language || 'ENGLISH_PUNJABI').toUpperCase();
  
  const sectionName = (q.sectionId || "").toUpperCase();
  const subjectId = (q.subjectId || "").toUpperCase();
  
  let renderLang = normalizedLang;
  
  if (sectionName.includes("ENGLISH") || subjectId.includes("ENGLISH")) {
    renderLang = "ENGLISH";
  } else if (sectionName.includes("PUNJABI") || subjectId.includes("PUNJABI")) {
    renderLang = "PUNJABI";
  } else if (sectionName.includes("HINDI") || subjectId.includes("HINDI")) {
    renderLang = "HINDI";
  }
  
  const showEn = renderLang.includes('ENGLISH');
  const showPa = renderLang.includes('PUNJABI');
  const showHi = renderLang.includes('HINDI');

  const formatTime = (seconds: number) => {
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const englishQ = q.englishQuestion || q.questionEn || q.questionText || "";
  const punjabiQ = q.punjabiQuestion || q.questionPa || "";
  const hindiQ = q.hindiQuestion || q.questionHi || "";
  
  const OPT_LABELS = ['A', 'B', 'C', 'D'];

  return (
    <div className={cn("w-full text-left font-body bg-white text-[#0F172A] p-4 md:p-6 flex flex-col select-none rounded-xl md:rounded-2xl shadow-sm border border-slate-100", className)}>
      
      {/* 1. COMPACT INFO STRIP (ONE LINE) */}
      {!showSolution && (
        <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
           <div className="flex items-center gap-3">
              <span className="font-black text-xs md:text-sm text-[#0B1528] bg-slate-50 px-2 py-1 rounded border border-slate-100">Q {q.displayId || '1'}</span>
              <div className="flex items-center gap-1 text-slate-400 font-bold text-[8px] md:text-[10px]">
                 <Clock className="h-3 w-3" />
                 <span className="tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center gap-1">
                 <span className="text-[7px] md:text-[9px] font-black text-emerald-600">+1.0</span>
                 <span className="text-[7px] md:text-[9px] font-black text-rose-600">-0.25</span>
              </div>
           </div>
           <div className="flex items-center gap-3 text-slate-300">
              <Bookmark className="h-3.5 w-3.5 hover:text-primary cursor-pointer transition-colors" />
              <AlertTriangle className="h-3.5 w-3.5 hover:text-rose-500 cursor-pointer transition-colors" />
           </div>
        </div>
      )}

      {/* 2. QUESTION STATEMENTS */}
      <div className="space-y-2 mb-6 px-1">
         {showEn && englishQ && (
           <div className="font-bold text-[14px] md:text-[17px] text-[#0F172A] antialiased leading-snug">
             <MathText text={englishQ} />
           </div>
         )}
         {showPa && punjabiQ && (
           <div className="font-bold text-[14px] md:text-[17px] text-[#0F172A] antialiased leading-snug">
             <MathText text={punjabiQ} />
           </div>
         )}
      </div>

      {/* 3. OPTIONS MATRIX */}
      {!hideOptions && (
        <div className="flex flex-col space-y-2">
          {OPT_LABELS.map((key, idx) => {
            const en = q[`option${key}English`];
            const pa = q[`option${key}Punjabi`];
            const isSelected = selectedAnswer === idx;
            return (
              <div 
                key={key} 
                onClick={() => onSelect?.(idx)} 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group/opt",
                  showSolution 
                    ? q.correctAnswer === key ? "bg-emerald-50 border-emerald-500" 
                      : isSelected ? "bg-rose-50 border-rose-500"
                      : "bg-white border-slate-100"
                    : isSelected ? "bg-orange-50 border-primary ring-1 ring-primary/10" 
                      : "bg-white border-slate-100 hover:border-slate-300"
                )}
              >
                <span className={cn(
                  "font-black text-sm md:text-lg shrink-0 w-4 text-left",
                  isSelected ? "text-primary" : "text-slate-400"
                )}>{key}</span>
                <div className="flex flex-col flex-1 min-w-0">
                  {showEn && en && <div className={cn("font-bold text-[13px] md:text-sm", isSelected ? "text-primary" : "text-slate-600")}><MathText text={en} /></div>}
                  {showPa && pa && <div className={cn("font-bold text-[13px] md:text-sm", isSelected ? "text-primary" : "text-slate-600")}><MathText text={pa} /></div>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4. SOLUTION HUB */}
      {showSolution && (
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
           <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-[9px] uppercase px-3 py-1">Answer Explanation</Badge>
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-600 leading-relaxed font-medium text-xs md:text-sm space-y-3">
              <p className="font-black text-[10px] uppercase text-[#0B1528] pb-2 border-b border-slate-200/50">Correct Key: {q.correctAnswer}</p>
              {showEn && q.englishExplanation && <MathText text={q.englishExplanation} className="text-inherit" />}
              {showPa && q.punjabiExplanation && <MathText text={q.punjabiExplanation} className="text-inherit" />}
           </div>
        </div>
      )}
    </div>
  );
}