"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useVoteContext } from "../context/VoteContext";
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
  const { handleVoteChange, getVoteQuantity} = useVoteContext();
  const [voteInput, setVoteInput] = useState<string>("");
  const currentVotes = getVoteQuantity(nominee.categoryId, nominee.id);

  useEffect(() => {
    setVoteInput(currentVotes.toString());
  }, [currentVotes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
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
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="relative w-full h-[350px] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={ "/image.png"}
                alt={nominee.name}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/image.png";
                }}
              />
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-black bg-opacity-70">
                {nominee.voteCount} votes
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{nominee.name}</h2>
                <p className="text-gray-600 mb-4 text-sm">
                  Category: <span className="font-semibold text-gray-800">{nominee.category}</span>
                </p>
              </div>

              <div>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="voteInput" className="block text-xs font-medium text-gray-700 mb-1.5">
                      Enter number of votes
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
                        className="px-5 py-2 bg-[#3B8501] hover:bg-[#2d6601] text-white text-sm font-semibold rounded-lg transition-colors duration-200"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 bg-[#E1E1E1] py-3 rounded-lg">
                    <button
                      onClick={handleDecrement}
                      disabled={currentVotes === 0}
                      className="w-10 h-10 bg-[#CACACA] hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors duration-200"
                      aria-label="Decrease votes"
                    >
                      <Image src={minus} alt="Decrease votes" width={14} height={14} />
                    </button>
                    
                    <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                      {currentVotes}
                    </span>
                    
                    <button
                      onClick={handleIncrement}
                      className="w-10 h-10 bg-[#CACACA] hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors duration-200"
                      aria-label="Increase votes"
                    >
                      <Image src={plus} alt="Increase votes" width={14} height={14} />
                    </button>
                  </div>
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