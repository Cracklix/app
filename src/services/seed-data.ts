import { Firestore, doc, serverTimestamp, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Strict 6-Category Canonical Registry Seeder v4.0.
 * WIPES legacy data and establishes the authorized hierarchical structure.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[REBUILD] Initializing AUTHORIZED 6-CATEGORY ARCHITECTURE...');
  const batch = writeBatch(db);

  // 1. THE 6 AUTHORIZED HOMEPAGE CATEGORIES
  const categories = [
    { 
      id: "ppsc", 
      title: "PPSC", 
      description: "Direct recruitment for Punjab Civil Services and Class A & B officers.", 
      displayOrder: 1 
    },
    { 
      id: "punjab-government-exams", 
      title: "Punjab Government Exams", 
      description: "State level recruitments for PSSSB, Police, Health, and Courts.", 
      displayOrder: 2 
    },
    { 
      id: "punjab-teaching-exams", 
      title: "Punjab Teaching Exams", 
      description: "PSTET, CTET, Master Cadre, ETT and Lecturer recruitments.", 
      displayOrder: 3 
    },
    { 
      id: "banking-exams", 
      title: "Banking Exams", 
      description: "State Cooperative Banks, IBPS, and SBI recruitment hubs.", 
      displayOrder: 4 
    },
    { 
      id: "punjab-technical-exams", 
      title: "Punjab Technical Exams", 
      description: "Technical recruitment for PSPCL, PSTCL and Power corporations.", 
      displayOrder: 5 
    },
    { 
      id: "central-government-exams", 
      title: "Central Government Exams", 
      description: "SSC, Railway, Defence and UPSC examinations.", 
      displayOrder: 6 
    }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. AUTHORIZED BOARDS (Sub-Categories)
  const boards = [
    // Punjab Govt Exams Hub
    { id: "psssb", abbreviation: "PSSSB", name: "Punjab Subordinate Services Selection Board", categoryId: "punjab-government-exams", displayOrder: 1 },
    { id: "punjab-police", abbreviation: "Punjab Police", name: "Punjab Police Recruitment Board", categoryId: "punjab-government-exams", displayOrder: 2 },
    { id: "bfuhs", abbreviation: "BFUHS", name: "Health & Family Welfare Department", categoryId: "punjab-government-exams", displayOrder: 3 },
    { id: "punjab-courts", abbreviation: "Punjab Courts", name: "High Court & District Courts", categoryId: "punjab-government-exams", displayOrder: 4 },
    
    // Banking Hub
    { id: "pscb", abbreviation: "PSCB", name: "Punjab State Cooperative Bank", categoryId: "banking-exams", displayOrder: 1 },
    { id: "ibps-sbi", abbreviation: "IBPS & SBI", name: "Central Banking Recruitment", categoryId: "banking-exams", displayOrder: 2 },

    // Technical Hub
    { id: "pspcl-pstcl", abbreviation: "PSPCL & PSTCL", name: "Punjab Power Corporations", categoryId: "punjab-technical-exams", displayOrder: 1 },

    // Central Govt Hub
    { id: "ssc", abbreviation: "SSC", name: "Staff Selection Commission", categoryId: "central-government-exams", displayOrder: 1 },
    { id: "railway", abbreviation: "Railway", name: "RRB Recruitment Hub", categoryId: "central-government-exams", displayOrder: 2 },
    { id: "upsc", abbreviation: "UPSC", name: "Union Public Service Commission", categoryId: "central-government-exams", displayOrder: 3 },
    { id: "defence", abbreviation: "Defence", name: "Army, Navy & Airforce", categoryId: "central-government-exams", displayOrder: 4 }
  ];

  for (const board of boards) {
    batch.set(doc(db, 'boards', board.id), { ...board, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. EXAM VERTICALS (The actual test cards)
  const examMappings = [
    // PPSC (Direct Category Mapping)
    { cat: 'ppsc', board: 'ppsc', list: ["PCS", "DSP", "Naib Tehsildar", "Tehsildar", "BDPO", "Excise & Taxation Officer", "Assistant Professor", "Veterinary Officer", "Assistant Engineer", "Junior Engineer"] },
    
    // PSSSB
    { cat: 'punjab-government-exams', board: 'psssb', list: ["Clerk", "Clerk IT", "Clerk Accounts", "Clerk-cum-DEO", "Steno Typist", "Junior Scale Stenographer", "Senior Assistant", "Patwari", "Canal Patwari", "VDO / Gram Sevak", "Excise Inspector", "Jail Warder", "Forest Guard", "Forester", "Veterinary Inspector", "Junior Draftsman", "Laboratory Assistant", "Dairy Inspector"] },
    
    // Police
    { cat: 'punjab-government-exams', board: 'punjab-police', list: ["Constable", "Sub Inspector", "Intelligence Assistant", "Technical Support Services"] },

    // Health
    { cat: 'punjab-government-exams', board: 'bfuhs', list: ["Staff Nurse", "Nursing Officer", "Pharmacist", "Food Safety Officer", "Medical Officer", "Emergency Medical Officer", "MPHW", "ANM", "Lab Technician", "Radiographer"] },

    // Courts
    { cat: 'punjab-government-exams', board: 'punjab-courts', list: ["High Court Clerk", "High Court Stenographer", "District Court Clerk", "District Court Stenographer", "Process Server", "Peon"] },

    // Teaching (Individual Cards)
    { cat: 'punjab-teaching-exams', board: 'teaching', list: ["PSTET Paper 1", "PSTET Paper 2", "CTET Paper 1", "CTET Paper 2", "ETT", "Master Cadre", "Lecturer Cadre", "Pre Primary Teacher"] },

    // Technical
    { cat: 'punjab-technical-exams', board: 'pspcl-pstcl', list: ["Assistant Lineman (ALM)", "ASSA", "LDC", "Revenue Accountant", "Internal Auditor", "JE Electrical", "JE Civil", "AE Electrical"] },

    // Banking
    { cat: 'banking-exams', board: 'pscb', list: ["Cooperative Bank Clerk", "Cooperative Bank Manager", "IT Officer"] },
    { cat: 'banking-exams', board: 'ibps-sbi', list: ["IBPS PO", "IBPS Clerk", "SBI PO", "SBI Clerk"] },

    // Central
    { cat: 'central-government-exams', board: 'ssc', list: ["SSC CGL", "SSC CHSL", "SSC MTS", "SSC GD", "SSC CPO"] },
    { cat: 'central-government-exams', board: 'railway', list: ["RRB NTPC", "RRB Group D", "RRB ALP", "RRB JE"] },
    { cat: 'central-government-exams', board: 'upsc', list: ["UPSC CSE", "CDS", "CAPF", "EPFO"] }
  ];

  examMappings.forEach((mapping) => {
    mapping.list.forEach((name, i) => {
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      batch.set(doc(db, 'exams', id), {
        id, 
        name,
        categoryId: mapping.cat,
        boardId: mapping.board,
        displayOrder: i,
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
  });

  await batch.commit();
  console.log('[REBUILD] Strict Architecture Deployed.');
}
