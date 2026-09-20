"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy,
  where
} from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase/config";
import type { Auth } from "firebase/auth";

export type UserRole = "customer" | "staff" | "admin";

export interface User {
  email: string;
  name: string;
  role: UserRole;
  uid: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  updateAccountRole: (email: string, role: UserRole) => Promise<boolean>;
  deleteAccount: (email: string) => Promise<boolean>;
  getAccountsList: () => Promise<Array<{ name: string; email: string; role: UserRole }>>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getAuthErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("code" in error)) return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (db) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              email: firebaseUser.email || "",
              name: userData.name || "",
              role: userData.role || "customer",
              uid: firebaseUser.uid,
            });
          } else {
            setUser({
              email: firebaseUser.email || "",
              name: firebaseUser.email?.split("@")[0] || "User",
              role: "customer",
              uid: firebaseUser.uid,
            });
          }
        } else {
          setUser({
            email: firebaseUser.email || "",
            name: firebaseUser.email?.split("@")[0] || "User",
            role: "customer",
            uid: firebaseUser.uid,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const ensureDefaultAdmin = async () => {
    if (!db) return;
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", "admin@happytruffles.qa"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      await setDoc(doc(db, "users", "admin@happytruffles.qa"), {
        name: "Admin User",
        email: "admin@happytruffles.qa",
        role: "admin",
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    ensureDefaultAdmin();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!auth) return { success: false, error: "Authentication not available" };
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = "Invalid email or password.";
      const code = getAuthErrorCode(error);

      if (code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      } else if (code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      }
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = "customer"): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!auth || !db) return { success: false, error: "Authentication not available" };
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", result.user.uid), {
         name,
         email,
         role,
         createdAt: new Date().toISOString(),
       });
       return { success: true };
     } catch (error) {
       console.error("Registration failed:", error);
       let errorMessage = "Registration failed. Please try again.";
       const code = getAuthErrorCode(error);
       
       if (code === "auth/email-already-in-use") {
         errorMessage = "Email already registered";
         return { success: false, error: errorMessage };
       } else if (code === "auth/invalid-email") {
         errorMessage = "Please enter a valid email address.";
         return { success: false, error: errorMessage };
       } else if (code === "auth/weak-password") {
         errorMessage = "Password should be at least 6 characters.";
         return { success: false, error: errorMessage };
       }
       
       return { success: false, error: errorMessage };
     }
   };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth) return { success: false, error: "Authentication not available" };
    
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error("Password reset failed:", error);
      let errorMessage = "Password reset failed. Please try again.";
      const code = getAuthErrorCode(error);
      
      if (code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
        return { success: false, error: errorMessage };
      } else if (code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
        return { success: false, error: errorMessage };
      } else if (code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
        return { success: false, error: errorMessage };
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (!auth) return;
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    if (user.email === "admin@happytruffles.qa") return true;
    if (user.role === "admin") return true;
    return user.role === role;
  };

  const updateAccountRole = async (email: string, role: UserRole): Promise<boolean> => {
    try {
      if (!db) return false;
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return false;
      
      const userDoc = snapshot.docs[0];
      await updateDoc(userDoc.ref, { role });
      
      if (user && user.email === email) {
        setUser({ ...user, role });
      }
      return true;
    } catch (error) {
      console.error("Update role failed:", error);
      return false;
    }
  };

  const deleteAccount = async (email: string): Promise<boolean> => {
    try {
      if (!db) return false;
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return false;
      
      const userDoc = snapshot.docs[0];
      await deleteDoc(userDoc.ref);
      
      if (user && user.email === email) {
        setUser(null);
      }
      return true;
    } catch (error) {
      console.error("Delete account failed:", error);
      return false;
    }
  };

  const getAccountsList = async (): Promise<Array<{ name: string; email: string; role: UserRole }>> => {
    try {
      if (!db) return [];
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("email"));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          name: data.name || "",
          email: data.email || "",
          role: data.role || "customer",
        };
      });
    } catch (error) {
      console.error("Get accounts list failed:", error);
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      forgotPassword, 
      logout, 
      isAuthenticated: !!user, 
      hasRole, 
      updateAccountRole, 
      deleteAccount, 
      getAccountsList,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}