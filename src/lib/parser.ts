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
  // 1. Normalize and clean input
  let cleanedText = rawText.replace(/\r\n/g, '\n');
  
  // 2. Identify Sections and Questions
  // Aggressive splitting by question markers: Q101, Question 101, or a number at start of line
  // We use lookahead to split even if clumped like "...(Bilingual)Q101."
  const questionsSplitRegex = /(?=Q\s*\d+[\.\:\)]|Question\s*\d+[\.\:\)]|Q\.\s*\d+[\.\:\)]|(?:\n|^)\s*\d+[\.\:\)])/i;
  const blocks = cleanedText.split(questionsSplitRegex);
  
  const parsedQuestions: Partial<Question>[] = [];
  let currentActiveSubjectId = metadata.subjectId;
  let detectedTitle = "";
  let detectedDuration = metadata.duration;

  // Process first block for global meta (Title/Duration) if it doesn't look like a question
  const firstBlock = blocks[0]?.trim();
  if (firstBlock && !firstBlock.match(/^(Q\s*\d+|Question|Q\.)/i)) {
    const lines = firstBlock.split('\n');
    detectedTitle = lines[0].trim();
    const durationMatch = firstBlock.match(/(\d+)\s*(?:min|minute|minutes)/i);
    if (durationMatch) detectedDuration = parseInt(durationMatch[1]);
  }

  const enRegex = /[a-zA-Z]{3,}/; // English words usually have at least 3 letters
  const paRegex = /[\u0A00-\u0A7F]/; // Punjabi Gurmukhi range

  blocks.forEach((block) => {
    let text = block.trim();
    if (!text) return;

    // Check for section header in this block
    const sectionMatch = text.match(/(?:Section|Subject|PART|S)\s*(\d+|\w+)?\s*[\:\-]\s*([^\nQ]+)/i);
    if (sectionMatch) {
       const sectionName = sectionMatch[2].toLowerCase();
       if (sectionName.includes('punjabi')) currentActiveSubjectId = 'punjabi-qualifying';
       else if (sectionName.includes('gk') || sectionName.includes('history')) currentActiveSubjectId = 'punjab-history';
       else if (sectionName.includes('math') || sectionName.includes('quant')) currentActiveSubjectId = 'math';
       else if (sectionName.includes('reasoning') || sectionName.includes('mental')) currentActiveSubjectId = 'reasoning';
       else if (sectionName.includes('it') || sectionName.includes('computer')) currentActiveSubjectId = 'ict';
       else if (sectionName.includes('english')) currentActiveSubjectId = 'english';
    }

    // Skip if not a valid question block
    if (!text.match(/^(Q\s*\d+|Question|Q\.\s*\d+|\d+[\.\:\)])/i)) return;

    // Split block into Question, Options, Answer, Explanation
    const optionSplitRegex = /(?=A[\)\.\:\s\-\/]|B[\)\.\:\s\-\/]|C[\)\.\:\s\-\/]|D[\)\.\:\s\-\/])/;
    const answerSplitRegex = /(?=Correct Answer|Ans|Key|ਸਹੀ ਉੱਤਰ)/i;
    const explanationSplitRegex = /(?=Explanation|Solution|ਵਿਆਖਿਆ)/i;

    const parts = text.split(answerSplitRegex);
    const questionAndOptions = parts[0];
    const rest = parts.slice(1).join(' ');

    const answerAndExplanation = rest.split(explanationSplitRegex);
    const answerPart = answerAndExplanation[0];
    const explanationPart = answerAndExplanation.slice(1).join(' ');

    const questionParts = questionAndOptions.split(optionSplitRegex);
    const rawQuestionText = questionParts[0].replace(/^(Q\s*\d+|Question\s*\d+|Q\.\s*\d+|\d+)[\.\:\)]\s*/i, '').trim();
    const optionTexts = questionParts.slice(1);

    const question: any = {
      boardId: metadata.boardId,
      examId: metadata.examId,
      subjectId: currentActiveSubjectId,
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

    // 1. Split Question Text (Handle clumped En/Pa translations)
    if (enRegex.test(rawQuestionText) && paRegex.test(rawQuestionText)) {
      const firstPaIdx = rawQuestionText.search(/[\u0A00-\u0A7F]/);
      if (firstPaIdx > 0) {
        question.questionEn = rawQuestionText.substring(0, firstPaIdx).trim();
        question.questionPa = rawQuestionText.substring(firstPaIdx).trim();
      } else {
        question.questionEn = rawQuestionText;
        question.questionPa = rawQuestionText;
      }
    } else if (paRegex.test(rawQuestionText)) {
      question.questionPa = rawQuestionText;
    } else {
      question.questionEn = rawQuestionText;
    }

    // 2. Process Options (Handle clumped translations A) En A) Pa)
    optionTexts.forEach(opt => {
      const charMatch = opt.trim().match(/^([A-D])[\)\.\:\s\-\/]\s*(.*)/i);
      if (charMatch) {
        const char = charMatch[1].toUpperCase();
        const val = charMatch[2].trim();
        
        const isPa = paRegex.test(val);
        const isEn = enRegex.test(val);

        if (isPa && isEn) {
           const splitIdx = val.search(/[\u0A00-\u0A7F]/);
           question[`option${char}En`] = val.substring(0, splitIdx).trim();
           question[`option${char}Pa`] = val.substring(splitIdx).trim();
        } else if (isPa) {
           if (question[`option${char}Pa`]) question[`option${char}Pa`] += " " + val;
           else question[`option${char}Pa`] = val;
        } else {
           if (question[`option${char}En`]) question[`option${char}En`] += " " + val;
           else question[`option${char}En`] = val;
        }
      }
    });

    // 3. Process Correct Answer
    const ansMatch = answerPart.match(/[A-D]/i);
    if (ansMatch) question.correctAnswer = ansMatch[0].toUpperCase();

    // 4. Process Explanation
    const cleanExp = explanationPart.replace(/^(Explanation|Solution|ਵਿਆਖਿਆ)[\:\-\s\(\w\)]*/i, '').trim();
    if (paRegex.test(cleanExp) && enRegex.test(cleanExp)) {
       const splitIdx = cleanExp.search(/[\u0A00-\u0A7F]/);
       question.explanationEn = cleanExp.substring(0, splitIdx).trim();
       question.explanationPa = cleanExp.substring(splitIdx).trim();
    } else if (paRegex.test(cleanExp)) {
       question.explanationPa = cleanExp;
    } else {
       question.explanationEn = cleanExp;
    }

    // Final cleanups (ensure no fields are empty strings if possible)
    if (!question.questionPa) question.questionPa = question.questionEn;
    if (!question.questionEn) question.questionEn = question.questionPa;
    ['A','B','C','D'].forEach(c => {
       if (!question[`option${c}Pa`]) question[`option${c}Pa`] = question[`option${c}En`];
       if (!question[`option${c}En`]) question[`option${c}En`] = question[`option${c}Pa`];
    });
    if (!question.explanationPa) question.explanationPa = question.explanationEn;
    if (!question.explanationEn) question.explanationEn = question.explanationPa;

    parsedQuestions.push(question);
  });

  return {
    questions: parsedQuestions,
    mockMetadata: {
      title: detectedTitle,
      duration: detectedDuration,
      totalQuestions: parsedQuestions.length
    }
  };
}
