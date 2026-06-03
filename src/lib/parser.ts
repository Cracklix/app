
/**
 * @fileOverview Hardened Trilingual Bulk MCQ Extraction Engine.
 * Optimized for targeting specific language nodes (EN/PA/HI) and multi-subject pastes.
 * Uses a safe line-based state machine to prevent ReDoS hangs.
 */

import { Question, Difficulty } from "@/types";

export function parseBulkQuestions(
  rawText: string, 
  metadata: { boardId: string; examId: string; subjectId: string; difficulty: Difficulty; targetLang: "En" | "Pa" | "Hi" }
): Partial<Question>[] {
  const lines = rawText.split('\n');
  const questions: Partial<Question>[] = [];
  let currentQuestion: any = null;
  const lang = metadata.targetLang;

  const isQuestionStart = (line: string) => /^(Q\d+|Question\s*\d+|Q\.\s*\d+|\d+)[\.\:\)]/i.test(line.trim());
  const isOption = (line: string) => /^[A-D][\.\:\)]/i.test(line.trim());
  const isAnswer = (line: string) => /^(Answer|Key|Ans|Correct|Correct Answer)[\:\-]/i.test(line.trim());
  const isExplanation = (line: string) => /^(Explanation|Solution|Rationale|Details)[\:\-]/i.test(line.trim());
  const isSubject = (line: string) => /^(Subject|S\:)[\:\-]/i.test(line.trim());

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (isQuestionStart(trimmed)) {
      if (currentQuestion) questions.push(currentQuestion);
      currentQuestion = {
        boardId: metadata.boardId,
        examId: metadata.examId,
        subjectId: metadata.subjectId,
        difficulty: metadata.difficulty,
        correctAnswer: 'A',
        createdAt: new Date().toISOString()
      };
      currentQuestion[`question${lang}`] = trimmed.replace(/^(Q\d+|Question\s*\d+|Q\.\s*\d+|\d+)[\.\:\)]\s*/i, '');
    } else if (currentQuestion) {
      if (isOption(trimmed)) {
        const char = trimmed[0].toUpperCase();
        currentQuestion[`option${char}${lang}`] = trimmed.substring(2).trim();
      } else if (isAnswer(trimmed)) {
        const match = trimmed.match(/[A-D]/i);
        if (match) currentQuestion.correctAnswer = match[0].toUpperCase();
      } else if (isExplanation(trimmed)) {
        currentQuestion[`explanation${lang}`] = trimmed.replace(/^(Explanation|Solution|Rationale|Details)[\:\-]\s*/i, '');
      } else if (isSubject(trimmed)) {
        currentQuestion.subjectId = trimmed.replace(/^(Subject|S\:)[\:\-]\s*/i, '');
      } else {
        // Append to current question text if no prefix matches
        currentQuestion[`question${lang}`] += ' ' + trimmed;
      }
    }
  });

  if (currentQuestion) questions.push(currentQuestion);

  return questions.filter(q => q[`question${lang}`] && q[`optionA${lang}`]);
}
