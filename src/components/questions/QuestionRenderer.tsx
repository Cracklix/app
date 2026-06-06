
'use client';

import React, { useMemo } from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
}

/**
 * @fileOverview High-Fidelity Question Renderer v10.0.
 * Optimized: Reduced font sizes and margins for high-density viewport support.
 */

export default function QuestionRenderer({ question, language, showSolution = false }: QuestionRendererProps) {
  const showEn = language === 'en' || language === 'bilingual';
  const showPa = language === 'pa' || language === 'bilingual';
  
  const expEn = useMemo(() => question.explanationEn || (question as any).explanation || "", [question]);
  const expPa = useMemo(() => question.explanationPa || "", [question]);

  // Utility to clean text artifacts
  const cleanText = (text: string = "") => {
    return text
      .replace(/^\d+[\.\):\s-]*/, '') // Remove leading numbers (1. or 1))
      .replace(/^\*\*|\*\*$/g, '')    // Remove bold markers
      .trim();
  };

  return (
    <div className="w-full text-left font-body">
      {question.imageUrl && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 shadow-inner overflow-hidden">
           <img src={question.imageUrl} alt="Audit Asset" className="max-h-[300px] rounded-lg mx-auto object-contain" />
        </div>
      )}

      {/* Question Statements - High Contrast Black */}
      <div className="space-y-2 mb-4">
        {showEn && question.questionEn && (
           <div className="text-[17px] md:text-[20px] font-black leading-snug text-black whitespace-pre-wrap antialiased">
              {cleanText(question.questionEn)}
           </div>
        )}
        {showPa && question.questionPa && (
           <div className={cn(
              "text-[17px] md:text-[20px] font-black leading-snug text-black whitespace-pre-wrap antialiased",
              showEn ? "pt-2 border-t border-slate-50 mt-2" : ""
           )}>
              {cleanText(question.questionPa)}
           </div>
        )}
      </div>

      {showSolution && (
        <div className="mt-6 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-4 shadow-lg">
           <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg"><CheckCircle2 className="h-4 w-4" /></div>
              <h4 className="text-sm text-[#0F172A] font-black uppercase tracking-tight">Verified Key: {question.correctAnswer}</h4>
           </div>
           
           <div className="space-y-4 pt-4 border-t border-emerald-200/30">
              {showEn && expEn && (
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Rationale (EN)</p>
                   <div className="text-sm text-slate-800 leading-relaxed font-bold bg-white/60 p-4 rounded-xl whitespace-pre-wrap border border-emerald-100/50">{cleanText(expEn)}</div>
                </div>
              )}
              {showPa && expPa && (
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">ਵਿਆਖਿਆ (PA)</p>
                   <div className="text-sm text-slate-800 leading-relaxed font-bold bg-white/60 p-4 rounded-xl whitespace-pre-wrap border border-emerald-100/50">{cleanText(expPa)}</div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
