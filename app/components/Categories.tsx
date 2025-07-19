"use client";

import React, { useState } from "react";
import { NomineeCard } from "./NomineeCard";
import { useVoteContext } from "../context/VoteContext";

const mockCategories = [
  { id: "001", name: "People's Choice Award", isOpen: true },
  { id: "002", name: "Hardwork Staff", isOpen: false },
  { id: "003", name: "Punctual Staff", isOpen: false },
  { id: "004", name: "Well Dressed", isOpen: false },
];

const mockNominees = [
  { id: "1", name: "Amara Johnson", image: "/image.png", voteCount: 1000 },
  { id: "2", name: "Kunle Ibilelu", image: "/image.png", voteCount: 900 },
  { id: "3", name: "Linda Kerry", image: "/image.png", voteCount: 1000 },
  { id: "4", name: "Kelvin Judus", image: "/image.png", voteCount: 1000 },
];

const Categories = () => {
  const [categoryStates, setCategoryStates] = useState(mockCategories);
  const { votes, selectedNominees, handleVoteChange } = useVoteContext();

  const toggleCategory = (categoryId: string) => {
    setCategoryStates((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, isOpen: !cat.isOpen } : cat
      )
    );
  };

  return (
    <main className="bg-white flex justify-center py-8 min-h-screen">
      <section className="w-full max-w-[900px] px-4">
        <div className="w-full">
          <h1 className="text-[#3B8501] text-center uppercase font-bold text-2xl md:text-[32px] tracking-0 leading-[43px] mb-8">
            CATEGORIES
          </h1>

          <div className="space-y-4">
            {categoryStates.map((category) => (
              <div
                key={category.id}
                className="border-[0.93px] border-[#343434] md:w-[1012px] rounded-[8px]"
              >
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-4 py-3 text-left text-black font-medium bg-white hover:bg-gray-50 rounded-[8px] transition-colors duration-200 flex items-center justify-between"
                >
                  <span>
                    {category.id}: {category.name}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      {mockNominees.map((nominee) => {
                        const isSelected = selectedNominees[category.id] === nominee.id;
                        const voteQuantity = votes[category.id]?.[nominee.id] || 0;
                        
                        return (
                          <NomineeCard
                            key={nominee.id}
                            nominee={nominee}
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
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Categories;