export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CONTENT_MANAGER' | 'STUDENT';
export type MockType = 'FULL' | 'SUBJECT' | 'SECTIONAL' | 'CHAPTER' | 'PYQ' | 'CA_QUIZ';
export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type ExamType = 'punjab' | 'central';
export type SubscriptionTier = 'Free' | 'Silver' | 'Gold' | 'Premium';
export type CAQuizType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type QuestionType = 
  | 'MCQ' 
  | 'BILINGUAL_MCQ' 
  | 'PASSAGE' 
  | 'DI_TABLE' 
  | 'DI_CHART' 
  | 'MATCHING' 
  | 'ASSERTION_REASON';

export type DiagramType = 
  | 'none' 
  | 'image' 
  | 'table' 
  | 'pieChart' 
  | 'barGraph' 
  | 'lineGraph' 
  | 'map';

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
  duration?: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  name: string;
}

export interface Question {
  id?: string;
  board: string;
  exam: string;
  subject: string;
  chapter: string;
  language: string;
  difficulty: Difficulty;
  mockType?: MockType;

  questionEn: string;
  questionPa: string;

  optionAEn: string;
  optionAPa: string;
  optionBEn: string;
  optionBPa: string;
  optionCEn: string;
  optionCPa: string;
  optionDEn: string;
  optionDPa: string;

  correctAnswer: 'A' | 'B' | 'C' | 'D';

  explanationEn: string;
  explanationPa: string;

  imageUrl?: string;
  diagramType?: DiagramType;
  tableData?: any;
  chartConfig?: any;

  createdAt: any;
  updatedAt: any;
}

export interface MockTest {
  id: string;
  title: string;
  boardId: string;
  examId: string;
  mockType: MockType;
  duration: number;
  totalQuestions: number;
  questionIds: string[];
  difficulty: string;
  published: boolean;
  isPremium?: boolean;
  passingMarks?: number;
  negativeMarking?: number;
  instructions?: string;
  language?: string;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
  
  createdAt: any;
  updatedAt: any;
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
  status: SubscriptionTier;
  subscriptions?: string[]; 
}
