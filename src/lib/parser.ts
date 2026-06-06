/**
 * @fileOverview Institutional High-Fidelity Regex Parser v25.0.
 * Strictly enforces mandatory extraction of Bilingual Questions, Combined Options, 
 * Correct Answer Codes, and Multi-line Explanations.
 */

import { Question } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
}

export function parseBulkQuestions(rawText: string, metadata: any): ParsedResults {
  const cleanRaw = "\n" + rawText.replace(/\r\n/g, '\n').trim() + "\n";
  
  // Split by Q followed by a number (e.g. Q1., Q24.)
  const blocks = cleanRaw.split(/\n(?=Q\d+[\.\s])/g).filter(b => b.trim().length > 10);
  
  const results: Partial<Question>[] = [];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    try {
      const fullText = block.trim();
      const lines = fullText.split('\n').map(l => l.trim());
      
      const q: any = { 
        ...metadata,
        id: `q-node-${Date.now()}-${index}`,
        status: metadata.status || "PUBLISHED",
        isStandalone: true,
        questionEn: "",
        questionPa: "",
        optionAEn: "",
        optionBEn: "",
        optionCEn: "",
        optionDEn: "",
        correctAnswer: "",
        explanationEn: "",
        explanationPa: ""
      };

      // 1. Extract Question Lines (Lines 1 and 2)
      q.questionEn = lines[0].replace(/^Q\d+[\.\s]*/i, '').trim();
      if (lines[1] && !lines[1].startsWith('(')) {
        q.questionPa = lines[1].replace(/^(ਪ੍ਰਸ਼ਨ|ਪ੍ਰਸ਼ਨ)\s*\d+[\.\s]*/, '').trim();
      }

      // 2. Extract Options (Combined EN/PA strings)
      const extractOptionValue = (letter: string) => {
        // Regex looks for (A) followed by text until the next option marker or newline
        const regex = new RegExp(`\\(${letter}\\)\\s*([^\\n\\(]+)`, 'i');
        const match = fullText.match(regex);
        return match ? match[1].trim() : "";
      };

      q.optionAEn = extractOptionValue('A');
      q.optionBEn = extractOptionValue('B');
      q.optionCEn = extractOptionValue('C');
      q.optionDEn = extractOptionValue('D');

      // 3. Extract Correct Answer Code (Store only A, B, C, or D)
      const ansMatch = fullText.match(/Correct Answer[:\s]*\(?([A-D])\)?/i);
      if (ansMatch) q.correctAnswer = ansMatch[1].toUpperCase();

      // 4. Extract Explanations (Vertical Block Preservation)
      const enMarker = "• English Explanation:";
      const paMarker = "• ਪੰਜਾਬੀ ਵਿਆਖਿਆ:";

      const enIndex = fullText.indexOf(enMarker);
      const paIndex = fullText.indexOf(paMarker);

      if (enIndex !== -1 && paIndex !== -1) {
        q.explanationEn = fullText.substring(enIndex + enMarker.length, paIndex).trim();
        q.explanationPa = fullText.substring(paIndex + paMarker.length).trim();
      }

      // 5. Institutional Validation Rule
      const isValid = 
        q.questionEn && 
        q.questionPa && 
        q.optionAEn && 
        q.optionBEn && 
        q.optionCEn && 
        q.optionDEn && 
        q.correctAnswer && 
        q.explanationEn && 
        q.explanationPa;

      if (isValid) {
        results.push(q);
      } else {
        errors.push(`Block ${index + 1}: Missing mandatory fields. Check Q, PA statement, Options A-D, Answer Key, and both Explanation markers.`);
      }
    } catch (err: any) {
      errors.push(`Block ${index + 1}: Parsing rejection - ${err.message}`);
    }
  });

  return { questions: results, errors };
}
