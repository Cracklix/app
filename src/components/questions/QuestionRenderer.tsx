
'use client';

import React from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import MathText from './MathText';
import { CheckCircle2, Zap } from 'lucide-react';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
  hideOptions?: boolean;
}

/**
 * @fileOverview Institutional Uniform Typography Question Engine v60.0.
 * Redesign: Strictly identical styling across EN, PA, and BI modes.
 * Typography: #111111 color, 700 weight questions, 600 weight options.
 */
export default function QuestionRenderer({ 
  question, 
  language = 'bilingual',
  showSolution = false,
  hideOptions = false 
}: QuestionRendererProps) {
  
  const isEn = language === 'en';
  const isPa = language === 'pa';
  const isBi = language === 'bilingual';

  // Uniform Typography Standard
  // Desktop 36px, Laptop 30px, Tablet 24px, Mobile 20px
  const typographyClass = "text-[20px] md:text-[24px] lg:text-[30px] xl:text-[36px] font-[700] leading-[1.6] antialiased tracking-normal text-[#111111]";

  return (
    <div className="w-full text-left font-body bg-transparent h-auto min-h-0">
      
      {/* 1. CORE QUESTION STATEMENT - UNIFORM TYPOGRAPHY */}
      <div className="space-y-[12px]">
         {/* EN Mode or BI Mode */}
         {(isEn || isBi) && (
            <div className={typographyClass}>
               <MathText text={question.englishQuestion || ""} />
            </div>
         )}
         
         {/* PA Mode or BI Mode */}
         {(isPa || isBi) && (
            <div className={typographyClass}>
               <MathText text={question.punjabiQuestion || ""} />
            </div>
         )}
      </div>

      {/* 24px Gap before options */}
      <div className="h-[24px]" />

      {/* 2. OPTION HUB - UNIFORM STYLING */}
      {!hideOptions && (
        <div className="flex flex-col space-y-4">
          {['A', 'B', 'C', 'D'].map(key => {
            const en = (question as any)[`option${key}English`];
            const pa = (question as any)[`option${key}Punjabi`];

            return (
              <div key={key} className="flex gap-4 items-center group p-6 h-auto min-h-[72px] md:min-h-[88px] rounded-[16px] border-2 border-slate-100 hover:border-primary/20 transition-all bg-white shadow-sm">
                <span className="shrink-0 font-black px-4 py-1 bg-[#0F172A] text-white rounded-xl text-xs md:text-lg">({key})</span>
                <div className="flex-1 py-1 overflow-hidden space-y-2">
                   {isEn && <p className="font-[600] text-[18px] md:text-[20px] text-[#111111] leading-tight">{en}</p>}
                   {isPa && <p className="font-[600] text-[18px] md:text-[20px] text-[#111111] leading-tight">{pa || en}</p>}
                   {isBi && (
                      <div className="flex flex-col gap-2">
                         <p className="font-[600] text-[18px] md:text-[20px] text-[#111111] leading-tight">{en}</p>
                         <p className="font-[600] text-[18px] md:text-[20px] text-[#111111] leading-tight">{pa}</p>
                      </div>
                   )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 3. SUBMIT-GATED SOLUTION HUB - UNIFORM COLOR */}
      {showSolution && (
        <div className="mt-10 space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
           
           {/* Unified Answer Key */}
           <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-6">
                 <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <CheckCircle2 className="h-8 w-8" />
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1">CBT Answer Node</p>
                    <h4 className="text-2xl md:text-3xl font-headline font-black text-emerald-900 uppercase">Option {question.correctAnswer}</h4>
                 </div>
              </div>
              <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-emerald-200 pt-6 md:pt-0 md:pl-12">
                 <div className="space-y-2">
                    <p className="font-[600] text-[#111111] text-[18px] md:text-[20px]">{(question as any)[`option${question.correctAnswer}English`]}</p>
                    <p className="font-[600] text-[#111111] text-[18px] md:text-[20px]">{(question as any)[`option${question.correctAnswer}Punjabi`]}</p>
                 </div>
              </div>
           </div>

           {/* Strategic Rationale - Uniform Black Text */}
           <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-3xl relative overflow-hidden h-auto min-h-0">
              <div className="relative z-10 space-y-10">
                 {(isEn || isBi) && (
                    <div className="space-y-6">
                       <div className="flex items-center gap-4">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#111111]" />
                          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#111111]">English Rationale</p>
                       </div>
                       <div className="text-[18px] md:text-[22px] text-[#111111] leading-[2.2] font-medium tracking-wide">
                          <MathText text={question.englishExplanation || ""} />
                       </div>
                    </div>
                 )}

                 {(isPa || isBi) && (
                    <div className={cn("space-y-6", isBi && "pt-10 border-t border-slate-100")}>
                       <div className="flex items-center gap-4">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#111111]" />
                          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#111111]">ਪੰਜਾਬੀ ਵਿਆਖਿਆ</p>
                       </div>
                       <div className="text-[18px] md:text-[22px] text-[#111111] leading-[2.2] font-medium tracking-wide">
                          <MathText text={question.punjabiExplanation || ""} />
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
