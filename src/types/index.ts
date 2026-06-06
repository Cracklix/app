
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Mixed';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CONTENT_MANAGER' | 'STUDENT';
export type MockType = 'FULL' | 'SUBJECT' | 'SECTIONAL' | 'CHAPTER' | 'PYQ' | 'CA_QUIZ' | 'PRACTICE_SET';
export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type Gender = 'Male' | 'Female' | 'Other';
export type AccessType = 'FREE' | 'PREMIUM';
export type RegionType = 'Punjab' | 'National';
export type BoardCategory = 'PUNJAB_STATE' | 'TEACHING' | 'CENTRAL';
export type QuestionStatus = 'not-visited' | 'not-answered' | 'answered' | 'marked' | 'answered-marked';
export type ExamLanguage = 'en' | 'pa' | 'hi' | 'bilingual';

export interface Board {
  id: string;
  abbreviation: string;
  name: string;
  iconUrl: string;
  description: string;
  region: RegionType;
  category: BoardCategory;
}

export interface Subject {
  id: string;
  name: string;
  aliases: string[];
  description?: string;
  updatedAt: any;
}

export interface Exam {
  id: string;
  name: string;
  boardId: string;
  description: string;
  category: string;
  totalFullMocks: number;
  totalSubjects: number;
  totalPyqs: number;
  totalSectional: number;
  iconUrl?: string;
  updatedAt?: any;
}

export interface Pass {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  features: string[];
  allowedExams: string[]; 
  promotionBannerUrl?: string;
  active: boolean;
  displayOrder: number;
  recommended?: boolean;
  adFree: boolean;
  type: 'FREE' | 'PREMIUM';
  description?: string;
  updatedAt?: any;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: Gender;
  role: UserRole;
  state: 'Punjab';
  targetExam: string;
  createdAt: any;
  status: string; 
  subscriptions?: string[]; 
  passExpiryDate?: string;
}

export interface MockTest {
  id: string;
  title: string;
  boardId: string;
  examId: string;
  subjectId?: string;
  mockType: MockType;
  accessType: AccessType;
  passId?: string; 
  duration: number;
  totalQuestions: number;
  questionIds: string[];
  difficulty: string;
  status: ContentStatus;
  published: boolean;
  positiveMarks: number;
  negativeMarks: number;
  parts?: string[]; // e.g. ["PART A", "PART B"]
  createdAt: any;
  updatedAt: any;
}

export interface Question {
  id: string;
  partId?: string;
  sectionId?: string;
  englishQuestion: string;
  punjabiQuestion: string;
  hindiQuestion?: string;
  optionAEnglish: string;
  optionAPunjabi: string;
  optionAHindi?: string;
  optionBEnglish: string;
  optionBPunjabi: string;
  optionBHindi?: string;
  optionCEnglish: string;
  optionCPunjabi: string;
  optionCHindi?: string;
  optionDEnglish: string;
  optionDPunjabi: string;
  optionDHindi?: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  englishExplanation: string;
  punjabiExplanation: string;
  hindiExplanation?: string;
  subjectId: string;
  boardId: string;
  difficulty: Difficulty;
  isStandalone: boolean;
  status: ContentStatus;
  positiveMarks?: number;
  negativeMarks?: number;
  createdAt: any;
  updatedAt: any;
}

export interface AttemptState {
  answers: Record<number, number>; // index: optionIndex (0-3)
  status: Record<number, QuestionStatus>;
  visited: number[];
  bookmarks: number[];
  timeLeft: number;
  currentIdx: number;
  currentSectionId: string;
  currentPartId: string;
  violations?: number;
}
