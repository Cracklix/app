
'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * @fileOverview Exam-Grade Math Renderer.
 * Automatically identifies math symbols and renders them using KaTeX.
 */
export default function MathText({ text, className }: MathTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Find math parts in text. This is a simplified regex for exam-style math.
      // E.g. symbols like √, ^, _, fractions, etc.
      // For full support, we replace the entire block with KaTeX rendered HTML.
      try {
        const parts = text.split(/(\$.*?\$)/g);
        containerRef.current.innerHTML = parts.map(part => {
          if (part.startsWith('$') && part.endsWith('$')) {
            const math = part.slice(1, -1);
            return katex.renderToString(math, {
              throwOnError: false,
              displayMode: false
            });
          }
          return part;
        }).join('');
      } catch (err) {
        console.error("KaTeX Error:", err);
      }
    }
  }, [text]);

  return <div ref={containerRef} className={className} />;
}
