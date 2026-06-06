
import { create } from 'zustand';
import { AttemptState, ExamLanguage, QuestionStatus, Question } from '@/types';
import { Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ExamStore extends AttemptState {
  questions: Question[];
  mockId: string;
  userId: string;
  language: ExamLanguage;
  isPaused: boolean;
  isSubmitting: boolean;

  // Actions
  initExam: (mockId: string, userId: string, questions: Question[], duration: number, savedState?: Partial<AttemptState>) => void;
  setLanguage: (lang: ExamLanguage) => void;
  setPaused: (paused: boolean) => void;
  setCurrentIdx: (idx: number) => void;
  setAnswer: (idx: number, optionIdx: number | null) => void;
  toggleBookmark: (idx: number) => void;
  markForReview: (idx: number) => void;
  saveAndNext: () => void;
  tick: () => void;
  syncToFirestore: (db: Firestore) => Promise<void>;
  addViolation: () => void;
}

export const useExamStore = create<ExamStore>((set, get) => ({
  questions: [],
  mockId: '',
  userId: '',
  language: 'bilingual',
  isPaused: false,
  isSubmitting: false,

  answers: {},
  status: {},
  visited: [0],
  bookmarks: [],
  timeLeft: 0,
  currentIdx: 0,
  currentSectionId: '',
  currentPartId: '',
  violations: 0,

  initExam: (mockId, userId, questions, duration, savedState) => {
    set({
      mockId,
      userId,
      questions,
      timeLeft: duration * 60,
      ...savedState,
      currentPartId: questions[savedState?.currentIdx || 0]?.partId || 'PART A',
      currentSectionId: questions[savedState?.currentIdx || 0]?.subjectId || '',
    });
  },

  setLanguage: (language) => set({ language }),
  setPaused: (isPaused) => set({ isPaused }),
  setCurrentIdx: (currentIdx) => {
    const { visited, questions } = get();
    const q = questions[currentIdx];
    set({ 
      currentIdx, 
      visited: Array.from(new Set([...visited, currentIdx])),
      currentPartId: q?.partId || 'PART A',
      currentSectionId: q?.subjectId || ''
    });
  },

  setAnswer: (idx, optionIdx) => {
    const { answers, status } = get();
    const newAnswers = { ...answers };
    const newStatus = { ...status };

    if (optionIdx === null) {
      delete newAnswers[idx];
      newStatus[idx] = 'not-answered';
    } else {
      newAnswers[idx] = optionIdx;
      newStatus[idx] = 'answered';
    }

    set({ answers: newAnswers, status: newStatus });
  },

  toggleBookmark: (idx) => {
    const { bookmarks } = get();
    const newBookmarks = bookmarks.includes(idx) 
      ? bookmarks.filter(i => i !== idx) 
      : [...bookmarks, idx];
    set({ bookmarks: newBookmarks });
  },

  markForReview: (idx) => {
    const { status, answers } = get();
    const newStatus = { ...status };
    const hasAnswer = answers[idx] !== undefined;
    newStatus[idx] = hasAnswer ? 'answered-marked' : 'marked';
    set({ status: newStatus });
    get().saveAndNext();
  },

  saveAndNext: () => {
    const { currentIdx, questions } = get();
    if (currentIdx < questions.length - 1) {
      get().setCurrentIdx(currentIdx + 1);
    }
  },

  tick: () => {
    const { timeLeft, isPaused, isSubmitting } = get();
    if (!isPaused && !isSubmitting && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    }
  },

  addViolation: () => set(state => ({ violations: (state.violations || 0) + 1 })),

  syncToFirestore: async (db) => {
    const { userId, mockId, answers, status, visited, bookmarks, timeLeft, currentIdx, violations } = get();
    if (!userId || !mockId) return;

    const attemptRef = doc(db, 'attempts', `${userId}_${mockId}`);
    await setDoc(attemptRef, {
      userId,
      mockId,
      answers,
      status,
      visited,
      bookmarks,
      timeLeft,
      currentIdx,
      violations,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
}));
