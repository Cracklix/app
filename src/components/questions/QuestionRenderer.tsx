
'use client';

import React from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import MathText from './MathText';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'hi' | 'bilingual';
  showSolution?: boolean;
  hideOptions?: boolean;
  selectedAnswer?: number; // 0, 1, 2, 3
  onSelect?: (index: number) => void;
}

/**
 * @fileOverview Institutional High-Fidelity High-Density Dark Renderer v30.0.
 * Optimized: Maximum vertical density for solutions hub. Reduced padding and spacing.
 */
export default function QuestionRenderer({ 
  question, 
  language = 'bilingual',
  showSolution = false,
  hideOptions = false,
  selectedAnswer,
  onSelect
}: QuestionRendererProps) {
  
  const isEn = language === 'en';
  const isPa = language === 'pa';
  const isBi = language === 'bilingual';

  const q = question as any;
  const englishQ = q.englishQuestion || q.questionEn || q.question_english || q.titleEn || q.questionText;
  const punjabiQ = q.punjabiQuestion || q.questionPa || q.question_punjabi || q.titlePa;
  
  const englishExp = q.englishExplanation || q.explanationEn || q.explanation_english || q.rationalization;
  const punjabiExp = q.punjabiExplanation || q.explanationPa || q.explanation_punjabi;

  return (
    <div className="w-full text-left font-body bg-[#111111] text-white p-3 md:p-5 rounded-xl md:rounded-[1.5rem] shadow-4xl min-h-0 flex flex-col select-none border border-white/5 transition-all">
      
      {/* 1. QUESTION HEADER (Max Density) */}
      <div className="space-y-1 mb-2 md:mb-3">
         <div className="space-y-0.5 md:space-y-1">
            {(isEn || isBi) && englishQ && (
              <div className="font-[700] text-[14px] md:text-[16px] leading-snug tracking-tight text-white antialiased">
                <MathText text={englishQ} />
              </div>
            )}
            {(isPa || isBi) && punjabiQ && (
              <div className="font-[700] text-[14px] md:text-[16px] leading-snug tracking-tight text-slate-300 antialiased">
                <MathText text={punjabiQ} />
              </div>
            )}
         </div>
      </div>

      {/* 2. OPTION MATRIX (Tight White Boxes) */}
      {!hideOptions && (
        <div className="flex flex-col space-y-1.5 md:space-y-2">
          {['A', 'B', 'C', 'D'].map((key, idx) => {
            const en = q[`option${key}English`] || q[`option_${key.toLowerCase()}_english`];
            const pa = q[`option${key}Punjabi`] || q[`option_${key.toLowerCase()}_punjabi`];
            const isSelected = selectedAnswer === idx;
            const isCorrect = q.correctAnswer === key;

            if (!en && !pa) return null;

            const boxClasses = cn(
              "flex items-center gap-2.5 p-1.5 md:p-2 rounded-lg cursor-pointer transition-all border-2",
              showSolution 
                ? isCorrect ? "bg-emerald-50 border-emerald-500" 
                  : isSelected ? "bg-rose-50 border-rose-500"
                  : "bg-white border-transparent"
                : isSelected ? "bg-white border-[#F97316] shadow-md" 
                  : "bg-white border-transparent hover:bg-slate-50"
            );

            return (
              <div 
                key={key} 
                onClick={() => onSelect?.(idx)}
                className={boxClasses}
              >
                <span className={cn(
                  "font-[900] text-[12px] md:text-[14px] shrink-0",
                  showSolution ? (isCorrect ? "text-emerald-600" : isSelected ? "text-rose-600" : "text-[#0F172A]")
                  : (isSelected ? "text-[#F97316]" : "text-[#0F172A]")
                )}>
                  ({key})
                </span>
                <div className={cn(
                  "font-[700] text-[12px] md:text-[13px] leading-tight",
                  showSolution ? (isCorrect ? "text-emerald-800" : isSelected ? "text-rose-800" : "text-[#0F172A]")
                  : "text-[#0F172A]"
                )}>
                  <MathText text={`${en}${pa ? ` / ${pa}` : ''}`} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 3. CORRECT ANSWER & RATIONALE (Institutional Style) */}
      {showSolution && (
        <div className="mt-3 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-4 border-t border-white/10">
           <div className="font-[900] text-[9px] md:text-[10px] text-emerald-400 bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-500/30 inline-block uppercase tracking-wider shadow-lg">
              VERIFIED KEY: ({q.correctAnswer || '?'}) {q[`option${q.correctAnswer}English`]?.toUpperCase()}
           </div>

           <div className="space-y-4">
              {(englishExp || isBi) && (
                <div className="flex gap-3 items-start text-left">
                   <div className="h-2 w-2 rounded-full border-2 border-primary shrink-0 mt-1 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                   <div className="flex flex-col gap-0.5 flex-1">
                      <span className="text-white font-[900] uppercase tracking-[0.1em] text-[9px] md:text-[10px]">RATIONALE (EN):</span>
                      <div className="font-[700] text-[12px] md:text-[13px] leading-relaxed text-slate-300 antialiased">
                         <MathText text={englishExp || "Registry node audit logic..."} />
                      </div>
                   </div>
                </div>
              )}

              {(punjabiExp || isBi) && (
                <div className="flex gap-3 items-start text-left">
                   <div className="h-2 w-2 rounded-full border-2 border-primary shrink-0 mt-1 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                   <div className="flex flex-col gap-0.5 flex-1">
                      <span className="text-white font-[900] uppercase tracking-wide text-[9px] md:text-[10px]">ਤੱਰਕ (PA):</span>
                      <div className="font-[700] text-[12px] md:text-[13px] leading-relaxed text-slate-300 antialiased">
                         <MathText text={punjabiExp || "ਵਿਆਖਿਆ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।"} />
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
