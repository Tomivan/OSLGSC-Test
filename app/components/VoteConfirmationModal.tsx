"use client";

import React from "react";

type VoteConfirmationModalProps = {
	//   totalVotes: number;
	//   selectedNominees: Record<string, string>;
	onClose: () => void;
	onConfirm: () => void;
};

const VoteConfirmationModal = ({
	//   totalVotes,
	//   selectedNominees,
	onClose,
	onConfirm,
}: VoteConfirmationModalProps) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-[#CFCDCD] rounded-lg py-7 max-w-md w-full md:w-[350px] mx-4">
				<p className="text-sm md:text-[18.2px] text-center mb-[28px]">
					Are you sure you have voted <br /> for all your nominees?
				</p>

				<div className="flex justify-center space-x-4 mb-[10px] ">
					<button
						onClick={onConfirm}
						className="px-4 py-2 w-20 text-white rounded-md hover:bg-[#4f8823] bg-[#4c7d27]"
					>
						YES
					</button>
					<button
						onClick={onClose}
						className="px-4 py-2 w-20 bg-[#b10505] hover:bg-[#a63c3c] text-white rounded-md"
					>
						NO
					</button>
				</div>
			</div>
		</div>
	);
};

export default VoteConfirmationModal;
