/**
 * @fileOverview Production-Grade Institutional Ingestion Engine.
 * Supports Standard, Bilingual, Image-Based, and Current Affairs formats.
 */

import { Question, Difficulty, MockType, ContentStatus } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
  confidence: number;
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
    mockType?: MockType;
  }
): ParsedResults {
  const questions: Partial<Question>[] = [];
  const errors: string[] = [];
  
  // Normalize line endings and trim
  const text = rawText.replace(/\r\n/g, '\n').trim();
  
  // Split by [BLOCK_ID: or Q1. style markers
  const questionBlocks = text.split(/\[BLOCK_ID:.*?\]|Q\d+[:.]|Question \d+[:.]/i).filter(b => b.trim().length > 0);

  if (questionBlocks.length === 0) {
    return { questions: [], errors: ["No valid block markers detected. Use [BLOCK_ID: Q1] or Q1. format."], confidence: 0 };
  }

  questionBlocks.forEach((block, index) => {
    try {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      let questionEn = "";
      let questionPa = "";
      let optionAEn = "", optionBEn = "", optionCEn = "", optionDEn = "";
      let optionAPa = "", optionBPa = "", optionCPa = "", optionDPa = "";
      let correctAnswer: 'A' | 'B' | 'C' | 'D' | undefined;
      let explanationEn = "";
      let explanationPa = "";
      let imageUrl = "";

      // Logic to detect format and extract fields
      // Format 2 Detection (Bilingual Tags)
      const hasBilingualTags = block.includes("ENG_Q:") || block.includes("Question EN:");

      if (hasBilingualTags) {
        const getTagContent = (tag: string) => {
          const regex = new RegExp(`${tag}:?\\s*([\\s\\S]*?)(?=\\n[A-Z_\\d]+:?|$)`, 'i');
          const match = block.match(regex);
          return match ? match[1].trim() : "";
        };

        questionEn = getTagContent("ENG_Q") || getTagContent("Question EN");
        questionPa = getTagContent("PUN_Q") || getTagContent("Question PA");
        
        optionAEn = getTagContent("A EN") || getTagContent("ENG_OPT A");
        optionAPa = getTagContent("A PA") || getTagContent("PUN_OPT A");
        optionBEn = getTagContent("B EN") || getTagContent("ENG_OPT B");
        optionBPa = getTagContent("B PA") || getTagContent("PUN_OPT B");
        optionCEn = getTagContent("C EN") || getTagContent("ENG_OPT C");
        optionCPa = getTagContent("C PA") || getTagContent("PUN_OPT C");
        optionDEn = getTagContent("D EN") || getTagContent("ENG_OPT D");
        optionDPa = getTagContent("D PA") || getTagContent("PUN_OPT D");

        const ansRaw = getTagContent("Answer") || getTagContent("ENG_ANS");
        correctAnswer = ansRaw.match(/[A-D]/i)?.[0].toUpperCase() as any;

        explanationEn = getTagContent("Explanation EN") || getTagContent("ENG_EXP");
        explanationPa = getTagContent("Explanation PA") || getTagContent("PUN_EXP");
        imageUrl = getTagContent("Image");
      } else {
        // Format 1: Standard Sequential
        let currentField = "QUESTION";
        lines.forEach(line => {
          if (line.match(/^A\./i)) { optionAEn = line.replace(/^A\.\s*/i, ''); currentField = "OPT_A"; }
          else if (line.match(/^B\./i)) { optionBEn = line.replace(/^B\.\s*/i, ''); currentField = "OPT_B"; }
          else if (line.match(/^C\./i)) { optionCEn = line.replace(/^C\.\s*/i, ''); currentField = "OPT_C"; }
          else if (line.match(/^D\./i)) { optionDEn = line.replace(/^D\.\s*/i, ''); currentField = "OPT_D"; }
          else if (line.match(/^Answer:/i)) { 
            const match = line.match(/Answer:\s*([A-D])/i);
            if (match) correctAnswer = match[1].toUpperCase() as any;
          }
          else if (line.match(/^Explanation:/i)) { explanationEn = line.replace(/^Explanation:\s*/i, ''); currentField = "EXP"; }
          else if (line.match(/^Image:/i)) { imageUrl = line.replace(/^Image:\s*/i, ''); }
          else {
             if (currentField === "QUESTION") questionEn += (questionEn ? " " : "") + line;
             else if (currentField === "EXP") explanationEn += (explanationEn ? " " : "") + line;
          }
        });
      }

      // Validations
      if (!questionEn && !questionPa) throw new Error("Empty question statement.");
      if (!correctAnswer) throw new Error("Correct answer marker (A-D) not found.");
      if (!optionAEn && !optionAPa) throw new Error("Options missing. Format: A. [text] or A EN: [text]");

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
        correctAnswer: correctAnswer as any,
        explanationEn: explanationEn || "Self-explanatory.",
        explanationPa: explanationPa || explanationEn || "ਸਵੈ-ਵਿਆਖਿਆਤਮਕ।",
        imageUrl,
        isStandalone: true,
        status: metadata.status
      });

    } catch (err: any) {
      errors.push(`Block ${index + 1}: ${err.message}`);
    }
  });

  const confidence = Math.round((questions.length / (questions.length + errors.length)) * 100);
  return { questions, errors, confidence };
}
