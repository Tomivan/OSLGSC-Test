"use client";

import React from "react";
import Navbar from "./Navbar";
import VoteImage from "./VoteImage";
import Officials from "./Officials";
import VotingRules from "./VotingRules";
import HowToVote from "./HowToVote";
import FixedVoteWidget from "./FixedVoteWidget";
import TimerMobile from "./TimerMobile";
import Timer from "./Timer";
import Image from "next/image";
import Hero from "../assets/hero.svg";
import dynamic from "next/dynamic";
import OfficialsMobile from "./OfficialsMobile";

const Leaderboard = dynamic(() => import("./Leaderboard"), {
  loading: () => (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3B8501]"></div>
    </div>
  ),
  ssr: false
});

const Categories = dynamic(() => import("./Categories"), {
  loading: () => (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3B8501]"></div>
    </div>
  ),
  ssr: false
});

const Homepage = () => {
	return (
		<>
			<Navbar />
			<div className="flex justify-center">
				<div className="relative w-full">
					<div className="absolute hidden md:block inset-0 w-full h-[800px] md:h-[900px]">
						<Image
							src={Hero}
							alt="Desktop background"
							fill
							priority={true} 
							fetchPriority="high" 
							className="object-cover object-center"
							sizes="100vw"
							style={{ background: "#e5ffcc" }}
						/>
					</div>
					
					<div className="absolute md:hidden inset-0 w-full h-[478px] md:h-[900px]">
						<Image
							src={Hero}
							alt="Mobile background"
							fill
							priority={true} 
							fetchPriority="high" 
							className="object-cover object-center"
							sizes="100vw"
							style={{ background: "#e5ffcc" }}
						/>
					</div>
					
					<div className="w-full relative lg:max-w-[1280px] mx-auto">
						<div className="w-full mt-[170px] md:mt-[166px]">
							<div className="text-center">
								<h1 className="text text-[#3b8501] font-extrabold text-[45px] md:text-[67.45px] md:mb-[22.5px] tracking-0 md:leading-[82px] leading-[46px]">
									2026 Local
								</h1>
								<h2 className="font-extrabold text-[#3b8501] text-[45px] md:text-[67.45px] md:mb-[22.5px] tracking-0 md:leading-[82px] leading-[46px]">
									Government Service
								</h2>
								<h2 className="font-extrabold text-[#3b8501] text-[45px] md:text-[67.45px] md:mb-[22.5px] tracking-0 md:leading-[82px] leading-[46px]">
									 Week Award
								</h2>
							</div>
							<div className="hidden md:block mt-[5%]">
								<Timer />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="md:hidden block">
				<TimerMobile />
			</div>
			<VoteImage />
			<div className="hidden md:block mt-[5%]">
				<Officials />
			</div>
			<div className="md:hidden block">
				<OfficialsMobile />
			</div>
			<VotingRules />
			<HowToVote />
			<Leaderboard />
			<Categories />
			<FixedVoteWidget />

			<div className="h-24 md:h-28"></div>
		</>
	);
};

export default Homepage;