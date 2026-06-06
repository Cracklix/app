/**
 * @fileOverview Institutional High-Fidelity Ingestion Engine v8.0.
 * Permanent Fix: Enhanced bilingual splitting (support for '/' and '|').
 */

import { Question } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
  confidence: number;
}

function splitIntoBlocks(text: string): string[] {
  const parts = text.split(/\n\s*---\s*\n/);
  if (parts.length > 1) return parts.filter(p => p.trim().length > 10);

  const boundaryRegex = /(?:\n|^)\s*(?:\*\*)?(?:Q|Question|QUESTION NO\.)?\s*\d+[\.\):\s-]*/gi;
  return text.split(boundaryRegex).filter(p => p.trim().length > 10);
}

const sanitizeText = (text: string = "") => {
  return text
    .replace(/^[A-D][\.\):\s-]*/i, '')
    .replace(/^\d+[\.\):\s-]*/, '')
    .replace(/\*\*/g, '')
    .trim();
};

export function parseBulkQuestions(
  rawText: string,
  metadata: any
): ParsedResults {
  const blocks = splitIntoBlocks(rawText);
  const parsed = blocks.map((block, index) => {
    try {
      const q = parseFidelityBlock(block, metadata);
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

function parseFidelityBlock(block: string, metadata: any): Partial<Question> {
  const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let questionEn = sanitizeText(lines[0]);
  let questionPa = "";
  
  if (lines[1] && !lines[1].match(/^[A-D][\.\):\s-]/i)) {
    questionPa = sanitizeText(lines[1]);
  }

  // Handle case where statement is already joined by '/' or '|'
  if (!questionPa && (questionEn.includes('/') || questionEn.includes('|'))) {
    const separator = questionEn.includes('|') ? '|' : '/';
    const parts = questionEn.split(separator).map(p => sanitizeText(p));
    questionEn = parts[0];
    questionPa = parts[1] || "";
  }

  const options: Record<string, { en: string; pa: string }> = {};
  const optionRegex = /(?:\n|^)\s*([A-D])[\.\):\s-]\s*(.*)/gi;
  let match;
  while ((match = optionRegex.exec(block)) !== null) {
    const label = match[1].toUpperCase();
    const content = match[2].trim();
    
    if (content.includes('|') || content.includes('/')) {
      const separator = content.includes('|') ? '|' : '/';
      const [enPart, paPart] = content.split(separator).map(s => sanitizeText(s));
      options[label] = { en: enPart, pa: paPart || "" };
    } else {
      options[label] = { en: sanitizeText(content), pa: "" };
    }
  }

  const answerMatch = block.match(/(?:Correct Answer|ਸਹੀ ਉੱਤਰ|Answer|ਜਵਾਬ):?\s*([A-D])/i);
  const correctAnswer = (answerMatch?.[1].toUpperCase() || "A") as 'A' | 'B' | 'C' | 'D';

  const expMatch = block.match(/(?:Explanation|ਵਿਆਖਿਆ):?\s*([\s\S]*)$/i);
  const expPart = expMatch ? expMatch[1].trim() : "";
  
  let explanationEn = expPart;
  let explanationPa = "";
  
  if (expPart.includes('ਵਿਆਖਿਆ:')) {
    const parts = expPart.split(/ਵਿਆਖਿਆ:/);
    explanationEn = sanitizeText(parts[0]);
    explanationPa = sanitizeText(parts[1]);
  } else if (expPart.includes('|') || expPart.includes('/')) {
    const separator = expPart.includes('|') ? '|' : '/';
    const parts = expPart.split(separator).map(p => sanitizeText(p));
    explanationEn = parts[0];
    explanationPa = parts[1] || "";
  } else {
    explanationEn = sanitizeText(expPart);
  }

  return {
    ...metadata,
    questionType: 'MCQ',
    questionEn,
    questionPa: questionPa || questionEn,
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
    explanationPa
  };
}
