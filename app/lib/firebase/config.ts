import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, isSupported } from "firebase/messaging";

// These are PUBLIC Firebase web credentials. They are safe to commit: they ship
// to the browser anyway and are read-only access identifiers (Firestore rules /
// Auth sign-in methods enforce the actual security). Baking them directly here
// eliminates all NEXT_PUBLIC_* env/process.env uncertainty that previously made
// auth/db null on the client ("Authentication not available") and crashed the
// server build ("auth/invalid-api-key" when process.env was empty during build).
const firebaseConfig = {
  apiKey: "AIzaSyD0h8IfyAEvu0FQK2_KG91HkhIVhTx9VwA",
  authDomain: "happy-truffles-cafe.firebaseapp.com",
  projectId: "happy-truffles-cafe",
  storageBucket: "happy-truffles-cafe.firebasestorage.app",
  messagingSenderId: "278513287245",
  appId: "1:278513287245:web:a74838f3a242e960041c04",
  measurementId: "G-4M4HLX33TX",
};

let app: FirebaseApp | null = null;

// Initialize once. Wrap in try/catch so a missing/invalid value can never crash
// the build or the server at runtime — auth/db simply stay null and callers guard
// for that.
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error("[firebase] Failed to initialize Firebase:", error);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const analytics = typeof window !== "undefined" && app ? getAnalytics(app) : null;
export const messaging =
  typeof window !== "undefined" && app ? getMessaging(app) : null;

export default app;
