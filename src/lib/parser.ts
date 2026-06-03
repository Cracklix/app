/**
 * @fileOverview Hardened Trilingual Bulk MCQ Extraction Engine.
 * Optimized for "Stacked Bilingual" formats and same-line mixed text.
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
  const lines = rawText.split('\n');
  const questions: Partial<Question>[] = [];
  let currentQuestion: any = null;
  
  let detectedTitle = "";
  let detectedDuration = 120;

  const enRegex = /[a-zA-Z]{2,}/;
  const paRegex = /[\u0A00-\u0A7F]/;

  const isQuestionStart = (line: string) => /^(Q\d+|Question\s*\d+|Q\.\s*\d+|\d+)[\.\:\)]/i.test(line.trim());
  const isOption = (line: string) => /^[A-D][\.\:\)]/i.test(line.trim());
  const isAnswer = (line: string) => /^(Answer|Key|Ans|Correct|Correct Answer|ਸਹੀ ਉੱਤਰ)[\:\-\s]/i.test(line.trim());
  const isExplanation = (line: string) => /^(Explanation|Solution|Rationale|Details|ਵਿਆਖਿਆ|Explanation \(English\)|ਵਿਆਖਿਆ \(ਪੰਜਾਬੀ\))[\:\-\s]/i.test(line.trim());
  const isSubject = (line: string) => /^(Subject|S\:|PART\-[A-Z]|Section)[\:\-\s]/i.test(line.trim());

  const mapSubject = (val: string): string => {
    const cleaned = val.toLowerCase();
    if (cleaned.includes('punjabi')) return 'punjabi-qualifying';
    if (cleaned.includes('gk') || cleaned.includes('history')) return 'punjab-history';
    if (cleaned.includes('polity') || cleaned.includes('current')) return 'gk-ca';
    if (cleaned.includes('math') || cleaned.includes('aptitude') || cleaned.includes('quantitative')) return 'math';
    if (cleaned.includes('reasoning')) return 'reasoning';
    if (cleaned.includes('english')) return 'english';
    if (cleaned.includes('computer') || cleaned.includes('it')) return 'ict';
    return metadata.subjectId || 'gk-ca';
  };

  let activeSubjectId = metadata.subjectId;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.includes('════════')) return;

    if (idx < 20) {
      if ((trimmed.toUpperCase().includes('MOCK TEST') || trimmed.toUpperCase().includes('EXAM')) && !detectedTitle) {
        detectedTitle = trimmed;
      }
      if (trimmed.toLowerCase().includes('time allowed') || trimmed.toLowerCase().includes('minutes')) {
        const match = trimmed.match(/\d+/);
        if (match) detectedDuration = parseInt(match[0]);
      }
    }

    if (isSubject(trimmed)) {
      const subjectName = trimmed.replace(/^(Subject|S\:|PART\-[A-Z]|Section)[\:\-\s]*/i, '');
      if (subjectName) activeSubjectId = mapSubject(subjectName);
      return;
    }

    if (isQuestionStart(trimmed)) {
      if (currentQuestion) questions.push(currentQuestion);
      currentQuestion = {
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
      
      let text = trimmed.replace(/^(Q\d+|Question\s*\d+|Q\.\s*\d+|\d+)[\.\:\)]\s*/i, '');
      
      // Split if mixed on same line
      if (enRegex.test(text) && paRegex.test(text)) {
        const firstPaIdx = text.search(/[\u0A00-\u0A7F]/);
        if (firstPaIdx > 0) {
          currentQuestion.questionEn = text.substring(0, firstPaIdx).trim();
          currentQuestion.questionPa = text.substring(firstPaIdx).trim();
        } else {
          currentQuestion.questionEn = text;
        }
      } else {
        currentQuestion.questionEn = text;
      }
    } else if (currentQuestion) {
      if (!isOption(trimmed) && !isAnswer(trimmed) && !isExplanation(trimmed)) {
        if (!currentQuestion.questionPa && paRegex.test(trimmed)) {
          currentQuestion.questionPa = trimmed;
        } else if (!currentQuestion.questionEn && enRegex.test(trimmed)) {
          currentQuestion.questionEn = trimmed;
        }
      } else if (isOption(trimmed)) {
        const char = trimmed[0].toUpperCase();
        const val = trimmed.substring(2).trim();
        if (currentQuestion[`option${char}En`]) {
          currentQuestion[`option${char}Pa`] = val;
        } else if (paRegex.test(val) && !enRegex.test(val)) {
          currentQuestion[`option${char}Pa`] = val;
        } else {
          currentQuestion[`option${char}En`] = val;
        }
      } else if (isAnswer(trimmed)) {
        const match = trimmed.match(/[A-D]/i);
        if (match) currentQuestion.correctAnswer = match[0].toUpperCase();
      } else if (isExplanation(trimmed)) {
        const expVal = trimmed.replace(/^(Explanation|Solution|Rationale|Details|ਵਿਆਖਿਆ|Explanation \(English\)|ਵਿਆਖਿਆ \(ਪੰਜਾਬੀ\))[\:\-\s]*/i, '');
        if (trimmed.toLowerCase().includes('punjabi') || trimmed.includes('ਵਿਆਖਿਆ')) {
          currentQuestion.explanationPa = expVal;
        } else {
          currentQuestion.explanationEn = expVal;
        }
      }
    }
  });

  if (currentQuestion) questions.push(currentQuestion);

  const finalized = questions.map(q => {
    // Strip trailing answer markers from questions
    const cleanEn = (q.questionEn || "").replace(/(Answer|Key|Ans|Correct|Correct Answer|ਸਹੀ ਉੱਤਰ)[\:\-\s]*$/i, '').trim();
    const cleanPa = (q.questionPa || "").replace(/(Answer|Key|Ans|Correct|Correct Answer|ਸਹੀ ਉੱਤਰ)[\:\-\s]*$/i, '').trim();
    
    return {
      ...q,
      questionEn: cleanEn,
      questionPa: cleanPa || cleanEn,
      optionAPa: q.optionAPa || q.optionAEn,
      optionBPa: q.optionBPa || q.optionBEn,
      optionCPa: q.optionCPa || q.optionCEn,
      optionDPa: q.optionDPa || q.optionDEn,
      explanationPa: q.explanationPa || q.explanationEn
    };
  });

  return {
    questions: finalized,
    mockMetadata: {
      title: detectedTitle || `Mock ${new Date().toLocaleDateString()}`,
      duration: detectedDuration,
      totalQuestions: finalized.length
    }
  };
}
