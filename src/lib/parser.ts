/**
 * @fileOverview Institutional High-Fidelity Ingestion Engine v12.0.
 * Optimized for: 
 * Line 1: Q1. English Question
 * Line 2: ਪ੍ਰਸ਼ਨ 1. Punjabi Question
 * Line 3-6: (A) Eng / Pun
 * Line 7: Correct Answer: (A) Text / ਸਹੀ ਉੱਤਰ: ਪਾ * English Explanation: ...
 */

import { Question } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
  confidence: number;
}

const sanitizeText = (text: string = "") => {
  return text
    .replace(/^Q\d+[\.\):\s-]*/i, '')      // Remove Q1.
    .replace(/^ਪ੍ਰਸ਼ਨ\s*\d+[\.\):\s-]*/, '') // Remove ਪ੍ਰਸ਼ਨ 1.
    .replace(/^\d+[\.\):\s-]*/, '')        // Remove 1.
    .replace(/^\(?[A-D]\)?[\.\):\s-]*/i, '') // Remove (A) or A.
    .replace(/^\*\*|\*\*$/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export function parseBulkQuestions(
  rawText: string,
  metadata: any
): ParsedResults {
  // Split by Question markers (Q1, Q2, etc.)
  const blocks = rawText.split(/(?=Q\d+[\.\):\s-])/g).filter(p => p.trim().length > 10);
  
  const parsed = blocks.map((block, index) => {
    try {
      const q = parseStandardBlock(block, metadata);
      if (!q.questionEn) return null;
      return {
        ...q,
        displayId: `Q${index + 1}`,
        status: metadata.status || "PUBLISHED",
      };
    } catch (err: any) {
      console.error("Parse error in block:", index, err);
      return null;
    }
  }).filter(Boolean) as Partial<Question>[];

  const confidence = blocks.length > 0 ? Math.round((parsed.length / blocks.length) * 100) : 0;
  return { questions: parsed, errors: [], confidence };
}

function parseStandardBlock(block: string, metadata: any): Partial<Question> {
  const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let questionEn = "";
  let questionPa = "";
  const options: Record<string, { en: string; pa: string }> = {};
  let correctAnswer: 'A' | 'B' | 'C' | 'D' = 'A';
  let explanationEn = "";
  let explanationPa = "";

  // 1. Identify Questions (Lines starting with Q and ਪ੍ਰਸ਼ਨ)
  lines.forEach(line => {
    if (line.match(/^Q\d+[\.\):\s-]/i)) {
      questionEn = sanitizeText(line);
    } else if (line.match(/^ਪ੍ਰਸ਼ਨ\s*\d+[\.\):\s-]/)) {
      questionPa = sanitizeText(line);
    } else if (line.match(/^\([A-D]\)/i)) {
      // 2. Identify Options (Line: (A) Eng / Pun)
      const labelMatch = line.match(/^\(([A-D])\)/i);
      if (labelMatch) {
        const label = labelMatch[1].toUpperCase();
        const content = line.replace(/^\([A-D]\)/i, '').trim();
        if (content.includes('/')) {
          const parts = content.split('/');
          options[label] = { en: sanitizeText(parts[0]), pa: sanitizeText(parts[1]) };
        } else {
          options[label] = { en: sanitizeText(content), pa: "" };
        }
      }
    } else if (line.toLowerCase().includes('correct answer:')) {
      // 3. Identify Answer & Explanation
      // Format: Correct Answer: (B) West / ਸਹੀ ਉੱਤਰ: ਪੱਛਮ * English Explanation: ...
      const ansMatch = line.match(/Correct Answer:\s*(?:\()?([A-D])(?:\))?/i);
      if (ansMatch) correctAnswer = ansMatch[1].toUpperCase() as any;

      if (line.includes('* English Explanation:')) {
        const expParts = line.split('* English Explanation:');
        explanationEn = sanitizeText(expParts[1]);
      } else if (line.includes('Explanation:')) {
        const expParts = line.split(/Explanation:/i);
        explanationEn = sanitizeText(expParts[1]);
      }
    }
  });

  // Fallback: If no separate Punjabi question line, try splitting English line by slash
  if (!questionPa && questionEn.includes('/')) {
    const parts = questionEn.split('/');
    questionEn = sanitizeText(parts[0]);
    questionPa = sanitizeText(parts[1]);
  }

  return {
    ...metadata,
    questionType: 'MCQ',
    questionEn,
    questionPa,
    optionAEn: options['A']?.en || "Option A",
    optionAPa: options['A']?.pa || "",
    optionBEn: options['B']?.en || "Option B",
    optionBPa: options['B']?.pa || "",
    optionCEn: options['C']?.en || "Option C",
    optionCPa: options['C']?.pa || "",
    optionDEn: options['D']?.en || "Option D",
    optionDPa: options['D']?.pa || "",
    correctAnswer,
    explanationEn,
    explanationPa: "" // Typically implied in the bilingual answer part or empty in user's image
  };
}
