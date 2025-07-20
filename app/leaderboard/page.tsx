"use client";

import React from "react";

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

	return (
		<main className="flex justify-center py-8">
			<div className="w-[90%] md:w-[700px] mx-auto max-d">
				<div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
					<div className="bg-[#3B8501] text-white text-center py-3">
						<h2 className="font-bold text-lg uppercase tracking-wide">
							REAL-TIME LEADERBOARD
						</h2>
					</div>
					<div className="bg-[#E4E4E4]">
						{leaderboardData.map((entry) => (
							<div
								key={entry.position}
								className="flex items-center justify-between md:px-[28px] px-4 py-3 border-b border-gray-200 last:border-b-0"
							>
								<span className="text-gray-700 font-medium">
									{entry.position}. {entry.name}
								</span>
								<span className="text-gray-700 font-medium">
									{entry.votes}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	);
};

export default Leaderboard;
