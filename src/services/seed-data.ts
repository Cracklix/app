import { Firestore, doc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Canonical Punjab Exam Registry Seeder v90.0.
 * REBUILT: Strictly aligned with the 8-category ecosystem.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[AUDIT] Initializing Canonical Punjab Registry Rebuild...');
  const batch = writeBatch(db);

  // 1. CANONICAL CATEGORIES
  const categories = [
    { id: "ppsc", title: "PPSC", description: "Punjab Public Service Commission recruitment exams.", highlight: "CLASS A & B", color: "text-emerald-600", bgColor: "bg-emerald-50", displayOrder: 1 },
    { id: "psssb", title: "PSSSB", description: "Punjab Subordinate Services Selection Board exams.", highlight: "GROUP B & C", color: "text-primary", bgColor: "bg-orange-50", displayOrder: 2 },
    { id: "punjab-police", title: "Punjab Police", description: "Police recruitment for Constable, SI and specialized cadres.", highlight: "UNIFORM JOBS", color: "text-blue-800", bgColor: "bg-blue-50", displayOrder: 3 },
    { id: "pspcl-pstcl", title: "PSPCL & PSTCL", description: "Power department recruitments including ALM and JE.", highlight: "TECHNICAL", color: "text-amber-600", bgColor: "bg-amber-50", displayOrder: 4 },
    { id: "teaching", title: "Teaching", description: "PSTET, ETT, Master Cadre and school recruitment nodes.", highlight: "EDUCATIONAL", color: "text-rose-600", bgColor: "bg-rose-50", displayOrder: 5 },
    { id: "banking", title: "Banking", description: "Punjab State Cooperative Bank and finance recruitments.", highlight: "FINANCE", color: "text-indigo-600", bgColor: "bg-indigo-50", displayOrder: 6 },
    { id: "health", title: "Health", description: "BFUHS and Health Department recruitments.", highlight: "MEDICAL", color: "text-cyan-600", bgColor: "bg-cyan-50", displayOrder: 7 },
    { id: "courts", title: "Courts", description: "High Court and District Court clerk and staff recruitments.", highlight: "JUDICIAL", color: "text-slate-600", bgColor: "bg-slate-50", displayOrder: 8 }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. BOARDS (Authority Hubs)
  const boards = [
    { id: 'ppsc', abbreviation: 'PPSC', name: 'Punjab Public Service Commission', categoryId: 'ppsc', displayOrder: 1 },
    { id: 'psssb', abbreviation: 'PSSSB', name: 'Punjab Subordinate Services Selection Board', categoryId: 'psssb', displayOrder: 2 },
    { id: 'punjab-police', abbreviation: 'POLICE', name: 'Punjab Police Recruitment', categoryId: 'punjab-police', displayOrder: 3 },
    { id: 'pspcl-pstcl', abbreviation: 'PSPCL', name: 'Punjab Power Corporation', categoryId: 'pspcl-pstcl', displayOrder: 4 },
    { id: 'teaching', abbreviation: 'TEACHING', name: 'Education Recruitment Board', categoryId: 'teaching', displayOrder: 5 },
    { id: 'pstet', abbreviation: 'PSTET', name: 'Punjab State Teacher Eligibility Test', categoryId: 'teaching', displayOrder: 6 },
    { id: 'ctet', abbreviation: 'CTET', name: 'Central Teacher Eligibility Test', categoryId: 'teaching', displayOrder: 7 },
    { id: 'banking', abbreviation: 'BANKING', name: 'Punjab Cooperative Bank', categoryId: 'banking', displayOrder: 8 },
    { id: 'health', abbreviation: 'HEALTH', name: 'Health Recruitment (BFUHS)', categoryId: 'health', displayOrder: 9 },
    { id: 'courts', abbreviation: 'COURTS', name: 'Punjab Courts Recruitment', categoryId: 'courts', displayOrder: 10 }
  ];

  for (const b of boards) {
    batch.set(doc(db, 'boards', b.id), { ...b, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. EXAMS (Verticals)
  const groups = [
    { cat: 'ppsc', board: 'ppsc', list: ["PCS", "Naib Tehsildar", "Tehsildar", "DSP", "Excise & Taxation Officer", "BDPO", "Assistant Professor", "Veterinary Officer", "Assistant Engineer", "Junior Engineer", "Other PPSC Recruitment"] },
    { cat: 'psssb', board: 'psssb', list: ["Clerk", "Clerk IT", "Clerk Accounts", "Steno Typist", "Patwari", "Canal Patwari", "VDO / Gram Sevak", "Excise Inspector", "Jail Warder", "Forest Guard", "Veterinary Inspector", "Junior Draftsman", "Laboratory Assistant", "Senior Assistant", "Group C Posts", "Group D Posts"] },
    { cat: 'punjab-police', board: 'punjab-police', list: ["Constable", "Sub Inspector", "Intelligence Assistant", "Technical Cadre", "Investigation Cadre"] },
    { cat: 'pspcl-pstcl', board: 'pspcl-pstcl', list: ["Assistant Lineman (ALM)", "ASSA", "LDC / Clerk", "Revenue Accountant", "Internal Auditor", "JE Electrical", "JE Civil", "AE Electrical"] },
    { cat: 'teaching', board: 'pstet', list: ["PSTET Paper 1", "PSTET Paper 2"] },
    { cat: 'teaching', board: 'ctet', list: ["CTET Paper 1 And Paper 2"] },
    { cat: 'teaching', board: 'teaching', list: ["ETT", "Master Cadre", "Lecturer Cadre", "Pre Primary Teacher"] },
    { cat: 'banking', board: 'banking', list: ["Cooperative Bank Clerk", "Cooperative Bank Manager", "IT Officer", "Steno Typist"] },
    { cat: 'health', board: 'health', list: ["Staff Nurse", "Pharmacist", "Medical Officer", "Food Safety Officer", "ANM", "MPHW", "Lab Technician", "Radiographer"] },
    { cat: 'courts', board: 'courts', list: ["High Court Clerk", "High Court Stenographer", "District Court Clerk", "Process Server", "Peon"] }
  ];

  groups.forEach((group) => {
    group.list.forEach((name, i) => {
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      batch.set(doc(db, 'exams', id), {
        id, name,
        boardId: group.board,
        categoryId: group.cat,
        displayOrder: i,
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
  });

  await batch.commit();
  console.log('[AUDIT] Ecosystem Cleaned and Rebuilt.');
}
