"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { db } from "../lib/firebase";
import { doc, increment, writeBatch } from "firebase/firestore";

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

interface SyncResult {
  success: boolean;
  error?: string;
  syncedVotes?: number;
  transactionId?: string;
}

interface VoteContextType {
  votes: VotesState;
  selectedNominees: SelectedNomineesState;
  totalVotes: number;
  isSyncing: boolean;
  handleVoteChange: (categoryId: CategoryId, nomineeId: NomineeId, quantity: number) => void;
  resetVotes: () => void;
  getVoteQuantity: (categoryId: CategoryId, nomineeId: NomineeId) => number;
  isNomineeSelected: (categoryId: CategoryId, nomineeId: NomineeId) => boolean;
  syncWithFirebase: () => Promise<SyncResult>;
  getVoteSummary: () => { [nomineeId: string]: number };
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

  // Get summary of all votes by nominee
  const getVoteSummary = useCallback(() => {
    const summary: { [nomineeId: string]: number } = {};
    
    Object.values(votes).forEach((categoryVotes) => {
      Object.entries(categoryVotes).forEach(([nomineeId, voteCount]) => {
        if (voteCount > 0) {
          summary[nomineeId] = (summary[nomineeId] || 0) + voteCount;
        }
      });
    });
    
    return summary;
  }, [votes]);

  // Enhanced function to sync votes with Firebase
 const syncWithFirebase = useCallback(async (): Promise<SyncResult> => {
  if (isSyncing) {
    return { 
      success: false, 
      error: "Sync already in progress. Please wait." 
    };
  }
  
  if (totalVotes === 0) {
    return { 
      success: false, 
      error: "No votes to sync. Please select some votes first." 
    };
  }

  setIsSyncing(true);
  
  try {
    const voteSummary = getVoteSummary();
    const nomineeIds = Object.keys(voteSummary);
    
    console.log("Total votes to sync:", totalVotes);
    
    if (nomineeIds.length === 0) {
      console.log("No nominee IDs found in vote summary");
      return { 
        success: false, 
        error: "No valid votes to sync" 
      };
    }

    const batch = writeBatch(db);
    let totalSyncedVotes = 0;

    // Verify each nominee document exists and log details
    for (const [nomineeId, voteCount] of Object.entries(voteSummary)) {
      if (voteCount > 0) {
        const nomineeRef = doc(db, "contestants", nomineeId);
        
        batch.update(nomineeRef, {
          votes: increment(voteCount),
          lastUpdated: new Date()
        });
        
        totalSyncedVotes += voteCount;
      }
    }

    console.log(`Committing batch with ${totalSyncedVotes} total votes...`);
    
    // Commit the batch
    await batch.commit();
    
    console.log(`Successfully synced ${totalSyncedVotes} votes`);

    const transactionId = `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Reset local votes after successful sync
    setVotes({});
    setSelectedNominees({});

    return {
      success: true,
      syncedVotes: totalSyncedVotes,
      transactionId
    };

  } catch (error: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
    console.error("Error details:", error);
    
    let errorMessage = "Failed to sync votes with database";
    
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          errorMessage = "Database permission denied. Please check Firestore security rules.";
          break;
        case 'unavailable':
          errorMessage = "Network error. Please check your internet connection.";
          break;
        case 'failed-precondition':
          errorMessage = "Document may not exist or is in an invalid state.";
          break;
        case 'not-found':
          errorMessage = "Contestant document not found. The ID may be incorrect.";
          break;
        default:
          errorMessage = `Database Error: ${error.code} - ${error.message}`;
      }
    }
    
    console.error("Final error message:", errorMessage);

    return {
      success: false,
      error: errorMessage
    };
  } finally {
    setIsSyncing(false);
  }
}, [votes, isSyncing, totalVotes, getVoteSummary]);

  const handleVoteChange = useCallback((categoryId: CategoryId, nomineeId: NomineeId, quantity: number) => {
    
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
    isSyncing,
    handleVoteChange,
    resetVotes,
    getVoteQuantity,
    isNomineeSelected,
    syncWithFirebase,
    getVoteSummary
  }), [
    votes, 
    selectedNominees, 
    totalVotes, 
    isSyncing,
    handleVoteChange, 
    resetVotes,
    getVoteQuantity,
    isNomineeSelected,
    syncWithFirebase,
    getVoteSummary
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