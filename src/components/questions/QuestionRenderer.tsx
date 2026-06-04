'use client';

import React from 'react';
import { Question } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, Info, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuestionRendererProps {
  question: Partial<Question>;
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
}

/**
 * @fileOverview Institutional Ultimate Question Renderer.
 * optimized for High-Density Bilingual rendering and Parent-Child DI logic.
 */

export default function QuestionRenderer({ question, language, showSolution = false }: QuestionRendererProps) {
  const showEn = language === 'en' || language === 'bilingual';
  const showPa = language === 'pa' || language === 'bilingual';
  
  // Validation Warning
  const isMissingPa = !question.questionPa || question.questionPa === question.questionEn;

  return (
    <div className="w-full text-left font-body animate-in fade-in duration-300">
      
      {/* 1. Institutional Context Node (Parent DI/Passage) */}
      {(question.passageEn || question.passagePa || question.imageUrl || question.tableData) && (
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-8 mb-6 shadow-inner space-y-6">
           <div className="flex items-center gap-3 mb-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Context Node / Reference</span>
           </div>

           {/* Image Render */}
           {question.imageUrl && (
             <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl flex items-center justify-center min-h-[250px]">
                <img 
                  src={question.imageUrl} 
                  alt="DI Diagram" 
                  className="max-w-full max-h-[600px] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Diagram+Load+Failed';
                  }}
                />
             </div>
           )}

           {/* Table Render */}
           {question.tableData && (
             <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <Table>
                  <TableHeader className="bg-slate-100">
                    <TableRow className="h-10">
                      {question.tableData.headers?.map((header: string, i: number) => (
                        <TableHead key={i} className="text-center font-black uppercase text-[11px] text-[#0F172A] px-4">{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {question.tableData.rows?.map((row: any[], i: number) => (
                      <TableRow key={i} className="h-10 hover:bg-slate-50 transition-colors">
                        {row.map((cell, j) => (
                          <TableCell key={j} className="text-center font-bold text-[#0F172A] border-r border-slate-100 last:border-0 py-2 text-[13px]">{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </div>
           )}

           {/* Passage Text */}
           {(question.passageEn || question.passagePa) && (
             <div className="space-y-4">
                {showEn && question.passageEn && (
                  <div className="text-[15px] leading-relaxed text-black font-medium whitespace-pre-wrap">
                    {question.passageEn}
                  </div>
                )}
                {showPa && question.passagePa && (
                  <div className="text-[15px] leading-relaxed text-black font-medium whitespace-pre-wrap border-t border-slate-100 pt-4">
                    {question.passagePa}
                  </div>
                )}
             </div>
           )}
        </div>
      )}

      {/* 2. Language Gated Question Statement */}
      <div className="space-y-4 mb-8">
        {showEn && question.questionEn && (
           <div className="text-[17px] md:text-[20px] font-black leading-snug text-black tracking-tight whitespace-pre-wrap">
              {question.questionEn}
           </div>
        )}
        
        {showPa && question.questionPa && (
           <div className={cn(
             "text-[17px] md:text-[20px] font-black leading-snug text-black tracking-tight whitespace-pre-wrap",
             language === 'bilingual' ? "pt-2 border-t border-slate-100" : ""
           )}>
              {question.questionPa}
           </div>
        )}

        {/* Translation Audit Badge (Admin View) */}
        {language === 'pa' && isMissingPa && (
          <Badge variant="destructive" className="bg-rose-50 text-rose-600 border-rose-100 text-[9px] font-black uppercase">
            <AlertTriangle className="h-3 w-3 mr-1" /> Punjabi Translation Missing
          </Badge>
        )}
      </div>

      {/* 3. Solution Review Hub */}
      {showSolution && (
        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-4 shadow-sm animate-in slide-in-from-bottom-2">
           <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <h4 className="text-[15px] text-[#0F172A] font-black uppercase">Verified Audit Key: Option {question.correctAnswer}</h4>
           </div>
           <div className="pt-4 border-t border-emerald-100/60 space-y-4">
              {showEn && question.explanationEn && (
                <div className="text-[14px] text-slate-700 leading-relaxed font-bold whitespace-pre-wrap">
                  {question.explanationEn}
                </div>
              )}
              {showPa && question.explanationPa && (
                <div className="text-[14px] text-slate-700 leading-relaxed font-bold whitespace-pre-wrap border-t border-emerald-100/30 pt-4">
                  {question.explanationPa}
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
