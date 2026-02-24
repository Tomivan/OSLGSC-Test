"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useVote, useSocket } from "../context/VoteContext";
import { db } from "../lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

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

  // Fetch all contestants ordered by votes
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

  // Combine base votes with live increments and re-sort
  const liveLeaderboard = useMemo(() => {
    const updated = baseContestants.map(contestant => ({
      ...contestant,
      liveVotes: contestant.votes + (liveVotes[contestant.id] || 0),
      liveIncrement: liveVotes[contestant.id] || 0
    }));

    const sorted = updated.sort((a, b) => b.liveVotes - a.liveVotes);

    // Reassign positions based on live sorting
    return sorted.map((contestant, index) => ({
      ...contestant,
      position: index + 1
    }));
  }, [baseContestants, liveVotes]);

  if (loading) {
    return (
      <main className="flex justify-center py-8 min-h-screen bg-gray-50">
        <div className="w-[90%] md:w-[800px] mx-auto">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <div className="bg-[#3B8501] text-white text-center py-4">
              <h1 className="font-bold text-xl uppercase tracking-wide">
                FULL LEADERBOARD
              </h1>
            </div>
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B8501] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading full leaderboard...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex justify-center py-8 min-h-screen bg-gray-50">
        <div className="w-[90%] md:w-[800px] mx-auto">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <div className="bg-[#3B8501] text-white text-center py-4">
              <h1 className="font-bold text-xl uppercase tracking-wide">
                FULL LEADERBOARD
              </h1>
            </div>
            <div className="p-8 text-center">
              <p className="text-red-600 text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-[#3B8501] text-white rounded hover:bg-[#2d6801] transition-colors"
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
    <main className="flex justify-center py-8 min-h-screen bg-gray-50">
      <div className="w-[90%] md:w-[800px] mx-auto">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
          <div className="bg-[#3B8501] text-white text-center py-4">
            <h1 className="font-bold text-xl uppercase tracking-wide">
              FULL LEADERBOARD
            </h1>
            <p className="text-sm opacity-90 mt-1 flex items-center justify-center gap-2">
              <span>All contestants ranked by votes</span>
              {isConnected && liveLeaderboard.some(c => c.liveIncrement > 0) && (
                <span className="text-xs bg-white text-[#3B8501] px-2 py-0.5 rounded-full animate-pulse">
                  🔴 LIVE
                </span>
              )}
            </p>
          </div>
          
          <div className="bg-white">
            {liveLeaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No contestants found.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {liveLeaderboard.map((contestant) => (
                  <div
                    key={contestant.id}
                    className="flex items-center justify-between md:px-6 md:py-4 px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm`}>
                        {contestant.position}
                      </div>
                      <div>
                        <span className="text-gray-800 font-medium block">
                          {contestant.name}
                          {contestant.liveIncrement > 0 && (
                            <span className="ml-2 text-xs text-orange-500 animate-pulse">
                              ↑
                            </span>
                          )}
                        </span>
                        <span className="text-gray-500 md:text-sm text-xs">
                          {contestant.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-gray-800 font-bold text-lg">
                          {contestant.liveVotes}
                        </span>
                        {contestant.liveIncrement > 0 && (
                          <span className="text-orange-500 text-sm font-bold animate-pulse bg-orange-100 px-2 py-0.5 rounded-full">
                            +{contestant.liveIncrement}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 text-xs">votes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Live update summary */}
            {liveLeaderboard.some(c => c.liveIncrement > 0) && (
              <div className="bg-orange-50 border-t border-orange-200 p-3 text-center">
                <p className="text-orange-700 text-xs flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></span>
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