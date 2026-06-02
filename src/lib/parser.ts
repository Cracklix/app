
/**
 * @fileOverview Utility to parse raw text into structured MCQ objects.
 * Supports the format:
 * Q1. Question text
 * A. Option 1
 * B. Option 2
 * C. Option 3
 * D. Option 4
 * Answer: B
 * Explanation: Some text
 */

import { Question, Difficulty } from "@/types";

export function parseBulkQuestions(rawText: string, metadata: { subjectId: string; difficulty: Difficulty }): Partial<Question>[] {
  // Split by "Q" followed by a number and a dot
  const questionBlocks = rawText.split(/(?=Q\d+\.)/);
  
  return questionBlocks.map(block => {
    try {
      const textMatch = block.match(/Q\d+\.\s+([\s\S]*?)(?=[A-D]\.)/);
      const optionsMatches = [
        block.match(/A\.\s+([\s\S]*?)(?=B\.)/),
        block.match(/B\.\s+([\s\S]*?)(?=C\.)/),
        block.match(/C\.\s+([\s\S]*?)(?=D\.)/),
        block.match(/D\.\s+([\s\S]*?)(?=Answer:)/)
      ];
      const answerMatch = block.match(/Answer:\s*([A-D])/i);
      const explanationMatch = block.match(/Explanation:\s*([\s\S]*?)$/i);

      if (!textMatch || optionsMatches.some(m => !m) || !answerMatch) {
        return null as any;
      }

      const options = optionsMatches.map(m => m![1].trim());
      const answerChar = answerMatch[1].toUpperCase();
      const correctAnswer = ['A', 'B', 'C', 'D'].indexOf(answerChar);

      return {
        text: textMatch[1].trim(),
        options,
        correctAnswer,
        explanation: explanationMatch ? explanationMatch[1].trim() : "",
        subjectId: metadata.subjectId,
        difficulty: metadata.difficulty,
        topic: "Bulk Imported",
        createdAt: new Date().toISOString()
      };
    } catch (e) {
      console.error("Error parsing block", block, e);
      return null as any;
    }
  }).filter(q => q !== null);
}
