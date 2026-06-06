
'use client';

import React, { useMemo } from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
  hideOptions?: boolean;
}

/**
 * @fileOverview High-Fidelity Question Renderer v15.0.
 * Optimized: Recalibrated font sizes for mobile-friendliness and high-density solution boxes.
 */

export default function QuestionRenderer({ 
  question, 
  language, 
  showSolution = false,
  hideOptions = false 
}: QuestionRendererProps) {
  
  // Utility to clean text artifacts (A., 1., **, etc)
  const cleanText = (text: string = "") => {
    return text
      .replace(/^[A-D][\.\):\s-]*/i, '') // Remove A., B) etc
      .replace(/^\d+[\.\):\s-]*/, '')    // Remove leading numbers
      .replace(/^\*\*|\*\*$/g, '')       // Remove bold markers
      .replace(/\*\*/g, '')              // Remove all stars
      .trim();
  };

  const renderContent = (en: string = "", pa: string = "") => {
    const cEn = cleanText(en);
    const cPa = cleanText(pa);

    if (language === 'en') return cEn;
    if (language === 'pa') return cPa || cEn; // Fallback to EN if PA is missing
    return `${cEn}${cPa ? ` / ${cPa}` : ''}`;
  };

  const expEn = useMemo(() => question.explanationEn || (question as any).explanation || "", [question]);
  const expPa = useMemo(() => question.explanationPa || "", [question]);

  return (
    <div className="w-full text-left font-body">
      {question.imageUrl && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 mb-3 shadow-inner overflow-hidden">
           <img src={question.imageUrl} alt="Audit Asset" className="max-h-[160px] rounded-lg mx-auto object-contain" />
        </div>
      )}

      {/* Question Statement - Mobile Optimized Scaling */}
      <div className="text-[15px] md:text-[17px] font-black leading-tight text-black whitespace-pre-wrap antialiased mb-4">
        {renderContent(question.questionEn, question.questionPa)}
      </div>

      {/* Options Hub - Compact Scaling */}
      {!hideOptions && (
        <div className="space-y-2 mb-4">
          {['A', 'B', 'C', 'D'].map(key => {
            const en = (question as any)[`option${key}En`] || "";
            const pa = (question as any)[`option${key}Pa`] || "";
            const optionText = renderContent(en, pa);
            
            if (!optionText) return null;
            
            return (
                <div key={key} className="flex items-start gap-3">
                  <span className="font-black text-[13px] md:text-sm text-primary min-w-[20px]">{key})</span>
                  <p className="text-[13px] md:text-base font-bold text-slate-800 leading-snug">
                      {optionText}
                  </p>
                </div>
            )
          })}
        </div>
      )}

      {showSolution && (
        <div className="mt-4 p-4 md:p-6 bg-emerald-50/50 rounded-xl md:rounded-2xl border border-emerald-100 space-y-3 shadow-sm">
           <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md"><CheckCircle2 className="h-3.5 w-3.5" /></div>
              <h4 className="text-[12px] md:text-sm text-[#0F172A] font-black uppercase tracking-tight">Verified Audit Key: {question.correctAnswer}</h4>
           </div>
           
           <div className="space-y-3 pt-3 border-t border-emerald-200/20">
              <div className="space-y-1.5">
                 <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest ml-0.5">Logic / ਵਿਆਖਿਆ</p>
                 <div className="text-[13px] md:text-base text-slate-800 leading-relaxed font-semibold bg-white/80 p-4 rounded-xl whitespace-pre-wrap border border-emerald-100/30 shadow-inner">
                    {renderContent(expEn, expPa)}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
