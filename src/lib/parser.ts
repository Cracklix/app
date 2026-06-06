
/**
 * @fileOverview Institutional Compact Parser v12.0.
 * Optimized for "Line 1 EN / Line 2 PA" and "Inline Options (A)/(B)/(C)/(D)" format.
 * Strictly non-AI. Deterministic mapping to High-Fidelity registry.
 */

import { Question } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
}

export function parseBulkQuestions(rawText: string, metadata: any): ParsedResults {
  const cleanRaw = rawText.replace(/\r\n/g, '\n');
  
  // Split by Q followed by a number
  const blocks = cleanRaw.split(/\n(?=Q\d+[\.\s])/g).filter(b => b.trim().length > 10);
  
  // Fallback for first block if it doesn't start with newline
  if (blocks.length === 1 && !blocks[0].trim().startsWith('Q')) {
    const initialSplit = cleanRaw.split(/(?=Q\d+[\.\s])/g).filter(b => b.trim().startsWith('Q'));
    return parseBlocks(initialSplit, metadata);
  }

  return parseBlocks(blocks, metadata);
}

function parseBlocks(blocks: string[], metadata: any): ParsedResults {
  const questions: Partial<Question>[] = [];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 3) return;

    try {
      const q: any = { 
        ...metadata,
        id: `q-node-${Date.now()}-${index}`,
        status: metadata.status || "PUBLISHED",
        isStandalone: true,
        questionEn: "",
        questionPa: "",
        optionAEn: "",
        optionBEn: "",
        optionCEn: "",
        optionDEn: "",
        correctAnswer: "",
        explanationEn: "",
        explanationPa: ""
      };

      // 1. Extract Question Text
      // English is the first line after Q#
      q.questionEn = lines[0].replace(/^Q\d+[\.\s]*/i, '').trim();

      // Punjabi is usually the second line
      if (lines[1] && !lines[1].includes('(A)')) {
        q.questionPa = lines[1].replace(/^(ਪ੍ਰਸ਼ਨ|ਪ੍ਰਸ਼ਨ)\s*\d+[\.\s]*/, '').trim();
      }

      // 2. Extract Options (Handles both Multi-line and Inline compact format)
      const fullBlockText = lines.join(' ');
      
      const extractOption = (key: string, nextKey: string | null) => {
        const startMarker = `(${key})`;
        const startIndex = fullBlockText.indexOf(startMarker);
        if (startIndex === -1) return "";
        
        let endIndex = nextKey ? fullBlockText.indexOf(`(${nextKey})`, startIndex) : fullBlockText.indexOf('Correct Answer', startIndex);
        if (endIndex === -1) endIndex = fullBlockText.length;
        
        return fullBlockText.substring(startIndex + startMarker.length, endIndex).replace(/[\/]/g, '').trim();
      };

      q.optionAEn = extractOption('A', 'B');
      q.optionBEn = extractOption('B', 'C');
      q.optionCEn = extractOption('C', 'D');
      q.optionDEn = extractOption('D', null);

      // 3. Extract Correct Answer
      const ansLine = lines.find(l => l.toLowerCase().includes('correct answer') || l.toLowerCase().includes('ਸਹੀ ਉੱਤਰ'));
      if (ansLine) {
        const match = ansLine.match(/(?:correct answer|ans)[:\s]*\(?([A-D])\)?/i);
        if (match) q.correctAnswer = match[1].toUpperCase();
        q.correctAnswerRaw = ansLine.trim();
      }

      // 4. Extract Explanations (Vertical Flow Preservation)
      const rawLines = block.split('\n').map(l => l.trim());
      
      const expEnStart = rawLines.findIndex(l => l.includes('• English Explanation:'));
      const expPaStart = rawLines.findIndex(l => l.includes('• ਪੰਜਾਬੀ ਵਿਆਖਿਆ:'));

      if (expEnStart !== -1) {
        const end = expPaStart !== -1 ? expPaStart : rawLines.length;
        q.explanationEn = rawLines.slice(expEnStart).join('\n').replace('• English Explanation:', '').trim();
      }

      if (expPaStart !== -1) {
        q.explanationPa = rawLines.slice(expPaStart).join('\n').replace('• ਪੰਜਾਬੀ ਵਿਆਖਿਆ:', '').trim();
      }

      if (q.questionEn && q.correctAnswer) {
        questions.push(q);
      } else {
        errors.push(`Block ${index + 1}: Missing Question or Answer.`);
      }
    } catch (err: any) {
      errors.push(`Block ${index + 1}: ${err.message}`);
    }
  });

  return { questions, errors };
}
