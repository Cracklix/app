
'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * @fileOverview Precision Neat & Clean Math Renderer v11.0.
 * Uniform Typography Pass: Removed color overrides for symbols to ensure 100% #111111 consistency.
 */
export default function MathText({ text, className }: MathTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const lines = text.split('\n');
      
      const renderedHtml = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '<div class="h-6"></div>';

        // Normalize symbols for logic detection
        let processed = trimmed
          .replace(/×/g, '\\times')
          .replace(/÷/g, '\\div')
          .replace(/²/g, '^2')
          .replace(/³/g, '^3')
          .replace(/√\[?([^\]\s]+)\]?/g, '\\sqrt{$1}')
          .replace(/√/g, '\\sqrt');

        // Logic: Is this line a pure formula or text with math?
        const isPureFormula = /^[sabcxyz\d\s\+\-\*\/\=\(\)\\\^\sqrt{}]+$/i.test(trimmed) && trimmed.includes('=');
        const hasSymbols = /[√\\×÷²³≤≥]/.test(trimmed);

        if (isPureFormula || (hasSymbols && !/[a-z]{4,}/i.test(trimmed))) {
          try {
            return `<div class="py-3 overflow-x-auto no-scrollbar font-sans text-xl md:text-2xl">${katex.renderToString(processed, {
              throwOnError: false,
              displayMode: false,
              trust: true
            })}</div>`;
          } catch (e) {
            return `<div class="py-3">${trimmed}</div>`;
          }
        }

        // descriptive text (e.g., "Total age = 300")
        if (trimmed.includes('=') && !/[a-z]{10,}/i.test(trimmed)) {
          const parts = trimmed.split('=');
          return `<div class="py-3 flex flex-wrap items-baseline gap-2">
            <span class="font-black text-inherit uppercase tracking-wide">${parts[0].trim()}</span>
            <span class="text-inherit font-black">=</span>
            <span class="font-black text-inherit">${parts[1].trim()}</span>
          </div>`;
        }
        
        // Header detection for "Formula:", "Calculation:", etc.
        if (trimmed.endsWith(':')) {
           return `<div class="font-black text-inherit mt-8 mb-4 uppercase tracking-[0.2em] text-xs md:text-sm border-l-4 border-slate-300 pl-4 bg-slate-50 py-2 rounded-r-lg">${trimmed}</div>`;
        }

        // Standard neat text line with maximum spacing
        return `<div class="py-2 text-inherit font-black leading-[2.2] tracking-wide antialiased">${trimmed}</div>`;
      }).join('');

      containerRef.current.innerHTML = renderedHtml;
    } catch (err) {
      containerRef.current.textContent = text;
    }
  }, [text]);

  return (
    <div 
      ref={containerRef} 
      className={cn("whitespace-pre-wrap leading-[2.2] h-auto overflow-visible tracking-wide", className)} 
    />
  );
}
