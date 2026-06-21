import { Firestore, doc, serverTimestamp, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Canonical Punjab Exam Registry Rebuild v100.0.
 * REBUILT: 8-Category Clean Architecture.
 * STRICT: Title Case names and official board mappings.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[AUDIT] Initializing COMPLETE EXAM ECOSYSTEM REBUILD...');
  const batch = writeBatch(db);

  // 1. CANONICAL CATEGORIES (8 ONLY)
  const categories = [
    { id: "punjab-general", title: "Punjab General Exams", description: "PPSC and PSSSB official recruitment examinations.", displayOrder: 1 },
    { id: "punjab-teaching", title: "Punjab Teaching Exams", description: "PSTET, ETT, Master Cadre and Teaching recruitments.", displayOrder: 2 },
    { id: "punjab-technical", title: "Punjab Technical Exams", description: "Technical recruitments for PSPCL, PSTCL and Power departments.", displayOrder: 3 },
    { id: "punjab-banking", title: "Punjab Banking Exams", description: "Punjab State Cooperative Bank and banking recruitments.", displayOrder: 4 },
    { id: "punjab-police", title: "Punjab Police Exams", description: "Uniform job recruitments for Constable and SI cadres.", displayOrder: 5 },
    { id: "punjab-health", title: "Punjab Health Exams", description: "Medical and Health recruitments under BFUHS.", displayOrder: 6 },
    { id: "punjab-courts", title: "Punjab Courts Exams", description: "Clerk and staff recruitments for High Court and District Courts.", displayOrder: 7 },
    { id: "central-govt", title: "Central Government Exams", description: "SSC, Railway, Banking, Defence and UPSC examinations.", displayOrder: 8 }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. BOARDS (Authority Hubs)
  const boards = [
    // General
    { id: 'ppsc', abbreviation: 'PPSC', name: 'Punjab Public Service Commission', categoryId: 'punjab-general', displayOrder: 1 },
    { id: 'psssb', abbreviation: 'PSSSB', name: 'Punjab Subordinate Services Selection Board', categoryId: 'punjab-general', displayOrder: 2 },
    // Technical
    { id: 'pspcl-pstcl', abbreviation: 'PSPCL & PSTCL', name: 'Punjab Power Corporation', categoryId: 'punjab-technical', displayOrder: 3 },
    // Banking
    { id: 'pscb', abbreviation: 'PSCB', name: 'Punjab State Cooperative Bank', categoryId: 'punjab-banking', displayOrder: 4 },
    // Health
    { id: 'bfuhs', abbreviation: 'BFUHS', name: 'Health Recruitment (BFUHS)', categoryId: 'punjab-health', displayOrder: 5 },
    // Central
    { id: 'ssc', abbreviation: 'SSC', name: 'Staff Selection Commission', categoryId: 'central-govt', displayOrder: 6 },
    { id: 'railway', abbreviation: 'Railway', name: 'Railway Recruitment Board', categoryId: 'central-govt', displayOrder: 7 },
    { id: 'banking-central', abbreviation: 'Banking', name: 'Central Banking Exams', categoryId: 'central-govt', displayOrder: 8 },
    { id: 'defence', abbreviation: 'Defence', name: 'Defence Services', categoryId: 'central-govt', displayOrder: 9 },
    { id: 'upsc', abbreviation: 'UPSC', name: 'Union Public Service Commission', categoryId: 'central-govt', displayOrder: 10 }
  ];

  for (const b of boards) {
    batch.set(doc(db, 'boards', b.id), { ...b, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. EXAMS (Verticals)
  const examMappings = [
    { cat: 'punjab-general', board: 'ppsc', list: ["PCS", "DSP", "Naib Tehsildar", "Tehsildar", "BDPO", "Excise & Taxation Officer", "Assistant Professor", "Veterinary Officer", "Assistant Engineer", "Junior Engineer"] },
    { cat: 'punjab-general', board: 'psssb', list: ["Clerk", "Clerk IT", "Clerk Accounts", "Steno Typist", "Patwari", "Canal Patwari", "VDO / Gram Sevak", "Excise Inspector", "Jail Warder", "Forest Guard", "Veterinary Inspector", "Junior Draftsman", "Laboratory Assistant", "Senior Assistant", "Group C Posts", "Group D Posts"] },
    { cat: 'punjab-teaching', board: null, list: ["PSTET Paper 1", "PSTET Paper 2", "ETT", "Master Cadre", "Lecturer Cadre", "Pre Primary Teacher", "CTET"] },
    { cat: 'punjab-technical', board: 'pspcl-pstcl', list: ["Assistant Lineman (ALM)", "ASSA", "LDC", "Revenue Accountant", "Internal Auditor", "JE Electrical", "JE Civil", "AE Electrical"] },
    { cat: 'punjab-banking', board: 'pscb', list: ["Cooperative Bank Clerk", "Manager", "IT Officer", "Steno Typist"] },
    { cat: 'punjab-police', board: null, list: ["Constable", "Sub Inspector", "Intelligence Assistant", "Technical Cadre", "Investigation Cadre"] },
    { cat: 'punjab-health', board: 'bfuhs', list: ["Staff Nurse", "Pharmacist", "Medical Officer", "Food Safety Officer", "Emergency Medical Officer", "ANM", "MPHW", "Lab Technician", "Radiographer"] },
    { cat: 'punjab-courts', board: null, list: ["High Court Clerk", "High Court Stenographer", "District Court Clerk", "Process Server", "Peon"] },
    { cat: 'central-govt', board: 'ssc', list: ["SSC CGL", "SSC CHSL", "SSC MTS", "SSC GD", "SSC CPO"] },
    { cat: 'central-govt', board: 'railway', list: ["RRB NTPC", "RRB Group D", "RRB ALP", "RRB JE"] },
    { cat: 'central-govt', board: 'banking-central', list: ["IBPS PO", "IBPS Clerk", "SBI PO", "SBI Clerk"] },
    { cat: 'central-govt', board: 'defence', list: ["NDA", "CDS", "AFCAT", "Agniveer"] },
    { cat: 'central-govt', board: 'upsc', list: ["Civil Services", "CAPF", "EPFO"] }
  ];

  examMappings.forEach((mapping) => {
    mapping.list.forEach((name, i) => {
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      batch.set(doc(db, 'exams', id), {
        id, name,
        boardId: mapping.board,
        categoryId: mapping.cat,
        displayOrder: i,
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
  });

  await batch.commit();
  console.log('[AUDIT] Entire Exam Ecosystem Rebuilt Successfully.');
}
