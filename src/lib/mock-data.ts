import { Exam, Mock, Question, CurrentAffair, Notification } from "@/types";

export const EXAMS: Exam[] = [
  // 1. PSSSB
  {
    id: "psssb-patwari",
    title: "PSSSB Patwari",
    description: "Revenue Patwari, Canal Patwari and Ziladar recruitment for Punjab.",
    category: "PSSSB",
    thumbnail: "exam-psssb",
    totalMocks: 45,
    activeQuestions: 1200
  },
  {
    id: "psssb-clerk",
    title: "PSSSB Clerk (General/IT/Accounts)",
    description: "Comprehensive preparation for Clerk, Clerk IT and Clerk Accounts posts.",
    category: "PSSSB",
    thumbnail: "exam-psssb",
    totalMocks: 60,
    activeQuestions: 2200
  },
  {
    id: "psssb-excise",
    title: "Excise & Taxation Inspector",
    description: "High-level mock series for Group B non-gazetted inspector posts.",
    category: "PSSSB",
    thumbnail: "exam-psssb",
    totalMocks: 25,
    activeQuestions: 1500
  },
  {
    id: "psssb-forest-guard",
    title: "Forest Guard & Forester",
    description: "Physical and written exam preparation for Punjab Forest department.",
    category: "PSSSB",
    thumbnail: "exam-psssb",
    totalMocks: 20,
    activeQuestions: 1000
  },

  // 2. PPSC
  {
    id: "ppsc-pcs",
    title: "Punjab Civil Services (PCS)",
    description: "Executive, DSP, Tehsildar and Allied services recruitment.",
    category: "PPSC",
    thumbnail: "exam-ppsc",
    totalMocks: 12,
    activeQuestions: 5000
  },
  {
    id: "ppsc-naib-tehsildar",
    title: "Naib Tehsildar",
    description: "Specialized series for one of Punjab's most competitive Class 2 exams.",
    category: "PPSC",
    thumbnail: "exam-ppsc",
    totalMocks: 15,
    activeQuestions: 1800
  },
  {
    id: "ppsc-je",
    title: "Junior Engineer (JE) - Civil/Mech/Elec",
    description: "Technical and Non-technical mock tests for PPSC JE posts.",
    category: "PPSC",
    thumbnail: "exam-ppsc",
    totalMocks: 30,
    activeQuestions: 2500
  },

  // 3. Punjab Police
  {
    id: "police-constable",
    title: "Punjab Police Constable",
    description: "District and Armed Cadre recruitment sessions.",
    category: "Punjab Police",
    thumbnail: "exam-police",
    totalMocks: 40,
    activeQuestions: 2000
  },
  {
    id: "police-si",
    title: "Punjab Police Sub-Inspector (SI)",
    description: "District, Armed and Investigation cadre preparation.",
    category: "Punjab Police",
    thumbnail: "exam-police",
    totalMocks: 35,
    activeQuestions: 2800
  },
  {
    id: "police-ia",
    title: "Intelligence Assistant (IA)",
    description: "Specialized computer and GK tests for Intelligence cadre.",
    category: "Punjab Police",
    thumbnail: "exam-police",
    totalMocks: 20,
    activeQuestions: 1200
  },

  // 4. Teaching / School Education
  {
    id: "pstet",
    title: "PSTET Paper 1 & 2",
    description: "Punjab State Teacher Eligibility Test for all levels.",
    category: "Teaching Exams",
    thumbnail: "exam-teaching",
    totalMocks: 50,
    activeQuestions: 3000
  },
  {
    id: "master-cadre",
    title: "Master Cadre (All Subjects)",
    description: "Subject-wise preparation for Maths, Science, SS, and Punjabi.",
    category: "Teaching Exams",
    thumbnail: "exam-teaching",
    totalMocks: 80,
    activeQuestions: 6000
  },

  // 5. High Court
  {
    id: "hc-clerk",
    title: "High Court Clerk (SSSC)",
    description: "Subordinate Courts of Punjab recruitment tests.",
    category: "High Court",
    thumbnail: "exam-hc",
    totalMocks: 25,
    activeQuestions: 1500
  },

  // 6. Power Sector
  {
    id: "pspcl-alm",
    title: "PSPCL Assistant Lineman (ALM)",
    description: "Dedicated series for technical electrical posts.",
    category: "PSPCL & PSTCL",
    thumbnail: "exam-pspcl",
    totalMocks: 20,
    activeQuestions: 1800
  },
  {
    id: "pspcl-ldc",
    title: "PSPCL LDC & Typist",
    description: "Lower Division Clerk recruitment in the power sector.",
    category: "PSPCL & PSTCL",
    thumbnail: "exam-pspcl",
    totalMocks: 22,
    activeQuestions: 1400
  },

  // 7. Medical / BFUHS
  {
    id: "bfuhs-staff-nurse",
    title: "BFUHS Staff Nurse",
    description: "Medical recruitment for Staff Nurse and Pharmacist roles.",
    category: "BFUHS",
    thumbnail: "exam-teaching",
    totalMocks: 25,
    activeQuestions: 2200
  },

  // 8. Banking & Cooperative
  {
    id: "coop-bank",
    title: "Cooperative Bank Clerk-cum-DEO",
    description: "Banking and computer efficiency tests.",
    category: "Banking & Cooperative",
    thumbnail: "exam-pspcl",
    totalMocks: 30,
    activeQuestions: 2000
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    subject: "Punjabi Grammar",
    text: "ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਦੀ ਲਿਪੀ ਕਿਹੜੀ ਹੈ?",
    options: ["ਦੇਵਨਾਗਰੀ", "ਗੁਰਮੁਖੀ", "ਰੋਮਨ", "ਸ਼ਾਹਮੁਖੀ"],
    correctAnswer: "ਗੁਰਮੁਖੀ",
    difficulty: "Easy"
  },
  {
    id: "q2",
    subject: "Punjab GK",
    text: "Which city is known as the 'Steel City' of Punjab?",
    options: ["Ludhiana", "Mandi Gobindgarh", "Jalandhar", "Amritsar"],
    correctAnswer: "Mandi Gobindgarh",
    difficulty: "Medium"
  },
  {
    id: "q3",
    subject: "Reasoning",
    text: "If PUNJAB is coded as QVOKBC, how is POLICE coded?",
    options: ["QPMJDF", "QPMKDF", "QOMJDF", "QPMJDG"],
    correctAnswer: "QPMJDF",
    difficulty: "Medium"
  },
  {
    id: "q4",
    subject: "Quant",
    text: "The average of first five multiples of 3 is:",
    options: ["3", "9", "12", "15"],
    correctAnswer: "9",
    difficulty: "Easy"
  },
  {
    id: "q5",
    subject: "English",
    text: "Select the synonym of 'ABANDON':",
    options: ["Forsake", "Keep", "Cherish", "Adopt"],
    correctAnswer: "Forsake",
    difficulty: "Medium"
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
    title: "Kila Raipur Sports Festival dates announced",
    date: "Oct 22, 2026",
    category: "Culture",
    summary: "The 'Rural Olympics' of Punjab are set to begin from February next year with traditional sports events."
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
  },
  {
    id: "n2",
    title: "New Exam Alert",
    message: "Punjab Police Constable recruitment 2027 notification expected soon.",
    time: "5 hours ago",
    isRead: true,
    type: "alert"
  }
];
