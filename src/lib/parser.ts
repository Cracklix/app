/**
 * @fileOverview Hardened Trilingual Bulk MCQ Extraction Engine.
 * Optimized for "Densely Packed" formats where options and answers are on the same line.
 */

import { Question, Difficulty } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  mockMetadata?: {
    title?: string;
    duration?: number;
    totalQuestions?: number;
  };
}

export function parseBulkQuestions(
  rawText: string, 
  metadata: { boardId: string; examId: string; subjectId: string; difficulty: Difficulty }
): ParsedResults {
  // Normalize text: handle line breaks and common dense patterns
  const normalizedText = rawText.replace(/\r\n/g, '\n').replace(/\n\s*\n/g, '\n');
  const sections = normalizedText.split(/(?=Q\d+[\.\:\)]|Question\s*\d+[\.\:\)]|Q\.\s*\d+[\.\:\)]|\n\d+[\.\:\)])/i);
  
  const questions: Partial<Question>[] = [];
  let detectedTitle = "";
  let detectedDuration = 120;
  let activeSubjectId = metadata.subjectId;

  // Detect Global Meta in the first block
  const firstBlock = sections[0];
  if (firstBlock && !firstBlock.match(/^(Q\d+|Question|Q\.)/i)) {
    if (firstBlock.toLowerCase().includes('time allowed') || firstBlock.toLowerCase().includes('minutes')) {
      const match = firstBlock.match(/\d+/);
      if (match) detectedDuration = parseInt(match[0]);
    }
    const lines = firstBlock.split('\n');
    detectedTitle = lines[0].trim();
  }

  const enRegex = /[a-zA-Z]{2,}/;
  const paRegex = /[\u0A00-\u0A7F]/;

  const mapSubject = (val: string): string => {
    const cleaned = val.toLowerCase();
    if (cleaned.includes('punjabi')) return 'punjabi-qualifying';
    if (cleaned.includes('gk') || cleaned.includes('history')) return 'punjab-history';
    if (cleaned.includes('polity') || cleaned.includes('current')) return 'gk-ca';
    if (cleaned.includes('math') || cleaned.includes('aptitude') || cleaned.includes('quantitative') || cleaned.includes('arithmetic')) return 'math';
    if (cleaned.includes('reasoning') || cleaned.includes('mental')) return 'reasoning';
    if (cleaned.includes('english')) return 'english';
    if (cleaned.includes('computer') || cleaned.includes('it') || cleaned.includes('ict')) return 'ict';
    return activeSubjectId || metadata.subjectId || 'gk-ca';
  };

  sections.forEach((block) => {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) return;

    // Check for mid-block Section headers
    const sectionMatch = trimmedBlock.match(/(?:Section|Subject|PART|S)\s*(\d+|\w+)?\s*[\:\-]\s*([^\nQ]+)/i);
    if (sectionMatch) {
      activeSubjectId = mapSubject(sectionMatch[2]);
    }

    if (!trimmedBlock.match(/^(Q\d+|Question|Q\.\s*\d+|\d+[\.\:\)])/i)) return;

    // Split block into major components: Question/Options, Answer, Explanation
    const parts = trimmedBlock.split(/(?=Correct Answer|Ans|Key|ਸਹੀ ਉੱਤਰ|Explanation|Solution|ਵਿਆਖਿਆ)/i);
    const mainPart = parts[0];
    const answerPart = parts.find(p => p.match(/^(Correct Answer|Ans|Key|ਸਹੀ ਉੱਤਰ)/i)) || "";
    const explanationPart = parts.find(p => p.match(/^(Explanation|Solution|ਵਿਆਖਿਆ)/i)) || "";

    const currentQuestion: any = {
      boardId: metadata.boardId,
      examId: metadata.examId,
      subjectId: activeSubjectId || 'gk-ca',
      difficulty: metadata.difficulty,
      correctAnswer: 'A',
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
      questionEn: "", questionPa: "",
      optionAEn: "", optionAPa: "",
      optionBEn: "", optionBPa: "",
      optionCEn: "", optionCPa: "",
      optionDEn: "", optionDPa: "",
      explanationEn: "", explanationPa: ""
    };

    // 1. Extract Question Text (handle dense English/Punjabi stacking)
    const questionLines = mainPart.split(/(?=A[\)\.\:\s]|B[\)\.\:\s]|C[\)\.\:\s]|D[\)\.\:\s])/);
    const rawQuestionText = questionLines[0].replace(/^(Q\d+|Question\s*\d+|Q\.\s*\d+|\d+)[\.\:\)]\s*/i, '').trim();
    
    if (enRegex.test(rawQuestionText) && paRegex.test(rawQuestionText)) {
      // Find the boundary between En and Pa
      const firstPaIdx = rawQuestionText.search(/[\u0A00-\u0A7F]/);
      if (firstPaIdx > 0) {
        currentQuestion.questionEn = rawQuestionText.substring(0, firstPaIdx).trim();
        currentQuestion.questionPa = rawQuestionText.substring(firstPaIdx).trim();
      } else {
        currentQuestion.questionEn = rawQuestionText;
      }
    } else if (paRegex.test(rawQuestionText)) {
      currentQuestion.questionPa = rawQuestionText;
    } else {
      currentQuestion.questionEn = rawQuestionText;
    }

    // 2. Extract Options (handle dense A) B) C) D) on same line)
    const optionText = mainPart.substring(mainPart.indexOf(questionLines[0]) + questionLines[0].length);
    const optionMatches = optionText.split(/(?=[A-D][\)\.\:\s])/);
    
    optionMatches.forEach(opt => {
      const charMatch = opt.trim().match(/^([A-D])[\)\.\:\s]\s*(.*)/i);
      if (charMatch) {
        const char = charMatch[1].toUpperCase();
        const text = charMatch[2].trim();
        
        if (enRegex.test(text) && paRegex.test(text)) {
           const splitIdx = text.search(/[\u0A00-\u0A7F]/);
           currentQuestion[`option${char}En`] = text.substring(0, splitIdx).trim();
           currentQuestion[`option${char}Pa`] = text.substring(splitIdx).trim();
        } else if (paRegex.test(text)) {
           currentQuestion[`option${char}Pa`] = text;
        } else {
           currentQuestion[`option${char}En`] = text;
        }
      }
    });

    // 3. Extract Correct Answer
    const ansMatch = answerPart.match(/[A-D]/i);
    if (ansMatch) currentQuestion.correctAnswer = ansMatch[0].toUpperCase();

    // 4. Extract Explanation
    const cleanExp = explanationPart.replace(/^(Explanation|Solution|ਵਿਆਖਿਆ)[\:\-\s]*/i, '').trim();
    if (paRegex.test(cleanExp) && enRegex.test(cleanExp)) {
      const splitIdx = cleanExp.search(/[\u0A00-\u0A7F]/);
      currentQuestion.explanationEn = cleanExp.substring(0, splitIdx).trim();
      currentQuestion.explanationPa = cleanExp.substring(splitIdx).trim();
    } else if (paRegex.test(cleanExp)) {
      currentQuestion.explanationPa = cleanExp;
    } else {
      currentQuestion.explanationEn = cleanExp;
    }

    // Final Sanity Fix
    if (!currentQuestion.questionPa) currentQuestion.questionPa = currentQuestion.questionEn;
    ['A','B','C','D'].forEach(c => {
      if (!currentQuestion[`option${c}Pa`]) currentQuestion[`option${c}Pa`] = currentQuestion[`option${c}En`];
      if (!currentQuestion[`option${c}En`]) currentQuestion[`option${c}En`] = currentQuestion[`option${c}Pa`];
    });
    if (!currentQuestion.explanationPa) currentQuestion.explanationPa = currentQuestion.explanationEn;

    questions.push(currentQuestion);
  });

  return {
    questions,
    mockMetadata: {
      title: detectedTitle || `Institutional Mock ${new Date().toLocaleDateString()}`,
      duration: detectedDuration,
      totalQuestions: questions.length
    }
  };
}
