"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface AdminUser {
  uid: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert Firebase User to AdminUser
  const convertToAdminUser = async (firebaseUser: User): Promise<AdminUser | null> => {
    try {
      console.log("Checking admin privileges for:", firebaseUser.uid);
      
      // Check if user exists in admins collection
      const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid));
      
      console.log("Admin document exists:", adminDoc.exists());
      
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        console.log("Admin data:", adminData);
        
        // Only include fields that actually exist in your database
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          role: adminData.role || "admin" // Use default if role doesn't exist
        };
      }
      
      // User is not in admins collection
      console.log("User not found in admins collection");
      return null;
    } catch (error) {
      console.error("Error converting to admin user:", error);
      return null;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setError(null);

      try {
        if (firebaseUser) {
          console.log("Firebase user authenticated:", firebaseUser.uid);
          const adminUser = await convertToAdminUser(firebaseUser);
          console.log("Admin user after conversion:", adminUser);
          
          if (adminUser) {
            setAdmin(adminUser);
            console.log("Admin user set in state");
          } else {
            // User is authenticated but not an admin - sign them out
            console.log("User is not an admin, signing out...");
            await signOut(auth);
            setAdmin(null);
            setError("Access denied. Admin privileges required.");
          }
        } else {
          console.log("No firebase user");
          setAdmin(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setError("Authentication error occurred.");
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting login for:", email);
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log("Firebase auth successful:", firebaseUser.uid);

      // Check if user is in admins collection
      const adminUser = await convertToAdminUser(firebaseUser);
      console.log("Admin check result:", adminUser);
      
      if (adminUser) {
        setAdmin(adminUser);
        console.log("Login successful - admin user set");
        return true;
      } else {
        // User is not an admin - sign them out
        console.log("User is not an admin, signing out...");
        await signOut(auth);
        setError("Access denied. Admin privileges required.");
        return false;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setAdmin(null);
      setError(null);
    } catch (error) {
      console.error("Logout error:", error);
      setError("Logout failed. Please try again.");
    }
  };

  const value: AdminAuthContextType = {
    admin,
    login,
    logout,
    isLoading,
    error
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};