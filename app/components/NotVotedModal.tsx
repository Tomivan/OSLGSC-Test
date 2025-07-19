import React from "react";

type NotVotedProps = {
  onClose: () => void;
};

const NotVotedModal: React.FC<NotVotedProps> = ({ onClose }) => {
	return (
		<main className="fixed inset-0 z-100 min-h-screen bg-black bg-opacity-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg p-8 max-w-sm w-full relative">
				<button className="absolute top-4 right-4 w-8 h-8 border-[#343434] border-[0.6px] hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors duration-200">
					<svg
						className="w-5 h-5 text-[#343434]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						onClick={onClose}
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
						You haven&apos;t voted for anyone. Kindly vote for your
						nominee(s) to proceed
					</h2>

					<div className="flex justify-center">
						<button 
							onClick={onClose}
						    className="bg-[#3B8501] uppercase hover:bg-[#2d6801] text-white font-bold py-3 px-8 rounded transition-colors duration-200 min-w-[80px]">
							Take me back
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default NotVotedModal;
