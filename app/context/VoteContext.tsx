"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from "react";
import { db } from "../lib/firebase";
import { doc, increment, writeBatch } from "firebase/firestore";
import io, { Socket } from "socket.io-client";

// Types
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

interface LiveVoteUpdate {
  nomineeId: string;
  increment: number;
  timestamp: number;
}

interface SyncResult {
  success: boolean;
  error?: string;
  syncedVotes?: number;
  transactionId?: string;
}

interface VoteContextType {
  // State
  votes: VotesState;
  selectedNominees: SelectedNomineesState;
  totalVotes: number;
  isSyncing: boolean;
  liveVotes: Record<string, number>;
  
  // Actions
  handleVoteChange: (categoryId: CategoryId, nomineeId: NomineeId, quantity: number) => void;
  resetVotes: () => void;
  syncWithFirebase: () => Promise<SyncResult>;
  getVoteQuantity: (categoryId: CategoryId, nomineeId: NomineeId) => number;
  isNomineeSelected: (categoryId: CategoryId, nomineeId: NomineeId) => boolean;
  getVoteSummary: () => Record<string, number>;
}

interface SocketContextType {
  isConnected: boolean;
  socketError: string | null;
  reconnect: () => void;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

// Create contexts
const VoteContext = createContext<VoteContextType | undefined>(undefined);
const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface VoteProviderProps {
  children: React.ReactNode;
  socketUrl?: string;
}

export const VoteProvider: React.FC<VoteProviderProps> = ({ 
  children, 
  socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL 
}) => {
  // Vote state
  const [votes, setVotes] = useState<VotesState>({});
  const [selectedNominees, setSelectedNominees] = useState<SelectedNomineesState>({});
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  // Socket state
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [liveVotes, setLiveVotes] = useState<Record<string, number>>({});
  
  // Refs
  const socketRef = useRef<Socket | null>(null);
  const pendingUpdatesRef = useRef<Record<string, number>>({});
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize total votes
  const totalVotes = useMemo<number>(() => {
    return Object.values(votes).reduce((sum, categoryVotes) => {
      return sum + Object.values(categoryVotes).reduce((catSum, vote) => catSum + vote, 0);
    }, 0);
  }, [votes]);

  // Socket connection
  useEffect(() => {
    if (!socketUrl) return;

    const socket = io(socketUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setSocketError(null);
      socket.emit('join-vote-room', { userId: getUserId() });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (error: Error) => {
      setSocketError(error.message);
    });

    socket.on('vote-update', (data: LiveVoteUpdate) => {
      setLiveVotes(prev => ({
        ...prev,
        [data.nomineeId]: (prev[data.nomineeId] || 0) + data.increment
      }));
    });

    socket.on('batch-vote-update', (updates: LiveVoteUpdate[]) => {
      setLiveVotes(prev => {
        const newLiveVotes = { ...prev };
        updates.forEach(({ nomineeId, increment }) => {
          newLiveVotes[nomineeId] = (newLiveVotes[nomineeId] || 0) + increment;
        });
        return newLiveVotes;
      });
    });

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      socket.disconnect();
    };
  }, [socketUrl]);

