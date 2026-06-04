'use client';

import React from 'react';
import { Question } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
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
  Line 
} from 'recharts';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface QuestionRendererProps {
  question: Partial<Question>;
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
}

const COLORS = ['#F97316', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];

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

  return (
    <div className="space-y-8 w-full text-left font-body">
      {/* 1. Instruction Node */}
      {(instructionEn || instructionPa) && (
        <div className="bg-blue-50/50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Institutional Instruction</p>
          <div className="space-y-1">
             {showEn && instructionEn && <p className="text-sm font-bold text-blue-900 leading-tight">{instructionEn}</p>}
             {showPa && instructionPa && <p className={cn("text-sm font-medium text-blue-800 leading-tight", language === 'bilingual' ? "italic opacity-70 mt-1" : "")}>{instructionPa}</p>}
          </div>
        </div>
      )}

      {/* 2. Passage Node (Reading Comprehension / Caselet) */}
      {(passageEn || passagePa) && (
        <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] shadow-inner">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Case Context:</p>
          <div className="space-y-6">
             {showEn && passageEn && <div className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">{passageEn}</div>}
             {showPa && passagePa && <div className={cn("text-lg leading-relaxed text-slate-600 whitespace-pre-wrap font-medium", language === 'bilingual' ? "italic border-t border-slate-200 pt-6 mt-6" : "")}>{passagePa}</div>}
          </div>
        </div>
      )}

      {/* 3. Visual Visual Node */}
      {question.diagramType && question.diagramType !== 'none' && (
        <div className="w-full py-4">
          {question.diagramType === 'table' && question.tableData && (
            <Card className="border-slate-200 overflow-hidden rounded-2xl shadow-xl">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    {question.tableData.headers.map((h, i) => (
                      <TableHead key={i} className="font-black uppercase text-[10px] tracking-widest text-slate-500">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {question.tableData.rows.map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j} className="font-bold text-slate-700">{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {question.diagramType === 'image' && question.imageUrl && (
            <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden border-2 border-slate-100 shadow-2xl">
              <Image src={question.imageUrl} fill alt="Diagram" className="object-contain bg-white" />
            </div>
          )}
        </div>
      )}

      {/* 4. Question Statement Node */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
           <div className="h-6 w-1 bg-primary rounded-full" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Question Node</span>
        </div>
        <div className="space-y-4">
           {showEn && questionEn && <p className="text-2xl font-black leading-snug text-[#0B1528] tracking-tight">{questionEn}</p>}
           {showPa && questionPa && <p className={cn("text-2xl font-bold leading-snug text-slate-600 tracking-tight", language === 'bilingual' ? "italic opacity-70" : "")}>{questionPa}</p>}
        </div>
      </div>

      {/* 5. Detailed Solution Review Node */}
      {showSolution && (
        <div className="mt-12 p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 space-y-6">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                 <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verified Logic</p>
                 <h4 className="font-headline font-black text-emerald-900 uppercase">Correct Answer: Option {question.correctAnswer}</h4>
              </div>
           </div>
           <div className="space-y-4 pt-4 border-t border-emerald-100">
              {showEn && explanationEn && <p className="text-base text-emerald-800 leading-relaxed font-medium">{explanationEn}</p>}
              {showPa && explanationPa && <p className={cn("text-base text-emerald-700 leading-relaxed font-medium", language === 'bilingual' ? "italic pt-2 mt-2 border-t border-emerald-100/50" : "")}>{explanationPa}</p>}
           </div>
        </div>
      )}
    </div>
  );
}
