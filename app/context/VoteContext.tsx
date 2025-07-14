"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface VoteContextType {
	voteSelections: { [key: string]: number };
	setVoteSelections: React.Dispatch<
		React.SetStateAction<{ [key: string]: number }>
	>;
	getTotalVotes: () => number;
	getTotalAmount: () => number;
	handleVoteChange: (nomineeId: string, quantity: number) => void;
	clearVotes: () => void;
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

export const useVoteContext = () => {
	const context = useContext(VoteContext);
	if (context === undefined) {
		throw new Error("useVoteContext must be used within a VoteProvider");
	}
	return context;
};

interface VoteProviderProps {
	children: ReactNode;
}

export const VoteProvider: React.FC<VoteProviderProps> = ({ children }) => {
	const [voteSelections, setVoteSelections] = useState<{
		[key: string]: number;
	}>({});

	const getTotalVotes = () => {
		return Object.values(voteSelections).reduce(
			(sum, quantity) => sum + quantity,
			0
		);
	};

	const getTotalAmount = () => {
		return getTotalVotes() * 100;
	};

	const handleVoteChange = (nomineeId: string, quantity: number) => {
		setVoteSelections((prev) => ({
			...prev,
			[nomineeId]: quantity,
		}));
	};

	const clearVotes = () => {
		setVoteSelections({});
	};

	const value = {
		voteSelections,
		setVoteSelections,
		getTotalVotes,
		getTotalAmount,
		handleVoteChange,
		clearVotes,
	};

	return (
		<VoteContext.Provider value={value}>{children}</VoteContext.Provider>
	);
};
