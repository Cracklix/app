import { Firestore, doc, serverTimestamp, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Canonical Punjab Exam Registry Rebuild v200.0.
 * REBUILT: 8-Category Clean Architecture.
 * STRICT: Title Case names and hierarchical board mappings.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[AUDIT] Initializing COMPLETE ARCHITECTURE REBUILD...');
  const batch = writeBatch(db);

  // 1. CANONICAL CATEGORIES (8 ONLY)
  const categories = [
    { id: "cat-punjab-general", title: "Punjab General Exams", description: "PPSC and PSSSB recruitment examinations.", displayOrder: 1 },
    { id: "cat-punjab-teaching", title: "Punjab Teaching Exams", description: "PSTET, ETT, Master Cadre and Teacher recruitments.", displayOrder: 2 },
    { id: "cat-punjab-technical", title: "Punjab Technical Exams", description: "Technical recruitments for PSPCL and PSTCL.", displayOrder: 3 },
    { id: "cat-punjab-banking", title: "Punjab Banking Exams", description: "Punjab State Cooperative Bank and banking recruitments.", displayOrder: 4 },
    { id: "cat-punjab-police", title: "Punjab Police Exams", description: "Uniform job recruitments for Constable and SI cadres.", displayOrder: 5 },
    { id: "cat-punjab-health", title: "Punjab Health Exams", description: "Medical and Health recruitments under BFUHS.", displayOrder: 6 },
    { id: "cat-punjab-courts", title: "Punjab Courts Exams", description: "Clerk and staff recruitments for Punjab Courts.", displayOrder: 7 },
    { id: "cat-central-govt", title: "Central Government Exams", description: "SSC, Railway, Banking, Defence and UPSC examinations.", displayOrder: 8 }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. BOARDS (Hierarchical Nodes)
  const boards = [
    // Under cat-punjab-general
    { id: 'board-ppsc', abbreviation: 'PPSC', name: 'Punjab Public Service Commission', categoryId: 'cat-punjab-general', displayOrder: 1 },
    { id: 'board-psssb', abbreviation: 'PSSSB', name: 'Punjab Subordinate Services Selection Board', categoryId: 'cat-punjab-general', displayOrder: 2 },
    // Under cat-punjab-technical
    { id: 'board-pspcl-pstcl', abbreviation: 'PSPCL & PSTCL', name: 'Punjab Power Corporation', categoryId: 'cat-punjab-technical', displayOrder: 3 },
    // Under cat-punjab-banking
    { id: 'board-pscb', abbreviation: 'PSCB', name: 'Punjab State Cooperative Bank', categoryId: 'cat-punjab-banking', displayOrder: 4 },
    // Under cat-punjab-health
    { id: 'board-bfuhs', abbreviation: 'BFUHS', name: 'Health Recruitment (BFUHS)', categoryId: 'cat-punjab-health', displayOrder: 5 },
    // Under cat-central-govt
    { id: 'board-ssc', abbreviation: 'SSC', name: 'Staff Selection Commission', categoryId: 'cat-central-govt', displayOrder: 6 },
    { id: 'board-railway', abbreviation: 'Railway', name: 'Railway Recruitment Board', categoryId: 'cat-central-govt', displayOrder: 7 },
    { id: 'board-banking-central', abbreviation: 'Banking', name: 'Central Banking Exams', categoryId: 'cat-central-govt', displayOrder: 8 },
    { id: 'board-defence', abbreviation: 'Defence', name: 'Defence Services', categoryId: 'cat-central-govt', displayOrder: 9 },
    { id: 'board-upsc', abbreviation: 'UPSC', name: 'Union Public Service Commission', categoryId: 'cat-central-govt', displayOrder: 10 }
  ];

  for (const b of boards) {
    batch.set(doc(db, 'boards', b.id), { ...b, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. EXAMS (Specific Verticals)
  const examMappings = [
    { cat: 'cat-punjab-general', board: 'board-ppsc', list: ["PCS", "DSP", "Naib Tehsildar", "Tehsildar", "BDPO", "Excise & Taxation Officer", "Assistant Professor", "Veterinary Officer", "Assistant Engineer", "Junior Engineer"] },
    { cat: 'cat-punjab-general', board: 'board-psssb', list: ["Clerk", "Clerk IT", "Clerk Accounts", "Steno Typist", "Patwari", "Canal Patwari", "VDO / Gram Sevak", "Excise Inspector", "Jail Warder", "Forest Guard", "Veterinary Inspector", "Junior Draftsman", "Laboratory Assistant", "Senior Assistant", "Group C Posts", "Group D Posts"] },
    { cat: 'cat-punjab-teaching', board: null, list: ["PSTET Paper 1", "PSTET Paper 2", "ETT", "Master Cadre", "Lecturer Cadre", "Pre Primary Teacher", "CTET"] },
    { cat: 'cat-punjab-technical', board: 'board-pspcl-pstcl', list: ["Assistant Lineman (ALM)", "ASSA", "LDC", "Revenue Accountant", "Internal Auditor", "JE Electrical", "JE Civil", "AE Electrical"] },
    { cat: 'cat-punjab-banking', board: 'board-pscb', list: ["Cooperative Bank Clerk", "Manager", "IT Officer", "Steno Typist"] },
    { cat: 'cat-punjab-police', board: null, list: ["Constable", "Sub Inspector", "Intelligence Assistant", "Technical Cadre", "Investigation Cadre"] },
    { cat: 'cat-punjab-health', board: 'board-bfuhs', list: ["Staff Nurse", "Pharmacist", "Medical Officer", "Food Safety Officer", "ANM", "MPHW", "Lab Technician", "Radiographer"] },
    { cat: 'cat-punjab-courts', board: null, list: ["High Court Clerk", "High Court Stenographer", "District Court Clerk", "Process Server", "Peon"] },
    { cat: 'cat-central-govt', board: 'board-ssc', list: ["SSC CGL", "SSC CHSL", "SSC MTS", "SSC GD", "SSC CPO"] },
    { cat: 'cat-central-govt', board: 'board-railway', list: ["RRB NTPC", "RRB Group D", "RRB ALP", "RRB JE"] },
    { cat: 'cat-central-govt', board: 'board-banking-central', list: ["IBPS PO", "IBPS Clerk", "SBI PO", "SBI Clerk"] },
    { cat: 'cat-central-govt', board: 'board-defence', list: ["NDA", "CDS", "AFCAT", "Agniveer"] },
    { cat: 'cat-central-govt', board: 'board-upsc', list: ["Civil Services", "CAPF", "EPFO"] }
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
  console.log('[AUDIT] Ecosystem Rebuilt Successfully.');
}
