// TypeScript interfaces for the voting platform
export interface Category {
	id: string;
	name: string;
	description: string;
	isActive: boolean;
	createdAt: Date;
}

export interface Nominee {
	id: string;
	categoryId: string;
	name: string;
	image: string;
	description: string;
	voteCount: number;
	position?: string;
	createdAt: Date;
}

export interface Vote {
	id: string;
	categoryId: string;
	nomineeId: string;
	userId: string;
	quantity: number;
	amount: number;
	timestamp: Date;
	paymentReference: string;
	paymentStatus: "pending" | "completed" | "failed";
}

export interface VoteSelection {
	nomineeId: string;
	quantity: number;
}
