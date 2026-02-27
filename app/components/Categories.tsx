"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { NomineeCard } from "./NomineeCard";
import { useVote, useSocket } from "../context/VoteContext";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Types based on your database structure
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

  // Fetch contestants from Firestore
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

  // AUTO-SYNC: Whenever votes change, sync to Firebase
  useEffect(() => {
    const autoSync = async () => {
      // Only sync if there are votes and we're not already syncing
      if (Object.keys(votes).length > 0 && !isSyncing && isConnected) {
        const result = await syncWithFirebase();
        if (result.success) {
          console.log(`Auto-sync successful: ${result.syncedVotes} votes synced`);
        }
      }
    };

    // Debounce the sync to avoid too many requests
    const timeoutId = setTimeout(autoSync, 3000); 
    
    return () => clearTimeout(timeoutId);
  }, [votes, isSyncing, isConnected, syncWithFirebase]);

  // Also sync when component unmounts (user leaves page)
  useEffect(() => {
    return () => {
      if (Object.keys(votes).length > 0 && !isSyncing) {
        // Use navigator.sendBeacon for unmount sync (more reliable)
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
      <main className="bg-white flex justify-center py-[60px] min-h-screen">
        <section className="w-full max-w-[900px] px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B8501] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading categories...</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-white flex justify-center py-[60px] min-h-screen">
        <section className="w-full max-w-[900px] px-4">
          <div className="text-center text-red-600 py-8">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#3B8501] text-white rounded hover:bg-[#2f6a01]"
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
      <main className="bg-white flex justify-center py-[60px] min-h-screen">
        <section className="w-full max-w-[900px] px-4">
          <div className="text-center py-8">
            <p className="text-gray-600">No categories available yet.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className="bg-white flex justify-center py-[60px] min-h-screen"
      id="categories"
    >
      <section className="w-full max-w-[1200px] px-4">
        <div className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-[#3B8501] text-center uppercase font-bold text-2xl md:text-[32px] tracking-0 leading-[43px]">
              CATEGORIES
            </h1>
            
            {/* Live connection indicator */}
            {isConnected ? (
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-green-700">Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="text-sm text-yellow-700">Reconnecting...</span>
              </div>
            )}
          </div>

          {/* Auto-sync status indicator - subtle and temporary */}
          {isSyncing && (
            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg animate-pulse">
              <p className="text-blue-600 text-sm text-center">
                ⚡ Syncing votes...
              </p>
            </div>
          )}

          <div className="space-y-4">
            {categories.map((category) => {
              const categoryContestants = sortedContestantsByCategory.get(category.name) || [];
              
              return (
                <div
                  key={category.id}
                  className="border-[0.93px] border-[#343434] rounded-[8px]"
                >
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-4 py-3 text-left text-black font-medium bg-white hover:bg-gray-50 rounded-[8px] transition-colors duration-200 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span>
                        {category.name}
                        {categoryContestants.length > 0 && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({categoryContestants.length} nominee{categoryContestants.length !== 1 ? 's' : ''})
                          </span>
                        )}
                      </span>
                      
                      {/* Show if category has live activity */}
                      {categoryContestants.some((c: { id: string | number; }) => liveVotes[c.id] > 0) && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full animate-pulse">
                          🔴 voting now
                        </span>
                      )}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        category.isOpen ? "rotate-180" : ""
                      }`}
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
                    <div className="px-4 pb-4">
                      {categoryContestants.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No nominees available for this category.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 cate">
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