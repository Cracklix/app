import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Hardened Firebase Initialization Node v2.0.
 * Enforces a singleton pattern to prevent multiple app initialization errors.
 */

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

export function initializeFirebase(): { app: FirebaseApp; firestore: Firestore; auth: Auth; storage: FirebaseStorage } {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  firestore = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);

  return { app, firestore, auth, storage };
}

// Strictly controlled named exports
export { FirebaseProvider, useFirebaseApp, useFirestore, useAuth, useStorage } from './provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
