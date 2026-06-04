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

export interface PatternSection {
  name: string;
  count: number;
  subjectId: string;
}

export interface ExamPattern {
  id: string;
  examId: string;
  examName: string;
  totalQuestions: number;
  duration: number;
  negativeMarking: boolean;
  sections: PatternSection[];
}

export interface Question {
  id: string;
  boardId: string;
  examId: string;
  subjectId: string;
  chapterId?: string;
  difficulty: Difficulty;
  status: ContentStatus;
  questionType: QuestionType;
  
  // Content Node
  questionEn: string;
  questionPa: string;
  
  // Metadata Text
  instructionEn?: string;
  instructionPa?: string;
  passageEn?: string;
  passagePa?: string;
  
  // Options
  optionAEn: string;
  optionBEn: string;
  optionCEn: string;
  optionDEn: string;
  optionAPa: string;
  optionBPa: string;
  optionCPa: string;
  optionDPa: string;
  
  // Logic
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanationEn: string;
  explanationPa: string;
  
  // Visual/DI Nodes
  diagramType: DiagramType;
  imageUrl?: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  chartConfig?: {
    type: 'bar' | 'pie' | 'line';
    labels: string[];
    values: number[];
  };

  createdAt: any;
  updatedAt?: any;
  isStandalone?: boolean;
}

export interface MockTest {
  id: string;
  title: string;
  boardId: string;
  examId: string;
  mockType: MockType;
  examType: ExamType;
  duration: number;
  totalQuestions: number;
  questionIds: string[];
  difficulty: string;
  published: boolean;
  isPremium?: boolean;
  status: ContentStatus;
  
  // CMS Metadata
  subjectId?: string;
  chapterId?: string;
  year?: number;
  paperName?: string;
  caCategory?: string;
  caQuizType?: CAQuizType;
  
  createdAt: any;
  updatedAt?: any;
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
