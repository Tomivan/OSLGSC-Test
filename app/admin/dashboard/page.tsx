"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { collection, collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckToSlot, faPerson, faTableColumns, faBolt, faWifi } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useSocket } from "../../context/VoteContext";

interface Contestant {
  id: string;
  name: string;
  category: string;
  votes: number;
  imageUrl?: string;
}

// Extended type for live data display
interface LiveContestant extends Contestant {
  liveVotes: number;
  liveIncrement: number;
}

interface CategoryGroup {
  category: string;
  contestants: LiveContestant[]; // Use LiveContestant here
  totalVotes: number;
}

interface DashboardStats {
  totalVotes: number;
  totalContestants: number;
  totalCategories: number;
}

// Extended stats for live display
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
  
  // Socket connection for real-time updates
  const { isConnected, on, off } = useSocket();
  const [liveActivity, setLiveActivity] = useState<Record<string, number>>({});
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Listen for live vote updates
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

  // FIXED: Both off calls now include their respective callbacks
  return () => {
    off('vote-update', handleVoteUpdate);
    off('batch-vote-update', handleBatchUpdate);
  };
}, [admin, on, off]);

  // Clear activity after 30 seconds
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
      
      // Handle Firebase errors
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
      // Handle standard Error objects
      else if (err instanceof Error) {
          setError(`Failed to load dashboard data: ${err.message}`);
      } 
      // Handle unknown error types
      else {
          setError("An unexpected error occurred while loading dashboard data.");
      }
    }  finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (admin) {
      fetchDashboardData();
    }
  }, [admin, fetchDashboardData]);

  // Combine base data with live activity
  const liveData = useMemo(() => {
    // Add live increments to contestants - now properly typed as LiveContestant[]
    const enhancedContestants: LiveContestant[] = baseContestants.map(contestant => ({
      ...contestant,
      liveVotes: contestant.votes + (liveActivity[contestant.id] || 0),
      liveIncrement: liveActivity[contestant.id] || 0
    }));

    // Calculate live totals
    const liveTotalVotes = enhancedContestants.reduce(
      (sum, c) => sum + c.liveVotes, 0
    );

    // Group by category with live data
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

    // Sort categories by total votes
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
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B8501] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchDashboardData}
                    className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
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
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with connection status */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#3B8501]">Admin Dashboard</h1>
          
          <div className="flex items-center gap-4">
            {/* Connection status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              isConnected ? 'bg-green-50' : 'bg-yellow-50'
            }`}>
              <FontAwesomeIcon 
                icon={faWifi} 
                className={`text-sm ${
                  isConnected ? 'text-green-600' : 'text-yellow-600'
                }`}
              />
              <span className={`text-sm font-medium ${
                isConnected ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {isConnected ? 'Live' : 'Connecting...'}
              </span>
            </div>

            {/* Live activity indicator */}
            {liveData.hasLiveActivity && (
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full animate-pulse">
                <FontAwesomeIcon icon={faBolt} className="text-sm text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  +{getLiveActivityTotal} new votes
                </span>
              </div>
            )}

            {/* Last update time */}
            <div className="text-xs text-gray-500">
              Updated {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        {/* Stats Cards with Live Indicators */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Votes Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg relative">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <dt className="text-sm font-medium text-[#3B8501] truncate flex items-center gap-2">
                    Total Votes
                    {getLiveActivityTotal > 0 && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full animate-pulse">
                        +{getLiveActivityTotal}
                      </span>
                    )}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {liveData.stats.totalVotes.toLocaleString()}
                  </dd>
                </div>
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faCheckToSlot} 
                    className="text-5xl text-[#3B8501]" 
                  />
                  {liveData.hasLiveActivity && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping"></span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Total Contestants Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <dt className="text-sm font-medium text-[#3B8501] truncate">
                    Total Contestants
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {liveData.stats.totalContestants}
                  </dd>
                </div>
                <FontAwesomeIcon 
                  icon={faPerson} 
                  className="text-5xl text-[#3B8501]" 
                />
              </div>
            </div>
          </div>

          {/* Total Categories Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <dt className="text-sm font-medium text-[#3B8501] truncate">
                    Total Categories
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {liveData.stats.totalCategories}
                  </dd>
                </div>
                <FontAwesomeIcon 
                  icon={faTableColumns} 
                  className="text-5xl text-[#3B8501]" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Summary */}
        {liveData.hasLiveActivity && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                <span className="text-sm text-orange-700 font-medium">
                  Live Voting Activity
                </span>
              </div>
              <span className="text-xs text-orange-600">
                {getLiveActivityTotal} new votes in the last 30 seconds
              </span>
            </div>
          </div>
        )}

        {/* Category-wise Leaderboards with Live Updates */}
        <div className="mt-8 space-y-8">
          {liveData.groups.map((categoryGroup, categoryIndex) => (
            <div key={categoryGroup.category} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-medium text-gray-900">
                        {categoryGroup.category}
                      </h2>
                      {categoryGroup.contestants.some(c => c.liveIncrement > 0) && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full animate-pulse">
                          🔴 voting now
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {categoryGroup.contestants.length} contestants • {categoryGroup.totalVotes.toLocaleString()} total votes
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-gray-500">
                      Category Rank: #{categoryIndex + 1}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#3B8501] uppercase tracking-wider">
                        Rank
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#3B8501] uppercase tracking-wider">
                        Contestant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#3B8501] uppercase tracking-wider">
                        Total Votes
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#3B8501] uppercase tracking-wider">
                        Percentage
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#3B8501] uppercase tracking-wider">
                        Live Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoryGroup.contestants.map((contestant, contestantIndex) => (
                      <tr 
                        key={contestant.id} 
                        className={`hover:bg-gray-50 transition-colors duration-200 ${
                          contestant.liveIncrement > 0 ? 'bg-orange-50/50' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{contestantIndex + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {contestant.name}
                                {contestant.liveIncrement > 0 && (
                                  <span className="ml-2 text-xs text-orange-500 animate-pulse">
                                    ↑
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">
                              {contestant.liveVotes.toLocaleString()}
                            </span>
                            {contestant.liveIncrement > 0 && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full animate-pulse">
                                +{contestant.liveIncrement}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {categoryGroup.totalVotes > 0
                            ? `${((contestant.liveVotes / categoryGroup.totalVotes) * 100).toFixed(1)}%`
                            : "0%"
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contestant.liveIncrement > 0 ? (
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></span>
                              <span className="text-xs text-orange-600">
                                +{contestant.liveIncrement} now
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {categoryGroup.contestants.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400">
                    <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No contestants in this category</h3>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {liveData.groups.length === 0 && (
          <div className="mt-8 text-center py-12">
            <div className="text-gray-400">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding some contestants with categories.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;