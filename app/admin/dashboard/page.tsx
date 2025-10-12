"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { FontAwesomeIcon } from  '@fortawesome/react-fontawesome';
import { faCheckToSlot, faPerson, faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from "../../context/AdminAuthContext";
import Image from 'next/image';

interface Contestant {
  id: string;
  name: string;
  category: string;
  votes: number;
  imageUrl?: string;
}

interface CategoryGroup {
  category: string;
  contestants: Contestant[];
  totalVotes: number;
}

interface DashboardStats {
  totalVotes: number;
  totalContestants: number;
  totalCategories: number;
}

const AdminDashboard = () => {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalVotes: 0,
    totalContestants: 0,
    totalCategories: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { admin } = useAdminAuth();

  useEffect(() => {
    if (admin) {
      fetchDashboardData();
    }
  }, [admin]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching dashboard data...");

      // Fetch contestants from Firestore
      const contestantsSnapshot = await getDocs(collection(db, "contestants"));
      console.log(`Found ${contestantsSnapshot.size} contestants`);
      
      const contestantsData: Contestant[] = [];
      let totalVotes = 0;
      const categories = new Set<string>();

      for (const contestantDoc of contestantsSnapshot.docs) {
        const data = contestantDoc.data();
        console.log(`Processing contestant: ${data.name}`);
        
        try {
          // Get votes count from votes subcollection
          const votesSnapshot = await getDocs(
            collection(db, "contestants", contestantDoc.id, "votes")
          );
          const voteCount = votesSnapshot.size;
          console.log(`Contestant ${data.name} has ${voteCount} votes`);

          const contestant: Contestant = {
            id: contestantDoc.id,
            name: data.name || "Unnamed Contestant",
            category: data.category || "Uncategorized",
            votes: data.votes,
            imageUrl: data.imageUrl || data.photoUrl
          };

          contestantsData.push(contestant);
          totalVotes += voteCount;
          categories.add(contestant.category);
        } catch (voteError) {
          console.error(`Error fetching votes for contestant ${contestantDoc.id}:`, voteError);
          // Continue with other contestants even if one fails
          const contestant: Contestant = {
            id: contestantDoc.id,
            name: data.name || "Unnamed Contestant",
            category: data.category || "Uncategorized",
            votes: 0,
            imageUrl: data.imageUrl || data.photoUrl
          };
          contestantsData.push(contestant);
          categories.add(contestant.category);
        }
      }

      // Group contestants by category and sort each group by votes (descending)
      const groupedByCategory: CategoryGroup[] = [];
      
      categories.forEach(category => {
        const categoryContestants = contestantsData
          .filter(contestant => contestant.category === category)
          .sort((a, b) => b.votes - a.votes); // Sort by votes descending
        
        const categoryTotalVotes = categoryContestants.reduce((sum, contestant) => sum + contestant.votes, 0);
        
        groupedByCategory.push({
          category,
          contestants: categoryContestants,
          totalVotes: categoryTotalVotes
        });
      });

      // Sort categories by total votes (descending) or alphabetically
      groupedByCategory.sort((a, b) => {
        // Sort by total votes descending first
        if (b.totalVotes !== a.totalVotes) {
          return b.totalVotes - a.totalVotes;
        }
        // If same votes, sort alphabetically
        return a.category.localeCompare(b.category);
      });

      setCategoryGroups(groupedByCategory);
      setStats({
        totalVotes,
        totalContestants: contestantsData.length,
        totalCategories: categories.size
      });

    } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      console.error("Error fetching dashboard data:", err);
      
      if (err.code === 'permission-denied') {
        setError("Permission denied. Please check your Firestore security rules.");
      } else if (err.code === 'unavailable') {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Failed to load dashboard data. Please check the console for details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
                  <p className="mt-2">
                    Please make sure your Firestore security rules allow read access to the contestants collection.
                  </p>
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
        <h1 className="text-2xl font-semibold text-[#3B8501]">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                <div>
                    <dt className="text-sm font-medium text-[#3B8501] truncate">
                    Total Votes
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.totalVotes}
                    </dd>
                </div>
                <FontAwesomeIcon 
                    icon={faCheckToSlot} 
                    className="text-5xl text-[#3B8501]" 
                />
                </div>
            </div>
            </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                <div>
                    <dt className="text-sm font-medium text-[#3B8501] truncate">
                    Total Contestants
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.totalContestants}
                    </dd>
                </div>
                <FontAwesomeIcon 
                    icon={faPerson} 
                    className="text-5xl text-[#3B8501]" 
                />
                </div>
            </div>
            </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                <div>
                    <dt className="text-sm font-medium text-[#3B8501] truncate">
                    Total Categories
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.totalCategories}
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

        {/* Category-wise Leaderboards */}
        <div className="mt-8 space-y-8">
          {categoryGroups.map((categoryGroup, categoryIndex) => (
            <div key={categoryGroup.category} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {categoryGroup.category}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {categoryGroup.contestants.length} contestants • {categoryGroup.totalVotes.toLocaleString()} total votes
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    Category Rank: #{categoryIndex + 1}
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoryGroup.contestants.map((contestant, contestantIndex) => (
                      <tr key={contestant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{contestantIndex + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {contestant.imageUrl && (
                              <div className="flex-shrink-0 h-10 w-10">
                                <Image
                                className="h-10 w-10 rounded-full object-cover"
                                src={contestant.imageUrl}
                                alt={contestant.name}
                                width={40}
                                height={40}
                                />
                              </div>
                            )}
                            <div className={contestant.imageUrl ? "ml-4" : ""}>
                              <div className="text-sm font-medium text-gray-900">
                                {contestant.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contestant.votes.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {categoryGroup.totalVotes > 0
                            ? `${((contestant.votes / categoryGroup.totalVotes) * 100).toFixed(1)}%`
                            : "0%"
                          }
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

        {categoryGroups.length === 0 && (
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