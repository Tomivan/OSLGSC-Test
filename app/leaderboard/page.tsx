"use client";

import React, { useState, useEffect } from "react";
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
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all contestants ordered by votes
  useEffect(() => {
    const fetchAllContestants = async () => {
      try {
        setLoading(true);
        
        // Query to get all contestants ordered by votes (descending)
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

        setContestants(contestantsData);
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

  // Function to get position badge color
  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-400 text-yellow-900";
      case 2:
        return "bg-gray-300 text-gray-700";
      case 3:
        return "bg-orange-300 text-orange-900";
      default:
        return "bg-white text-gray-600";
    }
  };

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
            <p className="text-sm opacity-90 mt-1">
              All contestants ranked by votes
            </p>
          </div>
          
          <div className="bg-[#E4E4E4]">
            {contestants.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No contestants found.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {contestants.map((contestant) => (
                  <div
                    key={contestant.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getPositionColor(contestant.position)}`}>
                        {contestant.position}
                      </div>
                      <div>
                        <span className="text-gray-800 font-medium block">
                          {contestant.name}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {contestant.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-800 font-bold text-lg block">
                        {contestant.votes}
                      </span>
                      <span className="text-gray-500 text-sm">votes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default FullLeaderboard;