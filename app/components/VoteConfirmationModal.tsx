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
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <p className="text-sm text-center mb-4">Are you sure you have voted <br /> for all your nominees?</p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 w-20 text-white rounded-md bg-[#3B8501]"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 w-20 bg-[#b10505] text-white rounded-md"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteConfirmationModal;