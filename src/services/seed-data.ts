
import { Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @fileOverview Institutional Seeding Engine for Cracklix.
 * Populates the repository with the full official Punjab Government Exam Hierarchy.
 */
export async function seedInitialData(db: Firestore) {
  console.log('Initializing Structured Punjab Repository Sync...');

  // 1. Official Recruiting Boards
  const boards = [
    { id: 'psssb', abbreviation: 'PSSSB', name: 'Punjab Subordinate Services Selection Board', description: 'Handles Group B, C, and D non-gazetted positions.', iconUrl: 'https://picsum.photos/seed/psssb/200/200' },
    { id: 'ppsc', abbreviation: 'PPSC', name: 'Punjab Public Service Commission', description: 'Handles Group A and B gazetted administrative posts.', iconUrl: 'https://picsum.photos/seed/ppsc/200/200' },
    { id: 'police', abbreviation: 'Police', name: 'Punjab Police Recruitment Board', description: 'Dedicated law enforcement cadre recruitment.', iconUrl: 'https://picsum.photos/seed/police/200/200' },
    { id: 'education', abbreviation: 'Education', name: 'Punjab Education Department', description: 'PSTET, CTET, Master Cadre, ETT, and Lecturer recruitment.', iconUrl: 'https://picsum.photos/seed/teaching/200/200' },
    { id: 'technical', abbreviation: 'Technical', name: 'Technical & Autonomous Bodies', description: 'PSPCL, PSTCL, and Departmental Boards.', iconUrl: 'https://picsum.photos/seed/pspcl/200/200' },
    { id: 'highcourt', abbreviation: 'High Court', name: 'Punjab & Haryana High Court', description: 'Judicial clerical and stenographer recruitment.', iconUrl: 'https://picsum.photos/seed/court/200/200' },
  ];
  for (const b of boards) await setDoc(doc(db, 'boards', b.id), b);

  // 2. Core Subjects (Common Base vs Specialized)
  const subjects = [
    { id: 'punjabi-qualifying', name: 'Mandatory Punjabi (Qualifying)', description: 'Part-A: 50-mark standard matrix exam.' },
    { id: 'punjab-history', name: 'Punjab History & Culture', description: 'Ancient history to modern freedom movements.' },
    { id: 'gk-ca', name: 'GK & Current Affairs', description: 'National and International strategic news.' },
    { id: 'reasoning', name: 'Logical Reasoning', description: 'Mental ability and patterns.' },
    { id: 'math', name: 'Numerical Ability (Math)', description: 'Arithmetic and Data Interpretation.' },
    { id: 'ict', name: 'ICT (Computers)', description: 'Basics of hardware, software, and networking.' },
    { id: 'english', name: 'General English', description: 'Grammar and vocabulary.' },
    { id: 'cdp', name: 'Child Development (CDP)', description: 'Psychology of teaching and pedagogy.' },
    { id: 'law', name: 'Digital & Cyber Laws', description: 'Law enforcement specific legislation.' },
    { id: 'accounts', name: 'Financial Accounting', description: 'Auditing and accounting laws.' },
    { id: 'evs', name: 'Environmental Studies (EVS)', description: 'Primary level environmental science.' },
    { id: 'hindi', name: 'Hindi Language', description: 'Grammar and literature.' },
  ];
  for (const s of subjects) await setDoc(doc(db, 'subjects', s.id), s);

  // 3. Official Exams (Structured by Boards)
  const exams = [
    // PSSSB
    { id: 'psssb-clerk', boardId: 'psssb', name: 'PSSSB Clerk (General/IT/Accounts)', category: 'Clerical', totalMocks: 60, activeQuestions: 2500, duration: 120 },
    { id: 'psssb-sa', boardId: 'psssb', name: 'Senior Assistant cum Inspector', category: 'Executive', totalMocks: 30, activeQuestions: 1500, duration: 120 },
    { id: 'psssb-excise', boardId: 'psssb', name: 'Excise & Taxation Inspector', category: 'Inspector', totalMocks: 25, activeQuestions: 1200, duration: 120 },
    { id: 'psssb-auditor', boardId: 'psssb', name: 'Junior Auditor / Audit Inspector', category: 'Finance', totalMocks: 20, activeQuestions: 1000, duration: 120 },
    { id: 'psssb-warder', boardId: 'psssb', name: 'Jail Warder & Matron', category: 'Security', totalMocks: 15, activeQuestions: 800, duration: 120 },
    { id: 'psssb-naib', boardId: 'psssb', name: 'Naib Tehsildar', category: 'Revenue', totalMocks: 10, activeQuestions: 1200, duration: 120 },
    { id: 'psssb-steno', boardId: 'psssb', name: 'Steno-Typist / Stenographer', category: 'Clerical', totalMocks: 10, activeQuestions: 500, duration: 120 },
    { id: 'psssb-je', boardId: 'psssb', name: 'Junior Engineer (JE)', category: 'Technical', totalMocks: 15, activeQuestions: 1000, duration: 120 },
    
    // PPSC
    { id: 'ppsc-pcs', boardId: 'ppsc', name: 'Punjab Civil Services (PCS)', category: 'Administrative', totalMocks: 20, activeQuestions: 5000, duration: 120 },
    { id: 'ppsc-sde', boardId: 'ppsc', name: 'Sub Divisional Engineer (SDE)', category: 'Technical', totalMocks: 10, activeQuestions: 1500, duration: 120 },
    { id: 'ppsc-manager', boardId: 'ppsc', name: 'Functional Manager', category: 'Management', totalMocks: 10, activeQuestions: 800, duration: 120 },
    { id: 'ppsc-so', boardId: 'ppsc', name: 'Section Officer (SO)', category: 'Finance', totalMocks: 12, activeQuestions: 900, duration: 120 },
    { id: 'ppsc-prof', boardId: 'ppsc', name: 'Assistant Professor / Principal', category: 'Education', totalMocks: 8, activeQuestions: 1200, duration: 120 },
    
    // Police
    { id: 'police-constable', boardId: 'police', name: 'Police Constable', category: 'Police', totalMocks: 50, activeQuestions: 3000, duration: 120 },
    { id: 'police-si', boardId: 'police', name: 'Police Sub-Inspector (SI)', category: 'Police', totalMocks: 35, activeQuestions: 2500, duration: 120 },
    { id: 'police-hc', boardId: 'police', name: 'Head Constable / ASI', category: 'Police', totalMocks: 20, activeQuestions: 1500, duration: 120 },
    { id: 'police-tss', boardId: 'police', name: 'Technical Support Services (TSS)', category: 'Police', totalMocks: 10, activeQuestions: 1000, duration: 120 },
    
    // Education
    { id: 'pstet-1', boardId: 'education', name: 'PSTET Paper 1 (Primary)', category: 'Teaching', totalMocks: 30, activeQuestions: 2000, duration: 150 },
    { id: 'pstet-2', boardId: 'education', name: 'PSTET Paper 2 (Upper Primary)', category: 'Teaching', totalMocks: 30, activeQuestions: 2000, duration: 150 },
    { id: 'ctet-1', boardId: 'education', name: 'CTET Paper 1 (Primary)', category: 'Teaching', totalMocks: 30, activeQuestions: 2000, duration: 150 },
    { id: 'ctet-2', boardId: 'education', name: 'CTET Paper 2 (Upper Primary)', category: 'Teaching', totalMocks: 30, activeQuestions: 2000, duration: 150 },
    { id: 'ett-cadre', boardId: 'education', name: 'ETT Cadre recruitment', category: 'Teaching', totalMocks: 40, activeQuestions: 3500, duration: 120 },
    { id: 'master-cadre', boardId: 'education', name: 'Master Cadre (TGT)', category: 'Teaching', totalMocks: 50, activeQuestions: 4000, duration: 150 },
    { id: 'lecturer-cadre', boardId: 'education', name: 'Lecturer Cadre (PGT)', category: 'Teaching', totalMocks: 20, activeQuestions: 3000, duration: 150 },

    // Technical / Autonomous
    { id: 'pspcl-ldc', boardId: 'technical', name: 'PSPCL Lower Division Clerk', category: 'Clerical', totalMocks: 15, activeQuestions: 1200, duration: 120 },
    { id: 'pspcl-je', boardId: 'technical', name: 'PSPCL Junior Engineer', category: 'Technical', totalMocks: 10, activeQuestions: 1500, duration: 120 },
    { id: 'pspcl-lineman', boardId: 'technical', name: 'ALM / Lineman Recruitment', category: 'Technical', totalMocks: 10, activeQuestions: 500, duration: 120 },

    // High Court
    { id: 'hc-clerk', boardId: 'highcourt', name: 'High Court Clerk (SSSC)', category: 'Judicial', totalMocks: 25, activeQuestions: 1200, duration: 120 },
  ];
  for (const e of exams) await setDoc(doc(db, 'exams', e.id), e);

  // 4. Global Settings
  await setDoc(doc(db, 'settings', 'global'), {
    platformName: "Cracklix",
    announcement: "🔥 Punjab 2026 Recruitment Calendar Live. Check Official Hubs.",
    showAnnouncement: true,
    heroLine1: "Prepare Smarter.",
    heroLine2: "Score Higher.",
    heroDescription: "The absolute common base and post-specific preparation hub for PSSSB, PPSC, and Punjab Police exams.",
    updatedAt: serverTimestamp()
  }, { merge: true });

  console.log('Institutional Seed Complete. CTET and Teaching Hierarchy Live.');
}
