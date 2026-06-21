import { Firestore, doc, serverTimestamp, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Official Institutional Registry Seeder v41.0.
 * BRANDING: Updated Board logos to use high-fidelity local assets.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[REBUILD] Synchronizing High-Fidelity Registry...');
  const batch = writeBatch(db);

  // 1. CANONICAL MASTER CATEGORIES
  const categories = [
    { 
      id: "punjab-government-exams", 
      title: "Punjab Government Exams", 
      description: "Recruitments through PPSC, PSSSB, Punjab Police and Punjab Courts.", 
      displayOrder: 1,
      iconUrl: "/logos/categories/govt.png"
    },
    { 
      id: "punjab-teaching-exams", 
      title: "Punjab Teaching Exams", 
      description: "Teacher recruitments for Master Cadre, ETT, PSTET and CTET.", 
      displayOrder: 2,
      iconUrl: "/logos/categories/teaching.png"
    },
    { 
      id: "punjab-technical-exams", 
      title: "Punjab Technical Exams", 
      description: "Posts in PSPCL, PSTCL and various Engineering departments.", 
      displayOrder: 3,
      iconUrl: "/logos/categories/technical.png"
    },
    { 
      id: "banking-exams", 
      title: "Banking Exams", 
      description: "Recruitments for PSCB, Cooperative Banks and Central Banking.", 
      displayOrder: 4,
      iconUrl: "/logos/categories/banking.png"
    },
    { 
      id: "medical-health-exams", 
      title: "Medical & Health Exams", 
      description: "Medical and nursing posts under BFUHS and Health Department.", 
      displayOrder: 5,
      iconUrl: "/logos/categories/medical.png"
    },
    { 
      id: "judiciary-exams", 
      title: "Judiciary Exams", 
      description: "Recruitments for High Court and District Court cadres.", 
      displayOrder: 6,
      iconUrl: "/logos/categories/judiciary.png"
    },
    { 
      id: "central-government-exams", 
      title: "Central Government Exams", 
      description: "National recruitments through SSC, Railway, UPSC and Defence.", 
      displayOrder: 7,
      iconUrl: "/logos/categories/central.png"
    }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. AUTHORITY BOARDS (Branding Nodes)
  const boards = [
    // Punjab Government
    { id: "ppsc", abbreviation: "PPSC", name: "Punjab Public Service Commission", categoryId: "punjab-government-exams", displayOrder: 1, iconUrl: "/logos/boards/ppsc.png" },
    { id: "psssb", abbreviation: "PSSSB", name: "Punjab Subordinate Services Selection Board", categoryId: "punjab-government-exams", displayOrder: 2, iconUrl: "/logos/boards/psssb.png" },
    { id: "punjab-police", abbreviation: "Punjab Police", name: "State Police Recruitment", categoryId: "punjab-government-exams", displayOrder: 3, iconUrl: "/logos/boards/punjab-police.png" },
    
    // Teaching
    { id: "pstet", abbreviation: "PSTET", name: "Punjab State Teacher Eligibility Test", categoryId: "punjab-teaching-exams", displayOrder: 1, iconUrl: "/logos/boards/pstet.png" },
    { id: "pseb", abbreviation: "PSEB", name: "Punjab School Education Board", categoryId: "punjab-teaching-exams", displayOrder: 2, iconUrl: "/logos/boards/education-board.png" },
    { id: "erb", abbreviation: "ERB", name: "Education Recruitment Board Punjab", categoryId: "punjab-teaching-exams", displayOrder: 3, iconUrl: "/logos/boards/education-board.png" },
    
    // Technical
    { id: "pspcl", abbreviation: "PSPCL", name: "Punjab State Power Corporation Ltd", categoryId: "punjab-technical-exams", displayOrder: 1, iconUrl: "/logos/boards/pspcl.png" },
    { id: "pstcl", abbreviation: "PSTCL", name: "Punjab State Transmission Corporation Ltd", categoryId: "punjab-technical-exams", displayOrder: 2, iconUrl: "/logos/boards/pstcl.png" },
    
    // Banking
    { id: "pscb", abbreviation: "PSCB", name: "Punjab State Cooperative Bank", categoryId: "banking-exams", displayOrder: 1, iconUrl: "/logos/boards/pscb.png" },
    { id: "ibps", abbreviation: "IBPS", name: "Institute of Banking Personnel Selection", categoryId: "banking-exams", displayOrder: 2, iconUrl: "/logos/boards/ibps.png" },
    
    // Medical
    { id: "bfuhs", abbreviation: "BFUHS", name: "Baba Farid University of Health Sciences", categoryId: "medical-health-exams", displayOrder: 1, iconUrl: "/logos/boards/bfuhs.png" },
    
    // Judiciary
    { id: "phhc", abbreviation: "PHHC", name: "Punjab & Haryana High Court", categoryId: "judiciary-exams", displayOrder: 1, iconUrl: "/logos/boards/high-court.png" },
    
    // Central
    { id: "ssc", abbreviation: "SSC", name: "Staff Selection Commission", categoryId: "central-government-exams", displayOrder: 1, iconUrl: "/logos/boards/ssc.png" },
    { id: "rrb", abbreviation: "RRB", name: "Railway Recruitment Board", categoryId: "central-government-exams", displayOrder: 2, iconUrl: "/logos/boards/rrb.png" },
    { id: "upsc", abbreviation: "UPSC", name: "Union Public Service Commission", categoryId: "central-government-exams", displayOrder: 3, iconUrl: "/logos/boards/upsc.png" }
  ];

  for (const board of boards) {
    batch.set(doc(db, 'boards', board.id), { ...board, updatedAt: serverTimestamp() }, { merge: true });
  }

  await batch.commit();
  console.log('[SUCCESS] Registry Synchronized.');
}
