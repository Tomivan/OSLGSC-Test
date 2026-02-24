"use client";

import React from "react";
import Navbar from "./Navbar";
import VoteImage from "./VoteImage";
import Officials from "./Officials";
import VotingRules from "./VotingRules";
import HowToVote from "./HowToVote";
import Leaderboard from "./Leaderboard";
import Categories from "./Categories";
import FixedVoteWidget from "./FixedVoteWidget";
import TimerMobile from "./TimerMobile";
import Timer from "./Timer";
import Image from "next/image";
import Hero from "../assets/Hero.avif";
import HeroMobile from "../assets/Here_section_background_1.webp";

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
							style={{ backgroundBlendMode: "multiply" }}
						/>
					</div>
					
					<div className="absolute md:hidden inset-0 w-full h-[478px] md:h-[900px]">
						<Image
							src={HeroMobile}
							alt="Mobile background"
							fill
							priority={true} 
							fetchPriority="high" 
							className="object-cover object-center"
							sizes="100vw"
							style={{ backgroundBlendMode: "multiply" }}
						/>
					</div>
					
					<div className="w-full relative lg:max-w-[1280px] mx-auto">
						<div className="flex text-[#FAFAFA] justify-center items-center w-full mt-[170px] md:mt-[166px]">
							<div>
								<h1 className="font-bold text-[27.44px] text-center uppercase md:text-[42.1px] tracking-0 leading-[36px] md:leading-[60px]">
									Local Government <br /> Service
									week
								</h1>
								<h1 className="text text-center font-extrabold text-[45px] md:text-[67.45px] md:mb-[22.5px] tracking-0 md:leading-[82px] leading-[46px]">
									2025 AWARD
								</h1>
								<div className="hidden md:block">
									<Timer />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="md:hidden block">
				<TimerMobile />
			</div>
			<VoteImage />
			<Officials />
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