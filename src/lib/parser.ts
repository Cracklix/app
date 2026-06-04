/**
 * @fileOverview Ultimate Production-Grade Institutional Ingestion Engine.
 * Supports: MCQ, Image MCQ, Matching, Assertion-Reason, DI Sets, Passage Sets, and CA.
 */

import { Question, Difficulty, MockType, ContentStatus, QuestionType, DiagramType } from "@/types";

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
  
  // Normalized text for consistent parsing
  const text = rawText.replace(/\r\n/g, '\n').trim();
  
  // Use === or QUESTION_TYPE as primary block separators
  const blocks = text.split(/(?:={3,}|QUESTION_TYPE:)/i)
    .map(b => b.trim())
    .filter(b => b.length > 0);

  if (blocks.length === 0) {
    return { questions: [], errors: ["No valid content blocks detected. Use === to separate questions."], confidence: 0 };
  }

  blocks.forEach((block, index) => {
    try {
      // Re-inject tag if split removed it
      const content = block.toUpperCase().includes('QUESTION_EN') ? block : `QUESTION_TYPE: ${block}`;
      
      const getTag = (tag: string) => {
        const regex = new RegExp(`${tag}:?\\s*([\\s\\S]*?)(?=\\n[A-Z_\\d\\s]+:?|$)`, 'i');
        const match = content.match(regex);
        return match ? match[1].trim() : "";
      };

      const qTypeRaw = getTag("QUESTION_TYPE") || "MCQ";
      const qType = qTypeRaw.toUpperCase() as QuestionType;
      
      const questionEn = getTag("QUESTION_EN");
      const questionPa = getTag("QUESTION_PA");
      
      const optAEn = getTag("OPTION_A_EN");
      const optAPa = getTag("OPTION_A_PA");
      const optBEn = getTag("OPTION_B_EN");
      const optBPa = getTag("OPTION_B_PA");
      const optCEn = getTag("OPTION_C_EN");
      const optCPa = getTag("OPTION_C_PA");
      const optDEn = getTag("OPTION_D_EN");
      const optDPa = getTag("OPTION_D_PA");

      const ansRaw = getTag("ANSWER");
      const correctAnswer = (ansRaw.match(/[A-D]/i)?.[0].toUpperCase() || "A") as 'A' | 'B' | 'C' | 'D';
      
      const explanationEn = getTag("EXPLANATION_EN");
      const explanationPa = getTag("EXPLANATION_PA");
      
      const imageUrl = getTag("IMAGE_URL");
      const tableDataRaw = getTag("TABLE_DATA");
      const diSetId = getTag("DI_SET_ID");
      const passageId = getTag("PASSAGE_ID");
      const passageEn = getTag("PASSAGE_EN");
      const passagePa = getTag("PASSAGE_PA");
      
      const date = getTag("DATE");
      const category = getTag("CATEGORY");
      const title = getTag("TITLE");
      const description = getTag("DESCRIPTION");

      // Handle DI Table Data Parsing (Pipe | Separated)
      let tableData = undefined;
      if (tableDataRaw) {
        try {
          const lines = tableDataRaw.split('\n').filter(l => l.trim().length > 0);
          if (lines.length > 0) {
            const headers = lines[0].split('|').map(h => h.trim());
            const rows = lines.slice(1).map(r => r.split('|').map(c => c.trim()));
            tableData = { headers, rows };
          }
        } catch (e) {
          errors.push(`Block ${index + 1}: Failed to parse TABLE_DATA format.`);
        }
      }

      // Logic Mapping for Diagram Type
      let dType: DiagramType = 'none';
      if (imageUrl) dType = 'image';
      if (tableData) dType = 'table';

      // Advanced Type Mapping
      let finalQType = qType;
      if (imageUrl && qType === 'MCQ') finalQType = 'IMAGE_MCQ';
      if (tableData && qType === 'MCQ') finalQType = 'TABLE_MCQ';

      // Validation Node
      if (!questionEn && !passageEn && !title) {
        throw new Error("Missing content statement. Ensure QUESTION_EN or PASSAGE_EN exists.");
      }

      questions.push({
        ...metadata,
        id: `q-${Date.now()}-${index}`,
        questionType: finalQType,
        diagramType: dType,
        parentSetId: diSetId || undefined,
        passageId: passageId || undefined,
        
        questionEn: questionEn || title || "",
        questionPa: questionPa || questionEn || "",
        
        instructionEn: description || undefined,
        passageEn: passageEn || undefined,
        passagePa: passagePa || undefined,

        optionAEn: optAEn || "Option A",
        optionAPa: optAPa || optAEn || "ਵਿਕਲਪ A",
        optionBEn: optBEn || "Option B",
        optionBPa: optBPa || optBEn || "ਵਿਕਲਪ B",
        optionCEn: optCEn || "Option C",
        optionCPa: optCPa || optCEn || "ਵਿਕਲਪ C",
        optionDEn: optDEn || "Option D",
        optionDPa: optDPa || optDEn || "ਵਿਕਲਪ D",

        correctAnswer,
        explanationEn: explanationEn || "Strategic Rationale in English",
        explanationPa: explanationPa || explanationEn || "ਵਿਆਖਿਆ ਪੰਜਾਬੀ ਵਿੱਚ",
        
        imageUrl,
        tableData,
        date,
        category,
        
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
