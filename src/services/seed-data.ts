
import { Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @fileOverview Final Institutional Seeding Engine for Cracklix.
 * Populates the repository with the complete official Punjab Government Exam Hierarchy.
 */
export async function seedInitialData(db: Firestore) {
  console.log('Initializing Final Structured Punjab Repository Sync...');

  // 1. Official Recruiting Boards
  const boards = [
    { id: 'psssb', abbreviation: 'PSSSB', name: 'Punjab Subordinate Services Selection Board', description: 'Handles Group B, C, and D non-gazetted positions across all state departments.', iconUrl: 'https://picsum.photos/seed/psssb/200/200' },
    { id: 'ppsc', abbreviation: 'PPSC', name: 'Punjab Public Service Commission', description: 'Handles top-tier, authoritative Group A and Group B gazetted administrative posts.', iconUrl: 'https://picsum.photos/seed/ppsc/200/200' },
    { id: 'police', abbreviation: 'Police', name: 'Punjab Police Recruitment Board', description: 'Dedicated law enforcement cadre recruitment for Punjab.', iconUrl: 'https://picsum.photos/seed/police/200/200' },
    { id: 'education', abbreviation: 'Education', name: 'Punjab Education Department', description: 'Teaching hierarchy including PSTET, CTET, Master Cadre, and Lecturer recruitment.', iconUrl: 'https://picsum.photos/seed/teaching/200/200' },
    { id: 'technical', abbreviation: 'Technical', name: 'Autonomous & Technical Bodies', description: 'PSPCL, PSTCL, and Departmental Boards for LDC, JE, and Lineman roles.', iconUrl: 'https://picsum.photos/seed/pspcl/200/200' },
    { id: 'highcourt', abbreviation: 'High Court', name: 'Punjab & Haryana High Court', description: 'Judicial clerical (SSSC) and stenographer recruitment.', iconUrl: 'https://picsum.photos/seed/court/200/200' },
  ];
  for (const b of boards) await setDoc(doc(db, 'boards', b.id), b);

  // 2. Comprehensive Subject Matrix
  const subjects = [
    { id: 'punjabi-qualifying', name: 'Mandatory Punjabi (Qualifying)', description: 'Part-A: 50-mark pass-only standard exam.' },
    { id: 'punjab-history', name: 'Punjab History & Culture', description: 'Sikh Gurus, Freedom Movements, and State Culture.' },
    { id: 'gk-ca', name: 'General Knowledge & CA', description: 'Polity, Geography, Science, and News.' },
    { id: 'reasoning', name: 'Reasoning & Mental Ability', description: 'Puzzles, Coding, and Logical Patterns.' },
    { id: 'math', name: 'Numerical Ability', description: 'Arithmetic, Algebra, and Data Interpretation.' },
    { id: 'ict', name: 'ICT (Computers)', description: 'MS Office, Networking, and Basics.' },
    { id: 'english', name: 'General English', description: 'Grammar, Error Spotting, and Vocabulary.' },
    { id: 'cdp', name: 'Child Development (CDP)', description: 'Psychology for Teaching exams.' },
    { id: 'accounts', name: 'Financial Accounting', description: 'Specialized commerce section.' },
  ];
  for (const s of subjects) await setDoc(doc(db, 'subjects', s.id), s);

  // 3. Complete Exam Hierarchy (40+ Tiers)
  const exams = [
    // PSSSB
    { id: 'psssb-clerk', boardId: 'psssb', name: 'PSSSB Clerk (General/IT/Accounts)', category: 'Clerical', totalMocks: 60, activeQuestions: 2500, duration: 120 },
    { id: 'psssb-sa', boardId: 'psssb', name: 'Senior Assistant cum Inspector', category: 'Executive', totalMocks: 30, activeQuestions: 1500, duration: 120 },
    { id: 'psssb-excise', boardId: 'psssb', name: 'Excise & Taxation Inspector', category: 'Inspector', totalMocks: 25, activeQuestions: 1200, duration: 120 },
    { id: 'psssb-auditor', boardId: 'psssb', name: 'Junior Auditor / Inspector', category: 'Finance', totalMocks: 20, activeQuestions: 1000, duration: 120 },
    { id: 'psssb-naib', boardId: 'psssb', name: 'Naib Tehsildar', category: 'Revenue', totalMocks: 12, activeQuestions: 800, duration: 120 },
    { id: 'psssb-warder', boardId: 'psssb', name: 'Jail Warder & Matron', category: 'Security', totalMocks: 15, activeQuestions: 900, duration: 120 },
    
    // PPSC
    { id: 'ppsc-pcs', boardId: 'ppsc', name: 'Punjab Civil Services (PCS)', category: 'Administrative', totalMocks: 20, activeQuestions: 5000, duration: 120 },
    { id: 'ppsc-sde', boardId: 'ppsc', name: 'Sub Divisional Engineer (SDE)', category: 'Technical', totalMocks: 10, activeQuestions: 1500, duration: 120 },
    
    // Punjab Police
    { id: 'police-constable', boardId: 'police', name: 'Police Constable', category: 'Police', totalMocks: 50, activeQuestions: 3000, duration: 120 },
    { id: 'police-si', boardId: 'police', name: 'Police Sub-Inspector (SI)', category: 'Police', totalMocks: 35, activeQuestions: 2500, duration: 120 },
    
    // Education
    { id: 'pstet-1', boardId: 'education', name: 'PSTET Paper 1 (Primary)', category: 'Teaching', totalMocks: 30, activeQuestions: 2000, duration: 150 },
    { id: 'pstet-2', boardId: 'education', name: 'PSTET Paper 2 (Upper Primary)', category: 'Teaching', totalMocks: 30, activeQuestions: 2000, duration: 150 },
    { id: 'ctet-1', boardId: 'education', name: 'CTET Paper 1', category: 'Teaching', totalMocks: 25, activeQuestions: 1800, duration: 150 },
    { id: 'ctet-2', boardId: 'education', name: 'CTET Paper 2', category: 'Teaching', totalMocks: 25, activeQuestions: 1800, duration: 150 },
    { id: 'master-cadre', boardId: 'education', name: 'Master Cadre Recruitment', category: 'Teaching', totalMocks: 50, activeQuestions: 4000, duration: 150 },
    { id: 'ett-cadre', boardId: 'education', name: 'ETT Cadre (Paper B)', category: 'Teaching', totalMocks: 40, activeQuestions: 3500, duration: 120 },
  ];
  for (const e of exams) await setDoc(doc(db, 'exams', e.id), e);

  // 4. Initial System Config
  await setDoc(doc(db, 'settings', 'global'), {
    platformName: "Cracklix",
    announcement: "🔥 Official Punjab 2026 Recruitment Calendar Live. Master the Common Base.",
    showAnnouncement: true,
    heroLine1: "Prepare Smarter.",
    heroLine2: "Score Higher.",
    updatedAt: serverTimestamp()
  }, { merge: true });

  console.log('Final Institutional Seed Complete.');
}
