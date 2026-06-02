import { Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function seedInitialData(db: Firestore) {
  console.log('Starting seed process...');

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

  const exams = [
    { 
      id: 'revenue-patwari', 
      boardId: 'psssb', 
      name: 'Revenue Patwari', 
      category: 'Revenue', 
      description: 'Unified exam for Revenue Patwari, Canal Patwari and Ziladar posts.', 
      totalMocks: 45, 
      activeQuestions: 1200 
    },
    { 
      id: 'psssb-clerk', 
      boardId: 'psssb', 
      name: 'Clerk (General/IT/Accounts)', 
      category: 'Clerical', 
      description: 'Common recruitment for clerical posts across various Punjab departments.', 
      totalMocks: 60, 
      activeQuestions: 2500 
    },
    { 
      id: 'police-constable', 
      boardId: 'punjab-police', 
      name: 'Constable (District/Armed)', 
      category: 'Police', 
      description: 'Annual recruitment for Constable posts in various police cadres.', 
      totalMocks: 50, 
      activeQuestions: 3000 
    },
    { 
      id: 'pcs-prelims', 
      boardId: 'ppsc', 
      name: 'Civil Services Prelims', 
      category: 'Executive', 
      description: 'Preliminary exam for the elite Punjab Civil Services.', 
      totalMocks: 20, 
      activeQuestions: 5000 
    }
  ];

  for (const exam of exams) {
    await setDoc(doc(db, 'exams', exam.id), exam);
  }

  const sampleQuestions = [
    {
      id: 'q-sample-1',
      subjectId: 'punjabi-lang',
      text: 'ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਦੀ ਟਕਸਾਲੀ ਬੋਲੀ ਕਿਹੜੀ ਹੈ?',
      options: ['ਮਾਲਵੀ', 'ਮਾਝੀ', 'ਦੁਆਬੀ', 'ਪੁਆਧੀ'],
      correctAnswer: 1,
      difficulty: 'Easy',
      topic: 'Grammar',
      explanation: 'ਮਾਝੀ ਉਪ-ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਦੀ ਟਕਸਾਲੀ (Standard) ਬੋਲੀ ਹੈ।',
      createdAt: serverTimestamp()
    },
    {
      id: 'q-sample-2',
      subjectId: 'punjab-gk',
      text: 'Which Guru founded the city of Amritsar?',
      options: ['Guru Nanak Dev Ji', 'Guru Ram Das Ji', 'Guru Arjan Dev Ji', 'Guru Gobind Singh Ji'],
      correctAnswer: 1,
      difficulty: 'Medium',
      topic: 'History',
      explanation: 'Guru Ram Das Ji founded the city of Amritsar, originally called Ramdaspur.',
      createdAt: serverTimestamp()
    }
  ];

  for (const q of sampleQuestions) {
    await setDoc(doc(db, 'questions', q.id), q);
  }

  console.log('Seed data successfully populated for Arsh Grewal project.');
}
