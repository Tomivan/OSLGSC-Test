"use client";

import React, { useState } from "react";
import Image from "next/image";
import minus from "../assets/minus.png";
import plus from "../assets/plus.png";
// import { useCategories, useNominees } from "../hooks/useFirebase";
// import { useVoteContext } from "../context/VoteContext";

interface NomineeCardProps {
	nominee: {
		id: string;
		name: string;
		image: string;
		voteCount: number;
	};
	voteQuantity: number;
	onVoteChange: (nomineeId: string, quantity: number) => void;
}

const NomineeCard: React.FC<NomineeCardProps> = ({
	nominee,
	voteQuantity,
	onVoteChange,
}) => {
	const handleIncrement = () => {
		onVoteChange(nominee.id, voteQuantity + 1);
	};

	const handleDecrement = () => {
		if (voteQuantity > 0) {
			onVoteChange(nominee.id, voteQuantity - 1);
		}
	};

	return (
		<div className="bg-white rounded-[8px] w-fit mx-auto 4 relative border border-[#CFCDCD]">
			<div className="absolute top-1.5 right-3 px-2 rounded text-[8px] text-black z-[900] font-semibold">
				{nominee.voteCount} VOTES
			</div>

			<div className="w-[234px] h-[205px] relative mb-3 rounded-t-[8px] overflow-hidden">
				<Image
					src={nominee.image}
					alt={nominee.name}
					fill
					className="object-cover"
				/>
			</div>

			<div className="text-center mb-3">
				<span className="text-black font-semibold text-sm">Name: </span>
				<span className="text-black text-sm">{nominee.name}</span>
			</div>

			<div className="flex items-center bg-[#E1E1E1] py-[12px] justify-center gap-4">
				<button
					onClick={handleDecrement}
					disabled={voteQuantity === 0}
					className="w-8 h-8 bg-[#CACACA] hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-black rounded flex items-center justify-center font-bold text-lg transition-colors duration-200"
				>
					<Image src={minus} alt="minus" className="" />
				</button>

				<span className="text-black font-bold text-2xl min-w-[3rem] text-center">
					{voteQuantity}
				</span>

				<button
					onClick={handleIncrement}
					className="w-8 h-8 bg-[#CACACA] hover:bg-gray-300 text-black rounded flex items-center justify-center font-bold text-lg transition-colors duration-200"
				>
					<Image src={plus} alt="plus" className="" />
				</button>
			</div>
		</div>
	);
};

const Categories = () => {
	// commented out Firebase logic
	// const { categories, loading: categoriesLoading } = useCategories();
	// const { nominees, loading: nomineesLoading } = useNominees(selectedCategory);
	// const { voteSelections, handleVoteChange } = useVoteContext();

	// mock data for UI
	const mockCategories = [
		{ id: "001", name: "People's Choice Award", isOpen: true },
		{ id: "002", name: "Hardwork Staff", isOpen: false },
		{ id: "003", name: "Punctual Staff", isOpen: false },
		{ id: "004", name: "Well Dressed", isOpen: false },
	];

	const mockNominees = [
		{
			id: "1",
			name: "Amara Johnson",
			image: "/image.png",
			voteCount: 1000,
		},
		{
			id: "2",
			name: "Kunle Ibilelu",
			image: "/image.png",
			voteCount: 900,
		},
		{
			id: "3",
			name: "Linda Kerry",
			image: "/image.png",
			voteCount: 1000,
		},
		{
			id: "4",
			name: "Kelvin Judus",
			image: "/image.png",
			voteCount: 1000,
		},
	];

	const [categoryStates, setCategoryStates] = useState(mockCategories);
	const [voteSelections, setVoteSelections] = useState<{
		[key: string]: number;
	}>({
		"1": 5,
		"2": 5,
		"3": 5,
		"4": 5,
	});

	const toggleCategory = (categoryId: string) => {
		setCategoryStates((prev) =>
			prev.map((cat) =>
				cat.id === categoryId ? { ...cat, isOpen: !cat.isOpen } : cat
			)
		);
	};

	const handleVoteChange = (nomineeId: string, quantity: number) => {
		setVoteSelections((prev) => ({
			...prev,
			[nomineeId]: quantity,
		}));
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

								{/* Category Content */}
								{category.isOpen && (
									<div className="px-4 pb-4">
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
											{mockNominees.map((nominee) => (
												<NomineeCard
													key={nominee.id}
													nominee={nominee}
													voteQuantity={
														voteSelections[
															nominee.id
														] || 0
													}
													onVoteChange={
														handleVoteChange
													}
												/>
											))}
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
