"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useVote, useSocket } from "../../context/VoteContext";
import { db } from "../../lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import styles from "./FullLeaderboard.module.css";

interface Contestant {
  id: string;
  name: string;
  votes: number;
  category: string;
  position: number;
}

const FullLeaderboard = () => {
  const [baseContestants, setBaseContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { liveVotes } = useVote();
  const { isConnected } = useSocket();

  useEffect(() => {
    const fetchAllContestants = async () => {
      try {
        setLoading(true);
        
        const contestantsQuery = query(
          collection(db, "contestants"),
          orderBy("votes", "desc")
        );

        const querySnapshot = await getDocs(contestantsQuery);
        const contestantsData: Contestant[] = [];
        
        let position = 1;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          contestantsData.push({
            id: doc.id,
            name: data.name,
            votes: data.votes || 0,
            category: data.category || "Unknown Category",
            position: position++
          });
        });

        setBaseContestants(contestantsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching full leaderboard:", err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAllContestants();
  }, []);

  const liveLeaderboard = useMemo(() => {
    const updated = baseContestants.map(contestant => ({
      ...contestant,
      liveVotes: contestant.votes + (liveVotes[contestant.id] || 0),
      liveIncrement: liveVotes[contestant.id] || 0
    }));

    const sorted = updated.sort((a, b) => b.liveVotes - a.liveVotes);

    return sorted.map((contestant, index) => ({
      ...contestant,
      position: index + 1
    }));
  }, [baseContestants, liveVotes]);

  if (loading) {
    return (
      <main className={styles.loadingMain}>
        <div className={styles.loadingContainer}>
          <div className={styles.leaderboardWrapper}>
            <div className={styles.leaderboardHeader}>
              <h1 className={styles.leaderboardTitle}>
                FULL LEADERBOARD
              </h1>
            </div>
            <div className={styles.loadingContent}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Loading full leaderboard...</p>
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
              <h1 className={styles.leaderboardTitle}>
                FULL LEADERBOARD
              </h1>
            </div>
            <div className={styles.errorContent}>
              <p className={styles.errorText}>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className={styles.retryButton}
              >
                Retry
              </button>
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
            <h1 className={styles.leaderboardTitle}>
              FULL LEADERBOARD
            </h1>
            <p className={styles.leaderboardSubtitle}>
              <span>All contestants ranked by votes</span>
              {isConnected && liveLeaderboard.some(c => c.liveIncrement > 0) && (
                <span className={styles.liveBadge}>
                  🔴 LIVE
                </span>
              )}
            </p>
          </div>
          
          <div className={styles.leaderboardBody}>
            {liveLeaderboard.length === 0 ? (
              <div className={styles.emptyState}>
                No contestants found.
              </div>
            ) : (
              <div className={styles.contestantList}>
                {liveLeaderboard.map((contestant) => (
                  <div
                    key={contestant.id}
                    className={styles.contestantRow}
                  >
                    <div className={styles.contestantInfo}>
                      <div className={styles.positionBadge}>
                        {contestant.position}
                      </div>
                      <div>
                        <span className={styles.contestantName}>
                          {contestant.name}
                          {contestant.liveIncrement > 0 && (
                            <span className={styles.liveArrow}>
                              ↑
                            </span>
                          )}
                        </span>
                        <span className={styles.contestantCategory}>
                          {contestant.category}
                        </span>
                      </div>
                    </div>
                    <div className={styles.voteInfo}>
                      <div className={styles.voteDisplay}>
                        <span className={styles.voteCount}>
                          {contestant.liveVotes}
                        </span>
                        {contestant.liveIncrement > 0 && (
                          <span className={styles.voteIncrement}>
                            +{contestant.liveIncrement}
                          </span>
                        )}
                      </div>
                      <span className={styles.voteLabel}>votes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {liveLeaderboard.some(c => c.liveIncrement > 0) && (
              <div className={styles.liveFooter}>
                <p className={styles.liveFooterText}>
                  <span className={styles.liveFooterDot}></span>
                  Leaderboard updating live • {
                    liveLeaderboard.reduce((sum, c) => sum + c.liveIncrement, 0)
                  } new votes in last minute
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default FullLeaderboard;