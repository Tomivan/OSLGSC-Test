"use client";

import React from "react";

interface FixedVoteWidgetProps {
	totalVotes: number;
	onVoteNow: () => void;
	isVisible: boolean;
}

const FixedVoteWidget: React.FC<FixedVoteWidgetProps> = (
	{
		// totalVotes,
		// onVoteNow,
		// isVisible,
	}
) => {
	// if (!isVisible || totalVotes === 0) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 bg-red shadow-lg bg-[#FAFAFA] border-t border-gray-200">
			<div className="max-w-md md:max-w-[1280px] mx-auto px-6 py-4">
				<div className="flex items-center w-fit mx-auto gap-[30px] md:gap-[63px] justify-between">
					<div className="flex items-center space-x-2">
						<span className="text-[#343434] text-[15px] md:text-[20px]">
							YOUR VOTE:
						</span>
						<span className="text-[#343434] font-bold text-xl">
							{/* totalVotes */} 20
						</span>
					</div>

					<button className="bg-[#3B8501] hover:bg-[#2d6801] cursor-pointer text-white font-bold px-8 py-3 rounded-[10px] transition-colors duration-200 uppercase text-sm tracking-wide">
						VOTE NOW
					</button>
				</div>
			</div>

			<div className="bg-[#343434] text-white text-center pb-[12px] py-2 text-xs">
				Teepremium Agency © 2025
			</div>
		</div>
	);
};

export default FixedVoteWidget;
