'use client';

import React, { useMemo } from 'react';
import { Question } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CheckCircle2, LayoutGrid, BarChart3, HelpCircle, FileText } from 'lucide-react';
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

/**
 * @fileOverview Ultimate Production Question Renderer.
 * Supports: DI Charts, Passages, Tables, Matching, Assertion-Reason and Bilingual Logic.
 */
export default function QuestionRenderer({ question, language, showSolution = false }: QuestionRendererProps) {
  const showEn = language === 'en' || language === 'bilingual';
  const showPa = language === 'pa' || language === 'bilingual';
  
  const questionType = question.questionType || 'MCQ';
  const diagramType = question.diagramType || 'none';

  // Shared Context Node Logic (Passage or DI Instruction)
  const hasContext = !!(question.instructionEn || question.instructionPa || question.passageEn || question.passagePa);

  return (
    <div className="space-y-10 w-full text-left font-body animate-in fade-in duration-500">
      {/* 1. Context Container (Shared Passage/DI Chart) */}
      {hasContext && (
        <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] shadow-inner space-y-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <FileText className="h-20 w-20" />
           </div>
           <div className="flex items-center gap-3 relative z-10">
              <LayoutGrid className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference Node</span>
           </div>
           
           {(question.instructionEn || question.instructionPa) && (
             <div className="space-y-2 relative z-10">
                {showEn && question.instructionEn && <p className="text-sm font-bold text-slate-800 leading-relaxed">{question.instructionEn}</p>}
                {showPa && question.instructionPa && <p className="text-sm font-medium text-slate-600 italic leading-relaxed">{question.instructionPa}</p>}
             </div>
           )}

           {(question.passageEn || question.passagePa) && (
             <div className="space-y-6 border-t border-slate-200 pt-6 relative z-10">
                {showEn && question.passageEn && <div className="text-base leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">{question.passageEn}</div>}
                {showPa && question.passagePa && <div className={cn("text-base leading-relaxed text-slate-600 whitespace-pre-wrap font-medium", showEn ? "italic border-t border-slate-100 pt-6" : "")}>{question.passagePa}</div>}
             </div>
           )}
        </div>
      )}

      {/* 2. Visual Node (Images / Diagrams / Tables / Recharts) */}
      {(question.imageUrl || question.tableData || question.chartConfig) && (
        <div className="space-y-8">
           {/* Static Diagram / Map */}
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

           {/* Interactive DI Data Table */}
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
                     <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                       {row.map((cell, j) => (
                         <TableCell key={j} className="text-center font-bold text-slate-600 border-r border-slate-50 last:border-0 py-4">{cell}</TableCell>
                       ))}
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
           )}

           {/* Dynamic DI Charts (Recharts) */}
           {question.chartConfig && (
              <div className="h-[300px] w-full bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                 <ResponsiveContainer width="100%" height="100%">
                    {diagramType === 'barGraph' ? (
                       <BarChart data={question.chartConfig.data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10}} />
                          <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                          <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    ) : diagramType === 'pieChart' ? (
                       <PieChart>
                          <Pie data={question.chartConfig.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                             {question.chartConfig.data.map((_: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                          </Pie>
                          <Tooltip />
                       </PieChart>
                    ) : (
                       <LineChart data={question.chartConfig.data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#F97316" strokeWidth={3} dot={{ r: 4, fill: '#F97316' }} />
                       </LineChart>
                    )}
                 </ResponsiveContainer>
              </div>
           )}
        </div>
      )}

      {/* 3. Question Statement Hub */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
           <div className={cn(
             "h-6 w-1 rounded-full", 
             questionType === 'ASSERTION_REASON' ? "bg-rose-500" : 
             questionType === 'MATCHING' ? "bg-blue-500" : "bg-primary"
           )} />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Statement</span>
        </div>
        
        <div className="space-y-6">
           {showEn && question.questionEn && (
              <div className="text-2xl md:text-3xl font-black leading-tight text-[#0B1528] tracking-tight whitespace-pre-wrap">
                 {question.questionEn}
              </div>
           )}
           {showPa && question.questionPa && (
              <div className={cn(
                "text-2xl md:text-3xl font-bold leading-tight text-slate-700 tracking-tight whitespace-pre-wrap", 
                showEn ? "italic opacity-70 border-t border-slate-100 pt-6" : ""
              )}>
                 {question.questionPa}
              </div>
           )}
        </div>
      </div>

      {/* 4. Solution Review Hub (Triggered after Submission) */}
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
              {showEn && question.explanationEn && (
                <div className="text-lg text-emerald-800 leading-relaxed font-medium whitespace-pre-wrap">
                  {question.explanationEn}
                </div>
              )}
              {showPa && question.explanationPa && (
                <div className={cn(
                  "text-lg text-emerald-700 leading-relaxed font-medium whitespace-pre-wrap", 
                  showEn ? "italic pt-8 mt-8 border-t border-emerald-100/40" : ""
                )}>
                  {question.explanationPa}
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
