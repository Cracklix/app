
/**
 * @fileOverview Institutional-grade MCQ parser for Cracklix.
 * Parses raw text documents into structured Firestore-ready Question objects.
 */

import { Question, Difficulty } from "@/types";

export function parseBulkQuestions(rawText: string, metadata: { subjectId: string; difficulty: Difficulty }): Partial<Question>[] {
  // Normalize line endings
  const normalizedText = rawText.replace(/\r\n/g, "\n").trim();
  
  // Split by "Q" followed by a number and a dot, or "Question"
  const questionBlocks = normalizedText.split(/(?=Q\d+\.|Question\s*\d+\.|Q\.\s*\d+\.)/);
  
  return questionBlocks.map(block => {
    try {
      if (!block.trim()) return null;

      // Extract Question Text: From "Q1." to the first option "A."
      const textMatch = block.match(/(?:Q\d+\.|Question\s*\d+|Q\.\s*\d+)\.?\s*([\s\S]*?)(?=[A-D]\.)/i);
      
      // Extract Options: A, B, C, D
      const aMatch = block.match(/A\.\s*([\s\S]*?)(?=B\.)/i);
      const bMatch = block.match(/B\.\s*([\s\S]*?)(?=C\.)/i);
      const cMatch = block.match(/C\.\s*([\s\S]*?)(?=D\.)/i);
      const dMatch = block.match(/D\.\s*([\s\S]*?)(?=Answer:|$)/i);

      // Extract Answer: A/B/C/D
      const answerMatch = block.match(/Answer:\s*([A-D])/i);
      
      // Extract Explanation: Everything after "Explanation:"
      const explanationMatch = block.match(/Explanation:\s*([\s\S]*)$/i);

      if (!textMatch || !aMatch || !bMatch || !cMatch || !dMatch || !answerMatch) {
        console.warn("Skipping malformed block:", block.slice(0, 100));
        return null;
      }

      const options = [
        aMatch[1].trim(),
        bMatch[1].trim(),
        cMatch[1].trim(),
        dMatch[1].trim()
      ];
      
      const answerChar = answerMatch[1].toUpperCase();
      const correctAnswer = ['A', 'B', 'C', 'D'].indexOf(answerChar);

      return {
        text: textMatch[1].trim(),
        options,
        correctAnswer,
        explanation: explanationMatch ? explanationMatch[1].trim() : "Detailed logic for this high-fidelity MCQ.",
        subjectId: metadata.subjectId || "general",
        difficulty: metadata.difficulty,
        topic: "Institutional Bulk Import",
        createdAt: new Date().toISOString(),
        author: "Arsh Grewal"
      };
    } catch (e) {
      console.error("Critical error parsing block", e);
      return null;
    }
  }).filter((q): q is Partial<Question> => q !== null);
}
