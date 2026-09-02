"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import Link from "next/link";
import AdminNav from "../adminNav";
import styles from "./login.module.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const { login, error, isLoading } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading && !isLoggingIn) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <AdminNav />
      <div className={styles.headerWrapper}>
        <h2 className={styles.headerTitle}>
          Admin Portal
        </h2>
        <p className={styles.headerSubtitle}>
          Voting System Administration
        </p>
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="admin@oslgsc.com"
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your password"
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className={styles.submitButton}
              >
                {isLoggingIn ? (
                  <>
                    <span className={styles.buttonSpinner}></span>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className={styles.backLinkWrapper}>
            <Link 
              href="/" 
              className={styles.backLink}
            >
              ← Back to main site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;