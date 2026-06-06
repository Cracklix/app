'use client';

import React, { useMemo } from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, Languages } from 'lucide-react';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
  hideOptions?: boolean;
}

/**
 * @fileOverview Institutional High-Fidelity Question Renderer v18.0.
 * Optimized for: Neat and clean bilingual spacing and redundant marker removal.
 */

export default function QuestionRenderer({ 
  question, 
  language, 
  showSolution = false,
  hideOptions = false 
}: QuestionRendererProps) {
  
  const cleanText = (text: string = "") => {
    if (!text) return "";
    return text
      .replace(/^[A-D][\.\):\s-]*/i, '') // Remove A) or B.
      .replace(/^\d+[\.\):\s-]*/, '')     // Remove 1. or 24)
      .replace(/^\*\*|\*\*$/g, '')       // Remove leading/trailing bold
      .replace(/\*\*/g, '')              // Remove internal bold
      .trim();
  };

  const renderContent = (en: string = "", pa: string = "") => {
    const cEn = cleanText(en);
    const cPa = cleanText(pa);

    if (language === 'en') return cEn;
    if (language === 'pa') return cPa || cEn;
    return (
      <div className="flex flex-wrap items-center gap-x-2">
        <span>{cEn}</span>
        {cPa && cPa !== cEn && (
          <>
            <span className="text-slate-300 font-light">/</span>
            <span className="text-[#0B1528]">{cPa}</span>
          </>
        )}
      </div>
    );
  };

  const expEn = useMemo(() => question.explanationEn || (question as any).explanation || "", [question]);
  const expPa = useMemo(() => question.explanationPa || "", [question]);

  return (
    <div className="w-full text-left font-body space-y-4 md:space-y-6">
      {question.imageUrl && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-inner overflow-hidden">
           <img src={question.imageUrl} alt="Asset" className="max-h-[180px] rounded-xl mx-auto object-contain" />
        </div>
      )}

      {/* Question Statement - Neat Bilingual Rendering */}
      <div className="text-[15px] md:text-[17px] font-black leading-tight text-[#0F172A] antialiased">
        {renderContent(question.questionEn, question.questionPa)}
      </div>

      {/* Options Hub */}
      {!hideOptions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
          {['A', 'B', 'C', 'D'].map(key => {
            const en = (question as any)[`option${key}En`] || "";
            const pa = (question as any)[`option${key}Pa`] || "";
            
            if (!en && !pa) return null;
            
            return (
                <div key={key} className="flex items-center gap-3 p-3 md:p-4 bg-white border border-slate-100 rounded-xl md:rounded-2xl shadow-sm">
                  <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-slate-50 flex items-center justify-center font-black text-[10px] md:text-xs text-primary shrink-0 border border-slate-100">
                     {key}
                  </div>
                  <div className="text-[13px] md:text-[15px] font-bold text-slate-700 leading-snug">
                      {renderContent(en, pa)}
                  </div>
                </div>
            )
          })}
        </div>
      )}

      {showSolution && (
        <div className="mt-6 p-5 md:p-8 bg-emerald-50/40 rounded-2xl md:rounded-[2.5rem] border border-emerald-100 space-y-4 md:space-y-6 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5"><CheckCircle2 className="h-32 w-32" /></div>
           
           <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                   <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="text-left">
                   <p className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Verified Audit Key</p>
                   <h4 className="text-base md:text-lg text-[#0F172A] font-black uppercase">Option {question.correctAnswer}</h4>
                </div>
              </div>
              <Badge className="bg-emerald-600/10 text-emerald-700 border-none text-[8px] font-black uppercase px-2 py-0.5">Logic Node</Badge>
           </div>
           
           {/* Neat and Clean Explanation Spacing */}
           <div className="space-y-4 pt-4 md:pt-6 border-t border-emerald-200/30 relative z-10">
              {language === 'bilingual' ? (
                <div className="space-y-6">
                  {expEn && (
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 opacity-40">
                          <Languages className="h-3 w-3" />
                          <span className="text-[7px] font-black uppercase tracking-widest text-[#0B1528]">English Rationale</span>
                       </div>
                       <p className="text-[13px] md:text-[15px] text-slate-700 font-medium leading-relaxed bg-white/40 p-4 rounded-xl shadow-inner border border-white/20 italic">
                          {cleanText(expEn)}
                       </p>
                    </div>
                  )}
                  {expPa && (
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 opacity-40">
                          <Languages className="h-3 w-3" />
                          <span className="text-[7px] font-black uppercase tracking-widest text-[#0B1528]">ਪੰਜਾਬੀ ਵਿਆਖਿਆ</span>
                       </div>
                       <p className="text-[13px] md:text-[15px] text-slate-700 font-medium leading-relaxed bg-white/40 p-4 rounded-xl shadow-inner border border-white/20 italic">
                          {cleanText(expPa)}
                       </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[13px] md:text-[15px] text-slate-700 font-medium leading-relaxed bg-white/40 p-4 rounded-xl shadow-inner border border-white/20 italic">
                   {cleanText(language === 'en' ? expEn : (expPa || expEn))}
                </p>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
