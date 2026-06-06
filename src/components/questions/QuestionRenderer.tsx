
'use client';

import React from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import MathText from './MathText';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
  hideOptions?: boolean;
}

/**
 * @fileOverview Institutional High-Fidelity Renderer v8.0.
 * Strictly enforces Testbook/PSSSB visual rules: 22px typography, 
 * auto-expanding containers, and precision line-break spacing.
 */
export default function QuestionRenderer({ 
  question, 
  showSolution = false,
  hideOptions = false 
}: QuestionRendererProps) {
  
  return (
    <div className="w-full text-left font-body space-y-0 text-[#0F172A] bg-transparent">
      {/* 1. English Question Statement */}
      <div className="text-[20px] md:text-[22px] font-black leading-relaxed antialiased">
         {question.displayId && <span className="mr-2 text-primary">Q{question.displayId}.</span>}
         <MathText text={question.questionEn || ""} className="inline" />
      </div>

      <div className="h-4" />

      {/* 2. Punjabi Question Statement */}
      {question.questionPa && (
        <div className="text-[20px] md:text-[22px] font-black leading-relaxed antialiased text-slate-800">
           <MathText text={question.questionPa} />
        </div>
      )}

      <div className="h-8" />

      {/* 3. Options List - CLEAN LINE FORMAT */}
      {!hideOptions && (
        <div className="space-y-4">
          {['A', 'B', 'C', 'D'].map(key => {
            const content = (question as any)[`option${key}En`];
            if (!content) return null;

            return (
              <div key={key} className="text-[19px] md:text-[22px] font-bold text-[#0F172A] flex gap-3 leading-snug">
                <span className="shrink-0 font-black">({key})</span>
                <MathText text={content} className="inline" />
              </div>
            )
          })}
        </div>
      )}

      <div className="h-8" />

      {/* 4. Correct Answer Indicator */}
      <div className="text-[20px] md:text-[22px] font-black text-[#0F172A] border-y border-slate-100 py-6 mb-8 bg-slate-50/30 px-2 rounded-lg">
         <p className="flex flex-wrap items-center gap-3">
           <span className="text-emerald-600 uppercase tracking-tight">Correct Answer:</span>
           <span className="uppercase">({question.correctAnswer}) {(question as any)[`option${question.correctAnswer}En`]}</span>
         </p>
      </div>

      {/* 5. Solution Hub - AUTO-EXPANDING HEIGHT */}
      {showSolution && (
        <div className="bg-[#121212] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-14 text-white shadow-4xl border border-white/5 h-auto min-h-0 overflow-visible">
           <div className="space-y-0 h-auto">
              
              {/* English Explanation */}
              {question.explanationEn && (
                <div className="space-y-6 h-auto">
                   <div className="flex items-center gap-3">
                      <span className="text-[16px] md:text-[18px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                        • English Explanation:
                      </span>
                   </div>
                   <div className="text-[19px] md:text-[22px] text-slate-100 font-bold leading-relaxed antialiased whitespace-pre-wrap break-words h-auto">
                      <MathText text={question.explanationEn} />
                   </div>
                </div>
              )}

              {question.explanationEn && question.explanationPa && <div className="h-12 border-b border-white/5 mb-12" />}

              {/* Punjabi Explanation */}
              {question.explanationPa && (
                <div className="space-y-6 h-auto">
                   <div className="flex items-center gap-3">
                      <span className="text-[16px] md:text-[18px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                        • ਪੰਜਾਬੀ ਵਿਆਖਿਆ:
                      </span>
                   </div>
                   <div className="text-[19px] md:text-[22px] text-slate-100 font-bold leading-relaxed antialiased whitespace-pre-wrap break-words h-auto">
                      <MathText text={question.explanationPa} />
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
