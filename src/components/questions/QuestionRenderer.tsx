
'use client';

import React from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import MathText from './MathText';
import { CheckCircle2 } from 'lucide-react';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
  hideOptions?: boolean;
}

/**
 * @fileOverview Institutional CBT Renderer v35.0.
 * Rules:
 * 1. STRICT LANGUAGE SEGREGATION: PA mode shows ZERO English.
 * 2. COMPACT UI: Reduced padding and margins for exam-style density.
 * 3. EXPLICIT FIELDS: Calls specific EN/PA fields directly.
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

  return (
    <div className="w-full text-left font-body space-y-0 text-black bg-transparent max-w-4xl mx-auto">
      {/* 1. Question Statement */}
      <div className="space-y-4">
         {(isEn || isBi) && (
            <div className="text-[18px] md:text-[21px] font-black leading-[1.6] antialiased text-[#000000] tracking-wide">
               <MathText text={question.englishQuestion || ""} />
            </div>
         )}
         {(isPa || isBi) && (
            <div className={cn(
               "text-[18px] md:text-[21px] font-black leading-[1.6] antialiased text-[#000000] tracking-wide",
               isBi && "pt-2 border-t border-slate-50 mt-2"
            )}>
               <MathText text={question.punjabiQuestion || ""} />
            </div>
         )}
      </div>

      <div className="h-8" />

      {/* 2. Options Hub - Compact Grid */}
      {!hideOptions && (
        <div className="flex flex-col space-y-3">
          {['A', 'B', 'C', 'D'].map(key => {
            const en = (question as any)[`option${key}English`];
            const pa = (question as any)[`option${key}Punjabi`];

            return (
              <div key={key} className="text-[16px] md:text-[19px] font-black text-[#000000] flex gap-4 leading-normal items-start group tracking-wide">
                <span className="shrink-0 font-black px-2 py-0.5 bg-slate-50 rounded border border-slate-200 group-hover:border-primary/40 transition-colors">({key})</span>
                <div className="flex-1 pt-0.5">
                   {isEn && <MathText text={en || ""} />}
                   {isPa && <MathText text={pa || ""} />}
                   {isBi && (
                      <div className="flex flex-wrap items-baseline gap-2">
                         <MathText text={en || ""} className="inline" />
                         <span className="text-primary/30 mx-1">/</span>
                         <MathText text={pa || ""} className="inline" />
                      </div>
                   )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 3. Solution Hub - Only shown post-submission */}
      {showSolution && (
        <div className="mt-12 space-y-10">
           {/* Correct Answer Registry */}
           <div className="bg-slate-50 border-y-2 border-slate-100 p-8 rounded-3xl text-left">
              <div className="space-y-4">
                 {(isEn || isBi) && (
                    <div className="space-y-1">
                       <p className="text-emerald-600 uppercase tracking-tighter text-[11px] font-black">Correct Answer:</p>
                       <p className="text-[#000000] font-black text-xl">({question.correctAnswer}) {(question as any)[`option${question.correctAnswer}English`]}</p>
                    </div>
                 )}
                 {(isPa || isBi) && (
                    <div className={cn("space-y-1", isBi && "pt-4 border-t border-slate-200/50")}>
                       <p className="text-emerald-600 uppercase tracking-tighter text-[11px] font-black">ਸਹੀ ਉੱਤਰ:</p>
                       <p className="text-[#000000] font-black text-xl">{(question as any)[`option${question.correctAnswer}Punjabi`]}</p>
                    </div>
                 )}
              </div>
           </div>

           {/* Logic Archives */}
           <div className="bg-[#121212] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                 <CheckCircle2 className="h-40 w-40" />
              </div>

              <div className="relative z-10 space-y-12">
                 {(isEn || isBi) && (
                    <div className="space-y-6">
                       <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-6 py-1.5 rounded-full border border-primary/20">
                          • English Explanation
                       </span>
                       <div className="text-[17px] md:text-[20px] text-slate-100 leading-[2.2] px-2 font-bold">
                          <MathText text={question.englishExplanation || ""} />
                       </div>
                    </div>
                 )}

                 {(isPa || isBi) && (
                    <div className={cn("space-y-6", isBi && "pt-12 border-t border-white/5")}>
                       <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 bg-emerald-500/10 px-6 py-1.5 rounded-full border border-emerald-500/20">
                          • ਪੰਜਾਬੀ ਵਿਆਖਿਆ
                       </span>
                       <div className="text-[17px] md:text-[20px] text-slate-100 leading-[2.2] px-2 font-bold">
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
