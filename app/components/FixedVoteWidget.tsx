"use client";

import React, { useState } from "react";
import { useVote } from "../context/VoteContext";
import VoteConfirmationModal from "./VoteConfirmationModal";
import NotVotedModal from "./NotVotedModal";
import { useRouter } from "next/navigation";

const FixedVoteWidget = () => {
  const { totalVotes } = useVote();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotVotedOpen, setIsNotVotedOpen] = useState(false);
  const router = useRouter();

  const handleVoteNow = () => {
    if (totalVotes === 0) {
      setIsNotVotedOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };
  const closeModal = () => setIsModalOpen(false);
  const closeNotVotedModal = () => setIsNotVotedOpen(false);

  const proceedToPayment = () => {
	router.push(`/voter-details?votes=${totalVotes}`);
	closeModal();
  };

  return (
    <>
	<div className="fixed bottom-0 left-0 right-0 z-50 bg-red shadow-lg bg-[#FAFAFA] border-t border-gray-200">
      <div className="max-w-md md:max-w-[1280px] mx-auto px-6 py-4">
        <div className="flex items-center w-fit mx-auto gap-[30px] md:gap-[63px] justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[#343434] text-[15px] md:text-[20px]">
              YOUR VOTE:
            </span>
            <span className="text-[#343434] font-bold text-xl">
              {totalVotes}
            </span>
          </div>

          <button
		  	onClick={handleVoteNow}
		   	className="bg-[#3B8501] hover:bg-[#2d6801] cursor-pointer text-white font-bold px-8 py-3 rounded-[10px] transition-colors duration-200 uppercase text-sm tracking-wide">
            VOTE NOW
          </button>
        </div>
      </div>

      <div className="bg-[#343434] text-white text-center pb-[12px] py-2 text-xs">
        Teepremium Agency © 2025
      </div>
    </div>
	  {isModalOpen && (
        <VoteConfirmationModal
          onClose={closeModal}
          onConfirm={proceedToPayment}
        />
      )}
      {isNotVotedOpen && (
        <NotVotedModal
          onClose={closeNotVotedModal}
        />
      )}
	</>
  );
};

export default FixedVoteWidget;