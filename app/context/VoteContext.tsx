"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

// Define more specific types
type CategoryId = string;
type NomineeId = string;
interface VotesState {
  [categoryId: CategoryId]: {
    [nomineeId: NomineeId]: number;
  };
}
interface SelectedNomineesState {
  [categoryId: CategoryId]: NomineeId[];
}

interface VoteContextType {
  votes: VotesState;
  selectedNominees: SelectedNomineesState;
  totalVotes: number;
  handleVoteChange: (categoryId: CategoryId, nomineeId: NomineeId, quantity: number) => void;
  resetVotes: () => void; // New reset function
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

export const VoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [votes, setVotes] = useState<VotesState>({});
  const [selectedNominees, setSelectedNominees] = useState<SelectedNomineesState>({});

  // Memoize total votes calculation
  const totalVotes = useMemo(() => {
    return Object.values(votes).reduce((sum, categoryVotes) => {
      return sum + Object.values(categoryVotes).reduce((catSum, vote) => catSum + vote, 0);
    }, 0);
  }, [votes]);

  const handleVoteChange = useCallback((categoryId: CategoryId, nomineeId: NomineeId, quantity: number) => {
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
  }, []);

  // New function to reset votes
  const resetVotes = useCallback(() => {
    setVotes({});
    setSelectedNominees({});
  }, []);

  const contextValue = useMemo(() => ({
    votes,
    selectedNominees,
    totalVotes,
    handleVoteChange,
    resetVotes
  }), [votes, selectedNominees, totalVotes, handleVoteChange, resetVotes]);

  return (
    <VoteContext.Provider value={contextValue}>
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