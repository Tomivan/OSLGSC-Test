"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { NomineeCard } from "../nomineeCard/NomineeCard";
import { useVote, useSocket } from "../../context/VoteContext";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import styles from "./Categories.module.css";

interface Contestant {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  votes: number;
}

interface Category {
  id: string;
  name: string;
  isOpen: boolean;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    votes, 
    selectedNominees, 
    handleVoteChange,
    liveVotes,
    syncWithFirebase,
    isSyncing
  } = useVote();
  
  const { isConnected } = useSocket();

  useEffect(() => {
    const fetchContestants = async () => {
      try {
        setLoading(true);
        
        const contestantsSnapshot = await getDocs(collection(db, "contestants"));
        const contestantsData: Contestant[] = contestantsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Contestant[];

        setContestants(contestantsData);

        const allCategories = contestantsData
          .map(c => c.category)
          .filter(Boolean);

        const uniqueCategories = allCategories.filter((category, index, array) => 
          array.indexOf(category) === index
        );

        const categoryData: Category[] = uniqueCategories.map((categoryName, index) => ({
          id: `cat-${index + 1}`,
          name: categoryName,
          isOpen: false
        }));

        setCategories(categoryData);
        setError(null);
      } catch (err) {
        console.error("Error fetching contestants:", err);
        setError("Failed to load categories and nominees");
      } finally {
        setLoading(false);
      }
    };

    fetchContestants();
  }, []);

  useEffect(() => {
    const autoSync = async () => {
      if (Object.keys(votes).length > 0 && !isSyncing && isConnected) {
        const result = await syncWithFirebase();
        if (result.success) {
          console.log(`Auto-sync successful: ${result.syncedVotes} votes synced`);
        }
      }
    };

    const timeoutId = setTimeout(autoSync, 3000); 
    
    return () => clearTimeout(timeoutId);
  }, [votes, isSyncing, isConnected, syncWithFirebase]);

  useEffect(() => {
    return () => {
      if (Object.keys(votes).length > 0 && !isSyncing) {
        const syncData = JSON.stringify({ votes, timestamp: Date.now() });
        navigator.sendBeacon('/api/sync-votes', syncData);
      }
    };
  }, [votes, isSyncing]);

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, isOpen: !cat.isOpen } : cat
      )
    );
  };

  const getContestantsForCategory = useCallback((categoryName: string) => {
    return contestants.filter(contestant => contestant.category === categoryName);
  }, [contestants]);

  const getLiveVoteCount = useCallback((contestant: Contestant): number => {
    const firebaseVotes = contestant.votes || 0;
    const liveIncrement = liveVotes[contestant.id] || 0;
    return firebaseVotes + liveIncrement;
  }, [liveVotes]);

  const getImageUrl = (contestant: Contestant) => {
    return contestant.imageUrl || "/image.png";
  };

  const sortedContestantsByCategory = useMemo(() => {
    const map = new Map();
    categories.forEach(category => {
      const categoryContestants = getContestantsForCategory(category.name);
      const sorted = [...categoryContestants].sort((a, b) => 
        getLiveVoteCount(b) - getLiveVoteCount(a)
      );
      map.set(category.name, sorted);
    });
    return map;
  }, [categories, getContestantsForCategory, getLiveVoteCount]);

  if (loading) {
    return (
      <main className={styles.loadingMain}>
        <section className={styles.loadingSection}>
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
            <p className={styles.loaderText}>Loading categories...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.loadingMain}>
        <section className={styles.loadingSection}>
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Retry
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (categories.length === 0) {
    return (
      <main className={styles.loadingMain}>
        <section className={styles.loadingSection}>
          <div className={styles.emptyContainer}>
            <p className={styles.emptyText}>No categories available yet.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.mainContainer} id="categories">
      <section className={styles.sectionContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.headerWrapper}>
            <h1 className={styles.mainTitle}>
              CATEGORIES
            </h1>
          </div>

          {isSyncing && (
            <div className={styles.syncIndicator}>
              <p className={styles.syncText}>
                ⚡ Syncing votes...
              </p>
            </div>
          )}

          <div className={styles.categoriesList}>
            {categories.map((category) => {
              const categoryContestants = sortedContestantsByCategory.get(category.name) || [];
              
              return (
                <div
                  key={category.id}
                  className={styles.categoryItem}
                >
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={styles.categoryToggle}
                  >
                    <span className={styles.categoryToggleLeft}>
                      <span>
                        {category.name}
                        {categoryContestants.length > 0 && (
                          <span className={styles.categoryCount}>
                            ({categoryContestants.length} nominee{categoryContestants.length !== 1 ? 's' : ''})
                          </span>
                        )}
                      </span>
                      
                      {categoryContestants.some((c: { id: string | number; }) => liveVotes[c.id] > 0) && (
                        <span className={styles.liveBadge}>
                          🔴 voting now
                        </span>
                      )}
                    </span>
                    <svg
                      className={`${styles.chevron} ${category.isOpen ? styles.chevronOpen : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {category.isOpen && (
                    <div className={styles.categoryContent}>
                      {categoryContestants.length === 0 ? (
                        <div className={styles.emptyNominees}>
                          No nominees available for this category.
                        </div>
                      ) : (
                        <div className={styles.nomineesGrid}>
                          {categoryContestants.map((contestant: Contestant) => {
                            const isSelected =
                              selectedNominees[category.id]?.includes(contestant.id);
                            const voteQuantity =
                              votes[category.id]?.[contestant.id] || 0;
                            const liveIncrement = liveVotes[contestant.id] || 0;

                            return (
                              <NomineeCard
                                key={contestant.id}
                                nominee={{
                                  id: contestant.id,
                                  name: contestant.name,
                                  image: getImageUrl(contestant),
                                  voteCount: getLiveVoteCount(contestant),
                                  liveIncrement
                                }}
                                voteQuantity={voteQuantity}
                                onVoteChange={(nomineeId, quantity) =>
                                  handleVoteChange(category.id, nomineeId, quantity)
                                }
                                isSelected={isSelected}
                                categoryId={category.id}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Categories;