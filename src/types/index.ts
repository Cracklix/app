
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT';

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
  subjectId: string;
  boardId?: string;
  examId?: string;
  topic: string;
  difficulty: Difficulty;
  
  // Bilingual Content
  textEn: string;
  textPa?: string;
  
  // Options Mapping
  optionsEn: string[]; // [A, B, C, D]
  optionsPa?: string[]; // [A, B, C, D]
  
  correctAnswer: number; // 0, 1, 2, 3
  
  explanationEn: string;
  explanationPa?: string;
  
  createdAt?: any;
  author?: string;
  lastModified?: any;
}

export interface MockTest {
  id: string;
  examId: string;
  title: string;
  duration: number;
  totalQuestions: number;
  questionIds: string[];
  attempts: number;
  difficulty?: Difficulty;
  type?: 'Full' | 'Subject' | 'Sectional' | 'PYQ';
  language?: string;
  createdAt?: any;
  publishedBy?: string;
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
  timeTaken?: number; // in seconds
  weakTopics: string[];
  timestamp: string;
  answers: Record<number, number>;
}
