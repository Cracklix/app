/**
 * @fileOverview Institutional High-Fidelity Regex Parser v20.0.
 * Strictly enforces mandatory extraction of Bilingual Questions, Options, 
 * Correct Answer Codes, and Multi-line Explanations.
 */

import { Question } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
}

export function parseBulkQuestions(rawText: string, metadata: any): ParsedResults {
  const cleanRaw = "\n" + rawText.replace(/\r\n/g, '\n').trim();
  
  // Split by Q followed by a number (e.g. Q1., Q24.)
  const blocks = cleanRaw.split(/\n(?=Q\d+[\.\s])/g).filter(b => b.trim().length > 10);
  
  const results: Partial<Question>[] = [];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    try {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length < 5) return;

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

      // 1. Extract Question Lines
      q.questionEn = lines[0].replace(/^Q\d+[\.\s]*/i, '').trim();
      
      // The second line is usually the Punjabi version
      if (lines[1] && !lines[1].startsWith('(')) {
        q.questionPa = lines[1].replace(/^(ਪ੍ਰਸ਼ਨ|ਪ੍ਰਸ਼ਨ)\s*\d+[\.\s]*/, '').trim();
      }

      // 2. Extract Options (Strictly remove (A), (B) etc from stored value)
      const extractOption = (key: string) => {
        const line = lines.find(l => l.startsWith(`(${key})`));
        if (!line) return "";
        return line.replace(/^\([A-D]\)[\s\/-]*/i, '').trim();
      };

      q.optionAEn = extractOption('A');
      q.optionBEn = extractOption('B');
      q.optionCEn = extractOption('C');
      q.optionDEn = extractOption('D');

      // 3. Extract Correct Answer (Only store the letter)
      const ansLine = lines.find(l => /Correct Answer|ਸਹੀ ਉੱਤਰ/i.test(l));
      if (ansLine) {
        const match = ansLine.match(/Correct Answer[:\s]*\(?([A-D])\)?/i);
        if (match) q.correctAnswer = match[1].toUpperCase();
      }

      // 4. Extract Explanations (Vertical Block Preservation)
      const fullText = block.replace(/\r/g, '');
      
      const enMarker = "• English Explanation:";
      const paMarker = "• ਪੰਜਾਬੀ ਵਿਆਖਿਆ:";

      const enStart = fullText.indexOf(enMarker);
      const paStart = fullText.indexOf(paMarker);

      if (enStart !== -1 && paStart !== -1) {
        q.explanationEn = fullText.substring(enStart + enMarker.length, paStart).trim();
        q.explanationPa = fullText.substring(paStart + paMarker.length).trim();
      }

      // 5. Validation Rule
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
        errors.push(`Block ${index + 1}: Missing mandatory fields (Ensure Questions, A-D Options, Answer Key, and Both Explanations exist).`);
      }
    } catch (err: any) {
      errors.push(`Block ${index + 1}: Parsing rejection - ${err.message}`);
    }
  });

  return { questions: results, errors };
}
