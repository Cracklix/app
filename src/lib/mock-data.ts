import { Exam, Mock, Question, CurrentAffair, Notification } from "@/types";

export const EXAMS: Exam[] = [
  {
    id: "psssb-patwari",
    name: "Revenue Patwari",
    board: "PSSSB",
    description: "Prepare for Revenue Patwari, Canal Patwari and Ziladar recruitment for Punjab Government departments.",
    category: "Revenue",
    thumbnail: "exam-psssb",
    totalMocks: 45,
    activeQuestions: 1200,
    totalQuestions: 120,
    duration: 120
  },
  {
    id: "psssb-clerk",
    name: "Clerk (General/IT/Accounts)",
    board: "PSSSB",
    description: "Multi-departmental clerk recruitment exams with Punjabi qualifying sections.",
    category: "Clerical",
    thumbnail: "exam-psssb",
    totalMocks: 60,
    activeQuestions: 2500,
    totalQuestions: 120,
    duration: 120
  },
  {
    id: "ppsc-pcs",
    name: "Punjab Civil Services (PCS)",
    board: "PPSC",
    description: "Higher Class A & B services including Executive, DSP, and Tehsildar posts.",
    category: "Executive",
    thumbnail: "exam-ppsc",
    totalMocks: 20,
    activeQuestions: 5000,
    totalQuestions: 100,
    duration: 120
  },
  {
    id: "police-constable",
    name: "Punjab Police Constable",
    board: "Punjab Police",
    description: "District and Armed Cadre recruitment for the year 2026.",
    category: "Police",
    thumbnail: "exam-police",
    totalMocks: 50,
    activeQuestions: 3000,
    totalQuestions: 100,
    duration: 120
  },
  {
    id: "pstet",
    name: "PSTET (Paper 1 & 2)",
    board: "Education",
    description: "Punjab State Teacher Eligibility Test for Master Cadre and ETT recruitment.",
    category: "Teaching",
    thumbnail: "exam-teaching",
    totalMocks: 40,
    activeQuestions: 3500,
    totalQuestions: 150,
    duration: 150
  },
  {
    id: "hc-clerk",
    name: "High Court Clerk (SSSC)",
    board: "High Court",
    description: "Clerical recruitment for Subordinate Courts of Punjab and Haryana.",
    category: "Judicial",
    thumbnail: "exam-hc",
    totalMocks: 25,
    activeQuestions: 1200,
    totalQuestions: 100,
    duration: 120
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    topic: "Punjabi Grammar",
    subject: "Punjabi",
    question: "ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਦੀ ਲਿਪੀ ਕਿਹੜੀ ਹੈ?",
    options: ["ਦੇਵਨਾਗਰੀ", "ਗੁਰਮੁਖੀ", "ਰੋਮਨ", "ਸ਼ਾਹਮੁਖੀ"],
    correctAnswer: 1, 
    difficulty: "Easy",
    explanation: "ਗੁਰਮੁਖੀ ਲਿਪੀ ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਲਿਖਣ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।"
  },
  {
    id: "q2",
    topic: "Punjab GK",
    subject: "General Knowledge",
    question: "Which city is known as the 'Steel City' of Punjab?",
    options: ["Ludhiana", "Mandi Gobindgarh", "Jalandhar", "Amritsar"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "Mandi Gobindgarh is famous for its steel industry."
  },
  {
    id: "q3",
    topic: "Reasoning",
    subject: "Aptitude",
    question: "If PUNJAB is coded as QVOKBC, how is POLICE coded?",
    options: ["QPMJDF", "QPMKDF", "QOMJDF", "QPMJDG"],
    correctAnswer: 0,
    difficulty: "Medium",
    explanation: "Each letter is shifted by one position forward."
  },
  {
    id: "q4",
    topic: "History",
    subject: "General Knowledge",
    question: "Who was the first Guru of Sikhs?",
    options: ["Guru Nanak Dev Ji", "Guru Angad Dev Ji", "Guru Arjan Dev Ji", "Guru Gobind Singh Ji"],
    correctAnswer: 0,
    difficulty: "Easy",
    explanation: "Guru Nanak Dev Ji was the founder of Sikhism and the first Guru."
  },
  {
    id: "q5",
    topic: "Geography",
    subject: "General Knowledge",
    question: "Which river is known as the 'Backbone of Punjab'?",
    options: ["Sutlej", "Beas", "Ravi", "Chenab"],
    correctAnswer: 0,
    difficulty: "Easy",
    explanation: "The Sutlej river is the longest of the five rivers that flow through Punjab."
  },
  {
    id: "q6",
    topic: "Polity",
    subject: "Punjab GK",
    question: "How many members are there in the Punjab Legislative Assembly?",
    options: ["117", "110", "121", "105"],
    correctAnswer: 0,
    difficulty: "Medium",
    explanation: "The Punjab Vidhan Sabha consists of 117 members."
  },
  {
    id: "q7",
    topic: "Culture",
    subject: "Punjab GK",
    question: "Which dance is specifically performed by women in Punjab?",
    options: ["Bhangra", "Giddha", "Malwai Giddha", "Jhummar"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Giddha is a popular folk dance of women in the Punjab region."
  },
  {
    id: "q8",
    topic: "Economy",
    subject: "Punjab GK",
    question: "When was the Green Revolution started in Punjab?",
    options: ["1960s", "1970s", "1950s", "1980s"],
    correctAnswer: 0,
    difficulty: "Medium",
    explanation: "The Green Revolution in India was first introduced in Punjab in the late 1960s."
  }
];

export const SAMPLE_MOCK: Mock = {
  id: "mock-punjab-1",
  examId: "psssb-patwari",
  title: "PSSSB Patwari Full Length Mock 01",
  durationInMinutes: 120,
  questions: MOCK_QUESTIONS,
  totalMarks: 100,
  attempts: 1250
};

export const CURRENT_AFFAIRS: CurrentAffair[] = [
  {
    id: "ca1",
    title: "Punjab Cabinet approves new Industrial Policy 2026",
    date: "Oct 24, 2026",
    category: "Policy",
    summary: "The Punjab Cabinet chaired by the CM has approved the new Industrial and Business Development Policy to boost startups."
  },
  {
    id: "ca2",
    title: "New Wetland Protection Plan for Harike Pattan",
    date: "Oct 22, 2026",
    category: "Environment",
    summary: "A 50-crore conservation project announced to protect migratory birds at Harike Wetland."
  }
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Result Declared!",
    message: "Your score for PSSSB Mock 05 is now available.",
    time: "2 hours ago",
    isRead: false,
    type: "result"
  }
];
