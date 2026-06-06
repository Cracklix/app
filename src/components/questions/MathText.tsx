
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
 * @fileOverview Precision Math Renderer v6.0.
 * Optimized for institutional symbols: √, ×, ÷, ², ³, ≤, ≥, %.
 * Strictly preserves vertical formula lines.
 */
export default function MathText({ text, className }: MathTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Split text into lines to preserve vertical structure
      const lines = text.split('\n');
      
      const renderedHtml = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '<div class="h-4"></div>';

        // 1. Symbol Normalization (Unicode to LaTeX)
        let processed = trimmed
          .replace(/√\[?([^\]\s]+)\]?/g, '\\sqrt{$1}') 
          .replace(/√/g, '\\sqrt')
          .replace(/×/g, '\\times')
          .replace(/÷/g, '\\div')
          .replace(/²/g, '^2')
          .replace(/³/g, '^3')
          .replace(/≤/g, '\\leq')
          .replace(/≥/g, '\\geq');

        // 2. Detection logic: if line contains math markers, render as KaTeX
        const hasMath = /[√\\×÷²³≤≥%=]/.test(processed) || /Area|Semi-perimeter|s=|ਖੇਤਰਫਲ|ਪਰਿਮਾਪ/i.test(processed);

        if (hasMath) {
          try {
            return `<div class="py-1.5 overflow-x-auto no-scrollbar">${katex.renderToString(processed, {
              throwOnError: false,
              displayMode: false,
              trust: true,
              strict: false
            })}</div>`;
          } catch (e) {
            return `<div class="py-1">${trimmed}</div>`;
          }
        }
        
        return `<div class="py-1">${trimmed}</div>`;
      }).join('');

      containerRef.current.innerHTML = renderedHtml;
    } catch (err) {
      containerRef.current.textContent = text;
    }
  }, [text]);

  return (
    <div 
      ref={containerRef} 
      className={cn("whitespace-pre-wrap leading-relaxed h-auto overflow-visible", className)} 
    />
  );
}
