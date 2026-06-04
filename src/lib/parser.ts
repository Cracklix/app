/**
 * @fileOverview Institutional Ultimate Hybrid Ingestion Engine.
 * Supports: 
 * 1. Simple Format (Q1. Text, A., B., C., D., Answer: B)
 * 2. High-Fidelity Tagged Format (QUESTION_TYPE: ..., QUESTION_EN: ..., etc.)
 * 3. Contextual Sets (DI_SET, PASSAGE)
 */

import { Question, Difficulty, ContentStatus, QuestionType, DiagramType } from "@/types";

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
  }
): ParsedResults {
  const questions: Partial<Question>[] = [];
  const errors: string[] = [];
  
  const text = rawText.replace(/\r\n/g, '\n').trim();
  
  // Split by specific markers
  const blocks = text.split(/(?:={3,}|(?=\nQUESTION_TYPE:)|(?=\nQ\d+\.)|(?=\n\d+\.))/i)
    .map(b => b.trim())
    .filter(b => b.length > 5);

  if (blocks.length === 0) {
    return { questions: [], errors: ["No valid content blocks detected. Check delimiters (===)."], confidence: 0 };
  }

  blocks.forEach((block, index) => {
    try {
      const isTaggedFormat = block.toUpperCase().includes('QUESTION_TYPE:') || block.toUpperCase().includes('QUESTION_EN:');
      
      let parsed: Partial<Question>;

      if (isTaggedFormat) {
        parsed = parseTaggedBlock(block, metadata);
      } else {
        parsed = parseSimpleBlock(block, metadata);
      }

      // Final validation
      if (!parsed.questionEn && parsed.questionType !== 'DI_SET' && parsed.questionType !== 'PASSAGE') {
        throw new Error("Could not identify question statement (QUESTION_EN missing).");
      }

      questions.push({
        ...parsed,
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

function parseTaggedBlock(block: string, metadata: any): Partial<Question> {
  const getTag = (tag: string) => {
    const regex = new RegExp(`${tag}:?\\s*([\\s\\S]*?)(?=\\n[A-Z_\\d\\s]+:?|$)`, 'i');
    const match = block.match(regex);
    return match ? match[1].trim() : null;
  };

  const qType = (getTag("QUESTION_TYPE") || "MCQ").toUpperCase() as QuestionType;
  const ansRaw = getTag("ANSWER") || getTag("CORRECT_ANSWER");
  const correctAnswer = (ansRaw?.match(/[A-D]/i)?.[0].toUpperCase() || "A") as 'A' | 'B' | 'C' | 'D';

  const tableDataRaw = getTag("TABLE_DATA");
  let tableData = null;
  if (tableDataRaw) {
    const lines = tableDataRaw.split('\n').filter(l => l.includes('|'));
    if (lines.length > 0) {
      const headers = lines[0].split('|').map(h => h.trim());
      const rows = lines.slice(1).map(r => r.split('|').map(c => c.trim()));
      tableData = { headers, rows };
    }
  }

  return {
    ...metadata,
    questionType: qType,
    diagramType: getTag("IMAGE_URL") ? 'image' : tableData ? 'table' : 'none',
    diSetId: getTag("DI_SET_ID"),
    passageId: getTag("PASSAGE_ID"),
    
    questionEn: getTag("QUESTION_EN") || getTag("TITLE"),
    questionPa: getTag("QUESTION_PA") || getTag("QUESTION_EN") || "",
    
    optionAEn: getTag("OPTION_A_EN") || "Option A",
    optionAPa: getTag("OPTION_A_PA") || getTag("OPTION_A_EN") || "",
    optionBEn: getTag("OPTION_B_EN") || "Option B",
    optionBPa: getTag("OPTION_B_PA") || getTag("OPTION_B_EN") || "",
    optionCEn: getTag("OPTION_C_EN") || "Option C",
    optionCPa: getTag("OPTION_C_PA") || getTag("OPTION_C_EN") || "",
    optionDEn: getTag("OPTION_D_EN") || "Option D",
    optionDPa: getTag("OPTION_D_PA") || getTag("OPTION_D_EN") || "",
    
    correctAnswer,
    explanationEn: getTag("EXPLANATION_EN") || "Solution registry pending.",
    explanationPa: getTag("EXPLANATION_PA") || getTag("EXPLANATION_EN") || "",
    
    imageUrl: getTag("IMAGE_URL"),
    passageEn: getTag("PASSAGE_EN"),
    passagePa: getTag("PASSAGE_PA"),
    instructionEn: getTag("INSTRUCTION_EN"),
    instructionPa: getTag("INSTRUCTION_PA"),
    
    titleEn: getTag("TITLE_EN") || getTag("TITLE"),
    titlePa: getTag("TITLE_PA"),
    descriptionEn: getTag("DESCRIPTION_EN") || getTag("DESCRIPTION"),
    descriptionPa: getTag("DESCRIPTION_PA"),
    
    tableData,
    date: getTag("DATE"),
    category: getTag("CATEGORY"),
    year: parseInt(getTag("YEAR") || "2026")
  };
}

function parseSimpleBlock(block: string, metadata: any): Partial<Question> {
  const cleanBlock = block.replace(/^(?:Q?\d+[\.\)]\s*)/i, '').trim();
  const parts = cleanBlock.split(/(?=\n[A-D][\.\)]\s*|Answer:\s*|Explanation:\s*)/i);
  
  const questionEn = parts[0]?.trim();
  
  const findPart = (prefix: string) => {
    return parts.find(p => p.trim().toLowerCase().startsWith(prefix.toLowerCase()))
      ?.replace(new RegExp(`^${prefix}[\\.\\)]?\\s*`, 'i'), '').trim() || null;
  };

  const optA = findPart("A") || "Option A";
  const optB = findPart("B") || "Option B";
  const optC = findPart("C") || "Option C";
  const optD = findPart("D") || "Option D";
  const ans = findPart("Answer") || "A";
  const exp = findPart("Explanation") || "Rationale provided.";

  const correctAnswer = (ans.match(/[A-D]/i)?.[0].toUpperCase() || "A") as 'A' | 'B' | 'C' | 'D';

  return {
    ...metadata,
    questionType: 'MCQ',
    diagramType: 'none',
    questionEn,
    questionPa: questionEn, // Fallback
    optionAEn: optA,
    optionAPa: optA,
    optionBEn: optB,
    optionBPa: optB,
    optionCEn: optC,
    optionCPa: optC,
    optionDEn: optD,
    optionDPa: optD,
    correctAnswer,
    explanationEn: exp,
    explanationPa: exp,
    imageUrl: null,
    tableData: null
  };
}
