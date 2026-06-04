
import { Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @fileOverview Final Institutional Seeding Engine for Cracklix.
 * Synchronizes official registry and global payment settings.
 */
export async function seedInitialData(db: Firestore) {
  console.log('Initializing Global Punjab Exam Registry Sync...');

  // 1. Official Recruiting Boards
  const boards = [
    { id: 'psssb', abbreviation: 'PSSSB', name: 'Punjab Subordinate Services Selection Board', description: 'Group B, C, and D non-gazetted positions.', iconUrl: 'https://sssb.punjab.gov.in/images/logo.png' },
    { id: 'police', abbreviation: 'Police', name: 'Punjab Police Recruitment Board', description: 'Dedicated law enforcement cadre recruitment.', iconUrl: 'https://picsum.photos/seed/punjab-police/200/200' },
    { id: 'ppsc', abbreviation: 'PPSC', name: 'Punjab Public Service Commission', description: 'Group A and B gazetted administrative posts.', iconUrl: 'https://picsum.photos/seed/ppsc/200/200' },
  ];
  for (const b of boards) await setDoc(doc(db, 'boards', b.id), b);

  // 2. Global Pass Registry Configuration
  const passes = [
    { id: 'free', name: 'Aspirant Free', durationDays: 365, active: true, price: 0 },
    { id: 'silver', name: 'Silver Pass', durationDays: 30, active: true, price: 99 },
    { id: 'gold', name: 'Gold Pass', durationDays: 30, active: true, price: 199 },
    { id: 'platinum', name: 'Platinum Pass', durationDays: 30, active: true, price: 999 },
  ];
  for (const p of passes) await setDoc(doc(db, 'passes', p.id), p);

  // 3. Initial System Config with Manual UPI Registry
  await setDoc(doc(db, 'settings', 'global'), {
    platformName: "Cracklix",
    announcement: "🔥 Official Punjab 2026 Recruitment Calendar Live.",
    showAnnouncement: true,
    upiId: "arshdeepgrewal1122@okaxis",
    supportPhone: "+91 98881 88602",
    supportEmail: "cracklixhelp@gmail.com",
    updatedAt: serverTimestamp()
  }, { merge: true });

  console.log('Global Punjab Exam Registry Sync Complete.');
}
