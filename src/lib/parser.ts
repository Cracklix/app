/**
 * @fileOverview Hardened Trilingual Bulk MCQ Extraction Engine.
 * Optimized for "Stacked Bilingual" formats where English and Punjabi are pasted together.
 * Supports auto-detection of Mock Metadata (Title, Time) and Section/Part headers.
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
  let detectedTotal = 0;

  const isQuestionStart = (line: string) => /^(Q\d+|Question\s*\d+|Q\.\s*\d+|\d+)[\.\:\)]/i.test(line.trim());
  const isOption = (line: string) => /^[A-D][\.\:\)]/i.test(line.trim());
  const isAnswer = (line: string) => /^(Answer|Key|Ans|Correct|Correct Answer|ਸਹੀ ਉੱਤਰ)[\:\-\s]/i.test(line.trim());
  const isExplanation = (line: string) => /^(Explanation|Solution|Rationale|Details|ਵਿਆਖਿਆ|Explanation \(English\)|ਵਿਆਖਿਆ \(ਪੰਜਾਬੀ\))[\:\-\s]/i.test(line.trim());
  const isSubject = (line: string) => /^(Subject|S\:|PART\-[A-Z]|Section)[\:\-\s]/i.test(line.trim());

  // Subject ID mapping helper
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

    // Look for Mock Metadata in the first 20 lines
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
        questionEn: "",
        questionPa: "",
        optionAEn: "", optionAPa: "",
        optionBEn: "", optionBPa: "",
        optionCEn: "", optionCPa: "",
        optionDEn: "", optionDPa: "",
        explanationEn: "",
        explanationPa: ""
      };
      currentQuestion.questionEn = trimmed.replace(/^(Q\d+|Question\s*\d+|Q\.\s*\d+|\d+)[\.\:\)]\s*/i, '');
    } else if (currentQuestion) {
      // Logic for stacked bilingual: second line of question is Punjabi
      if (!isOption(trimmed) && !isAnswer(trimmed) && !isExplanation(trimmed) && !currentQuestion.questionPa && currentQuestion.questionEn) {
         currentQuestion.questionPa = trimmed;
      } else if (isOption(trimmed)) {
        const char = trimmed[0].toUpperCase();
        const optionVal = trimmed.substring(2).trim();
        // If English option already exists, assign to Punjabi
        if (currentQuestion[`option${char}En`]) {
           currentQuestion[`option${char}Pa`] = optionVal;
        } else {
           currentQuestion[`option${char}En`] = optionVal;
        }
      } else if (isAnswer(trimmed)) {
        const match = trimmed.match(/[A-D]/i);
        if (match) currentQuestion.correctAnswer = match[0].toUpperCase();
      } else if (isExplanation(trimmed)) {
        const expVal = trimmed.replace(/^(Explanation|Solution|Rationale|Details|ਵਿਆਖਿਆ|Explanation \(English\)|ਵਿਆਖਿਆ \(ਪੰਜਾਬੀ\))[\:\-\s]*/i, '');
        // Detect if explanation is English or Punjabi based on keyword
        if (trimmed.toLowerCase().includes('punjabi') || trimmed.includes('ਵਿਆਖਿਆ')) {
           currentQuestion.explanationPa = expVal;
        } else {
           currentQuestion.explanationEn = expVal;
        }
      } else {
        // Appending logic for multi-line
        if (currentQuestion.explanationPa) {
           currentQuestion.explanationPa += '\n' + trimmed;
        } else if (currentQuestion.explanationEn) {
           currentQuestion.explanationEn += '\n' + trimmed;
        }
      }
    }
  });

  if (currentQuestion) questions.push(currentQuestion);

  // Post-process: If Pa fields are empty, copy En (fallback)
  const finalized = questions.map(q => ({
    ...q,
    questionPa: q.questionPa || q.questionEn,
    optionAPa: q.optionAPa || q.optionAEn,
    optionBPa: q.optionBPa || q.optionBEn,
    optionCPa: q.optionCPa || q.optionCEn,
    optionDPa: q.optionDPa || q.optionDEn,
    explanationPa: q.explanationPa || q.explanationEn
  }));

  return {
    questions: finalized,
    mockMetadata: {
      title: detectedTitle || `Mock ${new Date().toLocaleDateString()}`,
      duration: detectedDuration,
      totalQuestions: finalized.length
    }
  };
}
