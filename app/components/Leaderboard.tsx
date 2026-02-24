"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useVote, useSocket } from "../context/VoteContext";
import { db } from "../lib/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";

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

  // Fetch top 5 contestants by votes
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

  // Combine base votes with live increments and re-sort
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
      <main className="flex justify-center py-8">
        <div className="w-[90%] md:w-[740px] mx-auto max-d">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <div className="bg-[#3B8501] text-white text-center py-3">
              <h2 className="font-bold text-lg uppercase tracking-wide">
                REAL-TIME LEADERBOARD
              </h2>
            </div>
            <div className="bg-[#E4E4E4] p-4">
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B8501] mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading leaderboard...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex justify-center py-8">
        <div className="w-[90%] md:w-[740px] mx-auto max-d">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <div className="bg-[#3B8501] text-white text-center py-3">
              <h2 className="font-bold text-lg uppercase tracking-wide">
                REAL-TIME LEADERBOARD
              </h2>
            </div>
            <div className="bg-[#E4E4E4] p-4 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex justify-center py-8">
      <div className="w-[90%] md:w-[740px] mx-auto max-d">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
          <div className="bg-[#3B8501] text-white text-center py-3">
            <h2 className="font-bold text-lg uppercase tracking-wide">
              REAL-TIME LEADERBOARD
            </h2>
          </div>
          <div className="bg-[#E4E4E4] p-4">
            {liveLeaderboard.length === 0 ? (
              <div className="text-center py-4 text-gray-600">
                No contestants found.
              </div>
            ) : (
              <>
                {liveLeaderboard.map((contestant, index) => (
                  <div
                    key={contestant.id}
                    className="flex items-center justify-between md:px-[28px] px-4 py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-700 font-medium min-w-[2rem]">
                        #{index + 1}
                      </span>
                      <span className="text-gray-700">
                        {contestant.name}
                      </span>
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        ({contestant.category})
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-semibold">
                        {contestant.liveVotes.toLocaleString()}
                      </span>
                      {contestant.liveIncrement > 0 && (
                        <span className="text-orange-500 text-sm font-bold animate-pulse bg-orange-100 px-2 py-0.5 rounded-full">
                          +{contestant.liveIncrement}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                <Link
                  href="/leaderboard"
                  className="block text-center bg-[#FAFAFA] rounded-lg p-2 mt-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  <button className="text-[#3B8501] font-medium hover:text-[#2d6801] w-full transition-colors duration-200">
                    View Full Leaderboard →
                  </button>
                </Link>

                {isConnected && liveLeaderboard.some(c => c.liveIncrement > 0) && (
                  <div className="text-center mt-2">
                    <span className="text-xs text-orange-500 animate-pulse">
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