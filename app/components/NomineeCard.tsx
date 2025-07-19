"use client";

import React from "react";
import Image from "next/image";
import minus from "../assets/minus.png";
import plus from "../assets/plus.png";

interface NomineeCardProps {
  nominee: {
    id: string;
    name: string;
    image: string;
    voteCount: number;
  };
  voteQuantity: number;
  onVoteChange: (nomineeId: string, quantity: number) => void;
  isSelected: boolean;
  categoryId: string;
}

export const NomineeCard: React.FC<NomineeCardProps> = ({
  nominee,
  voteQuantity,
  onVoteChange,
  isSelected,
}) => {
  const handleIncrement = () => onVoteChange(nominee.id, voteQuantity + 1);
  const handleDecrement = () => onVoteChange(nominee.id, voteQuantity - 1);

  return (
    <div className={`bg-white rounded-[8px] w-fit mx-auto relative border ${isSelected ? "border-[#3B8501]" : "border-[#CFCDCD]"}`}>
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
          disabled={!isSelected}
          className="w-8 h-8 bg-[#CACACA] hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-black rounded flex items-center justify-center font-bold text-lg transition-colors duration-200"
        >
          <Image src={minus} alt="minus" className="" />
        </button>

        <span className="text-black font-bold text-2xl min-w-[3rem] text-center">
          {voteQuantity}
        </span>

        <button
          onClick={handleIncrement}
          className="w-8 h-8 bg-[#CACACA] hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-black rounded flex items-center justify-center font-bold text-lg transition-colors duration-200"
        >
          <Image src={plus} alt="plus" className="" />
        </button>
      </div>
    </div>
  );
};