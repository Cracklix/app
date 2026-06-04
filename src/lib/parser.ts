/**
 * @fileOverview Institutional Multi-Format Ingestion Engine.
 * Extracts questions, options, answers, and images from structured and OCR text.
 */

import { Question, Difficulty, MockType } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
}

export function parseBulkQuestions(
  rawText: string,
  metadata: {
    board: string;
    exam: string;
    subject: string;
    chapter: string;
    language: string;
    difficulty: Difficulty;
    mockType: MockType;
  }
): ParsedResults {
  const questions: Partial<Question>[] = [];
  const errors: string[] = [];

  // Normalize line endings
  const text = rawText.replace(/\r\n/g, '\n').trim();
  
  // Split by Question markers (Q1., Q1 EN:, Q1 PA:, etc.)
  // This identifies the start of a new question block
  const questionBlocks = text.split(/\n(?=Q\d+[:.]?)/i).filter(b => b.trim().length > 0);

  if (questionBlocks.length === 0) {
    return { questions: [], errors: ["No question markers (e.g., Q1.) detected in the text."] };
  }

  questionBlocks.forEach((block, index) => {
    try {
      const qNumMatch = block.match(/^Q(\d+)/i);
      const qNum = qNumMatch ? qNumMatch[1] : (index + 1).toString();

      // Extraction logic for Bilingual/Standard formats
      const getField = (startRegex: RegExp, endRegexes: RegExp[]) => {
        const lines = block.split('\n');
        let startLine = -1;
        for(let i=0; i<lines.length; i++) {
          if(startRegex.test(lines[i])) {
            startLine = i;
            break;
          }
        }
        if (startLine === -1) return "";

        let content = lines[startLine].replace(startRegex, '').trim();
        for(let i = startLine + 1; i < lines.length; i++) {
          if (endRegexes.some(re => re.test(lines[i]))) break;
          content += '\n' + lines[i].trim();
        }
        return content.trim();
      };

      const markers = [
        /^Q\d+\s+EN:/i, /^Q\d+\s+PA:/i, /^Q\d+[:.]?/i,
        /^A\s+EN:/i, /^A\s+PA:/i, /^A[:.]/i,
        /^B\s+EN:/i, /^B\s+PA:/i, /^B[:.]/i,
        /^C\s+EN:/i, /^C\s+PA:/i, /^C[:.]/i,
        /^D\s+EN:/i, /^D\s+PA:/i, /^D[:.]/i,
        /^Answer[:.]/i, /^ANS[:.]/i,
        /^Explanation\s+EN:/i, /^Explanation\s+PA:/i, /^Explanation[:.]/i,
        /^Image[:.]/i
      ];

      // Question Content
      let questionEn = getField(/^Q\d+\s+EN:/i, markers) || getField(/^Q\d+[:.]/i, markers);
      let questionPa = getField(/^Q\d+\s+PA:/i, markers);

      // Options
      const optionAEn = getField(/^A\s+EN:/i, markers) || getField(/^A[:.]/i, markers);
      const optionAPa = getField(/^A\s+PA:/i, markers);
      const optionBEn = getField(/^B\s+EN:/i, markers) || getField(/^B[:.]/i, markers);
      const optionBPa = getField(/^B\s+PA:/i, markers);
      const optionCEn = getField(/^C\s+EN:/i, markers) || getField(/^C[:.]/i, markers);
      const optionCPa = getField(/^C\s+PA:/i, markers);
      const optionDEn = getField(/^D\s+EN:/i, markers) || getField(/^D[:.]/i, markers);
      const optionDPa = getField(/^D\s+PA:/i, markers);

      // Answer
      const answerRaw = getField(/^(Answer|ANS)[:.]/i, markers);
      const correctAnswerMatch = answerRaw.match(/([A-D])/i);
      const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D' : undefined;

      // Explanation
      const explanationEn = getField(/^Explanation\s+EN:/i, markers) || getField(/^Explanation[:.]/i, markers);
      const explanationPa = getField(/^Explanation\s+PA:/i, markers);

      // Image
      const imageUrl = getField(/^Image[:.]/i, markers);

      // Validation
      if (!questionEn && !questionPa) throw new Error(`Missing question text`);
      if (!optionAEn && !optionAPa) throw new Error(`Missing Option A`);
      if (!correctAnswer) throw new Error(`Missing or invalid Answer (Must be A, B, C, or D)`);

      questions.push({
        ...metadata,
        questionEn,
        questionPa,
        optionAEn,
        optionAPa: optionAPa || optionAEn,
        optionBEn,
        optionBPa: optionBPa || optionBEn,
        optionCEn,
        optionCPa: optionCPa || optionCEn,
        optionDEn,
        optionDPa: optionDPa || optionDEn,
        correctAnswer,
        explanationEn: explanationEn || "Solution verified by Cracklix.",
        explanationPa: explanationPa || explanationEn || "ਵਿਵਸਥਿਤ ਹੱਲ।",
        imageUrl: imageUrl || "",
      });

    } catch (err: any) {
      errors.push(`Question ${index + 1}: ${err.message}`);
    }
  });

  return { questions, errors };
}
