'use client';

import React from 'react';
import { Question } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, LayoutGrid, ImageIcon, Map as MapIcon, BarChart3, HelpCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface QuestionRendererProps {
  question: Partial<Question>;
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
}

const COLORS = ['#F97316', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function QuestionRenderer({ question, language, showSolution = false }: QuestionRendererProps) {
  const showEn = language === 'en' || language === 'bilingual';
  const showPa = language === 'pa' || language === 'bilingual';
  
  const questionEn = question.questionEn || "";
  const questionPa = question.questionPa || "";
  
  const instructionEn = question.instructionEn || "";
  const instructionPa = question.instructionPa || "";
  
  const passageEn = question.passageEn || "";
  const passagePa = question.passagePa || "";

  const explanationEn = question.explanationEn || "";
  const explanationPa = question.explanationPa || "";

  const isAssertionReason = question.questionType === 'ASSERTION_REASON';
  const isMatching = question.questionType === 'MATCHING';

  return (
    <div className="space-y-10 w-full text-left font-body">
      {/* Context: Passage / DI Instructions */}
      {(instructionEn || instructionPa || passageEn || passagePa) && (
        <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] shadow-inner space-y-6">
           <div className="flex items-center gap-3">
              <LayoutGrid className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Context Node</span>
           </div>
           
           {(instructionEn || instructionPa) && (
             <div className="space-y-2">
                {showEn && instructionEn && <p className="text-sm font-bold text-slate-800">{instructionEn}</p>}
                {showPa && instructionPa && <p className="text-sm font-medium text-slate-600 italic">{instructionPa}</p>}
             </div>
           )}

           {(passageEn || passagePa) && (
             <div className="space-y-6 border-t border-slate-200 pt-6">
                {showEn && passageEn && <div className="text-base leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">{passageEn}</div>}
                {showPa && passagePa && <div className={cn("text-base leading-relaxed text-slate-600 whitespace-pre-wrap font-medium", showEn ? "italic border-t border-slate-100 pt-6" : "")}>{passagePa}</div>}
             </div>
           )}
        </div>
      )}

      {/* Visual Data: Images / Diagrams / Tables */}
      <div className="space-y-8">
        {question.imageUrl && (
          <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden border-2 border-slate-100 shadow-3xl bg-white group">
            <Image 
              src={question.imageUrl} 
              fill 
              alt="Diagram" 
              className="object-contain p-6 transition-transform duration-700 group-hover:scale-105" 
              unoptimized 
            />
          </div>
        )}

        {question.tableData && (
          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-2xl bg-white">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  {question.tableData.headers?.map((header: string, i: number) => (
                    <TableHead key={i} className="text-center font-black uppercase text-[10px] tracking-widest text-[#0B1528] h-14">{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {question.tableData.rows?.map((row: any[], i: number) => (
                  <TableRow key={i}>
                    {row.map((cell, j) => (
                      <TableCell key={j} className="text-center font-bold text-slate-600 border-r border-slate-50 last:border-0 py-4">{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Question Content */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
           <div className={cn("h-6 w-1 rounded-full", isAssertionReason ? "bg-rose-500" : isMatching ? "bg-blue-500" : "bg-primary")} />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Statement</span>
        </div>
        
        <div className="space-y-6">
           {showEn && questionEn && (
              <div className={cn("text-2xl md:text-3xl font-black leading-tight text-[#0B1528] tracking-tight", isAssertionReason || isMatching ? "font-headline" : "")}>
                 {questionEn}
              </div>
           )}
           {showPa && questionPa && (
              <div className={cn("text-2xl md:text-3xl font-bold leading-tight text-slate-700 tracking-tight", showEn ? "italic opacity-70 border-t border-slate-100 pt-6" : "")}>
                 {questionPa}
              </div>
           )}
        </div>
      </div>

      {/* Solution Review */}
      {showSolution && (
        <div className="mt-20 p-12 bg-emerald-50 rounded-[4rem] border border-emerald-100 space-y-10 shadow-inner">
           <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                 <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="text-left">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1">Audit Rationale</p>
                 <h4 className="font-headline font-black text-3xl text-emerald-900 uppercase">Correct Audit: Option {question.correctAnswer}</h4>
              </div>
           </div>
           <div className="space-y-8 pt-10 border-t border-emerald-100/60">
              {showEn && explanationEn && <div className="text-lg text-emerald-800 leading-relaxed font-medium whitespace-pre-wrap">{explanationEn}</div>}
              {showPa && explanationPa && <div className={cn("text-lg text-emerald-700 leading-relaxed font-medium whitespace-pre-wrap", showEn ? "italic pt-8 mt-8 border-t border-emerald-100/40" : "")}>{explanationPa}</div>}
           </div>
        </div>
      )}
    </div>
  );
}
