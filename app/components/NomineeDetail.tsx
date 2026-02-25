"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useVote, useSocket } from "../context/VoteContext";
import FixedVoteWidget from "./FixedVoteWidget";
import minus from "../assets/minus.png";
import plus from "../assets/plus.png";

interface NomineeDetailProps {
  nominee: {
    id: string;
    name: string;
    image: string;
    voteCount: number;
    category: string;
    categoryId: string;
    bio?: string;
  };
}

export const NomineeDetailPage: React.FC<NomineeDetailProps> = ({ nominee }) => {
  const router = useRouter();
  const { 
    handleVoteChange, 
    getVoteQuantity,
    liveVotes,
    isSyncing 
  } = useVote();
  
  const { isConnected } = useSocket();
  
  const [voteInput, setVoteInput] = useState<string>("");
  const [showLiveIndicator, setShowLiveIndicator] = useState(false);
  
  const currentVotes = getVoteQuantity(nominee.categoryId, nominee.id);
  const liveIncrement = liveVotes[nominee.id] || 0;
  const totalLiveVotes = (nominee.voteCount || 0) + liveIncrement;

  // Update input when current votes change
  useEffect(() => {
    setVoteInput(currentVotes.toString());
  }, [currentVotes]);

  // Show live indicator animation when new live votes come in
  useEffect(() => {
    if (liveIncrement > 0) {
      setShowLiveIndicator(true);
      const timer = setTimeout(() => setShowLiveIndicator(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [liveIncrement]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setVoteInput(value);
    }
  };

  const handleApplyVotes = () => {
    const quantity = parseInt(voteInput) || 0;
    handleVoteChange(nominee.categoryId, nominee.id, quantity);
  };

  const handleIncrement = () => {
    const newValue = currentVotes + 1;
    setVoteInput(newValue.toString());
    handleVoteChange(nominee.categoryId, nominee.id, newValue);
  };

  const handleDecrement = () => {
    if (currentVotes > 0) {
      const newValue = currentVotes - 1;
      setVoteInput(newValue.toString());
      handleVoteChange(nominee.categoryId, nominee.id, newValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApplyVotes();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-6 h-6 text-[#3B8501]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium text-[#3B8501]">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-green-700 font-medium">Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="text-xs text-yellow-700 font-medium">Reconnecting...</span>
              </div>
            )}
            
            {isSyncing && (
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                <span className="text-xs text-blue-700 font-medium">Syncing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="relative w-full h-[350px] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={"/image.png"}
                alt={nominee.name}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/image.png";
                }}
              />
              
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-black bg-opacity-70 flex items-center gap-2">
                <span>{totalLiveVotes.toLocaleString()} votes</span>
                {liveIncrement > 0 && (
                  <span className="text-orange-300 animate-pulse">+{liveIncrement}</span>
                )}
              </div>
              
              {liveIncrement > 0 && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-orange-500 bg-opacity-90 flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                  LIVE VOTING
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{nominee.name}</h2>
                <p className="text-gray-600 mb-4 text-sm">
                  Category: <span className="font-semibold text-gray-800">{nominee.category}</span>
                </p>
                
                {nominee.bio && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
                    <p className="text-sm text-gray-600">{nominee.bio}</p>
                  </div>
                )}
              </div>

              <div>
                {showLiveIndicator && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg animate-pulse">
                    <p className="text-orange-700 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                      {liveIncrement} new vote{liveIncrement !== 1 ? 's' : ''} from other users!
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="voteInput" className="block text-xs font-medium text-gray-700 mb-1.5">
                      Your votes for {nominee.name}
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        id="voteInput"
                        type="text"
                        inputMode="numeric"
                        value={voteInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="0"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-base font-semibold text-center focus:outline-none focus:ring-2 focus:ring-[#3B8501] focus:border-transparent"
                      />
                      <button
                        onClick={handleApplyVotes}
                        className="px-5 py-2 bg-[#3B8501] hover:bg-[#2d6601] text-white text-sm font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSyncing}
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-[#E1E1E1] py-3 px-4 rounded-lg">
                    <button
                      onClick={handleDecrement}
                      disabled={currentVotes === 0 || isSyncing}
                      className="w-10 h-10 bg-[#CACACA] hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors duration-200"
                      aria-label="Decrease votes"
                    >
                      <Image src={minus} alt="Decrease votes" width={14} height={14} />
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {currentVotes}
                      </span>
                      {liveIncrement > 0 && (
                        <span className="text-orange-500 font-bold text-sm bg-orange-100 px-2 py-1 rounded-full animate-bounce">
                          +{liveIncrement}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={handleIncrement}
                      disabled={isSyncing}
                      className="w-10 h-10 bg-[#CACACA] hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors duration-200"
                      aria-label="Increase votes"
                    >
                      <Image src={plus} alt="Increase votes" width={14} height={14} />
                    </button>
                  </div>

                  {currentVotes > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm">
                         You&apos;re contributing {currentVotes} vote{currentVotes !== 1 ? 's' : ''} to {nominee.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FixedVoteWidget />
    </div>
  );
};