"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { collection, collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckToSlot, faPerson, faTableColumns, faBolt, faWifi } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { useSocket } from "../../../context/VoteContext";
import styles from "./dashboard.module.css";

interface Contestant {
  id: string;
  name: string;
  category: string;
  votes: number;
  imageUrl?: string;
}

interface LiveContestant extends Contestant {
  liveVotes: number;
  liveIncrement: number;
}

interface CategoryGroup {
  category: string;
  contestants: LiveContestant[];
  totalVotes: number;
}

interface DashboardStats {
  totalVotes: number;
  totalContestants: number;
  totalCategories: number;
}

interface LiveDashboardStats extends DashboardStats {
  liveVotes: number;
}

const AdminDashboard = () => {
  const [baseContestants, setBaseContestants] = useState<Contestant[]>([]);
  const [baseStats, setBaseStats] = useState<DashboardStats>({
    totalVotes: 0,
    totalContestants: 0,
    totalCategories: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { admin } = useAdminAuth();
  
  const { isConnected, on, off } = useSocket();
  const [liveActivity, setLiveActivity] = useState<Record<string, number>>({});
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (!admin) return;

    const handleVoteUpdate = (update: { nomineeId: string; increment: number }) => {
      setLiveActivity(prev => ({
        ...prev,
        [update.nomineeId]: (prev[update.nomineeId] || 0) + update.increment
      }));
      setLastUpdate(new Date());
    };

    const handleBatchUpdate = (updates: Array<{ nomineeId: string; increment: number }>) => {
      setLiveActivity(prev => {
        const newActivity = { ...prev };
        updates.forEach(update => {
          newActivity[update.nomineeId] = (newActivity[update.nomineeId] || 0) + update.increment;
        });
        return newActivity;
      });
      setLastUpdate(new Date());
    };

    on('vote-update', handleVoteUpdate);
    on('batch-vote-update', handleBatchUpdate);

    return () => {
      off('vote-update', handleVoteUpdate);
      off('batch-vote-update', handleBatchUpdate);
    };
  }, [admin, on, off]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivity({});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [contestantsSnapshot, votesSnapshot] = await Promise.all([
        getDocs(collection(db, "contestants")),
        getDocs(collectionGroup(db, "votes"))
      ]);

      const voteCounts = new Map<string, number>();
      votesSnapshot.forEach((voteDoc) => {
        const pathParts = voteDoc.ref.path.split('/');
        if (pathParts.length >= 3) {
          const contestantId = pathParts[1];
          voteCounts.set(contestantId, (voteCounts.get(contestantId) || 0) + 1);
        }
      });

      const contestantsData: Contestant[] = [];
      let totalVotes = 0;
      const categories = new Set<string>();

      contestantsSnapshot.forEach((contestantDoc) => {
        const data = contestantDoc.data();
        const voteCount = voteCounts.get(contestantDoc.id) || data.votes || 0;

        const contestant: Contestant = {
          id: contestantDoc.id,
          name: data.name || "Unnamed Contestant",
          category: data.category || "Uncategorized",
          votes: voteCount,
          imageUrl: data.imageUrl || data.photoUrl
        };

        contestantsData.push(contestant);
        totalVotes += voteCount;
        categories.add(contestant.category);
      });

      setBaseContestants(contestantsData);
      setBaseStats({
        totalVotes,
        totalContestants: contestantsData.length,
        totalCategories: categories.size
      });

    } catch (err: unknown) {
      console.error("Error fetching dashboard data:", err);
      
      if (err && typeof err === 'object' && 'code' in err) {
          const error = err as { code: string; message?: string };
          
          switch (error.code) {
              case 'permission-denied':
                  setError("Permission denied. Please check your Firestore security rules.");
                  break;
              case 'unavailable':
                  setError("Network error. Please check your internet connection.");
                  break;
              case 'not-found':
                  setError("Dashboard data not found.");
                  break;
              default:
                  setError(`Failed to load dashboard data: ${error.message || 'Unknown error'}`);
          }
      } 
      else if (err instanceof Error) {
          setError(`Failed to load dashboard data: ${err.message}`);
      } 
      else {
          setError("An unexpected error occurred while loading dashboard data.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (admin) {
      fetchDashboardData();
    }
  }, [admin, fetchDashboardData]);

  const liveData = useMemo(() => {
    const enhancedContestants: LiveContestant[] = baseContestants.map(contestant => ({
      ...contestant,
      liveVotes: contestant.votes + (liveActivity[contestant.id] || 0),
      liveIncrement: liveActivity[contestant.id] || 0
    }));

    const liveTotalVotes = enhancedContestants.reduce(
      (sum, c) => sum + c.liveVotes, 0
    );

    const categories = new Set(enhancedContestants.map(c => c.category));
    const grouped: CategoryGroup[] = [];

    categories.forEach(category => {
      const categoryContestants = enhancedContestants
        .filter(c => c.category === category)
        .sort((a, b) => b.liveVotes - a.liveVotes);
      
      const categoryTotalVotes = categoryContestants.reduce(
        (sum, c) => sum + c.liveVotes, 0
      );
      
      grouped.push({
        category,
        contestants: categoryContestants,
        totalVotes: categoryTotalVotes
      });
    });

    grouped.sort((a, b) => b.totalVotes - a.totalVotes);

    return {
      contestants: enhancedContestants,
      groups: grouped,
      stats: {
        ...baseStats,
        totalVotes: liveTotalVotes
      } as LiveDashboardStats,
      hasLiveActivity: Object.keys(liveActivity).length > 0
    };
  }, [baseContestants, baseStats, liveActivity]);

  const getLiveActivityTotal = useMemo(() => {
    return Object.values(liveActivity).reduce((sum, val) => sum + val, 0);
  }, [liveActivity]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorWrapper}>
          <div className={styles.errorBox}>
            <div className={styles.errorContent}>
              <div className={styles.errorIcon}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className={styles.errorMessage}>
                <h3 className={styles.errorTitle}>Error Loading Dashboard</h3>
                <div className={styles.errorDetail}>
                  <p>{error}</p>
                </div>
                <div className={styles.errorAction}>
                  <button
                    onClick={fetchDashboardData}
                    className={styles.retryButton}
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardWrapper}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
          
          <div className={styles.headerControls}>
            <div className={`${styles.connectionStatus} ${isConnected ? styles.connectionLive : styles.connectionConnecting}`}>
              <FontAwesomeIcon 
                icon={faWifi} 
                className={`${styles.connectionIcon} ${isConnected ? styles.connectionIconLive : styles.connectionIconConnecting}`}
              />
              <span className={`${styles.connectionText} ${isConnected ? styles.connectionTextLive : styles.connectionTextConnecting}`}>
                {isConnected ? 'Live' : 'Connecting...'}
              </span>
            </div>

            {liveData.hasLiveActivity && (
              <div className={styles.liveActivityIndicator}>
                <FontAwesomeIcon icon={faBolt} className={styles.liveActivityIcon} />
                <span className={styles.liveActivityText}>
                  +{getLiveActivityTotal} new votes
                </span>
              </div>
            )}

            <div className={styles.updateTime}>
              Updated {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statCardVotes}`}>
            <div className={styles.statCardContent}>
              <div className={styles.statCardInfo}>
                <dt className={`${styles.statLabel} ${styles.statLabelVotes}`}>
                  Total Votes
                  {getLiveActivityTotal > 0 && (
                    <span className={styles.statLiveBadge}>
                      +{getLiveActivityTotal}
                    </span>
                  )}
                </dt>
                <dd className={styles.statValue}>
                  {liveData.stats.totalVotes.toLocaleString()}
                </dd>
              </div>
              <div className={styles.statIconWrapper}>
                <FontAwesomeIcon 
                  icon={faCheckToSlot} 
                  className={styles.statIcon} 
                />
                {liveData.hasLiveActivity && (
                  <span className={styles.statPingDot}></span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statCardInfo}>
                <dt className={styles.statLabel}>
                  Total Contestants
                </dt>
                <dd className={styles.statValue}>
                  {liveData.stats.totalContestants}
                </dd>
              </div>
              <FontAwesomeIcon 
                icon={faPerson} 
                className={styles.statIcon} 
              />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statCardInfo}>
                <dt className={styles.statLabel}>
                  Total Categories
                </dt>
                <dd className={styles.statValue}>
                  {liveData.stats.totalCategories}
                </dd>
              </div>
              <FontAwesomeIcon 
                icon={faTableColumns} 
                className={styles.statIcon} 
              />
            </div>
          </div>
        </div>

        {liveData.hasLiveActivity && (
          <div className={styles.liveActivityBanner}>
            <div className={styles.liveActivityBannerContent}>
              <div className={styles.liveActivityBannerLeft}>
                <span className={styles.liveActivityBannerDot}></span>
                <span className={styles.liveActivityBannerText}>
                  Live Voting Activity
                </span>
              </div>
              <span className={styles.liveActivityBannerCount}>
                {getLiveActivityTotal} new votes in the last 30 seconds
              </span>
            </div>
          </div>
        )}

        <div className={styles.categoriesContainer}>
          {liveData.groups.map((categoryGroup, categoryIndex) => (
            <div key={categoryGroup.category} className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryHeaderLeft}>
                  <div className={styles.categoryHeaderTitle}>
                    <h2 className={styles.categoryName}>
                      {categoryGroup.category}
                    </h2>
                    {categoryGroup.contestants.some(c => c.liveIncrement > 0) && (
                      <span className={styles.categoryLiveBadge}>
                        🔴 voting now
                      </span>
                    )}
                  </div>
                  <p className={styles.categoryMeta}>
                    {categoryGroup.contestants.length} contestants • {categoryGroup.totalVotes.toLocaleString()} total votes
                  </p>
                </div>
                <div className={styles.categoryRank}>
                  Category Rank: #{categoryIndex + 1}
                </div>
              </div>
              
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      <th className={styles.tableHeader}>Rank</th>
                      <th className={styles.tableHeader}>Contestant</th>
                      <th className={styles.tableHeader}>Total Votes</th>
                      <th className={styles.tableHeader}>Percentage</th>
                      <th className={styles.tableHeader}>Live Activity</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {categoryGroup.contestants.map((contestant, contestantIndex) => (
                      <tr 
                        key={contestant.id} 
                        className={`${styles.tableRow} ${contestant.liveIncrement > 0 ? styles.tableRowLive : ''}`}
                      >
                        <td className={`${styles.tableCell} ${styles.tableCellRank}`}>
                          #{contestantIndex + 1}
                        </td>
                        <td className={styles.tableCell}>
                          <div className={styles.contestantInfo}>
                            <div className={styles.contestantNameWrapper}>
                              <div className={styles.contestantName}>
                                {contestant.name}
                                {contestant.liveIncrement > 0 && (
                                  <span className={styles.contestantLiveArrow}>
                                    ↑
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={styles.tableCell}>
                          <div className={styles.voteDisplay}>
                            <span className={styles.voteCount}>
                              {contestant.liveVotes.toLocaleString()}
                            </span>
                            {contestant.liveIncrement > 0 && (
                              <span className={styles.voteIncrementBadge}>
                                +{contestant.liveIncrement}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`${styles.tableCell} ${styles.tableCellPercentage}`}>
                          {categoryGroup.totalVotes > 0
                            ? `${((contestant.liveVotes / categoryGroup.totalVotes) * 100).toFixed(1)}%`
                            : "0%"
                          }
                        </td>
                        <td className={styles.tableCell}>
                          {contestant.liveIncrement > 0 ? (
                            <div className={styles.liveActivityCell}>
                              <span className={styles.liveActivityDot}></span>
                              <span className={styles.liveActivityCellText}>
                                +{contestant.liveIncrement} now
                              </span>
                            </div>
                          ) : (
                            <span className={styles.noActivity}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {categoryGroup.contestants.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateContent}>
                    <svg className={styles.emptyStateIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className={styles.emptyStateTitle}>No contestants in this category</h3>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {liveData.groups.length === 0 && (
          <div className={styles.emptyCategories}>
            <div className={styles.emptyCategoriesContent}>
              <svg className={styles.emptyCategoriesIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className={styles.emptyCategoriesTitle}>No categories found</h3>
              <p className={styles.emptyCategoriesText}>Get started by adding some contestants with categories.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;