import { Exam, Mock, Question } from "@/types";

export const EXAMS: Exam[] = [
  {
    id: "psssb-patwari",
    title: "PSSSB Patwari",
    description: "Revenue Patwari, Canal Patwari and Zilladar exams for Punjab state.",
    category: "PSSSB",
    thumbnail: "exam-psssb",
    totalMocks: 45
  },
  {
    id: "punjab-police-si",
    title: "Punjab Police Sub Inspector",
    description: "Recruitment for Sub Inspectors in District, Armed and Intelligence cadres.",
    category: "Punjab Police",
    thumbnail: "exam-police",
    totalMocks: 30
  },
  {
    id: "ppsc-pcs",
    title: "PPSC PCS",
    description: "Punjab Civil Services - Executive and Allied services recruitment.",
    category: "PPSC",
    thumbnail: "exam-ppsc",
    totalMocks: 12
  },
  {
    id: "pstet",
    title: "PSTET Paper 1 & 2",
    description: "Punjab State Teacher Eligibility Test for primary and upper primary levels.",
    category: "Teaching",
    thumbnail: "exam-teaching",
    totalMocks: 25
  },
  {
    id: "pspcl-ldc",
    title: "PSPCL LDC & Clerk",
    description: "Lower Division Clerk and Junior Engineer positions in Punjab State Power Corporation.",
    category: "PSPCL",
    thumbnail: "exam-pspcl",
    totalMocks: 20
  },
  {
    id: "hc-clerk",
    title: "High Court Clerk",
    description: "Recruitment for Clerks in Subordinate Courts of Punjab and Haryana.",
    category: "High Court",
    thumbnail: "exam-hc",
    totalMocks: 15
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "p1",
    subject: "Punjabi Grammar",
    text: "ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਦੀ ਲਿਪੀ ਕਿਹੜੀ ਹੈ?",
    options: ["ਦੇਵਨਾਗਰੀ", "ਗੁਰਮੁਖੀ", "ਰੋਮਨ", "ਸ਼ਾਹਮੁਖੀ"],
    correctAnswer: "ਗੁਰਮੁਖੀ",
    difficulty: "Easy"
  },
  {
    id: "p2",
    subject: "Punjab GK",
    text: "Which city is known as the 'Steel City' of Punjab?",
    options: ["Ludhiana", "Mandi Gobindgarh", "Jalandhar", "Amritsar"],
    correctAnswer: "Mandi Gobindgarh",
    difficulty: "Medium"
  },
  {
    id: "p3",
    subject: "Reasoning",
    text: "If PUNJAB is coded as QVOKBC, how is POLICE coded?",
    options: ["QPMJDF", "QPMKDF", "QOMJDF", "QPMJDG"],
    correctAnswer: "QPMJDF",
    difficulty: "Medium"
  }
];

export const SAMPLE_MOCK: Mock = {
  id: "mock-punjab-1",
  examId: "psssb-patwari",
  title: "PSSSB Patwari Full Length Mock 01",
  durationInMinutes: 120,
  questions: MOCK_QUESTIONS,
  totalMarks: 100
};