  // Get user ID
  const getUserId = useCallback((): string => {
    if (typeof window === 'undefined') return '';
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', userId);
    }
    return userId;
  }, []);

  // Queue socket updates
  const queueSocketUpdate = useCallback((nomineeId: string, incrementValue: number): void => {
    pendingUpdatesRef.current[nomineeId] = (pendingUpdatesRef.current[nomineeId] || 0) + incrementValue;

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      if (socketRef.current?.connected && Object.keys(pendingUpdatesRef.current).length > 0) {
        const updates = Object.entries(pendingUpdatesRef.current).map(([nomineeId, inc]) => ({
          nomineeId,
          increment: inc,
          timestamp: Date.now(),
        }));

        socketRef.current.emit('batch-vote-update', updates);
        pendingUpdatesRef.current = {};
      }
    }, 500);
  }, []);

  // Helper functions
  const getVoteQuantity = useCallback((categoryId: CategoryId, nomineeId: NomineeId): number => {
    return votes[categoryId]?.[nomineeId] || 0;
  }, [votes]);

  const isNomineeSelected = useCallback((categoryId: CategoryId, nomineeId: NomineeId): boolean => {
    return selectedNominees[categoryId]?.includes(nomineeId) || false;
  }, [selectedNominees]);

  const getVoteSummary = useCallback((): Record<string, number> => {
    const summary: Record<string, number> = {};
    Object.values(votes).forEach((categoryVotes) => {
      Object.entries(categoryVotes).forEach(([nomineeId, voteCount]) => {
        if (voteCount > 0) {
          summary[nomineeId] = (summary[nomineeId] || 0) + voteCount;
        }
      });
    });
    return summary;
  }, [votes]);

  // Handle vote changes
  const handleVoteChange = useCallback((
    categoryId: CategoryId, 
    nomineeId: NomineeId, 
    quantity: number
  ): void => {
    const currentQuantity = getVoteQuantity(categoryId, nomineeId);
    const difference = quantity - currentQuantity;
    
    setVotes((prev) => {
      const newVotes = { ...prev };
      
      if (!newVotes[categoryId]) {
        newVotes[categoryId] = {};
      }
      
      if (quantity > 0) {
        newVotes[categoryId][nomineeId] = quantity;
      } else {
        delete newVotes[categoryId][nomineeId];
        if (Object.keys(newVotes[categoryId]).length === 0) {
          delete newVotes[categoryId];
        }
      }
      
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

    if (difference !== 0 && socketRef.current?.connected) {
      queueSocketUpdate(nomineeId, difference);
    }
  }, [getVoteQuantity, queueSocketUpdate]);

  // Reset votes
  const resetVotes = useCallback((): void => {
    setVotes({});
    setSelectedNominees({});
    setLiveVotes({});
    pendingUpdatesRef.current = {};
  }, []);

  // Sync with Firebase
  const syncWithFirebase = useCallback(async (): Promise<SyncResult> => {
    if (isSyncing) {
      return { success: false, error: "Sync already in progress" };
    }
    
    if (totalVotes === 0) {
      return { success: false, error: "No votes to sync" };
    }

    setIsSyncing(true);
    
    try {
      const localSummary = getVoteSummary();
      const batch = writeBatch(db);
      
      // Combine local votes with live votes
      const allVotes = { ...localSummary };
      Object.entries(liveVotes).forEach(([nomineeId, count]) => {
        if (typeof count === 'number' && count > 0) {
          allVotes[nomineeId] = (allVotes[nomineeId] || 0) + count;
        }
      });

      let totalSyncedVotes = 0;
      Object.entries(allVotes).forEach(([nomineeId, count]) => {
        if (count > 0) {
          const nomineeRef = doc(db, "contestants", nomineeId);
          batch.update(nomineeRef, {
            votes: increment(count),
            lastUpdated: new Date()
          });
          totalSyncedVotes += count;
        }
      });

      await batch.commit();

      // Notify others
      if (socketRef.current?.connected) {
        socketRef.current.emit('votes-synced', {
          userId: getUserId(),
          timestamp: Date.now(),
          voteCount: totalVotes
        });
      }

      const transactionId = `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setVotes({});
      setSelectedNominees({});
      setLiveVotes({});
      pendingUpdatesRef.current = {};

      return { 
        success: true, 
        syncedVotes: totalSyncedVotes,
        transactionId 
      };
    } catch (error: any) {
      console.error("Sync error:", error);
      return { 
        success: false, 
        error: error?.message || "Failed to sync votes" 
      };
    } finally {
      setIsSyncing(false);
    }
  }, [votes, isSyncing, totalVotes, getVoteSummary, liveVotes, getUserId]);

  // Memoized vote context value
  const voteContextValue = useMemo<VoteContextType>(() => ({
    votes,
    selectedNominees,
    totalVotes,
    isSyncing,
    liveVotes,
    
    // Actions
    handleVoteChange,
    resetVotes,
    syncWithFirebase,
    getVoteQuantity,
    isNomineeSelected,
    getVoteSummary,
  }), [
    votes, 
    selectedNominees, 
    totalVotes, 
    isSyncing, 
    liveVotes,
    handleVoteChange, 
    resetVotes, 
    syncWithFirebase, 
    getVoteQuantity, 
    isNomineeSelected, 
    getVoteSummary
  ]);

  const socketContextValue = useMemo<SocketContextType>(() => ({
    isConnected,
    socketError,
    reconnect: () => socketRef.current?.connect(),
    emit: (event: string, data: any) => socketRef.current?.emit(event, data),
    on: (event: string, callback: (data: any) => void) => socketRef.current?.on(event, callback),
    off: (event: string, callback?: (data: any) => void) => socketRef.current?.off(event, callback),
  }), [isConnected, socketError]);

  return (
    <VoteContext.Provider value={voteContextValue}>
      <SocketContext.Provider value={socketContextValue}>
        {children}
      </SocketContext.Provider>
    </VoteContext.Provider>
  );
};

export const useVote = (): VoteContextType => {
  const context = useContext(VoteContext);
  if (!context) {
    throw new Error("useVote must be used within a VoteProvider");
  }
  return context;
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a VoteProvider");
  }
  return context;
};

export const useVoteWithSocket = () => {
  const vote = useVote();
  const socket = useSocket();
  return { ...vote, socket };
};