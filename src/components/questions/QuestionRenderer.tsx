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
 * @fileOverview Institutional High-Fidelity Question Renderer v32.0.
 * Rules Enforcement:
 * 1. STRICT SEGREGATION: "EN" mode shows 0 Punjabi, "PA" mode shows 0 English.
 * 2. NO REDUNDANT PREFIXES: Strips "Q1." or "ਪ੍ਰਸ਼ਨ 1." from statements.
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
      .replace(/^Q\d+[\.\):\s-]*/i, '')      
      .replace(/^ਪ੍ਰਸ਼ਨ\s*\d+[\.\):\s-]*/, '') 
      .replace(/^ਪ੍ਰਸ਼ਨ\s*\d+[\.\):\s-]*/, '')
      .replace(/^\d+[\.\):\s-]*/, '')        
      .trim();
  };

  const subjectId = (question.subjectId || "").toLowerCase();
  const isEnglishSubject = subjectId.includes('english');
  const isPunjabiSubject = subjectId.includes('punjabi');

  const qEn = cleanText(question.questionEn);
  const qPa = cleanText(question.questionPa);
  
  const expEn = question.explanationEn || (question as any).explanation || "";
  const expPa = question.explanationPa || "";

  // Content Selection Logic
  const getContent = () => {
    if (isEnglishSubject) return { en: qEn, pa: "" };
    if (isPunjabiSubject) return { en: "", pa: qPa || qEn };

    if (language === 'en') return { en: qEn, pa: "" };
    if (language === 'pa') return { en: "", pa: qPa || qEn };
    
    return { en: qEn, pa: qPa };
  };

  const content = getContent();

  return (
    <div className="w-full text-left font-body space-y-6">
      {question.imageUrl && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 shadow-inner overflow-hidden max-w-md">
           <img src={question.imageUrl} alt="Asset" className="max-h-[120px] rounded-xl mx-auto object-contain" />
        </div>
      )}

      {/* Question Hub */}
      <div className="text-[15px] md:text-[18px] font-black leading-snug text-[#0F172A] antialiased">
        {content.en}
        {content.en && content.pa && <span className="text-primary/40 mx-2">/</span>}
        {content.pa}
      </div>

      {/* Options Hub */}
      {!hideOptions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['A', 'B', 'C', 'D'].map(key => {
            const en = cleanText((question as any)[`option${key}En`]);
            const pa = cleanText((question as any)[`option${key}Pa`]);
            
            const showEn = isEnglishSubject || language === 'en' || language === 'bilingual';
            const showPa = isPunjabiSubject || language === 'pa' || language === 'bilingual';

            return (
                <div key={key} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center font-black text-[10px] text-primary shrink-0 border border-slate-100">
                     {key}
                  </div>
                  <div className="text-[14px] md:text-[16px] font-bold text-slate-700 leading-snug">
                      {showEn && en}
                      {showEn && showPa && pa && <span className="text-primary/40 mx-1.5">/</span>}
                      {showPa && (pa || (!showEn && en))}
                  </div>
                </div>
            )
          })}
        </div>
      )}

      {showSolution && (
        <div className="mt-10 p-8 bg-emerald-50/40 rounded-[2.5rem] border border-emerald-100 space-y-8 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                 <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="text-left">
                 <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Audit Solution Hub</p>
                 <h4 className="text-xl text-[#0F172A] font-black uppercase">Option {question.correctAnswer}</h4>
              </div>
           </div>
           
           <div className="space-y-10 pt-8 border-t border-emerald-100">
              {content.en && expEn && (
                <div className="space-y-4">
                   <p className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-600/60">English Logic Hub</p>
                   <p className="text-[14px] md:text-[15px] text-slate-700 font-medium leading-relaxed italic whitespace-pre-wrap">{expEn}</p>
                </div>
              )}
              
              {content.pa && expPa && (
                <div className="space-y-4 pt-10 border-t border-emerald-100/30">
                   <p className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-600/60">ਪੰਜਾਬੀ ਵਿਆਖਿਆ (Punjabi Rationale)</p>
                   <p className="text-[14px] md:text-[15px] text-slate-700 font-medium leading-relaxed italic whitespace-pre-wrap">{expPa}</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
