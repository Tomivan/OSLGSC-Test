"use client";

import React from "react";
import Link from "next/link";

const Leaderboard = () => {
	// mock leaderboard data - 10
	const leaderboardData = [
		{ position: 1, name: "Amara Johnson", votes: 20 },
		{ position: 2, name: "Daniel Okafor", votes: 20 },
		{ position: 3, name: "Fatima Roberts", votes: 20 },
		{ position: 4, name: "Chinedu Blake", votes: 20 },
		{ position: 5, name: "Isabella Nwachukwu", votes: 20 },
		{ position: 6, name: "Tunde Adebayo", votes: 18 },
		{ position: 7, name: "Kemi Oladele", votes: 16 },
		{ position: 8, name: "Yemi Akinwande", votes: 15 },
		{ position: 9, name: "Sola Babatunde", votes: 12 },
		{ position: 10, name: "Kunle Ibrahim", votes: 10 },
	];

	const initialEntries = leaderboardData.slice(0, 5);

	return (
		<main className="flex justify-center py-8">
			<div className="w-[90%] md:w-[740px] mx-auto max-d">
				<div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
					<div className="bg-[#3B8501] text-white text-center py-3">
						<h2 className="font-bold text-lg uppercase tracking-wide">
							REAL-TIME LEADERBOARD
						</h2>
					</div>
					<div className="bg-[#E4E4E4] p-4">
						{initialEntries.map((entry) => (
							<div
								key={entry.position}
								className="flex items-center justify-between md:px-[28px] px-4 py-3 border-b border-gray-200 last:border-b-0"
							>
								<span className="text-gray-700">
									{entry.position}. {entry.name}
								</span>
								<span className="text-gray-700">
									{entry.votes}
								</span>
							</div>
						))}

						<Link
							href="/leaderboard"
							className="text-center bg-[#FAFAFA] rounded-lg p-2 h-8"
						>
							<button className="text-[#3B8501] font-medium hover:text-[#2d6801] w-[98%] transition-colors duration-200">
								View More
							</button>
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Leaderboard;
