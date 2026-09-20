import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


// The Firebase config values are inlined into the client bundle at build time by
// next/webpack from the NEXT_PUBLIC_* env vars (confirmed inline with real values
// in the deployed bundle). They are public client-side credentials.
//
// We intentionally initialize Firebase unconditionally. A runtime gate that
// checks browser `process.env` (always empty on the client) leaves auth/db null
// and breaks login with "Authentication not available" — a previous attempt used
// requiredEnvVars/missingEnvVars and was mangled by webpack into `[KEY...].filter(
// e=>process.env[e])`, which always returned non-empty on the client. Removed.
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const analytics = typeof window !== "undefined" && app ? getAnalytics(app) : null;
export const messaging =
  typeof window !== "undefined" && app ? getMessaging(app) : null;

export default app;
