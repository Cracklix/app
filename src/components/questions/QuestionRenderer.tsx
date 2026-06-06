'use client';

import React from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import MathText from './MathText';
import { CheckCircle2, Bookmark, Info, AlertTriangle } from 'lucide-react';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'hi' | 'bi';
  showSolution?: boolean;
  hideOptions?: boolean;
}

/**
 * @fileOverview Institutional Uniform Typography Question Engine v75.0.
 * Rule: Identical typography (#111111, 700 weight) across all modes.
 * Spacing: 12px gap between bilingual statements, 24px leading into options.
 */
export default function QuestionRenderer({ 
  question, 
  language = 'bi',
  showSolution = false,
  hideOptions = false 
}: QuestionRendererProps) {
  
  const isEn = language === 'en';
  const isPa = language === 'pa';
  const isBi = language === 'bi';

  // Responsive font sizes for high-density reading (Fixed Scale)
  const typographyClass = "font-[700] leading-[1.6] antialiased tracking-normal text-[#111111] text-[20px] md:text-[24px] lg:text-[30px] xl:text-[36px]";

  return (
    <div className="w-full text-left font-body bg-transparent h-auto min-h-0 flex flex-col">
      
      {/* 1. TOP METADATA ROW */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-black text-sm">
               {question.displayId || '1'}
            </div>
            <div className="flex items-center gap-2">
               <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[9px] uppercase px-2">+1.0</Badge>
               <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-black text-[9px] uppercase px-2">-0.25</Badge>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="text-slate-400 hover:text-primary transition-colors"><Bookmark className="h-5 w-5" /></button>
            <button className="text-slate-400 hover:text-rose-500 transition-colors"><AlertTriangle className="h-5 w-5" /></button>
         </div>
      </div>

      {/* 2. CORE QUESTION STATEMENT */}
      <div className="flex flex-col gap-[12px] flex-1">
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

      {/* 24px vertical leading before options */}
      <div className="h-[24px] shrink-0" />

      {/* 3. OPTION HUB */}
      {!hideOptions && (
        <div className="flex flex-col space-y-2.5 mt-auto">
          {['A', 'B', 'C', 'D'].map(key => {
            const en = (question as any)[`option${key}English`];
            const pa = (question as any)[`option${key}Punjabi`];

            return (
              <div key={key} className="flex gap-4 items-center group p-3.5 min-h-[64px] rounded-[12px] border-2 border-slate-100 hover:border-primary/20 transition-all bg-white shadow-sm cursor-pointer">
                <span className="shrink-0 font-black px-2 py-0.5 bg-[#0F172A] text-white rounded-md text-[10px]">({key})</span>
                <div className="flex-1 py-0.5 overflow-hidden">
                   <div className="flex flex-col gap-[4px]">
                      {(isEn || isBi) && <p className="font-[600] text-[20px] text-[#111111] leading-tight">{en}</p>}
                      {(isPa || isBi) && <p className="font-[600] text-[20px] text-[#111111] leading-tight">{pa || en}</p>}
                   </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4. SOLUTION HUB */}
      {showSolution && (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
           <div className="bg-emerald-50 border-2 border-emerald-100 p-5 rounded-xl flex items-center gap-4">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              <div className="text-left">
                 <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Correct Answer</p>
                 <h4 className="text-xl font-black text-emerald-900 uppercase">Option {question.correctAnswer}</h4>
              </div>
           </div>
           <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="font-[500] text-[18px] text-[#111111] leading-relaxed">
                 {(isEn || isBi) && <MathText text={question.englishExplanation || ""} />}
                 {isBi && <div className="h-6" />}
                 {(isPa || isBi) && <MathText text={question.punjabiExplanation || ""} />}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function Badge({ children, className }: any) {
  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] border font-black", className)}>
      {children}
    </span>
  );
}
