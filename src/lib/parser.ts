/**
 * @fileOverview Institutional High-Fidelity Regex Parser v28.0.
 * Deterministic extraction with robust boundary detection and detailed validation.
 */

import { Question } from "@/types";

export interface ParsedResults {
  questions: any[];
  errors: string[];
}

export function parseBulkQuestions(rawText: string, metadata: any): ParsedResults {
  // Normalize line endings and add padding for regex splitting
  const text = "\n" + rawText.replace(/\r\n/g, '\n').trim() + "\n";
  
  // Split blocks using Q1. or Question 1 etc. (Case Insensitive)
  const blocks = text.split(/\n(?=(?:Q|Question)\s*\d+[\.\s])/i).filter(b => b.trim().length > 10);
  
  const results: any[] = [];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    try {
      const fullText = block.trim();
      const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      const q: any = { 
        ...metadata,
        id: `q-node-${Date.now()}-${index}`,
        status: metadata.status || "PUBLISHED",
        isStandalone: true,
        debug: {}
      };

      // 1. Identify Option A line to find Question parts
      const optionAIndex = lines.findIndex(l => /^\(A\)/i.test(l));
      
      if (optionAIndex !== -1) {
        // Line 0 is the EN Question Statement
        q.questionEn = lines[0].replace(/^(?:Q|Question)\s*\d+[\.\s]*/i, '').trim();
        // Lines between index 1 and Option A are PA Question Statement
        q.questionPa = lines.slice(1, optionAIndex).join('\n').trim();
      }

      q.debug.QuestionEnFound = q.questionEn ? "YES" : "NO";
      q.debug.QuestionPaFound = q.questionPa ? "YES" : "NO";

      // 2. Extract Options (A-D) - Support both multiline and inline (A) / (B)
      const extractOptionValue = (letter: string) => {
        const regex = new RegExp(`\\(${letter}\\)\\s*(.*)`, 'i');
        const line = lines.find(l => regex.test(l));
        if (line) {
          const match = line.match(regex);
          return match ? match[1].trim() : "";
        }
        return "";
      };

      q.optionAEn = extractOptionValue('A');
      q.optionBEn = extractOptionValue('B');
      q.optionCEn = extractOptionValue('C');
      q.optionDEn = extractOptionValue('D');

      q.debug.OptionAFound = q.optionAEn ? "YES" : "NO";
      q.debug.OptionBFound = q.optionBEn ? "YES" : "NO";
      q.debug.OptionCFound = q.optionCEn ? "YES" : "NO";
      q.debug.OptionDFound = q.optionDEn ? "YES" : "NO";

      // 3. Correct Answer Extraction (A-D)
      // Marker Variations: Correct Answer, Answer, Answer Key, Correct Option
      const ansMatch = fullText.match(/(?:Correct Answer|Answer|Answer Key|Correct Option)[:\s]*\(?([A-D])\)?/i);
      if (ansMatch) q.correctAnswer = ansMatch[1].toUpperCase();

      q.debug.CorrectAnswerFound = q.correctAnswer ? "YES" : "NO";

      // 4. Explanation Extraction (EN / PA)
      // Supports variations like English Logic, English Rationale, etc.
      const enMarkerRegex = /(?:•?\s*English\s+(?:Explanation|Logic|Rationale))/i;
      const paMarkerRegex = /(?:•?\s*(?:ਪੰਜਾਬੀ ਵਿਆਖਿਆ|Punjabi\s+(?:Explanation|Logic|Rationale)))/i;

      const enMatch = fullText.match(enMarkerRegex);
      const paMatch = fullText.match(paMarkerRegex);

      if (enMatch && paMatch) {
        const enStartIndex = fullText.indexOf(enMatch[0]) + enMatch[0].length;
        const paStartIndex = fullText.indexOf(paMatch[0]);
        
        q.explanationEn = fullText.substring(enStartIndex, paStartIndex).trim();
        
        const finalPaStartIndex = paStartIndex + paMatch[0].length;
        // From PA marker until the end of the block
        q.explanationPa = fullText.substring(finalPaStartIndex).trim();
      }

      q.debug.ExplanationEnFound = q.explanationEn ? "YES" : "NO";
      q.debug.ExplanationPaFound = q.explanationPa ? "YES" : "NO";

      // 5. Institutional Validation Protocol
      const missingFields = [];
      if (!q.questionEn) missingFields.push("English Question");
      if (!q.questionPa) missingFields.push("Punjabi Question");
      if (!q.optionAEn) missingFields.push("Option A");
      if (!q.optionBEn) missingFields.push("Option B");
      if (!q.optionCEn) missingFields.push("Option C");
      if (!q.optionDEn) missingFields.push("Option D");
      if (!q.correctAnswer) missingFields.push("Correct Answer");
      if (!q.explanationEn) missingFields.push("English Explanation");
      if (!q.explanationPa) missingFields.push("Punjabi Explanation");

      if (missingFields.length === 0) {
        results.push(q);
      } else {
        errors.push(`Block ${index + 1} Rejection: Missing ${missingFields.join(', ')}`);
      }
    } catch (err: any) {
      errors.push(`Block ${index + 1} Logic Error: ${err.message}`);
    }
  });

  return { questions: results, errors };
}
