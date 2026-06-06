
import { Firestore, doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';

/**
 * @fileOverview Institutional Seeding Engine v5.3.
 * Organizes content into Punjab State, Teaching, and Central verticals.
 * Includes Anganwadi, ETT, and Lecturer Cadre.
 */
export async function seedInitialData(db: Firestore) {
  console.log('[AUDIT] Initializing Global Institutional Registry Sync...');

  const stateEmblem = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Emblem_of_Punjab.svg/512px-Emblem_of_Punjab.svg.png';
  const psssbLogo = 'https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg';
  const policeLogo = 'https://punjabpolice.gov.in/media/images/Logo_of_Punjab_Police_India.original.png';
  const eduDeptLogo = 'https://pstet.pseb.ac.in/img/main-logo-2.png';
  const ppscOfficialLogo = 'https://static.pseb.ac.in/psebwebsite/front_assets/sites/default/files/inline-images/emblem.png';
  const armyEmblem = 'https://pbs.twimg.com/profile_images/2054486939102035969/AE8RcJUh_400x400.jpg';
  const courtLogo = 'https://highcourtchd.gov.in/images/newlogo.png';
  const ctetLogo = 'https://cdnbbsr.s3waas.gov.in/s3443dec3062d0286986e21dc0631734c9/uploads/2023/03/2023032156.png';

  // 1. Boards Registry
  const boards = [
    // Punjab State Exams
    { id: 'psssb', abbreviation: 'PSSSB', name: 'Punjab Subordinate Services Selection Board', iconUrl: psssbLogo, region: 'Punjab', category: 'PUNJAB_STATE', description: 'Group B and C recruitment hub.' },
    { id: 'punjab-police', abbreviation: 'Police', name: 'Punjab Police Recruitment', iconUrl: policeLogo, region: 'Punjab', category: 'PUNJAB_STATE', description: 'District and Armed cadre registry.' },
    { id: 'pspcl', abbreviation: 'PSPCL', name: 'Punjab State Power Corporation Limited', iconUrl: 'https://pspcl.in/assets/images/logo.png', region: 'Punjab', category: 'PUNJAB_STATE', description: 'Technical and clerical power nodes.' },
    { id: 'ppsc', abbreviation: 'PPSC', name: 'Punjab Public Service Commission', iconUrl: ppscOfficialLogo, region: 'Punjab', category: 'PUNJAB_STATE', description: 'Class A and B Gazetted services.' },
    { id: 'high-court', abbreviation: 'High Court', name: 'Punjab & Haryana High Court', iconUrl: courtLogo, region: 'Punjab', category: 'PUNJAB_STATE', description: 'Judicial and SSSC clerical nodes.' },
    { id: 'punjab-anganwadi', abbreviation: 'Anganwadi', name: 'Punjab Anganwadi Recruitment', iconUrl: stateEmblem, region: 'Punjab', category: 'PUNJAB_STATE', description: 'Social security and child development node.' },
    
    // Teaching Exams
    { id: 'pstet-board', abbreviation: 'PSTET', name: 'Punjab Education Dept (PSTET)', iconUrl: eduDeptLogo, region: 'Punjab', category: 'TEACHING', description: 'State Teacher Eligibility Hub.' },
    { id: 'ctet-board', abbreviation: 'CTET', name: 'Central Teacher Eligibility Test', iconUrl: ctetLogo, region: 'National', category: 'TEACHING', description: 'Central schooling eligibility node.' },
    { id: 'ett-cadre', abbreviation: 'ETT', name: 'Punjab ETT Cadre', iconUrl: eduDeptLogo, region: 'Punjab', category: 'TEACHING', description: 'Elementary Teacher Training vertical.' },
    { id: 'lecturer-cadre', abbreviation: 'Lecturer', name: 'Punjab Lecturer Cadre', iconUrl: eduDeptLogo, region: 'Punjab', category: 'TEACHING', description: 'Higher secondary teaching node.' },
    
    // Central Exams
    { id: 'indian-army', abbreviation: 'ARMY', name: 'Indian Army Recruitment', iconUrl: armyEmblem, region: 'National', category: 'CENTRAL', description: 'Defense and Agniveer verticals.' },
    { id: 'ssc', abbreviation: 'SSC', name: 'Staff Selection Commission', iconUrl: 'https://ssc.gov.in/assets/sscLogo.webp', region: 'National', category: 'CENTRAL', description: 'Central staff recruitment authority.' }
  ];

  for (const b of boards) {
    await setDoc(doc(db, 'boards', b.id), { ...b, updatedAt: serverTimestamp() });
  }

  // 2. Initial Subjects
  const subjects = [
    { id: 'punjab-gk', name: 'Punjab GK & History' },
    { id: 'punjabi-paper-a', name: 'Punjabi Qualifying (Paper A)' },
    { id: 'mental-ability', name: 'Reasoning' },
    { id: 'quant', name: 'Quantitative Aptitude' },
    { id: 'child-pedagogy', name: 'Child Development & Pedagogy' },
    { id: 'ict', name: 'ICT / Computers' }
  ];

  for (const s of subjects) {
    await setDoc(doc(db, 'subjects', s.id), { ...s, updatedAt: serverTimestamp() });
  }

  console.log('[AUDIT] Institutional Registry Sync Complete.');
}
