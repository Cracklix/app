
'use client';

import React from 'react';
import { Question } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
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

interface QuestionRendererProps {
  question: Partial<Question>;
  language: 'en' | 'pa';
}

const COLORS = ['#F97316', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];

export default function QuestionRenderer({ question, language }: QuestionRendererProps) {
  const isEn = language === 'en';

  return (
    <div className="space-y-8 w-full text-left">
      {/* 1. Instruction Node */}
      {(isEn ? question.instructionEn : question.instructionPa) && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-1">Instruction</p>
          <p className="text-sm font-bold text-blue-800 italic">
            {isEn ? question.instructionEn : question.instructionPa}
          </p>
        </div>
      )}

      {/* 2. Passage Node (Reading Comprehension / Caselet) */}
      {(isEn ? question.passageEn : question.passagePa) && (
        <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl shadow-inner">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Read the following passage:</p>
          <div className="text-base md:text-lg leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
            {isEn ? question.passageEn : question.passagePa}
          </div>
        </div>
      )}

      {/* 3. Diagram / Visual Node */}
      {question.diagramType !== 'none' && (
        <div className="w-full py-4">
          {/* Table DI */}
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

          {/* Chart DI */}
          {(question.diagramType === 'barGraph' || question.diagramType === 'pieChart' || question.diagramType === 'lineGraph') && question.chartConfig && (
            <div className="h-[300px] w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-lg">
              <ResponsiveContainer width="100%" height="100%">
                {question.diagramType === 'barGraph' ? (
                  <BarChart data={question.chartConfig.labels.map((l, i) => ({ name: l, value: question.chartConfig!.values[i] }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : question.diagramType === 'pieChart' ? (
                  <PieChart>
                    <Pie
                      data={question.chartConfig.labels.map((l, i) => ({ name: l, value: question.chartConfig!.values[i] }))}
                      cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                    >
                      {question.chartConfig.labels.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <LineChart data={question.chartConfig.labels.map((l, i) => ({ name: l, value: question.chartConfig!.values[i] }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#F97316" strokeWidth={4} dot={{r: 6, fill: '#F97316'}} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          )}

          {/* Image Based */}
          {question.diagramType === 'image' && question.imageUrl && (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-slate-100 shadow-2xl">
              <Image src={question.imageUrl} fill alt={question.imageAlt || "Question Diagram"} className="object-contain bg-white" />
            </div>
          )}
        </div>
      )}

      {/* 4. Question Statement */}
      <div className="space-y-4">
        <p className="text-xl md:text-2xl font-bold leading-snug text-[#0B1528]">
          {isEn ? question.questionEn : question.questionPa}
        </p>
        
        {/* If Bilingual Mode (Handled outside if needed, but here's a fallback) */}
        {!isEn && question.questionEn && question.questionType === 'BILINGUAL_MCQ' && (
          <div className="pt-4 border-t border-slate-100">
             <p className="text-xl md:text-2xl font-bold leading-snug text-slate-400">
                {question.questionEn}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
