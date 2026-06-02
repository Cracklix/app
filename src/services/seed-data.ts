
import { Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function seedInitialData(db: Firestore) {
  console.log('Starting institutional seed process for Cracklix...');

  const boards = [
    { id: 'psssb', name: 'Punjab Subordinate Services Selection Board', abbreviation: 'PSSSB', description: 'Major board for Group B & C technical and non-technical recruitment.' },
    { id: 'ppsc', name: 'Punjab Public Service Commission', abbreviation: 'PPSC', description: 'Nodal agency for recruiting Class-I and Class-II gazetted officers.' },
    { id: 'punjab-police', name: 'Punjab Police Recruitment Board', abbreviation: 'Police', description: 'Recruitment board for District and Armed Cadres of Punjab Police.' },
    { id: 'pstet-edu', name: 'Punjab Education Board', abbreviation: 'PSTET', description: 'Handles eligibility and recruitment for Master Cadre and ETT teachers.' }
  ];

  for (const board of boards) {
    await setDoc(doc(db, 'boards', board.id), board);
  }

  const subjects = [
    { id: 'punjab-gk', name: 'Punjab GK', description: 'History, Culture, Geography, and Economy of Punjab.' },
    { id: 'reasoning', name: 'Reasoning', description: 'Logical and analytical reasoning aptitude.' },
    { id: 'quant', name: 'Quantitative Aptitude', description: 'Mathematical and numerical ability.' },
    { id: 'punjabi-lang', name: 'Punjabi Language', description: 'Punjabi Grammar and Literature (Qualifying Section).' },
    { id: 'english-lang', name: 'English Language', description: 'English Grammar and Comprehension.' }
  ];

  for (const subject of subjects) {
    await setDoc(doc(db, 'subjects', subject.id), subject);
  }

  const currentAffairs = [
    {
      id: 'ca1',
      title: 'Punjab Cabinet Approves Solar Energy Policy 2026',
      category: 'Punjab',
      date: 'Oct 28, 2026',
      summary: 'The Punjab Cabinet has approved a major shift towards solar energy for government buildings and agriculture pumps.',
      createdAt: serverTimestamp()
    },
    {
      id: 'ca2',
      title: 'Global Sports Summit: Punjab to Host 2027 Athletics',
      category: 'Sports',
      date: 'Oct 26, 2026',
      summary: 'Ludhiana and Jalandhar will host the upcoming international athletics meet, boosting sports infrastructure.',
      createdAt: serverTimestamp()
    },
    {
      id: 'ca3',
      title: 'New Recruitment Rules for PPSC Gazetted Officers',
      category: 'Schemes',
      date: 'Oct 25, 2026',
      summary: 'The PPSC has updated the syllabus and marking pattern for the Executive and DSP cadre exams.',
      createdAt: serverTimestamp()
    }
  ];

  for (const ca of currentAffairs) {
    await setDoc(doc(db, 'current_affairs', ca.id), ca);
  }

  const notifications = [
    { id: 'n1', title: 'PSSSB Patwari Result Declared', time: '10m ago', createdAt: serverTimestamp() },
    { id: 'n2', title: 'New Vacancies: 500 Sub-Inspectors', time: '2h ago', createdAt: serverTimestamp() },
    { id: 'n3', title: 'PSTET Admit Card Download Live', time: '5h ago', createdAt: serverTimestamp() }
  ];

  for (const n of notifications) {
    await setDoc(doc(db, 'notifications', n.id), n);
  }

  console.log('Seed data successfully populated for Arsh Grewal project.');
}
