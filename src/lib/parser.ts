/**
 * @fileOverview Institutional High-Fidelity Ingestion Engine v11.0.
 * Optimized for: "Question En / Question Pa" and "(A) Opt En / Opt Pa" format.
 * Fixes: Redundant numbering and clumpsy explanation parsing.
 */

import { Question } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
  confidence: number;
}

const sanitizeText = (text: string = "") => {
  return text
    .replace(/^\d+[\.\):\s-]*/, '') // Remove leading numbers like 1. or 24)
    .replace(/^\*\*|\*\*$/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export function parseBulkQuestions(
  rawText: string,
  metadata: any
): ParsedResults {
  // Split by Question markers (Q1, Q2, Q24, etc.)
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
      return null;
    }
  }).filter(Boolean) as Partial<Question>[];

  const confidence = blocks.length > 0 ? Math.round((parsed.length / blocks.length) * 100) : 0;
  return { questions: parsed, errors: [], confidence };
}

function parseStandardBlock(block: string, metadata: any): Partial<Question> {
  // 1. Extract Question Statement (Everything before (A))
  // Removing the Q1. marker from the start of the match
  const qMatch = block.match(/Q\d+[\.\):\s-](.*?)(?=\s*\(A\))/s);
  const qFullText = qMatch ? qMatch[1].trim() : "";
  let questionEn = qFullText;
  let questionPa = qFullText;

  // Split by slash if present
  if (qFullText.includes('/')) {
    const parts = qFullText.split('/');
    questionEn = sanitizeText(parts[0]);
    questionPa = sanitizeText(parts[1] || parts[0]);
  } else {
    questionEn = sanitizeText(qFullText);
    questionPa = "";
  }

  // 2. Extract Options (A, B, C, D)
  const options: Record<string, { en: string; pa: string }> = {};
  ['A', 'B', 'C', 'D'].forEach(label => {
    const nextLabel = label === 'A' ? 'B' : label === 'B' ? 'C' : label === 'C' ? 'D' : 'Correct Answer';
    const regex = new RegExp(`\\(${label}\\)(.*?)(?=\\s*\\(${nextLabel}\\)|\\s*${nextLabel}|$)`, 's');
    const match = block.match(regex);
    if (match) {
      const optText = match[1].trim();
      if (optText.includes('/')) {
        const parts = optText.split('/');
        options[label] = { en: sanitizeText(parts[0]), pa: sanitizeText(parts[1] || parts[0]) };
      } else {
        options[label] = { en: sanitizeText(optText), pa: "" };
      }
    }
  });

  // 3. Extract Correct Answer
  const answerMatch = block.match(/(?:Correct Answer|ਸਹੀ ਉੱਤਰ|Answer|ਜਵਾਬ):?\s*(?:\()?\s*([A-D])\s*(?:\))?/i);
  const correctAnswer = (answerMatch?.[1].toUpperCase() || "A") as 'A' | 'B' | 'C' | 'D';

  // 4. Extract Explanations with Spacing Support
  // Looking for markers or splitting by slash
  const expBlockMatch = block.match(/(?:English Explanation|ਵਿਆਖਿਆ|Explanation):?\s*(.*)$/s);
  const expFullText = expBlockMatch ? expBlockMatch[1].trim() : "";
  
  let explanationEn = "";
  let explanationPa = "";

  if (expFullText.includes('Punjabi Explanation:') || expFullText.includes('ਪੰਜਾਬੀ ਵਿਆਖਿਆ:')) {
    const parts = expFullText.split(/Punjabi Explanation:|ਪੰਜਾਬੀ ਵਿਆਖਿਆ:/i);
    explanationEn = sanitizeText(parts[0].replace(/English Explanation:/i, ''));
    explanationPa = sanitizeText(parts[1]);
  } else if (expFullText.includes('/')) {
    const parts = expFullText.split('/');
    explanationEn = sanitizeText(parts[0]);
    explanationPa = sanitizeText(parts[1]);
  } else {
    explanationEn = sanitizeText(expFullText);
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
    explanationEn: explanationEn || explanationPa,
    explanationPa: explanationPa || explanationEn
  };
}
