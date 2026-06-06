/**
 * @fileOverview Institutional High-Fidelity Ingestion Engine v4.0.
 * Features: Absolute Formatting Preservation, Bilingual Pipe Detection,
 * and Original Numbering Extraction (Q291, etc.).
 */

import { Question, Difficulty, ContentStatus } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
  confidence: number;
}

/**
 * Strips boundary markers from the start of a text block but preserves 
 * internal formatting and whitespace.
 */
function cleanText(text: string): string {
  if (!text) return "";
  // Purge leading numbering artifacts specifically while keeping internal whitespace
  return text
    .replace(/^(\s*\**\s*(?:Q|Question|QUESTION NO\.)?\s*\d+[\.\):-]*\s*\*?\s*)/i, '')
    .trim();
}

/**
 * Splits text into blocks while preserving the original boundary markers 
 * for extraction as display IDs.
 */
function splitIntoBlocks(text: string): { marker: string, content: string }[] {
  // Look for patterns like Q291., 1., Question 1
  const boundaryRegex = /(?:\n|^)\s*((?:Q|Question|QUESTION NO\.)?\s*(\d+)[\.\):\s-]*)/gi;
  
  const blocks: { marker: string, content: string }[] = [];
  let match;
  let lastIndex = 0;
  let lastMarker = "";

  while ((match = boundaryRegex.exec(text)) !== null) {
    if (lastIndex !== 0 || text.substring(0, match.index).trim().length > 0) {
      const content = text.substring(lastIndex, match.index).trim();
      if (content || lastMarker) {
        blocks.push({ marker: lastMarker, content });
      }
    }
    lastMarker = match[1].trim().replace(/\.$/, ''); // Store Q291 part
    lastIndex = match.index + match[0].length;
  }

  // Final block
  if (lastIndex < text.length) {
    blocks.push({ marker: lastMarker, content: text.substring(lastIndex).trim() });
  }

  return blocks.filter(b => b.content.length > 5);
}

export function parseBulkQuestions(
  rawText: string,
  metadata: {
    boardId: string;
    examId: string;
    subjectId: string;
    chapterId: string;
    difficulty: Difficulty;
    status: ContentStatus;
  }
): ParsedResults {
  const questions: Partial<Question>[] = [];
  const errors: string[] = [];
  
  const blocks = splitIntoBlocks(rawText);

  if (blocks.length === 0) {
    return { questions: [], errors: ["No question patterns detected. Use Q1, Q291 or 1. at start of questions."], confidence: 0 };
  }

  blocks.forEach((block, index) => {
    try {
      const parsed = parseFidelityBlock(block.content, metadata);

      questions.push({
        ...parsed,
        displayId: block.marker || `Q${index + 1}`,
        isStandalone: true,
        status: metadata.status || "PUBLISHED",
      });

    } catch (err: any) {
      errors.push(`Node ${block.marker || index + 1}: ${err.message}`);
    }
  });

  const confidence = Math.round((questions.length / (questions.length + (errors.length || 0))) * 100);
  return { questions, errors, confidence };
}

function parseFidelityBlock(block: string, metadata: any): Partial<Question> {
  // Regex to extract options without collapsing internal whitespace
  const optionRegex = /(?:\n|^)\s*\**([A-D])[\.\)]\s*\*?\s*([\s\S]*?)(?=\n\s*\**[A-D][\.\)]|\n\s*\**Correct Answer|\n\s*\**Answer|\n\s*\**Correct Option|\n\s*\**Explanation|\n\s*\**ਵਿਆਖਿਆ|$)/gi;
  const answerRegex = /(?:Correct Answer|Answer|Correct Option|ਜਵਾਬ):?\s*\**([A-D])\b/i;
  const explanationRegex = /(?:Explanation|ਵਿਆਖਿਆ):?\s*\**([\s\S]*)$/i;

  const firstOptionMatch = optionRegex.exec(block);
  optionRegex.lastIndex = 0;
  
  const questionPart = firstOptionMatch 
    ? block.substring(0, firstOptionMatch.index).trim() 
    : block.split('\n')[0];

  // Bilingual split for question - Detect first major script change or newline block
  const qLines = questionPart.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const questionEn = qLines[0] || "";
  const questionPa = qLines.length > 1 ? qLines.slice(1).join('\n') : "";

  // Extract Options with pipe support
  const options: Record<string, { en: string; pa: string }> = {};
  let match;
  while ((match = optionRegex.exec(block)) !== null) {
    const label = match[1].toUpperCase();
    const content = match[2].trim();
    
    if (content.includes('|')) {
      const [en, pa] = content.split('|').map(s => s.trim());
      options[label] = { en, pa };
    } else {
      options[label] = { en: content, pa: "" };
    }
  }

  // Answer
  const ansMatch = block.match(answerRegex);
  const correctAnswer = (ansMatch?.[1].toUpperCase() || "A") as 'A' | 'B' | 'C' | 'D';

  // Explanation
  const expMatch = block.match(explanationRegex);
  const explanationPart = expMatch ? expMatch[1].trim() : "";
  
  // Split explanation if bilingual
  const expLines = explanationPart.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const explanationEn = expLines[0] || "";
  const explanationPa = expLines.length > 1 ? expLines.slice(1).join('\n') : "";

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
    explanationPa: explanationPa || ""
  };
}
