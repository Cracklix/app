
/**
 * @fileOverview Institutional Multi-Format Ingestion Engine.
 * Extracts questions, options, answers, and images from structured and OCR text.
 */

import { Question, Difficulty, MockType } from "@/types";

export type ImportFormat = "STANDARD_TAGGED" | "BILINGUAL_TAGGED" | "IMAGE_BASED";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
}

export function parseBulkQuestions(
  rawText: string,
  importFormat: ImportFormat,
  metadata: {
    boardId: string;
    examId: string;
    subjectId: string;
    chapterId: string;
    difficulty: Difficulty;
    status: any;
    languagePreference: any;
    duration?: number;
    mockType?: MockType;
  }
): ParsedResults {
  const questions: Partial<Question>[] = [];
  const errors: string[] = [];

  // Normalize line endings
  const text = rawText.replace(/\r\n/g, '\n').trim();
  
  // Split by [BLOCK_ID: or Q1. style markers
  const questionBlocks = text.split(/\[BLOCK_ID:.*?\]|Q\d+[:.]/i).filter(b => b.trim().length > 0);

  if (questionBlocks.length === 0) {
    return { questions: [], errors: ["No valid block markers detected. Use [BLOCK_ID: Q1] or Q1. format."] };
  }

  questionBlocks.forEach((block, index) => {
    try {
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
        /^ENG_Q:/i, /^PUN_Q:/i, /^Q\d+[:.]/i,
        /^ENG_OPT:/i, /^PUN_OPT:/i, /^A[:.]/i, /^B[:.]/i, /^C[:.]/i, /^D[:.]/i,
        /^ENG_ANS:/i, /^PUN_ANS:/i, /^Answer[:.]/i, /^ANS[:.]/i,
        /^ENG_EXP:/i, /^PUN_EXP:/i, /^Explanation[:.]/i,
        /^Image:/i, /^IMAGE_URL:/i
      ];

      // Question Content
      let questionEn = getField(/^ENG_Q:/i, markers) || getField(/^Q\d+[:.]/i, markers) || block.split('\n')[0].trim();
      let questionPa = getField(/^PUN_Q:/i, markers);

      // Options Ingestion
      let optionAEn = "", optionBEn = "", optionCEn = "", optionDEn = "";
      let optionAPa = "", optionBPa = "", optionCPa = "", optionDPa = "";

      const engOptLine = getField(/^ENG_OPT:/i, markers);
      if (engOptLine && engOptLine.includes('|')) {
         const parts = engOptLine.split('|').map(p => p.trim());
         optionAEn = parts[0]?.replace(/^A\.\s*/i, '') || "";
         optionBEn = parts[1]?.replace(/^B\.\s*/i, '') || "";
         optionCEn = parts[2]?.replace(/^C\.\s*/i, '') || "";
         optionDEn = parts[3]?.replace(/^D\.\s*/i, '') || "";
      } else {
         optionAEn = getField(/^A[:.]/i, markers);
         optionBEn = getField(/^B[:.]/i, markers);
         optionCEn = getField(/^C[:.]/i, markers);
         optionDEn = getField(/^D[:.]/i, markers);
      }

      const punOptLine = getField(/^PUN_OPT:/i, markers);
      if (punOptLine && punOptLine.includes('|')) {
         const parts = punOptLine.split('|').map(p => p.trim());
         optionAPa = parts[0]?.replace(/^A\.\s*/i, '') || "";
         optionBPa = parts[1]?.replace(/^B\.\s*/i, '') || "";
         optionCPa = parts[2]?.replace(/^C\.\s*/i, '') || "";
         optionDPa = parts[3]?.replace(/^D\.\s*/i, '') || "";
      }

      // Answer
      const answerRaw = getField(/^(ENG_ANS|Answer|ANS)[:.]/i, markers);
      const correctAnswerMatch = answerRaw.match(/([A-D])/i);
      const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D' : undefined;

      // Explanation
      const explanationEn = getField(/^ENG_EXP:/i, markers) || getField(/^Explanation[:.]/i, markers);
      const explanationPa = getField(/^PUN_EXP:/i, markers);

      // Image
      const imageUrl = getField(/^(Image|IMAGE_URL)[:.]/i, markers);

      // Validation Node
      if (!questionEn && !questionPa) throw new Error(`Empty question statement.`);
      if (!correctAnswer) throw new Error(`Mismatched or missing correct answer.`);
      if (!optionAEn && !optionAPa) throw new Error(`Critical: Option A missing.`);

      questions.push({
        ...metadata,
        questionEn,
        questionPa: questionPa || questionEn,
        optionAEn,
        optionAPa: optionAPa || optionAEn,
        optionBEn,
        optionBPa: optionBPa || optionBEn,
        optionCEn,
        optionCPa: optionCPa || optionCEn,
        optionDEn,
        optionDPa: optionDPa || optionDEn,
        correctAnswer,
        explanationEn: explanationEn || "Verified institutional solution.",
        explanationPa: explanationPa || explanationEn || "ਵਿਵਸਥਿਤ ਹੱਲ।",
        imageUrl: imageUrl || "",
      });

    } catch (err: any) {
      errors.push(`Block ${index + 1}: ${err.message}`);
    }
  });

  return { questions, errors };
}
