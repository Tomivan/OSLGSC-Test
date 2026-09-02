"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { NomineeDetailPage } from "../../../components/nomineeDetail/NomineeDetail";
import styles from "./NomineePage.module.css";

interface NomineeData {
  id: string;
  name: string;
  image: string;
  voteCount: number;
  category: string;
  categoryId: string;
  bio?: string;
}

export default function NomineePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const nomineeId = params.id as string;
  const categoryId = searchParams.get("category") || "";
  
  const [nominee, setNominee] = useState<NomineeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNominee = async () => {
      try {
        setLoading(true);
        const nomineeRef = doc(db, "contestants", nomineeId);
        const nomineeSnap = await getDoc(nomineeRef);

        if (nomineeSnap.exists()) {
          const data = nomineeSnap.data();
          
          setNominee({
            id: nomineeSnap.id,
            name: data.name || "Unknown",
            image: data.imageUrl || "/image.png", 
            voteCount: data.votes || 0,
            category: data.category || "Unknown Category", 
            categoryId: categoryId, 
            bio: data.bio || data.description || "",
          });
        } else {
          setError("Nominee not found");
        }
      } catch (err) {
        console.error("Error fetching nominee:", err);
        setError("Failed to load nominee details");
      } finally {
        setLoading(false);
      }
    };

    if (nomineeId) {
      fetchNominee();
    }
  }, [nomineeId, categoryId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading nominee details...</p>
        </div>
      </div>
    );
  }

  if (error || !nominee) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <svg className={styles.errorIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className={styles.errorTitle}>Error</h2>
          <p className={styles.errorMessage}>{error || "Nominee not found"}</p>
          <button
            onClick={() => window.history.back()}
            className={styles.backButton}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <NomineeDetailPage nominee={nominee} />;
}