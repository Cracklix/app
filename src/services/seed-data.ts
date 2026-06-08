
import { Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @fileOverview Institutional Seeding Engine v63.0.
 * PERFORMANCE: Added performance stats node to prevent collection scans on Home/Admin views.
 * UPDATED: Seeded Monthly, Quarterly, and Yearly Pass Tiers.
 */
export async function seedInitialData(db: Firestore) {
  console.log('[AUDIT] Initializing Cracklix Performance Hub Sync...');

  // 1. INITIALIZE STATS HUB (Performance Fix for scan-heavy pages)
  await setDoc(doc(db, 'settings', 'stats'), {
    mcqCount: 12500,
    userCount: 15400,
    mockCount: 520,
    avgAccuracy: 94,
    updatedAt: serverTimestamp()
  }, { merge: true });

  // 2. PASS REGISTRY (Monthly, Quarterly, Yearly)
  const passFeatures = [
    "500+ Full Length Mocks",
    "Premium Subject Tests",
    "Premium Sectional Tests",
    "Official PYQ Repository",
    "State Merit Rankings",
    "AI Rationalization Tutors"
  ];

  const plans = [
    {
      id: 'monthly-pass',
      name: 'Monthly PASS',
      price: 299,
      durationDays: 30,
      description: 'Institutional access for 1 month.',
      features: passFeatures,
      displayOrder: 1,
      type: 'PREMIUM',
      active: true,
      adFree: false
    },
    {
      id: 'quarterly-pass',
      name: 'Quarterly PASS',
      price: 599,
      durationDays: 90,
      description: 'The most popular preparation tier.',
      features: [...passFeatures, "Priority WhatsApp Alerts"],
      displayOrder: 2,
      type: 'PREMIUM',
      active: true,
      adFree: true
    },
    {
      id: 'yearly-pass',
      name: 'Yearly PASS',
      price: 999,
      durationDays: 365,
      description: 'Full institutional access for 1 year.',
      features: [...passFeatures, "Mentorship by Arsh Grewal", "Ad-Free Learning"],
      displayOrder: 3,
      type: 'PREMIUM',
      active: true,
      adFree: true
    }
  ];

  for (const p of plans) {
    await setDoc(doc(db, 'passes', p.id), { ...p, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. BOARDS REGISTRY
  const psssbLogo = "https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg";
  const psebLogo = "https://static.pseb.ac.in/uploads/1648628722_PSEBlogo_2.png";
  
  const boards = [
    { id: 'psssb', abbreviation: 'PSSSB', name: 'Punjab Subordinate Services Selection Board', region: 'Punjab', category: 'STATE_BOARD', iconUrl: psssbLogo },
    { id: 'punjab-police', abbreviation: 'POLICE', name: 'Punjab Police Recruitment Board', region: 'Punjab', category: 'DEFENCE_BOARD', iconUrl: "https://www.punjabpolice.gov.in/media/images/Logo_of_Punjab_Police_India.original.png" },
    { id: 'education', abbreviation: 'EDUCATION', name: 'Education Recruitment Board Punjab', region: 'Punjab', category: 'TEACHING_BOARD', iconUrl: psebLogo }
  ];

  for (const b of boards) {
    await setDoc(doc(db, 'boards', b.id), { ...b, updatedAt: serverTimestamp() }, { merge: true });
  }

  // 4. SUBJECT REGISTRY
  const subjects = [
    { id: 'punjab-gk', name: 'Punjab History & Culture', aliases: ['Punjab GK'] },
    { id: 'reasoning', name: 'Logical Reasoning', aliases: ['Reasoning'] },
    { id: 'quant', name: 'Quantitative Aptitude', aliases: ['Maths'] }
  ];

  for (const s of subjects) {
    await setDoc(doc(db, 'subjects', s.id), { ...s, updatedAt: serverTimestamp() }, { merge: true });
  }

  console.log('[AUDIT] Performance Nodes Synchronized.');
}
