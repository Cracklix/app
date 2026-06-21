import { Firestore, doc, serverTimestamp, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Official Institutional Registry Seeder v40.0.
 * BRANDING: Added official logo nodes for categories and boards.
 */

export async function seedInitialData(db: Firestore) {
  console.log('[REBUILD] Synchronizing High-Fidelity Registry...');
  const batch = writeBatch(db);

  // 1. CANONICAL CATEGORIES
  const categories = [
    { 
      id: "punjab-government-exams", 
      title: "Punjab Government Exams", 
      description: "Recruitments through PPSC, PSSSB, Punjab Police and Punjab Courts.", 
      displayOrder: 1,
      iconUrl: "https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg"
    },
    { 
      id: "punjab-teaching-exams", 
      title: "Punjab Teaching Exams", 
      description: "Teacher recruitments for Master Cadre, ETT, PSTET and CTET.", 
      displayOrder: 2,
      iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbNnoge6pNWx1HZYrUJKM58qWk1dDw85xvKPBoG-O4ew&s=10"
    },
    { 
      id: "punjab-technical-exams", 
      title: "Punjab Technical Exams", 
      description: "Posts in PSPCL, PSTCL and various Engineering departments.", 
      displayOrder: 3,
      iconUrl: "https://www.pspcl.in/images/logo.png"
    },
    { 
      id: "banking-exams", 
      title: "Banking Exams", 
      description: "Recruitments for PSCB, Cooperative Banks and Central Banking.", 
      displayOrder: 4,
      iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7McWqZqOgKy-BakccvR02WQdEQFrwuvmHBG5rYJzuEg&s=10"
    },
    { 
      id: "medical-health-exams", 
      title: "Medical & Health Exams", 
      description: "Medical and nursing posts under BFUHS and Health Department.", 
      displayOrder: 5,
      iconUrl: "https://bfuhs.ac.in/images/logo.png"
    },
    { 
      id: "judiciary-exams", 
      title: "Judiciary Exams", 
      description: "Recruitments for High Court and District Court cadres.", 
      displayOrder: 6,
      iconUrl: "https://highcourtchd.gov.in/images/logo.png"
    },
    { 
      id: "central-government-exams", 
      title: "Central Government Exams", 
      description: "National recruitments through SSC, Railway, UPSC and Defence.", 
      displayOrder: 7,
      iconUrl: "https://alchetron.com/cdn/government-of-india-973b74d1-e25f-41f2-ba2b-51595702248-resize-750.jpeg"
    }
  ];

  for (const cat of categories) {
    batch.set(doc(db, 'categories', cat.id), { ...cat, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. AUTHORITY BOARDS (Inheritance Nodes)
  const boards = [
    // Punjab Govt
    { id: "ppsc", abbreviation: "PPSC", name: "Punjab Public Service Commission", categoryId: "punjab-government-exams", displayOrder: 1, iconUrl: "https://ppsc.gov.in/Content/images/ppsc_logo.png" },
    { id: "psssb", abbreviation: "PSSSB", name: "Punjab Subordinate Services Selection Board", categoryId: "punjab-government-exams", displayOrder: 2, iconUrl: "https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/logo.png" },
    { id: "punjab-police", abbreviation: "Punjab Police", name: "State Police Recruitment", categoryId: "punjab-government-exams", displayOrder: 3, iconUrl: "https://www.punjabpolice.gov.in/media/images/Logo_of_Punjab_Police_India.original.png" },
    
    // Teaching
    { id: "erb", abbreviation: "Education Board", name: "Education Recruitment Board Punjab", categoryId: "punjab-teaching-exams", displayOrder: 1, iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbNnoge6pNWx1HZYrUJKM58qWk1dDw85xvKPBoG-O4ew&s=10" },
    
    // Technical
    { id: "pspcl", abbreviation: "PSPCL", name: "Punjab State Power Corporation Ltd", categoryId: "punjab-technical-exams", displayOrder: 1, iconUrl: "https://www.pspcl.in/images/logo.png" },
    { id: "pstcl", abbreviation: "PSTCL", name: "Punjab State Transmission Corporation Ltd", categoryId: "punjab-technical-exams", displayOrder: 2, iconUrl: "https://www.pstcl.org/images/logo.png" },
    
    // Health
    { id: "bfuhs", abbreviation: "BFUHS", name: "Baba Farid University of Health Sciences", categoryId: "medical-health-exams", displayOrder: 1, iconUrl: "https://bfuhs.ac.in/images/logo.png" },
    
    // Banking
    { id: "pscb", abbreviation: "PSCB", name: "Punjab State Cooperative Bank", categoryId: "banking-exams", displayOrder: 1, iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7McWqZqOgKy-BakccvR02WQdEQFrwuvmHBG5rYJzuEg&s=10" }
  ];

  for (const board of boards) {
    batch.set(doc(db, 'boards', board.id), { ...board, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. EXAM VERTICALS (Automatic Inheritance)
  const exams = [
    { id: "pcs", name: "Punjab Civil Services (PCS)", boardId: "ppsc", categoryId: "punjab-government-exams" },
    { id: "clerk", name: "Clerk (General/IT/Accounts)", boardId: "psssb", categoryId: "punjab-government-exams" },
    { id: "police-constable", name: "Police Constable", boardId: "punjab-police", categoryId: "punjab-government-exams" },
    { id: "pstet-1", name: "PSTET Paper 1", boardId: "erb", categoryId: "punjab-teaching-exams" },
    { id: "alm", name: "Assistant Lineman (ALM)", boardId: "pspcl", categoryId: "punjab-technical-exams" },
    { id: "staff-nurse", name: "Staff Nurse", boardId: "bfuhs", categoryId: "medical-health-exams" }
  ];

  for (const exam of exams) {
    batch.set(doc(db, 'exams', exam.id), { ...exam, updatedAt: serverTimestamp(), displayOrder: 1 }, { merge: true });
  }

  await batch.commit();
  console.log('[SUCCESS] Registry Synchronized.');
}
