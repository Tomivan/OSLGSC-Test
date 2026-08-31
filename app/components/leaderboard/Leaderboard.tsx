"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useVote, useSocket } from "../../context/VoteContext";
import { db } from "../../lib/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import styles from "./Leaderboard.module.css";

interface Contestant {
  id: string;
  name: string;
  votes: number;
  category: string;
}

const Leaderboard = () => {
  const [baseContestants, setBaseContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { liveVotes } = useVote();
  const { isConnected } = useSocket();

  useEffect(() => {
    const fetchTopContestants = async () => {
      try {
        setLoading(true);
        
        const contestantsQuery = query(
          collection(db, "contestants"),
          orderBy("votes", "desc"),
          limit(5)
        );

        const querySnapshot = await getDocs(contestantsQuery);
        const contestantsData: Contestant[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          contestantsData.push({
            id: doc.id,
            name: data.name,
            votes: data.votes || 0,
            category: data.category || "Unknown Category"
          });
        });

        setBaseContestants(contestantsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchTopContestants();
  }, []);

  const liveLeaderboard = useMemo(() => {
    const updated = baseContestants.map(contestant => ({
      ...contestant,
      liveVotes: contestant.votes + (liveVotes[contestant.id] || 0),
      liveIncrement: liveVotes[contestant.id] || 0
    }));

    return updated.sort((a, b) => b.liveVotes - a.liveVotes);
  }, [baseContestants, liveVotes]);

  if (loading) {
    return (
      <main className={styles.loadingMain}>
        <div className={styles.loadingContainer}>
          <div className={styles.leaderboardWrapper}>
            <div className={styles.leaderboardHeader}>
              <h2 className={styles.leaderboardTitle}>
                REAL-TIME LEADERBOARD
              </h2>
            </div>
            <div className={styles.leaderboardBody}>
              <div className={styles.loaderContent}>
                <div className={styles.loaderSpinner}></div>
                <p className={styles.loadingText}>Loading leaderboard...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.loadingMain}>
        <div className={styles.loadingContainer}>
          <div className={styles.leaderboardWrapper}>
            <div className={styles.leaderboardHeader}>
              <h2 className={styles.leaderboardTitle}>
                REAL-TIME LEADERBOARD
              </h2>
            </div>
            <div className={styles.leaderboardBody}>
              <p className={styles.errorText}>{error}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.leaderboardWrapper}>
          <div className={styles.leaderboardHeader}>
            <h2 className={styles.leaderboardTitle}>
              REAL-TIME LEADERBOARD
            </h2>
          </div>
          <div className={styles.leaderboardBody}>
            {liveLeaderboard.length === 0 ? (
              <div className={styles.emptyState}>
                No contestants found.
              </div>
            ) : (
              <>
                {liveLeaderboard.map((contestant, index) => (
                  <div
                    key={contestant.id}
                    className={styles.leaderboardItem}
                  >
                    <div className={styles.contestantInfo}>
                      <span className={styles.rank}>
                        #{index + 1}
                      </span>
                      <span className={styles.contestantName}>
                        {contestant.name}
                      </span>
                      <span className={styles.contestantCategory}>
                        ({contestant.category})
                      </span>
                    </div>
                    
                    <div className={styles.voteInfo}>
                      <span className={styles.voteCount}>
                        {contestant.liveVotes.toLocaleString()}
                      </span>
                      {contestant.liveIncrement > 0 && (
                        <span className={styles.liveIncrement}>
                          +{contestant.liveIncrement}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                <Link
                  href="/leaderboard"
                  className={styles.viewAllLink}
                >
                  <button className={styles.viewAllButton}>
                    View Full Leaderboard →
                  </button>
                </Link>

                {isConnected && liveLeaderboard.some(c => c.liveIncrement > 0) && (
                  <div className={styles.liveIndicator}>
                    <span className={styles.liveIndicatorText}>
                      🔴 Live updates active
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Leaderboard;