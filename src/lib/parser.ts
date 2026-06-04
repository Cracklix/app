/**
 * @fileOverview Institutional Multi-Format Ingestion Engine.
 * Supports: Columnar OCR Text, Structured JSON, and Standard MCQ templates.
 * Designed for Punjab Government exam papers (Bilingual EN/PA).
 */

import { Question, Difficulty, QuestionType } from "@/types";

export type ImportFormat = 
  | 'STANDARD_MCQ' 
  | 'BILINGUAL_MCQ' 
  | 'OCR_COLUMNAR' 
  | 'STRUCTURED_JSON'
  | 'DI_SET';

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
}

export function parseBulkQuestions(
  rawText: string, 
  format: ImportFormat,
  metadata: { 
    boardId: string; 
    examId: string; 
    subjectId: string; 
    topicId?: string;
    difficulty: Difficulty;
    status: any;
  }
): ParsedResults {
  if (format === 'STRUCTURED_JSON') {
    return parseStructuredJson(rawText, metadata);
  }

  const cleanedText = rawText.replace(/\r\n/g, '\n');
  // Split by Question marker (Q1, Q.1, 1., etc)
  const blocks = cleanedText.split(/(?=(?:Q|Question)\s*\d+[\.\:\)]|^\d+[\.\)])/gm).filter(b => b.trim().length > 10);
  
  const parsedQuestions: Partial<Question>[] = [];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 3) return;

    const qNumMatch = lines[0].match(/(?:Q|Question)?\s*(\d+)/i);
    const qNum = qNumMatch ? qNumMatch[1] : (index + 1).toString();

    let questionEn = "";
    let questionPa = "";
    let optionAEn = "", optionAPa = "";
    let optionBEn = "", optionBPa = "";
    let optionCEn = "", optionCPa = "";
    let optionDEn = "", optionDPa = "";
    let ans = "";
    let expEn = "";
    let expPa = "";

    if (format === 'OCR_COLUMNAR') {
      // Specialized Column-Aware Parsing
      const enBuffer: string[] = [];
      const paBuffer: string[] = [];
      const opts: Record<string, {en: string, pa: string}> = { A: {en:'', pa:''}, B: {en:'', pa:''}, C: {en:'', pa:''}, D: {en:'', pa:''} };

      lines.forEach(line => {
        const parts = line.split(/\s{4,}/);
        if (parts.length >= 2) {
          const left = parts[0].trim();
          const right = parts[1].trim();

          const optMatch = left.match(/^([A-D])[\.\)]\s+(.*)/i);
          if (optMatch) {
            const letter = optMatch[1].toUpperCase();
            opts[letter].en = optMatch[2];
            opts[letter].pa = right.replace(/^[A-D][\.\)]\s+/i, '').trim();
          } else if (left.match(/^(?:Q|Question)?\s*\d+[\.\:\)]/i)) {
            enBuffer.push(left.replace(/^(?:Q|Question)?\s*\d+[\.\:\)]\s*/i, '').trim());
            paBuffer.push(right.replace(/^(?:Q|Question)?\s*\d+[\.\:\)]\s*/i, '').trim());
          } else {
            enBuffer.push(left);
            paBuffer.push(right);
          }
        }
      });

      questionEn = enBuffer.join(' ').trim();
      questionPa = paBuffer.join(' ').trim();
      optionAEn = opts.A.en; optionAPa = opts.A.pa;
      optionBEn = opts.B.en; optionBPa = opts.B.pa;
      optionCEn = opts.C.en; optionCPa = opts.C.pa;
      optionDEn = opts.D.en; optionDPa = opts.D.pa;
    } else {
      // Handle standard and bunched layouts (A) ... B) ... on one line)
      const fullText = lines.join(' ');
      
      // Extract Question Statement
      const statementMatch = fullText.match(/(?:(?:Q|Question)\s*\d+[\.\:\)]|^\d+[\.\)])\s*(.*?)(?=A[\.\)])/i);
      questionEn = statementMatch ? statementMatch[1].trim() : lines[0].replace(/^(?:Q|Question)?\s*\d+[\.\:\)]\s*/i, '').trim();

      // Extract Options (handles both single line and multiple line)
      const extractOpt = (letter: string, nextLetter: string | null) => {
        const regex = new RegExp(`${letter}[\\.\\)]\\s*(.*?)(?=${nextLetter ? nextLetter + '[\\.\\)]' : 'Correct Answer|ਸਹੀ ਉੱਤਰ|Explanation|ਵਿਆਖਿਆ'})`, 'i');
        const match = fullText.match(regex);
        return match ? match[1].trim() : "";
      };

      optionAEn = extractOpt('A', 'B');
      optionBEn = extractOpt('B', 'C');
      optionCEn = extractOpt('C', 'D');
      optionDEn = extractOpt('D', null);

      // Default Punjabi to English if missing in standard mode
      questionPa = questionEn;
      optionAPa = optionAEn; optionBPa = optionBEn; optionCPa = optionCEn; optionDPa = optionDEn;
    }

    // Answer & Rationale Detection
    const ansMatch = block.match(/(?:Correct Answer|ਸਹੀ ਉੱਤਰ)[\.\:\s]*([A-D])/i);
    ans = ansMatch ? ansMatch[1].toUpperCase() : "";

    const expMatch = block.match(/(?:Explanation|ਵਿਆਖਿਆ)[\.\:\s]*(.*?)(?=$|Q\d+)/is);
    expEn = expMatch ? expMatch[1].trim() : "Verified Solution";

    // Validation
    const qErrors: string[] = [];
    if (!questionEn) qErrors.push(`Missing Statement`);
    if (!optionAEn) qErrors.push(`Missing Options`);
    if (!ans) qErrors.push(`Missing Correct Answer (A-D)`);

    if (qErrors.length > 0) {
      errors.push(`Question ${qNum}: ${qErrors.join(', ')}`);
    } else {
      parsedQuestions.push({
        ...metadata,
        id: `node-${qNum}-${Date.now()}`,
        questionEn, questionPa,
        optionAEn, optionAPa, optionBEn, optionBPa,
        optionCEn, optionCPa, optionDEn, optionDPa,
        correctAnswer: ans as any,
        explanationEn: expEn,
        explanationPa: expEn,
        status: metadata.status || 'PUBLISHED',
        questionType: format === 'BILINGUAL_MCQ' || format === 'OCR_COLUMNAR' ? 'BILINGUAL_MCQ' : 'MCQ',
        diagramType: 'none',
        isStandalone: true
      });
    }
  });

  return { questions: parsedQuestions, errors };
}

function parseStructuredJson(raw: string, metadata: any): ParsedResults {
  try {
    const data = JSON.parse(raw);
    const questions: Partial<Question>[] = [];
    if (data.document?.pages) {
      data.document.pages.forEach((page: any) => {
        page.blocks.forEach((block: any) => {
          if (block.type === 'TEXT') {
            questions.push({
              ...metadata,
              id: `ocr-${block.block_id}-${Date.now()}`,
              questionEn: block.text,
              questionPa: block.text,
              optionAEn: "Imported via OCR JSON",
              optionAPa: "Imported via OCR JSON",
              correctAnswer: 'A',
              explanationEn: `Structured OCR Input. Confidence: ${block.confidence}`,
              status: metadata.status || 'PUBLISHED',
              isStandalone: true
            });
          }
        });
      });
    }
    return { questions, errors: [] };
  } catch (e) {
    return { questions: [], errors: ["Invalid Structured JSON Format"] };
  }
}
