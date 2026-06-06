'use client';

import React, { useMemo } from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
}

/**
 * @fileOverview High-Fidelity Question Renderer v9.0.
 * Strictly enforces clean text rendering based on language toggle.
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
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 shadow-inner overflow-hidden">
           <img src={question.imageUrl} alt="Audit Asset" className="max-h-[400px] rounded-xl mx-auto object-contain" />
        </div>
      )}

      {/* Question Statements - High Contrast Black */}
      <div className="space-y-4 mb-8">
        {showEn && question.questionEn && (
           <div className="text-[20px] md:text-[24px] font-black leading-tight text-black whitespace-pre-wrap antialiased">
              {cleanText(question.questionEn)}
           </div>
        )}
        {showPa && question.questionPa && (
           <div className={cn(
              "text-[20px] md:text-[24px] font-black leading-tight text-black whitespace-pre-wrap antialiased",
              showEn ? "pt-4 border-t border-slate-100 mt-4" : ""
           )}>
              {cleanText(question.questionPa)}
           </div>
        )}
      </div>

      {showSolution && (
        <div className="mt-12 p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 space-y-6 shadow-xl">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg"><CheckCircle2 className="h-5 w-5" /></div>
              <h4 className="text-[16px] text-[#0F172A] font-black uppercase tracking-tight">Verified Key: {question.correctAnswer}</h4>
           </div>
           
           <div className="space-y-6 pt-6 border-t border-emerald-200/50">
              {showEn && expEn && (
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Audit Rationale (EN)</p>
                   <div className="text-[15px] text-slate-800 leading-relaxed font-bold bg-white/60 p-6 rounded-2xl whitespace-pre-wrap border border-emerald-100/50">{cleanText(expEn)}</div>
                </div>
              )}
              {showPa && expPa && (
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ਵਿਆਖਿਆ (PA)</p>
                   <div className="text-[15px] text-slate-800 leading-relaxed font-bold bg-white/60 p-6 rounded-2xl whitespace-pre-wrap border border-emerald-100/50">{cleanText(expPa)}</div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
