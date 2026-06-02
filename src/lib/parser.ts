
/**
 * @fileOverview High-Fidelity MCQ Extraction Engine.
 * Optimized for Punjab Recruitment Board hierarchies (PSSSB, PPSC).
 */

import { Question, Difficulty } from "@/types";

export function parseBulkQuestions(
  rawText: string, 
  metadata: { boardId: string; examId: string; subjectId: string; difficulty: Difficulty }
): Partial<Question>[] {
  const normalizedText = rawText.replace(/\r\n/g, "\n").trim();
  
  // Advanced split logic for Q1., Question 1, Q.1)
  const questionBlocks = normalizedText.split(/(?=Q\d+[\.\:\)]|Question\s*\d+[\.\:\)]|Q\.\s*\d+[\.\:\)])/i);
  
  return questionBlocks.map(block => {
    try {
      if (!block.trim()) return null;

      // Extract Question Text
      const textMatch = block.match(/(?:Q\d+|Question\s*\d+|Q\.\s*\d+)[\.\:\)]?\s*([\s\S]*?)(?=[A-D][\.\:\)])/i);
      
      // Extract Options (A, B, C, D)
      const aMatch = block.match(/[A][\.\:\)]\s*([\s\S]*?)(?=[B][\.\:\)])/i);
      const bMatch = block.match(/[B][\.\:\)]\s*([\s\S]*?)(?=[C][\.\:\)])/i);
      const cMatch = block.match(/[C][\.\:\)]\s*([\s\S]*?)(?=[D][\.\:\)])/i);
      const dMatch = block.match(/[D][\.\:\)]\s*([\s\S]*?)(?=Answer:|$|Explanation:|Key:|Ans:)/i);

      // Extract Answer Label (A/B/C/D)
      const answerMatch = block.match(/(?:Answer|Key|Ans|Correct):\s*([A-D])/i);
      
      // Extract Rationale (Explanation)
      const explanationMatch = block.match(/(?:Explanation|Solution|Rationale):\s*([\s\S]*)$/i);

      if (!textMatch || !aMatch || !bMatch || !cMatch || !dMatch || !answerMatch) {
        return null;
      }

      return {
        questionEn: textMatch[1].trim(),
        optionAEn: aMatch[1].trim(),
        optionBEn: bMatch[1].trim(),
        optionCEn: cMatch[1].trim(),
        optionDEn: dMatch[1].trim(),
        correctAnswer: answerMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D',
        explanationEn: explanationMatch ? explanationMatch[1].trim() : "Verified institutional answer key as per official Punjab patterns.",
        boardId: metadata.boardId,
        examId: metadata.examId,
        subjectId: metadata.subjectId,
        difficulty: metadata.difficulty,
        author: "Cracklix Management",
        createdAt: new Date().toISOString()
      };
    } catch (e) {
      return null;
    }
  }).filter((q): q is Partial<Question> => q !== null);
}
