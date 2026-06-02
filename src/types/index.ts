
export type Difficulty = 'easy' | 'medium' | 'hard';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT';
export type MockType = 'FULL' | 'SUBJECT' | 'SECTIONAL' | 'PYQ';

export interface Board {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  iconUrl?: string;
}

export interface Exam {
  id: string;
  boardId: string;
  name: string;
  category: string;
  description: string;
  totalMocks: number;
  activeQuestions: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
}

export interface Question {
  id: string;
  boardId: string;
  examId: string;
  subjectId: string;
  difficulty: Difficulty;

  // Bilingual Content
  questionEn: string;
  questionPa: string;

  // Options Mapping - English
  optionAEn: string;
  optionBEn: string;
  optionCEn: string;
  optionDEn: string;

  // Options Mapping - Punjabi
  optionAPa: string;
  optionBPa: string;
  optionCPa: string;
  optionDPa: string;

  correctAnswer: 'A' | 'B' | 'C' | 'D';

  explanationEn: string;
  explanationPa: string;

  createdAt: any;
  author?: string;
}

export interface MockTest {
  id: string;
  title: string;
  boardId: string;
  examId: string;
  subjectId?: string;
  mockType: MockType;
  duration: number;
  totalQuestions: number;
  questionIds: string[];
  difficulty: string;
  published: boolean;
  createdAt: any;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  state: 'Punjab';
  targetExam: string;
  createdAt: any;
  status: 'Pro' | 'Free';
}

export interface AttemptResult {
  id?: string;
  userId: string;
  mockId: string;
  mockTitle?: string;
  score: number;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  totalQuestions: number;
  timeTaken?: number;
  weakTopics: string[];
  timestamp: string;
  answers: Record<number, number>;
}
