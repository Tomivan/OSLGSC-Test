import React from "react";

const VoteConfirmationModal = () => {
	return (
		<main className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center p-4">
			<div className="bg-[#CFCDCD] rounded-lg p-8 max-w-sm w-full relative">
				<button className="absolute top-4 right-4 w-8 h-8 border-[#343434] border-[0.6px] hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors duration-200">
					<svg
						className="w-5 h-5 text-[#343434]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
				<div className="text-center pt-4">
					<h2 className="text-black text-lg font-medium mb-8 mt-[10px] leading-relaxed">
						Are you sure you&apos;ve voted
						<br />
						for all your nominees?
					</h2>

					<div className="flex gap-4 justify-center">
						<button className="bg-[#3B8501] hover:bg-[#2d6801] text-white font-bold py-3 px-8 rounded transition-colors duration-200 min-w-[80px]">
							YES
						</button>
						<button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold py-3 px-8 rounded transition-colors duration-200 min-w-[80px]">
							NO
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default VoteConfirmationModal;
