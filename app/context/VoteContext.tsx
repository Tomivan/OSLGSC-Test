"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { db } from "../lib/firebase"; // Adjust path as needed
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";

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
  resetVotes: () => void;
  getVoteQuantity: (categoryId: CategoryId, nomineeId: NomineeId) => number;
  isNomineeSelected: (categoryId: CategoryId, nomineeId: NomineeId) => boolean;
  syncWithFirebase: () => Promise<void>; // New function to sync votes
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

export const VoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [votes, setVotes] = useState<VotesState>({});
  const [selectedNominees, setSelectedNominees] = useState<SelectedNomineesState>({});
  const [isSyncing, setIsSyncing] = useState(false);

  // Memoize total votes calculation
  const totalVotes = useMemo(() => {
    return Object.values(votes).reduce((sum, categoryVotes) => {
      return sum + Object.values(categoryVotes).reduce((catSum, vote) => catSum + vote, 0);
    }, 0);
  }, [votes]);

  // Helper function to get vote quantity
  const getVoteQuantity = useCallback((categoryId: CategoryId, nomineeId: NomineeId): number => {
    return votes[categoryId]?.[nomineeId] || 0;
  }, [votes]);

  // Helper function to check if nominee is selected
  const isNomineeSelected = useCallback((categoryId: CategoryId, nomineeId: NomineeId): boolean => {
    return selectedNominees[categoryId]?.includes(nomineeId) || false;
  }, [selectedNominees]);

  // Function to sync votes with Firebase
  const syncWithFirebase = useCallback(async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      // Get all vote changes that need to be synced
      const updates: Promise<void>[] = [];
      
      Object.entries(votes).forEach(([categoryId, categoryVotes]) => {
        Object.entries(categoryVotes).forEach(([nomineeId, voteCount]) => {
          if (voteCount > 0) {
            const nomineeRef = doc(db, "contestants", nomineeId);
            updates.push(
              updateDoc(nomineeRef, {
                votes: increment(voteCount)
              })
            );
          }
        });
      });

      await Promise.all(updates);
      console.log("✅ Votes synced with Firebase");
      
      // Reset local votes after successful sync
      setVotes({});
      setSelectedNominees({});
      
    } catch (error) {
      console.error("❌ Error syncing votes with Firebase:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [votes, isSyncing]);

  const handleVoteChange = useCallback((categoryId: CategoryId, nomineeId: NomineeId, quantity: number) => {
    console.log(`Vote change: ${categoryId}, ${nomineeId}, ${quantity}`);
    
    setVotes((prev) => {
      const newVotes = { ...prev };
      
      if (!newVotes[categoryId]) {
        newVotes[categoryId] = {};
      }
      
      if (quantity > 0) {
        newVotes[categoryId][nomineeId] = quantity;
      } else {
        // Remove the nominee if quantity is 0
        delete newVotes[categoryId][nomineeId];
        // If category is empty, remove it too
        if (Object.keys(newVotes[categoryId]).length === 0) {
          delete newVotes[categoryId];
        }
      }
      
      return newVotes;
    });

    // Auto-manage selection based on vote quantity
    setSelectedNominees((prev) => {
      const newSelected = { ...prev };
      
      if (quantity > 0) {
        // Add to selected if not already there
        if (!newSelected[categoryId]) {
          newSelected[categoryId] = [nomineeId];
        } else if (!newSelected[categoryId].includes(nomineeId)) {
          newSelected[categoryId] = [...newSelected[categoryId], nomineeId];
        }
      } else {
        // Remove from selected if quantity is 0
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
    resetVotes,
    getVoteQuantity,
    isNomineeSelected,
    syncWithFirebase
  }), [
    votes, 
    selectedNominees, 
    totalVotes, 
    handleVoteChange, 
    resetVotes,
    getVoteQuantity,
    isNomineeSelected,
    syncWithFirebase
  ]);

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