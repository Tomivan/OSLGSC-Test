"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import minus from "../assets/minus.png";
import plus from "../assets/plus.png";

interface NomineeCardProps {
  nominee: {
    id: string;
    name: string;
    image: string;
    voteCount: number;
    liveIncrement?: number;
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
  categoryId,
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
    <div
      className={`bg-white rounded-[8px] w-[271px] h-[380px] mx-auto relative border transition-all duration-200 ${
        isSelected ? "border-[#3B8501] shadow-md" : "border-[#CFCDCD] hover:border-gray-400"
      }`}
    >
      <div className="absolute top-1.5 right-3 px-2 py-1 rounded text-[8px] text-white bg-black bg-opacity-70 z-[10] font-semibold flex items-center gap-1">
        <span>{nominee.voteCount}</span>
      </div>
      
      <div className="w-[269px] h-[250px] relative mb-3 rounded-t-[8px] overflow-hidden">
        <Image
          src={"/image.png"}
          alt={nominee.name}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/image.png";
          }}
        />
      </div>
      
      <div className="text-center mb-3 px-2 h-[48px] flex justify-center items-center">
        <span className="text-black font-semibold text-sm">Name: </span>
        <Link 
          href={`/nominee/${nominee.id}?category=${categoryId}`}
          className="text-black text-sm break-words hover:text-[#3B8501] hover:underline transition-colors duration-200 ml-1 cursor-pointer"
        >
          {nominee.name}
        </Link>
      </div>
      
      <div className="flex items-center bg-[#E1E1E1] py-[12px] justify-center gap-4 rounded-b-[8px]">
        <button
          onClick={handleDecrement}
          disabled={voteQuantity === 0}
          className="w-8 h-8 bg-[#CACACA] hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-black rounded flex items-center justify-center font-bold text-lg transition-colors duration-200"
          aria-label="Decrease votes"
        >
          <Image src={minus} alt="Decrease votes" width={12} height={12} />
        </button>
        
        <div className="flex items-center gap-1 min-w-[3rem] justify-center">
          <span className="text-black font-bold text-2xl">
            {voteQuantity}
          </span>
        </div>
        
        <button
          onClick={handleIncrement}
          className="w-8 h-8 bg-[#CACACA] hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-black rounded flex items-center justify-center font-bold text-lg transition-colors duration-200"
          aria-label="Increase votes"
        >
          <Image src={plus} alt="Increase votes" width={12} height={12} />
        </button>
      </div>
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#3B8501] rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};