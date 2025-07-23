"use client";

import React, { createContext, useContext, useState } from "react";

interface VoteContextType {
  votes: Record<string, Record<string, number>>;
  selectedNominees: Record<string, string[]>;
  totalVotes: number;
  handleVoteChange: (categoryId: string, nomineeId: string, quantity: number) => void;
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

export const VoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [votes, setVotes] = useState<Record<string, Record<string, number>>>({});
  const [selectedNominees, setSelectedNominees] = useState<Record<string, string[]>>({});

  const totalVotes = Object.values(votes).reduce((sum, categoryVotes) => {
    return sum + Object.values(categoryVotes).reduce((catSum, vote) => catSum + vote, 0);
  }, 0);

  const handleVoteChange = (categoryId: string, nomineeId: string, quantity: number) => {
    setVotes((prev) => {
      const newVotes = { ...prev };
      newVotes[categoryId] = { ...newVotes[categoryId], [nomineeId]: quantity };
      return newVotes;
    });

    setSelectedNominees((prev) => {
      const newSelected = { ...prev };
      
      if (quantity > 0) {
        if (!newSelected[categoryId]) {
          newSelected[categoryId] = [nomineeId];
        } else if (!newSelected[categoryId].includes(nomineeId)) {
          newSelected[categoryId] = [...newSelected[categoryId], nomineeId];
        }
      } else {
        if (newSelected[categoryId]) {
          newSelected[categoryId] = newSelected[categoryId].filter(id => id !== nomineeId);
          if (newSelected[categoryId].length === 0) {
            delete newSelected[categoryId];
          }
        }
      }
      
      return newSelected;
    });
  };

  return (
    <VoteContext.Provider value={{ votes, selectedNominees, totalVotes, handleVoteChange }}>
      {children}
    </VoteContext.Provider>
  );
};

export const useVoteContext = () => {
  const context = useContext(VoteContext);
  if (!context) {
    throw new Error("useVoteContext must be used within a VoteProvider");
  }
  return context;
};