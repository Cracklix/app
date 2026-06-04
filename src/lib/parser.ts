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
  const blocks = cleanedText.split(/(?=Q\d+[\.\:])/g).filter(b => b.trim().length > 0);
  
  const parsedQuestions: Partial<Question>[] = [];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 3) return;

    const qNumMatch = lines[0].match(/Q(\d+)/i);
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
      // Split each line into two columns by multiple spaces
      const colLines = block.split('\n').filter(l => l.trim());
      const enBuffer: string[] = [];
      const paBuffer: string[] = [];
      const opts: Record<string, {en: string, pa: string}> = { A: {en:'', pa:''}, B: {en:'', pa:''}, C: {en:'', pa:''}, D: {en:'', pa:''} };

      colLines.forEach(line => {
        // Detect Column Split (usually 5+ spaces)
        const parts = line.split(/\s{5,}/);
        if (parts.length >= 2) {
          const left = parts[0].trim();
          const right = parts[1].trim();

          // Check for Option Markers
          const optMatch = left.match(/^([A-D])\.\s+(.*)/i);
          if (optMatch) {
            const letter = optMatch[1].toUpperCase();
            opts[letter].en = optMatch[2];
            opts[letter].pa = right.replace(/^[A-D]\.\s+/i, '').trim();
          } else if (left.startsWith('Q')) {
            enBuffer.push(left.replace(/^Q\d+[\.\:]\s*/i, '').trim());
            paBuffer.push(right.replace(/^Q\d+[\.\:]\s*/i, '').trim());
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
    } else if (format === 'BILINGUAL_MCQ') {
      // Standard Line-Based Bilingual
      questionEn = lines[0].replace(/^Q\d+[\.\:]\s*/i, '').trim();
      questionPa = lines[1] || "";

      const extractPair = (letter: string) => {
        const marker = `${letter})`;
        const matches = lines.filter(l => l.startsWith(marker)).map(l => l.replace(new RegExp(`^${letter}\\)\\s*`, 'i'), '').trim());
        return { en: matches[0] || "", pa: matches[1] || matches[0] || "" };
      };

      const pairA = extractPair('A'); const pairB = extractPair('B');
      const pairC = extractPair('C'); const pairD = extractPair('D');

      optionAEn = pairA.en; optionAPa = pairA.pa;
      optionBEn = pairB.en; optionBPa = pairB.pa;
      optionCEn = pairC.en; optionCPa = pairC.pa;
      optionDEn = pairD.en; optionDPa = pairD.pa;
    } else {
      // Standard English
      questionEn = lines[0].replace(/^Q\d+[\.\:]\s*/i, '').trim();
      const findSingle = (letter: string) => {
        const line = lines.find(l => l.toUpperCase().startsWith(letter.toUpperCase() + ')'));
        return line ? line.replace(new RegExp(`^${letter}\\)\\s*`, 'i'), '').trim() : "";
      };
      optionAEn = findSingle('A'); optionBEn = findSingle('B');
      optionCEn = findSingle('C'); optionDEn = findSingle('D');
    }

    // Answer & Rationale Detection
    const findMarkerContent = (marker: string) => {
      const idx = lines.findIndex(l => l.toLowerCase().includes(marker.toLowerCase()));
      if (idx === -1) return "";
      const line = lines[idx];
      return line.includes(':') ? line.split(':')[1].trim() : lines[idx + 1] || "";
    };

    const ansFull = findMarkerContent('Correct Answer') || findMarkerContent('ਸਹੀ ਉੱਤਰ');
    ans = ansFull?.match(/^[A-D]/i)?.[0].toUpperCase() || "";

    const getBlock = (marker: string) => {
      const idx = lines.findIndex(l => l.toLowerCase().includes(marker.toLowerCase()));
      if (idx === -1) return "";
      const content = [];
      const headerLine = lines[idx];
      if (headerLine.includes(':')) content.push(headerLine.split(':')[1].trim());
      for (let i = idx + 1; i < lines.length; i++) {
        if (lines[i].match(/Correct Answer|ਸਹੀ ਉੱਤਰ|Explanation|ਵਿਆਖਿਆ|^Q\d+/i)) break;
        content.push(lines[i]);
      }
      return content.join('\n').trim();
    };

    expEn = getBlock('Explanation (English)');
    expPa = getBlock('ਵਿਆਖਿਆ (ਪੰਜਾਬੀ)');

    // Institutional Validation
    const qErrors: string[] = [];
    if (!questionEn) qErrors.push(`Missing Statement`);
    if (!optionAEn) qErrors.push(`Missing Options`);
    if (!ans) qErrors.push(`Missing Correct Answer (A-D)`);

    if (qErrors.length > 0) {
      qErrors.forEach(err => errors.push(`Question ${qNum}: ${err}`));
    } else {
      parsedQuestions.push({
        ...metadata,
        id: `node-${qNum}-${Date.now()}`,
        questionEn, questionPa,
        optionAEn, optionAPa, optionBEn, optionBPa,
        optionCEn, optionCPa, optionDEn, optionDPa,
        correctAnswer: ans as any,
        explanationEn: expEn || "Verified Solution",
        explanationPa: expPa,
        status: metadata.status || 'PUBLISHED',
        questionType: (format === 'BILINGUAL_MCQ' || format === 'OCR_COLUMNAR') ? 'BILINGUAL_MCQ' : 'MCQ',
        diagramType: format === 'DI_SET' ? 'table' : 'none'
      });
    }
  });

  return { questions: errors.length > 0 ? [] : parsedQuestions, errors };
}

function parseStructuredJson(raw: string, metadata: any): ParsedResults {
  try {
    const data = JSON.parse(raw);
    const questions: Partial<Question>[] = [];
    // Handle the document.pages.blocks structure from documentation
    if (data.document?.pages) {
      data.document.pages.forEach((page: any) => {
        page.blocks.forEach((block: any) => {
          if (block.type === 'TEXT') {
            questions.push({
              ...metadata,
              id: `ocr-${block.block_id}-${Date.now()}`,
              questionEn: block.text,
              optionAEn: "Imported via OCR JSON",
              correctAnswer: 'A',
              explanationEn: `Structured OCR Input. Confidence: ${block.confidence}`,
              status: metadata.status || 'PUBLISHED'
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
